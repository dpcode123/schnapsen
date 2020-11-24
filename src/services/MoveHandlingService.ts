import { 
    otherPlayer,
    getPlayerIndexInRoomByUserId
} from '../utils/util.js';
import { getCardByName } from '../schnaps/cards.js';
import { 
    calculateTrickWinner,
    calculateTrickPoints,
    checkForMarriagesInHand,
    checkPlayedCardMarriagePoints,
    calculateValidRespondingCards
} from '../schnaps/schnaps.js';
import RoomStateDTO from '../dto/RoomStateDTO.js';
import BummerlStateDTO from '../dto/BummerlStateDTO.js';
import GameStateDTO from '../dto/GameStateDTO.js';
import MoveValidationService from './MoveValidationService.js';
import OpponentMoveDTO from '../dto/OpponentMoveDTO.js';
import Trick from '../model/Trick.js';
import Card from '../model/Card.js';
import { PlayerMove } from '../ts/types.js';
import PlayRoom from '../model/PlayRoom.js';


export default class MoveHandlingService {

    moveValidationService: MoveValidationService;
    io: any;
    
    constructor(io, socket) {
        this.moveValidationService = new MoveValidationService(io, socket);
        this.io = io;
    }

    // Handle move - exchange trump
    exchangeTrump = (move: PlayerMove, playerIndex: number, playRoom: PlayRoom): void => {
        try {
            const isMoveValid: boolean = this.moveValidationService.exchangeTrump(move, playRoom);

            if (isMoveValid) {
                // jack-trump card name
                const jackTrumpCardName: string = `j-${playRoom.game!.trumpSuit}`;

                // jack-trump card object
                const jackTrumpCard: Card = getCardByName(jackTrumpCardName)!;

                // remove jack in trump suit from player's hand
                playRoom.game!.removeCardFromHand(jackTrumpCardName, playerIndex);

                // push current trump card to player's hand
                playRoom.game!.cardsInHand[playerIndex].push(playRoom.game!.trumpCard!);

                // set jack as trump card
                playRoom.game!.trumpCard = jackTrumpCard;

                // sort cards in hands; check for marriages; update clients
                for (let i = 0; i < 2; i++) {
                    playRoom.game!.sortCardsByPointsAndSuit(playRoom.game!.cardsInHand[i]);
                    playRoom.game!.marriagesInHand[i] = checkForMarriagesInHand(playRoom.game!.cardsInHand[i], playRoom.game!.trumpSuit!);
                    this.io.to(playRoom.players[i]!.socketId).emit('gameStateUpdateAfterTrumpExchange', new GameStateDTO(playRoom.game, i).getDTO());
                }
            }
        } catch (error) {
            console.error(error);
        }

    };

    // Handle move - close deck
    closeDeck = (move: PlayerMove, playerIndex: number, playRoom: PlayRoom): void => {
        try {
            const isMoveValid: boolean = this.moveValidationService.closeDeck(move, playRoom);

            if (isMoveValid) {
                playRoom.game!.deckClosed = true;
                playRoom.game!.deckClosedByPlayer = playerIndex;
                playRoom.game!.nonCloserPoints = playRoom.game!.playerPoints[otherPlayer(playerIndex)];
    
                // update clients
                for (let i = 0; i < 2; i++) {
                    this.io.to(playRoom.players[i]!.socketId).emit('gameStateUpdateAfterClosingDeck', new GameStateDTO(playRoom.game, i).getDTO());
                }
            }
        } catch (error) {
            console.error(error);
        }

    };

