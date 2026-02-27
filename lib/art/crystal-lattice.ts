import { ArtGenerator, ParamConfig } from "./core";

export interface CrystalLatticeParams {
  crystalCount: number;
  growthSpeed: number;
  facetDetail: number;
  colorScheme: 'quartz' | 'sapphire' | 'emerald' | 'amethyst' | 'rose' | 'ice' | 'gold';
  lightAngle: number;
  rotationSpeed: number;
  refraction: number;
}

export const crystalLatticeDefaultParams: CrystalLatticeParams = {
  crystalCount: 8,
  growthSpeed: 50,
  facetDetail: 60,
  colorScheme: 'quartz',
  lightAngle: 45,
  rotationSpeed: 30,
  refraction: 70,
};

// Crystal structure with 3D vertices
interface Crystal {
  x: number;
  y: number;
  z: number;
  size: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  growth: number;
  type: 'prism' | 'pyramid' | 'octahedron' | 'dodecahedron';
  hue: number;
  vertices: number[][];
  faces: number[][];
}

// Generate crystal vertices based on type
function generateCrystalGeometry(type: Crystal['type'], size: number): { vertices: number[][]; faces: number[][] } {
  const vertices: number[][] = [];
  const faces: number[][] = [];
  
  switch (type) {
    case 'prism':
      // Hexagonal prism
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        vertices.push([Math.cos(angle) * size, -size, Math.sin(angle) * size]);
      }
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        vertices.push([Math.cos(angle) * size * 0.7, size, Math.sin(angle) * size * 0.7]);
      }
      // Side faces
      for (let i = 0; i < 6; i++) {
        faces.push([i, (i + 1) % 6, ((i + 1) % 6) + 6, i + 6]);
      }
      // Top and bottom
      faces.push([0, 1, 2, 3, 4, 5]);
      faces.push([6, 7, 8, 9, 10, 11]);
      break;
      
    case 'pyramid':
      // Square pyramid
      vertices.push([-size, -size, -size]); // 0
      vertices.push([size, -size, -size]);  // 1
      vertices.push([size, -size, size]);   // 2
      vertices.push([-size, -size, size]);  // 3
      vertices.push([0, size * 1.5, 0]);    // 4 - apex
      faces.push([0, 1, 4]);
      faces.push([1, 2, 4]);
      faces.push([2, 3, 4]);
      faces.push([3, 0, 4]);
      faces.push([0, 3, 2, 1]);
      break;
      
    case 'octahedron':
      // Regular octahedron
      vertices.push([0, size * 1.2, 0]);    // top
      vertices.push([0, -size * 1.2, 0]);   // bottom
      vertices.push([size, 0, 0]);
      vertices.push([-size, 0, 0]);
      vertices.push([0, 0, size]);
      vertices.push([0, 0, -size]);
      faces.push([0, 2, 4]);
      faces.push([0, 4, 3]);
      faces.push([0, 3, 5]);
      faces.push([0, 5, 2]);
      faces.push([1, 4, 2]);
      faces.push([1, 3, 4]);
      faces.push([1, 5, 3]);
      faces.push([1, 2, 5]);
      break;
      
    case 'dodecahedron':
      // Simplified dodecahedron (pentagonal faces)
      const phi = (1 + Math.sqrt(5)) / 2;
      const a = size * 0.5;
      const b = size * 0.5 * phi;
      vertices.push([a, a, a]);
      vertices.push([a, a, -a]);
      vertices.push([a, -a, a]);
      vertices.push([a, -a, -a]);
      vertices.push([-a, a, a]);
      vertices.push([-a, a, -a]);
      vertices.push([-a, -a, a]);
      vertices.push([-a, -a, -a]);
      vertices.push([0, b, a/phi]);
      vertices.push([0, b, -a/phi]);
      vertices.push([0, -b, a/phi]);
      vertices.push([0, -b, -a/phi]);
      vertices.push([b, a/phi, 0]);
      vertices.push([b, -a/phi, 0]);
      vertices.push([-b, a/phi, 0]);
      vertices.push([-b, -a/phi, 0]);
      vertices.push([a/phi, 0, b]);
      vertices.push([a/phi, 0, -b]);
      vertices.push([-a/phi, 0, b]);
      vertices.push([-a/phi, 0, -b]);
      // Simplified faces - just connect nearby vertices
      faces.push([0, 8, 4, 18, 16]);
      faces.push([0, 16, 2, 10, 12]);
      faces.push([0, 12, 1, 9, 8]);
      faces.push([1, 12, 3, 11, 9]);
      faces.push([2, 16, 18, 6, 10]);
      break;
  }
  
  return { vertices, faces };
}

