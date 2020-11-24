import express from 'express';
import RegisterController from '../controllers/RegisterController.js';
import { userNotAuthenticated } from '../auth/passport_middleware.js';
const router = express.Router();
const registerController = new RegisterController();
router.get('/', userNotAuthenticated, (req, res) => {
    res.render('register');
});
router.post('/', userNotAuthenticated, registerController.addUser());
export default router;
