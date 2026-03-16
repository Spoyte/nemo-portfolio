"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Matter from "matter-js";
import { 
  MousePointer2, 
  RefreshCw, 
  Circle, 
  Square, 
  Triangle,
  Trash2,
  Play,
  Pause,
  Gravity,
  Wind,
  Sparkles,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function PhysicsPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [gravity, setGravity] = useState(1);
  const [objectCount, setObjectCount] = useState(0);
  const [selectedTool, setSelectedTool] = useState<"circle" | "square" | "triangle">("circle");
  const [showTrail, setShowTrail] = useState(false);

  // Initialize Matter.js
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    // Create engine
    const engine = Engine.create();
    engine.gravity.y = gravity;
    engineRef.current = engine;

    // Get container dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio,
      },
    });
    renderRef.current = render;

    // Create walls
    const wallOptions = { 
      isStatic: true, 
      render: { 
        fillStyle: 'rgba(139, 92, 246, 0.3)',
        strokeStyle: 'rgba(139, 92, 246, 0.5)',
        lineWidth: 2
      } 
    };
    
    const walls = [
      Bodies.rectangle(width / 2, height + 30, width, 60, wallOptions), // Floor
      Bodies.rectangle(width / 2, -30, width, 60, wallOptions), // Ceiling
      Bodies.rectangle(-30, height / 2, 60, height, wallOptions), // Left wall
      Bodies.rectangle(width + 30, height / 2, 60, height, wallOptions), // Right wall
    ];
    Composite.add(engine.world, walls);

    // Add mouse control
    const mouse = Mouse.create(canvasRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
    Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Handle clicks to create objects
    Events.on(mouseConstraint, 'mousedown', (event) => {
      const mousePosition = event.mouse.position;
      
      // Don't create if clicking on existing body
      const bodies = Composite.allBodies(engine.world);
      const clickedBody = Matter.Query.point(bodies, mousePosition);
      
      if (clickedBody.length === 0 || clickedBody.every(b => b.isStatic)) {
        createObject(mousePosition.x, mousePosition.y);
      }
    });

    // Run the renderer
    Render.run(render);

    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !renderRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;
      
      // Update wall positions
      Composite.clear(engine.world, false, true);
      
      const newWalls = [
        Bodies.rectangle(newWidth / 2, newHeight + 30, newWidth, 60, wallOptions),
        Bodies.rectangle(newWidth / 2, -30, newWidth, 60, wallOptions),
        Bodies.rectangle(-30, newHeight / 2, 60, newHeight, wallOptions),
        Bodies.rectangle(newWidth + 30, newHeight / 2, 60, newHeight, wallOptions),
      ];
      Composite.add(engine.world, [...newWalls, mouseConstraint]);
    };

    window.addEventListener('resize', handleResize);

    // Add some initial objects
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createObject(width / 2 + (Math.random() - 0.5) * 200, 100 + i * 50);
        }, i * 200);
      }
    }, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  // Create object based on selected tool
  const createObject = useCallback((x: number, y: number) => {
    if (!engineRef.current) return;
    const { Bodies } = Matter;

    const colors = [
      '#6366f1', '#ec4899', '#06b6d4', '#f59e0b', 
      '#10b981', '#8b5cf6', '#f97316', '#ef4444'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 30 + Math.random() * 30;

    let body;
    const commonOptions = {
      restitution: 0.7,
      friction: 0.1,
      render: {
        fillStyle: color,
        strokeStyle: 'rgba(255,255,255,0.3)',
        lineWidth: 2,
      },
    };

    switch (selectedTool) {
      case 'circle':
        body = Bodies.circle(x, y, size / 2, commonOptions);
        break;
      case 'square':
        body = Bodies.rectangle(x, y, size, size, {
          ...commonOptions,
          chamfer: { radius: 4 },
        });
        break;
      case 'triangle':
        body = Bodies.polygon(x, y, 3, size / 2, commonOptions);
        break;
    }

    if (body) {
      Matter.Composite.add(engineRef.current.world, body);
      setObjectCount(prev => prev + 1);
      
      // Add pop animation effect
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawPopEffect(ctx, x, y, color);
        }
      }
    }
  }, [selectedTool]);

  // Pop effect animation
  const drawPopEffect = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    let radius = 0;
    const maxRadius = 50;
    const animate = () => {
      radius += 3;
      ctx.save();
      ctx.globalAlpha = 1 - (radius / maxRadius);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      
      if (radius < maxRadius) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  };

  // Update gravity
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.gravity.y = gravity;
    }
  }, [gravity]);

  // Toggle simulation
  const toggleSimulation = () => {
    if (!runnerRef.current || !engineRef.current) return;
    
    if (isRunning) {
      Matter.Runner.stop(runnerRef.current);
    } else {
      Matter.Runner.run(runnerRef.current, engineRef.current);
    }
    setIsRunning(!isRunning);
  };

  // Clear all objects
  const clearObjects = () => {
    if (!engineRef.current) return;
    
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    const dynamicBodies = bodies.filter(b => !b.isStatic);
    
    Matter.Composite.remove(engineRef.current.world, dynamicBodies);
    setObjectCount(0);
    toast.success("Canvas cleared!");
  };

  // Apply wind force
  const applyWind = () => {
    if (!engineRef.current) return;
    
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach(body => {
      if (!body.isStatic) {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.3) * 0.05 * body.mass,
          y: -0.02 * body.mass,
        });
      }
    });
    
    toast.success("💨 Wind applied!");
  };

  // Explode all objects
  const explode = () => {
    if (!engineRef.current) return;
    
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach(body => {
      if (!body.isStatic) {
        const force = 0.1 * body.mass;
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * force,
          y: -force,
        });
      }
    });
    
    toast.success("💥 Explosion!");
  };

  // Download snapshot
  const downloadSnapshot = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `physics-playground-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
    toast.success("Snapshot saved!");
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background via-indigo-950/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Physics</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Physics{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Playground
            </span>
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click anywhere to spawn shapes. Drag to throw. Experiment with gravity and forces.
            Powered by Matter.js physics engine.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Tool Selection */}
            <div className="p-4 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-3">Shape Tool</h3>
              <div className="flex gap-2">
                {[
                  { id: "circle", icon: Circle, label: "Circle" },
                  { id: "square", icon: Square, label: "Square" },
                  { id: "triangle", icon: Triangle, label: "Triangle" },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id as typeof selectedTool)}
                    className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                      selectedTool === tool.id
                        ? "bg-indigo-500/20 border-2 border-indigo-500"
                        : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                    }`}
                  >
                    <tool.icon className="w-5 h-5" />
                    <span className="text-xs">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Physics Controls */}
            <div className="p-4 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-3">Physics</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Gravity</span>
                    <span className="text-sm text-muted-foreground">{gravity.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[gravity * 50]}
                    onValueChange={([v]) => setGravity(v / 50)}
                    max={200}
                    step={10}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-3">Actions</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSimulation}
                >
                  {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {isRunning ? "Pause" : "Play"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyWind}
                >
                  <Wind className="w-4 h-4 mr-1" />
                  Wind
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={explode}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Boom!
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearObjects}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Objects</span>
                <Badge variant="secondary">{objectCount}</Badge>
              </div>
            </div>
          </motion.div>

          {/* Canvas Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div
              ref={containerRef}
              className="relative rounded-2xl overflow-hidden bg-black/50 border border-border h-[500px] lg:h-[600px]"
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair"
              />
              
              {/* Overlay instructions */}
              <AnimatePresence>
                {objectCount === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="text-center text-white/50">
                      <MousePointer2 className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">Click anywhere to spawn shapes</p>
                      <p className="text-sm">Drag to throw • Watch them bounce</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top right controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={downloadSnapshot}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
