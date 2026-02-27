"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Film,
  Sparkles,
  Code2,
  Palette,
  Zap,
  Clock,
  Heart,
  Share2,
  Download,
  ChevronRight,
  Star,
  Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Cinema film types
interface Film {
  id: string;
  title: string;
  description: string;
  type: "algorithm" | "art" | "simulation" | "fractal";
  duration: number;
  thumbnail: string;
  color: string;
  code: string;
  tags: string[];
  likes: number;
}

// Sample films
const films: Film[] = [
  {
    id: "sorting-ballet",
    title: "The Sorting Ballet",
    description: "Watch algorithms dance as they organize data in mesmerizing patterns",
    type: "algorithm",
    duration: 120,
    thumbnail: "🎭",
    color: "from-purple-500 to-pink-500",
    tags: ["Sorting", "Visualization", "Art"],
    likes: 1234,
    code: `// Quick Sort Visualization
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
  },
  {
    id: "matrix-rain",
    title: "Digital Rain",
    description: "The iconic Matrix falling code effect with modern twists",
    type: "art",
    duration: 180,
    thumbnail: "🌧️",
    color: "from-green-500 to-emerald-700",
    tags: ["Matrix", "Canvas", "Retro"],
    likes: 2156,
    code: `// Matrix Rain Effect
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const chars = 'アイウエオカキクケコ0123456789';
const drops = [];
const fontSize = 14;

for (let i = 0; i < columns; i++) {
  drops[i] = Math.random() * -100;
}

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';
  
  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}`
  },
  {
    id: "particle-dreams",
    title: "Particle Dreams",
    description: "Thousands of particles forming beautiful emergent behaviors",
    type: "simulation",
    duration: 150,
    thumbnail: "✨",
    color: "from-blue-400 to-cyan-300",
    tags: ["Particles", "Physics", "Beautiful"],
    likes: 1876,
    code: `// Particle System
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.life = 1;
    this.color = hsl(\${Math.random() * 60 + 180}, 70%, 50%);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life -= 0.01;
    
    // Bounce off walls
    if (this.x < 0 || this.x > width) this.vx *= -0.8;
    if (this.y > height) this.vy *= -0.8;
  }
  
  draw() {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}`
  },
  {
    id: "mandelbrot-voyage",
    title: "Mandelbrot Voyage",
    description: "Infinite zoom into the most complex mathematical object",
    type: "fractal",
    duration: 300,
    thumbnail: "🔮",
    color: "from-indigo-500 to-purple-600",
    tags: ["Fractal", "Math", "Infinite"],
    likes: 3421,
    code: `// Mandelbrot Set
function mandelbrot(cx, cy, maxIter) {
  let x = 0, y = 0;
  let iter = 0;
  
  while (x * x + y * y <= 4 && iter < maxIter) {
    const xNew = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = xNew;
    iter++;
  }
  
  return iter;
}

// Render with smooth coloring
for (let px = 0; px < width; px++) {
  for (let py = 0; py < height; py++) {
    const cx = (px - width/2) * 4.0 / width + offsetX;
    const cy = (py - height/2) * 4.0 / height + offsetY;
    
    const iter = mandelbrot(cx, cy, 1000);
    const color = getColor(iter / 1000);
    
    setPixel(px, py, color);
  }
}`
  },
  {
    id: "neural-network",
    title: "Neural Dreams",
    description: "Visualizing how artificial neurons learn and connect",
    type: "simulation",
    duration: 200,
    thumbnail: "🧠",
    color: "from-orange-400 to-red-500",
    tags: ["AI", "Neural Network", "ML"],
    likes: 1567,
    code: `// Neural Network Visualization
class Neuron {
  constructor(x, y, layer) {
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.activation = 0;
    this.connections = [];
  }
  
  connect(other, weight) {
    this.connections.push({ neuron: other, weight });
  }
  
  activate(input) {
    this.activation = sigmoid(input);
    
    for (const conn of this.connections) {
      const output = this.activation * conn.weight;
      conn.neuron.activate(output);
    }
  }
  
