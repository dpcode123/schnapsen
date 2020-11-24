import express, { Router } from 'express';
import LoginController from '../controllers/LoginController.js';
import { userNotAuthenticated } from '../auth/passport_middleware.js';
import { CustomRequest, CustomResponse } from '../ts/interfaces.js';

const router: Router = express.Router();
const loginController: LoginController = new LoginController();

router.get('/', userNotAuthenticated, (req: CustomRequest, res: CustomResponse): void => {
    res.render('login');
});

router.post('/', userNotAuthenticated, loginController.loginUser());

export default router;