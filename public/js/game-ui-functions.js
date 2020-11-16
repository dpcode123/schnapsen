/** UI ELEMENTS ON THE GAME SCREEN
 * 
 * - Functions
 * - Event listeners
 */

// FUNCTIONS
// ********************************************************************************

// Puts card in element
function putCardInElement(cardElement, cardName){
    cardElement.setAttributeNS(null, 'data-card', cardName);
    cardElement.setAttributeNS(null, 'fill', `url(#${cardName})`);
}

// Removes card from element
function removeCardFromElement(cardElement){
    cardElement.setAttributeNS(null, 'data-card', 'none');
    cardElement.setAttributeNS(null, 'fill', 'none');
}

// Updates all cards in player's hand
function updateAllCardsInHand(cards){
    // remove all cards
    for(let i = 0; i < 5; i++){
        removeCardFromElement(cardsInHand[i]);
    }
    // put cards in places
    for(let i = 0; i < cards.length; i++){
        putCardInElement(cardsInHand[i], cards[i].name);
    }
}

// Updates all cards in opponent's hand
function updateOpponentCards(numberOfCardsInHand){
    // hide all cards(5)
    hideElements(opponentCardsInHand);

    // display all cards(max 5)
    for(let i = 0; i < numberOfCardsInHand; i++){
        showElement(opponentCardsInHand[i]);
    }
}

// Updates cards in tricks won by player
function updatePlayerTricks(cards){
    if(cards.length === 2){
        updatePlayerWonFirstTrick(cards);
    }
    else if(cards.length > 2){
        updatePlayerWonOtherTricks(cards);
    }
}
// Updates cards in tricks won by OPPONENT
function updateOpponentTricks(cardsInFirstTrick, totalNumberOfWonCards){
    if(totalNumberOfWonCards === 2){
        updateOpponentWonFirstTrick(cardsInFirstTrick);
    }
    else if(totalNumberOfWonCards > 2){
        updateOpponentWonOtherTricks(totalNumberOfWonCards);
    }
}


// Updates cards in tricks won by player - 1st trick
function updatePlayerWonFirstTrick(cards){
    for(let i=0; i<cards.length; i++){
        showElement(wonCardsFirstTrick[i]);

        // not toggled show all
        putCardInElement(wonCardsFirstTrick[i], cards[i]);

        // toggled show all
        putCardInElement(wonCardsAllTricksDisplayed[i], cards[i]);
    }
}
// Updates cards in tricks won by player - other tricks
function updatePlayerWonOtherTricks(cards){

    // toggled show all
    for(let i=0; i<cards.length; i++){
        putCardInElement(wonCardsAllTricksDisplayed[i], cards[i]);
    }
    
    let lengthWithoutFirstTrick = cards.length - 2;

    // not toggled show all
    for(let i=0; i<lengthWithoutFirstTrick; i++){
        showElement(wonCardsOtherTricksCardbacks[i]);
    }
}

// Updates cards in tricks won by OPPONENT - 1st trick
function updateOpponentWonFirstTrick(cards){
    for(let i=0; i<cards.length; i++){
        showElement(opponentWonCardsFirstTrick[i]);
        putCardInElement(opponentWonCardsFirstTrick[i], cards[i]);
    }
}
// Updates cards in tricks won by OPPONENT - other tricks
function updateOpponentWonOtherTricks(totalNumberOfWonCards){
    // remove first 2 cards(1st trick)
    let num = totalNumberOfWonCards - 2;
        
    for(let i=0; i<num; i++){
        showElement(opponentWonCardsOtherTricksCardbacks[i]);
    }
}

// Removes(hides) cards from deck stack (when players draw a card)
function updateCardsStackedInDeck(numberOfCardsInDeck){
    for(let i = 0; i<9; i++){
        if(i >= numberOfCardsInDeck){

            hideElement(cardsInDeck[i]);

            if(numberOfCardsInDeck === 0){
                hideElement(trumpCard);
            }
        }
    }
}



