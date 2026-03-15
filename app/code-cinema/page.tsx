"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Download,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Code2,
  Film,
  Sparkles,
  Zap,
  Palette,
  Type,
  Layout,
  MousePointer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/scroll-animations";

interface CodeScene {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  theme: "dark" | "light" | "cyberpunk" | "matrix";
  typingSpeed: number;
  backgroundEffect?: "particles" | "gradient" | "none";
}

const codeScenes: CodeScene[] = [
  {
    id: "react-component",
    title: "React Magic",
    description: "Building a component with hooks and animations",
    language: "tsx",
    typingSpeed: 50,
    theme: "dark",
    backgroundEffect: "particles",
    code: `import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MagicButton({ children, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isHovered) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i * 30) * (Math.PI / 180),
        distance: 60 + Math.random() * 40
      }));
      setParticles(newParticles);
    }
  }, [isHovered]);

  return (
    <motion.button
      className="relative px-8 py-4 bg-gradient-to-r 
                 from-purple-500 to-pink-500 
                 rounded-full font-bold text-white
                 overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white 
                       rounded-full"
            initial={{ 
              x: '50%', 
              y: '50%', 
              scale: 0,
              opacity: 1 
            }}
            animate={{ 
              x: \`calc(50% + \${Math.cos(particle.angle) * particle.distance}px)\`,
              y: \`calc(50% + \${Math.sin(particle.angle) * particle.distance}px)\`,
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
      
      <span className="relative z-10 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        {children}
      </span>
    </motion.button>
  );
}`
  },
  {
    id: "css-animation",
    title: "CSS Artistry",
    description: "Creating stunning animations with pure CSS",
    language: "css",
    typingSpeed: 40,
    theme: "cyberpunk",
    backgroundEffect: "gradient",
    code: `.aurora-background {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    125deg,
    #0f0c29 0%,
    #302b63 25%,
    #24243e 50%,
    #1a1a2e 75%,
    #16213e 100%
  );
  overflow: hidden;
}

.aurora-background::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(120, 119, 198, 0.3) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 70% 70%,
    rgba(255, 119, 198, 0.2) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 50% 50%,
    rgba(138, 180, 248, 0.15) 0%,
    transparent 60%
  );
  animation: aurora 20s ease-in-out infinite;
}

@keyframes aurora {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}`
  },
  {
    id: "typescript-magic",
    title: "TypeScript Sorcery",
    description: "Advanced type gymnastics and utility types",
    language: "typescript",
    typingSpeed: 60,
    theme: "matrix",
    backgroundEffect: "none",
    code: `// DeepPartial - makes all properties optional recursively
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object 
    ? DeepPartial<T[P]> 
    : T[P];
};

// DeepReadonly - makes all properties readonly recursively
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

// UnionToIntersection - converts union to intersection
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends 
  (k: infer I) => void ? I : never;

// TupleToUnion - converts tuple to union
type TupleToUnion<T extends readonly any[]> = T[number];

// DeepPick - picks nested properties
type DeepPick<T, K extends string> = K extends \`\${infer F}.\${infer R}\`
  ? F extends keyof T
    ? { [P in F]: DeepPick<T[F], R> }
    : never
  : K extends keyof T
  ? { [P in K]: T[K] }
  : never;

// Usage examples
type User = {
  id: number;
  profile: {
    name: string;
    settings: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
  posts: Array<{
    id: number;
    title: string;
  }>;
};

// Extract just the theme setting
type UserTheme = DeepPick<User, 'profile.settings.theme'>;
// Result: { profile: { settings: { theme: 'light' | 'dark' } } }

// Make everything optional
type PartialUser = DeepPartial<User>;

// Make everything readonly
type ReadonlyUser = DeepReadonly<User>;`
  }
];

const themeStyles = {
  dark: {
    bg: "bg-[#1e1e1e]",
    text: "text-[#d4d4d4]",
    keyword: "text-[#569cd6]",
    string: "text-[#ce9178]",
    comment: "text-[#6a9955]",
    function: "text-[#dcdcaa]",
    number: "text-[#b5cea8]",
    operator: "text-[#d4d4d4]"
  },
  light: {
    bg: "bg-[#ffffff]",
    text: "text-[#333333]",
    keyword: "text-[#0000ff]",
    string: "text-[#a31515]",
    comment: "text-[#008000]",
    function: "text-[#795e26]",
    number: "text-[#098658]",
    operator: "text-[#333333]"
  },
  cyberpunk: {
    bg: "bg-[#0a0a0f]",
    text: "text-[#e0e0e0]",
    keyword: "text-[#ff00ff]",
    string: "text-[#00ffff]",
    comment: "text-[#ff6b35]",
    function: "text-[#ffff00]",
    number: "text-[#00ff00]",
    operator: "text-[#ff0080]"
  },
  matrix: {
    bg: "bg-black",
    text: "text-[#00ff00]",
    keyword: "text-[#00ff00]",
    string: "text-[#00cc00]",
    comment: "text-[#008800]",
    function: "text-[#00ff41]",
    number: "text-[#55ff55]",
    operator: "text-[#00ff00]"
  }
};