// Project 3D point to 2D with perspective
function project3D(
  x: number, y: number, z: number,
  width: number, height: number,
  rotationX: number, rotationY: number, rotationZ: number
): { x: number; y: number; depth: number } {
  // Apply rotations
  let rx = x;
  let ry = y;
  let rz = z;
  
  // Rotate around X
  let y1 = ry * Math.cos(rotationX) - rz * Math.sin(rotationX);
  let z1 = ry * Math.sin(rotationX) + rz * Math.cos(rotationX);
  ry = y1;
  rz = z1;
  
  // Rotate around Y
  let x1 = rx * Math.cos(rotationY) + rz * Math.sin(rotationY);
  z1 = -rx * Math.sin(rotationY) + rz * Math.cos(rotationY);
  rx = x1;
  rz = z1;
  
  // Rotate around Z
  x1 = rx * Math.cos(rotationZ) - ry * Math.sin(rotationZ);
  y1 = rx * Math.sin(rotationZ) + ry * Math.cos(rotationZ);
  rx = x1;
  ry = y1;
  
  // Perspective projection
  const fov = 400;
  const distance = 400;
  const scale = fov / (distance + rz);
  
  return {
    x: width / 2 + rx * scale,
    y: height / 2 + ry * scale,
    depth: rz
  };
}

// Calculate face normal for lighting
function calculateNormal(v1: number[], v2: number[], v3: number[]): number[] {
  const a = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
  const b = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
  
  const nx = a[1] * b[2] - a[2] * b[1];
  const ny = a[2] * b[0] - a[0] * b[2];
  const nz = a[0] * b[1] - a[1] * b[0];
  
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
  return [nx / len, ny / len, nz / len];
}

