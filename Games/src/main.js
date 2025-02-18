// Existing game setup
var c = document.createElement("canvas");
var ctx = c.getContext("2d");

var screenWidth = 500;
var screenHeight = 800;
c.width = screenWidth;
c.height = screenHeight;
document.body.appendChild(c);

let isHighScoreSubmitted = false;
let gameOverChecked = false;
let gameRunning = false;
let isCountingDown = false;
let isModalVisible = false;

// Game variables
const gravity = 0.34;
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
let fps = 60;
let now;
let then = Date.now();
let interval = 1000 / fps;
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

// Keydown handling
function keydown(e) {
    if (e.keyCode === 65) {
        holdingLeftKey = true;
    } else if (e.keyCode === 68) {
        holdingRightKey = true;
    }

    // Restart game on "R" only if the game is over, not counting down, and modal is not visible
    if (e.keyCode === 82 && dead && !isCountingDown && !isModalVisible) {
        resetGame();
    }
}

// Keyup handling
function keyup(e) {
    if (e.keyCode === 65) {
        holdingLeftKey = false;
    } else if (e.keyCode === 68) {
        holdingRightKey = false;
    }
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

        const backgroundImage = new Image();
        backgroundImage.src = "Sprites/background.png";
        ctx.drawImage(backgroundImage, 0, 0, screenWidth, screenHeight);

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

// Center canvas
function centerCanvas() {
    c.style.display = "block";
    c.style.margin = "0 auto";
    c.style.position = "absolute";
    c.style.top = "50%";
    c.style.left = "50%";
    c.style.transform = "translate(-50%, -50%)";
    c.style.maxWidth = "100%";
    c.style.maxHeight = "100%";
}

window.addEventListener('resize', centerCanvas);
centerCanvas();

// Event listeners for modal buttons
submitScoreBtn.addEventListener('click', submitHighScore);
skipScoreBtn.addEventListener('click', skipHighScore);

// Back button functionality
backButton.addEventListener('click', () => {
    window.location.href = './gameLauncher.html';
});

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
