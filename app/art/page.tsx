"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Download, 
  RefreshCw, 
  Shuffle, 
  Settings2,
  Copy,
  Check,
  Sparkles,
  Grid3X3,
  Maximize2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Generative art algorithms
const artGenerators = {
  "flow-field": {
    name: "Flow Field",
    description: "Organic flowing lines following Perlin noise vectors",
    generate: (canvas: HTMLCanvasElement, params: any) => {
      const ctx = canvas.getContext("2d")!;
      const { particleCount, noiseScale, speed, colorHue } = params;
      
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Simple noise function
      const noise = (x: number, y: number) => {
        return Math.sin(x * noiseScale) * Math.cos(y * noiseScale) + 
               Math.sin(x * noiseScale * 2 + y) * 0.5;
      };
      
      for (let i = 0; i < particleCount; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        const hue = (colorHue + i * 0.5) % 360;
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.1)`;
        ctx.lineWidth = 1;
        
        for (let j = 0; j < 100; j++) {
          const angle = noise(x * 0.01, y * 0.01) * Math.PI * 4;
          x += Math.cos(angle) * speed;
          y += Math.sin(angle) * speed;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }
    },
    defaultParams: { particleCount: 500, noiseScale: 0.01, speed: 2, colorHue: 200 },
  },
  "geometric-mandala": {
    name: "Geometric Mandala",
    description: "Symmetrical patterns inspired by sacred geometry",
    generate: (canvas: HTMLCanvasElement, params: any) => {
      const ctx = canvas.getContext("2d")!;
      const { layers, symmetry, radius, colorShift } = params;
      
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      for (let l = 0; l < layers; l++) {
        const layerRadius = radius * (l + 1) / layers;
        const hue = (colorShift + l * 30) % 360;
        
        ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.6)`;
        ctx.lineWidth = 2;
        
        for (let i = 0; i < symmetry; i++) {
          const angle = (i / symmetry) * Math.PI * 2;
          const x = cx + Math.cos(angle) * layerRadius;
          const y = cy + Math.sin(angle) * layerRadius;
          
          ctx.beginPath();
          ctx.arc(x, y, layerRadius * 0.3, 0, Math.PI * 2);
          ctx.stroke();
          
          // Connect to center
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();
          
          // Connect to neighbors
          const nextAngle = ((i + 1) / symmetry) * Math.PI * 2;
          const nextX = cx + Math.cos(nextAngle) * layerRadius;
          const nextY = cy + Math.sin(nextAngle) * layerRadius;
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
      }
    },
    defaultParams: { layers: 5, symmetry: 12, radius: 300, colorShift: 0 },
  },
  "particle-network": {
    name: "Particle Network",
    description: "Connected particles forming dynamic networks",
    generate: (canvas: HTMLCanvasElement, params: any) => {
      const ctx = canvas.getContext("2d")!;
      const { particleCount, connectionDistance, particleSize, baseHue } = params;
      
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const particles: { x: number; y: number; vx: number; vy: number }[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
      }
      
      // Draw connections
      ctx.strokeStyle = `hsla(${baseHue}, 70%, 60%, 0.15)`;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw particles
      for (const p of particles) {
        const hue = (baseHue + Math.random() * 60) % 360;
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    defaultParams: { particleCount: 80, connectionDistance: 150, particleSize: 4, baseHue: 200 },
  },
  "recursive-trees": {
    name: "Recursive Trees",
    description: "Fractal tree structures with organic variation",
    generate: (canvas: HTMLCanvasElement, params: any) => {
      const ctx = canvas.getContext("2d")!;
      const { branchLength, angle, depth, randomness } = params;
      
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const drawBranch = (x: number, y: number, len: number, angle: number, depth: number) => {
        if (depth === 0) return;
        
        const endX = x + Math.cos(angle) * len;
        const endY = y + Math.sin(angle) * len;
        
        const hue = 120 + depth * 10;
        ctx.strokeStyle = `hsla(${hue}, 60%, ${30 + depth * 5}%, ${depth / 10})`;
        ctx.lineWidth = depth * 0.8;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        const angleVar = (Math.random() - 0.5) * randomness;
        
        drawBranch(endX, endY, len * 0.7, angle - 0.5 + angleVar, depth - 1);
        drawBranch(endX, endY, len * 0.7, angle + 0.5 + angleVar, depth - 1);
      };
      
      // Draw multiple trees
      for (let i = 0; i < 5; i++) {
        const x = canvas.width * (0.2 + i * 0.15);
        drawBranch(x, canvas.height, branchLength, -Math.PI / 2, depth);
      }
    },
    defaultParams: { branchLength: 120, angle: 0.5, depth: 10, randomness: 0.3 },
  },
  "wave-interference": {
    name: "Wave Interference",
    description: "Overlapping sine waves creating interference patterns",
    generate: (canvas: HTMLCanvasElement, params: any) => {
      const ctx = canvas.getContext("2d")!;
      const { waveCount, frequency, amplitude, phaseShift } = params;
      
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let x = 0; x < canvas.width; x += 2) {
        for (let y = 0; y < canvas.height; y += 2) {
          let value = 0;
          
          for (let w = 0; w < waveCount; w++) {
            const angle = (w / waveCount) * Math.PI * 2;
            const sourceX = canvas.width / 2 + Math.cos(angle) * 200;
            const sourceY = canvas.height / 2 + Math.sin(angle) * 200;
            
            const dist = Math.sqrt((x - sourceX) ** 2 + (y - sourceY) ** 2);
            value += Math.sin(dist * frequency + phaseShift + w) * amplitude;
          }
          
          const intensity = Math.floor((value / waveCount + 1) * 127.5);
          const hue = (intensity * 2) % 360;
          
          for (let dx = 0; dx < 2; dx++) {
            for (let dy = 0; dy < 2; dy++) {
              const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
              data[idx] = intensity;
              data[idx + 1] = intensity * 0.5;
              data[idx + 2] = 255 - intensity;
              data[idx + 3] = 255;
            }
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    },
    defaultParams: { waveCount: 3, frequency: 0.02, amplitude: 1, phaseShift: 0 },
  },
  "cellular-automata": {
    name: "Cellular Automata",
    description: "Emergent patterns from simple rules",
    generate: (canvas: HTMLCanvasElement, params: any) => {
      const ctx = canvas.getContext("2d")!;
      const { cellSize, generations, rule, colorScheme } = params;
      
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const cols = Math.floor(canvas.width / cellSize);
      const rows = Math.min(generations, Math.floor(canvas.height / cellSize));
      
      let currentRow = new Array(cols).fill(0);
      currentRow[Math.floor(cols / 2)] = 1;
      
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (currentRow[x]) {
            const hue = (colorScheme + y * 2) % 360;
            ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
          }
        }
        
        // Generate next row based on rule
        const nextRow = new Array(cols).fill(0);
        for (let x = 1; x < cols - 1; x++) {
          const left = currentRow[x - 1];
          const center = currentRow[x];
          const right = currentRow[x + 1];
          const pattern = left * 4 + center * 2 + right;
          nextRow[x] = (rule >> pattern) & 1;
        }
        currentRow = nextRow;
      }
    },
    defaultParams: { cellSize: 4, generations: 200, rule: 90, colorScheme: 200 },
  },
  "voronoi-organic": {
    name: "Voronoi Organic",
    description: "Animated Voronoi diagram with organic distortion",
    generate: (canvas: HTMLCanvasElement, params: any) => {
      const ctx = canvas.getContext("2d")!;
      const { cellCount, distortion, palette } = params;
      
      const colorPalettes: Record<string, string[]> = {
        ocean: ["#0066cc", "#0099ff", "#00ccff", "#66e0ff", "#b3f0ff", "#004080"],
        sunset: ["#ff6b35", "#f7931e", "#ffd23f", "#ff6b9d", "#c44569", "#2c003e"],
        forest: ["#2d5016", "#3a6b1f", "#4a8b2c", "#7cb342", "#aed581", "#1b3d0d"],
        monochrome: ["#0a0a0a", "#2a2a2a", "#4a4a4a", "#6a6a6a", "#8a8a8a", "#aaaaaa"],
        neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00", "#8000ff"],
      };
      
      const colors = colorPalettes[palette] || colorPalettes.ocean;
      const time = Date.now() * 0.001;
      
      // Generate cell centers
      const cells: { x: number; y: number; color: string; growth: number; radius: number }[] = [];
      for (let i = 0; i < cellCount; i++) {
        cells.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          color: colors[Math.floor(Math.random() * colors.length)],
          growth: 0.5 + Math.random() * 1.5,
          radius: 30 + Math.random() * 50,
        });
      }
      
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      const getDistance = (x: number, y: number, cell: typeof cells[0]) => {
        const dx = x - cell.x;
        const dy = y - cell.y;
        const euclidean = Math.sqrt(dx * dx + dy * dy);
        const wobble = Math.sin(x * 0.01 + time * cell.growth) * 
                       Math.cos(y * 0.01 + time * cell.growth * 0.7) * distortion;
        return euclidean + wobble;
      };
      
      const step = 2;
      
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          let minDist = Infinity;
          let nearestCell: typeof cells[0] | null = null;
          let secondDist = Infinity;
          
          for (const cell of cells) {
            const dist = getDistance(x, y, cell);
            if (dist < minDist) {
              secondDist = minDist;
              minDist = dist;
              nearestCell = cell;
            } else if (dist < secondDist) {
              secondDist = dist;
            }
          }
          
          if (nearestCell) {
            const edgeFactor = Math.min(1, (secondDist - minDist) / 30);
            
            const hex = nearestCell.color;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            
            const depth = Math.max(0.3, 1 - minDist / nearestCell.radius);
            const edgeHighlight = edgeFactor < 0.3 ? (0.3 - edgeFactor) * 3 : 0;
            
            const finalR = Math.min(255, r * depth + edgeHighlight * 100);
            const finalG = Math.min(255, g * depth + edgeHighlight * 100);
            const finalB = Math.min(255, b * depth + edgeHighlight * 100);
            
            for (let dy = 0; dy < step && y + dy < canvas.height; dy++) {
              for (let dx = 0; dx < step && x + dx < canvas.width; dx++) {
                const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
                data[idx] = finalR;
                data[idx + 1] = finalG;
                data[idx + 2] = finalB;
                data[idx + 3] = 255;
              }
            }
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    },
    defaultParams: { cellCount: 40, distortion: 10, palette: 0 },
  },
};

export default function GenerativeArtPage() {
  const [selectedArt, setSelectedArt] = useState("flow-field");
  const [params, setParams] = useState(artGenerators["flow-field"].defaultParams);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null);

  const generate = async (targetCanvas?: HTMLCanvasElement) => {
    const canvas = targetCanvas || canvasRef.current;
    if (!canvas) return;
    
    setIsGenerating(true);
    
    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const generator = artGenerators[selectedArt as keyof typeof artGenerators];
    if (generator) {
      generator.generate(canvas, params);
    }
    
    setIsGenerating(false);
  };

  const handleArtChange = (artKey: string) => {
    setSelectedArt(artKey);
    setParams(artGenerators[artKey as keyof typeof artGenerators].defaultParams);
  };

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleRandomize = () => {
    const generator = artGenerators[selectedArt as keyof typeof artGenerators];
    const newParams: any = {};
    
    Object.entries(generator.defaultParams).forEach(([key, defaultValue]) => {
      if (typeof defaultValue === "number") {
        const min = defaultValue * 0.5;
        const max = defaultValue * 1.5;
        newParams[key] = Math.floor(Math.random() * (max - min) + min);
      } else {
        newParams[key] = defaultValue;
      }
    });
    
    setParams(newParams);
    toast.success("Parameters randomized!");
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `generative-art-${selectedArt}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success("Artwork downloaded!");
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          toast.success("Copied to clipboard!");
        }
      });
    } catch {
      toast.error("Failed to copy");
    }
  };

  const openFullscreen = async () => {
    setShowFullscreen(true);
    // Generate on fullscreen canvas after it mounts
    setTimeout(() => {
      if (fullscreenCanvasRef.current) {
        fullscreenCanvasRef.current.width = window.innerWidth;
        fullscreenCanvasRef.current.height = window.innerHeight;
        generate(fullscreenCanvasRef.current);
      }
    }, 100);
  };

  // Auto-generate when params change
  useEffect(() => {
    generate();
  }, [params, selectedArt]);

  // Initial generation
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 800;
      canvasRef.current.height = 600;
      generate();
    }
  }, []);

  const currentGenerator = artGenerators[selectedArt as keyof typeof artGenerators];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Generative Art</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Code Art Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore algorithmic art generated in real-time. Each piece is unique 
            and created with code.
          </p>
        </motion.div>

        {/* Art Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(artGenerators).map(([key, generator]) => (
              <Button
                key={key}
                variant={selectedArt === key ? "default" : "outline"}
                onClick={() => handleArtChange(key)}
                className="gap-2"
              >
                <Palette className="h-4 w-4" />
                {generator.name}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative">
                <div className="relative bg-black">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto max-h-[600px] object-contain"
                    style={{ aspectRatio: "4/3" }}
                  />
                  
                  {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <RefreshCw className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={openFullscreen}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{currentGenerator.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentGenerator.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRandomize}>
                      <Shuffle className="h-4 w-4 mr-1" />
                      Randomize
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Parameters</h3>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(params).map(([key, value]) => (
                    <div key={key}>
                      {key === "palette" ? (
                        <div>
                          <label className="text-sm font-medium capitalize mb-2 block">
                            Color Palette
                          </label>
                          <div className="flex gap-2 flex-wrap">
                            {["ocean", "sunset", "forest", "monochrome", "neon"].map((p) => (
                              <button
                                key={p}
                                onClick={() => handleParamChange(key, p === "ocean" ? 0 : p === "sunset" ? 1 : p === "forest" ? 2 : p === "monochrome" ? 3 : 4)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                                  (value === 0 && p === "ocean") ||
                                  (value === 1 && p === "sunset") ||
                                  (value === 2 && p === "forest") ||
                                  (value === 3 && p === "monochrome") ||
                                  (value === 4 && p === "neon")
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </label>
                            <span className="text-sm text-muted-foreground">{value}</span>
                          </div>
                          <Slider
                            value={[value as number]}
                            onValueChange={([v]) => handleParamChange(key, v)}
                            max={
                              key.includes("count") || key.includes("generations")
                                ? 1000
                                : key.includes("distance") || key.includes("radius")
                                ? 500
                                : key.includes("Hue") || key.includes("Shift") || key.includes("Scheme")
                            ? 360
                            : key === "rule"
                            ? 255
                            : key === "symmetry"
                            ? 24
                            : key === "depth"
                            ? 15
                            : 100
                        }
                        min={0}
                        step={key.includes("Hue") || key === "rule" ? 1 : 0.1}
                      />
                        </>
                      )}
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full mt-6" 
                  onClick={() => generate()}
                  disabled={isGenerating}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <Palette className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Algorithmic Art</h3>
              <p className="text-sm text-muted-foreground">
                Each piece is generated using mathematical algorithms and randomness, 
                creating unique compositions every time.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Grid3X3 className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Interactive</h3>
              <p className="text-sm text-muted-foreground">
                Adjust parameters in real-time to see how small changes affect 
                the overall composition. Experiment and discover!
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Download className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Export</h3>
              <p className="text-sm text-muted-foreground">
                Download your creations as high-resolution PNG images. Perfect 
                for wallpapers, backgrounds, or print.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white z-10"
              onClick={() => setShowFullscreen(false)}
            >
              <X className="h-8 w-8" />
            </Button>
            <canvas
              ref={fullscreenCanvasRef}
              className="w-full h-full"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
