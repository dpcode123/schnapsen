export default function(bummerl, player) {

    let gamePointsPlayer, gamePointsOpponent;

    if(player === 0){
        gamePointsPlayer = bummerl.gamePoints[0];
        gamePointsOpponent = bummerl.gamePoints[1];
    }
    else if(player === 1){
        gamePointsPlayer = bummerl.gamePoints[1];
        gamePointsOpponent = bummerl.gamePoints[0];
    }

    const dto = {
        num: bummerl.num,
        status: bummerl.status,
        gamePointsPlayer: gamePointsPlayer,
        gamePointsOpponent: gamePointsOpponent,
    };
    return dto;
}