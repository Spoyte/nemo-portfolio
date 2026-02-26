import { ArtGenerator, ArtParams, fillCanvas } from "./core";

export interface MagneticFieldParams extends ArtParams {
  magnetCount: number;
  fieldLineDensity: number;
  lineThickness: number;
  colorScheme: string;
  showFieldStrength: boolean;
  animateField: boolean;
  particleTracers: number;
  backgroundStyle: string;
}

export const magneticFieldDefaultParams: MagneticFieldParams = {
  magnetCount: 2,
  fieldLineDensity: 40,
  lineThickness: 1.5,
  colorScheme: "iron-filings",
  showFieldStrength: true,
  animateField: true,
  particleTracers: 50,
  backgroundStyle: "dark",
};

// Color schemes for field visualization
const COLOR_SCHEMES: Record<string, (strength: number, t: number) => string> = {
  "iron-filings": (s, t) => {
    // Silvery metallic gradient
    const intensity = Math.min(1, s * 2);
    const r = Math.floor(180 + intensity * 75);
    const g = Math.floor(180 + intensity * 75);
    const b = Math.floor(190 + intensity * 65);
    return `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
  },
  "heat-map": (s, t) => {
    // Blue (weak) to red (strong)
    const hue = (1 - Math.min(1, s)) * 240;
    return `hsla(${hue}, 100%, 50%, ${0.4 + s * 0.6})`;
  },
  "neon": (s, t) => {
    const colors = ["#00ffff", "#ff00ff", "#ffff00", "#00ff00"];
    const color = colors[Math.floor(t * colors.length) % colors.length];
    const alpha = 0.3 + s * 0.7;
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  "aurora": (s, t) => {
    const hue = (t * 180 + s * 60) % 360;
    return `hsla(${hue}, 80%, 60%, ${0.3 + s * 0.7})`;
  },
  "monochrome": (s, t) => {
    const gray = Math.floor(s * 255);
    return `rgba(${gray}, ${gray}, ${gray}, ${0.4 + s * 0.6})`;
  },
};

// Parse neon color helper
function getNeonColor(index: number, alpha: number): string {
  const colors = [
    `rgba(0, 255, 255, ${alpha})`,   // cyan
    `rgba(255, 0, 255, ${alpha})",   // magenta
    `rgba(255, 255, 0, ${alpha})",   // yellow
    `rgba(0, 255, 128, ${alpha})",   // green
  ];
  return colors[index % colors.length];
}

interface Magnet {
  x: number;
  y: number;
  polarity: number; // +1 = north, -1 = south
  strength: number;
}

interface Particle {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  path: { x: number; y: number }[];
}

// Calculate magnetic field vector at a point
function calculateField(
  x: number,
  y: number,
  magnets: Magnet[]
): { bx: number; by: number; strength: number } {
  let bx = 0;
  let by = 0;

  for (const magnet of magnets) {
    const dx = x - magnet.x;
    const dy = y - magnet.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);

    if (dist < 10) continue; // Avoid singularity near magnet

    // Magnetic field falls off with 1/r^3 for dipole
    const strength = (magnet.strength * 10000) / (distSq * dist);
    const angle = Math.atan2(dy, dx);

    // Field direction depends on polarity
    bx += strength * Math.cos(angle) * magnet.polarity;
    by += strength * Math.sin(angle) * magnet.polarity;
  }

  const totalStrength = Math.sqrt(bx * bx + by * by);
  return { bx, by, strength: totalStrength };
}

// Normalize vector
function normalize(bx: number, by: number): { x: number; y: number; len: number } {
  const len = Math.sqrt(bx * bx + by * by);
  if (len === 0) return { x: 0, y: 0, len: 0 };
  return { x: bx / len, y: by / len, len };
}

// Trace a field line starting from a point
function traceFieldLine(
  startX: number,
  startY: number,
  magnets: Magnet[],
  direction: number,
  maxSteps: number = 500,
  stepSize: number = 3
): { x: number; y: number; strength: number }[] {
  const points: { x: number; y: number; strength: number }[] = [];
  let x = startX;
  let y = startY;

  for (let i = 0; i < maxSteps; i++) {
    const field = calculateField(x, y, magnets);
    const norm = normalize(field.bx * direction, field.by * direction);

    if (norm.len < 0.001) break;

    points.push({ x, y, strength: field.strength });

    x += norm.x * stepSize;
    y += norm.y * stepSize;

    // Stop if we hit a magnet or go off screen
    let hitMagnet = false;
    for (const magnet of magnets) {
      const dist = Math.sqrt((x - magnet.x) ** 2 + (y - magnet.y) ** 2);
      if (dist < 15) {
        hitMagnet = true;
        break;
      }
    }

    if (hitMagnet) break;
  }

  return points;
}

