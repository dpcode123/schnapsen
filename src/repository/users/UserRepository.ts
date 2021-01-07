import pool from '../db_pool_config.js';
import { User } from '../../ts/interfaces.js';

export default class UserRepository {

    constructor() { }

    async getUsers(): Promise<any> {
        const dbQuery: string = `SELECT * FROM users`;
        
        return await pool.query(dbQuery)
            .then(results => {
                if(results.rowCount > 0) {
                    return results.rows;
                } else {
                    return undefined;
                }
            })
            .catch(err => {
                return undefined;
            });
    }

}