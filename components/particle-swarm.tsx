'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { renderParticleSwarm, particleSwarmDefaultParams, ParticleSwarmParams } from '@/lib/art/particle-swarm';

interface ParticleSwarmProps {
  width?: number;
  height?: number;
  params?: ParticleSwarmParams;
}

export function ParticleSwarm({ 
  width = 400, 
  height = 400, 
  params = particleSwarmDefaultParams 
}: ParticleSwarmProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const paramsRef = useRef(params);
  
  // Update params ref when props change
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas on first render
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    let startTime = Date.now();

    const animate = () => {
      const time = (Date.now() - startTime) / 1000;
      const rect = canvas.getBoundingClientRect();
      
      // Convert mouse position to canvas coordinates
      let mouseX = mouseRef.current.x;
      let mouseY = mouseRef.current.y;
      if (mouseX !== null && mouseY !== null) {
        mouseX = (mouseX - rect.left) * (width / rect.width);
        mouseY = (mouseY - rect.top) * (height / rect.height);
      }
      
      renderParticleSwarm(ctx, width, height, time, paramsRef.current, mouseX, mouseY);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: null, y: null };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="rounded-lg cursor-crosshair"
      style={{ width: '100%', height: 'auto', maxWidth: width }}
    />
  );
}

export function ParticleSwarmWithControls() {
  const [params, setParams] = useState<ParticleSwarmParams>(particleSwarmDefaultParams);
  const [attractionLabel, setAttractionLabel] = useState('Neutral');

  const updateAttractionLabel = (value: number) => {
    if (value < 30) setAttractionLabel('Flee (Repel)');
    else if (value > 70) setAttractionLabel('Follow (Attract)');
    else setAttractionLabel('Neutral');
  };

  return (
    <div className="space-y-4">
      <ParticleSwarm params={params} />
      
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">
            Particles: {params.particleCount}
          </label>
          <input
            type="range"
            min="50"
            max="500"
            value={params.particleCount}
            onChange={(e) => setParams({ ...params, particleCount: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Speed: {params.speed}
          </label>
          <input
            type="range"
            min="10"
            max="150"
            value={params.speed}
            onChange={(e) => setParams({ ...params, speed: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Mouse Behavior: {attractionLabel} ({params.attraction})
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={params.attraction}
            onChange={(e) => {
              const val = Number(e.target.value);
              setParams({ ...params, attraction: val });
              updateAttractionLabel(val);
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Flee</span>
            <span>Neutral</span>
            <span>Follow</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Cohesion: {params.cohesion}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={params.cohesion}
            onChange={(e) => setParams({ ...params, cohesion: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Trail: {params.trail}
          </label>
          <input
            type="range"
            min="0"
            max="95"
            value={params.trail}
            onChange={(e) => setParams({ ...params, trail: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color Scheme</label>
          <select
            value={params.colorScheme}
            onChange={(e) => setParams({ ...params, colorScheme: e.target.value as any })}
            className="w-full p-2 border rounded"
          >
            <option value="fire">Fire (Red-Orange-Yellow)</option>
            <option value="ocean">Ocean (Cyan-Blue)</option>
            <option value="neon">Neon (Purple-Pink-Green)</option>
            <option value="monochrome">Monochrome (White/Gray)</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-600 italic">
        💡 Move your mouse over the canvas to interact with the particles!
      </p>
    </div>
  );
}

// For gallery integration - returns static params for thumbnail
export function getStaticParams(): ParticleSwarmParams {
  return {
    particleCount: 150,
    speed: 50,
    attraction: 50,
    cohesion: 30,
    trail: 70,
    colorScheme: 'ocean',
  };
}
