const { getPlayRooms, getPlayRoomById } = require('../repository/roomRepository');
const PlayRoom = require('../model/PlayRoom');
const { getRoomByPlayersSocketId } = require('../services/PlayRoomService')
const { otherPlayer, 
    getPlayerIndexInRoomBySocketId 
} = require("../utils/util");

module.exports = function(io, socket) {

    this.disconnect = function(socketId) {
        try {

            const playRoom = getRoomByPlayersSocketId(socketId);
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

                    // destroy play session
                    console.log('destroy play room');
                }
            }, 3000);

                    

            


            
        } catch (error) {
            console.error(error);
        }
    }


}
