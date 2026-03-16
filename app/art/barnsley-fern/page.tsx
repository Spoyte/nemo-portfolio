"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { renderBarnsleyFern, barnsleyFernDefaultParams } from "@/lib/art/barnsley-fern";
import { Palette, Pause, Play, Sparkles, RotateCw, Maximize2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  iterations: number;
  scale: number;
  colorScheme: string;
  pointSize: number;
  opacity: number;
  animate: boolean;
  animationSpeed: number;
  rotation: number;
  leafDensity: number;
}

const defaultParams: Params = {
  iterations: 50000,
  scale: 1,
  colorScheme: "natural",
  pointSize: 1,
  opacity: 0.6,
  animate: true,
  animationSpeed: 1000,
  rotation: 0,
  leafDensity: 1,
};

export default function BarnsleyFernPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<Params>(defaultParams);
  const [progress, setProgress] = useState(1);

  // Render the fern
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderBarnsleyFern(
      { ctx, width: canvas.width, height: canvas.height },
      { ...params, offsetX: 0, offsetY: 0 },
      (p) => setProgress(p)
    );
  }, [params]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const width = Math.min(rect.width, 900);
        const height = Math.min(window.innerHeight * 0.7, 700);
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
      iterations: 10000 + Math.floor(Math.random() * 90000),
      scale: 0.5 + Math.random() * 1.5,
      colorScheme: ["natural", "autumn", "neon", "monochrome", "rainbow"][Math.floor(Math.random() * 5)],
      pointSize: 0.5 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.7,
      animate: Math.random() > 0.5,
      animationSpeed: 500 + Math.floor(Math.random() * 4500),
      rotation: -45 + Math.floor(Math.random() * 90),
      leafDensity: 0.5 + Math.random() * 1.5,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Barnsley Fern</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Iterated Function System fractal generating natural fern shapes through affine transformations. 
            Each point is placed using probabilistic transformations that mimic organic growth.
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

            {/* Progress bar */}
            {params.animate && progress < 1 && (
              <div className="w-full max-w-md mt-4">
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 text-center mt-1">
                  Growing... {Math.floor(progress * 100)}%
                </p>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Settings
            </h2>

            {/* Iterations */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Maximize2 className="w-4 h-4" />
                Iterations: {params.iterations.toLocaleString()}
              </label>
              <Slider
                value={[params.iterations]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, iterations: v }))}
                min={1000}
                max={100000}
                step={1000}
                className="w-full"
              />
            </div>

            {/* Scale */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Maximize2 className="w-4 h-4" />
                Scale: {params.scale.toFixed(1)}x
              </label>
              <Slider
                value={[params.scale]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, scale: v }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* ColorScheme */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                Color Scheme
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "natural" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "natural"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  natural
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "rainbow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize col-span-2
                    ${params.colorScheme === "rainbow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rainbow
                </button>
              </div>
            </div>

            {/* PointSize */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Maximize2 className="w-4 h-4" />
                Point Size: {params.pointSize.toFixed(1)}
              </label>
              <Slider
                value={[params.pointSize]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, pointSize: v }))}
                min={0.5}
                max={3}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Opacity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                Opacity: {params.opacity.toFixed(1)}
              </label>
              <Slider
                value={[params.opacity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, opacity: v }))}
                min={0.1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Rotation */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <RotateCw className="w-4 h-4" />
                Rotation: {params.rotation}°
              </label>
              <Slider
                value={[params.rotation]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, rotation: v }))}
                min={-180}
                max={180}
                step={5}
                className="w-full"
              />
            </div>

            {/* LeafDensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Maximize2 className="w-4 h-4" />
                Leaf Density: {params.leafDensity.toFixed(1)}
              </label>
              <Slider
                value={[params.leafDensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, leafDensity: v }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 space-y-2">
              <p><strong>Barnsley Fern</strong> — An iterated function system (IFS) that uses four affine transformations with specific probabilities to generate a mathematically perfect fern shape.</p>
              <p>The algorithm was devised by mathematician Michael Barnsley in 1988 and demonstrates how simple mathematical rules can create complex natural forms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
