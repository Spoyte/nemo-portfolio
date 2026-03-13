import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface MoebiusStripParams {
  // Visual parameters
  colorScheme: "neon" | "pastel" | "fire" | "ocean";
  wireframe: boolean;
  showStripes: boolean;
  rotationSpeed: number;  // 0-2: Animation speed multiplier
  meshDensity: "low" | "medium" | "high";  // Affects performance vs quality
  animated: boolean;
}

export const moebiusStripDefaultParams: MoebiusStripParams = {
  colorScheme: "neon",
  wireframe: false,
  showStripes: true,
  rotationSpeed: 1,
  meshDensity: "medium",
  animated: true,
};

// 3D Point interface
interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Projected point with depth
interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
}

// Color palettes
const palettes: Record<string, string[]> = {
  neon: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
  pastel: ["#FFB5BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"],
  fire: ["#FF0000", "#FF4500", "#FF8C00", "#FFD700", "#FF6347"],
  ocean: ["#006994", "#0096C7", "#48CAE4", "#90E0EF", "#CAF0F8"],
};

// Generate a point on the Möbius strip
// u: 0 to 2π (around the strip)
// v: -1 to 1 (across the width)
function generateMobiusPoint(u: number, v: number, radius: number = 2, width: number = 0.8): Point3D {
  const halfWidth = width * v * 0.5;
  const twist = u / 2; // The crucial half-twist

  // Base circle in XY plane
  const baseX = Math.cos(u) * radius;
  const baseY = Math.sin(u) * radius;
  const baseZ = 0;

  // Perpendicular direction with twist
  const perpX = Math.cos(u) * Math.cos(twist) * halfWidth;
  const perpY = Math.sin(u) * Math.cos(twist) * halfWidth;
  const perpZ = Math.sin(twist) * halfWidth;

  return {
    x: baseX + perpX,
    y: baseY + perpY,
    z: baseZ + perpZ,
  };
}

// 3D rotation functions
function rotateX(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
}

function rotateY(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos,
  };
}

// Project 3D point to 2D canvas
function project(point: Point3D, width: number, height: number, distance: number = 4): ProjectedPoint {
  const scale = distance / (distance + point.z * 0.3);
  return {
    x: width / 2 + point.x * scale * Math.min(width, height) * 0.25,
    y: height / 2 + point.y * scale * Math.min(width, height) * 0.25,
    scale: scale,
  };
}

// Parse hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

// Face for depth sorting
interface Face {
  p1: ProjectedPoint;
  p2: ProjectedPoint;
  p3: ProjectedPoint;
  p4: ProjectedPoint;
  z: number;
  light: number;
  u: number;
  v: number;
}

