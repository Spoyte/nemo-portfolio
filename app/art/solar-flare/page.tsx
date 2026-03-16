"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { solarFlareDefaultParams } from "@/lib/art/solar-flare";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  points: number;
  flareIntensity: number;
  coronaDensity: number;
  surfaceActivity: number;
  particleCount: number;
  colorScheme: string;
  showCoronalLoops: string;
  rotationSpeed: number;
}

const defaultParams: Params = {
  points: 60,
  flareIntensity: 50,
  coronaDensity: 40,
  surfaceActivity: 50,
  particleCount: 100,
  colorScheme: "realistic",
  showCoronalLoops: "true",
  rotationSpeed: 20,
};

export default function SolarFlarePage() {
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
        solarFlareDefaultParams.generate(ctx, params, time);
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
      points: Math.floor(30 + Math.random() * 60),
      flareIntensity: Math.floor(0 + Math.random() * 100),
      coronaDensity: Math.floor(0 + Math.random() * 100),
      surfaceActivity: Math.floor(0 + Math.random() * 100),
      particleCount: 20 + Math.random() * 280,
      colorScheme: ["realistic", "inferno", "plasma", "neon", "gold"][Math.floor(Math.random() * 5)],
      showCoronalLoops: ["true", "false"][Math.floor(Math.random() * 2)],
      rotationSpeed: Math.floor(0 + Math.random() * 50),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Solar Flare</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Physics simulation of solar activity including magnetic reconnection, coronal loops, solar prominences, and surface turbulence. Watch as plasma erupts from the sun
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

            {/* Points */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Points: {params.points}
              </label>
              <Slider
                value={[params.points]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, points: v }))}
                min={30}
                max={90}
                step={1}
                className="w-full"
              />
            </div>

            {/* FlareIntensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FlareIntensity: {params.flareIntensity}
              </label>
              <Slider
                value={[params.flareIntensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, flareIntensity: v }))}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* CoronaDensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                CoronaDensity: {params.coronaDensity}
              </label>
              <Slider
                value={[params.coronaDensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, coronaDensity: v }))}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* SurfaceActivity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                SurfaceActivity: {params.surfaceActivity}
              </label>
              <Slider
                value={[params.surfaceActivity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, surfaceActivity: v }))}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* ParticleCount */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ParticleCount: {params.particleCount}
              </label>
              <Slider
                value={[params.particleCount]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, particleCount: v }))}
                min={20}
                max={300}
                step={10}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "realistic" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "realistic"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  realistic
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "inferno" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "inferno"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  inferno
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "plasma" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "plasma"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  plasma
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "neon" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "neon"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  neon
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "gold" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "gold"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  gold
                </button>
              </div>
            </div>

            {/* ShowCoronalLoops */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ShowCoronalLoops
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, showCoronalLoops: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showCoronalLoops === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, showCoronalLoops: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showCoronalLoops === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* RotationSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <RotateCw className="w-4 h-4" />
                RotationSpeed: {params.rotationSpeed}
              </label>
              <Slider
                value={[params.rotationSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, rotationSpeed: v }))}
                min={0}
                max={50}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Physics simulation of solar activity including magnetic reconnection, coronal loops, solar prominences, and surface turbulence. Watch as plasma erupts from the sun</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
