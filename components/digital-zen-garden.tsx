"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Wind, 
  RefreshCw, 
  Download,
  Palette,
  Sparkles,
  Moon,
  Sun,
  Cloud,
  Waves,
  Mountain,
  Flower2,
  Undo2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RakeMark {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface Stone {
  id: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

interface Plant {
  id: string;
  x: number;
  y: number;
  type: "moss" | "flower" | "grass";
  size: number;
}

const sandColors = [
  { name: "Classic", value: "#d4c4a8", gradient: "from-[#d4c4a8] to-[#c4b498]" },
  { name: "Twilight", value: "#4a5568", gradient: "from-[#4a5568] to-[#2d3748]" },
  { name: "Sunset", value: "#fbd38d", gradient: "from-[#fbd38d] to-[#ed8936]" },
  { name: "Ocean", value: "#90cdf4", gradient: "from-[#90cdf4] to-[#4299e1]" },
  { name: "Cherry", value: "#fbb6ce", gradient: "from-[#fbb6ce] to-[#ed64a6]" },
];

const rakeColors = [
  "#8b7355",
  "#6b5b4f", 
  "#a0826d",
  "#5c4a3d",
  "#9c8b7a",
];

export function DigitalZenGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentMark, setCurrentMark] = useState<RakeMark | null>(null);
  const [marks, setMarks] = useState<RakeMark[]>([]);
  const [stones, setStones] = useState<Stone[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedSand, setSelectedSand] = useState(sandColors[0]);
  const [selectedTool, setSelectedTool] = useState<"rake" | "stone" | "plant" | "erase">("rake");
  const [rakeWidth, setRakeWidth] = useState(3);
  const [showInstructions, setShowInstructions] = useState(true);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redrawCanvas();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Redraw canvas when marks, stones, plants, or sand changes
  useEffect(() => {
    redrawCanvas();
  }, [marks, stones, plants, selectedSand]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sand background with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, selectedSand.value);
    gradient.addColorStop(1, adjustColor(selectedSand.value, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle sand texture
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2;
      ctx.fillRect(x, y, size, size);
    }

    // Draw all rake marks
    marks.forEach((mark) => {
      if (mark.points.length < 2) return;
      
      ctx.strokeStyle = adjustColor(selectedSand.value, -30);
      ctx.lineWidth = mark.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.6;

      // Draw main line
      ctx.beginPath();
      ctx.moveTo(mark.points[0].x, mark.points[0].y);
      for (let i = 1; i < mark.points.length; i++) {
        ctx.lineTo(mark.points[i].x, mark.points[i].y);
      }
      ctx.stroke();

      // Draw shadow line for depth
      ctx.strokeStyle = adjustColor(selectedSand.value, -50);
      ctx.lineWidth = mark.width * 0.5;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(mark.points[0].x + 2, mark.points[0].y + 2);
      for (let i = 1; i < mark.points.length; i++) {
        ctx.lineTo(mark.points[i].x + 2, mark.points[i].y + 2);
      }
      ctx.stroke();

      ctx.globalAlpha = 1;
    });

    // Draw plants
    plants.forEach((plant) => {
      drawPlant(ctx, plant);
    });

    // Draw stones
    stones.forEach((stone) => {
      drawStone(ctx, stone);
    });
  }, [marks, stones, plants, selectedSand]);

  const drawStone = (ctx: CanvasRenderingContext2D, stone: Stone) => {
    ctx.save();
    ctx.translate(stone.x, stone.y);
    ctx.rotate(stone.rotation);

    // Stone shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(3, 3, stone.size, stone.size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stone body
    const gradient = ctx.createRadialGradient(
      -stone.size * 0.2, -stone.size * 0.2, 0,
      0, 0, stone.size
    );
    gradient.addColorStop(0, "#9ca3af");
    gradient.addColorStop(0.5, "#6b7280");
    gradient.addColorStop(1, "#4b5563");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, stone.size, stone.size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stone highlight
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.ellipse(-stone.size * 0.2, -stone.size * 0.2, stone.size * 0.3, stone.size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawPlant = (ctx: CanvasRenderingContext2D, plant: Plant) => {
    ctx.save();
    ctx.translate(plant.x, plant.y);

    if (plant.type === "moss") {
      // Draw moss patch
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const dist = Math.random() * plant.size * 0.5;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        
        ctx.fillStyle = `rgba(${100 + Math.random() * 50}, ${150 + Math.random() * 50}, ${100 + Math.random() * 30}, 0.8)`;
        ctx.beginPath();
        ctx.arc(x, y, plant.size * 0.3 * (0.5 + Math.random() * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (plant.type === "flower") {
      // Draw flower
      const petalCount = 5;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);
        ctx.fillStyle = "#f472b6";
        ctx.beginPath();
        ctx.ellipse(0, -plant.size * 0.4, plant.size * 0.2, plant.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Center
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(0, 0, plant.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (plant.type === "grass") {
      // Draw grass blades
      for (let i = 0; i < 5; i++) {
        const angle = (i - 2) * 0.3;
        ctx.save();
        ctx.rotate(angle);
        ctx.strokeStyle = "#65a30d";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(plant.size * 0.2, -plant.size * 0.5, 0, -plant.size);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  };

  const adjustColor = (color: string, amount: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === "rake") {
      setIsDrawing(true);
      const newMark: RakeMark = {
        id: Date.now().toString(),
        points: [{ x, y }],
        color: rakeColors[Math.floor(Math.random() * rakeColors.length)],
        width: rakeWidth,
      };
      setCurrentMark(newMark);
    } else if (selectedTool === "stone") {
      const newStone: Stone = {
        id: Date.now().toString(),
        x,
        y,
        size: 15 + Math.random() * 20,
        rotation: Math.random() * Math.PI * 2,
      };
      setStones([...stones, newStone]);
    } else if (selectedTool === "plant") {
      const types: Plant["type"][] = ["moss", "flower", "grass"];
      const newPlant: Plant = {
        id: Date.now().toString(),
        x,
        y,
        type: types[Math.floor(Math.random() * types.length)],
        size: 10 + Math.random() * 15,
      };
      setPlants([...plants, newPlant]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentMark) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentMark({
      ...currentMark,
      points: [...currentMark.points, { x, y }],
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentMark) {
      setMarks([...marks, currentMark]);
      setCurrentMark(null);
    }
    setIsDrawing(false);
  };

  const clearGarden = () => {
    setMarks([]);
    setStones([]);
    setPlants([]);
  };

  const undoLast = () => {
    if (plants.length > 0) {
      setPlants(plants.slice(0, -1));
    } else if (stones.length > 0) {
      setStones(stones.slice(0, -1));
    } else if (marks.length > 0) {
      setMarks(marks.slice(0, -1));
    }
  };

  const downloadGarden = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `zen-garden-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-stone-950/5 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-500/10 text-stone-500 mb-6"
          >
            <Wind className="h-4 w-4" />
            <span className="text-sm font-medium">Digital Zen Garden</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your{" "}
            <span className="text-gradient-animated">Inner Calm</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create patterns in the sand, place stones, and cultivate a peaceful digital sanctuary. 
            Take a moment to breathe and create.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Tool Selection */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-card border border-border">
            <button
              onClick={() => setSelectedTool("rake")}
              className={`p-3 rounded-xl transition-all ${
                selectedTool === "rake" 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
              title="Rake"
            >
              <Wind className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedTool("stone")}
              className={`p-3 rounded-xl transition-all ${
                selectedTool === "stone" 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
              title="Place Stone"
            >
              <Mountain className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedTool("plant")}
              className={`p-3 rounded-xl transition-all ${
                selectedTool === "plant" 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
              title="Add Plant"
            >
              <Flower2 className="h-5 w-5" />
            </button>
          </div>

          {/* Sand Color Selection */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-card border border-border">
            <Palette className="h-4 w-4 text-muted-foreground ml-2" />
            {sandColors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedSand(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedSand.name === color.name 
                    ? "border-primary scale-110" 
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={undoLast}>
              <Undo2 className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button variant="outline" size="sm" onClick={clearGarden}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={downloadGarden}>
              <Download className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </motion.div>

        {/* Canvas Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-stone-500/10 via-amber-500/10 to-stone-500/10 rounded-3xl blur-2xl opacity-50" />
          
          <div 
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ height: "500px" }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`w-full h-full ${
                selectedTool === "rake" ? "cursor-crosshair" : "cursor-pointer"
              }`}
            />

            {/* Instructions Overlay */}
            <AnimatePresence>
              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowInstructions(false)}
                >
                  <div className="text-center text-white p-8">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-amber-400" />
                    <h3 className="text-2xl font-bold mb-4">Welcome to Your Zen Garden</h3>
                    <div className="space-y-2 text-white/80">
                      <p>🌊 Use the rake to create patterns in the sand</p>
                      <p>🪨 Place stones to create focal points</p>
                      <p>🌸 Add plants for natural beauty</p>
                      <p>✨ Take your time and breathe</p>
                    </div>
                    <Button className="mt-6" variant="secondary">
                      Click to Begin
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Current Tool Indicator */}
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                {selectedTool === "rake" && "🌊 Raking Mode — Click and drag to create patterns"}
                {selectedTool === "stone" && "🪨 Stone Mode — Click to place stones"}
                {selectedTool === "plant" && "🌸 Plant Mode — Click to add plants"}
              </Badge>
            </div>

            {/* Stats */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                {marks.length} patterns
              </Badge>
              <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                {stones.length} stones
              </Badge>
              <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                {plants.length} plants
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
        >
          <div className="p-4 rounded-xl bg-card border border-border">
            <Waves className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-sm font-medium">Flow Like Water</p>
            <p className="text-xs text-muted-foreground">Let your movements be smooth and continuous</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <Mountain className="h-6 w-6 mx-auto mb-2 text-stone-500" />
            <p className="text-sm font-medium">Find Balance</p>
            <p className="text-xs text-muted-foreground">Place elements with intention and space</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <Sun className="h-6 w-6 mx-auto mb-2 text-amber-500" />
            <p className="text-sm font-medium">Embrace Impermanence</p>
            <p className="text-xs text-muted-foreground">Your garden can be remade endlessly</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
