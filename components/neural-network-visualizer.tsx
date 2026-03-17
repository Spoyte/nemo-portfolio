"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Brain,
  Zap,
  Layers,
  Activity,
  Settings2,
  Plus,
  Minus,
  MousePointer2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface Neuron {
  id: string;
  x: number;
  y: number;
  layer: number;
  activation: number;
  bias: number;
}

interface Connection {
  from: string;
  to: string;
  weight: number;
}

interface NetworkConfig {
  layers: number[];
  learningRate: number;
  activationFunction: "sigmoid" | "relu" | "tanh";
}

export function NeuralNetworkVisualizer() {
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1.0);
  const [config, setConfig] = useState<NetworkConfig>({
    layers: [4, 6, 6, 3],
    learningRate: 0.1,
    activationFunction: "sigmoid",
  });
  const [hoveredNeuron, setHoveredNeuron] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize network
  const initializeNetwork = useCallback(() => {
    const newNeurons: Neuron[] = [];
    const newConnections: Connection[] = [];

    let neuronId = 0;
    const layerSpacing = 200;
    const neuronSpacing = 80;

    config.layers.forEach((layerSize, layerIndex) => {
      const layerX = layerIndex * layerSpacing + 100;
      const startY = 250 - (layerSize * neuronSpacing) / 2 + neuronSpacing / 2;

      for (let i = 0; i < layerSize; i++) {
        const neuron: Neuron = {
          id: `n-${neuronId++}`,
          x: layerX,
          y: startY + i * neuronSpacing,
          layer: layerIndex,
          activation: Math.random(),
          bias: (Math.random() - 0.5) * 0.5,
        };
        newNeurons.push(neuron);

        // Connect to previous layer
        if (layerIndex > 0) {
          const prevLayerStart = newNeurons.findIndex(n => n.layer === layerIndex - 1);
          const prevLayerSize = config.layers[layerIndex - 1];
          
          for (let j = 0; j < prevLayerSize; j++) {
            const prevNeuron = newNeurons[prevLayerStart + j];
            newConnections.push({
              from: prevNeuron.id,
              to: neuron.id,
              weight: (Math.random() - 0.5) * 2,
            });
          }
        }
      }
    });

    setNeurons(newNeurons);
    setConnections(newConnections);
    setEpoch(0);
    setLoss(1.0);
  }, [config.layers]);

  useEffect(() => {
    initializeNetwork();
  }, [initializeNetwork]);

  // Training simulation
  useEffect(() => {
    if (!isTraining) return;

    const train = () => {
      setNeurons(prevNeurons => {
        return prevNeurons.map(neuron => {
          if (neuron.layer === 0) {
            // Input layer - simulate data patterns
            const patterns = [
              [0.2, 0.8, 0.3, 0.6],
              [0.9, 0.1, 0.7, 0.4],
              [0.5, 0.5, 0.5, 0.5],
              [0.1, 0.9, 0.2, 0.8],
            ];
            const pattern = patterns[selectedPattern % patterns.length];
            const index = prevNeurons.filter(n => n.layer === 0).indexOf(neuron);
            return {
              ...neuron,
              activation: pattern[index] || Math.random(),
            };
          }
          
          // Hidden and output layers
          const incomingConnections = connections.filter(c => c.to === neuron.id);
          let sum = neuron.bias;
          
          incomingConnections.forEach(conn => {
            const fromNeuron = prevNeurons.find(n => n.id === conn.from);
            if (fromNeuron) {
              sum += fromNeuron.activation * conn.weight;
            }
          });

          // Apply activation function
          let activation: number;
          switch (config.activationFunction) {
            case "relu":
              activation = Math.max(0, sum);
              break;
            case "tanh":
              activation = Math.tanh(sum);
              break;
            case "sigmoid":
            default:
              activation = 1 / (1 + Math.exp(-sum));
          }

          return {
            ...neuron,
            activation: Math.max(0, Math.min(1, activation)),
          };
        });
      });

      setEpoch(e => e + 1);
      setLoss(l => Math.max(0.01, l * 0.999 + Math.random() * 0.01));
      setSelectedPattern(p => (p + 1) % 4);
    };

    const interval = setInterval(train, 200);
    return () => clearInterval(interval);
  }, [isTraining, connections, config.activationFunction, selectedPattern]);

  const getNeuronColor = (activation: number) => {
    const hue = 200 + activation * 60; // Blue to purple
    const saturation = 70 + activation * 30;
    const lightness = 40 + activation * 40;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getConnectionColor = (weight: number) => {
    const intensity = Math.abs(weight);
    if (weight > 0) {
      return `rgba(34, 197, 94, ${intensity * 0.6})`; // Green for positive
    }
    return `rgba(239, 68, 68, ${intensity * 0.6})`; // Red for negative
  };

  const addLayer = () => {
    if (config.layers.length < 6) {
      const newLayers = [...config.layers];
      newLayers.splice(newLayers.length - 1, 0, 4);
      setConfig({ ...config, layers: newLayers });
    }
  };

  const removeLayer = () => {
    if (config.layers.length > 2) {
      const newLayers = [...config.layers];
      newLayers.splice(newLayers.length - 2, 1);
      setConfig({ ...config, layers: newLayers });
    }
  };

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-blue-950/5 to-background overflow-hidden">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 mb-6"
          >
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">AI Visualization</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Neural Network{" "}
            <span className="text-gradient-animated">Playground</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch a neural network learn in real-time. Visualize activations, 
            weights, and the flow of information through connected neurons.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Network Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
              {/* Stats Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-slate-900/80">
                    <Activity className="h-3 w-3 mr-1" />
                    Epoch: {epoch.toLocaleString()}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-900/80">
                    <Layers className="h-3 w-3 mr-1" />
                    Loss: {loss.toFixed(4)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-green-500">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Positive
                  </div>
                  <div className="flex items-center gap-1 text-xs text-red-500">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Negative
                  </div>
                </div>
              </div>

              {/* SVG Network */}
              <svg
                ref={svgRef}
                viewBox="0 0 800 500"
                className="w-full h-[500px]"
              >
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1"/>
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Connections */}
                <g className="connections">
                  {connections.map((conn, i) => {
                    const fromNeuron = neurons.find(n => n.id === conn.from);
                    const toNeuron = neurons.find(n => n.id === conn.to);
                    if (!fromNeuron || !toNeuron) return null;

                    const isHighlighted = hoveredNeuron === conn.from || hoveredNeuron === conn.to;
                    
                    return (
                      <motion.line
                        key={`${conn.from}-${conn.to}`}
                        x1={fromNeuron.x}
                        y1={fromNeuron.y}
                        x2={toNeuron.x}
                        y2={toNeuron.y}
                        stroke={getConnectionColor(conn.weight)}
                        strokeWidth={Math.abs(conn.weight) * 3}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                          pathLength: 1, 
                          opacity: isHighlighted ? 1 : 0.3,
                          strokeWidth: isHighlighted ? Math.abs(conn.weight) * 5 : Math.abs(conn.weight) * 2,
                        }}
                        transition={{ duration: 0.5, delay: i * 0.001 }}
                      />
                    );
                  })}
                </g>

                {/* Neurons */}
                <g className="neurons">
                  {neurons.map((neuron, i) => (
                    <motion.g
                      key={neuron.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.02, type: "spring" }}
                      onMouseEnter={() => setHoveredNeuron(neuron.id)}
                      onMouseLeave={() => setHoveredNeuron(null)}
                      className="cursor-pointer"
                    >
                      {/* Glow Effect */}
                      <circle
                        cx={neuron.x}
                        cy={neuron.y}
                        r={25 + neuron.activation * 10}
                        fill={getNeuronColor(neuron.activation)}
                        opacity={0.2}
                        filter="url(#glow)"
                      />
                      
                      {/* Main Circle */}
                      <motion.circle
                        cx={neuron.x}
                        cy={neuron.y}
                        r={20}
                        fill={getNeuronColor(neuron.activation)}
                        stroke="white"
                        strokeWidth={hoveredNeuron === neuron.id ? 3 : 1}
                        animate={{
                          r: 15 + neuron.activation * 10,
                        }}
                        transition={{ duration: 0.2 }}
                      />
                      
                      {/* Activation Value */}
                      <text
                        x={neuron.x}
                        y={neuron.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {neuron.activation.toFixed(2)}
                      </text>

                      {/* Layer Label */}
                      {neuron.layer === 0 && neurons.filter(n => n.layer === 0).indexOf(neuron) === 0 && (
                        <text
                          x={neuron.x}
                          y={neuron.y - 50}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="12"
                        >
                          Input
                        </text>
                      )}
                      {neuron.layer === config.layers.length - 1 && neurons.filter(n => n.layer === config.layers.length - 1).indexOf(neuron) === 0 && (
                        <text
                          x={neuron.x}
                          y={neuron.y - 50}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="12"
                        >
                          Output
                        </text>
                      )}
                    </motion.g>
                  ))}
                </g>

                {/* Data Flow Animation */}
                {isTraining && connections.slice(0, 20).map((conn, i) => {
                  const fromNeuron = neurons.find(n => n.id === conn.from);
                  const toNeuron = neurons.find(n => n.id === conn.to);
                  if (!fromNeuron || !toNeuron) return null;

                  return (
                    <motion.circle
                      key={`pulse-${i}`}
                      r={4}
                      fill="#fbbf24"
                      filter="url(#glow)"
                      animate={{
                        cx: [fromNeuron.x, toNeuron.x],
                        cy: [fromNeuron.y, toNeuron.y],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "linear",
                      }}
                    />
                  );
                })}
              </svg>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Training Controls */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Training
              </h3>
              
              <div className="flex items-center gap-2 mb-6">
                <Button
                  variant={isTraining ? "default" : "outline"}
                  onClick={() => setIsTraining(!isTraining)}
                  className="flex-1"
                >
                  {isTraining ? (
                    <><Pause className="h-4 w-4 mr-2" /> Pause</>
                  ) : (
                    <><Play className="h-4 w-4 mr-2" /> Train</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setIsTraining(false);
                    initializeNetwork();
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Learning Rate: {config.learningRate}
                  </label>
                  <Slider
                    value={[config.learningRate * 100]}
                    onValueChange={([v]) => setConfig({ ...config, learningRate: v / 100 })}
                    min={1}
                    max={50}
                  />
                </div>
              </div>
            </div>

            {/* Architecture */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Architecture
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hidden Layers</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={removeLayer}
                      disabled={config.layers.length <= 2}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-mono">
                      {config.layers.length - 2}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={addLayer}
                      disabled={config.layers.length >= 6}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {config.layers.map((size, i) => (
                    <Badge 
                      key={i} 
                      variant={i === 0 ? "default" : i === config.layers.length - 1 ? "secondary" : "outline"}
                    >
                      {i === 0 ? "In" : i === config.layers.length - 1 ? "Out" : `H${i}`}: {size}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Activation Function */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4">Activation</h3>
              <div className="grid grid-cols-3 gap-2">
                {(["sigmoid", "relu", "tanh"] as const).map((fn) => (
                  <Button
                    key={fn}
                    variant={config.activationFunction === fn ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfig({ ...config, activationFunction: fn })}
                    className="text-xs"
                  >
                    {fn.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 mb-2">
                <MousePointer2 className="h-4 w-4" />
                <span>Hover over neurons to highlight connections</span>
              </p>
              <p className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Watch activations flow through the network</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
