import PlayRoom from '../model/PlayRoom.js';
import { Player } from '../ts/interfaces.js';
import { otherPlayer } from '../utils/util.js';

export default class RoomStateDTO {

    dto: any;
    player: Player | undefined;
    opponent: Player | undefined;
    playerName: string;
    opponentName: string;
    
    constructor(playRoom: PlayRoom, playerIndex: number) {

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
    
    getDTO(){
        return this.dto;
    }
}