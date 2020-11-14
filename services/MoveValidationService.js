export default function MoveValidationService(io, socket) {

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
