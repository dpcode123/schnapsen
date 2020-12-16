import express from 'express';
import { isUserAuthenticated, isUserPlayer } from '../auth/passport_middleware.js';
import RoomController from '../controllers/RoomController.js';
const router = express.Router();
const roomController = new RoomController();
router.get('/create', isUserAuthenticated, isUserPlayer, roomController.createRoom);
router.get('/join', isUserAuthenticated, isUserPlayer, roomController.joinRoom);
export default router;
