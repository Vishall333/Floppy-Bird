// Game Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Bird Image
let birdImage = new Image();
birdImage.src = 'bird-image.png';  // Replace this with your bird image path

// Background Image
let backgroundImage = new Image();
backgroundImage.src = 'background-image.png'; // Replace with your background image path

// Sounds
let backgroundMusic = new Audio('background-music.mp3');  // Replace with your background music file
let crashSound = new Audio('crash-sound.mp3'); // Replace with your crash sound
let scoreSound = new Audio('score-sound.mp3'); // Replace with your score sound

// Bird Properties
let bird = {
    x: 100,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    gravity: 0.5,
    velocity: 0
};

// Pipe Properties
let pipeWidth = 60;
let pipeGap = 150;
let pipeSpeed = 2;
let pipes = [];

// Score Variables
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Game States
let gameOver = false;

// Start Button Event
document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    backgroundMusic.play();
    backgroundMusic.loop = true;
    resetGame();
    updateGame();
});

// Game Reset
function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    document.getElementById('gameOverScreen').style.display = 'none';
}

// Main Game Loop
function updateGame() {
    if (!gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        // Check for Pipe Collision
        pipes.forEach((pipe, index) => {
            pipe.x -= pipeSpeed;

            if (
                bird.x + bird.width > pipe.x &&
                bird.x < pipe.x + pipe.width &&
                (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
            ) {
                gameOver = true;
                crashSound.play();
                showGameOver();
            }

            if (pipe.x + pipe.width <= 0) {
                pipes.splice(index, 1);
                score++;
                scoreSound.play();
            }
        });

        // Generate new pipes
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
            generatePipes();
        }

        // Render
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        // Draw the bird image
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

        // Render Pipes
        ctx.fillStyle = '#008000';
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);
            ctx.fillRect(pipe.x, pipe.y + pipeGap, pipe.width, canvas.height - pipe.y - pipeGap);
        });

        // Display Score
        ctx.fillStyle = '#FFF';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 20, 30);
        ctx.fillText('High Score: ' + highScore, canvas.width - 150, 30);

        requestAnimationFrame(updateGame);
    }
}

// Show Game Over Screen
function showGameOver() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Save high score
    }
    document.getElementById('gameOverScreen').style.display = 'block';
    document.getElementById('finalScore').innerText = 'Final Score: ' + score;
    document.getElementById('highScore').innerText = 'High Score: ' + highScore;
}

// Generate Pipes
function generatePipes() {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    let pipe = {
        x: canvas.width,
        y: pipeHeight,
        width: pipeWidth
    };
    pipes.push(pipe);
}

// Handle Bird Jump (Spacebar and Touch)
document.addEventListener('keydown', event => {
    if (event.key === ' ' && !gameOver) {
        bird.velocity = -8;
    }
});

// Handle Touch Event for Mobile
canvas.addEventListener('click', () => {
    if (!gameOver) {
        bird.velocity = -8;
    }
});
