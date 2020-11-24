import express from 'express';
import { userAuthenticated } from '../auth/passport_middleware.js';
const router = express.Router();
// Index page
router.get('/', userAuthenticated, (req, res) => {
    res.render('index');
});
// Protected page
router.get('/protected-page', userAuthenticated, (req, res) => {
    res.render('protected-page');
});
// Join page
router.get('/join-room', userAuthenticated, (req, res) => {
    res.render('join-room');
});
// Game page
router.get('/game', userAuthenticated, (req, res) => {
    const reqSession = req.session;
    const gameSessionData = reqSession.gameSessionData;
    res.render('game', gameSessionData);
});
// 404 page
router.use((req, res) => {
    res.status(404).render('404');
});
export default router;
