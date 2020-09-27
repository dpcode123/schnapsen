/** UI ELEMENTS ON THE GAME SCREEN
 * 
 * - Main svg element
 * - Constants - namespace, positions, sizes
 * - Cards, Card patterns
 * - Gui element constants and variables
 * - Create SVG elements and style them
 * - Add all elements to array 
 * - Append elements to screen
 * - Functions
 * - Add event listener to elements
 */

// MAIN SVG ELEMENT
// ********************************************************************************

// main svg element
const svg = document.getElementById('svg-content');


// CONSTANTS - Namespace, positions, sizes
// ********************************************************************************

// XML namespace
const XMLNS = "http://www.w3.org/2000/svg";

// card design
const CARD_WIDTH = 144;
const CARD_HEIGHT = 216;
const CARD_ROUND = 10;
const CARD_STROKE_WIDTH = 1;
const CARD_STROKE_OPACITY = 0;

// cards positioning
const PLAYER_CARDS_Y_POSITION = 530;
const OPPONENT_CARDS_Y_POSITION = -94;

// deck positioning
const DECK_CARDS_X_POSITION = 670;
const DECK_CARDS_Y_POSITION = 216;

// won tricks positioning - player
const PLAYER_WON_TRICK_CARDS_HIDDEN_X_POSITION = 1070;
const PLAYER_WON_TRICK_CARDS_HIDDEN_Y_POSITION = -334;
const PLAYER_WON_TRICK_CARDS_SHOW_ALL_Y_POSITION = 454;

// won tricks positioning - opponent
const OPPONENT_WON_TRICK_CARDS_HIDDEN_X_POSITION = 0;
const OPPONENT_WON_TRICK_CARDS_HIDDEN_Y_POSITION = -1075;

// marriages in hand indicators
const MARRIAGES_0_X_POSITION = 130;
const MARRIAGES_X_DISTANCE_TO_NEXT = 144;
const MARRIAGES_Y_POSITION = 530;
const MARRIAGES_FONT_SIZE = "24px";
const MARRIAGES_FONT_COLOR = "#52514e";

// player name; game points(0-7)
const PLAYER_NAME_AND_POINTS_FONT_SIZE = "28px"

// card images folder
const CARD_IMG_FOLDER = '../img/schnaps-custom';


// CARD PATTERNS
// ********************************************************************************

// card suits and tiers
const cardSuits = ['herc', 'karo', 'pik', 'tref'];
const cardTiers = ['j', 'q', 'k', 'x', 'a'];

// strings of all cards in "{tier}-{suit}" format, and cardback pattern
const cardPatterns = [];

// card patterns
cardSuits.forEach(suit => {
    cardTiers.forEach(tier => {
        cardPatterns.push(tier + "-" + suit);
    });  
});
// cardback pattern
cardPatterns.push("cardback");

// card pattern - defs
const defs = document.getElementById('defs');

cardPatterns.forEach(card => {
    const pattern = document.createElementNS(XMLNS, "pattern");
    const image = document.createElementNS(XMLNS, "image");

    pattern.setAttributeNS(null, "id", card);
    pattern.setAttributeNS(null, 'patternUnits', "objectBoundingBox");
    pattern.setAttributeNS(null, "width", 1);
    pattern.setAttributeNS(null, "height", 1);

    image.setAttributeNS(null, "href", `${CARD_IMG_FOLDER}/${card}.png`);
    image.setAttributeNS(null, "x", 0);
    image.setAttributeNS(null, "y", 0);
    image.setAttributeNS(null, "width", CARD_WIDTH);
    image.setAttributeNS(null, "height", CARD_HEIGHT);

    pattern.appendChild(image);
    defs.appendChild(pattern);
});


// GUI ELEMENT CONSTANTS AND VARIABLES
// ********************************************************************************

// all elements
const allGuiElements = [];

// Player cards
const cardsInHand = [];
// Opponent cards
const opponentCardsInHand = [];

// Deck - max 9 cards in deck
const cardsInDeck = [];

// 1st won trick(2 cards), always shown - PLAYER
const wonCardsFirstTrick = [];
// other won tricks (max. 7 tricks/14 cards), hidden - PLAYER
const wonCardsOtherTricksCardbacks = [];
// all won tricks, when "show all" is toggled - PLAYER
const wonCardsAllTricksDisplayed = [];

