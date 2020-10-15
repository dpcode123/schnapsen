const passport = require('passport');

const login_user = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
});

module.exports = {
    login_user
}