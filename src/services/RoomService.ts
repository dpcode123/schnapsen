import RoomRepository from '../repository/RoomRepository.js';
import PlayRoom from '../model/PlayRoom.js';
import { getRandomIntInclusive } from '../utils/util.js';
import GameSessionService from './PlaySessionService.js';
import { GameSessionData } from '../ts/types.js';
import { Player } from '../ts/interfaces.js';

const roomRepository = new RoomRepository();
const playRooms = roomRepository.getPlayRooms();
const gameSessionService = new GameSessionService();

export default class RoomService {

        // Creates room with random id; Adds first player to room, Returns games session data
        createRoom(firstPlayer: Player): GameSessionData | undefined {
            
            const randomId: string = getRandomIntInclusive(1000, 9999).toString();

            if (playRooms.has(randomId)) {
                // room already exist: return undefined
                return;
            } else {
                // create new play room and add first[0] player
                playRooms.set(randomId, new PlayRoom(randomId, firstPlayer));
                // return game session data
                return gameSessionService.generateGameSessionData(firstPlayer, 0, randomId);
            }
        }
        
        // Adds second player to existing room
        joinRoom(roomId: string, secondPlayer: Player): GameSessionData | undefined {
            // get room (or false if room doesnt exist)
            const playRoom: PlayRoom | undefined = roomRepository.getPlayRoomById(roomId);
        
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
        getRoomByPlayersSocketId(socketId: string): PlayRoom | undefined {
            let room: any;
        
            // loop through all rooms; if there are any players in that room
            // check if there is player with that socket id in room 
            playRooms.forEach(playRoom => {
                if (playRoom.players.length > 0) {
                    try {
                        for (let i = 0; i < playRoom.players.length; i++) {
                            if (playRoom.players[i] !== undefined && playRoom.players[i]!.socketId === socketId) {
                                room = playRoom;
                                break;
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
            return room;
        }
        
        // Deletes room by id
        deleteRoomById(roomId: string): boolean {
            return roomRepository.deletePlayRoomById(roomId);
        }
    
    
}

