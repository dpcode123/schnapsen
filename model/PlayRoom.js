const {v4 : uuidv4} = require('uuid');
const Bummerl = require('./Bummerl');
const Game = require('./Game');
const { checkForMarriagesInHand } = require('../schnaps/schnaps');
const GameOverDTO = require('../dto/GameOverDTO');
const { otherPlayer, getPlayerIndexInRoomBySocketId } = require("../utils/util");

module.exports = function (room, player1) {

    // unique room uuid
    this.uuid = uuidv4();

    // socket.io room
    this.room = room;

    // status (starting, started, finished)
    this.status = 'starting';

    // players
    this.players = [];
    this.players[0] = player1;
    this.players[1] = null;

    // bummerl
    this.bummerl = null;

    // game
    this.game = null;

    // Bummerl points - total bummerls won by each player (1...n)
    this.bummerlsWon = [];
    this.bummerlsWon[0] = 0;
    this.bummerlsWon[1] = 0;


    // Starts new bummerl (and new game)
    this.startBummerl = function (){

        // new bummerl number
        // if current bummerl doesnt exist, next bummerl is no.1
        let nextBummerlNumber = 0;
        
        if(this.bummerl){
            nextBummerlNumber = ++this.bummerl.num;
        }
        else{
            nextBummerlNumber = 1;
        }      

        // creates new bummerl
        this.bummerl = new Bummerl(nextBummerlNumber);
        
    }


    // starts new game
    this.startGame = function () {

        // new game number and opening player(0 or 1)
        // if current game doesnt exist, next game is no.1 and opening player is random
        let nextGameNumber = 0;
        let nextGameOpeningPlayer = null;

        if(this.game){
            // increment game number by 1
            nextGameNumber = ++this.game.num;

            // invert opening player <0...1> for the next game
            nextGameOpeningPlayer = 1 - this.game.openingPlayer
        }
        else{
            nextGameNumber = 1;
            nextGameOpeningPlayer = Math.round(Math.random());
        }
        
        // create new game
        this.game = new Game(nextGameNumber, nextGameOpeningPlayer);

        // deal 3 cards, deal trump, deal 2 cards
        this.game.dealCardsToPlayers(nextGameOpeningPlayer, 3);
        this.game.setTrumpCardAndSuit();
        this.game.dealCardsToPlayers(nextGameOpeningPlayer, 2);

        // sort cards in hands; check for marriages
        for(let i=0; i<2; i++){
            this.game.sortCardsByPointsAndSuit(this.game.cardsInHand[i]);
            this.game.marriagesInHand[i] = checkForMarriagesInHand(this.game.cardsInHand[i], this.game.trumpSuit);
        }
    }

    // ends current game
    this.endGame = function (gameOver, io) {
        // add game points (1, 2 or 3) to winner
        this.bummerl.gamePoints[gameOver.winnerIndex] += gameOver.gamePoints;

        // change game status
        this.game.status = 'finished';

        // update game winner
        io.to(this.players[gameOver.winnerIndex].socketId).emit('gameOverDTO', new GameOverDTO(gameOver, true));

        // update game loser
        io.to(this.players[otherPlayer(gameOver.winnerIndex)].socketId).emit('gameOverDTO', new GameOverDTO(gameOver, false));
        
        // check if bummerl is over(player has 7+ game points)
        let bummerlOver  = this.bummerl.bummerlOver(gameOver.winnerIndex);

        if(bummerlOver){
            // start new bummerl
            this.startBummerl();
            // increase bummerlsWon points for winning player
            this.bummerlsWon[gameOver.winnerIndex] = this.bummerlsWon[gameOver.winnerIndex] + 1;
        }
    }

}
