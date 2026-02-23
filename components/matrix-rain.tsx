"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Download,
  Keyboard,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MatrixConfig {
  fontSize: number;
  speed: number;
  density: number;
  color: string;
  trails: boolean;
  glow: boolean;
  fadeRate: number;
}

const defaultConfig: MatrixConfig = {
  fontSize: 14,
  speed: 50,
  density: 0.95,
  color: "#00ff00",
  trails: true,
  glow: true,
  fadeRate: 0.05,
};

const colorOptions = [
  { name: "Matrix Green", value: "#00ff00" },
  { name: "Cyberpunk", value: "#ff00ff" },
  { name: "Ocean", value: "#00ffff" },
  { name: "Fire", value: "#ff6600" },
  { name: "Gold", value: "#ffd700" },
  { name: "White", value: "#ffffff" },
];

// Katakana characters + some Latin
const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [config, setConfig] = useState<MatrixConfig>(defaultConfig);
  const [showControls, setShowControls] = useState(false);
  const animationRef = useRef<number>();
  const dropsRef = useRef<number[]>([]);
  const charsRef = useRef<string[]>([]);

  const initMatrix = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const columns = Math.floor(canvas.width / config.fontSize);
    dropsRef.current = new Array(columns).fill(1);
    charsRef.current = new Array(columns).fill("").map(() => 
      chars[Math.floor(Math.random() * chars.length)]
    );
  }, [config.fontSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
      initMatrix();
    };

    resize();
    window.addEventListener("resize", resize);
    initMatrix();

    let lastTime = 0;
    const draw = (currentTime: number) => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const deltaTime = currentTime - lastTime;
      if (deltaTime < config.speed) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTime = currentTime;

      // Fade effect
      ctx.fillStyle = config.trails 
        ? `rgba(0, 0, 0, ${config.fadeRate})`
        : "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      ctx.font = `${config.fontSize}px monospace`;

      const drops = dropsRef.current;
      const charArray = charsRef.current;

      for (let i = 0; i < drops.length; i++) {
        // Randomly change character
        if (Math.random() > config.density) {
          charArray[i] = chars[Math.floor(Math.random() * chars.length)];
        }

        const text = charArray[i];
        const x = i * config.fontSize;
        const y = drops[i] * config.fontSize;

        // Glow effect
        if (config.glow) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = config.color;
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw character with gradient
        const gradient = ctx.createLinearGradient(x, y - config.fontSize, x, y);
        gradient.addColorStop(0, config.color);
        gradient.addColorStop(1, "#ffffff");
        
        ctx.fillStyle = gradient;
        ctx.fillText(text, x, y);

        // Reset drop to top randomly after it reaches bottom
        if (y > canvas.offsetHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, isPlaying, initMatrix]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = "matrix-rain.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-500/10">
              <Terminal className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-base">Matrix Rain</CardTitle>
              <p className="text-xs text-muted-foreground">Interactive code rain effect</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={initMatrix}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Sheet open={showControls} onOpenChange={setShowControls}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Matrix Settings</SheetTitle>
                  <SheetDescription>
                    Customize the matrix rain effect
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Color Selection */}
                  <div className="space-y-3">
                    <Label>Color Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setConfig({ ...config, color: color.value })}
                          className={`p-2 rounded-lg border-2 transition-all ${
                            config.color === color.value
                              ? "border-primary"
                              : "border-transparent hover:border-muted"
                          }`}
                        >
                          <div
                            className="w-full h-6 rounded"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-xs mt-1 block">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speed Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Speed</Label>
                      <span className="text-sm text-muted-foreground">{config.speed}ms</span>
                    </div>
                    <Slider
                      value={[config.speed]}
                      onValueChange={([value]) => setConfig({ ...config, speed: value })}
                      min={10}
                      max={200}
                      step={10}
                    />
                  </div>

                  {/* Font Size Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Font Size</Label>
                      <span className="text-sm text-muted-foreground">{config.fontSize}px</span>
                    </div>
                    <Slider
                      value={[config.fontSize]}
                      onValueChange={([value]) => setConfig({ ...config, fontSize: value })}
                      min={8}
                      max={24}
                      step={2}
                    />
                  </div>

                  {/* Fade Rate Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Trail Length</Label>
                      <span className="text-sm text-muted-foreground">{Math.round(config.fadeRate * 100)}%</span>
                    </div>
                    <Slider
                      value={[config.fadeRate * 100]}
                      onValueChange={([value]) => setConfig({ ...config, fadeRate: value / 100 })}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="trails">Enable Trails</Label>
                      <Switch
                        id="trails"
                        checked={config.trails}
                        onCheckedChange={(checked) => setConfig({ ...config, trails: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="glow">Glow Effect</Label>
                      <Switch
                        id="glow"
                        checked={config.glow}
                        onCheckedChange={(checked) => setConfig({ ...config, glow: checked })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleDownload} className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download Screenshot
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-64 bg-black rounded-b-lg"
            style={{ width: "100%", height: "256px" }}
          />
          
          {/* Keyboard hint */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-green-500/60 text-xs">
            <Keyboard className="h-3 w-3" />
            <span>Press any key for burst effect</span>
          </div>
          
          {/* Info */}
          <div className="absolute bottom-4 right-4 text-green-500/60 text-xs">
            <span>{chars.length} characters</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
