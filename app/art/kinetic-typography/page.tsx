"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { kineticTypography } from "@/lib/art/kinetic-typography";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: string;
  fontSize: number;
  waveAmplitude: number;
  waveFrequency: number;
  particleDensity: number;
  colorScheme: string;
  seed: number;
}

const defaultParams: Params = {
  params: "CREATE",
  fontSize: 80,
  waveAmplitude: 20,
  waveFrequency: 0.03,
  particleDensity: 3,
  colorScheme: "neon",
  seed: 42,
};

export default function KineticTypographyPage() {
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
        kineticTypography.generate(ctx, params, time);
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
      params: ["CREATE", "FLOW", "WAVE", "DREAM", "CHAOS", "LIGHT"][Math.floor(Math.random() * 6)],
      fontSize: 40 + Math.random() * 80,
      waveAmplitude: 5 + Math.random() * 45,
      waveFrequency: 0.01 + Math.random() * 0.09000000000000001,
      particleDensity: Math.floor(1 + Math.random() * 4),
      colorScheme: ["neon", "gold", "ocean", "sunset", "monochrome"][Math.floor(Math.random() * 5)],
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Kinetic Typography</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Text as living matter - letters breathe, pulse, and dance with physics-based motion
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
                Params
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "CREATE" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "CREATE"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  CREATE
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "FLOW" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "FLOW"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  FLOW
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "WAVE" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "WAVE"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  WAVE
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "DREAM" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "DREAM"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  DREAM
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "CHAOS" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "CHAOS"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  CHAOS
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "LIGHT" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "LIGHT"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  LIGHT
                </button>
              </div>
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
                min={40}
                max={120}
                step={10}
                className="w-full"
              />
            </div>

            {/* WaveAmplitude */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                WaveAmplitude: {params.waveAmplitude}
              </label>
              <Slider
                value={[params.waveAmplitude]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, waveAmplitude: v }))}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
            </div>

            {/* WaveFrequency */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                WaveFrequency: {params.waveFrequency.toFixed(2)}
              </label>
              <Slider
                value={[params.waveFrequency]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, waveFrequency: v }))}
                min={0.01}
                max={0.1}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* ParticleDensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ParticleDensity: {params.particleDensity}
              </label>
              <Slider
                value={[params.particleDensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, particleDensity: v }))}
                min={1}
                max={5}
                step={1}
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
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "ocean" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "ocean"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ocean
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "sunset" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "sunset"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sunset
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "monochrome" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "monochrome"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  monochrome
                </button>
              </div>
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
              <p>Text as living matter - letters breathe, pulse, and dance with physics-based motion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
