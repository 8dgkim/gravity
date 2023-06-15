const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gridSize = 10;
let gridColor = '#FFFFFF';
let particleSize = 3;
let particles = [];
let gridPoints = [];
let waves = [];

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
    mass: 1,
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
      particle.mass = Math.PI * particle.radius * particle.radius; // Update the mass based on the radius
    }
    applyGravitationalBending(particle);
  });
  handleParticleCollisions();
}

function applyGravitationalBending(particle) {
  const gravitationalConstant = 0.1; // Adjust this value to control the strength of gravity

  // Apply gravitational attraction between particles
  particles.forEach(otherParticle => {
    if (particle !== otherParticle) {
      const dx = otherParticle.x - particle.x;
      const dy = otherParticle.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 0) {
        const gravitationalForce = gravitationalConstant * (particle.mass * otherParticle.mass) / (distance * distance);
        const forceRatio = otherParticle.mass / (particle.mass + otherParticle.mass); // Updated force ratio
        const displacement = {
          x: forceRatio * (gravitationalForce * (dx / distance)),
          y: forceRatio * (gravitationalForce * (dy / distance)),
        };
        particle.x += displacement.x;
        particle.y += displacement.y;
      }
    }
  });

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

function createWave() {
  const wave = {
    startX: wavePos.x,
    startY: wavePos.y,
    radius: 0,
    propagationSpeed: Math.PI,
    // opacity: 1,
  };
  waves.push(wave);
}

// function handleParticleCollisions() {
//   const mergedParticles = new Set(); // Set to store merged particles

//   particles.forEach((particle, index) => {
//     particles.forEach((otherParticle, otherIndex) => {
//       if (index !== otherIndex && particle.radius > 0 && otherParticle.radius > 0 && !mergedParticles.has(particle) && !mergedParticles.has(otherParticle)) {
//         const dx = otherParticle.x - particle.x;
//         const dy = otherParticle.y - particle.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);
//         if (distance <= particle.radius + otherParticle.radius) {
//           mergeParticles(particle, otherParticle);
//           mergedParticles.add(particle);
//           mergedParticles.add(otherParticle);
//         }
//       }
//     });
//   });
// }
function handleParticleCollisions() {
    for (let i = 0; i < particles.length; i++) {
        const particle1 = particles[i];
        
        for (let j = i + 1; j < particles.length; j++) {
            const particle2 = particles[j];
            
            const dx = particle2.x - particle1.x;
            const dy = particle2.y - particle1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= particle1.radius + particle2.radius) {
                wavePos = mergeParticles(particle1, particle2);
                createWave(wavePos);
            }
        }
    }
}

function mergeParticles(particle1, particle2) {
    const mergedMass = particle1.mass + particle2.mass;
    const mergedRadius = Math.sqrt(mergedMass / Math.PI);
    
  particle1.x = (particle1.x * particle1.mass + particle2.x * particle2.mass) / mergedMass;
  particle1.y = (particle1.y * particle1.mass + particle2.y * particle2.mass) / mergedMass;
  particle1.radius = mergedRadius;
  particle1.mass = mergedMass;
  
  particles.splice(particles.indexOf(particle2), 1); // Remove particle2 from the particles array

  return particle1.x, particle1.y
}

function handleGridPointCollisions() {
  particles.forEach(particle => {
    gridPoints.forEach(gridPoint => {
      const dx = gridPoint.x - particle.x;
      const dy = gridPoint.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= particle.radius) {
        // Handle collision between particle and grid point
        gridPoints.splice(gridPoints.indexOf(gridPoint), 1);
      }
    });
  });
}

// function drawGrid() {
//   ctx.fillStyle = gridColor;

//   gridPoints.forEach(gridPoint => {
//     ctx.beginPath();
//     ctx.arc(gridPoint.x, gridPoint.y, 1, 0, 2 * Math.PI);
//     ctx.fill();
//   });
// }
function drawGrid() {
  ctx.fillStyle = gridColor;

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

function drawParticles() {
  particles.forEach(particle => {
    const particleRadius = particleSize + particle.radius; // Adjust particle size based on the radius
    ctx.fillStyle = '#FFFFFF'; // Set particle color
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particleRadius, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function drawWaves() {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;

  waves.forEach((wave, index) => {
    if (wave.radius >= wave.maxRadius || wave.opacity <= 0) {
      waves.splice(index, 1);
    } else {
      wave.radius += wave.propagationSpeed;
      wave.propagationSpeed *= 0.99999; // Gradually decrease propagation speed
      wave.opacity -= 0.00001; // Gradually decrease opacity

      ctx.globalAlpha = wave.opacity;
      ctx.beginPath();
      ctx.arc(wave.startX, wave.startY, wave.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  });

  ctx.globalAlpha = 1; // Reset global alpha
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
