const bike = document.getElementById("bike");
const road = document.getElementById("road");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const scoreText = document.getElementById("score");

let bikeX = 50;
let score = 0;
let speed = 0.5;

// Bike ko left le jana
function moveLeft() {
  bikeX -= 5;

  if (bikeX < 8) {
    bikeX = 8;
  }

  bike.style.left = bikeX + "%";
}

// Bike ko right le jana
function moveRight() {
  bikeX += 5;

  if (bikeX > 92) {
    bikeX = 92;
  }

  bike.style.left = bikeX + "%";
}

// Mobile buttons
leftButton.addEventListener("touchstart", function(e) {
  e.preventDefault();
  moveLeft();
});

rightButton.addEventListener("touchstart", function(e) {
  e.preventDefault();
  moveRight();
});

// Mouse buttons bhi kaam karenge
leftButton.addEventListener("click", moveLeft);
rightButton.addEventListener("click", moveRight);

// Keyboard controls
document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowLeft") {
    moveLeft();
  }

  if (e.key === "ArrowRight") {
    moveRight();
  }
});

// Score
setInterval(function() {
  score++;
  scoreText.textContent = "Score: " + score;
}, 1000);