export function renderCrystalLattice(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: CrystalLatticeParams
): void {
  const { crystalCount, growthSpeed, facetDetail, colorScheme, lightAngle, rotationSpeed, refraction } = params;
  const t = time * 0.001;
  
  // Clear with deep background
  const bgColors: Record<string, string> = {
    quartz: '#0a0a0f',
    sapphire: '#000510',
    emerald: '#000a05',
    amethyst: '#0a0510',
    rose: '#100508',
    ice: '#050a10',
    gold: '#0a0805',
  };
  
  ctx.fillStyle = bgColors[colorScheme];
  ctx.fillRect(0, 0, width, height);
  
  // Color palettes for each crystal type
  const palettes: Record<string, { base: [number, number, number]; highlight: [number, number, number]; shadow: [number, number, number]; glow: string }> = {
    quartz: { base: [200, 200, 210], highlight: [255, 255, 255], shadow: [120, 120, 130], glow: 'rgba(255,255,255,0.3)' },
    sapphire: { base: [30, 60, 150], highlight: [80, 140, 255], shadow: [10, 20, 60], glow: 'rgba(80,140,255,0.4)' },
    emerald: { base: [30, 150, 80], highlight: [80, 255, 140], shadow: [10, 60, 30], glow: 'rgba(80,255,140,0.4)' },
    amethyst: { base: [120, 60, 180], highlight: [200, 140, 255], shadow: [60, 20, 90], glow: 'rgba(200,140,255,0.4)' },
    rose: { base: [200, 120, 140], highlight: [255, 180, 200], shadow: [120, 50, 70], glow: 'rgba(255,180,200,0.4)' },
    ice: { base: [180, 220, 240], highlight: [230, 250, 255], shadow: [100, 140, 180], glow: 'rgba(200,240,255,0.4)' },
    gold: { base: [200, 160, 60], highlight: [255, 220, 100], shadow: [120, 90, 20], glow: 'rgba(255,220,100,0.4)' },
  };
  
  const palette = palettes[colorScheme];
  
  // Generate crystals
  const crystals: Crystal[] = [];
  const types: Crystal['type'][] = ['prism', 'pyramid', 'octahedron', 'dodecahedron'];
  
  for (let i = 0; i < crystalCount; i++) {
    const angle = (i / crystalCount) * Math.PI * 2 + t * 0.2;
    const radius = Math.min(width, height) * 0.25;
    const cx = Math.cos(angle) * radius;
    const cy = Math.sin(angle * 0.7) * radius * 0.3;
    const cz = Math.sin(angle) * radius * 0.5;
    
    const type = types[i % types.length];
    const size = 40 + Math.sin(i * 1.5) * 20;
    
    // Growth animation
    const growthPhase = (t * growthSpeed * 0.01 + i * 0.5) % (Math.PI * 2);
    const growth = 0.3 + Math.sin(growthPhase) * 0.7;
    
    const geometry = generateCrystalGeometry(type, size * growth);
    
    crystals.push({
      x: cx,
      y: cy,
      z: cz,
      size,
      rotationX: t * rotationSpeed * 0.01 + i,
      rotationY: t * rotationSpeed * 0.015 + i * 0.5,
      rotationZ: t * rotationSpeed * 0.008,
      growth,
      type,
      hue: (i / crystalCount) * 60,
      vertices: geometry.vertices,
      faces: geometry.faces,
    });
  }
  
  // Light direction
  const lightX = Math.cos(lightAngle * Math.PI / 180) * 0.5;
  const lightY = -0.7;
  const lightZ = Math.sin(lightAngle * Math.PI / 180) * 0.5;
  
  // Collect all faces with depth for sorting
  interface RenderFace {
    points: { x: number; y: number }[];
    depth: number;
    brightness: number;
    crystalIndex: number;
  }
  
  const renderFaces: RenderFace[] = [];
  
  crystals.forEach((crystal, ci) => {
    crystal.faces.forEach(face => {
      if (face.length < 3) return;
      
      // Get vertices for this face
      const faceVertices = face.map(idx => {
        if (idx >= crystal.vertices.length) return null;
        const v = crystal.vertices[idx];
        // Apply crystal position
        return [
          v[0] + crystal.x,
          v[1] + crystal.y,
          v[2] + crystal.z
        ];
      }).filter((v): v is number[] => v !== null);
      
      if (faceVertices.length < 3) return;
      
      // Project vertices to 2D
      const projected = faceVertices.map(v => 
        project3D(v[0], v[1], v[2], width, height, crystal.rotationX, crystal.rotationY, crystal.rotationZ)
      );
      
      // Calculate average depth for sorting
      const avgDepth = projected.reduce((sum, p) => sum + p.depth, 0) / projected.length;
      
      // Calculate face normal for lighting
      const normal = calculateNormal(faceVertices[0], faceVertices[1], faceVertices[2]);
      
      // Apply crystal rotation to normal
      let nx = normal[0];
      let ny = normal[1];
      let nz = normal[2];
      
      const rx = crystal.rotationX;
      const ry = crystal.rotationY;
      const rz = crystal.rotationZ;
      
      // Rotate normal
      let ny1 = ny * Math.cos(rx) - nz * Math.sin(rx);
      let nz1 = ny * Math.sin(rx) + nz * Math.cos(rx);
      ny = ny1; nz = nz1;
      
      let nx1 = nx * Math.cos(ry) + nz * Math.sin(ry);
      nz1 = -nx * Math.sin(ry) + nz * Math.cos(ry);
      nx = nx1; nz = nz1;
      
      nx1 = nx * Math.cos(rz) - ny * Math.sin(rz);
      ny1 = nx * Math.sin(rz) + ny * Math.cos(rz);
      nx = nx1; ny = ny1;
      
      // Dot product with light direction
      const dot = nx * lightX + ny * lightY + nz * lightZ;
      const brightness = Math.max(0.1, Math.min(1, dot * 0.5 + 0.5));
      
      // Backface culling - only render faces pointing toward camera
      if (nz > 0) {
        renderFaces.push({
          points: projected.map(p => ({ x: p.x, y: p.y })),
          depth: avgDepth,
          brightness,
          crystalIndex: ci
        });
      }
    });
  });
  
  // Sort faces by depth (painter's algorithm - back to front)
  renderFaces.sort((a, b) => b.depth - a.depth);
  
  // Render faces
  renderFaces.forEach(face => {
    const { points, brightness } = face;
    
    // Interpolate color based on brightness
    const r = Math.round(palette.shadow[0] + (palette.highlight[0] - palette.shadow[0]) * brightness);
    const g = Math.round(palette.shadow[1] + (palette.highlight[1] - palette.shadow[1]) * brightness);
    const b = Math.round(palette.shadow[2] + (palette.highlight[2] - palette.shadow[2]) * brightness);
    
    // Add refraction effect
    const refractAlpha = 0.3 + (refraction / 100) * 0.4;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    
    // Fill with gradient
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 50
    );
    
    const edgeColor = `rgba(${palette.shadow[0]}, ${palette.shadow[1]}, ${palette.shadow[2]}, ${refractAlpha})`;
    const centerColor = `rgba(${r}, ${g}, ${b}, ${refractAlpha + 0.2})`;
    
    gradient.addColorStop(0, centerColor);
    gradient.addColorStop(1, edgeColor);
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Edge highlight for facets
    ctx.strokeStyle = `rgba(${palette.highlight[0]}, ${palette.highlight[1]}, ${palette.highlight[2]}, ${0.1 + brightness * 0.3})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  });
  
  // Add glow effect overlay
  const glowIntensity = refraction / 100;
  const glowGradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.min(width, height) * 0.6
  );
  glowGradient.addColorStop(0, palette.glow.replace(/[\d.]+\)$/, `${glowIntensity * 0.3})`));
  glowGradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Sparkle effects on crystal surfaces
  const sparkleCount = Math.floor(facetDetail / 5);
  for (let i = 0; i < sparkleCount; i++) {
    const sx = width / 2 + Math.cos(t * 2 + i * 3) * width * 0.3;
    const sy = height / 2 + Math.sin(t * 1.5 + i * 2.7) * height * 0.25;
    const sparkleSize = 1 + Math.sin(t * 5 + i) * 1.5;
    
    if (sparkleSize > 0.5) {
      ctx.beginPath();
      ctx.arc(sx, sy, sparkleSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${sparkleSize * 0.3})`;
      ctx.fill();
    }
  }
}

