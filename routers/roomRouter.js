const express = require('express');
const { userAuthenticated } = require('../auth/passportMiddleware');
const roomController = require('../controllers/roomController');
const router = express.Router();

router.get('/create', userAuthenticated, roomController.create_room);
router.get('/join', userAuthenticated, roomController.join_room);

module.exports = router;