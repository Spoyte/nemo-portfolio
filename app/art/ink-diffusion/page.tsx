"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { inkDiffusion, inkDiffusionDefaultParams } from "@/lib/art/ink-diffusion";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: string;
  chaos: number;
  viscosity: number;
  dropCount: number;
  colorScheme: string;
  diffusionRate: number;
  turbulence: number;
  animationSpeed: number;
}

const defaultParams: Params = {
  params: inkDiffusionDefaultParams.params,
  chaos: inkDiffusionDefaultParams.chaos,
  viscosity: inkDiffusionDefaultParams.viscosity,
  dropCount: inkDiffusionDefaultParams.dropCount,
  colorScheme: inkDiffusionDefaultParams.colorScheme,
  diffusionRate: inkDiffusionDefaultParams.diffusionRate,
  turbulence: inkDiffusionDefaultParams.turbulence,
  animationSpeed: inkDiffusionDefaultParams.animationSpeed,
};

export default function InkDiffusionPage() {
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
        inkDiffusion.generate(ctx, params, time);
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
      params: ["none", "horizontal", "vertical", "radial", "rorschach", "kaleidoscope"][Math.floor(Math.random() * 6)],
      chaos: 0 + Math.random() * 100,
      viscosity: Math.floor(80 + Math.random() * 19),
      dropCount: Math.floor(1 + Math.random() * 19),
      colorScheme: ["sumi", "sanguine", "sepia", "indigo", "vermillion", "emerald", "prussian", "multicolor"][Math.floor(Math.random() * 8)],
      diffusionRate: 20 + Math.random() * 80,
      turbulence: 0 + Math.random() * 100,
      animationSpeed: 0 + Math.random() * 3,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Ink Diffusion</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Simulates ink drops spreading through water, creating organic Rorschach-like patterns. Inspired by sumi-e painting and fluid dynamics.
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
                  onClick={() => setParams(prev => ({ ...prev, params: "none" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "none"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  none
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "horizontal" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "horizontal"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  horizontal
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "vertical" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "vertical"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  vertical
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "radial" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "radial"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  radial
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "rorschach" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "rorschach"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rorschach
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "kaleidoscope" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "kaleidoscope"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  kaleidoscope
                </button>
              </div>
            </div>

            {/* Chaos */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Chaos: {params.chaos}
              </label>
              <Slider
                value={[params.chaos]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, chaos: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Viscosity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Viscosity: {params.viscosity}
              </label>
              <Slider
                value={[params.viscosity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, viscosity: v }))}
                min={80}
                max={99}
                step={1}
                className="w-full"
              />
            </div>

            {/* DropCount */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DropCount: {params.dropCount}
              </label>
              <Slider
                value={[params.dropCount]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, dropCount: v }))}
                min={1}
                max={20}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "sumi" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "sumi"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sumi
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "sanguine" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "sanguine"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sanguine
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "sepia" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "sepia"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sepia
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "indigo" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "indigo"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  indigo
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "vermillion" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "vermillion"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  vermillion
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "emerald" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "emerald"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  emerald
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "prussian" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "prussian"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  prussian
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "multicolor" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "multicolor"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  multicolor
                </button>
              </div>
            </div>

            {/* DiffusionRate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DiffusionRate: {params.diffusionRate}
              </label>
              <Slider
                value={[params.diffusionRate]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, diffusionRate: v }))}
                min={20}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Turbulence */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Cloud className="w-4 h-4" />
                Turbulence: {params.turbulence}
              </label>
              <Slider
                value={[params.turbulence]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, turbulence: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* AnimationSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AnimationSpeed: {params.animationSpeed.toFixed(2)}
              </label>
              <Slider
                value={[params.animationSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, animationSpeed: v }))}
                min={0}
                max={3}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Simulates ink drops spreading through water, creating organic Rorschach-like patterns. Inspired by sumi-e painting and fluid dynamics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
