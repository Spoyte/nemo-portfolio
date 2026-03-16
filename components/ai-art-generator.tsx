"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  Wand2, 
  Palette, 
  Shuffle,
  Share2,
  Image as ImageIcon,
  Sliders,
  Zap,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Art style presets
const artStyles = [
  { id: "geometric", name: "Geometric", color: "#6366f1", description: "Clean lines and shapes" },
  { id: "organic", name: "Organic", color: "#10b981", description: "Flowing natural forms" },
  { id: "cyberpunk", name: "Cyberpunk", color: "#ec4899", description: "Neon futuristic vibes" },
  { id: "minimal", name: "Minimal", color: "#f59e0b", description: "Simple and elegant" },
  { id: "chaos", name: "Chaos", color: "#ef4444", description: "Random and energetic" },
  { id: "cosmic", name: "Cosmic", color: "#8b5cf6", description: "Space and stars" },
];

// Color palettes
const colorPalettes = [
  { id: "sunset", name: "Sunset", colors: ["#f97316", "#ef4444", "#ec4899", "#8b5cf6"] },
  { id: "ocean", name: "Ocean", colors: ["#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6"] },
  { id: "forest", name: "Forest", colors: ["#10b981", "#22c55e", "#84cc16", "#eab308"] },
  { id: "monochrome", name: "Mono", colors: ["#1f2937", "#4b5563", "#9ca3af", "#e5e7eb"] },
  { id: "neon", name: "Neon", colors: ["#f0abfc", "#c084fc", "#818cf8", "#60a5fa"] },
  { id: "warm", name: "Warm", colors: ["#fbbf24", "#f59e0b", "#ef4444", "#dc2626"] },
];

interface ArtConfig {
  style: string;
  palette: string;
  complexity: number;
  symmetry: number;
  chaos: number;
  seed: number;
}

// Generate pseudo-random number from seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate art based on configuration
function generateArt(ctx: CanvasRenderingContext2D, config: ArtConfig, width: number, height: number) {
  const palette = colorPalettes.find(p => p.id === config.palette)?.colors || colorPalettes[0].colors;
  const style = config.style;
  
  // Clear canvas
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  
  let seed = config.seed;
  const random = () => {
    seed += 1;
    return seededRandom(seed);
  };
  
  const complexity = Math.floor(config.complexity * 50) + 10;
  
  switch (style) {
    case "geometric":
      drawGeometric(ctx, width, height, palette, complexity, random, config.symmetry);
      break;
    case "organic":
      drawOrganic(ctx, width, height, palette, complexity, random, config.chaos);
      break;
    case "cyberpunk":
      drawCyberpunk(ctx, width, height, palette, complexity, random);
      break;
    case "minimal":
      drawMinimal(ctx, width, height, palette, complexity, random);
      break;
    case "chaos":
      drawChaos(ctx, width, height, palette, complexity, random);
      break;
    case "cosmic":
      drawCosmic(ctx, width, height, palette, complexity, random);
      break;
    default:
      drawGeometric(ctx, width, height, palette, complexity, random, config.symmetry);
  }
}

function drawGeometric(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  palette: string[], 
  count: number,
  random: () => number,
  symmetry: number
) {
  for (let i = 0; i < count; i++) {
    const color = palette[Math.floor(random() * palette.length)];
    ctx.fillStyle = color + Math.floor(random() * 100 + 50).toString(16).padStart(2, '0');
    ctx.strokeStyle = color;
    
    const shape = Math.floor(random() * 3);
    const x = random() * width;
    const y = random() * height;
    const size = random() * 100 + 20;
    
    ctx.beginPath();
    if (shape === 0) {
      ctx.rect(x - size/2, y - size/2, size, size);
    } else if (shape === 1) {
      ctx.arc(x, y, size/2, 0, Math.PI * 2);
    } else {
      ctx.moveTo(x, y - size/2);
      ctx.lineTo(x + size/2, y + size/2);
      ctx.lineTo(x - size/2, y + size/2);
      ctx.closePath();
    }
    
    if (random() > 0.5) {
      ctx.fill();
    } else {
      ctx.lineWidth = random() * 5 + 1;
      ctx.stroke();
    }
    
    // Symmetry
    if (symmetry > 0.3) {
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(Math.PI);
      ctx.translate(-width/2, -height/2);
      if (random() > 0.5) ctx.fill(); else ctx.stroke();
      ctx.restore();
    }
  }
}

