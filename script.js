// Define HTML Elements
const board = document.querySelector("#game-board");
const instructionText = document.querySelector("#instruction-text");
const logo = document.querySelector("#logo");
const score = document.querySelector("#score");
const highScoreText = document.querySelector("#high-score");
const gameOverText = document.querySelector("#game-over-text");

// Get audio elements
const bgMusic = document.getElementById("background-music");
const eatSound = document.getElementById("eat-sound");
const gameOverSound = document.getElementById("game-over-sound");

// Define snake variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let waitingForRestart = false;

// Draw game map, snake and food
const draw = () => {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
};

// Draw snake
const drawSnake = () => {
  snake.map((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosistion(snakeElement, segment);
    board.appendChild(snakeElement);
  });
};

// Create a snake or food cube
const createGameElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

// Set the position of the snake or the food
const setPosistion = (element, position) => {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
};

// Draw food function
function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosistion(foodElement, food);
  board.appendChild(foodElement);
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
const move = () => {
  const head = { ...snake[0] };

  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
    default:
      break;
  }

  snake.unshift(head);

  if (head.x == food.x && head.y === food.y) {
    food = generateFood();
    eatSound.volume = 0.7; // Adjust volume
    eatSound.play();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
};

// Start game function
const startGame = () => {
  gameStarted = true; // Keep track of a running game
  waitingForRestart = false;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameOverText.style.display = "none";

  // Play background music
  bgMusic.volume = 0.5; // Set volume (0.0 to 1.0)
  bgMusic.play();

  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
};

// Keypress event listener
const handleKeyPress = (e) => {
  if (
    !gameStarted &&
    !waitingForRestart &&
    (e.code === "Space" || e.key === " ")
  ) {
    startGame();
  } else if (waitingForRestart) {
    // Any key press will restart the game when in waiting for restart state
    restartGame();
  } else if (gameStarted) {
    // Only change direction if the game is active
    switch (e.key) {
      case "ArrowUp":
        if (direction !== "down") direction = "up";
        break;
      case "ArrowDown":
        if (direction !== "up") direction = "down";
        break;
      case "ArrowLeft":
        if (direction !== "right") direction = "left";
        break;
      case "ArrowRight":
        if (direction !== "left") direction = "right";
        break;
      default:
        break;
    }
  }
};

document.addEventListener("keydown", handleKeyPress);

const increaseSpeed = () => {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
};

// Check for collisions on the wall or on the snakes body
const checkCollision = () => {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
};

// Game over function (replaces resetGame)
const gameOver = () => {
  updateHighScore();
  stopGame();

  // Set waiting for restart flag
  waitingForRestart = true;

  // Display game over text
  gameOverText.innerHTML =
    "GAME OVER<br><span style='font-size: 30px;'>Press any key to continue</span>";
  gameOverText.style.display = "block";

  // Stop background music and play game over sound
  bgMusic.pause();
  bgMusic.currentTime = 0;
  gameOverSound.play();
};

// New function to restart the game
const restartGame = () => {
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
  startGame();
  gameOverSound.pause();
};

// Update the player score
const updateScore = () => {
  const currScore = snake.length - 1;
  score.textContent = currScore.toString().padStart(3, "0");
};

// Stop game function
const stopGame = () => {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "none";
  logo.style.display = "none";
  bgMusic.pause(); // Stop background music
  gameOverSound.pause();
};

const updateHighScore = () => {
  const currScore = snake.length - 1;
  let savedHighScore = localStorage.getItem("highScore") || 0;

  if (currScore > highScore) {
    highScore = currScore;
    localStorage.setItem("highScore", highScore);
    highScoreText.textContent = highScore.toString().padStart(3, "0");
    highScoreText.style.display = "block";
  }
};

// Load high score when the game starts
document.addEventListener("DOMContentLoaded", () => {
  highScore = localStorage.getItem("highScore") || 0;
  highScoreText.textContent = highScore.toString().padStart(3, "0");
  highScoreText.style.display = "block";
});
