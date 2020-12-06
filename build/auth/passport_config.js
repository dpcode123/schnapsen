import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import UserRepository from '../repository/UserRepository.js';
const LocalStrategy = passportLocal.Strategy;
const userRepository = new UserRepository();
export default function initializePassport(passport) {
    const authenticateUser = (username, password, done) => {
        let dbUser = userRepository.getUserByUsername(username);
        dbUser.then((user) => {
            if (user) {
                // User found
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        console.log(err);
                    }
                    if (isMatch) {
                        // password ok
                        return done(null, user);
                    }
                    else {
                        // password is incorrect
                        return done(null, false, { message: "Login failed! Check your username and password and try again." });
                    }
                });
            }
            else {
                // No user found
                return done(null, false, { message: "Login failed! Check your username and password and try again." });
            }
        });
    };
    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, { id: user.id, username: user.username }));
    passport.deserializeUser((serializedUser, done) => {
        let dbUser = userRepository.getUserById(serializedUser.id);
        dbUser.then((user) => {
            if (user) {
                console.log(`ID is ${user.id}`);
                return done(null, user);
            }
            else {
                return done('Error - user not found');
            }
        });
    });
}
