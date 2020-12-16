import express from 'express';
import RegisterController from '../controllers/RegisterController.js';
import { isUserNotAuthenticated } from '../auth/passport_middleware.js';
const router = express.Router();
const registerController = new RegisterController();
router.get('/', isUserNotAuthenticated, (req, res) => {
    res.render('register');
});
router.post('/', isUserNotAuthenticated, registerController.addUser());
export default router;
