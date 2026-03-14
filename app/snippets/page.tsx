"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Copy, 
  Check, 
  Search, 
  Terminal,
  FileCode,
  Braces,
  Hash,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
}

const snippets: CodeSnippet[] = [
  {
    id: "1",
    title: "Debounce Function",
    description: "A utility function to debounce function calls, useful for search inputs and resize handlers.",
    language: "typescript",
    code: `export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}`,
    tags: ["utility", "performance", "react"]
  },
  {
    id: "2",
    title: "Copy to Clipboard",
    description: "Modern async clipboard API wrapper with fallback for older browsers.",
    language: "typescript",
    code: `export async function copyToClipboard(text: string): Promise<boolean> {
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
    tags: ["utility", "browser", "async"]
  },
  {
    id: "3",
    title: "Random ID Generator",
    description: "Generate cryptographically secure random IDs with optional prefix.",
    language: "typescript",
    code: `export function generateId(prefix = ''): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  const id = Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return prefix ? \`\${prefix}_\${id}\` : id;
}`,
    tags: ["utility", "security", "id"]
  },
  {
    id: "4",
    title: "Format Date Relative",
    description: "Display relative time like '2 hours ago' or 'just now'.",
    language: "typescript",
    code: `export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return \`\${Math.floor(diffInSeconds / 60)}m ago\`;
  if (diffInSeconds < 86400) return \`\${Math.floor(diffInSeconds / 3600)}h ago\`;
  if (diffInSeconds < 604800) return \`\${Math.floor(diffInSeconds / 86400)}d ago\`;
  
  return date.toLocaleDateString();
}`,
    tags: ["date", "formatting", "utility"]
  },
  {
    id: "5",
    title: "CSS Grid Centering",
    description: "The ultimate centering technique using CSS Grid.",
    language: "css",
    code: `.center-container {
  display: grid;
  place-items: center;
  min-height: 100vh;
}`,
    tags: ["css", "layout", "centering"]
  },
  {
    id: "6",
    title: "Fetch with Timeout",
    description: "Wrap fetch with a timeout to prevent hanging requests.",
    language: "typescript",
    code: `export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 5000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}`,
    tags: ["fetch", "async", "network"]
  },
  {
    id: "7",
    title: "Group By Array",
    description: "Group array items by a key function, similar to Python's itertools.groupby.",
    language: "typescript",
    code: `export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    return {
      ...groups,
      [key]: [...(groups[key] || []), item],
    };
  }, {} as Record<string, T[]>);
}

// Usage:
// const byCategory = groupBy(products, p => p.category);`,
    tags: ["array", "utility", "data"]
  },
  {
    id: "8",
    title: "Intersection Observer Hook",
    description: "React hook for detecting when an element enters the viewport.",
    language: "typescript",
    code: `import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);
  
  return { ref, isInView };
}`,
    tags: ["react", "hooks", "intersection-observer"]
  },
  {
    id: "9",
    title: "Deep Clone",
    description: "Deep clone an object using the structured clone algorithm.",
    language: "typescript",
    code: `export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  
  // Fallback for older browsers
  return JSON.parse(JSON.stringify(obj));
}

// Note: structuredClone handles more types than JSON methods
// including Date, Map, Set, ArrayBuffer, and circular references`,
    tags: ["utility", "object", "clone"]
  },
  {
    id: "10",
    title: "CSS Custom Scrollbar",
    description: "Beautiful custom scrollbar styling with CSS.",
    language: "css",
    code: `/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
}`,
    tags: ["css", "ui", "scrollbar"]
  },
  {
    id: "11",
    title: "Sleep Function",
    description: "Promise-based delay function for async/await flows.",
    language: "typescript",
    code: `export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage:
// await sleep(1000); // Wait 1 second`,
    tags: ["async", "utility", "timing"]
  },
  {
    id: "12",
    title: "Capitalize String",
    description: "Capitalize the first letter of a string.",
    language: "typescript",
    code: `export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Usage:
// capitalize('hello world') // 'Hello world'`,
    tags: ["string", "utility", "formatting"]
  }
];

const languages = ["All", "typescript", "css", "javascript"];

const languageIcons: Record<string, React.ElementType> = {
  "All": Code2,
  "typescript": FileCode,
  "css": Hash,
  "javascript": Braces
};

const languageColors: Record<string, string> = {
  "typescript": "bg-blue-500/10 text-blue-500",
  "css": "bg-pink-500/10 text-pink-500",
  "javascript": "bg-yellow-500/10 text-yellow-500"
};

function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-medium ml-2">{snippet.title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-secondary hover:bg-secondary/80"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
          <code>{snippet.code}</code>
        </pre>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border bg-muted/30">
        <p className="text-sm text-muted-foreground mb-2">{snippet.description}</p>
        <div className="flex items-center gap-2">
          <Badge className={languageColors[snippet.language]}>
            {snippet.language}
          </Badge>
          {snippet.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function SnippetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("All");

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch = 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLanguage = activeLanguage === "All" || snippet.language === activeLanguage;
    
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-medium">Code Collection</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Code{" "}
            <span className="text-gradient-animated">Snippets</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A collection of useful code snippets I use regularly. Copy, paste, and build faster.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-8 mb-8"
        >
          {[
            { label: "Snippets", value: snippets.length },
            { label: "Languages", value: new Set(snippets.map(s => s.language)).size },
            { label: "Tags", value: new Set(snippets.flatMap(s => s.tags)).size },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Language Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {languages.map((language) => {
              const Icon = languageIcons[language];
              return (
                <button
                  key={language}
                  onClick={() => setActiveLanguage(language)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeLanguage === language
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Snippets Grid */}
        <motion.div
          layout
          className="space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSnippets.map((snippet) => (
              <CodeBlock key={snippet.id} snippet={snippet} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredSnippets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No snippets found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 border border-border">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">
              More snippets coming soon! Have a suggestion?{" "}
              <a 
                href="/contact" 
                className="text-primary hover:underline"
              >
                Let me know
              </a>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
