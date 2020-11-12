/**
 * Play session (CLIENT SIDE)
 */
class PlaySession {
    constructor(playSessionDTO){
        this.room = playSessionDTO.room;
        this.status = playSessionDTO.status;
        this.playerName = playSessionDTO.playerName;
        this.opponentName = playSessionDTO.opponentName;
        this.bummerlsLostPlayer = playSessionDTO.bummerlsLostPlayer;
        this.bummerlsLostOpponent = playSessionDTO.bummerlsLostOpponent;
    }
}


/**
 * Bummerl (CLIENT SIDE)
 */
class Bummerl {
    constructor(bummerlDTO){
        this.num = bummerlDTO.num;
        this.status = bummerlDTO.status;
        this.gamePointsPlayer = bummerlDTO.gamePointsPlayer;
        this.gamePointsOpponent = bummerlDTO.gamePointsOpponent;
    }
}


/**
 * Game (CLIENT SIDE)
 */
class Game {
    constructor(gameStateDTO){

        // game number in bummerl (1...13)
        this.num = gameStateDTO.num;

        // player on turn: 0/1
        this.playerOnTurn = gameStateDTO.playerOnTurn;

        // trump card
        this.trumpCard = gameStateDTO.trumpCard;

        // trump suit
        this.trumpSuit = gameStateDTO.trumpSuit;

        // trick number: 1-10
        this.trickNum = gameStateDTO.trickNum;

        // move number
        this.moveNum = gameStateDTO.moveNum;

        // Lead(true) or Response(false)
        this.leadOrResponse = gameStateDTO.leadOrResponse;

        // Lead card played (if current state is response, else null)
        this.leadCardOnTable = gameStateDTO.leadCardOnTable;

        // deck closed or out of cards
        this.deckClosed = gameStateDTO.deckClosed;

        // points for player: 0-66
        this.playerPoints = gameStateDTO.playerPoints;

        // cards in player hands
        this.cardsInHand = gameStateDTO.cardsInHand;

        // is this player on turn or not
        this.thisPlayerOnTurn = gameStateDTO.thisPlayerOnTurn;

        // number of cards left in deck
        this.deckSize = gameStateDTO.deckSize;

        // won tricks(cards) by player
        this.playerWonCards = gameStateDTO.playerWonCards;

        // won 1st trick(2 cards) by opponent
        this.opponentWonCardsFirstTrick = gameStateDTO.opponentWonCardsFirstTrick;

        // total number of cards in opponent won tricks
        this.opponentTotalWonCardsNumber = gameStateDTO.opponentTotalWonCardsNumber;

        // marriages
        this.marriagesInHand = gameStateDTO.marriagesInHand;
    }
}


/**
 * PlayerMove (CLIENT SIDE)
 * @param {string} roomId - unique game id (room id)
 * @param {number} userId - user id
 * @param {string} socketId - socket.io id
 * @param {number} moveNum - total move number in game, for both players (0,1,2...n)
 * @param {string} moveType - card, exchangeTrumpCard, closeDeck, foldHand
 * @param {number} trickNum - trick number, 1-10
 * @param {boolean} leadOrResponse - TRUE-lead play(1st card played in trick), FALSE-response play(2nd card)
 * @param {string} cardName - card played(card name: 'a-karo','j-pik') - only for moveType 'playCard'
 * */
class PlayerMove {
    constructor(roomId, userId, socketId, moveNum, moveType, trickNum, leadOrResponse, cardName){
        this.roomId = roomId;
        this.userId = userId;
        this.socketId = socketId;
        this.moveNum = moveNum;
        this.moveType = moveType;
        this.trickNum = trickNum;
        this.leadOrResponse = leadOrResponse;
        this.cardName = cardName;
    }
}