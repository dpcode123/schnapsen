import RoomService from './RoomService.js';
import { signToken } from '../auth/socket_jwt.js';
import { getPlayerIndexInRoomBySocketId } from '../utils/util.js';
const roomService = new RoomService();
export default class GameSessionService {
    constructor(io) {
        this.io = io;
    }
    // Generates game session data with jwt token for socket.io
    generateGameSessionData(player, playerIndex, roomId) {
        // create connection object for jwt
        const connectionObject = {
            userId: player.id,
            username: player.username,
            playerInRoom: playerIndex,
            roomId: roomId,
        };
        // jwt token for socket.io connection
        const socketJwt = signToken(connectionObject);
        // game session data
        const gameSessionData = { u: player.username, i: player.id, r: roomId, t: socketJwt };
        return gameSessionData;
    }
    disconnect(socketId) {
        try {
            const playRoom = roomService.getRoomByPlayersSocketId(socketId);
            if (playRoom) {
                const playerIndex = getPlayerIndexInRoomBySocketId(playRoom, socketId);
                if (playerIndex) {
                    // change player's socketId
                    playRoom.players[playerIndex].socketId = 'disconnected';
                    // wait few seconds for eventual client reconnection (on client page refresh)
                    // if still disconnected destroy play room
                    setTimeout(function (io) {
                        if (playRoom.players[playerIndex].socketId === 'disconnected') {
                            // set room status to finished
                            playRoom.status = 'finished';
                            // update users
                            io.to(playRoom.room).emit('sessionEnd', playRoom.status);
                            // destroy play room
                            roomService.deleteRoomById(playRoom.room);
                            console.log('room deleted');
                        }
                    }, 5000);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}
