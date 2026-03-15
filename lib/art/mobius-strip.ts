import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface MobiusStripParams {
  // Visual parameters
  radius: number;         // 50-150: Strip radius
  width: number;          // 10-60: Strip width
  segments: number;       // 50-200: Mesh density
  twist: number;          // 0.5-2: Number of half-twists (1 = classic Möbius)
  speed: number;          // 0.1-3: Rotation speed
  colorScheme: "rainbow" | "gradient" | "gold" | "ocean" | "neon";
  showWireframe: boolean;
  showSurface: boolean;
  animated: boolean;
}

export const mobiusStripDefaultParams: MobiusStripParams = {
  radius: 100,
  width: 40,
  segments: 100,
  twist: 1,
  speed: 0.5,
  colorScheme: "rainbow",
  showWireframe: true,
  showSurface: true,
  animated: true,
};

// 3D Point type
interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Project 3D point to 2D canvas with perspective
function project3D(
  point: Point3D,
  centerX: number,
  centerY: number,
  scale: number,
  rotationX: number,
  rotationY: number
): { x: number; y: number; depth: number } {
  // Apply rotation around Y axis
  let x = point.x * Math.cos(rotationY) - point.z * Math.sin(rotationY);
  let z = point.x * Math.sin(rotationY) + point.z * Math.cos(rotationY);
  
  // Apply rotation around X axis
  let y = point.y * Math.cos(rotationX) - z * Math.sin(rotationX);
  z = point.y * Math.sin(rotationX) + z * Math.cos(rotationX);
  
  // Perspective projection
  const perspective = 800;
  const depth = perspective / (perspective + z);
  
  return {
    x: centerX + x * scale * depth,
    y: centerY + y * scale * depth,
    depth: z,
  };
}

// Generate Möbius strip point at given u, v parameters
function getMobiusPoint(
  u: number, // 0 to 2π (around the strip)
  v: number, // -1 to 1 (across the strip width)
  radius: number,
  width: number,
  twist: number
): Point3D {
  // Classic Möbius strip parametric equations with variable twist
  // twist = 1 gives classic half-twist Möbius strip
  // twist = 2 gives full-twist (two half-twists)
  
  const halfWidth = width / 2;
  const angle = u;
  const twistAngle = twist * angle / 2;
  
  // Position along the center circle
  const centerX = radius * Math.cos(angle);
  const centerY = radius * Math.sin(angle);
  const centerZ = 0;
  
  // Offset perpendicular to the center circle, with twist
  const offsetX = v * halfWidth * Math.cos(twistAngle) * Math.cos(angle);
  const offsetY = v * halfWidth * Math.cos(twistAngle) * Math.sin(angle);
  const offsetZ = v * halfWidth * Math.sin(twistAngle);
  
  return {
    x: centerX + offsetX,
    y: centerY + offsetY,
    z: centerZ + offsetZ,
  };
}

