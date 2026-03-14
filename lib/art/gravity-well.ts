import type { Artwork, ArtworkParams, ArtContext } from "./core";

export interface GravityWellParams extends ArtworkParams {
  particleCount: number;        // 100-2000 particles
  gravityStrength: number;      // 0.1-5.0 well intensity
  wellRadius: number;           // 20-150 well influence radius
  particleSpeed: number;        // 0.5-5.0 base speed
  trailLength: number;          // 5-50 particle trail segments
  colorScheme: "nebula" | "solar" | "aurora" | "deep-space" | "plasma";
  showWells: boolean;           // visualize well locations
  wellDecay: number;            // 0.9-0.999 well persistence
  particleSize: number;         // 0.5-3.0 particle radius
  enableCollisions: boolean;    // particles bounce off wells
}

export const gravityWellDefaultParams: GravityWellParams = {
  particleCount: 800,
  gravityStrength: 2.0,
  wellRadius: 80,
  particleSpeed: 2.0,
  trailLength: 20,
  colorScheme: "nebula",
  showWells: true,
  wellDecay: 0.995,
  particleSize: 1.5,
  enableCollisions: false,
};

// Color schemes for different cosmic moods
const COLOR_SCHEMES: Record<string, { bg: string; hues: number[]; sat: number; light: number }> = {
  "nebula": { bg: "#0a0510", hues: [280, 320, 200, 180], sat: 70, light: 60 },
  "solar": { bg: "#1a0a05", hues: [30, 45, 60, 15], sat: 80, light: 55 },
  "aurora": { bg: "#051a10", hues: [120, 150, 180, 300], sat: 65, light: 65 },
  "deep-space": { bg: "#050508", hues: [220, 240, 260, 200], sat: 50, light: 70 },
  "plasma": { bg: "#1a0510", hues: [340, 20, 60, 300], sat: 75, light: 60 },
};

interface GravityWell {
  x: number;
  y: number;
  strength: number;
  radius: number;
  birthTime: number;
  pulse: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  trail: { x: number; y: number }[];
  energy: number;  // for color variation
}

// Initialize particles with random positions and velocities
function createParticles(count: number, width: number, height: number, speed: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = (0.5 + Math.random() * 0.5) * speed;
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      hue: Math.random() * 360,
      trail: [],
      energy: 0.5 + Math.random() * 0.5,
    });
  }
  return particles;
}

