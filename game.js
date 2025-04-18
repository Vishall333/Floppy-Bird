
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
let frameCount = 0;
let score = 0;
let gameOver = false;

function createPipes() {
  let minPipeHeight = 50;
  let maxPipeHeight = canvas.height - pipeGap - 50;
  let topPipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
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
    }

    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
    ) {
      gameOver = true;
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', 100, 250);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  if (frameCount % 100 === 0) {
    createPipes();
  }

  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true;
  }

  frameCount++;
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', () => {
  bird.velocity = bird.lift;
});

document.addEventListener('touchstart', () => {
  bird.velocity = bird.lift;
});

gameLoop();
