export default class GameOverDTO {

    dto: {
        gamePoints: number,
        isWinner: boolean,
        playerPointsAtEndOfGame: number,
    };

    constructor(gameOver: any, isWinner: boolean) {
        this.dto = {
            gamePoints: gameOver.gamePoints,
            isWinner: isWinner,
            playerPointsAtEndOfGame: gameOver.playerPointsAtEndOfGame,
        };
    }
    
    getDTO(){
        return this.dto;
    }
    
}