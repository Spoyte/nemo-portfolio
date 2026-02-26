import { ArtGenerator, ParamConfig } from "./core";

export interface PolyhedralSculpturesParams {
  solid: "tetrahedron" | "cube" | "octahedron" | "dodecahedron" | "icosahedron" | "truncated-icosahedron" | "rhombicosidodecahedron";
  renderMode: "wireframe" | "solid" | "gradient" | "neon";
  rotationSpeed: number;
  edgeGlow: number;
  faceOpacity: number;
  colorScheme: "classic" | "neon" | "monochrome" | "warm" | "cool" | "rainbow";
  autoRotate: boolean;
  showDual: boolean;
}

export const polyhedralSculpturesDefaultParams: PolyhedralSculpturesParams = {
  solid: "dodecahedron",
  renderMode: "gradient",
  rotationSpeed: 15,
  edgeGlow: 60,
  faceOpacity: 40,
  colorScheme: "classic",
  autoRotate: true,
  showDual: false,
};

// 3D Point type
interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Face type (indices into vertices array)
interface Face {
  indices: number[];
  normal?: Point3D;
  centroid?: Point3D;
}

// Polyhedron definition
interface Polyhedron {
  vertices: Point3D[];
  faces: Face[];
  edges: [number, number][];
}

// Golden ratio
const PHI = (1 + Math.sqrt(5)) / 2;
const INV_PHI = 1 / PHI;

