'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TopographicFlowProps {
  width?: number;
  height?: number;
  noiseScale?: number;
  contourInterval?: number;
  animationSpeed?: number;
  colorScheme?: 'ocean' | 'earth' | 'heatmap' | 'monochrome';
}

const colorSchemes = {
  ocean: {
    low: [10, 30, 60],
    mid: [40, 100, 140],
    high: [200, 220, 240],
    contour: [255, 255, 255],
  },
  earth: {
    low: [60, 40, 20],
    mid: [120, 160, 80],
    high: [220, 210, 180],
    contour: [40, 30, 20],
  },
  heatmap: {
    low: [40, 20, 60],
    mid: [200, 80, 60],
    high: [255, 220, 100],
    contour: [255, 255, 255],
  },
  monochrome: {
    low: [20, 20, 20],
    mid: [100, 100, 100],
    high: [240, 240, 240],
    contour: [255, 255, 255],
  },
};

// Simplex-like noise implementation
class NoiseGenerator {
  private perm: number[];
  
  constructor() {
    this.perm = new Array(512);
    const p = new Array(256).fill(0).map((_, i) => i);
    // Shuffle
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
    }
  }
  
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }
  
  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const A = this.perm[X] + Y;
    const B = this.perm[X + 1] + Y;
    
    return this.lerp(v,
      this.lerp(u, this.grad(this.perm[A], x, y), this.grad(this.perm[B], x - 1, y)),
      this.lerp(u, this.grad(this.perm[A + 1], x, y - 1), this.grad(this.perm[B + 1], x - 1, y - 1))
    );
  }
  
  // Multi-octave noise
  fbm(x: number, y: number, octaves: number = 4): number {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    
    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.noise(x * frequency, y * frequency);
      amplitude *= 0.5;
      frequency *= 2;
    }
    
    return value;
  }
}

export default function TopographicFlow({
  width = 400,
  height = 400,
  noiseScale = 0.003,
  contourInterval = 8,
  animationSpeed = 0.0003,
  colorScheme = 'ocean',
}: TopographicFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const noiseRef = useRef<NoiseGenerator>();
  
  const [isPlaying, setIsPlaying] = useState(true);
  
  useEffect(() => {
    noiseRef.current = new NoiseGenerator();
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !noiseRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const scheme = colorSchemes[colorScheme];
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    const render = () => {
      const time = timeRef.current;
      const noise = noiseRef.current!;
      
      // Pre-calculate offset for animation
      const offsetX = time * 50;
      const offsetY = time * 30;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Get noise value at this position
          const nx = (x + offsetX) * noiseScale;
          const ny = (y + offsetY) * noiseScale;
          const elevation = noise.fbm(nx, ny, 5);
          
          // Normalize to 0-1
          const normalized = (elevation + 1) * 0.5;
          
          // Determine if this is a contour line
          const contourLevel = Math.floor(normalized * 100 / contourInterval);
          const isContour = Math.abs((normalized * 100) - contourLevel * contourInterval) < 1.5;
          
          const idx = (y * width + x) * 4;
          
          if (isContour) {
            // Draw contour line
            data[idx] = scheme.contour[0];
            data[idx + 1] = scheme.contour[1];
            data[idx + 2] = scheme.contour[2];
            data[idx + 3] = 200;
          } else {
            // Fill based on elevation
            let r, g, b;
            if (normalized < 0.4) {
              // Low elevation
              const t = normalized / 0.4;
              r = this.lerp(scheme.low[0], scheme.mid[0], t);
              g = this.lerp(scheme.low[1], scheme.mid[1], t);
              b = this.lerp(scheme.low[2], scheme.mid[2], t);
            } else {
              // High elevation
              const t = (normalized - 0.4) / 0.6;
              r = this.lerp(scheme.mid[0], scheme.high[0], t);
              g = this.lerp(scheme.mid[1], scheme.high[1], t);
              b = this.lerp(scheme.mid[2], scheme.high[2], t);
            }
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    };
    
    const animate = () => {
      render();
      timeRef.current += animationSpeed;
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, noiseScale, contourInterval, animationSpeed, colorScheme, isPlaying]);
  
  // Helper for lerp
  const lerp = (a: number, b: number, t: number): number => a + t * (b - a);
  
  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-700 rounded-lg shadow-lg"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
}
