import RegisterService from '../services/RegisterService.js';
export default class RegisterController {
    constructor() {
        this.addUser = () => {
            return this.registerService.addUser;
        };
        this.registerService = new RegisterService();
    }
}
