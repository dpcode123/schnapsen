var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import UserSelectRepository from '../repository/UserSelectRepository.js';
import UserInsertRepository from '../repository/UserInsertRepository.js';
export default class RegisterService {
    constructor() {
        this.addUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email, password, password2 } = req.body;
                let errors = [];
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
                }
                else {
                    const userInDatabase = yield this.userSelectRepository.getUserByUsername(username);
                    if (userInDatabase) {
                        req.flash('error', 'ERROR: Username already exist');
                        return res.render('register');
                    }
                    else {
                        // hash password
                        const hashedPassword = yield bcrypt.hash(password, 10);
                        // insert user in db
                        const userCreated = yield this.userInsertRepository.createUser(username, email, hashedPassword);
                        if (userCreated) {
                            req.flash('success', 'You are now registered. Please log in.');
                            res.redirect('/login');
                        }
                        else {
                            req.flash('error', 'ERROR: Registration failed');
                            return res.redirect('/register');
                        }
                    }
                }
            }
            catch (err) {
                req.flash('error', 'ERROR: Registration failed - try again');
                res.redirect('/register');
            }
        });
        this.userSelectRepository = new UserSelectRepository();
        this.userInsertRepository = new UserInsertRepository();
    }
}
