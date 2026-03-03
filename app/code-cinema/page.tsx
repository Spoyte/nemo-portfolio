"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Film,
  Sparkles,
  Code2,
  Palette,
  Zap,
  Clock,
  ChevronRight,
  Star,
  Heart,
  Share2,
  Download,
  Subtitles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";

interface CinemaScene {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  duration: number;
  tags: string[];
  color: string;
}

const cinemaScenes: CinemaScene[] = [
  {
    id: "1",
    title: "The Birth of React",
    description: "Watch how a simple component comes to life",
    language: "tsx",
    duration: 15,
    tags: ["React", "Components"],
    color: "#61DAFB",
    code: `import { useState, useEffect } from 'react';

export function MagicCounter() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
      <h2 className="text-2xl font-bold text-white mb-4">
        Magic Counter
      </h2>
      
      <div className={\`
        text-6xl font-bold text-white text-center
        transition-transform duration-300
        \${isAnimating ? 'scale-125' : 'scale-100'}
      \`}>
        {count}
      </div>
      
      <div className="flex gap-3 mt-6 justify-center">
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 
                     rounded-xl text-white font-medium
                     transition-all active:scale-95"
        >
          ✨ Add Magic
        </button>
        
        <button
          onClick={() => setCount(0)}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 
                     rounded-xl text-white/80
                     transition-all active:scale-95"
        >
          Reset
        </button>
      </div>
    </div>
  );
}`,
  },
  {
    id: "2",
    title: "The Animation Awakens",
    description: "Bringing motion to static interfaces",
    language: "tsx",
    duration: 20,
    tags: ["Framer Motion", "Animation"],
    color: "#FF6B6B",
    code: `import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
};

export function AnimatedGrid() {
  const items = ['Design', 'Code', 'Ship', 'Repeat'];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 p-6"
    >
      {items.map((item, index) => (
        <motion.div
          key={item}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            rotate: index % 2 === 0 ? 2 : -2
          }}
          whileTap={{ scale: 0.95 }}
          className={\`
            p-8 rounded-2xl font-bold text-xl text-white
            flex items-center justify-center cursor-pointer
            \${index === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
              : index === 1 ? 'bg-gradient-to-br from-purple-500 to-pink-500'
              : index === 2 ? 'bg-gradient-to-br from-orange-500 to-red-500'
              : 'bg-gradient-to-br from-green-500 to-emerald-500'
            }
          \`}
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}`,
  },
  {
    id: "3",
    title: "The TypeScript Chronicles",
    description: "Type safety in a dynamic world",
    language: "ts",
    duration: 18,
    tags: ["TypeScript", "Types"],
    color: "#3178C6",
    code: `// Define our universe
type Status = 'idle' | 'loading' | 'success' | 'error';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  metadata?: Record<string, unknown>;
}

interface ApiResponse<T> {
  data: T;
  status: Status;
  timestamp: Date;
  message?: string;
}

// The guardian function
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    
    if (!response.ok) {
      return {
        ok: false,
        error: new Error(\`HTTP \${response.status}\`)
      };
    }
    
    const data: ApiResponse<User> = await response.json();
    
    return { ok: true, value: data.data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Usage with full type safety
const result = await fetchUser('123');

if (result.ok) {
  console.log(result.value.name); // ✓ Type-safe access
} else {
  console.error(result.error.message); // ✓ Type-safe error handling
}`,
  },
  {
    id: "4",
    title: "The Hook Heist",
    description: "Stealing complexity with custom hooks",
    language: "ts",
    duration: 22,
    tags: ["React", "Hooks"],
    color: "#FFD93D",
    code: `import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFetchOptions<T> {
  url: string;
  initialData?: T;
  refreshInterval?: number;
  onError?: (error: Error) => void;
}

interface UseFetchReturn<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  abort: () => void;
}

export function useFetch<T>({
  url,
  initialData,
  refreshInterval,
  onError
}: UseFetchOptions<T>): UseFetchReturn<T> {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(\`HTTP Error: \${response.status}\`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
        onError?.(err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, onError]);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh setup
    let intervalId: NodeJS.Timeout;
    if (refreshInterval && refreshInterval > 0) {
      intervalId = setInterval(fetchData, refreshInterval);
    }
    
    return () => {
      abortControllerRef.current?.abort();
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    abort: () => abortControllerRef.current?.abort()
  };
}`,
  },
];

// Syntax highlighting colors
const syntaxColors: Record<string, string> = {
  keyword: "#ff79c6",
  string: "#f1fa8c",
  comment: "#6272a4",
  function: "#50fa7b",
  number: "#bd93f9",
  operator: "#ff79c6",
  punctuation: "#f8f8f2",
  tag: "#ff79c6",
  attribute: "#50fa7b",
  plain: "#f8f8f2",
};

