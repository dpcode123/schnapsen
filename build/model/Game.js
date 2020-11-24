import { getAllCards, getRandomCardFromDeck, removeCardFromDeck } from '../schnaps/cards.js';
import { otherPlayer } from '../utils/util.js';
import { shuffle } from '../schnaps/shuffle.js';
const ALL_CARDS = getAllCards();
export default class Game {
    constructor(num, openingPlayer) {
        // Sorts cards in hand by points, suit
        this.sortCardsByPointsAndSuit = function (cardsArray) {
            cardsArray.sort((a, b) => a.points - b.points);
            cardsArray.sort((a, b) => a.suit.localeCompare(b.suit));
        };
        // game number: (1...13)
        // 13 is max number of games played in bummerl,
        // if final score is 7:6 or 6:7 and every win was for only 1 point
        this.num = num;
        // move buffer
        // state: waitingForMove, processingMove
        this.moveBuffer = { lead: undefined, response: undefined, state: 'waitingForMove' };
        // cards deck
        this.deck = shuffle([...ALL_CARDS]);
        // game state (started, finished)
        this.status = 'started';
        // opening player(first player) 0 or 1
        this.openingPlayer = openingPlayer;
        // player on turn: 0 or 1
        this.playerOnTurn = openingPlayer;
        // trump card; trump suit
        this.trumpCard = undefined;
        this.trumpSuit = undefined;
        // trick number: 1-10
        this.trickNum = 1;
        // move number
        this.moveNum = 1;
        // next expected play: Lead(true) or Response(false)
        this.leadOrResponse = true;
        // deck closed or out of cards
        this.deckClosed = false;
        // deck is closed by player(0 or 1) or not(undefined)
        this.deckClosedByPlayer = undefined;
        // points that non-closer had at the moment of closing
        this.nonCloserPoints = 0;
        // last trick
        this.lastTrick = undefined;
        /**
         ****************************************************** CLIENT SPECIFIC
        */
        // points for each player: 1-66
        this.playerPoints = [];
        this.playerPoints[0] = 0;
        this.playerPoints[1] = 0;
        // cards in player's hands
        this.cardsInHand = [];
        this.cardsInHand[0] = [];
        this.cardsInHand[1] = [];
        // marriages
        this.marriagesInHand = [];
        this.marriagesInHand[0] = [];
        this.marriagesInHand[1] = [];
        // cards(tricks) won by players
        this.wonCards = [];
        this.wonCards[0] = [];
        this.wonCards[1] = [];
    }
    // Sets trump(adut) card and suit
    // get random card from deck; set trump card and suit; remove it from deck
    setTrumpCardAndSuit() {
        const randomCard = getRandomCardFromDeck(this.deck);
        this.trumpCard = randomCard;
        this.trumpSuit = randomCard.suit;
        removeCardFromDeck(randomCard, this.deck);
    }
    // Deals random card to player [0] or [1]
    // get random card from deck; push it to players hand; remove it from deck
    dealRandomCardToPlayer(playerIndex) {
        const randomCard = getRandomCardFromDeck(this.deck);
        this.cardsInHand[playerIndex].push(randomCard);
        removeCardFromDeck(randomCard, this.deck);
    }
    // Deals n cards to both players
    // # (deck is not closed)
    // ## (>1 cards in deck): deal card(s) to first player, then other player
    // ## (1 card  in deck): deal card to first player; trump card to other; remove trump card
    dealCardsToPlayers(firstPlayer, numberOfCards) {
        if (!this.deckClosed) {
            if (this.deck.length > 1) {
                for (let i = 0; i < numberOfCards; i++) {
                    this.dealRandomCardToPlayer(firstPlayer);
                }
                for (let i = 0; i < numberOfCards; i++) {
                    this.dealRandomCardToPlayer(otherPlayer(firstPlayer));
                }
            }
            else if (this.deck.length === 1) {
                this.dealRandomCardToPlayer(firstPlayer);
                this.cardsInHand[otherPlayer(firstPlayer)].push(this.trumpCard);
                this.trumpCard = undefined;
            }
        }
    }
    // Adds points to player
    addPointsToPlayer(playerIndex, points) {
        this.playerPoints[playerIndex] = this.playerPoints[playerIndex] + points;
    }
    // Checks if player is out (66+ points)
    gameOver(playerIndex) {
        const winnerIndex = playerIndex;
        const isGameOver = this.playerPoints[playerIndex] >= 66;
        let gamePoints = 0;
        // Game is over
        if (isGameOver) {
            // deck is closed
            if (this.deckClosed && this.deckClosedByPlayer !== undefined) {
                // THIS player closed the deck
                if (this.deckClosedByPlayer === playerIndex) {
                    // opponent(non closer) had 0 points at the moment of closing
                    if (this.nonCloserPoints === 0) {
                        gamePoints = 3;
                    }
                    // opponent(non closer) had 1-32 points at the moment of closing
                    else if (this.nonCloserPoints > 0 && this.nonCloserPoints < 33) {
                        gamePoints = 2;
                    }
                    // opponent(non closer) had 33+ points at the moment of closing
                    else if (this.nonCloserPoints > 32 && this.nonCloserPoints < 66) {
                        gamePoints = 1;
                    }
                }
                // OTHER player closed the deck
                else if (this.deckClosedByPlayer === otherPlayer(playerIndex)) {
                    // this player(non closer) had some points at the moment of closing
                    if (this.nonCloserPoints > 0) {
                        gamePoints = 2;
                    }
                    // this player(non closer) had 0 points at the moment of closing
                    else {
                        gamePoints = 3;
                    }
                }
            }
            // deck is NOT closed
            else {
                // opponent has 0 points
                if (this.playerPoints[otherPlayer(playerIndex)] === 0) {
                    gamePoints = 3;
                }
                // opponent has 1-32 points
                else if (this.playerPoints[otherPlayer(playerIndex)] > 0 && this.playerPoints[otherPlayer(playerIndex)] < 33) {
                    gamePoints = 2;
                }
                // opponent has 33+ points
                else if (this.playerPoints[otherPlayer(playerIndex)] > 32 && this.playerPoints[otherPlayer(playerIndex)] < 66) {
                    gamePoints = 1;
                }
            }
        }
        return {
            winnerIndex: winnerIndex,
            isGameOver: isGameOver,
            gamePoints: gamePoints,
            playerPointsAtEndOfGame: this.playerPoints[playerIndex],
        };
    }
    // after last trick
    gameOverLastTrick(playerIndex) {
        const isGameOver = true;
        let gamePoints = 0;
        let winnerIndex;
        // deck is closed
        if (this.deckClosed && this.deckClosedByPlayer !== undefined) {
            // THIS player closed the deck
            if (this.deckClosedByPlayer === playerIndex) {
                // other player is winner because deck is closed and this player isn't out yet
                winnerIndex = otherPlayer(playerIndex);
                // opponent(non closer) had 0 points at the moment of closing
                if (this.nonCloserPoints === 0) {
                    gamePoints = 3;
                }
                // opponent(non closer) had 1-32 points at the moment of closing
                else if (this.nonCloserPoints > 0 && this.nonCloserPoints < 33) {
                    gamePoints = 2;
                }
                // opponent(non closer) had 33+ points at the moment of closing
                else if (this.nonCloserPoints > 32 && this.nonCloserPoints < 66) {
                    gamePoints = 1;
                }
            }
            // OTHER player closed the deck
            else if (this.deckClosedByPlayer === otherPlayer(playerIndex)) {
                // this player is winner because other player closed the deck and isn't out yet 
                winnerIndex = playerIndex;
                // this player(non closer) had some points at the moment of closing
                if (this.nonCloserPoints > 0) {
                    gamePoints = 2;
                }
                // this player(non closer) had 0 points at the moment of closing
                else {
                    gamePoints = 3;
                }
            }
        }
        // deck is NOT closed
        else {
            // player gets 1 game point
            gamePoints = 1;
            winnerIndex = playerIndex;
        }
        return {
            winnerIndex: winnerIndex,
            isGameOver: isGameOver,
            gamePoints: gamePoints,
            playerPointsAtEndOfGame: this.playerPoints[playerIndex],
        };
    }
    // Changes player on turn, 0 <-> 1
    changePlayerOnTurn() {
        this.playerOnTurn = otherPlayer(this.playerOnTurn);
    }
    // Increases move number
    increaseMoveNumber() {
        this.moveNum = this.moveNum + 1;
    }
    // Starts next trick
    startNextTrick(lastTricksWinner) {
        // clear card buffer
        this.moveBuffer = { lead: undefined, response: undefined };
        // increase trick num
        this.trickNum += 1;
        // player on turn = last tricks winner
        this.playerOnTurn = lastTricksWinner;
        // next play is lead
        this.leadOrResponse = true;
    }
    // Removes card from players hand
    removeCardFromHand(cardName, playerIndex) {
        const cardIndex = this.cardsInHand[playerIndex].findIndex(object => object.name === cardName);
        this.cardsInHand[playerIndex].splice(cardIndex, 1);
    }
}
