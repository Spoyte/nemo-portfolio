"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Code2, 
  Terminal,
  Copy,
  Check,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  Type,
  Zap,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeScene {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  theme: "dark" | "light" | "cyberpunk" | "matrix";
  speed: number;
  cursorStyle: "block" | "line" | "underscore";
}

const codeScenes: CodeScene[] = [
  {
    id: "react-component",
    title: "React Component Creation",
    description: "Watch a React component come to life with hooks and TypeScript",
    language: "tsx",
    theme: "dark",
    speed: 50,
    cursorStyle: "line",
    code: `import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

export function Counter({ 
  initialValue = 0, 
  step = 1 
}: CounterProps) {
  const [count, setCount] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    console.log(\`Count changed to: \${count}\`);
  }, [count]);

  const increment = () => {
    setIsAnimating(true);
    setCount(prev => prev + step);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.div
      className="p-6 rounded-2xl bg-card"
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="text-2xl font-bold mb-4">
        Count: {count}
      </h2>
      <button
        onClick={increment}
        className="px-4 py-2 bg-primary rounded-lg"
      >
        Increment
      </button>
    </motion.div>
  );
}`
  },
  {
    id: "api-route",
    title: "Next.js API Route",
    description: "Building a type-safe API endpoint with error handling",
    language: "ts",
    theme: "cyberpunk",
    speed: 40,
    cursorStyle: "block",
    code: `import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = userSchema.parse(body);
    
    // Simulate database operation
    const user = await prisma.user.create({
      data: validated,
    });
    
    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}`
  },
  {
    id: "css-animation",
    title: "CSS Keyframe Animation",
    description: "Creating a mesmerizing loading animation with pure CSS",
    language: "css",
    theme: "matrix",
    speed: 30,
    cursorStyle: "underscore",
    code: `@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

@keyframes rotate-gradient {
  0% {
    --angle: 0deg;
  }
  100% {
    --angle: 360deg;
  }
}

.loader {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(
    from var(--angle),
    #ff006e,
    #8338ec,
    #3a86ff,
    #06ffa5,
    #ffbe0b,
    #ff006e
  );
  animation: rotate-gradient 3s linear infinite;
  filter: blur(8px);
}

.loader::before {
  content: '';
  position: absolute;
  inset: 4px;
  background: #000;
  border-radius: 50%;
  z-index: 1;
}

.loader::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #ff006e;
  animation: pulse-ring 2s ease-in-out infinite;
}`
  },
  {
    id: "rust-function",
    title: "Rust Async Function",
    description: "Safe concurrent data processing with Rust's type system",
    language: "rust",
    theme: "light",
    speed: 45,
    cursorStyle: "line",
    code: `use tokio::sync::mpsc;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    id: u64,
    name: String,
    email: String,
    created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug)]
enum ProcessingError {
    InvalidData(String),
    DatabaseError(sqlx::Error),
    Timeout,
}

pub async fn process_users_batch(
    users: Vec<User>,
    batch_size: usize,
) -> Result<HashMap<u64, User>, ProcessingError> {
    let (tx, mut rx) = mpsc::channel(batch_size);
    let mut handles = vec![];
    
    // Spawn worker tasks
    for chunk in users.chunks(batch_size) {
        let chunk = chunk.to_vec();
        let tx = tx.clone();
        
        let handle = tokio::spawn(async move {
            for user in chunk {
                // Validate user data
                if user.name.is_empty() || !user.email.contains('@') {
                    continue;
                }
                
                // Process and send
                if tx.send(user).await.is_err() {
                    break;
                }
            }
        });
        
        handles.push(handle);
    }
    
    // Collect results
    drop(tx);
    let mut results = HashMap::new();
    
    while let Some(user) = rx.recv().await {
        results.insert(user.id, user);
    }
    
    // Wait for all tasks
    for handle in handles {
        handle.await.map_err(|_| ProcessingError::Timeout)?;
    }
    
    Ok(results)
}`
  }
];

const themes = {
  dark: {
    bg: "#1e1e1e",
    text: "#d4d4d4",
    keyword: "#569cd6",
    string: "#ce9178",
    comment: "#6a9955",
    function: "#dcdcaa",
    number: "#b5cea8",
    operator: "#d4d4d4",
    cursor: "#d4d4d4",
  },
  light: {
    bg: "#ffffff",
    text: "#333333",
    keyword: "#0000ff",
    string: "#a31515",
    comment: "#008000",
    function: "#795e26",
    number: "#098658",
    operator: "#333333",
    cursor: "#333333",
  },
  cyberpunk: {
    bg: "#0a0a0f",
    text: "#00ff9f",
    keyword: "#ff00ff",
    string: "#00ffff",
    comment: "#7c7c7c",
    function: "#ffaa00",
    number: "#ff6b6b",
    operator: "#00ff9f",
    cursor: "#ff00ff",
  },
  matrix: {
    bg: "#000000",
    text: "#00ff41",
    keyword: "#00cc33",
    string: "#66ff66",
    comment: "#008f11",
    function: "#99ff99",
    number: "#ccffcc",
    operator: "#00ff41",
    cursor: "#00ff41",
  },
};

