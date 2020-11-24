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
export default class Trick {
    constructor(trickNum, leadingPlayerIndex, respondingPlayerIndex, leadingCard, respondingCard, trickWinnerId, trickWinnerIndex, trickPoints) {
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
