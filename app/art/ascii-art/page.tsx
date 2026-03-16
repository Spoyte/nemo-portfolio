"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { asciiArtDefaultParams } from "@/lib/art/ascii-art";
import { Palette, Pause, Play, Sparkles, Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  paramConfig: string;
  charSet: string;
  colorMode: string;
  density: number;
  symmetry: number;
  speed: number;
  fontSize: number;
  invert: number;
}

const defaultParams: Params = {
  paramConfig: 0,
  charSet: 0,
  colorMode: 0,
  density: 0,
  symmetry: 0,
  speed: 0,
  fontSize: 0,
  invert: 0,
};

export default function AsciiArtPage() {
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
        asciiArtDefaultParams.generate(ctx, params, time);
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



      density: 0.1 + Math.random() * 0.9,
      symmetry: Math.floor(1 + Math.random() * 7),
      speed: 0 + Math.random() * 3,
      fontSize: 8 + Math.random() * 16,

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
          <h1 className="text-4xl font-light tracking-tight mb-2">ASCII Art</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Generative text patterns using characters arranged by mathematical algorithms
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







            {/* Density */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Density: {params.density.toFixed(2)}
              </label>
              <Slider
                value={[params.density]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, density: v }))}
                min={0.1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Symmetry */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Symmetry: {params.symmetry}
              </label>
              <Slider
                value={[params.symmetry]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, symmetry: v }))}
                min={1}
                max={8}
                step={1}
                className="w-full"
              />
            </div>

            {/* Speed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Wind className="w-4 h-4" />
                Speed: {params.speed.toFixed(1)}x
              </label>
              <Slider
                value={[params.speed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, speed: v }))}
                min={0}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* FontSize */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FontSize: {params.fontSize}
              </label>
              <Slider
                value={[params.fontSize]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, fontSize: v }))}
                min={8}
                max={24}
                step={2}
                className="w-full"
              />
            </div>



            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Generative text patterns using characters arranged by mathematical algorithms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
