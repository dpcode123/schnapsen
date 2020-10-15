const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("../repository/dbPoolConfig");
const bcrypt = require("bcrypt");


function initializePassport(passport) {

    const authenticateUser = (username, password, done) => {

        pool.query(
            `SELECT * FROM users WHERE username = $1`, [username],
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

    passport.serializeUser((user, done) => done(null, {id: user.id, username: user.username}));

    passport.deserializeUser((serializedUser, done) => {
      pool.query(`SELECT * FROM users WHERE id = $1`, [serializedUser.id], (err, results) => {
        if (err) {
          return done(err);
        }
        console.log(`ID is ${results.rows[0].id}`);
        return done(null, results.rows[0]);
      });
    });
}

module.exports = initializePassport;
