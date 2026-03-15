"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { bioluminescentPlankton, bioluminescentPlanktonDefaultParams } from "@/lib/art/bioluminescent-plankton";
import { Play, Pause, Sparkles, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// Parameter control component
interface ParamControlProps {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
}

function ParamControl({ name, value, min, max, step, onChange, icon }: ParamControlProps) {
  return (
    <div className="mb-5">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
        {icon}
        {name}: {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
      </label>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}

export default function BioluminescentPlanktonPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Initialize params from default
  const [params, setParams] = useState(bioluminescentPlanktonDefaultParams);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    
    const animate = () => {
      if (isPlaying) {
        time += 16; // ~60fps
        bioluminescentPlankton.generate(ctx, params, time);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, params]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const width = Math.min(rect.width, 900);
        const height = Math.min(window.innerHeight * 0.6, 600);
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const randomize = useCallback(() => {
    const newParams: Record<string, number> = {};
    Object.entries(bioluminescentPlankton.params).forEach(([key, def]) => {
      if (def.type === 'range') {
        const range = def.max - def.min;
        newParams[key] = def.min + Math.random() * range;
        // Round to step
        newParams[key] = Math.round(newParams[key] / def.step) * def.step;
      }
    });
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const reset = useCallback(() => {
    setParams({ ...bioluminescentPlanktonDefaultParams });
  }, []);

  const updateParam = useCallback((key: string, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Bioluminescent Plankton</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Genetic algorithm simulation of evolving bioluminescent organisms. Plankton with varying traits compete for food, reproduce with mutation, and adapt over generations.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-8 items-start">
          {/* Canvas Container */}
          <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800/50">
                <canvas
                  ref={canvasRef}
                  className="block"
                />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12 rounded-full border-slate-700 hover:bg-slate-800"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="outline"
                onClick={randomize}
                className="rounded-full border-slate-700 hover:bg-slate-800"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Randomize
              </Button>
              <Button
                variant="ghost"
                onClick={reset}
                className="rounded-full text-slate-500 hover:text-slate-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Parameters
            </h2>

            {Object.entries(bioluminescentPlankton.params).map(([key, def]) => (
              def.type === 'range' && (
                <ParamControl
                  key={key}
                  name={def.name}
                  value={(params[key] as number) ?? def.default}
                  min={def.min}
                  max={def.max}
                  step={def.step}
                  onChange={(v) => updateParam(key, v)}
                  icon={<Sparkles className="w-4 h-4 text-slate-400" />}
                />
              )
            ))}

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Part of the generative art collection. Each piece is procedurally generated.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
