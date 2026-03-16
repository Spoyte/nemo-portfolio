"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { codeGardenDefaultParams } from "@/lib/art/code-garden";
import { Palette, Pause, Play, Sparkles, Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  javascript: number;
  vocabulary: string;
  params: string;
  colorScheme: string;
  season: string;
  growthSpeed: number;
  plantDensity: number;
  complexity: number;
  windStrength: number;
  bloomRate: number;
  decayEnabled: string;
}

const defaultParams: Params = {
  javascript: 0,
  vocabulary: return "...";,
  params: "javascript" },
  colorScheme: "synthwave" },
  season: "spring" },
  growthSpeed: 5 },
  plantDensity: 6 },
  complexity: 5 },
  windStrength: 3 },
  bloomRate: 4 },
  decayEnabled: "true" },
};

export default function CodeGardenPage() {
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
        codeGardenDefaultParams.generate(ctx, params, time);
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

      vocabulary: ["javascript", "python", "rust", "haskell", "lisp", "sql"][Math.floor(Math.random() * 6)],
      params: ["javascript", "python", "rust", "haskell", "lisp", "sql"][Math.floor(Math.random() * 6)],
      colorScheme: ["synthwave", "forest", "ocean", "autumn", "monochrome", "terminal"][Math.floor(Math.random() * 6)],
      season: ["spring", "summer", "autumn", "winter"][Math.floor(Math.random() * 4)],
      growthSpeed: Math.floor(1 + Math.random() * 9),
      plantDensity: Math.floor(1 + Math.random() * 9),
      complexity: Math.floor(1 + Math.random() * 9),
      windStrength: Math.floor(0 + Math.random() * 10),
      bloomRate: Math.floor(0 + Math.random() * 10),
      decayEnabled: ["true", "false"][Math.floor(Math.random() * 2)],
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
          <h1 className="text-4xl font-light tracking-tight mb-2">language</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Organic growth of code syntax as digital flora — watch programming languages bloom into living gardens
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



            {/* Vocabulary */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Vocabulary
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, vocabulary: "javascript" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.vocabulary === "javascript"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  javascript
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, vocabulary: "python" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.vocabulary === "python"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  python
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, vocabulary: "rust" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.vocabulary === "rust"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rust
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, vocabulary: "haskell" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.vocabulary === "haskell"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  haskell
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, vocabulary: "lisp" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.vocabulary === "lisp"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  lisp
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, vocabulary: "sql" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.vocabulary === "sql"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sql
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
                  onClick={() => setParams(prev => ({ ...prev, params: "javascript" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "javascript"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  javascript
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "python" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "python"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  python
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "rust" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "rust"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rust
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "haskell" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "haskell"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  haskell
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "lisp" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "lisp"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  lisp
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "sql" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "sql"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sql
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "synthwave" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "synthwave"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  synthwave
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "autumn" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "autumn"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  autumn
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "terminal" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "terminal"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  terminal
                </button>
              </div>
            </div>

            {/* Season */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Season
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, season: "spring" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.season === "spring"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  spring
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, season: "summer" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.season === "summer"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  summer
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, season: "autumn" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.season === "autumn"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  autumn
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, season: "winter" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.season === "winter"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  winter
                </button>
              </div>
            </div>

            {/* GrowthSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                GrowthSpeed: {params.growthSpeed}
              </label>
              <Slider
                value={[params.growthSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, growthSpeed: v }))}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* PlantDensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PlantDensity: {params.plantDensity}
              </label>
              <Slider
                value={[params.plantDensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, plantDensity: v }))}
                min={1}
                max={10}
                step={1}
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
                min={1}
                max={10}
                step={1}
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
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* BloomRate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BloomRate: {params.bloomRate}
              </label>
              <Slider
                value={[params.bloomRate]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, bloomRate: v }))}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* DecayEnabled */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DecayEnabled
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, decayEnabled: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.decayEnabled === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, decayEnabled: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.decayEnabled === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Organic growth of code syntax as digital flora — watch programming languages bloom into living gardens</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
