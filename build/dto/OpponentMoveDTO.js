export default class OpponentMoveDTO {
    constructor(moveType, trickNum, moveNum, cardName, marriagePoints, validRespondingCards) {
        this.dto = {
            moveType: moveType,
            trickNum: trickNum,
            moveNum: moveNum,
            cardName: cardName,
            marriagePoints: marriagePoints,
            validRespondingCards: validRespondingCards
        };
    }
    getDTO() {
        return this.dto;
    }
}
