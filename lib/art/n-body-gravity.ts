export interface NBodyGravityParams {
  particleCount: number;
  gravityStrength: number;
  timeStep: number;
  softening: number;
  trailLength: number;
  colorScheme: 'nebula' | 'galaxy' | 'inferno' | 'ocean' | 'gold';
  initConfig: 'random' | 'disc' | 'cluster' | 'binary' | 'shell';
}

export const nBodyGravityDefaultParams: NBodyGravityParams = {
  particleCount: 400,
  gravityStrength: 0.5,
  timeStep: 0.5,
  softening: 5,
  trailLength: 30,
  colorScheme: 'nebula',
  initConfig: 'disc',
};

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  hue: number;
  trail: Array<{ x: number; y: number }>;
}

function createBodies(
  width: number,
  height: number,
  count: number,
  config: string
): Body[] {
  const bodies: Body[] = [];
  const centerX = width / 2;
  const centerY = height / 2;

  switch (config) {
    case 'disc':
      // Flattened disc like a spiral galaxy
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 150;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.3; // Flattened
        
        // Orbital velocity for stability
        const orbitalSpeed = Math.sqrt(200 / distance) * (0.8 + Math.random() * 0.4);
        const vx = -Math.sin(angle) * orbitalSpeed;
        const vy = Math.cos(angle) * orbitalSpeed * 0.3;
        
        bodies.push({
          x, y, vx, vy,
          mass: 0.5 + Math.random() * 1.5,
          hue: (angle * 180 / Math.PI + distance) % 360,
          trail: [],
        });
      }
      break;

    case 'cluster':
      // Dense central cluster
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        bodies.push({
          x, y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          mass: 0.5 + Math.random() * 2,
          hue: Math.random() * 360,
          trail: [],
        });
      }
      break;

    case 'binary':
      // Two orbiting clusters
      const offset = 100;
      for (let i = 0; i < count; i++) {
        const cluster = i < count / 2 ? -1 : 1;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50;
        const x = centerX + cluster * offset + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Initial orbital velocity around center
        const vx = -cluster * 1.5 + (Math.random() - 0.5);
        const vy = (Math.random() - 0.5);
        
        bodies.push({
          x, y, vx, vy,
          mass: 0.5 + Math.random() * 1.5,
          hue: cluster < 0 ? 200 + Math.random() * 60 : 340 + Math.random() * 40,
          trail: [],
        });
      }
      break;

    case 'shell':
      // Expanding shell
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 20;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Outward velocity
        const speed = 2 + Math.random();
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        bodies.push({
          x, y, vx, vy,
          mass: 0.5 + Math.random(),
          hue: (distance * 2) % 360,
          trail: [],
        });
      }
      break;

    default: // random
      for (let i = 0; i < count; i++) {
        bodies.push({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          mass: 0.5 + Math.random() * 1.5,
          hue: Math.random() * 360,
          trail: [],
        });
      }
  }

  return bodies;
}

function getColorFromScheme(
  scheme: string,
  hue: number,
  velocity: number,
  mass: number
): [number, number, number] {
  const speedFactor = Math.min(velocity / 5, 1);
  
  const palettes: Record<string, (h: number, s: number, v: number) => [number, number, number]> = {
    nebula: (h, s, v) => {
      // Purple, pink, blue nebula colors
      const r = Math.floor(30 + v * 100 * (0.5 + 0.5 * Math.sin(h * 0.017)));
      const g = Math.floor(20 + v * 60 * (0.3 + 0.7 * Math.cos(h * 0.02)));
      const b = Math.floor(60 + v * 120);
      return [r, g, b];
    },
    galaxy: (h, s, v) => {
      // Cool blues and warm stars
      const temp = Math.sin(h * 0.01) * 0.5 + 0.5;
      const r = Math.floor(50 + v * 150 * temp);
      const g = Math.floor(80 + v * 100 * (0.5 + 0.3 * temp));
      const b = Math.floor(120 + v * 100);
      return [r, g, b];
    },
    inferno: (h, s, v) => {
      // Fire colors - red, orange, yellow
      const r = Math.floor(100 + v * 155);
      const g = Math.floor(v * 150 * speedFactor);
      const b = Math.floor(v * 30);
      return [r, g, b];
    },
    ocean: (h, s, v) => {
      // Deep blues and teals
      const r = Math.floor(10 + v * 40);
      const g = Math.floor(40 + v * 100 * (0.5 + 0.5 * Math.sin(h * 0.015)));
      const b = Math.floor(80 + v * 120);
      return [r, g, b];
    },
    gold: (h, s, v) => {
      // Golden and amber
      const r = Math.floor(150 + v * 105);
      const g = Math.floor(120 + v * 100 * speedFactor);
      const b = Math.floor(20 + v * 60 * speedFactor);
      return [r, g, b];
    },
  };
  
  const palette = palettes[scheme] || palettes.nebula;
  return palette(hue, 0.7 + speedFactor * 0.3, 0.3 + speedFactor * 0.7);
}

