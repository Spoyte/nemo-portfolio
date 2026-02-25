export interface LissajousCurvesParams {
  speed: number;
  frequencyX: number;
  frequencyY: number;
  phaseShift: number;
  trailLength: number;
  colorScheme: 'ocean' | 'sunset' | 'forest' | 'neon' | 'gold';
}

export const lissajousCurvesDefaultParams: LissajousCurvesParams = {
  speed: 30,
  frequencyX: 3,
  frequencyY: 4,
  phaseShift: 0,
  trailLength: 60,
  colorScheme: 'ocean',
};

export function renderLissajousCurves(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: LissajousCurvesParams
): void {
  const { speed, frequencyX, frequencyY, phaseShift, trailLength, colorScheme } = params;
  const t = time * speed * 0.001;
  
  // Semi-transparent clear for trail effect
  ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
  ctx.fillRect(0, 0, width, height);
  
  // Color palettes
  const palettes: Record<string, Array<[number, number, number]>> = {
    ocean: [[0, 50, 100], [0, 100, 180], [50, 150, 220], [100, 200, 255]],
    sunset: [[120, 20, 60], [220, 80, 40], [255, 140, 60], [255, 220, 120]],
    forest: [[20, 60, 20], [40, 120, 40], [80, 180, 80], [150, 240, 120]],
    neon: [[100, 0, 150], [200, 0, 200], [255, 50, 150], [255, 150, 200]],
    gold: [[60, 40, 10], [140, 100, 20], [220, 180, 40], [255, 230, 100]],
  };
  
  const palette = palettes[colorScheme];
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min(width, height) * 0.38;
  
  // Draw multiple Lissajous curves with phase offsets
  const numCurves = 5;
  
  for (let c = 0; c < numCurves; c++) {
    const phaseOffset = (c / numCurves) * Math.PI * 2 + phaseShift * 0.01;
    const color = palette[c % palette.length];
    
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.6 + c * 0.1})`;
    ctx.lineWidth = 2;
    
    // Draw the curve by sampling points
    const steps = 200;
    let firstPoint = true;
    
    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      
      // Lissajous parametric equations
      // x = A * sin(a * θ + δ)
      // y = B * sin(b * θ)
      const x = centerX + scale * Math.sin(frequencyX * theta + t + phaseOffset);
      const y = centerY + scale * Math.sin(frequencyY * theta + t * 0.7 + phaseOffset);
      
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.stroke();
    
    // Draw glowing orb at current position
    const currentTheta = t % (Math.PI * 2);
    const orbX = centerX + scale * Math.sin(frequencyX * currentTheta + t + phaseOffset);
    const orbY = centerY + scale * Math.sin(frequencyY * currentTheta + t * 0.7 + phaseOffset);
    
    const gradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 8);
    gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9)`);
    gradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(orbX, orbY, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw connecting lines between curves (interference pattern)
  ctx.globalCompositeOperation = 'screen';
  ctx.strokeStyle = `rgba(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]}, 0.1)`;
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i < 20; i++) {
    const theta = (i / 20) * Math.PI * 2 + t * 0.3;
    const x1 = centerX + scale * Math.sin(frequencyX * theta + t);
    const y1 = centerY + scale * Math.sin(frequencyY * theta + t * 0.7);
    const x2 = centerX + scale * Math.sin(frequencyX * theta + t + Math.PI);
    const y2 = centerY + scale * Math.sin(frequencyY * theta + t * 0.7 + Math.PI);
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  
  ctx.globalCompositeOperation = 'source-over';
}