// 1st won trick(2 cards), always shown - OPPONENT
const opponentWonCardsFirstTrick = [];
// other won tricks (max. 7 tricks/14 cards), hidden - OPPONENT
const opponentWonCardsOtherTricksCardbacks = [];

// Marriages(20,40) in player's hand
const marriagesIndicator = [];

// unavailable(forbidden) cards
const forbiddenCardOverlay = [];

// Trump card under the deck
let trumpCard;
// Card in the middle of the table, played by PLAYER
let cardPlayedByPlayer;
// Card in the middle of the table, played by OPPONENT
let cardPlayedByOpponent;


// SVG ELEMENTS
// ********************************************************************************

// Player cards
for(let i=0; i<5; i++){
    cardsInHand[i] = document.createElementNS(XMLNS, "rect");
    cardsInHand[i].setAttributeNS(null, "x", CARD_WIDTH*i);
    cardsInHand[i].setAttributeNS(null, "y", PLAYER_CARDS_Y_POSITION);
    cardsInHand[i].setAttributeNS(null, "rx", CARD_ROUND);
    cardsInHand[i].setAttributeNS(null, "ry", CARD_ROUND);
    cardsInHand[i].setAttributeNS(null, "width",  CARD_WIDTH);
    cardsInHand[i].setAttributeNS(null, "height", CARD_HEIGHT);
    cardsInHand[i].setAttributeNS(null, "stroke", "black");
    cardsInHand[i].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
    cardsInHand[i].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
    cardsInHand[i].setAttributeNS(null, "fill", "url(#cardback)");
    cardsInHand[i].setAttributeNS(null, "visibility", "hidden");
}

// Opponent cards
for(let i=0; i<5; i++){
    opponentCardsInHand[i] = document.createElementNS(XMLNS, "rect");
    opponentCardsInHand[i].setAttributeNS(null, "x", CARD_WIDTH*i);
    opponentCardsInHand[i].setAttributeNS(null, "y", OPPONENT_CARDS_Y_POSITION);
    opponentCardsInHand[i].setAttributeNS(null, "rx", CARD_ROUND);
    opponentCardsInHand[i].setAttributeNS(null, "ry", CARD_ROUND);
    opponentCardsInHand[i].setAttributeNS(null, "width",  CARD_WIDTH);
    opponentCardsInHand[i].setAttributeNS(null, "height", CARD_HEIGHT);
    opponentCardsInHand[i].setAttributeNS(null, "stroke", "black");
    opponentCardsInHand[i].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
    opponentCardsInHand[i].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
    opponentCardsInHand[i].setAttributeNS(null, "fill", "url(#cardback)");
    opponentCardsInHand[i].setAttributeNS(null, "visibility", "hidden");
}


// Card in the middle of the table, played by PLAYER
cardPlayedByPlayer = document.createElementNS(XMLNS, "rect");
cardPlayedByPlayer.setAttributeNS(null, "x", 350);
cardPlayedByPlayer.setAttributeNS(null, "y", 236);
cardPlayedByPlayer.setAttributeNS(null, "rx", CARD_ROUND);
cardPlayedByPlayer.setAttributeNS(null, "ry", CARD_ROUND);
cardPlayedByPlayer.setAttributeNS(null, "width",  CARD_WIDTH);
cardPlayedByPlayer.setAttributeNS(null, "height", CARD_HEIGHT);
cardPlayedByPlayer.setAttributeNS(null, "stroke", "black");
cardPlayedByPlayer.setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
cardPlayedByPlayer.setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
cardPlayedByPlayer.setAttributeNS(null, "fill", "url(#cardback)");
cardPlayedByPlayer.setAttributeNS(null, "visibility", "hidden");

// Card in the middle of the table, played by OPPONENT
cardPlayedByOpponent = document.createElementNS(XMLNS, "rect");
cardPlayedByOpponent.setAttributeNS(null, "x", 220);
cardPlayedByOpponent.setAttributeNS(null, "y", 196);
cardPlayedByOpponent.setAttributeNS(null, "rx", CARD_ROUND);
cardPlayedByOpponent.setAttributeNS(null, "ry", CARD_ROUND);
cardPlayedByOpponent.setAttributeNS(null, "width",  CARD_WIDTH);
cardPlayedByOpponent.setAttributeNS(null, "height", CARD_HEIGHT);
cardPlayedByOpponent.setAttributeNS(null, "stroke", "black");
cardPlayedByOpponent.setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
cardPlayedByOpponent.setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
cardPlayedByOpponent.setAttributeNS(null, "fill", "url(#cardback)");
cardPlayedByOpponent.setAttributeNS(null, "visibility", "hidden");



