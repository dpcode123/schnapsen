import Card from "../model/Card";
import { MoveType } from "../ts/types";

export default class OpponentMoveDTO {
    
    dto: any;

    constructor(moveType: MoveType, trickNum: number, moveNum: number, cardName: string, marriagePoints: number, validRespondingCards: Card[] | string){
        this.dto = {
            moveType: moveType,
            trickNum: trickNum,
            moveNum: moveNum,
            cardName: cardName,
            marriagePoints: marriagePoints,
            validRespondingCards: validRespondingCards
        };
    }

    getDTO(){
        return this.dto;
    }
}