const Card = require('../model/Card.js');
const CARDS = [];

// Herc
CARDS.push(new Card("J", "Herc", 2, "j-herc"));
CARDS.push(new Card("Q", "Herc", 3, "q-herc"));
CARDS.push(new Card("K", "Herc", 4, "k-herc"));
CARDS.push(new Card("X", "Herc", 10, "x-herc"));
CARDS.push(new Card("A", "Herc", 11, "a-herc"));

// Karo
CARDS.push(new Card("J", "Karo", 2, "j-karo"));
CARDS.push(new Card("Q", "Karo", 3, "q-karo"));
CARDS.push(new Card("K", "Karo", 4, "k-karo"));
CARDS.push(new Card("X", "Karo", 10, "x-karo"));
CARDS.push(new Card("A", "Karo", 11, "a-karo"));

// Pik
CARDS.push(new Card("J", "Pik", 2, "j-pik"));
CARDS.push(new Card("Q", "Pik", 3, "q-pik"));
CARDS.push(new Card("K", "Pik", 4, "k-pik"));
CARDS.push(new Card("X", "Pik", 10, "x-pik"));
CARDS.push(new Card("A", "Pik", 11, "a-pik"));

// Tref
CARDS.push(new Card("J", "Tref", 2, "j-tref"));
CARDS.push(new Card("Q", "Tref", 3, "q-tref"));
CARDS.push(new Card("K", "Tref", 4, "k-tref"));
CARDS.push(new Card("X", "Tref", 10, "x-tref"));
CARDS.push(new Card("A", "Tref", 11, "a-tref"));


// Gets all 20 cards
function getAllCards(){
    return CARDS;
}

// Gets random card from deck
function randomCard(deck) {
    return deck[Math.floor(Math.random() * deck.length)];
}

// Gets Card by name
function getCardByName(cardName){
    card = CARDS.find(object => object.name === cardName);
    return card;
}

// Removes card from deck
function removeCardFromDeck(card, deck){
    deck.splice(deck.findIndex(object => object === card), 1);
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








module.exports = {
    getAllCards,
    randomCard,
    getCardByName,
    removeCardFromDeck,
    getCardPositionInHandByName
}