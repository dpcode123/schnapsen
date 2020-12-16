/**
 * Client
 */
class GameClient {
    constructor(username, userId, room, socketJwt, cardFace, cardBack) {
        // constant properties
        this.username = username;
        this.userId = userId;
        this.room = room;
        this.socketJwt = socketJwt;
        this.cardFace = cardFace;
        this.cardBack = cardBack;

        // mutable properties
        this.canMakeMove = true;

        // UI states
        this.showAllWonTricks = false;
    }
}


/**
 * Play session (CLIENT SIDE)
 */
class PlaySession {
    constructor(playSessionDTO) {
        this.room = playSessionDTO.room;
        this.status = playSessionDTO.status;
        this.playerName = playSessionDTO.playerName;
        this.opponentName = playSessionDTO.opponentName;
        this.bummerlsLostPlayer = playSessionDTO.bummerlsLostPlayer;
        this.bummerlsLostOpponent = playSessionDTO.bummerlsLostOpponent;
    }
}


/**
 * Bummerl (CLIENT SIDE)
 */
class Bummerl {
    constructor(bummerlDTO) {
        this.num = bummerlDTO.num;
        this.status = bummerlDTO.status;
        this.gamePointsPlayer = bummerlDTO.gamePointsPlayer;
        this.gamePointsOpponent = bummerlDTO.gamePointsOpponent;
    }
}


/**
 * Deal (CLIENT SIDE)
 */
class Deal {
    constructor(dealStateDTO) {

        //  number in bummerl (1...13)
        this.num = dealStateDTO.num;

        // player on turn: 0/1
        this.playerOnTurn = dealStateDTO.playerOnTurn;

        // trump card
        this.trumpCard = dealStateDTO.trumpCard;

        // trump suit
        this.trumpSuit = dealStateDTO.trumpSuit;

        // trick number: 1-10
        this.trickNum = dealStateDTO.trickNum;

        // move number
        this.moveNum = dealStateDTO.moveNum;

        // Lead(true) or Response(false)
        this.leadOrResponse = dealStateDTO.leadOrResponse;

        // Lead card played (if current state is response, otherwise null)
        this.leadCardOnTable = dealStateDTO.leadCardOnTable;

        // deck closed or out of cards
        this.deckClosed = dealStateDTO.deckClosed;

        // points for player: 0-66
        this.playerPoints = dealStateDTO.playerPoints;

        // cards in player hands
        this.cardsInHand = dealStateDTO.cardsInHand;

        // is this player on turn or not
        this.isThisPlayerOnTurn = dealStateDTO.isThisPlayerOnTurn;

        // number of cards left in deck
        this.deckSize = dealStateDTO.deckSize;

        // won tricks(cards) by player
        this.playerWonCards = dealStateDTO.playerWonCards;

        // won 1st trick(2 cards) by opponent
        this.opponentWonCardsFirstTrick = dealStateDTO.opponentWonCardsFirstTrick;

        // total number of cards in opponent won tricks
        this.opponentTotalWonCardsNumber = dealStateDTO.opponentTotalWonCardsNumber;

        // marriages
        this.marriagesInHand = dealStateDTO.marriagesInHand;
    }
}


/**
 * PlayerMove (CLIENT SIDE)
 * @param {string} roomId - room id
 * @param {number} userId - user id (from db)
 * @param {string} socketId - socket.io id
 * @param {number} moveNum - total move number in , for both players (0,1,2...n)
 * @param {string} moveType - card, exchangeTrumpCard, closeDeck, foldHand
 * @param {number} trickNum - trick number, 1-10
 * @param {boolean} leadOrResponse - TRUE-lead play(1st card played in trick), FALSE-response play(2nd card)
 * @param {string} cardName - card played(card name: 'a-karo','j-pik') - only for moveType 'playCard'
 * */
class PlayerMove {
    constructor(roomId, userId, socketId, moveNum, moveType, trickNum, leadOrResponse, cardName) {
        this.roomId = roomId;
        this.userId = userId;
        this.socketId = socketId;
        this.moveNum = moveNum;
        this.moveType = moveType;
        this.trickNum = trickNum;
        this.leadOrResponse = leadOrResponse;
        this.cardName = cardName;
    }
}
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



// Socket.IO client library
const socket = io();

// Schnaps client
const gameClient = new GameClient(
    passedUsername, 
    passedUserId, 
    passedRoom, 
    passedSocketJwt,
    passedUserCardFace,
    passedUserCardBack);

// Session, Bummerl, Deal objects
let playSession;
let bummerl;
let deal;

// Initialize socket.io connection
socket.emit('init', gameClient.socketJwt);

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

// Delay in miliseconds
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns random int in range 0 to n-1
// input (3) -> expected output 0, 1 or 2
function getRandomInt(n) {
    return Math.floor(Math.random() * Math.floor(n));
}

/** UI ELEMENTS ON THE GAME SCREEN
 * 
 * - Main svg element
 * - Constants - namespace, positions, sizes
 * - Cards, Card patterns
 * - Gui element constants and variables
 * - Create SVG elements and style them
 * - Add all elements to array 
 * - Append elements to screen
 */

// MAIN SVG ELEMENT
// ********************************************************************************

