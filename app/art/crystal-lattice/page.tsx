"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { crystalLatticeDefaultParams } from "@/lib/art/crystal-lattice";
import { Palette, Pause, Play, Sparkles, Sun } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  quartz: number;
  growthSpeed: number;
  facetDetail: number;
  colorScheme: string;
  lightAngle: number;
  rotationSpeed: number;
  refraction: number;
}

const defaultParams: Params = {
  quartz: 8,
  growthSpeed: 50,
  facetDetail: 60,
  colorScheme: "quartz",
  lightAngle: 45,
  rotationSpeed: 30,
  refraction: 70,
};

export default function CrystalLatticePage() {
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
        crystalLatticeDefaultParams.generate(ctx, params, time);
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
      quartz: Math.floor(3 + Math.random() * 12),
      growthSpeed: 10 + Math.random() * 90,
      facetDetail: 20 + Math.random() * 80,
      colorScheme: ["quartz", "sapphire", "emerald", "amethyst", "rose", "ice", "gold"][Math.floor(Math.random() * 7)],
      lightAngle: 0 + Math.random() * 360,
      rotationSpeed: 0 + Math.random() * 100,
      refraction: 0 + Math.random() * 100,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Crystal Lattice</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            3D crystal growth simulation with faceted geometries, light refraction, and crystalline structures that rotate and pulse with mathematical precision.
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

            {/* Quartz */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Quartz: {params.quartz}
              </label>
              <Slider
                value={[params.quartz]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, quartz: v }))}
                min={3}
                max={15}
                step={1}
                className="w-full"
              />
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
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* FacetDetail */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FacetDetail: {params.facetDetail}
              </label>
              <Slider
                value={[params.facetDetail]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, facetDetail: v }))}
                min={20}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "quartz" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "quartz"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  quartz
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "sapphire" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "sapphire"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sapphire
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "amethyst" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "amethyst"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  amethyst
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "rose" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "rose"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rose
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
              </div>
            </div>

            {/* LightAngle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Sun className="w-4 h-4" />
                LightAngle: {params.lightAngle}
              </label>
              <Slider
                value={[params.lightAngle]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, lightAngle: v }))}
                min={0}
                max={360}
                step={15}
                className="w-full"
              />
            </div>

            {/* RotationSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <RotateCw className="w-4 h-4" />
                RotationSpeed: {params.rotationSpeed}
              </label>
              <Slider
                value={[params.rotationSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, rotationSpeed: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Refraction */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Refraction: {params.refraction}
              </label>
              <Slider
                value={[params.refraction]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, refraction: v }))}
                min={0}
                max={100}
                step={10}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>3D crystal growth simulation with faceted geometries, light refraction, and crystalline structures that rotate and pulse with mathematical precision.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
