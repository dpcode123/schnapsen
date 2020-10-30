const { otherPlayer, 
    getPlayerIndexInRoomBySocketId 
} = require("../utils/util");
const { getCardByName } = require('../schnaps/cards');
const { 
    calculateTrickWinner,
    calculateTrickPoints,
    checkForMarriagesInHand,
    checkPlayedCardMarriagePoints,
    calculateValidRespondingCards,
} = require('../schnaps/schnaps');
const RoomStateDTO = require('../dto/RoomStateDTO');
const BummerlStateDTO =require('../dto/BummerlStateDTO');
const GameStateDTO = require('../dto/GameStateDTO');

const OpponentMoveDTO = require('../dto/OpponentMoveDTO');
const Trick = require('../model/Trick');


module.exports = function(io, socket) {

    // Validate move
    this.validateMove = (move) => {
        return true;
    }

    // Handle move - exchange trump
    this.handleMove_exchangeTrump = (move, playerIndex, playRoom) => {

        try {
            // jack-trump card name
            const jackTrumpCardName = `j-${playRoom.game.trumpSuit}`;
        
            // jack-trump card object
            const jackTrumpCard = getCardByName(jackTrumpCardName);
            
            // remove jack in trump suit from player's hand
            playRoom.game.removeCardFromHand(jackTrumpCardName, playerIndex);
        
            // push current trump card to player's hand
            playRoom.game.cardsInHand[playerIndex].push(playRoom.game.trumpCard);
        
            // set jack as trump card
            playRoom.game.trumpCard = jackTrumpCard;
        
            // sort cards in hands; check for marriages; update clients
            for(let i=0; i<2; i++){
                playRoom.game.sortCardsByPointsAndSuit(playRoom.game.cardsInHand[i]);
                playRoom.game.marriagesInHand[i] = checkForMarriagesInHand(playRoom.game.cardsInHand[i], playRoom.game.trumpSuit);
                io.to(playRoom.players[i].socketId).emit('gameStateUpdateAfterTrumpExchange', new GameStateDTO(playRoom.game, i));
            }
            
        } catch (error) {
            console.error(error);
        }
        
    }

    // Handle move - card
    this.handleMove_card = (move, playerIndex, playRoom) => {

        try {

            // check if move is valid
            // ...

            // if valid
            if(true){

                // Send move validation/confirmation to player
                io.to(playRoom.players[playerIndex].socketId).emit('moveValid', true);

                // create card object from cardName
                const card = getCardByName(move.cardName);

                // valid plays - all cards are valid for leading play
                //let validRespondingCards = playRoom.game.cardsInHand[otherPlayer(playerIndex)];
                let validRespondingCards = 'all';

                //  called marriage points
                let marriagePoints = 0;

                // is game over or it continues
                let gameContinues = true;
                let gameOver;

                // Move leading or responding
                let isMoveLeading;

                // trick winner index
                let trickWinnerIndex;

                // Move is leading (if move is lead, and lead buffer is empty)
                if(move.leadOrResponse && !playRoom.game.moveBuffer.leadMove){
                    isMoveLeading = true;
                }
                // Move is responding (if move is response, and response buffer is empty)
                else if(!move.leadOrResponse && !playRoom.game.moveBuffer.responseMove){
                    isMoveLeading = false;
                }


                // LEADING PLAY
                if(isMoveLeading){
                    // Add lead move to move buffer
                    playRoom.game.moveBuffer.leadMove = move;

                    // check for valid cards for next play(response)
                    validRespondingCards = calculateValidRespondingCards(
                            card, playRoom.game.cardsInHand[otherPlayer(playerIndex)],
                            playRoom.game.trumpSuit, playRoom.game.deckClosed);

                    // check for marriage points
                    marriagePoints = checkPlayedCardMarriagePoints(card, playRoom.game.marriagesInHand[playerIndex]);

                    if(marriagePoints > 0){
                        // add points to player
                        playRoom.game.addPointsToPlayer(playerIndex, marriagePoints); 

                        // check if game is over
                        const gameOverAfterMarriages = playRoom.game.gameOver(playerIndex);

                        if(gameOverAfterMarriages.isGameOver){
                            // ===> END GAME
                            gameContinues = false;
                            gameOver = gameOverAfterMarriages;
                        }
                        else{
                            // ===> GAME CONTINUES
                        }
                    }
                    else{
                        // ===> GAME CONTINUES
                    }

                }
                // RESPONDING PLAY
                else if(!isMoveLeading){
                    // Add response move to move buffer
                    playRoom.game.moveBuffer.responseMove = move;

                    // Calculate trick winner
                    let trickWinnerId = calculateTrickWinner(playRoom.game.trumpSuit, playRoom.game.moveBuffer.leadMove, playRoom.game.moveBuffer.responseMove);

                    // Calculate trick points
                    let trickPoints = calculateTrickPoints(playRoom.game.moveBuffer.leadMove, playRoom.game.moveBuffer.responseMove);

                    // Get trick winner index in room (0 or 1)
                    trickWinnerIndex = getPlayerIndexInRoomBySocketId(playRoom, trickWinnerId);

                    // Create trick object
                    let trick = new Trick(
                        playRoom.game.trickNum,
                        playRoom.game.moveBuffer.leadMove.socketId, playRoom.game.moveBuffer.responseMove.socketId,
                        playRoom.game.moveBuffer.leadMove.cardName, playRoom.game.moveBuffer.responseMove.cardName,
                        trickWinnerId, trickWinnerIndex, trickPoints
                    );

                    // save to last trick
                    playRoom.game.lastTrick = trick;

                    // add cards to winning player's tricks
                    playRoom.game.wonCards[trickWinnerIndex].push(playRoom.game.moveBuffer.leadMove.cardName);
                    playRoom.game.wonCards[trickWinnerIndex].push(playRoom.game.moveBuffer.responseMove.cardName);

                    // remove played cards from hands
                    playRoom.game.removeCardFromHand(playRoom.game.moveBuffer.leadMove.cardName, getPlayerIndexInRoomBySocketId(playRoom, playRoom.game.moveBuffer.leadMove.socketId));
                    playRoom.game.removeCardFromHand(playRoom.game.moveBuffer.responseMove.cardName, getPlayerIndexInRoomBySocketId(playRoom, playRoom.game.moveBuffer.responseMove.socketId));

                    // add points to trick winner
                    playRoom.game.addPointsToPlayer(trickWinnerIndex, trickPoints);

                    // check if game is over
                    const gameOverAfterTrick = playRoom.game.gameOver(trickWinnerIndex);

                    if(gameOverAfterTrick.isGameOver){
                        // ===> END GAME
                        gameContinues = false;
                        gameOver = gameOverAfterTrick;
                    }
                    else{
                        // if this is last trick and no player is out yet
                        if(trick.trickNum === 10){
                            // ===> END GAME
                            gameContinues = false;

                            // last trick's winner is game winner
                            const gameOverAfterLastTrick = playRoom.game.gameOverLastTrick(trickWinnerIndex);
                            gameOver = gameOverAfterLastTrick;
                        }
                        else{
                            // ===> GAME CONTINUES
                        }

                    }

                }

                // create opponent's move DTO
                let opponentMoveDTO = new OpponentMoveDTO(
                    move.moveType, move.trickNum, move.moveNum, 
                    move.cardName, marriagePoints, validRespondingCards);

                // send opponent's move to other player
                io.to(playRoom.players[otherPlayer(playerIndex)].socketId).emit('opponentMove', opponentMoveDTO);


                // GAME CONTINUES
                if(gameContinues){
                    // Increase move number
                    playRoom.game.increaseMoveNumber(); 

                    // change player on turn
                    playRoom.game.changePlayerOnTurn();

                    // change lead/response
                    playRoom.game.leadOrResponse = !playRoom.game.leadOrResponse;

                    // update clients
                    for(let i=0; i<2; i++){
                        io.to(playRoom.players[i].socketId).emit('gameStateUpdate', new GameStateDTO(playRoom.game, i));
                    }
                    
                    // if both players played card this turn
                    if(!isMoveLeading){
                        // start new trick
                        playRoom.game.startNextTrick(trickWinnerIndex);
                                                                
                        // deal 1 card to each player
                        playRoom.game.dealCardsToPlayers(trickWinnerIndex, 1);

                        // close deck if there are no cards left in it
                        if(playRoom.game.deck.length === 0){ playRoom.game.deckClosed = true; }

                        // sort cards in hands; check for marriages; update clients
                        for(let i=0; i<2; i++){
                            playRoom.game.sortCardsByPointsAndSuit(playRoom.game.cardsInHand[i]);
                            playRoom.game.marriagesInHand[i] = checkForMarriagesInHand(playRoom.game.cardsInHand[i], playRoom.game.trumpSuit);
                            io.to(playRoom.players[i].socketId).emit('gameStateUpdateAfterTrick', new GameStateDTO(playRoom.game, i));
                        }
                    }
                }
                // GAME IS OVER
                else{
                    // end game
                    playRoom.endGame(gameOver, io);
                    // start new game
                    playRoom.startGame();

                    // update clients
                    for(let i=0; i<2; i++){
                        io.to(playRoom.players[i].socketId).emit('sessionStateUpdate', new RoomStateDTO(playRoom, i));
                        io.to(playRoom.players[i].socketId).emit('bummerlStateUpdate', new BummerlStateDTO(playRoom.bummerl, i));
                        io.to(playRoom.players[i].socketId).emit('gameStart', new GameStateDTO(playRoom.game, i));
                    }
                }
                
            }
            else{
                // move not valid
            }      
                       
        } catch (error) {
            console.error(error);
        }

        
    }



}
