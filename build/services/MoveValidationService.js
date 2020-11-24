export default class MoveValidationService {
    constructor(io, socket) {
        // Validate move - exchange trump
        this.exchangeTrump = (move, playRoom) => {
            if (playRoom.game.moveBuffer.state === 'waitingForMove') {
                if (playRoom.game.deck.length > 0) {
                    return true;
                }
            }
            return false;
        };
        // Validate move - close deck
        this.closeDeck = (move, playRoom) => {
            if (playRoom.game.moveBuffer.state === 'waitingForMove') {
                return true;
            }
            return false;
        };
        // Validate move - play card
        this.playCard = (move, playRoom) => {
            if (playRoom.game.moveBuffer.state === 'waitingForMove') {
                return true;
            }
            return false;
        };
        this.io = io;
        this.socket = socket;
    }
}
