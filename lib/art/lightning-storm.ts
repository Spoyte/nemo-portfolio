import { ArtGenerator, ParamConfig } from "./core";

export interface LightningStormParams {
  stormIntensity: number; // 0-1, controls lightning frequency
  rainDensity: number; // 0-1, density of rain streaks
  windSpeed: number; // -1 to 1, direction and speed
  cloudCover: number; // 0-1, opacity of storm clouds
  lightningColor: string; // "white" | "blue" | "purple" | "yellow"
  showRain: boolean;
  showClouds: boolean;
}

interface Bolt {
  segments: { x: number; y: number }[];
  life: number;
  maxLife: number;
  width: number;
  branches: { x: number; y: number; intensity: number }[];
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

interface Cloud {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  drift: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

function generateLightningBolt(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  displacement: number,
  branchChance: number
): { segments: { x: number; y: number }[]; branches: { x: number; y: number; intensity: number }[] } {
  const segments: { x: number; y: number }[] = [{ x: startX, y: startY }];
  const branches: { x: number; y: number; intensity: number }[] = [];

  let currentX = startX;
  let currentY = startY;
  const targetDist = Math.hypot(endX - startX, endY - startY);
  const steps = Math.max(8, Math.floor(targetDist / 15));

  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const targetX = startX + (endX - startX) * t;
    const targetY = startY + (endY - startY) * t;

    // Add jitter perpendicular to direction
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.hypot(dx, dy);
    const perpX = -dy / len;
    const perpY = dx / len;

    const jitter = (Math.random() - 0.5) * displacement * (1 - t * 0.5);
    currentX = targetX + perpX * jitter;
    currentY = targetY + perpY * jitter;

    segments.push({ x: currentX, y: currentY });

    // Chance to create branch
    if (Math.random() < branchChance && i < steps * 0.7) {
      const branchAngle = (Math.random() - 0.5) * Math.PI * 0.8;
      const branchLen = displacement * (0.3 + Math.random() * 0.4);
      branches.push({
        x: currentX,
        y: currentY,
        intensity: 0.3 + Math.random() * 0.4,
      });
    }
  }

  segments.push({ x: endX, y: endY });

  return { segments, branches };
}

function drawLightningBolt(
  ctx: CanvasRenderingContext2D,
  bolt: Bolt,
  color: { r: number; g: number; b: number },
  globalAlpha: number
): void {
  const lifeRatio = bolt.life / bolt.maxLife;
  const alpha = lifeRatio * globalAlpha;

  if (alpha <= 0.01) return;

  // Glow effect
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  // Outer glow
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.3})`;
  ctx.lineWidth = bolt.width * 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  bolt.segments.forEach((seg, i) => {
    if (i === 0) ctx.moveTo(seg.x, seg.y);
    else ctx.lineTo(seg.x, seg.y);
  });
  ctx.stroke();

  // Inner core
  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.lineWidth = bolt.width;
  ctx.beginPath();
  bolt.segments.forEach((seg, i) => {
    if (i === 0) ctx.moveTo(seg.x, seg.y);
    else ctx.lineTo(seg.x, seg.y);
  });
  ctx.stroke();

  // Draw branches
  bolt.branches.forEach((branch) => {
    const branchLen = 30 + Math.random() * 50;
    const branchAngle = Math.PI / 2 + (Math.random() - 0.5) * 1.5;
    const endX = branch.x + Math.cos(branchAngle) * branchLen;
    const endY = branch.y + Math.sin(branchAngle) * branchLen;

    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * branch.intensity * 0.5})`;
    ctx.lineWidth = bolt.width * 0.5;
    ctx.beginPath();
    ctx.moveTo(branch.x, branch.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  });

  ctx.restore();
}

