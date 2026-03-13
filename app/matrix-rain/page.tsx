"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Matrix,
  Play,
  Pause,
  Settings2,
  Download,
  Share2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

// Matrix Rain Effect
class MatrixRain {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  columns: number;
  drops: number[];
  fontSize: number;
  characters: string;
  isRunning: boolean;
  speed: number;
  color: string;
  trailLength: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.fontSize = 14;
    this.characters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.columns = 0;
    this.drops = [];
    this.isRunning = true;
    this.speed = 50;
    this.color = "#0F0";
    this.trailLength = 0.05;
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(this.columns).fill(1);
  }

  draw() {
    if (!this.isRunning) return;

    // Fade effect
    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.trailLength})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = this.color;
    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      
      // Randomize color slightly for some characters
      if (Math.random() > 0.95) {
        this.ctx.fillStyle = "#FFF";
      } else {
        this.ctx.fillStyle = this.color;
      }
      
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
  }

  setSpeed(speed: number) {
    this.speed = 101 - speed;
  }

  setColor(color: string) {
    this.color = color;
  }

  setTrailLength(length: number) {
    this.trailLength = length / 100;
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }
}

const colorOptions = [
  { name: "Matrix Green", value: "#0F0" },
  { name: "Cyberpunk", value: "#FF00FF" },
  { name: "Ocean", value: "#00FFFF" },
  { name: "Fire", value: "#FF4500" },
  { name: "Gold", value: "#FFD700" },
  { name: "White", value: "#FFFFFF" },
];

export default function MatrixRainPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixRef = useRef<MatrixRain | null>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [speed, setSpeed] = useState(50);
  const [trailLength, setTrailLength] = useState(5);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    if (canvasRef.current && !matrixRef.current) {
      matrixRef.current = new MatrixRain(canvasRef.current);
      
      const animate = () => {
        matrixRef.current?.draw();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();

      const handleResize = () => {
        matrixRef.current?.resize();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (matrixRef.current) {
      matrixRef.current.setSpeed(speed);
    }
  }, [speed]);

  useEffect(() => {
    if (matrixRef.current) {
      matrixRef.current.setColor(selectedColor);
    }
  }, [selectedColor]);

  useEffect(() => {
    if (matrixRef.current) {
      matrixRef.current.setTrailLength(trailLength);
    }
  }, [trailLength]);

  const togglePlay = () => {
    if (isPlaying) {
      matrixRef.current?.stop();
    } else {
      matrixRef.current?.start();
    }
    setIsPlaying(!isPlaying);
  };

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `matrix-rain-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const shareConfig = () => {
    const config = {
      speed,
      trailLength,
      color: selectedColor,
    };
    navigator.clipboard.writeText(JSON.stringify(config));
    // Show toast notification would go here
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ cursor: "none" }}
      />

      {/* Initial Message */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-4"
              style={{ 
                color: selectedColor,
                textShadow: `0 0 20px ${selectedColor}`,
              }}
              animate={{ 
                opacity: [1, 0.5, 1],
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              WAKE UP
            </motion.h1>
            <p className="text-green-400/60 text-xl">The Matrix has you...</p>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: showControls ? 0 : 100, opacity: showControls ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5" style={{ color: selectedColor }} />
                <h2 className="font-semibold">Matrix Rain Control</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadImage}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareConfig}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMessage(!showMessage)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {showMessage ? "Hide" : "Show"} Text
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Speed Control */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Speed: {speed}%
                </label>
                <Slider
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  min={1}
                  max={100}
                  step={1}
                />
              </div>

              {/* Trail Length */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Trail Length: {trailLength}%
                </label>
                <Slider
                  value={[trailLength]}
                  onValueChange={(value) => setTrailLength(value[0])}
                  min={1}
                  max={20}
                  step={1}
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Color Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color.value 
                          ? "border-white scale-110" 
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toggle Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute bottom-6 right-6 p-3 rounded-full glass hover:bg-white/10 transition-colors z-10"
      >
        <Settings2 className="w-5 h-5" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="absolute bottom-6 left-6 p-3 rounded-full glass hover:bg-white/10 transition-colors z-10"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>

      {/* Stats */}
      <div className="absolute top-6 left-6 text-xs font-mono opacity-50">
        <div>FPS: 60</div>
        <div>Columns: {Math.floor(typeof window !== 'undefined' ? window.innerWidth / 14 : 0)}</div>
        <div>Speed: {speed}ms</div>
      </div>
    </div>
  );
}
