const {
    getAllCards,
    randomCard,
    getCardByName,
    removeCardFromDeck,
    getCardPositionInHandByName
} = require('./cards');


/**
 * @description CALCULATES TRICK WINNER
 * @param {object} game- Game object
 * @param {object} leadingPlay - first play in trick
 * @param {object} responsePlay - second play in trick
 * @returns {string} - winner id
 * 
 * - Lead NOT trump
 *      - Response NOT trump
 *          - Same suits
 *                  ===> {compare values}
 *          - Diff suits
 *                  ===> {L win}
 *      - Response TRUMP
 *              ===> {R win}
 * 
 * - Lead TRUMP
 *      - Response NOT trump
 *              ===> {L win}
 *      - Response TRUMP
 *              ===> {compare values}
 * 
 */
function calculateTrickWinner(game, leadingPlay, responsePlay){

    let leadingCard = getCardByName(leadingPlay.cardName);
    let responseCard = getCardByName(responsePlay.cardName);

    let leadTrump, respTrump;
    let winner;

    // check if leading and response cards are trumps
    if(leadingCard.suit === game.trumpSuit){leadTrump = true;}
    else{leadTrump = false;}
    
    if(responseCard.suit === game.trumpSuit){respTrump = true;}
    else{respTrump = false;}

    //### Lead NOT trump
    if(!leadTrump){

        //### Response NOT trump
        if(!respTrump){

            //### Same suits
            if(leadingCard.suit === responseCard.suit){

                // {compare values}
                if(leadingCard.points > responseCard.points){
                    winner = leadingPlay.playerId;
                }
                else{
                    winner = responsePlay.playerId;
                }
            }

            //### Diff suits
            else{
                //{L win}
                winner = leadingPlay.playerId;
            }
        }

        //### Response TRUMP
        else if(respTrump){
            //{R win}
            winner = responsePlay.playerId;
        }

    }

    //### Lead TRUMP
    else if(leadTrump){

        //### Response NOT
        if(!respTrump){
            // {L win}
            winner = leadingPlay.playerId;
        }

        //### Response TRUMP
        else if(respTrump){
            // {compare values}
            if(leadingCard.points > responseCard.points){
                winner = leadingPlay.playerId;
            }
            else{
                winner = responsePlay.playerId;
            }
        }
    }
    return winner;
}



/**
 * CALCULATES TRICK POINTS
 * 
 * @param leadingPlay - first play in trick
 * @param responsePlay - second play in trick
 * 
 */
function calculateTrickPoints(leadingPlay, responsePlay){

    let leadingCard = getCardByName(leadingPlay.cardName);
    let responseCard = getCardByName(responsePlay.cardName);

    let points = leadingCard.points + responseCard.points;

    return points;
}


/**
 * Checks for "marriages" (hr. zvanja) in player's hand 
 * - check if player has marriages in hand
 * - 20 or 40 - check if marriage suit equals trump suit
 * @param {array} playerHand - cards in player's hand
 * @param {string} trumpSuit - trump suit (hr. adut)
 * @returns array of objects containing suits in which player has marriage with 20/40 values
 */
function checkForMarriagesInHand(playerHand, trumpSuit){

    const marriages = [];

    const z_h = [getCardByName("q-herc"), getCardByName("k-herc")];
    const z_k = [getCardByName("q-karo"), getCardByName("k-karo")];
    const z_p = [getCardByName("q-pik"), getCardByName("k-pik")];
    const z_t = [getCardByName("q-tref"), getCardByName("k-tref")];

    // test if ALL of the elements in z_x exist in playerHand
    var hasMarriage_Herc = z_h.every(i => playerHand.includes(i));
    var hasMarriage_Karo = z_k.every(i => playerHand.includes(i));
    var hasMarriage_Pik = z_p.every(i => playerHand.includes(i));
    var hasMarriage_Tref = z_t.every(i => playerHand.includes(i));

    // add marriage(s) suit and points to array if there are any
    if(hasMarriage_Herc){
        if(trumpSuit === "Herc"){
            marriages.push({suit: "Herc", points: 40});
        }
        else{
            marriages.push({suit: "Herc", points: 20});
        }
    };

    if(hasMarriage_Karo){
        if(trumpSuit === "Karo"){
            marriages.push({suit: "Karo", points: 40});
        }
        else{
            marriages.push({suit: "Karo", points: 20});
        }
    };

    if(hasMarriage_Pik){
        if(trumpSuit === "Pik"){
            marriages.push({suit: "Pik", points: 40});
        }
        else{
            marriages.push({suit: "Pik", points: 20});
        }
    };

    if(hasMarriage_Tref){
        if(trumpSuit === "Tref"){
            marriages.push({suit: "Tref", points: 40});
        }
        else{
            marriages.push({suit: "Tref", points: 20});
        }
    };

    return marriages;
}



function checkPlayedCardMarriagePoints(card, marriagesInHand){

    let marriagePoints = 0;

    if(marriagesInHand.length > 0 && (card.tier === "Q" || card.tier === "K" )){

        marriagesInHand.forEach(marriage => {
            if(marriage.suit === card.suit){
                marriagePoints = marriage.points;
            }
        });
        
    }
    return marriagePoints;
}


/**
 * Calculates valid RESPONSE cards
 * 
 * # Deck CLOSED(or out of cards)
 * 
 *      ## Player has SAME SUIT card
 *          ### Has stronger same suit card
 *              ===> {play stronger same suit card}
 *          ### Doesnt have stronger same suit
 *              ===> {play weaker same suit card}
 * 
 *      ## Player doesnt have same suit
 *          ### Has TRUMPS
 *              ===> {play any trump}
 *          ### NO trumps
 *              ===> {play any card}
 * 
 * # Deck NOT closed
 *      ===> {play any card}
 * 
 */
function calculateValidResponseCards(leadingCard, cardsInResponseHand, trumpSuit, deckIsClosed){
    let validResponseCards = [];

    // responding player has same suit card in hand
    let hasSameSuit = cardsInResponseHand.some(c => c.suit === leadingCard.suit);
    // cards of same suit in player's hand
    let sameSuitCards = cardsInResponseHand.filter(c => c.suit === leadingCard.suit);

    // responding player has stronger same suit card in hand
    let hasStrongerSameSuit = cardsInResponseHand.some(c => c.suit === leadingCard.suit && c.points > leadingCard.points);
    // stronger cards of same suit in player's hand
    let strongerSameSuitCards = cardsInResponseHand.filter(c => c.suit === leadingCard.suit && c.points > leadingCard.points);

    // responding player has trump in hand
    let hasTrump = cardsInResponseHand.some(c => c.suit === trumpSuit);
    // trump cards in player's hand
    let trumpCards = cardsInResponseHand.filter(c => c.suit === trumpSuit);

    if(deckIsClosed){
        if(hasSameSuit){
            if(hasStrongerSameSuit){
                // ===> {play stronger same suit card}
                validResponseCards = strongerSameSuitCards;
            }
            else{
                // ===> {play weaker same suit card}
                validResponseCards = sameSuitCards;
            }
        }
        else{
            if(hasTrump){
                // ===> {play any trump}
                validResponseCards = trumpCards;
            }
            else{
                // ===> {play any card}
                validResponseCards = cardsInResponseHand;
            }
        }
    }
    else{
        // ===> {play any card}
        validResponseCards = cardsInResponseHand;
    }
    return validResponseCards;
}


module.exports = {
    calculateTrickWinner,
    calculateTrickPoints,
    checkForMarriagesInHand,
    checkPlayedCardMarriagePoints,
    calculateValidResponseCards
}