"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, SlidersHorizontal, Download, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { lenia } from "@/lib/art/lenia";
import { generateSeed } from "@/lib/art/core";

export default function LeniaPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [params, setParams] = useState({
    kernelRadius: 13,
    growthCenter: 0.15,
    growthWidth: 0.015,
    dt: 0.2,
    colorHue: 200,
    saturation: 70,
    seed: generateSeed(),
  });

  const regenerate = useCallback(() => {
    setParams(prev => ({ ...prev, seed: generateSeed() }));
  }, []);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `lenia-${params.seed}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [params.seed]);

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
        lenia.generate(ctx, params, time);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, params]);

  const updateParam = (key: string, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <h1 className="text-lg font-semibold">Lenia</h1>
              <p className="text-xs text-white/60">Continuous cellular automata</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={regenerate}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={downloadImage}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Download className="w-5 h-5" />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-black/95 border-white/10">
                <SheetHeader>
                  <SheetTitle className="text-white">Parameters</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Kernel Radius: {params.kernelRadius}</label>
                    <Slider
                      value={[params.kernelRadius]}
                      onValueChange={([v]) => updateParam("kernelRadius", v)}
                      min={5}
                      max={25}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Growth Center: {params.growthCenter.toFixed(3)}</label>
                    <Slider
                      value={[params.growthCenter]}
                      onValueChange={([v]) => updateParam("growthCenter", v)}
                      min={0.05}
                      max={0.3}
                      step={0.005}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Growth Width: {params.growthWidth.toFixed(3)}</label>
                    <Slider
                      value={[params.growthWidth]}
                      onValueChange={([v]) => updateParam("growthWidth", v)}
                      min={0.005}
                      max={0.05}
                      step={0.005}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Time Step: {params.dt.toFixed(2)}</label>
                    <Slider
                      value={[params.dt]}
                      onValueChange={([v]) => updateParam("dt", v)}
                      min={0.05}
                      max={0.5}
                      step={0.05}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Base Hue: {params.colorHue}</label>
                    <Slider
                      value={[params.colorHue]}
                      onValueChange={([v]) => updateParam("colorHue", v)}
                      min={0}
                      max={360}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Saturation: {params.saturation}</label>
                    <Slider
                      value={[params.saturation]}
                      onValueChange={([v]) => updateParam("saturation", v)}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/50">
                      Lenia is a continuous cellular automaton where cells have floating-point states (0-1) 
                      and update based on kernel convolution. Unlike discrete CA (Game of Life), 
                      Lenia produces smooth, organic, lifelike patterns.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Canvas */}
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="max-w-full max-h-[calc(100vh-5rem)] w-auto h-auto pixelated"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    </div>
  );
}
