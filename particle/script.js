const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gridSize = 10;
let gridColor = '#FFFFFF';
let particleSize = 3;
let particles = [];
let gridPoints = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateGridPoints();
}

function handleMouseDown(event) {
  const particle = {
    x: event.clientX,
    y: event.clientY,
    radius: 1, // Start with a small initial radius
    isClicked: true, // Flag to indicate if the particle is clicked
  };
  particles.push(particle);
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
  particles.forEach(particle => {
    if (particle.isClicked) {
      particle.radius += 0.5; // Increase the radius
    }
    applyGravitationalBending(particle);
  });
}

function applyGravitationalBending(particle) {
  gridPoints.forEach(gridPoint => {
    const dx = particle.x - gridPoint.x;
    const dy = particle.y - gridPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      const area = Math.PI * particle.radius * particle.radius; // Calculate the area based on the radius
      const force = area / (distance * distance);
      const displacement = {
        x: force * (dx / distance),
        y: force * (dy / distance),
      };
      gridPoint.x += displacement.x;
      gridPoint.y += displacement.y;
    }
  });
}

function drawGrid() {
  ctx.fillStyle = gridColor;

  gridPoints.forEach(gridPoint => {
    ctx.beginPath();
    ctx.arc(gridPoint.x, gridPoint.y, 1, 0, 2 * Math.PI);
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

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateParticles();
  drawGrid();
  drawParticles();

  requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);

resizeCanvas();
animate();
