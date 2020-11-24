import { getCardByName } from './cards.js';
/**
 * @description CALCULATES TRICK WINNER
 * @param trumpSuit - Trump suit in current game
 * @param leadingMove - First play in trick
 * @param respondingMove - Second play in trick
 * @returns User id
 *
 * - Lead NOT trump
 *      - Response NOT trump
 *          - Same suits
 *                  ===> {compare values}
 *          - Diff suits
 *                  ===> {L win}
 *      - Response TRUMP
 *              ===> {R win}
 *
 * - Lead TRUMP
 *      - Response NOT trump
 *              ===> {L win}
 *      - Response TRUMP
 *              ===> {compare values}
 *
 */
export function calculateTrickWinner(trumpSuit, leadingMove, respondingMove) {
    const leadingCard = getCardByName(leadingMove.cardName);
    const respondingCard = getCardByName(respondingMove.cardName);
    let isLeadingCardTrump;
    let isRespondingCardTrump;
    let winnerUserId = 0;
    // check if leading card is trump
    if (leadingCard.suit === trumpSuit) {
        isLeadingCardTrump = true;
    }
    else {
        isLeadingCardTrump = false;
    }
    // check if responding card is trump
    if (respondingCard.suit === trumpSuit) {
        isRespondingCardTrump = true;
    }
    else {
        isRespondingCardTrump = false;
    }
    //### Lead NOT trump
    if (!isLeadingCardTrump) {
        //### Response NOT trump
        if (!isRespondingCardTrump) {
            //### Same suits
            if (leadingCard.suit === respondingCard.suit) {
                // {compare values}
                if (leadingCard.points > respondingCard.points) {
                    winnerUserId = leadingMove.userId;
                }
                else {
                    winnerUserId = respondingMove.userId;
                }
            }
            //### Diff suits
            else {
                //{L win}
                winnerUserId = leadingMove.userId;
            }
        }
        //### Response TRUMP
        else if (isRespondingCardTrump) {
            //{R win}
            winnerUserId = respondingMove.userId;
        }
    }
    //### Lead TRUMP
    else if (isLeadingCardTrump) {
        //### Response NOT
        if (!isRespondingCardTrump) {
            // {L win}
            winnerUserId = leadingMove.userId;
        }
        //### Response TRUMP
        else if (isRespondingCardTrump) {
            // {compare values}
            if (leadingCard.points > respondingCard.points) {
                winnerUserId = leadingMove.userId;
            }
            else {
                winnerUserId = respondingMove.userId;
            }
        }
    }
    return winnerUserId;
}
/**
 * CALCULATES TRICK POINTS
 *
 * @param leadingMove - first play in trick
 * @param respondingMove - second play in trick
 * @returns Trick points (sum of both cards' points)
 */
export function calculateTrickPoints(leadingMove, respondingMove) {
    const leadingCard = getCardByName(leadingMove.cardName);
    const respondingCard = getCardByName(respondingMove.cardName);
    const points = leadingCard.points + respondingCard.points;
    return points;
}
/**
 * Checks for marriages (hr. "zvanja") in player's hand
 * - check if player has marriages in hand
 * - 20 or 40 - check if marriage pair is in trump suit
 * @param playerHand - Cards in player's hand
 * @param trumpSuit - Trump suit (hr. adut)
 * @returns Array of objects with suits in which player has marriage and 20/40 point values
 */
