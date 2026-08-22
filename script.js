const bike = document.getElementById("bike");
const enemy = document.getElementById("enemy");
const enemy2 = document.getElementById("enemy2");

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const highScoreText = document.getElementById("highScore");

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restart");

let lane = 1;

let score = 0;
let lives = 3;

let speed = 5;

let running = true;

let enemyY = -120;
let enemy2Y = -500;

let enemyLane = 0;
let enemy2Lane = 2;

let highScore = Number(localStorage.getItem("bikeHighScore")) || 0;

highScoreText.textContent = highScore;


/* -----------------------
   Lane positions
----------------------- */

function lanePosition(n) {

  if (n === 0) return 16.66;
  if (n === 1) return 50;
  return 83.33;

}


/* -----------------------
   Update bike
----------------------- */

function updateBike() {

  bike.style.left = lanePosition(lane) + "%";

}


/* -----------------------
   Move left
----------------------- */

function moveLeft() {

  if (!running) return;

  if (lane > 0) {
    lane--;
    updateBike();
  }

}


/* -----------------------
   Move right
----------------------- */

function moveRight() {

  if (!running) return;

  if (lane < 2) {
    lane++;
    updateBike();
  }

}


/* -----------------------
   Buttons
----------------------- */

leftButton.addEventListener("click", moveLeft);
rightButton.addEventListener("click", moveRight);


/* -----------------------
   Keyboard
----------------------- */

document.addEventListener("keydown", function(e) {

  if (e.key === "ArrowLeft") {
    moveLeft();
  }

  if (e.key === "ArrowRight") {
    moveRight();
  }

});


/* -----------------------
   Touch swipe
----------------------- */

let touchStartX = 0;

document.addEventListener("touchstart", function(e) {

  touchStartX = e.touches[0].clientX;

}, {passive:true});


document.addEventListener("touchend", function(e) {

  const touchEndX = e.changedTouches[0].clientX;

  const difference = touchEndX - touchStartX;

  if (Math.abs(difference) > 40) {

    if (difference < 0) {
      moveLeft();
    } else {
      moveRight();
    }

  }

}, {passive:true});


/* -----------------------
   Random lane
----------------------- */

function randomLane() {

  return Math.floor(Math.random() * 3);

}


/* -----------------------
   Reset enemy
----------------------- */

function resetEnemy() {

  enemyLane = randomLane();

  enemyY = -120;

  enemy.style.left =
    lanePosition(enemyLane) + "%";

}


function resetEnemy2() {

  enemy2Lane = randomLane();

  enemy2Y = -500;

  enemy2.style.left =
    lanePosition(enemy2Lane) + "%";

}


/* -----------------------
   Collision
----------------------- */

function collision(object) {

  const a = bike.getBoundingClientRect();
  const b = object.getBoundingClientRect();

  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  );

}


/* -----------------------
   Crash
----------------------- */

function crash(object) {

  lives--;

  livesText.textContent = lives;

  object.style.top = "-150px";

  if (lives <= 0) {

    endGame();

  }

}


/* -----------------------
   Game loop
----------------------- */

function gameLoop() {

  if (!running) return;

  enemyY += speed;
  enemy2Y += speed * 0.85;

  enemy.style.top = enemyY + "px";
  enemy2.style.top = enemy2Y + "px";


  /* Enemy 1 */

  if (enemyY > window.innerHeight) {

    score++;

    resetEnemy();

  }


  /* Enemy 2 */

  if (enemy2Y > window.innerHeight) {

    score++;

    resetEnemy2();

  }


  /* Collision */

  if (collision(enemy)) {
    crash(enemy);
    resetEnemy();
  }

  if (collision(enemy2)) {
    crash(enemy2);
    resetEnemy2();
  }


  /* Score */

  scoreText.textContent = score;


  /* Increase difficulty */

  if (score > 0 && score % 10 === 0) {
    speed = Math.min(13, 5 + score / 20);
  }


  requestAnimationFrame(gameLoop);

}


/* -----------------------
   Score timer
----------------------- */

setInterval(function() {

  if (!running) return;

  score++;

  scoreText.textContent = score;

}, 1000);


/* -----------------------
   End game
----------------------- */

function endGame() {

  running = false;

  finalScore.textContent = score;

  if (score > highScore) {

    highScore = score;

    localStorage.setItem(
      "bikeHighScore",
      highScore
    );

    highScoreText.textContent = highScore;

  }

  gameOver.style.display = "block";

}


/* -----------------------
   Restart
----------------------- */

restartButton.addEventListener("click", function() {

  score = 0;

  lives = 3;

  speed = 5;

  lane = 1;

  running = true;

  scoreText.textContent = "0";
  livesText.textContent = "3";

  gameOver.style.display = "none";

  updateBike();

  resetEnemy();
  resetEnemy2();

  requestAnimationFrame(gameLoop);

});


/* -----------------------
   Start
----------------------- */

updateBike();

resetEnemy();
resetEnemy2();

requestAnimationFrame(gameLoop);
