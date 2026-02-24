"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  renderMandelbrot,
  mandelbrotDefaultParams,
  MANDELBROT_LOCATIONS,
  MandelbrotParams,
} from "@/lib/art/mandelbrot";

export default function MandelbrotExplorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [params, setParams] = useState<MandelbrotParams>(mandelbrotDefaultParams);
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(0);

  const render = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      renderMandelbrot(ctx, params, time);
    },
    [params]
  );

  useEffect(() => {
    if (!isAnimating) return;

    let startTime = Date.now();
    const animate = () => {
      const time = Date.now() - startTime;
      render(time);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, render]);

  const handleLocationChange = (index: number) => {
    const location = MANDELBROT_LOCATIONS[index];
    setSelectedLocation(index);
    setParams((prev) => ({
      ...prev,
      centerX: location.centerX,
      centerY: location.centerY,
      zoom: location.zoom,
    }));
  };

  const handleParamChange = (key: keyof MandelbrotParams, value: number | string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams(mandelbrotDefaultParams);
    setSelectedLocation(0);
  };

  return (
    <div className="space-y-6">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full max-w-[400px] mx-auto block"
        />
      </div>

      <div className="space-y-4">
        {/* Location Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">
            Interesting Locations
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => handleLocationChange(Number(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
          >
            {MANDELBROT_LOCATIONS.map((loc, i) => (
              <option key={i} value={i}>
                {loc.name} (zoom: {loc.zoom}x)
              </option>
            ))}
          </select>
        </div>

        {/* Zoom Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-zinc-300">Zoom</label>
            <span className="text-sm text-zinc-500">{params.zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={1}
            max={1000}
            step={1}
            value={params.zoom}
            onChange={(e) => handleParamChange("zoom", Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Center X */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-zinc-300">Center X</label>
            <span className="text-sm text-zinc-500">{params.centerX.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={-2}
            max={1}
            step={0.001}
            value={params.centerX}
            onChange={(e) => handleParamChange("centerX", Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Center Y */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-zinc-300">Center Y</label>
            <span className="text-sm text-zinc-500">{params.centerY.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={-1.5}
            max={1.5}
            step={0.001}
            value={params.centerY}
            onChange={(e) => handleParamChange("centerY", Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Detail Level */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-zinc-300">Detail Level</label>
            <span className="text-sm text-zinc-500">{params.maxIterations} iterations</span>
          </div>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={params.maxIterations}
            onChange={(e) => handleParamChange("maxIterations", Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Color Scheme */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Color Scheme</label>
          <select
            value={params.colorScheme}
            onChange={(e) => handleParamChange("colorScheme", e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
          >
            <option value="smooth">Smooth Spectrum</option>
            <option value="fire">Fire</option>
            <option value="electric">Electric</option>
            <option value="grayscale">Grayscale</option>
            <option value="neon">Neon</option>
            <option value="ocean">Ocean</option>
          </select>
        </div>

        {/* Controls */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            {isAnimating ? "Pause" : "Animate"}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Info */}
        <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
          <p>
            The Mandelbrot set is defined by iterating z → z² + c. Points that
            remain bounded (black) are in the set; those that escape are colored
            by how quickly they diverge.
          </p>
        </div>
      </div>
    </div>
  );
}
