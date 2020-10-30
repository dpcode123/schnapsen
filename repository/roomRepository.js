const playRooms = new Map();

function getPlayRooms() {
    return playRooms;
}

function getPlayRoomById(roomId) {
    // check if room exist
    if(playRooms.has(roomId)) {
        return playRooms.get(roomId);        
    }
    // room doesn't exist
    return false;
}

function deletePlayRoomById(roomId) {
    return playRooms.delete(roomId);
}

module.exports = { getPlayRooms, getPlayRoomById, deletePlayRoomById };