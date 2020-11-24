/**
 * Trick
 * @param trickNum  - trick number, 1-10
 * @param leadingPlayerIndex - 0 or 1; player that played first(leading) card
 * @param respondingPlayerIndex - 0 or 1; player that played second(response) card
 * @param leadingCard - first(leading) card
 * @param respondingCard - second(response) card
 * @param trickWinnerId - id of player that won the trick
 * @param trickWinnerIndex - 0 or 1; player that won the trick 
 * @param trickPoints - 4-22; total points in trick
 */

import Card from "./Card";

export default class Trick {
    trickNum: number;
    leadingPlayerIndex: number;
    respondingPlayerIndex: number;
    leadingCard: Card;
    respondingCard: Card;
    trickWinnerId: number;
    trickWinnerIndex: number;
    trickPoints: number;

    constructor(
        trickNum: number, 
        leadingPlayerIndex: number, respondingPlayerIndex: number, 
        leadingCard: Card, respondingCard: Card, 
        trickWinnerId: number, trickWinnerIndex: number, 
        trickPoints: number) {
            
            this.trickNum = trickNum;
            this.leadingPlayerIndex = leadingPlayerIndex;
            this.respondingPlayerIndex = respondingPlayerIndex;
            this.leadingCard = leadingCard;
            this.respondingCard = respondingCard;
            this.trickWinnerId = trickWinnerId;
            this.trickWinnerIndex = trickWinnerIndex;
            this.trickPoints = trickPoints;
    }
}
