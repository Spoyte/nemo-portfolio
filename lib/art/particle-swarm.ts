import {
  ArtGenerator,
  fillCanvas,
  SeededRandom,
  generateSeed,
} from "./core";

export const particleSwarm: ArtGenerator = {
  name: "Particle Swarm",
  description: "Flocking particles with emergent behavior (seeded)",
  params: {
    particleCount: {
      name: "Particle Count",
      type: "range",
      min: 50,
      max: 500,
      step: 50,
      default: 200,
    },
    speed: {
      name: "Speed",
      type: "range",
      min: 10,
      max: 100,
      step: 10,
      default: 50,
    },
    attraction: {
      name: "Attraction",
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
      default: 30,
    },
    trail: {
      name: "Trail",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 70,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["fire", "ocean", "neon", "monochrome"],
      default: "ocean",
    },
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 1,
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const {
      particleCount,
      speed,
      attraction,
      cohesion,
      trail,
      colorScheme,
      seed,
    } = params;

    const colorSchemes: Record<string, number[]> = {
      fire: [0, 20, 40, 60],
      ocean: [180, 200, 220, 240],
      neon: [280, 320, 160, 40],
      monochrome: [0],
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

    // Trail effect - fade existing pixels
    const trailAlpha = Math.floor((1 - (trail as number) / 100) * 50);
    ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha / 255})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initialize or update particles
    const particles: Particle[] = (ctx as any).__particles || [];
    const storedSeed = (ctx as any).__particleSeed;
    const targetCount = particleCount as number;

    // Initialize seeded RNG - use stored seed if continuing animation, else use param
    const rng = new SeededRandom(storedSeed !== undefined ? storedSeed : (seed as number));

    // Store seed for next frame if this is first initialization
    if ((ctx as any).__particleSeed === undefined) {
      (ctx as any).__particleSeed = seed as number;
    }

    // Add particles up to target
    while (particles.length < targetCount) {
      const scheme = colorSchemes[colorScheme as string];
      const hue = scheme[Math.floor(rng.random() * scheme.length)];
      particles.push({
        x: rng.random() * canvas.width,
        y: rng.random() * canvas.height,
        vx: (rng.random() - 0.5) * 2,
        vy: (rng.random() - 0.5) * 2,
        life: rng.random() * 100 + 50,
        maxLife: 150,
        hue: hue + (rng.random() - 0.5) * 20,
      });
    }

    // Remove excess particles
    if (particles.length > targetCount) {
      particles.splice(targetCount);
    }

    const speedFactor = (speed as number) / 50;
    const attractionStrength = ((attraction as number) - 50) / 500;
    const cohesionStrength = (cohesion as number) / 1000;

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Cohesion - particles attract to center of mass of neighbors
      if (cohesionStrength > 0) {
        let avgX = 0,
          avgY = 0,
          count = 0;
        const neighborDist = 60;

        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const other = particles[j];
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < neighborDist) {
            avgX += other.x;
            avgY += other.y;
            count++;
          }
        }

        if (count > 0) {
          avgX /= count;
          avgY /= count;
          p.vx += (avgX - p.x) * cohesionStrength * speedFactor;
          p.vy += (avgY - p.y) * cohesionStrength * speedFactor;
        }
      }

      // Add some randomness/wander using seeded RNG
      p.vx += (rng.random() - 0.5) * 0.1 * speedFactor;
      p.vy += (rng.random() - 0.5) * 0.1 * speedFactor;

      // Speed limit
      const maxSpeed = 3 * speedFactor;
      const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (currentSpeed > maxSpeed) {
        p.vx = (p.vx / currentSpeed) * maxSpeed;
        p.vy = (p.vy / currentSpeed) * maxSpeed;
      }

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Age particle
      p.life--;
      if (p.life <= 0) {
        // Respawn with seeded randomness
        p.x = rng.random() * canvas.width;
        p.y = rng.random() * canvas.height;
        p.vx = (rng.random() - 0.5) * 2;
        p.vy = (rng.random() - 0.5) * 2;
        p.life = p.maxLife;
        const scheme = colorSchemes[colorScheme as string];
        p.hue = scheme[Math.floor(rng.random() * scheme.length)] + (rng.random() - 0.5) * 20;
      }

      // Draw particle
      const lifeRatio = p.life / p.maxLife;
      const alpha = lifeRatio * 0.8 + 0.2;
      const size = (1 + lifeRatio) * 1.5;

      if (colorScheme === "monochrome") {
        const brightness = Math.floor(lifeRatio * 200 + 55);
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
      } else {
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Draw connections to nearby particles
      if (cohesionStrength > 0) {
        const connectionDist = 50;
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const connectionAlpha = (1 - dist / connectionDist) * 0.3 * alpha;
            if (colorScheme === "monochrome") {
              ctx.strokeStyle = `rgba(255, 255, 255, ${connectionAlpha})`;
            } else {
              ctx.strokeStyle = `hsla(${p.hue}, 60%, 50%, ${connectionAlpha})`;
            }
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }
    }

    // Store particles for next frame
    (ctx as any).__particles = particles;
  },
};
