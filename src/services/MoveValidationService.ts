import PlayRoom from "../model/PlayRoom";
import { PlayerMove } from "../ts/types";

export default class MoveValidationService {
    io: any;
    socket: any;

    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    // Validate move - exchange trump
    exchangeTrump = (move: PlayerMove, playRoom: PlayRoom): boolean => {
        if (playRoom.game!.moveBuffer.state === 'waitingForMove') {
            return true;
        }
        return false;
        
    }

    // Validate move - close deck
    closeDeck = (move: PlayerMove, playRoom: PlayRoom): boolean => {
        if (playRoom.game!.moveBuffer.state === 'waitingForMove') {
            return true;
        }
        return false;
    }

    // Validate move - play card
    playCard = (move: PlayerMove, playRoom: PlayRoom): boolean => {
        if (playRoom.game!.moveBuffer.state === 'waitingForMove') {
            return true;
        }
        return false;
        

    }


}
