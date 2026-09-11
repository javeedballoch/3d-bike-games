const bike = document.getElementById("bike");
const objects = document.getElementById("objects");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const coinsEl = document.getElementById("coinCount");
const bestEl = document.getElementById("best");

const speedEl = document.getElementById("speedValue");

const gameOver = document.getElementById("gameOver");

const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const nitroBtn = document.getElementById("nitro");

let lane = 1;

let score = 0;
let lives = 3;
let coins = 0;

let running = true;
let nitroOn = false;

let speed = 4;

let best =
  Number(localStorage.getItem("streetBikeBest")) || 0;

bestEl.textContent = best;


/* THREE LANES */

const lanes = [16.66, 50, 83.33];


/* MOVE BIKE */

function updateBike() {

  bike.style.left = lanes[lane] + "%";

}


/* LEFT */

function moveLeft() {

  if (!running) return;

  if (lane > 0) {

    lane--;

    updateBike();

  }

}


/* RIGHT */

function moveRight() {

  if (!running) return;

  if (lane < 2) {

    lane++;

    updateBike();

  }

}


/* BUTTONS */

leftBtn.addEventListener("click", moveLeft);

rightBtn.addEventListener("click", moveRight);


/* KEYBOARD */

document.addEventListener("keydown", function(event) {

  if (event.key === "ArrowLeft") {
    moveLeft();
  }

  if (event.key === "ArrowRight") {
    moveRight();
  }

});


/* MOBILE SWIPE */

let touchStartX = 0;

document.addEventListener(
  "touchstart",
  function(event) {

    touchStartX =
      event.touches[0].clientX;

  },
  { passive: true }
);


document.addEventListener(
  "touchend",
  function(event) {

    const touchEndX =
      event.changedTouches[0].clientX;

    const difference =
      touchEndX - touchStartX;

    if (Math.abs(difference) > 40) {

      if (difference > 0) {
        moveRight();
      } else {
        moveLeft();
      }

    }

  },
  { passive: true }
);


/* TREES */

function createTrees() {

  for (let i = 0; i < 16; i++) {

    const tree =
      document.createElement("div");

    tree.className = "tree";

    tree.textContent =
      i % 2 === 0 ? "🌳" : "🌲";

    const side =
      i % 2 === 0 ? -1 : 1;

    const distance =
      38 + (i % 4) * 2;

    tree.style.left =
      `calc(50% ${side > 0 ? "+" : "-"} ${distance}vw)`;

    tree.style.top =
      (-100 + i * 70) + "px";

    tree.style.animationDelay =
      (-i * 0.15) + "s";

    document
      .getElementById("world")
      .appendChild(tree);

  }

}

createTrees();


/* GAME OBJECTS */

const items = [];


/* CREATE ENEMY */

function createEnemy(number) {

  const enemy =
    document.createElement("div");

  enemy.className =
    "enemy " +
    ["", "blue", "yellow"][number % 3];

  enemy.innerHTML = `
    <div class="window"></div>

    <div class="hl a"></div>
    <div class="hl b"></div>
  `;

  objects.appendChild(enemy);

  items.push({

    element: enemy,

    type: "car",

    lane:
      Math.floor(Math.random() * 3),

    y:
      -200 - number * 280

  });

}


/* CREATE COIN */

function createCoin(number) {

  const coin =
    document.createElement("div");

  coin.className = "coin";

  coin.textContent = "🪙";

  objects.appendChild(coin);

  items.push({

    element: coin,

    type: "coin",

    lane:
      Math.floor(Math.random() * 3),

    y:
      -350 - number * 350

  });

}


/* CREATE OBJECTS */

for (let i = 0; i < 4; i++) {

  createEnemy(i);

}

for (let i = 0; i < 4; i++) {

  createCoin(i);

}


/* RESET OBJECT */

function resetObject(object) {

  object.lane =
    Math.floor(Math.random() * 3);

  object.y =
    -200 -
    Math.random() * 600;

}


/* COLLISION */

function collision(element1, element2) {

  const a =
    element1.getBoundingClientRect();

  const b =
    element2.getBoundingClientRect();

  return (

    a.left + 10 < b.right - 8 &&

    a.right - 10 > b.left + 8 &&

    a.top + 10 < b.bottom - 8 &&

    a.bottom - 10 > b.top + 8

  );

}


/* CRASH */

function crash(object) {

  lives--;

  livesEl.textContent = lives;

  resetObject(object);

  bike.style.transform =
    "translateX(-50%) rotate(12deg)";

  setTimeout(function() {

    bike.style.transform =
      "translateX(-50%)";

  }, 200);

  if (navigator.vibrate) {

    navigator.vibrate(200);

  }

  if (lives <= 0) {

    endGame();

  }

}


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

  document.getElementById(
    "finalScore"
  ).textContent = score;

  document.getElementById(
    "finalCoins"
  ).textContent = coins;

  document.getElementById(
    "finalBest"
  ).textContent = best;

  gameOver.style.display = "block";

}


/* GAME LOOP */

function gameLoop() {

  if (!running) return;

  let currentSpeed =
    speed +
    (nitroOn ? 7 : Math.min(7, score / 40));

  speedEl.textContent =
    Math.max(2, Math.floor(currentSpeed / 2));


  items.forEach(function(object) {

    object.y += currentSpeed;

    object.element.style.top =
      object.y + "px";

    object.element.style.left =
      lanes[object.lane] + "%";


    /* OBJECT PASSED */

    if (object.y > window.innerHeight + 150) {

      if (object.type === "car") {

        score++;

      }

      resetObject(object);

    }


    /* COLLISION */

    if (
      collision(
        bike,
        object.element
      )
    ) {

      if (object.type === "car") {

        crash(object);

      }

      else {

        coins++;

        score += 5;

        coinsEl.textContent =
          coins;

        resetObject(object);

        if (navigator.vibrate) {

          navigator.vibrate(60);

        }

      }

    }

  });


  scoreEl.textContent =
    score;

  requestAnimationFrame(gameLoop);

}


/* TIME SCORE */

setInterval(function() {

  if (running) {

    score++;

  }

}, 1000);


/* NITRO */

nitroBtn.addEventListener(
  "click",
  function() {

    if (!running || nitroOn) {
      return;
    }

    nitroOn = true;

    bike.style.filter =
      "drop-shadow(0 0 12px orange)";

    setTimeout(function() {

      nitroOn = false;

      bike.style.filter = "";

    }, 3000);

  }
);


/* RESTART */

document
  .getElementById("restart")
  .addEventListener("click", function() {

    location.reload();

  });


/* START */

updateBike();

requestAnimationFrame(gameLoop);
