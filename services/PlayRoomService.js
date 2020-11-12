const { getPlayRooms, getPlayRoomById, deletePlayRoomById } = require('../repository/roomRepository');
const PlayRoom = require('../model/PlayRoom');
const { getRandomIntInclusive } = require('../utils/util');
const { signToken } = require('../auth/socketJwt');

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
        //return randomId;
        return generateGameSessionData(firstPlayer, 0, randomId);
    }
}

const joinRoom = function(roomId, secondPlayer) {
    // get room (or false if room doesnt exist)
    const playRoom = getPlayRoomById(roomId);

    // if room exist and first player is set and second is not
    if(playRoom) {
        if(playRoom.players[0] && !playRoom.players[1]){
            // add second[1] player to room
            playRoom.players[1] = secondPlayer;

            //return true;
            return generateGameSessionData(secondPlayer, 1, roomId);
        }
    }
    return false;
}

const getRoomByPlayersSocketId = function(socketId) {
    let room = false;

    // loop through all rooms
    playRooms.forEach(playRoom => {
        // if there are any players in room
        if(playRoom.players.length > 0){
            // if there is any player in room with that socket id
            try {
                if(playRoom.players.filter(player => player.socketId === socketId).length === 1){
                    room = playRoom;
                }
            } catch (error) {
                console.error(error);
            }
            /* playRoom.players.forEach(player => {
                if(player !== null && player.socketId === socketId){
                    room = playRoom;
                }
            }); */
        }
    });
    return room;
}

const deleteRoomById = function(roomId) {
    return deletePlayRoomById(roomId);
}

// Generates game session data with jwt token for socket.io
const generateGameSessionData = function(player, playerIndex, roomId) {

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

module.exports = {
    createRoom,
    joinRoom,
    getRoomByPlayersSocketId,
    deleteRoomById
};