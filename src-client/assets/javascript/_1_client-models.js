/**
 * Client
 */
class GameClient {
    constructor(username, userId, room, socketJwt, cardFace, cardBack) {
        // constant properties
        this.username = username;
        this.userId = userId;
        this.room = room;
        this.socketJwt = socketJwt;
        this.cardFace = cardFace;
        this.cardBack = cardBack;

        // mutable properties
        this.canMakeMove = true;

        // UI states
        this.showAllWonTricks = false;
    }
}


/**
 * Play session (CLIENT SIDE)
 */
class PlaySession {
    constructor(playSessionDTO) {
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
    constructor(bummerlDTO) {
        this.num = bummerlDTO.num;
        this.status = bummerlDTO.status;
        this.gamePointsPlayer = bummerlDTO.gamePointsPlayer;
        this.gamePointsOpponent = bummerlDTO.gamePointsOpponent;
    }
}


/**
 * Deal (CLIENT SIDE)
 */
class Deal {
    constructor(dealStateDTO) {

        //  number in bummerl (1...13)
        this.num = dealStateDTO.num;

        // player on turn: 0/1
        this.playerOnTurn = dealStateDTO.playerOnTurn;

        // trump card
        this.trumpCard = dealStateDTO.trumpCard;

        // trump suit
        this.trumpSuit = dealStateDTO.trumpSuit;

        // trick number: 1-10
        this.trickNum = dealStateDTO.trickNum;

        // move number
        this.moveNum = dealStateDTO.moveNum;

        // Lead(true) or Response(false)
        this.leadOrResponse = dealStateDTO.leadOrResponse;

        // Lead card played (if current state is response, otherwise null)
        this.leadCardOnTable = dealStateDTO.leadCardOnTable;

        // deck closed or out of cards
        this.deckClosed = dealStateDTO.deckClosed;

        // points for player: 0-66
        this.playerPoints = dealStateDTO.playerPoints;

        // cards in player hands
        this.cardsInHand = dealStateDTO.cardsInHand;

        // is this player on turn or not
        this.isThisPlayerOnTurn = dealStateDTO.isThisPlayerOnTurn;

        // number of cards left in deck
        this.deckSize = dealStateDTO.deckSize;

        // won tricks(cards) by player
        this.playerWonCards = dealStateDTO.playerWonCards;

        // won 1st trick(2 cards) by opponent
        this.opponentWonCardsFirstTrick = dealStateDTO.opponentWonCardsFirstTrick;

        // total number of cards in opponent won tricks
        this.opponentTotalWonCardsNumber = dealStateDTO.opponentTotalWonCardsNumber;

        // marriages
        this.marriagesInHand = dealStateDTO.marriagesInHand;
    }
}


/**
 * PlayerMove (CLIENT SIDE)
 * @param {string} roomId - room id
 * @param {number} userId - user id (from db)
 * @param {string} socketId - socket.io id
 * @param {number} moveNum - total move number in , for both players (0,1,2...n)
 * @param {string} moveType - card, exchangeTrumpCard, closeDeck, foldHand
 * @param {number} trickNum - trick number, 1-10
 * @param {boolean} leadOrResponse - TRUE-lead play(1st card played in trick), FALSE-response play(2nd card)
 * @param {string} cardName - card played(card name: 'a-karo','j-pik') - only for moveType 'playCard'
 * */
class PlayerMove {
    constructor(roomId, userId, socketId, moveNum, moveType, trickNum, leadOrResponse, cardName) {
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