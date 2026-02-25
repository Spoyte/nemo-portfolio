'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { renderLissajousCurves, LissajousCurvesParams, lissajousCurvesDefaultParams } from '@/lib/art/lissajous-curves';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LissajousCurvesProps {
  width?: number;
  height?: number;
  params?: Partial<LissajousCurvesParams>;
  showControls?: boolean;
}

const colorSchemes: LissajousCurvesParams['colorScheme'][] = ['ocean', 'sunset', 'forest', 'neon', 'gold'];

export function LissajousCurves({ width = 400, height = 400, params = {}, showControls = true }: LissajousCurvesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [localParams, setLocalParams] = useState<LissajousCurvesParams>({ ...lissajousCurvesDefaultParams, ...params });

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    renderLissajousCurves(ctx, width, height, time, localParams);
    animationRef.current = requestAnimationFrame(animate);
  }, [width, height, localParams]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const randomize = () => {
    setLocalParams(prev => ({
      ...prev,
      frequencyX: Math.floor(Math.random() * 8) + 1,
      frequencyY: Math.floor(Math.random() * 8) + 1,
      phaseShift: Math.random() * 100,
    }));
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg w-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
      
      {showControls && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Parameters</h3>
            <Button variant="outline" size="sm" onClick={randomize}>
              Randomize
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Speed</Label>
              <span className="text-sm text-muted-foreground">{localParams.speed}</span>
            </div>
            <Slider
              value={[localParams.speed]}
              onValueChange={([v]) => setLocalParams(p => ({ ...p, speed: v }))}
              min={5}
              max={100}
              step={5}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Freq X</Label>
                <span className="text-sm text-muted-foreground">{localParams.frequencyX}</span>
              </div>
              <Slider
                value={[localParams.frequencyX]}
                onValueChange={([v]) => setLocalParams(p => ({ ...p, frequencyX: v }))}
                min={1}
                max={10}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Freq Y</Label>
                <span className="text-sm text-muted-foreground">{localParams.frequencyY}</span>
              </div>
              <Slider
                value={[localParams.frequencyY]}
                onValueChange={([v]) => setLocalParams(p => ({ ...p, frequencyY: v }))}
                min={1}
                max={10}
                step={1}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Phase Shift</Label>
              <span className="text-sm text-muted-foreground">{localParams.phaseShift.toFixed(0)}</span>
            </div>
            <Slider
              value={[localParams.phaseShift]}
              onValueChange={([v]) => setLocalParams(p => ({ ...p, phaseShift: v }))}
              min={0}
              max={100}
              step={1}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color Scheme</Label>
            <div className="flex flex-wrap gap-2">
              {colorSchemes.map(scheme => (
                <Badge
                  key={scheme}
                  variant={localParams.colorScheme === scheme ? 'default' : 'outline'}
                  className="cursor-pointer capitalize"
                  onClick={() => setLocalParams(p => ({ ...p, colorScheme: scheme }))}
                >
                  {scheme}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Static params for gallery integration
export function getStaticParams(): LissajousCurvesParams {
  return { ...lissajousCurvesDefaultParams };
}
