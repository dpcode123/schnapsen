import pool from './db_pool_config.js';
import { User } from '../ts/interfaces.js';


export default class UserSelectRepository {

    constructor() { }

    async getUserByUsername(username: string): Promise<User | undefined> {
        const dbQuery: string = `SELECT * FROM users WHERE LOWER(username) = LOWER($1)`;
        const queryParamsArray: string[] = [username];
        
        return await this.selectUserQuery(dbQuery, queryParamsArray)
            .then(
                user => { return user; }
            )
            .then(
                async (user) => {
                    const roles = await this.getUserAuthorityRoles(user.id);
                    user.roles = roles;
                    return user;
                }
            )
            .catch(
                err => { return undefined; }
            );
    }


    async getUserById(id: number): Promise<User | undefined>  {
        const dbQuery: string = `SELECT * FROM users WHERE id = $1`;
        const queryParamsArray: number[] = [id];

        return await this.selectUserQuery(dbQuery, queryParamsArray)
            .then(
                user => { return user; }
            )
            .then(
                async (user) => {
                    const roles = await this.getUserAuthorityRoles(user.id);
                    user.roles = roles;
                    return user;
                }
            )
            .catch(
                err => { return undefined; }
            );
    }

    async getUserAuthorityRoles(id: number): Promise<any>  {
        const dbQuery: string = `SELECT authority.name 
                                    FROM authority LEFT JOIN user_authority 
                                    ON user_authority.authority_id = authority.id 
                                    WHERE user_authority.user_id = $1;`;
        const queryParamsArray: number[] = [id];

        return await this.selectAuthorityQuery(dbQuery, queryParamsArray)
            .then(
                result => { return result; }
            )
            .catch(
                err => { return undefined; }
            );
    }
    

    // PRIVATE METHODS

    private async selectUserQuery(dbQuery: string, queryParamsArray: unknown[]): Promise<User> {
        return await pool.query(dbQuery, queryParamsArray)
            .then(results => {
                if(results.rowCount > 0) {
                    const user: User =  {
                        id: results.rows[0].id,
                        username: results.rows[0].username,
                        email: results.rows[0].email,
                        password: results.rows[0].password,
                        cardface_design_id: results.rows[0].cardface_design_id,
                        cardback_design_id: results.rows[0].cardback_design_id,
                        roles: []
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


    private async selectAuthorityQuery(dbQuery: string, queryParamsArray: unknown[]): Promise<User> {
        return await pool.query(dbQuery, queryParamsArray)
            .then(results => {
                if(results.rowCount > 0) {
                    return results.rows;
                } else {
                    return Promise.reject('Authority role not found');
                }
            })
            .catch(err => {
                return Promise.reject('Authority role not found');
            });
    }

}