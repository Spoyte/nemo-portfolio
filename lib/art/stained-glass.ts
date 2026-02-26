import { ArtGenerator, ArtParams, ParamConfig } from "./core";

export interface StainedGlassParams extends ArtParams {
  cellCount: number;
  colorScheme: 'cathedral' | 'sunset' | 'ocean' | 'forest' | 'autumn' | 'monochrome';
  leadWidth: number;
  lightIntensity: number;
  irregularity: number;
  seed: number;
  animateLight: boolean;
}

export const stainedGlassDefaultParams: StainedGlassParams = {
  cellCount: 40,
  colorScheme: 'cathedral',
  leadWidth: 3,
  lightIntensity: 0.7,
  irregularity: 0.3,
  seed: Math.random() * 1000,
  animateLight: true,
};

// Color schemes inspired by cathedral windows
const COLOR_SCHEMES: Record<string, string[]> = {
  cathedral: [
    '#1a237e', '#283593', '#3949ab', '#5e35b1', '#8e24aa',
    '#d81b60', '#e53935', '#fb8c00', '#ffb300', '#fdd835',
    '#c0ca33', '#7cb342', '#00897b', '#00acc1', '#1e88e5'
  ],
  sunset: [
    '#2d1b4e', '#4a148c', '#6a1b9a', '#8e24aa', '#ad1457',
    '#c62828', '#d84315', '#ef6c00', '#f9a825', '#ffeb3b'
  ],
  ocean: [
    '#0d1642', '#1a237e', '#0d47a1', '#01579b', '#006064',
    '#00796b', '#00838f', '#0097a7', '#00acc1', '#4dd0e1'
  ],
  forest: [
    '#1b5e20', '#2e7d32', '#388e3c', '#43a047', '#66bb6a',
    '#81c784', '#a5d6a7', '#558b2f', '#33691e', '#827717'
  ],
  autumn: [
    '#3e2723', '#4e342e', '#5d4037', '#6d4c41', '#8d6e63',
    '#bf360c', '#e65100', '#f57c00', '#ff8f00', '#ffb300',
    '#f9a825', '#fdd835'
  ],
  monochrome: [
    '#212121', '#424242', '#616161', '#757575', '#9e9e9e',
    '#bdbdbd', '#e0e0e0', '#eeeeee', '#f5f5f5', '#fafafa'
  ]
};

// Seeded random number generator
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
}

// Point structure
interface Point {
  x: number;
  y: number;
}

// Cell structure
interface Cell {
  center: Point;
  vertices: Point[];
  color: string;
  brightness: number;
}

// Generate Voronoi-like cells with irregularity
function generateCells(
  width: number,
  height: number,
  count: number,
  irregularity: number,
  rand: () => number
): Cell[] {
  const points: Point[] = [];
  
  // Generate random seed points with some grid bias for structure
  for (let i = 0; i < count; i++) {
    const gridX = (i % Math.ceil(Math.sqrt(count))) / Math.ceil(Math.sqrt(count));
    const gridY = Math.floor(i / Math.ceil(Math.sqrt(count))) / Math.ceil(Math.sqrt(count));
    
    const jitterX = (rand() - 0.5) * irregularity;
    const jitterY = (rand() - 0.5) * irregularity;
    
    points.push({
      x: (gridX + jitterX) * width * 0.9 + width * 0.05,
      y: (gridY + jitterY) * height * 0.9 + height * 0.05
    });
  }
  
  // Calculate Voronoi cells using Fortune's algorithm approximation
  const cells: Cell[] = [];
  
  for (let i = 0; i < points.length; i++) {
    const center = points[i];
    const vertices: Point[] = [];
    
    // Find cell vertices by sampling angles and finding nearest boundary
    const angleSteps = 24;
    for (let a = 0; a < angleSteps; a++) {
      const angle = (a / angleSteps) * Math.PI * 2;
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      
      // Ray march to find edge
      let t = 0;
      let step = Math.max(width, height) / 2;
      
      for (let iter = 0; iter < 10; iter++) {
        const testX = center.x + dirX * t;
        const testY = center.y + dirY * t;
        
        // Find distance to nearest other point
        let minDist = Infinity;
        for (let j = 0; j < points.length; j++) {
          if (i === j) continue;
          const dx = testX - points[j].x;
          const dy = testY - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          minDist = Math.min(minDist, dist);
        }
        
        // Check bounds
        const boundDist = Math.min(
          testX, width - testX,
          testY, height - testY
        );
        minDist = Math.min(minDist, boundDist * 2);
        
        if (Math.abs(minDist - t) < 1 || t > Math.max(width, height)) {
          break;
        }
        
        t = minDist;
        step *= 0.5;
      }
      
      vertices.push({
        x: center.x + dirX * t,
        y: center.y + dirY * t
      });
    }
    
    cells.push({
      center,
      vertices,
      color: '',
      brightness: 0.5 + rand() * 0.5
    });
  }
  
  return cells;
}

