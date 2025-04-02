// Define HTML Elements
const board = document.querySelector("#game-board");
const instructionText = document.querySelector("#instruction-text");
const logo = document.querySelector("#logo");
const score = document.querySelector("#score");
const highScoreText = document.querySelector("#high-score");

// Define snake variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

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

// testing draw function
// draw();

// Draw food function
if (gameStarted) {
  function drawFood() {
    const foodElement = createGameElement("div", "food");
    setPosistion(foodElement, food);
    board.appendChild(foodElement);
  }
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

// Test moving
// setInterval(() => {
//   move();
//   draw();
// }, 200);

// Start game function
const startGame = () => {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
};

// Keypress event listener
const handleKeyPress = (e) => {
  if ((!gameStarted && e.code === "space") || (!gameStarted && e.key === " ")) {
    startGame();
  } else {
    switch (e.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
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
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
};

// Reset game
const resetGame = () => {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
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
  instructionText.style.display = "block";
  logo.style.display = "block";
};

const updateHighScore = () => {
  const currScore = snake.length - 1;

  if (currScore > highScore) {
    highScore = currScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
    highScoreText.style.display = "block";
  }
};
