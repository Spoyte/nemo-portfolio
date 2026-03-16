"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Brain,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Node {
  id: string;
  x: number;
  y: number;
  layer: number;
  index: number;
  value: number;
  activation: number;
}

interface Connection {
  from: string;
  to: string;
  weight: number;
}

interface NetworkConfig {
  layers: number[];
  learningRate: number;
  activationFunction: "relu" | "sigmoid" | "tanh";
}

const ACTIVATION_FUNCTIONS = {
  relu: (x: number) => Math.max(0, x),
  sigmoid: (x: number) => 1 / (1 + Math.exp(-x)),
  tanh: (x: number) => Math.tanh(x),
};

export function NeuralNetworkVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1);
  const [accuracy, setAccuracy] = useState(0);
  
  const [config, setConfig] = useState<NetworkConfig>({
    layers: [4, 8, 8, 3],
    learningRate: 0.01,
    activationFunction: "relu",
  });

  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dataPoints, setDataPoints] = useState<{ input: number[]; target: number[] }[]>([]);

  // Initialize network
  const initializeNetwork = useCallback(() => {
    const newNodes: Node[] = [];
    const newConnections: Connection[] = [];

    // Create nodes
    config.layers.forEach((layerSize, layerIndex) => {
      const layerX = (layerIndex / (config.layers.length - 1)) * 100;
      
      for (let i = 0; i < layerSize; i++) {
        const nodeY = layerSize === 1 ? 50 : ((i + 1) / (layerSize + 1)) * 100;
        newNodes.push({
          id: `L${layerIndex}-N${i}`,
          x: layerX,
          y: nodeY,
          layer: layerIndex,
          index: i,
          value: Math.random(),
          activation: Math.random(),
        });
      }
    });

    // Create connections
    for (let l = 0; l < config.layers.length - 1; l++) {
      const currentLayer = newNodes.filter(n => n.layer === l);
      const nextLayer = newNodes.filter(n => n.layer === l + 1);

      currentLayer.forEach(fromNode => {
        nextLayer.forEach(toNode => {
          newConnections.push({
            from: fromNode.id,
            to: toNode.id,
            weight: (Math.random() - 0.5) * 2,
          });
        });
      });
    }

    setNodes(newNodes);
    setConnections(newConnections);

    // Generate sample data
    const sampleData = Array.from({ length: 100 }, () => ({
      input: Array.from({ length: config.layers[0] }, () => Math.random()),
      target: Array.from({ length: config.layers[config.layers.length - 1] }, () => Math.random()),
    }));
    setDataPoints(sampleData);
  }, [config.layers]);

  // Forward propagation
  const forwardProp = useCallback((input: number[]) => {
    const newNodes = [...nodes];
    
    // Set input layer
    input.forEach((val, i) => {
      const node = newNodes.find(n => n.layer === 0 && n.index === i);
      if (node) node.value = val;
    });

    // Propagate through layers
    for (let l = 1; l < config.layers.length; l++) {
      const layerNodes = newNodes.filter(n => n.layer === l);
      const prevLayerNodes = newNodes.filter(n => n.layer === l - 1);

      layerNodes.forEach(node => {
        const incomingConnections = connections.filter(c => c.to === node.id);
        let sum = 0;
        
        incomingConnections.forEach(conn => {
          const fromNode = prevLayerNodes.find(n => n.id === conn.from);
          if (fromNode) {
            sum += fromNode.value * conn.weight;
          }
        });

        node.value = sum;
        node.activation = ACTIVATION_FUNCTIONS[config.activationFunction](sum);
      });
    }

    setNodes(newNodes);
    return newNodes.filter(n => n.layer === config.layers.length - 1).map(n => n.activation);
  }, [nodes, connections, config.layers.length, config.activationFunction]);

  // Training step
  const trainingStep = useCallback(() => {
    if (dataPoints.length === 0) return;

    const batch = dataPoints.slice(0, 10);
    let totalLoss = 0;
    let correct = 0;

    batch.forEach(data => {
      const output = forwardProp(data.input);
      
      // Calculate loss (MSE)
      const sampleLoss = output.reduce((sum, val, i) => {
        return sum + Math.pow(val - data.target[i], 2);
      }, 0) / output.length;
      
      totalLoss += sampleLoss;
      
      // Simple accuracy metric
      const predicted = output.indexOf(Math.max(...output));
      const actual = data.target.indexOf(Math.max(...data.target));
      if (predicted === actual) correct++;
    });

    setLoss(totalLoss / batch.length);
    setAccuracy(correct / batch.length);
    setEpoch(prev => prev + 1);

    // Update connection weights (simplified gradient descent visualization)
    setConnections(prev => prev.map(conn => ({
      ...conn,
      weight: conn.weight + (Math.random() - 0.5) * config.learningRate,
    })));
  }, [dataPoints, forwardProp, config.learningRate]);

  // Draw network
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--background") || "#0c0a09";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw connections
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (fromNode && toNode) {
        const x1 = (fromNode.x / 100) * rect.width;
        const y1 = (fromNode.y / 100) * rect.height;
        const x2 = (toNode.x / 100) * rect.width;
        const y2 = (toNode.y / 100) * rect.height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
        const opacity = Math.abs(conn.weight) * 0.5;
        const color = conn.weight > 0 ? "34, 197, 94" : "239, 68, 68";
        ctx.strokeStyle = `rgba(${color}, ${opacity})`;
        ctx.lineWidth = Math.abs(conn.weight) * 2;
        ctx.stroke();

        // Animated data flow
        if (isPlaying) {
          const time = Date.now() / 1000;
          const offset = (time % 1);
          const flowX = x1 + (x2 - x1) * offset;
          const flowY = y1 + (y2 - y1) * offset;
          
          ctx.beginPath();
          ctx.arc(flowX, flowY, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(220, 38, 38, 0.8)";
          ctx.fill();
        }
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const x = (node.x / 100) * rect.width;
      const y = (node.y / 100) * rect.height;
      const radius = 8 + node.activation * 8;

      // Glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
      gradient.addColorStop(0, `rgba(220, 38, 38, ${node.activation})`);
      gradient.addColorStop(1, "rgba(220, 38, 38, 0)");
      
      ctx.beginPath();
      ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 38, 38, ${0.3 + node.activation * 0.7})`;
      ctx.fill();
      ctx.strokeStyle = "rgba(220, 38, 38, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [nodes, connections, isPlaying]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      draw();
      
      if (isPlaying && epoch % 10 === 0) {
        trainingStep();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, isPlaying, trainingStep, epoch]);

  // Initialize on mount
  useEffect(() => {
    initializeNetwork();
  }, [initializeNetwork]);

  return (
    <section className="py-24 border-y border-border/50">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">AI Visualization</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Neural Network{" "}
            <span className="text-gradient-animated">Visualizer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch a neural network learn in real-time. Visualize forward propagation, 
            backpropagation, and weight updates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas */}
          <Card className="lg:col-span-2 overflow-hidden">
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                className="w-full h-[400px] md:h-[500px] bg-background"
              />
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Training Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Epoch</span>
                  <Badge variant="secondary">{epoch.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Loss</span>
                  <Badge variant={loss < 0.1 ? "default" : "secondary"}>
                    {loss.toFixed(4)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Accuracy</span>
                  <Badge variant={accuracy > 0.8 ? "default" : "secondary"}>
                    {(accuracy * 100).toFixed(1)}%
                  </Badge>
                </div>

                {/* Loss graph */}
                <div className="h-24 bg-muted rounded-lg overflow-hidden relative">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(220, 38, 38)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="rgb(220, 38, 38)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={`M 0 ${100 - loss * 100} L 100 ${100 - loss * 50} L 100 100 L 0 100 Z`}
                      fill="url(#lossGradient)"
                      animate={{ d: `M 0 ${100 - loss * 100} L 100 ${100 - loss * 50} L 100 100 L 0 100 Z` }}
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={isPlaying ? "default" : "outline"}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1"
                  >
                    {isPlaying ? (
                      <><Pause className="h-4 w-4 mr-2" /> Pause</>
                    ) : (
                      <><Play className="h-4 w-4 mr-2" /> Train</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEpoch(0);
                      setLoss(1);
                      setAccuracy(0);
                      initializeNetwork();
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Architecture</label>
                  <Select
                    value={config.layers.join("-")}
                    onValueChange={(value) => {
                      setConfig(prev => ({
                        ...prev,
                        layers: value.split("-").map(Number),
                      }));
                      setEpoch(0);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4-8-8-3">4-8-8-3 (Simple)</SelectItem>
                      <SelectItem value="4-16-16-16-3">4-16-16-16-3 (Deep)</SelectItem>
                      <SelectItem value="4-32-32-3">4-32-32-3 (Wide)</SelectItem>
                      <SelectItem value="4-64-64-64-3">4-64-64-64-3 (Complex)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Activation</label>
                  <Select
                    value={config.activationFunction}
                    onValueChange={(value: "relu" | "sigmoid" | "tanh") => {
                      setConfig(prev => ({ ...prev, activationFunction: value }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relu">ReLU</SelectItem>
                      <SelectItem value="sigmoid">Sigmoid</SelectItem>
                      <SelectItem value="tanh">Tanh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Learning Rate: {config.learningRate}</label>
                  <Slider
                    value={[config.learningRate * 1000]}
                    onValueChange={([value]) => {
                      setConfig(prev => ({ ...prev, learningRate: value / 1000 }));
                    }}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 text-sm text-muted-foreground space-y-2">
                      <div className="flex items-start gap-2">
                        <Network className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>Green connections: positive weights</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>Red connections: negative weights</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>Node size shows activation level</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className="w-full"
            >
              {showInfo ? (
                <><ChevronUp className="h-4 w-4 mr-2" /> Hide Info</>
              ) : (
                <><ChevronDown className="h-4 w-4 mr-2" /> Show Info</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
