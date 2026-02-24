export interface LightCavernsParams {
  rayCount: number;
  cavernDepth: number;
  crystalDensity: number;
  colorScheme: 'emerald' | 'amethyst' | 'sapphire' | 'amber';
}

export const lightCavernsDefaultParams: LightCavernsParams = {
  rayCount: 12,
  cavernDepth: 50,
  crystalDensity: 40,
  colorScheme: 'emerald',
};

export function renderLightCaverns(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: LightCavernsParams
): void {
  const { rayCount, cavernDepth, crystalDensity, colorScheme } = params;
  const t = time * 0.0005;
  
  // Clear with deep void
  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, width, height);
  
  // Get pixel data for direct manipulation
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  // Color palettes - crystalline cave aesthetics
  const palettes: Record<string, Array<[number, number, number]>> = {
    emerald: [[5, 20, 10], [20, 80, 40], [60, 200, 100], [150, 255, 180], [200, 255, 220]],
    amethyst: [[15, 5, 20], [60, 20, 80], [150, 60, 200], [220, 150, 255], [240, 200, 255]],
    sapphire: [[5, 10, 25], [15, 40, 100], [40, 100, 220], [100, 180, 255], [180, 220, 255]],
    amber: [[25, 10, 5], [80, 40, 10], [200, 120, 20], [255, 200, 80], [255, 240, 180]],
  };
  
  const palette = palettes[colorScheme];
  
  // Generate light ray sources (from top, like sunbeams through cave openings)
  const rays: Array<{ x: number; angle: number; intensity: number; width: number }> = [];
  for (let i = 0; i < rayCount; i++) {
    rays.push({
      x: (width / (rayCount + 1)) * (i + 1) + Math.sin(t + i * 0.5) * 20,
      angle: Math.PI / 2 + Math.sin(t * 0.3 + i) * 0.15,
      intensity: 0.6 + Math.sin(t * 0.7 + i * 1.3) * 0.3,
      width: 30 + Math.sin(t * 0.5 + i * 0.8) * 15,
    });
  }
  
  // Generate crystal formations (stalactites/stalagmites)
  const crystals: Array<{ x: number; y: number; size: number; phase: number }> = [];
  const crystalCount = Math.floor(crystalDensity * 1.5);
  for (let i = 0; i < crystalCount; i++) {
    const cx = (width / crystalCount) * i + Math.sin(i * 2.5) * 30;
    const isTop = i % 2 === 0;
    crystals.push({
      x: cx,
      y: isTop ? 0 : height,
      size: 20 + Math.sin(i * 1.7) * 15 + crystalDensity * 0.3,
      phase: i * 0.5 + t,
    });
  }
  
  // Sample every 2x2 pixels for performance
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      let brightness = 0;
      let depthFactor = 1;
      
      // Calculate volumetric light contribution from each ray
      for (const ray of rays) {
        // Distance from ray center line
        const rayDx = x - ray.x;
        const rayDy = y; // Rays come from top
        
        // Project point onto ray direction
        const rayDirX = Math.sin(ray.angle);
        const rayDirY = Math.cos(ray.angle);
        
        // Perpendicular distance to ray
        const perpDist = Math.abs(rayDx * rayDirY - rayDy * rayDirX);
        
        // Distance along ray (for attenuation)
        const alongRay = rayDx * rayDirX + rayDy * rayDirY;
        
        // Volumetric scattering falloff
        if (alongRay > 0 && alongRay < height * 1.5) {
          const scatter = Math.exp(-perpDist / ray.width) * Math.exp(-alongRay / (height * 0.8));
          brightness += scatter * ray.intensity * 0.4;
        }
      }
      
      // Add cavern depth effect (darker further from light sources)
      const centerDist = Math.abs(x - width / 2) / (width / 2);
      depthFactor = 1 - centerDist * (cavernDepth / 100);
      
      // Crystal glow effect
      for (const crystal of crystals) {
        const cdx = x - crystal.x;
        const cdy = y - crystal.y;
        const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
        
        if (cDist < crystal.size) {
          // Inside crystal - add glow
          const crystalGlow = (1 - cDist / crystal.size) * 0.3 * (0.5 + Math.sin(crystal.phase) * 0.5);
          brightness += crystalGlow;
        }
      }
      
      // Add subtle noise for dust motes in light
      const noise = Math.sin(x * 0.1 + t) * Math.cos(y * 0.1 + t * 0.7) * 0.05;
      brightness += noise;
      
      // Apply depth factor
      brightness *= depthFactor;
      
      // Clamp and map to palette
      brightness = Math.max(0, Math.min(1, brightness));
      
      // Non-linear brightness for more dramatic contrast
      brightness = Math.pow(brightness, 0.7);
      
      const colorIndex = Math.min(Math.floor(brightness * (palette.length - 1)), palette.length - 2);
      const colorT = brightness * (palette.length - 1) - colorIndex;
      
      const [r1, g1, b1] = palette[colorIndex];
      const [r2, g2, b2] = palette[colorIndex + 1] || palette[colorIndex];
      
      const r = Math.floor(r1 + (r2 - r1) * colorT);
      const g = Math.floor(g1 + (g2 - g1) * colorT);
      const b = Math.floor(b1 + (b2 - b1) * colorT);
      
      // Fill 2x2 block
      for (let dy = 0; dy < 2 && y + dy < height; dy++) {
        for (let dx = 0; dx < 2 && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          pixels[idx] = r;
          pixels[idx + 1] = g;
          pixels[idx + 2] = b;
          pixels[idx + 3] = 255;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add crystal highlights on top
  ctx.globalCompositeOperation = 'screen';
  for (const crystal of crystals) {
    const gradient = ctx.createLinearGradient(
      crystal.x, crystal.y,
      crystal.x + Math.sin(crystal.phase) * 10, 
      crystal.y + (crystal.y === 0 ? 1 : -1) * crystal.size
    );
    
    const [,,, bright] = palette[palette.length - 1];
    gradient.addColorStop(0, `rgba(${bright}, ${bright}, ${bright}, 0.3)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(crystal.x - crystal.size * 0.3, crystal.y);
    ctx.lineTo(crystal.x, crystal.y + (crystal.y === 0 ? 1 : -1) * crystal.size);
    ctx.lineTo(crystal.x + crystal.size * 0.3, crystal.y);
    ctx.closePath();
    ctx.fill();
  }
  
  ctx.globalCompositeOperation = 'source-over';
}
