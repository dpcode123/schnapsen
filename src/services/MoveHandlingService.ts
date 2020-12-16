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
import GameStateDTO from '../dto/DealStateDTO.js';
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
                const jackTrumpCardName: string = `j-${playRoom.deal?.trumpSuit}`;

                // jack-trump card object
                const jackTrumpCard: Card = getCardByName(jackTrumpCardName)!;

                // remove jack in trump suit from player's hand
                playRoom.deal?.removeCardFromHand(jackTrumpCardName, playerIndex);

                // push current trump card to player's hand
                playRoom.deal?.cardsInHand[playerIndex].push(playRoom.deal?.trumpCard!);

                // set jack as trump card
                playRoom.deal!.trumpCard = jackTrumpCard;

                // sort cards in hands; check for marriages; update clients
                for (let i = 0; i < 2; i++) {
                    playRoom.deal!.sortCardsByPointsAndSuit(playRoom.deal!.cardsInHand[i]);
                    playRoom.deal!.marriagesInHand[i] = checkForMarriagesInHand(playRoom.deal!.cardsInHand[i], playRoom.deal!.trumpSuit!);
                    this.io.to(playRoom.players[i]!.socketId).emit('dealStateUpdateAfterTrumpExchange', new GameStateDTO(playRoom.deal, i).getDTO());
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
                playRoom.deal!.deckClosed = true;
                playRoom.deal!.deckClosedByPlayer = playerIndex;
                playRoom.deal!.nonCloserPoints = playRoom.deal!.playerPoints[otherPlayer(playerIndex)];
    
                // update clients
                for (let i = 0; i < 2; i++) {
                    this.io.to(playRoom.players[i]!.socketId).emit('dealStateUpdateAfterClosingDeck', new GameStateDTO(playRoom.deal, i).getDTO());
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
                playRoom.deal!.moveBuffer.state = 'processingMove';

                // create card object from cardName
                const card: Card | undefined = getCardByName(move.cardName);

                // valid plays - all cards are valid for leading play
                let validRespondingCards: Card[] | string = 'all';

                //  called marriage points
                let marriagePoints: number = 0;

                // is deal over or it continues
                let gameContinues: boolean = true;

                // deal over object
                let dealOver: any;

                // Move leading or responding
                let isMoveLeading: boolean = false;

                // trick winner index
                let trickWinnerIndex: number;

                // Move is leading (if move is lead, and lead buffer is empty)
                // Move is responding (if move is response, and response buffer is empty)
                if (move.leadOrResponse && !playRoom.deal!.moveBuffer.leadMove) {
                    isMoveLeading = true;
                } else if (!move.leadOrResponse && !playRoom.deal!.moveBuffer.responseMove) {
                    isMoveLeading = false;
                }

                // LEADING PLAY
                if (isMoveLeading) {
                    // Add lead move to move buffer
                    playRoom.deal!.moveBuffer.leadMove = move;

                    // check for valid cards for next play(response)
                    validRespondingCards = calculateValidRespondingCards(
                        card, playRoom.deal!.cardsInHand[otherPlayer(playerIndex)],
                        playRoom.deal!.trumpSuit!,
                        playRoom.deal!.deckClosed, playRoom.deal!.deck.length);

                    // check for marriage points
                    marriagePoints = checkPlayedCardMarriagePoints(card, playRoom.deal!.marriagesInHand[playerIndex]);

                    if (marriagePoints > 0) {
                        // add points to player
                        playRoom.deal!.addPointsToPlayer(playerIndex, marriagePoints);

                        // check if deal is over
                        const dealOverAfterMarriages = playRoom.deal!.dealOver(playerIndex);

                        if (dealOverAfterMarriages.isDealOver) {
                            // ===> END GAME
                            gameContinues = false;
                            dealOver = dealOverAfterMarriages;
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
                    playRoom.deal!.moveBuffer.responseMove = move;

                    // calculate trick winner
                    const trickWinnerId = calculateTrickWinner(playRoom.deal!.trumpSuit!, playRoom.deal!.moveBuffer.leadMove, playRoom.deal!.moveBuffer.responseMove);

                    // calculate trick points
                    const trickPoints = calculateTrickPoints(playRoom.deal!.moveBuffer.leadMove, playRoom.deal!.moveBuffer.responseMove);

                    // get trick winner index in room (0 or 1)
                    trickWinnerIndex = getPlayerIndexInRoomByUserId(playRoom, trickWinnerId)!;

                    // create trick object
                    const trick: Trick = new Trick(
                        playRoom.deal!.trickNum,
                        playRoom.deal!.moveBuffer.leadMove.socketId, playRoom.deal!.moveBuffer.responseMove.socketId,
                        playRoom.deal!.moveBuffer.leadMove.cardName, playRoom.deal!.moveBuffer.responseMove.cardName,
                        trickWinnerId, trickWinnerIndex, trickPoints
                    );

                    // save to last trick
                    playRoom.deal!.lastTrick = trick;

                    // add cards to winning player's tricks
                    playRoom.deal!.wonCards[trickWinnerIndex].push(playRoom.deal!.moveBuffer.leadMove.cardName);
                    playRoom.deal!.wonCards[trickWinnerIndex].push(playRoom.deal!.moveBuffer.responseMove.cardName);

                    // remove played cards from hands
                    playRoom.deal!.removeCardFromHand(
                        playRoom.deal!.moveBuffer.leadMove.cardName, 
                        (getPlayerIndexInRoomByUserId(playRoom!, playRoom.deal!.moveBuffer.leadMove.userId)) as number);

                    playRoom.deal!.removeCardFromHand(
                        playRoom.deal!.moveBuffer.responseMove.cardName, 
                        (getPlayerIndexInRoomByUserId(playRoom!, playRoom.deal!.moveBuffer.responseMove.userId)) as number);

                    // add points to trick winner
                    playRoom.deal!.addPointsToPlayer(trickWinnerIndex, trickPoints);

                    // check if deal is over
                    const dealOverAfterTrick = playRoom.deal!.dealOver(trickWinnerIndex);

                    if (dealOverAfterTrick.isDealOver) {
                        // ===> END GAME
                        gameContinues = false;
                        dealOver = dealOverAfterTrick;
                    } else {
                        // if this is last trick and no player is out yet
                        if (playRoom.deal!.cardsInHand[0].length === 0 && playRoom.deal!.cardsInHand[1].length === 0) {
                            // ===> END GAME
                            gameContinues = false;

                            // winner of last trick is winner of deal
                            const dealOverAfterLastTrick = playRoom.deal!.dealOverLastTrick(trickWinnerIndex);
                            dealOver = dealOverAfterLastTrick;
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
                    playRoom.deal!.increaseMoveNumber();

                    // change player on turn
                    playRoom.deal!.changePlayerOnTurn();

                    // change lead <-> response
                    playRoom.deal!.leadOrResponse = !playRoom.deal!.leadOrResponse;

                    // update clients
                    for (let i = 0; i < 2; i++) {
                        this.io.to(playRoom.players[i]!.socketId).emit('dealStateUpdate', new GameStateDTO(playRoom.deal, i).getDTO());
                    }

                    // if both players played card this turn
                    if (!isMoveLeading) {
                        // start new trick
                        playRoom.deal!.startNextTrick(trickWinnerIndex!);

                        // deal 1 card to each player
                        playRoom.deal!.dealCardsToPlayers(trickWinnerIndex!, 1);

                        // sort cards in hands; check for marriages; update clients
                        for (let i = 0; i < 2; i++) {
                            playRoom.deal!.sortCardsByPointsAndSuit(playRoom.deal!.cardsInHand[i]);
                            playRoom.deal!.marriagesInHand[i] = checkForMarriagesInHand(playRoom.deal!.cardsInHand[i], playRoom.deal!.trumpSuit!);
                            this.io.to(playRoom.players[i]!.socketId).emit('dealStateUpdateAfterTrick', new GameStateDTO(playRoom.deal, i).getDTO());
                        }
                    }
                } else {
                    // GAME IS OVER!

                    // end deal
                    playRoom.endDeal(dealOver, this.io);
                    // start new deal
                    playRoom.startDeal();

                    // update clients
                    for (let i = 0; i < 2; i++) {
                        this.io.to(playRoom.players[i]!.socketId).emit('sessionStateUpdate', new RoomStateDTO(playRoom, i).getDTO());
                        this.io.to(playRoom.players[i]!.socketId).emit('bummerlStateUpdate', new BummerlStateDTO(playRoom.bummerl, i).getDTO());
                        this.io.to(playRoom.players[i]!.socketId).emit('gameStart', new GameStateDTO(playRoom.deal, i).getDTO());
                    }
                }
                playRoom.deal!.moveBuffer.state = 'waitingForMove';
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
