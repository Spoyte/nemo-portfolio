"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Film,
  Code2,
  Sparkles,
  Clock,
  Maximize2,
  Heart,
  Share2,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";

interface CodeScene {
  id: string;
  title: string;
  description: string;
  code: string[];
  duration: number;
  color: string;
  likes: number;
}

const codeScenes: CodeScene[] = [
  {
    id: "birth",
    title: "The Birth of a Component",
    description: "Watch as a simple idea transforms into a living React component",
    duration: 15,
    color: "from-blue-500 to-cyan-500",
    likes: 1247,
    code: [
      "// Initial thought",
      "function App() {",
      "",
      "}",
      "",
      "// Adding structure",
      "function App() {",
      "  return (",
      "    <div />",
      "  )",
      "}",
      "",
      "// Breathing life",
      "function App() {",
      "  const [life, setLife] = useState(0)",
      "",
      "  return (",
      "    <div className=\"alive\">",
      "      <Sparkles />",
      "    </div>",
      "  )",
      "}",
    ]
  },
  {
    id: "loop",
    title: "The Infinite Loop",
    description: "A poetic journey through recursion and self-reference",
    duration: 12,
    color: "from-purple-500 to-pink-500",
    likes: 892,
    code: [
      "function dream() {",
      "  const thought = think()",
      "",
      "  if (thought.isProfound) {",
      "    return thought",
      "  }",
      "",
      "  // Deeper we go",
      "  return dream()",
      "}",
      "",
      "// Where does it end?",
      "// Where does it begin?",
      "const answer = dream()",
      "// The answer is the question",
    ]
  },
  {
    id: "promise",
    title: "Promises in the Dark",
    description: "An async romance between data and destiny",
    duration: 18,
    color: "from-orange-500 to-red-500",
    likes: 2156,
    code: [
      "const future = new Promise((resolve) => {",
      "  setTimeout(() => {",
      "    resolve('destiny')",
      "  }, 1000)",
      "})",
      "",
      "// Waiting...",
      "// Hoping...",
      "",
      "future.then((destiny) => {",
      "  console.log('Arrived:', destiny)",
      "  return destiny.transform()",
      "})",
      ".then((transformed) => {",
      "  // Forever changed",
      "  return transformed.fly()",
      "})",
    ]
  },
  {
    id: "api",
    title: "The API of Love",
    description: "Two services, one connection, endless possibilities",
    duration: 20,
    color: "from-green-500 to-emerald-500",
    likes: 3342,
    code: [
      "// Service A: The Caller",
      "async function reachOut() {",
      "  try {",
      "    const response = await fetch('/heart', {",
      "      method: 'POST',",
      "      body: JSON.stringify({",
      "        feeling: 'love',",
      "        intensity: Infinity",
      "      })",
      "    })",
      "",
      "    if (response.ok) {",
      "      return response.json() // Pure joy",
      "    }",
      "  } catch (error) {",
      "    // Even errors are beautiful",
      "    console.log('Missed connection')",
      "  }",
      "}",
    ]
  },
  {
    id: "closure",
    title: "The Closure",
    description: "A haunting tale of variables that refuse to be forgotten",
    duration: 14,
    color: "from-indigo-500 to-violet-500",
    likes: 1567,
    code: [
      "function createMemory() {",
      "  const secret = 'I remember'",
      "",
      "  return function recall() {",
      "    // Years later...",
      "    console.log(secret)",
      "    // Still here",
      "    return secret",
      "  }",
      "}",
      "",
      "const memory = createMemory()",
      "// The function ends",
      "// But the memory lives on",
      "",
      "memory() // 'I remember'",
    ]
  }
];

export function CodeCinema() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scene = codeScenes[currentScene];

  useEffect(() => {
    if (isPlaying) {
      const totalLines = scene.code.length;
      const lineDuration = (scene.duration * 1000) / totalLines;
      
      intervalRef.current = setInterval(() => {
        setCurrentLine(prev => {
          if (prev >= totalLines - 1) {
            setIsPlaying(false);
            return prev;
          }
          setProgress(((prev + 1) / totalLines) * 100);
          return prev + 1;
        });
      }, lineDuration);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, scene]);

  const handlePlay = () => {
    if (currentLine >= scene.code.length - 1) {
      setCurrentLine(0);
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSceneChange = (direction: "next" | "prev") => {
    setIsPlaying(false);
    setCurrentLine(0);
    setProgress(0);
    setCurrentScene(prev => {
      if (direction === "next") {
        return prev >= codeScenes.length - 1 ? 0 : prev + 1;
      }
      return prev <= 0 ? codeScenes.length - 1 : prev - 1;
    });
  };

  const getLineStyle = (index: number) => {
    if (index > currentLine) return "opacity-20";
    if (index === currentLine) return "opacity-100 text-primary";
    return "opacity-60";
  };

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Film className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Theater</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-animated">Code Cinema</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch code come alive as visual stories. Each scene is a poetic journey 
            through programming concepts, told through animated typewriter effects.
          </p>
        </ScrollReveal>

        {/* Cinema Screen */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto">
            {/* Screen Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-black border-4 border-border shadow-2xl">
              {/* Screen Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-4 text-xs text-muted-foreground font-mono">
                    {scene.title}.js
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {scene.duration}s
                  </Badge>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    {scene.likes + (isLiked ? 1 : 0)}
                  </button>
                </div>
              </div>

              {/* Code Display */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black p-8 overflow-hidden">
                {/* Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${scene.color} opacity-5`} />
                
                {/* Code Lines */}
                <div className="relative font-mono text-sm md:text-base leading-relaxed">
                  {scene.code.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: index <= currentLine ? 1 : 0.2,
                        x: index <= currentLine ? 0 : -20
                      }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${getLineStyle(index)}`}
                    >
                      <span className="w-8 text-right text-muted-foreground mr-4 select-none">
                        {index + 1}
                      </span>
                      <span className={index === currentLine && isPlaying ? "text-primary" : ""}>
                        {line || "\u00A0"}
                      </span>
                      {index === currentLine && isPlaying && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                          className="w-2 h-5 bg-primary ml-1"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Scene Info Overlay */}
                <AnimatePresence>
                  {!isPlaying && currentLine === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/60"
                    >
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">{scene.title}</h3>
                        <p className="text-muted-foreground">{scene.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-muted/20">
                <motion.div
                  className={`h-full bg-gradient-to-r ${scene.color}`}
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between px-4 py-4 bg-muted/10">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSceneChange("prev")}
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={handlePlay}
                    className={`bg-gradient-to-r ${scene.color}`}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSceneChange("next")}
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    {currentScene + 1} / {codeScenes.length}
                  </span>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Scene Selector */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
              {codeScenes.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentScene(index);
                    setCurrentLine(0);
                    setProgress(0);
                    setIsPlaying(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    currentScene === index
                      ? `border-primary bg-primary/10`
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${s.color} flex items-center justify-center mb-2`}>
                    <Code2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-medium truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.duration}s</p>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