// Trump card under the deck
trumpCard = document.createElementNS(XMLNS, "rect");
trumpCard.setAttributeNS(null, "x", -400);
trumpCard.setAttributeNS(null, "y", 560);
trumpCard.setAttributeNS(null, "rx", CARD_ROUND);
trumpCard.setAttributeNS(null, "ry", CARD_ROUND);
trumpCard.setAttributeNS(null, "width",  CARD_WIDTH);
trumpCard.setAttributeNS(null, "height", CARD_HEIGHT);
trumpCard.setAttributeNS(null, "stroke", "black");
trumpCard.setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
trumpCard.setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
trumpCard.setAttributeNS(null, "fill", "url(#cardback)");
trumpCard.setAttributeNS(null, "transform", "rotate(270)");
trumpCard.setAttributeNS(null, "visibility", "hidden");

// Deck
for(let i = 0; i<9; i++){
    cardsInDeck[i] = document.createElementNS(XMLNS, "rect");
    cardsInDeck[i].setAttributeNS(null, "x", DECK_CARDS_X_POSITION+(i*5));
    cardsInDeck[i].setAttributeNS(null, "y", DECK_CARDS_Y_POSITION);
    cardsInDeck[i].setAttributeNS(null, "rx", CARD_ROUND);
    cardsInDeck[i].setAttributeNS(null, "ry", CARD_ROUND);
    cardsInDeck[i].setAttributeNS(null, "width",  CARD_WIDTH);
    cardsInDeck[i].setAttributeNS(null, "height", CARD_HEIGHT);
    cardsInDeck[i].setAttributeNS(null, "stroke", "black");
    cardsInDeck[i].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
    cardsInDeck[i].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
    cardsInDeck[i].setAttributeNS(null, "fill", "url(#cardback)");
    cardsInDeck[i].setAttributeNS(null, "visibility", "hidden");
}



// Won cards - first trick - shown - PLAYER
wonCardsFirstTrick[0] = document.createElementNS(XMLNS, "rect");
wonCardsFirstTrick[0].setAttributeNS(null, "x", -160);
wonCardsFirstTrick[0].setAttributeNS(null, "y", 975);
wonCardsFirstTrick[0].setAttributeNS(null, "rx", CARD_ROUND);
wonCardsFirstTrick[0].setAttributeNS(null, "ry", CARD_ROUND);
wonCardsFirstTrick[0].setAttributeNS(null, "width",  CARD_WIDTH);
wonCardsFirstTrick[0].setAttributeNS(null, "height", CARD_HEIGHT);
wonCardsFirstTrick[0].setAttributeNS(null, "stroke", "black");
wonCardsFirstTrick[0].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
wonCardsFirstTrick[0].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
wonCardsFirstTrick[0].setAttributeNS(null, "fill", "url(#cardback)");
wonCardsFirstTrick[0].setAttributeNS(null, "transform", "rotate(-60)");
wonCardsFirstTrick[0].setAttributeNS(null, "visibility", "hidden");

wonCardsFirstTrick[1] = document.createElementNS(XMLNS, "rect");
wonCardsFirstTrick[1].setAttributeNS(null, "x", 685);
wonCardsFirstTrick[1].setAttributeNS(null, "y", 700);
wonCardsFirstTrick[1].setAttributeNS(null, "rx", CARD_ROUND);
wonCardsFirstTrick[1].setAttributeNS(null, "ry", CARD_ROUND);
wonCardsFirstTrick[1].setAttributeNS(null, "width",  CARD_WIDTH);
wonCardsFirstTrick[1].setAttributeNS(null, "height", CARD_HEIGHT);
wonCardsFirstTrick[1].setAttributeNS(null, "stroke", "black");
wonCardsFirstTrick[1].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
wonCardsFirstTrick[1].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
wonCardsFirstTrick[1].setAttributeNS(null, "fill", "url(#cardback)");
wonCardsFirstTrick[1].setAttributeNS(null, "transform", "rotate(-15)");
wonCardsFirstTrick[1].setAttributeNS(null, "visibility", "hidden");


