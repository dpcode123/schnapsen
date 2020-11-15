import RoomRepository from '../repository/RoomRepository.js';
import PlayRoom from '../model/PlayRoom.js';
import { getRandomIntInclusive } from '../utils/util.js';
import GameSessionService from './game_session_service.js';

const roomRepository = new RoomRepository();
const playRooms = roomRepository.getPlayRooms();
const gameSessionService = new GameSessionService();

export default class PlayRoomService {
    constructor() {
        this.createRoom = function(firstPlayer) {
            // generate random room id
            const randomId = getRandomIntInclusive(1000, 9999).toString();
        
            // if room already exist return false
            if(playRooms.has(randomId)) {
                return false;
            }
            // create new play room and add first[0] player
            else{
                playRooms.set(randomId, new PlayRoom(randomId, firstPlayer));
                //return randomId;
                return gameSessionService.generateGameSessionData(firstPlayer, 0, randomId);
            }
        }
        
        this.joinRoom = function(roomId, secondPlayer) {
            // get room (or false if room doesnt exist)
            const playRoom = roomRepository.getPlayRoomById(roomId);
        
            // if room exist and first player is set and second is not
            if(playRoom) {
                if(playRoom.players[0] && !playRoom.players[1]){
                    // add second[1] player to room
                    playRoom.players[1] = secondPlayer;
        
                    //return true;
                    return gameSessionService.generateGameSessionData(secondPlayer, 1, roomId);
                }
            }
            return false;
        }
        
        this.getRoomByPlayersSocketId = function(socketId) {
            let room = false;
        
            // loop through all rooms
            playRooms.forEach(playRoom => {
                // if there are any players in room
                if(playRoom.players.length > 0){
                    // if there is any player in room with that socket id
                    try {
                        if(playRoom.players.filter(player => player.socketId === socketId).length === 1){
                            room = playRoom;
                        }
                    } catch (error) {
                        console.error(error);
                    }
                    /* playRoom.players.forEach(player => {
                        if(player !== null && player.socketId === socketId){
                            room = playRoom;
                        }
                    }); */
                }
            });
            return room;
        }
        
        // Deletes room by id
        this.deleteRoomById = function(roomId) {
            return roomRepository.deletePlayRoomById(roomId);
        }
    }
    
}

