"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { poetryRainDefaultParams } from "@/lib/art/poetry-rain";
import { Palette, Pause, Play, Sparkles, Sun, Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  matrix: string;
  params: string;
  colorTheme: string;
  fallSpeed: number;
  density: number;
  trailLength: number;
  fontSize: number;
  glowIntensity: number;
  wind: number;
  shuffleRate: number;
}

const defaultParams: Params = {
  matrix: "poetry",
  params: "poetry" },
  colorTheme: "matrix" },
  fallSpeed: 5 },
  density: 6 },
  trailLength: 12 },
  fontSize: 16 },
  glowIntensity: 5 },
  wind: 0 },
  shuffleRate: 3 },
};

export default function PoetryRainPage() {
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
        poetryRainDefaultParams.generate(ctx, params, time);
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
      matrix: ["poetry", "code", "symbols", "kanji", "mixed"][Math.floor(Math.random() * 5)],
      params: ["poetry", "code", "symbols", "kanji", "mixed"][Math.floor(Math.random() * 5)],
      colorTheme: ["matrix", "amber", "ocean", "fire", "ghost", "rainbow"][Math.floor(Math.random() * 6)],
      fallSpeed: Math.floor(1 + Math.random() * 9),
      density: Math.floor(1 + Math.random() * 9),
      trailLength: Math.floor(3 + Math.random() * 17),
      fontSize: 10 + Math.random() * 20,
      glowIntensity: Math.floor(0 + Math.random() * 10),
      wind: Math.floor(-5 + Math.random() * 10),
      shuffleRate: Math.floor(0 + Math.random() * 10),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">textSource</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Matrix-style cascading text with lyrical, code, and symbolic content streams
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

            {/* Matrix */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Matrix
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, matrix: "poetry" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.matrix === "poetry"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  poetry
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, matrix: "code" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.matrix === "code"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  code
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, matrix: "symbols" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.matrix === "symbols"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  symbols
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, matrix: "kanji" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.matrix === "kanji"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  kanji
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, matrix: "mixed" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.matrix === "mixed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  mixed
                </button>
              </div>
            </div>

            {/* Params */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Params
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "poetry" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "poetry"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  poetry
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "code" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "code"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  code
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "symbols" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "symbols"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  symbols
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "kanji" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "kanji"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  kanji
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "mixed" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "mixed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  mixed
                </button>
              </div>
            </div>

            {/* ColorTheme */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorTheme
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "matrix" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "matrix"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  matrix
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "amber" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "amber"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  amber
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "ocean" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "ocean"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ocean
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "fire" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "fire"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  fire
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "ghost" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "ghost"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ghost
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "rainbow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "rainbow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rainbow
                </button>
              </div>
            </div>

            {/* FallSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FallSpeed: {params.fallSpeed}
              </label>
              <Slider
                value={[params.fallSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, fallSpeed: v }))}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* Density */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Density: {params.density}
              </label>
              <Slider
                value={[params.density]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, density: v }))}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* TrailLength */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                TrailLength: {params.trailLength}
              </label>
              <Slider
                value={[params.trailLength]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, trailLength: v }))}
                min={3}
                max={20}
                step={1}
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
                min={10}
                max={30}
                step={2}
                className="w-full"
              />
            </div>

            {/* GlowIntensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Sun className="w-4 h-4" />
                GlowIntensity: {params.glowIntensity}
              </label>
              <Slider
                value={[params.glowIntensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, glowIntensity: v }))}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* Wind */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Wind className="w-4 h-4" />
                Wind: {params.wind}
              </label>
              <Slider
                value={[params.wind]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, wind: v }))}
                min={-5}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            {/* ShuffleRate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ShuffleRate: {params.shuffleRate}
              </label>
              <Slider
                value={[params.shuffleRate]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, shuffleRate: v }))}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Matrix-style cascading text with lyrical, code, and symbolic content streams</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
