const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gravitationalConstant = 100; // Strength of gravity
let gridSize = 8;
let gridColor = '#FFFFFF';
let particleSize = 3;
let particles = []; // Array to hold the particles (objects)
let gridPoints = [];
let waves = [];

function handleMouseDown(event) {
  const particle = {
    x: event.clientX,
    y: event.clientY,
    radius: 1, // Start with a small initial radius
    mass: 1,
    isClicked: true, // Flag to indicate if the particle is clicked
  };
  particles.push(particle);
  gridPoints.push(particle);
}

function handleMouseUp() {
  particles.forEach(particle => {
    particle.isClicked = false; // Set the clicked flag to false
  });
}

function updateGridPoints() {
  gridPoints = [];
  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      gridPoints.push({ x, y });
    }
  }
}

function updateParticles() {
  const mergedParticles = [];

  particles.forEach(particle => {
    if (particle.isClicked) {
      particle.radius += 0.5; // Increase the radius
      particle.mass = Math.PI * particle.radius * particle.radius; // Update the mass based on the radius
    }
    if (!particle.isClicked) {
      const displacement = calculateDisplacement(particle.x, particle.y);
      particle.x += displacement.x;
      particle.y += displacement.y;
    }

    // Check for collision with other particles
    let isMerged = false;
    for (let i = 0; i < mergedParticles.length; i++) {
      const mergedParticle = mergedParticles[i];
      const dx = particle.x - mergedParticle.x;
      const dy = particle.y - mergedParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= particle.radius + mergedParticle.radius) {
        // Collision detected, merge particles
        mergedParticle.mass += particle.mass;
        mergedParticle.radius = Math.sqrt(mergedParticle.mass / Math.PI);
        isMerged = true;
        break;
      }
    }

    if (!isMerged) {
      mergedParticles.push(particle);
    }
  });

  particles = mergedParticles;
}

// Function to calculate the gravitational displacement for each grid point
function calculateDisplacement(x, y) {
  let totalDisplacement = { x: 0, y: 0 };

  particles.forEach(particle => {
    const dx = x - particle.x;
    const dy = y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const force = calculateGravitationalForce(particle.mass, distance);
      let displacement = {
        x: (force * dx) / distance,
        y: (force * dy) / distance,
      };

      // Limit displacement to not exceed the distance
      if (Math.abs(displacement.x) > Math.abs(dx)) {
        displacement.x = dx;
      }
      if (Math.abs(displacement.y) > Math.abs(dy)) {
        displacement.y = dy;
      }

      totalDisplacement.x -= displacement.x;
      totalDisplacement.y -= displacement.y;
    }
  });

  return totalDisplacement;
}

// Function to calculate the gravitational force between two objects
function calculateGravitationalForce(mass, distance) {
  return (gravitationalConstant * mass) / (distance * distance);
}

// Function to draw the spacetime grid with curvature
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the grid points with curvature
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  for (let x = 0; x <= canvas.width; x += gridSize) {
    for (let y = 0; y <= canvas.height; y += gridSize) {
      const displacement = calculateDisplacement(x, y);
      const newX = x + displacement.x;
      const newY = y + displacement.y;

      ctx.beginPath();
      ctx.arc(newX, newY, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  // Draw particles as circles
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function drawParticles() {
  particles.forEach(particle => {
    const particleRadius = particleSize + particle.radius; // Adjust particle size based on the radius
    ctx.fillStyle = '#FFFFFF'; // Set particle color
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particleRadius, 0, 2 * Math.PI);
    ctx.fill();
  });
}

// Function to animate the scene
function animate() {
  updateParticles();
  drawGrid();
  requestAnimationFrame(animate);  
}

// Resize the canvas to fill the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Event listener for window resize
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mouseup', handleMouseUp);
window.addEventListener('mousedown', handleMouseDown);

// Initialize the canvas size
resizeCanvas();

// Start the animation
animate();
