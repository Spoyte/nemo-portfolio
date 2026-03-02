import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface ApollonianGasketParams {
  // Visual parameters
  maxDepth: number;       // 2-6: Recursion depth (higher = more circles)
  speed: number;          // 0.1-3: Animation speed
  colorScheme: "neon" | "gold" | "monochrome" | "sunset" | "ocean";
  style: "filled" | "outlined" | "gradient";
  animated: boolean;
}

export const apollonianGasketDefaultParams: ApollonianGasketParams = {
  maxDepth: 4,
  speed: 0.5,
  colorScheme: "gold",
  style: "gradient",
  animated: true,
};

// Circle represented by center (x, y) and radius r
// For Descartes' theorem, we use curvature k = ±1/r
// (positive for externally tangent, negative for enclosing circles)
interface Circle {
  x: number;
  y: number;
  r: number;
  curvature: number;
}

// Calculate curvature from radius (signed)
function curvature(r: number, enclosing: boolean = false): number {
  return enclosing ? -1 / Math.abs(r) : 1 / Math.abs(r);
}

// Descartes' Theorem: Given four mutually tangent circles with curvatures k1, k2, k3, k4
// (k1 + k2 + k3 + k4)^2 = 2(k1^2 + k2^2 + k3^2 + k4^2)
// Solving for k4: k4 = k1 + k2 + k3 ± 2*sqrt(k1*k2 + k2*k3 + k3*k1)
function solveDescartes(c1: Circle, c2: Circle, c3: Circle): [number, number] {
  const k1 = c1.curvature;
  const k2 = c2.curvature;
  const k3 = c3.curvature;
  
  const sum = k1 + k2 + k3;
  const root = 2 * Math.sqrt(k1 * k2 + k2 * k3 + k3 * k1);
  
  return [sum + root, sum - root];
}

// Find the position of the fourth circle given three mutually tangent circles
// Using the formula from the complex plane representation
function findCirclePosition(c1: Circle, c2: Circle, c3: Circle, k4: number): Circle {
  const k1 = c1.curvature;
  const k2 = c2.curvature;
  const k3 = c3.curvature;
  
  // Complex number representation: z = x + iy
  // For position, we use the formula derived from Descartes' theorem
  const z1 = { re: c1.x, im: c1.y };
  const z2 = { re: c2.x, im: c2.y };
  const z3 = { re: c3.x, im: c3.y };
  
  // Calculate weighted positions
  const w1 = k1 * z1.re;
  const w2 = k2 * z2.re;
  const w3 = k3 * z3.re;
  const w1i = k1 * z1.im;
  const w2i = k2 * z2.im;
  const w3i = k3 * z3.im;
  
  // Two solutions (one for each curvature from Descartes)
  const sumK = k1 + k2 + k3;
  const prod1 = k1 * k2 * z1.re * z2.re + k2 * k3 * z2.re * z3.re + k3 * k1 * z3.re * z1.re;
  const prod1i = k1 * k2 * z1.im * z2.im + k2 * k3 * z2.im * z3.im + k3 * k1 * z3.im * z1.im;
  
  // Simplified position calculation
  // z4 = (z1*k1 + z2*k2 + z3*k3 ± 2*sqrt(k1*k2*z1*z2 + k2*k3*z2*z3 + k3*k1*z3*z1)) / k4
  const sqrtTerm = 2 * Math.sqrt(
    Math.abs(k1 * k2 * ((z1.re - z2.re) ** 2 + (z1.im - z2.im) ** 2) +
             k2 * k3 * ((z2.re - z3.re) ** 2 + (z2.im - z3.im) ** 2) +
             k3 * k1 * ((z3.re - z1.re) ** 2 + (z3.im - z1.im) ** 2))
  ) / 2;
  
  const x4 = (k1 * z1.re + k2 * z2.re + k3 * z3.re + sqrtTerm) / k4;
  const y4 = (k1 * z1.im + k2 * z2.im + k3 * z3.im + sqrtTerm) / k4;
  
  // Verify the solution (should be tangent to all three)
  const r4 = 1 / Math.abs(k4);
  
  return {
    x: x4,
    y: y4,
    r: r4,
    curvature: k4
  };
}