// Assign colors to cells with some coherence
function assignColors(cells: Cell[], colorScheme: string[], rand: () => number): void {
  for (const cell of cells) {
    // Use position to influence color selection for coherence
    const colorIndex = Math.floor(rand() * colorScheme.length);
    cell.color = colorScheme[colorIndex];
  }
}

// Draw the stained glass
export function renderStainedGlass(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: StainedGlassParams
): void {
  const rand = seededRandom(params.seed);
  const colors = COLOR_SCHEMES[params.colorScheme];
  
  // Generate cells
  const cells = generateCells(
    width,
    height,
    params.cellCount,
    params.irregularity,
    rand
  );
  
  assignColors(cells, colors, rand);
  
  // Clear canvas
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);
  
  // Animated light source
  const lightX = width * 0.5 + Math.sin(time * 0.0005) * width * 0.3;
  const lightY = height * 0.3 + Math.cos(time * 0.0003) * height * 0.2;
  
  // Draw cells
  for (const cell of cells) {
    if (cell.vertices.length < 3) continue;
    
    // Calculate lighting
    const dx = cell.center.x - lightX;
    const dy = cell.center.y - lightY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.sqrt(width * width + height * height);
    const lightFactor = params.animateLight 
      ? 1 - (dist / maxDist) * (1 - params.lightIntensity)
      : params.lightIntensity;
    
    // Parse base color and apply lighting
    const baseColor = cell.color;
    const brightness = cell.brightness * lightFactor;
    
    ctx.beginPath();
    ctx.moveTo(cell.vertices[0].x, cell.vertices[0].y);
    for (let i = 1; i < cell.vertices.length; i++) {
      ctx.lineTo(cell.vertices[i].x, cell.vertices[i].y);
    }
    ctx.closePath();
    
    // Fill with glass effect
    const gradient = ctx.createRadialGradient(
      cell.center.x, cell.center.y, 0,
      cell.center.x, cell.center.y, 50
    );
    
    // Lighten color based on brightness
    const litColor = adjustBrightness(baseColor, brightness * 40);
    const shadowColor = adjustBrightness(baseColor, -20);
    
    gradient.addColorStop(0, litColor);
    gradient.addColorStop(0.7, baseColor);
    gradient.addColorStop(1, shadowColor);
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Inner glow for glass effect
    ctx.save();
    ctx.clip();
    const innerGlow = ctx.createRadialGradient(
      cell.center.x - 10, cell.center.y - 10, 0,
      cell.center.x, cell.center.y, 40
    );
    innerGlow.addColorStop(0, 'rgba(255,255,255,0.3)');
    innerGlow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = innerGlow;
    ctx.fill();
    ctx.restore();
    
    // Draw lead lines (borders)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = params.leadWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Highlight on lead lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = params.leadWidth * 0.3;
    ctx.stroke();
  }
  
  // Overall glass texture overlay
  ctx.globalCompositeOperation = 'overlay';
  const textureGradient = ctx.createLinearGradient(0, 0, width, height);
  textureGradient.addColorStop(0, 'rgba(255,255,255,0.1)');
  textureGradient.addColorStop(0.5, 'rgba(255,255,255,0)');
  textureGradient.addColorStop(1, 'rgba(255,255,255,0.05)');
  ctx.fillStyle = textureGradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
}

// Helper to adjust hex color brightness
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Parameter configuration for UI
const stainedGlassParamsConfig: Record<keyof StainedGlassParams, ParamConfig> = {
  cellCount: {
    type: ParamType.RANGE,
    min: 10,
    max: 100,
    step: 5,
    label: 'Cell Count',
  },
  colorScheme: {
    type: ParamType.SELECT,
    options: ['cathedral', 'sunset', 'ocean', 'forest', 'autumn', 'monochrome'],
    label: 'Color Scheme',
  },
  leadWidth: {
    type: ParamType.RANGE,
    min: 1,
    max: 8,
    step: 0.5,
    label: 'Lead Width',
  },
  lightIntensity: {
    type: ParamType.RANGE,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Light Intensity',
  },
  irregularity: {
    type: ParamType.RANGE,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Irregularity',
  },
  seed: {
    type: ParamType.SEED,
    label: 'Pattern Seed',
  },
  animateLight: {
    type: ParamType.BOOLEAN,
    label: 'Animate Light',
  },
};

// Art generator definition
export const stainedGlass: ArtGenerator = {
  name: "Stained Glass",
  description: "Voronoi-based cathedral window simulation with light transmission through colored glass cells and lead framing.",
  defaultParams: stainedGlassDefaultParams,
  paramsConfig: stainedGlassParamsConfig,
  render: renderStainedGlass,
};
