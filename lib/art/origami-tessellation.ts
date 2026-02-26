import { ArtGenerator, ArtParams, fillCanvas, hexToRgb } from "./core";

export interface OrigamiTessellationParams extends ArtParams {
  pattern: string;
  foldAngle: number;
  gridSize: number;
  amplitude: number;
  colorScheme: string;
  showCreases: number;
  lighting: number;
  animateFold: number;
}

export const origamiTessellationDefaultParams: OrigamiTessellationParams = {
  pattern: "miura",
  foldAngle: 45,
  gridSize: 12,
  amplitude: 30,
  colorScheme: "washi",
  showCreases: 1,
  lighting: 0.7,
  animateFold: 1,
};

// Color schemes inspired by traditional Japanese washi paper
const COLOR_SCHEMES: Record<string, { light: string; mid: string; dark: string; shadow: string; crease: string }> = {
  washi: { light: "#f5f0e6", mid: "#e8dcc4", dark: "#d4c4a8", shadow: "#8b7355", crease: "#5c4a3d" },
  indigo: { light: "#e8eef2", mid: "#b8c9d9", dark: "#6b8fa8", shadow: "#2e5266", crease: "#1a333d" },
  sakura: { light: "#fdf2f4", mid: "#f5d6dd", dark: "#e8b4c0", shadow: "#c97a8f", crease: "#8b4557" },
  matcha: { light: "#f2f5e8", mid: "#d4dcc4", dark: "#9db08c", shadow: "#5a7a4a", crease: "#3d5233" },
  kuro: { light: "#e8e8e8", mid: "#a8a8a8", dark: "#696969", shadow: "#2a2a2a", crease: "#0a0a0a" },
  gold: { light: "#faf6e8", mid: "#f0e6c4", dark: "#dcc88b", shadow: "#b89b4a", crease: "#8b7355" },
  sunset: { light: "#fff0e6", mid: "#ffc9a8", dark: "#ff8c5c", shadow: "#cc4a1a", crease: "#8b2d0a" },
};

// 3D point with normal
interface Vertex3D {
  x: number;
  y: number;
  z: number;
  nx: number;
  ny: number;
  nz: number;
}

// Project 3D point to 2D with perspective
function project3D(
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  rotationX: number,
  rotationY: number
): { x: number; y: number; depth: number } {
  // Apply rotation
  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);

  // Rotate around X axis
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;

  // Rotate around Y axis
  const x2 = x * cosY + z1 * sinY;
  const z2 = -x * sinY + z1 * cosY;

  // Perspective projection
  const perspective = 800;
  const scale = perspective / (perspective + z2 + 400);

  return {
    x: width / 2 + x2 * scale,
    y: height / 2 + y1 * scale,
    depth: z2,
  };
}

// Calculate lighting based on normal and light direction
function calculateLighting(
  nx: number,
  ny: number,
  nz: number,
  lightX: number,
  lightY: number,
  lightZ: number,
  intensity: number
): number {
  // Normalize light vector
  const lightLen = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ);
  lightX /= lightLen;
  lightY /= lightLen;
  lightZ /= lightLen;

  // Dot product for diffuse lighting
  let dot = nx * lightX + ny * lightY + nz * lightZ;
  dot = Math.max(0, dot);

  // Ambient + diffuse
  return 0.3 + 0.7 * dot * intensity;
}

