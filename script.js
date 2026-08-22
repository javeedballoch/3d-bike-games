const bike = document.getElementById("bike");

const cars = [
  document.getElementById("car1"),
  document.getElementById("car2"),
  document.getElementById("car3")
];

const coins = [
  document.getElementById("coin1"),
  document.getElementById("coin2")
];

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const coinsText = document.getElementById("coins");
const bestText = document.getElementById("best");
const speedText = document.getElementById("speed");

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const nitroButton = document.getElementById("nitro");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const finalCoins = document.getElementById("finalCoins");
const finalBest = document.getElementById("finalBest");
const restartButton = document.getElementById("restart");

let lane = 1;

let score = 0;
let coinScore = 0;
let lives = 3;

let speed = 5;
let nitro = false;

let running = true;

let best = Number(localStorage.getItem("bikeBest")) || 0;

bestText.textContent = best;


/* Lane positions */

function lanePosition(n) {

  if (n === 0) return 16.66;
  if (n === 1) return 50;
  return 83.33;

}


/* Bike */

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

document.addEventListener("keydown", function(e) {

  if (e.key === "ArrowLeft") moveLeft();

  if (e.key === "ArrowRight") moveRight();

});


/* Swipe */

let startX = 0;

document.addEventListener("touchstart", function(e) {

  startX = e.touches[0].clientX;

}, { passive: true });


document.addEventListener("touchend", function(e) {

  const endX = e.changedTouches[0].clientX;

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


/* Car positions */

let carData = cars.map((car, index) => ({
  element: car,
  lane: index % 3,
  y: -200 - index * 250
}));


function resetCar(data, extraDistance = 0) {

  data.lane = randomLane();

  data.y = -150 - Math.random() * 300 - extraDistance;

  data.element.style.left =
    lanePosition(data.lane) + "%";

  data.element.style.top =
    data.y + "px";

}


/* Coins */

let coinData = coins.map((coin, index) => ({
  element: coin,
  lane: index === 0 ? 0 : 2,
  y: -300 - index * 500
}));


function resetCoin(data) {

  data.lane = randomLane();

  data.y = -200 - Math.random() * 500;

  data.element.style.left =
    lanePosition(data.lane) + "%";

  data.element.style.top =
    data.y + "px";

}


/* Collision */

function collision(a, b) {

  const A = a.getBoundingClientRect();
  const B = b.getBoundingClientRect();

  const padding = 9;

  return (
    A.left + padding < B.right - padding &&
    A.right - padding > B.left + padding &&
    A.top + padding < B.bottom - padding &&
    A.bottom - padding > B.top + padding
  );

}


/* Car crash */

function crash(data) {

  lives--;

  livesText.textContent = lives;

  data.y = -200;

  data.element.style.top = "-200px";

  bike.style.transform =
    "translateX(-50%) rotate(10deg)";

  if (navigator.vibrate) {
    navigator.vibrate(300);
  }

  setTimeout(() => {

    bike.style.transform =
      "translateX(-50%) rotate(0deg)";

  }, 250);

  if (lives <= 0) {
    endGame();
  }

}


/* Coin collection */

function collectCoin(data) {

  coinScore++;

  coinsText.textContent = coinScore;

  score += 5;

  data.y = -300;

  data.element.style.top = "-300px";

  if (navigator.vibrate) {
    navigator.vibrate(80);
  }

}


/* Nitro */

let nitroTimer = null;

nitroButton.addEventListener("click", function() {

  if (!running || nitro) return;

  nitro = true;

  bike.classList.add("nitro");

  speed += 8;

  clearTimeout(nitroTimer);

  nitroTimer = setTimeout(function() {

    speed -= 8;

    nitro = false;

    bike.classList.remove("nitro");

  }, 3000);

});


/* Main game */

function gameLoop() {

  if (!running) return;

  const currentSpeed = speed;

  /* Cars */

  carData.forEach(function(data) {

    data.y += currentSpeed;

    data.element.style.top =
      data.y + "px";

    if (data.y > window.innerHeight) {

      score++;

      resetCar(data);

    }

    if (collision(bike, data.element)) {

      crash(data);

      resetCar(data);

    }

  });


  /* Coins */

  coinData.forEach(function(data) {

    data.y += currentSpeed;

    data.element.style.top =
      data.y + "px";

    if (data.y > window.innerHeight) {

      resetCoin(data);

    }

    if (collision(bike, data.element)) {

      collectCoin(data);

    }

  });


  /* Difficulty */

  if (!nitro) {

    speed = Math.min(
      11,
      5 + score / 35
    );

  }


  speedText.textContent =
    Math.max(1, Math.floor(speed - 3));


  scoreText.textContent =
    score;


  requestAnimationFrame(gameLoop);

}


/* Score */

setInterval(function() {

  if (!running) return;

  score++;

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

  finalScore.textContent = score;
  finalCoins.textContent = coinScore;
  finalBest.textContent = best;

  bestText.textContent = best;

  gameOver.style.display = "block";

}


/* Restart */

restartButton.addEventListener("click", function() {

  score = 0;
  coinScore = 0;
  lives = 3;

  speed = 5;
  nitro = false;

  lane = 1;
  running = true;

  scoreText.textContent = "0";
  coinsText.textContent = "0";
  livesText.textContent = "3";
  speedText.textContent = "1";

  gameOver.style.display = "none";

  bike.classList.remove("nitro");

  updateBike();

  carData.forEach(function(data, index) {
    resetCar(data, index * 180);
  });

  coinData.forEach(function(data) {
    resetCoin(data);
  });

  requestAnimationFrame(gameLoop);

});


/* Start */

updateBike();

carData.forEach(function(data, index) {
  resetCar(data, index * 180);
});

coinData.forEach(function(data) {
  resetCoin(data);
});

requestAnimationFrame(gameLoop);
