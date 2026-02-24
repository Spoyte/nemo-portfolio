'use client';

import { useEffect, useRef, useCallback } from 'react';
import { renderLsystemBotany, LsystemBotanyParams, lsystemBotanyDefaultParams } from '@/lib/art/lsystem-botany';

interface LsystemBotanyProps {
  width?: number;
  height?: number;
  params?: Partial<LsystemBotanyParams>;
}

export function LsystemBotany({ width = 400, height = 400, params = {} }: LsystemBotanyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mergedParams = { ...lsystemBotanyDefaultParams, ...params };

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    renderLsystemBotany(ctx, width, height, time, mergedParams);
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
export function getStaticParams(): LsystemBotanyParams {
  return { ...lsystemBotanyDefaultParams };
}
