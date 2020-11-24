import express, { Router } from 'express';
import { userAuthenticated } from '../auth/passport_middleware.js';
import RoomController from '../controllers/RoomController.js';

const router: Router = express.Router();
const roomController: RoomController = new RoomController();

router.get('/create', userAuthenticated, roomController.createRoom);
router.get('/join', userAuthenticated, roomController.joinRoom);

export default router;