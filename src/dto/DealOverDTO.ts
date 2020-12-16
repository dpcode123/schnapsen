export default class DealOverDTO {

    dto: {
        gamePoints: number,
        isWinner: boolean,
        playerPointsAtEndOfGame: number,
    };

    constructor(dealOver: any, isWinner: boolean) {
        this.dto = {
            gamePoints: dealOver.gamePoints,
            isWinner: isWinner,
            playerPointsAtEndOfGame: dealOver.playerPointsAtEndOfGame,
        };
    }
    
    getDTO(){
        return this.dto;
    }
    
}