export function renderGravityWell(
  ctx: CanvasRenderingContext2D,
  context: ArtContext,
  params: GravityWellParams
): void {
  const { width, height, time } = context;
  const colors = COLOR_SCHEMES[params.colorScheme];

  // Initialize persistent state
  if (!(context as any).gravityState) {
    (context as any).gravityState = {
      particles: createParticles(params.particleCount, width, height, params.particleSpeed),
      wells: [] as GravityWell[],
      mouseWell: null as GravityWell | null,
      frameCount: 0,
    };
  }
  const state = (context as any).gravityState;

  // Handle particle count changes
  if (state.particles.length !== params.particleCount) {
    if (state.particles.length < params.particleCount) {
      const newParticles = createParticles(
        params.particleCount - state.particles.length,
        width,
        height,
        params.particleSpeed
      );
      state.particles.push(...newParticles);
    } else {
      state.particles = state.particles.slice(0, params.particleCount);
    }
  }

  // Fade background for trail effect
  ctx.fillStyle = colors.bg + "20";  // Very transparent for long trails
  ctx.fillRect(0, 0, width, height);

  // Get mouse/touch position if available
  const input = (context as any).input;
  if (input?.x !== undefined && input?.y !== undefined) {
    if (!state.mouseWell) {
      state.mouseWell = {
        x: input.x,
        y: input.y,
        strength: params.gravityStrength,
        radius: params.wellRadius,
        birthTime: time,
        pulse: 0,
      };
    } else {
      state.mouseWell.x = input.x;
      state.mouseWell.y = input.y;
      state.mouseWell.strength = params.gravityStrength;
      state.mouseWell.radius = params.wellRadius;
    }
  } else {
    state.mouseWell = null;
  }

  // Auto-spawn wells periodically if no mouse interaction
  state.frameCount++;
  if (!state.mouseWell && state.frameCount % 300 === 0 && state.wells.length < 3) {
    state.wells.push({
      x: 100 + Math.random() * (width - 200),
      y: 100 + Math.random() * (height - 200),
      strength: params.gravityStrength * (0.5 + Math.random() * 0.5),
      radius: params.wellRadius * (0.7 + Math.random() * 0.6),
      birthTime: time,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  // Decay and filter wells
  state.wells = state.wells.filter((well: GravityWell) => {
    well.strength *= params.wellDecay;
    well.pulse += 0.02;
    return well.strength > 0.1;
  });

  // Combine wells for processing
  const activeWells = [...state.wells];
  if (state.mouseWell) {
    activeWells.push(state.mouseWell);
  }

  // Update and render particles
  state.particles.forEach((particle: Particle) => {
    // Apply gravity from all wells
    activeWells.forEach((well: GravityWell) => {
      const dx = well.x - particle.x;
      const dy = well.y - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < well.radius && dist > 0) {
        // Gravitational force falls off with distance
        const force = (well.strength * 100) / (dist * dist + 100);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        particle.vx += fx * 0.1;
        particle.vy += fy * 0.1;

        // Collision with well center
        if (params.enableCollisions && dist < 10) {
          const bounceAngle = Math.atan2(dy, dx);
          particle.vx = Math.cos(bounceAngle) * params.particleSpeed * 2;
          particle.vy = Math.sin(bounceAngle) * params.particleSpeed * 2;
        }

        // Increase energy when near wells (for color variation)
        particle.energy = Math.min(1, particle.energy + 0.01);
      }
    });

    // Apply drag to prevent runaway acceleration
    particle.vx *= 0.999;
    particle.vy *= 0.999;

    // Limit max speed
    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    const maxSpeed = params.particleSpeed * 3;
    if (speed > maxSpeed) {
      particle.vx = (particle.vx / speed) * maxSpeed;
      particle.vy = (particle.vy / speed) * maxSpeed;
    }

    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Wrap around edges
    if (particle.x < 0) particle.x = width;
    if (particle.x > width) particle.x = 0;
    if (particle.y < 0) particle.y = height;
    if (particle.y > height) particle.y = 0;

    // Decay energy
    particle.energy *= 0.995;

    // Update trail
    particle.trail.push({ x: particle.x, y: particle.y });
    if (particle.trail.length > params.trailLength) {
      particle.trail.shift();
    }

    // Render trail
    if (particle.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
      for (let i = 1; i < particle.trail.length; i++) {
        ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
      }

      // Dynamic color based on energy and position
      const hueIndex = Math.floor((particle.x / width) * colors.hues.length) % colors.hues.length;
      const baseHue = colors.hues[hueIndex];
      const energyHue = particle.energy * 60;  // Shift toward warm when energetic
      const finalHue = (baseHue + energyHue) % 360;

      const alpha = 0.3 + particle.energy * 0.5;
      ctx.strokeStyle = `hsla(${finalHue}, ${colors.sat}%, ${colors.light}%, ${alpha})`;
      ctx.lineWidth = params.particleSize * (0.5 + particle.energy);
      ctx.stroke();
    }

    // Render particle head with glow
    const glowSize = params.particleSize * (2 + particle.energy * 2);
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, glowSize
    );

    const hueIndex = Math.floor((particle.x / width) * colors.hues.length) % colors.hues.length;
    const baseHue = colors.hues[hueIndex];
    const finalHue = (baseHue + particle.energy * 60) % 360;

    gradient.addColorStop(0, `hsla(${finalHue}, ${colors.sat}%, ${colors.light + 20}%, ${0.8 + particle.energy * 0.2})`);
    gradient.addColorStop(0.5, `hsla(${finalHue}, ${colors.sat}%, ${colors.light}%, ${0.4 + particle.energy * 0.3})`);
    gradient.addColorStop(1, `hsla(${finalHue}, ${colors.sat}%, ${colors.light}%, 0)`);

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  });

  // Render wells
  if (params.showWells) {
    activeWells.forEach((well: GravityWell) => {
      const age = (time - well.birthTime) * 0.001;
      const pulseSize = well.radius * (1 + Math.sin(well.pulse) * 0.1);

      // Outer glow
      const outerGradient = ctx.createRadialGradient(
        well.x, well.y, 0,
        well.x, well.y, pulseSize * 1.5
      );
      outerGradient.addColorStop(0, `hsla(200, 80%, 70%, ${well.strength * 0.1})`);
      outerGradient.addColorStop(0.5, `hsla(220, 70%, 60%, ${well.strength * 0.05})`);
      outerGradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(well.x, well.y, pulseSize * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = outerGradient;
      ctx.fill();

      // Well core
      const coreGradient = ctx.createRadialGradient(
        well.x, well.y, 0,
        well.x, well.y, 15
      );
      coreGradient.addColorStop(0, `hsla(200, 90%, 80%, ${Math.min(1, well.strength * 0.3)})`);
      coreGradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(well.x, well.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Ring
      ctx.beginPath();
      ctx.arc(well.x, well.y, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(200, 70%, 60%, ${well.strength * 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  // Render info
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "12px monospace";
  ctx.fillText(
    `Particles: ${state.particles.length} | Wells: ${activeWells.length} | Click/touch to create gravity wells`,
    10,
    height - 10
  );
}

export const gravityWell: Artwork = {
  id: "gravity-well",
  name: "Gravity Well",
  description: "Interactive physics simulation where gravity wells bend particle trajectories. Click or touch to create wells. Watch as particles curve through spacetime, leaving luminous trails.",
  category: "interactive",
  params: gravityWellDefaultParams,
  paramConfig: {
    particleCount: { min: 100, max: 2000, step: 50, label: "Particles" },
    gravityStrength: { min: 0.1, max: 5.0, step: 0.1, label: "Gravity" },
    wellRadius: { min: 20, max: 150, step: 5, label: "Well Radius" },
    particleSpeed: { min: 0.5, max: 5.0, step: 0.1, label: "Speed" },
    trailLength: { min: 5, max: 50, step: 1, label: "Trails" },
    colorScheme: {
      options: ["nebula", "solar", "aurora", "deep-space", "plasma"],
      label: "Theme",
    },
    showWells: { type: "boolean", label: "Show Wells" },
    wellDecay: { min: 0.9, max: 0.999, step: 0.001, label: "Decay" },
    particleSize: { min: 0.5, max: 3.0, step: 0.1, label: "Size" },
    enableCollisions: { type: "boolean", label: "Collisions" },
  },
  render: renderGravityWell,
  interactive: true,
};
