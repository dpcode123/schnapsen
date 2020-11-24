import express, { Router } from 'express';
import { userAuthenticated } from '../auth/passport_middleware.js';
import { createRoom, joinRoom } from '../controllers/RoomController.js';

const router: Router = express.Router();

router.get('/create', userAuthenticated, createRoom);
router.get('/join', userAuthenticated, joinRoom);

export default router;