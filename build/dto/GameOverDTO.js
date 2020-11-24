export default class GameOverDTO {
    constructor(gameOver, isWinner) {
        this.dto = {
            gamePoints: gameOver.gamePoints,
            isWinner: isWinner,
            playerPointsAtEndOfGame: gameOver.playerPointsAtEndOfGame,
        };
    }
    getDTO() {
        return this.dto;
    }
}
