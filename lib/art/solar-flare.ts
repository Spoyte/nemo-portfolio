import { ArtGenerator, ArtParams, hslToRgb } from "./core";

// Solar Flare - Physics simulation of solar activity
// Simulates magnetic reconnection, coronal loops, and solar prominences

interface FlareParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  temperature: number; // 0-1, affects color
}

interface CoronalLoop {
  points: { x: number; y: number }[];
  intensity: number;
  life: number;
  maxLife: number;
}

interface Sunspot {
  x: number;
  y: number;
  radius: number;
  intensity: number;
}

// Seeded random for reproducibility
function createSeededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Simplex-like noise
function createNoise(random: () => number) {
  const perm: number[] = [];
  for (let i = 0; i < 256; i++) perm[i] = Math.floor(random() * 256);
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const A = perm[X] + Y;
    const B = perm[X + 1] + Y;

    return lerp(
      v,
      lerp(u, grad(perm[A], x, y), grad(perm[B], x - 1, y)),
      lerp(u, grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1))
    );
  };
}

// Temperature to color (blackbody radiation approximation)
function temperatureToColor(temp: number): { r: number; g: number; b: number } {
  // temp: 0-1, maps to color temperature
  if (temp < 0.2) {
    // Deep red to orange
    const t = temp / 0.2;
    return {
      r: Math.floor(100 + t * 155),
      g: Math.floor(t * 50),
      b: 0,
    };
  } else if (temp < 0.5) {
    // Orange to yellow
    const t = (temp - 0.2) / 0.3;
    return {
      r: 255,
      g: Math.floor(50 + t * 150),
      b: Math.floor(t * 50),
    };
  } else if (temp < 0.8) {
    // Yellow to white
    const t = (temp - 0.5) / 0.3;
    return {
      r: 255,
      g: Math.floor(200 + t * 55),
      b: Math.floor(50 + t * 150),
    };
  } else {
    // White to blue-white
    const t = (temp - 0.8) / 0.2;
    return {
      r: Math.floor(255 - t * 55),
      g: Math.floor(255 - t * 20),
      b: 255,
    };
  }
}

// Color scheme presets
const COLOR_SCHEMES: Record<string, (temp: number) => { r: number; g: number; b: number }> = {
  realistic: temperatureToColor,
  inferno: (temp: number) => {
    const t = Math.max(0, Math.min(1, temp));
    return {
      r: Math.floor(t < 0.5 ? t * 2 * 255 : 255),
      g: Math.floor(t < 0.5 ? 0 : (t - 0.5) * 2 * 200),
      b: Math.floor(t < 0.75 ? 0 : (t - 0.75) * 4 * 255),
    };
  },
  plasma: (temp: number) => {
    const t = Math.max(0, Math.min(1, temp));
    return {
      r: Math.floor(100 + t * 155),
      g: Math.floor(t < 0.5 ? t * 2 * 100 : 100 + (t - 0.5) * 2 * 155),
      b: Math.floor(t > 0.5 ? (t - 0.5) * 2 * 255 : t * 2 * 150),
    };
  },
  neon: (temp: number) => {
    const t = Math.max(0, Math.min(1, temp));
    return {
      r: Math.floor(255 * (1 - t * 0.3)),
      g: Math.floor(100 + t * 100),
      b: Math.floor(50 + t * 205),
    };
  },
  gold: (temp: number) => {
    const t = Math.max(0, Math.min(1, temp));
    return {
      r: Math.floor(200 + t * 55),
      g: Math.floor(150 + t * 105),
      b: Math.floor(t * 100),
    };
  },
};

// Render solar surface with turbulence
function renderSolarSurface(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sunCenterX: number,
  sunCenterY: number,
  sunRadius: number,
  noise: (x: number, y: number) => number,
  time: number,
  surfaceActivity: number,
  colorScheme: string
) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const getColor = COLOR_SCHEMES[colorScheme] || temperatureToColor;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - sunCenterX;
      const dy = y - sunCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= sunRadius) {
        // Inside sun
        const angle = Math.atan2(dy, dx);
        const normalizedDist = dist / sunRadius;

        // Surface turbulence
        const noiseScale = 0.01 + surfaceActivity * 0.02;
        const n1 = noise(x * noiseScale + time * 0.0005, y * noiseScale);
        const n2 = noise(x * noiseScale * 2 - time * 0.0003, y * noiseScale * 2);
        const turbulence = (n1 + n2 * 0.5) / 1.5;

        // Limb darkening (sun gets darker at edges)
        const limbDarkening = Math.sqrt(1 - normalizedDist * normalizedDist);
        const baseTemp = 0.4 + turbulence * 0.3 * surfaceActivity;
        const temp = baseTemp * (0.3 + limbDarkening * 0.7);

        const color = getColor(Math.max(0, Math.min(1, temp)));

        const idx = (y * width + x) * 4;
        data[idx] = color.r;
        data[idx + 1] = color.g;
        data[idx + 2] = color.b;
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Generate coronal loop path
function generateCoronalLoop(
  startX: number,
  startY: number,
  height: number,
  width: number,
  random: () => number
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const steps = 50;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Parabolic arc
    const x = startX + (t - 0.5) * width;
    const y = startY - Math.sin(t * Math.PI) * height;
    points.push({ x, y });
  }

  return points;
}

