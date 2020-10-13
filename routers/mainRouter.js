const express = require('express');
const { userAuthenticated } = require('../auth/passportMiddleware');
//### controller
const router = express.Router();


// Index page
router.get('/', userAuthenticated, (req, res) => {
    res.render('index');
});

// Protected page
router.get('/protected-page', userAuthenticated, (req, res) => {
    res.render('protected-page'/*, { name: req.user.name }*/)
})

// Join page
router.get('/join-room', userAuthenticated, (req, res) => {
    res.render('join-room');
});

// game page
router.get('/game', userAuthenticated, (req, res) => {
    const gameSessionData = req.session.gameSessionData;
    res.render('game', gameSessionData);
});

// 404 page
router.use((req, res) => {
    res.status(404).render('404');
});



module.exports = router;