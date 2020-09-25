// Get username and room from URL
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const room = urlParams.get('room');

const socket = io();

// Session, Bummerl, Game objects
let playSession;
let bummerl;
let game;

// Join room
socket.emit('joinRoom', { username, room });



// GAMEPLAY - Receive from server
// ***************************************************************************

// Game state update
socket.on('gameStateUpdate', gameStateDTO => {
    updateClientGameState(gameStateDTO);
    updateClientScreen();
    updatePoints(game.playerPoints);
    updateMarriageIndicators(game.cardsInHand, game.marriagesInHand);
});

// Game state update - after trick
socket.on('gameStateUpdateAfterTrick', gameStateDTO => {
    updateClientGameState(gameStateDTO);

    delay(1200).then(
        () => {
            updateClientScreen();
            hideElement(cardPlayedByPlayer);
            hideElement(cardPlayedByOpponent);
            hideElements(forbiddenCardOverlay);
            updateAllCardsInHand(game.cardsInHand);
            updateOpponentCards(game.cardsInHand.length);
            removeCardsStackedInDeck(game.deckSize);
            updatePoints(game.playerPoints);
            updatePlayerTricks(game.playerWonCards); 
            updateOpponentTricks(game.opponentWonCardsFirstTrick, game.opponentTotalWonCardsNumber);
            updateMarriageIndicators(game.cardsInHand, game.marriagesInHand);
        }
    );
});

// Game over
socket.on('gameOverDTO', gameOverDTO => {
    // add game points
    if(gameOverDTO.isWinner){
        bummerl.gamePointsPlayer += gameOverDTO.gamePoints;
        textAlert.textContent = `You won! ${gameOverDTO.gamePoints} points`;
        updatePoints(gameOverDTO.playerPointsAtEndOfGame);
    }
    else{
        bummerl.gamePointsOpponent += gameOverDTO.gamePoints;
        textAlert.textContent = `Lost! Opponent gets ${gameOverDTO.gamePoints} points`;
    }
    showElement(textAlert);
    updatePlayerAndOpponentGamePoints();
});

// Session starting
socket.on('sessionStarting', gameRoomId => {
    showElement(textAlert);
    textAlert.textContent = "Waiting for other player...";
    textRoomId.textContent = `#${gameRoomId}`;
});

// Session status update
socket.on('sessionStateUpdate', playSessionDTO => {
    if(playSessionDTO.status === "started"){
        playSession = new PlaySession(playSessionDTO);
        textPlayerName.textContent = playSession.playerName;
        textOpponentName.textContent = playSession.opponentName;
    }
});

// Session - END
socket.on('sessionEnd', s => {
    showElement(textAlert);
    textAlert.textContent = "Opponent left the game.";
});

// Bummerl status
socket.on('bummerlStart', s => {
    bummerl = new Bummerl();
    setupGameScreenWaiting();
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
        }
    );
    
    
});


// Player's move confirmation/validation from server
socket.on('moveValid', isMoveValid => {
    //console.log("move valid");
});

// Player's move ERROR from server
socket.on('moveInvalidError', moveInvalidError => {
    //console.log("move NOT valid");
});


// Opponent's move
socket.on('opponentMove', opponentMoveDTO => {
    // hide random card in opponent's hand
    hideElement(opponentCardsInHand[getRandomInt(5)]);

    // throw card on the table 
    putCardInElement(cardPlayedByOpponent, opponentMoveDTO.cardName);
    showElement(cardPlayedByOpponent);

    // disable/overlay unavailable(forbidden) response cards
    disableForbiddenCards(game.cardsInHand, opponentMoveDTO.validRespondingCards);
});




// ***************************************************************************
function setupGameScreenWaiting(){
    showElement(textAlert);
    
}

function setupGameScreenStarted(){
    hideElement(textAlert);
    hideElement(textRoomId);
    hideElement(cardPlayedByPlayer);
    hideElement(cardPlayedByOpponent);
    hideElement(textPoints);
    hideElements(forbiddenCardOverlay);
    //hideElements(marriagesIndicator);
    hideElements(wonCardsFirstTrick);
    hideElements(wonCardsOtherTricksCardbacks);
    hideElements(wonCardsAllTricksDisplayed);
    hideElements(opponentWonCardsFirstTrick);
    hideElements(opponentwonCardsOtherTricksCardbacks);

    showElements(cardsInHand);
    showElements(opponentCardsInHand);
    putCardInElement(trumpCard, game.trumpCard.name);
    showElement(trumpCard);
    showElements(cardsInDeck);
    showElement(textPlayerName);
    showElement(textOpponentName);
    showElement(textPlayerGamePoints);
    showElement(textOpponentGamePoints);

    //setPlayerOnTurnIndicator(game.thisPlayerOnTurn);
    updateClientScreen();
}

function setupGameScreenFinished(){
}


function updateClientGameState(gameStateDTO){
    game.num = gameStateDTO.num;
    game.playerOnTurn = gameStateDTO.playerOnTurn;
    game.trumpCard = gameStateDTO.trumpCard;
    game.trumpSuit = gameStateDTO.trumpSuit;
    game.trickNum = gameStateDTO.trickNum;
    game.moveNum = gameStateDTO.moveNum;
    game.leadOrResponse = gameStateDTO.leadOrResponse;
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


function updateClientScreen(){
    // player on turn background color
    setPlayerOnTurnIndicator(game.thisPlayerOnTurn);

    // cards opacity
    setPlayerOnTurnCardsOpacity(game.thisPlayerOnTurn);

    // points
    if(game.playerPoints > 0){showElement(textPoints);}
}

// card hover functions
function cardHover(cardPlace){
    if(game.thisPlayerOnTurn){
        cardPlace.style.opacity = 0.9;
        cardPlace.style.cursor = "grab";
    }    
}
function cardHoverOut(cardPlace){
    if(game.thisPlayerOnTurn){
        cardPlace.style.opacity = 1;
        cardPlace.style.cursor = "default";
    }
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
}

// hide all won tricks
function toggleHideAllTricks() {

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

function playCard(cardPlace){

    // get card(name) from selected card place
    let cardName = cardPlace.getAttribute('data-card');

    // only if player is on turn
    if(game.thisPlayerOnTurn){

        // empty place in players hand
        emptyPlaceInHand(cardPlace);

        // update screen
        throwCardOnTheTable(cardName);
        
        // create PlayerMove object
        playerMove = new PlayerMove(room, socket.id, game.moveNum, "card", 
                                    game.trickNum, game.leadOrResponse, cardName);
        
        // send move to server
        sendMove(playerMove);

        // return opacity back to normal
        cardPlace.style.opacity = 1;
    }
}

// empty card place
function emptyPlaceInHand(cardPlace){
    cardPlace.setAttributeNS(null, "data-card", "none");
    cardPlace.setAttributeNS(null, "fill", "none");
}

// sends player move to server
function sendMove(playerMove){
    socket.emit('clientMove', playerMove);
}


// player plays a card (throws it in the middle of the table)
function throwCardOnTheTable(cardName){
    // update card image
    cardPlayedByPlayer.setAttributeNS(null, "fill", "url(#"+cardName+")");

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
