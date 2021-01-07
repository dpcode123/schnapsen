import UserService from '../services/UserService.js';
import RoomService from '../services/RoomService.js';
import { CustomRequest, CustomResponse } from '../ts/interfaces.js';

export default class AdminController {
    private userService: UserService;
    private roomService: RoomService;

    constructor() {
        this.userService = new UserService();
        this.roomService = new RoomService();
    }

    home = (req: CustomRequest, res: CustomResponse) => {
        res.render('admin');
    }

    users = async (req: CustomRequest, res: CustomResponse) => {
        const users = await this.userService.getUsers();

        res.render('admin-users', {
            data: {
                users: users
            }
        });
    }

    rooms = (req: CustomRequest, res: CustomResponse) => {
        const rooms = this.roomService.getRooms();

        console.log('rooms');
        console.log(rooms);

        res.render('admin-rooms', {
            data: {
                rooms: rooms
            }
        });
    }
    
}