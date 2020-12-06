// Socket.IO client library
const socket = io();

// Game client
const gameClient = new GameClient(
    passedUsername, 
    passedUserId, 
    passedRoom, 
    passedSocketJwt,
    passedUserCardFace,
    passedUserCardBack);

// Session, Bummerl, Game objects
let playSession;
let bummerl;
let game;

// Initialize socket.io connection
socket.emit('init', gameClient.socketJwt);
