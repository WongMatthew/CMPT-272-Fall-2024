const cannon = document.getElementById("cannon");
const turret = document.getElementById("turret");
const wheel = document.getElementById("wheel");
const cannonBall = document.getElementById("cannonball");
const speedSlider = document.querySelector("#slider input");
const shotSound = document.getElementById("shotSound");
const balloon = document.getElementById("balloon");
const livesBoard = document.getElementById("livesBoard");
const scoreBoard = document.getElementById("scoreBoard");

let cannonPosition = 0;
let turretAngle = 0;
let wheelRotation = 0;
let movementSpeed = parseInt(speedSlider.value);
let cannonballFlying = false;
let balloonX = 0;
let balloonY = 0;
let balloonInterval;
let lives = 5;
let score = 0;

// change speed based on slider
speedSlider.addEventListener("input", () => {
  movementSpeed = parseInt(speedSlider.value);
});

// Find farthest right distance
function getMaxDistance() {
  return window.innerWidth - cannon.offsetWidth - 250;
}

// ROTATE WHEEL
function rotateWheel(step) {
  wheelRotation += step * 15; // Rotate 15 degrees each move
  wheel.style.transform = `rotate(${wheelRotation}deg)`;
}

// MOVE CANNON
function moveCannon(step) {
  cannonPosition += step * movementSpeed;

  // min. position (left)
  if (cannonPosition < 0) {
    cannonPosition = 0;
  }

  // max position (right)
  if (cannonPosition > getMaxDistance()) {
    cannonPosition = getMaxDistance();
  }

  // current position
  cannon.style.left = `${cannonPosition}px`;

  rotateWheel(step);
}

// MOVE TURRET (-20-35 degrees)
function rotateTurret(delta) {
  turretAngle += delta;
  if (turretAngle < -35) {
    turretAngle = -35;
  } else if (turretAngle > 20) {
    turretAngle = 20;
  }
  turret.style.transform = `rotate(${turretAngle}deg)`;
}

// SHOOT CANNONBALL
function shootCannonball() {
  if (cannonballFlying) return;

  // play sound and loop until ball exits screen
  shotSound.currentTime = 0;
  shotSound.play();

  // get turret position/size
  const turretRect = turret.getBoundingClientRect();

  // find current angle in radians
  const angleInRadians = (turretAngle * Math.PI) / -180;

  // find starting point in middle of turret image
  const xStart = turretRect.left + turretRect.width / 2;
  const yStart = turretRect.top + turretRect.height / 2;

  let x = xStart;
  let y = yStart - 20;
  const speed = 10;

  cannonball.style.left = `${x}px`;
  cannonball.style.top = `${y}px`;
  cannonball.style.display = "block";
  cannonballFlying = true;

  // moves cannonball based on angle
  const interval = setInterval(() => {
    x += Math.cos(angleInRadians) * speed;
    y -= Math.sin(angleInRadians) * speed;

    // get balloon hitbox position
    const balloonRect = balloon.getBoundingClientRect();

    // extra padding for hitbox
    const hitboxPadding = 20;
    const balloonHitbox = {
      left: balloonRect.left - hitboxPadding,
      right: balloonRect.right + hitboxPadding,
      top: balloonRect.top - hitboxPadding,
      bottom: balloonRect.bottom + hitboxPadding,
    };

    // check if balloon is hit
    if (
      x >= balloonHitbox.left &&
      x <= balloonHitbox.right &&
      y >= balloonHitbox.top &&
      y <= balloonHitbox.bottom
    ) {
      clearInterval(interval); // Stop the movement
      cannonballFlying = false;
      cannonBall.style.display = "none"; // Hide the cannonball

      // Stop and reset the shot sound
      shotSound.pause();
      shotSound.currentTime = 0;
      handleBalloonExplosion(false); // Balloon hit --> explodes
      return;
    }

    // check if ball is off screen
    if (x > window.innerWidth || y < 0 || y > window.innerHeight) {
      clearInterval(interval); // Stop the movement
      cannonballFlying = false;
      cannonBall.style.display = "none"; // Hide the cannonball

      // Stop and reset the shot sound
      shotSound.pause();
      shotSound.currentTime = 0;
    } else {
      // Update the cannonball's position while it's still on screen
      cannonBall.style.left = `${x}px`;
      cannonBall.style.top = `${y}px`;
    }
  }, 30);
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      moveCannon(-1); // move cannon left
      break;
    case "ArrowRight":
      moveCannon(1); // move cannon right
      break;
    case "ArrowDown":
      rotateTurret(1); // move turret down
      break;
    case "ArrowUp":
      rotateTurret(-1); // move turret up
      break;
    case " ":
      shootCannonball(); // shoot cannonball
      break;
  }
});

// move cannon when resizing window
window.addEventListener("resize", () => {
  if (cannonPosition > getMaxDistance()) {
    cannonPosition = getMaxDistance();
  }
  cannon.style.left = `${cannonPosition}px`;
});

// start dropping balloons
function startBalloon() {
  if (lives <= 0) return;

  // get cannon width
  const cannonWidth = cannon.offsetWidth + 250;

  // generate random position for balloon
  balloonX =
    Math.random() * (window.innerWidth - cannonWidth - 100) + cannonWidth;

  // reset balloon position
  balloonY = 0;

  // set balloon position
  balloon.style.left = `${balloonX}px`;
  balloon.style.top = `${balloonY}px`;
  balloon.style.display = "block";

  // move down by 2 pixels
  balloonInterval = setInterval(() => {
    balloonY += 2;
    balloon.style.top = `${balloonY}px`;

    // gets bottom position of balloon
    const balloonRect = balloon.getBoundingClientRect();
    const balloonBottom = balloonRect.bottom;

    // explode when bottom of balloon hits the ground
    if (balloonBottom >= window.innerHeight) {
      handleBalloonExplosion(true);
    }
  }, 10);
}

// stop balloon self explanator ylmao
function stopBalloon() {
  clearInterval(balloonInterval);
  balloon.style.display = "none";
}

// update lives and score
function updateBoard() {
  livesBoard.textContent = `Lives left: ${lives}`;
  scoreBoard.textContent = `Score: ${score}`;
}

// balloon explosion (updateBoard + explosion animation/sound)
function handleBalloonExplosion(isGroundHit) {
  stopBalloon();

  const explosionSound = new Audio("explosion.m4a");
  explosionSound.play();

  const explosion = document.createElement("img");
  explosion.src = "explosion.gif";
  explosion.style.position = "absolute";
  explosion.style.left = `${balloonX}px`;
  explosion.style.top = `${balloonY}px`;
  explosion.style.width = "250px";
  explosion.style.height = "250px";
  document.body.appendChild(explosion);

  setTimeout(() => explosion.remove(), 1000);

  if (isGroundHit) {
    lives--;
    if (lives <= 0) {
      livesBoard.textContent = "Game Over";
    } else {
      updateBoard(); // update lives
      startBalloon();
    }
  } else {
    score++;
    updateBoard(); // update score
    startBalloon();
  }
}

// start game
startBalloon();
