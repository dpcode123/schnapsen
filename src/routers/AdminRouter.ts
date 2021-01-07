import express, { Router } from 'express';
import AdminController from '../controllers/AdminController.js';
import { isUserAuthenticated, isUserAdmin } from '../auth/passport_middleware.js';
import { CustomRequest, CustomResponse } from '../ts/interfaces.js';

const router: Router = express.Router();
const adminController: AdminController = new AdminController();

// Admin - Home Page
router.get('/', isUserAuthenticated, isUserAdmin, adminController.home);

// Admin - Users Page
router.get('/users', isUserAuthenticated, isUserAdmin, adminController.users);

// Admin - Active Game Rooms Page
router.get('/rooms', isUserAuthenticated, isUserAdmin, adminController.rooms);

export default router;