function drawClouds(
  ctx: CanvasRenderingContext2D,
  clouds: Cloud[],
  width: number,
  height: number,
  cloudCover: number,
  flashIntensity: number
): void {
  const baseOpacity = cloudCover * 0.7;
  const flashBoost = flashIntensity * 0.3;

  ctx.save();

  clouds.forEach((cloud) => {
    const gradient = ctx.createRadialGradient(
      cloud.x,
      cloud.y,
      0,
      cloud.x,
      cloud.y,
      cloud.radius * 2
    );

    const opacity = cloud.opacity * baseOpacity;
    gradient.addColorStop(0, `rgba(40, 45, 55, ${opacity + flashBoost})`);
    gradient.addColorStop(0.5, `rgba(25, 30, 40, ${opacity * 0.8 + flashBoost * 0.5})`);
    gradient.addColorStop(1, "rgba(15, 20, 30, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.radius * 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Storm overlay at top
  const stormGradient = ctx.createLinearGradient(0, 0, 0, height * 0.4);
  stormGradient.addColorStop(0, `rgba(10, 12, 18, ${baseOpacity + flashBoost * 0.5})`);
  stormGradient.addColorStop(1, "rgba(10, 12, 18, 0)");
  ctx.fillStyle = stormGradient;
  ctx.fillRect(0, 0, width, height * 0.4);

  ctx.restore();
}

function drawRain(
  ctx: CanvasRenderingContext2D,
  rainDrops: RainDrop[],
  windSpeed: number,
  flashIntensity: number
): void {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const flashBoost = flashIntensity * 0.5;

  rainDrops.forEach((drop) => {
    const windOffset = windSpeed * drop.length * 0.5;
    const alpha = drop.opacity * (0.3 + flashBoost);

    ctx.strokeStyle = `rgba(180, 190, 210, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + windOffset, drop.y + drop.length);
    ctx.stroke();
  });

  ctx.restore();
}

function drawGround(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const groundY = height * 0.85;

  // Horizon gradient
  const gradient = ctx.createLinearGradient(0, groundY, 0, height);
  gradient.addColorStop(0, "rgba(15, 18, 25, 1)");
  gradient.addColorStop(0.3, "rgba(10, 12, 18, 1)");
  gradient.addColorStop(1, "rgba(5, 7, 12, 1)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, groundY, width, height - groundY);

  // Silhouette of distant trees/terrain
  ctx.fillStyle = "rgba(8, 10, 15, 0.8)";
  ctx.beginPath();
  ctx.moveTo(0, height);

  for (let x = 0; x <= width; x += 20) {
    const treeHeight = 15 + Math.sin(x * 0.02) * 10 + Math.sin(x * 0.05) * 5;
    ctx.lineTo(x, groundY - treeHeight);
  }

  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
}

export function renderLightningStorm(
  ctx: CanvasRenderingContext2D,
  params: LightningStormParams,
  time: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Parse color
  const colorMap: Record<string, string> = {
    white: "#ffffff",
    blue: "#aaccff",
    purple: "#ccaaff",
    yellow: "#ffeeaa",
  };
  const lightningColor = hexToRgb(colorMap[params.lightningColor] || "#ffffff");

  // Initialize persistent state
  if (!(ctx as any).stormState) {
    (ctx as any).stormState = {
      bolts: [] as Bolt[],
      rainDrops: [] as RainDrop[],
      clouds: [] as Cloud[],
      lastBoltTime: 0,
      flashIntensity: 0,
      nextBoltDelay: 1000 + Math.random() * 2000,
    };

    // Initialize rain
    const dropCount = Math.floor(200 * params.rainDensity);
    for (let i = 0; i < dropCount; i++) {
      (ctx as any).stormState.rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 10 + Math.random() * 20,
        speed: 8 + Math.random() * 12,
        opacity: 0.2 + Math.random() * 0.4,
      });
    }

    // Initialize clouds
    for (let i = 0; i < 8; i++) {
      (ctx as any).stormState.clouds.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.25,
        radius: 80 + Math.random() * 120,
        opacity: 0.5 + Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 0.3,
      });
    }
  }

  const state = (ctx as any).stormState;

  // Clear with dark storm sky
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
  const flashBoost = state.flashIntensity * 0.4;
  skyGradient.addColorStop(0, `rgba(8, 10, 15, 1)`);
  skyGradient.addColorStop(0.5, `rgba(12, 15, 22, 1)`);
  skyGradient.addColorStop(1, `rgba(${18 + flashBoost * 100}, ${20 + flashBoost * 100}, ${28 + flashBoost * 120}, 1)`);
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height);

  // Update flash intensity
  if (state.flashIntensity > 0) {
    state.flashIntensity *= 0.85;
    if (state.flashIntensity < 0.01) state.flashIntensity = 0;
  }

  // Spawn new bolts
  if (time - state.lastBoltTime > state.nextBoltDelay) {
    if (Math.random() < params.stormIntensity * 0.8 + 0.1) {
      const startX = 50 + Math.random() * (width - 100);
      const boltData = generateLightningBolt(
        startX,
        0,
        startX + (Math.random() - 0.5) * 100,
        height * 0.85,
        40 + Math.random() * 30,
        0.3 + params.stormIntensity * 0.3
      );

      state.bolts.push({
        segments: boltData.segments,
        life: 8 + Math.floor(Math.random() * 6),
        maxLife: 8 + Math.floor(Math.random() * 6),
        width: 2 + Math.random() * 2,
        branches: boltData.branches,
      });

      // Trigger flash
      state.flashIntensity = 0.6 + Math.random() * 0.4;

      // Sometimes spawn a second bolt nearby
      if (Math.random() < 0.3) {
        setTimeout(() => {
          const startX2 = startX + (Math.random() - 0.5) * 60;
          const boltData2 = generateLightningBolt(
            startX2,
            0,
            startX2 + (Math.random() - 0.5) * 80,
            height * 0.85,
            30 + Math.random() * 20,
            0.2
          );
          state.bolts.push({
            segments: boltData2.segments,
            life: 6 + Math.floor(Math.random() * 4),
            maxLife: 6 + Math.floor(Math.random() * 4),
            width: 1.5 + Math.random(),
            branches: boltData2.branches,
          });
          state.flashIntensity = Math.max(state.flashIntensity, 0.4);
        }, 50 + Math.random() * 100);
      }
    }

    state.lastBoltTime = time;
    state.nextBoltDelay = (500 + Math.random() * 3000) * (1.5 - params.stormIntensity);
  }

  // Update and draw clouds
  if (params.showClouds) {
    state.clouds.forEach((cloud: Cloud) => {
      cloud.x += cloud.drift + params.windSpeed * 0.5;
      if (cloud.x < -cloud.radius * 2) cloud.x = width + cloud.radius * 2;
      if (cloud.x > width + cloud.radius * 2) cloud.x = -cloud.radius * 2;
    });
    drawClouds(ctx, state.clouds, width, height, params.cloudCover, state.flashIntensity);
  }

  // Draw ground
  drawGround(ctx, width, height);

  // Update and draw rain
  if (params.showRain) {
    state.rainDrops.forEach((drop: RainDrop) => {
      drop.y += drop.speed;
      drop.x += params.windSpeed * 2;

      if (drop.y > height) {
        drop.y = -drop.length;
        drop.x = Math.random() * width;
      }
      if (drop.x < 0) drop.x = width;
      if (drop.x > width) drop.x = 0;
    });
    drawRain(ctx, state.rainDrops, params.windSpeed, state.flashIntensity);
  }

  // Update and draw bolts
  state.bolts = state.bolts.filter((bolt: Bolt) => {
    bolt.life--;
    if (bolt.life > 0) {
      drawLightningBolt(ctx, bolt, lightningColor, 1);
    }
    return bolt.life > 0;
  });

  // Ambient rain sound visualization (subtle overlay)
  if (params.showRain && params.rainDensity > 0.3) {
    ctx.fillStyle = `rgba(100, 110, 130, ${0.02 * params.rainDensity})`;
    ctx.fillRect(0, 0, width, height);
  }
}

export const lightningStorm: ArtGenerator = {
  name: "Lightning Storm",
  description: "Atmospheric thunderstorm with branching lightning, rain, and illuminated clouds",
  params: {
    stormIntensity: {
      name: "Storm Intensity",
      type: "range",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.6,
    },
    rainDensity: {
      name: "Rain Density",
      type: "range",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.7,
    },
    windSpeed: {
      name: "Wind Speed",
      type: "range",
      min: -1,
      max: 1,
      step: 0.1,
      default: 0.2,
    },
    cloudCover: {
      name: "Cloud Cover",
      type: "range",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.8,
    },
    lightningColor: {
      name: "Lightning Color",
      type: "select",
      options: ["white", "blue", "purple", "yellow"],
      default: "white",
    },
    showRain: {
      name: "Show Rain",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    showClouds: {
      name: "Show Clouds",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
  },
  generate: (ctx, params, time) => {
    const typedParams: LightningStormParams = {
      stormIntensity: params.stormIntensity as number,
      rainDensity: params.rainDensity as number,
      windSpeed: params.windSpeed as number,
      cloudCover: params.cloudCover as number,
      lightningColor: params.lightningColor as string,
      showRain: params.showRain === "true",
      showClouds: params.showClouds === "true",
    };
    renderLightningStorm(ctx, typedParams, time || 0);
  },
};

export default lightningStorm;