function drawOrganic(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  palette: string[], 
  count: number,
  random: () => number,
  chaos: number
) {
  for (let i = 0; i < count / 2; i++) {
    const color = palette[Math.floor(random() * palette.length)];
    ctx.strokeStyle = color + "80";
    ctx.lineWidth = random() * 3 + 0.5;
    
    ctx.beginPath();
    let x = random() * width;
    let y = random() * height;
    ctx.moveTo(x, y);
    
    const points = Math.floor(random() * 10) + 5;
    for (let j = 0; j < points; j++) {
      const angle = random() * Math.PI * 2;
      const dist = random() * 100 * (1 + chaos);
      x += Math.cos(angle) * dist;
      y += Math.sin(angle) * dist;
      
      const cp1x = x + (random() - 0.5) * 50;
      const cp1y = y + (random() - 0.5) * 50;
      ctx.quadraticCurveTo(cp1x, cp1y, x, y);
    }
    ctx.stroke();
  }
}

function drawCyberpunk(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  palette: string[], 
  count: number,
  random: () => number
) {
  // Grid background
  ctx.strokeStyle = palette[0] + "20";
  ctx.lineWidth = 1;
  const gridSize = 40;
  
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // Neon shapes
  for (let i = 0; i < count / 2; i++) {
    const color = palette[Math.floor(random() * palette.length)];
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = color;
    ctx.lineWidth = random() * 3 + 1;
    
    const x = random() * width;
    const y = random() * height;
    const w = random() * 150 + 50;
    const h = random() * 10 + 2;
    
    ctx.strokeRect(x - w/2, y - h/2, w, h);
    
    // Vertical accent
    if (random() > 0.7) {
      ctx.strokeRect(x - h/2, y - w/4, h, w/2);
    }
  }
  
  ctx.shadowBlur = 0;
}

function drawMinimal(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  palette: string[], 
  count: number,
  random: () => number
) {
  const shapes = Math.floor(count / 10) + 2;
  
  for (let i = 0; i < shapes; i++) {
    const color = palette[Math.floor(random() * palette.length)];
    ctx.fillStyle = color + "60";
    
    const x = width * (0.2 + random() * 0.6);
    const y = height * (0.2 + random() * 0.6);
    const size = Math.min(width, height) * (0.1 + random() * 0.3);
    
    ctx.beginPath();
    if (random() > 0.5) {
      ctx.arc(x, y, size/2, 0, Math.PI * 2);
    } else {
      ctx.rect(x - size/2, y - size/2, size, size);
    }
    ctx.fill();
  }
}

function drawChaos(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  palette: string[], 
  count: number,
  random: () => number
) {
  for (let i = 0; i < count * 2; i++) {
    const color = palette[Math.floor(random() * palette.length)];
    ctx.fillStyle = color + Math.floor(random() * 150 + 50).toString(16).padStart(2, '0');
    
    const x = random() * width;
    const y = random() * height;
    const size = random() * 30 + 5;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(random() * Math.PI * 2);
    ctx.fillRect(-size/2, -size/2, size, size);
    ctx.restore();
  }
}

