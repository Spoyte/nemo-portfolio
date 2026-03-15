"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { moirePattern, MoirePatternParams } from "@/lib/art/moire-pattern";
import { Play, Pause, Sparkles, RotateCcw, Grid3X3, Palette, Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultParams: MoirePatternParams = {
  basePattern: "lines",
  overlayPattern: "lines",
  baseDensity: 40,
  overlayDensity: 42,
  baseAngle: 0,
  overlayAngle: 5,
  animationSpeed: 0.5,
  colorScheme: "monochrome",
  lineWidth: 1,
  opacity: 0.8,
  blendMode: "normal",
};

const patternOptions = [
  { value: "lines", label: "Parallel Lines" },
  { value: "circles", label: "Concentric Circles" },
  { value: "grid", label: "Grid" },
  { value: "radial", label: "Radial Rays" },
  { value: "spiral", label: "Spiral" },
];

const colorSchemes = [
  { value: "monochrome", label: "Monochrome" },
  { value: "rainbow", label: "Rainbow" },
  { value: "ocean", label: "Ocean" },
  { value: "sunset", label: "Sunset" },
  { value: "matrix", label: "Matrix" },
];

const blendModes = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "difference", label: "Difference" },
];

export default function MoirePatternPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<MoirePatternParams>(defaultParams);

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
        moirePattern.animate?.(ctx, params, 1, time);
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
        const size = Math.min(rect.width, window.innerHeight * 0.7, 700);
        canvas.width = size * window.devicePixelRatio;
        canvas.height = size * window.devicePixelRatio;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
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
    const patterns = ["lines", "circles", "grid", "radial", "spiral"] as const;
    const colors = ["monochrome", "rainbow", "ocean", "sunset", "matrix"] as const;
    const blends = ["normal", "multiply", "screen", "overlay", "difference"] as const;

    setParams({
      basePattern: patterns[Math.floor(Math.random() * patterns.length)],
      overlayPattern: patterns[Math.floor(Math.random() * patterns.length)],
      baseDensity: 15 + Math.floor(Math.random() * 70),
      overlayDensity: 15 + Math.floor(Math.random() * 70),
      baseAngle: Math.floor(Math.random() * 180),
      overlayAngle: Math.floor(Math.random() * 180),
      animationSpeed: Math.random() * 3,
      colorScheme: colors[Math.floor(Math.random() * colors.length)],
      lineWidth: 0.5 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.6,
      blendMode: blends[Math.floor(Math.random() * blends.length)],
    });
  }, []);

  const reset = useCallback(() => {
    setParams({ ...defaultParams });
  }, []);

  const updateParam = useCallback(<K extends keyof MoirePatternParams>(
    key: K,
    value: MoirePatternParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Moiré Pattern</h1>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Optical interference patterns created by overlapping geometric patterns.
            Slight misalignments produce mesmerizing emergent visuals.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,380px] gap-8 items-start">
          {/* Canvas Container */}
          <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center">
              {/* Square Canvas */}
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800/50 bg-black">
                <canvas ref={canvasRef} className="block" />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12 rounded-full border-zinc-700 hover:bg-zinc-800"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={randomize}
                className="rounded-full border-zinc-700 hover:bg-zinc-800"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Randomize
              </Button>
              <Button
                variant="ghost"
                onClick={reset}
                className="rounded-full text-zinc-500 hover:text-zinc-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-400" />
              Pattern Settings
            </h2>

            {/* Base Pattern */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                <Grid3X3 className="w-4 h-4" />
                Base Pattern
              </label>
              <Select
                value={params.basePattern}
                onValueChange={(v) => updateParam("basePattern", v as MoirePatternParams["basePattern"])}
              >
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {patternOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Overlay Pattern */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                <Layers className="w-4 h-4" />
                Overlay Pattern
              </label>
              <Select
                value={params.overlayPattern}
                onValueChange={(v) => updateParam("overlayPattern", v as MoirePatternParams["overlayPattern"])}
              >
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {patternOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Base Density */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                Base Density: {params.baseDensity}
              </label>
              <Slider
                value={[params.baseDensity]}
                onValueChange={([v]) => updateParam("baseDensity", v)}
                min={10}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Overlay Density */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                Overlay Density: {params.overlayDensity}
              </label>
              <Slider
                value={[params.overlayDensity]}
                onValueChange={([v]) => updateParam("overlayDensity", v)}
                min={10}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Base Angle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                <RotateCcw className="w-4 h-4" />
                Base Angle: {params.baseAngle}°
              </label>
              <Slider
                value={[params.baseAngle]}
                onValueChange={([v]) => updateParam("baseAngle", v)}
                min={0}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            {/* Overlay Angle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                <RotateCcw className="w-4 h-4" />
                Overlay Angle: {params.overlayAngle}°
              </label>
              <Slider
                value={[params.overlayAngle]}
                onValueChange={([v]) => updateParam("overlayAngle", v)}
                min={0}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            {/* Animation Speed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                Animation Speed: {params.animationSpeed.toFixed(1)}
              </label>
              <Slider
                value={[params.animationSpeed]}
                onValueChange={([v]) => updateParam("animationSpeed", v)}
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Color Scheme */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                <Palette className="w-4 h-4" />
                Color Scheme
              </label>
              <Select
                value={params.colorScheme}
                onValueChange={(v) => updateParam("colorScheme", v as MoirePatternParams["colorScheme"])}
              >
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorSchemes.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Blend Mode */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                <Layers className="w-4 h-4" />
                Blend Mode
              </label>
              <Select
                value={params.blendMode}
                onValueChange={(v) => updateParam("blendMode", v as MoirePatternParams["blendMode"])}
              >
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {blendModes.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Line Width */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                Line Width: {params.lineWidth.toFixed(1)}
              </label>
              <Slider
                value={[params.lineWidth]}
                onValueChange={([v]) => updateParam("lineWidth", v)}
                min={0.5}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Opacity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                Opacity: {(params.opacity * 100).toFixed(0)}%
              </label>
              <Slider
                value={[params.opacity]}
                onValueChange={([v]) => updateParam("opacity", v)}
                min={0.1}
                max={1.0}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-zinc-800 text-xs text-zinc-500 space-y-2">
              <p>
                Moiré patterns emerge when two similar patterns overlap, creating
                interference fringes not present in either original.
              </p>
              <p className="text-zinc-600">
                Try similar densities with slight angle differences for classic moiré effects.
                Difference blend mode creates striking high-contrast patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
