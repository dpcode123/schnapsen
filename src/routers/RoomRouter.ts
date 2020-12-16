import express, { Router } from 'express';
import { isUserAuthenticated, isUserPlayer } from '../auth/passport_middleware.js';
import RoomController from '../controllers/RoomController.js';

const router: Router = express.Router();
const roomController: RoomController = new RoomController();

router.get('/create', isUserAuthenticated, isUserPlayer, roomController.createRoom);
router.get('/join', isUserAuthenticated, isUserPlayer, roomController.joinRoom);

export default router;