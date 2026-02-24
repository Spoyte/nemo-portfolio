'use client';

import { useEffect, useRef } from 'react';
import { renderReactionDiffusion, ReactionDiffusionParams, defaultReactionDiffusionParams } from '@/lib/art/reaction-diffusion';

interface ReactionDiffusionProps extends Partial<ReactionDiffusionParams> {
  width?: number;
  height?: number;
  className?: string;
}

export function ReactionDiffusion({
  width = 400,
  height = 400,
  className = '',
  ...props
}: ReactionDiffusionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const params: ReactionDiffusionParams = {
      ...defaultReactionDiffusionParams,
      ...props
    };

    const animate = () => {
      const time = Date.now() - startTimeRef.current;
      const imageData = renderReactionDiffusion(width, height, params, time);
      ctx.putImageData(imageData, 0, 0);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, props.feedRate, props.killRate, props.diffusionA, props.diffusionB, props.scale, props.palette]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
