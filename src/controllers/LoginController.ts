import LoginService from '../services/LoginService.js';

export default class LoginController {

    private loginService: LoginService;

    constructor() {
        this.loginService = new LoginService();
    }

    loginUser = () => {
        return this.loginService.loginUser;
    }
}