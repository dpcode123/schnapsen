/* import passport from 'passport';

const login_user = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
});

export default login_user; */

import passport from 'passport';

export default class LoginService {
    constructor() {
        this.login_user = passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        });
    }
}