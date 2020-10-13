/**
 * Opponent move DTO
 * @param {string} moveType - playCard, exchangeTrumpCard, closeDeck, foldHand
 * @param {number} trickNum - 0...10
 * @param {number} moveNum - 0...n(11)
 * @param {string} cardName 
 * @param {number} marriagePoints - 0, 20 or 40
 * @param {array} validRespondingCards - array of cards
 */
module.exports = function(moveType, trickNum, moveNum, cardName, marriagePoints, validRespondingCards) {

    const dto = {
        moveType: moveType,
        trickNum: trickNum,
        moveNum: moveNum,
        cardName: cardName,
        marriagePoints: marriagePoints,
        validRespondingCards: validRespondingCards
    };

    return dto;
}