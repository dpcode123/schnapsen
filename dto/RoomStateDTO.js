const { otherPlayer } = require('../utils/util');

module.exports = function(playRoom, playerIndex) {
    
    const dto = {
        room: playRoom.room,
        status: playRoom.status,
        playerName: playRoom.players[playerIndex].username,
        opponentName: playRoom.players[otherPlayer(playerIndex)].username,
        bummerlsLostPlayer: playRoom.bummerlsWon[otherPlayer(playerIndex)],
        bummerlsLostOpponent: playRoom.bummerlsWon[playerIndex],
    };

    return dto;
}