// Generate Platonic and Archimedean solids
function generatePolyhedron(type: string): Polyhedron {
  switch (type) {
    case "tetrahedron":
      return {
        vertices: [
          { x: 1, y: 1, z: 1 },
          { x: -1, y: -1, z: 1 },
          { x: -1, y: 1, z: -1 },
          { x: 1, y: -1, z: -1 },
        ],
        faces: [
          { indices: [0, 1, 2] },
          { indices: [0, 1, 3] },
          { indices: [0, 2, 3] },
          { indices: [1, 2, 3] },
        ],
        edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]],
      };

    case "cube":
      return {
        vertices: [
          { x: -1, y: -1, z: -1 },
          { x: 1, y: -1, z: -1 },
          { x: 1, y: 1, z: -1 },
          { x: -1, y: 1, z: -1 },
          { x: -1, y: -1, z: 1 },
          { x: 1, y: -1, z: 1 },
          { x: 1, y: 1, z: 1 },
          { x: -1, y: 1, z: 1 },
        ],
        faces: [
          { indices: [0, 1, 2, 3] },
          { indices: [4, 5, 6, 7] },
          { indices: [0, 1, 5, 4] },
          { indices: [2, 3, 7, 6] },
          { indices: [0, 3, 7, 4] },
          { indices: [1, 2, 6, 5] },
        ],
        edges: [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ],
      };

    case "octahedron":
      return {
        vertices: [
          { x: 1, y: 0, z: 0 },
          { x: -1, y: 0, z: 0 },
          { x: 0, y: 1, z: 0 },
          { x: 0, y: -1, z: 0 },
          { x: 0, y: 0, z: 1 },
          { x: 0, y: 0, z: -1 },
        ],
        faces: [
          { indices: [0, 2, 4] },
          { indices: [0, 2, 5] },
          { indices: [0, 3, 4] },
          { indices: [0, 3, 5] },
          { indices: [1, 2, 4] },
          { indices: [1, 2, 5] },
          { indices: [1, 3, 4] },
          { indices: [1, 3, 5] },
        ],
        edges: [
          [0, 2], [0, 3], [0, 4], [0, 5],
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 4], [2, 5], [3, 4], [3, 5],
        ],
      };

    case "dodecahedron":
      return {
        vertices: [
          // Cube vertices
          { x: -1, y: -1, z: -1 },
          { x: 1, y: -1, z: -1 },
          { x: 1, y: 1, z: -1 },
          { x: -1, y: 1, z: -1 },
          { x: -1, y: -1, z: 1 },
          { x: 1, y: -1, z: 1 },
          { x: 1, y: 1, z: 1 },
          { x: -1, y: 1, z: 1 },
          // Rectangle vertices (golden ratio)
          { x: 0, y: -INV_PHI, z: -PHI },
          { x: 0, y: -INV_PHI, z: PHI },
          { x: 0, y: INV_PHI, z: -PHI },
          { x: 0, y: INV_PHI, z: PHI },
          { x: -INV_PHI, y: -PHI, z: 0 },
          { x: -INV_PHI, y: PHI, z: 0 },
          { x: INV_PHI, y: -PHI, z: 0 },
          { x: INV_PHI, y: PHI, z: 0 },
          { x: -PHI, y: 0, z: -INV_PHI },
          { x: -PHI, y: 0, z: INV_PHI },
          { x: PHI, y: 0, z: -INV_PHI },
          { x: PHI, y: 0, z: INV_PHI },
        ],
        faces: [
          { indices: [0, 8, 10, 3, 16] },
          { indices: [0, 12, 14, 1, 8] },
          { indices: [0, 16, 17, 4, 12] },
          { indices: [1, 14, 18, 2, 9] },
          { indices: [1, 9, 11, 5, 19] },
          { indices: [2, 18, 10, 3, 15] },
          { indices: [2, 15, 6, 11, 9] },
          { indices: [3, 10, 18, 14, 12] },
          { indices: [4, 17, 13, 7, 11] },
          { indices: [4, 11, 9, 5, 17] },
          { indices: [5, 19, 6, 15, 13] },
          { indices: [6, 19, 1, 14, 18] },
        ],
        edges: [
          [0, 8], [8, 10], [10, 3], [3, 16], [16, 0],
          [0, 12], [12, 14], [14, 1], [1, 8], [8, 0],
          [0, 16], [16, 17], [17, 4], [4, 12], [12, 0],
          [1, 14], [14, 18], [18, 2], [2, 9], [9, 1],
          [1, 9], [9, 11], [11, 5], [5, 19], [19, 1],
          [2, 18], [18, 10], [10, 3], [3, 15], [15, 2],
          [2, 15], [15, 6], [6, 11], [11, 9], [9, 2],
          [3, 10], [10, 18], [18, 14], [14, 12], [12, 3],
          [4, 17], [17, 13], [13, 7], [7, 11], [11, 4],
          [4, 11], [11, 9], [9, 5], [5, 17], [17, 4],
          [5, 19], [19, 6], [6, 15], [15, 13], [13, 5],
          [6, 19], [19, 1], [1, 14], [14, 18], [18, 6],
        ],
      };

    case "icosahedron":
      return {
        vertices: [
          { x: 0, y: 1, z: PHI },
          { x: 0, y: 1, z: -PHI },
          { x: 0, y: -1, z: PHI },
          { x: 0, y: -1, z: -PHI },
          { x: 1, y: PHI, z: 0 },
          { x: 1, y: -PHI, z: 0 },
          { x: -1, y: PHI, z: 0 },
          { x: -1, y: -PHI, z: 0 },
          { x: PHI, y: 0, z: 1 },
          { x: PHI, y: 0, z: -1 },
          { x: -PHI, y: 0, z: 1 },
          { x: -PHI, y: 0, z: -1 },
        ],
        faces: [
          { indices: [0, 2, 8] },
          { indices: [0, 2, 10] },
          { indices: [0, 4, 6] },
          { indices: [0, 4, 8] },
          { indices: [0, 6, 10] },
          { indices: [1, 3, 9] },
          { indices: [1, 3, 11] },
          { indices: [1, 4, 6] },
          { indices: [1, 4, 9] },
          { indices: [1, 6, 11] },
          { indices: [2, 5, 7] },
          { indices: [2, 5, 8] },
          { indices: [2, 7, 10] },
          { indices: [3, 5, 7] },
          { indices: [3, 5, 9] },
          { indices: [3, 7, 11] },
          { indices: [4, 8, 9] },
          { indices: [5, 8, 9] },
          { indices: [6, 10, 11] },
          { indices: [7, 10, 11] },
        ],
        edges: [
          [0, 2], [0, 4], [0, 6], [0, 8], [0, 10],
          [1, 3], [1, 4], [1, 6], [1, 9], [1, 11],
          [2, 5], [2, 7], [2, 8], [2, 10],
          [3, 5], [3, 7], [3, 9], [3, 11],
          [4, 6], [4, 8], [4, 9],
          [5, 7], [5, 8], [5, 9],
          [6, 10], [6, 11],
          [7, 10], [7, 11],
          [8, 9],
          [10, 11],
        ],
      };

    case "truncated-icosahedron":
      // Soccer ball pattern - 12 pentagons, 20 hexagons
      const vertices: Point3D[] = [];
      const edges: [number, number][] = [];
      
      // Start with icosahedron vertices, then truncate
      const icoVerts = [
        { x: 0, y: 1, z: PHI },
        { x: 0, y: 1, z: -PHI },
        { x: 0, y: -1, z: PHI },
        { x: 0, y: -1, z: -PHI },
        { x: 1, y: PHI, z: 0 },
        { x: 1, y: -PHI, z: 0 },
        { x: -1, y: PHI, z: 0 },
        { x: -1, y: -PHI, z: 0 },
        { x: PHI, y: 0, z: 1 },
        { x: PHI, y: 0, z: -1 },
        { x: -PHI, y: 0, z: 1 },
        { x: -PHI, y: 0, z: -1 },
      ];
      
      // For truncated icosahedron, use simpler approximation
      // Generate vertices at specific golden ratio positions
      const a = 1;
      const b = PHI;
      const c = 1 / PHI;
      
      const truncatedVerts = [
        // 12 vertices from (0, ±1, ±3φ)
        { x: 0, y: a, z: 3 * b }, { x: 0, y: a, z: -3 * b },
        { x: 0, y: -a, z: 3 * b }, { x: 0, y: -a, z: -3 * b },
        // 12 vertices from (±1, ±3φ, 0)
        { x: a, y: 3 * b, z: 0 }, { x: a, y: -3 * b, z: 0 },
        { x: -a, y: 3 * b, z: 0 }, { x: -a, y: -3 * b, z: 0 },
        // 12 vertices from (±3φ, 0, ±1)
        { x: 3 * b, y: 0, z: a }, { x: 3 * b, y: 0, z: -a },
        { x: -3 * b, y: 0, z: a }, { x: -3 * b, y: 0, z: -a },
        // 24 vertices from (±2, ±(1+2φ), ±φ)
        { x: 2, y: 1 + 2 * b, z: b }, { x: 2, y: 1 + 2 * b, z: -b },
        { x: -2, y: 1 + 2 * b, z: b }, { x: -2, y: 1 + 2 * b, z: -b },
        { x: 2, y: -(1 + 2 * b), z: b }, { x: 2, y: -(1 + 2 * b), z: -b },
        { x: -2, y: -(1 + 2 * b), z: b }, { x: -2, y: -(1 + 2 * b), z: -b },
        // 24 vertices from (±(1+2φ), ±φ, ±2)
        { x: 1 + 2 * b, y: b, z: 2 }, { x: 1 + 2 * b, y: b, z: -2 },
        { x: -(1 + 2 * b), y: b, z: 2 }, { x: -(1 + 2 * b), y: b, z: -2 },
        { x: 1 + 2 * b, y: -b, z: 2 }, { x: 1 + 2 * b, y: -b, z: -2 },
        { x: -(1 + 2 * b), y: -b, z: 2 }, { x: -(1 + 2 * b), y: -b, z: -2 },
        // 24 vertices from (±φ, ±2, ±(1+2φ))
        { x: b, y: 2, z: 1 + 2 * b }, { x: b, y: 2, z: -(1 + 2 * b) },
        { x: -b, y: 2, z: 1 + 2 * b }, { x: -b, y: 2, z: -(1 + 2 * b) },
        { x: b, y: -2, z: 1 + 2 * b }, { x: b, y: -2, z: -(1 + 2 * b) },
        { x: -b, y: -2, z: 1 + 2 * b }, { x: -b, y: -2, z: -(1 + 2 * b) },
      ];
      
      // Normalize vertices
      const maxDist = Math.sqrt(9 * b * b + 1);
      return {
        vertices: truncatedVerts.map(v => ({
          x: v.x / maxDist * 1.5,
          y: v.y / maxDist * 1.5,
          z: v.z / maxDist * 1.5,
        })),
        faces: [], // Complex face structure - simplified for wireframe
        edges: [], // Will be computed from proximity
      };

    case "rhombicosidodecahedron":
      // Simplified approximation using golden rectangle coordinates
      const rcVerts = [];
      const rcEdges: [number, number][] = [];
      
      // Use a subset of key vertices for visual effect
      for (let i = 0; i < 20; i++) {
        const theta = (i / 20) * Math.PI * 2;
        const phi = ((i * 3) % 20 / 20) * Math.PI;
        rcVerts.push({
          x: Math.cos(theta) * Math.sin(phi) * 1.5,
          y: Math.sin(theta) * Math.sin(phi) * 1.5,
          z: Math.cos(phi) * 1.5,
        });
      }
      
      // Connect nearby vertices
      for (let i = 0; i < rcVerts.length; i++) {
        for (let j = i + 1; j < rcVerts.length; j++) {
          const dx = rcVerts[i].x - rcVerts[j].x;
          const dy = rcVerts[i].y - rcVerts[j].y;
          const dz = rcVerts[i].z - rcVerts[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 1.2) {
            rcEdges.push([i, j]);
          }
        }
      }
      
      return {
        vertices: rcVerts,
        faces: [],
        edges: rcEdges,
      };

    default:
      return generatePolyhedron("dodecahedron");
  }
}

