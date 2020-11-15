import express from 'express';
import RegisterController from '../controllers/register_controller.js';
import { userNotAuthenticated } from '../auth/passportMiddleware.js';

const router = express.Router();
const registerController = new RegisterController();

router.get('/', userNotAuthenticated, (req, res) => {
    res.render('register');
});

router.post('/', userNotAuthenticated, registerController.add_user);

export default router;
