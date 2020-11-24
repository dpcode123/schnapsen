import express from 'express';
import { userAuthenticated } from '../auth/passport_middleware.js';
import RoomController from '../controllers/RoomController.js';
const router = express.Router();
const roomController = new RoomController();
router.get('/create', userAuthenticated, roomController.createRoom);
router.get('/join', userAuthenticated, roomController.joinRoom);
export default router;
