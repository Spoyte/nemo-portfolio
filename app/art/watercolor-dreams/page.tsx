"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { watercolorDreams, watercolorDreamsDefaultParams } from "@/lib/art/watercolor-dreams";
import { Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  base: string;
  paperType: string;
  wetness: number;
  pigmentDensity: number;
  bloomIntensity: number;
  brushSize: number;
  layerCount: number;
  granulation: number;
  diffusionRate: number;
  seed: number;
}

const defaultParams: Params = {
  base: watercolorDreamsDefaultParams.base,
  paperType: watercolorDreamsDefaultParams.paperType,
  wetness: watercolorDreamsDefaultParams.wetness,
  pigmentDensity: watercolorDreamsDefaultParams.pigmentDensity,
  bloomIntensity: watercolorDreamsDefaultParams.bloomIntensity,
  brushSize: watercolorDreamsDefaultParams.brushSize,
  layerCount: watercolorDreamsDefaultParams.layerCount,
  granulation: watercolorDreamsDefaultParams.granulation,
  diffusionRate: watercolorDreamsDefaultParams.diffusionRate,
  seed: watercolorDreamsDefaultParams.seed,
};

export default function WatercolorDreamsPage() {
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
        watercolorDreams.generate(ctx, params, time);
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
      base: ["sunset-glow", "ocean-mist", "forest-dew", "rose-garden", "monochrome-ink", "autumn-leaves"][Math.floor(Math.random() * 6)],
      paperType: ["cold-pressed", "hot-pressed", "rough", "tinted-cream", "grey-toned"][Math.floor(Math.random() * 5)],
      wetness: 0 + Math.random() * 1,
      pigmentDensity: 0.2 + Math.random() * 0.8,
      bloomIntensity: 0 + Math.random() * 1,
      brushSize: 0.2 + Math.random() * 1.3,
      layerCount: Math.floor(1 + Math.random() * 7),
      granulation: 0 + Math.random() * 1,
      diffusionRate: 0.1 + Math.random() * 0.9,
      seed: Math.floor(1 + Math.random() * 999),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Watercolor Dreams</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Traditional watercolor simulation with pigment diffusion, paper texture, backruns, and wet-on-wet bleeding effects
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

            {/* Base */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Base
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, base: "sunset-glow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.base === "sunset-glow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sunset-glow
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, base: "ocean-mist" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.base === "ocean-mist"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ocean-mist
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, base: "forest-dew" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.base === "forest-dew"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  forest-dew
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, base: "rose-garden" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.base === "rose-garden"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rose-garden
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, base: "monochrome-ink" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.base === "monochrome-ink"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  monochrome-ink
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, base: "autumn-leaves" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.base === "autumn-leaves"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  autumn-leaves
                </button>
              </div>
            </div>

            {/* PaperType */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PaperType
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, paperType: "cold-pressed" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.paperType === "cold-pressed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  cold-pressed
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, paperType: "hot-pressed" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.paperType === "hot-pressed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  hot-pressed
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, paperType: "rough" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.paperType === "rough"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rough
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, paperType: "tinted-cream" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.paperType === "tinted-cream"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  tinted-cream
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, paperType: "grey-toned" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.paperType === "grey-toned"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  grey-toned
                </button>
              </div>
            </div>

            {/* Wetness */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Wetness: {params.wetness.toFixed(2)}
              </label>
              <Slider
                value={[params.wetness]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, wetness: v }))}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* PigmentDensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PigmentDensity: {params.pigmentDensity.toFixed(2)}
              </label>
              <Slider
                value={[params.pigmentDensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, pigmentDensity: v }))}
                min={0.2}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* BloomIntensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BloomIntensity: {params.bloomIntensity.toFixed(2)}
              </label>
              <Slider
                value={[params.bloomIntensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, bloomIntensity: v }))}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* BrushSize */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BrushSize: {params.brushSize.toFixed(2)}
              </label>
              <Slider
                value={[params.brushSize]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, brushSize: v }))}
                min={0.2}
                max={1.5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* LayerCount */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                LayerCount: {params.layerCount}
              </label>
              <Slider
                value={[params.layerCount]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, layerCount: v }))}
                min={1}
                max={8}
                step={1}
                className="w-full"
              />
            </div>

            {/* Granulation */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Granulation: {params.granulation.toFixed(2)}
              </label>
              <Slider
                value={[params.granulation]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, granulation: v }))}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* DiffusionRate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DiffusionRate: {params.diffusionRate.toFixed(2)}
              </label>
              <Slider
                value={[params.diffusionRate]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, diffusionRate: v }))}
                min={0.1}
                max={1}
                step={0.05}
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
                max={1000}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Traditional watercolor simulation with pigment diffusion, paper texture, backruns, and wet-on-wet bleeding effects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
