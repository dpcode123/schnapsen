import { otherPlayer } from '../utils/util.js';
export default class GameStateDTO {
    constructor(game, player) {
        this.isThisPlayerOnTurn = false;
        this.leadCardOnTable = undefined;
        this.opponentWonCardsFirstTrick = [];
        this.opponentTotalWonCardsNumber = 0;
        if ((game.leadOrResponse === false) && game.moveBuffer) {
            this.leadCardOnTable = game.moveBuffer.leadMove.cardName;
        }
        if (player === game.playerOnTurn) {
            this.isThisPlayerOnTurn = true;
        }
        // only first 2 cards(1st trick) won by opponent
        this.opponentWonCardsFirstTrick[0] = game.wonCards[otherPlayer(player)][0];
        this.opponentWonCardsFirstTrick[1] = game.wonCards[otherPlayer(player)][1];
        // total number of won cards by opponent
        this.opponentTotalWonCardsNumber = game.wonCards[otherPlayer(player)].length;
        this.dto = {
            num: game.num,
            playerOnTurn: game.playerOnTurn,
            trumpCard: game.trumpCard,
            trumpSuit: game.trumpSuit,
            trickNum: game.trickNum,
            moveNum: game.moveNum,
            leadOrResponse: game.leadOrResponse,
            leadCardOnTable: this.leadCardOnTable,
            deckClosed: game.deckClosed,
            playerPoints: game.playerPoints[player],
            cardsInHand: game.cardsInHand[player],
            isThisPlayerOnTurn: this.isThisPlayerOnTurn,
            deckSize: game.deck.length,
            playerWonCards: game.wonCards[player],
            opponentWonCardsFirstTrick: this.opponentWonCardsFirstTrick,
            opponentTotalWonCardsNumber: this.opponentTotalWonCardsNumber,
            marriagesInHand: game.marriagesInHand[player],
        };
    }
    getDTO() {
        return this.dto;
    }
}
