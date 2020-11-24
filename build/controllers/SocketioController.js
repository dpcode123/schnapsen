import SocketEventHandlingService from '../services/SocketEventHandlingService.js';
export default function SocketioController(io) {
    // Runs when client connects
    io.on('connection', socket => {
        const socketEventHandlingService = new SocketEventHandlingService(io, socket);
        try {
            // Runs when client initializes socket.io connection
            socket.on('init', (socketJwt) => {
                socketEventHandlingService.init(socketJwt);
            });
            // Runs when client disconnects socket.io connection
            socket.on('disconnect', () => {
                socketEventHandlingService.disconnect(socket.id);
            });
            // GAMEPLAY - listen for player moves from client
            socket.on('clientMove', (moveDTO) => {
                socketEventHandlingService.clientMove(moveDTO);
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