// main svg element
const svg = document.getElementById('svg-content');


// CONSTANTS - Namespace, positions, sizes, colors
// ********************************************************************************

// XML namespace
const XMLNS = 'http://www.w3.org/2000/svg';

// card design
const CARD_WIDTH = 144;
const CARD_HEIGHT = 216;
const CARD_ROUND = 10;
const CARD_STROKE_WIDTH = 1;
const CARD_STROKE_OPACITY = 0;

// cards positioning
const PLAYER_CARDS_Y_POSITION = 320;
const OPPONENT_CARDS_Y_POSITION = -160;

// deck positioning
const DECK_CARDS_X_POSITION = 680;
const DECK_CARDS_Y_POSITION = 80;

// trump card positioning
const TRUMP_CARD_X_POSITION = -260;
const TRUMP_CARD_Y_POSITION = 560;

// won tricks positioning - player
const PLAYER_WON_TRICK_CARDS_HIDDEN_X_POSITION = 997;
const PLAYER_WON_TRICK_CARDS_HIDDEN_Y_POSITION = -500;
const PLAYER_WON_TRICK_CARDS_SHOW_ALL_Y_POSITION = 280;

// won tricks positioning - opponent
const OPPONENT_WON_TRICK_CARDS_HIDDEN_X_POSITION = -60;
const OPPONENT_WON_TRICK_CARDS_HIDDEN_Y_POSITION = -1065;

// marriages in hand indicators
const MARRIAGES_0_X_POSITION = 130;
const MARRIAGES_X_DISTANCE_TO_NEXT = 144;
const MARRIAGES_Y_POSITION = 320;
const MARRIAGES_FONT_SIZE = '24px';
const MARRIAGES_FONT_COLOR = '#52514e';

// player name; gamepoints(0-7)
const PLAYER_NAME_AND_POINTS_FONT_SIZE = '28px';

// card designs
const PREFERRED_CARD_FACE = gameClient.cardFace;
const PREFERRED_CARD_BACK = gameClient.cardBack;

// card image folders
const CARD_FACE_IMG_FOLDER = `../img/cards/face/${PREFERRED_CARD_FACE}`;
const CARD_BACK_IMG_FOLDER = `../img/cards/back/${PREFERRED_CARD_BACK}`;

// colors
const PLAYER_BACKGROUND_COLOR_ACTIVE = '#97c39d';
const PLAYER_BACKGROUND_COLOR_PASSIVE = '#b0bdbd';

// CARD PATTERNS
// ********************************************************************************

// card suits and tiers
const cardSuits = ['herc', 'karo', 'pik', 'tref'];
const cardTiers = ['j', 'q', 'k', 'x', 'a'];

// strings of all cards in '{tier}-{suit}' format, and cardback pattern
const cardPatterns = [];

// add all card pattern names to array
cardSuits.forEach(suit => {
    cardTiers.forEach(tier => {
        cardPatterns.push(tier + '-' + suit);
    });  
});

// add cardback pattern name to array
//cardPatterns.push('cardback');

// card pattern - defs
const defs = document.getElementById('defs');

// patterns - card face
cardPatterns.forEach(card => {
    const pattern = document.createElementNS(XMLNS, 'pattern');
    const image = document.createElementNS(XMLNS, 'image');

    pattern.setAttributeNS(null, 'id', card);
    pattern.setAttributeNS(null, 'patternUnits', 'objectBoundingBox');
    pattern.setAttributeNS(null, 'width', 1);
    pattern.setAttributeNS(null, 'height', 1);

    image.setAttributeNS(null, 'href', `${CARD_FACE_IMG_FOLDER}/${card}.png`);
    image.setAttributeNS(null, 'x', 0);
    image.setAttributeNS(null, 'y', 0);
    image.setAttributeNS(null, 'width', CARD_WIDTH);
    image.setAttributeNS(null, 'height', CARD_HEIGHT);

    pattern.appendChild(image);
    defs.appendChild(pattern);
});

// pattern - card back
const cardBackPattern = document.createElementNS(XMLNS, 'pattern');
const cardBackimage = document.createElementNS(XMLNS, 'image');

cardBackPattern.setAttributeNS(null, 'id', 'cardback');
cardBackPattern.setAttributeNS(null, 'patternUnits', 'objectBoundingBox');
cardBackPattern.setAttributeNS(null, 'width', 1);
cardBackPattern.setAttributeNS(null, 'height', 1);

cardBackimage.setAttributeNS(null, 'href', `${CARD_BACK_IMG_FOLDER}/cardback.png`);
cardBackimage.setAttributeNS(null, 'x', 0);
cardBackimage.setAttributeNS(null, 'y', 0);
cardBackimage.setAttributeNS(null, 'width', CARD_WIDTH);
cardBackimage.setAttributeNS(null, 'height', CARD_HEIGHT);

cardBackPattern.appendChild(cardBackimage);
defs.appendChild(cardBackPattern);



// GUI ELEMENT CONSTANTS AND VARIABLES
// ********************************************************************************

