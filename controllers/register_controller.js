import RegisterService from '../services/RegisterService.js';

const registerService = new RegisterService();

export default class RegisterController {
    constructor() {
        this.add_user = registerService.add_user;
    }
}