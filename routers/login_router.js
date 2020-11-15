import express from 'express';
import LoginController from '../controllers/login_controller.js';
//import login_user from '../controllers/LoginController.js';
import { userNotAuthenticated } from '../auth/passportMiddleware.js';

const router = express.Router();
const loginController = new LoginController();

router.get('/', userNotAuthenticated, (req, res) => {
    res.render('login');
});

router.post('/', userNotAuthenticated, loginController.login_user);

export default router;