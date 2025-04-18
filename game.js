
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  gravity: 0.6,
  lift: -15,
  velocity: 0
};

let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpacing = 180; // increased horizontal gap
let pipeSpeed = 2;
let frameCount = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;

let jumpSound = new Audio('jump.mp3');
let scoreSound = new Audio('score.mp3');
let crashSound = new Audio('crash.mp3');

function createPipes() {
  let topPipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
  let bottomPipeY = topPipeHeight + pipeGap;
  let bottomPipeHeight = canvas.height - bottomPipeY;

  pipes.push({
    x: canvas.width,
    y: topPipeHeight,
    width: pipeWidth,
    height: bottomPipeHeight
  });
}

function drawBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;

    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);
    ctx.fillRect(pipe.x, pipe.y + pipeGap, pipe.width, pipe.height);

    if (pipe.x + pipe.width <= 0) {
      pipes.splice(index, 1);
      score++;
      scoreSound.play();
    }

    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
    ) {
      gameOver = true;
      crashSound.play();
      showGameOver();
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function gameLoop() {
  if (!gameStarted || gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();

  if (frameCount % pipeSpacing === 0) {
    createPipes();
  }

  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true;
    crashSound.play();
    showGameOver();
  }

  frameCount++;
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frameCount = 0;
  gameOver = false;
  document.getElementById('gameOverScreen').style.display = 'none';
  gameStarted = true;
  gameLoop();
}

function showGameOver() {
  document.getElementById('gameOverScreen').style.display = 'block';
}

document.addEventListener('keydown', () => {
  if (gameStarted && !gameOver) {
    bird.velocity = bird.lift;
    jumpSound.play();
  }
});

document.addEventListener('touchstart', () => {
  if (gameStarted && !gameOver) {
    bird.velocity = bird.lift;
    jumpSound.play();
  }
});

document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('startScreen').style.display = 'none';
  resetGame();
});

document.getElementById('restartBtn').addEventListener('click', () => {
  resetGame();
});
