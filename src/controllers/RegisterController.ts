import RegisterService from '../services/RegisterService.js';

export default class RegisterController {

    private registerService: RegisterService;

    constructor() { 
        this.registerService = new RegisterService();
    }

    addUser = () => { 
        return this.registerService.addUser;
    }
}