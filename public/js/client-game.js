// update client game state
function updateClientGameState(gameStateDTO) {
    game.num = gameStateDTO.num;
    game.playerOnTurn = gameStateDTO.playerOnTurn;
    game.trumpCard = gameStateDTO.trumpCard;
    game.trumpSuit = gameStateDTO.trumpSuit;
    game.trickNum = gameStateDTO.trickNum;
    game.moveNum = gameStateDTO.moveNum;
    game.leadOrResponse = gameStateDTO.leadOrResponse;
    game.leadCardOnTable = gameStateDTO.leadCardOnTable;
    game.deckClosed = gameStateDTO.deckClosed;
    game.playerPoints = gameStateDTO.playerPoints;
    game.cardsInHand = gameStateDTO.cardsInHand;
    game.thisPlayerOnTurn = gameStateDTO.thisPlayerOnTurn;
    game.deckSize = gameStateDTO.deckSize;
    game.playerWonCards = gameStateDTO.playerWonCards;
    game.opponentWonCardsFirstTrick = gameStateDTO.opponentWonCardsFirstTrick;
    game.opponentTotalWonCardsNumber = gameStateDTO.opponentTotalWonCardsNumber;
    game.marriagesInHand = gameStateDTO.marriagesInHand;
}


// Move - play card
function movePlayCard(cardPlace) {

    // get card(name) from selected card place
    let cardName = cardPlace.getAttribute('data-card');

    if(game.thisPlayerOnTurn){
        // empty place in players hand
        emptyPlaceInHand(cardPlace);

        // update screen
        throwCardOnTheTable(cardName);
        
        // create PlayerMove object
        playerMove = new PlayerMove(room, userId, socket.id, game.moveNum, 'playCard', 
                                        game.trickNum, game.leadOrResponse, cardName);
        
        // send move to server
        sendMove(playerMove);

        // return opacity back to normal
        cardPlace.style.opacity = 1;

        // hide won tricks
        hideAllTricks();
    }
}

// Move - exchange trump card with jack
function moveExchangeTrump() {
    if(game.thisPlayerOnTurn){
        // create PlayerMove object
        playerMove = new PlayerMove(room, userId, socket.id, game.moveNum, 'exchangeTrump', 
                                        game.trickNum, game.leadOrResponse, null);

        // send move to server
        sendMove(playerMove);
    }
}

// Move - close deck
function moveCloseDeck() {
    if(game.thisPlayerOnTurn && !game.deckClosed && game.deckSize > 0){
        // create PlayerMove object
        playerMove = new PlayerMove(room, userId, socket.id, game.moveNum, 'closeDeck', 
                                        game.trickNum, game.leadOrResponse, null);

        // send move to server
        sendMove(playerMove);
    }
}

// empty card place
function emptyPlaceInHand(cardPlace) {
    cardPlace.setAttributeNS(null, 'data-card', 'none');
    cardPlace.setAttributeNS(null, 'fill', 'none');
}

// sends player move to server
function sendMove(playerMove) {
    socket.emit('clientMove', {socketJwt, playerMove});
}
