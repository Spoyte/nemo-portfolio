'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { renderImpossibleGeometry, ImpossibleGeometryParams, impossibleGeometryDefaultParams } from '@/lib/art/impossible-geometry';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImpossibleGeometryProps {
  width?: number;
  height?: number;
  params?: Partial<ImpossibleGeometryParams>;
  showControls?: boolean;
}

export function ImpossibleGeometry({ 
  width = 400, 
  height = 400, 
  params = {},
  showControls = true 
}: ImpossibleGeometryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [localParams, setLocalParams] = useState<ImpossibleGeometryParams>({
    ...impossibleGeometryDefaultParams,
    ...params
  });

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    renderImpossibleGeometry(ctx, width, height, time, localParams);
    animationRef.current = requestAnimationFrame(animate);
  }, [width, height, localParams]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const updateParam = <K extends keyof ImpossibleGeometryParams>(
    key: K,
    value: ImpossibleGeometryParams[K]
  ) => {
    setLocalParams(prev => ({ ...prev, [key]: value }));
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
          <div className="space-y-2">
            <Label>Figure</Label>
            <Select 
              value={localParams.figure} 
              onValueChange={(v) => updateParam('figure', v as ImpossibleGeometryParams['figure'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Figures</SelectItem>
                <SelectItem value="penrose-triangle">Penrose Triangle</SelectItem>
                <SelectItem value="impossible-staircase">Impossible Staircase</SelectItem>
                <SelectItem value="blivet">Blivet (Devil's Fork)</SelectItem>
                <SelectItem value="necker-cube">Necker Cube</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reveal Mode</Label>
            <Select 
              value={localParams.revealMode} 
              onValueChange={(v) => updateParam('revealMode', v as ImpossibleGeometryParams['revealMode'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="construct">Construct</SelectItem>
                <SelectItem value="deconstruct">Deconstruct</SelectItem>
                <SelectItem value="pulse">Pulse</SelectItem>
                <SelectItem value="rotate">Rotate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color Scheme</Label>
            <Select 
              value={localParams.colorScheme} 
              onValueChange={(v) => updateParam('colorScheme', v as ImpossibleGeometryParams['colorScheme'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="neon">Neon</SelectItem>
                <SelectItem value="monochrome">Monochrome</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="cool">Cool</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Speed</Label>
              <span className="text-sm text-muted-foreground">{localParams.speed}</span>
            </div>
            <Slider
              value={[localParams.speed]}
              onValueChange={([v]) => updateParam('speed', v)}
              min={5}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Complexity</Label>
              <span className="text-sm text-muted-foreground">{localParams.complexity}</span>
            </div>
            <Slider
              value={[localParams.complexity]}
              onValueChange={([v]) => updateParam('complexity', v)}
              min={20}
              max={80}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Line Width</Label>
              <span className="text-sm text-muted-foreground">{localParams.lineWidth}</span>
            </div>
            <Slider
              value={[localParams.lineWidth]}
              onValueChange={([v]) => updateParam('lineWidth', v)}
              min={1}
              max={8}
              step={1}
            />
          </div>
        </Card>
      )}
    </div>
  );
}

// Static params for gallery integration
export function getStaticParams(): ImpossibleGeometryParams {
  return { ...impossibleGeometryDefaultParams };
}