export function renderMobiusStrip(
  ctx: CanvasRenderingContext2D,
  params: Partial<MobiusStripParams> = {},
  time: number = 0
): void {
  const config = { ...mobiusStripDefaultParams, ...params };
  const { width, height } = ctx.canvas;

  // Color palettes
  const palettes: Record<string, string[]> = {
    rainbow: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF", "#06FFB4"],
    gradient: ["#FF512F", "#DD2476", "#8E2DE2", "#4A00E0", "#1E3C72"],
    gold: ["#FFD700", "#FFA500", "#FF8C00", "#DAA520", "#B8860B", "#8B6914"],
    ocean: ["#006994", "#0099CC", "#00B4D8", "#48CAE4", "#90E0EF", "#CAF0F8"],
    neon: ["#FF10F0", "#00FFF9", "#7B2D8E", "#39FF14", "#FE019A", "#00FFFF"],
  };
  const colors = palettes[config.colorScheme] || palettes.rainbow;

  // Clear with dark gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, "#0a0a0f");
  bgGradient.addColorStop(0.5, "#1a1a2e");
  bgGradient.addColorStop(1, "#0f0f1a");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Center point
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min(width, height) / 350;

  // Rotation angles
  const rotationY = config.animated ? time * config.speed * 0.0005 : 0.3;
  const rotationX = config.animated ? Math.sin(time * config.speed * 0.0003) * 0.3 : 0.2;

  // Generate mesh points
  const uSegments = config.segments;
  const vSegments = Math.floor(config.segments / 4);
  
  const mesh: { u: number; v: number; projected: { x: number; y: number; depth: number } }[][] = [];
  
  for (let i = 0; i <= uSegments; i++) {
    const u = (i / uSegments) * Math.PI * 2;
    mesh[i] = [];
    
    for (let j = 0; j <= vSegments; j++) {
      const v = (j / vSegments) * 2 - 1; // -1 to 1
      
      const point = getMobiusPoint(
        u,
        v,
        config.radius,
        config.width,
        config.twist
      );
      
      mesh[i][j] = {
        u,
        v,
        projected: project3D(point, centerX, centerY, scale, rotationX, rotationY),
      };
    }
  }

  // Collect all faces for depth sorting
  interface Face {
    points: { x: number; y: number; depth: number }[];
    avgDepth: number;
    u: number;
    color: string;
  }
  
  const faces: Face[] = [];
  
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      // Create two triangles for each quad
      const p1 = mesh[i][j];
      const p2 = mesh[i + 1][j];
      const p3 = mesh[i][j + 1];
      const p4 = mesh[i + 1][j + 1];
      
      // Triangle 1: p1, p2, p3
      const avgDepth1 = (p1.projected.depth + p2.projected.depth + p3.projected.depth) / 3;
      const colorIndex1 = Math.floor((p1.u / (Math.PI * 2)) * colors.length) % colors.length;
      
      faces.push({
        points: [p1.projected, p2.projected, p3.projected],
        avgDepth: avgDepth1,
        u: p1.u,
        color: colors[colorIndex1],
      });
      
      // Triangle 2: p2, p4, p3
      const avgDepth2 = (p2.projected.depth + p4.projected.depth + p3.projected.depth) / 3;
      const colorIndex2 = Math.floor((p2.u / (Math.PI * 2)) * colors.length) % colors.length;
      
      faces.push({
        points: [p2.projected, p4.projected, p3.projected],
        avgDepth: avgDepth2,
        u: p2.u,
        color: colors[colorIndex2],
      });
    }
  }
  
  // Sort faces by depth (painter's algorithm - draw back to front)
  faces.sort((a, b) => b.avgDepth - a.avgDepth);

  // Draw faces
  if (config.showSurface) {
    faces.forEach((face) => {
      ctx.beginPath();
      ctx.moveTo(face.points[0].x, face.points[0].y);
      ctx.lineTo(face.points[1].x, face.points[1].y);
      ctx.lineTo(face.points[2].x, face.points[2].y);
      ctx.closePath();
      
      // Gradient fill based on depth
      const depthAlpha = 0.6 + (face.avgDepth + config.radius) / (config.radius * 4) * 0.4;
      ctx.fillStyle = face.color;
      ctx.globalAlpha = Math.max(0.3, Math.min(0.9, depthAlpha));
      ctx.fill();
    });
  }

  // Draw wireframe
  if (config.showWireframe) {
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 0.5;
    
    // Draw u-lines (around the strip)
    for (let i = 0; i <= uSegments; i += 2) {
      ctx.beginPath();
      for (let j = 0; j <= vSegments; j++) {
        const p = mesh[i][j].projected;
        if (j === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }
    
    // Draw v-lines (across the strip)
    for (let j = 0; j <= vSegments; j += 2) {
      ctx.beginPath();
      for (let i = 0; i <= uSegments; i++) {
        const p = mesh[i][j].projected;
        if (i === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }
  }

  // Reset alpha
  ctx.globalAlpha = 1;

  // Draw edge highlight (the single edge of the Möbius strip)
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;
  
  // Outer edge (v = 1)
  ctx.beginPath();
  for (let i = 0; i <= uSegments; i++) {
    const p = mesh[i][vSegments].projected;
    if (i === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }
  ctx.stroke();
  
  // Inner edge (v = -1) - same as outer edge for Möbius!
  // This is the topological magic - one continuous edge
  ctx.beginPath();
  for (let i = 0; i <= uSegments; i++) {
    const p = mesh[i][0].projected;
    if (i === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }
  ctx.stroke();

  ctx.globalAlpha = 1;

  // Draw info overlay
  ctx.fillStyle = "#a0c0d0";
  ctx.font = "12px 'SF Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText(`Möbius Strip (twist: ${config.twist})`, 20, 30);
  ctx.fillText(`${uSegments}×${vSegments} mesh`, 20, 50);
}

// Backward compatibility: ArtGenerator interface
export const mobiusStrip: ArtGenerator = {
  id: "mobius-strip",
  name: "Möbius Strip",
  category: "3d",
  render: (ctx, params, time) => renderMobiusStrip(ctx, params as MobiusStripParams, time),
  defaultParams: mobiusStripDefaultParams,
};

export default mobiusStrip;
