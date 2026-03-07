// Use the existing canvas from the page (inside #game-container)
const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

// Constants
const screenWidth = 500;
const screenHeight = 800;
const gravity = 0.34;
const fps = 60;
const interval = 1000 / fps;

c.width = screenWidth;
c.height = screenHeight;

// Background image: load once, reuse every frame
let cachedBackground = null;
const bgImage = new Image();
bgImage.onload = function () {
    cachedBackground = bgImage;
};
bgImage.src = "Sprites/background.png";

let isHighScoreSubmitted = false;
let gameOverChecked = false;
let gameRunning = false;
let isCountingDown = false;
let isModalVisible = false;

// Game variables
let holdingLeftKey = false;
let holdingRightKey = false;
let dead = false;
let difficulty = 0;
let lowestBlock = 0;
let score = 0;
let yDistanceTravelled = 0;

let blocks = [];
let powerups = [];

// Time variables
let now;
let then = Date.now();
let delta;

// Modal and countdown elements
const modal = document.getElementById('high-score-modal');
const modalScore = document.getElementById('modal-score');
const playerNameInput = document.getElementById('player-name');
const submitScoreBtn = document.getElementById('submit-score');
const skipScoreBtn = document.getElementById('skip-score');
const backButton = document.getElementById('back-button');
const countdownOverlay = document.getElementById('countdown-overlay');

// Event listeners for player input
window.addEventListener('keydown', keydown, false);
window.addEventListener('keyup', keyup, false);

// Keydown handling — use key for clarity and future-proofing
function keydown(e) {
    const k = e.key.toLowerCase();
    if (k === "a") {
        holdingLeftKey = true;
    } else if (k === "d") {
        holdingRightKey = true;
    }
    if (k === "r" && dead && !isCountingDown && !isModalVisible) {
        resetGame();
    }
}

// Keyup handling
function keyup(e) {
    const k = e.key.toLowerCase();
    if (k === "a") holdingLeftKey = false;
    else if (k === "d") holdingRightKey = false;
}

// Reset game
function resetGame() {
    // Reset game variables
    blocks = [];
    lowestBlock = 0;
    difficulty = 0;
    score = 0;
    yDistanceTravelled = 0;
    player.springBootsDurability = 0;

    blocks.push(new block());
    blocks[0].x = 300;
    blocks[0].y = 650;
    blocks[0].monster = 0;
    blocks[0].type = 0;
    blocks[0].powerup = 0;

    blockSpawner();

    player.x = 300;
    player.y = 550;

    dead = false;
    gameOverChecked = false;
    isHighScoreSubmitted = false;

    hideHighScoreModal();
    startCountdown();
}

// Start countdown before the game begins
function startCountdown() {
    if (isCountingDown) return;

    isCountingDown = true;
    let count = 3;

    countdownOverlay.style.display = 'flex';

    function updateCountdown() {
        countdownOverlay.textContent = count;

        if (count > 0) {
            count--;
            setTimeout(updateCountdown, 1000);
        } else {
            countdownOverlay.style.display = 'none';
            isCountingDown = false;
            gameRunning = true;
            loop();
        }
    }

    updateCountdown();
}

// Show score on screen
function showScore() {
    if (yDistanceTravelled > score) {
        score = Math.round(yDistanceTravelled);
    }

    ctx.font = "36px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText(score, 15, 40);
}

// Check for game over
function checkGameOver() {
    if (dead && !gameOverChecked) {
        gameOverChecked = true;
        handleGameOver();
    }
}

// Handle game over logic
function handleGameOver() {
    gameRunning = false;
    if (Leaderboard.isHighScore(score) && !isHighScoreSubmitted) {
        showHighScoreModal(score);
    } else {
        showGameOverScreen();
    }
}

function showHighScoreModal(score) {
    isModalVisible = true;
    modalScore.textContent = score;
    modal.style.display = 'block';
    playerNameInput.focus();
}

// Modify the hideHighScoreModal function
function hideHighScoreModal() {
    isModalVisible = false;
    modal.style.display = 'none';
    playerNameInput.value = '';
}

// Modify the submitHighScore function
function submitHighScore() {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        Leaderboard.addScore(playerName, score);
        isHighScoreSubmitted = true;
        hideHighScoreModal();
        showGameOverScreen();
    } else {
        playerNameInput.classList.add('error');
        setTimeout(() => playerNameInput.classList.remove('error'), 500);
    }
}

// Modify the skipHighScore function
function skipHighScore() {
    hideHighScoreModal();
    showGameOverScreen();
}

// Show game over screen
function showGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', screenWidth / 2, screenHeight / 2 - 50);

    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, screenWidth / 2, screenHeight / 2);
    ctx.fillText('Press R to restart', screenWidth / 2, screenHeight / 2 + 50);
}

// Game loop
function loop() {
    if (!gameRunning) return;

    requestAnimationFrame(loop);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        ctx.clearRect(0, 0, screenWidth, screenHeight);
        if (cachedBackground) {
            ctx.drawImage(cachedBackground, 0, 0, screenWidth, screenHeight);
        }

        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i] !== 0) {
                blocks[i].update();
                blocks[i].draw();
            }
        }

        player.update();
        player.draw();

        showScore();
        checkGameOver();

        then = now - (delta % interval);
    }
}

// Center canvas within #game-container
function centerCanvas() {
    var container = document.getElementById('game-container');
    if (!container) return;
    c.style.display = "block";
    c.style.margin = "0 auto";
    c.style.maxWidth = "100%";
    c.style.maxHeight = "100%";
}

window.addEventListener('resize', centerCanvas);
centerCanvas();

// Event listeners for modal buttons
submitScoreBtn.addEventListener('click', submitHighScore);
skipScoreBtn.addEventListener('click', skipHighScore);

// Back button: now an <a> so navigation works without JS; no handler needed

// Initialize game
blocks.push(new block());
blocks[0].x = 300;
blocks[0].y = 650;
blocks[0].monster = 0;
blocks[0].type = 0;
blocks[0].powerup = 0;

blockSpawner();

// Start the game with countdown
startCountdown();
