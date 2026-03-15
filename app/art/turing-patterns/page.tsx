"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, SlidersHorizontal, Download, Sparkles, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { turingPatterns } from "@/lib/art/turing-patterns";

export default function TuringPatternsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [params, setParams] = useState({
    pattern: "spots",
    activatorRate: 0.08,
    inhibitorRate: 0.04,
    activatorDiffusion: 0.2,
    inhibitorDiffusion: 0.1,
    colorScheme: "nature",
    speed: 1,
  });

  const regenerate = useCallback(() => {
    // Force re-initialization by clearing canvas state
    const canvas = canvasRef.current;
    if (canvas) {
      (canvas as any)._turingState = null;
    }
    // Toggle pattern to force reinit
    setParams(prev => ({ ...prev, pattern: prev.pattern }));
  }, []);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `turing-patterns-${params.pattern}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [params.pattern]);

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
        turingPatterns.generate(ctx, params, time);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, params]);

  const updateParam = (key: string, value: number | string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Color schemes
  const colorSchemes = ["nature", "zebra", "coral", "leopard", "ocean", "sunset", "neon", "earth"];
  const patterns = ["spots", "stripes", "labyrinth", "bubbles", "waves", "chaos"];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <h1 className="text-lg font-semibold">Turing Patterns</h1>
              <p className="text-xs text-white/60">Activator-inhibitor morphogenesis</p>
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
              <SheetContent side="right" className="w-80 bg-black/95 border-white/10 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-white">Parameters</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Pattern Type */}
                  <div className="space-y-3">
                    <label className="text-sm text-white/70">Pattern Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {patterns.map((p) => (
                        <Button
                          key={p}
                          variant={params.pattern === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateParam("pattern", p)}
                          className="text-xs capitalize"
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div className="space-y-3">
                    <label className="text-sm text-white/70">Color Scheme</label>
                    <div className="grid grid-cols-2 gap-2">
                      {colorSchemes.map((scheme) => (
                        <Button
                          key={scheme}
                          variant={params.colorScheme === scheme ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateParam("colorScheme", scheme)}
                          className="text-xs capitalize"
                        >
                          {scheme}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Activator Rate: {params.activatorRate.toFixed(2)}</label>
                    <Slider
                      value={[params.activatorRate]}
                      onValueChange={([v]) => updateParam("activatorRate", v)}
                      min={0.01}
                      max={0.2}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Inhibitor Rate: {params.inhibitorRate.toFixed(3)}</label>
                    <Slider
                      value={[params.inhibitorRate]}
                      onValueChange={([v]) => updateParam("inhibitorRate", v)}
                      min={0.01}
                      max={0.1}
                      step={0.005}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Activator Diffusion: {params.activatorDiffusion.toFixed(2)}</label>
                    <Slider
                      value={[params.activatorDiffusion]}
                      onValueChange={([v]) => updateParam("activatorDiffusion", v)}
                      min={0.05}
                      max={0.5}
                      step={0.05}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Inhibitor Diffusion: {params.inhibitorDiffusion.toFixed(2)}</label>
                    <Slider
                      value={[params.inhibitorDiffusion]}
                      onValueChange={([v]) => updateParam("inhibitorDiffusion", v)}
                      min={0.02}
                      max={0.3}
                      step={0.02}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Animation Speed: {params.speed.toFixed(1)}</label>
                    <Slider
                      value={[params.speed]}
                      onValueChange={([v]) => updateParam("speed", v)}
                      min={0}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-white/50">
                        Turing patterns emerge from the interaction of two chemicals: 
                        an activator and an inhibitor. This simulation is based on 
                        Alan Turing&apos;s 1952 paper on morphogenesis — the mathematical 
                        basis for patterns in animal coats, seashells, and biological systems.
                      </p>
                    </div>
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
