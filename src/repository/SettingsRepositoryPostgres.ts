import pool from '../config/db_pool_config.js';


export default class SettingsRepository {

    constructor() { }

    async getCardBackDesigns(): Promise<any | undefined> {
        const dbQuery: string = `SELECT * FROM cardback_designs;`;

        return await this.selectQuery(dbQuery);
    }

    async getCardFaceDesigns(): Promise<any | undefined> {
        const dbQuery: string = `SELECT * FROM cardface_designs;`;

        return await this.selectQuery(dbQuery);
    }
    
    async updateCardBackDesigns(cf: number, cb: number, id: number): Promise<boolean> {
        const dbQuery: string = `UPDATE users SET cardface_design_id = $1, cardback_design_id = $2 WHERE id = $3;`;
        const queryParamsArray: number[] = [cf, cb, id];

        return await this.updateQuery(dbQuery, queryParamsArray);
    }


    // PRIVATE METHODS

    private async selectQuery(dbQuery: string): Promise<any | undefined> {
        return await pool.query(dbQuery)
            .then(results => {
                if(results.rowCount > 0) {
                    return results.rows;
                } else {
                    console.log('No results');
                    return undefined;
                }
            })
            .catch(err => {
                console.log(err);
                return undefined;
            });
    }

    private async updateQuery(dbQuery: string, queryParamsArray: number[]): Promise<boolean> {
        return await pool.query(dbQuery, queryParamsArray)
            .then(results => {
                if(results.rowCount === 1) {
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
