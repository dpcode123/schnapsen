import bcrypt from 'bcrypt';
import { CustomRequest, CustomResponse } from '../ts/interfaces.js';
import UserSelectRepository from '../repository/users/UserSelectRepository.js';
import UserInsertRepository from '../repository/users/UserInsertRepository.js';


export default class RegisterService {

    userSelectRepository: UserSelectRepository;
    userInsertRepository: UserInsertRepository;

    constructor() {
        this.userSelectRepository = new UserSelectRepository();
        this.userInsertRepository = new UserInsertRepository();
    }
        
    addUser = async (req: CustomRequest, res: CustomResponse): Promise<void> => {
        try {
            let { username, email, password, password2 } = req.body;

            let errors: string[] = [];

            if (!username || !email || !password || !password2) {
                errors.push('ERROR: Please enter all fields');
            }

            if (password.length < 4) {
                errors.push(' ERROR: Password must be at least 4 characters long');
            }

            if (password !== password2) {
                errors.push(' ERROR: Passwords do not match');
            }
            

            if (errors.length > 0) {
                req.flash('error', errors);
                res.render('register');
            } else {
                const userInDatabase = await this.userSelectRepository.getUserByUsername(username);

                if (userInDatabase) {
                    req.flash('error', 'ERROR: Username already exist');
                    return res.render('register');
                } else {
                    // hash password
                    const hashedPassword = await bcrypt.hash(password, 10);
                    // insert user in db
                    const userCreated = await this.userInsertRepository.createUser(username, email, hashedPassword);

                    if (userCreated) {
                        req.flash('success', 'You are now registered. Please log in.');
                        res.redirect('/login');
                    } else {
                        req.flash('error', 'ERROR: Registration failed');
                        return res.redirect('/register');
                    }
                }
            }
        } catch (err) {
            req.flash('error', 'ERROR: Registration failed - try again');
            res.redirect('/register');
        }
    }
        
    
}