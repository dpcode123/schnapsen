import UserRepository from "../repository/users/UserRepository.js";

export default class UserService {

    userRepository: UserRepository;

    constructor() { 
        this.userRepository = new UserRepository();
    }

    async getUsers() {
        return await this.userRepository.getUsers();
    }
}