  draw() {
    // Draw connections
    for (const conn of this.connections) {
      const alpha = Math.abs(conn.weight) * this.activation;
      drawLine(this, conn.neuron, alpha);
    }
    
    // Draw neuron
    const radius = 10 + this.activation * 15;
    const hue = 200 + this.activation * 60;
    fillCircle(this.x, this.y, radius, hue);
  }
}`
  },
  {
    id: "game-of-life",
    title: "Life Emerges",
    description: "Conway's Game of Life - complexity from simple rules",
    type: "simulation",
    duration: 240,
    thumbnail: "🦠",
    color: "from-cyan-400 to-blue-600",
    tags: ["Cellular Automata", "Emergence", "Classic"],
    likes: 2890,
    code: `// Conway's Game of Life
function nextGeneration(grid) {
  const newGrid = createGrid(rows, cols);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const neighbors = countNeighbors(grid, i, j);
      const isAlive = grid[i][j] === 1;
      
      // Rules:
      // 1. Underpopulation: < 2 neighbors = die
      // 2. Survival: 2-3 neighbors = live
      // 3. Overpopulation: > 3 neighbors = die
      // 4. Reproduction: exactly 3 neighbors = birth
      
      if (isAlive && (neighbors === 2 || neighbors === 3)) {
        newGrid[i][j] = 1; // survives
      } else if (!isAlive && neighbors === 3) {
        newGrid[i][j] = 1; // birth
      } else {
        newGrid[i][j] = 0; // dies
      }
    }
  }
  
  return newGrid;
}`
  }
];

// Particle for visualization
interface ParticleData {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

// Cinema Screen Component
function CinemaScreen({ film, isPlaying, progress }: { film: Film; isPlaying: boolean; progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const animationRef = useRef<number>();

  // Initialize particles based on film type
  useEffect(() => {
    const newParticles: ParticleData[] = [];
    const count = film.type === "fractal" ? 0 : film.type === "algorithm" ? 50 : 100;
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 800,
        y: Math.random() * 450,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: `hsl(${Math.random() * 60 + 180}, 70%, 50%)`,
        size: Math.random() * 3 + 1,
        life: 1
      });
    }
    setParticles(newParticles);
  }, [film]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (film.type === "fractal") {
        // Draw Mandelbrot-like pattern
        const zoom = 1 + progress * 0.01;
        const offsetX = -0.5 + Math.sin(progress * 0.01) * 0.1;
        const offsetY = Math.cos(progress * 0.01) * 0.1;
        
        for (let px = 0; px < canvas.width; px += 4) {
          for (let py = 0; py < canvas.height; py += 4) {
            const cx = (px - canvas.width/2) * 4.0 / canvas.width / zoom + offsetX;
            const cy = (py - canvas.height/2) * 4.0 / canvas.height / zoom + offsetY;
            
            let x = 0, y = 0, iter = 0;
            while (x * x + y * y <= 4 && iter < 100) {
              const xNew = x * x - y * y + cx;
              y = 2 * x * y + cy;
              x = xNew;
              iter++;
            }
            
            const hue = (iter / 100) * 360 + progress;
            ctx.fillStyle = iter === 100 ? "#000" : `hsl(${hue}, 70%, ${iter}%)`;
            ctx.fillRect(px, py, 4, 4);
          }
        }
      } else if (film.type === "algorithm") {
        // Draw sorting visualization
        const barCount = 50;
        const barWidth = canvas.width / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const height = Math.sin((i + progress * 0.1) * 0.2) * 200 + 225;
          const hue = (i / barCount) * 60 + 270;
          ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
          ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
        }
      } else {
        // Particle simulation
        setParticles(prev => prev.map(p => {
          const newX = p.x + p.vx;
          const newY = p.y + p.vy;
          
          return {
            ...p,
            x: newX < 0 ? canvas.width : newX > canvas.width ? 0 : newX,
            y: newY < 0 ? canvas.height : newY > canvas.height ? 0 : newY,
            vx: newX < 0 || newX > canvas.width ? -p.vx : p.vx,
            vy: newY < 0 || newY > canvas.height ? -p.vy : p.vy + 0.05
          };
        }));

        // Draw particles
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });

        // Draw connections
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(100, 200, 255, ${1 - dist / 100})`;
              ctx.stroke();
            }
          });
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [film, isPlaying, progress, particles]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        className="w-full h-full"
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Film grain effect */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Playing indicator */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-white">LIVE</span>
        </motion.div>
      )}

      {/* Film info overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent"
      >
        <h2 className="text-2xl font-bold text-white mb-1">{film.title}</h2>
        <p className="text-white/70 text-sm">{film.description}</p>
      </motion.div>
    </div>
  );
}

// Code Reveal Component
function CodeReveal({ code, isPlaying, progress }: { code: string; isPlaying: boolean; progress: number }) {
  const lines = code.split("\n");
  const visibleLines = Math.floor((progress / 100) * lines.length);

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 font-mono text-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-white/50 text-xs">code.js</span>
      </div>
      
      <div className="space-y-1 max-h-[200px] overflow-y-auto scrollbar-hide">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: i < visibleLines ? 1 : 0.3,
              x: 0
            }}
            transition={{ delay: i * 0.02 }}
            className={`flex ${i < visibleLines ? "text-green-400" : "text-white/30"}`}
          >
            <span className="text-white/30 w-8 text-right mr-4 select-none">{i + 1}</span>
            <span className="whitespace-pre">{line || " "}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function CodeCinemaPage() {
  const [selectedFilm, setSelectedFilm] = useState<Film>(films[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const progressInterval = useRef<NodeJS.Timeout>();

  // Progress simulation
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + 0.5;
        });
      }, 100);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = Math.floor((progress / 100) * selectedFilm.duration);

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
            <Film className="h-4 w-4" />
            <span className="text-sm font-medium">Immersive Code Experience</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Code <span className="text-gradient">Cinema</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch algorithms dance, fractals bloom, and simulations come alive. 
            An immersive theater for code visualization.
          </p>
        </motion.div>

        {/* Main Cinema Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Screen */}
          <div className="lg:col-span-2 space-y-4">
            <CinemaScreen film={selectedFilm} isPlaying={isPlaying} progress={progress} />
            
            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <Slider
                    value={[progress]}
                    onValueChange={([v]) => setProgress(v)}
                    max={100}
                    step={0.1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(selectedFilm.duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setProgress(Math.max(0, progress - 10))}
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      size="icon"
                      className="h-12 w-12"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setProgress(Math.min(100, progress + 10))}
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Volume */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={([v]) => setVolume(v)}
                        max={100}
                        step={1}
                        className="w-24"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCode(!showCode)}
                    >
                      <Code2 className={`h-5 w-5 ${showCode ? "text-primary" : ""}`} />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Quality: Auto</DropdownMenuItem>
                        <DropdownMenuItem>Speed: 1x</DropdownMenuItem>
                        <DropdownMenuItem>Loop: Off</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Reveal */}
            <AnimatePresence>
              {showCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <CodeReveal code={selectedFilm.code} isPlaying={isPlaying} progress={progress} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Film Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedFilm.color} flex items-center justify-center text-3xl`}>
                    {selectedFilm.thumbnail}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedFilm.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedFilm.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">{selectedFilm.description}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime(selectedFilm.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>{selectedFilm.likes.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Film List */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  More Films
                </h3>
                
                <div className="space-y-2">
                  {films.map((film, index) => (
                    <motion.button
                      key={film.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setSelectedFilm(film);
                        setProgress(0);
                        setIsPlaying(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                        selectedFilm.id === film.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${film.color} flex items-center justify-center text-xl shrink-0`}>
                        {film.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${selectedFilm.id === film.id ? "text-primary" : ""}`}>
                          {film.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatTime(film.duration)}</p>
                      </div>
                      {selectedFilm.id === film.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Play className="h-4 w-4 text-primary" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Your Cinema Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-background">
                    <Monitor className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Films Watched</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                    <p className="text-2xl font-bold">2.5h</p>
                    <p className="text-xs text-muted-foreground">Watch Time</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                    <p className="text-2xl font-bold">48</p>
                    <p className="text-xs text-muted-foreground">Likes Given</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <Star className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
