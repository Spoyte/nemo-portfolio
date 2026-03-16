"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Code2, 
  Terminal,
  FileJson,
  Braces,
  Hash,
  Sparkles,
  Download,
  Share2,
  Bookmark,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  author: string;
  likes: number;
  views: number;
  copied: number;
  createdAt: Date;
}

const sampleSnippets: CodeSnippet[] = [
  {
    id: "1",
    title: "React useDebounce Hook",
    description: "A custom hook for debouncing values in React components",
    language: "typescript",
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    tags: ["react", "hooks", "performance"],
    author: "Nemo",
    likes: 247,
    views: 1843,
    copied: 89,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "CSS Grid Masonry Layout",
    description: "Pure CSS masonry layout using grid-template-rows",
    language: "css",
    code: `.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 1rem;
}

.masonry-item {
  grid-row: span var(--row-span, 20);
  border-radius: 0.5rem;
  overflow: hidden;
}`,
    tags: ["css", "layout", "grid"],
    author: "Nemo",
    likes: 156,
    views: 923,
    copied: 45,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    title: "Async Retry with Exponential Backoff",
    description: "Retry failed async operations with exponential backoff",
    language: "typescript",
    code: `async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}`,
    tags: ["typescript", "async", "utilities"],
    author: "Nemo",
    likes: 312,
    views: 2156,
    copied: 134,
    createdAt: new Date("2024-01-28"),
  },
  {
    id: "4",
    title: "Intersection Observer Hook",
    description: "Detect when elements enter/leave viewport",
    language: "typescript",
    code: `import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}`,
    tags: ["react", "hooks", "dom"],
    author: "Nemo",
    likes: 189,
    views: 1456,
    copied: 67,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "5",
    title: "Deep Clone Utility",
    description: "Deep clone objects with circular reference handling",
    language: "typescript",
    code: `function deepClone<T>(obj: T, seen = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);
  
  const clone: any = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], seen);
    }
  }
  
  return clone;
}`,
    tags: ["typescript", "utilities", "algorithms"],
    author: "Nemo",
    likes: 278,
    views: 1987,
    copied: 112,
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "6",
    title: "Format Relative Time",
    description: "Human-readable relative time formatting",
    language: "typescript",
    code: `const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const divisions: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
];

export function formatRelativeTime(date: Date): string {
  let duration = (date.getTime() - Date.now()) / 1000;
  
  for (let i = 0; i < divisions.length; i++) {
    const division = divisions[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
  return formatter.format(Math.round(duration), 'years');
}`,
    tags: ["typescript", "i18n", "dates"],
    author: "Nemo",
    likes: 423,
    views: 3421,
    copied: 201,
    createdAt: new Date("2024-01-20"),
  },
];

const languageIcons: Record<string, React.ReactNode> = {
  typescript: <Code2 className="w-4 h-4" />,
  javascript: <Code2 className="w-4 h-4" />,
  css: <Hash className="w-4 h-4" />,
  python: <Terminal className="w-4 h-4" />,
  json: <FileJson className="w-4 h-4" />,
  default: <Braces className="w-4 h-4" />,
};

const languageColors: Record<string, string> = {
  typescript: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  javascript: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  css: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  python: "bg-green-500/10 text-green-500 border-green-500/20",
  json: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  default: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function CodeSnippetsLibrary() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(sampleSnippets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLanguage = selectedLanguage ? snippet.language === selectedLanguage : true;
    
    return matchesSearch && matchesLanguage;
  });

  const languages = Array.from(new Set(snippets.map(s => s.language)));

  const handleCopy = async (snippet: CodeSnippet, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    
    // Update copy count
    setSnippets(prev => prev.map(s => 
      s.id === snippet.id ? { ...s, copied: s.copied + 1 } : s
    ));
    
    setTimeout(() => setCopiedId(null), 2000);
  };

  const highlightCode = (code: string, language: string) => {
    // Simple syntax highlighting - in production, use a library like Prism or Shiki
    return code.split('\n').map((line, i) => (
      <div key={i} className="table-row">
        <span className="table-cell text-right pr-4 text-muted-foreground/50 select-none w-12">
          {i + 1}
        </span>
        <span className="table-cell whitespace-pre">{line || ' '}</span>
      </div>
    ));
  };

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Code Collection</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code{" "}
            <span className="text-gradient-animated">Snippets</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated collection of useful code snippets. Copy, modify, and use them in your projects.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setSelectedLanguage(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedLanguage === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All
              </button>
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                    selectedLanguage === lang
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSnippets.map((snippet, index) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedSnippet(snippet)}
              className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${languageColors[snippet.language] || languageColors.default}`}>
                    {languageIcons[snippet.language] || languageIcons.default}
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {snippet.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{snippet.description}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleCopy(snippet, e)}
                  className="shrink-0"
                >
                  {copiedId === snippet.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Code Preview */}
              <div className="relative bg-muted/50">
                <ScrollArea className="h-48">
                  <pre className="p-4 text-sm font-mono">
                    <code className="table">
                      {highlightCode(snippet.code.split('\n').slice(0, 8).join('\n'), snippet.language)}
                    </code>
                  </pre>
                </ScrollArea>
                
                {snippet.code.split('\n').length > 8 && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-muted/50 to-transparent" />
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  {snippet.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {snippet.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Copy className="w-3 h-3" /> {snippet.copied}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSnippets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No snippets found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSnippet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedSnippet(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-card border border-border overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg border ${languageColors[selectedSnippet.language] || languageColors.default}`}>
                  {languageIcons[selectedSnippet.language] || languageIcons.default}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedSnippet.title}</h3>
                  <p className="text-muted-foreground">{selectedSnippet.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleCopy(selectedSnippet)}>
                  {copiedId === selectedSnippet.id ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy Code</>
                  )}
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <ScrollArea className="max-h-[60vh]">
              <pre className="p-6 text-sm font-mono bg-muted/30">
                <code className="table">
                  {highlightCode(selectedSnippet.code, selectedSnippet.language)}
                </code>
              </pre>
            </ScrollArea>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
              <div className="flex items-center gap-2">
                {selectedSnippet.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> {selectedSnippet.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Copy className="w-4 h-4" /> {selectedSnippet.copied} copies
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
