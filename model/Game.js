const {
    getAllCards,
    randomCard,
    getCardByName,
    removeCardFromDeck,
    getCardPositionInHandByName
} = require('../schnaps/cards');

const { otherPlayer } = require('../utils/util');
const { shuffle } = require('../schnaps/shuffle');
const ALL_CARDS = getAllCards();

module.exports = function (num, openingPlayer) {

    // game number: (1...13)
    // 13 is max number of games played in bummerl,
    // if final score is 7:6 or 6:7 and every win was for only 1 point
    this.num = num;

    // move buffer
    this.moveBuffer = {lead: null, response: null};

    // cards deck
    this.deck = shuffle([...ALL_CARDS]);

    // game state (started, finished)
    this.status = 'started';

    // opening player(first player) 0 or 1
    this.openingPlayer = openingPlayer;

    // player on turn: 0 or 1
    this.playerOnTurn = openingPlayer;

    // trump card; trump suit
    this.trumpCard = null;
    this.trumpSuit = null;

    // trick number: 1-10
    this.trickNum = 1;

    // move number
    this.moveNum = 1;

    // next expected play: Lead(true) or Response(false)
    this.leadOrResponse = true;

    // deck closed or out of cards
    this.deckClosed = false;

    // last trick
    this.lastTrick = null;

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

    /**
     ****************************************************** METHODS
     */

    // Sets trump(adut) card and suit
    this.setTrumpCardAndSuit = function (){

        // get random card from deck
        let randcard = randomCard(this.deck);

        // set trump card
        this.trumpCard = randcard;

        // set trump suit
        this.trumpSuit = randcard.suit;

        // remove that card from deck
        removeCardFromDeck(randcard, this.deck);
    }


    // Deals random card to player [0] or [1]
    this.dealRandomCardToPlayer = function (player){

        // get random card from deck
        let randcard = randomCard(this.deck);

        // push that card to players hand
        this.cardsInHand[player].push(randcard);

        // remove that card from deck
        removeCardFromDeck(randcard, this.deck);
    }


    // Deals n cards to both players
    this.dealCardsToPlayers = function (firstPlayer, numberOfCards){

        // more than 1 card in deck
        // - deal card(s) to first player, then other player
        if(this.deck.length > 1){
            for(let i = 0; i < numberOfCards; i++){
                this.dealRandomCardToPlayer(firstPlayer);
            }
            for(let i = 0; i < numberOfCards; i++){
                this.dealRandomCardToPlayer(otherPlayer(firstPlayer));
            }
        }
        // only 1 card in deck 
        // - deal that card to first player and trump card to other; remove trump card
        else if(this.deck.length === 1){
            this.dealRandomCardToPlayer(firstPlayer);
            this.cardsInHand[otherPlayer(firstPlayer)].push(this.trumpCard);
            this.trumpCard = 'none';
        }
    }
    

    // Adds points to player
    this.addPointsToPlayer = function (pIndex, points){
        this.playerPoints[pIndex] = this.playerPoints[pIndex] + points;
    }

    // check if player is out (66+ points)
    this.gameOver = function(pIndex){

        // player get 1,2 or 3 game points
        let gamePoints = 0;

        let playerOut = this.playerPoints[pIndex] >= 66;

        if(playerOut){
            // opponent has 0 points
            if(this.playerPoints[otherPlayer(pIndex)] === 0) {
                gamePoints = 3;
            }
            // opponent has 1-32 points
            else if(this.playerPoints[otherPlayer(pIndex)] > 0 && this.playerPoints[otherPlayer(pIndex)] < 33) {
                gamePoints = 2;
            }
            // opponent has 33+ points
            else if(this.playerPoints[otherPlayer(pIndex)] > 32 && this.playerPoints[otherPlayer(pIndex)] < 66) {
                gamePoints = 1;
            }
        }
        return {
            playerOut: playerOut,
            gamePoints: gamePoints,
            playerPointsAtEndOfGame: this.playerPoints[pIndex],
        };
    }


    // Changes player on turn, 0 <-> 1
    this.changePlayerOnTurn = function (){
        this.playerOnTurn = otherPlayer(this.playerOnTurn);
    }

    // Increases move number
    this.increaseMoveNumber = function (){
        this.moveNum = this.moveNum + 1;
    }

    // Starts next trick
    this.startNextTrick = function (lastTricksWinner){

        // clear card buffer
        this.moveBuffer = {lead: null, response: null};

        // increase trick num
        this.trickNum+=1;

        // close game if deck is empty
        if(this.trickNum > 5){
            this.deckClosed = true;
        }

        // player on turn = last tricks winner
        this.playerOnTurn = lastTricksWinner;

        // next play is lead
        this.leadOrResponse = true;
        
    }

    // Removes card from players hand
    this.removeCardFromHand = function (cardName, player){
        let cardIndex = this.cardsInHand[player].findIndex(object => object.name === cardName);
        this.cardsInHand[player].splice(cardIndex, 1);
    }
    
    // sort cards in hand by points, suit
    this.sortCardsByPointsAndSuit = function (cardsArray){
        cardsArray.sort((a,b) => a.points-b.points);
        cardsArray.sort((a,b) => a.suit.localeCompare(b.suit));
        //return cardsArray;
    }
    
}
