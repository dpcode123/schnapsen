/** UI ELEMENTS ON THE GAME SCREEN
 * 
 * - Functions
 * - Add client event listeners
 */

// FUNCTIONS
// ********************************************************************************

// Puts card in element
function putCardInElement(cardElement, cardName) {
    cardElement.setAttributeNS(null, 'data-card', cardName);
    cardElement.setAttributeNS(null, 'fill', `url(#${cardName})`);
}

// Removes card from element
function removeCardFromElement(cardElement) {
    cardElement.setAttributeNS(null, 'data-card', 'none');
    cardElement.setAttributeNS(null, 'fill', 'none');
}

// Updates all cards in player's hand
function updateAllCardsInHand(cards) {

    // remove all cards
    for(let i = 0; i < 5; i++) {
        removeCardFromElement(cardsInHand[i]);
    }
    // put cards in places
    for(let i = 0; i < cards.length; i++) {
        putCardInElement(cardsInHand[i], cards[i].name);
    }
}

// Updates all cards in opponent's hand
function updateOpponentCards(numberOfCardsInHand) {

    // hide all cards(cardbacks)
    hideElements(opponentCardsInHand);

    // display all cards(cardbacks)
    for(let i = 0; i < numberOfCardsInHand; i++) {
        showElement(opponentCardsInHand[i]);
    }
}


// Updates cards in tricks won by player
function updatePlayerTricks(cards) {

    if (cards.length === 2) {
        updatePlayerWonFirstTrick(cards);
    } else if (cards.length > 2) {
        updatePlayerWonOtherTricks(cards);
    }
}

// Updates cards in tricks won by OPPONENT
function updateOpponentTricks(cardsInFirstTrick, totalNumberOfWonCards) {

    if (totalNumberOfWonCards === 2) {
        updateOpponentWonFirstTrick(cardsInFirstTrick);
    } else if (totalNumberOfWonCards > 2) {
        updateOpponentWonOtherTricks(totalNumberOfWonCards);
    }
}


// Updates cards in tricks won by player - 1st trick
function updatePlayerWonFirstTrick(cards) {
    for(let i=0; i<cards.length; i++) {
        showElement(wonCardsFirstTrick[i]);

        // not toggled show all
        putCardInElement(wonCardsFirstTrick[i], cards[i]);

        // toggled show all
        putCardInElement(wonCardsAllTricksDisplayed[i], cards[i]);
    }
}

// Updates cards in tricks won by player - other tricks
function updatePlayerWonOtherTricks(cards) {

    // toggled show all
    for(let i=0; i<cards.length; i++) {
        putCardInElement(wonCardsAllTricksDisplayed[i], cards[i]);
    }
    
    const lengthWithoutFirstTrick = cards.length - 2;

    // not toggled show all
    for(let i=0; i<lengthWithoutFirstTrick; i++) {
        showElement(wonCardsOtherTricksCardbacks[i]);
    }
}

// Updates cards in tricks won by OPPONENT - 1st trick
function updateOpponentWonFirstTrick(cards) {
    for(let i=0; i<cards.length; i++) {
        showElement(opponentWonCardsFirstTrick[i]);
        putCardInElement(opponentWonCardsFirstTrick[i], cards[i]);
    }
}
// Updates cards in tricks won by OPPONENT - other tricks
function updateOpponentWonOtherTricks(totalNumberOfWonCards) {
    // remove first 2 cards(1st trick)
    const num = totalNumberOfWonCards - 2;
        
    for(let i=0; i<num; i++) {
        showElement(opponentWonCardsOtherTricksCardbacks[i]);
    }
}

// Removes(hides) cards from deck stack (when players draw a card after trick)
function updateCardsStackedInDeck(numberOfCardsInDeck) {
    for(let i = 0; i<9; i++) {
        if (i >= numberOfCardsInDeck) {

            hideElement(cardsInDeck[i]);

            if (numberOfCardsInDeck === 0) {
                hideElement(trumpCard);
            }
        }
    }
}



