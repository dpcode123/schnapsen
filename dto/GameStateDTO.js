import { otherPlayer } from '../utils/util.js';

export default function(game, player) {
    
    let isThisPlayerOnTurn = false;
    let opponentWonCardsFirstTrick = [];

    // lead card player (on table)
    let leadCardOnTable = null;
    if((game.leadOrResponse === false) && game.moveBuffer){
        leadCardOnTable = game.moveBuffer.leadMove.cardName;
    }

    if(player === game.playerOnTurn){
        isThisPlayerOnTurn = true;
    }

    // only first 2 cards(1st trick) won by opponent
    opponentWonCardsFirstTrick[0] = game.wonCards[otherPlayer(player)][0];
    opponentWonCardsFirstTrick[1] = game.wonCards[otherPlayer(player)][1];

    // total number of won cards by opponent
    let opponentTotalWonCardsNumber = game.wonCards[otherPlayer(player)].length;

    const dto = {
        num: game.num,
        playerOnTurn: game.playerOnTurn,
        trumpCard: game.trumpCard,
        trumpSuit: game.trumpSuit,
        trickNum: game.trickNum,
        moveNum: game.moveNum,
        leadOrResponse: game.leadOrResponse,
        leadCardOnTable: leadCardOnTable,
        deckClosed: game.deckClosed,
        playerPoints: game.playerPoints[player],
        cardsInHand: game.cardsInHand[player],
        thisPlayerOnTurn: isThisPlayerOnTurn,
        deckSize: game.deck.length,
        playerWonCards: game.wonCards[player],
        opponentWonCardsFirstTrick: opponentWonCardsFirstTrick,
        opponentTotalWonCardsNumber: opponentTotalWonCardsNumber,
        marriagesInHand: game.marriagesInHand[player],
    };
    return dto;
}