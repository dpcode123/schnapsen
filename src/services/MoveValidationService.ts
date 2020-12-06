import Card from "../model/Card.js";
import PlayRoom from "../model/PlayRoom.js";
import { getCardByName } from "../schnaps/cards.js";
import { PlayerMove } from "../ts/types.js";
import { getPlayerIndexInRoomByUserId } from "../utils/util.js";

export default class MoveValidationService {
    io: any;
    socket: any;

    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    // Validate move - exchange trump
    // - if state is 'waitingForMove'
    // - if there are cards in deck
    // - if deck is not closed by player
    // - if move is leading
    exchangeTrump = (move: PlayerMove, playRoom: PlayRoom): boolean => {
        if (playRoom.game!.moveBuffer.state === 'waitingForMove' &&
            playRoom.game!.deck.length > 0 &&
            playRoom.game!.deckClosedByPlayer === undefined &&    
            move.leadOrResponse === true) {
                return true;
        }
        return false;
    }

    // Validate move - close deck
    // - if state is 'waitingForMove'
    // - if there are cards in deck
    // - if move is leading
    closeDeck = (move: PlayerMove, playRoom: PlayRoom): boolean => {
        if (playRoom.game!.moveBuffer.state === 'waitingForMove' &&
            playRoom.game!.deck.length > 0 &&    
            move.leadOrResponse === true) {                
                return true;
        }
        return false;
    }

    // Validate move - play card
    // - if state is 'waitingForMove'
    // - if that card is in players hand
    // - if player is on turn
    playCard = (move: PlayerMove, playRoom: PlayRoom): boolean => {

        playRoom.game?.playerOnTurn

        const playerIndex: number | undefined = getPlayerIndexInRoomByUserId(playRoom, move.userId);
        const playedCard: Card | undefined = getCardByName(move.cardName);
        let isCardInPlayersHand: boolean | undefined;
        let isPlayerOnTurn: boolean | undefined;

        if (playerIndex !== undefined && playedCard){
            const cardsInPlayersHand: Card[] | undefined = playRoom.game?.cardsInHand[playerIndex];
            isCardInPlayersHand = cardsInPlayersHand?.some(c => c === playedCard);
        }

        if (playerIndex !== undefined && playRoom.game?.playerOnTurn === playerIndex) {
            isPlayerOnTurn = true;
        }


        if (playRoom.game!.moveBuffer.state === 'waitingForMove' &&
            isCardInPlayersHand && 
            isPlayerOnTurn) {
                return true;
        }
        return false;
        
    }

}
