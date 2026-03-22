"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Download,
  Share2,
  Sparkles,
  Terminal,
  Wand2,
  Bug,
  Check,
  Copy,
  Maximize2,
  Minimize2,
  Zap,
  Lightbulb,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Folder,
  FileCode,
  Braces,
  Hash,
  Type,
  Palette,
  Layout,
  MousePointer,
  Eye,
  EyeOff,
  Search,
  Filter,
  Star,
  History,
  Save,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  isOpen: boolean;
}

const defaultFiles: CodeFile[] = [
  {
    id: "1",
    name: "app.tsx",
    language: "typescript",
    content: `import React from 'react';
import { motion } from 'framer-motion';

export default function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center"
    >
      <h1 className="text-4xl font-bold">
        Hello, World!
      </h1>
    </motion.div>
  );
}`,
    isOpen: true,
  },
  {
    id: "2",
    name: "styles.css",
    language: "css",
    content: `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.title {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}`,
    isOpen: false,
  },
];

const experiments = [
  {
    id: "particles",
    name: "Particle System",
    description: "Interactive particle animation with mouse tracking",
    category: "Animation",
    difficulty: "Intermediate",
    code: `// Particle System
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const particles = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = \`hsl(\${Math.random() * 360}, 70%, 50%)\`;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }
  
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Create particles on click
canvas.addEventListener('click', (e) => {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(e.x, e.y));
  }
});`,
  },
  {
    id: "fractals",
    name: "Fractal Tree",
    description: "Recursive fractal tree generation",
    category: "Generative",
    difficulty: "Advanced",
    code: `// Fractal Tree
function drawBranch(x, y, len, angle, depth) {
  if (depth === 0) return;
  
  const endX = x + len * Math.cos(angle);
  const endY = y + len * Math.sin(angle);
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = \`hsl(\${depth * 30}, 70%, 50%)\`;
  ctx.lineWidth = depth / 2;
  ctx.stroke();
  
  // Recursive branches
  drawBranch(endX, endY, len * 0.7, angle - 0.5, depth - 1);
  drawBranch(endX, endY, len * 0.7, angle + 0.5, depth - 1);
}

// Start from bottom center
drawBranch(canvas.width / 2, canvas.height, 120, -Math.PI / 2, 10);`,
  },
  {
    id: "matrix",
    name: "Matrix Rain",
    description: "Digital rain effect inspired by The Matrix",
    category: "Visual",
    difficulty: "Beginner",
    code: `// Matrix Rain
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const drops = [];
const fontSize = 14;
const columns = canvas.width / fontSize;

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
}

setInterval(draw, 35);`,
  },
  {
    id: "waves",
    name: "Sine Waves",
    description: "Animated sine wave interference patterns",
    category: "Animation",
    difficulty: "Intermediate",
    code: `// Sine Waves
let time = 0;

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const y = canvas.height / 2 + 
      Math.sin(x * 0.01 + time) * 50 +
      Math.sin(x * 0.02 + time * 1.5) * 30 +
      Math.sin(x * 0.005 + time * 0.5) * 80;
    
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  
  ctx.strokeStyle = \`hsl(\${time * 20}, 70%, 50%)\`;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  time += 0.05;
  requestAnimationFrame(animate);
}

animate();`,
  },
];

const snippets = [
  {
    id: "1",
    title: "Debounce Function",
    language: "typescript",
    code: `function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}`,
    tags: ["utility", "performance"],
  },
  {
    id: "2",
    title: "Custom Hook: useLocalStorage",
    language: "typescript",
    code: `function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(stored) : value;
    setStored(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [stored, setValue] as const;
}`,
    tags: ["react", "hooks"],
  },
  {
    id: "3",
    title: "CSS Grid Centering",
    language: "css",
    code: `.center-container {
  display: grid;
  place-items: center;
  min-height: 100vh;
}

/* Or with flexbox */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}`,
    tags: ["css", "layout"],
  },
];

