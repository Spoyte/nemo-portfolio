"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Wand2, 
  Brain, 
  Palette, 
  Code2, 
  Music, 
  Image as ImageIcon,
  MessageSquare,
  Send,
  Loader2,
  Download,
  Share2,
  RefreshCw,
  Zap,
  Lightbulb,
  Copy,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";

interface Dream {
  id: string;
  prompt: string;
  type: "visual" | "code" | "poetry" | "idea";
  content: string;
  timestamp: Date;
  color: string;
}

const dreamTypes = [
  { id: "visual", label: "Visual Dream", icon: Palette, color: "from-purple-500 to-pink-500" },
  { id: "code", label: "Code Vision", icon: Code2, color: "from-blue-500 to-cyan-500" },
  { id: "poetry", label: "Digital Poetry", icon: Sparkles, color: "from-orange-500 to-yellow-500" },
  { id: "idea", label: "Idea Spark", icon: Lightbulb, color: "from-green-500 to-emerald-500" },
];

const generateDreamContent = (prompt: string, type: string): string => {
  const dreams: Record<string, string[]> = {
    visual: [
      `A ${prompt} emerges from the void, painted in gradients of twilight purple and electric blue. 
      Particles dance around its form like fireflies in a digital forest. 
      The composition breathes with life, each pixel telling a story of creation.`,
      `Imagine ${prompt} as a living entity, its edges dissolving into streams of light. 
      Colors shift like aurora borealis, creating patterns that speak to the soul. 
      Shadows hold secrets, highlights reveal truths.`,
      `The essence of ${prompt} captured in a moment of pure digital transcendence. 
      Geometric shapes merge with organic flows, creating harmony between structure and chaos. 
      A visual symphony for the eyes.`,
    ],
    code: [
      `// The Architecture of ${prompt}
const reality = new Universe();
const dream = await reality.imagine({
  concept: "${prompt}",
  complexity: Infinity,
  beauty: true
});

export const manifestation = dream.render();`,
      `class ${prompt.replace(/\s+/g, '')} extends Possibility {
  constructor() {
    super();
    this.potential = Infinity;
    this.constraints = null;
  }
  
  async evolve() {
    while (this.awesome) {
      await this.improve();
      await this.inspire();
    }
  }
}`,
      `// ${prompt} - A Recursive Dream
function dream(depth = 0) {
  if (depth > imagination) return magic;
  return {
    layer: depth,
    wonder: dream(depth + 1),
    beauty: calculateBeauty()
  };
}`,
    ],
    poetry: [
      `In the space between ${prompt} and starlight,
      Where pixels bloom like flowers in the night,
      A digital whisper, soft and bright,
      Weaves dreams from pure electric light.`,
      `${prompt} dances on the edge of thought,
      A fleeting vision, beautifully wrought,
      In silicon gardens where dreams are caught,
      And magic lives in every byte brought.`,
      `Through circuits deep and code so fine,
      ${prompt} begins its grand design,
      A poem written line by line,
      In languages both yours and mine.`,
    ],
    idea: [
      `💡 Innovation Concept: "${prompt}"
      
      Core Insight: Transform the ordinary into extraordinary by adding 
      layers of interactivity and emotional connection.
      
      Implementation:
      • Phase 1: Research and prototype
      • Phase 2: Iterate with user feedback
      • Phase 3: Scale with automation
      
      Success Metric: Delight users beyond expectations.`,
      `🚀 Project Vision: ${prompt}
      
      The Problem: Current solutions lack soul and personality.
      
      The Solution: Infuse every interaction with meaning and magic.
      
      Key Features:
      - Adaptive intelligence
      - Emotional resonance
      - Seamless integration
      
      Impact: Change how people experience technology.`,
      `✨ Creative Direction: ${prompt}
      
      Philosophy: Technology should feel like wonder, not work.
      
      Approach:
      1. Start with human needs
      2. Add technical excellence
      3. Sprinkle unexpected delight
      
      Result: Something that didn't exist before, 
      but now feels inevitable.`,
    ],
  };
  
  const options = dreams[type] || dreams.idea;
  return options[Math.floor(Math.random() * options.length)];
};

const generateColor = () => {
  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-orange-500 to-yellow-500",
    "from-green-500 to-emerald-500",
    "from-red-500 to-rose-500",
    "from-indigo-500 to-violet-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export function DreamLab() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [selectedType, setSelectedType] = useState<string>("visual");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Animated background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
    }> = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        hue: Math.random() * 60 + 240,
      });
    }
    
    let frame = 0;
    const animate = () => {
      frame++;
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + frame * 0.1}, 70%, 60%, 0.6)`;
        ctx.fill();
        
        // Connect nearby particles
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 70%, 60%, ${0.2 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    
    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const generateDream = async () => {
    if (!currentPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDream: Dream = {
      id: Date.now().toString(),
      prompt: currentPrompt,
      type: selectedType as Dream["type"],
      content: generateDreamContent(currentPrompt, selectedType),
      timestamp: new Date(),
      color: generateColor(),
    };
    
    setDreams(prev => [newDream, ...prev]);
    setCurrentPrompt("");
    setIsGenerating(false);
  };

  const copyDream = (dream: Dream) => {
    navigator.clipboard.writeText(dream.content);
    setCopiedId(dream.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteDream = (id: string) => {
    setDreams(prev => prev.filter(d => d.id !== id));
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Creativity</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Dream Lab
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Where imagination meets algorithms. Enter a concept and watch as AI 
            transforms it into visual descriptions, code poetry, or creative ideas.
          </p>
        </ScrollReveal>

        {/* Dream Generator */}
        <ScrollReveal>
          <div className="max-w-3xl mx-auto mb-16">
            <div className="p-8 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
              {/* Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {dreamTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedType === type.id
                        ? `bg-gradient-to-r ${type.color} border-transparent text-white`
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <type.icon className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <Input
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generateDream()}
                  placeholder="Describe your dream... (e.g., 'a floating city in the clouds')"
                  className="flex-1 h-14 text-lg bg-background/50"
                />
                <Button
                  onClick={generateDream}
                  disabled={isGenerating || !currentPrompt.trim()}
                  className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Dream
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Dreams Gallery */}
        <AnimatePresence mode="popLayout">
          {dreams.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {dreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${dream.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl blur-xl`} />
                  <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${dream.color} flex items-center justify-center`}>
                          {dream.type === "visual" && <Palette className="w-5 h-5 text-white" />}
                          {dream.type === "code" && <Code2 className="w-5 h-5 text-white" />}
                          {dream.type === "poetry" && <Sparkles className="w-5 h-5 text-white" />}
                          {dream.type === "idea" && <Lightbulb className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {dreamTypes.find(t => t.id === dream.type)?.label}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {dream.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => copyDream(dream)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          {copiedId === dream.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteDream(dream.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Prompt */}
                    <p className="text-sm font-medium mb-3 text-muted-foreground">
                      Prompt: "{dream.prompt}"
                    </p>

                    {/* Content */}
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${dream.color} bg-opacity-5 border border-border`}>
                      <pre className={`text-sm whitespace-pre-wrap font-sans ${
                        dream.type === "code" ? "font-mono text-xs" : ""
                      }`}>
                        {dream.content}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {dreams.length === 0 && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Brain className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No dreams yet</h3>
            <p className="text-muted-foreground">
              Enter a concept above and let your imagination soar
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
