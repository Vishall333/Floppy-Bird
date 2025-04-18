const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
  x: 50,
  y: canvas.height / 2,
  width: 30,
  height: 30,
  gravity: 0.6,
  lift: -15,
  velocity: 0
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 200;
let pipeSpeed = 3;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameOver = false;

// Sounds
let crashSound = new Audio('crash-sound.mp3');
let scoreSound = new Audio('score-sound.mp3');
let backgroundMusic = new Audio('background-music.mp3');

// Background Image
let backgroundImage = new Image();
backgroundImage.src = 'background.jpg';

// Handle Bird Movement
document.addEventListener('keydown', () => {
  if (!gameOver) {
    bird.velocity = bird.lift;
  }
});

function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  document.getElementById('gameOverScreen').style.display = 'none';
  backgroundMusic.play();  // Restart the background music
}

// Game Over Function
function showGameOver() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);  // Save high score
  }
  document.getElementById('gameOverScreen').style.display = 'block';
  document.getElementById('finalScore').innerText = 'Final Score: ' + score;
  document.getElementById('highScore').innerText = 'High Score: ' + highScore;
}

// Pipe Generation
function generatePipes() {
  let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
  pipes.push({
    x: canvas.width,
    y: pipeHeight,
    width: pipeWidth
  });
}

// Update the
