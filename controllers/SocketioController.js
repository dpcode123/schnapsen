const { getPlayRooms, getPlayRoomById } = require('../repository/roomRepository');
const GameService = require('../services/GameService');
const MoveService = require('../services/MoveService');
const { validateToken } = require('../auth/socketJwt');
const RoomStateDTO = require('../dto/RoomStateDTO');
const BummerlStateDTO =require('../dto/BummerlStateDTO');
const GameStateDTO = require('../dto/GameStateDTO');
const socketEventValidationService = require('../services/socketEventValidationService');

module.exports = function(io) {

    // Runs when client connects
    io.on('connection', socket => {

        try {

            const gameService = new GameService(io);
            const moveService = new MoveService(io, socket);

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
                    const playRoom = getPlayRoomById(roomId);
                    
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
                
                // if token valid
                if(tokenPayload) {

                    const playerIndex = tokenPayload.playerInRoom;

                    // get socket.io session id
                    const socketId = socket.id;
                    
                    // get room id
                    const roomId = tokenPayload.roomId;

                    // get room object
                    const playRoom = getPlayRoomById(roomId);

                    // check if payload's player data equals to room's player data
                    if(socketEventValidationService.validate(tokenPayload, playRoom)){

                        // MOVE TYPE - PLAY CARD
                        if(move.moveType === 'card'){
                            if(moveService.validateMove(move)){
                                moveService.handleMove_card(move, playerIndex, playRoom);
                            }
                        }
                        // MOVE TYPE - EXCHANGE TRUMP CARD
                        else if(move.moveType === 'exchangeTrumpCard'){
                            if(moveService.validateMove(move)){
                                moveService.handleMove_exchangeTrump(move, playerIndex, playRoom);
                            }
                        }
                        // MOVE TYPE - CLOSE DECK
                        else if(move.moveType === 'closeDeck'){
                                                
                        }
                        // MOVE TYPE - FOLD HAND
                        else if(move.moveType === 'foldHand'){
                            
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