const bike = document.getElementById("bike");

const enemy1 = document.getElementById("enemy1");
const enemy2 = document.getElementById("enemy2");

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const bestText = document.getElementById("best");
const speedText = document.getElementById("speedValue");

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const finalBest = document.getElementById("finalBest");
const restartButton = document.getElementById("restart");

let lane = 1;

let score = 0;
let lives = 3;

let speed = 5;

let running = true;

let enemy1Y = -150;
let enemy2Y = -550;

let enemy1Lane = 0;
let enemy2Lane = 2;

let best = Number(localStorage.getItem("bikeBest")) || 0;

bestText.textContent = best;


/* Lane position */

function lanePosition(lane) {

  if (lane === 0) {
    return 16.66;
  }

  if (lane === 1) {
    return 50;
  }

  return 83.33;
}


/* Bike movement */

function updateBike() {

  bike.style.left = lanePosition(lane) + "%";

}


function moveLeft() {

  if (!running) return;

  if (lane > 0) {

    lane--;

    updateBike();

  }

}


function moveRight() {

  if (!running) return;

  if (lane < 2) {

    lane++;

    updateBike();

  }

}


/* Buttons */

leftButton.addEventListener("click", moveLeft);

rightButton.addEventListener("click", moveRight);


/* Keyboard */

document.addEventListener("keydown", function(event) {

  if (event.key === "ArrowLeft") {
    moveLeft();
  }

  if (event.key === "ArrowRight") {
    moveRight();
  }

});


/* Swipe */

let startX = 0;

document.addEventListener("touchstart", function(event) {

  startX = event.touches[0].clientX;

}, { passive: true });


document.addEventListener("touchend", function(event) {

  const endX = event.changedTouches[0].clientX;

  const distance = endX - startX;

  if (Math.abs(distance) > 40) {

    if (distance < 0) {
      moveLeft();
    } else {
      moveRight();
    }

  }

}, { passive: true });


/* Random lane */

function randomLane() {

  return Math.floor(Math.random() * 3);

}


/* Reset enemies */

function resetEnemy1() {

  enemy1Lane = randomLane();

  enemy1Y = -150;

  enemy1.style.left =
    lanePosition(enemy1Lane) + "%";

}


function resetEnemy2() {

  enemy2Lane = randomLane();

  enemy2Y = -550;

  enemy2.style.left =
    lanePosition(enemy2Lane) + "%";

}


/* Collision */

function isCollision(object) {

  const bikeBox = bike.getBoundingClientRect();

  const enemyBox = object.getBoundingClientRect();

  const padding = 12;

  return (
    bikeBox.left + padding < enemyBox.right - padding &&
    bikeBox.right - padding > enemyBox.left + padding &&
    bikeBox.top + padding < enemyBox.bottom - padding &&
    bikeBox.bottom - padding > enemyBox.top + padding
  );

}


/* Crash */

function crash(object) {

  lives--;

  livesText.textContent = lives;

  object.style.top = "-200px";

  if (navigator.vibrate) {
    navigator.vibrate(250);
  }

  bike.style.transform =
    "translateX(-50%) rotate(8deg)";

  setTimeout(function() {

    bike.style.transform =
      "translateX(-50%) rotate(0deg)";

  }, 200);

  if (lives <= 0) {

    endGame();

  }

}


/* Game loop */

function gameLoop() {

  if (!running) return;

  enemy1Y += speed;

  enemy2Y += speed * .85;

  enemy1.style.top =
    enemy1Y + "px";

  enemy2.style.top =
    enemy2Y + "px";


  /* Enemy 1 */

  if (enemy1Y > window.innerHeight) {

    score++;

    resetEnemy1();

  }


  /* Enemy 2 */

  if (enemy2Y > window.innerHeight) {

    score++;

    resetEnemy2();

  }


  /* Collision */

  if (isCollision(enemy1)) {

    crash(enemy1);

    resetEnemy1();

  }


  if (isCollision(enemy2)) {

    crash(enemy2);

    resetEnemy2();

  }


  /* Difficulty */

  speed = Math.min(
    12,
    5 + score / 25
  );

  speedText.textContent =
    Math.floor(speed - 3);


  scoreText.textContent =
    score;


  requestAnimationFrame(gameLoop);

}


/* Time score */

setInterval(function() {

  if (!running) return;

  score++;

  scoreText.textContent =
    score;

}, 1000);


/* Game over */

function endGame() {

  running = false;

  if (score > best) {

    best = score;

    localStorage.setItem(
      "bikeBest",
      best
    );

  }

  finalScore.textContent =
    score;

  finalBest.textContent =
    best;

  bestText.textContent =
    best;

  gameOver.style.display =
    "block";

}


/* Restart */

restartButton.addEventListener("click", function() {

  score = 0;

  lives = 3;

  speed = 5;

  lane = 1;

  running = true;

  scoreText.textContent = "0";

  livesText.textContent = "3";

  speedText.textContent = "1";

  gameOver.style.display = "none";

  updateBike();

  resetEnemy1();

  resetEnemy2();

  requestAnimationFrame(gameLoop);

});


/* Start */

updateBike();

resetEnemy1();

resetEnemy2();

requestAnimationFrame(gameLoop);
