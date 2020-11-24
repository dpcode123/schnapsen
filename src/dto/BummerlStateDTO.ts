export default class BummerlStateDTO {

    dto: any;
    gamePointsPlayer: number = 0;
    gamePointsOpponent: number = 0;

    constructor(bummerl, player) {
        if (player === 0) {
            this.gamePointsPlayer = bummerl.gamePoints[0];
            this.gamePointsOpponent = bummerl.gamePoints[1];
        } else if (player === 1) {
            this.gamePointsPlayer = bummerl.gamePoints[1];
            this.gamePointsOpponent = bummerl.gamePoints[0];
        }

        this.dto = {
            num: bummerl.num,
            status: bummerl.status,
            gamePointsPlayer: this.gamePointsPlayer,
            gamePointsOpponent: this.gamePointsOpponent,
        };
    }
    
    getDTO(){
        return this.dto;
    }

}