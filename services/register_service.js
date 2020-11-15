import pool from '../repository/db_pool_config.js';
import bcrypt from 'bcrypt';

export default class RegisterService {
    constructor() {
        
        this.add_user = async (req, res) => {
            try {
                let { username, email, password, password2 } = req.body;
                let errors = [];
        
                if (!username || !email || !password || !password2) {
                    errors.push({ message: 'Please enter all fields' });
                }
                
                if (password.length < 4) {
                    errors.push({ message: 'Password must be a least 4 characters long' });
                }
                  
                if (password !== password2) {
                errors.push({ message: 'Passwords do not match' });
                }
                
                if (errors.length > 0) {
                    res.render('register', { errors, username, email, password, password2 });
                } 
                else {
                    hashedPassword = await bcrypt.hash(password, 10);
                    
                    pool.query(
                        `SELECT * FROM users WHERE LOWER(username) = LOWER($1)`, [username],
                        (err, results) => {
                            if (err) { 
                                console.log(err);
                                //return res.render('register', { message: 'Username already exist' });
                                return res.redirect('/register');
                            }
                    
                            if (results.rows.length > 0) {
                                return res.render('register', { message: 'Username already exist' });
                            } 
                            else { 
                                pool.query(
                                    `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`,
                                    [username, email, hashedPassword], (err, results) => {
                                        if (err) {
                                            console.log(err);
                                            return res.redirect('/register');
                                        }
                                        console.log(results.rows);
                                        req.flash('success_msg', 'You are now registered. Please log in');
                                        res.redirect('/login');
                                    }
                            );
                            }
                        }
                    );
                }
            } catch(err) {
                console.log(err);
                res.redirect('/register');
            }
        }
        
    }
}