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


// CONSTANTS - Namespace, positions, sizes
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
const OPPONENT_WON_TRICK_CARDS_HIDDEN_Y_POSITION = -1075;

// marriages in hand indicators
const MARRIAGES_0_X_POSITION = 130;
const MARRIAGES_X_DISTANCE_TO_NEXT = 144;
const MARRIAGES_Y_POSITION = 320;
const MARRIAGES_FONT_SIZE = '24px';
const MARRIAGES_FONT_COLOR = '#52514e';

// player name; game points(0-7)
const PLAYER_NAME_AND_POINTS_FONT_SIZE = '28px';

// card images folder
const CARD_IMG_FOLDER = '../img/schnaps-custom';


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
cardPatterns.push('cardback');

// card pattern - defs
const defs = document.getElementById('defs');

cardPatterns.forEach(card => {
    const pattern = document.createElementNS(XMLNS, 'pattern');
    const image = document.createElementNS(XMLNS, 'image');

    pattern.setAttributeNS(null, 'id', card);
    pattern.setAttributeNS(null, 'patternUnits', 'objectBoundingBox');
    pattern.setAttributeNS(null, 'width', 1);
    pattern.setAttributeNS(null, 'height', 1);

    image.setAttributeNS(null, 'href', `${CARD_IMG_FOLDER}/${card}.png`);
    image.setAttributeNS(null, 'x', 0);
    image.setAttributeNS(null, 'y', 0);
    image.setAttributeNS(null, 'width', CARD_WIDTH);
    image.setAttributeNS(null, 'height', CARD_HEIGHT);

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
// all won tricks, when 'show all' is toggled - PLAYER
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


// Change trump card button(group with rect and text)
let exchangeTrumpCardButton;
let exchangeTrumpCardRect;
let exchangeTrumpCardText;



// SVG ELEMENTS
// ********************************************************************************

// Player cards
for(let i=0; i<5; i++){
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
for(let i=0; i<5; i++){
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
for(let i = 0; i<9; i++){
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
for(let i=0; i<14; i++){
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
for(let i=0;i<5;i++){
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
for(let i=5;i<10;i++){
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
for(let i=10;i<16;i++){
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
for(let i=0; i<14; i++){
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


// TEXT - game status
textAlert = document.createElementNS(XMLNS, 'text');
textAlert.setAttributeNS(null, 'x', 150);
textAlert.setAttributeNS(null, 'y', 200);
textAlert.setAttributeNS(null, 'font-size', '72px');
textAlert.setAttributeNS(null, 'fill', 'black');
textAlert.textContent = '';
//textAlert.setAttributeNS(null, 'visibility', 'hidden');


// TEXT - Points (66)
textPoints = document.createElementNS(XMLNS, 'text');
textPoints.setAttributeNS(null, 'x', 935);
textPoints.setAttributeNS(null, 'y', 275);
textPoints.setAttributeNS(null, 'font-size', '36px');
textPoints.setAttributeNS(null, 'fill', 'black');
textPoints.textContent = '0';
textPoints.setAttributeNS(null, 'visibility', 'hidden');


// player active - background color
playerOnTurnIndicator = document.createElementNS(XMLNS, 'rect');
playerOnTurnIndicator.setAttributeNS(null, 'x', 0);
playerOnTurnIndicator.setAttributeNS(null, 'y', 0);
playerOnTurnIndicator.setAttributeNS(null, 'width',  1080);
playerOnTurnIndicator.setAttributeNS(null, 'height', 540);
playerOnTurnIndicator.setAttributeNS(null, 'fill', 'green');
playerOnTurnIndicator.setAttributeNS(null, 'fill-opacity', 0.2);
//playerOnTurnIndicator.setAttributeNS(null, 'visibility', 'hidden');

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

// Room id
textRoomId = document.createElementNS(XMLNS, 'text');
textRoomId.setAttributeNS(null, 'x', 380);
textRoomId.setAttributeNS(null, 'y', 80);
textRoomId.setAttributeNS(null, 'font-size', '48px');
textRoomId.setAttributeNS(null, 'fill', 'black');
textRoomId.textContent = '';
//textRoomId.setAttributeNS(null, 'visibility', 'hidden');


// marriages(zvanja) - 20/40 - Positions 0,1,2,3
// 0 - between 1st and 2nd card, 1 between 2nd and 3rd card...
for(let i=0; i<4; i++){
    marriagesIndicator[i] = document.createElementNS(XMLNS, 'text');
    marriagesIndicator[i].setAttributeNS(null, 'x', MARRIAGES_0_X_POSITION + (MARRIAGES_X_DISTANCE_TO_NEXT * i));
    marriagesIndicator[i].setAttributeNS(null, 'y', MARRIAGES_Y_POSITION);
    marriagesIndicator[i].setAttributeNS(null, 'font-size', MARRIAGES_FONT_SIZE);
    marriagesIndicator[i].setAttributeNS(null, 'fill', MARRIAGES_FONT_COLOR);
    marriagesIndicator[i].textContent = '';    
}

// unavailable(forbidden) cards - red overlay
for(let i=0; i<5; i++){
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

// change trump card button
exchangeTrumpCardButton = document.createElementNS(XMLNS, 'g');
exchangeTrumpCardButton.setAttributeNS(null, 'opacity', 0.3);
exchangeTrumpCardButton.setAttributeNS(null, 'visibility', 'hidden');

// rect
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

// text
exchangeTrumpCardText = document.createElementNS(XMLNS, 'text');
exchangeTrumpCardText.setAttributeNS(null, 'x', 0);
exchangeTrumpCardText.setAttributeNS(null, 'y', 0);
exchangeTrumpCardText.setAttributeNS(null, 'font-size', '48px');
exchangeTrumpCardText.setAttributeNS(null, 'fill', 'black');
exchangeTrumpCardText.textContent = '<->';

// append to group
exchangeTrumpCardButton.appendChild(exchangeTrumpCardRect);
exchangeTrumpCardButton.appendChild(exchangeTrumpCardText);

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

// names
allGuiElements.push(textPlayerName);
allGuiElements.push(textOpponentName);

// gamepoints
allGuiElements.push(textPlayerGamePoints);
allGuiElements.push(textOpponentGamePoints);

// room id
allGuiElements.push(textRoomId);

// change trump card button
allGuiElements.push(exchangeTrumpCardButton);

// bummerls lost
allGuiElements.push(textBummerlsLostPlayer);
allGuiElements.push(textBummerlsLostOpponent);



// APPEND ALL ELEMENTS
// ********************************************************************************
allGuiElements.forEach(element => {
    svg.appendChild(element);
});
