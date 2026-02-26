import { ArtGenerator, ArtParams, fillCanvas } from "./core";

export interface PlasmaArcParams extends ArtParams {
  electrodeCount: number;
  arcIntensity: number;
  arcComplexity: number;
  colorScheme: string;
  arcThickness: number;
  showGlow: boolean;
  animateArcs: boolean;
  dischargeRate: number;
  backgroundStyle: string;
  turbulence: number;
}

export const plasmaArcDefaultParams: PlasmaArcParams = {
  electrodeCount: 2,
  arcIntensity: 50,
  arcComplexity: 12,
  colorScheme: "electric-blue",
  arcThickness: 2,
  showGlow: true,
  animateArcs: true,
  dischargeRate: 30,
  backgroundStyle: "dark",
  turbulence: 0.5,
};

// Color schemes for plasma visualization
const COLOR_SCHEMES: Record<string, (intensity: number, position: number) => string> = {
  "electric-blue": (i, p) => {
    const intensity = Math.min(1, i * 1.5);
    const r = Math.floor(50 + intensity * 100);
    const g = Math.floor(150 + intensity * 105);
    const b = Math.floor(255);
    return `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
  },
  "plasma-purple": (i, p) => {
    const intensity = Math.min(1, i * 1.5);
    const r = Math.floor(180 + intensity * 75);
    const g = Math.floor(50 + intensity * 100);
    const b = Math.floor(200 + intensity * 55);
    return `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
  },
  "lightning-white": (i, p) => {
    const intensity = Math.min(1, i * 2);
    const v = Math.floor(200 + intensity * 55);
    return `rgba(${v}, ${v}, ${v + 20}, ${0.4 + intensity * 0.6})`;
  },
  "neon-pink": (i, p) => {
    const intensity = Math.min(1, i * 1.5);
    const r = Math.floor(255);
    const g = Math.floor(20 + intensity * 100);
    const b = Math.floor(147 + intensity * 108);
    return `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
  },
  "fire": (i, p) => {
    const intensity = Math.min(1, i * 1.5);
    const r = Math.floor(255);
    const g = Math.floor(intensity * 200);
    const b = Math.floor(intensity * 50);
    return `rgba(${r}, ${g}, ${b}, ${0.4 + intensity * 0.6})`;
  },
  "rainbow": (i, p) => {
    const hue = (p * 360 + i * 60) % 360;
    const intensity = Math.min(1, i * 1.5);
    return `hsla(${hue}, 90%, 60%, ${0.3 + intensity * 0.7})`;
  },
};

interface Electrode {
  x: number;
  y: number;
  charge: number; // +1 = positive, -1 = negative
  voltage: number;
  radius: number;
}

interface ArcSegment {
  x: number;
  y: number;
  intensity: number;
}

// Generate a lightning arc using midpoint displacement
function generateArc(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  complexity: number,
  turbulence: number,
  seed: number
): ArcSegment[] {
  const points: ArcSegment[] = [{ x: startX, y: startY, intensity: 1 }];
  
  // Recursive midpoint displacement
  function displace(
    x1: number, y1: number,
    x2: number, y2: number,
    depth: number,
    maxDepth: number
  ): void {
    if (depth >= maxDepth) {
      points.push({ x: x2, y: y2, intensity: 1 - depth / (maxDepth + 2) });
      return;
    }
    
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Calculate perpendicular displacement
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / dist;
    const perpY = dx / dist;
    
    // Random displacement with decreasing magnitude
    const displacement = (Math.random() - 0.5) * dist * turbulence * (1 - depth / maxDepth);
    
    const newX = midX + perpX * displacement;
    const newY = midY + perpY * displacement;
    
    // Recursively process both halves
    displace(x1, y1, newX, newY, depth + 1, maxDepth);
    displace(newX, newY, x2, y2, depth + 1, maxDepth);
  }
  
  displace(startX, startY, endX, endY, 0, complexity);
  
  return points;
}

// Generate branching lightning
function generateBranchingArc(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  complexity: number,
  turbulence: number,
  branchProbability: number,
  maxBranches: number
): ArcSegment[][] {
  const branches: ArcSegment[][] = [];
  const mainArc = generateArc(startX, startY, endX, endY, complexity, turbulence, 0);
  branches.push(mainArc);
  
  // Generate branches from random points along main arc
  let branchCount = 0;
  for (let i = 1; i < mainArc.length - 1 && branchCount < maxBranches; i++) {
    if (Math.random() < branchProbability) {
      const point = mainArc[i];
      const branchAngle = Math.random() * Math.PI * 2;
      const branchLength = Math.random() * 100 + 50;
      
      const branchEndX = point.x + Math.cos(branchAngle) * branchLength;
      const branchEndY = point.y + Math.sin(branchAngle) * branchLength;
      
      const branch = generateArc(
        point.x, point.y,
        branchEndX, branchEndY,
        Math.max(3, complexity - 2),
        turbulence * 1.5,
        i
      );
      
      // Fade branch intensity
      branch.forEach(p => {
        p.intensity *= 0.6 + Math.random() * 0.3;
      });
      
      branches.push(branch);
      branchCount++;
    }
  }
  
  return branches;
}

// Draw a single arc with glow
function drawArc(
  ctx: CanvasRenderingContext2D,
  arc: ArcSegment[],
  colorScheme: string,
  thickness: number,
  showGlow: boolean,
  time: number
): void {
  if (arc.length < 2) return;
  
  const colorFn = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES["electric-blue"];
  
  // Draw glow layers (outer to inner)
  if (showGlow) {
    for (let glowLayer = 3; glowLayer >= 1; glowLayer--) {
      ctx.beginPath();
      ctx.moveTo(arc[0].x, arc[0].y);
      
      for (let i = 1; i < arc.length; i++) {
        ctx.lineTo(arc[i].x, arc[i].y);
      }
      
      const glowWidth = thickness * (glowLayer * 3 + 1);
      const glowAlpha = 0.1 / glowLayer;
      
      ctx.strokeStyle = colorFn(0.5, 0);
      ctx.lineWidth = glowWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = glowAlpha;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  
  // Draw main arc with varying color
  for (let i = 0; i < arc.length - 1; i++) {
    const p1 = arc[i];
    const p2 = arc[i + 1];
    
    const avgIntensity = (p1.intensity + p2.intensity) / 2;
    const position = i / arc.length;
    
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    
    ctx.strokeStyle = colorFn(avgIntensity, position);
    ctx.lineWidth = thickness * (0.5 + avgIntensity);
    ctx.lineCap = "round";
    ctx.stroke();
  }
  
  // Draw bright core
  ctx.beginPath();
  ctx.moveTo(arc[0].x, arc[0].y);
  for (let i = 1; i < arc.length; i++) {
    ctx.lineTo(arc[i].x, arc[i].y);
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = Math.max(0.5, thickness * 0.3);
  ctx.stroke();
}

// Draw electrode
function drawElectrode(
  ctx: CanvasRenderingContext2D,
  electrode: Electrode,
  colorScheme: string,
  time: number
): void {
  const { x, y, charge, voltage, radius } = electrode;
  const isPositive = charge > 0;
  
  // Corona glow
  const coronaGradient = ctx.createRadialGradient(x, y, radius, x, y, radius * 4);
  const colorFn = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES["electric-blue"];
  const baseColor = colorFn(0.5, 0);
  
  coronaGradient.addColorStop(0, baseColor.replace(/[\d.]+\)$/, "0.6)"));
  coronaGradient.addColorStop(0.5, baseColor.replace(/[\d.]+\)$/, "0.2)"));
  coronaGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  
  ctx.beginPath();
  ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
  ctx.fillStyle = coronaGradient;
  ctx.fill();
  
  // Electrode body
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = isPositive ? "#ff4444" : "#4444ff";
  ctx.fill();
  
  // Metallic shine
  const shineGradient = ctx.createRadialGradient(
    x - radius * 0.3, y - radius * 0.3, 0,
    x, y, radius
  );
  shineGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  shineGradient.addColorStop(0.3, isPositive ? "rgba(255, 100, 100, 0.5)" : "rgba(100, 100, 255, 0.5)");
  shineGradient.addColorStop(1, isPositive ? "rgba(150, 50, 50, 0.8)" : "rgba(50, 50, 150, 0.8)");
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = shineGradient;
  ctx.fill();
  
  // Charge symbol
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${radius}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(isPositive ? "+" : "−", x, y + 2);
  
  // Voltage ring
  ctx.beginPath();
  ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
  ctx.strokeStyle = isPositive ? "rgba(255, 100, 100, 0.6)" : "rgba(100, 100, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Animated corona sparks
  const sparkCount = Math.floor(voltage * 8);
  for (let i = 0; i < sparkCount; i++) {
    const angle = (i / sparkCount) * Math.PI * 2 + time * 0.005 * (isPositive ? 1 : -1);
    const sparkLength = radius * (1.5 + Math.sin(time * 0.01 + i) * 0.5);
    
    const startX = x + Math.cos(angle) * radius;
    const startY = y + Math.sin(angle) * radius;
    const endX = x + Math.cos(angle) * sparkLength;
    const endY = y + Math.sin(angle) * sparkLength;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = colorFn(0.3 + Math.random() * 0.4, i / sparkCount);
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5 + Math.sin(time * 0.02 + i) * 0.3;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function renderPlasmaArc(
  ctx: CanvasRenderingContext2D,
  params: PlasmaArcParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Background
  const bgColors: Record<string, string> = {
    dark: "#0a0a0f",
    black: "#000000",
    navy: "#0a0f1a",
    purple: "#1a0a1f",
  };
  fillCanvas(ctx, bgColors[params.backgroundStyle] || "#0a0a0f", width, height);
  
  // Initialize electrodes
  const electrodes: Electrode[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  
  if (params.electrodeCount === 2) {
    const separation = Math.min(width, height) * 0.35;
    electrodes.push(
      { x: centerX - separation, y: centerY, charge: 1, voltage: 1, radius: 25 },
      { x: centerX + separation, y: centerY, charge: -1, voltage: 1, radius: 25 }
    );
  } else if (params.electrodeCount === 3) {
    const radius = Math.min(width, height) * 0.3;
    const angleOffset = time * 0.0003;
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 + angleOffset;
      electrodes.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        charge: i === 0 ? 1 : -1,
        voltage: 1,
        radius: 25,
      });
    }
  } else if (params.electrodeCount === 4) {
    const separation = Math.min(width, height) * 0.25;
    electrodes.push(
      { x: centerX - separation, y: centerY - separation, charge: 1, voltage: 1, radius: 20 },
      { x: centerX + separation, y: centerY - separation, charge: -1, voltage: 1, radius: 20 },
      { x: centerX - separation, y: centerY + separation, charge: -1, voltage: 1, radius: 20 },
      { x: centerX + separation, y: centerY + separation, charge: 1, voltage: 1, radius: 20 }
    );
  } else {
    // Single electrode with ground plane
    electrodes.push(
      { x: centerX, y: centerY - height * 0.25, charge: 1, voltage: 1.5, radius: 30 }
    );
  }
  
  // Generate and draw arcs between opposite charges
  const arcCount = Math.floor(params.arcIntensity / 10);
  const allArcs: ArcSegment[][][] = [];
  
  for (let i = 0; i < electrodes.length; i++) {
    for (let j = i + 1; j < electrodes.length; j++) {
      const e1 = electrodes[i];
      const e2 = electrodes[j];
      
      // Only arc between opposite charges
      if (e1.charge !== e2.charge) {
        for (let a = 0; a < arcCount; a++) {
          // Add some randomness to start/end points
          const offset1 = (Math.random() - 0.5) * e1.radius * 0.5;
          const offset2 = (Math.random() - 0.5) * e2.radius * 0.5;
          
          const branches = generateBranchingArc(
            e1.x + offset1,
            e1.y + offset1,
            e2.x + offset2,
            e2.y + offset2,
            params.arcComplexity,
            params.turbulence,
            0.3,
            3
          );
          
          allArcs.push(branches);
        }
      }
    }
  }
  
  // Single electrode mode: arc to random ground points
  if (params.electrodeCount === 1) {
    const groundY = height - 50;
    for (let a = 0; a < arcCount * 2; a++) {
      const groundX = centerX + (Math.random() - 0.5) * width * 0.6;
      const branches = generateBranchingArc(
        electrodes[0].x,
        electrodes[0].y + electrodes[0].radius,
        groundX,
        groundY,
        params.arcComplexity,
        params.turbulence * 1.5,
        0.4,
        4
      );
      allArcs.push(branches);
    }
    
    // Draw ground plane
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.strokeStyle = "rgba(100, 100, 120, 0.5)";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Ground hatching
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x - 10, groundY + 15);
      ctx.strokeStyle = "rgba(100, 100, 120, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  
  // Draw all arcs
  allArcs.forEach((branches, idx) => {
    const flicker = params.animateArcs 
      ? 0.7 + Math.sin(time * 0.02 + idx) * 0.3 
      : 1;
    
    if (flicker > 0.5) {
      branches.forEach(arc => {
        drawArc(
          ctx,
          arc,
          params.colorScheme,
          params.arcThickness * flicker,
          params.showGlow,
          time
        );
      });
    }
  });
  
  // Draw discharge particles
  if (params.animateArcs) {
    const particleCount = Math.floor(params.dischargeRate);
    for (let i = 0; i < particleCount; i++) {
      // Pick a random arc
      if (allArcs.length === 0) continue;
      const arcGroup = allArcs[Math.floor(Math.random() * allArcs.length)];
      if (arcGroup.length === 0) continue;
      const arc = arcGroup[0];
      if (arc.length < 2) continue;
      
      // Pick a random position along the arc
      const pos = (time * 0.001 + i / particleCount) % 1;
      const idx = Math.floor(pos * (arc.length - 1));
      const point = arc[idx];
      
      if (point) {
        // Draw spark
        const sparkSize = 2 + Math.random() * 4;
        ctx.beginPath();
        ctx.arc(point.x, point.y, sparkSize, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        
        // Spark glow
        const glowGradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, sparkSize * 3
        );
        const colorFn = COLOR_SCHEMES[params.colorScheme] || COLOR_SCHEMES["electric-blue"];
        const glowColor = colorFn(1, 0).replace(/[\d.]+\)$/, "0.5)");
        glowGradient.addColorStop(0, glowColor);
        glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, sparkSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }
    }
  }
  
  // Draw electrodes on top
  electrodes.forEach(electrode => {
    drawElectrode(ctx, electrode, params.colorScheme, time);
  });
  
  // Draw info
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Arcs: ${allArcs.length * arcCount}`, 10, height - 40);
  ctx.fillText(`Electrodes: ${params.electrodeCount}`, 10, height - 25);
  ctx.fillText(`Voltage: ${(params.arcIntensity * 1000).toLocaleString()}V`, 10, height - 10);
}

