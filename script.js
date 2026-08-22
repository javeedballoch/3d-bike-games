const bike = document.getElementById("bike");

const cars = [
  document.getElementById("car1"),
  document.getElementById("car2"),
  document.getElementById("car3")
];

const coinElements = [
  document.querySelector(".coin1"),
  document.querySelector(".coin2"),
  document.querySelector(".coin3")
];

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const coinsElement = document.getElementById("coins");
const bestElement = document.getElementById("best");
const speedElement = document.getElementById("speedValue");

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
let lives = 3;
let coinCount = 0;

let speed = 4;

let running = true;
let nitroActive = false;

let best =
  Number(localStorage.getItem("streetBikeBest")) || 0;

bestElement.textContent = best;


/* LANE */

function laneX(number) {

  if (number === 0) return 16.66;
  if (number === 1) return 50;
  return 83.33;

}


/* BIKE */

function updateBike() {

  bike.style.left =
    laneX(lane) + "%";

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


/* BUTTONS */

leftButton.addEventListener(
  "touchstart",
  function(e) {
    e.preventDefault();
    moveLeft();
  }
);

rightButton.addEventListener(
  "touchstart",
  function(e) {
    e.preventDefault();
    moveRight();
  }
);

leftButton.addEventListener(
  "click",
  moveLeft
);

rightButton.addEventListener(
  "click",
  moveRight
);


/* KEYBOARD */

document.addEventListener(
  "keydown",
  function(e) {

    if (e.key === "ArrowLeft") {
      moveLeft();
    }

    if (e.key === "ArrowRight") {
      moveRight();
    }

  }
);


/* SWIPE */

let touchStartX = 0;

document.addEventListener(
  "touchstart",
  function(e) {

    touchStartX =
      e.touches[0].clientX;

  },
  { passive: true }
);


document.addEventListener(
  "touchend",
  function(e) {

    const endX =
      e.changedTouches[0].clientX;

    const difference =
      endX - touchStartX;

    if (Math.abs(difference) < 40) {
      return;
    }

    if (difference > 0) {
      moveRight();
    } else {
      moveLeft();
    }

  },
  { passive: true }
);


/* OBJECT DATA */

let carData = cars.map(
  function(car, index) {

    return {
      element: car,
      lane: index,
      y: -250 - index * 280
    };

  }
);


let coinData = coinElements.map(
  function(coin, index) {

    return {
      element: coin,
      lane: index,
      y: -400 - index * 350
    };

  }
);


/* RANDOM LANE */

function randomLane() {

  return Math.floor(
    Math.random() * 3
  );

}


/* RESET CAR */

function resetCar(data) {

  data.lane =
    randomLane();

  data.y =
    -180 -
    Math.random() * 500;

  data.element.style.left =
    laneX(data.lane) + "%";

  data.element.style.top =
    data.y + "px";

}


/* RESET COIN */

function resetCoin(data) {

  data.lane =
    randomLane();

  data.y =
    -250 -
    Math.random() * 650;

  data.element.style.left =
    laneX(data.lane) + "%";

  data.element.style.top =
    data.y + "px";

}


/* COLLISION */

function collision(a, b) {

  const A =
    a.getBoundingClientRect();

  const B =
    b.getBoundingClientRect();

  return (
    A.left + 12 < B.right - 12 &&
    A.right - 12 > B.left + 12 &&
    A.top + 12 < B.bottom - 12 &&
    A.bottom - 12 > B.top + 12
  );

}


/* CRASH */

function crash(data) {

  lives--;

  livesElement.textContent =
    lives;

  data.y = -250;

  data.element.style.top =
    "-250px";

  bike.style.transform =
    "translateX(-50%) rotate(12deg)";

  if (navigator.vibrate) {
    navigator.vibrate(250);
  }

  setTimeout(
    function() {

      bike.style.transform =
        "translateX(-50%) rotate(0deg)";

    },
    250
  );

  if (lives <= 0) {
    endGame();
  }

}


/* COIN */

function collectCoin(data) {

  coinCount++;

  score += 5;

  coinsElement.textContent =
    coinCount;

  resetCoin(data);

  if (navigator.vibrate) {
    navigator.vibrate(70);
  }

}


/* NITRO */

let nitroTimer;

nitroButton.addEventListener(
  "click",
  function() {

    if (!running || nitroActive) {
      return;
    }

    nitroActive = true;

    bike.classList.add("nitro");

    speed += 7;

    clearTimeout(nitroTimer);

    nitroTimer =
      setTimeout(
        function() {

          speed -= 7;

          nitroActive = false;

          bike.classList.remove(
            "nitro"
          );

        },
        3000
      );

  }
);


/* GAME LOOP */

function gameLoop() {

  if (!running) {
    return;
  }

  /* Cars */

  carData.forEach(
    function(data) {

      data.y += speed;

      data.element.style.top =
        data.y + "px";

      if (
        data.y >
        window.innerHeight + 100
      ) {

        score++;

        resetCar(data);

      }

      if (
        collision(
          bike,
          data.element
        )
      ) {

        crash(data);

        resetCar(data);

      }

    }
  );


  /* Coins */

  coinData.forEach(
    function(data) {

      data.y += speed;

      data.element.style.top =
        data.y + "px";

      if (
        data.y >
        window.innerHeight + 100
      ) {

        resetCoin(data);

      }

      if (
        collision(
          bike,
          data.element
        )
      ) {

        collectCoin(data);

      }

    }
  );


  /* Difficulty */

  if (!nitroActive) {

    speed =
      Math.min(
        10,
        4 + score / 40
      );

  }

  speedElement.textContent =
    Math.max(
      1,
      Math.floor(speed / 2)
    );

  scoreElement.textContent =
    score;

  requestAnimationFrame(
    gameLoop
  );

}


/* SCORE TIMER */

setInterval(
  function() {

    if (!running) {
      return;
    }

    score++;

  },
  1000
);


/* GAME OVER */

function endGame() {

  running = false;

  if (score > best) {

    best = score;

    localStorage.setItem(
      "streetBikeBest",
      best
    );

  }

  finalScore.textContent =
    score;

  finalCoins.textContent =
    coinCount;

  finalBest.textContent =
    best;

  bestElement.textContent =
    best;

  gameOver.style.display =
    "block";

}


/* RESTART */

restartButton.addEventListener(
  "click",
  function() {

    score = 0;
    lives = 3;
    coinCount = 0;

    speed = 4;

    lane = 1;

    running = true;
    nitroActive = false;

    scoreElement.textContent =
      "0";

    livesElement.textContent =
      "3";

    coinsElement.textContent =
      "0";

    speedElement.textContent =
      "2";

    gameOver.style.display =
      "none";

    bike.classList.remove(
      "nitro"
    );

    updateBike();

    carData.forEach(
      function(data, index) {

        data.y =
          -200 -
          index * 350;

        resetCar(data);

      }
    );

    coinData.forEach(
      function(data) {

        resetCoin(data);

      }
    );

    requestAnimationFrame(
      gameLoop
    );

  }
);


/* START */

updateBike();

carData.forEach(
  function(data, index) {

    data.y =
      -250 -
      index * 300;

    resetCar(data);

  }
);

coinData.forEach(
  function(data, index) {

    data.y =
      -350 -
      index * 400;

    resetCoin(data);

  }
);

requestAnimationFrame(
  gameLoop
);
