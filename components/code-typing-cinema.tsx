"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw,
  Download,
  Copy,
  Check,
  Settings,
  Maximize2,
  Minimize2,
  Type,
  Zap,
  Coffee,
  Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface TypingConfig {
  speed: number;
  pauseOnPunctuation: boolean;
  showCursor: boolean;
  soundEnabled: boolean;
}

const CODE_SNIPPETS = [
  {
    title: "React Component",
    language: "tsx",
    code: `import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [target]);
  
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-4xl font-bold"
    >
      {count}
    </motion.span>
  );
}`,
  },
  {
    title: "Python Algorithm",
    language: "python",
    code: `def fibonacci_memoization(n, memo=None):
    """
    Calculate Fibonacci number using memoization.
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    if memo is None:
        memo = {}
    
    if n in memo:
        return memo[n]
    
    if n <= 1:
        return n
    
    memo[n] = fibonacci_memoization(n - 1, memo) + \\
               fibonacci_memoization(n - 2, memo)
    
    return memo[n]

# Test the function
for i in range(10):
    print(f"F({i}) = {fibonacci_memoization(i)}")`,
  },
  {
    title: "CSS Animation",
    language: "css",
    code: `@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-gradient {
  background: linear-gradient(
    45deg,
    #ff6b6b,
    #4ecdc4,
    #45b7d1,
    #96ceb4
  );
  background-size: 400% 400%;
  animation: gradient-shift 8s ease infinite;
}

/* Glassmorphism effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}`,
  },
  {
    title: "SQL Query",
    language: "sql",
    code: `WITH RECURSIVE category_tree AS (
  -- Anchor member: start with root categories
  SELECT 
    id,
    name,
    parent_id,
    0 AS level,
    CAST(name AS VARCHAR(1000)) AS path
  FROM categories
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive member: join with children
  SELECT 
    c.id,
    c.name,
    c.parent_id,
    ct.level + 1,
    CONCAT(ct.path, ' > ', c.name)
  FROM categories c
  INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT 
  REPEAT('  ', level) || name AS indented_name,
  path,
  level
FROM category_tree
ORDER BY path;`,
  },
];

const LANGUAGE_COLORS: Record<string, string> = {
  tsx: "#3178c6",
  typescript: "#3178c6",
  python: "#3776ab",
  css: "#264de4",
  sql: "#f29111",
  javascript: "#f7df1e",
  html: "#e34c26",
};

export function CodeTypingCinema() {
  const [selectedSnippet, setSelectedSnippet] = useState(CODE_SNIPPETS[0]);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [config, setConfig] = useState<TypingConfig>({
    speed: 30,
    pauseOnPunctuation: true,
    showCursor: true,
    soundEnabled: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Typing effect
  useEffect(() => {
    if (!isPlaying) return;
    
    const code = selectedSnippet.code;
    
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
        
        // Play sound if enabled
        if (config.soundEnabled && audioRef.current) {
          // Would play typing sound here
        }
        
        // Pause on punctuation
        if (config.pauseOnPunctuation) {
          const char = code[currentIndex];
          if ([".", ";", "{", "}", "(", ")"].includes(char)) {
            // Extra pause handled by the timeout calculation below
          }
        }
      }, config.speed * ([".", ";", "{", "}"].includes(code[currentIndex]) ? 3 : 1));
      
      return () => clearTimeout(timeout);
    } else {
      setIsPlaying(false);
    }
  }, [isPlaying, currentIndex, selectedSnippet, config]);

  const startTyping = () => {
    if (currentIndex >= selectedSnippet.code.length) {
      setDisplayedCode("");
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };

  const pauseTyping = () => {
    setIsPlaying(false);
  };

  const resetTyping = () => {
    setIsPlaying(false);
    setDisplayedCode("");
    setCurrentIndex(0);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const changeSnippet = (snippet: typeof CODE_SNIPPETS[0]) => {
    setSelectedSnippet(snippet);
    setDisplayedCode("");
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const progress = (currentIndex / selectedSnippet.code.length) * 100;

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Type className="h-4 w-4" />
            <span className="text-sm font-medium">Code Cinema</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code Typing <span className="text-gradient-animated">Cinema</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch code being typed in real-time. A cinematic experience for developers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`rounded-2xl overflow-hidden border border-border bg-card transition-all ${
            isFullscreen ? "fixed inset-4 z-50" : ""
          }`}
        >
          <{/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              
              <div className="h-6 w-px bg-border mx-2" />
              
              <select
                value={selectedSnippet.title}
                onChange={(e) => {
                  const snippet = CODE_SNIPPETS.find(s => s.title === e.target.value);
                  if (snippet) changeSnippet(snippet);
                }}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
              >
                {CODE_SNIPPETS.map((s) => (
                  <option key={s.title} value={s.title}>{s.title}</option>
                ))}
              </select>
              
              <Badge 
                variant="outline" 
                style={{ 
                  borderColor: LANGUAGE_COLORS[selectedSnippet.language],
                  color: LANGUAGE_COLORS[selectedSnippet.language]
                }}
              >
                {selectedSnippet.language}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={copyCode}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <{/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-border overflow-hidden"
              >
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Typing Speed</label>
                    <Slider
                      value={[101 - config.speed]}
                      onValueChange={([v]) => setConfig(prev => ({ ...prev, speed: 101 - v }))}
                      min={1}
                      max={100}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Slow</span>
                      <span>Fast</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pause on Punctuation</span>
                      <Switch
                        checked={config.pauseOnPunctuation}
                        onCheckedChange={(v) => setConfig(prev => ({ ...prev, pauseOnPunctuation: v }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Cursor</span>
                      <Switch
                        checked={config.showCursor}
                        onCheckedChange={(v) => setConfig(prev => ({ ...prev, showCursor: v }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sound Effects</span>
                    <Switch
                      checked={config.soundEnabled}
                      onCheckedChange={(v) => setConfig(prev => ({ ...prev, soundEnabled: v }))}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <{/* Code Display */}
          <div 
            ref={containerRef}
            className="relative p-6 font-mono text-sm overflow-auto min-h-[400px] max-h-[600px]"
          >
            <pre className="text-foreground">
              <code>
                {displayedCode}
                {config.showCursor && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-5 bg-primary align-middle ml-0.5"
                  />
                )}
              </code>
            </pre>
          </div>

          <{/* Footer / Controls */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={isPlaying ? pauseTyping : startTyping}
                  className="gap-2"
                >
                  {isPlaying ? (
                    <><Pause className="w-4 h-4" /> Pause</>
                  ) : (
                    <><Play className="w-4 h-4" /> {currentIndex > 0 ? "Resume" : "Play"}</>
                  )}
                </Button>
                
                <Button variant="outline" onClick={resetTyping} className="gap-2">
                  <RotateCcw className="w-4 h-4" /> Reset
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <{/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Code2, label: "Characters", value: selectedSnippet.code.length },
            { icon: Type, label: "Lines", value: selectedSnippet.code.split("\n").length },
            { icon: Zap, label: "Typing Speed", value: `${Math.round(1000 / config.speed)}` + " char/s" },
            { icon: Coffee, label: "Est. Time", value: Math.ceil((selectedSnippet.code.length * config.speed) / 1000) + "s" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-2xl bg-card border border-border text-center"
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