export const plasmaArc: ArtGenerator = {
  name: "Plasma Arc Discharge",
  description: "Simulate electrical arcs and plasma discharges between electrodes. Uses midpoint displacement to create realistic lightning-like patterns with branching, glow effects, and animated discharge particles.",
  params: {
    electrodeCount: {
      name: "Electrode Count",
      type: "select",
      options: ["1", "2", "3", "4"],
      default: "2",
    },
    arcIntensity: {
      name: "Arc Intensity",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 50,
    },
    arcComplexity: {
      name: "Arc Complexity",
      type: "range",
      min: 4,
      max: 20,
      step: 1,
      default: 12,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["electric-blue", "plasma-purple", "lightning-white", "neon-pink", "fire", "rainbow"],
      default: "electric-blue",
    },
    arcThickness: {
      name: "Arc Thickness",
      type: "range",
      min: 0.5,
      max: 5,
      step: 0.5,
      default: 2,
    },
    showGlow: {
      name: "Show Glow",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    animateArcs: {
      name: "Animate Arcs",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    dischargeRate: {
      name: "Discharge Rate",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 30,
    },
    backgroundStyle: {
      name: "Background",
      type: "select",
      options: ["dark", "black", "navy", "purple"],
      default: "dark",
    },
    turbulence: {
      name: "Turbulence",
      type: "range",
      min: 0.1,
      max: 1.5,
      step: 0.1,
      default: 0.5,
    },
  },
  generate: (ctx, params, time) => {
    renderPlasmaArc(ctx, params as PlasmaArcParams, time);
  },
  meta: {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "colorful", "chaotic", "futuristic"],
    created: "2026-02-27",
    dependsOn: ["magnetic-field"],
  },
};
