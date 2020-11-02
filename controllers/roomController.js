const playRoomService = require('../services/PlayRoomService');
const { signToken } = require('../auth/socketJwt');

const create_room = (req, res) => {
    // logged in user
    console.log(req.session.passport.user);
    const player = req.session.passport.user;

    // create room, add player to room, get room's id, 
    const roomId = playRoomService.createRoom(player);

    if(roomId) {
        // connection object - for jwt
        const connectionObject = {
            userId: player.id,
            username: player.username,
            playerInRoom: 0,
            roomId: roomId
        };

        // jwt token for socket.io connection
        const socketJwt = signToken(connectionObject);

        // game session data; add to express session
        const gameSessionData = {u: player.username, i: player.id, r: roomId, t: socketJwt};
        req.session.gameSessionData = gameSessionData;
        //console.log('req.session.gameSessionData');
        //console.log(req.session.gameSessionData);

        // redirect
        res.redirect(`/game`);
    }
    else{
        // redirect to homepage if room already exists
        res.redirect(`/`);
    }
}

const join_room = (req, res) => {
    // logged in user
    //console.log(req.session.passport.user);
    const player = req.session.passport.user;

    // get room id from submitted form
    let roomId = req.query.roomId;

    // check if room exist, join player to room
    const joinedToRoom = playRoomService.joinRoom(roomId, player);

    // if room exist and player is added to room
    if(joinedToRoom) {
        // connection object - for jwt
        const connectionObject = {
            userId: player.id,
            username: player.username,
            playerInRoom: 1,
            roomId: roomId
        };

        // jwt token for socket.io connection
        const socketJwt = signToken(connectionObject);

        // game session data; add to express session
        const gameSessionData = {u: player.username, i: player.id, r: roomId, t: socketJwt};
        req.session.gameSessionData = gameSessionData;

        // redirect
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