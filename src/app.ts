import { Server } from 'http';
import socketio from 'socket.io';
import ExpressLoader from './loaders/ExpressLoader.js';
import SocketioController from './controllers/SocketioController.js';

const express: ExpressLoader = new ExpressLoader();
const server: Server = express.getServer();

const io: Server = socketio(server);
SocketioController(io);


const PORT: string | number = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));