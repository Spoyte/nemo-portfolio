"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
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
  Code2,
  Sparkles,
  Clock,
  Eye,
  Heart,
  Share2,
  ChevronRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Cinematic code scenes
const codeScenes = [
  {
    id: "matrix-rain",
    title: "The Matrix Awakens",
    description: "Classic Matrix-style digital rain with a modern twist",
    duration: 30,
    language: "JavaScript",
    likes: 1234,
    views: "45.2K",
    code: `// The Matrix Digital Rain
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

// Initialize drops
for (let i = 0; i < columns; i++) {
  drops[i] = Math.random() * -100;
}

function draw() {
  // Fade effect
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
}

setInterval(draw, 35);`,
    highlights: ["Canvas API", "Particle Systems", "Generative Art"]
  },
  {
    id: "fractal-zoom",
    title: "Infinite Fractals",
    description: "Mesmerizing Mandelbrot set exploration",
    duration: 45,
    language: "TypeScript",
    likes: 892,
    views: "32.1K",
    code: `// Mandelbrot Set Explorer
interface Complex {
  real: number;
  imag: number;
}

function mandelbrot(c: Complex, maxIter: number): number {
  let z: Complex = { real: 0, imag: 0 };
  
  for (let n = 0; n < maxIter; n++) {
    const real = z.real * z.real - z.imag * z.imag + c.real;
    const imag = 2 * z.real * z.imag + c.imag;
    
    if (real * real + imag * imag > 4) {
      return n;
    }
    
    z = { real, imag };
  }
  
  return maxIter;
}

// Smooth coloring algorithm
function getColor(iterations: number, maxIter: number): string {
  if (iterations === maxIter) return '#000';
  
  const hue = (iterations / maxIter) * 360;
  const saturation = 100;
  const lightness = iterations < maxIter ? 50 : 0;
  
  return \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;
}

// Render with progressive detail
async function renderFractal(
  ctx: CanvasRenderingContext2D,
  bounds: { x: number; y: number; w: number; h: number }
) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const x = bounds.x + (px / width) * bounds.w;
      const y = bounds.y + (py / height) * bounds.h;
      
      const iterations = mandelbrot({ real: x, imag: y }, 1000);
      const color = getColor(iterations, 1000);
      
      // Set pixel data...
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}`,
    highlights: ["Complex Numbers", "WebGL", "Mathematical Art"]
  },
  {
    id: "sorting-visualizer",
    title: "Algorithm Symphony",
    description: "Sorting algorithms visualized as a musical performance",
    duration: 60,
    language: "Python",
    likes: 2156,
    views: "89.5K",
    code: `# Algorithm Symphony - Sorting Visualizer
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import sounddevice as sd

class SortingVisualizer:
    def __init__(self, size=100):
        self.data = np.random.randint(1, 100, size)
        self.fig, self.ax = plt.subplots(figsize=(12, 6))
        self.bars = self.ax.bar(range(size), self.data, color='#3498db')
        self.comparisons = 0
        self.swaps = 0
        
    def play_tone(self, frequency, duration=0.05):
        """Play a tone based on array value"""
        sample_rate = 44100
        t = np.linspace(0, duration, int(sample_rate * duration))
        wave = np.sin(2 * np.pi * frequency * t) * 0.1
        sd.play(wave, sample_rate)
        
    def quicksort(self, arr, low, high):
        """Quick sort with visualization"""
        if low < high:
            pi = self.partition(arr, low, high)
            self.quicksort(arr, low, pi - 1)
            self.quicksort(arr, pi + 1, high)
            
    def partition(self, arr, low, high):
        """Partition for quicksort"""
        pivot = arr[high]
        i = low - 1
        
        for j in range(low, high):
            self.comparisons += 1
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                self.swaps += 1
                self.play_tone(arr[i] * 10)
                self.update_bars([i, j])
                
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1
        
    def update_bars(self, highlight_indices):
        """Update bar colors and heights"""
        for i, bar in enumerate(self.bars):
            if i in highlight_indices:
                bar.set_color('#e74c3c')  # Red for active
            elif self.data[i] == i + 1:
                bar.set_color('#2ecc71')  # Green for sorted
            else:
                bar.set_color('#3498db')  # Blue for unsorted
            bar.set_height(self.data[i])
        self.fig.canvas.draw_idle()`,
    highlights: ["Audio Synthesis", "Data Visualization", "Algorithms"]
  },
  {
    id: "neural-network",
    title: "Neural Dreams",
    description: "Visualizing how neural networks learn",
    duration: 90,
    language: "Python",
    likes: 3421,
    views: "156K",
    code: `# Neural Network Visualization
import torch
import torch.nn as nn
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyBboxPatch
import networkx as nx

class NeuralNetworkViz(nn.Module):
    def __init__(self, layer_sizes):
        super().__init__()
        self.layers = nn.ModuleList([
            nn.Linear(layer_sizes[i], layer_sizes[i+1])
            for i in range(len(layer_sizes)-1)
        ])
        self.activations = []
        self.weights_history = []
        
    def forward(self, x):
        self.activations = [x.detach().numpy()]
        for layer in self.layers:
            x = torch.relu(layer(x))
            self.activations.append(x.detach().numpy())
        return x
        
    def visualize(self, figsize=(16, 10)):
        """Create animated network visualization"""
        fig, axes = plt.subplots(2, 2, figsize=figsize)
        
        # Network topology
        ax_network = axes[0, 0]
        self._draw_network_topology(ax_network)
        
        # Activation heatmap
        ax_activations = axes[0, 1]
        self._draw_activations(ax_activations)
        
        # Weight distribution
        ax_weights = axes[1, 0]
        self._draw_weight_distribution(ax_weights)
        
        # Learning curve
        ax_learning = axes[1, 1]
        self._draw_learning_curve(ax_learning)
        
        plt.tight_layout()
        return fig
        
    def _draw_network_topology(self, ax):
        """Draw the neural network structure"""
        layer_sizes = [a.shape[1] if len(a.shape) > 1 else a.shape[0] 
                      for a in self.activations]
        
        positions = {}
        colors = plt.cm.viridis(np.linspace(0, 1, sum(layer_sizes)))
        color_idx = 0
        
        for layer_idx, size in enumerate(layer_sizes):
            x = layer_idx * 3
            for neuron_idx in range(min(size, 8)):  # Max 8 neurons per layer
                y = neuron_idx - size / 2
                positions[(layer_idx, neuron_idx)] = (x, y)
                
                # Draw neuron
                circle = Circle((x, y), 0.3, 
                              color=colors[color_idx], 
                              ec='black', linewidth=2)
                ax.add_patch(circle)
                color_idx += 1
                
        ax.set_xlim(-1, len(layer_sizes) * 3)
        ax.set_ylim(-5, 5)
        ax.set_aspect('equal')
        ax.axis('off')`,
    highlights: ["Machine Learning", "Data Visualization", "PyTorch"]
  }
];

