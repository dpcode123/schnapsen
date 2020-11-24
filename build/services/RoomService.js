import RoomRepository from '../repository/RoomRepository.js';
import PlayRoom from '../model/PlayRoom.js';
import { getRandomIntInclusive } from '../utils/util.js';
import GameSessionService from './PlaySessionService.js';
const roomRepository = new RoomRepository();
const playRooms = roomRepository.getPlayRooms();
const gameSessionService = new GameSessionService();
export default class RoomService {
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
            return gameSessionService.generateGameSessionData(firstPlayer, 0, randomId);
        }
    }
    // Adds second player to existing room
    joinRoom(roomId, secondPlayer) {
        // get room (or false if room doesnt exist)
        const playRoom = roomRepository.getPlayRoomById(roomId);
        if (playRoom) {
            if (playRoom.players[0] && !playRoom.players[1]) {
                // (if room exist, first player is set, second is not set): add second[1] player to room
                playRoom.players[1] = secondPlayer;
                return gameSessionService.generateGameSessionData(secondPlayer, 1, roomId);
            }
        }
        return;
    }
    // Returns room object by socket id of a player
    getRoomByPlayersSocketId(socketId) {
        let room;
        // loop through all rooms
        playRooms.forEach(playRoom => {
            // if there are any players in room
            if (playRoom.players.length > 0) {
                // if there is any player in room with that socket id
                try {
                    if (playRoom.players.filter(player => player.socketId === socketId).length === 1) {
                        room = playRoom;
                    }
                }
                catch (error) {
                    console.error(error);
                }
                /* playRoom.players.forEach(player => {
                    if (player !== undefined && player.socketId === socketId) {
                        room = playRoom;
                    }
                }); */
            }
        });
        return room;
    }
    // Deletes room by id
    deleteRoomById(roomId) {
        return roomRepository.deletePlayRoomById(roomId);
    }
}