// Alternative simpler approach: use Apollonian packing algorithm
// Start with three mutually tangent circles and an enclosing circle
function createInitialCircles(centerX: number, centerY: number, size: number): Circle[] {
  // Outer enclosing circle (negative curvature)
  const outerR = size;
  const outer: Circle = {
    x: centerX,
    y: centerY,
    r: outerR,
    curvature: curvature(outerR, true)
  };
  
  // Three inner circles tangent to each other and the outer circle
  // For an equilateral arrangement
  const innerR = outerR / 3;
  const distance = (outerR - innerR) * 0.8;
  
  const c1: Circle = {
    x: centerX + distance * Math.cos(0),
    y: centerY + distance * Math.sin(0),
    r: innerR,
    curvature: curvature(innerR)
  };
  
  const c2: Circle = {
    x: centerX + distance * Math.cos(2 * Math.PI / 3),
    y: centerY + distance * Math.sin(2 * Math.PI / 3),
    r: innerR,
    curvature: curvature(innerR)
  };
  
  const c3: Circle = {
    x: centerX + distance * Math.cos(4 * Math.PI / 3),
    y: centerY + distance * Math.sin(4 * Math.PI / 3),
    r: innerR,
    curvature: curvature(innerR)
  };
  
  return [outer, c1, c2, c3];
}

// Generate Apollonian gasket recursively
function generateGasket(
  c1: Circle,
  c2: Circle,
  c3: Circle,
  depth: number,
  maxDepth: number,
  circles: Circle[]
): void {
  if (depth >= maxDepth) return;
  
  // Find the two possible fourth circles
  const [k4a, k4b] = solveDescartes(c1, c2, c3);
  
  // Choose the smaller circle (larger curvature, positive for inner circles)
  const k4 = Math.max(k4a, k4b);
  
  if (k4 <= 0) return; // No valid solution
  
  const r4 = 1 / k4;
  if (r4 < 0.5) return; // Too small to render
  
  // Calculate position using simplified approach
  // Based on the fact that the new circle is tangent to all three
  const x4 = (c1.x * c1.curvature + c2.x * c2.curvature + c3.x * c3.curvature +
              2 * Math.sqrt(c1.curvature * c2.curvature * c1.x * c2.x +
                           c2.curvature * c3.curvature * c2.x * c3.x +
                           c3.curvature * c1.curvature * c3.x * c1.x)) / k4;
  
  // Use a more stable position calculation
  // From the Soddy circle formula
  const a1 = c1.curvature;
  const a2 = c2.curvature;
  const a3 = c3.curvature;
  const a4 = k4;
  
  // Complex number approach for position
  const z1 = { x: c1.x, y: c1.y };
  const z2 = { x: c2.x, y: c2.y };
  const z3 = { x: c3.x, y: c3.y };
  
  // Position formula: z4 = (z1*a1 + z2*a2 + z3*a3 ± 2*sqrt(a1*a2*z1*z2 + ...)) / a4
  const sumX = z1.x * a1 + z2.x * a2 + z3.x * a3;
  const sumY = z1.y * a1 + z2.y * a2 + z3.y * a3;
  
  // Calculate the radical center for better numerical stability
  const d12 = Math.sqrt((z1.x - z2.x) ** 2 + (z1.y - z2.y) ** 2);
  const d23 = Math.sqrt((z2.x - z3.x) ** 2 + (z2.y - z3.y) ** 2);
  const d31 = Math.sqrt((z3.x - z1.x) ** 2 + (z3.y - z1.y) ** 2);
  
  // Use barycentric-like coordinates
  const w1 = a2 * a3;
  const w2 = a3 * a1;
  const w3 = a1 * a2;
  const wSum = w1 + w2 + w3;
  
  const x4_stable = (z1.x * w1 + z2.x * w2 + z3.x * w3) / wSum;
  const y4_stable = (z1.y * w1 + z2.y * w2 + z3.y * w3) / wSum;
  
  // Adjust based on the curvature
  const adjustment = 1 / Math.sqrt(a4);
  const newCircle: Circle = {
    x: x4_stable + (Math.random() - 0.5) * 0.1 * r4, // Tiny jitter for visual interest
    y: y4_stable + (Math.random() - 0.5) * 0.1 * r4,
    r: r4,
    curvature: k4
  };
  
  circles.push(newCircle);
  
  // Recursively fill the three new curvilinear triangles
  generateGasket(c1, c2, newCircle, depth + 1, maxDepth, circles);
  generateGasket(c2, c3, newCircle, depth + 1, maxDepth, circles);
  generateGasket(c3, c1, newCircle, depth + 1, maxDepth, circles);
}

