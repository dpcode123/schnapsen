import GameHistoryRepository from "../repository/GameHistoryRepository.js";

export default class GameHistoryService {

    gameHistoryRepository: GameHistoryRepository;

    constructor() { 
        this.gameHistoryRepository = new GameHistoryRepository();
    }

    saveBummerl(bummerl, bummerlWinner, bummerlLoser, playSessionUuid) {
        return this.gameHistoryRepository.saveBummerl(bummerl, bummerlWinner, bummerlLoser, playSessionUuid);
    }
}