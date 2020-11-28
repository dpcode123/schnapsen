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
        this.playCard = (move, playRoom) => {
            var _a;
            const playerIndex = getPlayerIndexInRoomByUserId(playRoom, move.userId);
            const playedCard = getCardByName(move.cardName);
            let isCardInPlayersHand;
            console.log(playerIndex);
            console.log(playedCard);
            if (playerIndex !== undefined && playedCard) {
                const cardsInPlayersHand = (_a = playRoom.game) === null || _a === void 0 ? void 0 : _a.cardsInHand[playerIndex];
                isCardInPlayersHand = cardsInPlayersHand === null || cardsInPlayersHand === void 0 ? void 0 : cardsInPlayersHand.some(c => c === playedCard);
                console.log('true');
            }
            if (playRoom.game.moveBuffer.state === 'waitingForMove' &&
                isCardInPlayersHand) {
                return true;
            }
            return false;
        };
        this.io = io;
        this.socket = socket;
    }
}
