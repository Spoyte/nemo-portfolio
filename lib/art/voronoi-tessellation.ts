import { ArtGenerator, fillCanvas, SeededRandom } from "./core";

// Voronoi Tessellation Art Generator
// Creates organic, nature-inspired patterns based on Voronoi diagrams
// 
// Voronoi diagrams appear everywhere in nature:
// - Cracked mud, giraffe skin patterns
// - Leaf vein structures, dragonfly wings
// - Foam bubbles, stone fractures
// - Biological cell structures
//
// This implementation includes:
// - Weighted Voronoi for organic variation
// - Relaxation (Lloyd's algorithm) for even distribution
// - Multiple distance metrics (Euclidean, Manhattan, Minkowski)
// - Edge styling and cell coloring options

interface VoronoiCell {
  x: number;
  y: number;
  weight: number;
  color: { r: number; g: number; b: number };
  id: number;
}

export const voronoiTessellation: ArtGenerator = {
  name: "Voronoi Tessellation",
  description: "Organic Voronoi diagrams inspired by nature — cracked earth, foam bubbles, leaf veins, giraffe patterns. Features weighted cells, relaxation, and multiple distance metrics.",
  
  params: {
    cellCount: {
      name: "Cell Count",
      type: "range",
      min: 10,
      max: 500,
      step: 10,
      default: 150,
    },
    distanceMetric: {
      name: "Distance Metric",
      type: "select",
      options: ["euclidean", "manhattan", "minkowski", "chebyshev"],
      default: "euclidean",
    },
    relaxationSteps: {
      name: "Relaxation (Lloyd's)",
      type: "range",
      min: 0,
      max: 10,
      step: 1,
      default: 2,
    },
    weightVariation: {
      name: "Cell Weight Variation",
      type: "range",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.3,
    },
    style: {
      name: "Visual Style",
      type: "select",
      options: ["organic", "geometric", "cracked", "bubble", "veins", "stained"],
      default: "organic",
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["earth", "ocean", "sunset", "forest", "monochrome", "pastel", "neon", "deepsea"],
      default: "earth",
    },
    edgeThickness: {
      name: "Edge Thickness",
      type: "range",
      min: 0,
      max: 5,
      step: 0.5,
      default: 1,
    },
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 42,
    },
  },

  generate: (ctx, params) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    const {
      cellCount,
      distanceMetric,
      relaxationSteps,
      weightVariation,
      style,
      colorScheme,
      edgeThickness,
      seed,
    } = params;
    
    const rng = new SeededRandom(seed as number);
    const numCells = cellCount as number;
    const metric = distanceMetric as string;
    const relaxation = relaxationSteps as number;
    const weightVar = weightVariation as number;
    const visualStyle = style as string;
    const edges = edgeThickness as number;
    
    // Color palettes
    const palettes: Record<string, Array<{ r: number; g: number; b: number }>> = {
      earth: [
        { r: 60, g: 40, b: 30 },
        { r: 100, g: 70, b: 50 },
        { r: 140, g: 100, b: 70 },
        { r: 180, g: 140, b: 100 },
        { r: 200, g: 170, b: 130 },
        { r: 220, g: 200, b: 160 },
        { r: 235, g: 220, b: 190 },
      ],
      ocean: [
        { r: 10, g: 30, b: 60 },
        { r: 20, g: 60, b: 100 },
        { r: 30, g: 90, b: 140 },
        { r: 50, g: 130, b: 170 },
        { r: 80, g: 160, b: 190 },
        { r: 120, g: 190, b: 210 },
        { r: 170, g: 215, b: 230 },
      ],
      sunset: [
        { r: 80, g: 30, b: 60 },
        { r: 130, g: 50, b: 70 },
        { r: 180, g: 80, b: 70 },
        { r: 220, g: 120, b: 70 },
        { r: 240, g: 160, b: 80 },
        { r: 250, g: 200, b: 120 },
        { r: 255, g: 230, b: 170 },
      ],
      forest: [
        { r: 15, g: 40, b: 20 },
        { r: 30, g: 70, b: 35 },
        { r: 50, g: 100, b: 55 },
        { r: 80, g: 130, b: 80 },
        { r: 120, g: 160, b: 110 },
        { r: 160, g: 190, b: 140 },
        { r: 200, g: 220, b: 180 },
      ],
      monochrome: [
        { r: 20, g: 20, b: 20 },
        { r: 60, g: 60, b: 60 },
        { r: 100, g: 100, b: 100 },
        { r: 140, g: 140, b: 140 },
        { r: 180, g: 180, b: 180 },
        { r: 210, g: 210, b: 210 },
        { r: 240, g: 240, b: 240 },
      ],
      pastel: [
        { r: 255, g: 200, b: 200 },
        { r: 255, g: 220, b: 180 },
        { r: 255, g: 255, b: 180 },
        { r: 200, g: 255, b: 200 },
        { r: 180, g: 220, b: 255 },
        { r: 220, g: 200, b: 255 },
        { r: 255, g: 180, b: 220 },
      ],
      neon: [
        { r: 255, g: 0, b: 128 },
        { r: 255, g: 128, b: 0 },
        { r: 255, g: 255, b: 0 },
        { r: 128, g: 255, b: 0 },
        { r: 0, g: 255, b: 128 },
        { r: 0, g: 128, b: 255 },
        { r: 128, g: 0, b: 255 },
      ],
      deepsea: [
        { r: 5, g: 10, b: 30 },
        { r: 10, g: 25, b: 60 },
        { r: 15, g: 45, b: 90 },
        { r: 25, g: 70, b: 120 },
        { r: 40, g: 100, b: 150 },
        { r: 60, g: 135, b: 180 },
        { r: 90, g: 170, b: 210 },
      ],
    };
    
    const palette = palettes[colorScheme as string] || palettes.earth;
    
    // Initialize cells with random positions
    let cells: VoronoiCell[] = [];
    for (let i = 0; i < numCells; i++) {
      const color = palette[Math.floor(rng.random() * palette.length)];
      cells.push({
        x: rng.random() * width,
        y: rng.random() * height,
        weight: 1 + (rng.random() - 0.5) * 2 * weightVar,
        color: { ...color },
        id: i,
      });
    }
    
    // Distance function based on metric
    const getDistance = (x1: number, y1: number, x2: number, y2: number, weight: number): number => {
      const dx = x1 - x2;
      const dy = y1 - y2;
      
      switch (metric) {
        case "manhattan":
          return (Math.abs(dx) + Math.abs(dy)) / weight;
        case "chebyshev":
          return Math.max(Math.abs(dx), Math.abs(dy)) / weight;
        case "minkowski":
          return Math.pow(Math.pow(Math.abs(dx), 3) + Math.pow(Math.abs(dy), 3), 1/3) / weight;
        case "euclidean":
        default:
          return Math.sqrt(dx * dx + dy * dy) / weight;
      }
    };
    
    // Lloyd's relaxation: move cells to centroid of their regions
    for (let step = 0; step < relaxation; step++) {
      // Accumulators for centroid calculation
      const sums = new Array(numCells).fill(null).map(() => ({ x: 0, y: 0, count: 0 }));
      
      // Sample grid to approximate regions
      const sampleStep = Math.max(4, Math.floor(Math.sqrt((width * height) / 5000)));
      
      for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
          let minDist = Infinity;
          let nearestCell = 0;
          
          for (let i = 0; i < numCells; i++) {
            const dist = getDistance(x, y, cells[i].x, cells[i].y, cells[i].weight);
            if (dist < minDist) {
              minDist = dist;
              nearestCell = i;
            }
          }
          
          sums[nearestCell].x += x;
          sums[nearestCell].y += y;
          sums[nearestCell].count++;
        }
      }
      
      // Move cells to centroids
      for (let i = 0; i < numCells; i++) {
        if (sums[i].count > 0) {
          cells[i].x = sums[i].x / sums[i].count;
          cells[i].y = sums[i].y / sums[i].count;
        }
      }
    }
    
    // Render based on style
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Pre-calculate noise for organic variation
    const noiseScale = 0.01;
    const getNoise = (x: number, y: number): number => {
      // Simple pseudo-noise based on position
      return Math.sin(x * noiseScale) * Math.cos(y * noiseScale) * 
             Math.sin((x + y) * noiseScale * 0.5);
    };
    
    // Render pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let minDist = Infinity;
        let secondMinDist = Infinity;
        let nearestCell = 0;
        let secondNearestCell = 0;
        
        // Find nearest and second-nearest cells
        for (let i = 0; i < numCells; i++) {
          const dist = getDistance(x, y, cells[i].x, cells[i].y, cells[i].weight);
          if (dist < minDist) {
            secondMinDist = minDist;
            secondNearestCell = nearestCell;
            minDist = dist;
            nearestCell = i;
          } else if (dist < secondMinDist) {
            secondMinDist = dist;
            secondNearestCell = i;
          }
        }
        
        const cell = cells[nearestCell];
        const idx = (y * width + x) * 4;
        
        // Distance to edge (difference between nearest and second nearest)
        const edgeDist = secondMinDist - minDist;
        const isEdge = edgeDist < edges * (1 + weightVar);
        
        // Apply style
        let r = cell.color.r;
        let g = cell.color.g;
        let b = cell.color.b;
        
        switch (visualStyle) {
          case "cracked": {
            // Darken edges significantly for cracked earth look
            if (isEdge) {
              r = 20;
              g = 15;
              b = 10;
            } else {
              // Add subtle variation
              const variation = getNoise(x, y) * 20;
              r = Math.max(0, Math.min(255, r + variation));
              g = Math.max(0, Math.min(255, g + variation));
              b = Math.max(0, Math.min(255, b + variation));
            }
            break;
          }
          
          case "bubble": {
            // Highlight edges, gradient fill
            if (isEdge) {
              r = Math.min(255, r + 40);
              g = Math.min(255, g + 40);
              b = Math.min(255, b + 40);
            } else {
              // Radial gradient from cell center
              const dx = x - cell.x;
              const dy = y - cell.y;
              const distFromCenter = Math.sqrt(dx * dx + dy * dy);
              const maxDist = minDist + edgeDist;
              const gradient = distFromCenter / maxDist;
              
              r = Math.max(0, r - gradient * 40);
              g = Math.max(0, g - gradient * 40);
              b = Math.max(0, b - gradient * 40);
            }
            break;
          }
          
          case "veins": {
            // Thin bright edges, dark cells
            if (isEdge) {
              r = Math.min(255, r + 100);
              g = Math.min(255, g + 100);
              b = Math.min(255, b + 80);
            } else {
              r = Math.max(0, r - 60);
              g = Math.max(0, g - 60);
              b = Math.max(0, b - 60);
            }
            break;
          }
          
          case "geometric": {
            // Clean edges, solid colors
            if (isEdge) {
              r = 40;
              g = 40;
              b = 40;
            }
            break;
          }
          
          case "stained": {
            // Stained glass effect - dark borders, vibrant centers
            if (isEdge) {
              r = 10;
              g = 10;
              b = 10;
            } else {
              // Boost saturation
              r = Math.min(255, r + 30);
              g = Math.min(255, g + 30);
              b = Math.min(255, b + 30);
            }
            break;
          }
          
          case "organic":
          default: {
            // Subtle edge darkening with organic variation
            if (isEdge) {
              const darken = Math.max(0, 1 - edgeDist / (edges + 1));
              r = Math.max(0, r - darken * 60);
              g = Math.max(0, g - darken * 60);
              b = Math.max(0, b - darken * 60);
            }
            
            // Add organic noise
            const noise = getNoise(x, y) * 15;
            r = Math.max(0, Math.min(255, r + noise));
            g = Math.max(0, Math.min(255, g + noise));
            b = Math.max(0, Math.min(255, b + noise));
            break;
          }
        }
        
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  },
  
  meta: {
    category: "geometric",
    complexity: "moderate",
    tags: ["static", "colorful", "geometric", "organic"],
    created: "2026-03-15",
  },
};
