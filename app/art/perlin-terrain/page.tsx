"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { perlinTerrainGenerator } from "@/lib/art/perlin-terrain";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  earth: number;
  scale: number;
  heightScale: number;
  waterLevel: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  rotation: number;
  tilt: number;
  colorScheme: string;
}

const defaultParams: Params = {
  earth: 42,
  scale: 40,
  heightScale: 80,
  waterLevel: 30,
  octaves: 4,
  persistence: 0.5,
  lacunarity: 2.0,
  rotation: 45,
  tilt: 30,
  colorScheme: "earth",
};

export default function PerlinTerrainPage() {
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
        perlinTerrainGenerator.generate(ctx, params, time);
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
      earth: Math.floor(0 + Math.random() * 100000),
      scale: Math.floor(10 + Math.random() * 90),
      heightScale: 30 + Math.random() * 120,
      waterLevel: Math.floor(0 + Math.random() * 100),
      octaves: Math.floor(1 + Math.random() * 7),
      persistence: 0.1 + Math.random() * 0.7000000000000001,
      lacunarity: 1.5 + Math.random() * 1.5,
      rotation: 0 + Math.random() * 360,
      tilt: 10 + Math.random() * 50,
      colorScheme: ["earth", "arctic", "mars", "forest", "moon"][Math.floor(Math.random() * 5)],
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Perlin Terrain</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            3D terrain generation using fractal Perlin noise with multiple biomes — from alpine lakes to Martian canyons.
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

            {/* Earth */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Earth: {params.earth}
              </label>
              <Slider
                value={[params.earth]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, earth: v }))}
                min={0}
                max={100000}
                step={1}
                className="w-full"
              />
            </div>

            {/* Scale */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <ZoomIn className="w-4 h-4" />
                Scale: {params.scale}
              </label>
              <Slider
                value={[params.scale]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, scale: v }))}
                min={10}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* HeightScale */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                HeightScale: {params.heightScale}
              </label>
              <Slider
                value={[params.heightScale]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, heightScale: v }))}
                min={30}
                max={150}
                step={5}
                className="w-full"
              />
            </div>

            {/* WaterLevel */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                WaterLevel: {params.waterLevel}
              </label>
              <Slider
                value={[params.waterLevel]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, waterLevel: v }))}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Octaves */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Octaves: {params.octaves}
              </label>
              <Slider
                value={[params.octaves]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, octaves: v }))}
                min={1}
                max={8}
                step={1}
                className="w-full"
              />
            </div>

            {/* Persistence */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Persistence: {params.persistence.toFixed(2)}
              </label>
              <Slider
                value={[params.persistence]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, persistence: v }))}
                min={0.1}
                max={0.8}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Lacunarity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Lacunarity: {params.lacunarity.toFixed(2)}
              </label>
              <Slider
                value={[params.lacunarity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, lacunarity: v }))}
                min={1.5}
                max={3.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Rotation */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <RotateCw className="w-4 h-4" />
                Rotation: {params.rotation}
              </label>
              <Slider
                value={[params.rotation]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, rotation: v }))}
                min={0}
                max={360}
                step={5}
                className="w-full"
              />
            </div>

            {/* Tilt */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Tilt: {params.tilt}
              </label>
              <Slider
                value={[params.tilt]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, tilt: v }))}
                min={10}
                max={60}
                step={5}
                className="w-full"
              />
            </div>

            {/* ColorScheme */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorScheme
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "earth" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "earth"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  earth
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "arctic" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "arctic"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  arctic
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "mars" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "mars"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  mars
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "forest" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "forest"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  forest
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "moon" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "moon"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  moon
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>3D terrain generation using fractal Perlin noise with multiple biomes — from alpine lakes to Martian canyons.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
