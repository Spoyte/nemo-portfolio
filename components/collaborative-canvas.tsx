"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pencil, 
  Eraser, 
  Palette,
  Download,
  Trash2,
  Users,
  Sparkles,
  MousePointer2,
  Undo2,
  Redo2,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: "brush" | "eraser";
}

interface Cursor {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
}

const colors = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", 
  "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", 
  "#d946ef", "#f43f5e", "#000000", "#ffffff"
];

const simulatedUsers = [
  { name: "Alex", color: "#3b82f6" },
  { name: "Sam", color: "#22c55e" },
  { name: "Jordan", color: "#f59e0b" },
];

export function CollaborativeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [color, setColor] = useState("#3b82f6");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<Stroke[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [userCount, setUserCount] = useState(3);

  // Simulate other users' cursors
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors(prev => {
        return simulatedUsers.map((user, i) => ({
          id: `user-${i}`,
          x: Math.random() * 800,
          y: Math.random() * 600,
          name: user.name,
          color: user.color,
        }));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Draw all strokes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes
    strokes.forEach(stroke => {
      drawStroke(ctx, stroke);
    });

    // Draw current stroke
    if (currentStroke) {
      drawStroke(ctx, currentStroke);
    }
  }, [strokes, currentStroke]);

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }

    ctx.strokeStyle = stroke.tool === "eraser" ? "#ffffff" : stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentStroke({
      id: Math.random().toString(36).substr(2, 9),
      points: [{ x, y }],
      color,
      width: brushSize,
      tool,
    });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentStroke({
      ...currentStroke,
      points: [...currentStroke.points, { x, y }],
    });
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentStroke) return;

    setIsDrawing(false);
    const newStrokes = [...strokes, currentStroke];
    setStrokes(newStrokes);
    setCurrentStroke(null);

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newStrokes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setStrokes(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setStrokes(history[historyIndex + 1]);
    }
  };

  const clear = () => {
    setStrokes([]);
    const newHistory = [...history, []];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `collaborative-art-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-pink-950/5 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 mb-6"
          >
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Collaborative Art</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Creative{" "}
            <span className="text-gradient-animated">Canvas</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A shared drawing space where creativity flows freely. 
            Watch simulated collaborators draw alongside you in real-time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Tools */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Tools
              </h3>
              
              <div className="flex gap-2 mb-4">
                <Button
                  variant={tool === "brush" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTool("brush")}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Brush
                </Button>
                <Button
                  variant={tool === "eraser" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTool("eraser")}
                  className="flex-1"
                >
                  <Eraser className="h-4 w-4 mr-1" />
                  Eraser
                </Button>
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Brush Size: {brushSize}px
                </label>
                <Slider
                  value={[brushSize]}
                  onValueChange={([v]) => setBrushSize(v)}
                  min={1}
                  max={50}
                />
              </div>
            </div>

            {/* Colors */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </h3>
              
              <div className="grid grid-cols-4 gap-2">
                {colors.map((c) => (
                  <motion.button
                    key={c}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      color === c ? "border-primary scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4">Actions</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <Undo2 className="h-4 w-4 mr-1" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo2 className="h-4 w-4 mr-1" />
                  Redo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="col-span-2"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear Canvas
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={download}
                  className="col-span-2"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            {/* Active Users */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Active Now
                </h3>
                <Badge variant="outline">{userCount}</Badge>
              </div>
              
              <div className="space-y-2">
                {simulatedUsers.map((user, i) => (
                  <div key={user.name} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      drawing...
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-semibold">You</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    (host)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-2xl bg-white border border-border overflow-hidden shadow-2xl"
003e
              {/* Simulated Cursors */}
              <AnimatePresence>
                {cursors.map((cursor) => (
                  <motion.div
                    key={cursor.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: cursor.x,
                      y: cursor.y,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute pointer-events-none z-10"
                  >
                    <MousePointer2 
                      className="w-5 h-5" 
                      style={{ color: cursor.color }}
                      fill={cursor.color}
                    />
                    <span 
                      className="absolute left-5 top-5 text-xs px-2 py-1 rounded text-white whitespace-nowrap"
                      style={{ backgroundColor: cursor.color }}
                    >
                      {cursor.name}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-auto cursor-crosshair touch-none"
                style={{ aspectRatio: "4/3" }}
              />

              {/* Canvas Overlay Info */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {strokes.length} strokes
                </Badge>
                
                <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                  <Share2 className="h-3 w-3 mr-1" />
                  Collaborative Mode
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
