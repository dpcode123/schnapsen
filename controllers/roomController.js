const playRoomService = require('../services/PlayRoomService');

const create_room = (req, res) => {
    // logged in user
    const player = req.session.passport.user;

    // create random room, add player to room 
    const gameSessionData = playRoomService.createRoom(player);

    // (room is created and first player is joined to room)
    if(gameSessionData) {
        // add to express session and redirect to game page
        req.session.gameSessionData = gameSessionData;
        res.redirect(`/game`);
    }
    else{
        res.redirect(`/`);
    }
}

const join_room = (req, res) => {
    // logged in user
    const player = req.session.passport.user;

    // get room id from submitted form
    const roomId = req.query.roomId;

    // join player to room
    const gameSessionData = playRoomService.joinRoom(roomId, player);

    // (room exist and second player is joined to room)
    if(gameSessionData) {
        // add to express session and redirect to game page
        req.session.gameSessionData = gameSessionData;
        res.redirect(`/game`);
    }
    else{
        res.redirect(`/`);
    }  
}

module.exports = {
    create_room,
    join_room
}