// Typewriter effect component
function TypewriterCode({ code, isPlaying, speed = 30 }: { code: string; isPlaying: boolean; speed?: number }) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(prev => prev + code[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Auto-scroll
        if (codeRef.current) {
          codeRef.current.scrollTop = codeRef.current.scrollHeight;
        }
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, code, isPlaying, speed]);

  useEffect(() => {
    if (!isPlaying) {
      setDisplayedCode(code);
      setCurrentIndex(code.length);
    } else {
      setDisplayedCode("");
      setCurrentIndex(0);
    }
  }, [code, isPlaying]);

  return (
    <pre 
      ref={codeRef}
      className="font-mono text-sm leading-relaxed overflow-auto h-[400px] p-6 bg-black/50 rounded-lg"
    >
      <code className="text-green-400">
        {displayedCode}
        {isPlaying && currentIndex < code.length && (
          <span className="animate-pulse">▊</span>
        )}
      </code>
    </pre>
  );
}

// Syntax highlighting simulation
function SyntaxHighlight({ code }: { code: string }) {
  const highlighted = code
    .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
    .replace(/\b(function|const|let|var|return|if|else|for|while|class|import|from|async|await|def|class)\b/g, '<span class="text-purple-400">$1</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-400">$1</span>')
    .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="text-green-300">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="text-blue-400">$1</span>')
    .replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="text-yellow-400">$1</span>');

  return (
    <div 
      className="font-mono text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

// Cinema screen component
function CinemaScreen({ scene, isPlaying, progress }: { scene: typeof codeScenes[0]; isPlaying: boolean; progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    let frame = 0;

    const animate = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      if (scene.id === 'matrix-rain') {
        // Matrix rain effect
        const chars = 'アイウエオカキクケコ0123456789';
        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < columns; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const y = (frame * 2 + i * 37) % height;
          ctx.fillText(char, i * fontSize, y);
        }
      } else if (scene.id === 'fractal-zoom') {
        // Simplified fractal visualization
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        const zoom = 1 + progress * 3;
        const offsetX = -0.5;
        const offsetY = 0;
        
        for (let py = 0; py < height; py += 2) {
          for (let px = 0; px < width; px += 2) {
            const x = offsetX + (px - width / 2) * 4.0 / (zoom * width);
            const y = offsetY + (py - height / 2) * 4.0 / (zoom * height);
            
            let zx = 0, zy = 0;
            let iter = 0;
            
            while (zx * zx + zy * zy < 4 && iter < 100) {
              const tmp = zx * zx - zy * zy + x;
              zy = 2 * zx * zy + y;
              zx = tmp;
              iter++;
            }
            
            const idx = (py * width + px) * 4;
            const hue = (iter / 100) * 360;
            const rgb = hslToRgb(hue / 360, 1, iter < 100 ? 0.5 : 0);
            
            data[idx] = rgb[0];
            data[idx + 1] = rgb[1];
            data[idx + 2] = rgb[2];
            data[idx + 3] = 255;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
      } else if (scene.id === 'sorting-visualizer') {
        // Sorting visualization
        const barCount = 50;
        const barWidth = width / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const sortedness = Math.min(1, progress * 2 + Math.sin(i * 0.2 + frame * 0.05) * 0.2);
          const height = (i / barCount) * (height * 0.8) * sortedness + 10;
          
          const hue = sortedness > 0.9 ? 120 : 200 + i * 2;
          ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
          ctx.fillRect(i * barWidth, height - 10, barWidth - 2, height);
        }
      } else if (scene.id === 'neural-network') {
        // Neural network visualization
        const layers = [4, 6, 6, 3];
        const layerX = layers.map((_, i) => (width / (layers.length + 1)) * (i + 1));
        
        // Draw connections
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
        ctx.lineWidth = 1;
        
        for (let l = 0; l < layers.length - 1; l++) {
          for (let i = 0; i < layers[l]; i++) {
            for (let j = 0; j < layers[l + 1]; j++) {
              const y1 = (height / (layers[l] + 1)) * (i + 1);
              const y2 = (height / (layers[l + 1] + 1)) * (j + 1);
              const activation = Math.sin(frame * 0.05 + l + i + j) * 0.5 + 0.5;
              ctx.strokeStyle = `rgba(100, 200, 255, ${activation * 0.5})`;
              ctx.beginPath();
              ctx.moveTo(layerX[l], y1);
              ctx.lineTo(layerX[l + 1], y2);
              ctx.stroke();
            }
          }
        }
        
        // Draw neurons
        for (let l = 0; l < layers.length; l++) {
          for (let i = 0; i < layers[l]; i++) {
            const x = layerX[l];
            const y = (height / (layers[l] + 1)) * (i + 1);
            const activation = Math.sin(frame * 0.1 + l * 2 + i) * 0.5 + 0.5;
            
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${200 + activation * 60}, 70%, ${30 + activation * 40}%)`;
            ctx.fill();
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }

      frame++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scene, isPlaying, progress]);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-gray-800">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* Film grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }}
      />
      
      {/* Scene info overlay */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Play className="w-16 h-16 text-white mx-auto mb-4" />
              </motion.div>
              <p className="text-white/80 text-lg">Click play to start</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function for HSL to RGB conversion
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export default function CodeCinemaPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const scene = codeScenes[currentScene];

  // Progress timer
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (0.5 * playbackSpeed);
        if (newProgress >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleSceneChange = (index: number) => {
    setCurrentScene(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Code Cinema
              </h1>
              <p className="text-gray-400">Where code comes alive</p>
            </div>
          </div>
        </motion.div>

        {/* Main Cinema Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <CinemaScreen 
              scene={scene} 
              isPlaying={isPlaying}
              progress={progress / 100}
            />

            {/* Controls */}
            <div className="bg-gray-900/80 backdrop-blur rounded-xl p-4 border border-gray-800">
              {/* Progress bar */}
              <div className="mb-4">
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  onValueChange={([v]) => setProgress(v)}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(Math.floor(progress * scene.duration / 100))}</span>
                  <span>{formatTime(scene.duration)}</span>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSceneChange((currentScene - 1 + codeScenes.length) % codeScenes.length)}
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    size="icon"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSceneChange((currentScene + 1) % codeScenes.length)}
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={100}
                      step={1}
                      onValueChange={([v]) => setVolume(v)}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gray-800">
                    {playbackSpeed}x
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCode(!showCode)}
                  >
                    <Code2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Scene Info */}
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 rounded-xl p-6 border border-gray-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{scene.title}</h2>
                  <p className="text-gray-400">{scene.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {scene.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {scene.likes}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {scene.highlights.map(highlight => (
                  <Badge key={highlight} variant="secondary" className="bg-purple-900/30 text-purple-300">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {highlight}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Watch Later
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Code Preview */}
            <AnimatePresence>
              {showCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      Source Code
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {scene.language}
                    </Badge>
                  </div>
                  <TypewriterCode 
                    code={scene.code} 
                    isPlaying={isPlaying}
                    speed={20 / playbackSpeed}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Playlist */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Film className="w-4 h-4" />
                Playlist ({codeScenes.length} scenes)
              </h3>
              <div className="space-y-2">
                {codeScenes.map((s, index) => (
                  <button
                    key={s.id}
                    onClick={() => handleSceneChange(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      currentScene === index 
                        ? 'bg-purple-600/20 border border-purple-600/50' 
                        : 'hover:bg-gray-800 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-mono ${
                        currentScene === index ? 'text-purple-400' : 'text-gray-500'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${
                          currentScene === index ? 'text-purple-300' : ''
                        }`}>
                          {s.title}
                        </p>
                        <p className="text-xs text-gray-500">{formatTime(s.duration)}</p>
                      </div>
                      {currentScene === index && isPlaying && (
                        <div className="flex gap-0.5">
                          <motion.div 
                            animate={{ scaleY: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="w-1 h-4 bg-purple-400 rounded-full"
                          />
                          <motion.div 
                            animate={{ scaleY: [1, 0.5, 1] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                            className="w-1 h-4 bg-purple-400 rounded-full"
                          />
                          <motion.div 
                            animate={{ scaleY: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                            className="w-1 h-4 bg-purple-400 rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-800/30 p-4">
              <h3 className="font-semibold mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Scenes Watched</span>
                  <span className="font-medium">{currentScene + 1}/{codeScenes.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Time</span>
                  <span className="font-medium">
                    {formatTime(codeScenes.slice(0, currentScene).reduce((acc, s) => acc + s.duration, 0) + 
                      Math.floor(progress * scene.duration / 100))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Achievements</span>
                  <span className="font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    3/12
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
