import PlayRoom from "../model/PlayRoom";

// Player index in room 1<->0
export function otherPlayer(firstPlayer: number): number {
    return 1-firstPlayer;
}

// Delay in microseconds
export function delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns random int in range 0 to n-1 (max exclusive)
// - input (3) -> expected output 0, 1 or 2
export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

// Returns random int in range (min and max inclusive)
// - input (0,3) -> expected output 0, 1, 2 or 3
export function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Gets user's index in room (0 or 1) by socket.io id
export function getPlayerIndexInRoomBySocketId(playRoom: PlayRoom, socketId: string): number | undefined {
    let playerIndex;

    if (playRoom && socketId) {
        if (playRoom.players[0]!.socketId === socketId) {
            playerIndex = 0;
        } else if (playRoom.players[1]!.socketId === socketId) {
            playerIndex = 1;
        }
    }
    return playerIndex;
}

// Gets user's index in room (0 or 1) by user id
export function getPlayerIndexInRoomByUserId(playRoom: PlayRoom, userId: number): number | undefined {
    let playerIndex;

    if (playRoom && userId) {
        if (playRoom.players[0]!.id === userId) {
            playerIndex = 0;
        } else if (playRoom.players[1]!.id === userId) {
            playerIndex = 1;
        }
    }
    return playerIndex;
}
