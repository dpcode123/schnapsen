const { getRoomByPlayersSocketId, deleteRoomById } = require('../services/PlayRoomService')
const { getPlayerIndexInRoomBySocketId } = require("../utils/util");

module.exports = function(io) {

    this.disconnect = function(socketId) {
        try {
            const playRoom = getRoomByPlayersSocketId(socketId);

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
                        deleteRoomById(playRoom.room);

                        console.log('room deleted');
                    }
                }, 5000);
            }
            
        } catch (error) {
            console.error(error);
        }
    }


}
