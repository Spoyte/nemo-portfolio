"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Code2, 
  Terminal,
  Sparkles,
  Copy,
  Check,
  Settings,
  Maximize2,
  Minimize2,
  Download,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import confetti from "canvas-confetti";

// Code snippets for visualization
const codeSnippets = [
  {
    id: "react-component",
    title: "React Component",
    language: "tsx",
    code: `import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function AnimatedCard({ title, children }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="card"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.05 : 1,
        rotateY: isHovered ? 5 : 0
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h2>{title}</h2>
      {children}
    </motion.div>
  );
}`,
    color: "#61DAFB"
  },
  {
    id: "api-route",
    title: "API Route",
    language: "ts",
    code: `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { author: true, tags: true }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`,
    color: "#3178C6"
  },
  {
    id: "css-animation",
    title: "CSS Animation",
    language: "css",
    code: `@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background: linear-gradient(
    -45deg,
    #ee7752,
    #e73c7e,
    #23a6d5,
    #23d5ab
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}`,
    color: "#264de4"
  },
  {
    id: "sql-query",
    title: "Database Query",
    language: "sql",
    code: `WITH ranked_posts AS (
  SELECT 
    p.id,
    p.title,
    p.published_at,
    COUNT(l.post_id) as like_count,
    ROW_NUMBER() OVER (
      PARTITION BY DATE(p.published_at)
      ORDER BY COUNT(l.post_id) DESC
    ) as rank
  FROM posts p
  LEFT JOIN likes l ON p.id = l.post_id
  WHERE p.published_at >= NOW() - INTERVAL '30 days'
  GROUP BY p.id, p.title, p.published_at
)
SELECT 
  id,
  title,
  published_at,
  like_count
FROM ranked_posts
WHERE rank <= 5
ORDER BY published_at DESC, like_count DESC;`,
    color: "#336791"
  }
];

// Tokenize code for animation
function tokenizeCode(code: string): string[] {
  // Split by lines first
  const lines = code.split('\n');
  const tokens: string[] = [];
  
  lines.forEach((line, lineIndex) => {
    // Add line tokens character by character for typing effect
    for (let i = 0; i <= line.length; i++) {
      tokens.push(lines.slice(0, lineIndex).join('\n') + '\n' + line.slice(0, i));
    }
    // Add a pause after each line
    for (let i = 0; i < 3; i++) {
      tokens.push(lines.slice(0, lineIndex + 1).join('\n'));
    }
  });
  
  return tokens;
}