export function renderNBodyGravity(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: NBodyGravityParams,
  bodies: Body[] = [],
  initBodies: boolean = false
): Body[] {
  const { particleCount, gravityStrength, timeStep, softening, trailLength, colorScheme, initConfig } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Initialize bodies on first run
  if (initBodies || bodies.length === 0) {
    bodies = createBodies(width, height, particleCount, initConfig);
  }
  
  // Semi-transparent fade for trails
  ctx.fillStyle = 'rgba(5, 5, 8, 0.12)';
  ctx.fillRect(0, 0, width, height);
  
  const G = gravityStrength;
  const dt = timeStep;
  const softeningSq = softening * softening;
  
  // Calculate accelerations (n-body gravity: every body attracts every other body)
  const accelerations: Array<{ ax: number; ay: number }> = [];
  
  for (let i = 0; i < bodies.length; i++) {
    let ax = 0;
    let ay = 0;
    
    for (let j = 0; j < bodies.length; j++) {
      if (i === j) continue;
      
      const dx = bodies[j].x - bodies[i].x;
      const dy = bodies[j].y - bodies[i].y;
      const distSq = dx * dx + dy * dy + softeningSq;
      const dist = Math.sqrt(distSq);
      
      // F = G * m1 * m2 / r^2
      // a = F / m1 = G * m2 / r^2
      const force = (G * bodies[j].mass) / distSq;
      
      ax += (dx / dist) * force;
      ay += (dy / dist) * force;
    }
    
    accelerations.push({ ax, ay });
  }
  
  // Update bodies
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];
    const accel = accelerations[i];
    
    // Update velocity
    body.vx += accel.ax * dt;
    body.vy += accel.ay * dt;
    
    // Very slight damping to prevent energy explosion over long runs
    body.vx *= 0.9998;
    body.vy *= 0.9998;
    
    // Update position
    body.x += body.vx * dt;
    body.y += body.vy * dt;
    
    // Add to trail
    body.trail.push({ x: body.x, y: body.y });
    if (body.trail.length > trailLength) {
      body.trail.shift();
    }
    
    // Calculate velocity magnitude for coloring
    const velocity = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
    
    // Draw trail
    if (body.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(body.trail[0].x, body.trail[0].y);
      
      for (let j = 1; j < body.trail.length; j++) {
        const prev = body.trail[j - 1];
        const curr = body.trail[j];
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      
      const last = body.trail[body.trail.length - 1];
      ctx.lineTo(last.x, last.y);
      
      const [r, g, b] = getColorFromScheme(colorScheme, body.hue + time * 0.01, velocity, body.mass);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
      ctx.lineWidth = body.mass * 0.6;
      ctx.stroke();
    }
    
    // Draw body
    const [r, g, b] = getColorFromScheme(colorScheme, body.hue + time * 0.01, velocity, body.mass);
    
    // Glow
    const glowSize = 3 + body.mass * 3 + velocity * 0.5;
    const gradient = ctx.createRadialGradient(body.x, body.y, 0, body.x, body.y, glowSize);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`);
    gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    
    ctx.beginPath();
    ctx.arc(body.x, body.y, glowSize, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Core
    ctx.beginPath();
    ctx.arc(body.x, body.y, body.mass, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fill();
    
    // Wrap around edges (toroidal universe)
    const margin = 50;
    if (body.x < -margin) body.x = width + margin;
    if (body.x > width + margin) body.x = -margin;
    if (body.y < -margin) body.y = height + margin;
    if (body.y > height + margin) body.y = -margin;
  }
  
  // Draw center of mass indicator (subtle)
  let totalMass = 0;
  let comX = 0;
  let comY = 0;
  
  for (const body of bodies) {
    totalMass += body.mass;
    comX += body.x * body.mass;
    comY += body.y * body.mass;
  }
  
  comX /= totalMass;
  comY /= totalMass;
  
  // Subtle crosshair at center of mass
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(comX - 10, comY);
  ctx.lineTo(comX + 10, comY);
  ctx.moveTo(comX, comY - 10);
  ctx.lineTo(comX, comY + 10);
  ctx.stroke();
  
  return bodies;
}
