"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Zap,
  Layers,
  GitBranch,
  Sparkles,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Neuron {
  id: number;
  x: number;
  y: number;
  layer: number;
  activation: number;
  bias: number;
}

interface Connection {
  from: number;
  to: number;
  weight: number;
}

interface NetworkConfig {
  layers: number[];
  learningRate: number;
  activationFunction: "sigmoid" | "relu" | "tanh";
}

export function NeuralNetworkVisualizer() {
  const [config, setConfig] = useState<NetworkConfig>({
    layers: [3, 5, 4, 2],
    learningRate: 0.1,
    activationFunction: "sigmoid",
  });
  
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1);
  const [showWeights, setShowWeights] = useState(true);
  const [selectedNeuron, setSelectedNeuron] = useState<Neuron | null>(null);
  const [inputData, setInputData] = useState([0.5, 0.3, 0.8]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Activation functions
  const activate = useCallback((x: number, type: string): number => {
    switch (type) {
      case "sigmoid":
        return 1 / (1 + Math.exp(-x));
      case "relu":
        return Math.max(0, x);
      case "tanh":
        return Math.tanh(x);
      default:
        return x;
    }
  }, []);

  // Initialize network
  const initializeNetwork = useCallback(() => {
    const newNeurons: Neuron[] = [];
    const newConnections: Connection[] = [];
    let neuronId = 0;

    config.layers.forEach((layerSize, layerIndex) => {
      for (let i = 0; i < layerSize; i++) {
        newNeurons.push({
          id: neuronId,
          x: 0,
          y: 0,
          layer: layerIndex,
          activation: Math.random(),
          bias: (Math.random() - 0.5) * 2,
        });
        neuronId++;
      }
    });

    // Create connections between layers
    let neuronIndex = 0;
    config.layers.forEach((layerSize, layerIndex) => {
      if (layerIndex < config.layers.length - 1) {
        const nextLayerSize = config.layers[layerIndex + 1];
        const nextLayerStart = neuronIndex + layerSize;
        
        for (let i = 0; i < layerSize; i++) {
          for (let j = 0; j < nextLayerSize; j++) {
            newConnections.push({
              from: neuronIndex + i,
              to: nextLayerStart + j,
              weight: (Math.random() - 0.5) * 2,
            });
          }
        }
      }
      neuronIndex += layerSize;
    });

    setNeurons(newNeurons);
    setConnections(newConnections);
    setEpoch(0);
    setLoss(1);
  }, [config.layers]);

  // Calculate neuron positions
  const calculatePositions = useCallback((width: number, height: number) => {
    const layerWidth = width / (config.layers.length + 1);
    
    return neurons.map((neuron) => {
      const layerX = (neuron.layer + 1) * layerWidth;
      const layerSize = config.layers[neuron.layer];
      const neuronSpacing = height / (layerSize + 1);
      const layerY = (neuron.id % layerSize + 1) * neuronSpacing;
      
      return { ...neuron, x: layerX, y: layerY };
    });
  }, [neurons, config.layers]);

  // Forward propagation
  const forwardProp = useCallback(() => {
    setNeurons((prevNeurons) => {
      const newNeurons = [...prevNeurons];
      
      // Set input layer
      inputData.forEach((value, i) => {
        if (newNeurons[i]) {
          newNeurons[i].activation = value;
        }
      });

      // Propagate through layers
      for (let layer = 1; layer < config.layers.length; layer++) {
        const layerNeurons = newNeurons.filter((n) => n.layer === layer);
        const prevLayerNeurons = newNeurons.filter((n) => n.layer === layer - 1);
        
        layerNeurons.forEach((neuron) => {
          let sum = neuron.bias;
          
          prevLayerNeurons.forEach((prevNeuron) => {
            const conn = connections.find(
              (c) => c.from === prevNeuron.id && c.to === neuron.id
            );
            if (conn) {
              sum += prevNeuron.activation * conn.weight;
            }
          });
          
          neuron.activation = activate(sum, config.activationFunction);
        });
      }
      
      return newNeurons;
    });
  }, [connections, inputData, config.activationFunction, activate, config.layers.length]);

  // Training simulation
  const train = useCallback(() => {
    setConnections((prevConnections) => {
      return prevConnections.map((conn) => ({
        ...conn,
        weight: conn.weight + (Math.random() - 0.5) * config.learningRate * 0.1,
      }));
    });
    
    setLoss((prev) => Math.max(0.01, prev * 0.99));
    setEpoch((prev) => prev + 1);
    forwardProp();
  }, [config.learningRate, forwardProp]);

  // Animation loop
  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(train, 100);
      return () => clearInterval(interval);
    }
  }, [isTraining, train]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      const positionedNeurons = calculatePositions(width, height);

      // Draw connections
      connections.forEach((conn) => {
        const fromNeuron = positionedNeurons.find((n) => n.id === conn.from);
        const toNeuron = positionedNeurons.find((n) => n.id === conn.to);
        
        if (fromNeuron && toNeuron) {
          const gradient = ctx.createLinearGradient(
            fromNeuron.x, fromNeuron.y, toNeuron.x, toNeuron.y
          );
          
          const alpha = Math.abs(conn.weight) * 0.5 + 0.1;
          const color = conn.weight > 0 ? "34, 197, 94" : "239, 68, 68";
          
          gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
          gradient.addColorStop(1, `rgba(${color}, ${alpha})`);
          
          ctx.beginPath();
          ctx.moveTo(fromNeuron.x, fromNeuron.y);
          ctx.lineTo(toNeuron.x, toNeuron.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = Math.abs(conn.weight) * 2;
          ctx.stroke();

          // Draw weight value if enabled
          if (showWeights) {
            const midX = (fromNeuron.x + toNeuron.x) / 2;
            const midY = (fromNeuron.y + toNeuron.y) / 2;
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.font = "10px monospace";
            ctx.textAlign = "center";
            ctx.fillText(conn.weight.toFixed(2), midX, midY);
          }
        }
      });

      // Draw neurons
      positionedNeurons.forEach((neuron) => {
        const radius = 20;
        const isSelected = selectedNeuron?.id === neuron.id;
        
        // Glow effect
        if (neuron.activation > 0.5 || isSelected) {
          const gradient = ctx.createRadialGradient(
            neuron.x, neuron.y, 0,
            neuron.x, neuron.y, radius * 2
          );
          gradient.addColorStop(0, `rgba(99, 102, 241, ${neuron.activation * 0.5})`);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, radius * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Neuron body
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${0.2 + neuron.activation * 0.8})`;
        ctx.fill();
        ctx.strokeStyle = isSelected ? "#f59e0b" : "#6366f1";
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Activation value
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(neuron.activation.toFixed(2), neuron.x, neuron.y);
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [neurons, connections, calculatePositions, showWeights, selectedNeuron]);

  useEffect(() => {
    initializeNetwork();
  }, [initializeNetwork]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * window.devicePixelRatio;
    const y = (e.clientY - rect.top) * window.devicePixelRatio;

    const positionedNeurons = calculatePositions(canvas.offsetWidth, canvas.offsetHeight);
    const clickedNeuron = positionedNeurons.find((n) => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });

    setSelectedNeuron(clickedNeuron || null);
  };

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
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
            <span className="text-sm font-medium">Neural Network Playground</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Visualize Machine{" "}
            <span className="text-gradient-animated">Learning</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive neural network visualization. Watch how data flows through layers and weights adjust during training.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Network Visualization */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-[16/10] rounded-2xl bg-black/90 overflow-hidden border border-border">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="absolute inset-0 w-full h-full cursor-crosshair"
              />
              
              {/* Overlay Stats */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                  <Layers className="h-3 w-3 mr-1" />
                  {config.layers.join(" → ")}
                </Badge>
                <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                  <GitBranch className="h-3 w-3 mr-1" />
                  Epoch {epoch}
                </Badge>
              </div>

              <div className="absolute top-4 right-4">
                <Badge 
                  variant="outline" 
                  className={`border-white/20 ${
                    loss < 0.1 ? "bg-green-500/50 text-white" : "bg-black/50 text-white"
                  }`}
                >
                  Loss: {loss.toFixed(4)}
                </Badge>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex gap-4 text-xs text-white/70">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Positive Weight</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Negative Weight</span>
                </div>
              </div>
            </div>

            {/* Input Controls */}
            <div className="p-4 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Input Values
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {inputData.map((value, index) => (
                  <div key={index}>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Input {index + 1}
                    </label>
                    <Slider
                      value={[value * 100]}
                      onValueChange={([v]) => {
                        const newInput = [...inputData];
                        newInput[index] = v / 100;
                        setInputData(newInput);
                        forwardProp();
                      }}
                      max={100}
                      step={1}
                    />
                    <span className="text-xs text-muted-foreground">{value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Training Controls */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4">Training</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsTraining(!isTraining)}
                  className="flex-1"
                  variant={isTraining ? "destructive" : "default"}
                >
                  {isTraining ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isTraining ? "Stop" : "Train"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    initializeNetwork();
                    setIsTraining(false);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Network Settings */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Learning Rate</label>
                  <Slider
                    value={[config.learningRate * 100]}
                    onValueChange={([v]) => setConfig({ ...config, learningRate: v / 100 })}
                    max={50}
                    step={1}
                  />
                  <span className="text-xs text-muted-foreground">{config.learningRate.toFixed(2)}</span>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Activation</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["sigmoid", "relu", "tanh"].map((fn) => (
                      <button
                        key={fn}
                        onClick={() => setConfig({ ...config, activationFunction: fn as any })}
                        className={`px-3 py-2 rounded-lg text-xs capitalize transition-colors ${
                          config.activationFunction === fn
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        {fn}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Weights</span>
                  <Switch checked={showWeights} onCheckedChange={setShowWeights} />
                </div>
              </div>
            </div>

            {/* Selected Neuron Info */}
            <AnimatePresence>
              {selectedNeuron && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20"
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Neuron Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID</span>
                      <span>#{selectedNeuron.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Layer</span>
                      <span>{selectedNeuron.layer + 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Activation</span>
                      <span>{selectedNeuron.activation.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bias</span>
                      <span>{selectedNeuron.bias.toFixed(4)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fun Fact */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Neural networks are inspired by brains!</p>
                  <p className="text-xs text-muted-foreground">
                    Each artificial neuron mimics how biological neurons fire signals. 
                    The connections (synapses) strengthen with training, just like learning!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