function highlightCode(code: string): JSX.Element[] {
  const lines = code.split("\n");
  return lines.map((line, lineIndex) => {
    const parts: JSX.Element[] = [];
    let remaining = line;
    let keyIndex = 0;

    // Simple syntax highlighting patterns
    const patterns = [
      { regex: /(\/\/.*$)/, type: "comment" },
      { regex: /(\/\*[\s\S]*?\*\/)/, type: "comment" },
      { regex: /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/, type: "string" },
      { regex: /\b(import|export|from|const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|async|await|new|this|class|interface|type|extends|implements|public|private|protected|static|readonly)\b/, type: "keyword" },
      { regex: /\b(true|false|null|undefined)\b/, type: "keyword" },
      { regex: /\b(\d+\.?\d*)\b/, type: "number" },
      { regex: /\b([A-Z][a-zA-Z0-9]*)\b/, type: "function" },
      { regex: /([{}[\]()])/g, type: "punctuation" },
      { regex: /([=+\-*/<>!&|]+)/g, type: "operator" },
    ];

    while (remaining.length > 0) {
      let matched = false;
      
      for (const pattern of patterns) {
        const match = remaining.match(pattern.regex);
        if (match && match.index === 0) {
          const color = syntaxColors[pattern.type] || syntaxColors.plain;
          parts.push(
            <span key={keyIndex++} style={{ color }}>
              {match[0]}
            </span>
          );
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        parts.push(
          <span key={keyIndex++} style={{ color: syntaxColors.plain }}>
            {remaining[0]}
          </span>
        );
        remaining = remaining.slice(1);
      }
    }

    return (
      <div key={lineIndex} className="flex">
        <span className="w-12 text-right pr-4 text-muted-foreground/50 select-none text-sm">
          {lineIndex + 1}
        </span>
        <span className="flex-1 text-sm font-mono">{parts.length > 0 ? parts : " "}</span>
      </div>
    );
  });
}

export default function CodeCinemaPage() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [typedCode, setTypedCode] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const currentScene = cinemaScenes[currentSceneIndex];

  // Typewriter effect for code
  useEffect(() => {
    if (!isPlaying) return;

    const code = currentScene.code;
    const duration = (currentScene.duration * 1000) / playbackSpeed;
    const charDelay = duration / code.length;
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= code.length) {
        setTypedCode(code.slice(0, currentIndex));
        setProgress((currentIndex / code.length) * 100);
        currentIndex++;
      } else {
        setIsPlaying(false);
        setProgress(100);
      }
    }, charDelay);

    return () => clearInterval(interval);
  }, [isPlaying, currentScene, playbackSpeed]);

  // Reset when scene changes
  useEffect(() => {
    setTypedCode("");
    setProgress(0);
    setIsPlaying(false);
  }, [currentSceneIndex]);

  const handlePlayPause = () => {
    if (progress >= 100) {
      setProgress(0);
      setTypedCode("");
    }
    setIsPlaying(!isPlaying);
  };

  const handleSceneChange = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentSceneIndex((prev) => (prev + 1) % cinemaScenes.length);
    } else {
      setCurrentSceneIndex((prev) => (prev - 1 + cinemaScenes.length) % cinemaScenes.length);
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-8" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: currentScene.color + "20" }}
                >
                  <Film className="w-6 h-6" style={{ color: currentScene.color }} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Code Cinema</h1>
                  <p className="text-muted-foreground text-sm">
                    Watch code come to life, one keystroke at a time
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(currentScene.duration / playbackSpeed)}
              </Badge>
              <Badge variant="secondary">{currentScene.language.toUpperCase()}</Badge>
            </div>
          </div>
        </ScrollReveal>

        {/* Cinema Screen */}
        <ScrollReveal delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden bg-[#1e1e2e] border border-border shadow-2xl">
            {/* Screen Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#181825] border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-4 text-sm text-muted-foreground font-mono">
                  {currentScene.title.replace(/\s+/g, "-").toLowerCase()}.{currentScene.language}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleFavorite(currentScene.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.includes(currentScene.id) ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Code Display */}
            <div className="relative h-[400px] md:h-[500px] overflow-auto p-6">
              <div className="font-mono text-sm leading-relaxed">
                {highlightCode(typedCode)}
                {isPlaying && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-2 h-5 bg-primary ml-0.5"
                  />
                )}
              </div>

              {/* Subtitles */}
              <AnimatePresence>
                {showSubtitles && isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 rounded-xl text-center"
                  >
                    <p className="text-white text-sm">{currentScene.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-muted">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-4 py-4 bg-[#181825] border-t border-border/50">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleSceneChange("prev")}>
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleSceneChange("next")}>
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Volume */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={([v]) => setVolume(v)}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                </div>

                {/* Settings */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${showSettings ? "bg-primary/20" : ""}`}
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>

                {/* Subtitles */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${showSubtitles ? "bg-primary/20" : ""}`}
                  onClick={() => setShowSubtitles(!showSubtitles)}
                >
                  <Subtitles className="w-4 h-4" />
                </Button>

                {/* Fullscreen */}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#181825] border-t border-border/50 px-4 py-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Playback Speed</span>
                    <div className="flex gap-2">
                      {[0.5, 1, 1.5, 2].map((speed) => (
                        <Button
                          key={speed}
                          variant={playbackSpeed === speed ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPlaybackSpeed(speed)}
                        >
                          {speed}x
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Scene Info */}
        <ScrollReveal delay={0.2} className="mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentScene.title}</h2>
              <p className="text-muted-foreground">{currentScene.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {currentScene.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Code2 className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download Code
              </Button>
              <Button className="gap-2">
                <Sparkles className="w-4 h-4" />
                Try It Live
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Scene Playlist */}
        <ScrollReveal delay={0.3} className="mt-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            More Scenes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cinemaScenes.map((scene, index) => (
              <motion.button
                key={scene.id}
                onClick={() => setCurrentSceneIndex(index)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  currentSceneIndex === index
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: scene.color + "20" }}
                  >
                    <Code2 className="w-5 h-5" style={{ color: scene.color }} />
                  </div>
                  {favorites.includes(scene.id) && <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
                </div>
                <h4 className="font-semibold mb-1 line-clamp-1">{scene.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{scene.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{scene.language.toUpperCase()}</span>
                  <span>{formatTime(scene.duration)}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.4} className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Film, label: "Total Scenes", value: cinemaScenes.length },
              { icon: Clock, label: "Total Runtime", value: formatTime(cinemaScenes.reduce((acc, s) => acc + s.duration, 0)) },
              { icon: Star, label: "Favorites", value: favorites.length },
              { icon: Zap, label: "Languages", value: new Set(cinemaScenes.map((s) => s.language)).size },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-card border border-border text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