// Main render function
export function renderSolarFlare(
  ctx: CanvasRenderingContext2D,
  params: ArtParams,
  time: number = 0
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Parameters
  const sunSize = (params.sunSize as number) || 60;
  const flareIntensity = (params.flareIntensity as number) || 50;
  const coronaDensity = (params.coronaDensity as number) || 40;
  const surfaceActivity = (params.surfaceActivity as number) || 50;
  const particleCount = (params.particleCount as number) || 100;
  const colorScheme = (params.colorScheme as string) || "realistic";
  const showCoronalLoops = (params.showCoronalLoops as string) === "true";
  const rotationSpeed = (params.rotationSpeed as number) || 20;

  const sunRadius = (Math.min(width, height) * sunSize) / 200;
  const sunCenterX = width / 2;
  const sunCenterY = height / 2;

  // Initialize RNG with time-based seed for animation
  const seed = Math.floor(time / 1000) * 0.001;
  const random = createSeededRandom(seed * 10000);
  const noise = createNoise(random);

  // Clear canvas
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Render solar surface
  renderSolarSurface(
    ctx,
    width,
    height,
    sunCenterX,
    sunCenterY,
    sunRadius,
    noise,
    time * (rotationSpeed / 20),
    surfaceActivity / 100,
    colorScheme
  );

  // Draw sunspots
  const numSunspots = Math.floor(surfaceActivity / 20);
  for (let i = 0; i < numSunspots; i++) {
    const spotSeed = i * 1000 + Math.floor(time / 5000);
    const spotRandom = createSeededRandom(spotSeed);
    const angle = spotRandom() * Math.PI * 2;
    const dist = spotRandom() * sunRadius * 0.8;
    const spotX = sunCenterX + Math.cos(angle) * dist;
    const spotY = sunCenterY + Math.sin(angle) * dist;
    const spotRadius = 5 + spotRandom() * 15 * (surfaceActivity / 100);

    // Draw sunspot (darker area)
    const gradient = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotRadius);
    gradient.addColorStop(0, "rgba(20, 10, 5, 0.8)");
    gradient.addColorStop(0.5, "rgba(40, 20, 10, 0.5)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(spotX, spotY, spotRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw coronal loops
  if (showCoronalLoops) {
    const numLoops = Math.floor(coronaDensity / 10);
    for (let i = 0; i < numLoops; i++) {
      const loopSeed = i * 2000 + Math.floor(time / 3000);
      const loopRandom = createSeededRandom(loopSeed);
      const angle = loopRandom() * Math.PI * 2;
      const startX = sunCenterX + Math.cos(angle) * sunRadius * 0.9;
      const startY = sunCenterY + Math.sin(angle) * sunRadius * 0.9;
      const loopHeight = 30 + loopRandom() * 80 * (flareIntensity / 100);
      const loopWidth = 20 + loopRandom() * 40;

      const points = generateCoronalLoop(startX, startY, loopHeight, loopWidth, loopRandom);

      // Draw loop with glow
      ctx.strokeStyle = `rgba(255, 200, 100, ${0.3 + loopRandom() * 0.4})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Glow effect
      ctx.strokeStyle = `rgba(255, 150, 50, 0.1)`;
      ctx.lineWidth = 8;
      ctx.stroke();
    }
  }

  // Draw solar flare particles
  const getColor = COLOR_SCHEMES[colorScheme] || temperatureToColor;
  const particles: FlareParticle[] = [];

  // Generate particles
  for (let i = 0; i < particleCount; i++) {
    const particleSeed = i * 3000 + Math.floor(time / 100);
    const pRandom = createSeededRandom(particleSeed);
    const angle = pRandom() * Math.PI * 2;
    const speed = 1 + pRandom() * 3 * (flareIntensity / 50);

    particles.push({
      x: sunCenterX + Math.cos(angle) * sunRadius * (0.8 + pRandom() * 0.2),
      y: sunCenterY + Math.sin(angle) * sunRadius * (0.8 + pRandom() * 0.2),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: pRandom() * 100,
      maxLife: 50 + pRandom() * 100,
      size: 1 + pRandom() * 3,
      temperature: 0.5 + pRandom() * 0.5,
    });
  }

  // Update and draw particles
  particles.forEach((p) => {
    const age = (time / 16 + p.life) % p.maxLife;
    const lifeRatio = age / p.maxLife;
    const currentX = p.x + p.vx * age * 0.5;
    const currentY = p.y + p.vy * age * 0.5;

    // Fade out as particle ages
    const alpha = (1 - lifeRatio) * (flareIntensity / 100);

    if (alpha > 0) {
      const color = getColor(p.temperature * (1 - lifeRatio * 0.5));

      // Particle glow
      const gradient = ctx.createRadialGradient(
        currentX,
        currentY,
        0,
        currentX,
        currentY,
        p.size * 3
      );
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.3})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(currentX, currentY, p.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(currentX, currentY, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw prominences (large arcs of plasma)
  const numProminences = Math.floor(flareIntensity / 25);
  for (let i = 0; i < numProminences; i++) {
    const promSeed = i * 5000 + Math.floor(time / 4000);
    const promRandom = createSeededRandom(promSeed);
    const angle = promRandom() * Math.PI * 2;
    const baseX = sunCenterX + Math.cos(angle) * sunRadius;
    const baseY = sunCenterY + Math.sin(angle) * sunRadius;
    const prominenceHeight = 40 + promRandom() * 100 * (flareIntensity / 100);
    const prominenceWidth = 30 + promRandom() * 50;

    // Draw prominence arc
    const gradient = ctx.createLinearGradient(baseX, baseY, baseX, baseY - prominenceHeight);
    const color = getColor(0.7 + promRandom() * 0.3);
    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`);
    gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();

    // Draw arc shape
    const perpAngle = angle + Math.PI / 2;
    for (let t = 0; t <= 1; t += 0.05) {
      const arcHeight = Math.sin(t * Math.PI) * prominenceHeight;
      const arcWidth = (t - 0.5) * prominenceWidth;
      const px = baseX + Math.cos(angle) * arcWidth * 0.3 - Math.cos(angle) * arcHeight * 0.5;
      const py = baseY + Math.sin(angle) * arcWidth * 0.3 - Math.sin(angle) * arcHeight * 0.5 - arcHeight;

      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    // Close the shape
    for (let t = 1; t >= 0; t -= 0.05) {
      const arcHeight = Math.sin(t * Math.PI) * prominenceHeight * 0.5;
      const arcWidth = (t - 0.5) * prominenceWidth;
      const px = baseX + Math.cos(angle) * arcWidth * 0.3 - Math.cos(angle) * arcHeight * 0.5;
      const py = baseY + Math.sin(angle) * arcWidth * 0.3 - Math.sin(angle) * arcHeight * 0.5 - arcHeight;
      ctx.lineTo(px, py);
    }

    ctx.closePath();
    ctx.fill();
  }

  // Corona glow effect (outer atmosphere)
  const coronaGradient = ctx.createRadialGradient(
    sunCenterX,
    sunCenterY,
    sunRadius,
    sunCenterX,
    sunCenterY,
    sunRadius + 100 * (coronaDensity / 100)
  );
  coronaGradient.addColorStop(0, "rgba(255, 200, 100, 0.3)");
  coronaGradient.addColorStop(0.5, "rgba(255, 150, 50, 0.1)");
  coronaGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = coronaGradient;
  ctx.fillRect(0, 0, width, height);
}

// Default parameters
export const solarFlareDefaultParams: ArtParams = {
  sunSize: 60,
  flareIntensity: 50,
  coronaDensity: 40,
  surfaceActivity: 50,
  particleCount: 100,
  colorScheme: "realistic",
  showCoronalLoops: "true",
  rotationSpeed: 20,
};

// Art generator definition
export const solarFlare: ArtGenerator = {
  name: "Solar Flare",
  description:
    "Physics simulation of solar activity including magnetic reconnection, coronal loops, solar prominences, and surface turbulence. Watch as plasma erupts from the sun's surface in spectacular flares.",
  params: {
    sunSize: {
      name: "Sun Size",
      type: "range",
      min: 30,
      max: 90,
      step: 1,
      default: 60,
    },
    flareIntensity: {
      name: "Flare Intensity",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: 50,
    },
    coronaDensity: {
      name: "Corona Density",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: 40,
    },
    surfaceActivity: {
      name: "Surface Activity",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: 50,
    },
    particleCount: {
      name: "Particle Count",
      type: "range",
      min: 20,
      max: 300,
      step: 10,
      default: 100,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["realistic", "inferno", "plasma", "neon", "gold"],
      default: "realistic",
    },
    showCoronalLoops: {
      name: "Show Coronal Loops",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    rotationSpeed: {
      name: "Rotation Speed",
      type: "range",
      min: 0,
      max: 50,
      step: 1,
      default: 20,
    },
  },
  generate: renderSolarFlare,
};
