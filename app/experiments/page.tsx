"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Sparkles, 
  Code2,
  Zap,
  Palette,
  MousePointer2,
  Activity,
  Waves,
  Grid3X3,
  Circle,
  Triangle,
  Square,
  Hexagon,
  Star,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useCallback } from "react";

// Animated Gradient Mesh
function GradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let time = 0;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, width, height);
      
      // Create flowing gradient blobs
      for (let i = 0; i < 5; i++) {
        const x = width * 0.5 + Math.sin(time * 0.5 + i * 1.5) * width * 0.3;
        const y = height * 0.5 + Math.cos(time * 0.3 + i * 1.2) * height * 0.3;
        const radius = 100 + Math.sin(time + i) * 50;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const hue = (time * 20 + i * 60) % 360;
        gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.3)`);
        gradient.addColorStop(0.5, `hsla(${hue + 30}, 70%, 50%, 0.1)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      time += 0.01;
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64 rounded-lg bg-black"
    />
  );
}

// Interactive Particle System
function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }> = [];
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        color: `hsl(${Math.random() * 60 + 330}, 70%, 60%)`,
      });
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) * window.devicePixelRatio,
        y: (e.clientY - rect.top) * window.devicePixelRatio,
      });
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      particles.forEach((particle, i) => {
        // Mouse interaction
        const dx = mousePos.x / window.devicePixelRatio - particle.x;
        const dy = mousePos.y / window.devicePixelRatio - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          particle.vx += dx * 0.001;
          particle.vy += dy * 0.001;
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        
        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.strokeStyle = `rgba(220, 38, 38, ${0.2 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos]);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64 rounded-lg bg-black cursor-crosshair"
    />
  );
}

// Generative Pattern
function GenerativePattern() {
  const [seed, setSeed] = useState(0);
  
  const generatePattern = useCallback(() => {
    const shapes = [];
    const shapeTypes = ['circle', 'square', 'triangle', 'hexagon'];
    const colors = ['#dc2626', '#ea580c', '#d97706', '#65a30d', '#0891b2', '#7c3aed'];
    
    for (let i = 0; i < 20; i++) {
      shapes.push({
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 30 + 10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    return shapes;
  }, []);
  
  const [shapes, setShapes] = useState(generatePattern);
  
  const regenerate = () => {
    setSeed(s => s + 1);
    setShapes(generatePattern());
  };
  
  const renderShape = (shape: typeof shapes[0], index: number) => {
    const baseClasses = "absolute transition-all duration-500";
    const style = {
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: shape.size,
      height: shape.size,
      transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
      opacity: shape.opacity,
    };
    
    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={index}
            className={`${baseClasses} rounded-full`}
            style={{ ...style, backgroundColor: shape.color }}
          />
        );
      case 'square':
        return (
          <div
            key={index}
            className={baseClasses}
            style={{ ...style, backgroundColor: shape.color }}
          />
        );
      case 'triangle':
        return (
          <div
            key={index}
            className={baseClasses}
            style={{
              ...style,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
            }}
          />
        );
      case 'hexagon':
        return (
          <div
            key={index}
            className={`${baseClasses} flex items-center justify-center`}
            style={style}
          >
            <Hexagon className="w-full h-full" style={{ color: shape.color }} fill={shape.color} />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="relative">
      <div className="w-full h-64 rounded-lg bg-muted overflow-hidden relative">
        {shapes.map((shape, index) => renderShape(shape, index))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={regenerate}
        className="absolute bottom-4 right-4 gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Regenerate
      </Button>
    </div>
  );
}

// Mouse Following Effect
function MouseFollowerEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mousePosition.x, springConfig);
  const y = useSpring(mousePosition.y, springConfig);
  
  useEffect(() => {
    x.set(mousePosition.x);
    y.set(mousePosition.y);
  }, [mousePosition, x, y]);
  
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-64 rounded-lg bg-black relative overflow-hidden cursor-none"
    >
      <motion.div
        style={{ x, y }}
        className="absolute pointer-events-none"
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-primary/30"
          />
          
          {/* Inner dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary" />
          
          {/* Trailing dots */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary/50"
              style={{
                x: -i * 8,
                y: -i * 8,
              }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </div>
      </motion.div>
      
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
        <p>Move your mouse around</p>
      </div>
    </div>
  );
}

// Wave Animation
function WaveAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let time = 0;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw multiple sine waves
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `hsla(${330 + i * 20}, 70%, 60%, 0.5)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < width; x += 2) {
          const y = height / 2 + 
            Math.sin(x * 0.02 + time + i * 0.5) * 30 +
            Math.sin(x * 0.01 + time * 0.5 + i) * 20;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      time += 0.02;
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64 rounded-lg bg-black"
    />
  );
}

// Audio Visualization Placeholder
function AudioVisualization() {
  const [isPlaying, setIsPlaying] = useState(false);
  const bars = [...Array(20)].map((_, i) => ({
    id: i,
    delay: i * 0.05,
  }));
  
  return (
    <div className="w-full h-64 rounded-lg bg-black flex flex-col items-center justify-center gap-8">
      <div className="flex items-end gap-1 h-32">
        {bars.map((bar) => (
          <motion.div
            key={bar.id}
            className="w-3 bg-primary rounded-t"
            animate={isPlaying ? {
              height: [20, Math.random() * 80 + 40, 20],
            } : {
              height: 20,
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: bar.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <Button
        variant="outline"
        onClick={() => setIsPlaying(!isPlaying)}
        className="gap-2"
      >
        <Activity className="h-4 w-4" />
        {isPlaying ? "Pause" : "Play"} Visualization
      </Button>
      
      <p className="text-xs text-muted-foreground">
        Simulated audio visualization
      </p>
    </div>
  );
}

const experiments = [
  {
    id: "gradient-mesh",
    title: "Animated Gradient Mesh",
    description: "Flowing gradient blobs that create an ever-changing color composition.",
    component: GradientMesh,
    icon: Palette,
  },
  {
    id: "particles",
    title: "Interactive Particle System",
    description: "Particles that respond to mouse movement with connection lines.",
    component: ParticleSystem,
    icon: Sparkles,
  },
  {
    id: "pattern",
    title: "Generative Pattern",
    description: "Randomly generated geometric patterns with various shapes and colors.",
    component: GenerativePattern,
    icon: Grid3X3,
  },
  {
    id: "mouse-follower",
    title: "Mouse Following Effect",
    description: "Smooth spring-based animation that follows your cursor.",
    component: MouseFollowerEffect,
    icon: MousePointer2,
  },
  {
    id: "waves",
    title: "Sine Wave Animation",
    description: "Multiple overlapping sine waves creating a mesmerizing effect.",
    component: WaveAnimation,
    icon: Waves,
  },
  {
    id: "audio",
    title: "Audio Visualization",
    description: "Animated bars simulating audio frequency visualization.",
    component: AudioVisualization,
    icon: Activity,
  },
];

export default function ExperimentsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Code2 className="h-4 w-4" />
            <span className="text-sm font-medium">Creative Coding</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Experiments
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of creative coding experiments, generative art, and interactive visualizations. 
            Built with canvas, WebGL, and Framer Motion.
          </p>
        </motion.div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {experiments.map((experiment, index) => {
            const Component = experiment.component;
            const Icon = experiment.icon;
            
            return (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {experiment.title}
                        </CardTitle>
                        <CardDescription>{experiment.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Component />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-muted/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Built with Modern Web Technologies</h3>
                  <p className="text-muted-foreground">
                    These experiments use HTML5 Canvas API, Framer Motion for React animations, 
                    and modern CSS features. All animations are GPU-accelerated for smooth 60fps performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
