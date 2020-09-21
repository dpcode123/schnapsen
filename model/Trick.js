/**
 * Trick
 * @param {number}trickNum  - trick number, 1-10
 * @param {number}leadingPlayer - 0 or 1; player that played first(leading) card
 * @param {number}responsePlayer - 0 or 1; player that played second(response) card
 * @param {Card} leadingCard - first(leading) card
 * @param {Card} responseCard - second(response) card
 * @param {number}trickWinnerId - id of player that has won the trick
 * @param {number}trickWinnerIndex - 0 or 1; player that has won the trick 
 * @param {number}trickPoints - 4-22; total points in trick
 */
module.exports = function Trick (trickNum, leadingPlayer, responsePlayer, leadingCard, responseCard, trickWinnerId, trickWinnerIndex, trickPoints){
    this.trickNum = trickNum;
    this.leadingPlayer = leadingPlayer;
    this.responsePlayer = responsePlayer;
    this.leadingCard = leadingCard;
    this.responseCard = responseCard;
    this.trickWinnerId = trickWinnerId;
    this.trickWinnerIndex = trickWinnerIndex;
    this.trickPoints = trickPoints;
}