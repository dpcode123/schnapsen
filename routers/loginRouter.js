const express = require('express');
const passport = require('passport');
const { userNotAuthenticated } = require('../auth/passportMiddleware');
const router = express.Router();


router.get('/', userNotAuthenticated, (req, res) => {
    res.render('login');
});

router.post('/', userNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));


module.exports = router;