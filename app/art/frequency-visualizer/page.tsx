"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { frequencyVisualizer } from "@/lib/art/frequency-visualizer";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: number;
  smoothing: number;
  bassBoost: number;
  particleIntensity: number;
  waveSpeed: number;
  mirrorMode: string;
  colorScheme: string;
  barStyle: string;
  seed: number;
}

const defaultParams: Params = {
  params: 64,
  smoothing: 60,
  bassBoost: 50,
  particleIntensity: 40,
  waveSpeed: 50,
  mirrorMode: "horizontal",
  colorScheme: "spectrum",
  barStyle: "gradient",
  seed: 42,
};

export default function FrequencyVisualizerPage() {
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
        frequencyVisualizer.generate(ctx, params, time);
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
      params: 16 + Math.random() * 112,
      smoothing: 0 + Math.random() * 100,
      bassBoost: 0 + Math.random() * 100,
      particleIntensity: 0 + Math.random() * 100,
      waveSpeed: 10 + Math.random() * 90,
      mirrorMode: ["off", "horizontal", "vertical", "both"][Math.floor(Math.random() * 4)],
      colorScheme: ["spectrum", "fire", "ocean", "neon", "monochrome"][Math.floor(Math.random() * 5)],
      barStyle: ["solid", "gradient", "outline", "glow"][Math.floor(Math.random() * 4)],
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Frequency Visualizer</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Audio-reactive visualization with flowing frequency bars and particle bursts
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
                min={16}
                max={128}
                step={8}
                className="w-full"
              />
            </div>

            {/* Smoothing */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Smoothing: {params.smoothing}
              </label>
              <Slider
                value={[params.smoothing]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, smoothing: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* BassBoost */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BassBoost: {params.bassBoost}
              </label>
              <Slider
                value={[params.bassBoost]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, bassBoost: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* ParticleIntensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ParticleIntensity: {params.particleIntensity}
              </label>
              <Slider
                value={[params.particleIntensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, particleIntensity: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* WaveSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                WaveSpeed: {params.waveSpeed}
              </label>
              <Slider
                value={[params.waveSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, waveSpeed: v }))}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* MirrorMode */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                MirrorMode
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, mirrorMode: "off" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.mirrorMode === "off"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  off
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, mirrorMode: "horizontal" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.mirrorMode === "horizontal"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  horizontal
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, mirrorMode: "vertical" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.mirrorMode === "vertical"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  vertical
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, mirrorMode: "both" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.mirrorMode === "both"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  both
                </button>
              </div>
            </div>

            {/* ColorScheme */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorScheme
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "spectrum" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "spectrum"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  spectrum
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "fire" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "fire"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  fire
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

            {/* BarStyle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BarStyle
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, barStyle: "solid" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.barStyle === "solid"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  solid
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, barStyle: "gradient" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.barStyle === "gradient"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  gradient
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, barStyle: "outline" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.barStyle === "outline"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  outline
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, barStyle: "glow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.barStyle === "glow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  glow
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
              <p>Audio-reactive visualization with flowing frequency bars and particle bursts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
