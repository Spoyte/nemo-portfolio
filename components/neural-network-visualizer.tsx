"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Settings, Brain, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Node {
  id: string;
  x: number;
  y: number;
  layer: number;
  index: number;
  activation: number;
  bias: number;
}

interface Connection {
  from: string;
  to: string;
  weight: number;
  active: boolean;
}

interface NeuralNetworkProps {
  inputNodes?: number;
  hiddenLayers?: number;
  hiddenNodes?: number;
  outputNodes?: number;
}

export function NeuralNetworkVisualizer({
  inputNodes = 4,
  hiddenLayers = 2,
  hiddenNodes = 5,
  outputNodes = 3,
}: NeuralNetworkProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [learningRate, setLearningRate] = useState(0.1);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1.0);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [pulseOrigin, setPulseOrigin] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

  // Initialize network
  useEffect(() => {
    const newNodes: Node[] = [];
    const newConnections: Connection[] = [];

    // Input layer
    for (let i = 0; i < inputNodes; i++) {
      newNodes.push({
        id: `input-${i}`,
        x: 100,
        y: 150 + i * 80,
        layer: 0,
        index: i,
        activation: Math.random(),
        bias: Math.random() * 2 - 1,
      });
    }

    // Hidden layers
    for (let l = 0; l < hiddenLayers; l++) {
      for (let i = 0; i < hiddenNodes; i++) {
        newNodes.push({
          id: `hidden-${l}-${i}`,
          x: 250 + l * 150,
          y: 120 + i * 60 + (5 - hiddenNodes) * 30,
          layer: l + 1,
          index: i,
          activation: Math.random(),
          bias: Math.random() * 2 - 1,
        });
      }
    }

    // Output layer
    for (let i = 0; i < outputNodes; i++) {
      newNodes.push({
        id: `output-${i}`,
        x: 250 + hiddenLayers * 150,
        y: 200 + i * 80,
        layer: hiddenLayers + 1,
        index: i,
        activation: Math.random(),
        bias: Math.random() * 2 - 1,
      });
    }

    // Create connections
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = 0; j < newNodes.length; j++) {
        if (newNodes[j].layer === newNodes[i].layer + 1) {
          newConnections.push({
            from: newNodes[i].id,
            to: newNodes[j].id,
            weight: Math.random() * 2 - 1,
            active: false,
          });
        }
      }
    }

    setNodes(newNodes);
    setConnections(newConnections);
  }, [inputNodes, hiddenLayers, hiddenNodes, outputNodes]);

  // Activation function (sigmoid)
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  // Forward propagation
  const forwardProp = useCallback(() => {
    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];

      // Process each layer
      for (let layer = 1; layer <= hiddenLayers + 1; layer++) {
        const layerNodes = newNodes.filter((n) => n.layer === layer);

        layerNodes.forEach((node) => {
          let sum = node.bias;

          // Sum weighted inputs from previous layer
          connections
            .filter((c) => c.to === node.id)
            .forEach((conn) => {
              const fromNode = newNodes.find((n) => n.id === conn.from);
              if (fromNode) {
                sum += fromNode.activation * conn.weight;
              }
            });

          node.activation = sigmoid(sum);
        });
      }

      return newNodes;
    });

    // Update loss randomly for visualization
    setLoss((prev) => Math.max(0.01, prev * 0.99 + (Math.random() - 0.5) * 0.1));
    setEpoch((prev) => prev + 1);
  }, [connections, hiddenLayers]);

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        forwardProp();
        animationRef.current = setTimeout(() => {
          requestAnimationFrame(animate);
        }, 200);
      };
      animate();
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isRunning, forwardProp]);

  // Pulse animation through network
  const triggerPulse = (nodeId: string) => {
    setPulseOrigin(nodeId);
    setTimeout(() => setPulseOrigin(null), 1000);
  };

  // Get node color based on activation
  const getNodeColor = (activation: number) => {
    const intensity = Math.floor(activation * 255);
    return `rgb(${intensity}, ${Math.floor(intensity * 0.5)}, ${255 - intensity})`;
  };

  // Get connection color based on weight
  const getConnectionColor = (weight: number) => {
    if (weight > 0) {
      return `rgba(34, 197, 94, ${Math.abs(weight) * 0.5 + 0.2})`;
    }
    return `rgba(239, 68, 68, ${Math.abs(weight) * 0.5 + 0.2})`;
  };

  const resetNetwork = () => {
    setEpoch(0);
    setLoss(1.0);
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        activation: Math.random(),
        bias: Math.random() * 2 - 1,
      }))
    );
    setConnections((prev) =>
      prev.map((c) => ({
        ...c,
        weight: Math.random() * 2 - 1,
      }))
    );
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-muted/50 rounded-xl">
        <Button
          variant={isRunning ? "default" : "outline"}
          size="sm"
          onClick={() => setIsRunning(!isRunning)}
          className="gap-2"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Pause" : "Train"}
        </Button>

        <Button variant="outline" size="sm" onClick={resetNetwork} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">Learning Rate</span>
          <Slider
            value={[learningRate * 100]}
            onValueChange={(v) => setLearningRate(v[0] / 100)}
            max={50}
            step={1}
            className="flex-1"
          />
          <span className="text-sm font-mono w-12">{learningRate.toFixed(2)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-primary/5 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Activity className="h-4 w-4" />
            <span className="text-sm">Epoch</span>
          </div>
          <span className="text-2xl font-bold font-mono">{epoch.toLocaleString()}</span>
        </div>
        <div className="p-4 bg-primary/5 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Zap className="h-4 w-4" />
            <span className="text-sm">Loss</span>
          </div>
          <span className="text-2xl font-bold font-mono">{loss.toFixed(4)}</span>
        </div>
        <div className="p-4 bg-primary/5 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Brain className="h-4 w-4" />
            <span className="text-sm">Parameters</span>
          </div>
          <span className="text-2xl font-bold font-mono">
            {connections.length + nodes.length}
          </span>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="relative bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 600 500"
          className="w-full h-auto"
          style={{ minHeight: "400px" }}
        >
          {/* Connections */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const isPulsing = pulseOrigin === conn.from;

            return (
              <motion.line
                key={`${conn.from}-${conn.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={getConnectionColor(conn.weight)}
                strokeWidth={Math.abs(conn.weight) * 2 + 0.5}
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: isPulsing ? [0.3, 1, 0.3] : 0.6,
                }}
                transition={{
                  pathLength: { duration: 0.5, delay: idx * 0.001 },
                  opacity: isPulsing ? { duration: 0.5, repeat: 2 } : {},
                }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <motion.g
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: node.layer * 0.1 + node.index * 0.05 }}
              onClick={() => {
                setSelectedNode(node);
                triggerPulse(node.id);
              }}
              className="cursor-pointer"
            >
              {/* Node glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                fill={getNodeColor(node.activation)}
                opacity={0.3}
                className="animate-pulse"
              />
              {/* Node body */}
              <circle
                cx={node.x}
                cy={node.y}
                r={12}
                fill={getNodeColor(node.activation)}
                stroke="white"
                strokeWidth={selectedNode?.id === node.id ? 3 : 1}
                className="transition-all duration-200"
              />
              {/* Activation value */}
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {node.activation.toFixed(2)}
              </text>
            </motion.g>
          ))}

          {/* Layer labels */}
          <text x={100} y={50} textAnchor="middle" className="fill-muted-foreground text-sm">
            Input Layer
          </text>
          {Array.from({ length: hiddenLayers }).map((_, i) => (
            <text
              key={i}
              x={250 + i * 150}
              y={50}
              textAnchor="middle"
              className="fill-muted-foreground text-sm"
            >
              Hidden {i + 1}
            </text>
          ))}
          <text
            x={250 + hiddenLayers * 150}
            y={50}
            textAnchor="middle"
            className="fill-muted-foreground text-sm"
          >
            Output
          </text>
        </svg>

        {/* Node Details Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 p-4 bg-card/95 backdrop-blur border rounded-xl shadow-xl min-w-[200px]"
            >
              <h4 className="font-semibold mb-2">Node Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono">{selectedNode.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Layer:</span>
                  <span>{selectedNode.layer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activation:</span>
                  <span className="font-mono">{selectedNode.activation.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bias:</span>
                  <span className="font-mono">{selectedNode.bias.toFixed(4)}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="w-full mt-3"
                onClick={() => setSelectedNode(null)}
              >
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Positive Weight</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Negative Weight</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>High Activation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span>Low Activation</span>
        </div>
      </div>
    </div>
  );
}
