/**
 * Trick
 * @param {number}trickNum  - trick number, 1-10
 * @param {number}leadingPlayer - 0 or 1; player that played first(leading) card
 * @param {number}respondingPlayer - 0 or 1; player that played second(response) card
 * @param {Card} leadingCard - first(leading) card
 * @param {Card} responseCard - second(response) card
 * @param {string}trickWinnerId - id of player that has won the trick
 * @param {number}trickWinnerIndex - 0 or 1; player that has won the trick 
 * @param {number}trickPoints - 4-22; total points in trick
 */



export default class Trick {
    constructor(trickNum, leadingPlayer, respondingPlayer, leadingCard, responseCard, trickWinnerId, trickWinnerIndex, trickPoints) {
    this.trickNum = trickNum;
    this.leadingPlayer = leadingPlayer;
    this.respondingPlayer = respondingPlayer;
    this.leadingCard = leadingCard;
    this.responseCard = responseCard;
    this.trickWinnerId = trickWinnerId;
    this.trickWinnerIndex = trickWinnerIndex;
    this.trickPoints = trickPoints;
    }
}