    // Handle move - play card
    playCard = (move: PlayerMove, playerIndex: number, playRoom: PlayRoom): void => {
        try {
            const isMoveValid: boolean = this.moveValidationService.playCard(move, playRoom);

            if (isMoveValid) {
                // Send move validation/confirmation to player
                //io.to(playRoom.players[playerIndex].socketId).emit('moveValid', true);

                // set room buffer state to processing move
                playRoom.game!.moveBuffer.state = 'processingMove';

                // create card object from cardName
                const card: Card = getCardByName(move.cardName)!;

                // valid plays - all cards are valid for leading play
                let validRespondingCards: Card[] | string = 'all';

                //  called marriage points
                let marriagePoints: number = 0;

                // is game over or it continues
                let gameContinues: boolean = true;

                // game over object
                let gameOver: any;

                // Move leading or responding
                let isMoveLeading: boolean = false;

                // trick winner index
                let trickWinnerIndex: number;

                // Move is leading (if move is lead, and lead buffer is empty)
                // Move is responding (if move is response, and response buffer is empty)
                if (move.leadOrResponse && !playRoom.game!.moveBuffer.leadMove) {
                    isMoveLeading = true;
                } else if (!move.leadOrResponse && !playRoom.game!.moveBuffer.responseMove) {
                    isMoveLeading = false;
                }

                // LEADING PLAY
                if (isMoveLeading) {
                    // Add lead move to move buffer
                    playRoom.game!.moveBuffer.leadMove = move;

                    // check for valid cards for next play(response)
                    validRespondingCards = calculateValidRespondingCards(
                        card, playRoom.game!.cardsInHand[otherPlayer(playerIndex)],
                        playRoom.game!.trumpSuit!,
                        playRoom.game!.deckClosed, playRoom.game!.deck.length);

                    // check for marriage points
                    marriagePoints = checkPlayedCardMarriagePoints(card, playRoom.game!.marriagesInHand[playerIndex]);

                    if (marriagePoints > 0) {
                        // add points to player
                        playRoom.game!.addPointsToPlayer(playerIndex, marriagePoints);

                        // check if game is over
                        const gameOverAfterMarriages = playRoom.game!.gameOver(playerIndex);

                        if (gameOverAfterMarriages.isGameOver) {
                            // ===> END GAME
                            gameContinues = false;
                            gameOver = gameOverAfterMarriages;
                        } else {
                            // ===> GAME CONTINUES
                        }
                    } else {
                        // ===> GAME CONTINUES
                    }

                }

                // RESPONDING PLAY
                else if (!isMoveLeading) {
                    // add response move to move buffer
                    playRoom.game!.moveBuffer.responseMove = move;

                    // calculate trick winner
                    const trickWinnerId = calculateTrickWinner(playRoom.game!.trumpSuit!, playRoom.game!.moveBuffer.leadMove, playRoom.game!.moveBuffer.responseMove);

                    // calculate trick points
                    const trickPoints = calculateTrickPoints(playRoom.game!.moveBuffer.leadMove, playRoom.game!.moveBuffer.responseMove);

                    // get trick winner index in room (0 or 1)
                    trickWinnerIndex = getPlayerIndexInRoomByUserId(playRoom, trickWinnerId)!;

                    // create trick object
                    const trick: Trick = new Trick(
                        playRoom.game!.trickNum,
                        playRoom.game!.moveBuffer.leadMove.socketId, playRoom.game!.moveBuffer.responseMove.socketId,
                        playRoom.game!.moveBuffer.leadMove.cardName, playRoom.game!.moveBuffer.responseMove.cardName,
                        trickWinnerId, trickWinnerIndex, trickPoints
                    );

                    // save to last trick
                    playRoom.game!.lastTrick = trick;

                    // add cards to winning player's tricks
                    playRoom.game!.wonCards[trickWinnerIndex].push(playRoom.game!.moveBuffer.leadMove.cardName);
                    playRoom.game!.wonCards[trickWinnerIndex].push(playRoom.game!.moveBuffer.responseMove.cardName);

                    // remove played cards from hands
                    playRoom.game!.removeCardFromHand(
                        playRoom.game!.moveBuffer.leadMove.cardName, 
                        (getPlayerIndexInRoomByUserId(playRoom!, playRoom.game!.moveBuffer.leadMove.userId)) as number);

                    playRoom.game!.removeCardFromHand(
                        playRoom.game!.moveBuffer.responseMove.cardName, 
                        (getPlayerIndexInRoomByUserId(playRoom!, playRoom.game!.moveBuffer.responseMove.userId)) as number);

                    // add points to trick winner
                    playRoom.game!.addPointsToPlayer(trickWinnerIndex, trickPoints);

                    // check if game is over
                    const gameOverAfterTrick = playRoom.game!.gameOver(trickWinnerIndex);

                    if (gameOverAfterTrick.isGameOver) {
                        // ===> END GAME
                        gameContinues = false;
                        gameOver = gameOverAfterTrick;
                    } else {
                        // if this is last trick and no player is out yet
                        if (playRoom.game!.cardsInHand[0].length === 0 && playRoom.game!.cardsInHand[1].length === 0) {
                            // ===> END GAME
                            gameContinues = false;

                            // winner of last trick is winner of game
                            const gameOverAfterLastTrick = playRoom.game!.gameOverLastTrick(trickWinnerIndex);
                            gameOver = gameOverAfterLastTrick;
                        } else {
                            // ===> GAME CONTINUES
                        }
                    }
                }

                // create opponent's move DTO
                const opponentMoveDTO = new OpponentMoveDTO(
                    move.moveType, move.trickNum, move.moveNum,
                    move.cardName, marriagePoints, validRespondingCards);

                // send opponent's move to other player
                this.io.to(playRoom.players[otherPlayer(playerIndex)]!.socketId).emit('opponentMove', opponentMoveDTO.getDTO());

                
                if (gameContinues) {
                    // GAME CONTINUES...

                    // Increase move number
                    playRoom.game!.increaseMoveNumber();

                    // change player on turn
                    playRoom.game!.changePlayerOnTurn();

                    // change lead/response
                    playRoom.game!.leadOrResponse = !playRoom.game!.leadOrResponse;

                    // update clients
                    for (let i = 0; i < 2; i++) {
                        this.io.to(playRoom.players[i]!.socketId).emit('gameStateUpdate', new GameStateDTO(playRoom.game, i).getDTO());
                    }

                    // if both players played card this turn
                    if (!isMoveLeading) {
                        // start new trick
                        playRoom.game!.startNextTrick(trickWinnerIndex!);

                        // deal 1 card to each player
                        playRoom.game!.dealCardsToPlayers(trickWinnerIndex!, 1);

                        console.log(playRoom.game!.cardsInHand);
                        console.log(trickWinnerIndex!);
                        

                        // sort cards in hands; check for marriages; update clients
                        for (let i = 0; i < 2; i++) {
                            playRoom.game!.sortCardsByPointsAndSuit(playRoom.game!.cardsInHand[i]);
                            playRoom.game!.marriagesInHand[i] = checkForMarriagesInHand(playRoom.game!.cardsInHand[i], playRoom.game!.trumpSuit!);
                            this.io.to(playRoom.players[i]!.socketId).emit('gameStateUpdateAfterTrick', new GameStateDTO(playRoom.game, i).getDTO());
                        }
                    }
                } else {
                    // GAME IS OVER!

                    // end game
                    playRoom.endGame(gameOver, this.io);
                    // start new game
                    playRoom.startGame();

                    // update clients
                    for (let i = 0; i < 2; i++) {
                        this.io.to(playRoom.players[i]!.socketId).emit('sessionStateUpdate', new RoomStateDTO(playRoom, i).getDTO());
                        this.io.to(playRoom.players[i]!.socketId).emit('bummerlStateUpdate', new BummerlStateDTO(playRoom.bummerl, i).getDTO());
                        this.io.to(playRoom.players[i]!.socketId).emit('gameStart', new GameStateDTO(playRoom.game, i).getDTO());
                    }
                }
                playRoom.game!.moveBuffer.state = 'waitingForMove';
            } else {
                const errorMsg = 'Move not valid!';
                console.log(errorMsg);
                this.io.to(playRoom.players[playerIndex]!.socketId).emit('moveInvalidError', errorMsg);
            }
        } catch (error) {
            console.error(error);
        }

    };

    
}
