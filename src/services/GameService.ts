import RoomService from './RoomService.js';
import PlayRoom from '../model/PlayRoom.js';
import { getPlayerIndexInRoomBySocketId } from '../utils/util.js';
const roomService = new RoomService();

export default class GameSessionService {
    
    io: any;

    constructor(io?){
        this.io = io;
    }    

    disconnect = (socketId: string): void  => {
        try {
            const playRoom: PlayRoom | undefined = roomService.getRoomByPlayersSocketId(socketId);

            if (playRoom) {
                const playerIndex: number | undefined = getPlayerIndexInRoomBySocketId(playRoom, socketId);

                if (playerIndex){
                    // change player's socketId to 'disconnected'
                    playRoom.players[playerIndex]!.socketId = 'disconnected';

                    const io1 = this.io;

                    // wait few seconds for eventual client reconnection (on client page refresh)
                    // if still 'disconnected' destroy play room
                    setTimeout(function () {
                        if (playRoom.players[playerIndex]!.socketId === 'disconnected') {
                            // set room status to finished
                            playRoom.status = 'finished';

                            // update users
                            io1.to(playRoom.room).emit('sessionEnd', playRoom.status);

                            // destroy play room
                            roomService.deleteRoomById(playRoom.room);

                            console.log('room deleted');
                        }
                    }, 5000);
                }
                
            }
            
        } catch (error) {
            console.error(error);
        }
    }

}