import socketio from 'socket.io';
import ExpressLoader from './loaders/ExpressLoader.js';
import SocketioController from './controllers/SocketioController.js';
const express = new ExpressLoader();
const server = express.getServer();
const io = socketio(server);
SocketioController(io);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
