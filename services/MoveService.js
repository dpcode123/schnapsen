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
const GameOverDTO = require('../dto/GameOverDTO');
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
            // create card object from cardName
            card = getCardByName(move.cardName);

            // Add lead card to card buffer (if move is lead, and lead buffer is empty)
            if(move.leadOrResponse && !playRoom.game.moveBuffer.leadMove){
                playRoom.game.moveBuffer.leadMove = move;
            }
            // Add response card to card buffer (if move is response, and response buffer is empty)
            else if(!move.leadOrResponse && !playRoom.game.moveBuffer.responseMove){
                playRoom.game.moveBuffer.responseMove = move;
            }

            // Send move validation/confirmation to player
            io.to(playRoom.players[playerIndex].socketId).emit(
                'moveValid', true
            );

            // available cards
            let validRespondingCards;

            // if card/move is lead calculate valid responses
            if(playRoom.game.moveBuffer.leadMove && !playRoom.game.moveBuffer.responseMove){
                validRespondingCards = calculateValidRespondingCards(
                    card, playRoom.game.cardsInHand[otherPlayer(playerIndex)],
                    playRoom.game.trumpSuit, playRoom.game.deckClosed);
            }
            // if card/move is not lead, all cards in hand are valid
            else{
                validRespondingCards = playRoom.game.cardsInHand[otherPlayer(playerIndex)];
            }

            // create opponent's move DTO
            let opponentMoveDTO = new OpponentMoveDTO(
                move.moveType, move.trickNum, move.moveNum, 
                move.cardName, move.marriagePoints, validRespondingCards);

            // send opponent's move to other player
            io.to(playRoom.players[otherPlayer(playerIndex)].socketId).emit('opponentMove', opponentMoveDTO);


            // LEAD CARD
            if(playRoom.game.moveBuffer.leadMove && !playRoom.game.moveBuffer.responseMove){

                // add marriage points (as marriages can be called only on lead)
                let marriagePoints = checkPlayedCardMarriagePoints(card, playRoom.game.marriagesInHand[playerIndex]);
                if(marriagePoints > 0){ playRoom.game.addPointsToPlayer(playerIndex, marriagePoints); }

                // change player on turn; increase moveNum
                playRoom.game.changePlayerOnTurn();
                playRoom.game.increaseMoveNumber();

                // change lead/response
                playRoom.game.leadOrResponse = !playRoom.game.leadOrResponse;

                // update clients
                for(let i=0; i<2; i++){
                    io.to(playRoom.players[i].socketId).emit('gameStateUpdate', new GameStateDTO(playRoom.game, i));
                }
            }
            // RESPONSE CARD
            else if(playRoom.game.moveBuffer.leadMove && playRoom.game.moveBuffer.responseMove){

                // Increase move number
                playRoom.game.increaseMoveNumber();            

                // Calculate trick winner
                let trickWinnerId = calculateTrickWinner(playRoom.game.trumpSuit, playRoom.game.moveBuffer.leadMove, playRoom.game.moveBuffer.responseMove);
                console.log('trickWinnerId');
                console.log(trickWinnerId);

                // Calculate trick points
                let trickPoints = calculateTrickPoints(playRoom.game.moveBuffer.leadMove, playRoom.game.moveBuffer.responseMove);

                // Get trick winner index in room (0 or 1)
                let trickWinnerIndex = getPlayerIndexInRoomBySocketId(playRoom, trickWinnerId);
            
                
                console.log('trickWinnerIndex');
                console.log(trickWinnerIndex);

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

                // add points
                playRoom.game.addPointsToPlayer(trickWinnerIndex, trickPoints);

                // check if game is over
                let gameOver = playRoom.game.gameOver(trickWinnerIndex);

                if(gameOver.playerOut){
                    // add game points (1, 2 or 3) to winner
                    playRoom.bummerl.gamePoints[trickWinnerIndex] += gameOver.gamePoints;

                    // change game status
                    playRoom.game.status = 'finished';

                    // update game winner
                    io.to(playRoom.players[trickWinnerIndex].socketId).emit('gameOverDTO', new GameOverDTO(gameOver, true));

                    // update game loser
                    io.to(playRoom.players[otherPlayer(trickWinnerIndex)].socketId).emit('gameOverDTO', new GameOverDTO(gameOver, false));
                    
                    // check if bummerl is over(player has 7+ game points)
                    let bummerlOver  = playRoom.bummerl.bummerlOver(trickWinnerIndex);

                    if(bummerlOver){
                        // start next bummerl; update clients
                        playRoom.startBummerl();
                        //io.to(playRoom.room).emit('bummerlStart', playRoom.bummerl.status);
                        playRoom.bummerlsWon[trickWinnerIndex] = playRoom.bummerlsWon[trickWinnerIndex] + 1;
                    }

                    // start new game
                    playRoom.startGame();

                    // update clients
                    for(let i=0; i<2; i++){
                        io.to(playRoom.players[i].socketId).emit('sessionStateUpdate', new RoomStateDTO(playRoom, i));
                        io.to(playRoom.players[i].socketId).emit('bummerlStateUpdate', new BummerlStateDTO(playRoom.bummerl, i));
                        io.to(playRoom.players[i].socketId).emit('gameStart', new GameStateDTO(playRoom.game, i));
                        
                    }

                }
                else{
                    // if this is last trick and no player is out yet
                    if(trick.num === 10){
                        // to implement: last trick's winner is game winner
                    }
                    else{
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
            }            
        } catch (error) {
            console.error(error);
        }

        
    }



}
