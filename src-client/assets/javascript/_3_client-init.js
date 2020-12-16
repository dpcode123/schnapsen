// Socket.IO client library
const socket = io();

// Schnaps client
const gameClient = new GameClient(
    passedUsername, 
    passedUserId, 
    passedRoom, 
    passedSocketJwt,
    passedUserCardFace,
    passedUserCardBack);

// Session, Bummerl, Deal objects
let playSession;
let bummerl;
let deal;

// Initialize socket.io connection
socket.emit('init', gameClient.socketJwt);