/**
 * Updates marriage indicators in hand
 * - for each marriage get position in hand (0-4) of Queen
 * - [Pos.in.hand] = [Pos. of marriage display]
 * @param playerHand - cards in player's hand
 * @param marriages - marriages in player's hand
 */
function updateMarriageIndicators(playerHand, marriages) {

    // Clear display positions
    for(let i=0; i<4; i++) {
        marriagesIndicator[i].textContent = '';
    }

    marriages.forEach(m => {

        let position;

        switch (m.suit) {
            case 'herc':
                position = playerHand.findIndex(card => card.name === 'q-herc');

                    switch (position) {
                        case 0:
                            marriagesIndicator[0].textContent = m.points;
                            break;
                        case 1:
                            marriagesIndicator[1].textContent = m.points;
                            break;
                        case 2:
                            marriagesIndicator[2].textContent = m.points;
                            break;
                        case 3:
                            marriagesIndicator[3].textContent = m.points;
                            break;
                    
                        default:
                            break;
                    }       
                
                break;

            case 'karo':
                position = playerHand.findIndex(card => card.name === 'q-karo');
                
                    switch (position) {
                        case 0:
                            marriagesIndicator[0].textContent = m.points;
                            break;
                        case 1:
                            marriagesIndicator[1].textContent = m.points;
                            break;
                        case 2:
                            marriagesIndicator[2].textContent = m.points;
                            break;
                        case 3:
                            marriagesIndicator[3].textContent = m.points;
                            break;
                    
                        default:
                            break;
                    }       
                
                break;

            case 'pik':
                position = playerHand.findIndex(card => card.name === 'q-pik');
                
                    switch (position) {
                        case 0:
                            marriagesIndicator[0].textContent = m.points;
                            break;
                        case 1:
                            marriagesIndicator[1].textContent = m.points;
                            break;
                        case 2:
                            marriagesIndicator[2].textContent = m.points;
                            break;
                        case 3:
                            marriagesIndicator[3].textContent = m.points;
                            break;
                    
                        default:
                            break;
                    }       
                
                break;

            case'tref':
                position = playerHand.findIndex(card => card.name === 'q-tref');
                
                    switch (position) {
                        case 0:
                            marriagesIndicator[0].textContent = m.points;
                            break;
                        case 1:
                            marriagesIndicator[1].textContent = m.points;
                            break;
                        case 2:
                            marriagesIndicator[2].textContent = m.points;
                            break;
                        case 3:
                            marriagesIndicator[3].textContent = m.points;
                            break;
                    
                        default:
                            break;
                    }       
                
                break;

            default:
                break;
        }
    });
}



// Updates player's points (0->66+)
function updatePoints(points) {
    // update
    textPoints.textContent = points;
    // display
    if (points > 0) {
        showElement(textPoints);
    }
}

// Updates player's and opponent's deal points (0->7+)
function updatePlayerAndOpponentGamePoints() {
    textPlayerGamePoints.textContent = bummerl.gamePointsPlayer;
    textOpponentGamePoints.textContent = bummerl.gamePointsOpponent;
}

// update player's and opponent's bummerl dots ●
function updatePlayerAndOpponentBummerlDots() {

    // clear
    textBummerlsLostPlayer.textContent = '';
    textBummerlsLostOpponent.textContent = '';

    // player
    for(let i = 0; i < playSession.bummerlsLostPlayer; i++) {
        textBummerlsLostPlayer.textContent += '●';
    }
    // opponent
    for(let i = 0; i < playSession.bummerlsLostOpponent; i++) {
        textBummerlsLostOpponent.textContent += '●';
    }
}

// Sets the indicator(background color) - that shows if player is on turn or not
function setPlayerOnTurnIndicator(isPlayerOnTurn) {
    if (isPlayerOnTurn) {
        playerOnTurnIndicator.setAttributeNS(null, 'fill', PLAYER_BACKGROUND_COLOR_ACTIVE);
    } else {
        playerOnTurnIndicator.setAttributeNS(null, 'fill', PLAYER_BACKGROUND_COLOR_PASSIVE);
    }
}

