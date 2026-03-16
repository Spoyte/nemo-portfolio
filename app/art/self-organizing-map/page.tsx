"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { defaultParams, defaultParamsDefaultParams } from "@/lib/art/self-organizing-map";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: number;
  learningRate: number;
  neighborhoodRadius: number;
  decayRate: number;
  colorScheme: string;
  inputDistribution: string;
  showConnections: number;
  showNodes: number;
  animationSpeed: number;
}

const defaultParams: Params = {
  params: defaultParamsDefaultParams.params,
  learningRate: defaultParamsDefaultParams.learningRate,
  neighborhoodRadius: defaultParamsDefaultParams.neighborhoodRadius,
  decayRate: defaultParamsDefaultParams.decayRate,
  colorScheme: defaultParamsDefaultParams.colorScheme,
  inputDistribution: defaultParamsDefaultParams.inputDistribution,
  showConnections: defaultParamsDefaultParams.showConnections,
  showNodes: defaultParamsDefaultParams.showNodes,
  animationSpeed: defaultParamsDefaultParams.animationSpeed,
};

export default function SelfOrganizingMapPage() {
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
        defaultParams.generate(ctx, params, time);
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
      params: Math.floor(5 + Math.random() * 35),
      learningRate: 0.1 + Math.random() * 0.9,
      neighborhoodRadius: Math.floor(1 + Math.random() * 19),
      decayRate: 0.99 + Math.random() * 0.00990000000000002,
      colorScheme: ["heatmap", "rainbow", "ocean", "cosmic", "forest"][Math.floor(Math.random() * 5)],
      inputDistribution: ["uniform", "gaussian", "ring", "spiral", "clusters"][Math.floor(Math.random() * 5)],


      animationSpeed: 0.5 + Math.random() * 4.5,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Self-Organizing Map</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Neural network learning visualization - watch a Kohonen map organize itself in real-time
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
                min={5}
                max={40}
                step={1}
                className="w-full"
              />
            </div>

            {/* LearningRate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                LearningRate: {params.learningRate.toFixed(2)}
              </label>
              <Slider
                value={[params.learningRate]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, learningRate: v }))}
                min={0.1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* NeighborhoodRadius */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                NeighborhoodRadius: {params.neighborhoodRadius}
              </label>
              <Slider
                value={[params.neighborhoodRadius]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, neighborhoodRadius: v }))}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            {/* DecayRate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DecayRate: {params.decayRate.toFixed(2)}
              </label>
              <Slider
                value={[params.decayRate]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, decayRate: v }))}
                min={0.99}
                max={0.9999}
                step={0.0001}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "heatmap" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "heatmap"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  heatmap
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "rainbow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "rainbow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rainbow
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "cosmic" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "cosmic"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  cosmic
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
              </div>
            </div>

            {/* InputDistribution */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                InputDistribution
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, inputDistribution: "uniform" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.inputDistribution === "uniform"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  uniform
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, inputDistribution: "gaussian" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.inputDistribution === "gaussian"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  gaussian
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, inputDistribution: "ring" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.inputDistribution === "ring"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ring
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, inputDistribution: "spiral" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.inputDistribution === "spiral"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  spiral
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, inputDistribution: "clusters" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.inputDistribution === "clusters"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  clusters
                </button>
              </div>
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
                min={0.5}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Neural network learning visualization - watch a Kohonen map organize itself in real-time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
