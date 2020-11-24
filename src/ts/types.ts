export type MoveType = "playCard" | "exchangeTrump" | "closeDeck";

export type PlayerMove = {
    roomId: string,
    userId: number,
    socketId: string,
    moveNum: number,
    moveType: MoveType,
    trickNum: number,
    leadOrResponse: boolean,
    cardName: string,
}

export type MoveEntity = {
    socketJwt: string,
    playerMove: PlayerMove,
}

export type CardsMarriage = {
    suit: string,
    points: number,
}

export type GameConnectionObject = {
    userId: number,
    username: string,
    playerInRoom: number,
    roomId: string,
}

export type GameSessionData = {
    u: string, 
    i: number, 
    r: string, 
    t: string,
}