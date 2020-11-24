import express, { Router } from 'express';
import RegisterController from '../controllers/RegisterController.js';
import { userNotAuthenticated } from '../auth/passport_middleware.js';
import { CustomRequest, CustomResponse } from '../ts/interfaces.js';

const router: Router = express.Router();
const registerController: RegisterController = new RegisterController();

router.get('/', userNotAuthenticated, (req: CustomRequest, res: CustomResponse): void => {
    res.render('register');
});

router.post('/', userNotAuthenticated, registerController.addUser());

export default router;