// GUI variables
// ********************************************************************************
let clientGUI_cardPlayedByOpponent;
let clientGUI_cardPlayedByPlayer;
let clientGUI_cardsInDeck;
let clientGUI_cardsInHand;
let clientGUI_exchangeTrumpCardButton;
let clientGUI_exitButton;
let clientGUI_forbiddenCardOverlay;
let clientGUI_marriagesCalledThisTrickByOpponent;
let clientGUI_marriagesIndicator;
let clientGUI_opponentCardsInHand;
let clientGUI_opponentWonCardsFirstTrick;
let clientGUI_opponentWonCardsOtherTricksCardbacks;
let clientGUI_playerOnTurnIndicator;
let clientGUI_textAlert;
let clientGUI_textBummerlsLostOpponent;
let clientGUI_textBummerlsLostPlayer;
let clientGUI_textOpponentGamePoints;
let clientGUI_textOpponentName;
let clientGUI_textPlayerGamePoints;
let clientGUI_textPlayerName;
let clientGUI_textRoomId;
let clientGUI_trumpCard;
let clientGUI_wonCardsAllTricksDisplayed;
let clientGUI_wonCardsFirstTrick;
let clientGUI_wonCardsOtherTricksCardbacks;

// All elements
const ALL_GUI_ELEMENTS = [];


// Player active (background color)
let playerOnTurnIndicator;

// Player cards, Opponent cards
const cardsInHand = [];
const opponentCardsInHand = [];

// Card on the table - played by Player, Opponent
let cardPlayedByPlayer;
let cardPlayedByOpponent;

// Marriage points (20 or 40) called on current move - by Opponent
let marriagesCalledThisTrickByOpponent;

// Trump card under the deck
let trumpCard;

// Deck - max 9 cards in deck
const cardsInDeck = [];

// Player tricks
// - 1st won trick(2 cards), always shown
// - other won tricks (max. 7 tricks/14 cards), hidden
// - all won tricks, when 'show all' is toggled
const wonCardsFirstTrick = [];
const wonCardsOtherTricksCardbacks = [];
const wonCardsAllTricksDisplayed = [];

// Opponent tricks
// - 1st won trick(2 cards), always shown
// - other won tricks (max. 7 tricks/14 cards), hidden
const opponentWonCardsFirstTrick = [];
const opponentWonCardsOtherTricksCardbacks = [];

// Room #
let textRoomId;

// Text alert
let textAlert;

// Text - Points (66)
let textPoints;

// Player name, Opponent name
let textPlayerName;
let textOpponentName;

// Player gamepoints, Opponent gamepoints
let textPlayerGamePoints;
let textOpponentGamePoints;

// Bummerls lost (dots)
let textBummerlsLostPlayer;
let textBummerlsLostOpponent;

// Marriages(20,40) in player's hand
const marriagesIndicator = [];

// Unavailable(forbidden) cards
const forbiddenCardOverlay = [];

// Change trump card button(group with rect and text)
let exchangeTrumpCardRect, exchangeTrumpCardText;
let exchangeTrumpCardButton;


// SVG ELEMENTS
// ********************************************************************************

// Player active (background color)
playerOnTurnIndicator = document.createElementNS(XMLNS, 'rect');
playerOnTurnIndicator.setAttributeNS(null, 'x', 0);
playerOnTurnIndicator.setAttributeNS(null, 'y', 0);
playerOnTurnIndicator.setAttributeNS(null, 'width',  1080);
playerOnTurnIndicator.setAttributeNS(null, 'height', 540);
playerOnTurnIndicator.setAttributeNS(null, 'fill', PLAYER_BACKGROUND_COLOR_ACTIVE);
playerOnTurnIndicator.setAttributeNS(null, 'fill-opacity', 1);

// Player cards
for(let i=0; i<5; i++) {
    cardsInHand[i] = document.createElementNS(XMLNS, 'rect');
    cardsInHand[i].setAttributeNS(null, 'x', CARD_WIDTH*i);
    cardsInHand[i].setAttributeNS(null, 'y', PLAYER_CARDS_Y_POSITION);
    cardsInHand[i].setAttributeNS(null, 'rx', CARD_ROUND);
    cardsInHand[i].setAttributeNS(null, 'ry', CARD_ROUND);
    cardsInHand[i].setAttributeNS(null, 'width',  CARD_WIDTH);
    cardsInHand[i].setAttributeNS(null, 'height', CARD_HEIGHT);
    cardsInHand[i].setAttributeNS(null, 'stroke', 'black');
    cardsInHand[i].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
    cardsInHand[i].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
    cardsInHand[i].setAttributeNS(null, 'fill', 'url(#cardback)');
    cardsInHand[i].setAttributeNS(null, 'visibility', 'hidden');
}

// Opponent cards
for(let i=0; i<5; i++) {
    opponentCardsInHand[i] = document.createElementNS(XMLNS, 'rect');
    opponentCardsInHand[i].setAttributeNS(null, 'x', CARD_WIDTH*i);
    opponentCardsInHand[i].setAttributeNS(null, 'y', OPPONENT_CARDS_Y_POSITION);
    opponentCardsInHand[i].setAttributeNS(null, 'rx', CARD_ROUND);
    opponentCardsInHand[i].setAttributeNS(null, 'ry', CARD_ROUND);
    opponentCardsInHand[i].setAttributeNS(null, 'width',  CARD_WIDTH);
    opponentCardsInHand[i].setAttributeNS(null, 'height', CARD_HEIGHT);
    opponentCardsInHand[i].setAttributeNS(null, 'stroke', 'black');
    opponentCardsInHand[i].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
    opponentCardsInHand[i].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
    opponentCardsInHand[i].setAttributeNS(null, 'fill', 'url(#cardback)');
    opponentCardsInHand[i].setAttributeNS(null, 'visibility', 'hidden');
}

