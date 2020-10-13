function otherPlayer(firstPlayer){
    return 1-firstPlayer;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// return random int in range 0 to n-1 (min inclusive, max exclusive)
// example: input 3 -> expected output 0, 1 or 2
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// return random int in range (min and max inclusive)
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Gets user's index in room (0 or 1)
function getPlayerIndexInRoomBySocketId(playRoom, socketId){
    let playerIndex = false;

    // if params not null
    if(playRoom && socketId){
        if(playRoom.players[0].socketId === socketId){
            playerIndex = 0;
        }
        else if(playRoom.players[1].socketId === socketId){
            playerIndex = 1;
        }
    }
    
    return playerIndex;
}

module.exports = {
    otherPlayer, 
    delay, 
    getRandomInt, 
    getRandomIntInclusive,
    getPlayerIndexInRoomBySocketId
};