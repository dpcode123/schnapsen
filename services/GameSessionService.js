import { signToken } from '../auth/socket_jwt.js';
export default class GameSessionService {
    constructor() {
        // Generates game session data with jwt token for socket.io
        this.generateGameSessionData = function(player, playerIndex, roomId) {
            
            // create connection object for jwt
            const connectionObject = {
                userId: player.id,
                username: player.username,
                playerInRoom: playerIndex,      // 0 or 1
                roomId: roomId,
            };

            // jwt token for socket.io connection
            const socketJwt = signToken(connectionObject);

            // game session data
            const gameSessionData = {u: player.username, i: player.id, r: roomId, t: socketJwt};
            
            return gameSessionData;
        }
    }
}