// Card in the middle of the table, played by PLAYER
cardPlayedByPlayer = document.createElementNS(XMLNS, 'rect');
cardPlayedByPlayer.setAttributeNS(null, 'x', 350);
cardPlayedByPlayer.setAttributeNS(null, 'y', 90);
cardPlayedByPlayer.setAttributeNS(null, 'rx', CARD_ROUND);
cardPlayedByPlayer.setAttributeNS(null, 'ry', CARD_ROUND);
cardPlayedByPlayer.setAttributeNS(null, 'width',  CARD_WIDTH);
cardPlayedByPlayer.setAttributeNS(null, 'height', CARD_HEIGHT);
cardPlayedByPlayer.setAttributeNS(null, 'stroke', 'black');
cardPlayedByPlayer.setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
cardPlayedByPlayer.setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
cardPlayedByPlayer.setAttributeNS(null, 'fill', 'url(#cardback)');
cardPlayedByPlayer.setAttributeNS(null, 'visibility', 'hidden');

// Card in the middle of the table, played by OPPONENT
cardPlayedByOpponent = document.createElementNS(XMLNS, 'rect');
cardPlayedByOpponent.setAttributeNS(null, 'x', -340);
cardPlayedByOpponent.setAttributeNS(null, 'y', -280);
cardPlayedByOpponent.setAttributeNS(null, 'rx', CARD_ROUND);
cardPlayedByOpponent.setAttributeNS(null, 'ry', CARD_ROUND);
cardPlayedByOpponent.setAttributeNS(null, 'width',  CARD_WIDTH);
cardPlayedByOpponent.setAttributeNS(null, 'height', CARD_HEIGHT);
cardPlayedByOpponent.setAttributeNS(null, 'stroke', 'black');
cardPlayedByOpponent.setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
cardPlayedByOpponent.setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
cardPlayedByOpponent.setAttributeNS(null, 'transform', 'rotate(180)');
cardPlayedByOpponent.setAttributeNS(null, 'fill', 'url(#cardback)');
cardPlayedByOpponent.setAttributeNS(null, 'visibility', 'hidden');

 

// Marriage points (20 or 40) called on current move - by Opponent
marriagesCalledThisTrickByOpponent = document.createElementNS(XMLNS, 'text');
marriagesCalledThisTrickByOpponent.setAttributeNS(null, 'x', 290);
marriagesCalledThisTrickByOpponent.setAttributeNS(null, 'y', 300);
marriagesCalledThisTrickByOpponent.setAttributeNS(null, 'font-size', '36px');
marriagesCalledThisTrickByOpponent.setAttributeNS(null, 'fill', 'blue');
marriagesCalledThisTrickByOpponent.setAttributeNS(null, 'visibility', 'hidden');
marriagesCalledThisTrickByOpponent.textContent = '';

// Trump card under the deck
trumpCard = document.createElementNS(XMLNS, 'rect');
trumpCard.setAttributeNS(null, 'x', TRUMP_CARD_X_POSITION);
trumpCard.setAttributeNS(null, 'y', TRUMP_CARD_Y_POSITION);
trumpCard.setAttributeNS(null, 'rx', CARD_ROUND);
trumpCard.setAttributeNS(null, 'ry', CARD_ROUND);
trumpCard.setAttributeNS(null, 'width',  CARD_WIDTH);
trumpCard.setAttributeNS(null, 'height', CARD_HEIGHT);
trumpCard.setAttributeNS(null, 'stroke', 'black');
trumpCard.setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
trumpCard.setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
trumpCard.setAttributeNS(null, 'fill', 'url(#cardback)');
trumpCard.setAttributeNS(null, 'transform', 'rotate(270)');
trumpCard.setAttributeNS(null, 'visibility', 'hidden');

// Deck
for(let i = 0; i<9; i++) {
    cardsInDeck[i] = document.createElementNS(XMLNS, 'rect');
    cardsInDeck[i].setAttributeNS(null, 'x', DECK_CARDS_X_POSITION+(i*5));
    cardsInDeck[i].setAttributeNS(null, 'y', DECK_CARDS_Y_POSITION);
    cardsInDeck[i].setAttributeNS(null, 'rx', CARD_ROUND);
    cardsInDeck[i].setAttributeNS(null, 'ry', CARD_ROUND);
    cardsInDeck[i].setAttributeNS(null, 'width',  CARD_WIDTH);
    cardsInDeck[i].setAttributeNS(null, 'height', CARD_HEIGHT);
    cardsInDeck[i].setAttributeNS(null, 'stroke', 'black');
    cardsInDeck[i].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
    cardsInDeck[i].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
    cardsInDeck[i].setAttributeNS(null, 'fill', 'url(#cardback)');
    cardsInDeck[i].setAttributeNS(null, 'visibility', 'hidden');
}

