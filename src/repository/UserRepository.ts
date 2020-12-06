import pool from '../repository/db_pool_config.js';
import { User } from '../ts/interfaces.js';


export default class UserRepository {

    constructor() {}

    async getUserByUsername(username: string): Promise<User> {
        const dbQuery: string = `SELECT * FROM users WHERE LOWER(username) = LOWER($1)`;
        const queryParamsArray: string[] = [username];

        return await this.userQuery(dbQuery, queryParamsArray);
    }


    async getUserById(id: number): Promise<User>  {
        const dbQuery: string = `SELECT * FROM users WHERE id = $1`;
        const queryParamsArray: number[] = [id];

        return await this.userQuery(dbQuery, queryParamsArray);
    }
    

    private async userQuery(dbQuery: string, queryParamsArray: unknown[]): Promise<User> {

        return await pool.query(dbQuery, queryParamsArray)
            .then(results => {
                if(results.rowCount > 0) {
                    const user: User =  {
                        id: results.rows[0].id,
                        username: results.rows[0].username,
                        email: results.rows[0].email,
                        password: results.rows[0].password,
                        cardface_design_id: results.rows[0].cardface_design_id,
                        cardback_design_id: results.rows[0].cardback_design_id
                    };         
                    return user;
                } else {
                    return Promise.reject('User not found');
                }
            })
            .catch(err => {
                return Promise.reject('User not found');
            });
    }

}