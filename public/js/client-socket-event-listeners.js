/**
 * GAMEPLAY - Receive events from server
 * - session 
 * - bummerl
 * - game
 * - move
 * 
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
    if(playSessionDTO.status === 'started'){
        playSession = new PlaySession(playSessionDTO);
        textPlayerName.textContent = playSession.playerName;
        textOpponentName.textContent = playSession.opponentName;
    }
});

// Session - END
socket.on('sessionEnd', s => {
    showElement(textAlert);
    textAlert.textContent = 'Opponent left the game.';
});


// Bummerl start
socket.on('bummerlStart', bummerlDTO => {
    bummerl = new Bummerl(bummerlDTO);
    setupGameScreenWaiting();
    updatePlayerAndOpponentGamePoints();
    updatePlayerAndOpponentBummerlDots();
});

// Bummerl state update
socket.on('bummerlStateUpdate', bummerlDTO => {
    bummerl = new Bummerl(bummerlDTO);
    updatePlayerAndOpponentGamePoints();
    updatePlayerAndOpponentBummerlDots();
});


// Game state update
socket.on('gameStateUpdate', gameStateDTO => {
    updateClientGameState(gameStateDTO);
    updatePoints(game.playerPoints);

    refreshPlayerOnTurnIndicator(game.thisPlayerOnTurn);
    updateMarriageIndicators(game.cardsInHand, game.marriagesInHand);
    updateExchangeTrumpButton(game.cardsInHand, game.trumpSuit);
});

// Game state update - after trick
socket.on('gameStateUpdateAfterTrick', gameStateDTO => {
    toggleHideAllTricks();
    updateClientGameState(gameStateDTO);

    delay(1200).then(
        () => {
            refreshPlayerOnTurnIndicator(game.thisPlayerOnTurn);
            updatePoints(game.playerPoints);
            hideElement(cardPlayedByPlayer);
            hideElement(cardPlayedByOpponent);
            hideElements(forbiddenCardOverlay);
            updateAllCardsInHand(game.cardsInHand);
            updateOpponentCards(game.cardsInHand.length);
            removeCardsStackedInDeck(game.deckSize);
            updatePlayerTricks(game.playerWonCards); 
            updateOpponentTricks(game.opponentWonCardsFirstTrick, game.opponentTotalWonCardsNumber);
            updateMarriageIndicators(game.cardsInHand, game.marriagesInHand);
            updateExchangeTrumpButton(game.cardsInHand, game.trumpSuit);
            //uiMarriagePointsCalledOnCurrentMoveByOpponent.setAttributeNS(null, 'visibility', 'hidden');
            hideElement(uiMarriagePointsCalledOnCurrentMoveByOpponent);
        }
    );
});

// Game state update - after client refreshes/reloads game page
socket.on('gameStateUpdateAfterClientRefresh', gameStateDTO => {
    game = new Game(gameStateDTO);
    updateClientGameState(gameStateDTO);
    updateClientGameScreen();
});

// Game state update - after exchanging trump
socket.on('gameStateUpdateAfterTrumpExchange', gameStateDTO => {
    updateClientGameState(gameStateDTO);
    
    delay(300).then(
        () => {
            putCardInElement(trumpCard, game.trumpCard.name);
            updateAllCardsInHand(game.cardsInHand);
            updateMarriageIndicators(game.cardsInHand, game.marriagesInHand);
            //uiMarriagePointsCalledOnCurrentMoveByOpponent.setAttributeNS(null, 'visibility', 'hidden');
            hideElement(uiMarriagePointsCalledOnCurrentMoveByOpponent);
            updateExchangeTrumpButton(game.cardsInHand, game.trumpSuit);
        }
    );
});

// Game over
socket.on('gameOverDTO', gameOverDTO => {
    // add game points
    if(gameOverDTO.isWinner){
        bummerl.gamePointsPlayer += gameOverDTO.gamePoints;
        textAlert.textContent = `You won! ( ${gameOverDTO.gamePoints} )`;
        updatePoints(gameOverDTO.playerPointsAtEndOfGame);
    }
    else{
        bummerl.gamePointsOpponent += gameOverDTO.gamePoints;
        textAlert.textContent = `You lost! ( ${gameOverDTO.gamePoints} )`;
    }
    showElement(textAlert);
    updatePlayerAndOpponentGamePoints();
});


// Game status
socket.on('gameStart', gameStateDTO => {
    game = new Game(gameStateDTO);

    let delay_ms = 100;
    if(game.num>1){delay_ms = 2500;}

    delay(delay_ms).then(
        () => {
            updateClientGameState(gameStateDTO);
            setupGameScreenStarted();
            updateAllCardsInHand(game.cardsInHand);
            updateMarriageIndicators(game.cardsInHand, game.marriagesInHand);
            //uiMarriagePointsCalledOnCurrentMoveByOpponent.setAttributeNS(null, 'visibility', 'hidden');
            hideElement(uiMarriagePointsCalledOnCurrentMoveByOpponent);
            updateExchangeTrumpButton(game.cardsInHand, game.trumpSuit);
        }
    );
    
    
});


// Player's move confirmation/validation from server
socket.on('moveValid', isMoveValid => {
});

// Player's move ERROR from server
socket.on('moveInvalidError', moveInvalidError => {
});


// Opponent's move
socket.on('opponentMove', opponentMoveDTO => {

    // hide random card in opponent's hand
    hideElement(opponentCardsInHand[getRandomInt(5)]);

    // display marriage points called by opponent
    if(opponentMoveDTO.marriagePoints > 0){
        uiMarriagePointsCalledOnCurrentMoveByOpponent.textContent = opponentMoveDTO.marriagePoints;
        //uiMarriagePointsCalledOnCurrentMoveByOpponent.setAttributeNS(null, 'visibility', 'visible');
        showElement(uiMarriagePointsCalledOnCurrentMoveByOpponent);
    }
    //else{uiMarriagePointsCalledOnCurrentMoveByOpponent.setAttributeNS(null, 'visibility', 'hidden');}

    // throw card on the table 
    putCardInElement(cardPlayedByOpponent, opponentMoveDTO.cardName);
    showElement(cardPlayedByOpponent);

    // disable/overlay unavailable(forbidden) response cards
    if(opponentMoveDTO.validRespondingCards !== 'all'){
        disableForbiddenCards(game.cardsInHand, opponentMoveDTO.validRespondingCards);
    }
    
});
