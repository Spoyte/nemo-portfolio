'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { renderOrbitalMechanics, OrbitalMechanicsParams, orbitalMechanicsDefaultParams } from '@/lib/art/orbital-mechanics';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  hue: number;
  trail: Array<{ x: number; y: number }>;
}

interface OrbitalMechanicsProps {
  width?: number;
  height?: number;
  params?: Partial<OrbitalMechanicsParams>;
}

export function OrbitalMechanics({ width = 400, height = 400, params = {} }: OrbitalMechanicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mergedParams = { ...orbitalMechanicsDefaultParams, ...params };

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    particlesRef.current = renderOrbitalMechanics(
      ctx, 
      width, 
      height, 
      time, 
      mergedParams,
      particlesRef.current,
      particlesRef.current.length === 0
    );
    
    animationRef.current = requestAnimationFrame(animate);
  }, [width, height, mergedParams]);

  useEffect(() => {
    particlesRef.current = []; // Reset particles when params change
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}

// Static params for gallery integration
export function getStaticParams(): OrbitalMechanicsParams {
  return { ...orbitalMechanicsDefaultParams };
}

// Parameter controls component
export function OrbitalMechanicsControls({ 
  params, 
  onChange 
}: { 
  params: OrbitalMechanicsParams; 
  onChange: (params: OrbitalMechanicsParams) => void;
}) {
  const [localParams, setLocalParams] = useState(params);

  const updateParam = <K extends keyof OrbitalMechanicsParams>(key: K, value: OrbitalMechanicsParams[K]) => {
    const newParams = { ...localParams, [key]: value };
    setLocalParams(newParams);
    onChange(newParams);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900 rounded-lg">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Particles: {localParams.particleCount}</label>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={localParams.particleCount}
          onChange={(e) => updateParam('particleCount', parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Gravity: {localParams.gravityStrength}</label>
        <input
          type="range"
          min="10"
          max="150"
          step="10"
          value={localParams.gravityStrength}
          onChange={(e) => updateParam('gravityStrength', parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Trail Length: {localParams.trailLength}</label>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={localParams.trailLength}
          onChange={(e) => updateParam('trailLength', parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Color Scheme</label>
        <div className="flex flex-wrap gap-2">
          {(['cosmic', 'solar', 'nebula', 'monochrome'] as const).map((scheme) => (
            <button
              key={scheme}
              onClick={() => updateParam('colorScheme', scheme)}
              className={`px-3 py-1 text-sm rounded capitalize transition-colors ${
                localParams.colorScheme === scheme
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {scheme}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
