"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { recursiveTrees } from "@/lib/art/recursive-trees";
import { Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: number;
  angle: number;
  depth: number;
  randomness: number;
  seed: number;
}

const defaultParams: Params = {
  params: 120,
  angle: 0.5,
  depth: 10,
  randomness: 0.3,
  seed: 1,
};

export default function RecursiveTreesPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<Params>(defaultParams);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      if (isPlaying) {
        time += 16;
        recursiveTrees.generate(ctx, params, time);
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
    setParams({
      params: 50 + Math.random() * 150,
      angle: 0.2 + Math.random() * 0.8,
      depth: Math.floor(5 + Math.random() * 10),
      randomness: 0 + Math.random() * 1,
      seed: Math.floor(1 + Math.random() * 9999),
    });
  }, []);

  const reset = useCallback(() => {
    setParams(defaultParams);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Recursive Trees</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Fractal tree structures with organic variation (seeded)
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
                Reset
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Settings
            </h2>

            {/* Params */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Params: {params.params}
              </label>
              <Slider
                value={[params.params]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, params: v }))}
                min={50}
                max={200}
                step={10}
                className="w-full"
              />
            </div>

            {/* Angle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <RotateCw className="w-4 h-4" />
                Angle: {params.angle.toFixed(2)}
              </label>
              <Slider
                value={[params.angle]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, angle: v }))}
                min={0.2}
                max={1.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Depth */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Depth: {params.depth}
              </label>
              <Slider
                value={[params.depth]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, depth: v }))}
                min={5}
                max={15}
                step={1}
                className="w-full"
              />
            </div>

            {/* Randomness */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Randomness: {params.randomness.toFixed(2)}
              </label>
              <Slider
                value={[params.randomness]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, randomness: v }))}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Seed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Seed: {params.seed}
              </label>
              <Slider
                value={[params.seed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, seed: v }))}
                min={1}
                max={10000}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Fractal tree structures with organic variation (seeded)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
