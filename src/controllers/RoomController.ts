import RoomService from '../services/RoomService.js';
import { Player, CustomRequest, CustomResponse } from '../ts/interfaces.js';
import { RoomSessionData } from '../ts/types.js';

export default class RoomController {

    roomService: RoomService;

    constructor() {
        this.roomService = new RoomService();
    }

    createRoom = (req: CustomRequest, res: CustomResponse): void => {
        // logged in user
        const player: Player = req.session.passport.user;
        
        // create random room, add player to room 
        const roomSessionData: RoomSessionData | undefined = this.roomService.createRoom(player);
    
        if (roomSessionData) {
            // (room is created and first player is joined to room)
            // add to express session and redirect to game page
            req.session.roomSessionData = roomSessionData;
            res.redirect(`/play`);
        } else {
            res.redirect(`/`);
        }
    }
    
    joinRoom = (req: CustomRequest, res: CustomResponse): void => {
        // logged in user
        const player: Player = req.session.passport.user;
    
        // get room id from submitted form
        const roomId: string = req.query.roomId;
    
        // join player to room and return game session data
        const roomSessionData: RoomSessionData | undefined = this.roomService.joinRoom(roomId, player);
    
        if (roomSessionData) {
            // (room exist and second player is joined to room)
            // add to express session and redirect to game page
            req.session.roomSessionData = roomSessionData;
            res.redirect(`/play`);
        } else {
            res.redirect(`/`);
        }  
    }
    

}





