const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByUsername, getUserById) {

    const authenticateUser = async (username, password, done) => {
        
        const user = getUserByUsername(username);

        if (user == null) {
            return done(null, false, { message: 'No user with that email' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
      }

      passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateUser));

      passport.serializeUser((user, done) => done(null, {id: user.id, username: user.username}));

      passport.deserializeUser((serializedUser, done) => {
          return done(null, getUserById(serializedUser.id));
      })
}

module.exports = initialize 
