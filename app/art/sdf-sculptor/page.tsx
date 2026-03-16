"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sdfSculptorDefaultParams } from "@/lib/art/sdf-sculptor";
import { Palette, Pause, Play, Sparkles, Sun } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  default: string;
  colorScheme: string;
  cameraDistance: number;
  complexity: number;
  glow: number;
}

const defaultParams: Params = {
  default: {,
  colorScheme: "neon",
  cameraDistance: 4,
  complexity: 50,
  glow: 30,
};

export default function SdfSculptorPage() {
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
        sdfSculptorDefaultParams.generate(ctx, params, time);
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
      default: ["infinite-torus", "mandelbulb", "geometric-garden", "crystal-cave", "alien-egg"][Math.floor(Math.random() * 5)],
      colorScheme: ["neon", "gold", "ice", "magma", "cyber"][Math.floor(Math.random() * 5)],
      cameraDistance: 2 + Math.random() * 6,
      complexity: 20 + Math.random() * 70,
      glow: 0 + Math.random() * 100,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">SDF Sculptor</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Raymarched 3D sculptures using signed distance fields — infinite mathematical forms rendered through sphere tracing
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

            {/* Default */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Default
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, default: "infinite-torus" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.default === "infinite-torus"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  infinite-torus
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, default: "mandelbulb" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.default === "mandelbulb"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  mandelbulb
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, default: "geometric-garden" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.default === "geometric-garden"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  geometric-garden
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, default: "crystal-cave" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.default === "crystal-cave"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  crystal-cave
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, default: "alien-egg" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.default === "alien-egg"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  alien-egg
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "ice" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "ice"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ice
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "cyber" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "cyber"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  cyber
                </button>
              </div>
            </div>

            {/* CameraDistance */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                CameraDistance: {params.cameraDistance.toFixed(2)}
              </label>
              <Slider
                value={[params.cameraDistance]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, cameraDistance: v }))}
                min={2}
                max={8}
                step={0.5}
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
                min={20}
                max={90}
                step={5}
                className="w-full"
              />
            </div>

            {/* Glow */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Sun className="w-4 h-4" />
                Glow: {params.glow}
              </label>
              <Slider
                value={[params.glow]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, glow: v }))}
                min={0}
                max={100}
                step={10}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Raymarched 3D sculptures using signed distance fields — infinite mathematical forms rendered through sphere tracing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
