import express, { Router } from 'express';
import LoginController from '../controllers/LoginController.js';
import { isUserNotAuthenticated } from '../auth/passport_middleware.js';
import { CustomRequest, CustomResponse } from '../ts/interfaces.js';

const router: Router = express.Router();
const loginController: LoginController = new LoginController();

router.get('/', isUserNotAuthenticated, (req: CustomRequest, res: CustomResponse): void => {
    res.render('login');
});

router.post('/', isUserNotAuthenticated, loginController.loginUser());

export default router;