// Rotate a point around X axis
function rotateX(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: p.x,
    y: p.y * cos - p.z * sin,
    z: p.y * sin + p.z * cos,
  };
}

// Rotate a point around Y axis
function rotateY(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: p.x * cos + p.z * sin,
    y: p.y,
    z: -p.x * sin + p.z * cos,
  };
}

// Rotate a point around Z axis
function rotateZ(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: p.x * cos - p.y * sin,
    y: p.x * sin + p.y * cos,
    z: p.z,
  };
}

// Project 3D point to 2D with perspective
function project(p: Point3D, width: number, height: number, scale: number): { x: number; y: number; z: number } {
  const fov = 400;
  const distance = 4;
  const factor = fov / (distance - p.z);
  return {
    x: width / 2 + p.x * factor * scale,
    y: height / 2 + p.y * factor * scale,
    z: p.z,
  };
}

// Calculate face normal
function calculateNormal(v1: Point3D, v2: Point3D, v3: Point3D): Point3D {
  const a = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
  const b = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z };
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

// Calculate centroid of a face
function calculateCentroid(vertices: Point3D[], indices: number[]): Point3D {
  let x = 0, y = 0, z = 0;
  for (const i of indices) {
    x += vertices[i].x;
    y += vertices[i].y;
    z += vertices[i].z;
  }
  return {
    x: x / indices.length,
    y: y / indices.length,
    z: z / indices.length,
  };
}

