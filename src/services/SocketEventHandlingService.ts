import RoomRepository from '../repository/RoomRepository.js';
import GameService from './GameService.js';
import PlaySessionService from './PlaySessionService.js';
import MoveHandlingService from './MoveHandlingService.js';
import { validateToken } from '../auth/socket_jwt.js';
import RoomStateDTO from '../dto/RoomStateDTO.js';
import BummerlStateDTO from '../dto/BummerlStateDTO.js';
import GameStateDTO from '../dto/GameStateDTO.js';
import SocketEventValidationService from './SocketEventValidationService.js';
import PlayRoom from '../model/PlayRoom.js';
import { GameConnectionObject, MoveEntity, PlayerMove } from '../ts/types.js';

const roomRepository = new RoomRepository();
const socketEventValidationService = new SocketEventValidationService();

export default class SocketEventHandlingService {

    io: any;
    socket: any;
    gameService: GameService;
    playSessionService: PlaySessionService;
    moveHandlingService: MoveHandlingService;

    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.gameService = new GameService(io);
        this.playSessionService = new PlaySessionService();
        this.moveHandlingService = new MoveHandlingService(io, socket);
    }

    init = (socketJwt: string): void => {

        try {
            // validate token; extract payload
            let tokenPayload: GameConnectionObject | undefined = validateToken(socketJwt);
                    
            // if token valid
            if (tokenPayload) {
                // get socket.io session id
                const socketId: string = this.socket.id;

                // get room id
                const roomId: string = tokenPayload.roomId;

                // join to socket.io room
                this.socket.join(roomId);

                // get room object
                const playRoom: PlayRoom | undefined = roomRepository.getPlayRoomById(roomId);
                
                if (playRoom && socketEventValidationService.validate(tokenPayload, playRoom)) {

                    // CLIENT REFRESHED PAGE (user was added before and now has socketId === disconnected)
                    if (playRoom.players[tokenPayload.playerInRoom] && 
                        playRoom.players[tokenPayload.playerInRoom]!.socketId === 'disconnected') {
                        
                        // assign new socketid to player in room
                        playRoom.players[tokenPayload.playerInRoom]!.socketId = socketId;

                        // update client
                        this.io.to(socketId).emit('sessionStateUpdate', new RoomStateDTO(playRoom, tokenPayload.playerInRoom).getDTO());
                        this.io.to(socketId).emit('bummerlStateUpdate', new BummerlStateDTO(playRoom.bummerl, tokenPayload.playerInRoom).getDTO());
                        this.io.to(socketId).emit('gameStateUpdateAfterClientRefresh', new GameStateDTO(playRoom.game, tokenPayload.playerInRoom).getDTO());
                    } else {
                        // assign socketid to player in room
                        playRoom.players[tokenPayload.playerInRoom]!.socketId = socketId;
                        
                        // (only first player is in room) / (room is full - 2 users)
                        if (!playRoom.players[1]) {
                            this.io.to(roomId).emit('sessionStarting', roomId);
                        } else if (playRoom.players[0] && playRoom.players[1]) {

                            // (session is not already 'started' or 'finished')
                            if (playRoom.status === 'starting') {

                                // change play session status; update clients
                                playRoom.status = 'started';
                                for(let i=0; i<2; i++) {
                                    this.io.to(playRoom.players[i]!.socketId).emit('sessionStateUpdate', new RoomStateDTO(playRoom, i).getDTO());
                                }
                                
                                // start 1st bummerl; update clients
                                playRoom.startBummerl();
                                for(let i=0; i<2; i++) {
                                    this.io.to(playRoom.players[i]!.socketId).emit('bummerlStart', new BummerlStateDTO(playRoom.bummerl, i).getDTO());
                                }

                                // start 1st game; update clients
                                playRoom.startGame();
                                for(let i=0; i<2; i++) {
                                    this.io.to(playRoom.players[i]!.socketId).emit('gameStart', new GameStateDTO(playRoom.game, i).getDTO());
                                }
                            }
                        }
                    }
                } else {
                    console.log('ERROR: Payload data != room data');
                }
            } else {
                console.log('ERROR: Token not valid');
            }            
        } catch (error) {
            
        }
        
        
    }

    disconnect = (socketId: string): void  => {
        this.gameService.disconnect(socketId);
    }

    clientMove = (moveDTO: MoveEntity): void  => {

        const socketJwt: string = moveDTO.socketJwt;
        const playerMove: PlayerMove = moveDTO.playerMove;

        // validate token; extract payload
        let tokenPayload: GameConnectionObject | undefined = validateToken(socketJwt);
        
        // if token is valid
        if (tokenPayload) {

            const playerIndex: number = tokenPayload.playerInRoom;
            
            // get room id
            const roomId: string = tokenPayload.roomId;

            // get room object
            const playRoom: PlayRoom | undefined = roomRepository.getPlayRoomById(roomId);

            if (playRoom) {
                if (socketEventValidationService.validate(tokenPayload, playRoom)) {
                    // (payload's player data equals to room's player data)
        
                        // Move type - playCard | exchangeTrump | closeDeck
                        if (playerMove.moveType === 'playCard') {
                            this.moveHandlingService.playCard(playerMove, playerIndex, playRoom);

                        } else if (playerMove.moveType === 'exchangeTrump') {
                            this.moveHandlingService.exchangeTrump(playerMove, playerIndex, playRoom);
                            
                        } else if (playerMove.moveType === 'closeDeck') {
                            this.moveHandlingService.closeDeck(playerMove, playerIndex, playRoom);
                        }
                    } else {
                        console.log('ERROR: Payload data != room data');
                    }
            }
            
        } else {
            console.log('ERROR: Token not valid');
        }
    }
}