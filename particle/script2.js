const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gridSize = 8; // Size of the grid cells
const particleRadius = 10; // Radius of the particle
const gravitationalConstant = 1000; // Strength of gravity

let particles = []; // Array to hold the particles (objects)

// Function to calculate the gravitational displacement for each grid point
function calculateDisplacement(x, y) {
  let totalDisplacement = { x: 0, y: 0 };

  particles.forEach(particle => {
    const dx = x - particle.x;
    const dy = y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const force = calculateGravitationalForce(particle.mass, distance);
      const displacement = {
        x: (force * dx) / distance,
        y: (force * dy) / distance,
      };
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
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  for (let x = 0; x <= canvas.width; x += gridSize) {
    for (let y = 0; y <= canvas.height; y += gridSize) {
      const displacement = calculateDisplacement(x, y);
      const newX = x + displacement.x;
      const newY = y + displacement.y;

      ctx.beginPath();
      ctx.arc(newX, newY, 1.5, 0, 2 * Math.PI);
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

// Function to update the positions of particles
function updateParticles() {
  // Update the positions of particles here
  // You can add multiple particles with different masses and initial positions
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

// Initialize the canvas size
resizeCanvas();

// Create a particle with initial position and mass
particles.push({
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: particleRadius,
  mass: Math.PI * particleRadius * particleRadius,
});

// Start the animation
animate();
