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
import { physarumNetwork } from "@/lib/art/physarum-network";
import { generateSeed } from "@/lib/art/core";

export default function PhysarumNetworkPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  const [params, setParams] = useState({
    agentCount: 4000,
    sensorAngle: 30,
    sensorDistance: 15,
    turnSpeed: 20,
    decayRate: 3,
    depositAmount: 50,
    colorHue: 120,
    seed: generateSeed(),
  });

  const regenerate = useCallback(() => {
    setParams(prev => ({ ...prev, seed: generateSeed() }));
  }, []);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `physarum-network-${params.seed}.png`;
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
        physarumNetwork.generate(ctx, params, time);
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
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <h1 className="text-lg font-semibold">Physarum Network</h1>
              <p className="text-xs text-white/60">Slime mold pathfinding simulation</p>
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
                    <label className="text-sm text-white/70">Agent Count: {params.agentCount}</label>
                    <Slider
                      value={[params.agentCount]}
                      onValueChange={([v]) => updateParam("agentCount", v)}
                      min={500}
                      max={8000}
                      step={500}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Sensor Angle: {params.sensorAngle}°</label>
                    <Slider
                      value={[params.sensorAngle]}
                      onValueChange={([v]) => updateParam("sensorAngle", v)}
                      min={10}
                      max={60}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Sensor Distance: {params.sensorDistance}</label>
                    <Slider
                      value={[params.sensorDistance]}
                      onValueChange={([v]) => updateParam("sensorDistance", v)}
                      min={5}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Turn Speed: {params.turnSpeed}</label>
                    <Slider
                      value={[params.turnSpeed]}
                      onValueChange={([v]) => updateParam("turnSpeed", v)}
                      min={5}
                      max={45}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Trail Decay: {params.decayRate}</label>
                    <Slider
                      value={[params.decayRate]}
                      onValueChange={([v]) => updateParam("decayRate", v)}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Deposit Amount: {params.depositAmount}</label>
                    <Slider
                      value={[params.depositAmount]}
                      onValueChange={([v]) => updateParam("depositAmount", v)}
                      min={10}
                      max={100}
                      step={10}
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
                  
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/50">
                      Agents deposit trails and sense gradients to create emergent network structures. 
                      Based on Physarum polycephalum (slime mold) behavior.
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
          width={800}
          height={800}
          className="max-w-full max-h-[calc(100vh-5rem)] w-auto h-auto"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    </div>
  );
}
