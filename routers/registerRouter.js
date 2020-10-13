const express = require('express');
const registerController = require('../controllers/registerController');
const { userNotAuthenticated } = require('../auth/passportMiddleware');
const router = express.Router();


router.get('/', userNotAuthenticated, (req, res) => {
    res.render('register');
});

router.post('/', userNotAuthenticated, registerController.add_user);


module.exports = router;