function syntaxHighlight(code: string, theme: keyof typeof themes) {
  const colors = themes[theme];
  
  // Simple syntax highlighting
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Keywords
  const keywords = /\b(import|export|from|const|let|var|function|return|if|else|try|catch|async|await|interface|type|enum|struct|impl|pub|use|mod|trait|where|for|while|loop|match|fn|mut|ref|move|box|dyn)\b/g;
  highlighted = highlighted.replace(keywords, `<span style="color:${colors.keyword}">$1</span>`);
  
  // Strings
  const strings = /(['"`])(.*?)(\1)/g;
  highlighted = highlighted.replace(strings, `<span style="color:${colors.string}">$1$2$3</span>`);
  
  // Comments
  const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm;
  highlighted = highlighted.replace(comments, `<span style="color:${colors.comment}">$1</span>`);
  
  // Numbers
  const numbers = /\b(\d+\.?\d*)\b/g;
  highlighted = highlighted.replace(numbers, `<span style="color:${colors.number}">$1</span>`);
  
  return highlighted;
}

function TypewriterEffect({ 
  text, 
  isPlaying, 
  speed, 
  onComplete,
  highlightedText 
}: { 
  text: string; 
  isPlaying: boolean; 
  speed: number;
  onComplete?: () => void;
  highlightedText: string;
}) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (!isPlaying) return;
    
    if (displayedChars < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedChars(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [displayedChars, isPlaying, speed, text.length, isComplete, onComplete]);
  
  const lines = text.slice(0, displayedChars).split('\n');
  const highlightedLines = highlightedText.split('\n');
  
  return (
    <div className="font-mono text-sm leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="select-none text-muted-foreground w-12 text-right pr-4 opacity-50">
            {i + 1}
          </span>
          <span 
            className="flex-1"
            dangerouslySetInnerHTML={{ 
              __html: highlightedLines[i] || ''
            }}
          />
        </div>
      ))}
      {isPlaying && displayedChars < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
}

export default function CodeCinemaPage() {
  const [selectedScene, setSelectedScene] = useState<CodeScene>(codeScenes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentTheme = themes[selectedScene.theme];
  const highlightedCode = syntaxHighlight(selectedScene.code, selectedScene.theme);
  
  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setTimeout(() => setIsPlaying(true), 100);
  };
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(selectedScene.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSceneChange = (scene: CodeScene) => {
    setSelectedScene(scene);
    setIsPlaying(false);
    setProgress(0);
    setTimeout(() => setIsPlaying(true), 300);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Experience</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Code <span className="text-gradient-animated">Cinema</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch code come to life. Select a scene and enjoy the show as algorithms 
            and components unfold before your eyes.
          </p>
        </motion.div>

        {/* Scene Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {codeScenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleSceneChange(scene)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedScene.id === scene.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4 text-primary" />
                <Badge variant="outline" className="text-xs">
                  {scene.language}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1">{scene.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {scene.description}
              </p>
            </button>
          ))}
        </motion.div>

        {/* Cinema Screen */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`relative rounded-2xl overflow-hidden border border-border ${
            isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
          }`}
          style={{ backgroundColor: currentTheme.bg }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm font-medium" style={{ color: currentTheme.text }}>
                {selectedScene.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8"
                style={{ color: currentTheme.text }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8"
                style={{ color: currentTheme.text }}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Code Display */}
          <div 
            className="p-6 overflow-auto"
            style={{ 
              backgroundColor: currentTheme.bg,
              minHeight: isFullscreen ? "calc(100vh - 140px)" : "400px",
              maxHeight: isFullscreen ? "calc(100vh - 140px)" : "500px"
            }}
          >
            <TypewriterEffect
              text={selectedScene.code}
              highlightedText={highlightedCode}
              isPlaying={isPlaying}
              speed={selectedScene.speed / playbackSpeed}
              onComplete={() => setIsPlaying(false)}
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/20">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlay}
                className="h-9 w-9"
                style={{ color: currentTheme.text }}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="h-9 w-9"
                style={{ color: currentTheme.text }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Speed</span>
                <Slider
                  value={[playbackSpeed]}
                  onValueChange={([v]) => setPlaybackSpeed(v)}
                  min={0.5}
                  max={3}
                  step={0.5}
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {playbackSpeed}x
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-6 rounded-xl bg-card border border-border">
            <Type className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Typewriter Effect</h3>
            <p className="text-sm text-muted-foreground">
              Watch code being typed character by character, just like a real developer at work.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Sparkles className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Syntax Highlighting</h3>
            <p className="text-sm text-muted-foreground">
              Beautiful color-coded syntax for multiple languages and themes.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Settings className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Customizable</h3>
            <p className="text-sm text-muted-foreground">
              Adjust playback speed, themes, and cursor styles to your preference.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
