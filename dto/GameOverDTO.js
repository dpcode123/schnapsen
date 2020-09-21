module.exports = function(gameOver, isWinner) {

    const dto = {
        gamePoints: gameOver.gamePoints,
        isWinner: isWinner,
        playerPointsAtEndOfGame: gameOver.playerPointsAtEndOfGame,
    };

    return dto;
}