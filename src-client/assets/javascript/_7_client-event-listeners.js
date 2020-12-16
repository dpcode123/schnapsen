// ADDING EVENT LISTENERS
// ********************************************************************************

// cards
for(let i = 0; i<5; i++) {
    cardsInHand[i].addEventListener('mouseover', function () {cardHover(cardsInHand[i]);}, false);
    cardsInHand[i].addEventListener('mouseout',  function () {cardHoverOut(cardsInHand[i]);}, false);
    cardsInHand[i].addEventListener('click',     function () {movePlayCard(cardsInHand[i]);}, false);
}

// won cards - 1st trick
wonCardsFirstTrick.forEach(element => {
    element.addEventListener('mouseover', function () {toggleShowAllTricks();}, false);
});

// won cards - all tricks
wonCardsAllTricksDisplayed.forEach(element => {
    element.addEventListener('mouseout', function () {toggleHideAllTricks();}, false);
    element.addEventListener('mouseover', function () {toggleShowAllTricks();}, false);
});


// exchange trump
exchangeTrumpCardButton.addEventListener('mouseover', function () {hoverExchangeTrump(exchangeTrumpCardButton);}, false);
exchangeTrumpCardButton.addEventListener('mouseout', function () {hoverOutExchangeTrump(exchangeTrumpCardButton);}, false);
exchangeTrumpCardButton.addEventListener('click', function () {moveExchangeTrump();}, false);

// close deck
trumpCard.addEventListener('mouseover', function () {hoverCloseDeck(trumpCard);}, false);
trumpCard.addEventListener('mouseout',  function () {hoverOutCloseDeck(trumpCard);}, false);
trumpCard.addEventListener('click', function () {moveCloseDeck();}, false);

// forbidden card overlays
for(let i = 0; i<5; i++) {
    forbiddenCardOverlay[i].addEventListener('mouseover', function () {hoverForbiddenCardOverlay(forbiddenCardOverlay[i]);}, false);
    forbiddenCardOverlay[i].addEventListener('mouseout',  function () {hoverOutForbiddenCardOverlay(forbiddenCardOverlay[i]);}, false);
}


// modal
const modal = document.querySelector('.modal');
const modalCloseButton = document.querySelector('.modal-close-button');
const modalExitGameButton = document.getElementById('modal-exit-btn');
const modalContinueGameButton = document.getElementById('modal-continue-btn');

exitButton.addEventListener('click', toggleModal);
exitButton.style.cursor = 'pointer';

modalCloseButton.addEventListener('click', toggleModal);
window.addEventListener('click', windowOnClick);
modalContinueGameButton.addEventListener('click', toggleModal);

function toggleModal() {
    modal.classList.toggle('show-modal');
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}
