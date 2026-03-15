"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Sparkles, RotateCcw, SlidersHorizontal, Layers, Maximize, Zap, Palette, Shuffle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";


// TODO: Import your art generator
// import { yourGenerator } from "@/lib/art/flow-field";

export default function FlowFieldPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [params, setParams] = useState({
    particleCount: 500,
    noiseScale: 0.01,
    speed: 2,
    colorHue: 200,
    seed: 1,
  });

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
        // TODO: Call your generator's render method
        // Example: artGenerator.generate(ctx, params, time)
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
        const height = Math.min(window.innerHeight * 0.65, 650);
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
    setIsPlaying((prev) => !prev);
  }, []);

  const randomize = useCallback(() => {
    setParams({
      particleCount: 0 + Math.floor(Math.random() * 100) * 1,
      noiseScale: 0 + Math.floor(Math.random() * 100) * 1,
      speed: 0 + Math.floor(Math.random() * 100) * 1,
      colorHue: 0 + Math.floor(Math.random() * 100) * 1,
      seed: 0 + Math.floor(Math.random() * 100) * 1,
    });
  }, []);

  const reset = useCallback(() => {
    setParams({
    particleCount: 500,
    noiseScale: 0.01,
    speed: 2,
    colorHue: 200,
    seed: 1,
  });
  }, []);

  const updateParam = useCallback(<K extends string>(
    key: K,
    value: any
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-cyan-950 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Flow Field</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Interactive generative art visualization. Adjust parameters to explore
            different variations of the algorithm.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-8 items-start">
          {/* Canvas Container */}
          <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center">
              <div 
                className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800/50"
                style={{ boxShadow: `0 25px 50px -12px #06B6D420` }}
              >
                <canvas ref={canvasRef} className="block" />
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
              <SlidersHorizontal className="w-5 h-5" style={{ color: '#06B6D4' }} />
              Parameters
            </h2>

            {/* Count */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Layers className="w-4 h-4" />
                Count: {typeof params.particleCount === 'number' ? params.particleCount.toFixed(0) : params.particleCount}
              </label>
              <Slider
                value={[params.particleCount]}
                onValueChange={([v]) => updateParam("particleCount", v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Scale */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Maximize className="w-4 h-4" />
                Scale: {typeof params.noiseScale === 'number' ? params.noiseScale.toFixed(0) : params.noiseScale}
              </label>
              <Slider
                value={[params.noiseScale]}
                onValueChange={([v]) => updateParam("noiseScale", v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Speed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Zap className="w-4 h-4" />
                Speed: {typeof params.speed === 'number' ? params.speed.toFixed(0) : params.speed}
              </label>
              <Slider
                value={[params.speed]}
                onValueChange={([v]) => updateParam("speed", v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Hue */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                Hue: {typeof params.colorHue === 'number' ? params.colorHue.toFixed(0) : params.colorHue}
              </label>
              <Slider
                value={[params.colorHue]}
                onValueChange={([v]) => updateParam("colorHue", v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Seed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Shuffle className="w-4 h-4" />
                Seed: {typeof params.seed === 'number' ? params.seed.toFixed(0) : params.seed}
              </label>
              <Slider
                value={[params.seed]}
                onValueChange={([v]) => updateParam("seed", v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 space-y-2">
              <p>
                This visualization uses mathematical algorithms to generate
                unique patterns. Each parameter affects different aspects of
                the visual output.
              </p>
              <p className="text-slate-600">
                Try randomizing to discover unexpected variations, or fine-tune
                individual parameters for precise control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
