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

// Background music (it starts automatically)
const backgroundMusic = document.getElementById('audio/background-music');

// Bird movement with touch (tap to make the bird jump)
document.addEventListener('touchstart', (e) => {
  bird.velocity = bird.lift; // Bird jumps when the screen is tapped
});

// If you also want to use spacebar for jumping (for desktop compatibility):
document.addEventListener('keydown', () => {
  bird.velocity = bird.lift;  // Bird jumps when spacebar is pressed
});


// Bird draw function
function drawBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  ctx.fillStyle = 'green';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Pipe generation function
function createPipes() {
  let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
  pipes.push({
    x: canvas.width,
    y: pipeHeight,
    width: pipeWidth,
    height: canvas.height - pipeHeight - pipeGap
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

  if (Math.random() < 0.01) {
    createPipes(); // Create new pipes randomly
  }

  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true; // End the game if bird hits ground or top
  }

  requestAnimationFrame(gameLoop); // Keep looping the game
}

gameLoop(); // Start the game


