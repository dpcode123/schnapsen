import express, { Router } from 'express';
import { isUserAuthenticated, isUserNotAuthenticated } from '../auth/passport_middleware.js';
import UserSettingsController from '../controllers/UserSettingsController.js';

const router: Router = express.Router();
const userSettingsController = new UserSettingsController();

router.get('/', isUserAuthenticated, userSettingsController.getSettings);
router.post('/', isUserAuthenticated, userSettingsController.updateSettings);

export default router;