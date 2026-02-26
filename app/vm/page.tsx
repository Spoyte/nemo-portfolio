"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Code2,
  Sparkles,
  Zap,
  Palette,
  Music,
  Gamepad2,
  Cpu,
  Globe,
  Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Demo programs that run in the virtual machine
const DEMO_PROGRAMS = {
  matrix: `function MatrixRain() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const drops = [];
  
  for(let i = 0; i < 50; i++) {
    drops.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 1 + Math.random() * 3,
      char: chars[Math.floor(Math.random() * chars.length)]
    });
  }
  
  return drops.map(drop => ({
    ...drop,
    y: (drop.y + drop.speed) % 100
  }));
}

// Initializing matrix simulation...
// Loading digital rain...
// System ready.
// Entering the Matrix...`,

  particles: `class ParticleSystem {
  constructor(count = 100) {
    this.particles = [];
    for(let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1.0
      });
    }
  }
  
  update() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.01;
      
      if(p.life <= 0) {
        p.x = Math.random() * 800;
        p.y = Math.random() * 600;
        p.life = 1.0;
      }
    });
  }
  
  render() {
    return this.particles.filter(p => p.life > 0);
  }
}

// Particle system initialized
// 100 particles active
// Physics engine: ONLINE
// Rendering at 60 FPS`,

  fractal: `function mandelbrot(c, maxIter = 100) {
  let z = { re: 0, im: 0 };
  let n = 0;
  
  while(n < maxIter && z.re * z.re + z.im * z.im <= 4) {
    const re = z.re * z.re - z.im * z.im + c.re;
    const im = 2 * z.re * z.im + c.im;
    z = { re, im };
    n++;
  }
  
  return n;
}

// Computing fractal set...
// Resolution: 1920x1080
// Iterations: 1000
// Zoom level: 1.0e-15
// Exploring the boundary of chaos...`,

  neural: `class NeuralNetwork {
  constructor(layers) {
    this.weights = [];
    this.biases = [];
    
    for(let i = 0; i < layers.length - 1; i++) {
      this.weights.push(
        Array(layers[i]).fill(0)
          .map(() => Array(layers[i+1])
            .fill(0).map(() => Math.random() - 0.5))
      );
      this.biases.push(
        Array(layers[i+1]).fill(0)
          .map(() => Math.random() - 0.5)
      );
    }
  }
  
  forward(input) {
    let output = input;
    for(let i = 0; i < this.weights.length; i++) {
      output = this.sigmoid(
        this.matrixMultiply(output, this.weights[i])
          .map((v, j) => v + this.biases[i][j])
      );
    }
    return output;
  }
  
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
}

// Neural network initialized
// Architecture: [784, 256, 128, 10]
// Parameters: 203,530
// Forward pass: ACTIVE
// Learning rate: 0.001`,

  crypto: `function sha256(message) {
  // Simplified hash demonstration
  let hash = 0;
  for(let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

// Blockchain simulation...
// Block #1: 0000a7f3c8d2e1b9...
// Block #2: 0000b8e4d9f2c1a0...
// Block #3: 0000c9f5e0a3d2b1...
// Mining difficulty: 4 leading zeros
// Hash rate: 45.2 MH/s`,

  sort: `async function quickSort(arr, left = 0, right = arr.length - 1) {
  if(left < right) {
    const pivot = await partition(arr, left, right);
    await quickSort(arr, left, pivot - 1);
    await quickSort(arr, pivot + 1, right);
  }
  return arr;
}

async function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for(let j = left; j < right; j++) {
    if(arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// Sorting algorithm visualization
// Array size: 1000 elements
// Algorithm: Quick Sort
// Time complexity: O(n log n)
// Comparisons: 8,432
// Swaps: 2,156`,
};

type ProgramKey = keyof typeof DEMO_PROGRAMS;

interface VMState {
  isRunning: boolean;
  speed: number;
  memory: number;
  cpu: number;
  output: string[];
  currentLine: number;
}