// Get color from scheme
function getColor(scheme: string, index: number, total: number): string {
  const hue = (index / total) * 360;
  
  switch (scheme) {
    case "classic":
      return `hsl(${220 + (index / total) * 60}, 70%, 60%)`;
    case "neon":
      return `hsl(${(index * 60) % 360}, 100%, 60%)`;
    case "monochrome":
      const gray = 30 + (index / total) * 200;
      return `rgb(${gray}, ${gray}, ${gray})`;
    case "warm":
      return `hsl(${10 + (index / total) * 50}, 80%, 60%)`;
    case "cool":
      return `hsl(${160 + (index / total) * 100}, 70%, 55%)`;
    case "rainbow":
      return `hsl(${(index / total) * 360}, 85%, 60%)`;
    default:
      return `hsl(${220 + (index / total) * 60}, 70%, 60%)`;
  }
}

// Get edge color from scheme
function getEdgeColor(scheme: string): string {
  switch (scheme) {
    case "classic": return "#4a90d9";
    case "neon": return "#ff00ff";
    case "monochrome": return "#ffffff";
    case "warm": return "#ff6b35";
    case "cool": return "#00d4aa";
    case "rainbow": return "#ffffff";
    default: return "#4a90d9";
  }
}

// Get background gradient
function getBackground(ctx: CanvasRenderingContext2D, scheme: string, width: number, height: number): CanvasGradient {
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
  
  switch (scheme) {
    case "classic":
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#0f0f1a");
      break;
    case "neon":
      gradient.addColorStop(0, "#0a0a0a");
      gradient.addColorStop(1, "#1a0a1a");
      break;
    case "monochrome":
      gradient.addColorStop(0, "#2a2a2a");
      gradient.addColorStop(1, "#0a0a0a");
      break;
    case "warm":
      gradient.addColorStop(0, "#2a1a0a");
      gradient.addColorStop(1, "#1a0f05");
      break;
    case "cool":
      gradient.addColorStop(0, "#0a1a2a");
      gradient.addColorStop(1, "#050f1a");
      break;
    case "rainbow":
      gradient.addColorStop(0, "#1a1a1a");
      gradient.addColorStop(1, "#0a0a0a");
      break;
    default:
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#0f0f1a");
  }
  
  return gradient;
}

