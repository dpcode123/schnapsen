import pool from '../../config/db_pool_config.js';


export default class UserInsertRepository {

    constructor() { }

    async createUser(username, email, hashedPassword): Promise<boolean> {
        const userId = await this.insertUserQuery(username, email, hashedPassword);
        const roleInserted = await this.insertDefaultRoleQuery(userId);
        
        console.log(userId);
        console.log(roleInserted);
        
        if(userId && roleInserted) {
            return true;
        } else {
            return false;
        }
    }


    // PRIVATE METHODS

    private async insertUserQuery(username: string, email: string, hashedPassword: string): Promise<number> {
        const dbQuery: string = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`;
        const queryParamsArray: string[] = [username, email, hashedPassword];

        return await pool.query(dbQuery, queryParamsArray)
            .then(results => {
                if(results.rowCount === 1) {
                    console.log(results.rows[0].id);
                    
                    return results.rows[0].id;
                } else {
                    return undefined;
                }
            })
            .catch(err => {
                console.log(err);
                return undefined;
            });
    }


    private async insertDefaultRoleQuery(id: number): Promise<boolean> {
        const dbQuery: string = `INSERT INTO user_authority (user_id, authority_id) VALUES ($1, $2) RETURNING user_id;`;
        const queryParamsArray: number[] = [id, 1];

        return await pool.query(dbQuery, queryParamsArray)
            .then(results => {
                if(results.rowCount === 1) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(err => {
                console.log(err);
                return false;
            });
    }

}