export function renderMoebiusStrip(
  ctx: CanvasRenderingContext2D,
  params: Partial<MoebiusStripParams> = {},
  time: number = 0
): void {
  const config = { ...moebiusStripDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  const colors = palettes[config.colorScheme] || palettes.neon;

  // Clear with dark background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, width, height);

  // Animation parameters
  const t = config.animated ? time * config.rotationSpeed * 0.001 : 0;
  const rotationY = t * 0.5;
  const rotationX = Math.sin(t * 0.3) * 0.3;

  // Mesh density
  const densityMap = { low: 60, medium: 120, high: 180 };
  const uSteps = densityMap[config.meshDensity];
  const vSteps = Math.floor(uSteps / 6); // Maintain aspect ratio

  // Generate mesh points
  const points: Point3D[][] = [];
  const projected: ProjectedPoint[][] = [];

  for (let i = 0; i <= uSteps; i++) {
    const u = (i / uSteps) * Math.PI * 2;
    points[i] = [];
    projected[i] = [];

    for (let j = 0; j <= vSteps; j++) {
      const v = (j / vSteps) * 2 - 1;

      let point = generateMobiusPoint(u, v);
      point = rotateX(point, rotationX);
      point = rotateY(point, rotationY);

      points[i][j] = point;
      projected[i][j] = project(point, width, height);
    }
  }

  // Generate faces for rendering
  const faces: Face[] = [];

  for (let i = 0; i < uSteps; i++) {
    for (let j = 0; j < vSteps; j++) {
      const p1 = projected[i][j];
      const p2 = projected[i + 1][j];
      const p3 = projected[i + 1][j + 1];
      const p4 = projected[i][j + 1];

      // Average depth for sorting
      const avgZ = (points[i][j].z + points[i + 1][j].z + 
                    points[i + 1][j + 1].z + points[i][j + 1].z) / 4;

      // Calculate normal for lighting
      const u1 = points[i + 1][j].x - points[i][j].x;
      const v1 = points[i + 1][j].y - points[i][j].y;
      const w1 = points[i + 1][j].z - points[i][j].z;
      const u2 = points[i][j + 1].x - points[i][j].x;
      const v2 = points[i][j + 1].y - points[i][j].y;
      const w2 = points[i][j + 1].z - points[i][j].z;

      const nx = v1 * w2 - w1 * v2;
      const ny = w1 * u2 - u1 * w2;
      const nz = u1 * v2 - v1 * u2;

      // Simple lighting from front-top
      const light = Math.max(0.3, (nz + 0.5) / 1.5);

      faces.push({
        p1, p2, p3, p4,
        z: avgZ,
        light,
        u: (i / uSteps) * Math.PI * 2,
        v: (j / vSteps) * 2 - 1,
      });
    }
  }

  // Sort faces by depth (painter's algorithm)
  faces.sort((a, b) => b.z - a.z);

  // Draw faces
  faces.forEach(face => {
    let baseColor: string;
    
    if (config.showStripes) {
      // Stripe pattern demonstrates the single-sided nature
      const stripePhase = Math.sin(face.u * 3 + time * 0.002 * config.rotationSpeed);
      const colorIndex = Math.floor(((stripePhase + 1) / 2) * colors.length) % colors.length;
      baseColor = colors[colorIndex];
    } else {
      const colorIndex = Math.floor((face.u / (Math.PI * 2)) * colors.length) % colors.length;
      baseColor = colors[colorIndex];
    }

    // Apply lighting
    const rgb = hexToRgb(baseColor);
    const litR = Math.floor(rgb.r * face.light);
    const litG = Math.floor(rgb.g * face.light);
    const litB = Math.floor(rgb.b * face.light);
    const color = `rgb(${litR}, ${litG}, ${litB})`;

    ctx.beginPath();
    ctx.moveTo(face.p1.x, face.p1.y);
    ctx.lineTo(face.p2.x, face.p2.y);
    ctx.lineTo(face.p3.x, face.p3.y);
    ctx.lineTo(face.p4.x, face.p4.y);
    ctx.closePath();

    if (config.wireframe) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
      
      // Subtle edge highlighting
      ctx.strokeStyle = `rgba(${litR}, ${litG}, ${litB}, 0.3)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  });

  // Draw center line to emphasize the single edge
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 2;

  for (let i = 0; i <= uSteps; i++) {
    const u = (i / uSteps) * Math.PI * 2;
    let point = generateMobiusPoint(u, 0);
    point = rotateX(point, rotationX);
    point = rotateY(point, rotationY);
    const proj = project(point, width, height);

    if (i === 0) {
      ctx.moveTo(proj.x, proj.y);
    } else {
      ctx.lineTo(proj.x, proj.y);
    }
  }
  ctx.stroke();
}

// Backward compatibility: ArtGenerator interface
export const moebiusStrip: ArtGenerator = {
  id: "moebius-strip",
  name: "Möbius Strip",
  category: "3d",
  description: "A true 3D parametric visualization of the Möbius strip — a surface with only one side and one boundary. Features real-time rotation, lighting, and stripe patterns that demonstrate its topological properties.",
  render: (ctx, params, time) => renderMoebiusStrip(ctx, params as MoebiusStripParams, time),
  defaultParams: moebiusStripDefaultParams,
};

export default moebiusStrip;
