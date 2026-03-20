"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { impossibleGeometryDefaultParams } from "@/lib/art/impossible-geometry";
import { Palette, Pause, Play, Sparkles, Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  classic: string;
  speed: number;
  complexity: number;
  colorScheme: string;
  revealMode: string;
  lineWidth: number;
}

const defaultParams: Params = {
  classic: "white",
  speed: 30,
  complexity: 50,
  colorScheme: "classic",
  revealMode: "construct",
  lineWidth: 3,
};

export default function ImpossibleGeometryPage() {
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
        impossibleGeometryDefaultParams.generate(ctx, params, time);
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
      classic: ["penrose-triangle", "impossible-staircase", "blivet", "necker-cube", "all"][Math.floor(Math.random() * 5)],
      speed: 0 + Math.random() * 100,
      complexity: 10 + Math.random() * 90,
      colorScheme: ["classic", "neon", "monochrome", "warm", "cool"][Math.floor(Math.random() * 5)],
      revealMode: ["construct", "deconstruct", "pulse", "rotate"][Math.floor(Math.random() * 4)],
      lineWidth: Math.floor(1 + Math.random() * 7),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Impossible Geometry</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Optical illusions and paradoxical figures including Penrose triangle, impossible staircase, blivet, and Necker cube
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

            {/* Classic */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Classic
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, classic: "penrose-triangle" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.classic === "penrose-triangle"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  penrose-triangle
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, classic: "impossible-staircase" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.classic === "impossible-staircase"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  impossible-staircase
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, classic: "blivet" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.classic === "blivet"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  blivet
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, classic: "necker-cube" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.classic === "necker-cube"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  necker-cube
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, classic: "all" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.classic === "all"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  all
                </button>
              </div>
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
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Complexity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Complexity: {params.complexity}
              </label>
              <Slider
                value={[params.complexity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, complexity: v }))}
                min={10}
                max={100}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "classic" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "classic"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  classic
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
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "warm" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "warm"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  warm
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "cool" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "cool"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  cool
                </button>
              </div>
            </div>

            {/* RevealMode */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                RevealMode
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, revealMode: "construct" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.revealMode === "construct"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  construct
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, revealMode: "deconstruct" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.revealMode === "deconstruct"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  deconstruct
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, revealMode: "pulse" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.revealMode === "pulse"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  pulse
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, revealMode: "rotate" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.revealMode === "rotate"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rotate
                </button>
              </div>
            </div>

            {/* LineWidth */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                LineWidth: {params.lineWidth}
              </label>
              <Slider
                value={[params.lineWidth]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, lineWidth: v }))}
                min={1}
                max={8}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Optical illusions and paradoxical figures including Penrose triangle, impossible staircase, blivet, and Necker cube</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
