"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { lightCaverns, LightCavernsParams, lightCavernsDefaultParams } from "@/lib/art/light-caverns-generator";
import { Play, Pause, Sparkles, RotateCcw, Gem, Sun, Mountain, Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const colorSchemes = [
  { value: "emerald", label: "Emerald", color: "#3CD070" },
  { value: "amethyst", label: "Amethyst", color: "#9966CC" },
  { value: "sapphire", label: "Sapphire", color: "#0F52BA" },
  { value: "amber", label: "Amber", color: "#FFBF00" },
];

export default function LightCavernsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [params, setParams] = useState<LightCavernsParams>(lightCavernsDefaultParams);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      if (isPlaying) {
        time += 16; // ~60fps
        lightCaverns.animate?.(ctx, params, 1, time);
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
        const height = Math.min(window.innerHeight * 0.65, 650);
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
    setIsPlaying((prev) => !prev);
  }, []);

  const randomize = useCallback(() => {
    const schemes = ["emerald", "amethyst", "sapphire", "amber"] as const;
    setParams({
      rayCount: 4 + Math.floor(Math.random() * 20),
      cavernDepth: 10 + Math.floor(Math.random() * 80),
      crystalDensity: 10 + Math.floor(Math.random() * 70),
      colorScheme: schemes[Math.floor(Math.random() * schemes.length)],
    });
  }, []);

  const reset = useCallback(() => {
    setParams({ ...lightCavernsDefaultParams });
  }, []);

  const updateParam = useCallback(<K extends keyof LightCavernsParams>(
    key: K,
    value: LightCavernsParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const currentColor = colorSchemes.find(c => c.value === params.colorScheme)?.color || "#3CD070";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Light Caverns</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Volumetric light rays piercing through crystalline cave formations.
            Ancient underground chambers illuminated by shafts of dancing light.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-8 items-start">
          {/* Canvas Container */}
          <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center">
              {/* Cavern Canvas */}
              <div 
                className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800/50"
                style={{ boxShadow: `0 25px 50px -12px ${currentColor}20` }}
              >
                <canvas ref={canvasRef} className="block" />
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
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Gem className="w-5 h-5" style={{ color: currentColor }} />
              Cavern Settings
            </h2>

            {/* Light Rays */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Sun className="w-4 h-4" />
                Light Rays: {params.rayCount}
              </label>
              <Slider
                value={[params.rayCount]}
                onValueChange={([v]) => updateParam("rayCount", v)}
                min={4}
                max={24}
                step={1}
                className="w-full"
              />
            </div>

            {/* Cavern Depth */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Mountain className="w-4 h-4" />
                Cavern Depth: {params.cavernDepth}
              </label>
              <Slider
                value={[params.cavernDepth]}
                onValueChange={([v]) => updateParam("cavernDepth", v)}
                min={10}
                max={90}
                step={5}
                className="w-full"
              />
            </div>

            {/* Crystal Density */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Layers className="w-4 h-4" />
                Crystal Density: {params.crystalDensity}
              </label>
              <Slider
                value={[params.crystalDensity]}
                onValueChange={([v]) => updateParam("crystalDensity", v)}
                min={10}
                max={80}
                step={5}
                className="w-full"
              />
            </div>

            {/* Color Scheme */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Gem className="w-4 h-4" />
                Crystal Type
              </label>
              <Select
                value={params.colorScheme}
                onValueChange={(v) => updateParam("colorScheme", v as LightCavernsParams["colorScheme"])}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorSchemes.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: opt.color }}
                        />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Preview */}
            <div 
              className="h-2 mt-2 rounded-full"
              style={{
                background: `linear-gradient(to right, 
                  ${currentColor}40, 
                  ${currentColor}80, 
                  ${currentColor}BF, 
                  ${currentColor}FF)`
              }}
            />

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 space-y-2">
              <p>
                Light caverns form when sunlight penetrates underground chambers through 
                narrow openings, scattering off mineral deposits and crystal formations.
              </p>
              <p className="text-slate-600">
                The volumetric effect simulates light scattering through atmospheric dust 
                and moisture — each ray carries the warmth of the surface world below.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