// Syntax highlighting component
function SyntaxHighlightedCode({ 
  code, 
  language, 
  progress,
  showCursor = true 
}: { 
  code: string; 
  language: string; 
  progress: number;
  showCursor?: boolean;
}) {
  const tokens = tokenizeCode(code);
  const currentCode = tokens[Math.min(progress, tokens.length - 1)] || "";
  
  // Simple syntax highlighting
  const highlightCode = (text: string) => {
    const parts: JSX.Element[] = [];
    let remaining = text;
    let key = 0;
    
    // Keywords
    const keywords = /\b(import|export|from|const|let|var|function|return|if|else|try|catch|async|await|class|interface|type|extends|implements|new|this|typeof|instanceof)\b/g;
    
    // Strings
    const strings = /(['"`])((?:\\\1|.)*?)\1/g;
    
    // Comments
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    
    // Numbers
    const numbers = /\b\d+\.?\d*\b/g;
    
    // Functions
    const functions = /\b([a-zA-Z_]\w*)\s*(?=\()/g;
    
    // Process line by line
    const lines = remaining.split('\n');
    
    return lines.map((line, lineIdx) => {
      let processedLine = line;
      const lineParts: JSX.Element[] = [];
      let lineKey = 0;
      
      // Replace comments first (to avoid highlighting inside them)
      processedLine = processedLine.replace(comments, (match) => {
        return `___COMMENT_${lineKey++}___`;
      });
      
      // Replace strings
      processedLine = processedLine.replace(strings, (match) => {
        return `___STRING_${lineKey++}___`;
      });
      
      // Replace keywords
      processedLine = processedLine.replace(keywords, (match) => {
        return `___KEYWORD_${lineKey++}_${match}___`;
      });
      
      // Replace functions
      processedLine = processedLine.replace(functions, (match) => {
        return `___FUNCTION_${lineKey++}_${match}___`;
      });
      
      // Replace numbers
      processedLine = processedLine.replace(numbers, (match) => {
        return `___NUMBER_${lineKey++}___`;
      });
      
      // Split and reconstruct
      const segments = processedLine.split(/(___[A-Z]+_\d+_(?:[^_]+)?___)/g);
      
      segments.forEach((segment, segIdx) => {
        if (segment.startsWith('___COMMENT_')) {
          const match = line.match(comments);
          if (match) {
            lineParts.push(
              <span key={segIdx} className="text-green-500">{match[0]}</span>
            );
          }
        } else if (segment.startsWith('___STRING_')) {
          const match = line.match(strings);
          if (match) {
            lineParts.push(
              <span key={segIdx} className="text-yellow-500">{match[0]}</span>
            );
          }
        } else if (segment.startsWith('___KEYWORD_')) {
          const keyword = segment.replace(/___KEYWORD_\d+_/, '').replace(/___$/, '');
          lineParts.push(
            <span key={segIdx} className="text-purple-400 font-semibold">{keyword}</span>
          );
        } else if (segment.startsWith('___FUNCTION_')) {
          const func = segment.replace(/___FUNCTION_\d+_/, '').replace(/___$/, '');
          lineParts.push(
            <span key={segIdx} className="text-blue-400">{func}</span>
          );
        } else if (segment.startsWith('___NUMBER_')) {
          const match = line.match(numbers);
          if (match) {
            lineParts.push(
              <span key={segIdx} className="text-orange-400">{match[0]}</span>
            );
          }
        } else {
          lineParts.push(<span key={segIdx}>{segment}</span>);
        }
      });
      
      return (
        <div key={lineIdx} className="table-row">
          <span className="table-cell text-right pr-4 text-muted-foreground select-none w-12 text-xs">
            {lineIdx + 1}
          </span>
          <span className="table-cell">
            {lineParts}
            {lineIdx === lines.length - 1 && showCursor && (
              <motion.span
                className="inline-block w-2 h-5 bg-primary ml-0.5 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </span>
        </div>
      );
    });
  };
  
  return (
    <div className="font-mono text-sm leading-relaxed">
      {highlightCode(currentCode)}
    </div>
  );
}

// Cinema screen component
function CinemaScreen({ 
  snippet, 
  isPlaying, 
  progress, 
  speed,
  onProgressChange
}: { 
  snippet: typeof codeSnippets[0];
  isPlaying: boolean;
  progress: number;
  speed: number;
  onProgressChange: (p: number) => void;
}) {
  const tokens = tokenizeCode(snippet.code);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  useEffect(() => {
    if (isPlaying) {
      const animate = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const delta = timestamp - lastTimeRef.current;
        
        if (delta > 1000 / (speed * 10)) {
          onProgressChange(Math.min(progress + 1, tokens.length - 1));
          lastTimeRef.current = timestamp;
        }
        
        if (progress < tokens.length - 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, progress, speed, tokens.length, onProgressChange]);
  
  // Reset when snippet changes
  useEffect(() => {
    onProgressChange(0);
    lastTimeRef.current = 0;
  }, [snippet.id, onProgressChange]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
      {/* Screen header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-3 text-sm text-slate-400">{snippet.title}.{snippet.language}</span>
        </div>
        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
          {snippet.language.toUpperCase()}
        </Badge>
      </div>
      
      {/* Code display */}
      <div className="p-6 overflow-auto max-h-[500px] bg-slate-950">
        <SyntaxHighlightedCode 
          code={snippet.code} 
          language={snippet.language}
          progress={progress}
          showCursor={isPlaying || progress < tokens.length - 1}
        />
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-slate-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-orange-500"
          style={{ width: `${(progress / (tokens.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Control panel component
function ControlPanel({
  isPlaying,
  onPlayPause,
  onReset,
  speed,
  onSpeedChange,
  isFullscreen,
  onToggleFullscreen
}: {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              className="border-slate-700 hover:bg-slate-800"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={onPlayPause}
              className="bg-primary hover:bg-primary/90"
            >
              {isPlaying ? (
                <><Pause className="w-4 h-4 mr-2" /> Pause</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Play</>
              )}
            </Button>
          </div>
          
          {/* Speed control */}
          <div className="flex items-center gap-4 flex-1 max-w-xs">
            <span className="text-sm text-slate-400 whitespace-nowrap">Speed</span>
            <Slider
              value={[speed]}
              onValueChange={([v]) => onSpeedChange(v)}
              min={1}
              max={10}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-slate-400 w-8">{speed}x</span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleFullscreen}
              className="border-slate-700 hover:bg-slate-800"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Stats display
function StatsDisplay({ 
  progress, 
  totalTokens,
  snippet 
}: { 
  progress: number; 
  totalTokens: number;
  snippet: typeof codeSnippets[0];
}) {
  const lines = snippet.code.split('\n').length;
  const chars = snippet.code.length;
  const percent = Math.round((progress / totalTokens) * 100);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Progress", value: `${percent}%`, icon: Terminal },
        { label: "Lines", value: lines.toString(), icon: Code2 },
        { label: "Characters", value: chars.toString(), icon: Copy },
        { label: "Language", value: snippet.language.toUpperCase(), icon: Settings }
      ].map((stat) => (
        <Card key={stat.label} className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800">
              <stat.icon className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CodeCinemaPage() {
  const [selectedSnippet, setSelectedSnippet] = useState(codeSnippets[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const tokens = tokenizeCode(selectedSnippet.code);
  
  const handlePlayPause = () => {
    if (progress >= tokens.length - 1) {
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#22c55e", "#10b981", "#059669"]
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Auto-play on snippet change
  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
  }, [selectedSnippet.id]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-950">
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isFullscreen ? 'max-w-none' : 'max-w-7xl'
      }`}>
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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Code Visualization</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Code Cinema</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Watch code come to life with animated typing and syntax highlighting.
            A cinematic experience for developers.
          </p>
        </motion.div>
        
        {/* Snippet selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Tabs value={selectedSnippet.id} onValueChange={(id) => {
            const snippet = codeSnippets.find(s => s.id === id);
            if (snippet) setSelectedSnippet(snippet);
          }}>
            <TabsList className="bg-slate-900 border border-slate-800">
              {codeSnippets.map((snippet) => (
                <TabsTrigger 
                  key={snippet.id} 
                  value={snippet.id}
                  className="data-[state=active]:bg-slate-800"
                >
                  {snippet.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <StatsDisplay 
            progress={progress} 
            totalTokens={tokens.length}
            snippet={selectedSnippet}
          />
        </motion.div>
        
        {/* Cinema Screen */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <CinemaScreen
            snippet={selectedSnippet}
            isPlaying={isPlaying}
            progress={progress}
            speed={speed}
            onProgressChange={setProgress}
          />
        </motion.div>
        
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <ControlPanel
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        </motion.div>
        
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          <Button
            variant="outline"
            onClick={handleCopy}
            className="border-slate-700 hover:bg-slate-800 text-white"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 hover:bg-slate-800 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 hover:bg-slate-800 text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
