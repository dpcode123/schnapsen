import { v4 as uuidv4 } from 'uuid';
import Bummerl from './Bummerl.js';
import Deal from './Deal.js';
import { checkForMarriagesInHand } from '../schnaps/schnaps.js';
import DealOverDTO from '../dto/DealOverDTO.js';
import { otherPlayer } from '../utils/util.js';
import GameHistoryService from '../services/GameHistoryService.js';
export default class PlayRoom {
    constructor(room, player1) {
        this.bummerl = undefined;
        this.deal = undefined;
        this.bummerlsWon = [0, 0];
        this.gameHistoryService = new GameHistoryService();
        // unique play session uuid
        this.playSessionUuid = uuidv4();
        // room id (and socket.io room id)
        this.room = room;
        // status (starting, started, finished)
        this.status = 'starting';
        // players
        this.players = [];
        this.players[0] = player1;
        this.players[1] = undefined;
    }
    // Starts new bummerl (and new deal)
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
    // End bummerl
    endBummerl(winnerIndex) {
        var _a, _b, _c, _d;
        // set bummerl finished time
        this.bummerl.timeFinished = Math.round(Date.now() / 1000);
        // get winning player's id and gamepoints
        const bummerlWinner = {
            id: (_a = this.players[winnerIndex]) === null || _a === void 0 ? void 0 : _a.id,
            gamePoints: (_b = this.bummerl) === null || _b === void 0 ? void 0 : _b.gamePoints[winnerIndex]
        };
        // get losing player's id and gamepoints
        const bummerlLoser = {
            id: (_c = this.players[otherPlayer(winnerIndex)]) === null || _c === void 0 ? void 0 : _c.id,
            gamePoints: (_d = this.bummerl) === null || _d === void 0 ? void 0 : _d.gamePoints[otherPlayer(winnerIndex)]
        };
        // save to game history
        this.gameHistoryService.saveBummerl(this.bummerl, bummerlWinner, bummerlLoser, this.playSessionUuid);
    }
    // Starts new deal
    startDeal() {
        let nextDealNumber = 0;
        let nextDealOpeningPlayer;
        // (current deal exist): increment deal number by 1; invert opening player 0<->1
        // (current deal doesnt exist): next deal is no.1; opening player is random 0 or 1
        if (this.deal) {
            nextDealNumber = ++this.deal.num;
            nextDealOpeningPlayer = 1 - this.deal.openingPlayer;
        }
        else {
            nextDealNumber = 1;
            nextDealOpeningPlayer = Math.round(Math.random());
        }
        // Create new deal
        this.deal = new Deal(nextDealNumber, nextDealOpeningPlayer);
        // Deal 3 cards, deal trump, deal 2 cards
        this.deal.dealCardsToPlayers(nextDealOpeningPlayer, 3);
        this.deal.setTrumpCardAndSuit();
        this.deal.dealCardsToPlayers(nextDealOpeningPlayer, 2);
        // Sort cards in hands; Check for marriages in hands
        for (let i = 0; i < 2; i++) {
            this.deal.sortCardsByPointsAndSuit(this.deal.cardsInHand[i]);
            this.deal.marriagesInHand[i] = checkForMarriagesInHand(this.deal.cardsInHand[i], this.deal.trumpSuit);
        }
    }
    // Ends current deal
    endDeal(dealOver, io) {
        // add gamepoints (1, 2 or 3) to winner
        this.bummerl.gamePoints[dealOver.winnerIndex] += dealOver.gamePoints;
        // change deal status
        this.deal.status = 'finished';
        // update client - deal winner
        io.to(this.players[dealOver.winnerIndex].socketId).emit('dealOverDTO', new DealOverDTO(dealOver, true).getDTO());
        // update client - deal loser
        io.to(this.players[otherPlayer(dealOver.winnerIndex)].socketId).emit('dealOverDTO', new DealOverDTO(dealOver, false).getDTO());
        // check if bummerl is over(player has 7+ gamepoints)
        let bummerlOver = this.bummerl.bummerlOver(dealOver.winnerIndex);
        // end bummerl, start new bummerl, increase bummerlsWon points for winning player
        if (bummerlOver) {
            this.endBummerl(dealOver.winnerIndex);
            this.startBummerl();
            this.bummerlsWon[dealOver.winnerIndex] = this.bummerlsWon[dealOver.winnerIndex] + 1;
        }
    }
}