// Interpolate color
function interpolateColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r},${g},${b})`;
}

// Miura-ori pattern (space-filling rigid origami)
function miuraOri(
  u: number,
  v: number,
  params: OrigamiTessellationParams,
  time: number
): Vertex3D {
  const { foldAngle, amplitude, animateFold } = params;
  const angleRad = ((foldAngle * Math.PI) / 180) * (animateFold > 0.5 ? 1 + 0.3 * Math.sin(time * 0.5) : 1);

  // Miura-ori parametric equations
  const a = amplitude;
  const x = u * a;
  const y = v * a;

  // Zigzag pattern in both directions
  const phaseU = Math.sin(u * Math.PI);
  const phaseV = Math.sin(v * Math.PI);

  // Height based on alternating mountain/valley folds
  const z = a * Math.sin(angleRad) * phaseU * phaseV;

  // Calculate normal via partial derivatives
  const du = 0.01;
  const dv = 0.01;
  const zu = a * Math.sin(angleRad) * Math.sin((u + du) * Math.PI) * phaseV;
  const zv = a * Math.sin(angleRad) * phaseU * Math.sin((v + dv) * Math.PI);

  const dx_du = a;
  const dy_dv = a;
  const dz_du = (zu - z) / du;
  const dz_dv = (zv - z) / dv;

  // Cross product for normal
  const nx = -dz_du;
  const ny = -dz_dv;
  const nz = 1;
  const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);

  return { x, y, z, nx: nx / nLen, ny: ny / nLen, nz: nz / nLen };
}

// Waterbomb tessellation
function waterbomb(
  u: number,
  v: number,
  params: OrigamiTessellationParams,
  time: number
): Vertex3D {
  const { foldAngle, amplitude, animateFold } = params;
  const angleRad = ((foldAngle * Math.PI) / 180) * (animateFold > 0.5 ? 1 + 0.2 * Math.sin(time * 0.7) : 1);

  const a = amplitude;
  const period = 2; // Repeat every 2 units

  // Local coordinates within cell
  const uLocal = ((u % period) + period) % period;
  const vLocal = ((v % period) + period) % period;

  // Waterbomb cell geometry
  let z = 0;
  const centerDist = Math.sqrt((uLocal - 1) ** 2 + (vLocal - 1) ** 2);

  if (centerDist < 0.8) {
    // Central pyramid
    const height = a * Math.sin(angleRad);
    z = height * (1 - centerDist / 0.8);
  } else {
    // Surrounding valleys
    const edgeDist = Math.min(
      Math.abs(uLocal - 1),
      Math.abs(vLocal - 1),
      Math.sqrt((uLocal - 1) ** 2 + (vLocal - 1) ** 2) - 0.8
    );
    z = -a * 0.3 * Math.sin(angleRad) * Math.max(0, 1 - edgeDist);
  }

  const x = u * a;
  const y = v * a;

  // Approximate normal
  const nx = (uLocal - 1) * 0.3;
  const ny = (vLocal - 1) * 0.3;
  const nz = 1;
  const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);

  return { x, y, z, nx: nx / nLen, ny: ny / nLen, nz: nz / nLen };
}

// Hexagonal tessellation (honeycomb)
function hexagonal(
  u: number,
  v: number,
  params: OrigamiTessellationParams,
  time: number
): Vertex3D {
  const { foldAngle, amplitude, animateFold } = params;
  const angleRad = ((foldAngle * Math.PI) / 180) * (animateFold > 0.5 ? 1 + 0.25 * Math.sin(time * 0.6) : 1);

  const a = amplitude;

  // Convert to hexagonal coordinates
  const x = u * a;
  const y = v * a;

  // Hexagon pattern
  const hexU = u * Math.sqrt(3) / 2;
  const hexV = v + (Math.floor(u) % 2) * 0.5;

  const hexX = hexU - Math.floor(hexU);
  const hexY = hexV - Math.floor(hexV);

  // Distance from hexagon center
  const centerX = 0.5;
  const centerY = 0.5;
  const dist = Math.sqrt((hexX - centerX) ** 2 + (hexY - centerY) ** 2);

  // Height based on hexagonal pattern
  const height = a * Math.sin(angleRad);
  const z = height * Math.cos(dist * Math.PI * 2) * Math.exp(-dist * 2);

  // Normal approximation
  const nx = (hexX - centerX) * 0.5;
  const ny = (hexY - centerY) * 0.5;
  const nz = 1;
  const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);

  return { x, y, z, nx: nx / nLen, ny: ny / nLen, nz: nz / nLen };
}

// Yoshimura pattern (cylindrical folding)
function yoshimura(
  u: number,
  v: number,
  params: OrigamiTessellationParams,
  time: number
): Vertex3D {
  const { foldAngle, amplitude, animateFold } = params;
  const angleRad = ((foldAngle * Math.PI) / 180) * (animateFold > 0.5 ? 1 + 0.3 * Math.cos(time * 0.4) : 1);

  const a = amplitude;
  const x = u * a;
  const y = v * a;

  // Yoshimura pattern: alternating diagonal folds
  const diagonal = (u + v) % 2 < 1;
  const antiDiagonal = (u - v) % 2 < 1;

  // Create ridge pattern
  const ridgeHeight = a * Math.sin(angleRad);
  let z = 0;

  if (diagonal && !antiDiagonal) {
    z = ridgeHeight * Math.sin((u + v) * Math.PI);
  } else if (!diagonal && antiDiagonal) {
    z = -ridgeHeight * Math.sin((u - v) * Math.PI);
  } else {
    z = ridgeHeight * 0.3 * Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
  }

  // Normal
  const nx = Math.sin((u + v) * Math.PI) * 0.3;
  const ny = Math.sin((u - v) * Math.PI) * 0.3;
  const nz = 1;
  const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);

  return { x, y, z, nx: nx / nLen, ny: ny / nLen, nz: nz / nLen };
}

// Square twist pattern
function squareTwist(
  u: number,
  v: number,
  params: OrigamiTessellationParams,
  time: number
): Vertex3D {
  const { foldAngle, amplitude, animateFold } = params;
  const angleRad = ((foldAngle * Math.PI) / 180) * (animateFold > 0.5 ? 1 + 0.2 * Math.sin(time * 0.8) : 1);

  const a = amplitude;
  const period = 2;

  const uLocal = ((u % period) + period) % period;
  const vLocal = ((v % period) + period) % period;

  const x = u * a;
  const y = v * a;

  // Square twist geometry
  const centerU = 1;
  const centerV = 1;
  const dist = Math.max(Math.abs(uLocal - centerU), Math.abs(vLocal - centerV));

  let z = 0;
  const twistAmount = Math.sin(angleRad);

  if (dist < 0.5) {
    // Central twisted square
    const angle = Math.atan2(vLocal - centerV, uLocal - centerU);
    z = a * twistAmount * (0.5 - dist) * Math.cos(angle * 2);
  } else if (dist < 1.2) {
    // Surrounding pleats
    const pleatPhase = (dist - 0.5) / 0.7;
    z = -a * twistAmount * 0.5 * Math.sin(pleatPhase * Math.PI);
  }

  const nx = (uLocal - centerU) * 0.3;
  const ny = (vLocal - centerV) * 0.3;
  const nz = 1;
  const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);

  return { x, y, z, nx: nx / nLen, ny: ny / nLen, nz: nz / nLen };
}

// Get pattern function
function getPatternFunction(pattern: string) {
  switch (pattern) {
    case "miura":
      return miuraOri;
    case "waterbomb":
      return waterbomb;
    case "hexagonal":
      return hexagonal;
    case "yoshimura":
      return yoshimura;
    case "square-twist":
      return squareTwist;
    default:
      return miuraOri;
  }
}

export function renderOrigamiTessellation(
  ctx: CanvasRenderingContext2D,
  params: OrigamiTessellationParams,
  time: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  const {
    pattern,
    gridSize,
    colorScheme,
    showCreases,
    lighting,
  } = params;

  const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.washi;

  // Background
  fillCanvas(ctx, colors.light, width, height);

  // Light direction (animated)
  const lightX = Math.sin(time * 0.3);
  const lightY = -0.5;
  const lightZ = 1;

  // View rotation (gentle auto-rotation)
  const rotationX = -0.3 + Math.sin(time * 0.2) * 0.1;
  const rotationY = time * 0.1;

  const patternFn = getPatternFunction(pattern);
  const resolution = Math.max(8, Math.min(32, Math.floor(gridSize)));

  // Generate grid of vertices
  const vertices: Vertex3D[][] = [];
  for (let i = 0; i <= resolution; i++) {
    vertices[i] = [];
    for (let j = 0; j <= resolution; j++) {
      const u = (i / resolution) * 10 - 5;
      const v = (j / resolution) * 10 - 5;
      vertices[i][j] = patternFn(u, v, params, time);
    }
  }

  // Collect faces for depth sorting
  interface Face {
    points: { x: number; y: number; depth: number }[];
    avgDepth: number;
    color: string;
    crease: boolean;
  }
  const faces: Face[] = [];

  // Generate faces
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const v00 = vertices[i][j];
      const v10 = vertices[i + 1][j];
      const v11 = vertices[i + 1][j + 1];
      const v01 = vertices[i][j + 1];

      // Project vertices
      const p00 = project3D(v00.x, v00.y, v00.z, width, height, rotationX, rotationY);
      const p10 = project3D(v10.x, v10.y, v10.z, width, height, rotationX, rotationY);
      const p11 = project3D(v11.x, v11.y, v11.z, width, height, rotationX, rotationY);
      const p01 = project3D(v01.x, v01.y, v01.z, width, height, rotationX, rotationY);

      // Calculate face normal (average of vertices)
      const avgNx = (v00.nx + v10.nx + v11.nx + v01.nx) / 4;
      const avgNy = (v00.ny + v10.ny + v11.ny + v01.ny) / 4;
      const avgNz = (v00.nz + v10.nz + v11.nz + v01.nz) / 4;

      // Calculate lighting
      const light = calculateLighting(avgNx, avgNy, avgNz, lightX, lightY, lightZ, lighting);

      // Determine color based on height and lighting
      const avgZ = (v00.z + v10.z + v11.z + v01.z) / 4;
      const heightFactor = (avgZ / params.amplitude + 1) / 2; // Normalize to 0-1

      let baseColor: string;
      if (heightFactor > 0.6) {
        baseColor = colors.light;
      } else if (heightFactor > 0.3) {
        baseColor = colors.mid;
      } else if (heightFactor > 0) {
        baseColor = colors.dark;
      } else {
        baseColor = colors.shadow;
      }

      // Apply lighting
      const litColor = interpolateColor("#000000", baseColor, light);

      // Average depth for sorting
      const avgDepth = (p00.depth + p10.depth + p11.depth + p01.depth) / 4;

      faces.push({
        points: [p00, p10, p11, p01],
        avgDepth,
        color: litColor,
        crease: false,
      });

      // Add crease lines if enabled
      if (showCreases > 0.5) {
        // Diagonal creases for visual interest
        const creaseLight = light * 0.5;
        const creaseColor = interpolateColor("#000000", colors.crease, creaseLight);

        faces.push({
          points: [p00, p11],
          avgDepth: avgDepth + 0.1,
          color: creaseColor,
          crease: true,
        });
      }
    }
  }

  // Sort faces by depth (back to front)
  faces.sort((a, b) => b.avgDepth - a.avgDepth);

  // Render faces
  ctx.lineWidth = 1;
  for (const face of faces) {
    if (face.crease) {
      // Draw crease line
      if (face.points.length === 2) {
        ctx.strokeStyle = face.color;
        ctx.beginPath();
        ctx.moveTo(face.points[0].x, face.points[0].y);
        ctx.lineTo(face.points[1].x, face.points[1].y);
        ctx.stroke();
      }
    } else {
      // Draw filled quad
      ctx.fillStyle = face.color;
      ctx.beginPath();
      ctx.moveTo(face.points[0].x, face.points[0].y);
      for (let i = 1; i < face.points.length; i++) {
        ctx.lineTo(face.points[i].x, face.points[i].y);
      }
      ctx.closePath();
      ctx.fill();

      // Subtle edge
      ctx.strokeStyle = interpolateColor(face.color, colors.crease, 0.1);
      ctx.stroke();
    }
  }

  // Add subtle paper texture overlay
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = "rgba(139, 115, 85, 0.03)";
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

export const origamiTessellation: ArtGenerator = {
  name: "Origami Tessellation",
  description:
    "Mathematical paper folding patterns inspired by traditional Japanese origami. Features Miura-ori, waterbomb, hexagonal, Yoshimura, and square twist tessellations with realistic 3D shading and washi paper textures.",
  params: {
    pattern: {
      name: "Pattern",
      type: "select",
      options: ["miura", "waterbomb", "hexagonal", "yoshimura", "square-twist"],
      default: "miura",
    },
    foldAngle: {
      name: "Fold Angle",
      type: "range",
      min: 15,
      max: 75,
      step: 5,
      default: 45,
    },
    gridSize: {
      name: "Grid Size",
      type: "range",
      min: 8,
      max: 24,
      step: 2,
      default: 12,
    },
    amplitude: {
      name: "Fold Depth",
      type: "range",
      min: 15,
      max: 50,
      step: 5,
      default: 30,
    },
    colorScheme: {
      name: "Paper Style",
      type: "select",
      options: ["washi", "indigo", "sakura", "matcha", "kuro", "gold", "sunset"],
      default: "washi",
    },
    showCreases: {
      name: "Show Creases",
      type: "range",
      min: 0,
      max: 1,
      step: 1,
      default: 1,
    },
    lighting: {
      name: "Lighting",
      type: "range",
      min: 0.3,
      max: 1,
      step: 0.1,
      default: 0.7,
    },
    animateFold: {
      name: "Animate",
      type: "range",
      min: 0,
      max: 1,
      step: 1,
      default: 1,
    },
  },
  generate: renderOrigamiTessellation,
  meta: {
    category: "geometric",
    complexity: "complex",
    tags: ["animated", "geometric", "ordered", "detailed"],
    created: "2024-02-26",
  },
};
