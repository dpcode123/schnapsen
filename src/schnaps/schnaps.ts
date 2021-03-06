import Card from '../model/Card.js';
import { CardsMarriage, PlayerMove } from '../ts/types.js';
import { getCardByName } from './cards.js';

/**
 * @description CALCULATES TRICK WINNER
 * @param trumpSuit - Trump suit in current deal
 * @param leadingMove - First play in trick
 * @param respondingMove - Second play in trick
 * @returns User id
 * 
 * - Lead NOT trump
 *      - Response NOT trump
 *          - Same suits
 *                  ===> {compare values}
 *          - Different suits
 *                  ===> {L win}
 *      - Response IS trump
 *              ===> {R win}
 * 
 * - Lead IS trump
 *      - Response NOT trump
 *              ===> {L win}
 *      - Response IS trump
 *              ===> {compare values}
 * 
 */
export function calculateTrickWinner(trumpSuit: string, leadingMove: PlayerMove, respondingMove: PlayerMove): number {

    const leadingCard: Card | undefined = getCardByName(leadingMove.cardName);
    const respondingCard: Card | undefined = getCardByName(respondingMove.cardName);

    let isLeadingCardTrump: boolean;
    let isRespondingCardTrump: boolean;
    let winnerUserId: number = 0;

    // check if leading card is trump
    if (leadingCard?.suit === trumpSuit) {
        isLeadingCardTrump = true;
    } else {
        isLeadingCardTrump = false;
    }
    // check if responding card is trump
    if (respondingCard?.suit === trumpSuit) {
        isRespondingCardTrump = true;
    } else {
        isRespondingCardTrump = false;
    }

    //### Lead NOT trump
    if (!isLeadingCardTrump) {
        //### Response NOT trump
        if (!isRespondingCardTrump) {
            //### Same suits
            if (leadingCard?.suit === respondingCard?.suit) {
                // {compare values}
                if (leadingCard?.points! > respondingCard?.points!) {
                    winnerUserId = leadingMove.userId;
                } else {
                    winnerUserId = respondingMove.userId;
                }
            }
            //### Different suits
            else {
                // {L win}
                winnerUserId = leadingMove.userId;
            }
        }
        //### Response IS trump
        else if (isRespondingCardTrump) {
            // {R win}
            winnerUserId = respondingMove.userId;
        }
    }
    //### Lead IS trump
    else if (isLeadingCardTrump) {
        //### Response NOT trump
        if (!isRespondingCardTrump) {
            // {L win}
            winnerUserId = leadingMove.userId;
        }
        //### Response IS trump
        else if (isRespondingCardTrump) {
            // {compare values}
            if (leadingCard?.points! > respondingCard?.points!) {
                winnerUserId = leadingMove.userId;
            } else {
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
export function calculateTrickPoints(leadingMove: PlayerMove, respondingMove: PlayerMove): number {

    const leadingCard: Card | undefined = getCardByName(leadingMove.cardName);
    const respondingCard: Card | undefined = getCardByName(respondingMove.cardName);

    const points: number = leadingCard?.points! + respondingCard?.points!;

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
export function checkForMarriagesInHand(playerHand: Card[], trumpSuit: string): CardsMarriage[] {

    const marriagesInHand: CardsMarriage[] = [];

    // Queen and King pair in same suit
    const marriageHearts: [Card, Card] = [getCardByName('q-herc')!, getCardByName('k-herc')!];
    const marriageDiamonds: [Card, Card] = [getCardByName('q-karo')!, getCardByName('k-karo')!];
    const marriageSpades: [Card, Card] = [getCardByName('q-pik')!, getCardByName('k-pik')!];
    const marriageClubs: [Card, Card] = [getCardByName('q-tref')!, getCardByName('k-tref')!];

    // check if all of the elements(both cards in pair) exist in array(playerHand)
    const hasMarriageHearts: boolean = marriageHearts.every(card => playerHand.includes(card));
    const hasMarriageDiamonds: boolean = marriageDiamonds.every(card => playerHand.includes(card));
    const hasMarriageSpades: boolean = marriageSpades.every(card => playerHand.includes(card));
    const hasMarriageClubs: boolean = marriageClubs.every(card => playerHand.includes(card));

    // add marriage(s) suit and points to array if there are any
    if (hasMarriageHearts) {
        let points = (trumpSuit === 'herc') ? 40 : 20;
        marriagesInHand.push({suit: 'herc', points: points});
    };

    if (hasMarriageDiamonds) {
        let points = (trumpSuit === 'karo') ? 40 : 20;
        marriagesInHand.push({suit: 'karo', points: points});
    };

    if (hasMarriageSpades) {
        let points = (trumpSuit === 'pik') ? 40 : 20;
        marriagesInHand.push({suit: 'pik', points: points});
    };

    if (hasMarriageClubs) {
        let points = (trumpSuit === 'tref') ? 40 : 20;
        marriagesInHand.push({suit: 'tref', points: points});
    };

    return marriagesInHand;
}


export function checkPlayedCardMarriagePoints(card: Card | undefined, marriagesInHand: CardsMarriage[]): number {

    let marriagePoints: number = 0;

    if (marriagesInHand.length > 0 && (card?.tier === 'Q' || card?.tier === 'K' )) {

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
 * @param trumpSuit - Trump suit in current deal
 * @param isDeckClosed - Is deck in current deal closed
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
export function calculateValidRespondingCards(
        leadingCard: Card | undefined, 
        cardsInRespondingHand: Card[], 
        trumpSuit: string, 
        isDeckClosed: boolean, 
        deckLength: number
    ): Card[] {

    // cards that player can play as a responding card                                                
    let validRespondingCards: Card[] = [];

    // responding player has same suit card in hand
    const hasSameSuit: boolean = cardsInRespondingHand.some(c => c.suit === leadingCard?.suit);
    // cards of same suit in responding player's hand
    const sameSuitCards: Card[] = cardsInRespondingHand.filter(c => c.suit === leadingCard?.suit);

    // responding player has stronger same suit card in hand
    const hasStrongerSameSuit: boolean = cardsInRespondingHand.some(c => c.suit === leadingCard?.suit && c.points > leadingCard?.points);
    // stronger cards of same suit in responding player's hand
    const strongerSameSuitCards: Card[] = cardsInRespondingHand.filter(c => c.suit === leadingCard?.suit && c.points > leadingCard?.points);

    // responding player has trump in hand
    const hasTrump = cardsInRespondingHand.some(c => c.suit === trumpSuit);
    // trump cards in responding player's hand
    const trumpCards = cardsInRespondingHand.filter(c => c.suit === trumpSuit);

    if (isDeckClosed || deckLength === 0) {
        if (hasSameSuit) {
            if (hasStrongerSameSuit) {
                // ===> {play stronger same suit card}
                validRespondingCards = strongerSameSuitCards;
            } else {
                // ===> {play weaker same suit card}
                validRespondingCards = sameSuitCards;
            }
        } else {
            if (hasTrump) {
                // ===> {play any trump}
                validRespondingCards = trumpCards;
            } else {
                // ===> {play any card}
                validRespondingCards = cardsInRespondingHand;
            }
        }
    } else {
        // ===> {play any card}
        validRespondingCards = cardsInRespondingHand;
    }
    
    return validRespondingCards;
}
