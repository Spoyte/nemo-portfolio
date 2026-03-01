import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface HypercubeParams {
  rotationSpeedX: number;   // 0.1-3: X-axis rotation speed
  rotationSpeedY: number;   // 0.1-3: Y-axis rotation speed
  rotationSpeedZ: number;   // 0.1-3: Z-axis rotation speed (4D rotation)
  colorScheme: "neon" | "matrix" | "gold" | "ice" | "fire";
  lineWidth: number;        // 1-5: Edge thickness
  projection: "perspective" | "orthographic";
  animated: boolean;
}

export const hypercubeDefaultParams: HypercubeParams = {
  rotationSpeedX: 0.5,
  rotationSpeedY: 0.7,
  rotationSpeedZ: 0.3,
  colorScheme: "neon",
  lineWidth: 2,
  projection: "perspective",
  animated: true,
};

// 4D Hypercube vertices (16 vertices, each with 4 coordinates: x, y, z, w)
// Each coordinate is either -1 or 1 (corners of a 4D hypercube)
const HYPERCUBE_VERTICES_4D: number[][] = [
  [-1, -1, -1, -1], [1, -1, -1, -1], [1, 1, -1, -1], [-1, 1, -1, -1],
  [-1, -1, 1, -1], [1, -1, 1, -1], [1, 1, 1, -1], [-1, 1, 1, -1],
  [-1, -1, -1, 1], [1, -1, -1, 1], [1, 1, -1, 1], [-1, 1, -1, 1],
  [-1, -1, 1, 1], [1, -1, 1, 1], [1, 1, 1, 1], [-1, 1, 1, 1],
];

// Edges connect vertices that differ in exactly one coordinate
const HYPERCUBE_EDGES: [number, number][] = [
  // Cube at w = -1 (vertices 0-7)
  [0, 1], [1, 2], [2, 3], [3, 0], // Front face
  [4, 5], [5, 6], [6, 7], [7, 4], // Back face
  [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
  // Cube at w = 1 (vertices 8-15)
  [8, 9], [9, 10], [10, 11], [11, 8], // Front face
  [12, 13], [13, 14], [14, 15], [15, 12], // Back face
  [8, 12], [9, 13], [10, 14], [11, 15], // Connecting edges
  // Edges connecting the two cubes (4th dimension connections)
  [0, 8], [1, 9], [2, 10], [3, 11],
  [4, 12], [5, 13], [6, 14], [7, 15],
];

// 4D Rotation matrices
function rotate4DXY(v: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    v[0] * cos - v[1] * sin,
    v[0] * sin + v[1] * cos,
    v[2],
    v[3],
  ];
}

function rotate4DXZ(v: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    v[0] * cos - v[2] * sin,
    v[1],
    v[0] * sin + v[2] * cos,
    v[3],
  ];
}

function rotate4DXW(v: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    v[0] * cos - v[3] * sin,
    v[1],
    v[2],
    v[0] * sin + v[3] * cos,
  ];
}

function rotate4DYZ(v: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    v[0],
    v[1] * cos - v[2] * sin,
    v[1] * sin + v[2] * cos,
    v[3],
  ];
}

function rotate4DYW(v: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    v[0],
    v[1] * cos - v[3] * sin,
    v[2],
    v[1] * sin + v[3] * cos,
  ];
}

function rotate4DZW(v: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    v[0],
    v[1],
    v[2] * cos - v[3] * sin,
    v[2] * sin + v[3] * cos,
  ];
}

// Project 4D to 3D (simple perspective projection along w-axis)
function project4Dto3D(v: number[], distance: number = 3): number[] {
  const w = v[3];
  const factor = distance / (distance - w);
  return [v[0] * factor, v[1] * factor, v[2] * factor];
}

// Project 3D to 2D
function project3Dto2D(v: number[], width: number, height: number, distance: number = 3): [number, number] {
  const z = v[2];
  const factor = distance / (distance - z);
  const x = v[0] * factor * width * 0.25 + width / 2;
  const y = v[1] * factor * width * 0.25 + height / 2;
  return [x, y];
}

