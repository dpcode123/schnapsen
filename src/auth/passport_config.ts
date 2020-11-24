import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import pool from '../repository/db_pool_config.js';
import { PassportStatic } from 'passport';
import { User } from '../ts/interfaces.js';

const LocalStrategy = passportLocal.Strategy;

export default function initializePassport(passport: PassportStatic): void {

    const authenticateUser = (username: string, password: string, done: any) => {
        pool.query(
            `SELECT * FROM users WHERE LOWER(username) = LOWER($1)`, [username],
            (err, results) => {
                if (err) {
                    throw err;
                }
                console.log(results.rows);

                if (results.rows.length > 0) {
                    const user = results.rows[0];

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                      if (err) {
                        console.log(err);
                      }
                      if (isMatch) {
                        return done(null, user);
                      } else {
                        //password is incorrect
                        return done(null, false, { message: "Password is incorrect" });
                      }
                    });
                } else {
                    // No user
                    return done(null, false, { message: "No user with that username" });
                }
            }
        );
    };

    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateUser));

    passport.serializeUser((user: User, done) => done(null, {id: user.id, username: user.username}));

    passport.deserializeUser((serializedUser: User, done) => {
        pool.query(`SELECT * FROM users WHERE id = $1`, [serializedUser.id], (err, results) => {
            if (err) {
                return done(err);
            }
          
            console.log(`ID is ${results.rows[0].id}`);
            return done(null, results.rows[0]);
        });
    });
}
