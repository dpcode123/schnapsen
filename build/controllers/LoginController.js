import LoginService from '../services/LoginService.js';
export default class LoginController {
    constructor() {
        this.loginUser = () => {
            return this.loginService.loginUser;
        };
        this.loginService = new LoginService();
    }
}
