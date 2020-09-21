const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {
    userJoin,
    getUserById,
    userLeave,
    getUsersByRoom,
    getAllUsers,
    removeAllUsersFromRoom,
    getUserIndexInRoom,
} = require('./utils/users');
const { 
    calculateTrickWinner,
    calculateTrickPoints,
    checkForMarriagesInHand,
    checkPlayedCardMarriagePoints,
    calculateValidResponseCards,
} = require('./schnaps/schnaps');

const PlaySession = require('./model/PlaySession');
const PlaySessionDTO = require('./dto/PlaySessionDTO');
const playSessions = new Map();

const GameStateDTO = require('./dto/GameStateDTO');
const GameOverDTO = require('./dto/GameOverDTO');
const OpponentMoveDTO = require('./dto/OpponentMoveDTO');
const { otherPlayer, delay } = require('./utils/util');
const Trick = require('./model/Trick');
const { getCardByName } = require('./schnaps/cards');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// CONNECTION - Run when client connects
io.on('connection', socket => {
    try {
        socket.on('joinRoom', ({ username, room }) => {

            // if room is not full yet
            if(getUsersByRoom(room).length < 2){
    
                // add user to room
                const user = userJoin(socket.id, username, room);
                socket.join(room);
    
                // only one user in room
                if(getUsersByRoom(room).length === 1){
                    io.to(room).emit('sessionStarting', room);
                }
                // room is full (2 users)
                else if(getUsersByRoom(room).length === 2){
    
                    // if session with that key(room) doesnt exist, create it and add room users to playsession
                    if(!playSessions.has(room)){
                        playSessions.set(room, new PlaySession(room, getUsersByRoom(room)[0], getUsersByRoom(room)[1]));
                    }
    
                    let playSession = playSessions.get(room);
                    
                    // if session is not already started or finished
                    if(playSession.status === "starting"){
    
                        // change play session status
                        playSession.status = "started";

                        // update clients
                        for(let i=0; i<2; i++){
                            io.to(getUsersByRoom(room)[i].id).emit('sessionStateUpdate', new PlaySessionDTO(playSession, i));
                        }
                        
                        // start 1st bummerl; update clients
                        playSession.startBummerl();
                        io.to(room).emit('bummerlStart', playSession.bummerl.status);
    
                        // start 1st game
                        playSession.startGame();
    
                        // update clients
                        for(let i=0; i<2; i++){
                            io.to(getUsersByRoom(room)[i].id).emit('gameStart', new GameStateDTO(playSession.game, i));
                        }
                    }
                  }
                  
            }
            else{
                console.log("Room is full.");
            }
        });
    } catch (error) {
        console.error(error);
    }


    // CONNECTION - Runs when client disconnects
    socket.on('disconnect', () => {
        try {
            const user = userLeave(socket.id);

            if (user) {
                room = user.room;
                playSession = playSessions.get(room);

                if(playSession){
                    // finish play session
                    playSession.status = "finished";

                    // update users
                    io.to(room).emit('sessionEnd', playSession.status);
                    
                    // destroy play session
                    playSessions.delete(room);

                    // remove users from that room
                    removeAllUsersFromRoom(room);
                }
                
            }
            
        } catch (error) {
            console.error(error);
        }
    });


    // GAMEPLAY - listen for player moves from client
    socket.on('clientMove', move => {
        try {
            const user = getUserById(socket.id);

            if(user){
                room = user.room;
                playSession = playSessions.get(room);
    
                let card;
    
                // get user index in room (0 or 1)
                const playerIndex = getUsersByRoom(room).findIndex(user => user.id === move.playerId);
    
                // validate play - to implement: server side play validation to prevent cheating
                //(if move valid)
                if(true){
    
                    // create card object from cardName
                    if(move.moveType === "card"){ card = getCardByName(move.cardName) }
    
                    // Add lead card to card buffer (if move is lead, and lead buffer is empty)
                    if(move.leadOrResponse && !playSession.game.cardBuffer.lead){
                        playSession.game.cardBuffer.lead = move;
                    }
                    // Add response card to card buffer (if move is response, and response buffer is empty)
                    else if(!move.leadOrResponse && !playSession.game.cardBuffer.response){
                        playSession.game.cardBuffer.response = move;
                    }
    
                    // send move validation/confirmation to player
                    io.to(getUsersByRoom(room)[playerIndex].id).emit(
                        'moveValid', true
                    );
                    
                    // available cards
                    let validResponseCards;

                    // if card/move is lead calculate valid responses
                    if(playSession.game.cardBuffer.lead && !playSession.game.cardBuffer.response){
                        validResponseCards = calculateValidResponseCards(
                            card, playSession.game.cardsInHand[otherPlayer(playerIndex)],
                            playSession.game.trumpSuit, playSession.game.deckClosed);
                    }
                    // if card/move is not lead, all cards in hand are valid
                    else{
                        validResponseCards = playSession.game.cardsInHand[otherPlayer(playerIndex)];
                    }

                    // create opponent's move DTO
                    let opponentMoveDTO = new OpponentMoveDTO(
                        move.moveType, move.trickNum, move.moveNum, 
                        move.cardName, move.marriagePoints, validResponseCards);
    
                    // send opponent's move to other player
                    io.to(getUsersByRoom(room)[otherPlayer(playerIndex)].id).emit('opponentMove', opponentMoveDTO);
    
                    // LEAD CARD
                    if(playSession.game.cardBuffer.lead && !playSession.game.cardBuffer.response){
    
                        // add marriage points (as marriages can be called only on lead)
                        let marriagePoints = checkPlayedCardMarriagePoints(card, playSession.game.marriagesInHand[playerIndex]);
                        if(marriagePoints > 0){ playSession.game.addPointsToPlayer(playerIndex, marriagePoints); }
                        
                        console.log(marriagePoints);
    
                        // change player on turn; increase moveNum
                        playSession.game.changePlayerOnTurn();
                        playSession.game.increaseMoveNumber();
    
                        // change lead/response
                        playSession.game.leadOrResponse = !playSession.game.leadOrResponse;
    
                        // update clients
                        for(let i=0; i<2; i++){
                            io.to(getUsersByRoom(room)[i].id).emit('gameStateUpdate', new GameStateDTO(playSession.game, i));
                        }
                    }
                    // RESPONSE CARD
                    else if(playSession.game.cardBuffer.lead && playSession.game.cardBuffer.response){
    
                        // Increase move number
                        playSession.game.increaseMoveNumber();
    
                        // Calculate trick winner
                        let trickWinnerId = calculateTrickWinner(playSession.game, playSession.game.cardBuffer.lead, playSession.game.cardBuffer.response);
    
                        // Calculate trick points
                        let trickPoints = calculateTrickPoints(playSession.game.cardBuffer.lead, playSession.game.cardBuffer.response);
    
                        // Get trick winner index in room (0 or 1)
                        let trickWinnerIndex = getUserIndexInRoom(getUsersByRoom(room), trickWinnerId);
    
                        // Create trick object
                        let trick = new Trick(
                            playSession.game.trickNum,
                            playSession.game.cardBuffer.lead.playerId, playSession.game.cardBuffer.response.playerId,
                            playSession.game.cardBuffer.lead.cardName, playSession.game.cardBuffer.response.cardName,
                            trickWinnerId, trickWinnerIndex, trickPoints
                        );
    
                        // save to last trick
                        playSession.game.lastTrick = trick;
    
                        // add cards to winning player's tricks
                        playSession.game.wonCards[trickWinnerIndex].push(playSession.game.cardBuffer.lead.cardName);
                        playSession.game.wonCards[trickWinnerIndex].push(playSession.game.cardBuffer.response.cardName);
                        
                        // remove played cards from hands
                        playSession.game.removeCardFromHand(playSession.game.cardBuffer.lead.cardName, getUserIndexInRoom(getUsersByRoom(room), playSession.game.cardBuffer.lead.playerId));
                        playSession.game.removeCardFromHand(playSession.game.cardBuffer.response.cardName, getUserIndexInRoom(getUsersByRoom(room), playSession.game.cardBuffer.response.playerId));
    
                        // add points
                        playSession.game.addPointsToPlayer(trickWinnerIndex, trickPoints);

                        // check if game is over
                        let gameOver = playSession.game.gameOver(trickWinnerIndex);

                        if(gameOver.playerOut){
                            // add game points (1, 2 or 3) to winner
                            playSession.bummerl.gamePoints[trickWinnerIndex] += gameOver.gamePoints;

                            // change game status
                            playSession.game.status = "finished";

                            // update game winner
                            io.to(getUsersByRoom(room)[trickWinnerIndex].id).emit('gameOverDTO', new GameOverDTO(gameOver, true));

                            // update game loser
                            io.to(getUsersByRoom(room)[otherPlayer(trickWinnerIndex)].id).emit('gameOverDTO', new GameOverDTO(gameOver, false));
                            
                            // check if bummerl is over(player has 7+ game points)
                            let bummerlOver  = playSession.bummerl.bummerlOver(trickWinnerIndex);
                            console.log("bummerlOver");
                            console.log(bummerlOver);

                            if(bummerlOver){
                                // start next bummerl; update clients
                                playSession.startBummerl();
                                io.to(room).emit('bummerlStart', playSession.bummerl.status);
                            }

                            // start new game
                            playSession.startGame();

                            // update clients
                            for(let i=0; i<2; i++){
                                io.to(getUsersByRoom(room)[i].id).emit('gameStart', new GameStateDTO(playSession.game, i));
                            }

                        }
                        else{
                            // start new trick
                            playSession.game.startNextTrick(trickWinnerIndex);
                                                    
                            // deal 1 card to each player
                            playSession.game.dealCardsToPlayers(trickWinnerIndex, 1);

                            // close deck if there are no cards left in it
                            if(playSession.game.deck.length === 0){ playSession.game.deckClosed = true; }

                            // sort cards in hands; check for marriages; update clients
                            for(let i=0; i<2; i++){
                                playSession.game.sortCardsByPointsAndSuit(playSession.game.cardsInHand[i]);
                                playSession.game.marriagesInHand[i] = checkForMarriagesInHand(playSession.game.cardsInHand[i], playSession.game.trumpSuit);
                                io.to(getUsersByRoom(room)[i].id).emit('gameStateUpdateAfterTrick', new GameStateDTO(playSession.game, i));
                            }
                        }
    
                    }
                }
                // if move invalid
                else{
                    // send move error to player
                    io.to(getUsersByRoom(room)[playerIndex].id).emit(
                        'moveInvalidError', 'ERROR: Move is not valid!'
                    );
                }
            }
            
        } catch (error) {
            console.error(error);
        }
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
