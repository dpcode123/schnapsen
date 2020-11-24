import Card from '../model/Card.js';
const CARDS = [
    // Herc (Hearts)
    new Card('J', 'herc', 2, 'j-herc'),
    new Card('Q', 'herc', 3, 'q-herc'),
    new Card('K', 'herc', 4, 'k-herc'),
    new Card('X', 'herc', 10, 'x-herc'),
    new Card('A', 'herc', 11, 'a-herc'),
    // Karo (Diamonds)
    new Card('J', 'karo', 2, 'j-karo'),
    new Card('Q', 'karo', 3, 'q-karo'),
    new Card('K', 'karo', 4, 'k-karo'),
    new Card('X', 'karo', 10, 'x-karo'),
    new Card('A', 'karo', 11, 'a-karo'),
    // Pik (Spades)
    new Card('J', 'pik', 2, 'j-pik'),
    new Card('Q', 'pik', 3, 'q-pik'),
    new Card('K', 'pik', 4, 'k-pik'),
    new Card('X', 'pik', 10, 'x-pik'),
    new Card('A', 'pik', 11, 'a-pik'),
    // Tref (Clubs)
    new Card('J', 'tref', 2, 'j-tref'),
    new Card('Q', 'tref', 3, 'q-tref'),
    new Card('K', 'tref', 4, 'k-tref'),
    new Card('X', 'tref', 10, 'x-tref'),
    new Card('A', 'tref', 11, 'a-tref'),
];
// Gets all 20 cards
export function getAllCards() {
    return CARDS;
}
// Gets random card from deck
export function getRandomCardFromDeck(deck) {
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
 * @param cardName - Card name
 * @param playerHand - Cards in player's hand
 * @returns Position 0-4
 */
export function getCardPositionInHandByName(cardName, playerHand) {
    const position = playerHand.findIndex(object => object.name === cardName);
    return position;
}
