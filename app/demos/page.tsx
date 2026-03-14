"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Code2, 
  Cpu,
  Layers,
  Zap,
  Sparkles,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  MousePointer2,
  Type,
  Palette,
  Grid3X3,
  Search,
  Sliders,
  Clock,
  Waves,
  Box,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollReveal } from "@/components/scroll-animations";
import { cn } from "@/lib/utils";

// ============================================================================
// DEMO DEFINITIONS
// ============================================================================

type DemoCategory = "motion" | "interaction" | "effects" | "components";

interface Demo {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: DemoCategory;
  language: string;
  code: string;
}

const demos: Demo[] = [
  // MOTION
  {
    id: "spring-physics",
    title: "Spring Physics",
    description: "Natural motion with spring-based animations",
    icon: Zap,
    category: "motion",
    language: "tsx",
    code: `const SpringBox = () => (
  <motion.div
    drag
    dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    whileDrag={{ scale: 1.2, rotate: 10 }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20
    }}
    className="w-24 h-24 bg-gradient-to-br from-primary to-orange-500 rounded-2xl cursor-grab active:cursor-grabbing shadow-lg"
  />
);`
  },
  {
    id: "stagger-children",
    title: "Stagger Animation",
    description: "Orchestrated entrance animations with staggered delays",
    icon: Grid3X3,
    category: "motion",
    language: "tsx",
    code: `const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const StaggerGrid = () => (
  <motion.div
    variants={container}
    initial="hidden"
    animate="show"
    className="grid grid-cols-3 gap-2"
  >
    {[...Array(9)].map((_, i) => (
      <motion.div
        key={i}
        variants={item}
        className="w-12 h-12 bg-primary rounded-lg"
      />
    ))}
  </motion.div>
);`
  },
  {
    id: "animated-gradient",
    title: "Animated Gradient",
    description: "Smooth gradient transitions using CSS keyframes",
    icon: Palette,
    category: "motion",
    language: "css",
    code: `.gradient-text {
  background: linear-gradient(
    90deg, 
    #dc2626, #ea580c, #fbbf24, 
    #84cc16, #06b6d4, #8b5cf6, #dc2626
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 4s linear infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}`
  },
  
  // INTERACTION
  {
    id: "drag-elastic",
    title: "Elastic Drag",
    description: "Draggable element with elastic constraints",
    icon: MousePointer2,
    category: "interaction",
    language: "tsx",
    code: `const ElasticCard = () => (
  <motion.div
    drag
    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
    dragElastic={0.2}
    whileHover={{ scale: 1.05, rotate: 2 }}
    whileTap={{ scale: 0.95 }}
    className="w-32 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl cursor-grab active:cursor-grabbing shadow-xl"
  >
    <div className="h-full flex items-center justify-center text-white font-medium">
      Drag me
    </div>
  </motion.div>
);`
  },
  {
    id: "text-scramble",
    title: "Text Scramble",
    description: "Decrypt-style text reveal animation",
    icon: Type,
    category: "interaction",
    language: "tsx",
    code: `const TextScramble = ({ text }: { text: string }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(text
        .split("")
        .map((char, idx) => {
          if (idx < iteration) return text[idx];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("")
      );
      iteration += 1/3;
      if (iteration >= text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text]);
  
  return <span className="font-mono">{display}</span>;
};`
  },
  
  // EFFECTS
  {
    id: "glow-cursor",
    title: "Glow Cursor",
    description: "Radial gradient follows mouse position",
    icon: Sparkles,
    category: "effects",
    language: "tsx",
    code: `const GlowCard = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };
  
  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-48 h-32 rounded-xl overflow-hidden bg-slate-900"
    >
      <div
        className="absolute inset-0 opacity-50 transition-all duration-100"
        style={{
          background: \`radial-gradient(circle at \${position.x}% \${position.y}%, 
            rgba(99, 102, 241, 0.5) 0%, transparent 50%)\`
        }}
      />
      <div className="relative z-10 h-full flex items-center justify-center text-white">
        Hover me
      </div>
    </div>
  );
};`
  },
  {
    id: "wave-text",
    title: "Wave Text",
    description: "Sinusoidal text animation wave",
    icon: Waves,
    category: "effects",
    language: "tsx",
    code: `const WaveText = ({ text }: { text: string }) => {
  return (
    <div className="flex">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
          className="text-2xl font-bold inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};`
  },
  
  // COMPONENTS
  {
    id: "3d-flip",
    title: "3D Flip Card",
    description: "Interactive card with 3D perspective flip",
    icon: Layers,
    category: "components",
    language: "tsx",
    code: `const FlipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <motion.div
      className="w-32 h-44 cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        <div 
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold"
          style={{ backfaceVisibility: "hidden" }}
        >
          Front
        </div>
        <div 
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          Back
        </div>
      </motion.div>
    </motion.div>
  );
};`
  },
  {
    id: "counter-anim",
    title: "Animated Counter",
    description: "Counter with animated number transitions",
    icon: Clock,
    category: "components",
    language: "tsx",
    code: `const AnimatedCounter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="outline"
        onClick={() => setCount(c => c - 1)}
      >
        -
      </Button>
      
      <div className="w-16 text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="text-4xl font-bold block"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>
      
      <Button 
        variant="outline"
        onClick={() => setCount(c => c + 1)}
      >
        +
      </Button>
    </div>
  );
};`
  }
];

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

function SpringPhysicsDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        whileDrag={{ scale: 1.2, rotate: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-24 h-24 bg-gradient-to-br from-primary to-orange-500 rounded-2xl cursor-grab active:cursor-grabbing shadow-lg flex items-center justify-center"
      >
        <span className="text-white font-bold text-sm">Drag</span>
      </motion.div>
    </div>
  );
}

function StaggerDemo() {
  const [key, setKey] = useState(0);
  
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0, scale: 0.8 },
    show: { y: 0, opacity: 1, scale: 1 }
  };
  
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <motion.div
        key={key}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-2"
      >
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            variants={item}
            className={cn(
              "w-12 h-12 rounded-lg",
              i % 2 === 0 
                ? "bg-gradient-to-br from-primary to-orange-500" 
                : "bg-gradient-to-br from-purple-500 to-pink-500"
            )}
          />
        ))}
      </motion.div>
      <Button variant="ghost" size="sm" onClick={() => setKey(k => k + 1)}>
        <RotateCcw className="w-4 h-4 mr-2" />
        Replay
      </Button>
    </div>
  );
}

function GradientDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.h2 
        className="text-4xl md:text-5xl font-bold"
        style={{
          background: "linear-gradient(90deg, #dc2626, #ea580c, #fbbf24, #84cc16, #06b6d4, #8b5cf6, #dc2626)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "gradient 4s linear infinite"
        }}
      >
        Gradient
      </motion.h2>
      <style jsx>{\`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      \`}</style>
    </div>
  );
}

function ElasticDragDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.3}
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className="w-32 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl cursor-grab active:cursor-grabbing shadow-xl flex items-center justify-center"
      >
        <span className="text-white font-medium">Drag me</span>
      </motion.div>
    </div>
  );
}

function TextScrambleDemo() {
  const [display, setDisplay] = useState("HELLO WORLD");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const originalText = "HELLO WORLD";
  
  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        originalText
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx < iteration) return originalText[idx];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      iteration += 1 / 2;
      if (iteration >= originalText.length) clearInterval(interval);
    }, 40);
  };
  
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div 
        className="text-2xl font-mono font-bold tracking-wider cursor-pointer select-none"
        onClick={scramble}
      >
        {display}
      </div>
      <Button variant="ghost" size="sm" onClick={scramble}>
        <Zap className="w-4 h-4 mr-2" />
        Scramble
      </Button>
    </div>
  );
}

function GlowCursorDemo() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };
  
  return (
    <div className="flex items-center justify-center p-8">
      <div
        onMouseMove={handleMouseMove}
        className="relative w-48 h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-700"
      >
        <div
          className="absolute inset-0 transition-all duration-75 ease-out"
          style={{
            background: `radial-gradient(circle at ${position.x}% ${position.y}%, 
              rgba(99, 102, 241, 0.6) 0%, 
              rgba(168, 85, 247, 0.3) 30%, 
              transparent 60%)`
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center text-slate-400 text-sm">
          Move your cursor
        </div>
      </div>
    </div>
  );
}

function WaveTextDemo() {
  const text = "WAVE";
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.08,
              ease: "easeInOut"
            }}
            className="text-4xl font-bold inline-block text-primary"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function FlipCardDemo() {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="w-32 h-44 cursor-pointer"
        style={{ perspective: 1000 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full h-full"
        >
          <div 
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex flex-col items-center justify-center text-white shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Box className="w-8 h-8 mb-2" />
            <span className="font-bold">Front</span>
          </div>
          <div 
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center text-white shadow-lg"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <Sparkles className="w-8 h-8 mb-2" />
            <span className="font-bold">Back</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function CounterDemo() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="flex items-center gap-6">
        <Button 
          variant="outline"
          size="lg"
          onClick={() => setCount(c => c - 1)}
          className="w-14 h-14 text-2xl"
        >
          -
        </Button>
        
        <div className="w-20 text-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-5xl font-bold block"
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </div>
        
        <Button 
          variant="outline"
          size="lg"
          onClick={() => setCount(c => c + 1)}
          className="w-14 h-14 text-2xl"
        >
          +
        </Button>
      </div>
      
      <Button variant="ghost" size="sm" onClick={() => setCount(0)}>
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
    </div>
  );
}

const previewComponents: Record<string, React.ReactNode> = {
  "spring-physics": <SpringPhysicsDemo />,
  "stagger-children": <StaggerDemo />,
  "animated-gradient": <GradientDemo />,
  "drag-elastic": <ElasticDragDemo />,
  "text-scramble": <TextScrambleDemo />,
  "glow-cursor": <GlowCursorDemo />,
  "wave-text": <WaveTextDemo />,
  "3d-flip": <FlipCardDemo />,
  "counter-anim": <CounterDemo />
};

const categoryLabels: Record<DemoCategory, string> = {
  motion: "Motion",
  interaction: "Interaction",
  effects: "Effects",
  components: "Components"
};

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function DemosPage() {
  const [activeCategory, setActiveCategory] = useState<DemoCategory | "all">("all");
  const [activeDemo, setActiveDemo] = useState(demos[0]);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredDemos = activeCategory === "all" 
    ? demos 
    : demos.filter(d => d.category === activeCategory);

  const copyCode = () => {
    navigator.clipboard.writeText(activeDemo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <Badge variant="secondary">Interactive</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Live{" "}
            <span className="text-gradient-animated">Demos</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Interactive code examples showcasing motion, interactions, effects, and components. 
            Play with each demo, view the source, and copy what you need.
          </p>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal className="mb-8">
          <Tabs value={activeCategory} onValueChange={(v) => {
            setActiveCategory(v as DemoCategory | "all");
            setActiveDemo(filteredDemos[0] || demos[0]);
          }}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({demos.length})</TabsTrigger>
              <TabsTrigger value="motion">Motion</TabsTrigger>
              <TabsTrigger value="interaction">Interaction</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
            </TabsList>
          </Tabs>
        </ScrollReveal>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demo Selector */}
          <ScrollReveal className="lg:col-span-1">
            <div className="space-y-2">
              {filteredDemos.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all duration-200",
                    "flex items-start gap-3",
                    activeDemo.id === demo.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg shrink-0",
                    activeDemo.id === demo.id ? "bg-white/20" : "bg-background"
                  )}>
                    <demo.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{demo.title}</p>
                    <p className={cn(
                      "text-xs mt-0.5",
                      activeDemo.id === demo.id ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {demo.description}
                    </p>
                    <Badge 
                      variant={activeDemo.id === demo.id ? "secondary" : "outline"}
                      className="mt-2 text-[10px]"
                    >
                      {categoryLabels[demo.category]}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Demo Preview */}
          <ScrollReveal className="lg:col-span-2">
            <motion.div
              layout
              className={cn(
                "rounded-2xl border border-border overflow-hidden bg-card",
                isFullscreen && "fixed inset-4 z-50"
              )}
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex items-center gap-3">
                  <activeDemo.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{activeDemo.title}</p>
                    <p className="text-xs text-muted-foreground">{activeDemo.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCode(!showCode)}
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    {showCode ? "Hide Code" : "Show Code"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className={cn(
                "grid",
                showCode ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
              )}>
                {/* Preview */}
                <div className={cn(
                  "border-border min-h-[320px] flex items-center justify-center bg-muted/30",
                  showCode && "border-b lg:border-b-0 lg:border-r"
                )}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeDemo.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      {previewComponents[activeDemo.id]}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Code */}
                <AnimatePresence>
                  {showCode && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="relative bg-[#1e1e1e] text-white"
                    >
                      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">{activeDemo.language}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyCode}
                          className="text-gray-400 hover:text-white"
                        >
                          {copied ? (
                            <><Check className="w-4 h-4 mr-2" />Copied</>
                          ) : (
                            <><Copy className="w-4 h-4 mr-2" />Copy</>
                          )}
                        </Button>
                      </div>
                      <pre className="p-4 overflow-auto text-sm font-mono leading-relaxed max-h-[320px]">
                        <code>{activeDemo.code}</code>
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Features Grid */}
        <ScrollReveal className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Built with</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, title: "Framer Motion", desc: "Production-ready motion library" },
              { icon: Cpu, title: "React", desc: "Component-based UI architecture" },
              { icon: Layers, title: "Tailwind CSS", desc: "Utility-first styling" },
              { icon: Box, title: "TypeScript", desc: "Type-safe development" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl bg-muted/50 border border-border"
              >
                <item.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
