import { getCardByName } from "../schnaps/cards.js";
import { getPlayerIndexInRoomByUserId } from "../utils/util.js";
export default class MoveValidationService {
    constructor(io, socket) {
        // Validate move - exchange trump
        // - if state is 'waitingForMove'
        // - if there are cards in deck
        // - if deck is not closed by player
        // - if move is leading
        this.exchangeTrump = (move, playRoom) => {
            if (playRoom.game.moveBuffer.state === 'waitingForMove' &&
                playRoom.game.deck.length > 0 &&
                playRoom.game.deckClosedByPlayer === undefined &&
                move.leadOrResponse === true) {
                return true;
            }
            return false;
        };
        // Validate move - close deck
        // - if state is 'waitingForMove'
        // - if there are cards in deck
        // - if move is leading
        this.closeDeck = (move, playRoom) => {
            if (playRoom.game.moveBuffer.state === 'waitingForMove' &&
                playRoom.game.deck.length > 0 &&
                move.leadOrResponse === true) {
                return true;
            }
            return false;
        };
        // Validate move - play card
        // - if state is 'waitingForMove'
        // - if that card is in players hand
        // - if player is on turn
        this.playCard = (move, playRoom) => {
            var _a, _b, _c;
            (_a = playRoom.game) === null || _a === void 0 ? void 0 : _a.playerOnTurn;
            const playerIndex = getPlayerIndexInRoomByUserId(playRoom, move.userId);
            const playedCard = getCardByName(move.cardName);
            let isCardInPlayersHand;
            let isPlayerOnTurn;
            if (playerIndex !== undefined && playedCard) {
                const cardsInPlayersHand = (_b = playRoom.game) === null || _b === void 0 ? void 0 : _b.cardsInHand[playerIndex];
                isCardInPlayersHand = cardsInPlayersHand === null || cardsInPlayersHand === void 0 ? void 0 : cardsInPlayersHand.some(c => c === playedCard);
            }
            if (playerIndex !== undefined && ((_c = playRoom.game) === null || _c === void 0 ? void 0 : _c.playerOnTurn) === playerIndex) {
                isPlayerOnTurn = true;
            }
            if (playRoom.game.moveBuffer.state === 'waitingForMove' &&
                isCardInPlayersHand &&
                isPlayerOnTurn) {
                return true;
            }
            return false;
        };
        this.io = io;
        this.socket = socket;
    }
}