// Won cards - other tricks - hidden - PLAYER
for(let i=0; i<14; i++){
    wonCardsOtherTricksCardbacks[i] = document.createElementNS(XMLNS, "rect");
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "x", PLAYER_WON_TRICK_CARDS_HIDDEN_X_POSITION+(i*5));
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "y", PLAYER_WON_TRICK_CARDS_HIDDEN_Y_POSITION);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "rx", CARD_ROUND);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "ry", CARD_ROUND);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "width",  CARD_WIDTH);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "height", CARD_HEIGHT);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "stroke", "black");
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "fill", "url(#cardback)");
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "transform", "rotate(45)");
    wonCardsOtherTricksCardbacks[i].setAttributeNS(null, "visibility", "hidden");
}

// Won cards - all tricks (when SHOW ALL is toggled) - PLAYER - 1st row
for(let i=0;i<5;i++){
    wonCardsAllTricksDisplayed[i] = document.createElementNS(XMLNS, "rect");
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "x", 750+(i*60));
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "y", + PLAYER_WON_TRICK_CARDS_SHOW_ALL_Y_POSITION);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "rx", CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "ry", CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "width",  CARD_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "height", CARD_HEIGHT);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "stroke", "black");
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "fill", "url(#cardback)");
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "visibility", "hidden");
}
// Won cards - all tricks (when SHOW ALL is toggled) - PLAYER - 2nd row
for(let i=5;i<10;i++){
    wonCardsAllTricksDisplayed[i] = document.createElementNS(XMLNS, "rect");
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "x", 450+(i*60));
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "y", + PLAYER_WON_TRICK_CARDS_SHOW_ALL_Y_POSITION+100);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "rx", CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "ry", CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "width",  CARD_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "height", CARD_HEIGHT);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "stroke", "black");
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "fill", "url(#cardback)");
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "visibility", "hidden");
}
// Won cards - all tricks (when SHOW ALL is toggled) - PLAYER - 3rd row
for(let i=10;i<16;i++){
    wonCardsAllTricksDisplayed[i] = document.createElementNS(XMLNS, "rect");
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "x", 150+(i*60));
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "y", + PLAYER_WON_TRICK_CARDS_SHOW_ALL_Y_POSITION+200);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "rx", CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "ry", CARD_ROUND);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "width",  CARD_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "height", CARD_HEIGHT);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "stroke", "black");
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "fill", "url(#cardback)");
    wonCardsAllTricksDisplayed[i].setAttributeNS(null, "visibility", "hidden");
}



// Won cards - first trick - shown - OPPONENT
opponentWonCardsFirstTrick[0] = document.createElementNS(XMLNS, "rect");
opponentWonCardsFirstTrick[0].setAttributeNS(null, "x", -992);
opponentWonCardsFirstTrick[0].setAttributeNS(null, "y", -505);
opponentWonCardsFirstTrick[0].setAttributeNS(null, "rx", CARD_ROUND);
opponentWonCardsFirstTrick[0].setAttributeNS(null, "ry", CARD_ROUND);
opponentWonCardsFirstTrick[0].setAttributeNS(null, "width",  CARD_WIDTH);
opponentWonCardsFirstTrick[0].setAttributeNS(null, "height", CARD_HEIGHT);
opponentWonCardsFirstTrick[0].setAttributeNS(null, "stroke", "black");
opponentWonCardsFirstTrick[0].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
opponentWonCardsFirstTrick[0].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
opponentWonCardsFirstTrick[0].setAttributeNS(null, "fill", "url(#cardback)");
opponentWonCardsFirstTrick[0].setAttributeNS(null, "transform", "rotate(165)");
opponentWonCardsFirstTrick[0].setAttributeNS(null, "visibility", "hidden");

opponentWonCardsFirstTrick[1] = document.createElementNS(XMLNS, "rect");
opponentWonCardsFirstTrick[1].setAttributeNS(null, "x", -992);
opponentWonCardsFirstTrick[1].setAttributeNS(null, "y", -12);
opponentWonCardsFirstTrick[1].setAttributeNS(null, "rx", CARD_ROUND);
opponentWonCardsFirstTrick[1].setAttributeNS(null, "ry", CARD_ROUND);
opponentWonCardsFirstTrick[1].setAttributeNS(null, "width",  CARD_WIDTH);
opponentWonCardsFirstTrick[1].setAttributeNS(null, "height", CARD_HEIGHT);
opponentWonCardsFirstTrick[1].setAttributeNS(null, "stroke", "black");
opponentWonCardsFirstTrick[1].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
opponentWonCardsFirstTrick[1].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
opponentWonCardsFirstTrick[1].setAttributeNS(null, "fill", "url(#cardback)");
opponentWonCardsFirstTrick[1].setAttributeNS(null, "transform", "rotate(195)");
opponentWonCardsFirstTrick[1].setAttributeNS(null, "visibility", "hidden");


