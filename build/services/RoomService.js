import RoomRepository from '../repository/RoomRepository.js';
import PlayRoom from '../model/PlayRoom.js';
import { getRandomIntInclusive } from '../utils/util.js';
import RoomSessionService from './RoomSessionService.js';
const roomRepository = new RoomRepository();
const playRooms = roomRepository.getPlayRooms();
const roomSessionService = new RoomSessionService();
export default class RoomService {
    getRooms() {
        return playRooms;
    }
    // Creates room with random id; Adds first player to room, Returns games session data
    createRoom(firstPlayer) {
        const randomId = getRandomIntInclusive(1000, 9999).toString();
        if (playRooms.has(randomId)) {
            // room already exist: return undefined
            return;
        }
        else {
            // create new play room and add first[0] player
            playRooms.set(randomId, new PlayRoom(randomId, firstPlayer));
            // return game session data
            return roomSessionService.generateRoomSessionData(firstPlayer, 0, randomId);
        }
    }
    // 
    /**
     * Adds second player to existing room
     * - if:
     *      - room exist
     *      - first player is set
     *      - second player is not set
     *      - 1st and 2nd player are not the same
     * @param roomId
     * @param secondPlayer
     * @returns RoomSessionData | undefined
     */
    joinRoom(roomId, secondPlayer) {
        // get room (or false if room doesnt exist)
        const playRoom = roomRepository.getPlayRoomById(roomId);
        if (playRoom &&
            playRoom.players[0] &&
            !playRoom.players[1] &&
            playRoom.players[0].id !== secondPlayer.id) {
            // add second player to room
            playRoom.players[1] = secondPlayer;
            // return game session data
            return roomSessionService.generateRoomSessionData(secondPlayer, 1, roomId);
        }
        return;
    }
    // Returns room object by socket id of a player
    getRoomByPlayersSocketId(socketId) {
        let room;
        // loop through all rooms; if there are any players in that room
        // check if there is player with that socket id in room 
        playRooms.forEach(playRoom => {
            if (playRoom.players.length > 0) {
                try {
                    for (let i = 0; i < playRoom.players.length; i++) {
                        if (playRoom.players[i] !== undefined && playRoom.players[i].socketId === socketId) {
                            room = playRoom;
                            break;
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
        });
        return room;
    }
    // Deletes room by id
    deleteRoomById(roomId) {
        return roomRepository.deletePlayRoomById(roomId);
    }
}
