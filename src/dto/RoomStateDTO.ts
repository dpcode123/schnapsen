import { otherPlayer } from '../utils/util.js';

export default class RoomStateDTO {

    dto: any;
    
    constructor(playRoom, playerIndex) {
        this.dto = {
            room: playRoom.room,
            status: playRoom.status,
            playerName: playRoom.players[playerIndex].username,
            opponentName: playRoom.players[otherPlayer(playerIndex)].username,
            bummerlsLostPlayer: playRoom.bummerlsWon[otherPlayer(playerIndex)],
            bummerlsLostOpponent: playRoom.bummerlsWon[playerIndex],
        };
    }
    
    getDTO(){
        return this.dto;
    }
}