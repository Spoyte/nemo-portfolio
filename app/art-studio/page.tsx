"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Sparkles,
  Zap,
  Wand2,
  RefreshCw,
  Download,
  Share2,
  Copy,
  Check,
  Palette,
  Image as ImageIcon,
  Type,
  Shapes,
  Grid3X3,
  Layers,
  MousePointer2,
  Move,
  RotateCw,
  Maximize,
  Minimize,
  Play,
  Pause,
  Settings,
  Sliders,
  Code,
  Eye,
  EyeOff,
  Trash2,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Plus,
  Minus,
  Focus,
  Aperture,
  Blend,
  Contrast,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/scroll-animations";
import { toast } from "sonner";

interface ArtNode {
  id: string;
  type: "circle" | "rect" | "triangle" | "line" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  opacity: number;
  scale: number;
  content?: string;
}

interface ArtConfig {
  nodeCount: number;
  colorScheme: "vibrant" | "pastel" | "monochrome" | "warm" | "cool" | "random";
  shapeTypes: ("circle" | "rect" | "triangle")[];
  complexity: number;
  spread: number;
  symmetry: boolean;
  animation: boolean;
}

const colorSchemes = {
  vibrant: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
  pastel: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"],
  monochrome: ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"],
  warm: ["#FF0000", "#FF4500", "#FF8C00", "#FFD700", "#FF6347"],
  cool: ["#0000FF", "#4169E1", "#00CED1", "#20B2AA", "#48D1CC"],
  random: [],
};

