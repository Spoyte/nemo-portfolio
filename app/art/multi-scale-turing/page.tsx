"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, SlidersHorizontal, Download, Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { multiScaleTuring } from "@/lib/art/multi-scale-turing";

export default function MultiScaleTuringPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [params, setParams] = useState({
    scale1: 8,
    scale2: 4,
    scale3: 2,
    rate1: 1.0,
    rate2: 0.7,
    rate3: 0.4,
    feed: 0.055,
    kill: 0.062,
    diffusionA: 1.0,
    diffusionB: 0.5,
    colorScheme: "leopard" as const,
    blendMode: "overlay" as const,
    animate: true,
    speed: 1.0,
  });

  const regenerate = useCallback(() => {
    // Force re-initialization by clearing canvas state
    const canvas = canvasRef.current;
    if (canvas) {
      (canvas as any)._turingState = null;
    }
  }, []);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `multi-scale-turing-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      if (params.animate) {
        time += 16 * params.speed;
        multiScaleTuring.generate(ctx, params, time);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initial render
    multiScaleTuring.generate(ctx, params, 0);
    
    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [params]);

  const updateParam = (key: string, value: number | string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-amber-400" />
            <div>
              <h1 className="text-lg font-semibold">Multi-Scale Turing</h1>
              <p className="text-xs text-white/60">Nested reaction-diffusion patterns</p>
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
                  {/* Scale Controls */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white/80">Pattern Scales</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Large Scale: {params.scale1}</label>
                      <Slider
                        value={[params.scale1]}
                        onValueChange={([v]) => updateParam("scale1", v)}
                        min={2}
                        max={16}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Medium Scale: {params.scale2}</label>
                      <Slider
                        value={[params.scale2]}
                        onValueChange={([v]) => updateParam("scale2", v)}
                        min={1}
                        max={8}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Small Scale: {params.scale3}</label>
                      <Slider
                        value={[params.scale3]}
                        onValueChange={([v]) => updateParam("scale3", v)}
                        min={1}
                        max={4}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Rate Controls */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h3 className="text-sm font-medium text-white/80">Reaction Rates</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Large Rate: {params.rate1.toFixed(1)}</label>
                      <Slider
                        value={[params.rate1]}
                        onValueChange={([v]) => updateParam("rate1", v)}
                        min={0.1}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Medium Rate: {params.rate2.toFixed(1)}</label>
                      <Slider
                        value={[params.rate2]}
                        onValueChange={([v]) => updateParam("rate2", v)}
                        min={0.1}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Small Rate: {params.rate3.toFixed(1)}</label>
                      <Slider
                        value={[params.rate3]}
                        onValueChange={([v]) => updateParam("rate3", v)}
                        min={0.1}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Diffusion Controls */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h3 className="text-sm font-medium text-white/80">Diffusion</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Feed Rate: {params.feed.toFixed(3)}</label>
                      <Slider
                        value={[params.feed]}
                        onValueChange={([v]) => updateParam("feed", v)}
                        min={0.01}
                        max={0.1}
                        step={0.001}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Kill Rate: {params.kill.toFixed(3)}</label>
                      <Slider
                        value={[params.kill]}
                        onValueChange={([v]) => updateParam("kill", v)}
                        min={0.01}
                        max={0.1}
                        step={0.001}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Animation Controls */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h3 className="text-sm font-medium text-white/80">Animation</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Speed: {params.speed.toFixed(1)}</label>
                      <Slider
                        value={[params.speed]}
                        onValueChange={([v]) => updateParam("speed", v)}
                        min={0.1}
                        max={3.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/50 leading-relaxed">
                      Multi-Scale Turing patterns simulate reaction-diffusion at three different scales 
                      simultaneously. This mimics how animal coat patterns form — large-scale body plans 
                      with medium-scale markings and fine-scale texture, all emerging from the same 
                      mathematical process.
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