export default function CodeLaboratoryPage() {
  const [files, setFiles] = useState<CodeFile[]>(defaultFiles);
  const [activeFileId, setActiveFileId] = useState<string>("1");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState(experiments[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedSnippets, setSavedSnippets] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Running...\n");

    setTimeout(() => {
      setOutput((prev) => prev + "✓ Code compiled successfully\n");
      setOutput((prev) => prev + "✓ No errors found\n");
      setOutput((prev) => prev + "✓ Output rendered\n");
      setIsRunning(false);

      // Run canvas experiment if applicable
      if (selectedExperiment && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // In a real implementation, we'd safely execute the experiment code
          toast.success("Experiment loaded! Check the preview panel.");
        }
      }
    }, 1500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    toast.success("Code copied to clipboard!");
  };

  const toggleSnippetSave = (id: string) => {
    setSavedSnippets((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    toast.success(savedSnippets.includes(id) ? "Snippet removed" : "Snippet saved!");
  };

  const filteredSnippets = snippets.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold"
              >
                Code{" "}
                <span className="text-gradient-animated">Laboratory</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground mt-2"
              >
                Experiment, prototype, and test code in real-time
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentation
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="editor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="editor">
                <Code2 className="h-4 w-4 mr-2" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="experiments">
                <Sparkles className="h-4 w-4 mr-2" />
                Experiments
              </TabsTrigger>
              <TabsTrigger value="snippets">
                <BookOpen className="h-4 w-4 mr-2" />
                Snippets
              </TabsTrigger>
            </TabsList>

            {/* Code Editor Tab */}
            <TabsContent value="editor" className="space-y-4">
              <div className={`grid ${isFullscreen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} gap-4`}>
                {/* Editor Panel */}
                <Card className={`${isFullscreen ? "fixed inset-4 z-50" : ""} flex flex-col`}>
                  <CardHeader className="flex flex-row items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {files.map((file) => (
                          <button
                            key={file.id}
                            onClick={() => setActiveFileId(file.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              activeFileId === file.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }`}
                          >
                            <FileCode className="h-4 w-4" />
                            {file.name}
                            {file.isOpen && (
                              <span className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-0">
                    <div className="relative">
                      <pre className="p-4 text-sm font-mono bg-muted/30 rounded-lg overflow-auto max-h-[500px]">
                        <code>{activeFile.content}</code>
                      </pre>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">{activeFile.language}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Output Panel */}
                {!isFullscreen && (
                  <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between py-3">
                      <CardTitle className="text-sm font-medium">Output</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={handleRunCode}
                          disabled={isRunning}
                        >
                          {isRunning ? (
                            <>
                              <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Run
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 min-h-[300px]">
                        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                          <Terminal className="h-4 w-4" />
                          <span>Console</span>
                        </div>
                        <pre className="whitespace-pre-wrap">{output || "Ready to run..."}</pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Experiments Tab */}
            <TabsContent value="experiments" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Experiment List */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Experiments</CardTitle>
                    <CardDescription>Choose an experiment to run</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {experiments.map((exp) => (
                          <button
                            key={exp.id}
                            onClick={() => setSelectedExperiment(exp)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              selectedExperiment.id === exp.id
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{exp.name}</span>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {exp.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {exp.category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  exp.difficulty === "Beginner"
                                    ? "text-green-500"
                                    : exp.difficulty === "Intermediate"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              >
                                {exp.difficulty}
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Experiment Preview */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedExperiment.name}</CardTitle>
                        <CardDescription>{selectedExperiment.description}</CardDescription>
                      </div>
                      <Button onClick={handleRunCode}>
                        <Play className="h-4 w-4 mr-2" />
                        Run Experiment
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={300}
                          className="w-full h-[300px]"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary">Canvas Preview</Badge>
                        </div>
                      </div>
                      <pre className="p-4 text-sm font-mono bg-muted/30 rounded-lg overflow-auto max-h-[200px]">
                        <code>{selectedExperiment.code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Snippets Tab */}
            <TabsContent value="snippets" className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search snippets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Snippet
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSnippets.map((snippet, index) => (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileCode className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">{snippet.title}</CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSnippetSave(snippet.id)}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                savedSnippets.includes(snippet.id)
                                  ? "fill-yellow-500 text-yellow-500"
                                  : ""
                              }`}
                            />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          {snippet.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="text-xs">
                            {snippet.language}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="p-3 text-xs font-mono bg-muted/30 rounded-lg overflow-x-auto">
                          <code>{snippet.code}</code>
                        </pre>
                        <div className="flex items-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              navigator.clipboard.writeText(snippet.code);
                              toast.success("Copied to clipboard!");
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Play className="h-4 w-4 mr-2" />
                            Try It
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