/**
 * Updates marriage indicators in hand
 * - for each marriage get position in hand (0-4) of Queen
 * - [Pos.in.hand] = [Pos. of marriage display]
 * @param {*} playerHand - cards in player's hand
 * @param {*} marriages - marriages in player's hand
 */
function updateMarriageIndicators(playerHand, marriages){

    // Clear display positions
    for(let i=0; i<4; i++){
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
function updatePoints(points){
    // update
    textPoints.textContent = points;
    // display
    if(points > 0){
        showElement(textPoints);
    }
}

// Update player's and opponent's game points (0->7+)
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
    for(let i = 0; i < playSession.bummerlsLostPlayer; i++){
        textBummerlsLostPlayer.textContent += '●';
    }
    // opponent
    for(let i = 0; i < playSession.bummerlsLostOpponent; i++){
        textBummerlsLostOpponent.textContent += '●';
    }
}

// Sets the indicator(background color) - that shows if player is on turn or not
function setPlayerOnTurnIndicator(isPlayerOnTurn){
    if(isPlayerOnTurn){
        playerOnTurnIndicator.setAttributeNS(null, 'fill', 'green');
    }
    else{
        playerOnTurnIndicator.setAttributeNS(null, 'fill', 'gray');
    }
}

// Sets the cards opacity - that shows if player is on turn or not
function setPlayerOnTurnCardsOpacity(isPlayerOnTurn){
    if(isPlayerOnTurn){
        cardsInHand.forEach(card => {
            card.style.opacity = 1;
            card.style.cursor = 'default';
        });
    }
    else{
        cardsInHand.forEach(card => {
            card.style.opacity = 0.95;
            card.style.cursor = 'default';
        });
    }
}

// Shows one GUI element
function showElement(element){
    element.setAttributeNS(null, 'visibility', 'visible');
}

// Shows an array of GUI elements
function showElements(elements){
    elements.forEach(element => {
        showElement(element);
    });
}

// Hides one GUI element
function hideElement(element){
    element.setAttributeNS(null, 'visibility', 'hidden');
}

// Hides an array of GUI element
function hideElements(elements){
    elements.forEach(element => {
        hideElement(element);
    });
}


// card hover functions
function cardHover(cardPlace){
    if(game.thisPlayerOnTurn){
        cardPlace.style.opacity = 0.9;
        cardPlace.style.cursor = 'grab';
    }    
}
function cardHoverOut(cardPlace){
    if(game.thisPlayerOnTurn){
        cardPlace.style.opacity = 1;
        cardPlace.style.cursor = 'default';
    }
}

// exchange trump card button - hover
function buttonHover(button){
    if(game.thisPlayerOnTurn){
        button.style.opacity = 1;
        button.style.cursor = 'grab';
    }    
}
function buttonHoverOut(button){
    if(game.thisPlayerOnTurn){
        button.style.opacity = 0.3;
        button.style.cursor = 'default';
    }    
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
    hideElement(uiMarriagePointsCalledOnCurrentMoveByOpponent);
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
    putCardInElement(trumpCard, game.trumpCard.name);
    showElement(trumpCard);
    showElements(cardsInDeck);
    showElement(textPlayerName);
    showElement(textOpponentName);
    showElement(textPlayerGamePoints);
    showElement(textOpponentGamePoints);

    refreshPlayerOnTurnIndicator(game.thisPlayerOnTurn);
}

// player on turn indicator: background color, cards opacity
function refreshPlayerOnTurnIndicator(isPlayerOnTurn) {
    setPlayerOnTurnIndicator(isPlayerOnTurn);
    setPlayerOnTurnCardsOpacity(isPlayerOnTurn);
}


function updateClientGameScreen() {

    if(game.deckClosed) {
        // put trump card on top of deck
        svg.removeChild(trumpCard);
        svg.appendChild(trumpCard);
        // put text alert on top
        svg.removeChild(textAlert);
        svg.appendChild(textAlert);
    }
    else{
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
    refreshPlayerOnTurnIndicator(game.thisPlayerOnTurn);

    // cards in player's hand
    updateAllCardsInHand(game.cardsInHand);
    showElements(cardsInHand);

    // cards in opponent's hand
    updateOpponentCards(game.cardsInHand.length);
    showElements(opponentCardsInHand);
    
    // game.trumpCard
    if(game.trumpCard && game.trumpCard !== 'none'){
        putCardInElement(trumpCard, game.trumpCard.name);
        showElement(trumpCard);
    }

    // game.trumpSuit (button for exchanging trump card with jack card)
    updateExchangeTrumpButton(game.cardsInHand, game.trumpSuit);

    // game.playerPoints
    updatePoints(game.playerPoints);

    // played lead card (current play is response)
    if(game.leadOrResponse === false){
        // player is on turn 
        if(game.thisPlayerOnTurn){
            putCardInElement(cardPlayedByOpponent, game.leadCardOnTable);
            showElement(cardPlayedByOpponent);
        }
        // opponent is on turn
        else{
            putCardInElement(cardPlayedByPlayer, game.leadCardOnTable);
            showElement(cardPlayedByPlayer);
        }
    }

    // game.marriagesInHand
    updateMarriageIndicators(game.cardsInHand, game.marriagesInHand);
    
    // cards in deck    
    updateCardsStackedInDeck(game.deckSize);
    showElements(cardsInDeck);

    // player tricks
    updatePlayerTricks(game.playerWonCards);

    // opponent tricks
    updateOpponentTricks(game.opponentWonCardsFirstTrick, game.opponentTotalWonCardsNumber);

    // player and opponent names
    showElement(textPlayerName);
    showElement(textOpponentName);

    // player and opponent game points (0-7+)
    showElement(textPlayerGamePoints);
    showElement(textOpponentGamePoints);

    // player points (0-66+)
    if(game.playerPoints > 0){showElement(textPoints);}

    updatePlayerAndOpponentBummerlDots();

}






// show all won tricks
function toggleShowAllTricks() {

    // hide default tricks display
    hideElements(wonCardsFirstTrick);
    hideElements(wonCardsOtherTricksCardbacks);
    
    // show all won cards
    for(let i=0; i<game.playerWonCards.length; i++) {
        showElement(wonCardsAllTricksDisplayed[i]);
    }

    showAllWonTricks = true;
    
    
}

// hide all won tricks
function toggleHideAllTricks() {
    
    if(showAllWonTricks){
        console.log('toggleHideAllTricks: ' + showAllWonTricks);

        hideAllTricks();

        delay(500).then(
            () => {
                showAllWonTricks = false;
            }
        );
    }
}


// hide all won tricks
function hideAllTricks() {

    // show default tricks display
    if(game.playerWonCards.length === 2) {
        showElements(wonCardsFirstTrick);
    }
    else if(game.playerWonCards.length > 2) {
        showElements(wonCardsFirstTrick);
        for(let i=0; i<(game.playerWonCards.length-2);i++){
            showElement(wonCardsOtherTricksCardbacks[i]);
        }
    }
    // hide all won cards
    hideElements(wonCardsAllTricksDisplayed);
    
}


// Shows trump card exchange button
function updateExchangeTrumpButton(playerHand, trumpSuit) {

    // if on turn and leading play and trump card not jack(already changed)
    if(game.thisPlayerOnTurn && 
        game.leadOrResponse && 
        game.trumpCard.tier !== "J" &&
        game.deckSize > 0){

            // jack-trump card name
            const jackTrumpCardName = `j-${trumpSuit}`;

            // Jack's position in hand (0-4)
            jackPositionInHand = playerHand.findIndex(card => card.name === jackTrumpCardName);

            if(jackPositionInHand !== -1){
                exchangeTrumpCardRect.setAttributeNS(null, 'x', parseInt((cardsInHand[jackPositionInHand].getAttribute('x')), 10)+32);
                exchangeTrumpCardRect.setAttributeNS(null, 'y', parseInt((cardsInHand[jackPositionInHand].getAttribute('y')), 10)-30);
                exchangeTrumpCardText.setAttributeNS(null, 'x', parseInt((cardsInHand[jackPositionInHand].getAttribute('x')), 10)+38);
                exchangeTrumpCardText.setAttributeNS(null, 'y', parseInt((cardsInHand[jackPositionInHand].getAttribute('y')), 10)+2);
                exchangeTrumpCardButton.setAttributeNS(null, 'visibility', 'visible');
            }
        
    }
    else{
        exchangeTrumpCardButton.setAttributeNS(null, 'visibility', 'hidden');
    }
    
}


// player plays a card (throws it in the middle of the table)
function throwCardOnTheTable(cardName){
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
function getCardPositionInHandByName(cardName, playerHand){
    let position = playerHand.findIndex(object => object.name === cardName);
    return position;
}


function disableForbiddenCards(cardsInHand, validRespondingCards) {

    // for each card in hand array, check if it's in valid responses array
    // if it is not, disable that card
    cardsInHand.forEach(cardInHand => {
        let cardAvailable = validRespondingCards.some(responseCard => responseCard.name === cardInHand.name);
        
        if(cardAvailable) {
            // card is valid; do nothing
        }
        else{
            let cardIndex = getCardPositionInHandByName(cardInHand.name, cardsInHand);
            showElement(forbiddenCardOverlay[cardIndex]);
        }
    });
}


// ADDING EVENT LISTENERS
// ********************************************************************************

// cards
for(let i = 0; i<5; i++){
    cardsInHand[i].addEventListener('mouseover', function () {cardHover(cardsInHand[i]);}, false);
    cardsInHand[i].addEventListener('mouseout',  function () {cardHoverOut(cardsInHand[i]);}, false);
    cardsInHand[i].addEventListener('click',     function () {movePlayCard(cardsInHand[i]);}, false);
}
/*
textPoints.addEventListener('mouseover', function () {toggleShowAllTricks();}, false);
textPoints.addEventListener('mouseout', function () {toggleHideAllTricks();}, false);
textPoints.style.cursor = 'grabbing';
*/
wonCardsFirstTrick.forEach(element => {
    element.addEventListener('mouseover', function () {toggleShowAllTricks();}, false);
});

wonCardsAllTricksDisplayed.forEach(element => {
    element.addEventListener('mouseout', function () {toggleHideAllTricks();}, false);
    element.addEventListener('mouseover', function () {toggleShowAllTricks();}, false);
});

exchangeTrumpCardButton.addEventListener('mouseover', function () {buttonHover(exchangeTrumpCardButton);}, false);
exchangeTrumpCardButton.addEventListener('mouseout', function () {buttonHoverOut(exchangeTrumpCardButton);}, false);
exchangeTrumpCardButton.addEventListener('click', function () {moveExchangeTrump();}, false);

// close deck
trumpCard.addEventListener('mouseover', function () {cardHover(trumpCard);}, false);
trumpCard.addEventListener('mouseout',  function () {cardHoverOut(trumpCard);}, false);
trumpCard.addEventListener('click', function () {moveCloseDeck();}, false);




// modal
let modal = document.querySelector('.modal');
let modalCloseButton = document.querySelector('.modal-close-button');
let modalExitGameButton = document.getElementById('modal-exit-game-btn');
let modalContinueGameButton = document.getElementById('modal-continue-game-btn');

exitButton.addEventListener('click', toggleModal);
exitButton.style.cursor = 'grab';

modalCloseButton.addEventListener('click', toggleModal);
window.addEventListener('click', windowOnClick);
modalContinueGameButton.addEventListener('click', toggleModal);

function toggleModal() {
    modal.classList.toggle('show-modal');
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}