// Sets the cards opacity - that shows if player is on turn or not
function setPlayerOnTurnCardsOpacity(isPlayerOnTurn) {
    if (isPlayerOnTurn) {
        cardsInHand.forEach(card => {
            card.style.opacity = 1;
            card.style.cursor = 'default';
        });
    } else {
        cardsInHand.forEach(card => {
            card.style.opacity = 0.95;
            card.style.cursor = 'default';
        });
    }
}

// Shows one GUI element
function showElement(element) {
    element.setAttributeNS(null, 'visibility', 'visible');
}

// Shows an array of GUI elements
function showElements(elements) {
    elements.forEach(element => {
        showElement(element);
    });
}

// Hides one GUI element
function hideElement(element) {
    element.setAttributeNS(null, 'visibility', 'hidden');
}

// Hides an array of GUI element
function hideElements(elements) {
    elements.forEach(element => {
        hideElement(element);
    });
}




function isPlayerAllowedToMakeMove(moveType) {
    let isMoveAllowed = false;

    switch (moveType) {
        case 'playCard':
            if (deal.isThisPlayerOnTurn === true && 
                gameClient.canMakeMove === true ) {
                    isMoveAllowed = true;
                }
            break;

        case 'closeDeck':
            if (deal.isThisPlayerOnTurn === true && 
                gameClient.canMakeMove === true && 
                deal.leadOrResponse === true && 
                deal.deckClosed === false &&
                deal.deckSize > 0) {
                    isMoveAllowed = true;
                }
            break;

        case 'exchangeTrump':
            if (deal.isThisPlayerOnTurn === true && 
                gameClient.canMakeMove === true && 
                deal.deckClosed === false) {
                    isMoveAllowed = true;
                }
            break;

        default:
            break;
    }

    return isMoveAllowed;
}


// cards in hand - hover/out functions
function cardHover(cardPlace) {
    const isMoveAllowed = isPlayerAllowedToMakeMove('playCard');

    if (isMoveAllowed) {
        cardPlace.style.opacity = 0.9;
        cardPlace.style.cursor = 'grab';
    } else {
        cardPlace.style.cursor = 'not-allowed';
    }
}
function cardHoverOut(cardPlace) {
    const isMoveAllowed = isPlayerAllowedToMakeMove('playCard');

    if (isMoveAllowed) {
        cardPlace.style.opacity = 1;
        cardPlace.style.cursor = 'default';
    }
}


// exchange trump card button - hover/out functions
function hoverExchangeTrump(button) {
    const isMoveAllowed = isPlayerAllowedToMakeMove('exchangeTrump');

    if (isMoveAllowed) {
        button.style.opacity = 1;
        button.style.cursor = 'grab';
    }
}
function hoverOutExchangeTrump(button) {
    const isMoveAllowed = isPlayerAllowedToMakeMove('exchangeTrump');

    if (isMoveAllowed) {
        button.style.opacity = 0.6;
        button.style.cursor = 'default';
    }    
}


// close deck by clicking on trump card - hover/out functions
function hoverCloseDeck(cardPlace) {
    const isMoveAllowed = isPlayerAllowedToMakeMove('closeDeck');

    if (isMoveAllowed) {
        cardPlace.style.opacity = 0.9;
        cardPlace.style.cursor = 'grab';
    } else {
        cardPlace.style.cursor = 'not-allowed';
    }
}
function hoverOutCloseDeck(cardPlace) {
    const isMoveAllowed = isPlayerAllowedToMakeMove('closeDeck');

    if (isMoveAllowed) {
        cardPlace.style.opacity = 1;
        cardPlace.style.cursor = 'default';
    }
}


// exchange trump card button - hover/out functions
function hoverForbiddenCardOverlay(cardOverlay) {
    cardOverlay.style.cursor = 'not-allowed';
}
function hoverOutForbiddenCardOverlay(cardOverlay) {
    cardOverlay.style.cursor = 'default';
}


function setupGameScreenWaiting() {
    showElement(textAlert);
}

