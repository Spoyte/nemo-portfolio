"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { strangeAttractor } from "@/lib/art/strange-attractor";
import { Play, Pause, RefreshCw, Sparkles, Palette, Wind, ZoomIn, RotateCw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const ATTRACTOR_TYPES = ["lorenz", "rossler", "aizawa", "thomas"] as const;
const ATTRACTOR_LABELS = ["Lorenz", "Rössler", "Aizawa", "Thomas"] as const;
const COLOR_SCHEMES = ["fire", "ocean", "neon", "gold"] as const;
const COLOR_LABELS = ["Fire", "Ocean", "Neon", "Gold"] as const;

// Attractor descriptions
const ATTRACTOR_INFO: Record<string, { name: string; description: string; equation: string }> = {
  lorenz: {
    name: "Lorenz Attractor",
    description: "The classic butterfly-shaped chaotic system discovered by Edward Lorenz in 1963 while studying atmospheric convection.",
    equation: "dx/dt = σ(y - x), dy/dt = x(ρ - z) - y, dz/dt = xy - βz"
  },
  rossler: {
    name: "Rössler Attractor",
    description: "A simpler chaotic system with a single folded band, discovered by Otto Rössler in 1976.",
    equation: "dx/dt = -y - z, dy/dt = x + ay, dz/dt = b + z(x - c)"
  },
  aizawa: {
    name: "Aizawa Attractor",
    description: "A complex attractor with elegant spherical structure and internal chaos.",
    equation: "A multi-parameter system showing spherical chaos with intricate internal dynamics."
  },
  thomas: {
    name: "Thomas Attractor",
    description: "A symmetric attractor based on sine functions, creating beautiful organic patterns.",
    equation: "dx/dt = sin(y) - bx, dy/dt = sin(z) - by, dz/dt = sin(x) - bz"
  }
};

export default function StrangeAttractorsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const rendererRef = useRef<any>(null);
  const timeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [params, setParams] = useState({
    attractorType: "lorenz" as typeof ATTRACTOR_TYPES[number],
    particleCount: 2000,
    trailLength: 80,
    speed: 0.005,
    colorScheme: "fire" as typeof COLOR_SCHEMES[number],
    zoom: 12,
    rotationSpeed: 0.3,
    seed: 42,
  });

  // Initialize pixel renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    
    rendererRef.current = {
      pixels: imageData.data,
      width: canvas.width,
      height: canvas.height,
      drawLine: (x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, a: number) => {
        // Simple line drawing with pixel manipulation
        const dx = x2 - x1;
        const dy = y2 - y1;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        
        for (let i = 0; i <= steps; i++) {
          const x = Math.floor(x1 + (dx * i) / steps);
          const y = Math.floor(y1 + (dy * i) / steps);
          
          if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            const idx = (y * canvas.width + x) * 4;
            const alpha = a / 255;
            rendererRef.current.pixels[idx] = Math.min(255, rendererRef.current.pixels[idx] * (1 - alpha) + r * alpha);
            rendererRef.current.pixels[idx + 1] = Math.min(255, rendererRef.current.pixels[idx + 1] * (1 - alpha) + g * alpha);
            rendererRef.current.pixels[idx + 2] = Math.min(255, rendererRef.current.pixels[idx + 2] * (1 - alpha) + b * alpha);
            rendererRef.current.pixels[idx + 3] = 255;
          }
        }
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rendererRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate initial frame
    const frameGenerator = strangeAttractor.generate(
      canvas.width,
      canvas.height,
      timeRef.current,
      params
    );

    const animate = () => {
      if (isPlaying) {
        timeRef.current += 16;
        frameGenerator(rendererRef.current);
        
        // Put pixels to canvas
        const imageData = new ImageData(
          new Uint8ClampedArray(rendererRef.current.pixels),
          canvas.width,
          canvas.height
        );
        ctx.putImageData(imageData, 0, 0);
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
        const size = Math.min(container.clientWidth, 600);
        canvas.width = size;
        canvas.height = size;
        
        // Reinitialize renderer with new size
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imageData = ctx.createImageData(canvas.width, canvas.height);
          if (rendererRef.current) {
            rendererRef.current.pixels = imageData.data;
            rendererRef.current.width = canvas.width;
            rendererRef.current.height = canvas.height;
          }
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const regenerate = useCallback(() => {
    setParams(prev => ({ ...prev, seed: Math.floor(Math.random() * 10000) }));
    timeRef.current = 0;
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas && rendererRef.current) {
      rendererRef.current.pixels.fill(0);
    }
  }, []);

  const currentInfo = ATTRACTOR_INFO[params.attractorType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Strange Attractors</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Mathematical chaos rendered beautiful. Watch as particles trace the invisible 
            geometry of deterministic yet unpredictable systems.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,360px] gap-8 items-start">
          {/* Canvas Container */}
          <div className="flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800 bg-black">
              <canvas
                ref={canvasRef}
                className="block"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4 mt-6">
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
                onClick={regenerate}
                className="rounded-full border-slate-700 hover:bg-slate-800"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Seed
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Attractor Info Card */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-medium text-amber-400 mb-2">{currentInfo.name}</h3>
              <p className="text-sm text-slate-400 mb-3">{currentInfo.description}</p>
              <code className="text-xs text-slate-500 block bg-slate-950/50 p-2 rounded">
                {currentInfo.equation}
              </code>
            </div>

            {/* Controls */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Settings
              </h2>

              {/* Attractor Type */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <RotateCw className="w-4 h-4" />
                  Attractor Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ATTRACTOR_TYPES.map((type, i) => (
                    <button
                      key={type}
                      onClick={() => setParams(prev => ({ ...prev, attractorType: type }))}
                      className={`
                        px-3 py-2 rounded-lg text-sm transition-all
                        ${params.attractorType === type 
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" 
                          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                        }
                      `}
                    >
                      {ATTRACTOR_LABELS[i]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Scheme */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Palette className="w-4 h-4" />
                  Color Scheme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_SCHEMES.map((scheme, i) => (
                    <button
                      key={scheme}
                      onClick={() => setParams(prev => ({ ...prev, colorScheme: scheme }))}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                        ${params.colorScheme === scheme 
                          ? "bg-slate-700 text-white" 
                          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                        }
                      `}
                    >
                      <div className={`
                        w-3 h-3 rounded-full
                        ${scheme === "fire" ? "bg-gradient-to-br from-red-500 to-yellow-400" : ""}
                        ${scheme === "ocean" ? "bg-gradient-to-br from-cyan-500 to-blue-600" : ""}
                        ${scheme === "neon" ? "bg-gradient-to-br from-purple-500 to-pink-400" : ""}
                        ${scheme === "gold" ? "bg-gradient-to-br from-amber-400 to-yellow-600" : ""}
                      `} />
                      {COLOR_LABELS[i]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Particle Count */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Sparkles className="w-4 h-4" />
                  Particles: {params.particleCount}
                </label>
                <Slider
                  value={[params.particleCount]}
                  onValueChange={([v]) => setParams(prev => ({ ...prev, particleCount: v }))}
                  min={500}
                  max={5000}
                  step={100}
                  className="w-full"
                />
              </div>

              {/* Trail Length */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Wind className="w-4 h-4" />
                  Trail Length: {params.trailLength}
                </label>
                <Slider
                  value={[params.trailLength]}
                  onValueChange={([v]) => setParams(prev => ({ ...prev, trailLength: v }))}
                  min={20}
                  max={150}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Zoom */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <ZoomIn className="w-4 h-4" />
                  Zoom: {params.zoom}
                </label>
                <Slider
                  value={[params.zoom]}
                  onValueChange={([v]) => setParams(prev => ({ ...prev, zoom: v }))}
                  min={5}
                  max={25}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Rotation Speed */}
              <div className="mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <RotateCw className="w-4 h-4" />
                  Rotation: {params.rotationSpeed}x
                </label>
                <Slider
                  value={[params.rotationSpeed]}
                  onValueChange={([v]) => setParams(prev => ({ ...prev, rotationSpeed: v }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Info */}
            <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800/50 text-xs text-slate-500 space-y-2">
              <p>Strange attractors are sets of points in phase space that chaotic systems evolve toward.</p>
              <p>Despite being deterministic, they exhibit sensitive dependence on initial conditions — the butterfly effect.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
