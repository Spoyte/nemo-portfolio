"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { 
  Flower2, 
  Sparkles, 
  Wind, 
  Music, 
  Info,
  RefreshCw,
  Download,
  Share2,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Plant {
  id: number;
  x: number;
  y: number;
  type: "flower" | "fern" | "tree" | "vine";
  color: string;
  size: number;
  rotation: number;
  growth: number;
  swayOffset: number;
}

interface Butterfly {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

const colorPalettes = [
  { name: "Spring", colors: ["#ff6b9d", "#c44569", "#f8b500", "#4ecdc4", "#44a08d"] },
  { name: "Sunset", colors: ["#ff6b6b", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"] },
  { name: "Ocean", colors: ["#00d2d3", "#54a0ff", "#5f27cd", "#341f97", "#1dd1a1"] },
  { name: "Monochrome", colors: ["#2d3436", "#636e72", "#b2bec3", "#dfe6e9", "#0984e3"] },
  { name: "Neon", colors: ["#ff00ff", "#00ffff", "#ffff00", "#ff0066", "#6600ff"] },
];

export function SecretGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [windStrength, setWindStrength] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [bloomIntensity, setBloomIntensity] = useState(1);
  const plantIdRef = useRef(0);
  const butterflyIdRef = useRef(0);
  const timeRef = useRef(0);

  const palette = colorPalettes[selectedPalette];

  // Initialize garden
  useEffect(() => {
    const initialPlants: Plant[] = [];
    for (let i = 0; i < 15; i++) {
      initialPlants.push(createRandomPlant(i));
    }
    setPlants(initialPlants);
    plantIdRef.current = 15;

    const initialButterflies: Butterfly[] = [];
    for (let i = 0; i < 5; i++) {
      initialButterflies.push(createRandomButterfly(i));
    }
    setButterflies(initialButterflies);
    butterflyIdRef.current = 5;
  }, []);

  const createRandomPlant = (id: number): Plant => ({
    id,
    x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
    y: typeof window !== "undefined" ? window.innerHeight - 50 - Math.random() * 200 : 500,
    type: ["flower", "fern", "tree", "vine"][Math.floor(Math.random() * 4)] as Plant["type"],
    color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
    size: 30 + Math.random() * 50,
    rotation: (Math.random() - 0.5) * 0.5,
    growth: 0,
    swayOffset: Math.random() * Math.PI * 2,
  });

  const createRandomButterfly = (id: number): Butterfly => ({
    id,
    x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
    y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 600),
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
    size: 8 + Math.random() * 8,
  });

  // Handle mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  // Handle click to plant
  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newPlant: Plant = {
        id: plantIdRef.current++,
        x,
        y: Math.min(y, rect.height - 50),
        type: ["flower", "fern", "tree", "vine"][Math.floor(Math.random() * 4)] as Plant["type"],
        color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
        size: 30 + Math.random() * 50,
        rotation: (Math.random() - 0.5) * 0.5,
        growth: 0,
        swayOffset: Math.random() * Math.PI * 2,
      };
      
      setPlants(prev => [...prev.slice(-29), newPlant]);
    }
  }, [palette]);

  // Animation loop
  useAnimationFrame((time) => {
    if (!isPlaying) return;
    
    timeRef.current = time;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = "rgba(10, 15, 10, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0a0f0a");
    gradient.addColorStop(1, "#1a2a1a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars/fireflies
    ctx.fillStyle = "rgba(255, 255, 200, 0.8)";
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5 + time * 0.01) % canvas.width;
      const y = (i * 73.3 + Math.sin(time * 0.001 + i) * 50) % (canvas.height * 0.6);
      const size = 1 + Math.sin(time * 0.002 + i) * 0.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Update and draw plants
    plants.forEach((plant, index) => {
      // Growth animation
      const growth = Math.min(1, (time / 1000 - index * 0.1) * 0.5);
      
      // Wind sway
      const sway = Math.sin(time * 0.001 + plant.swayOffset) * windStrength * 10;
      
      // Mouse interaction - plants lean away from mouse
      const dx = plant.x - mousePos.x;
      const dy = plant.y - mousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mouseInfluence = dist < 100 ? (100 - dist) / 100 * 20 : 0;
      const mouseAngle = Math.atan2(dy, dx);
      
      drawPlant(ctx, plant, growth, sway + Math.cos(mouseAngle) * mouseInfluence);
    });

    // Update and draw butterflies
    setButterflies(prev => prev.map(butterfly => {
      // Update position
      let newX = butterfly.x + butterfly.vx;
      let newY = butterfly.y + butterfly.vy;
      
      // Add some randomness
      butterfly.vx += (Math.random() - 0.5) * 0.2;
      butterfly.vy += (Math.random() - 0.5) * 0.2;
      
      // Limit speed
      const speed = Math.sqrt(butterfly.vx * butterfly.vx + butterfly.vy * butterfly.vy);
      if (speed > 3) {
        butterfly.vx = (butterfly.vx / speed) * 3;
        butterfly.vy = (butterfly.vy / speed) * 3;
      }
      
      // Wrap around edges
      if (newX < 0) newX = canvas.width;
      if (newX > canvas.width) newX = 0;
      if (newY < 0) newY = canvas.height;
      if (newY > canvas.height) newY = 0;
      
      // Draw butterfly
      drawButterfly(ctx, { ...butterfly, x: newX, y: newY }, time);
      
      return { ...butterfly, x: newX, y: newY };
    }));

    // Draw mouse glow
    const mouseGradient = ctx.createRadialGradient(
      mousePos.x, mousePos.y, 0,
      mousePos.x, mousePos.y, 100
    );
    mouseGradient.addColorStop(0, `rgba(255, 255, 255, ${0.1 * bloomIntensity})`);
    mouseGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = mouseGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  const drawPlant = (ctx: CanvasRenderingContext2D, plant: Plant, growth: number, sway: number) => {
    const { x, y, type, color, size, rotation } = plant;
    const actualSize = size * growth;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation + sway * 0.01);
    
    switch (type) {
      case "flower":
        drawFlower(ctx, color, actualSize);
        break;
      case "fern":
        drawFern(ctx, color, actualSize);
        break;
      case "tree":
        drawTree(ctx, color, actualSize);
        break;
      case "vine":
        drawVine(ctx, color, actualSize);
        break;
    }
    
    ctx.restore();
  };

  const drawFlower = (ctx: CanvasRenderingContext2D, color: string, size: number) => {
    const petals = 8;
    ctx.fillStyle = color;
    
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.4, size * 0.15, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    // Center
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Stem
    ctx.strokeStyle = "#2d5a27";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.2, size * 0.5, 0, size);
    ctx.stroke();
  };

  const drawFern = (ctx: CanvasRenderingContext2D, color: string, size: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const drawBranch = (x: number, y: number, angle: number, length: number, depth: number) => {
      if (depth === 0) return;
      
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      drawBranch(endX, endY, angle - 0.3, length * 0.7, depth - 1);
      drawBranch(endX, endY, angle + 0.3, length * 0.7, depth - 1);
    };
    
    drawBranch(0, size, -Math.PI / 2, size * 0.3, 5);
  };

  const drawTree = (ctx: CanvasRenderingContext2D, color: string, size: number) => {
    // Trunk
    ctx.strokeStyle = "#4a3728";
    ctx.lineWidth = size * 0.1;
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(0, size * 0.3);
    ctx.stroke();
    
    // Leaves
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.3;
      const y = Math.sin(angle) * size * 0.2 - size * 0.1;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawVine = (ctx: CanvasRenderingContext2D, color: string, size: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = Math.sin(t * Math.PI * 3) * size * 0.3;
      const y = -t * size;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Leaves along vine
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      const t = i / 5;
      const x = Math.sin(t * Math.PI * 3) * size * 0.3;
      const y = -t * size;
      ctx.beginPath();
      ctx.ellipse(x + size * 0.1, y, size * 0.08, size * 0.05, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawButterfly = (ctx: CanvasRenderingContext2D, butterfly: Butterfly, time: number) => {
    const { x, y, color, size } = butterfly;
    const wingFlap = Math.sin(time * 0.01) * 0.5 + 0.5;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.atan2(butterfly.vy, butterfly.vx) + Math.PI / 2);
    
    // Wings
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8;
    
    // Left wing
    ctx.beginPath();
    ctx.ellipse(-size * 0.3 * wingFlap, -size * 0.2, size * 0.4 * wingFlap, size * 0.3, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Right wing
    ctx.beginPath();
    ctx.ellipse(size * 0.3 * wingFlap, -size * 0.2, size * 0.4 * wingFlap, size * 0.3, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    ctx.fillStyle = "#333";
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.1, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const handleResize = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const downloadGarden = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `secret-garden-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const shareGarden = async () => {
    const canvas = canvasRef.current;
    if (canvas && navigator.share) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "secret-garden.png", { type: "image/png" });
          try {
            await navigator.share({
              title: "My Secret Garden",
              text: "Check out my generative garden!",
              files: [file],
            });
          } catch (err) {
            console.log("Share cancelled");
          }
        }
      });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0f0a]">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="absolute inset-0 cursor-crosshair"
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Flower2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Secret Garden</h1>
              <p className="text-xs text-white/60">Click anywhere to plant • Move mouse to interact</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(!showInfo)}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Info className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={downloadGarden}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={shareGarden}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto"
        >
          <div className="glass-strong rounded-2xl p-4 space-y-4 w-64">
            {/* Palette Selector */}
            <div>
              <label className="text-xs font-medium text-white/80 flex items-center gap-2 mb-2">
                <Palette className="w-3 h-3" />
                Color Palette
              </label>
              <div className="flex flex-wrap gap-1">
                {colorPalettes.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPalette(i)}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      selectedPalette === i 
                        ? "ring-2 ring-white scale-110" 
                        : "hover:scale-105"
                    }`}
                    style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }}
                    title={p.name}
                  />
                ))}
              </div>
            </div>

            {/* Wind Control */}
            <div>
              <label className="text-xs font-medium text-white/80 flex items-center gap-2 mb-2">
                <Wind className="w-3 h-3" />
                Wind Strength
              </label>
              <Slider
                value={[windStrength * 100]}
                onValueChange={([v]) => setWindStrength(v / 100)}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Bloom Control */}
            <div>
              <label className="text-xs font-medium text-white/80 flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3" />
                Bloom Intensity
              </label>
              <Slider
                value={[bloomIntensity * 100]}
                onValueChange={([v]) => setBloomIntensity(v / 100)}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPlants([]);
                  plantIdRef.current = 0;
                }}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                <Music className="w-4 h-4 mr-1" />
                {isPlaying ? "Pause" : "Play"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Info Panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/50 backdrop-blur-sm"
              onClick={() => setShowInfo(false)}
            >
              <div 
                className="glass-strong rounded-3xl p-8 max-w-md mx-4"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to the Secret Garden</h2>
                <p className="text-white/80 mb-4">
                  This is a generative art experience where you can create your own digital garden. 
                  Each plant grows organically and responds to wind and your mouse movements.
                </p>
                <ul className="space-y-2 text-sm text-white/60 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Click anywhere to plant new flora
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Move your mouse to influence the plants
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Butterflies roam freely and pollinate
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    Save your creation as an image
                  </li>
                </ul>
                <Button 
                  onClick={() => setShowInfo(false)}
                  className="w-full"
                >
                  Start Gardening
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-6 left-6 pointer-events-auto"
        >
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Flower2 className="w-4 h-4 text-green-400" />
              {plants.length} plants
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              {butterflies.length} butterflies
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
