"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Share2,
  Code2,
  Sparkles,
  Wand2,
  Sliders,
  Palette,
  Grid3X3,
  Waves,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Save,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Lightbulb,
  Shuffle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface Preset {
  id: string;
  name: string;
  description: string;
  code: string;
  thumbnail: string;
}

const presets: Preset[] = [
  {
    id: "particles",
    name: "Particle Dance",
    description: "Interactive particle system",
    thumbnail: "✨",
    code: `// Particle Dance
const particles = [];
const particleCount = 100;

function setup() {
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-2, 2),
      vy: random(-2, 2),
      size: random(3, 8),
      hue: random(360)
    });
  }
}

function draw() {
  background(0, 20);
  
  particles.forEach(p => {
    // Update
    p.x += p.vx;
    p.y += p.vy;
    p.hue += 1;
    
    // Bounce
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    
    // Mouse interaction
    const dx = mouseX - p.x;
    const dy = mouseY - p.y;
    const dist = sqrt(dx*dx + dy*dy);
    if (dist < 100) {
      p.vx += dx * 0.001;
      p.vy += dy * 0.001;
    }
    
    // Draw
    fill(p.hue % 360, 80, 100);
    noStroke();
    circle(p.x, p.y, p.size);
  });
}`,
  },
  {
    id: "waves",
    name: "Sine Waves",
    description: "Flowing sine wave animation",
    thumbnail: "〰️",
    code: `// Sine Waves
let time = 0;
const waves = 5;

function draw() {
  background(10, 15, 30);
  
  for (let w = 0; w < waves; w++) {
    beginShape();
    noFill();
    stroke((w * 60 + time * 10) % 360, 70, 90);
    strokeWeight(2);
    
    for (let x = 0; x < width; x += 5) {
      const y = height/2 + 
        sin(x * 0.01 + time + w * 0.5) * 50 +
        sin(x * 0.02 + time * 1.5) * 30 +
        sin(x * 0.005 + time * 0.5) * 20;
      vertex(x, y + w * 30 - waves * 15);
    }
    endShape();
  }
  
  time += 0.02;
}`,
  },
  {
    id: "fractal",
    name: "Recursive Tree",
    description: "Animated fractal tree",
    thumbnail: "🌳",
    code: `// Recursive Tree
let angle = 0;

function draw() {
  background(20);
  translate(width/2, height);
  
  angle = sin(frameCount * 0.01) * 0.5 + 0.5;
  
  drawBranch(120, 0);
}

function drawBranch(len, depth) {
  stroke(lerpColor(
    color(139, 90, 43),
    color(34, 139, 34),
    depth / 10
  ));
  strokeWeight(map(len, 10, 120, 1, 8));
  
  line(0, 0, 0, -len);
  translate(0, -len);
  
  if (len > 10) {
    push();
    rotate(angle + sin(frameCount * 0.02) * 0.1);
    drawBranch(len * 0.7, depth + 1);
    pop();
    
    push();
    rotate(-angle + cos(frameCount * 0.02) * 0.1);
    drawBranch(len * 0.7, depth + 1);
    pop();
  } else {
    // Leaves
    fill(100 + sin(frameCount * 0.05) * 50, 200, 100, 150);
    noStroke();
    circle(0, 0, random(5, 15));
  }
}`,
  },
  {
    id: "spirograph",
    name: "Spirograph",
    description: "Mathematical spirograph patterns",
    thumbnail: "🌀",
    code: `// Spirograph
let t = 0;
const R = 120;
const r = 40;
const d = 70;

function draw() {
  // Fade effect
  fill(0, 5);
  noStroke();
  rect(0, 0, width, height);
  
  translate(width/2, height/2);
  
  // Draw spirograph
  for (let i = 0; i < 5; i++) {
    const x = (R - r) * cos(t + i) + d * cos((R - r) / r * (t + i));
    const y = (R - r) * sin(t + i) + d * sin((R - r) / r * (t + i));
    
    const hue = (t * 10 + i * 60) % 360;
    fill(hue, 80, 100);
    noStroke();
    circle(x, y, 4);
  }
  
  t += 0.05;
  
  // Slowly change parameters
  if (frameCount % 300 === 0) {
    r = random(20, 60);
    d = random(40, 90);
  }
}`,
  },
  {
    id: "fireworks",
    name: "Fireworks",
    description: "Explosive particle effects",
    thumbnail: "🎆",
    code: `// Fireworks
let fireworks = [];
let gravity;

function setup() {
  gravity = createVector(0, 0.2);
}

function draw() {
  background(0, 25);
  
  // Random fireworks
  if (random(1) < 0.03) {
    fireworks.push(new Firework());
  }
  
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

function mousePressed() {
  fireworks.push(new Firework(mouseX, mouseY));
}

class Firework {
  constructor(x, y) {
    this.hu = random(255);
    this.firework = new Particle(x || random(width), height, this.hu, true);
    this.exploded = false;
    this.particles = [];
  }
  
  done() {
    return this.exploded && this.particles.length === 0;
  }
  
  update() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  explode() {
    for (let i = 0; i < 100; i++) {
      const p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
      this.particles.push(p);
    }
  }
  
  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}

class Particle {
  constructor(x, y, hu, firework) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;
    this.hu = hu;
    this.acc = createVector(0, 0);
    if (firework) {
      this.vel = createVector(0, random(-12, -8));
    } else {
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2, 10));
    }
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    if (!this.firework) {
      this.lifespan -= 4;
      this.vel.mult(0.95);
    }
  }
  
  done() {
    return this.lifespan < 0;
  }
  
  show() {
    colorMode(HSB);
    if (!this.firework) {
      strokeWeight(2);
      stroke(this.hu, 255, 255, this.lifespan / 255);
    } else {
      strokeWeight(4);
      stroke(this.hu, 255, 255);
    }
    point(this.pos.x, this.pos.y);
  }
}`,
  },
  {
    id: "matrix",
    name: "Matrix Rain",
    description: "Digital rain effect",
    thumbnail: "💧",
    code: `// Matrix Rain
const drops = [];
const fontSize = 14;
let columns;

function setup() {
  columns = width / fontSize;
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }
  textSize(fontSize);
}

function draw() {
  background(0, 50);
  fill(0, 255, 70);
  
  for (let i = 0; i < drops.length; i++) {
    const char = String.fromCharCode(0x30A0 + random(0, 96));
    text(char, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize > height && random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
  
  // Glowing effect for some characters
  if (random() > 0.95) {
    const col = floor(random(columns));
    const row = floor(random(height / fontSize));
    fill(180, 255, 180);
    text(String.fromCharCode(0x30A0 + random(0, 96)), col * fontSize, row * fontSize);
  }
}`,
  },
];

