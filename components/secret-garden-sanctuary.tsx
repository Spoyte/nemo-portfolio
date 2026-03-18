"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { 
  Flower2, 
  Sparkles, 
  Wind, 
  Music, 
  Info,
  RefreshCw,
  Download,
  Share2,
  Palette,
  Sun,
  Moon,
  Cloud,
  Butterfly,
  Droplets
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface Plant {
  id: number;
  x: number;
  y: number;
  type: "flower" | "fern" | "tree" | "vine" | "mushroom" | "lotus";
  color: string;
  size: number;
  rotation: number;
  growth: number;
  swayOffset: number;
  layer: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: "pollen" | "firefly" | "petal" | "sparkle";
}

interface ButterflyEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  wingPhase: number;
  targetX: number;
  targetY: number;
}

const colorPalettes = [
  { name: "Spring Garden", colors: ["#ff6b9d", "#c44569", "#f8b500", "#4ecdc4", "#44a08d", "#96ceb4"], bg: "from-pink-100/20 to-green-100/20" },
  { name: "Midnight Bloom", colors: ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#00f2fe", "#fa709a"], bg: "from-purple-950/50 to-blue-950/50" },
  { name: "Sunset Meadow", colors: ["#ff6b6b", "#feca57", "#ff9ff3", "#ff6348", "#ff9f43", "#f368e0"], bg: "from-orange-500/20 to-pink-500/20" },
  { name: "Ocean Mist", colors: ["#00d2d3", "#54a0ff", "#5f27cd", "#341f97", "#1dd1a1", "#48dbfb"], bg: "from-cyan-500/20 to-blue-500/20" },
  { name: "Enchanted Forest", colors: ["#2ecc71", "#27ae60", "#16a085", "#1abc9c", "#3498db", "#9b59b6"], bg: "from-green-900/50 to-emerald-900/50" },
  { name: "Golden Hour", colors: ["#f39c12", "#e74c3c", "#e67e22", "#d35400", "#c0392b", "#f1c40f"], bg: "from-amber-500/20 to-orange-500/20" },
];

const plantTypes = ["flower", "fern", "tree", "vine", "mushroom", "lotus"] as const;

export function SecretGardenSanctuary() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [butterflies, setButterflies] = useState<ButterflyEntity[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [windStrength, setWindStrength] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [bloomIntensity, setBloomIntensity] = useState(1);
  const [timeOfDay, setTimeOfDay] = useState<"day" | "sunset" | "night">("day");
  const [autoGrow, setAutoGrow] = useState(false);
  const [discoveredSecrets, setDiscoveredSecrets] = useState<Set<string>>(new Set());
  const [showSecretMessage, setShowSecretMessage] = useState<string | null>(null);
  
  const plantIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const butterflyIdRef = useRef(0);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();

  const palette = colorPalettes[selectedPalette];

  // Initialize garden
  useEffect(() => {
    const initialPlants: Plant[] = [];
    // Background layer
    for (let i = 0; i < 8; i++) {
      initialPlants.push(createRandomPlant(i, 0));
    }
    // Middle layer
    for (let i = 0; i < 12; i++) {
      initialPlants.push(createRandomPlant(i + 8, 1));
    }
    // Foreground layer
    for (let i = 0; i < 6; i++) {
      initialPlants.push(createRandomPlant(i + 20, 2));
    }
    setPlants(initialPlants);
    plantIdRef.current = 26;

    const initialButterflies: ButterflyEntity[] = [];
    for (let i = 0; i < 5; i++) {
      initialButterflies.push(createRandomButterfly(i));
    }
    setButterflies(initialButterflies);
    butterflyIdRef.current = 5;
  }, []);

  const createRandomPlant = (id: number, layer: number): Plant => {
    const canvas = canvasRef.current;
    const width = canvas?.width || 1200;
    const height = canvas?.height || 800;
    
    return {
      id,
      x: Math.random() * width,
      y: height - 50 - Math.random() * (150 + layer * 100),
      type: plantTypes[Math.floor(Math.random() * plantTypes.length)],
      color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
      size: 20 + Math.random() * 40 + layer * 15,
      rotation: (Math.random() - 0.5) * 0.5,
      growth: 0,
      swayOffset: Math.random() * Math.PI * 2,
      layer,
    };
  };

  const createRandomButterfly = (id: number): ButterflyEntity => {
    const canvas = canvasRef.current;
    const width = canvas?.width || 1200;
    const height = canvas?.height || 800;
    
    return {
      id,
      x: Math.random() * width,
      y: Math.random() * height * 0.6,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
      size: 8 + Math.random() * 8,
      wingPhase: Math.random() * Math.PI * 2,
      targetX: Math.random() * width,
      targetY: Math.random() * height * 0.6,
    };
  };

  const createParticle = (x: number, y: number, type: Particle["type"]): Particle => ({
    id: particleIdRef.current++,
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: type === "pollen" ? -Math.random() * 2 - 0.5 : (Math.random() - 0.5) * 2,
    life: 1,
    maxLife: 100 + Math.random() * 100,
    color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
    size: Math.random() * 3 + 1,
    type,
  });

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      timeRef.current += 0.016;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas with fade effect
      ctx.fillStyle = timeOfDay === "night" 
        ? "rgba(15, 23, 42, 0.1)" 
        : timeOfDay === "sunset"
          ? "rgba(88, 28, 28, 0.1)"
          : "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw plants
      setPlants(prevPlants => {
        return prevPlants.map(plant => {
          const growth = Math.min(plant.growth + 0.01, 1);
          const sway = Math.sin(timeRef.current * 2 + plant.swayOffset) * windStrength * 10 * (3 - plant.layer);
          
          drawPlant(ctx, plant, growth, sway);
          
          return { ...plant, growth };
        });
      });

      // Update and draw butterflies
      setButterflies(prevButterflies => {
        return prevButterflies.map(butterfly => {
          // Move towards target
          const dx = butterfly.targetX - butterfly.x;
          const dy = butterfly.targetY - butterfly.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 50) {
            butterfly.targetX = Math.random() * canvas.width;
            butterfly.targetY = Math.random() * canvas.height * 0.6;
          }
          
          butterfly.vx += (dx / dist) * 0.05;
          butterfly.vy += (dy / dist) * 0.05;
          butterfly.vx *= 0.98;
          butterfly.vy *= 0.98;
          butterfly.x += butterfly.vx;
          butterfly.y += butterfly.vy;
          butterfly.wingPhase += 0.3;
          
          drawButterfly(ctx, butterfly);
          
          return butterfly;
        });
      });

      // Update and draw particles
      setParticles(prevParticles => {
        const updated = prevParticles
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1 / p.maxLife,
          }))
          .filter(p => p.life > 0);
        
        updated.forEach(p => drawParticle(ctx, p));
        
        // Randomly spawn new particles
        if (Math.random() < 0.1 * bloomIntensity) {
          updated.push(createParticle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            ["pollen", "firefly", "petal", "sparkle"][Math.floor(Math.random() * 4)] as Particle["type"]
          ));
        }
        
        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, windStrength, bloomIntensity, timeOfDay, palette]);

  const drawPlant = (ctx: CanvasRenderingContext2D, plant: Plant, growth: number, sway: number) => {
    const size = plant.size * growth * bloomIntensity;
    ctx.save();
    ctx.translate(plant.x + sway, plant.y);
    ctx.rotate(plant.rotation + sway * 0.01);
    
    switch (plant.type) {
      case "flower":
        drawFlower(ctx, size, plant.color);
        break;
      case "fern":
        drawFern(ctx, size, plant.color);
        break;
      case "tree":
        drawTree(ctx, size, plant.color);
        break;
      case "vine":
        drawVine(ctx, size, plant.color);
        break;
      case "mushroom":
        drawMushroom(ctx, size, plant.color);
        break;
      case "lotus":
        drawLotus(ctx, size, plant.color);
        break;
    }
    
    ctx.restore();
  };

  const drawFlower = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
    const petals = 8;
    ctx.fillStyle = color;
    
    for (let i = 0; i < petals; i++) {
      ctx.save();
      ctx.rotate((i / petals) * Math.PI * 2);
      ctx.beginPath();
      ctx.ellipse(0, -size / 2, size / 4, size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    // Center
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(0, 0, size / 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Stem
    ctx.strokeStyle = "#228B22";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size / 4, size, 0, size * 2);
    ctx.stroke();
  };

  const drawFern = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i - 2) * 0.3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      
      for (let j = 0; j < 10; j++) {
        const y = (j / 10) * size * 2;
        const x = Math.sin(j * 0.5) * (size / 3) * (1 - j / 10);
        ctx.lineTo(x, -y);
      }
      
      ctx.stroke();
      ctx.restore();
    }
  };

  const drawTree = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
    // Trunk
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = size / 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, size);
    ctx.stroke();
    
    // Foliage
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(
        (Math.random() - 0.5) * size,
        -Math.random() * size,
        size / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  };

  const drawVine = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    
    for (let i = 0; i < 20; i++) {
      const y = (i / 20) * size * 2;
      const x = Math.sin(i * 0.3) * (size / 2);
      ctx.lineTo(x, -y);
      
      // Leaves
      if (i % 3 === 0) {
        ctx.save();
        ctx.translate(x, -y);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(size / 4, 0, size / 6, size / 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    ctx.stroke();
  };

  const drawMushroom = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
    // Stem
    ctx.fillStyle = "#F5F5DC";
    ctx.fillRect(-size / 6, 0, size / 3, size);
    
    // Cap
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, Math.PI, 0);
    ctx.fill();
    
    // Spots
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(
        (Math.random() - 0.5) * size / 2,
        -Math.random() * size / 3,
        size / 10,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  };

  const drawLotus = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
    const petals = 12;
    
    for (let layer = 0; layer < 3; layer++) {
      ctx.fillStyle = layer === 0 ? color : 
                      layer === 1 ? adjustColor(color, 20) : 
                      adjustColor(color, 40);
      
      const layerPetals = petals - layer * 3;
      const layerSize = size * (1 - layer * 0.2);
      
      for (let i = 0; i < layerPetals; i++) {
        ctx.save();
        ctx.rotate((i / layerPetals) * Math.PI * 2 + layer * 0.2);
        ctx.beginPath();
        ctx.ellipse(0, -layerSize / 2, layerSize / 5, layerSize / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    // Center
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(0, 0, size / 6, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawButterfly = (ctx: CanvasRenderingContext2D, butterfly: ButterflyEntity) => {
    ctx.save();
    ctx.translate(butterfly.x, butterfly.y);
    
    const wingScale = Math.abs(Math.sin(butterfly.wingPhase));
    
    ctx.fillStyle = butterfly.color;
    
    // Left wing
    ctx.save();
    ctx.scale(wingScale, 1);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-butterfly.size, -butterfly.size, -butterfly.size * 0.5, -butterfly.size * 1.5);
    ctx.quadraticCurveTo(0, -butterfly.size * 0.5, 0, 0);
    ctx.fill();
    
    // Lower left wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-butterfly.size * 0.8, butterfly.size * 0.5, -butterfly.size * 0.3, butterfly.size);
    ctx.quadraticCurveTo(0, butterfly.size * 0.3, 0, 0);
    ctx.fill();
    ctx.restore();
    
    // Right wing
    ctx.save();
    ctx.scale(-wingScale, 1);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-butterfly.size, -butterfly.size, -butterfly.size * 0.5, -butterfly.size * 1.5);
    ctx.quadraticCurveTo(0, -butterfly.size * 0.5, 0, 0);
    ctx.fill();
    
    // Lower right wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-butterfly.size * 0.8, butterfly.size * 0.5, -butterfly.size * 0.3, butterfly.size);
    ctx.quadraticCurveTo(0, butterfly.size * 0.3, 0, 0);
    ctx.fill();
    ctx.restore();
    
    // Body
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.ellipse(0, 0, 2, butterfly.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.life;
    ctx.fillStyle = particle.color;
    
    switch (particle.type) {
      case "pollen":
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "firefly":
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "petal":
        ctx.beginPath();
        ctx.ellipse(particle.x, particle.y, particle.size * 2, particle.size, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "sparkle":
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y - particle.size * 2);
        ctx.lineTo(particle.x + particle.size, particle.y);
        ctx.lineTo(particle.x, particle.y + particle.size * 2);
        ctx.lineTo(particle.x - particle.size, particle.y);
        ctx.closePath();
        ctx.fill();
        break;
    }
    
    ctx.restore();
  };

  const adjustColor = (color: string, amount: number): string => {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check for secret areas
    if (x < 100 && y < 100 && !discoveredSecrets.has("corner")) {
      setDiscoveredSecrets(prev => new Set([...prev, "corner"]));
      setShowSecretMessage("🦋 Secret discovered: Hidden Corner!");
      setTimeout(() => setShowSecretMessage(null), 3000);
      // Spawn extra butterflies
      const newButterflies = [...Array(5)].map((_, i) => ({
        ...createRandomButterfly(butterflyIdRef.current + i),
        x,
        y,
      }));
      butterflyIdRef.current += 5;
      setButterflies(prev => [...prev, ...newButterflies]);
    }
    
    // Plant a new flower
    const newPlant: Plant = {
      id: plantIdRef.current++,
      x,
      y,
      type: "flower",
      color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
      size: 20 + Math.random() * 30,
      rotation: (Math.random() - 0.5) * 0.5,
      growth: 0,
      swayOffset: Math.random() * Math.PI * 2,
      layer: 1,
    };
    setPlants(prev => [...prev, newPlant]);
    
    // Spawn particles
    const newParticles = [...Array(10)].map(() => createParticle(x, y, "sparkle"));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const regenerateGarden = () => {
    plantIdRef.current = 0;
    const newPlants: Plant[] = [];
    for (let layer = 0; layer < 3; layer++) {
      const count = layer === 0 ? 8 : layer === 1 ? 12 : 6;
      for (let i = 0; i < count; i++) {
        newPlants.push(createRandomPlant(plantIdRef.current++, layer));
      }
    }
    setPlants(newPlants);
  };

  const downloadGarden = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `secret-garden-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${palette.bg} transition-colors duration-1000`}>
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
          >
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Secret Garden</h1>
            <p className="text-sm text-muted-foreground">Click to plant • Find secrets</p>
          </div>
        </div>

        <div className="flex items-center gap-2"
        >
          <Button variant="outline" size="icon" onClick={() => setShowInfo(!showInfo)}>
            <Info className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={regenerateGarden}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={downloadGarden}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </motion.header>

      {/* Secret Message */}
      <AnimatePresence>
        {showSecretMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium shadow-lg"
          >
            {showSecretMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Canvas Area */}
      <div className="relative px-6 pb-6"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
        >
          <canvas
            ref={canvasRef}
            width={1200}
            height={700}
            onClick={handleCanvasClick}
            className="w-full h-auto cursor-crosshair bg-gradient-to-b from-transparent to-black/5"
          />

          {/* Overlay UI */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between"
          >
            {/* Time of Day Toggle */}
            <div className="flex gap-2"
            >
              {(["day", "sunset", "night"] as const).map((time) => (
                <Button
                  key={time}
                  variant={timeOfDay === time ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setTimeOfDay(time)}
                  className="rounded-full"
                >
                  {time === "day" && <Sun className="w-4 h-4" />}
                  {time === "sunset" && <Cloud className="w-4 h-4" />}
                  {time === "night" && <Moon className="w-4 h-4" />}
                </Button>
              ))}
            </div>

            {/* Stats */}
            <div className="px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm text-white text-sm"
            >
              {plants.length} plants • {butterflies.length} butterflies • {discoveredSecrets.size} secrets found
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-6 pb-6"
      >
        <div className="p-6 rounded-2xl bg-card border"
        >
          <div className="grid md:grid-cols-3 gap-6"
          >
            {/* Palette Selector */}
            <div>
              <label className="text-sm font-medium mb-3 block flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Color Palette
              </label>
              <div className="flex flex-wrap gap-2"
              >
                {colorPalettes.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPalette(i)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedPalette === i ? "border-primary scale-110" : "border-transparent"
                    }`}
                    style={{ background: p.colors[0] }}
                    title={p.name}
                  />
                ))}
              </div>
            </div>

            {/* Wind Control */}
            <div>
              <label className="text-sm font-medium mb-3 block flex items-center gap-2"
              >
                <Wind className="w-4 h-4" />
                Wind Strength
              </label>
              <Slider
                value={[windStrength * 100]}
                onValueChange={(v) => setWindStrength(v[0] / 100)}
                max={200}
                step={1}
              />
            </div>

            {/* Bloom Control */}
            <div>
              <label className="text-sm font-medium mb-3 block flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Bloom Intensity
              </label>
              <Slider
                value={[bloomIntensity * 100]}
                onValueChange={(v) => setBloomIntensity(v[0] / 100)}
                max={200}
                step={1}
              />
            </div>
          </div>

          {/* Toggle Controls */}
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t"
          >
            <div className="flex items-center gap-2"
            >
              <Switch
                checked={isPlaying}
                onCheckedChange={setIsPlaying}
              />
              <span className="text-sm">Animation</span>
            </div>
            <div className="flex items-center gap-2"
            >
              <Switch
                checked={autoGrow}
                onCheckedChange={setAutoGrow}
              />
              <span className="text-sm">Auto-grow</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 pb-6"
          >
            <div className="p-6 rounded-2xl bg-muted"
            >
              <h3 className="font-semibold mb-2">Welcome to the Secret Garden</h3>
              <ul className="space-y-1 text-sm text-muted-foreground"
            >
                <li>🌸 Click anywhere on the garden to plant flowers</li>
                <li>🦋 Butterflies roam freely and respond to the environment</li>
                <li>✨ Find hidden secrets by exploring the corners</li>
                <li>🎨 Change color palettes for different moods</li>
                <li>🌙 Switch between day, sunset, and night modes</li>
                <li>💾 Download your garden creation as an image</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