function generateRandomColor(scheme: keyof typeof colorSchemes): string {
  if (scheme === "random") {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
  }
  const colors = colorSchemes[scheme];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateArtNodes(config: ArtConfig, canvasWidth: number, canvasHeight: number): ArtNode[] {
  const nodes: ArtNode[] = [];
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  for (let i = 0; i < config.nodeCount; i++) {
    const angle = (i / config.nodeCount) * Math.PI * 2;
    const radius = Math.random() * config.spread * Math.min(canvasWidth, canvasHeight) * 0.4;
    
    let x = centerX + Math.cos(angle) * radius;
    let y = centerY + Math.sin(angle) * radius;

    if (!config.symmetry) {
      x += (Math.random() - 0.5) * 100;
      y += (Math.random() - 0.5) * 100;
    }

    const shapeType = config.shapeTypes[Math.floor(Math.random() * config.shapeTypes.length)];
    const size = 20 + Math.random() * 80 * (config.complexity / 50);

    nodes.push({
      id: `node-${i}`,
      type: shapeType,
      x,
      y,
      width: size,
      height: size,
      rotation: Math.random() * 360,
      color: generateRandomColor(config.colorScheme),
      opacity: 0.3 + Math.random() * 0.7,
      scale: 0.5 + Math.random() * 1,
    });

    // Add symmetry if enabled
    if (config.symmetry && i < config.nodeCount / 2) {
      nodes.push({
        id: `node-${i}-mirror`,
        type: shapeType,
        x: centerX * 2 - x,
        y,
        width: size,
        height: size,
        rotation: -Math.random() * 360,
        color: generateRandomColor(config.colorScheme),
        opacity: 0.3 + Math.random() * 0.7,
        scale: 0.5 + Math.random() * 1,
      });
    }
  }

  return nodes;
}

export default function GenerativeArtPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<ArtNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState<ArtNode[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedArtworks, setSavedArtworks] = useState<{ id: string; name: string; nodes: ArtNode[]; config: ArtConfig }[]>([]);
  const [artworkName, setArtworkName] = useState("");

  const [config, setConfig] = useState<ArtConfig>({
    nodeCount: 30,
    colorScheme: "vibrant",
    shapeTypes: ["circle", "rect", "triangle"],
    complexity: 50,
    spread: 80,
    symmetry: false,
    animation: true,
  });

  // Generate initial art
  useEffect(() => {
    generateNewArt();
  }, []);

  const generateNewArt = () => {
    setIsGenerating(true);
    const canvasWidth = canvasRef.current?.offsetWidth || 800;
    const canvasHeight = canvasRef.current?.offsetHeight || 600;
    const newNodes = generateArtNodes(config, canvasWidth, canvasHeight);
    setNodes(newNodes);
    addToHistory(newNodes);
    setTimeout(() => setIsGenerating(false), 500);
  };

  const addToHistory = (newNodes: ArtNode[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newNodes]);
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setNodes([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setNodes([...history[historyIndex + 1]]);
    }
  };

  const updateNode = (id: string, updates: Partial<ArtNode>) => {
    const newNodes = nodes.map((n) => (n.id === id ? { ...n, ...updates } : n));
    setNodes(newNodes);
    addToHistory(newNodes);
  };

  const deleteNode = (id: string) => {
    const newNodes = nodes.filter((n) => n.id !== id);
    setNodes(newNodes);
    setSelectedNode(null);
    addToHistory(newNodes);
  };

  const saveArtwork = () => {
    if (!artworkName.trim()) {
      toast.error("Please enter an artwork name");
      return;
    }
    const newArtwork = {
      id: Date.now().toString(),
      name: artworkName,
      nodes: [...nodes],
      config: { ...config },
    };
    setSavedArtworks([newArtwork, ...savedArtworks]);
    setArtworkName("");
    toast.success("Artwork saved!");
  };

  const loadArtwork = (artwork: typeof savedArtworks[0]) => {
    setNodes([...artwork.nodes]);
    setConfig({ ...artwork.config });
    addToHistory([...artwork.nodes]);
    toast.success(`Loaded "${artwork.name}"`);
  };

  const exportArtwork = (format: "png" | "svg" | "json") => {
    if (format === "json") {
      const data = JSON.stringify({ nodes, config }, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `artwork-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      toast.info("PNG/SVG export coming soon!");
    }
  };

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Generative Art Studio</h1>
                <p className="text-muted-foreground text-sm">Create beautiful algorithmic artwork</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                <Redo2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button onClick={generateNewArt} className="gap-2">
                <Wand2 className="w-4 h-4" />
                Generate
              </Button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <ScrollReveal delay={0.1} className="lg:col-span-1 space-y-6">
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-6">
                {/* Node Count */}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <label className="text-sm font-medium mb-2 block">Node Count: {config.nodeCount}</label>
                  <Slider
                    value={[config.nodeCount]}
                    onValueChange={([v]) => setConfig({ ...config, nodeCount: v })}
                    min={5}
                    max={100}
                    step={5}
                  />
                </div>

                {/* Color Scheme */}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <label className="text-sm font-medium mb-3 block">Color Scheme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(colorSchemes).map((scheme) => (
                      <button
                        key={scheme}
                        onClick={() => setConfig({ ...config, colorScheme: scheme as ArtConfig["colorScheme"] })}
                        className={`p-2 rounded-lg text-xs capitalize transition-all ${
                          config.colorScheme === scheme
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {scheme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shape Types */}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <label className="text-sm font-medium mb-3 block">Shapes</label>
                  <div className="flex gap-2">
                    {(["circle", "rect", "triangle"] as const).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => {
                          const newTypes = config.shapeTypes.includes(shape)
                            ? config.shapeTypes.filter((t) => t !== shape)
                            : [...config.shapeTypes, shape];
                          setConfig({ ...config, shapeTypes: newTypes });
                        }}
                        className={`flex-1 p-2 rounded-lg text-xs capitalize transition-all ${
                          config.shapeTypes.includes(shape)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Complexity & Spread */}
                <div className="p-4 rounded-xl bg-card border border-border space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Complexity: {config.complexity}%</label>
                    <Slider
                      value={[config.complexity]}
                      onValueChange={([v]) => setConfig({ ...config, complexity: v })}
                      min={10}
                      max={100}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Spread: {config.spread}%</label>
                    <Slider
                      value={[config.spread]}
                      onValueChange={([v]) => setConfig({ ...config, spread: v })}
                      min={20}
                      max={100}
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                  <button
                    onClick={() => setConfig({ ...config, symmetry: !config.symmetry })}
                    className={`w-full p-3 rounded-lg text-sm flex items-center justify-between transition-all ${
                      config.symmetry ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Blend className="w-4 h-4" />
                      Symmetry
                    </span>
                    <span>{config.symmetry ? "On" : "Off"}</span>
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, animation: !config.animation })}
                    className={`w-full p-3 rounded-lg text-sm flex items-center justify-between transition-all ${
                      config.animation ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Animation
                    </span>
                    <span>{config.animation ? "On" : "Off"}</span>
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="space-y-6">
                {selectedNodeData ? (
                  <>
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Edit Node</h3>
                        <Button variant="ghost" size="icon" onClick={() => deleteNode(selectedNode!)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedNodeData.color}
                              onChange={(e) => updateNode(selectedNode!, { color: e.target.value })}
                              className="w-12 h-10 rounded border-0"
                            />
                            <Input
                              value={selectedNodeData.color}
                              onChange={(e) => updateNode(selectedNode!, { color: e.target.value })}
                              className="flex-1 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Size: {Math.round(selectedNodeData.width)}px</label>
                          <Slider
                            value={[selectedNodeData.width]}
                            onValueChange={([v]) => updateNode(selectedNode!, { width: v, height: v })}
                            min={10}
                            max={200}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Rotation: {Math.round(selectedNodeData.rotation)}°</label>
                          <Slider
                            value={[selectedNodeData.rotation]}
                            onValueChange={([v]) => updateNode(selectedNode!, { rotation: v })}
                            min={0}
                            max={360}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Opacity: {Math.round(selectedNodeData.opacity * 100)}%</label>
                          <Slider
                            value={[selectedNodeData.opacity * 100]}
                            onValueChange={([v]) => updateNode(selectedNode!, { opacity: v / 100 })}
                            min={10}
                            max={100}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Scale: {selectedNodeData.scale.toFixed(2)}x</label>
                          <Slider
                            value={[selectedNodeData.scale * 100]}
                            onValueChange={([v]) => updateNode(selectedNode!, { scale: v / 100 })}
                            min={50}
                            max={200}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 rounded-xl bg-card border border-border text-center">
                    <MousePointer2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Select a node on the canvas to edit</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="export" className="space-y-6">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold mb-4">Export Artwork</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(["png", "svg", "json"] as const).map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        onClick={() => exportArtwork(format)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        {format.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold mb-4">Save to Gallery</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Artwork name..."
                      value={artworkName}
                      onChange={(e) => setArtworkName(e.target.value)}
                    />
                    <Button onClick={saveArtwork}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {savedArtworks.length > 0 && (
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-4">Saved Artworks ({savedArtworks.length})</h3>
                    <div className="space-y-2">
                      {savedArtworks.map((artwork) => (
                        <div
                          key={artwork.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted cursor-pointer hover:bg-muted/80"
                          onClick={() => loadArtwork(artwork)}
                        >
                          <span className="font-medium">{artwork.name}</span>
                          <Badge variant="secondary">{artwork.nodes.length} nodes</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </ScrollReveal>

          {/* Canvas */}
          <ScrollReveal delay={0.2} className="lg:col-span-3">
            <div
              ref={canvasRef}
              className="relative h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted border border-border"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
            >
              {/* Grid */}
              {/* Grid */}
              {showGrid && (
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              )}

              {/* Art Nodes */}
              <AnimatePresence>
                {nodes.map((node) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: node.opacity,
                      scale: isPlaying && config.animation ? [node.scale, node.scale * 1.1, node.scale] : node.scale,
                      rotate: isPlaying && config.animation ? [node.rotation, node.rotation + 5, node.rotation] : node.rotation,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.5,
                      scale: config.animation ? { repeat: Infinity, duration: 3 + Math.random() * 2 } : undefined,
                      rotate: config.animation ? { repeat: Infinity, duration: 5 + Math.random() * 3 } : undefined,
                    }}
                    className={`absolute cursor-pointer ${selectedNode === node.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: node.width,
                      height: node.height,
                      backgroundColor: node.type !== "line" ? node.color : undefined,
                      borderRadius: node.type === "circle" ? "50%" : node.type === "rect" ? "8px" : undefined,
                      clipPath: node.type === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
                      transform: `translate(-50%, -50%) rotate(${node.rotation}deg) scale(${node.scale})`,
                    }}
                    onClick={() => setSelectedNode(node.id)}
                    whileHover={{ scale: node.scale * 1.1 }}
                    drag
                    dragConstraints={canvasRef}
                    onDragEnd={(_, info) => {
                      updateNode(node.id, {
                        x: node.x + info.offset.x,
                        y: node.y + info.offset.y,
                      });
                    }}
                  />
                ))}
              </AnimatePresence>

              {/* Empty State */}
              <{nodes.length === 0 && !isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Click Generate to create art</p>
                  </div>
                </div>
              )}

              {/* Generating Indicator */}
              <{isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>Generating...</span>
                  </div>
                </div>
              )}

              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-card/90 backdrop-blur p-2 rounded-lg border border-border">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-sm w-12 text-center">{zoom}%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(150, zoom + 10))}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
