/* import login_user from '../services/LoginService.js';

export default login_user; */

import LoginService from '../services/LoginService.js';

const loginService = new LoginService();

export default class LoginController {
    constructor() {
        this.login_user = loginService.login_user;
    }
}