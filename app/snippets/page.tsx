"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  Download,
  Copy,
  Check,
  Code2,
  Sparkles,
  Zap,
  Settings,
  ChevronRight,
  Eye,
  EyeOff,
  Type,
  Palette,
  Layout,
  MousePointer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  complexity: "beginner" | "intermediate" | "advanced";
}

const codeSnippets: CodeSnippet[] = [
  {
    id: "1",
    title: "React useLocalStorage Hook",
    description: "A custom hook for persisting state to localStorage with SSR safety",
    language: "typescript",
    complexity: "intermediate",
    tags: ["react", "hooks", "storage"],
    code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    setIsLoaded(true);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue, isLoaded] as const;
}

export default useLocalStorage;`
  },
  {
    id: "2",
    title: "Debounce Function",
    description: "A utility function to limit how often a function can fire",
    language: "typescript",
    complexity: "intermediate",
    tags: ["utilities", "performance"],
    code: `function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Usage example
const handleSearch = debounce((query: string) => {
  console.log('Searching for:', query);
  // Perform search API call
}, 300);

// In your input handler
// onChange={(e) => handleSearch(e.target.value)}`
  },
  {
    id: "3",
    title: "CSS Grid Masonry Layout",
    description: "A pure CSS approach to masonry-style layouts using grid",
    language: "css",
    complexity: "beginner",
    tags: ["css", "layout"],
    code: `.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 1rem;
}

.masonry-item {
  grid-row: span var(--row-span, 20);
  break-inside: avoid;
}

/* Item heights based on content */
.masonry-item.small {
  --row-span: 15;
}

.masonry-item.medium {
  --row-span: 25;
}

.masonry-item.large {
  --row-span: 35;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .masonry-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .masonry-grid {
    grid-template-columns: 1fr;
  }
}`
  },
  {
    id: "4",
    title: "Intersection Observer Hook",
    description: "React hook for detecting when elements enter the viewport",
    language: "typescript",
    complexity: "advanced",
    tags: ["react", "hooks", "performance"],
    code: `import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const { 
    threshold = 0, 
    root = null, 
    rootMargin = '0px',
    triggerOnce = false 
  } = options;
  
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setIsIntersecting(intersecting);
        
        if (intersecting && triggerOnce) {
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return [ref, isIntersecting];
}

export default useIntersectionObserver;`
  },
  {
    id: "5",
    title: "Fetch with Retry",
    description: "A robust fetch wrapper with automatic retry logic",
    language: "typescript",
    complexity: "advanced",
    tags: ["api", "utilities", "async"],
    code: `interface FetchWithRetryOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

async function fetchWithRetry<T>(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<T> {
  const {
    retries = 3,
    retryDelay = 1000,
    onRetry,
    ...fetchOptions
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < retries) {
        onRetry?.(attempt + 1, lastError);
        
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Usage
const data = await fetchWithRetry('/api/data', {
  retries: 5,
  retryDelay: 500,
  onRetry: (attempt, error) => {
    console.log(\`Retry attempt \${attempt}: \${error.message}\`);
  }
});`
  },
  {
    id: "6",
    title: "Animated Counter",
    description: "A React component that animates counting up to a target number",
    language: "typescript",
    complexity: "intermediate",
    tags: ["react", "animation"],
    code: `import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

function AnimatedCounter({
  target,
  duration = 2000,
  prefix = '',
  suffix = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const startTime = performance.now();
    const startValue = countRef.current;
    const diff = target - startValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = Math.floor(startValue + diff * easeOut);
      countRef.current = currentCount;
      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default AnimatedCounter;`
  }
];

function CodeTypingAnimation({ code, isPlaying, speed, onComplete }: { 
  code: string; 
  isPlaying: boolean; 
  speed: number;
  onComplete?: () => void;
}) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
        
        // Auto-scroll to bottom
        if (codeRef.current) {
          codeRef.current.scrollTop = codeRef.current.scrollHeight;
        }
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [isPlaying, currentIndex, code, speed, onComplete]);

  useEffect(() => {
    if (!isPlaying) {
      setDisplayedCode(code);
      setCurrentIndex(code.length);
    }
  }, [code, isPlaying]);

  return (
    <pre
      ref={codeRef}
      className="font-mono text-sm leading-relaxed overflow-auto max-h-[400px] scrollbar-hide"
    >
      <code className="block">
        {displayedCode}
        {currentIndex < code.length && isPlaying && (
          <span className="animate-pulse">|</span>
        )}
      </code>
    </pre>
  );
}