export function renderMagneticField(
  ctx: CanvasRenderingContext2D,
  params: MagneticFieldParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Background
  const bgColors: Record<string, string> = {
    dark: "#0a0a0f",
    black: "#000000",
    navy: "#0a0f1a",
    paper: "#f5f5f0",
  };
  fillCanvas(ctx, bgColors[params.backgroundStyle] || "#0a0a0f", width, height);

  // Initialize magnets based on count
  const magnets: Magnet[] = [];
  const centerX = width / 2;
  const centerY = height / 2;

  if (params.magnetCount === 1) {
    magnets.push({ x: centerX, y: centerY, polarity: 1, strength: 1 });
  } else if (params.magnetCount === 2) {
    const separation = Math.min(width, height) * 0.25;
    magnets.push(
      { x: centerX - separation, y: centerY, polarity: 1, strength: 1 },
      { x: centerX + separation, y: centerY, polarity: -1, strength: 1 }
    );
  } else if (params.magnetCount === 3) {
    const radius = Math.min(width, height) * 0.2;
    const angleOffset = time * 0.0002;
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 + angleOffset;
      magnets.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        polarity: i === 0 ? 1 : -1,
        strength: 1,
      });
    }
  } else if (params.magnetCount === 4) {
    const separation = Math.min(width, height) * 0.2;
    magnets.push(
      { x: centerX - separation, y: centerY - separation, polarity: 1, strength: 1 },
      { x: centerX + separation, y: centerY - separation, polarity: -1, strength: 1 },
      { x: centerX - separation, y: centerY + separation, polarity: -1, strength: 1 },
      { x: centerX + separation, y: centerY + separation, polarity: 1, strength: 1 }
    );
  }

  // Animate magnet positions if enabled
  if (params.animateField && params.magnetCount === 2) {
    const separation = Math.min(width, height) * 0.25;
    const oscillation = Math.sin(time * 0.001) * 20;
    magnets[0].x = centerX - separation + oscillation;
    magnets[1].x = centerX + separation - oscillation;
  }

  const colorFn = COLOR_SCHEMES[params.colorScheme] || COLOR_SCHEMES["iron-filings"];

  // Draw field strength visualization (subtle background)
  if (params.showFieldStrength) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const sampleStep = 4; // Lower resolution for performance

    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        const field = calculateField(x, y, magnets);
        const normalizedStrength = Math.min(1, field.strength * 50);

        // Create subtle glow effect
        const intensity = Math.floor(normalizedStrength * 30);
        const r = params.colorScheme === "heat-map" 
          ? Math.floor(normalizedStrength * 100)
          : intensity;
        const g = params.colorScheme === "heat-map"
          ? Math.floor((1 - normalizedStrength) * 50)
          : intensity;
        const b = params.colorScheme === "heat-map"
          ? Math.floor((1 - normalizedStrength) * 100)
          : intensity + 10;

        for (let dy = 0; dy < sampleStep && y + dy < height; dy++) {
          for (let dx = 0; dx < sampleStep && x + dx < width; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Draw field lines emanating from north poles
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const lineCount = params.fieldLineDensity;

  magnets.forEach((magnet, magnetIdx) => {
    if (magnet.polarity < 0) return; // Only start from north poles

    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * 2 * Math.PI;
      const startRadius = 20;
      const startX = magnet.x + Math.cos(angle) * startRadius;
      const startY = magnet.y + Math.sin(angle) * startRadius;

      // Trace in both directions
      const forwardPoints = traceFieldLine(startX, startY, magnets, 1, 400, 2.5);
      const backwardPoints = traceFieldLine(startX, startY, magnets, -1, 100, 2);

      const allPoints = [...backwardPoints.reverse(), ...forwardPoints];

      if (allPoints.length < 5) continue;

      // Draw the field line with varying opacity based on strength
      ctx.beginPath();
      ctx.moveTo(allPoints[0].x, allPoints[0].y);

      for (let j = 1; j < allPoints.length; j++) {
        const point = allPoints[j];
        ctx.lineTo(point.x, point.y);
      }

      // Color based on field strength at the start
      const avgStrength = allPoints.reduce((sum, p) => sum + p.strength, 0) / allPoints.length;
      const normalizedStrength = Math.min(1, avgStrength * 100);

      let strokeColor: string;
      if (params.colorScheme === "neon") {
        strokeColor = getNeonColor(i % 4, 0.4 + normalizedStrength * 0.6);
      } else if (params.colorScheme === "aurora") {
        const hue = (i / lineCount * 180 + time * 0.05) % 360;
        strokeColor = `hsla(${hue}, 80%, 60%, ${0.3 + normalizedStrength * 0.7})`;
      } else if (params.colorScheme === "heat-map") {
        const hue = (1 - normalizedStrength) * 240;
        strokeColor = `hsla(${hue}, 100%, 50%, ${0.4 + normalizedStrength * 0.6})`;
      } else if (params.colorScheme === "monochrome") {
        const gray = Math.floor(normalizedStrength * 200 + 55);
        strokeColor = `rgba(${gray}, ${gray}, ${gray}, ${0.4 + normalizedStrength * 0.6})`;
      } else {
        // Iron filings - metallic gradient
        const intensity = Math.floor(180 + normalizedStrength * 75);
        strokeColor = `rgba(${intensity}, ${intensity}, ${intensity + 10}, ${0.3 + normalizedStrength * 0.7})`;
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = params.lineThickness * (0.5 + normalizedStrength);
      ctx.stroke();
    }
  });

  // Draw particle tracers (animated iron filings)
  if (params.animateField && params.particleTracers > 0) {
    const particles: Particle[] = [];

    // Initialize particles along field lines
    for (let i = 0; i < params.particleTracers; i++) {
      const magnet = magnets.find(m => m.polarity > 0) || magnets[0];
      const angle = (i / params.particleTracers) * 2 * Math.PI;
      const offset = (time * 0.05 + i * 50) % 400;

      const startX = magnet.x + Math.cos(angle) * 25;
      const startY = magnet.y + Math.sin(angle) * 25;

      const points = traceFieldLine(startX, startY, magnets, 1, offset, 2);
      const pos = points[points.length - 1] || { x: startX, y: startY };

      const field = calculateField(pos.x, pos.y, magnets);
      const norm = normalize(field.bx, field.by);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2 + field.strength * 500, 0, Math.PI * 2);

      let particleColor: string;
      if (params.colorScheme === "neon") {
        particleColor = getNeonColor(i % 4, 0.8);
      } else if (params.colorScheme === "aurora") {
        const hue = (i / params.particleTracers * 180 + time * 0.1) % 360;
        particleColor = `hsla(${hue}, 90%, 70%, 0.9)`;
      } else {
        particleColor = `rgba(255, 255, 255, ${0.5 + field.strength * 1000})`;
      }

      ctx.fillStyle = particleColor;
      ctx.fill();

      // Draw small line showing field direction
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + norm.x * 8, pos.y + norm.y * 8);
      ctx.strokeStyle = particleColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Draw magnets
  magnets.forEach((magnet) => {
    const isNorth = magnet.polarity > 0;

    // Magnet body
    ctx.beginPath();
    ctx.arc(magnet.x, magnet.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = isNorth ? "#cc3333" : "#3333cc";
    ctx.fill();

    // Glow effect
    const gradient = ctx.createRadialGradient(
      magnet.x, magnet.y, 5,
      magnet.x, magnet.y, 30
    );
    gradient.addColorStop(0, isNorth ? "rgba(255, 100, 100, 0.5)" : "rgba(100, 100, 255, 0.5)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.beginPath();
    ctx.arc(magnet.x, magnet.y, 30, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isNorth ? "N" : "S", magnet.x, magnet.y);

    // Outer ring
    ctx.beginPath();
    ctx.arc(magnet.x, magnet.y, 20, 0, Math.PI * 2);
    ctx.strokeStyle = isNorth ? "#ff6666" : "#6666ff";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Draw legend/info
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Field Lines: ${lineCount * magnets.filter(m => m.polarity > 0).length}`, 10, height - 30);
  ctx.fillText(`Magnets: ${params.magnetCount}`, 10, height - 15);
}

export const magneticField: ArtGenerator = {
  name: "Magnetic Field Lines",
  description: "Visualize the invisible magnetic fields around magnets. Field lines show the direction and strength of magnetic forces, similar to iron filings on paper.",
  params: {
    magnetCount: {
      name: "Magnet Count",
      type: "select",
      options: ["1", "2", "3", "4"],
      default: "2",
    },
    fieldLineDensity: {
      name: "Field Line Density",
      type: "range",
      min: 10,
      max: 80,
      step: 5,
      default: 40,
    },
    lineThickness: {
      name: "Line Thickness",
      type: "range",
      min: 0.5,
      max: 4,
      step: 0.5,
      default: 1.5,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["iron-filings", "heat-map", "neon", "aurora", "monochrome"],
      default: "iron-filings",
    },
    showFieldStrength: {
      name: "Show Field Strength",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    animateField: {
      name: "Animate Field",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    particleTracers: {
      name: "Particle Tracers",
      type: "range",
      min: 0,
      max: 150,
      step: 10,
      default: 50,
    },
    backgroundStyle: {
      name: "Background",
      type: "select",
      options: ["dark", "black", "navy", "paper"],
      default: "dark",
    },
  },
  generate: (ctx, params, time) => {
    renderMagneticField(ctx, params as MagneticFieldParams, time);
  },
};
