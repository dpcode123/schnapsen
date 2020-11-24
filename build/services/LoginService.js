import passport from 'passport';
export default class LoginService {
    constructor() {
        this.loginUser = passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        });
    }
}