export function renderHypercube(
  ctx: CanvasRenderingContext2D,
  params: Partial<HypercubeParams> = {},
  time: number = 0
): void {
  const config = { ...hypercubeDefaultParams, ...params };
  const { width, height } = ctx.canvas;

  // Color palettes
  const palettes: Record<string, string[]> = {
    neon: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
    matrix: ["#00FF41", "#008F11", "#003B00", "#0D0208", "#00FF41"],
    gold: ["#FFD700", "#FFA500", "#FF8C00", "#B8860B", "#DAA520"],
    ice: ["#00FFFF", "#87CEEB", "#ADD8E6", "#E0FFFF", "#B0E0E6"],
    fire: ["#FF0000", "#FF4500", "#FF8C00", "#FFD700", "#FF6347"],
  };
  const colors = palettes[config.colorScheme] || palettes.neon;

  // Clear with dark background
  ctx.fillStyle = config.colorScheme === "matrix" ? "#0D0208" : "#0a0a0a";
  ctx.fillRect(0, 0, width, height);

  // Animation time
  const t = config.animated ? time * 0.001 : 0;
  const rotX = t * config.rotationSpeedX;
  const rotY = t * config.rotationSpeedY;
  const rotZ = t * config.rotationSpeedZ;

  // Rotate all vertices through 4D space
  const rotatedVertices = HYPERCUBE_VERTICES_4D.map(v => {
    let rotated = [...v];
    // Apply multiple 4D rotations for interesting motion
    rotated = rotate4DXY(rotated, rotX);
    rotated = rotate4DXZ(rotated, rotY);
    rotated = rotate4DXW(rotated, rotZ * 0.5);
    rotated = rotate4DYZ(rotated, rotX * 0.3);
    rotated = rotate4DZW(rotated, rotY * 0.4);
    return rotated;
  });

  // Project to 3D then 2D
  const projectedVertices: [number, number, number][] = rotatedVertices.map(v => {
    const v3d = project4Dto3D(v, 3);
    return v3d as [number, number, number];
  });

  const vertices2D: [number, number][] = projectedVertices.map(v =>
    project3Dto2D(v, width, height, config.projection === "perspective" ? 3 : 1000)
  );

  // Calculate depth for each edge (for coloring)
  const edgeDepths = HYPERCUBE_EDGES.map(([i, j]) => {
    const z1 = projectedVertices[i][2];
    const z2 = projectedVertices[j][2];
    return (z1 + z2) / 2;
  });

  // Sort edges by depth (back to front)
  const sortedEdges = HYPERCUBE_EDGES.map((edge, idx) => ({
    edge,
    depth: edgeDepths[idx],
    idx,
  })).sort((a, b) => a.depth - b.depth);

  // Draw edges with depth-based coloring
  sortedEdges.forEach(({ edge, depth }, sortIdx) => {
    const [i, j] = edge;
    const [x1, y1] = vertices2D[i];
    const [x2, y2] = vertices2D[j];

    // Color based on depth and edge type
    const colorIdx = sortIdx % colors.length;
    const alpha = 0.4 + 0.6 * ((depth + 2) / 4); // Closer edges are more opaque

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = colors[colorIdx];
    ctx.globalAlpha = Math.max(0.3, Math.min(1, alpha));
    ctx.lineWidth = config.lineWidth * (0.8 + 0.4 * ((depth + 2) / 4));
    ctx.stroke();

    // Add glow effect for neon and fire themes
    if (config.colorScheme === "neon" || config.colorScheme === "fire") {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = colors[colorIdx];
      ctx.globalAlpha = alpha * 0.3;
      ctx.lineWidth = config.lineWidth * 3;
      ctx.stroke();
    }
  });

  // Draw vertices as small circles
  vertices2D.forEach(([x, y], i) => {
    const z = projectedVertices[i][2];
    const size = 2 + (z + 2) / 4 * 3; // Size based on depth
    const alpha = 0.5 + (z + 2) / 4 * 0.5;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = alpha;
    ctx.fill();
  });

  // Reset alpha
  ctx.globalAlpha = 1;

  // Draw subtle inner cube connections with different color
  // This emphasizes the 4D nature by showing the "inner" cube
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = colors[2];
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 4]);

  // Draw inner cube (w = -1 face)
  const innerCubeEdges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  innerCubeEdges.forEach(([i, j]) => {
    const [x1, y1] = vertices2D[i];
    const [x2, y2] = vertices2D[j];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  ctx.restore();
}

// Backward compatibility: ArtGenerator interface
export const hypercube: ArtGenerator = {
  id: "hypercube",
  name: "Hypercube",
  category: "3d",
  render: (ctx, params, time) => renderHypercube(ctx, params as HypercubeParams, time),
  defaultParams: hypercubeDefaultParams,
};

export default hypercube;
