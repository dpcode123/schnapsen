/**
 * GAMEPLAY - Receive events from server
 * - session 
 * - bummerl
 * - deal
 * - move
 */
// ***************************************************************************

// Session starting
socket.on('sessionStarting', gameRoomId => {
    showElement(textAlert);
    textAlert.textContent = 'Waiting for other player...';
    textRoomId.textContent = `# ${gameRoomId}`;
});

// Session state update
socket.on('sessionStateUpdate', playSessionDTO => {
    if (playSessionDTO.status === 'started') {
        playSession = new PlaySession(playSessionDTO);
        textPlayerName.textContent = playSession.playerName;
        textOpponentName.textContent = playSession.opponentName;
    }
});

// Session - END
socket.on('sessionEnd', s => {
    showElement(textAlert);
    textAlert.textContent = 'Opponent left.';
});


// Bummerl start
socket.on('bummerlStart', bummerlDTO => {
    console.log('BUMMERL DTO:');
    console.log(bummerlDTO);
    bummerl = new Bummerl(bummerlDTO);
    setupGameScreenWaiting();
    updatePlayerAndOpponentGamePoints();
    updatePlayerAndOpponentBummerlDots();
    gameClient.canMakeMove = true;
});

// Bummerl state update
socket.on('bummerlStateUpdate', bummerlDTO => {
    bummerl = new Bummerl(bummerlDTO);
    updatePlayerAndOpponentGamePoints();
    updatePlayerAndOpponentBummerlDots();
    gameClient.canMakeMove = true;
});


// Deal state update
socket.on('dealStateUpdate', dealStateDTO => {
    updateClientGameState(dealStateDTO);
    updatePoints(deal.playerPoints);

    // refresh client background only if next play is responding
    if (dealStateDTO.leadOrResponse === false) {
        refreshPlayerOnTurnIndicator(deal.isThisPlayerOnTurn);
    }
    
    console.log('dealStateUpdate');

    updateMarriageIndicators(deal.cardsInHand, deal.marriagesInHand);
    updateExchangeTrumpButton(deal.cardsInHand, deal.trumpSuit);
    gameClient.canMakeMove = true;
});

// Deal state update - after trick
socket.on('dealStateUpdateAfterTrick', dealStateDTO => {
    toggleHideAllTricks();
    updateClientGameState(dealStateDTO);

    delay(1200).then(
        () => {
            refreshPlayerOnTurnIndicator(deal.isThisPlayerOnTurn);
            console.log('dealStateUpdateAfterTrick');

            updatePoints(deal.playerPoints);
            hideElement(cardPlayedByPlayer);
            hideElement(cardPlayedByOpponent);
            hideElements(forbiddenCardOverlay);
            updateAllCardsInHand(deal.cardsInHand);
            updateOpponentCards(deal.cardsInHand.length);
            updateCardsStackedInDeck(deal.deckSize);
            updatePlayerTricks(deal.playerWonCards); 
            updateOpponentTricks(deal.opponentWonCardsFirstTrick, deal.opponentTotalWonCardsNumber);
            updateMarriageIndicators(deal.cardsInHand, deal.marriagesInHand);
            updateExchangeTrumpButton(deal.cardsInHand, deal.trumpSuit);
            hideElement(marriagesCalledThisTrickByOpponent);
            gameClient.canMakeMove = true;
        }
    );
});

// Deal state update - after client refreshes/reloads
socket.on('dealStateUpdateAfterClientRefresh', dealStateDTO => {
    deal = new Deal(dealStateDTO);
    updateClientGameState(dealStateDTO);
    updateClientGameScreen();
});

// Deal state update - after exchanging trump
socket.on('dealStateUpdateAfterTrumpExchange', dealStateDTO => {
    updateClientGameState(dealStateDTO);
    
    delay(300).then(
        () => {
            putCardInElement(trumpCard, deal.trumpCard.name);
            updateAllCardsInHand(deal.cardsInHand);
            updateMarriageIndicators(deal.cardsInHand, deal.marriagesInHand);
            hideElement(marriagesCalledThisTrickByOpponent);
            updateExchangeTrumpButton(deal.cardsInHand, deal.trumpSuit);
            gameClient.canMakeMove = true;
        }
    );
});

// Deal state update - after closing deck
socket.on('dealStateUpdateAfterClosingDeck', dealStateDTO => {
    updateClientGameState(dealStateDTO);
    updateClientGameScreen();
    gameClient.canMakeMove = true;
});

// Deal over
socket.on('dealOverDTO', dealOverDTO => {
    // add points
    if (dealOverDTO.isWinner) {
        bummerl.gamePointsPlayer += dealOverDTO.gamePoints;
        textAlert.textContent = `You won! ( ${dealOverDTO.gamePoints} )`;
        updatePoints(dealOverDTO.playerPointsAtEndOfGame);
    } else {
        bummerl.gamePointsOpponent += dealOverDTO.gamePoints;
        textAlert.textContent = `You lost! ( ${dealOverDTO.gamePoints} )`;
    }
    showElement(textAlert);
    updatePlayerAndOpponentGamePoints();
});


// Deal status
socket.on('gameStart', dealStateDTO => {
    deal = new Deal(dealStateDTO);

    let delay_ms = 100;
    if (deal.num>1) {delay_ms = 2500;}

    delay(delay_ms).then(
        () => {
            
            // put trump card under the deck
            svg.removeChild(trumpCard);
            svg.appendChild(trumpCard);
            cardsInDeck.forEach(card => { svg.removeChild(card); });
            cardsInDeck.forEach(card => { svg.appendChild(card); });

            updateClientGameState(dealStateDTO);
            setupGameScreenStarted();
            updateAllCardsInHand(deal.cardsInHand);
            updateMarriageIndicators(deal.cardsInHand, deal.marriagesInHand);
            hideElement(marriagesCalledThisTrickByOpponent);
            updateExchangeTrumpButton(deal.cardsInHand, deal.trumpSuit);
            gameClient.canMakeMove = true;
        }
    );
    
    
});


/* // Player's move confirmation/validation from server
socket.on('moveValid', isMoveValid => {
}); */

// Player's move ERROR from server
socket.on('moveInvalidError', errorMsg => {
    console.log(errorMsg);
});


// Opponent's move
socket.on('opponentMove', opponentMoveDTO => {

    // hide random card in opponent's hand
    hideElement(opponentCardsInHand[getRandomInt(5)]);

    // display marriage points called by opponent
    if (opponentMoveDTO.marriagePoints > 0) {
        marriagesCalledThisTrickByOpponent.textContent = opponentMoveDTO.marriagePoints;
        showElement(marriagesCalledThisTrickByOpponent);
    }

    // throw card on the table 
    putCardInElement(cardPlayedByOpponent, opponentMoveDTO.cardName);
    showElement(cardPlayedByOpponent);

    // disable/overlay unavailable(forbidden) response cards
    if (opponentMoveDTO.validRespondingCards !== 'all') {
        disableForbiddenCards(deal.cardsInHand, opponentMoveDTO.validRespondingCards);
    }

    // player can make a move
    gameClient.canMakeMove = true;
    
});
