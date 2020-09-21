// delay miliseconds
// delay(5000).then(() => console.log("dileja"));
/*
delay(1200).then(
    () => {
        hideElement(cardPlayedByPlayer);
        hideElement(cardPlayedByOpponent);
        updateAllCardsInHand(currentGame.cardsInHand);
    }
);*/
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// return random int in range 0 to n-1
// example: input 3 -> expected output 0, 1 or 2
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
