"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Film,
  Sparkles,
  Code2,
  Terminal,
  Cpu,
  Zap,
  Volume2,
  VolumeX,
  Maximize2,
  Settings2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface CodeScene {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string[];
  duration: number;
  icon: React.ElementType;
  color: string;
}

const codeScenes: CodeScene[] = [
  {
    id: "react-hooks",
    title: "The Birth of a Hook",
    description: "Watch useEffect come to life",
    language: "typescript",
    duration: 15,
    icon: Code2,
    color: "#61DAFB",
    code: [
      "import { useState, useEffect } from 'react';",
      "",
      "function useWindowSize() {",
      "  const [size, setSize] = useState({",
      "    width: window.innerWidth,",
      "    height: window.innerHeight",
      "  });",
      "",
      "  useEffect(() => {",
      "    const handleResize = () => {",
      "      setSize({",
      "        width: window.innerWidth,",
      "        height: window.innerHeight",
      "      });",
      "    };",
      "",
      "    window.addEventListener('resize', handleResize);",
      "    return () => window.removeEventListener('resize', handleResize);",
      "  }, []);",
      "",
      "  return size;",
      "}"
    ]
  },
  {
    id: "async-await",
    title: "Async Symphony",
    description: "The dance of promises",
    language: "javascript",
    duration: 12,
    icon: Zap,
    color: "#F7DF1E",
    code: [
      "async function fetchUserData(userId) {",
      "  try {",
      "    const response = await fetch(\`/api/users/\${userId}\`);",
      "    ",
      "    if (!response.ok) {",
      "      throw new Error('User not found');",
      "    }",
      "    ",
      "    const user = await response.json();",
      "    const posts = await fetchUserPosts(user.id);",
      "    ",
      "    return {",
      "      ...user,",
      "      posts,",
      "      lastActive: new Date()",
      "    };",
      "  } catch (error) {",
      "    console.error('Failed to fetch:', error);",
      "    return null;",
      "  }",
      "}"
    ]
  },
  {
    id: "rust-memory",
    title: "Memory Safety Ballet",
    description: "Ownership in motion",
    language: "rust",
    duration: 18,
    icon: Cpu,
    color: "#DEA584",
    code: [
      "struct DataProcessor {",
      "    data: Vec<u8>,",
      "    config: Config,",
      "}",
      "",
      "impl DataProcessor {",
      "    fn new(data: Vec<u8>) -> Self {",
      "        Self {",
      "            data,",
      "            config: Config::default(),",
      "        }",
      "    }",
      "",
      "    fn process(&mut self) -> Result<Vec<u8>, Error> {",
      "        let result = self.data",
      "            .iter()",
      "            .map(|&byte| byte.wrapping_mul(2))",
      "            .collect();",
      "        ",
      "        Ok(result)",
      "    }",
      "}"
    ]
  },
  {
    id: "sql-query",
    title: "Query Optimization",
    description: "The art of database queries",
    language: "sql",
    duration: 10,
    icon: Terminal,
    color: "#336791",
    code: [
      "WITH RECURSIVE category_tree AS (",
      "  SELECT id, name, parent_id, 0 as depth",
      "  FROM categories",
      "  WHERE parent_id IS NULL",
      "  ",
      "  UNION ALL",
      "  ",
      "  SELECT c.id, c.name, c.parent_id, ct.depth + 1",
      "  FROM categories c",
      "  INNER JOIN category_tree ct ON c.parent_id = ct.id",
      ")",
      "SELECT ",
      "  REPEAT('  ', depth) || name as tree_view,",
      "  id,",
      "  depth",
      "FROM category_tree",
      "ORDER BY depth, name;"
    ]
  }
];

function SyntaxHighlighter({ code, progress }: { code: string; progress: number }) {
  const visibleLength = Math.floor(code.length * progress);
  const visibleCode = code.slice(0, visibleLength);
  
  // Simple syntax highlighting
  const highlighted = visibleCode
    .replace(/(const|let|var|function|return|if|else|try|catch|async|await|import|from|class|interface|type)/g, '<span class="text-purple-400">$1</span>')
    .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="text-green-400">$1</span>')
    .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-400">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="text-blue-400">$1</span>');
  
  return (
    <span 
      dangerouslySetInnerHTML={{ __html: highlighted }}
      className="font-mono text-sm leading-relaxed"
    />
  );
}

