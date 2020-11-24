import { signToken } from '../auth/socket_jwt.js';
export default class GameSessionService {
    constructor() {
        // Generates game session data with jwt token for socket.io
        this.generateGameSessionData = function (player, playerIndex, roomId) {
            // create connection object for jwt
            const gameConnectionObject = {
                userId: player.id,
                username: player.username,
                playerInRoom: playerIndex,
                roomId: roomId,
            };
            // jwt token for socket.io connection
            const socketJwt = signToken(gameConnectionObject);
            // game session data
            const gameSessionData = { u: player.username, i: player.id, r: roomId, t: socketJwt };
            return gameSessionData;
        };
    }
}
