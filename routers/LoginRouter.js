import express from 'express';
import LoginController from '../controllers/LoginController.js';
import { userNotAuthenticated } from '../auth/passport_middleware.js';

const router = express.Router();
const loginController = new LoginController();

router.get('/', userNotAuthenticated, (req, res) => {
    res.render('login');
});

router.post('/', userNotAuthenticated, loginController.login_user);

export default router;