// Won cards - first trick - shown - PLAYER
wonCardsFirstTrick[0] = document.createElementNS(XMLNS, 'rect');
wonCardsFirstTrick[0].setAttributeNS(null, 'x', 28);
wonCardsFirstTrick[0].setAttributeNS(null, 'y', 928);
wonCardsFirstTrick[0].setAttributeNS(null, 'rx', CARD_ROUND);
wonCardsFirstTrick[0].setAttributeNS(null, 'ry', CARD_ROUND);
wonCardsFirstTrick[0].setAttributeNS(null, 'width',  CARD_WIDTH);
wonCardsFirstTrick[0].setAttributeNS(null, 'height', CARD_HEIGHT);
wonCardsFirstTrick[0].setAttributeNS(null, 'stroke', 'black');
wonCardsFirstTrick[0].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
wonCardsFirstTrick[0].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
wonCardsFirstTrick[0].setAttributeNS(null, 'fill', 'url(#cardback)');
wonCardsFirstTrick[0].setAttributeNS(null, 'transform', 'rotate(-60)');
wonCardsFirstTrick[0].setAttributeNS(null, 'visibility', 'hidden');

wonCardsFirstTrick[1] = document.createElementNS(XMLNS, 'rect');
wonCardsFirstTrick[1].setAttributeNS(null, 'x', 785);
wonCardsFirstTrick[1].setAttributeNS(null, 'y', 542);
wonCardsFirstTrick[1].setAttributeNS(null, 'rx', CARD_ROUND);
wonCardsFirstTrick[1].setAttributeNS(null, 'ry', CARD_ROUND);
wonCardsFirstTrick[1].setAttributeNS(null, 'width',  CARD_WIDTH);
wonCardsFirstTrick[1].setAttributeNS(null, 'height', CARD_HEIGHT);
wonCardsFirstTrick[1].setAttributeNS(null, 'stroke', 'black');
wonCardsFirstTrick[1].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
wonCardsFirstTrick[1].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
wonCardsFirstTrick[1].setAttributeNS(null, 'fill', 'url(#cardback)');
wonCardsFirstTrick[1].setAttributeNS(null, 'transform', 'rotate(-15)');
wonCardsFirstTrick[1].setAttributeNS(null, 'visibility', 'hidden');

// Won cards - other tricks - hidden - PLAYER
for(let i=0; i<14; i++) {
    wonCardsOtherTricksCardbacks[i] = document.createElementNS(XMLNS, 'rect');
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'x', PLAYER_WON_TRICK_CARDS_HIDDEN_X_POSITION+(i*5));
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'y', PLAYER_WON_TRICK_CARDS_HIDDEN_Y_POSITION);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'rx', CARD_ROUND);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'ry', CARD_ROUND);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'width',  CARD_WIDTH);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'height', CARD_HEIGHT);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'stroke', 'black');
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'fill', 'url(#cardback)');
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'transform', 'rotate(45)');
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'visibility', 'hidden');
}

// Won cards - all tricks (when SHOW ALL is toggled) - PLAYER - 1st row
for(let i=0;i<5;i++) {
    wonCardsAllTricksDisplayed[i] = document.createElementNS(XMLNS, 'rect');
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'x', 750+(i*60));
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'y', + PLAYER_WON_TRICK_CARDS_SHOW_ALL_Y_POSITION);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'rx', CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'ry', CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'width',  CARD_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'height', CARD_HEIGHT);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'stroke', 'black');
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'fill', 'url(#cardback)');
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'visibility', 'hidden');
}
// Won cards - all tricks (when SHOW ALL is toggled) - PLAYER - 2nd row
for(let i=5;i<10;i++) {
    wonCardsAllTricksDisplayed[i] = document.createElementNS(XMLNS, 'rect');
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'x', 450+(i*60));
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'y', + PLAYER_WON_TRICK_CARDS_SHOW_ALL_Y_POSITION+100);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'rx', CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'ry', CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'width',  CARD_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'height', CARD_HEIGHT);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'stroke', 'black');
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'fill', 'url(#cardback)');
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'visibility', 'hidden');
}
// Won cards - all tricks (when SHOW ALL is toggled) - PLAYER - 3rd row
for(let i=10;i<16;i++) {
    wonCardsAllTricksDisplayed[i] = document.createElementNS(XMLNS, 'rect');
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'x', 150+(i*60));
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'y', + PLAYER_WON_TRICK_CARDS_SHOW_ALL_Y_POSITION+200);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'rx', CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'ry', CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'width',  CARD_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'height', CARD_HEIGHT);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'stroke', 'black');
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'fill', 'url(#cardback)');
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, 'visibility', 'hidden');
}

// Won cards - first trick - shown - OPPONENT
opponentWonCardsFirstTrick[0] = document.createElementNS(XMLNS, 'rect');
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'x', -1000);
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'y', -470);
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'rx', CARD_ROUND);
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'ry', CARD_ROUND);
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'width',  CARD_WIDTH);
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'height', CARD_HEIGHT);
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'stroke', 'black');
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'fill', 'url(#cardback)');
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'transform', 'rotate(165)');
opponentWonCardsFirstTrick[0].setAttributeNS(null, 'visibility', 'hidden');

