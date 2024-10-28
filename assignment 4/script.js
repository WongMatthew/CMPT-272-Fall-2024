const cannon = document.getElementById("cannon");
const turret = document.getElementById("turret");
const wheel = document.getElementById("wheel");
const cannonBall = document.getElementById("cannonball");
const speedSlider = document.querySelector("#slider input");
const shotSound = document.getElementById("shotSound");

let cannonPosition = 0;
let turretAngle = 0;
let wheelRotation = 0;
let movementSpeed = parseInt(speedSlider.value); // initial slider speed
let cannonballFlying = false;

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

  // starting position of cannonball
  let x = xStart;
  let y = yStart - 20;
  const speed = 10;

  cannonball.style.left = `${x}px`;
  cannonball.style.top = `${y}px`;
  cannonball.style.display = "block";
  cannonballFlying = true;

  // Move the cannonball in the direction of the turret's angle
  const interval = setInterval(() => {
    x += Math.cos(angleInRadians) * speed;
    y -= Math.sin(angleInRadians) * speed; // Subtract Y since upward movement decreases Y

    // check if ball is off screen
    if (x > window.innerWidth || y < 0 || y > window.innerHeight) {
      clearInterval(interval); // Stop the movement
      cannonballFlying = false;
      cannonball.style.display = "none"; // Hide the cannonball

      // Stop and reset the shot sound
      shotSound.pause();
      shotSound.currentTime = 0;
    } else {
      // Update the cannonball's position while it's still on screen
      cannonball.style.left = `${x}px`;
      cannonball.style.top = `${y}px`;
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
