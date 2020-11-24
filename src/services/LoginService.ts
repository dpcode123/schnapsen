import passport from 'passport';

export default class LoginService {

    loginUser: any;
    
    constructor() {
        this.loginUser = passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        });
    }
}
