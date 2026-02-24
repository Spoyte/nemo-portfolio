"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";

interface Cell {
  x: number;
  y: number;
  color: string;
  radius: number;
  growth: number;
}

interface VoronoiArtProps {
  width?: number;
  height?: number;
  cellCount?: number;
  seed?: number;
  colorPalette?: "ocean" | "sunset" | "forest" | "monochrome" | "neon";
  animate?: boolean;
}

const colorPalettes = {
  ocean: ["#0066cc", "#0099ff", "#00ccff", "#66e0ff", "#b3f0ff", "#004080"],
  sunset: ["#ff6b35", "#f7931e", "#ffd23f", "#ff6b9d", "#c44569", "#2c003e"],
  forest: ["#2d5016", "#3a6b1f", "#4a8b2c", "#7cb342", "#aed581", "#1b3d0d"],
  monochrome: ["#0a0a0a", "#2a2a2a", "#4a4a4a", "#6a6a6a", "#8a8a8a", "#aaaaaa"],
  neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00", "#8000ff"],
};

export function VoronoiOrganic({
  width = 800,
  height = 600,
  cellCount = 40,
  seed = Math.random(),
  colorPalette = "ocean",
  animate = true,
}: VoronoiArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  // Seeded random number generator
  const seededRandom = useCallback((seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }, []);

  // Initialize cells with organic distribution
  const initCells = useCallback(() => {
    const palette = colorPalettes[colorPalette];
    const cells: Cell[] = [];
    
    for (let i = 0; i < cellCount; i++) {
      const seedOffset = seed + i * 0.1;
      cells.push({
        x: seededRandom(seedOffset) * width,
        y: seededRandom(seedOffset + 100) * height,
        color: palette[Math.floor(seededRandom(seedOffset + 200) * palette.length)],
        radius: 30 + seededRandom(seedOffset + 300) * 50,
        growth: 0.5 + seededRandom(seedOffset + 400) * 1.5,
      });
    }
    
    cellsRef.current = cells;
  }, [cellCount, width, height, seed, colorPalette, seededRandom]);

  // Distance function with organic distortion
  const getDistance = useCallback((x: number, y: number, cell: Cell, time: number) => {
    const dx = x - cell.x;
    const dy = y - cell.y;
    const euclidean = Math.sqrt(dx * dx + dy * dy);
    
    // Add organic wobble based on time and position
    const wobble = Math.sin(x * 0.01 + time * cell.growth) * 
                   Math.cos(y * 0.01 + time * cell.growth * 0.7) * 10;
    
    return euclidean + wobble;
  }, []);

  // Render the Voronoi diagram
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cells = cellsRef.current;
    const time = timeRef.current;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Sample at lower resolution for performance
    const step = 2;
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        let minDist = Infinity;
        let nearestCell: Cell | null = null;
        let secondDist = Infinity;

        // Find nearest and second nearest cells
        for (const cell of cells) {
          const dist = getDistance(x, y, cell, time);
          if (dist < minDist) {
            secondDist = minDist;
            minDist = dist;
            nearestCell = cell;
          } else if (dist < secondDist) {
            secondDist = dist;
          }
        }

        if (nearestCell) {
          // Calculate edge intensity
          const edgeFactor = Math.min(1, (secondDist - minDist) / 30);
          
          // Parse hex color
          const hex = nearestCell.color;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          
          // Add depth based on distance from cell center
          const depth = Math.max(0.3, 1 - minDist / nearestCell.radius);
          
          // Edge highlight
          const edgeHighlight = edgeFactor < 0.3 ? (0.3 - edgeFactor) * 3 : 0;
          
          const finalR = Math.min(255, r * depth + edgeHighlight * 100);
          const finalG = Math.min(255, g * depth + edgeHighlight * 100);
          const finalB = Math.min(255, b * depth + edgeHighlight * 100);

          // Fill the step x step block
          for (let dy = 0; dy < step && y + dy < height; dy++) {
            for (let dx = 0; dx < step && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              data[idx] = finalR;
              data[idx + 1] = finalG;
              data[idx + 2] = finalB;
              data[idx + 3] = 255;
            }
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [width, height, getDistance]);

  // Animation loop
  useEffect(() => {
    initCells();
    
    if (animate) {
      const animate = () => {
        timeRef.current += 0.02;
        render();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      render();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initCells, render, animate]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg"
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}

// Static version for export
export function generateVoronoiSVG(
  width: number,
  height: number,
  cellCount: number = 30,
  colorPalette: "ocean" | "sunset" | "forest" | "monochrome" | "neon" = "ocean"
): string {
  const palette = colorPalettes[colorPalette];
  const cells: Cell[] = [];
  
  // Generate cells
  for (let i = 0; i < cellCount; i++) {
    cells.push({
      x: Math.random() * width,
      y: Math.random() * height,
      color: palette[Math.floor(Math.random() * palette.length)],
      radius: 30 + Math.random() * 50,
      growth: 0.5 + Math.random() * 1.5,
    });
  }

  // Generate SVG paths
  const paths: string[] = [];
  const resolution = 10; // Grid resolution for approximation

  for (let y = 0; y < height; y += resolution) {
    for (let x = 0; x < width; x += resolution) {
      let minDist = Infinity;
      let nearestCell: Cell | null = null;

      for (const cell of cells) {
        const dx = x - cell.x;
        const dy = y - cell.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          nearestCell = cell;
        }
      }

      if (nearestCell) {
        const depth = Math.max(0.3, 1 - minDist / nearestCell.radius);
        const hex = nearestCell.color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        const finalR = Math.floor(r * depth);
        const finalG = Math.floor(g * depth);
        const finalB = Math.floor(b * depth);
        
        paths.push(
          `<rect x="${x}" y="${y}" width="${resolution}" height="${resolution}" ` +
          `fill="rgb(${finalR},${finalG},${finalB})" />`
        );
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\n` +
         paths.join("\n") +
         `\n</svg>`;
}
