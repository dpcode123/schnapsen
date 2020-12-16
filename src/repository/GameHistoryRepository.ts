import Bummerl from "../model/Bummerl.js";
import pool from '../repository/db_pool_config.js';

export default class GameHistoryRepository {
    constructor() { }

    async saveBummerl(
            bummerl: Bummerl, 
            bummerlWinner: { id: string, gamePoints: number }, 
            bummerlLoser: { id: string, gamePoints: number }, 
            playSessionUuid: string
        ): Promise<boolean> {

            const dbQuery: string = `INSERT INTO 
                                        game_history (
                                            bummerl_winner_user_id, bummerl_loser_user_id, 
                                            winner_points, loser_points,
                                            playsession_uuid, bummerl_num,
                                            time_started, time_finished) 
                                        VALUES ($1, $2, $3, $4, $5, $6, TO_TIMESTAMP($7), TO_TIMESTAMP($8)) 
                                        RETURNING id`;

            const queryParamsArray: unknown[] = [
                bummerlWinner.id, bummerlLoser.id,
                bummerlWinner.gamePoints, bummerlLoser.gamePoints,
                playSessionUuid, bummerl.num,
                bummerl.timeStarted, bummerl.timeFinished
            ];

            return await this.query(dbQuery, queryParamsArray);
    }


    private async query(dbQuery: string, queryParamsArray: unknown[]): Promise<boolean> {

        return await pool.query(dbQuery, queryParamsArray)
            .then(results => {
                if(results) {
                    return true;
                } else {
                    console.log('No results');
                    return false;
                }
            })
            .catch(err => {
                console.log(err);
                return false;
            });
    }
}