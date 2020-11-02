// Socket.IO client library
const socket = io();

// Username, Room - passed from server
const username = passedUsername;
const userId = passedUserId;
const room = passedRoom;
const socketJwt = passedToken;

// Session, Bummerl, Game objects
let playSession;
let bummerl;
let game;

// UI states
let showAllWonTricks = false;

// Initialize socket.io connection
socket.emit('init', socketJwt);
