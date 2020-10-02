const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const SocketioController = require('./controllers/SocketioController');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Main controller
const socketioController = new SocketioController(io);

// Port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
