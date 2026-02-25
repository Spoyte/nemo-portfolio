"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  FlaskConical, 
  Sparkles, 
  Zap, 
  Eye, 
  Brain, 
  Cpu, 
  Fingerprint,
  Scan,
  Activity,
  Radio,
  Waves,
  Orbit,
  Terminal,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Neural Network Visualization
function NeuralNetworkViz() {
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    
    // Neural network nodes
    const layers = [4, 6, 6, 4];
    const nodes: { x: number; y: number; layer: number; index: number; activation: number }[] = [];
    const connections: { from: number; to: number; weight: number }[] = [];
    
    const layerSpacing = canvas.offsetWidth / (layers.length + 1);
    
    layers.forEach((nodeCount, layerIndex) => {
      const nodeSpacing = canvas.offsetHeight / (nodeCount + 1);
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: layerSpacing * (layerIndex + 1),
          y: nodeSpacing * (i + 1),
          layer: layerIndex,
          index: nodes.length,
          activation: Math.random()
        });
      }
    });
    
    // Create connections
    let nodeIndex = 0;
    layers.forEach((nodeCount, layerIndex) => {
      if (layerIndex < layers.length - 1) {
        const nextLayerStart = nodeIndex + nodeCount;
        const nextLayerCount = layers[layerIndex + 1];
        
        for (let i = 0; i < nodeCount; i++) {
          for (let j = 0; j < nextLayerCount; j++) {
            connections.push({
              from: nodeIndex + i,
              to: nextLayerStart + j,
              weight: Math.random() * 2 - 1
            });
          }
        }
      }
      nodeIndex += nodeCount;
    });
    
    let animationId: number;
    let time = 0;
    
    const animate = () => {
      if (!isRunning) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      time += 0.02 * speed;
      
      // Update activations
      nodes.forEach((node, i) => {
        node.activation = 0.5 + 0.5 * Math.sin(time + i * 0.5 + node.layer);
      });
      
      // Draw connections
      connections.forEach(conn => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        const activation = (fromNode.activation + toNode.activation) / 2;
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = `rgba(220, 38, 38, ${activation * 0.3})`;
        ctx.lineWidth = Math.abs(conn.weight) * 2;
        ctx.stroke();
      });
      
      // Draw nodes
      nodes.forEach(node => {
        const radius = 8 + node.activation * 4;
        
        // Glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, radius * 3
        );
        gradient.addColorStop(0, `rgba(220, 38, 38, ${node.activation * 0.5})`);
        gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Node
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 38, 38, ${0.3 + node.activation * 0.7})`;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = `rgba(220, 38, 38, ${0.5 + node.activation * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isRunning, speed]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-4 w-4 text-primary" />
          Neural Network Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-64 rounded-lg bg-muted/30"
        />
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Speed</label>
            <Slider
              value={[speed]}
              onValueChange={([v]) => setSpeed(v)}
              min={0.1}
              max={3}
              step={0.1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Particle Wave Interference
function WaveInterference() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveCount, setWaveCount] = useState(3);
  const [frequency, setFrequency] = useState(1);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    
    let time = 0;
    let animationId: number;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(12, 10, 9, 0.1)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      time += 0.02;
      
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      
      for (let i = 0; i < waveCount; i++) {
        const angle = (i / waveCount) * Math.PI * 2;
        const sourceX = centerX + Math.cos(angle + time * 0.1) * 100;
        const sourceY = centerY + Math.sin(angle + time * 0.1) * 100;
        
        ctx.beginPath();
        for (let r = 10; r < 200; r += 10) {
          const wavePhase = (r * frequency * 0.1) - time * 2;
          const alpha = Math.max(0, 1 - r / 200) * (0.5 + 0.5 * Math.sin(wavePhase));
          
          ctx.beginPath();
          ctx.arc(sourceX, sourceY, r, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${i * 60 + time * 20}, 70%, 50%, ${alpha * 0.3})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [waveCount, frequency]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Waves className="h-4 w-4 text-primary" />
          Wave Interference Pattern
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-64 rounded-lg bg-black"
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Sources: {waveCount}</label>
            <Slider
              value={[waveCount]}
              onValueChange={([v]) => setWaveCount(v)}
              min={1}
              max={8}
              step={1}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Frequency: {frequency.toFixed(1)}</label>
            <Slider
              value={[frequency]}
              onValueChange={([v]) => setFrequency(v)}
              min={0.5}
              max={3}
              step={0.1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// DNA Helix Animation
function DNAHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [strandCount, setStrandCount] = useState(2);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    
    let time = 0;
    let animationId: number;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(12, 10, 9, 0.2)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      time += 0.02 * rotationSpeed;
      
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const amplitude = 80;
      const frequency = 0.02;
      
      for (let strand = 0; strand < strandCount; strand++) {
        const strandOffset = (strand / strandCount) * Math.PI;
        
        for (let y = -150; y < 150; y += 15) {
          const angle = y * frequency + time + strandOffset;
          const x = Math.sin(angle) * amplitude;
          const z = Math.cos(angle);
          const scale = 0.5 + 0.5 * z;
          
          const px = centerX + x;
          const py = centerY + y;
          
          // Draw base pair connection
          if (strand === 0 && strandCount > 1) {
            const x2 = Math.sin(angle + Math.PI) * amplitude;
            const px2 = centerX + x2;
            
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px2, py);
            ctx.strokeStyle = `rgba(220, 38, 38, ${0.2 * scale})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          
          // Draw nucleotide
          const gradient = ctx.createRadialGradient(px, py, 0, px, py, 8 * scale);
          gradient.addColorStop(0, `rgba(220, 38, 38, ${scale})`);
          gradient.addColorStop(1, `rgba(220, 38, 38, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(px, py, 8 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [rotationSpeed, strandCount]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-primary" />
          DNA Helix Simulation
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-64 rounded-lg bg-black"
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Rotation Speed</label>
            <Slider
              value={[rotationSpeed]}
              onValueChange={([v]) => setRotationSpeed(v)}
              min={0.1}
              max={3}
              step={0.1}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Strands: {strandCount}</label>
            <Slider
              value={[strandCount]}
              onValueChange={([v]) => setStrandCount(v)}
              min={1}
              max={4}
              step={1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Matrix Rain Effect
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(true);
  const [density, setDensity] = useState(1);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = Math.floor(canvas.offsetWidth / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    
    let animationId: number;
    
    const draw = () => {
      if (!isActive) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i += Math.ceil(1 / density)) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Random colors for some characters
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#fff';
        } else if (Math.random() > 0.9) {
          ctx.fillStyle = '#0fa';
        } else {
          ctx.fillStyle = '#0f0';
        }
        
        ctx.fillText(text, x, y);
        
        if (y > canvas.offsetHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isActive, density]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Terminal className="h-4 w-4 text-green-500" />
          Matrix Rain
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-64 rounded-lg bg-black"
        />
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Density</label>
            <Slider
              value={[density]}
              onValueChange={([v]) => setDensity(v)}
              min={0.1}
              max={2}
              step={0.1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Orbital Mechanics
function OrbitalMechanics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bodyCount, setBodyCount] = useState(5);
  const [gravity, setGravity] = useState(0.5);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    
    interface Body {
      x: number;
      y: number;
      vx: number;
      vy: number;
      mass: number;
      color: string;
      trail: { x: number; y: number }[];
    }
    
    const bodies: Body[] = [];
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    
    // Central star
    bodies.push({
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      mass: 1000,
      color: '#fbbf24',
      trail: []
    });
    
    // Orbiting bodies
    for (let i = 0; i < bodyCount; i++) {
      const angle = (i / bodyCount) * Math.PI * 2;
      const distance = 60 + i * 25;
      const speed = Math.sqrt(gravity * 1000 / distance);
      
      bodies.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: -Math.sin(angle) * speed,
        vy: Math.cos(angle) * speed,
        mass: 10 + Math.random() * 20,
        color: `hsl(${i * 60}, 70%, 50%)`,
        trail: []
      });
    }
    
    let animationId: number;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(12, 10, 9, 0.3)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Update physics
      for (let i = 1; i < bodies.length; i++) {
        const body = bodies[i];
        const star = bodies[0];
        
        const dx = star.x - body.x;
        const dy = star.y - body.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const force = (gravity * star.mass * body.mass) / (dist * dist);
        const ax = (dx / dist) * force / body.mass;
        const ay = (dy / dist) * force / body.mass;
        
        body.vx += ax;
        body.vy += ay;
        body.x += body.vx;
        body.y += body.vy;
        
        // Store trail
        body.trail.push({ x: body.x, y: body.y });
        if (body.trail.length > 50) body.trail.shift();
      }
      
      // Draw trails
      bodies.forEach((body, i) => {
        if (i === 0) return;
        
        ctx.beginPath();
        body.trail.forEach((point, j) => {
          if (j === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = body.color + '40';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      
      // Draw bodies
      bodies.forEach(body => {
        const radius = Math.sqrt(body.mass) * 0.8;
        
        // Glow
        const gradient = ctx.createRadialGradient(
          body.x, body.y, 0,
          body.x, body.y, radius * 3
        );
        gradient.addColorStop(0, body.color + '80');
        gradient.addColorStop(1, body.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(body.x, body.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.fillStyle = body.color;
        ctx.beginPath();
        ctx.arc(body.x, body.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [bodyCount, gravity]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Orbit className="h-4 w-4 text-primary" />
          Orbital Mechanics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-64 rounded-lg bg-black"
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Bodies: {bodyCount}</label>
            <Slider
              value={[bodyCount]}
              onValueChange={([v]) => setBodyCount(v)}
              min={1}
              max={10}
              step={1}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Gravity: {gravity.toFixed(1)}</label>
            <Slider
              value={[gravity]}
              onValueChange={([v]) => setGravity(v)}
              min={0.1}
              max={2}
              step={0.1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Glitch Text Effect
function GlitchText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [text]);
  
  return <span className="font-mono">{displayText}</span>;
}

export default function SecretLabPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  return (
    <div ref={containerRef} className="min-h-screen pt-24 pb-16 overflow-hidden">
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
            <FlaskConical className="h-4 w-4" />
            <span className="text-sm font-medium">Restricted Area</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <GlitchText text="SECRET LAB" />
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome to the experimental zone. Here you'll find interactive simulations, 
            visual experiments, and creative coding projects.
          </p>
        </motion.div>
        
        {/* Experiments Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <NeuralNetworkViz />
          <WaveInterference />
          <DNAHelix />
          <MatrixRain />
          <OrbitalMechanics />
          
          {/* Coming Soon Card */}
          <Card className="overflow-hidden border-dashed">
            <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[320px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center mb-4"
              >
                <Sparkles className="h-6 w-6 text-primary/50" />
              </motion.div>
              <h3 className="text-lg font-semibold text-muted-foreground">More Experiments Coming</h3>
              <p className="text-sm text-muted-foreground/60 text-center mt-2">
                New simulations and visualizations are being developed.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <Cpu className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Canvas API</h3>
              <p className="text-sm text-muted-foreground">
                All visualizations are built with HTML5 Canvas for maximum performance.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">60 FPS</h3>
              <p className="text-sm text-muted-foreground">
                Optimized animations using requestAnimationFrame for smooth rendering.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Fingerprint className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Interactive</h3>
              <p className="text-sm text-muted-foreground">
                Adjust parameters in real-time to see how systems behave.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
