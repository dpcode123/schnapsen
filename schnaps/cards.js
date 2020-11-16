import Card from '../model/Card.js';
const CARDS = [];

// Herc
CARDS.push(new Card('J', 'herc', 2, 'j-herc'));
CARDS.push(new Card('Q', 'herc', 3, 'q-herc'));
CARDS.push(new Card('K', 'herc', 4, 'k-herc'));
CARDS.push(new Card('X', 'herc', 10, 'x-herc'));
CARDS.push(new Card('A', 'herc', 11, 'a-herc'));

// Karo
CARDS.push(new Card('J', 'karo', 2, 'j-karo'));
CARDS.push(new Card('Q', 'karo', 3, 'q-karo'));
CARDS.push(new Card('K', 'karo', 4, 'k-karo'));
CARDS.push(new Card('X', 'karo', 10, 'x-karo'));
CARDS.push(new Card('A', 'karo', 11, 'a-karo'));

// Pik
CARDS.push(new Card('J', 'pik', 2, 'j-pik'));
CARDS.push(new Card('Q', 'pik', 3, 'q-pik'));
CARDS.push(new Card('K', 'pik', 4, 'k-pik'));
CARDS.push(new Card('X', 'pik', 10, 'x-pik'));
CARDS.push(new Card('A', 'pik', 11, 'a-pik'));

// Tref
CARDS.push(new Card('J', 'tref', 2, 'j-tref'));
CARDS.push(new Card('Q', 'tref', 3, 'q-tref'));
CARDS.push(new Card('K', 'tref', 4, 'k-tref'));
CARDS.push(new Card('X', 'tref', 10, 'x-tref'));
CARDS.push(new Card('A', 'tref', 11, 'a-tref'));


// Gets all 20 cards
export function getAllCards() {
    return CARDS;
}

// Gets random card from deck
export function randomCard(deck) {
    return deck[Math.floor(Math.random() * deck.length)];
}

// Gets card by name
export function getCardByName(cardName) {
    const card = CARDS.find(object => object.name === cardName);
    return card;
}

// Removes card from deck
export function removeCardFromDeck(card, deck) {
    deck.splice(deck.findIndex(object => object === card), 1);
}

/**
 * Gets card's position in hand by card name
 * @param {*} cardName 
 * @param {*} playerHand 
 * @returns {number} position 0-4 
 */
export function getCardPositionInHandByName(cardName, playerHand) {
    const position = playerHand.findIndex(object => object.name === cardName);
    return position;
}