function drawCosmic(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  palette: string[], 
  count: number,
  random: () => number
) {
  // Stars
  for (let i = 0; i < count * 3; i++) {
    const x = random() * width;
    const y = random() * height;
    const size = random() * 3;
    const brightness = Math.floor(random() * 200 + 55).toString(16).padStart(2, '0');
    
    ctx.fillStyle = "#ffffff" + brightness;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Nebula clouds
  for (let i = 0; i < 5; i++) {
    const color = palette[Math.floor(random() * palette.length)];
    const x = random() * width;
    const y = random() * height;
    const radius = random() * 150 + 50;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color + "40");
    gradient.addColorStop(1, "transparent");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function AIArtGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<ArtConfig>({
    style: "geometric",
    palette: "sunset",
    complexity: 0.5,
    symmetry: 0.5,
    chaos: 0.3,
    seed: Date.now(),
  });
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      generateArt(ctx, config, canvas.width, canvas.height);
      
      // Save to history
      const dataUrl = canvas.toDataURL();
      setHistory(prev => [dataUrl, ...prev].slice(0, 10));
      
      setIsGenerating(false);
      toast.success("Art generated! ✨");
    }, 500);
  }, [config]);

  // Initial generation
  useEffect(() => {
    generate();
  }, []);

  const downloadArt = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `nemo-art-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success("Art downloaded! 🎨");
  };

  const shareArt = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      if (navigator.share) {
        try {
          const file = new File([blob], "art.png", { type: "image/png" });
          await navigator.share({
            title: "My AI Generated Art",
            files: [file],
          });
        } catch {
          // User cancelled
        }
      } else {
        toast.info("Sharing not supported on this device");
      }
    });
  };

  const randomize = () => {
    setConfig({
      style: artStyles[Math.floor(Math.random() * artStyles.length)].id,
      palette: colorPalettes[Math.floor(Math.random() * colorPalettes.length)].id,
      complexity: Math.random(),
      symmetry: Math.random(),
      chaos: Math.random(),
      seed: Date.now(),
    });
  };

  const copySeed = () => {
    navigator.clipboard.writeText(JSON.stringify(config));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Configuration copied!");
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background via-purple-950/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AI Art{" "}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Generator
            </span>
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create unique generative art with AI-powered algorithms. 
            Customize styles, colors, and parameters to generate your masterpiece.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Style Selection */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Art Style</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {artStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setConfig({ ...config, style: style.id })}
                    className={`p-3 rounded-xl text-left transition-all ${
                      config.style === style.id
                        ? "bg-purple-500/20 border-2 border-purple-500"
                        : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mb-2" 
                      style={{ backgroundColor: style.color }}
                    />
                    <p className="font-medium text-sm">{style.name}</p>
                    <p className="text-xs text-muted-foreground">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-5 h-5 text-pink-500" />
                <h3 className="font-semibold">Color Palette</h3>
              </div>
              
              <div className="space-y-2">
                {colorPalettes.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => setConfig({ ...config, palette: palette.id })}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                      config.palette === palette.id
                        ? "bg-pink-500/20 border-2 border-pink-500"
                        : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex gap-1">
                      {palette.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold">Parameters</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Complexity</span>
                    <span className="text-sm text-muted-foreground">{Math.round(config.complexity * 100)}%</span>
                  </div>
                  <Slider
                    value={[config.complexity * 100]}
                    onValueChange={([v]) => setConfig({ ...config, complexity: v / 100 })}
                    max={100}
                    step={1}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Symmetry</span>
                    <span className="text-sm text-muted-foreground">{Math.round(config.symmetry * 100)}%</span>
                  </div>
                  <Slider
                    value={[config.symmetry * 100]}
                    onValueChange={([v]) => setConfig({ ...config, symmetry: v / 100 })}
                    max={100}
                    step={1}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Chaos</span>
                    <span className="text-sm text-muted-foreground">{Math.round(config.chaos * 100)}%</span>
                  </div>
                  <Slider
                    value={[config.chaos * 100]}
                    onValueChange={([v]) => setConfig({ ...config, chaos: v / 100 })}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Canvas Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Main Canvas */}
            <div className="relative rounded-2xl overflow-hidden bg-black border border-border">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-auto"
              />
              
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
                      <span className="text-white font-medium">Generating...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Watermark */}
              <div className="absolute bottom-4 right-4 text-white/30 text-xs">
                Generated by Nemo AI
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={generate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate
              </Button>
              
              <Button
                onClick={randomize}
                variant="outline"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Randomize
              </Button>
              
              <Button
                onClick={downloadArt}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              
              <Button
                onClick={shareArt}
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button
                onClick={copySeed}
                variant="ghost"
                size="icon"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {/* History */}
            {history.length > 1 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Recent Generations</h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {history.slice(1).map((img, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        const canvas = canvasRef.current;
                        if (!canvas) return;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;
                        const img_el = new Image();
                        img_el.onload = () => {
                          ctx.drawImage(img_el, 0, 0);
                        };
                        img_el.src = img;
                      }}
                      className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border hover:border-purple-500 transition-colors"
                    >
                      <img src={img} alt={`History ${i + 1}`} className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
