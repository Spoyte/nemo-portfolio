"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { auroraBorealis, auroraBorealisDefaultParams } from "@/lib/art/aurora-borealis";
import { Play, Pause, Sparkles, Wind, Mountain, Star, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function AuroraBorealisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showStars, setShowStars] = useState(true);
  
  const [params, setParams] = useState({
    intensity: 0.8,
    speed: 1.0,
    curtainCount: 4,
    colorShift: 0,
    turbulence: 0.8,
    starDensity: 0.5,
    horizonGlow: 0.6,
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
        time += 16; // ~60fps
        auroraBorealis.generate(ctx, params, time);
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
      intensity: 0.5 + Math.random() * 0.5,
      speed: 0.3 + Math.random() * 2,
      curtainCount: Math.floor(2 + Math.random() * 6),
      colorShift: Math.floor(Math.random() * 360),
      turbulence: 0.4 + Math.random() * 1,
      starDensity: Math.random(),
      horizonGlow: 0.3 + Math.random() * 0.7,
    });
  }, []);

  const reset = useCallback(() => {
    setParams({ ...auroraBorealisDefaultParams });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Aurora Borealis</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Dancing curtains of ionized gas in Earth's magnetosphere — 
            the ethereal Northern Lights rendered through layered noise fields.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-8 items-start">
          {/* Canvas Container */}
          <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center">
              {/* Landscape Canvas */}
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
              <Mountain className="w-5 h-5 text-emerald-400" />
              Aurora Settings
            </h2>

            {/* Intensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Zap className="w-4 h-4" />
                Intensity: {params.intensity.toFixed(2)}
              </label>
              <Slider
                value={[params.intensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, intensity: v }))}
                min={0.2}
                max={1.0}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Speed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Wind className="w-4 h-4" />
                Animation Speed: {params.speed.toFixed(1)}x
              </label>
              <Slider
                value={[params.speed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, speed: v }))}
                min={0.1}
                max={3.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Curtain Count */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Mountain className="w-4 h-4" />
                Curtain Layers: {params.curtainCount}
              </label>
              <Slider
                value={[params.curtainCount]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, curtainCount: v }))}
                min={1}
                max={8}
                step={1}
                className="w-full"
              />
            </div>

            {/* Turbulence */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Sparkles className="w-4 h-4" />
                Turbulence: {params.turbulence.toFixed(1)}
              </label>
              <Slider
                value={[params.turbulence]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, turbulence: v }))}
                min={0.2}
                max={1.5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Star Density */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Star className="w-4 h-4" />
                Star Density: {(params.starDensity * 100).toFixed(0)}%
              </label>
              <Slider
                value={[params.starDensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, starDensity: v }))}
                min={0}
                max={1.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Horizon Glow */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Mountain className="w-4 h-4" />
                Horizon Glow: {(params.horizonGlow * 100).toFixed(0)}%
              </label>
              <Slider
                value={[params.horizonGlow]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, horizonGlow: v }))}
                min={0}
                max={1.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Color Shift */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Sparkles className="w-4 h-4" />
                Color Shift: {params.colorShift}°
              </label>
              <Slider
                value={[params.colorShift]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, colorShift: v }))}
                min={0}
                max={360}
                step={10}
                className="w-full"
              />
              <div 
                className="h-2 mt-2 rounded-full"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${params.colorShift}, 70%, 50%), 
                    hsl(${params.colorShift + 60}, 70%, 50%), 
                    hsl(${params.colorShift + 120}, 70%, 50%), 
                    hsl(${params.colorShift + 180}, 70%, 50%), 
                    hsl(${params.colorShift + 240}, 70%, 50%), 
                    hsl(${params.colorShift + 300}, 70%, 50%))`
                }}
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 space-y-2">
              <p>The aurora forms when charged particles from the sun collide with gases in Earth's atmosphere.</p>
              <p className="text-slate-600">Green: Oxygen at 100-300km • Red: High altitude oxygen • Purple/Blue: Nitrogen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
