const { getPlayRooms, getPlayRoomById, deletePlayRoomById } = require('../repository/roomRepository');
const PlayRoom = require('../model/PlayRoom');
const { getRandomIntInclusive } = require('../utils/util');

const playRooms = getPlayRooms();

const createRoom = function(firstPlayer) {
    // generate random room id
    const randomId = getRandomIntInclusive(1000, 9999).toString();

    // if room already exist return false
    if(playRooms.has(randomId)) {
        return false;
    }
    // create new play room and add first[0] player
    else{
        playRooms.set(randomId, new PlayRoom(randomId, firstPlayer));
        return randomId;
    }
}

const joinRoom = function(roomId, secondPlayer) {
    // get room (or false if room doesnt exist)
    const playRoom = getPlayRoomById(roomId);

    // if room exist and first player is set and second is not
    if(playRoom) {
        if(playRoom.players[0] && !playRoom.players[1]){
            // add second[1] player
            playRoom.players[1] = secondPlayer;
            return true;
        }
    }
    return false;
}

const getRoomByPlayersSocketId = function(socketId) {
    let room = false;

    playRooms.forEach(playRoom => {
        // if there are any players in room
        if(playRoom.players.length > 0){
            // if there is any player in room with that socket id
            if(playRoom.players.filter(player => player.socketId === socketId).length === 1){
                room = playRoom;
            }
        }
    });
    return room;
}

const deleteRoomById = function(roomId) {
    return deletePlayRoomById(roomId);
}

module.exports = {
    createRoom,
    joinRoom,
    getRoomByPlayersSocketId,
    deleteRoomById
};