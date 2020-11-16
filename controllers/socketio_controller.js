import RoomRepository from '../repository/room_repository.js';
import GameService from '../services/GameService.js';
import MoveHandlingService from '../services/MoveHandlingService.js';
import { validateToken } from '../auth/socket_jwt.js';
import RoomStateDTO from '../dto/room_state_dto.js';
import BummerlStateDTO from '../dto/bummerl_state_dto.js';
import GameStateDTO from '../dto/game_state_dto.js';
import SocketEventValidationService from '../services/SocketEventValidationService.js';

const roomRepository = new RoomRepository();
const socketEventValidationService = new SocketEventValidationService();

export default function SocketioController(io) {

    // Runs when client connects
    io.on('connection', socket => {

        const gameService = new GameService(io);
        const moveHandlingService = new MoveHandlingService(io, socket);

        try {
            
            // Runs when client initializes socket.io connection
            socket.on('init', (socketJwt) => {
                // validate token; extract payload
                let tokenPayload = validateToken(socketJwt);
                
                // if token valid
                if(tokenPayload){
                    // get socket.io session id
                    const socketId = socket.id;

                    // get room id
                    const roomId = tokenPayload.roomId;

                    // join to socket.io room
                    socket.join(roomId);

                    // get room object
                    const playRoom = roomRepository.getPlayRoomById(roomId);
                    
                    // check if payload's player data equals to room's player data
                    if(socketEventValidationService.validate(tokenPayload, playRoom)){
                        
                        // PAGE REFRESH
                        // check if user was added before and now has socketId === disconnected
                        if(playRoom.players[tokenPayload.playerInRoom] && 
                            playRoom.players[tokenPayload.playerInRoom].socketId === 'disconnected'){
                                // assign socketid to player in room
                                playRoom.players[tokenPayload.playerInRoom].socketId = socketId;

                                // update client
                                io.to(socketId).emit('sessionStateUpdate', new RoomStateDTO(playRoom, tokenPayload.playerInRoom));
                                io.to(socketId).emit('bummerlStateUpdate', new BummerlStateDTO(playRoom.bummerl, tokenPayload.playerInRoom));
                                io.to(socketId).emit('gameStateUpdateAfterClientRefresh', new GameStateDTO(playRoom.game, tokenPayload.playerInRoom));
                        }
                        else{
                            // assign socketid to player in room
                            playRoom.players[tokenPayload.playerInRoom].socketId = socketId;
                            
                            // only one user is in room
                            if(!playRoom.players[1]){
                                io.to(roomId).emit('sessionStarting', roomId);
                            }
                            // room is full (2 users)
                            else if(playRoom.players[0] && playRoom.players[1]){

                                // if session is not already started or finished
                                if(playRoom.status === 'starting'){
                                
                                    // change play session status
                                    playRoom.status = 'started';

                                    // update clients
                                    for(let i=0; i<2; i++){
                                        io.to(playRoom.players[i].socketId).emit('sessionStateUpdate', new RoomStateDTO(playRoom, i));
                                    }
                                    
                                    // start 1st bummerl; update clients
                                    playRoom.startBummerl();
                                    //io.to(roomId).emit('bummerlStart', playRoom.bummerl);
                                    for(let i=0; i<2; i++){
                                        io.to(playRoom.players[i].socketId).emit('bummerlStart', new BummerlStateDTO(playRoom.bummerl, i));
                                    }

                                    // start 1st game
                                    playRoom.startGame();

                                    // update clients
                                    for(let i=0; i<2; i++){
                                        io.to(playRoom.players[i].socketId).emit('gameStart', new GameStateDTO(playRoom.game, i));
                                    }
                                }
                            }
                        }
                    }
                    else{
                        console.log('payload data != room data');
                    }
                }
                else{
                    console.log('token not valid');
                }
            });


            // ROOM - Runs when client disconnects
            socket.on('disconnect', () => {
                gameService.disconnect(socket.id);
            });


            // GAMEPLAY - listen for player moves from client
            socket.on('clientMove', (moveDTO) => {
                
                const socketJwt = moveDTO.socketJwt;
                const move = moveDTO.playerMove;

                // validate token; extract payload
                let tokenPayload = validateToken(socketJwt);
                
                // if token is valid
                if(tokenPayload) {

                    const playerIndex = tokenPayload.playerInRoom;

                    // get socket.io session id
                    const socketId = socket.id;
                    
                    // get room id
                    const roomId = tokenPayload.roomId;

                    // get room object
                    const playRoom = roomRepository.getPlayRoomById(roomId);

                    // check if payload's player data equals to room's player data
                    if(socketEventValidationService.validate(tokenPayload, playRoom)){
                        // MOVE TYPE - PLAY CARD
                        if(move.moveType === 'playCard'){
                            moveHandlingService.playCard(move, playerIndex, playRoom);
                        }
                        // MOVE TYPE - EXCHANGE TRUMP CARD
                        else if(move.moveType === 'exchangeTrump'){
                            moveHandlingService.exchangeTrump(move, playerIndex, playRoom);
                        }
                        // MOVE TYPE - CLOSE DECK
                        else if(move.moveType === 'closeDeck'){
                            moveHandlingService.closeDeck(move, playerIndex, playRoom);
                        }
                    }
                    else{
                        console.log('payload data != room data');
                    }
                }
                else{
                    console.log('token not valid');
                }

        });
    
        } catch (error) {
            console.error(error);
        }

    });

}