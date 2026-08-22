const bike = document.getElementById("bike");
const obstacle = document.getElementById("obstacle");
const scoreText = document.getElementById("score");

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restart");


// -------------------------
// Game variables
// -------------------------

let lane = 1; // 0 = left, 1 = center, 2 = right

let score = 0;

let obstacleLane = 1;

let obstacleY = -100;

let speed = 5;

let gameRunning = true;


// -------------------------
// Get lane position
// -------------------------

function getLanePosition(laneNumber) {

  if (laneNumber === 0) {
    return 16.66;
  }

  if (laneNumber === 1) {
    return 50;
  }

  return 83.33;
}


// -------------------------
// Move bike
// -------------------------

function updateBike() {

  bike.style.left = getLanePosition(lane) + "%";

}


// -------------------------
// Left movement
// -------------------------

function moveLeft() {

  if (!gameRunning) return;

  if (lane > 0) {

    lane--;

    updateBike();

  }

}


// -------------------------
// Right movement
// -------------------------

function moveRight() {

  if (!gameRunning) return;

  if (lane < 2) {

    lane++;

    updateBike();

  }

}


// -------------------------
// Buttons
// -------------------------

leftButton.addEventListener("click", moveLeft);

rightButton.addEventListener("click", moveRight);


// -------------------------
// Touch controls
// -------------------------

leftButton.addEventListener("touchstart", function(e) {

  e.preventDefault();

  moveLeft();

});


rightButton.addEventListener("touchstart", function(e) {

  e.preventDefault();

  moveRight();

});


// -------------------------
// Keyboard controls
// -------------------------

document.addEventListener("keydown", function(e) {

  if (e.key === "ArrowLeft") {

    moveLeft();

  }

  if (e.key === "ArrowRight") {

    moveRight();

  }

});


// -------------------------
// Create obstacle
// -------------------------

function resetObstacle() {

  obstacleLane = Math.floor(Math.random() * 3);

  obstacleY = -100;

  obstacle.style.left =
    getLanePosition(obstacleLane) + "%";

}


// -------------------------
// Collision detection
// -------------------------

function checkCollision() {

  const bikeRect = bike.getBoundingClientRect();

  const obstacleRect = obstacle.getBoundingClientRect();

  const collision =
    bikeRect.left < obstacleRect.right &&
    bikeRect.right > obstacleRect.left &&
    bikeRect.top < obstacleRect.bottom &&
    bikeRect.bottom > obstacleRect.top;

  if (collision) {

    endGame();

  }

}


// -------------------------
// Game loop
// -------------------------

function gameLoop() {

  if (!gameRunning) return;

  obstacleY += speed;

  obstacle.style.top = obstacleY + "px";

  checkCollision();

  // Obstacle reached bottom

  if (obstacleY > window.innerHeight) {

    score++;

    scoreText.textContent =
      "Score: " + score;

    // Increase speed gradually

    if (score % 5 === 0) {

      speed += 0.5;

    }

    resetObstacle();

  }

  requestAnimationFrame(gameLoop);

}


// -------------------------
// Score
// -------------------------

setInterval(function() {

  if (!gameRunning) return;

  score++;

  scoreText.textContent =
    "Score: " + score;

}, 1000);


// -------------------------
// Game Over
// -------------------------

function endGame() {

  gameRunning = false;

  finalScore.textContent =
    "Score: " + score;

  gameOverScreen.style.display = "block";

}


// -------------------------
// Restart
// -------------------------

restartButton.addEventListener("click", function() {

  score = 0;

  speed = 5;

  lane = 1;

  gameRunning = true;

  scoreText.textContent = "Score: 0";

  gameOverScreen.style.display = "none";

  updateBike();

  resetObstacle();

  requestAnimationFrame(gameLoop);

});


// -------------------------
// Start game
// -------------------------

updateBike();

resetObstacle();

requestAnimationFrame(gameLoop);
