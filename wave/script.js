const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gridSize = 10;
let mousePos = { x: 0, y: 0 };
let isMouseDown = false;
let waves = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function handleMouseMove(event) {
  event.preventDefault();
  mousePos.x = event.clientX
  mousePos.y = event.clientY
}

function handleMouseDown() {
  isMouseDown = true;
  createWave();
}

function handleMouseUp() {
  isMouseDown = false;
}

function createWave() {
  const wave = {
    startX: mousePos.x,
    startY: mousePos.y,
    radius: 0,
    propagationSpeed: Math.PI
  };
  waves.push(wave);
}

function drawGrid() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      const displacement = calculateDisplacement(x, y);
      const newX = x + displacement.x;
      const newY = y + displacement.y;
      ctx.beginPath();
      ctx.arc(newX, newY, 1.2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

function calculateDisplacement(x, y) {
  let totalDisplacement = { x: 0, y: 0 };

  waves.forEach(wave => {
    const dx = x - wave.startX;
    const dy = y - wave.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = wave.radius + gridSize;
    if (distance <= maxRadius) {
      const displacement = Math.PI * gridSize * Math.sin((distance / maxRadius) * Math.PI);
      totalDisplacement.x += displacement * (dx / distance);
      totalDisplacement.y += displacement * (dy / distance);
    }
  });

  return totalDisplacement;
}

function drawWave() {
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;

  waves.forEach((wave, index) => {
    if (wave.radius >= wave.maxRadius || wave.opacity <= 0) {
      waves.splice(index, 1);
    } else {
      wave.radius += wave.propagationSpeed;
      wave.propagationSpeed *= 0.99999; // Gradually decrease propagation speed
      wave.opacity -= 0.00001; // Gradually decrease opacity
    }
  });
}


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawWave();

  requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);

resizeCanvas();
animate();