function SyntaxHighlighter({ code, language }: { code: string; language: string }) {
  // Simple syntax highlighting
  const highlightCode = (code: string) => {
    let highlighted = code
      // Keywords
      .replace(/\b(const|let|var|function|return|if|else|for|while|try|catch|async|await|import|export|from|interface|type|class|extends|implements|new|this|typeof|instanceof)\b/g, '<span class="text-purple-400">$1</span>')
      // Strings
      .replace(/(['"`])(.*?)\1/g, '<span class="text-green-400">$1$2$1</span>')
      // Comments
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
      // Functions
      .replace(/(\w+)(?=\()/g, '<span class="text-blue-400">$1</span>');
    
    return highlighted;
  };

  return (
    <pre className="font-mono text-sm leading-relaxed overflow-auto max-h-[400px] scrollbar-hide">
      <code 
        className="block"
        dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
      />
    </pre>
  );
}

export default function CodeSnippetsPage() {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(codeSnippets[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(20);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [viewMode, setViewMode] = useState<"typing" | "static">("static");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredSnippets = codeSnippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = !selectedTag || snippet.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(codeSnippets.flatMap(s => s.tags)));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedSnippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSnippet.title.toLowerCase().replace(/\s+/g, '-')}.${selectedSnippet.language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const complexityColors = {
    beginner: "bg-green-500/10 text-green-500",
    intermediate: "bg-yellow-500/10 text-yellow-500",
    advanced: "bg-red-500/10 text-red-500"
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
            <Code2 className="h-4 w-4" />
            <span className="text-sm font-medium">Developer Resources</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Code <span className="text-gradient-animated">Snippets</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A curated collection of reusable code snippets with animated typing demos.
            Copy, learn, and use in your projects.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search snippets..."
                className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedTag === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Snippets List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Available Snippets ({filteredSnippets.length})
            </h2>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {filteredSnippets.map((snippet, index) => (
                <motion.button
                  key={snippet.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedSnippet(snippet);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedSnippet.id === snippet.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{snippet.title}</h3>
                    <Badge variant="outline" className={complexityColors[snippet.complexity]}>
                      {snippet.complexity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {snippet.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {snippet.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Code Viewer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm font-medium ml-2">{selectedSnippet.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("typing")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        viewMode === "typing" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <Type className="h-3.5 w-3.5" />
                      Typing
                    </button>
                    <button
                      onClick={() => setViewMode("static")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        viewMode === "static" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      Static
                    </button>
                  </div>
                  
                  {viewMode === "typing" && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm"
                      >
                        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        {isPlaying ? "Pause" : "Play"}
                      </button>
                      <button
                        onClick={() => {
                          setIsPlaying(false);
                          setTimeout(() => setIsPlaying(true), 100);
                        }}
                        className="p-1.5 rounded-lg hover:bg-muted"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {viewMode === "typing" && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Speed</span>
                    <Slider
                      value={[typingSpeed]}
                      onValueChange={(value) => setTypingSpeed(value[0])}
                      min={5}
                      max={100}
                      step={5}
                      className="w-24"
                    />
                  </div>
                )}
              </div>

              {/* Code Display */}
              <div className="p-6 bg-[#0d1117] text-gray-300 overflow-auto">
                {viewMode === "typing" ? (
                  <CodeTypingAnimation
                    code={selectedSnippet.code}
                    isPlaying={isPlaying}
                    speed={105 - typingSpeed}
                  />
                ) : (
                  <SyntaxHighlighter
                    code={selectedSnippet.code}
                    language={selectedSnippet.language}
                  />
                )}
              </div>

              {/* Footer Info */}
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{selectedSnippet.language}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {selectedSnippet.code.split('\n').length} lines
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSnippet.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full bg-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <motion.div
              key={selectedSnippet.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-border"
            >
              <h3 className="font-semibold mb-2">About this snippet</h3>
              <p className="text-muted-foreground text-sm">{selectedSnippet.description}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
