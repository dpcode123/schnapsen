import { v4 as uuidv4 } from 'uuid';
import Bummerl from './Bummerl.js';
import Game from './Game.js';
import { checkForMarriagesInHand } from '../schnaps/schnaps.js';
import GameOverDTO from '../dto/GameOverDTO.js';
import { otherPlayer } from '../utils/util.js';
export default class PlayRoom {
    constructor(room, player1) {
        this.bummerl = undefined;
        this.game = undefined;
        this.bummerlsWon = [0, 0];
        // unique room uuid
        this.uuid = uuidv4();
        // socket.io room id
        this.room = room;
        // status (starting, started, finished)
        this.status = 'starting';
        // players
        this.players = [];
        this.players[0] = player1;
        this.players[1] = undefined;
    }
    // Starts new bummerl (and new game)
    startBummerl() {
        // new bummerl number
        // if current bummerl doesnt exist, next bummerl is no.1
        let nextBummerlNumber = 0;
        if (this.bummerl) {
            nextBummerlNumber = ++this.bummerl.num;
        }
        else {
            nextBummerlNumber = 1;
        }
        // creates new bummerl
        this.bummerl = new Bummerl(nextBummerlNumber);
    }
    // Starts new game
    startGame() {
        let nextGameNumber = 0;
        let nextGameOpeningPlayer;
        // (current game exist): increment game number by 1; invert opening player 0<->1
        // (current game doesnt exist): next game is no.1; opening player is random 0 or 1
        if (this.game) {
            nextGameNumber = ++this.game.num;
            nextGameOpeningPlayer = 1 - this.game.openingPlayer;
        }
        else {
            nextGameNumber = 1;
            nextGameOpeningPlayer = Math.round(Math.random());
        }
        // Create new game
        this.game = new Game(nextGameNumber, nextGameOpeningPlayer);
        // Deal 3 cards, deal trump, deal 2 cards
        this.game.dealCardsToPlayers(nextGameOpeningPlayer, 3);
        this.game.setTrumpCardAndSuit();
        this.game.dealCardsToPlayers(nextGameOpeningPlayer, 2);
        // Sort cards in hands; Check for marriages in hands
        for (let i = 0; i < 2; i++) {
            this.game.sortCardsByPointsAndSuit(this.game.cardsInHand[i]);
            this.game.marriagesInHand[i] = checkForMarriagesInHand(this.game.cardsInHand[i], this.game.trumpSuit);
        }
    }
    // Ends current game
    endGame(gameOver, io) {
        // add game points (1, 2 or 3) to winner
        this.bummerl.gamePoints[gameOver.winnerIndex] += gameOver.gamePoints;
        // change game status
        this.game.status = 'finished';
        // update game winner
        io.to(this.players[gameOver.winnerIndex].socketId).emit('gameOverDTO', new GameOverDTO(gameOver, true).getDTO());
        // update game loser
        io.to(this.players[otherPlayer(gameOver.winnerIndex)].socketId).emit('gameOverDTO', new GameOverDTO(gameOver, false).getDTO());
        // check if bummerl is over(player has 7+ game points)
        let bummerlOver = this.bummerl.bummerlOver(gameOver.winnerIndex);
        // start new bummerl, increase bummerlsWon points for winning player
        if (bummerlOver) {
            this.startBummerl();
            this.bummerlsWon[gameOver.winnerIndex] = this.bummerlsWon[gameOver.winnerIndex] + 1;
        }
    }
}
