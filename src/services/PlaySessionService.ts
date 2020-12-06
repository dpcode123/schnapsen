import { signToken } from '../auth/socket_jwt.js';
import { Player } from '../ts/interfaces.js';
import { GameConnectionObject, GameSessionData } from '../ts/types.js';

export default class GameSessionService {

    constructor(){
    }

    // Generates game session data with jwt token for socket.io
    generateGameSessionData = function (player: Player, playerIndex: number, roomId: string): GameSessionData {

        // create connection object for jwt
        const gameConnectionObject: GameConnectionObject = {
            userId: player.id,
            username: player.username,
            playerInRoom: playerIndex,
            roomId: roomId,
        };

        // jwt token for socket.io connection
        const socketJwt: string = signToken(gameConnectionObject);

        // game session data
        const gameSessionData: GameSessionData = {
            username: player.username, 
            userId: player.id, 
            roomId: roomId, 
            token: socketJwt, 
            userCardFace: player.cardface_design_id,
            userCardBack: player.cardback_design_id
        };

        return gameSessionData;
    }
}