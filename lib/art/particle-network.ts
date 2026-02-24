import {
  ArtGenerator,
  fillCanvas,
  SeededRandom,
  generateSeed,
} from "./core";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const particleNetwork: ArtGenerator = {
  name: "Particle Network",
  description: "Connected particles forming dynamic networks (seeded)",
  params: {
    particleCount: {
      name: "Particle Count",
      type: "range",
      min: 20,
      max: 200,
      step: 10,
      default: 80,
    },
    connectionDistance: {
      name: "Connection Distance",
      type: "range",
      min: 50,
      max: 300,
      step: 25,
      default: 150,
    },
    particleSize: {
      name: "Particle Size",
      type: "range",
      min: 1,
      max: 10,
      step: 1,
      default: 4,
    },
    baseHue: {
      name: "Base Hue",
      type: "range",
      min: 0,
      max: 360,
      step: 10,
      default: 200,
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
  generate: (ctx, params) => {
    const canvas = ctx.canvas;
    const { particleCount, connectionDistance, particleSize, baseHue, seed } = params;

    fillCanvas(ctx, "#0c0a09", canvas.width, canvas.height);

    // Initialize seeded RNG for deterministic output
    const rng = new SeededRandom(seed as number);

    const particles: Particle[] = [];
    for (let i = 0; i < (particleCount as number); i++) {
      particles.push({
        x: rng.random() * canvas.width,
        y: rng.random() * canvas.height,
        vx: (rng.random() - 0.5) * 2,
        vy: (rng.random() - 0.5) * 2,
      });
    }

    // Draw connections
    ctx.strokeStyle = `hsla(${baseHue}, 70%, 60%, 0.15)`;
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < (connectionDistance as number)) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      const hue = ((baseHue as number) + rng.random() * 60) % 360;
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, particleSize as number, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};
