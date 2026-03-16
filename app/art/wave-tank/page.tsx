"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { waveTankDefaultParams } from "@/lib/art/wave-tank";
import { Palette, Pause, Play, Sparkles, Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: number;
  damping: number;
  dropRate: number;
  dropSize: number;
  colorScheme: string;
  showDepth: string;
  reflection: string;
  viscosity: number;
  windStrength: number;
  dropPattern: string;
}

const defaultParams: Params = {
  params: 50,
  damping: 95,
  dropRate: 30,
  dropSize: 15,
  colorScheme: "ocean",
  showDepth: "true",
  reflection: "true",
  viscosity: 30,
  windStrength: 10,
  dropPattern: "random",
};

export default function WaveTankPage() {
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
        waveTankDefaultParams.generate(ctx, params, time);
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
      params: 10 + Math.random() * 90,
      damping: Math.floor(90 + Math.random() * 9),
      dropRate: 0 + Math.random() * 100,
      dropSize: 5 + Math.random() * 35,
      colorScheme: ["ocean", "sunset", "emerald", "magma", "monochrome", "neon"][Math.floor(Math.random() * 6)],
      showDepth: ["true", "false"][Math.floor(Math.random() * 2)],
      reflection: ["true", "false"][Math.floor(Math.random() * 2)],
      viscosity: 0 + Math.random() * 80,
      windStrength: 0 + Math.random() * 50,
      dropPattern: ["random", "rain", "heartbeat", "ripple", "interference", "wind"][Math.floor(Math.random() * 6)],
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Wave Tank</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Real-time 2D water surface simulation using the discrete wave equation. Ripples propagate, reflect, and interfere, creating mesmerizing water patterns. Features multiple drop patterns, adjustable physics parameters, and beautiful color schemes.
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
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Damping */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Damping: {params.damping}
              </label>
              <Slider
                value={[params.damping]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, damping: v }))}
                min={90}
                max={99}
                step={1}
                className="w-full"
              />
            </div>

            {/* DropRate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DropRate: {params.dropRate}
              </label>
              <Slider
                value={[params.dropRate]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, dropRate: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* DropSize */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DropSize: {params.dropSize}
              </label>
              <Slider
                value={[params.dropSize]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, dropSize: v }))}
                min={5}
                max={40}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "magma" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "magma"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  magma
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
              </div>
            </div>

            {/* ShowDepth */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ShowDepth
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, showDepth: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showDepth === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, showDepth: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showDepth === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* Reflection */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Reflection
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, reflection: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.reflection === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, reflection: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.reflection === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
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
                min={0}
                max={80}
                step={5}
                className="w-full"
              />
            </div>

            {/* WindStrength */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Wind className="w-4 h-4" />
                WindStrength: {params.windStrength}
              </label>
              <Slider
                value={[params.windStrength]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, windStrength: v }))}
                min={0}
                max={50}
                step={5}
                className="w-full"
              />
            </div>

            {/* DropPattern */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DropPattern
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, dropPattern: "random" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.dropPattern === "random"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  random
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, dropPattern: "rain" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.dropPattern === "rain"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rain
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, dropPattern: "heartbeat" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.dropPattern === "heartbeat"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  heartbeat
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, dropPattern: "ripple" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.dropPattern === "ripple"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ripple
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, dropPattern: "interference" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.dropPattern === "interference"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  interference
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, dropPattern: "wind" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.dropPattern === "wind"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  wind
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Real-time 2D water surface simulation using the discrete wave equation. Ripples propagate, reflect, and interfere, creating mesmerizing water patterns. Features multiple drop patterns, adjustable physics parameters, and beautiful color schemes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
