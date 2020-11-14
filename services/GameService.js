import PlayRoomService from '../services/PlayRoomService.js';
import { getPlayerIndexInRoomBySocketId } from '../utils/util.js';

const playRoomService = new PlayRoomService();

export default function GameService(io) {

    this.disconnect = function(socketId) {
        try {
            const playRoom = playRoomService.getRoomByPlayersSocketId(socketId);

            if(playRoom){
                const playerIndex = getPlayerIndexInRoomBySocketId(playRoom, socketId);

                // change player's socketId
                playRoom.players[playerIndex].socketId = 'disconnected';
                console.log('playRoom.players[playerIndex].socketId');
                console.log(playRoom.players[playerIndex].socketId);

                // wait few seconds for eventual client reconnection (on client page refresh)
                // if still disconnected destroy play room
                setTimeout(function () {
                    if (playRoom.players[playerIndex].socketId === 'disconnected') {
                        // set room status to finished
                        playRoom.status = 'finished';

                        // update users
                        io.to(playRoom.room).emit('sessionEnd', playRoom.status);

                        // destroy play room
                        playRoomService.deleteRoomById(playRoom.room);

                        console.log('room deleted');
                    }
                }, 5000);
            }
            
        } catch (error) {
            console.error(error);
        }
    }
}