// Won cards - other tricks - hidden - OPPONENT
for(let i=0; i<14; i++){
    opponentWonCardsOtherTricksCardbacks[i] = document.createElementNS(XMLNS, "rect");
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "x", OPPONENT_WON_TRICK_CARDS_HIDDEN_X_POSITION-(i*5));
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "y", OPPONENT_WON_TRICK_CARDS_HIDDEN_Y_POSITION);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "rx", CARD_ROUND);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "ry", CARD_ROUND);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "width",  CARD_WIDTH);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "height", CARD_HEIGHT);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "stroke", "black");
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "fill", "url(#cardback)");
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "transform", "rotate(90)");
    opponentWonCardsOtherTricksCardbacks[i].setAttributeNS(null, "visibility", "hidden");
}


// TEXT - game status
textAlert = document.createElementNS(XMLNS, "text");
textAlert.setAttributeNS(null, "x", 150);
textAlert.setAttributeNS(null, "y", 200);
textAlert.setAttributeNS(null, "font-size", "72px");
textAlert.setAttributeNS(null, "fill", "black");
textAlert.textContent = "";
//textAlert.setAttributeNS(null, "visibility", "hidden");


// TEXT - Points (66)
textPoints = document.createElementNS(XMLNS, "text");
textPoints.setAttributeNS(null, "x", 720);
textPoints.setAttributeNS(null, "y", 710);
textPoints.setAttributeNS(null, "font-size", "36px");
textPoints.setAttributeNS(null, "fill", "black");
textPoints.textContent = "0";
textPoints.setAttributeNS(null, "visibility", "hidden");


// player active - background color
playerOnTurnIndicator = document.createElementNS(XMLNS, "rect");
playerOnTurnIndicator.setAttributeNS(null, "x", 0);
playerOnTurnIndicator.setAttributeNS(null, "y", 0);
playerOnTurnIndicator.setAttributeNS(null, "width",  1080);
playerOnTurnIndicator.setAttributeNS(null, "height", 760);
playerOnTurnIndicator.setAttributeNS(null, "fill", "green");
playerOnTurnIndicator.setAttributeNS(null,"fill-opacity", 0.2);
//playerOnTurnIndicator.setAttributeNS(null, "visibility", "hidden");

// Player name
textPlayerName = document.createElementNS(XMLNS, "text");
textPlayerName.setAttributeNS(null, "x", 1020);
textPlayerName.setAttributeNS(null, "y", 360);
textPlayerName.setAttributeNS(null, "font-size", PLAYER_NAME_AND_POINTS_FONT_SIZE);
textPlayerName.setAttributeNS(null, "text-anchor", "end");
textPlayerName.setAttributeNS(null, "fill", "black");
textPlayerName.textContent = "Player";
textPlayerName.setAttributeNS(null, "visibility", "hidden");

// Opponent name
textOpponentName = document.createElementNS(XMLNS, "text");
textOpponentName.setAttributeNS(null, "x", 1020);
textOpponentName.setAttributeNS(null, "y", 300);
textOpponentName.setAttributeNS(null, "font-size", PLAYER_NAME_AND_POINTS_FONT_SIZE);
textOpponentName.setAttributeNS(null, "text-anchor", "end");
textOpponentName.setAttributeNS(null, "fill", "black");
textOpponentName.textContent = "Opponent";
textOpponentName.setAttributeNS(null, "visibility", "hidden");

// Game Points (0-7) - Player
textPlayerGamePoints = document.createElementNS(XMLNS, "text");
textPlayerGamePoints.setAttributeNS(null, "x", 1045);
textPlayerGamePoints.setAttributeNS(null, "y", 360);
textPlayerGamePoints.setAttributeNS(null, "font-size", PLAYER_NAME_AND_POINTS_FONT_SIZE);
textPlayerGamePoints.setAttributeNS(null, "font-weight", "bold");
textPlayerGamePoints.setAttributeNS(null, "fill", "black");
textPlayerGamePoints.textContent = "0";
textPlayerGamePoints.setAttributeNS(null, "visibility", "hidden");

