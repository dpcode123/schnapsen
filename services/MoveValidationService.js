/* const { otherPlayer,
    getPlayerIndexInRoomByUserId
} = require("../utils/util");
const { getCardByName } = require('../schnaps/cards');
const { 
    calculateTrickWinner,
    calculateTrickPoints,
    checkForMarriagesInHand,
    checkPlayedCardMarriagePoints,
    calculateValidRespondingCards,
} = require('../schnaps/schnaps');
const RoomStateDTO = require('../dto/RoomStateDTO');
const BummerlStateDTO =require('../dto/BummerlStateDTO');
const GameStateDTO = require('../dto/GameStateDTO');

const OpponentMoveDTO = require('../dto/OpponentMoveDTO');
const Trick = require('../model/Trick');
const PlayRoom = require("../model/PlayRoom"); */


module.exports = function(io, socket) {

    // Validate move - exchange trump
    this.exchangeTrump = (move) => {
        return true;
    }

    // Validate move - close deck
    this.closeDeck = (move) => {
        return true;
    }

    // Validate move - play card
    this.playCard = (move) => {
        return true;
    }


}