opponentWonCardsFirstTrick[1] = document.createElementNS(XMLNS, 'rect');
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'x', -1000);
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'y', 30);
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'rx', CARD_ROUND);
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'ry', CARD_ROUND);
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'width',  CARD_WIDTH);
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'height', CARD_HEIGHT);
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'stroke', 'black');
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'fill', 'url(#cardback)');
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'transform', 'rotate(195)');
opponentWonCardsFirstTrick[1].setAttributeNS(null, 'visibility', 'hidden');

// Won cards - other tricks - hidden - OPPONENT
for(let i=0; i<14; i++) {
    opponentWonCardsOtherTricksCardbacks[i] = document.createElementNS(XMLNS, 'rect');
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'x', OPPONENT_WON_TRICK_CARDS_HIDDEN_X_POSITION-(i*5));
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'y', OPPONENT_WON_TRICK_CARDS_HIDDEN_Y_POSITION);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'rx', CARD_ROUND);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'ry', CARD_ROUND);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'width',  CARD_WIDTH);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'height', CARD_HEIGHT);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'stroke', 'black');
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'fill', 'url(#cardback)');
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'transform', 'rotate(90)');
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, 'visibility', 'hidden');
}

// Room id
textRoomId = document.createElementNS(XMLNS, 'text');
textRoomId.setAttributeNS(null, 'x', 380);
textRoomId.setAttributeNS(null, 'y', 80);
textRoomId.setAttributeNS(null, 'font-size', '48px');
textRoomId.setAttributeNS(null, 'fill', 'black');
textRoomId.textContent = '';

// Text alert
textAlert = document.createElementNS(XMLNS, 'text');
textAlert.setAttributeNS(null, 'x', 150);
textAlert.setAttributeNS(null, 'y', 310);
textAlert.setAttributeNS(null, 'font-size', '72px');
textAlert.setAttributeNS(null, 'fill', 'black');
textAlert.textContent = '';

// Text - Points (66)
textPoints = document.createElementNS(XMLNS, 'text');
textPoints.setAttributeNS(null, 'x', 875);
textPoints.setAttributeNS(null, 'y', 275);
textPoints.setAttributeNS(null, 'font-size', '36px');
textPoints.setAttributeNS(null, 'fill', 'black');
textPoints.setAttributeNS(null, 'visibility', 'hidden');
textPoints.textContent = '0';

// Player name
textPlayerName = document.createElementNS(XMLNS, 'text');
textPlayerName.setAttributeNS(null, 'x', 40);
textPlayerName.setAttributeNS(null, 'y', 260);
textPlayerName.setAttributeNS(null, 'font-size', PLAYER_NAME_AND_POINTS_FONT_SIZE);
textPlayerName.setAttributeNS(null, 'fill', 'black');
textPlayerName.textContent = 'Player';
textPlayerName.setAttributeNS(null, 'visibility', 'hidden');

// Opponent name
textOpponentName = document.createElementNS(XMLNS, 'text');
textOpponentName.setAttributeNS(null, 'x', 40);
textOpponentName.setAttributeNS(null, 'y', 200);
textOpponentName.setAttributeNS(null, 'font-size', PLAYER_NAME_AND_POINTS_FONT_SIZE);
textOpponentName.setAttributeNS(null, 'fill', 'black');
textOpponentName.textContent = 'Opponent';
textOpponentName.setAttributeNS(null, 'visibility', 'hidden');

// Game Points (0-7) - Player
textPlayerGamePoints = document.createElementNS(XMLNS, 'text');
textPlayerGamePoints.setAttributeNS(null, 'x', 10);
textPlayerGamePoints.setAttributeNS(null, 'y', 260);
textPlayerGamePoints.setAttributeNS(null, 'font-size', PLAYER_NAME_AND_POINTS_FONT_SIZE);
textPlayerGamePoints.setAttributeNS(null, 'font-weight', 'bold');
textPlayerGamePoints.setAttributeNS(null, 'fill', 'black');
textPlayerGamePoints.textContent = '0';
textPlayerGamePoints.setAttributeNS(null, 'visibility', 'hidden');

// Game Points (0-7) - Opponent
textOpponentGamePoints = document.createElementNS(XMLNS, 'text');
textOpponentGamePoints.setAttributeNS(null, 'x', 10);
textOpponentGamePoints.setAttributeNS(null, 'y', 200);
textOpponentGamePoints.setAttributeNS(null, 'font-size', PLAYER_NAME_AND_POINTS_FONT_SIZE);
textOpponentGamePoints.setAttributeNS(null, 'font-weight', 'bold');
textOpponentGamePoints.setAttributeNS(null, 'fill', 'black');
textOpponentGamePoints.textContent = '0';
textOpponentGamePoints.setAttributeNS(null, 'visibility', 'hidden');

// bummerls lost ● - player
textBummerlsLostPlayer = document.createElementNS(XMLNS, 'text');
textBummerlsLostPlayer.setAttributeNS(null, 'x', 10);
textBummerlsLostPlayer.setAttributeNS(null, 'y', 285);
textBummerlsLostPlayer.setAttributeNS(null, 'font-size', '28px');
textBummerlsLostPlayer.setAttributeNS(null, 'fill', 'black');
textBummerlsLostPlayer.textContent = '';

