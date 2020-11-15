import RegisterService from '../services/register_service.js';

const registerService = new RegisterService();

export default class RegisterController {
    constructor() {
        this.add_user = registerService.add_user;
    }
}