export function CreativeCodingPlayground() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(presets[0]);
  const [code, setCode] = useState(presets[0].code);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const frameCountRef = useRef(0);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Animation loop (simplified simulation)
  useEffect(() => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let frame = 0;
    
    const animate = () => {
      frame++;
      frameCountRef.current = frame;
      
      // Simple particle simulation based on selected preset
      if (selectedPreset.id === "particles") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < 50; i++) {
          const x = (Math.sin(frame * 0.01 + i) + 1) * canvas.width / 2;
          const y = (Math.cos(frame * 0.02 + i * 0.5) + 1) * canvas.height / 2;
          const hue = (frame + i * 10) % 360;
          
          ctx.beginPath();
          ctx.arc(x, y, 3 + Math.sin(frame * 0.05 + i) * 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
          ctx.fill();
        }
      } else if (selectedPreset.id === "waves") {
        ctx.fillStyle = "rgb(10, 15, 30)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let w = 0; w < 5; w++) {
          ctx.beginPath();
          ctx.strokeStyle = `hsl(${(w * 60 + frame * 2) % 360}, 70%, 60%)`;
          ctx.lineWidth = 2;
          
          for (let x = 0; x < canvas.width; x += 5) {
            const y = canvas.height / 2 + 
              Math.sin(x * 0.01 + frame * 0.02 + w * 0.5) * 50 +
              Math.sin(x * 0.02 + frame * 0.03) * 30;
            if (x === 0) {
              ctx.moveTo(x, y + w * 30 - 75);
            } else {
              ctx.lineTo(x, y + w * 30 - 75);
            }
          }
          ctx.stroke();
        }
      } else if (selectedPreset.id === "fractal") {
        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const drawBranch = (x: number, y: number, len: number, angle: number, depth: number) => {
          if (depth > 8 || len < 5) return;
          
          const endX = x + Math.cos(angle) * len;
          const endY = y + Math.sin(angle) * len;
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = `hsl(${30 + depth * 10}, 50%, ${30 + depth * 5}%)`;
          ctx.lineWidth = 9 - depth;
          ctx.stroke();
          
          const sway = Math.sin(frame * 0.02) * 0.1;
          drawBranch(endX, endY, len * 0.7, angle - 0.5 + sway, depth + 1);
          drawBranch(endX, endY, len * 0.7, angle + 0.5 + sway, depth + 1);
        };
        
        drawBranch(canvas.width / 2, canvas.height, 100, -Math.PI / 2, 0);
      } else if (selectedPreset.id === "spirograph") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const R = 120;
        const r = 40;
        const d = 70;
        const t = frame * 0.05;
        
        for (let i = 0; i < 5; i++) {
          const x = cx + (R - r) * Math.cos(t + i) + d * Math.cos((R - r) / r * (t + i));
          const y = cy + (R - r) * Math.sin(t + i) + d * Math.sin((R - r) / r * (t + i));
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${(t * 10 + i * 60) % 360}, 80%, 60%)`;
          ctx.fill();
        }
      } else if (selectedPreset.id === "matrix") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "14px monospace";
        for (let i = 0; i < 20; i++) {
          const x = Math.floor(Math.random() * canvas.width / 14) * 14;
          const y = Math.floor(Math.random() * canvas.height / 14) * 14;
          const char = String.fromCharCode(0x30A0 + Math.random() * 96);
          ctx.fillStyle = Math.random() > 0.95 ? "#aff" : "#0f0";
          ctx.fillText(char, x, y);
        }
      } else if (selectedPreset.id === "fireworks") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Random fireworks
        if (Math.random() > 0.95) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height / 2;
          const hue = Math.random() * 360;
          
          for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const px = x + Math.cos(angle) * speed * (frame % 50);
            const py = y + Math.sin(angle) * speed * (frame % 50) + Math.pow(frame % 50, 2) * 0.05;
            
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${1 - (frame % 50) / 50})`;
            ctx.fill();
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, selectedPreset]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPreset.id}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRandomize = () => {
    const random = presets[Math.floor(Math.random() * presets.length)];
    setSelectedPreset(random);
    setCode(random.code);
  };

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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Creative Coding</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Generative Art{" "}
            <span className="text-gradient-animated">Playground</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experiment with code and create beautiful generative art. 
            Select a preset, modify the code, and watch your creation come to life.
          </p>
        </motion.div>

        {/* Preset Selector */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {presets.map((preset) => (
            <motion.button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                setCode(preset.code);
                setIsPlaying(false);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border text-center transition-all ${
                selectedPreset.id === preset.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="text-3xl mb-2">{preset.thumbnail}</div>
              <p className="text-sm font-medium">{preset.name}</p>
            </motion.button>
          ))}
        </div>

        {/* Main Workspace */}
        <div className={`grid gap-6 ${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : "grid-cols-1 lg:grid-cols-2"}`}>
          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{selectedPreset.name}.js</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRandomize}
                  title="Random preset"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm bg-card resize-none focus:outline-none"
              spellCheck={false}
            />
          </motion.div>

          {/* Canvas Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant={isPlaying ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <><Pause className="w-4 h-4 mr-1" /> Pause</> : <><Play className="w-4 h-4 mr-1" /> Play</>}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsPlaying(false);
                    setTimeout(() => setIsPlaying(true), 100);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative bg-black min-h-96">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
              />
              
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <Button size="lg" onClick={() => setIsPlaying(true)}>
                    <Play className="w-5 h-5 mr-2" />
                    Start Animation
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-2xl border border-border bg-muted/30"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pro Tips</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Try changing colors by modifying the hue values</li>
                <li>• Adjust speed by changing the frame multiplier</li>
                <li>• Experiment with different mathematical functions</li>
                <li>• Click on the canvas in some presets for interaction</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
