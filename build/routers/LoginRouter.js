import express from 'express';
import LoginController from '../controllers/LoginController.js';
import { isUserNotAuthenticated } from '../auth/passport_middleware.js';
const router = express.Router();
const loginController = new LoginController();
router.get('/', isUserNotAuthenticated, (req, res) => {
    res.render('login');
});
router.post('/', isUserNotAuthenticated, loginController.loginUser());
export default router;
