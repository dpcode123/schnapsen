import { otherPlayer } from '../utils/util.js';
export default class RoomStateDTO {
    constructor(playRoom, playerIndex) {
        this.player = playRoom.players[playerIndex];
        this.opponent = playRoom.players[otherPlayer(playerIndex)];
        this.playerName = '';
        this.opponentName = '';
        if (this.player) {
            this.playerName = this.player.username;
        }
        if (this.opponent) {
            this.opponentName = this.opponent.username;
        }
        this.dto = {
            room: playRoom.room,
            status: playRoom.status,
            playerName: this.playerName,
            opponentName: this.opponentName,
            bummerlsLostPlayer: playRoom.bummerlsWon[otherPlayer(playerIndex)],
            bummerlsLostOpponent: playRoom.bummerlsWon[playerIndex],
        };
    }
    getDTO() {
        return this.dto;
    }
}