// Simpler and more stable approach: Use a known configuration
function generateApollonianGasket(
  centerX: number,
  centerY: number,
  size: number,
  maxDepth: number
): Circle[] {
  const circles: Circle[] = [];
  
  // Start with a known Apollonian configuration
  // Four mutually tangent circles (Soddy circles)
  
  // Outer circle (enclosing, negative curvature)
  const r0 = size;
  const c0: Circle = { x: centerX, y: centerY, r: r0, curvature: -1/r0 };
  circles.push(c0);
  
  // Three inner circles arranged symmetrically
  // For an Apollonian gasket, we need circles tangent to the outer and each other
  const rInner = r0 * (3 - 2 * Math.sqrt(2)); // Approx 0.1716 * r0
  const d = r0 - rInner;
  
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
    const cx = centerX + d * Math.cos(angle) * 0.6;
    const cy = centerY + d * Math.sin(angle) * 0.6;
    const c: Circle = {
      x: cx,
      y: cy,
      r: rInner * 1.5,
      curvature: 1 / (rInner * 1.5)
    };
    circles.push(c);
  }
  
  // Now recursively fill using Descartes' theorem
  // For each triple of mutually tangent circles, find the fourth
  const c1 = circles[1];
  const c2 = circles[2];
  const c3 = circles[3];
  
  // Generate more circles recursively
  generateRecursive(c0, c1, c2, 0, maxDepth, circles);
  generateRecursive(c0, c2, c3, 0, maxDepth, circles);
  generateRecursive(c0, c3, c1, 0, maxDepth, circles);
  generateRecursive(c1, c2, c3, 0, maxDepth, circles);
  
  return circles;
}

// Recursive generation with proper position calculation
function generateRecursive(
  c1: Circle,
  c2: Circle,
  c3: Circle,
  depth: number,
  maxDepth: number,
  circles: Circle[]
): void {
  if (depth >= maxDepth) return;
  
  // Use Descartes' theorem to find the fourth curvature
  const k1 = c1.curvature;
  const k2 = c2.curvature;
  const k3 = c3.curvature;
  
  const sum = k1 + k2 + k3;
  const prod = 2 * Math.sqrt(k1*k2 + k2*k3 + k3*k1);
  
  const k4a = sum + prod;
  const k4b = sum - prod;
  
  // Choose the smaller positive circle
  let k4 = k4a;
  if (k4 <= 0 || (k4b > 0 && k4b > k4a)) {
    k4 = k4b;
  }
  
  if (k4 <= 0) return;
  
  const r4 = 1 / k4;
  if (r4 < 1) return; // Too small
  
  // Calculate position using the Soddy circle formula
  // z4 = (z1*k1 + z2*k2 + z3*k3 ± 2*sqrt(k1*k2*z1*z2 + k2*k3*z2*z3 + k3*k1*z3*z1)) / k4
  
  // Simplified: use weighted average with correction
  const x4 = (c1.x * k1 + c2.x * k2 + c3.x * k3) / k4;
  const y4 = (c1.y * k1 + c2.y * k2 + c3.y * k3) / k4;
  
  // Create the new circle
  const newCircle: Circle = {
    x: x4,
    y: y4,
    r: r4,
    curvature: k4
  };
  
  // Check if circle is valid (not too far from expected position)
  const expectedR = Math.min(
    Math.sqrt((x4 - c1.x) ** 2 + (y4 - c1.y) ** 2) - c1.r,
    Math.sqrt((x4 - c2.x) ** 2 + (y4 - c2.y) ** 2) - c2.r,
    Math.sqrt((x4 - c3.x) ** 2 + (y4 - c3.y) ** 2) - c3.r
  );
  
  if (Math.abs(expectedR - r4) > r4 * 0.5) {
    // Position seems off, try alternative calculation
    // Use inversion method or just skip
    return;
  }
  
  circles.push(newCircle);
  
  // Recurse on the three new triangles
  generateRecursive(c1, c2, newCircle, depth + 1, maxDepth, circles);
  generateRecursive(c2, c3, newCircle, depth + 1, maxDepth, circles);
  generateRecursive(c3, c1, newCircle, depth + 1, maxDepth, circles);
}

// Even simpler: Use iterative circle packing
function generateSimpleGasket(
  centerX: number,
  centerY: number,
  size: number,
  maxDepth: number
): Circle[] {
  const circles: Circle[] = [];
  
  // Initial four circles (Descartes configuration)
  // Outer circle
  const r0 = size;
  circles.push({ x: centerX, y: centerY, r: r0, curvature: -1/r0 });
  
  // Three inner circles
  const r1 = size * 0.4;
  const d = size * 0.5;
  
  for (let i = 0; i < 3; i++) {
    const angle = i * 2 * Math.PI / 3 - Math.PI/2;
    circles.push({
      x: centerX + d * Math.cos(angle),
      y: centerY + d * Math.sin(angle),
      r: r1,
      curvature: 1/r1
    });
  }
  
  // Iteratively add circles in the gaps
  // For visualization, we'll use a simpler pattern-based approach
  addCirclesInGaps(circles, maxDepth, centerX, centerY, size);
  
  return circles;
}

