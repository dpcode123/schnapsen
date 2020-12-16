import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import { PassportStatic } from 'passport';
import { User } from '../ts/interfaces.js';
import UserSelectRepository from '../repository/UserSelectRepository.js';

const LocalStrategy = passportLocal.Strategy;
const userSelectRepository = new UserSelectRepository();

export default function initializePassport(passport: PassportStatic): void {

    const authenticateUser = (username: string, password: string, done: any) => {

        let dbUser: Promise<User | undefined> = userSelectRepository.getUserByUsername(username);

        dbUser.then(
            (user) => {
                if (user) {
                    // User found
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log(err);
                        }
                        if (isMatch) {
                            // password ok
                            console.log(user);
                            return done(null, user);
                        } else {
                            // password is incorrect
                            return done(null, false, { message: "Login failed! Check your username and password and try again." });
                        }
                    });
                } else {
                    // No user found
                    return done(null, false, { message: "Login failed! Check your username and password and try again." });
                }
            }
        );
    }    
    

    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateUser));
    
    
    //passport.serializeUser((user: User, done) => done(null, user));
    passport.serializeUser(
        (user: User, done) => done(null, {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            cardface_design_id: user.cardface_design_id,
            cardback_design_id: user.cardback_design_id,
            roles: user.roles
        })
    );

    

    passport.deserializeUser((serializedUser: User, done) => {

        let dbUser: Promise<User | undefined> = userSelectRepository.getUserById(serializedUser.id);

        dbUser.then(
            (user) => {
                if (user) {
                    console.log(`ID is ${user.id}`);

                    return done(null, user);
                } else {
                    return done('Error - user not found');
                }
            }
        );
    });


}