export default function CodeCinemaPage() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentScene = codeScenes[currentSceneIndex];
  const totalLines = currentScene.code.length;
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setLineProgress((prev) => {
        const newProgress = prev + (0.02 * playbackSpeed);
        
        if (newProgress >= 1) {
          setCurrentLine((line) => {
            if (line >= totalLines - 1) {
              setIsPlaying(false);
              return line;
            }
            return line + 1;
          });
          return 0;
        }
        
        return newProgress;
      });
      
      setProgress((prev) => {
        const newProgress = prev + (0.005 * playbackSpeed);
        return newProgress >= 1 ? 1 : newProgress;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isPlaying, totalLines, playbackSpeed]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setLineProgress(0);
    setCurrentLine(0);
  };
  
  const handleSceneChange = (direction: 'next' | 'prev') => {
    handleReset();
    if (direction === 'next') {
      setCurrentSceneIndex((prev) => (prev + 1) % codeScenes.length);
    } else {
      setCurrentSceneIndex((prev) => (prev - 1 + codeScenes.length) % codeScenes.length);
    }
  };
  
  const handleSeek = (value: number[]) => {
    const newProgress = value[0] / 100;
    setProgress(newProgress);
    const targetLine = Math.floor(newProgress * totalLines);
    setCurrentLine(Math.min(targetLine, totalLines - 1));
    setLineProgress((newProgress * totalLines) % 1);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Film className="h-4 w-4" />
            <span className="text-sm font-medium">Immersive Code Experience</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Code <span className="text-gradient">Cinema</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch code come to life. An immersive theater for algorithms, 
            data structures, and elegant solutions.
          </p>
        </motion.div>

        {/* Cinema Screen */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-2 border-border/50 shadow-2xl">
            {/* Screen Header */}
            <div className="bg-muted/50 px-4 py-3 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <currentScene.icon 
                  className="h-5 w-5" 
                  style={{ color: currentScene.color }}
                />
                <div>
                  <h2 className="font-semibold">{currentScene.title}</h2>
                  <p className="text-xs text-muted-foreground">{currentScene.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentScene.language}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Code Display */}
            <div 
              ref={containerRef}
              className="relative bg-[#0d1117] p-6 min-h-[400px] overflow-hidden"
            >
              {/* Line Numbers */}
              <div className="absolute left-0 top-6 bottom-0 w-12 text-right pr-4 text-muted-foreground/30 font-mono text-sm select-none">
                {currentScene.code.map((_, i) => (
                  <div key={i} className={i === currentLine ? "text-primary" : ""}>
                    {i + 1}
                  </div>
                ))}
              </div>
              
              {/* Code Content */}
              <div className="ml-12 font-mono">
                {currentScene.code.map((line, index) => {
                  const isCurrentLine = index === currentLine;
                  const isPastLine = index < currentLine;
                  const isFutureLine = index > currentLine;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: isFutureLine ? 0.3 : 1,
                        x: 0,
                        scale: isCurrentLine ? 1.02 : 1
                      }}
                      className={`py-0.5 transition-all duration-300 ${
                        isCurrentLine ? "text-white" : ""
                      }`}
                    >
                      {isCurrentLine ? (
                        <span className="relative">
                          <SyntaxHighlighter 
                            code={line} 
                            progress={lineProgress}
                          />
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="inline-block w-2 h-5 bg-primary ml-0.5 align-middle"
                          />
                        </span>
                      ) : (
                        <span className={isPastLine ? "text-gray-400" : "text-gray-600"}>
                          {line || " "}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Glow Effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% ${30 + (progress * 40)}%, ${currentScene.color}10 0%, transparent 50%)`
                }}
              />
            </div>
            
            {/* Controls */}
            <div className="bg-muted/30 px-4 py-4 border-t">
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[progress * 100]}
                  onValueChange={handleSeek}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSceneChange('prev')}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="default"
                    size="icon"
                    onClick={handlePlayPause}
                    className="h-12 w-12"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSceneChange('next')}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                  >
                    <span className="text-xs font-bold">↺</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={([v]) => setVolume(v)}
                      max={100}
                      step={1}
                      className="w-20"
                    />
                  </div>
                  
                  {/* Time Display */}
                  <div className="text-sm text-muted-foreground font-mono">
                    {Math.floor(progress * currentScene.duration)}:{String(Math.floor((progress * currentScene.duration % 1) * 60)).padStart(2, '0')} / {currentScene.duration}:00
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    Playback Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Playback Speed</label>
                    <div className="flex gap-2">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
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
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Now Playing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {codeScenes.map((scene, index) => {
              const Icon = scene.icon;
              const isActive = index === currentSceneIndex;
              
              return (
                <motion.button
                  key={scene.id}
                  onClick={() => {
                    handleReset();
                    setCurrentSceneIndex(index);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isActive 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${scene.color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: scene.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{scene.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {scene.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {scene.language}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {scene.duration}s
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Zap,
              title: "Syntax Highlighting",
              description: "Real-time code coloring as it types out"
            },
            {
              icon: Film,
              title: "Cinematic Experience",
              description: "Immersive full-screen code theater"
            },
            {
              icon: Sparkles,
              title: "Multiple Languages",
              description: "From TypeScript to Rust and beyond"
            }
          ].map((feature, index) => (
            <Card key={feature.title} className="text-center p-6">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