export const crystalLattice: ArtGenerator = {
  name: "Crystal Lattice",
  description: "3D crystal growth simulation with faceted geometries, light refraction, and crystalline structures that rotate and pulse with mathematical precision.",
  params: {
    crystalCount: {
      name: "Crystal Count",
      type: "range",
      min: 3,
      max: 15,
      step: 1,
      default: 8,
    },
    growthSpeed: {
      name: "Growth Speed",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 50,
    },
    facetDetail: {
      name: "Facet Detail",
      type: "range",
      min: 20,
      max: 100,
      step: 10,
      default: 60,
    },
    colorScheme: {
      name: "Crystal Type",
      type: "select",
      options: ["quartz", "sapphire", "emerald", "amethyst", "rose", "ice", "gold"],
      default: "quartz",
    },
    lightAngle: {
      name: "Light Angle",
      type: "range",
      min: 0,
      max: 360,
      step: 15,
      default: 45,
    },
    rotationSpeed: {
      name: "Rotation",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 30,
    },
    refraction: {
      name: "Refraction",
      type: "range",
      min: 0,
      max: 100,
      step: 10,
      default: 70,
    },
  },
  generate: (ctx, params, time = 0) => {
    renderCrystalLattice(
      ctx,
      ctx.canvas.width,
      ctx.canvas.height,
      time,
      {
        crystalCount: params.crystalCount as number,
        growthSpeed: params.growthSpeed as number,
        facetDetail: params.facetDetail as number,
        colorScheme: params.colorScheme as CrystalLatticeParams['colorScheme'],
        lightAngle: params.lightAngle as number,
        rotationSpeed: params.rotationSpeed as number,
        refraction: params.refraction as number,
      }
    );
  },
};