// Game Points (0-7) - Opponent
textOpponentGamePoints = document.createElementNS(XMLNS, "text");
textOpponentGamePoints.setAttributeNS(null, "x", 1045);
textOpponentGamePoints.setAttributeNS(null, "y", 300);
textOpponentGamePoints.setAttributeNS(null, "font-size", PLAYER_NAME_AND_POINTS_FONT_SIZE);
textOpponentGamePoints.setAttributeNS(null, "font-weight", "bold");
textOpponentGamePoints.setAttributeNS(null, "fill", "black");
textOpponentGamePoints.textContent = "0";
textOpponentGamePoints.setAttributeNS(null, "visibility", "hidden");

// Room id
textRoomId = document.createElementNS(XMLNS, "text");
textRoomId.setAttributeNS(null, "x", 380);
textRoomId.setAttributeNS(null, "y", 80);
textRoomId.setAttributeNS(null, "font-size", "48px");
textRoomId.setAttributeNS(null, "fill", "black");
textRoomId.textContent = "";
//textRoomId.setAttributeNS(null, "visibility", "hidden");


// marriages(zvanja) - 20/40 - Positions 0,1,2,3
// 0 - between 1st and 2nd card, 1 between 2nd and 3rd card...
for(let i=0; i<4; i++){
    marriagesIndicator[i] = document.createElementNS(XMLNS, "text");
    marriagesIndicator[i].setAttributeNS(null, "x", MARRIAGES_0_X_POSITION + (MARRIAGES_X_DISTANCE_TO_NEXT * i));
    marriagesIndicator[i].setAttributeNS(null, "y", MARRIAGES_Y_POSITION);
    marriagesIndicator[i].setAttributeNS(null, "font-size", MARRIAGES_FONT_SIZE);
    marriagesIndicator[i].setAttributeNS(null, "fill", MARRIAGES_FONT_COLOR);
    marriagesIndicator[i].textContent = "";    
}

// unavailable(forbidden) cards - red overlay
for(let i=0; i<5; i++){
    forbiddenCardOverlay[i] = document.createElementNS(XMLNS, "rect");
    forbiddenCardOverlay[i].setAttributeNS(null, "x", cardsInHand[i].getAttribute('x'));
    forbiddenCardOverlay[i].setAttributeNS(null, "y", cardsInHand[i].getAttribute('y'));
    forbiddenCardOverlay[i].setAttributeNS(null, "rx", CARD_ROUND);
    forbiddenCardOverlay[i].setAttributeNS(null, "ry", CARD_ROUND);
    forbiddenCardOverlay[i].setAttributeNS(null, "width",  CARD_WIDTH);
    forbiddenCardOverlay[i].setAttributeNS(null, "height", CARD_HEIGHT);
    forbiddenCardOverlay[i].setAttributeNS(null, "stroke", "black");
    forbiddenCardOverlay[i].setAttributeNS(null, "stroke-width", CARD_STROKE_WIDTH);
    forbiddenCardOverlay[i].setAttributeNS(null, "stroke-opacity", CARD_STROKE_OPACITY);
    forbiddenCardOverlay[i].setAttributeNS(null, "fill", "red");
    forbiddenCardOverlay[i].setAttributeNS(null, "visibility", "hidden");
    forbiddenCardOverlay[i].setAttributeNS(null, "opacity", 0.4);
}



// ADDING ALL GUI ELEMENTS TO ARRAY
// ********************************************************************************

// player active - background color
allGuiElements.push(playerOnTurnIndicator);

// player cards
cardsInHand.forEach(card => {
    allGuiElements.push(card);
});

// opponent cards
opponentCardsInHand.forEach(card => {
    allGuiElements.push(card);
});

// played cards on the table
allGuiElements.push(cardPlayedByOpponent);
allGuiElements.push(cardPlayedByPlayer);

// trump card
allGuiElements.push(trumpCard);

// deck
cardsInDeck.forEach(card => {
    allGuiElements.push(card);
});

// won tricks - player - 1st trick
wonCardsFirstTrick.forEach(card => {
    allGuiElements.push(card);
});

// won tricks - player - other tricks
wonCardsOtherTricksCardbacks.forEach(card => {
    allGuiElements.push(card);
});

// won tricks - player - show all tricks toggled
wonCardsAllTricksDisplayed.forEach(card => {
    allGuiElements.push(card);
});

