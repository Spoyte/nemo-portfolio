export interface FlowingMagnetismParams {
  particleCount: number;
  fieldStrength: number;
  colorScheme: 'aurora' | 'plasma' | 'embers' | 'ocean';
  trailLength: number;
  speed: number;
}

export const flowingMagnetismDefaultParams: FlowingMagnetismParams = {
  particleCount: 800,
  fieldStrength: 50,
  colorScheme: 'aurora',
  trailLength: 40,
  speed: 30,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
}

interface Magnet {
  x: number;
  y: number;
  polarity: number; // +1 or -1
}

function createParticle(width: number, height: number, hueBase: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * Math.min(width, height) * 0.45;
  return {
    x: width / 2 + Math.cos(angle) * radius,
    y: height / 2 + Math.sin(angle) * radius,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 100 + Math.random() * 150,
    hue: hueBase + (Math.random() - 0.5) * 40,
  };
}

function getFieldVector(
  x: number,
  y: number,
  magnets: Magnet[],
  strength: number
): { dx: number; dy: number } {
  let fx = 0;
  let fy = 0;

  for (const magnet of magnets) {
    const dx = x - magnet.x;
    const dy = y - magnet.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);
    
    if (dist < 5) continue; // Avoid singularity
    
    // Magnetic field falls off with 1/r^2
    const force = (strength * magnet.polarity) / (distSq + 100);
    
    // Perpendicular force for magnetic field lines (rotate 90 degrees)
    fx += (-dy / dist) * force;
    fy += (dx / dist) * force;
  }

  return { dx: fx, dy: fy };
}

export function renderFlowingMagnetism(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: FlowingMagnetismParams
): void {
  const { particleCount, fieldStrength, colorScheme, trailLength, speed } = params;
  const t = time * speed * 0.001;

  // Color schemes
  const palettes: Record<string, { hueBase: number; hueRange: number; saturation: number; lightness: number }> = {
    aurora: { hueBase: 160, hueRange: 80, saturation: 80, lightness: 60 },
    plasma: { hueBase: 280, hueRange: 60, saturation: 90, lightness: 55 },
    embers: { hueBase: 20, hueRange: 40, saturation: 100, lightness: 55 },
    ocean: { hueBase: 200, hueRange: 40, saturation: 70, lightness: 50 },
  };

  const palette = palettes[colorScheme];

  // Initialize or retrieve persistent state
  const canvas = ctx.canvas as HTMLCanvasElement & { 
    _particles?: Particle[];
    _magnets?: Magnet[];
    _trailCanvas?: HTMLCanvasElement;
  };

  if (!canvas._particles) {
    canvas._particles = [];
    for (let i = 0; i < particleCount; i++) {
      canvas._particles.push(createParticle(width, height, palette.hueBase));
    }
  }

  if (!canvas._magnets) {
    // Create rotating dipole configuration
    const radius = Math.min(width, height) * 0.2;
    canvas._magnets = [
      { x: width / 2 - radius, y: height / 2, polarity: 1 },
      { x: width / 2 + radius, y: height / 2, polarity: -1 },
    ];
  }

  // Update magnet positions (gentle rotation)
  const magnetRadius = Math.min(width, height) * 0.2;
  const rotationSpeed = 0.3;
  canvas._magnets[0].x = width / 2 + Math.cos(t * rotationSpeed) * magnetRadius;
  canvas._magnets[0].y = height / 2 + Math.sin(t * rotationSpeed) * magnetRadius * 0.5;
  canvas._magnets[1].x = width / 2 + Math.cos(t * rotationSpeed + Math.PI) * magnetRadius;
  canvas._magnets[1].y = height / 2 + Math.sin(t * rotationSpeed + Math.PI) * magnetRadius * 0.5;

  // Create trail canvas for persistence
  if (!canvas._trailCanvas) {
    canvas._trailCanvas = document.createElement('canvas');
    canvas._trailCanvas.width = width;
    canvas._trailCanvas.height = height;
    const trailCtx = canvas._trailCanvas.getContext('2d');
    if (trailCtx) {
      trailCtx.fillStyle = '#050508';
      trailCtx.fillRect(0, 0, width, height);
    }
  }

  const trailCtx = canvas._trailCanvas.getContext('2d');
  if (!trailCtx) return;

  // Fade the trail slightly
  trailCtx.fillStyle = `rgba(5, 5, 8, ${1 / trailLength})`;
  trailCtx.fillRect(0, 0, width, height);

  // Update and draw particles
  const particles = canvas._particles;
  const magnets = canvas._magnets;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Get magnetic field vector at particle position
    const field = getFieldVector(p.x, p.y, magnets, fieldStrength * 0.5);
    
    // Add some curl noise for organic flow
    const noiseScale = 0.003;
    const nx = Math.sin(p.y * noiseScale + t * 0.5) * Math.cos(p.x * noiseScale);
    const ny = Math.cos(p.x * noiseScale + t * 0.3) * Math.sin(p.y * noiseScale);
    
    // Blend field with noise
    p.vx += field.dx * 0.1 + nx * 0.5;
    p.vy += field.dy * 0.1 + ny * 0.5;
    
    // Damping
    p.vx *= 0.95;
    p.vy *= 0.95;
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.life++;

    // Draw particle
    const lifeRatio = p.life / p.maxLife;
    const alpha = Math.sin(lifeRatio * Math.PI); // Fade in and out
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    const hueShift = speed * 10;
    
    const hue = (p.hue + hueShift + t * 10) % 360;
    const saturation = palette.saturation;
    const lightness = palette.lightness + speed * 5;

    trailCtx.beginPath();
    trailCtx.arc(p.x, p.y, 1 + speed * 0.3, 0, Math.PI * 2);
    trailCtx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.6})`;
    trailCtx.fill();

    // Reset particle if dead or out of bounds
    if (p.life >= p.maxLife || 
        p.x < -50 || p.x > width + 50 || 
        p.y < -50 || p.y > height + 50) {
      particles[i] = createParticle(width, height, palette.hueBase);
      // Start near a magnet for better field line tracing
      const magnet = magnets[Math.floor(Math.random() * magnets.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 30;
      particles[i].x = magnet.x + Math.cos(angle) * dist;
      particles[i].y = magnet.y + Math.sin(angle) * dist;
    }
  }

  // Draw magnets
  for (const magnet of magnets) {
    const color = magnet.polarity > 0 ? '#ff4444' : '#4444ff';
    
    // Glow
    const gradient = trailCtx.createRadialGradient(
      magnet.x, magnet.y, 0,
      magnet.x, magnet.y, 20
    );
    gradient.addColorStop(0, color + '88');
    gradient.addColorStop(1, color + '00');
    trailCtx.fillStyle = gradient;
    trailCtx.beginPath();
    trailCtx.arc(magnet.x, magnet.y, 20, 0, Math.PI * 2);
    trailCtx.fill();
    
    // Core
    trailCtx.fillStyle = color;
    trailCtx.beginPath();
    trailCtx.arc(magnet.x, magnet.y, 4, 0, Math.PI * 2);
    trailCtx.fill();
  }

  // Copy trail to main canvas
  ctx.drawImage(canvas._trailCanvas, 0, 0);
}
