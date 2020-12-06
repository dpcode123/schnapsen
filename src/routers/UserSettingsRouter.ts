import express, { Router } from 'express';
import { userAuthenticated, userNotAuthenticated } from '../auth/passport_middleware.js';
import UserSettingsController from '../controllers/UserSettingsController.js';

const router: Router = express.Router();
const userSettingsController = new UserSettingsController();

router.get('/', userAuthenticated, userSettingsController.getSettings);
router.post('/', userAuthenticated, userSettingsController.updateSettings);

export default router;