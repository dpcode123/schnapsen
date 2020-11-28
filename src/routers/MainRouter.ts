import express, { Router } from 'express';
import { userAuthenticated } from '../auth/passport_middleware.js';
import { CustomRequest, CustomResponse } from '../ts/interfaces.js';

const router: Router = express.Router();

// Index page
router.get('/', userAuthenticated, (req: CustomRequest, res: CustomResponse): void => {
    res.render('index', {
        userdata: {
            username: req.session.passport.user.username,
            id: req.session.passport.user.id,
        }
    });
});

// Join page
router.get('/join-room', userAuthenticated, (req: CustomRequest, res: CustomResponse): void => {
    res.render('join-room');
});

// Game page
router.get('/game', userAuthenticated, (req: CustomRequest, res: CustomResponse): void => {
    const reqSession: any = req.session;
    const gameSessionData = reqSession.gameSessionData;
    res.render('game', gameSessionData);
});

// 404 page
router.use((req: CustomRequest, res: CustomResponse): void => {
    res.status(404).render('404');
});

export default router;