export function checkForMarriagesInHand(playerHand, trumpSuit) {
    const marriagesInHand = [];
    // Queen and King pair in same suit
    const marriageHearts = [getCardByName('q-herc'), getCardByName('k-herc')];
    const marriageDiamonds = [getCardByName('q-karo'), getCardByName('k-karo')];
    const marriageSpades = [getCardByName('q-pik'), getCardByName('k-pik')];
    const marriageClubs = [getCardByName('q-tref'), getCardByName('k-tref')];
    // check if all of the elements(both cards in pair) exist in array(playerHand)
    const hasMarriageHearts = marriageHearts.every(card => playerHand.includes(card));
    const hasMarriageDiamonds = marriageDiamonds.every(card => playerHand.includes(card));
    const hasMarriageSpades = marriageSpades.every(card => playerHand.includes(card));
    const hasMarriageClubs = marriageClubs.every(card => playerHand.includes(card));
    // add marriage(s) suit and points to array if there are any
    if (hasMarriageHearts) {
        if (trumpSuit === 'herc') {
            marriagesInHand.push({ suit: 'herc', points: 40 });
        }
        else {
            marriagesInHand.push({ suit: 'herc', points: 20 });
        }
    }
    ;
    if (hasMarriageDiamonds) {
        if (trumpSuit === 'karo') {
            marriagesInHand.push({ suit: 'karo', points: 40 });
        }
        else {
            marriagesInHand.push({ suit: 'karo', points: 20 });
        }
    }
    ;
    if (hasMarriageSpades) {
        if (trumpSuit === 'pik') {
            marriagesInHand.push({ suit: 'pik', points: 40 });
        }
        else {
            marriagesInHand.push({ suit: 'pik', points: 20 });
        }
    }
    ;
    if (hasMarriageClubs) {
        if (trumpSuit === 'tref') {
            marriagesInHand.push({ suit: 'tref', points: 40 });
        }
        else {
            marriagesInHand.push({ suit: 'tref', points: 20 });
        }
    }
    ;
    return marriagesInHand;
}
export function checkPlayedCardMarriagePoints(card, marriagesInHand) {
    let marriagePoints = 0;
    if (marriagesInHand.length > 0 && (card.tier === 'Q' || card.tier === 'K')) {
        marriagesInHand.forEach(marriage => {
            if (marriage.suit === card.suit) {
                marriagePoints = marriage.points;
            }
        });
    }
    return marriagePoints;
}
/**
 * @description CALCULATES VALID RESPONDING CARDS
 * @param leadingCard - First(leading) card in trick
 * @param cardsInRespondingHand - Cards in other player's hand
 * @param trumpSuit - Trump suit in current game
 * @param isDeckClosed - Is deck in current game closed
 * @param deckLength - Number of cards in deck
 * @returns Cards that player is allowed to play
 *
 * # Deck CLOSED(or out of cards)
 *
 *      ## Player has SAME SUIT card
 *          ### Has stronger same suit card
 *              ===> {play stronger same suit card}
 *          ### Doesnt have stronger same suit
 *              ===> {play weaker same suit card}
 *
 *      ## Player doesnt have same suit
 *          ### Has TRUMPS
 *              ===> {play any trump}
 *          ### NO trumps
 *              ===> {play any card}
 *
 * # Deck NOT closed
 *      ===> {play any card}
 *
 */
export function calculateValidRespondingCards(leadingCard, cardsInRespondingHand, trumpSuit, isDeckClosed, deckLength) {
    // cards that player can play as a responding card                                                
    let validRespondingCards = [];
    // responding player has same suit card in hand
    const hasSameSuit = cardsInRespondingHand.some(c => c.suit === leadingCard.suit);
    // cards of same suit in responding player's hand
    const sameSuitCards = cardsInRespondingHand.filter(c => c.suit === leadingCard.suit);
    // responding player has stronger same suit card in hand
    const hasStrongerSameSuit = cardsInRespondingHand.some(c => c.suit === leadingCard.suit && c.points > leadingCard.points);
    // stronger cards of same suit in responding player's hand
    const strongerSameSuitCards = cardsInRespondingHand.filter(c => c.suit === leadingCard.suit && c.points > leadingCard.points);
    // responding player has trump in hand
    const hasTrump = cardsInRespondingHand.some(c => c.suit === trumpSuit);
    // trump cards in responding player's hand
    const trumpCards = cardsInRespondingHand.filter(c => c.suit === trumpSuit);
    if (isDeckClosed || deckLength === 0) {
        if (hasSameSuit) {
            if (hasStrongerSameSuit) {
                // ===> {play stronger same suit card}
                validRespondingCards = strongerSameSuitCards;
            }
            else {
                // ===> {play weaker same suit card}
                validRespondingCards = sameSuitCards;
            }
        }
        else {
            if (hasTrump) {
                // ===> {play any trump}
                validRespondingCards = trumpCards;
            }
            else {
                // ===> {play any card}
                validRespondingCards = cardsInRespondingHand;
            }
        }
    }
    else {
        // ===> {play any card}
        validRespondingCards = cardsInRespondingHand;
    }
    return validRespondingCards;
}
