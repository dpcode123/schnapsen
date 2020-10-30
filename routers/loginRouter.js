const express = require('express');
//const passport = require('passport');
const loginController = require('../controllers/loginController');
const { userNotAuthenticated } = require('../auth/passportMiddleware');
const router = express.Router();

router.get('/', userNotAuthenticated, (req, res) => {
    res.render('login');
});

router.post('/', userNotAuthenticated, loginController.login_user);


module.exports = router;