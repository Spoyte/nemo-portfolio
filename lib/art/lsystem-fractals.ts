export interface LsystemFractalsParams {
  iterations: number;
  angle: number;
  colorScheme: 'spring' | 'autumn' | 'winter' | 'neon';
}

export const lsystemFractalsDefaultParams: LsystemFractalsParams = {
  iterations: 5,
  angle: 25,
  colorScheme: 'spring',
};

// L-System rules and state
interface TurtleState {
  x: number;
  y: number;
  angle: number;
  width: number;
}

function generateLSystem(axiom: string, rules: Map<string, string>, iterations: number): string {
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = '';
    for (const char of current) {
      next += rules.get(char) || char;
    }
    current = next;
  }
  return current;
}

function drawBranch(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number,
  color: string,
  progress: number
): void {
  // Animate growth with progress (0-1)
  const endX = x1 + (x2 - x1) * progress;
  const endY = y1 + (y2 - y1) * progress;
  
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

export function renderLsystemFractals(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: LsystemFractalsParams
): void {
  const { iterations, angle, colorScheme } = params;
  
  // Clear with gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, '#0a0a0a');
  bgGradient.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Color palettes for seasons
  const palettes: Record<string, { stem: string[]; leaf: string[]; bg: string }> = {
    spring: {
      stem: ['#2d5016', '#3a6b1a', '#4a7c23', '#5a8f2a'],
      leaf: ['#7cb342', '#9ccc65', '#aed581', '#c5e1a5'],
      bg: '#0a1a0a'
    },
    autumn: {
      stem: ['#4a3728', '#5d442f', '#6b5038', '#7a5c40'],
      leaf: ['#d84315', '#ef6c00', '#f9a825', '#ff8f00'],
      bg: '#1a0f0a'
    },
    winter: {
      stem: ['#37474f', '#455a64', '#546e7a', '#607d8b'],
      leaf: ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6'],
      bg: '#0a0f1a'
    },
    neon: {
      stem: ['#1a0033', '#330066', '#4d0099', '#6600cc'],
      leaf: ['#ff00ff', '#00ffff', '#ff0080', '#80ff00'],
      bg: '#0a0014'
    },
  };
  
  const palette = palettes[colorScheme];
  
  // Plant L-System: Binary branching tree
  // Axiom: X (trunk with potential branches)
  // Rules: X → F[+X][-X]FX (branch and grow)
  //        F → FF (grow longer)
  const axiom = 'X';
  const rules = new Map<string, string>([
    ['X', 'F[+X][-X]FX'],
    ['F', 'FF']
  ]);
  
  const lsystemString = generateLSystem(axiom, rules, Math.min(iterations, 6));
  
  // Animation: growth cycle (0-1) with swaying
  const growthCycle = (Math.sin(time * 0.0005) + 1) / 2; // 0 to 1
  const swayOffset = Math.sin(time * 0.001) * 0.02; // Gentle wind
  
  // Starting position (bottom center)
  const startX = width / 2;
  const startY = height * 0.9;
  const startAngle = -Math.PI / 2; // Pointing up
  const baseLength = Math.min(width, height) * 0.015;
  
  // Stack for branching
  const stack: TurtleState[] = [];
  let current: TurtleState = {
    x: startX,
    y: startY,
    angle: startAngle,
    width: iterations * 1.5
  };
  
  // Track segments for layered rendering (stems first, then leaves)
  const stems: Array<{ x1: number; y1: number; x2: number; y2: number; width: number; depth: number }> = [];
  const leaves: Array<{ x: number; y: number; size: number; depth: number }> = [];
  
  // Parse L-system and build geometry
  let segmentCount = 0;
  const totalSegments = lsystemString.split('').filter(c => c === 'F').length;
  
  for (let i = 0; i < lsystemString.length; i++) {
    const char = lsystemString[i];
    const progress = Math.min(1, growthCycle * 2 - (segmentCount / totalSegments) * 0.5);
    
    if (progress <= 0) break;
    
    switch (char) {
      case 'F': {
        // Draw forward
        const length = baseLength * (1 + Math.random() * 0.1);
        const sway = swayOffset * (stack.length + 1);
        const newX = current.x + Math.cos(current.angle + sway) * length;
        const newY = current.y + Math.sin(current.angle + sway) * length;
        
        stems.push({
          x1: current.x,
          y1: current.y,
          x2: newX,
          y2: newY,
          width: Math.max(0.5, current.width),
          depth: stack.length
        });
        
        current.x = newX;
        current.y = newY;
        segmentCount++;
        break;
      }
      case '+': {
        // Turn right with slight randomness
        current.angle += (angle * Math.PI / 180) + (Math.random() - 0.5) * 0.1;
        break;
      }
      case '-': {
        // Turn left with slight randomness
        current.angle -= (angle * Math.PI / 180) + (Math.random() - 0.5) * 0.1;
        break;
      }
      case '[': {
        // Save state
        stack.push({ ...current });
        current.width *= 0.7; // Taper branch
        break;
      }
      case ']': {
        // Restore state and add leaf
        if (stack.length > 0) {
          leaves.push({
            x: current.x,
            y: current.y,
            size: Math.max(3, (7 - stack.length) * 1.5),
            depth: stack.length
          });
          current = stack.pop()!;
        }
        break;
      }
      case 'X': {
        // Growth marker - add small bud
        if (stack.length > 2 && Math.random() > 0.7) {
          leaves.push({
            x: current.x,
            y: current.y,
            size: 2,
            depth: stack.length + 1
          });
        }
        break;
      }
    }
  }
  
  // Draw stems (bottom to top for proper layering)
  stems.forEach((stem, i) => {
    const colorIndex = Math.min(palette.stem.length - 1, Math.floor(stem.depth / 2));
    const color = palette.stem[colorIndex];
    const segmentProgress = Math.min(1, growthCycle * 3 - (i / stems.length) * 0.3);
    
    if (segmentProgress > 0) {
      drawBranch(ctx, stem.x1, stem.y1, stem.x2, stem.y2, stem.width, color, segmentProgress);
    }
  });
  
  // Draw leaves with glow effect
  leaves.forEach((leaf, i) => {
    const leafProgress = Math.min(1, growthCycle * 2 - (i / leaves.length) * 0.5);
    if (leafProgress <= 0) return;
    
    const colorIndex = Math.min(palette.leaf.length - 1, Math.floor(leaf.depth / 2));
    const color = palette.leaf[colorIndex];
    const size = leaf.size * leafProgress;
    
    // Glow
    ctx.shadowBlur = size * 2;
    ctx.shadowColor = color;
    
    // Leaf shape
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(leaf.x, leaf.y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(leaf.x - size * 0.3, leaf.y - size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Reset shadow
  ctx.shadowBlur = 0;
  
  // Add subtle ground
  const groundGradient = ctx.createLinearGradient(0, height * 0.9, 0, height);
  groundGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  groundGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, height * 0.9, width, height * 0.1);
}
