"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { mandelbrotExplorer } from "@/lib/art/mandelbrot-explorer";
import { MANDELBROT_LOCATIONS } from "@/lib/art/mandelbrot";
import { Play, Pause, RefreshCw, MapPin, ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Types ---

const COLOR_SCHEMES = ["smooth", "fire", "electric", "grayscale", "neon", "ocean"] as const;
type ColorScheme = (typeof COLOR_SCHEMES)[number];

interface MandelbrotParams {
  zoom: number;
  centerX: number;
  centerY: number;
  maxIterations: number;
  colorScheme: ColorScheme;
  escapeRadius: number;
  seed: number;
}

// --- Constants ---

const DEFAULT_PARAMS: MandelbrotParams = {
  zoom: 1,
  centerX: -0.5,
  centerY: 0,
  maxIterations: 100,
  colorScheme: "smooth",
  escapeRadius: 2.0,
  seed: 0,
};

// --- Components ---

const ParameterSlider = memo(
  ({
    label,
    value,
    min,
    max,
    step,
    onChange,
    disabled = false,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    disabled?: boolean;
  }) => (
    <div className={`space-y-2 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-mono">{value.toFixed(step < 0.01 ? 4 : step < 1 ? 2 : 0)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        disabled={disabled}
        className="cursor-pointer"
      />
    </div>
  )
);
ParameterSlider.displayName = "ParameterSlider";

// --- Main Component ---

export default function MandelbrotExplorerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const [params, setParams] = useState<MandelbrotParams>(DEFAULT_PARAMS);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRendering, setIsRendering] = useState(false);

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsRendering(true);

    // Render the Mandelbrot set
    mandelbrotExplorer.generate(ctx, {
      zoom: params.zoom,
      centerX: params.centerX,
      centerY: params.centerY,
      maxIterations: params.maxIterations,
      colorScheme: params.colorScheme,
      escapeRadius: params.escapeRadius,
    }, timeRef.current);

    setIsRendering(false);
  }, [params]);

  // Animation loop
  useEffect(() => {
    const loop = () => {
      if (isPlaying) {
        timeRef.current += 16;
        render();
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, render]);

  // Handle canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const size = Math.min(container.clientWidth, 600);
      canvas.width = size;
      canvas.height = size;
      render();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [render]);

  // Update single param
  const updateParam = useCallback(<K extends keyof MandelbrotParams>(
    key: K,
    value: MandelbrotParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Jump to location
  const jumpToLocation = useCallback((index: number) => {
    const loc = MANDELBROT_LOCATIONS[index];
    setParams((prev) => ({
      ...prev,
      centerX: loc.centerX,
      centerY: loc.centerY,
      zoom: loc.zoom,
    }));
  }, []);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setParams((prev) => ({ ...prev, zoom: Math.min(prev.zoom * 2, 1000) }));
  }, []);

  const zoomOut = useCallback(() => {
    setParams((prev) => ({ ...prev, zoom: Math.max(prev.zoom / 2, 1) }));
  }, []);

  // Reset
  const reset = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    timeRef.current = 0;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Mandelbrot Explorer
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Infinite complexity from simple iteration. Explore the boundary of the Mandelbrot set — 
            where z² + c creates endless fractal beauty.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
              <div className="relative flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="rounded-lg shadow-2xl max-w-full"
                  style={{ imageRendering: "crisp-edges" }}
                />
                {isRendering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 rounded-lg">
                    <div className="text-cyan-400 animate-pulse">Rendering...</div>
                  </div>
                )}
              </div>

              {/* Quick Controls */}
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={zoomOut}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={zoomIn}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={reset}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Location Presets */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-slate-200">Famous Locations</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {MANDELBROT_LOCATIONS.map((loc, i) => (
                  <Button
                    key={loc.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => jumpToLocation(i)}
                    className="justify-start text-xs text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50"
                  >
                    {loc.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Parameters */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 space-y-4">
              <h3 className="font-semibold text-slate-200 mb-3">Parameters</h3>

              <ParameterSlider
                label="Zoom Level"
                value={params.zoom}
                min={1}
                max={1000}
                step={1}
                onChange={(v) => updateParam("zoom", v)}
              />

              <ParameterSlider
                label="Center X"
                value={params.centerX}
                min={-2}
                max={1}
                step={0.001}
                onChange={(v) => updateParam("centerX", v)}
              />

              <ParameterSlider
                label="Center Y"
                value={params.centerY}
                min={-1.5}
                max={1.5}
                step={0.001}
                onChange={(v) => updateParam("centerY", v)}
              />

              <ParameterSlider
                label="Detail Level (Iterations)"
                value={params.maxIterations}
                min={50}
                max={500}
                step={10}
                onChange={(v) => updateParam("maxIterations", v)}
              />

              <div className="space-y-2">
                <span className="text-xs text-slate-400">Color Scheme</span>
                <Select
                  value={params.colorScheme}
                  onValueChange={(v) => updateParam("colorScheme", v as ColorScheme)}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {COLOR_SCHEMES.map((scheme) => (
                      <SelectItem key={scheme} value={scheme} className="capitalize">
                        {scheme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Info */}
            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800/50 text-sm text-slate-500">
              <p className="mb-2">
                <strong className="text-slate-400">Formula:</strong> z² + c
              </p>
              <p>
                Each pixel represents a complex number c. The color shows how quickly 
                z diverges when iterated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