// bummerls lost ● - opponent
textBummerlsLostOpponent = document.createElementNS(XMLNS, 'text');
textBummerlsLostOpponent.setAttributeNS(null, 'x', 10);
textBummerlsLostOpponent.setAttributeNS(null, 'y', 170);
textBummerlsLostOpponent.setAttributeNS(null, 'font-size', '28px');
textBummerlsLostOpponent.setAttributeNS(null, 'fill', 'black');
textBummerlsLostOpponent.textContent = '';

// marriages(zvanja) - 20/40 - Positions 0,1,2,3
// 0 - between 1st and 2nd card, 1 between 2nd and 3rd card...
for(let i=0; i<4; i++) {
    marriagesIndicator[i] = document.createElementNS(XMLNS, 'text');
    marriagesIndicator[i].setAttributeNS(null, 'x', MARRIAGES_0_X_POSITION + (MARRIAGES_X_DISTANCE_TO_NEXT * i));
    marriagesIndicator[i].setAttributeNS(null, 'y', MARRIAGES_Y_POSITION);
    marriagesIndicator[i].setAttributeNS(null, 'font-size', MARRIAGES_FONT_SIZE);
    marriagesIndicator[i].setAttributeNS(null, 'fill', MARRIAGES_FONT_COLOR);
    marriagesIndicator[i].textContent = '';    
}

// unavailable(forbidden) cards - red overlay
for(let i=0; i<5; i++) {
    forbiddenCardOverlay[i] = document.createElementNS(XMLNS, 'rect');
    forbiddenCardOverlay[i].setAttributeNS(null, 'x', cardsInHand[i].getAttribute('x'));
    forbiddenCardOverlay[i].setAttributeNS(null, 'y', cardsInHand[i].getAttribute('y'));
    forbiddenCardOverlay[i].setAttributeNS(null, 'rx', CARD_ROUND);
    forbiddenCardOverlay[i].setAttributeNS(null, 'ry', CARD_ROUND);
    forbiddenCardOverlay[i].setAttributeNS(null, 'width',  CARD_WIDTH);
    forbiddenCardOverlay[i].setAttributeNS(null, 'height', CARD_HEIGHT);
    forbiddenCardOverlay[i].setAttributeNS(null, 'stroke', 'black');
    forbiddenCardOverlay[i].setAttributeNS(null, 'stroke-width', CARD_STROKE_WIDTH);
    forbiddenCardOverlay[i].setAttributeNS(null, 'stroke-opacity', CARD_STROKE_OPACITY);
    forbiddenCardOverlay[i].setAttributeNS(null, 'fill', 'red');
    forbiddenCardOverlay[i].setAttributeNS(null, 'visibility', 'hidden');
    forbiddenCardOverlay[i].setAttributeNS(null, 'opacity', 0.4);
}

// change trump card button - rect
exchangeTrumpCardRect = document.createElementNS(XMLNS, 'rect');
exchangeTrumpCardRect.setAttributeNS(null, 'x', 0);
exchangeTrumpCardRect.setAttributeNS(null, 'y', 0);
exchangeTrumpCardRect.setAttributeNS(null, 'rx', CARD_ROUND);
exchangeTrumpCardRect.setAttributeNS(null, 'ry', CARD_ROUND);
exchangeTrumpCardRect.setAttributeNS(null, 'width', 76);
exchangeTrumpCardRect.setAttributeNS(null, 'height', 32);
exchangeTrumpCardRect.setAttributeNS(null, 'stroke', 'black');
exchangeTrumpCardRect.setAttributeNS(null, 'stroke-width', 1);
exchangeTrumpCardRect.setAttributeNS(null, 'stroke-opacity', 1);
exchangeTrumpCardRect.setAttributeNS(null, 'fill', 'none');

// change trump card button - text
exchangeTrumpCardText = document.createElementNS(XMLNS, 'text');
exchangeTrumpCardText.setAttributeNS(null, 'x', 0);
exchangeTrumpCardText.setAttributeNS(null, 'y', 0);
exchangeTrumpCardText.setAttributeNS(null, 'font-size', '48px');
exchangeTrumpCardText.setAttributeNS(null, 'fill', 'black');
exchangeTrumpCardText.textContent = '<->';

// change trump card button - group with rect and text elements
exchangeTrumpCardButton = document.createElementNS(XMLNS, 'g');
exchangeTrumpCardButton.setAttributeNS(null, 'opacity', 0.6);
exchangeTrumpCardButton.setAttributeNS(null, 'visibility', 'hidden');

// append to group
exchangeTrumpCardButton.appendChild(exchangeTrumpCardRect);
exchangeTrumpCardButton.appendChild(exchangeTrumpCardText);

// back to main menu button
exitButton = document.createElementNS(XMLNS, 'text');
exitButton.setAttributeNS(null, 'x', 1052);
exitButton.setAttributeNS(null, 'y', 30);
exitButton.setAttributeNS(null, 'font-size', '48px');
exitButton.setAttributeNS(null, 'font-weight', 'bold');
exitButton.setAttributeNS(null, 'fill', 'black');
exitButton.textContent = '×';

// ADDING ALL GUI ELEMENTS TO ARRAY
// ********************************************************************************