export default function VirtualMachinePage() {
  const [selectedProgram, setSelectedProgram] = useState<ProgramKey>("matrix");
  const [vmState, setVmState] = useState<VMState>({
    isRunning: false,
    speed: 50,
    memory: 256,
    cpu: 0,
    output: [],
    currentLine: 0,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const currentCode = DEMO_PROGRAMS[selectedProgram];
  const codeLines = currentCode.split("\n");

  const startVM = useCallback(() => {
    setVmState((prev) => ({
      ...prev,
      isRunning: true,
      output: ["Initializing virtual machine...", "Loading program..."],
      currentLine: 0,
    }));
  }, []);

  const stopVM = useCallback(() => {
    setVmState((prev) => ({
      ...prev,
      isRunning: false,
      cpu: 0,
    }));
  }, []);

  const resetVM = useCallback(() => {
    setVmState({
      isRunning: false,
      speed: 50,
      memory: 256,
      cpu: 0,
      output: [],
      currentLine: 0,
    });
  }, []);

  // Simulate VM execution
  useEffect(() => {
    if (!vmState.isRunning) return;

    const interval = setInterval(() => {
      setVmState((prev) => {
        if (prev.currentLine >= codeLines.length) {
          return {
            ...prev,
            isRunning: false,
            cpu: 0,
            output: [...prev.output, "Program completed successfully.", "VM shutting down..."],
          };
        }

        const nextLine = codeLines[prev.currentLine];
        const newOutput = nextLine.trim() 
          ? [...prev.output, `> ${nextLine}`]
          : prev.output;

        return {
          ...prev,
          currentLine: prev.currentLine + 1,
          output: newOutput.slice(-50), // Keep last 50 lines
          cpu: Math.floor(Math.random() * 30) + 20,
          memory: prev.memory + Math.floor(Math.random() * 10) - 5,
        };
      });
    }, 1000 / vmState.speed);

    return () => clearInterval(interval);
  }, [vmState.isRunning, vmState.speed, codeLines]);

  const programInfo = {
    matrix: {
      name: "Matrix Rain",
      description: "Digital rain simulation inspired by The Matrix",
      icon: Code2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    particles: {
      name: "Particle System",
      description: "Physics-based particle simulation with lifecycle",
      icon: Sparkles,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    fractal: {
      name: "Fractal Explorer",
      description: "Mandelbrot set computation and visualization",
      icon: Palette,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    neural: {
      name: "Neural Network",
      description: "Feed-forward neural network simulation",
      icon: Cpu,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    crypto: {
      name: "Blockchain",
      description: "Cryptographic hashing and mining simulation",
      icon: Globe,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    sort: {
      name: "Sorting Visualizer",
      description: "Quick sort algorithm with step-by-step execution",
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  };

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
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-medium">Virtual Machine</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Code Execution Sandbox
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Run simulations and visualize algorithms in a virtual environment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Program Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Programs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(Object.keys(programInfo) as ProgramKey[]).map((key) => {
                  const info = programInfo[key];
                  const Icon = info.icon;

                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedProgram(key);
                        resetVM();
                      }}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        selectedProgram === key
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${info.bgColor}`}>
                          <Icon className={`h-5 w-5 ${info.color}`} />
                        </div>
                        <div>
                          <p className="font-medium">{info.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* VM Settings */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4" />
                  VM Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Execution Speed</Label>
                    <span className="text-sm text-muted-foreground">{vmState.speed}x</span>
                  </div>
                  <Slider
                    value={[vmState.speed]}
                    onValueChange={([v]) =>
                      setVmState((prev) => ({ ...prev, speed: v }))
                    }
                    min={1}
                    max={100}
                    disabled={vmState.isRunning}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isMuted}
                      onCheckedChange={setIsMuted}
                    />
                    <Label className="cursor-pointer">
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {isMuted ? "Muted" : "Sound On"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* VM Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className={`h-full ${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-sm font-mono text-muted-foreground">
                      {programInfo[selectedProgram].name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
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
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Tabs defaultValue="terminal" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="terminal">Terminal</TabsTrigger>
                    <TabsTrigger value="code">Source Code</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="terminal" className="m-0">
                    <div className="bg-black text-green-400 font-mono text-sm p-4 h-[400px] overflow-auto">
                      <div className="mb-4 text-muted-foreground">
                        ╔═══════════════════════════════════════════════════════════════╗
                        <br />
                        ║ NEMO VIRTUAL MACHINE v2.0 ║
                        <br />
                        ║ Type-safe • Sandboxed • Interactive ║
                        <br />
                        ╚═══════════════════════════════════════════════════════════════╝
                      </div>

                      <AnimatePresence>
                        {vmState.output.map((line, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-1"
                          >
                            {line}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {vmState.isRunning && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                          className="inline-block w-2 h-4 bg-green-400 ml-1"
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="m-0">
                    <div className="bg-zinc-950 text-zinc-100 font-mono text-sm p-4 h-[400px] overflow-auto">
                      <pre>
                        {codeLines.map((line, i) => (
                          <div
                            key={i}
                            className={`flex ${
                              i === vmState.currentLine - 1 && vmState.isRunning
                                ? "bg-primary/20"
                                : ""
                            }`}
                          >
                            <span className="w-12 text-zinc-600 select-none text-right pr-4">
                              {i + 1}
                            </span>
                            <span className="flex-1">{line || " "}</span>
                          </div>
                        ))}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="m-0 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">CPU Usage</p>
                          <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold">{vmState.cpu}%</p>
                            <div className="flex-1 h-8 bg-muted rounded overflow-hidden">
                              <motion.div
                                className="h-full bg-primary"
                                animate={{ width: `${vmState.cpu}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">Memory</p>
                          <p className="text-3xl font-bold">{vmState.memory} MB</p>
                          <Progress
                            value={(vmState.memory / 512) * 100}
                            className="mt-2"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">Lines Executed</p>
                          <p className="text-3xl font-bold">{vmState.currentLine}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            of {codeLines.length} total
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge
                            variant={vmState.isRunning ? "default" : "secondary"}
                          >
                            {vmState.isRunning ? "Running" : "Idle"}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Control Bar */}
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="flex items-center gap-2">
                    {!vmState.isRunning ? (
                      <Button onClick={startVM}>
                        <Play className="h-4 w-4 mr-2" />
                        Run
                      </Button>
                    ) : (
                      <Button variant="destructive" onClick={stopVM}>
                        <Pause className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    )}

                    <Button variant="outline" onClick={resetVM}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
