// Socket.IO client library
const socket = io();

// Game client
const gameClient = new GameClient(passedUsername, passedUserId, passedRoom, passedSocketJwt);

console.log(gameClient);

// Session, Bummerl, Game objects
let playSession;
let bummerl;
let game;

// UI states
let showAllWonTricks = false;

// Initialize socket.io connection
socket.emit('init', gameClient.socketJwt);
