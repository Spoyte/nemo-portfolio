'use client';

import { useEffect, useRef, useCallback } from 'react';
import { renderFluidSmoke, fluidSmokeDefaultParams, FluidSmokeParams } from '@/lib/art/fluid-smoke';
import { fluidSmokeConfig } from '@/lib/art/fluid-smoke-generator';

interface FluidSmokeProps {
  params?: Partial<FluidSmokeParams>;
  width?: number;
  height?: number;
  className?: string;
}

export function FluidSmoke({
  params = {},
  width = 400,
  height = 400,
  className = '',
}: FluidSmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mergedParams = { ...fluidSmokeDefaultParams, ...params };

  const animate = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      renderFluidSmoke(ctx, width, height, time / 1000, mergedParams);
      animationRef.current = requestAnimationFrame(animate);
    },
    [width, height, mergedParams]
  );

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}

export function FluidSmokeWithControls({
  width = 400,
  height = 400,
  className = '',
}: Omit<FluidSmokeProps, 'params'>) {
  const [params, setParams] = useState<FluidSmokeParams>(fluidSmokeDefaultParams);

  return (
    <div className={`space-y-4 ${className}`}>
      <FluidSmoke params={params} width={width} height={height} />
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Viscosity: {params.viscosity}
          </label>
          <input
            type="range"
            min={fluidSmokeConfig.paramConfig.viscosity.min}
            max={fluidSmokeConfig.paramConfig.viscosity.max}
            step={fluidSmokeConfig.paramConfig.viscosity.step}
            value={params.viscosity}
            onChange={(e) =>
              setParams((p) => ({ ...p, viscosity: Number(e.target.value) }))
            }
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diffusion: {params.diffusion}
          </label>
          <input
            type="range"
            min={fluidSmokeConfig.paramConfig.diffusion.min}
            max={fluidSmokeConfig.paramConfig.diffusion.max}
            step={fluidSmokeConfig.paramConfig.diffusion.step}
            value={params.diffusion}
            onChange={(e) =>
              setParams((p) => ({ ...p, diffusion: Number(e.target.value) }))
            }
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source Strength: {params.densitySource}
          </label>
          <input
            type="range"
            min={fluidSmokeConfig.paramConfig.densitySource.min}
            max={fluidSmokeConfig.paramConfig.densitySource.max}
            step={fluidSmokeConfig.paramConfig.densitySource.step}
            value={params.densitySource}
            onChange={(e) =>
              setParams((p) => ({ ...p, densitySource: Number(e.target.value) }))
            }
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color Scheme
          </label>
          <select
            value={params.colorScheme}
            onChange={(e) =>
              setParams((p) => ({ ...p, colorScheme: e.target.value as FluidSmokeParams['colorScheme'] }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fluidSmokeConfig.paramConfig.colorScheme.options?.map((scheme) => (
              <option key={scheme} value={scheme}>
                {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Need to import useState for the controls component
import { useState } from 'react';
