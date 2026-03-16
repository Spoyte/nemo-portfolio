"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { voronoiTessellation } from "@/lib/art/voronoi-tessellation";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  color: number;
  distanceMetric: string;
  relaxationSteps: number;
  weightVariation: number;
  style: string;
  colorScheme: string;
  edgeThickness: number;
  seed: number;
}

const defaultParams: Params = {
  color: 150,
  distanceMetric: "euclidean",
  relaxationSteps: 2,
  weightVariation: 0.3,
  style: "organic",
  colorScheme: "earth",
  edgeThickness: 1,
  seed: 42,
};

export default function VoronoiTessellationPage() {
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
        voronoiTessellation.generate(ctx, params, time);
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
      color: 10 + Math.random() * 490,
      distanceMetric: ["euclidean", "manhattan", "minkowski", "chebyshev"][Math.floor(Math.random() * 4)],
      relaxationSteps: Math.floor(0 + Math.random() * 10),
      weightVariation: 0 + Math.random() * 1,
      style: ["organic", "geometric", "cracked", "bubble", "veins", "stained"][Math.floor(Math.random() * 6)],
      colorScheme: ["earth", "ocean", "sunset", "forest", "monochrome", "pastel", "neon", "deepsea"][Math.floor(Math.random() * 8)],
      edgeThickness: 0 + Math.random() * 5,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Voronoi Tessellation</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Organic Voronoi diagrams inspired by nature — cracked earth, foam bubbles, leaf veins, giraffe patterns. Features weighted cells, relaxation, and multiple distance metrics.
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

            {/* Color */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                Color: {params.color}
              </label>
              <Slider
                value={[params.color]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, color: v }))}
                min={10}
                max={500}
                step={10}
                className="w-full"
              />
            </div>

            {/* DistanceMetric */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DistanceMetric
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, distanceMetric: "euclidean" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.distanceMetric === "euclidean"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  euclidean
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, distanceMetric: "manhattan" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.distanceMetric === "manhattan"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  manhattan
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, distanceMetric: "minkowski" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.distanceMetric === "minkowski"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  minkowski
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, distanceMetric: "chebyshev" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.distanceMetric === "chebyshev"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  chebyshev
                </button>
              </div>
            </div>

            {/* RelaxationSteps */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                RelaxationSteps: {params.relaxationSteps}
              </label>
              <Slider
                value={[params.relaxationSteps]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, relaxationSteps: v }))}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* WeightVariation */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                WeightVariation: {params.weightVariation.toFixed(2)}
              </label>
              <Slider
                value={[params.weightVariation]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, weightVariation: v }))}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Style */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, style: "organic" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.style === "organic"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  organic
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, style: "geometric" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.style === "geometric"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  geometric
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, style: "cracked" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.style === "cracked"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  cracked
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, style: "bubble" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.style === "bubble"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  bubble
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, style: "veins" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.style === "veins"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  veins
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, style: "stained" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.style === "stained"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  stained
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "pastel" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "pastel"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  pastel
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "deepsea" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "deepsea"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  deepsea
                </button>
              </div>
            </div>

            {/* EdgeThickness */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                EdgeThickness: {params.edgeThickness.toFixed(2)}
              </label>
              <Slider
                value={[params.edgeThickness]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, edgeThickness: v }))}
                min={0}
                max={5}
                step={0.5}
                className="w-full"
              />
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
              <p>Organic Voronoi diagrams inspired by nature — cracked earth, foam bubbles, leaf veins, giraffe patterns. Features weighted cells, relaxation, and multiple distance metrics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
