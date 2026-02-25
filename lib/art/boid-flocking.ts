import {
  ArtGenerator,
  fillCanvas,
  SeededRandom,
} from "./core";

// Boid Flocking - Craig Reynolds' classic algorithm (1986)
// Three rules: separation, alignment, cohesion

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number; // acceleration x
  ay: number; // acceleration y
  hue: number;
}

export const boidFlocking: ArtGenerator = {
  name: "Boid Flocking",
  description: "Emergent flocking behavior through separation, alignment, and cohesion rules",
  params: {
    boidCount: {
      name: "Boid Count",
      type: "range",
      min: 20,
      max: 200,
      step: 10,
      default: 80,
    },
    speed: {
      name: "Speed",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 50,
    },
    separation: {
      name: "Separation",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 60,
    },
    alignment: {
      name: "Alignment",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 50,
    },
    cohesion: {
      name: "Cohesion",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 40,
    },
    visualRange: {
      name: "Visual Range",
      type: "range",
      min: 20,
      max: 100,
      step: 5,
      default: 50,
    },
    trail: {
      name: "Trail",
      type: "range",
      min: 0,
      max: 95,
      step: 5,
      default: 60,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["aurora", "sunset", "ocean", "neon", "fire"],
      default: "aurora",
    },
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 42,
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const {
      boidCount,
      speed,
      separation,
      alignment,
      cohesion,
      visualRange,
      trail,
      colorScheme,
      seed,
    } = params;

    const colorSchemes: Record<string, number[]> = {
      aurora: [120, 150, 180, 210, 240], // greens to blues
      sunset: [300, 320, 340, 20, 40],   // purples to oranges
      ocean: [170, 190, 210, 230, 250],  // teals to deep blues
      neon: [280, 320, 40, 160, 200],    // purple, pink, yellow, green, cyan
      fire: [0, 20, 40, 60, 80],         // reds to yellows
    };

    // Trail effect
    const trailAlpha = Math.floor((1 - (trail as number) / 100) * 40);
    ctx.fillStyle = `rgba(5, 5, 10, ${trailAlpha / 255})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get or initialize boids
    let boids: Boid[] = (ctx as any).__boids || [];
    const storedSeed = (ctx as any).__boidSeed;
    const targetCount = boidCount as number;
    const rng = new SeededRandom(storedSeed !== undefined ? storedSeed : (seed as number));

    if ((ctx as any).__boidSeed === undefined) {
      (ctx as any).__boidSeed = seed as number;
    }

    const scheme = colorSchemes[colorScheme as string];

    // Initialize new boids
    while (boids.length < targetCount) {
      const angle = rng.random() * Math.PI * 2;
      const hue = scheme[Math.floor(rng.random() * scheme.length)];
      boids.push({
        x: rng.random() * canvas.width,
        y: rng.random() * canvas.height,
        vx: Math.cos(angle),
        vy: Math.sin(angle),
        ax: 0,
        ay: 0,
        hue: hue + (rng.random() - 0.5) * 30,
      });
    }

    // Remove excess boids
    if (boids.length > targetCount) {
      boids.splice(targetCount);
    }

    const maxSpeed = 2 + (speed as number) / 20;
    const maxForce = 0.05 + (speed as number) / 2000;
    const perceptionRadius = visualRange as number;
    const sepWeight = (separation as number) / 100;
    const aliWeight = (alignment as number) / 100;
    const cohWeight = (cohesion as number) / 100;

    // Helper: Wrap position around edges
    const wrap = (val: number, max: number) => {
      if (val < 0) return max;
      if (val > max) return 0;
      return val;
    };

    // Helper: Limit vector magnitude
    const limit = (vx: number, vy: number, max: number) => {
      const mag = Math.sqrt(vx * vx + vy * vy);
      if (mag > max && mag > 0) {
        return { x: (vx / mag) * max, y: (vy / mag) * max };
      }
      return { x: vx, y: vy };
    };

    // Calculate flocking forces for each boid
    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i];
      
      let sepX = 0, sepY = 0;
      let aliX = 0, aliY = 0;
      let cohX = 0, cohY = 0;
      let neighborCount = 0;

      // Check all other boids
      for (let j = 0; j < boids.length; j++) {
        if (i === j) continue;
        
        const other = boids[j];
        const dx = other.x - boid.x;
        const dy = other.y - boid.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < perceptionRadius && dist > 0) {
          // Separation: steer away from close neighbors
          sepX -= dx / dist;
          sepY -= dy / dist;

          // Alignment: average velocity of neighbors
          aliX += other.vx;
          aliY += other.vy;

          // Cohesion: average position of neighbors
          cohX += other.x;
          cohY += other.y;

          neighborCount++;
        }
      }

      // Reset acceleration
      boid.ax = 0;
      boid.ay = 0;

      if (neighborCount > 0) {
        // Apply separation
        if (sepWeight > 0) {
          const sep = limit(sepX * sepWeight, sepY * sepWeight, maxForce);
          boid.ax += sep.x;
          boid.ay += sep.y;
        }

        // Apply alignment
        if (aliWeight > 0) {
          aliX /= neighborCount;
          aliY /= neighborCount;
          const ali = limit((aliX - boid.vx) * aliWeight, (aliY - boid.vy) * aliWeight, maxForce);
          boid.ax += ali.x;
          boid.ay += ali.y;
        }

        // Apply cohesion
        if (cohWeight > 0) {
          cohX /= neighborCount;
          cohY /= neighborCount;
          const desiredX = cohX - boid.x;
          const desiredY = cohY - boid.y;
          const coh = limit(desiredX * cohWeight, desiredY * cohWeight, maxForce);
          boid.ax += coh.x;
          boid.ay += coh.y;
        }
      }

      // Add subtle noise/wander
      boid.ax += (rng.random() - 0.5) * 0.02;
      boid.ay += (rng.random() - 0.5) * 0.02;

      // Update velocity
      boid.vx += boid.ax;
      boid.vy += boid.ay;

      // Limit speed
      const vel = limit(boid.vx, boid.vy, maxSpeed);
      boid.vx = vel.x;
      boid.vy = vel.y;

      // Update position
      boid.x += boid.vx;
      boid.y += boid.vy;

      // Wrap around edges
      boid.x = wrap(boid.x, canvas.width);
      boid.y = wrap(boid.y, canvas.height);
    }

    // Draw boids
    for (const boid of boids) {
      // Calculate heading angle
      const angle = Math.atan2(boid.vy, boid.vx);
      
      // Speed affects size slightly
      const speedMag = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
      const size = 3 + speedMag * 0.5;

      // Draw boid as a small triangle pointing in direction of travel
      ctx.save();
      ctx.translate(boid.x, boid.y);
      ctx.rotate(angle);

      // Color based on speed
      const speedRatio = speedMag / maxSpeed;
      const lightness = 50 + speedRatio * 30;
      const saturation = 70 + speedRatio * 20;
      
      ctx.fillStyle = `hsla(${boid.hue}, ${saturation}%, ${lightness}%, 0.9)`;
      ctx.beginPath();
      ctx.moveTo(size * 1.5, 0);
      ctx.lineTo(-size * 0.5, -size * 0.6);
      ctx.lineTo(-size * 0.5, size * 0.6);
      ctx.closePath();
      ctx.fill();

      // Glow effect for faster boids
      if (speedRatio > 0.7) {
        ctx.shadowColor = `hsla(${boid.hue}, 80%, 60%, 0.5)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }

    // Draw connections between nearby boids (subtle)
    ctx.lineWidth = 0.5;
    for (let i = 0; i < boids.length; i++) {
      for (let j = i + 1; j < boids.length; j++) {
        const b1 = boids[i];
        const b2 = boids[j];
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < perceptionRadius * 0.6) {
          const alpha = (1 - dist / (perceptionRadius * 0.6)) * 0.15;
          const avgHue = (b1.hue + b2.hue) / 2;
          ctx.strokeStyle = `hsla(${avgHue}, 60%, 50%, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(b1.x, b1.y);
          ctx.lineTo(b2.x, b2.y);
          ctx.stroke();
        }
      }
    }

    // Store boids for next frame
    (ctx as any).__boids = boids;
  },
};