// won tricks - opponent - 1st trick
opponentWonCardsFirstTrick.forEach(card => {
    allGuiElements.push(card);
});

// won tricks - opponent - other tricks
opponentWonCardsOtherTricksCardbacks.forEach(card => {
    allGuiElements.push(card);
});

// points
allGuiElements.push(textPoints);

// game status
allGuiElements.push(textAlert);

// marriagesIndicator
marriagesIndicator.forEach(m => {
    allGuiElements.push(m);
});

// overlays
forbiddenCardOverlay.forEach(cardOverlay => {
    allGuiElements.push(cardOverlay);
});

// names, gamepoints
allGuiElements.push(textPlayerName);
allGuiElements.push(textOpponentName);
allGuiElements.push(textPlayerGamePoints);
allGuiElements.push(textOpponentGamePoints);

// room id
allGuiElements.push(textRoomId);


// APPENDING ALL ELEMENTS
// ********************************************************************************

allGuiElements.forEach(element => {
    svg.appendChild(element);
});


// FUNCTIONS
// ********************************************************************************

// Puts card in element
function putCardInElement(cardElement, cardName){
    //cardElement.setAttributeNS(null, "fill", "url(#"+cardElement.getAttribute('data-card')+")");
    cardElement.setAttributeNS(null, "data-card", cardName);
    cardElement.setAttributeNS(null, "fill", `url(#${cardName})`);
}

// Removes card from element
function removeCardFromElement(cardElement){
    cardElement.setAttributeNS(null, "data-card", "none");
    cardElement.setAttributeNS(null, "fill", "none");
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
function removeCardsStackedInDeck(numberOfCardsInDeck){
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
        marriagesIndicator[i].textContent = "";
    }

    marriages.forEach(m => {

        let position;

        switch (m.suit) {
            case "Herc":
                position = playerHand.findIndex(card => card.name === "q-herc");

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

            case "Karo":
                position = playerHand.findIndex(card => card.name === "q-karo");
                
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

            case "Pik":
                position = playerHand.findIndex(card => card.name === "q-pik");
                
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

            case "Tref":
                position = playerHand.findIndex(card => card.name === "q-tref");
                
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
    textPoints.textContent = points;
}

// Update player's and opponent's game points (0->7+)
function updatePlayerAndOpponentGamePoints(){
    textPlayerGamePoints.textContent = bummerl.gamePointsPlayer;
    textOpponentGamePoints.textContent = bummerl.gamePointsOpponent;
}

// Sets the indicator(background color) - that shows if player is on turn or not
function setPlayerOnTurnIndicator(isPlayerOnTurn){
    if(isPlayerOnTurn){
        playerOnTurnIndicator.setAttributeNS(null, "fill", "green");
    }
    else{
        playerOnTurnIndicator.setAttributeNS(null, "fill", "gray");
    }
}

// Sets the cards opacity - that shows if player is on turn or not
function setPlayerOnTurnCardsOpacity(isPlayerOnTurn){
    if(isPlayerOnTurn){
        cardsInHand.forEach(card => {
            card.style.opacity = 1;
            card.style.cursor = "default";
        });
    }
    else{
        cardsInHand.forEach(card => {
            card.style.opacity = 0.95;
            card.style.cursor = "default";
        });
    }
}

// Shows one GUI element
function showElement(element){
    element.setAttributeNS(null, "visibility", "visible");
}

// Shows an array of GUI elements
function showElements(elements){
    elements.forEach(element => {
        showElement(element);
    });
}

// Hides one GUI element
function hideElement(element){
    element.setAttributeNS(null, "visibility", "hidden");
}

// Hides an array of GUI element
function hideElements(elements){
    elements.forEach(element => {
        hideElement(element);
    });
}





// ADDING EVENT LISTENERS
// ********************************************************************************

// cards
for(let i = 0; i<5; i++){
    cardsInHand[i].addEventListener('mouseover', function () {cardHover(cardsInHand[i]);}, false);
    cardsInHand[i].addEventListener('click',     function () {playCard(cardsInHand[i]);}, false);
    cardsInHand[i].addEventListener('mouseout',  function () {cardHoverOut(cardsInHand[i]);}, false);
}

textPoints.addEventListener('mouseover', function () {toggleShowAllTricks();}, false);
textPoints.addEventListener('mouseout', function () {toggleHideAllTricks();}, false);
textPoints.style.cursor = "grabbing";