const { otherPlayer } = require('../utils/util');

module.exports = function(playSession, playerIndex) {
    
    const dto = {
        room: playSession.room,
        status: playSession.status,
        playerName: playSession.players[playerIndex].username,
        opponentName: playSession.players[otherPlayer(playerIndex)].username,
        bummerlsLostPlayer: playSession.bummerlsWon[otherPlayer(playerIndex)],
        bummerlsLostOpponent: playSession.bummerlsWon[playerIndex],
    };

    return dto;
}