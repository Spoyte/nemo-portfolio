'use client';

import { useEffect, useRef, useCallback } from 'react';
import { renderFlowingMagnetism, FlowingMagnetismParams, flowingMagnetismDefaultParams } from '@/lib/art/flowing-magnetism';

interface FlowingMagnetismProps {
  width?: number;
  height?: number;
  params?: Partial<FlowingMagnetismParams>;
}

export function FlowingMagnetism({ width = 400, height = 400, params = {} }: FlowingMagnetismProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mergedParams = { ...flowingMagnetismDefaultParams, ...params };

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    renderFlowingMagnetism(ctx, width, height, time, mergedParams);
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

export function getStaticParams(): FlowingMagnetismParams {
  return { ...flowingMagnetismDefaultParams };
}
