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

  // Rotate the wheel based on movement direction
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
  if (cannonballFlying) return; // Prevent multiple cannonballs in flight

  shotSound.play(); // Play the shot sound

  // Get the turret's dimensions and position
  const turretRect = turret.getBoundingClientRect();
  const cannonRect = cannon.getBoundingClientRect(); // For cannon's base offset
  const turretLength = turretRect.width; // Length of the turret image

  // Calculate the angle in radians (for trigonometric functions)
  const angleInRadians = (turretAngle * Math.PI) / 180;

  // Calculate the cannonball's initial position at the tip of the turret
  const xStart = turretRect.left + Math.cos(angleInRadians) * turretLength;

  const yStart =
    turretRect.top +
    Math.sin(angleInRadians) * turretLength +
    turretRect.height / 2;

  // Set the initial position of the cannonball
  let x = xStart;
  let y = yStart;
  const speed = 10; // Cannonball speed

  // Display the cannonball at the starting position
  cannonball.style.left = `${x}px`;
  cannonball.style.top = `${y}px`;
  cannonball.style.display = "block";
  cannonballFlying = true;

  // Move the cannonball in the direction of the turret's angle
  const interval = setInterval(() => {
    x += Math.cos(angleInRadians) * speed;
    y += Math.sin(angleInRadians) * speed; // Y increases as it moves down

    // Check if the cannonball is off the screen
    if (x > window.innerWidth || y < 0 || y > window.innerHeight) {
      clearInterval(interval);
      cannonballFlying = false;
      cannonball.style.display = "none";
      shotSound.pause();
      shotSound.currentTime = 0;
    } else {
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