function syntaxHighlight(code: string, theme: keyof typeof themeStyles) {
  const styles = themeStyles[theme];
  
  return code
    .replace(/(\/\/.*$)/gm, `<span class="${styles.comment}">$1</span>`)
    .replace(/(['"`].*?['"`])/g, `<span class="${styles.string}">$1</span>`)
    .replace(/\b(import|export|from|const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|async|await|class|extends|interface|type|enum|namespace|module|declare|abstract|readonly|private|protected|public|static|get|set|new|this|super|typeof|instanceof|in|of|as|is|keyof|infer|unique|symbol)\b/g, `<span class="${styles.keyword}">$1</span>`)
    .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, `<span class="${styles.function}">$1</span>`)
    .replace(/\b(\d+\.?\d*)\b/g, `<span class="${styles.number}">$1</span>`)
    .replace(/([{}[\]()=+\-*/<>!&|:;,.])/g, `<span class="${styles.operator}">$1</span>`);
}

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            scale: 0 
          }}
          animate={{ 
            y: [null, "-10%"],
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}

function GradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(138, 180, 248, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default function CodeCinemaPage() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentScene = codeScenes[currentSceneIndex];
  const theme = themeStyles[currentScene.theme];

  const typeCode = useCallback(() => {
    if (!isPlaying || isPaused) return;

    const fullCode = currentScene.code;
    
    if (displayedCode.length < fullCode.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(fullCode.slice(0, displayedCode.length + 1));
      }, 101 - speed);
      return () => clearTimeout(timeout);
    } else {
      setIsPlaying(false);
    }
  }, [isPlaying, isPaused, displayedCode, currentScene.code, speed]);

  useEffect(() => {
    typeCode();
  }, [typeCode]);

  const handlePlay = () => {
    if (displayedCode === currentScene.code) {
      setDisplayedCode("");
    }
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setDisplayedCode("");
  };

  const handleSceneChange = (index: number) => {
    setCurrentSceneIndex(index);
    setDisplayedCode("");
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentScene.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentScene.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentScene.id}.${currentScene.language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Film className="h-4 w-4" />
            <span className="text-sm font-medium">Cinematic Code Experience</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Code <span className="text-gradient-animated">Cinema</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch code come to life with cinematic typing animations. 
            Experience the artistry of programming.
          </p>
        </ScrollReveal>

        {/* Scene Selector */}
        <ScrollReveal delay={0.1} className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {codeScenes.map((scene, index) => (
              <button
                key={scene.id}
                onClick={() => handleSceneChange(index)}
                className={`px-4 py-3 rounded-xl border transition-all text-left ${
                  currentSceneIndex === index
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Code2 className="w-4 h-4" />
                  <span className="font-medium text-sm">{scene.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{scene.language}</p>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Cinema Display */}
        <ScrollReveal delay={0.2}>
          <motion.div
            layout
            className={`relative rounded-2xl overflow-hidden border border-border ${
              isFullscreen ? "fixed inset-4 z-50" : ""
            }`}
          >
            {/* Background Effects */}
            {currentScene.backgroundEffect === "particles" && <ParticleBackground />}
            {currentScene.backgroundEffect === "gradient" && <GradientBackground />}

            {/* Header Bar */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <Badge variant="outline" className="ml-4">
                  {currentScene.language}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {currentScene.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="relative z-10 bg-card/80 backdrop-blur border-b border-border overflow-hidden"
                >
                  <div className="p-4 flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Speed</span>
                      <Slider
                        value={[speed]}
                        onValueChange={([v]) => setSpeed(v)}
                        min={10}
                        max={100}
                        step={5}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {speed}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Display */}
            <div className={`relative z-10 p-6 overflow-auto ${theme.bg} ${theme.text} font-mono text-sm leading-relaxed`}>
              <pre className="min-h-[400px]">
                <code
                  dangerouslySetInnerHTML={{
                    __html: syntaxHighlight(displayedCode, currentScene.theme)
                  }}
                />
                {(isPlaying || displayedCode.length > 0) && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-2 h-5 bg-primary ml-0.5 align-middle"
                  />
                )}
              </pre>
            </div>

            {/* Progress Bar */}
            <div className="relative z-10 h-1 bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(displayedCode.length / currentScene.code.length) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Controls */}
            <div className="relative z-10 flex items-center justify-center gap-4 p-4 bg-card/80 backdrop-blur border-t border-border">
              <button
                onClick={() => handleSceneChange(Math.max(0, currentSceneIndex - 1))}
                disabled={currentSceneIndex === 0}
                className="p-3 rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-xl hover:bg-muted transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {isPlaying ? (
                <button
                  onClick={handlePause}
                  className="p-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Pause className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={handlePlay}
                  className="p-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Play className="w-6 h-6" />
                </button>
              )}

              <button
                onClick={() => handleSceneChange(Math.min(codeScenes.length - 1, currentSceneIndex + 1))}
                disabled={currentSceneIndex === codeScenes.length - 1}
                className="p-3 rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Scene Info */}
        <ScrollReveal delay={0.3} className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Type className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Language</h3>
              </div>
              <p className="text-muted-foreground">{currentScene.language.toUpperCase()}</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Layout className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Lines of Code</h3>
              </div>
              <p className="text-muted-foreground">{currentScene.code.split("\n").length} lines</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-3">
                <MousePointer className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Characters</h3>
              </div>
              <p className="text-muted-foreground">{currentScene.code.length} chars</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
