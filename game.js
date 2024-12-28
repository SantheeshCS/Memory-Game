const images = [
    'nature.jpg', 'nature.jpg',
    'cr7.jpg', 'cr7.jpg',
    'img1.jpg', 'img1.jpg',
    'img2.jpg', 'img2.jpg'
];

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createCards() {
    const gridContainer = document.getElementById('grid-container');
    const shuffledImages = shuffle(images);

    shuffledImages.forEach((image) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back" style="background-image: url('${image}');"></div>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

function revealAllCardsWithCountdown(callback) {
    const countdown = document.createElement('div');
    countdown.classList.add('countdown');
    document.body.appendChild(countdown);

    let counter = 2;
    countdown.textContent = counter;

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.add('flipped'));

    const interval = setInterval(() => {
        counter--;
        if (counter > 0) {
            countdown.textContent = counter;
        } else {
            clearInterval(interval);
            countdown.textContent = "Let's Play Game!";
            setTimeout(() => {
                cards.forEach(card => card.classList.remove('flipped'));
                countdown.remove();
                callback();
            }, 1000);
        }
    }, 1000);
}

let flippedCards = [];
let moveCounter = 0;
let timer = 15;
let interval;

function startTimer() {
    const timerElement = document.querySelector('.timer span');
    timerElement.textContent = `00:${String(timer).padStart(2, '0')}`;

    interval = setInterval(() => {
        timer--;
        timerElement.textContent = `00:${String(timer).padStart(2, '0')}`;

        if (timer === 0) {
            stopTimer();
            endGame(false); 
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        flippedCards = [];
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }

    moveCounter++;
    document.querySelector('.counter span').textContent = moveCounter;

    const allCards = document.querySelectorAll('.card');
    const flippedCardsCount = document.querySelectorAll('.card.flipped').length;

    if (flippedCardsCount === allCards.length) {
        stopTimer();
        endGame(true);
    }
}

function addCardListeners() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            flipCard(card);
        });
    });
}

function calculatePoints() {
    if (timer > 10) {
        return { points: 10, message: "Amazing! You solved it quickly!" };
    } else if (timer > 5) {
        return { points: 7, message: "Great job! You did well!" };
    } else {
        return { points: 5, message: "Good effort! Keep practicing!" };
    }
}

function endGame(isCompleted) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';

    const endScreen = document.createElement('div');
    endScreen.classList.add('end-screen');

    if (isCompleted) {
        const { points, message } = calculatePoints();
        endScreen.innerHTML = `
            <div class="end-message">🎉 Game Over 🎉</div>
            <div class="points">You scored: ${points} points</div>
            <div class="greetings">${message}</div>
        `;
    } else {
        endScreen.innerHTML = `
            <div class="end-message">⏳ Time's Up! Game Over ⏳</div>
            <div class="points">You scored: 0 points</div>
            <div class="greetings">Better luck next time!</div>
        `;
    }

    endScreen.style.transition = "opacity 2s ease-in-out";
    endScreen.style.opacity = "0";
    document.body.appendChild(endScreen);

    setTimeout(() => {
        endScreen.style.opacity = "1";
    }, 100);
}

function initGame() {
    createCards();
    revealAllCardsWithCountdown(() => {
        startTimer();
        addCardListeners();
    });
}

initGame();
function endGame(isCompleted) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';

    const greetingOverlay = document.createElement('div');
    greetingOverlay.classList.add('greeting-overlay');

    if (isCompleted) {
        const { points, message } = calculatePoints();
        greetingOverlay.innerHTML = `
            <div class="greeting-message">🎉 Congratulations! 🎉</div>
            <div class="greeting-points">You scored: ${points} points</div>
            <div class="greeting-thanks">${message}</div>
        `;
    } else {
        greetingOverlay.innerHTML = `
            <div class="greeting-message">⏳ Time's Up! Game Over ⏳</div>
            <div class="greeting-points">You scored: 0 points</div>
            <div class="greeting-thanks">Better luck next time!</div>
        `;
    }

    document.body.appendChild(greetingOverlay);
    setTimeout(() => {
        greetingOverlay.style.transition = "opacity 1s ease";
        greetingOverlay.style.opacity = "0";
        setTimeout(() => greetingOverlay.remove(), 1000);
    }, 5000); 
}

