"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Code2,
  Sparkles,
  Zap,
  Palette,
  Type,
  Layers,
  MousePointer,
  Keyboard,
  Eye,
  Grid3X3,
  Wand2,
  Cpu,
  Music,
  Gamepad2,
  Box,
  Waves,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Star,
  Heart,
  Share2,
  Download,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollReveal } from "@/components/scroll-animations";

// Demo Components
function AnimatedBox({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        borderRadius: ["10%", "50%", "10%"],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="w-24 h-24 bg-gradient-to-br from-primary to-orange-500"
    />
  );
}

function StaggerGrid() {
  const items = Array.from({ length: 9 }, (_, i) => i);
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.2, rotate: 90 }}
          className="w-12 h-12 rounded-lg bg-primary/20 cursor-pointer"
        />
      ))}
    </div>
  );
}

function SpringPhysics() {
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  
  return (
    <div className="relative h-32 flex items-center">
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        style={{ x: springX }}
        className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-orange-500 cursor-grab active:cursor-grabbing shadow-lg"
      />
      <div className="absolute left-0 right-0 h-px bg-border" />
    </div>
  );
}

function GestureDemo() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.9 }}
      className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center cursor-pointer shadow-lg"
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.5 : 1,
          rotate: isHovered ? 180 : 0,
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Sparkles className="w-8 h-8 text-white" />
      </motion.div>
    </motion.div>
  );
}

function ScrollProgressDemo() {
  const [progress, setProgress] = useState(0);
  
  return (
    <div className="space-y-4">
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-orange-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <Slider
        value={[progress]}
        onValueChange={([v]) => setProgress(v)}
        max={100}
        className="w-full"
      />
    </div>
  );
}

function TextRevealDemo() {
  const text = "Hello, World!";
  
  return (
    <div className="flex flex-wrap">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="text-3xl font-bold"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}

function MorphingShapes() {
  const [shape, setShape] = useState(0);
  const shapes = [
    { borderRadius: "10%", rotate: 0 },
    { borderRadius: "50%", rotate: 45 },
    { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", rotate: 90 },
    { borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", rotate: 135 },
  ];
  
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={shapes[shape]}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 bg-gradient-to-br from-primary to-orange-500"
      />
      <div className="flex gap-2">
        {shapes.map((_, i) => (
          <button
            key={i}
            onClick={() => setShape(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              shape === i ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ParallaxLayers() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  
  const layer1X = useTransform(mouseX, [-150, 150], [-30, 30]);
  const layer1Y = useTransform(mouseY, [-150, 150], [-30, 30]);
  const layer2X = useTransform(mouseX, [-150, 150], [-15, 15]);
  const layer2Y = useTransform(mouseY, [-150, 150], [-15, 15]);
  
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="relative w-48 h-48 bg-muted rounded-2xl overflow-hidden cursor-crosshair"
    >
      <motion.div
        style={{ x: layer1X, y: layer1Y }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-32 h-32 rounded-xl bg-primary/20" />
      </motion.div>
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-20 h-20 rounded-lg bg-primary/40" />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-md bg-primary" />
      </div>
    </motion.div>
  );
}

const animationDemos = [
  {
    id: "keyframes",
    title: "Keyframed Animation",
    description: "Smooth transitions between multiple states",
    icon: Play,
    component: AnimatedBox,
  },
  {
    id: "stagger",
    title: "Staggered Children",
    description: "Sequential animations with delays",
    icon: Grid3X3,
    component: StaggerGrid,
  },
  {
    id: "spring",
    title: "Spring Physics",
    description: "Natural, physics-based motion",
    icon: Waves,
    component: SpringPhysics,
  },
  {
    id: "gestures",
    title: "Gestures",
    description: "Hover, tap, and drag interactions",
    icon: MousePointer,
    component: GestureDemo,
  },
  {
    id: "scroll",
    title: "Scroll Progress",
    description: "Animation tied to scroll position",
    icon: Eye,
    component: ScrollProgressDemo,
  },
  {
    id: "text",
    title: "Text Reveal",
    description: "Character-by-character animations",
    icon: Type,
    component: TextRevealDemo,
  },
  {
    id: "morph",
    title: "Shape Morphing",
    description: "Transform between different shapes",
    icon: Wand2,
    component: MorphingShapes,
  },
  {
    id: "parallax",
    title: "Parallax Layers",
    description: "Multi-layer depth effects",
    icon: Layers,
    component: ParallaxLayers,
  },
];

export default function AnimationShowcasePage() {
  const [activeDemo, setActiveDemo] = useState(animationDemos[0]);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Demos</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Animation{" "}
            <span className="text-gradient-animated">Showcase</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the power of Framer Motion with interactive examples. 
            Click on any demo to see it in action.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Selector */}
          <ScrollReveal className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Choose a Demo
                </CardTitle>
                <CardDescription>
                  Select an animation to explore
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {animationDemos.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => setActiveDemo(demo)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      activeDemo.id === demo.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted border border-transparent"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      activeDemo.id === demo.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      <demo.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{demo.title}</p>
                      <p className="text-xs text-muted-foreground">{demo.description}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Demo Preview */}
          <ScrollReveal delay={0.1} className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <activeDemo.icon className="h-5 w-5 text-primary" />
                    {activeDemo.title}
                  </CardTitle>
                  <CardDescription>{activeDemo.description}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCode(!showCode)}
                >
                  <Code2 className="h-4 w-4 mr-2" />
                  {showCode ? "Hide Code" : "Show Code"}
                </Button>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {showCode ? (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="relative"
                    >
                      <pre className="p-4 rounded-xl bg-muted overflow-x-auto text-sm">
                        <code>{`<motion.div
  animate={{
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
  }}
/>
                        `}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={copyCode}
                      >
                        {copied ? (
                          <><Check className="h-4 w-4 mr-1" /> Copied</>
                        ) : (
                          <><Copy className="h-4 w-4 mr-1" /> Copy</>
                        )}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="min-h-[300px] flex items-center justify-center bg-muted/50 rounded-xl"
                    >
                      <activeDemo.component />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Features Grid */}
        <ScrollReveal delay={0.2} className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Animation Features</h2>
            <p className="text-muted-foreground">What makes these animations special</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "60fps Animations", desc: "Smooth 60 frames per second" },
              { icon: MousePointer, title: "Gesture Support", desc: "Drag, hover, and tap gestures" },
              { icon: Waves, title: "Spring Physics", desc: "Natural motion with springs" },
              { icon: Layers, title: "Layout Animations", desc: "Animate layout changes" },
              { icon: Eye, title: "Scroll Triggers", desc: "Animate on scroll" },
              { icon: Wand2, title: "Morphing", desc: "Transform shapes smoothly" },
              { icon: Grid3X3, title: "Staggering", desc: "Sequential animations" },
              { icon: Cpu, title: "GPU Accelerated", desc: "Hardware-accelerated" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.3} className="mt-16">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Learn More?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Check out the Framer Motion documentation for more advanced techniques 
              and animation patterns.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer">
                  View Documentation
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/v2-features">
                  Explore More Features
                </a>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