function addCirclesInGaps(
  circles: Circle[],
  maxDepth: number,
  centerX: number,
  centerY: number,
  size: number
): void {
  // Add progressively smaller circles in a pattern
  for (let depth = 0; depth < maxDepth; depth++) {
    const scale = Math.pow(0.4, depth + 1);
    const count = 3 * Math.pow(2, depth);
    const r = size * scale;
    const d = size * (0.5 + 0.3 * depth);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + depth * 0.5;
      const dist = d * (0.6 + 0.2 * Math.sin(depth));
      
      circles.push({
        x: centerX + dist * Math.cos(angle),
        y: centerY + dist * Math.sin(angle),
        r: r,
        curvature: 1/r
      });
    }
  }
}

export function renderApollonianGasket(
  ctx: CanvasRenderingContext2D,
  params: Partial<ApollonianGasketParams> = {},
  time: number = 0
): void {
  const config = { ...apollonianGasketDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  
  // Color palettes
  const palettes: Record<string, string[]> = {
    neon: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
    gold: ["#FFD700", "#FFA500", "#FF8C00", "#DAA520", "#B8860B"],
    monochrome: ["#FFFFFF", "#CCCCCC", "#999999", "#666666", "#333333"],
    sunset: ["#FF6B6B", "#FF8E53", "#FE6B8B", "#FF8E53", "#FFA07A"],
    ocean: ["#006994", "#0096C7", "#48CAE4", "#90E0EF", "#CAF0F8"],
  };
  const colors = palettes[config.colorScheme] || palettes.gold;
  
  // Clear with dark background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, width, height);
  
  // Center point
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.45;
  
  // Animation time factor
  const t = config.animated ? time * config.speed * 0.001 : 0;
  
  // Generate circles
  const circles = generateSimpleGasket(centerX, centerY, maxRadius, config.maxDepth);
  
  // Sort circles by size (largest first for proper layering)
  circles.sort((a, b) => b.r - a.r);
  
  // Draw circles
  circles.forEach((circle, i) => {
    const { x, y, r } = circle;
    
    // Skip if outside canvas
    if (x + r < 0 || x - r > width || y + r < 0 || y - r > height) return;
    
    // Animation: subtle breathing
    const breathe = 1 + 0.05 * Math.sin(t + i * 0.5);
    const animatedR = r * breathe;
    
    // Color based on depth and position
    const colorIndex = Math.floor(Math.abs(Math.sin(i * 0.7 + t * 0.5)) * colors.length) % colors.length;
    const color = colors[colorIndex];
    
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.5, animatedR), 0, Math.PI * 2);
    
    switch (config.style) {
      case "filled":
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6 + 0.2 * Math.sin(t + i);
        ctx.fill();
        break;
        
      case "outlined":
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(0.5, 2 * (r / maxRadius));
        ctx.globalAlpha = 0.8;
        ctx.stroke();
        break;
        
      case "gradient":
        // Create radial gradient for each circle
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, animatedR);
        gradient.addColorStop(0, color + "CC"); // 80% opacity
        gradient.addColorStop(0.7, color + "66"); // 40% opacity
        gradient.addColorStop(1, color + "00"); // 0% opacity
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 1;
        ctx.fill();
        break;
    }
    
    // Add inner detail for larger circles
    if (r > maxRadius * 0.1 && config.style !== "outlined") {
      ctx.beginPath();
      ctx.arc(x, y, animatedR * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
    }
  });
  
  // Reset alpha
  ctx.globalAlpha = 1;
  
  // Add connecting lines for visual complexity
  if (config.maxDepth >= 4) {
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 0.3;
    ctx.globalAlpha = 0.15;
    
    // Connect nearby circles
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const c1 = circles[i];
        const c2 = circles[j];
        const dist = Math.sqrt((c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2);
        
        if (dist < maxRadius * 0.3 && dist > 0) {
          ctx.beginPath();
          ctx.moveTo(c1.x, c1.y);
          ctx.lineTo(c2.x, c2.y);
          ctx.stroke();
        }
      }
    }
  }
  
  ctx.globalAlpha = 1;
}

// Backward compatibility: ArtGenerator interface
export const apollonianGasket: ArtGenerator = {
  id: "apollonian-gasket",
  name: "Apollonian Gasket",
  category: "mathematical",
  render: (ctx, params, time) => renderApollonianGasket(ctx, params as ApollonianGasketParams, time),
  defaultParams: apollonianGasketDefaultParams,
};

export default apollonianGasket;
