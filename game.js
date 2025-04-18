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
let pipeSpeed = 2;

let score = 0;
let gameOver = false;
let frameCount = 0;

// Background music (it starts automatically)
const backgroundMusic = document.getElementById('background-music');

// Bird movement on key press
document.addEventListener('keydown', () => {
  bird.velocity = bird.lift;
});

// Bird draw function
function drawBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Pipe generation function
function createPipes() {
  let topPipeHeight = Math.floor(Math.random() * 250) + 50;
  let bottomPipeY = topPipeHeight + pipeGap;
  let bottomPipeHeight = canvas.height - bottomPipeY;

  pipes.push({
    x: canvas.width,
    y: topPipeHeight,
    width: pipeWidth,
    height: bottomPipeHeight
  });
}

// Drawing pipes function
function drawPipes() {
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.y); // Top pipe
    ctx.fillRect(pipe.x, pipe.y + pipeGap, pipe.width, pipe.height); // Bottom pipe

    // Remove off-screen pipes
    if (pipe.x + pipe.width <= 0) {
      pipes.splice(index, 1);
      score++;
    }

    // Collision detection
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
    ) {
      gameOver = true;
    }
  });
}

// Update score
function updateScore() {
  document.getElementById('score').innerText = score;
}

// Main game loop
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', 100, 250);
    backgroundMusic.pause(); // Pause background music when game over
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawBird();
  drawPipes();
  updateScore();

  if (frameCount % 100 === 0) {
    createPipes(); // Create new pipes every 100 frames
  }

  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true; // End the game if bird hits ground or top
  }

  frameCount++;
  requestAnimationFrame(gameLoop); // Keep looping the game
}

gameLoop(); // Start the game
