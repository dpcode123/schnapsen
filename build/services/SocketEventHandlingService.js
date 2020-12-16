import RoomRepository from '../repository/RoomRepository.js';
import DisconnectService from './DisconnectService.js';
import RoomSessionService from './RoomSessionService.js';
import MoveHandlingService from './MoveHandlingService.js';
import { validateToken } from '../auth/socket_jwt.js';
import RoomStateDTO from '../dto/RoomStateDTO.js';
import BummerlStateDTO from '../dto/BummerlStateDTO.js';
import GameStateDTO from '../dto/DealStateDTO.js';
import SocketEventValidationService from './SocketEventValidationService.js';
const roomRepository = new RoomRepository();
const socketEventValidationService = new SocketEventValidationService();
export default class SocketEventHandlingService {
    constructor(io, socket) {
        this.init = (socketJwt) => {
            try {
                // validate token; extract payload
                let tokenPayload = validateToken(socketJwt);
                // if token valid
                if (tokenPayload) {
                    // get socket.io session id
                    const socketId = this.socket.id;
                    // get room id
                    const roomId = tokenPayload.roomId;
                    // join to socket.io room
                    this.socket.join(roomId);
                    // get room object
                    const playRoom = roomRepository.getPlayRoomById(roomId);
                    if (playRoom && socketEventValidationService.validate(tokenPayload, playRoom)) {
                        // CLIENT REFRESHED PAGE (user was added before and now has socketId === disconnected)
                        if (playRoom.players[tokenPayload.playerInRoom] &&
                            playRoom.players[tokenPayload.playerInRoom].socketId === 'disconnected') {
                            // assign new socketid to player in room
                            playRoom.players[tokenPayload.playerInRoom].socketId = socketId;
                            // update client
                            this.io.to(socketId).emit('sessionStateUpdate', new RoomStateDTO(playRoom, tokenPayload.playerInRoom).getDTO());
                            this.io.to(socketId).emit('bummerlStateUpdate', new BummerlStateDTO(playRoom.bummerl, tokenPayload.playerInRoom).getDTO());
                            this.io.to(socketId).emit('dealStateUpdateAfterClientRefresh', new GameStateDTO(playRoom.deal, tokenPayload.playerInRoom).getDTO());
                        }
                        else {
                            // assign socketid to player in room
                            playRoom.players[tokenPayload.playerInRoom].socketId = socketId;
                            // (only first player is in room) / (room is full - 2 users)
                            if (!playRoom.players[1]) {
                                this.io.to(roomId).emit('sessionStarting', roomId);
                            }
                            else if (playRoom.players[0] && playRoom.players[1]) {
                                // (session is not already 'started' or 'finished')
                                if (playRoom.status === 'starting') {
                                    // change play session status; update clients
                                    playRoom.status = 'started';
                                    for (let i = 0; i < 2; i++) {
                                        this.io.to(playRoom.players[i].socketId).emit('sessionStateUpdate', new RoomStateDTO(playRoom, i).getDTO());
                                    }
                                    // start 1st bummerl; update clients
                                    playRoom.startBummerl();
                                    for (let i = 0; i < 2; i++) {
                                        this.io.to(playRoom.players[i].socketId).emit('bummerlStart', new BummerlStateDTO(playRoom.bummerl, i).getDTO());
                                    }
                                    // start 1st deal; update clients
                                    playRoom.startDeal();
                                    for (let i = 0; i < 2; i++) {
                                        this.io.to(playRoom.players[i].socketId).emit('gameStart', new GameStateDTO(playRoom.deal, i).getDTO());
                                    }
                                }
                            }
                        }
                    }
                    else {
                        console.log('ERROR: Payload data != room data');
                    }
                }
                else {
                    console.log('ERROR: Token not valid');
                }
            }
            catch (error) {
            }
        };
        this.disconnect = (socketId) => {
            this.disconnectService.disconnect(socketId);
        };
        this.clientMove = (moveDTO) => {
            const socketJwt = moveDTO.socketJwt;
            const playerMove = moveDTO.playerMove;
            // validate token; extract payload
            let tokenPayload = validateToken(socketJwt);
            // if token is valid
            if (tokenPayload) {
                const playerIndex = tokenPayload.playerInRoom;
                // get room id
                const roomId = tokenPayload.roomId;
                // get room object
                const playRoom = roomRepository.getPlayRoomById(roomId);
                if (playRoom) {
                    if (socketEventValidationService.validate(tokenPayload, playRoom)) {
                        // (payload's player data equals to room's player data)
                        // Move type - playCard | exchangeTrump | closeDeck
                        if (playerMove.moveType === 'playCard') {
                            this.moveHandlingService.playCard(playerMove, playerIndex, playRoom);
                        }
                        else if (playerMove.moveType === 'exchangeTrump') {
                            this.moveHandlingService.exchangeTrump(playerMove, playerIndex, playRoom);
                        }
                        else if (playerMove.moveType === 'closeDeck') {
                            this.moveHandlingService.closeDeck(playerMove, playerIndex, playRoom);
                        }
                    }
                    else {
                        console.log('ERROR: Payload data != room data');
                    }
                }
            }
            else {
                console.log('ERROR: Token not valid');
            }
        };
        this.io = io;
        this.socket = socket;
        this.disconnectService = new DisconnectService(io);
        this.roomSessionService = new RoomSessionService();
        this.moveHandlingService = new MoveHandlingService(io, socket);
    }
}
