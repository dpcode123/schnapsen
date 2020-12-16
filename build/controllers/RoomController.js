import RoomService from '../services/RoomService.js';
export default class RoomController {
    constructor() {
        this.createRoom = (req, res) => {
            // logged in user
            const player = req.session.passport.user;
            // create random room, add player to room 
            const roomSessionData = this.roomService.createRoom(player);
            if (roomSessionData) {
                // (room is created and first player is joined to room)
                // add to express session and redirect to game page
                req.session.roomSessionData = roomSessionData;
                res.redirect(`/play`);
            }
            else {
                res.redirect(`/`);
            }
        };
        this.joinRoom = (req, res) => {
            // logged in user
            const player = req.session.passport.user;
            // get room id from submitted form
            const roomId = req.query.roomId;
            // join player to room and return game session data
            const roomSessionData = this.roomService.joinRoom(roomId, player);
            if (roomSessionData) {
                // (room exist and second player is joined to room)
                // add to express session and redirect to game page
                req.session.roomSessionData = roomSessionData;
                res.redirect(`/play`);
            }
            else {
                res.redirect(`/`);
            }
        };
        this.roomService = new RoomService();
    }
}
