"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { stringArtDefaultParams } from "@/lib/art/string-art";
import { Palette, Pause, Play, Sparkles, Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: number;
  layers: number;
  curveDensity: number;
  curveType: string;
  colorScheme: string;
  lineOpacity: number;
  lineWidth: number;
  animated: string;
  speed: number;
}

const defaultParams: Params = {
  params: 24,
  layers: 3,
  curveDensity: 40,
  curveType: "parabola",
  colorScheme: "warm",
  lineOpacity: 0.6,
  lineWidth: 1,
  animated: "true",
  speed: 1,
};

export default function StringArtPage() {
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
        stringArtDefaultParams.generate(ctx, params, time);
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
      params: 12 + Math.random() * 36,
      layers: Math.floor(1 + Math.random() * 5),
      curveDensity: 20 + Math.random() * 80,
      curveType: ["parabola", "hyperbola", "ellipse", "cardioid", "spiral"][Math.floor(Math.random() * 5)],
      colorScheme: ["warm", "cool", "rainbow", "monochrome", "neon", "gold", "midnight"][Math.floor(Math.random() * 7)],
      lineOpacity: 0.1 + Math.random() * 0.9,
      lineWidth: 0.5 + Math.random() * 2.5,
      animated: ["true", "false"][Math.floor(Math.random() * 2)],
      speed: 0.1 + Math.random() * 2.9,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">String Art</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Mathematical curve stitching — curves emerge from straight lines connecting points on a circular frame
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
                min={12}
                max={48}
                step={4}
                className="w-full"
              />
            </div>

            {/* Layers */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Scale className="w-4 h-4" />
                Layers: {params.layers}
              </label>
              <Slider
                value={[params.layers]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, layers: v }))}
                min={1}
                max={6}
                step={1}
                className="w-full"
              />
            </div>

            {/* CurveDensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                CurveDensity: {params.curveDensity}
              </label>
              <Slider
                value={[params.curveDensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, curveDensity: v }))}
                min={20}
                max={100}
                step={10}
                className="w-full"
              />
            </div>

            {/* CurveType */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                CurveType
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, curveType: "parabola" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.curveType === "parabola"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  parabola
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, curveType: "hyperbola" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.curveType === "hyperbola"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  hyperbola
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, curveType: "ellipse" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.curveType === "ellipse"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ellipse
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, curveType: "cardioid" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.curveType === "cardioid"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  cardioid
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, curveType: "spiral" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.curveType === "spiral"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  spiral
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "midnight" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "midnight"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  midnight
                </button>
              </div>
            </div>

            {/* LineOpacity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                LineOpacity: {params.lineOpacity.toFixed(2)}
              </label>
              <Slider
                value={[params.lineOpacity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, lineOpacity: v }))}
                min={0.1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* LineWidth */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                LineWidth: {params.lineWidth.toFixed(2)}
              </label>
              <Slider
                value={[params.lineWidth]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, lineWidth: v }))}
                min={0.5}
                max={3}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Animated */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Animated
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, animated: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animated === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, animated: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animated === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
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
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Mathematical curve stitching — curves emerge from straight lines connecting points on a circular frame</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