// player active - background color
ALL_GUI_ELEMENTS.push(playerOnTurnIndicator);

// player cards
cardsInHand.forEach(card => {
    ALL_GUI_ELEMENTS.push(card);
});

// opponent cards
opponentCardsInHand.forEach(card => {
    ALL_GUI_ELEMENTS.push(card);
});

// played cards on the table
ALL_GUI_ELEMENTS.push(cardPlayedByPlayer);
ALL_GUI_ELEMENTS.push(cardPlayedByOpponent);

// marriages called by opponent on current move
ALL_GUI_ELEMENTS.push(marriagesCalledThisTrickByOpponent);

// trump card
ALL_GUI_ELEMENTS.push(trumpCard);

// deck
cardsInDeck.forEach(card => {
    ALL_GUI_ELEMENTS.push(card);
});

// won tricks - player - 1st trick
wonCardsFirstTrick.forEach(card => {
    ALL_GUI_ELEMENTS.push(card);
});

// won tricks - player - other tricks
wonCardsOtherTricksCardbacks.forEach(card => {
    ALL_GUI_ELEMENTS.push(card);
});

// won tricks - player - show all tricks toggled
wonCardsAllTricksDisplayed.forEach(card => {
    ALL_GUI_ELEMENTS.push(card);
});

// won tricks - opponent - 1st trick
opponentWonCardsFirstTrick.forEach(card => {
    ALL_GUI_ELEMENTS.push(card);
});

// won tricks - opponent - other tricks
opponentWonCardsOtherTricksCardbacks.forEach(card => {
    ALL_GUI_ELEMENTS.push(card);
});

// room id
ALL_GUI_ELEMENTS.push(textRoomId);

// text alert
ALL_GUI_ELEMENTS.push(textAlert);

// points
ALL_GUI_ELEMENTS.push(textPoints);

// names
ALL_GUI_ELEMENTS.push(textPlayerName);
ALL_GUI_ELEMENTS.push(textOpponentName);

// gamepoints
ALL_GUI_ELEMENTS.push(textPlayerGamePoints);
ALL_GUI_ELEMENTS.push(textOpponentGamePoints);

// bummerls lost
ALL_GUI_ELEMENTS.push(textBummerlsLostPlayer);
ALL_GUI_ELEMENTS.push(textBummerlsLostOpponent);

// marriagesIndicator
marriagesIndicator.forEach(m => {
    ALL_GUI_ELEMENTS.push(m);
});

// overlays
forbiddenCardOverlay.forEach(cardOverlay => {
    ALL_GUI_ELEMENTS.push(cardOverlay);
});

// change trump card button
ALL_GUI_ELEMENTS.push(exchangeTrumpCardButton);

// exit button
ALL_GUI_ELEMENTS.push(exitButton);


// APPEND ALL ELEMENTS
// ********************************************************************************
ALL_GUI_ELEMENTS.forEach(element => {
    svg.appendChild(element);
});

// ADDING EVENT LISTENERS
// ********************************************************************************

// cards
for(let i = 0; i<5; i++) {
    cardsInHand[i].addEventListener('mouseover', function () {cardHover(cardsInHand[i]);}, false);
    cardsInHand[i].addEventListener('mouseout',  function () {cardHoverOut(cardsInHand[i]);}, false);
    cardsInHand[i].addEventListener('click',     function () {movePlayCard(cardsInHand[i]);}, false);
}

// won cards - 1st trick
wonCardsFirstTrick.forEach(element => {
    element.addEventListener('mouseover', function () {toggleShowAllTricks();}, false);
});

// won cards - all tricks
wonCardsAllTricksDisplayed.forEach(element => {
    element.addEventListener('mouseout', function () {toggleHideAllTricks();}, false);
    element.addEventListener('mouseover', function () {toggleShowAllTricks();}, false);
});


// exchange trump
exchangeTrumpCardButton.addEventListener('mouseover', function () {hoverExchangeTrump(exchangeTrumpCardButton);}, false);
exchangeTrumpCardButton.addEventListener('mouseout', function () {hoverOutExchangeTrump(exchangeTrumpCardButton);}, false);
exchangeTrumpCardButton.addEventListener('click', function () {moveExchangeTrump();}, false);

// close deck
trumpCard.addEventListener('mouseover', function () {hoverCloseDeck(trumpCard);}, false);
trumpCard.addEventListener('mouseout',  function () {hoverOutCloseDeck(trumpCard);}, false);
trumpCard.addEventListener('click', function () {moveCloseDeck();}, false);

// forbidden card overlays
for(let i = 0; i<5; i++) {
    forbiddenCardOverlay[i].addEventListener('mouseover', function () {hoverForbiddenCardOverlay(forbiddenCardOverlay[i]);}, false);
    forbiddenCardOverlay[i].addEventListener('mouseout',  function () {hoverOutForbiddenCardOverlay(forbiddenCardOverlay[i]);}, false);
}


// modal
const modal = document.querySelector('.modal');
const modalCloseButton = document.querySelector('.modal-close-button');
const modalExitGameButton = document.getElementById('modal-exit-btn');
const modalContinueGameButton = document.getElementById('modal-continue-btn');

exitButton.addEventListener('click', toggleModal);
exitButton.style.cursor = 'pointer';

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
