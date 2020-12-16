// update client deal state
function updateClientGameState(dealStateDTO) {
    deal.num = dealStateDTO.num;
    deal.playerOnTurn = dealStateDTO.playerOnTurn;
    deal.trumpCard = dealStateDTO.trumpCard;
    deal.trumpSuit = dealStateDTO.trumpSuit;
    deal.trickNum = dealStateDTO.trickNum;
    deal.moveNum = dealStateDTO.moveNum;
    deal.leadOrResponse = dealStateDTO.leadOrResponse;
    deal.leadCardOnTable = dealStateDTO.leadCardOnTable;
    deal.deckClosed = dealStateDTO.deckClosed;
    deal.playerPoints = dealStateDTO.playerPoints;
    deal.cardsInHand = dealStateDTO.cardsInHand;
    deal.isThisPlayerOnTurn = dealStateDTO.isThisPlayerOnTurn;
    deal.deckSize = dealStateDTO.deckSize;
    deal.playerWonCards = dealStateDTO.playerWonCards;
    deal.opponentWonCardsFirstTrick = dealStateDTO.opponentWonCardsFirstTrick;
    deal.opponentTotalWonCardsNumber = dealStateDTO.opponentTotalWonCardsNumber;
    deal.marriagesInHand = dealStateDTO.marriagesInHand;
}

// Move - play card
function movePlayCard(cardPlace) {

    if (deal.isThisPlayerOnTurn && gameClient.canMakeMove) {
        // get card(name) from selected card place
        const cardName = cardPlace.getAttribute('data-card');

        // empty place in players hand
        emptyPlaceInHand(cardPlace);

        // update screen
        throwCardOnTheTable(cardName);
        
        // create PlayerMove object
        const playerMove = new PlayerMove(gameClient.room, gameClient.userId, socket.id, deal.moveNum, 'playCard', 
                                        deal.trickNum, deal.leadOrResponse, cardName);
        
        // change client state
        gameClient.canMakeMove = false;

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
    if (deal.isThisPlayerOnTurn && gameClient.canMakeMove) {
        // create PlayerMove object
        playerMove = new PlayerMove(gameClient.room, gameClient.userId, socket.id, deal.moveNum, 'exchangeTrump', 
                                        deal.trickNum, deal.leadOrResponse, null);

        // send move to server
        sendMove(playerMove);
    }
}

// Move - close deck
function moveCloseDeck() {
    if (isPlayerAllowedToMakeMove('closeDeck')) {
        // create player move object
        playerMove = new PlayerMove(gameClient.room, gameClient.userId, socket.id, 
                                    deal.moveNum, 'closeDeck', 
                                    deal.trickNum, deal.leadOrResponse, null);
        // send to server
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
    const socketJwt = gameClient.socketJwt;
    socket.emit('clientMove', {socketJwt, playerMove});
}
