
import socketio from 'socket.io';





// Play sessions map
const playSessions = new Map();


import ExpressLoader from './controllers/ExpressLoader.js';
const express = new ExpressLoader();
const server = express.getServer();

const io = socketio(server);
import SocketioController from './controllers/SocketioController.js';





// Socket.io controller
const socketioController = new SocketioController(io, playSessions);

// Port number
const PORT = process.env.PORT || 3000;

// Listen for requests
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
