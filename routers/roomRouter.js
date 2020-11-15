import express from 'express';
import { userAuthenticated } from '../auth/passportMiddleware.js';
import { createRoom, joinRoom } from '../controllers/RoomController.js';

const router = express.Router();

router.get('/create', userAuthenticated, createRoom);
router.get('/join', userAuthenticated, joinRoom);

export default router; /** */