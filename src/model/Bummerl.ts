export default class Bummerl {
    num: number;
    status: string;
    gamePoints: number[];
    timeStarted: number;
    timeFinished: number = 0;

    constructor(num: number) {
        // Bummerl num (1...n)
        this.num = num;
            
        // status (started, finished)
        this.status = 'started';

        // Game points - (0...9), bummerl is played until player reach 7+ game points
        // max game points is 9 - if player had 6 points and won last game by 3 points
        this.gamePoints = [];
        this.gamePoints[0] = 0;
        this.gamePoints[1] = 0;

        // time started
        this.timeStarted = Math.round(Date.now()/1000);
    }


    // check if bummerls is over (7+ game points)
    bummerlOver(playerIndex: number): boolean {
        const isBummerlOver = this.gamePoints[playerIndex] >= 7;
        return isBummerlOver;
    }
}