function cleanupGameScreen() {
    hideElement(textAlert);
    hideElement(textRoomId);
    hideElement(cardPlayedByPlayer);
    hideElement(cardPlayedByOpponent);
    hideElement(trumpCard);
    hideElement(textPoints);
    hideElement(marriagesCalledThisTrickByOpponent);
    hideElements(forbiddenCardOverlay);
    hideElements(wonCardsFirstTrick);
    hideElements(wonCardsOtherTricksCardbacks);
    hideElements(wonCardsAllTricksDisplayed);
    hideElements(opponentWonCardsFirstTrick);
    hideElements(opponentWonCardsOtherTricksCardbacks);
}

function setupGameScreenStarted() {
    cleanupGameScreen();

    showElements(cardsInHand);
    showElements(opponentCardsInHand);
    putCardInElement(trumpCard, deal.trumpCard.name);
    showElement(trumpCard);
    showElements(cardsInDeck);
    showElement(textPlayerName);
    showElement(textOpponentName);
    showElement(textPlayerGamePoints);
    showElement(textOpponentGamePoints);

    refreshPlayerOnTurnIndicator(deal.isThisPlayerOnTurn);
}

// player on turn indicator: background color, cards opacity
function refreshPlayerOnTurnIndicator(isPlayerOnTurn) {
    setPlayerOnTurnIndicator(isPlayerOnTurn);
    setPlayerOnTurnCardsOpacity(isPlayerOnTurn);
}


function updateClientGameScreen() {

    if (deal.deckClosed) {
        // put trump card on top of deck
        svg.removeChild(trumpCard);
        svg.appendChild(trumpCard);
        // put text alert on top
        svg.removeChild(textAlert);
        svg.appendChild(textAlert);
    } else {
        // put trump card under the deck
        svg.removeChild(trumpCard);
        svg.appendChild(trumpCard);
        cardsInDeck.forEach(card => { svg.removeChild(card); });
        cardsInDeck.forEach(card => { svg.appendChild(card); });
        // put text alert on top
        svg.removeChild(textAlert);
        svg.appendChild(textAlert);
    }

    // clean up screen
    cleanupGameScreen();

    // player on turn indicator: background color, cards opacity
    refreshPlayerOnTurnIndicator(deal.isThisPlayerOnTurn);

    // cards in player's hand
    updateAllCardsInHand(deal.cardsInHand);
    showElements(cardsInHand);

    // cards in opponent's hand
    updateOpponentCards(deal.cardsInHand.length);
    showElements(opponentCardsInHand);
    
    // deal.trumpCard
    if (deal.trumpCard && deal.trumpCard !== 'none') {
        putCardInElement(trumpCard, deal.trumpCard.name);
        showElement(trumpCard);
    }

    // deal.trumpSuit (button for exchanging trump card with jack card)
    updateExchangeTrumpButton(deal.cardsInHand, deal.trumpSuit);

    // deal.playerPoints
    updatePoints(deal.playerPoints);

    // lead card is already played this turn (current play is response)
    if (deal.leadOrResponse === false) {
        if (deal.isThisPlayerOnTurn) {
            putCardInElement(cardPlayedByOpponent, deal.leadCardOnTable);
            showElement(cardPlayedByOpponent);
        } else {
            putCardInElement(cardPlayedByPlayer, deal.leadCardOnTable);
            showElement(cardPlayedByPlayer);
        }
    }

    // deal.marriagesInHand
    updateMarriageIndicators(deal.cardsInHand, deal.marriagesInHand);
    
    // cards in deck    
    updateCardsStackedInDeck(deal.deckSize);
    showElements(cardsInDeck);

    // player tricks
    updatePlayerTricks(deal.playerWonCards);

    // opponent tricks
    updateOpponentTricks(deal.opponentWonCardsFirstTrick, deal.opponentTotalWonCardsNumber);

    // player and opponent names
    showElement(textPlayerName);
    showElement(textOpponentName);

    // player and opponent deal points (0-7+)
    showElement(textPlayerGamePoints);
    showElement(textOpponentGamePoints);

    // player points (0-66+)
    if (deal.playerPoints > 0) {showElement(textPoints);}

    updatePlayerAndOpponentBummerlDots();

}

