const Bummerl = require('./Bummerl');
const Game = require('./Game');
const {
    getAllCards,
    randomCard,
    getCardByName,
    removeCardFromDeck,
    getCardPositionInHandByName
} = require('../schnaps/cards');
const { 
    calculateTrickWinner, 
    calculateTrickPoints,
    checkForMarriagesInHand,
} = require('../schnaps/schnaps');

module.exports = function (room, player1, player2) {

    // play session id (socket.io room)
    this.room = room;

    // status (starting, started, finished)
    this.status = 'starting';

    // players
    this.players = [];
    this.players[0] = player1;
    this.players[1] = player2;

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
    this.startGame = function (){

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

}
