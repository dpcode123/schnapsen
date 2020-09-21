function otherPlayer(firstPlayer){
    return 1-firstPlayer;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {otherPlayer, delay};