// show all won tricks
function toggleShowAllTricks() {

    // hide default tricks display
    hideElements(wonCardsFirstTrick);
    hideElements(wonCardsOtherTricksCardbacks);
    
    // show all won cards
    for(let i=0; i<deal.playerWonCards.length; i++) {
        showElement(wonCardsAllTricksDisplayed[i]);
    }

    gameClient.showAllWonTricks = true;
    
}

// hide all won tricks
function toggleHideAllTricks() {
    
    if (gameClient.showAllWonTricks) {
        hideAllTricks();

        delay(500).then(
            () => {
                gameClient.showAllWonTricks = false;
            }
        );
    }
}


// Hides all won tricks
function hideAllTricks() {

    // show default tricks display
    if (deal.playerWonCards.length === 2) {
        showElements(wonCardsFirstTrick);
    } else if (deal.playerWonCards.length > 2) {
        showElements(wonCardsFirstTrick);
        for(let i=0; i<(deal.playerWonCards.length-2);i++) {
            showElement(wonCardsOtherTricksCardbacks[i]);
        }
    }

    // hide all won cards
    hideElements(wonCardsAllTricksDisplayed);
}


// Shows trump card exchange button
function updateExchangeTrumpButton(playerHand, trumpSuit) {

    // if on turn and leading play and trump card not jack(already changed)
    if (deal.isThisPlayerOnTurn && 
        gameClient.canMakeMove && 
        deal.leadOrResponse && 
        deal.trumpCard !== undefined &&
        deal.trumpCard.tier !== "J" &&
        deal.deckSize > 0) {

            // jack-trump card name
            const jackTrumpCardName = `j-${trumpSuit}`;

            // Jack's position in hand (0-4)
            jackPositionInHand = playerHand.findIndex(card => card.name === jackTrumpCardName);

            if (jackPositionInHand !== -1) {
                exchangeTrumpCardRect.setAttributeNS(null, 'x', parseInt((cardsInHand[jackPositionInHand].getAttribute('x')), 10)+32);
                exchangeTrumpCardRect.setAttributeNS(null, 'y', parseInt((cardsInHand[jackPositionInHand].getAttribute('y')), 10)-30);
                exchangeTrumpCardText.setAttributeNS(null, 'x', parseInt((cardsInHand[jackPositionInHand].getAttribute('x')), 10)+38);
                exchangeTrumpCardText.setAttributeNS(null, 'y', parseInt((cardsInHand[jackPositionInHand].getAttribute('y')), 10)+2);
                exchangeTrumpCardButton.setAttributeNS(null, 'visibility', 'visible');
            }
        
    } else {
        exchangeTrumpCardButton.setAttributeNS(null, 'visibility', 'hidden');
    }
    
}


// player plays a card (throws it in the middle of the table)
function throwCardOnTheTable(cardName) {
    // update card image
    cardPlayedByPlayer.setAttributeNS(null, 'fill', `url(#${cardName})`);

    // display card
    showElement(cardPlayedByPlayer);
}

/**
 * Gets card's position in hand by card name
 * @param {*} cardName 
 * @param {*} playerHand 
 * @returns {number} position 0-4 
 */
function getCardPositionInHandByName(cardName, playerHand) {
    const position = playerHand.findIndex(object => object.name === cardName);
    return position;
}

// Draws overlay over cards that are not allowed for responding play this turn
function disableForbiddenCards(cardsInHand, validRespondingCards) {

    // for each card in hand array, check if it's in valid responses array
    // if it is not, disable that card
    cardsInHand.forEach(cardInHand => {
        const cardAvailable = validRespondingCards.some(responseCard => responseCard.name === cardInHand.name);
        
        if (cardAvailable) {
            // card is allowed for playing; do nothing
        } else {
            const cardIndex = getCardPositionInHandByName(cardInHand.name, cardsInHand);
            showElement(forbiddenCardOverlay[cardIndex]);
        }
    });
}


