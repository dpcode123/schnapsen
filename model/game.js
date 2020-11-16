import {
    getAllCards,
    randomCard,
    removeCardFromDeck
} from '../schnaps/cards.js';

import { otherPlayer } from '../utils/util.js';
import { shuffle } from '../schnaps/shuffle.js';

const ALL_CARDS = getAllCards();

export default class Game {
    constructor(num, openingPlayer) {
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

        // deck is closed by player(0 or 1) or not(null)
        this.deckClosedByPlayer = null;

        // points that non-closer had at the moment of closing
        this.nonCloserPoints = 0;

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
        this.setTrumpCardAndSuit = function () {

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


        // Deals n cards to both players if deck is not closed and there are card(s) in it
        this.dealCardsToPlayers = function (firstPlayer, numberOfCards){

            if(!this.deckClosed){
                console.log('dijelimo kartu');
                // >1 cards in deck - deal card(s) to first player, then other player
                if(this.deck.length > 1){
                    for(let i = 0; i < numberOfCards; i++){
                        this.dealRandomCardToPlayer(firstPlayer);
                    }
                    for(let i = 0; i < numberOfCards; i++){
                        this.dealRandomCardToPlayer(otherPlayer(firstPlayer));
                    }
                }
                // 1 card - deal that card to first player and trump card to other; remove trump card
                else if(this.deck.length === 1){
                    this.dealRandomCardToPlayer(firstPlayer);
                    this.cardsInHand[otherPlayer(firstPlayer)].push(this.trumpCard);
                    this.trumpCard = 'none';
                }
            }
            
        }
        
        // Adds points to player
        this.addPointsToPlayer = function (pIndex, points){
            this.playerPoints[pIndex] = this.playerPoints[pIndex] + points;
        }

        // Checks if player is out (66+ points)
        this.gameOver = function(pIndex){

            let winnerIndex = pIndex;
            let isGameOver = this.playerPoints[pIndex] >= 66;
            let gamePoints = 0;
            
            // Game is over
            if(isGameOver){

                // deck is closed
                if(this.deckClosed && this.deckClosedByPlayer !== null){

                    // THIS player closed the deck
                    if(this.deckClosedByPlayer === pIndex){

                        // opponent(non closer) had 0 points at the moment of closing
                        if(this.nonCloserPoints === 0) { gamePoints = 3; }

                        // opponent(non closer) had 1-32 points at the moment of closing
                        else if(this.nonCloserPoints > 0 && this.nonCloserPoints < 33) { gamePoints = 2; }

                        // opponent(non closer) had 33+ points at the moment of closing
                        else if(this.nonCloserPoints > 32 && this.nonCloserPoints < 66) { gamePoints = 1; }      
                    }
                    // OTHER player closed the deck
                    else if(this.deckClosedByPlayer === otherPlayer(pIndex)){

                        // this player(non closer) had some points at the moment of closing
                        if(this.nonCloserPoints > 0){ gamePoints = 2; }

                        // this player(non closer) had 0 points at the moment of closing
                        else{ gamePoints = 3; }
                    }
                }
                // deck is NOT closed
                else{
                    // opponent has 0 points
                    if(this.playerPoints[otherPlayer(pIndex)] === 0) { gamePoints = 3; }

                    // opponent has 1-32 points
                    else if(this.playerPoints[otherPlayer(pIndex)] > 0 && this.playerPoints[otherPlayer(pIndex)] < 33) { gamePoints = 2; }

                    // opponent has 33+ points
                    else if(this.playerPoints[otherPlayer(pIndex)] > 32 && this.playerPoints[otherPlayer(pIndex)] < 66) { gamePoints = 1; }
                }

            }

            return {
                winnerIndex: winnerIndex,
                isGameOver: isGameOver,
                gamePoints: gamePoints,
                playerPointsAtEndOfGame: this.playerPoints[pIndex],
            };
        }

        // after last trick
        this.gameOverLastTrick = function(pIndex){

            const isGameOver = true;
            let gamePoints = 0;
            let winnerIndex;

            // deck is closed
            if(this.deckClosed && this.deckClosedByPlayer !== null){

                // THIS player closed the deck
                if(this.deckClosedByPlayer === pIndex){

                    // other player is winner because deck is closed and this player isn't out yet
                    winnerIndex = otherPlayer(pIndex);

                    // opponent(non closer) had 0 points at the moment of closing
                    if(this.nonCloserPoints === 0) { gamePoints = 3; }

                    // opponent(non closer) had 1-32 points at the moment of closing
                    else if(this.nonCloserPoints > 0 && this.nonCloserPoints < 33) { gamePoints = 2; 
                    }
                    // opponent(non closer) had 33+ points at the moment of closing
                    else if(this.nonCloserPoints > 32 && this.nonCloserPoints < 66) { gamePoints = 1; }
                    
                }
                // OTHER player closed the deck
                else if(this.deckClosedByPlayer === otherPlayer(pIndex)){

                    // this player is winner because other player closed the deck and isn't out yet 
                    winnerIndex = pIndex;

                    // this player(non closer) had some points at the moment of closing
                    if(this.nonCloserPoints > 0){ gamePoints = 2; }

                    // this player(non closer) had 0 points at the moment of closing
                    else{ gamePoints = 3; }
                }
            }
            // deck is NOT closed
            else{
                // player gets 1 game point
                gamePoints = 1;
                winnerIndex = pIndex;
            }

            return {
                winnerIndex: winnerIndex,
                isGameOver: isGameOver,
                gamePoints: gamePoints,
                playerPointsAtEndOfGame: this.playerPoints[pIndex],
            };
        }


        // Changes player on turn, 0 <-> 1
        this.changePlayerOnTurn = function () {
            this.playerOnTurn = otherPlayer(this.playerOnTurn);
        }

        // Increases move number
        this.increaseMoveNumber = function () {
            this.moveNum = this.moveNum + 1;
        }

        // Starts next trick
        this.startNextTrick = function (lastTricksWinner){

            // clear card buffer
            this.moveBuffer = {lead: null, response: null};

            // increase trick num
            this.trickNum+=1;

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
        
        // Sorts cards in hand by points, suit
        this.sortCardsByPointsAndSuit = function (cardsArray){
            cardsArray.sort((a,b) => a.points-b.points);
            cardsArray.sort((a,b) => a.suit.localeCompare(b.suit));
        }
    }
}
