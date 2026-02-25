'use client';

import { useEffect, useRef, useCallback } from 'react';
import { renderBoidFlocking, BoidFlockingParams, boidFlockingDefaultParams } from '@/lib/art/boid-flocking';

interface BoidFlockingProps {
  width?: number;
  height?: number;
  params?: Partial<BoidFlockingParams>;
}

export function BoidFlocking({ width = 400, height = 400, params = {} }: BoidFlockingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mergedParams = { ...boidFlockingDefaultParams, ...params };

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    renderBoidFlocking(ctx, width, height, time, mergedParams);
    animationRef.current = requestAnimationFrame(animate);
  }, [width, height, mergedParams]);

  useEffect(() => {
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
export function getStaticParams(): BoidFlockingParams {
  return { ...boidFlockingDefaultParams };
}
