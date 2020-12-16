import { otherPlayer } from '../utils/util.js';

export default class DealStateDTO {

    dto: any;
    isThisPlayerOnTurn: boolean = false;
    leadCardOnTable: any = undefined;
    opponentWonCardsFirstTrick: any[] = [];
    opponentTotalWonCardsNumber: number = 0;

    constructor(deal, player){
        
        if ((deal.leadOrResponse === false) && deal.moveBuffer) {
            this.leadCardOnTable = deal.moveBuffer.leadMove.cardName;
        }
    
        if (player === deal.playerOnTurn) {
            this.isThisPlayerOnTurn = true;
        }
    
        // only first 2 cards(1st trick) won by opponent
        this.opponentWonCardsFirstTrick[0] = deal.wonCards[otherPlayer(player)][0];
        this.opponentWonCardsFirstTrick[1] = deal.wonCards[otherPlayer(player)][1];
    
        // total number of won cards by opponent
        this.opponentTotalWonCardsNumber = deal.wonCards[otherPlayer(player)].length;
        
        this.dto = {
            num: deal.num,
            playerOnTurn: deal.playerOnTurn,
            trumpCard: deal.trumpCard,
            trumpSuit: deal.trumpSuit,
            trickNum: deal.trickNum,
            moveNum: deal.moveNum,
            leadOrResponse: deal.leadOrResponse,
            leadCardOnTable: this.leadCardOnTable,
            deckClosed: deal.deckClosed,
            playerPoints: deal.playerPoints[player],
            cardsInHand: deal.cardsInHand[player],
            isThisPlayerOnTurn: this.isThisPlayerOnTurn,
            deckSize: deal.deck.length,
            playerWonCards: deal.wonCards[player],
            opponentWonCardsFirstTrick: this.opponentWonCardsFirstTrick,
            opponentTotalWonCardsNumber: this.opponentTotalWonCardsNumber,
            marriagesInHand: deal.marriagesInHand[player],
        };
    }

    getDTO(){
        return this.dto;
    }
    
    
    

    
    

    
}