// Main render function
export function renderPolyhedralSculptures(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: PolyhedralSculpturesParams
): void {
  // Clear with gradient background
  const bgGradient = getBackground(ctx, params.colorScheme, width, height);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Generate polyhedron
  const polyhedron = generatePolyhedron(params.solid);
  
  // Calculate rotation angles
  const rotSpeed = params.autoRotate ? params.rotationSpeed / 1000 : 0;
  const angleX = time * rotSpeed * 0.5;
  const angleY = time * rotSpeed * 0.7;
  const angleZ = time * rotSpeed * 0.3;

  // Transform vertices
  const transformedVertices = polyhedron.vertices.map(v => {
    let p = rotateX(v, angleX);
    p = rotateY(p, angleY);
    p = rotateZ(p, angleZ);
    return p;
  });

  // Calculate face depths and sort
  const facesWithDepth = polyhedron.faces.map((face, index) => {
    const centroid = calculateCentroid(transformedVertices, face.indices);
    return { face, centroid, index, depth: centroid.z };
  });
  
  // Sort faces by depth (back to front for painter's algorithm)
  facesWithDepth.sort((a, b) => a.depth - b.depth);

  // Project vertices to 2D
  const scale = Math.min(width, height) / 400;
  const projectedVertices = transformedVertices.map(v => project(v, width, height, scale));

  // Render based on mode
  if (params.renderMode === "solid" || params.renderMode === "gradient") {
    // Draw faces
    facesWithDepth.forEach(({ face, index }) => {
      // Calculate normal for lighting
      if (face.indices.length >= 3) {
        const v1 = transformedVertices[face.indices[0]];
        const v2 = transformedVertices[face.indices[1]];
        const v3 = transformedVertices[face.indices[2]];
        const normal = calculateNormal(v1, v2, v3);
        
        // Backface culling
        if (normal.z > 0) {
          ctx.beginPath();
          const first = projectedVertices[face.indices[0]];
          ctx.moveTo(first.x, first.y);
          
          for (let i = 1; i < face.indices.length; i++) {
            const p = projectedVertices[face.indices[i]];
            ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();

          // Calculate lighting
          const lightDir = { x: 0.5, y: -0.5, z: 1 };
          const lightMag = Math.sqrt(lightDir.x ** 2 + lightDir.y ** 2 + lightDir.z ** 2);
          const normalMag = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
          const dot = (normal.x * lightDir.x + normal.y * lightDir.y + normal.z * lightDir.z) / (normalMag * lightMag);
          const intensity = Math.max(0.3, (dot + 1) / 2);

          if (params.renderMode === "gradient") {
            // Create face gradient
            const centroid = projectedVertices[face.indices.reduce((a, b) => a + b, 0) / face.indices.length] || projectedVertices[face.indices[0]];
            const gradient = ctx.createRadialGradient(
              centroid.x, centroid.y, 0,
              centroid.x, centroid.y, 100 * scale
            );
            const baseColor = getColor(params.colorScheme, index, polyhedron.faces.length);
            gradient.addColorStop(0, baseColor);
            gradient.addColorStop(1, adjustBrightness(baseColor, intensity * 0.5));
            ctx.fillStyle = gradient;
          } else {
            const baseColor = getColor(params.colorScheme, index, polyhedron.faces.length);
            ctx.fillStyle = adjustBrightness(baseColor, intensity);
          }
          
          ctx.globalAlpha = params.faceOpacity / 100;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    });
  }

  // Draw edges
  const edgeColor = getEdgeColor(params.colorScheme);
  ctx.strokeStyle = edgeColor;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Draw polyhedron edges
  polyhedron.edges.forEach(([i, j]) => {
    const p1 = projectedVertices[i];
    const p2 = projectedVertices[j];
    
    if (p1 && p2) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      
      if (params.renderMode === "neon") {
        ctx.shadowColor = edgeColor;
        ctx.shadowBlur = params.edgeGlow;
      } else {
        ctx.shadowBlur = 0;
      }
      
      ctx.stroke();
    }
  });

  // Draw dual polyhedron if enabled
  if (params.showDual && polyhedron.faces.length > 0) {
    ctx.strokeStyle = adjustBrightness(edgeColor, 0.6);
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Connect face centroids to form dual
    const centroids = facesWithDepth.map(({ centroid }) => {
      const rotated = rotateZ(rotateY(rotateX(centroid, angleX), angleY), angleZ);
      return project(rotated, width, height, scale);
    });
    
    // Draw connections between adjacent faces (simplified)
    for (let i = 0; i < Math.min(centroids.length, 20); i++) {
      for (let j = i + 1; j < Math.min(centroids.length, 20); j++) {
        const c1 = centroids[i];
        const c2 = centroids[j];
        const dist = Math.sqrt((c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2);
        
        if (dist < 80 * scale && c1.z > -1 && c2.z > -1) {
          ctx.beginPath();
          ctx.moveTo(c1.x, c1.y);
          ctx.lineTo(c2.x, c2.y);
          ctx.globalAlpha = 0.3;
          ctx.stroke();
        }
      }
    }
    
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  }

  // Draw vertices
  ctx.fillStyle = edgeColor;
  projectedVertices.forEach(p => {
    if (p.z > -1) {
      const size = (1 + p.z) * 3 * scale;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Reset shadow
  ctx.shadowBlur = 0;
}

// Helper to adjust color brightness
function adjustBrightness(color: string, factor: number): string {
  if (color.startsWith("hsl")) {
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const h = match[1];
      const s = match[2];
      const l = Math.min(100, Math.max(0, parseInt(match[3]) * factor));
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  }
  return color;
}

// Generator configuration
const paramsConfig: Record<string, ParamConfig> = {
  solid: {
    name: "Polyhedron",
    type: "select",
    options: ["tetrahedron", "cube", "octahedron", "dodecahedron", "icosahedron", "truncated-icosahedron", "rhombicosidodecahedron"],
    default: "dodecahedron",
  },
  renderMode: {
    name: "Render Mode",
    type: "select",
    options: ["wireframe", "solid", "gradient", "neon"],
    default: "gradient",
  },
  rotationSpeed: {
    name: "Rotation Speed",
    type: "range",
    min: 0,
    max: 50,
    step: 1,
    default: 15,
  },
  edgeGlow: {
    name: "Edge Glow",
    type: "range",
    min: 0,
    max: 100,
    step: 5,
    default: 60,
  },
  faceOpacity: {
    name: "Face Opacity",
    type: "range",
    min: 0,
    max: 100,
    step: 5,
    default: 40,
  },
  colorScheme: {
    name: "Color Scheme",
    type: "select",
    options: ["classic", "neon", "monochrome", "warm", "cool", "rainbow"],
    default: "classic",
  },
  autoRotate: {
    name: "Auto Rotate",
    type: "select",
    options: [true, false],
    default: true,
  },
  showDual: {
    name: "Show Dual",
    type: "select",
    options: [true, false],
    default: false,
  },
};

export const polyhedralSculptures: ArtGenerator = {
  name: "Polyhedral Sculptures",
  description: "3D geometric forms — Platonic solids, Archimedean solids, and their duals",
  params: paramsConfig,
  generate: renderPolyhedralSculptures,
};
