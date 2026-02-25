"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Copy,
  Check,
  Code2,
  Terminal,
  FileCode,
  Database,
  Globe,
  Server,
  Smartphone,
  Palette,
  Sparkles,
  Bookmark,
  Share2,
  Filter,
  X,
  ChevronRight,
  Star,
  Clock,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { highlight } from "shiki";

interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  author: string;
  likes: number;
  createdAt: string;
  isFavorite?: boolean;
}

const categories = [
  { id: "all", label: "All", icon: Code2 },
  { id: "react", label: "React", icon: FileCode },
  { id: "typescript", label: "TypeScript", icon: Terminal },
  { id: "css", label: "CSS", icon: Palette },
  { id: "nodejs", label: "Node.js", icon: Server },
  { id: "database", label: "Database", icon: Database },
  { id: "api", label: "API", icon: Globe },
  { id: "mobile", label: "Mobile", icon: Smartphone },
];

const snippets: Snippet[] = [
  {
    id: "1",
    title: "React useDebounce Hook",
    description: "A custom hook for debouncing values in React components",
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
}

// Usage
const debouncedSearch = useDebounce(searchTerm, 500);`,
    language: "typescript",
    category: "react",
    tags: ["hooks", "performance", "utilities"],
    author: "Nemo",
    likes: 234,
    createdAt: "2025-02-20",
  },
  {
    id: "2",
    title: "CSS Grid Masonry Layout",
    description: "Pure CSS masonry layout using grid-template-rows",
    code: `.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 1rem;
}

.masonry-item {
  grid-row: span var(--row-span, 20);
}

/* Dynamic row span based on content */
.masonry-item:nth-child(3n) {
  --row-span: 25;
}

.masonry-item:nth-child(3n + 1) {
  --row-span: 15;
}

.masonry-item:nth-child(3n + 2) {
  --row-span: 20;
}`,
    language: "css",
    category: "css",
    tags: ["layout", "grid", "responsive"],
    author: "Nemo",
    likes: 189,
    createdAt: "2025-02-18",
  },
  {
    id: "3",
    title: "Fetch with Retry Logic",
    description: "Robust fetch wrapper with exponential backoff",
    code: `async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}`,
    language: "typescript",
    category: "api",
    tags: ["fetch", "error-handling", "async"],
    author: "Nemo",
    likes: 312,
    createdAt: "2025-02-15",
  },
  {
    id: "4",
    title: "PostgreSQL Connection Pool",
    description: "Optimized connection pool configuration for Node.js",
    code: `import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  
  // Connection pool settings
  max: 20, // Maximum number of clients
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 2000, // Return error after 2s
  
  // SSL for production
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export default pool;`,
    language: "typescript",
    category: "database",
    tags: ["postgresql", "database", "performance"],
    author: "Nemo",
    likes: 156,
    createdAt: "2025-02-12",
  },
  {
    id: "5",
    title: "React Native Biometric Auth",
    description: "Biometric authentication with fallback",
    code: `import * as LocalAuthentication from 'expo-local-authentication';

export async function authenticateWithBiometrics(): Promise<{
  success: boolean;
  error?: string;
}> {
  // Check if hardware supports biometrics
  const compatible = await LocalAuthentication.hasHardwareAsync();
  
  if (!compatible) {
    return { success: false, error: 'Biometrics not supported' };
  }

  // Check if biometrics are enrolled
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  
  if (!enrolled) {
    return { success: false, error: 'No biometrics enrolled' };
  }

  // Authenticate
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to continue',
    fallbackLabel: 'Use passcode',
    disableDeviceFallback: false,
  });

  return {
    success: result.success,
    error: result.error,
  };
}`,
    language: "typescript",
    category: "mobile",
    tags: ["react-native", "security", "auth"],
    author: "Nemo",
    likes: 278,
    createdAt: "2025-02-10",
  },
  {
    id: "6",
    title: "Express Rate Limiter",
    description: "Custom rate limiting middleware for Express",
    code: `import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimiter(
  windowMs = 60000, // 1 minute
  maxRequests = 100
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    // Clean up expired entries
    if (store[key] && now > store[key].resetTime) {
      delete store[key];
    }

    // Initialize or increment counter
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      store[key].count++;
    }

    // Check limit
    if (store[key].count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
      });
    }

    // Add headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - store[key].count);

    next();
  };
}`,
    language: "typescript",
    category: "nodejs",
    tags: ["express", "security", "middleware"],
    author: "Nemo",
    likes: 423,
    createdAt: "2025-02-08",
  },
];

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState("");

  useEffect(() => {
    highlight(code, { lang: language as any, theme: "github-dark" }).then(setHighlighted);
  }, [code, language]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          className="gap-2"
          onClick={copyCode}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <div
        className="rounded-lg overflow-hidden text-sm"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}

function SnippetCard({
  snippet,
  isFavorite,
  onToggleFavorite,
}: {
  snippet: Snippet;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="overflow-hidden hover:border-primary/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {snippet.title}
                <Badge variant="secondary" className="text-xs">
                  {snippet.language}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">{snippet.description}</CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={isFavorite ? "text-yellow-500" : ""}
                onClick={() => onToggleFavorite(snippet.id)}
              >
                <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CodeBlock code={snippet.code} language={snippet.language} />
              </motion.div>
            )}
          </AnimatePresence>

          {!expanded && (
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-hidden max-h-24">
                <code>{snippet.code.slice(0, 200)}...</code>
              </pre>
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {snippet.likes}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {snippet.createdAt}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show less" : "Show code"}
              <ChevronRight
                className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`}
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CodeSnippetLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("snippet-favorites");
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("snippet-favorites", JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.success("Removed from favorites");
      } else {
        next.add(id);
        toast.success("Added to favorites");
      }
      return next;
    });
  };

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || snippet.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || favorites.has(snippet.id);
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Code2 className="h-4 w-4" />
            <span className="text-sm font-medium">Code Library</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Snippet Collection</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated code snippets for common development tasks. Copy, paste, and ship faster.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              className="gap-2"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Bookmark className="h-4 w-4" />
              {showFavoritesOnly ? "Showing Favorites" : "Show Favorites"}
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 mb-8 text-sm text-muted-foreground"
        >
          <span>{filteredSnippets.length} snippets found</span>
          <span>·</span>
          <span>{favorites.size} favorites</span>
        </motion.div>

        {/* Snippets Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                isFavorite={favorites.has(snippet.id)}
                onToggleFavorite={toggleFavorite}
              />
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center"
            >
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No snippets found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setShowFavoritesOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Submit CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Have a useful snippet?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Share your code with the community. Submit your snippets and help others ship faster.
              </p>
              <Button size="lg">
                Submit a Snippet
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
