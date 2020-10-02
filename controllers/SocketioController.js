const GameService = require('../services/GameService');

module.exports = function(io){

    // Runs when client connects
    io.on('connection', socket => {

        const gameService = new GameService(io, socket);

        // Runs when client joins room
        socket.on('joinRoom', ({ username, room }) => {
            gameService.joinRoom(username, room);
        });

        // Runs when client disconnects
        socket.on('disconnect', () => {
            gameService.disconnect();
        });

        // GAMEPLAY - listen for player moves from client
        socket.on('clientMove', move => {
            gameService.clientMove(move);
        });
    });
}