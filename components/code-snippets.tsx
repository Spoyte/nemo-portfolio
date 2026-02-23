"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Copy, 
  Check, 
  Search, 
  Code2, 
  Hash,
  Share2,
  Sparkles,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  author: string;
  likes: number;
}

const snippets: CodeSnippet[] = [
  {
    id: "1",
    title: "Debounce Hook",
    description: "React hook for debouncing values with cleanup",
    language: "typescript",
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    tags: ["react", "hooks", "performance"],
    author: "Nemo",
    likes: 128
  },
  {
    id: "2",
    title: "Copy to Clipboard",
    description: "Modern clipboard API with fallback",
    language: "typescript",
    code: `async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}`,
    tags: ["utilities", "browser-api"],
    author: "Nemo",
    likes: 95
  },
  {
    id: "3",
    title: "Random Color Generator",
    description: "Generate beautiful random colors with HSL",
    language: "typescript",
    code: `function generateRandomColor(options?: {
  hue?: number | [number, number];
  saturation?: number | [number, number];
  lightness?: number | [number, number];
}): string {
  const h = Array.isArray(options?.hue) 
    ? Math.random() * (options.hue[1] - options.hue[0]) + options.hue[0]
    : options?.hue ?? Math.random() * 360;
    
  const s = Array.isArray(options?.saturation)
    ? Math.random() * (options.saturation[1] - options.saturation[0]) + options.saturation[0]
    : options?.saturation ?? 70;
    
  const l = Array.isArray(options?.lightness)
    ? Math.random() * (options.lightness[1] - options.lightness[0]) + options.lightness[0]
    : options?.lightness ?? 50;

  return \`hsl(\${Math.round(h)}, \${Math.round(s)}%, \${Math.round(l)}%)\`;
}

// Usage: generateRandomColor({ hue: [180, 240], saturation: 60 })`,
    tags: ["colors", "utilities", "design"],
    author: "Nemo",
    likes: 156
  },
  {
    id: "4",
    title: "Sleep Function",
    description: "Promise-based delay utility",
    language: "typescript",
    code: `const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Usage with async/await
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(1000 * (i + 1)); // Exponential backoff
    }
  }
}`,
    tags: ["async", "utilities", "fetch"],
    author: "Nemo",
    likes: 203
  },
  {
    id: "5",
    title: "LocalStorage Hook",
    description: "Type-safe localStorage with SSR support",
    language: "typescript",
    code: `import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get stored value or use initial
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}`,
    tags: ["react", "hooks", "storage"],
    author: "Nemo",
    likes: 178
  },
  {
    id: "6",
    title: "Intersection Observer Hook",
    description: "Detect when element enters viewport",
    language: "typescript",
    code: `import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        
        if (inView && triggerOnce) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
}`,
    tags: ["react", "hooks", "performance"],
    author: "Nemo",
    likes: 142
  },
  {
    id: "7",
    title: "CSS Grid Masonry",
    description: "Pure CSS masonry layout",
    language: "css",
    code: `.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 1rem;
}

.masonry-item {
  grid-row: span var(--row-span, 20);
}

/* JavaScript to calculate row spans */
function layoutMasonry() {
  const items = document.querySelectorAll('.masonry-item');
  items.forEach(item => {
    const height = item.getBoundingClientRect().height;
    const rowSpan = Math.ceil(height / 10);
    item.style.setProperty('--row-span', rowSpan);
  });
}`,
    tags: ["css", "layout", "grid"],
    author: "Nemo",
    likes: 89
  },
  {
    id: "8",
    title: "Fetch with Timeout",
    description: "Abort fetch requests that take too long",
    language: "typescript",
    code: `async function fetchWithTimeout(
  url: string, 
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 5000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(\`Request timed out after \${timeout}ms\`);
    }
    throw error;
  }
}

// Usage
const data = await fetchWithTimeout('/api/data', { timeout: 3000 });`,
    tags: ["fetch", "async", "utilities"],
    author: "Nemo",
    likes: 167
  }
];

const languages = ["all", "typescript", "javascript", "css", "python"];

function SyntaxHighlighter({ code, language }: { code: string; language: string }) {
  // Simple syntax highlighting
  const highlightCode = (code: string) => {
    return code
      .replace(/(\/\/.*$)/gm, '<span class="text-muted-foreground">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-muted-foreground">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|async|await|import|export|from|try|catch|throw|new|typeof|instanceof)\b/g, '<span class="text-purple-400">$1</span>')
      .replace(/\b(string|number|boolean|Promise|void|any|unknown|never)\b/g, '<span class="text-cyan-400">$1</span>')
      .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="text-green-400">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
  };

  return (
    <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
      <code 
        className="block"
        dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
      />
    </pre>
  );
}

export function CodeSnippetsLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedSnippets, setLikedSnippets] = useState<Set<string>>(new Set());

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLanguage = selectedLanguage === "all" || snippet.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleLike = (id: string) => {
    setLikedSnippets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {languages.map(lang => (
            <Button
              key={lang}
              variant={selectedLanguage === lang ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLanguage(lang)}
              className="capitalize"
            >
              {lang}
            </Button>
          ))}
        </div>
      </div>

      {/* Snippets Grid */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSnippets.map((snippet, index) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group overflow-hidden hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Code2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {snippet.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{snippet.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {snippet.language}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(snippet.code, snippet.id)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedId === snippet.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {snippet.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <SyntaxHighlighter code={snippet.code} language={snippet.language} />
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {snippet.author}</span>
                      <button
                        onClick={() => toggleLike(snippet.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          likedSnippets.has(snippet.id) ? "text-red-500" : "hover:text-red-500"
                        }`}
                      >
                        <Sparkles className={`h-4 w-4 ${likedSnippets.has(snippet.id) ? "fill-current" : ""}`} />
                        <span>{snippet.likes + (likedSnippets.has(snippet.id) ? 1 : 0)}</span>
                      </button>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredSnippets.length === 0 && (
        <div className="text-center py-12">
          <Terminal className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No snippets found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => { setSearchQuery(""); setSelectedLanguage("all"); }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
