"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Tag,
  Search,
  Filter,
  Grid3X3,
  List,
  Folder,
  Star,
  Clock,
  Link2,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/scroll-animations";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  category: string;
  favicon?: string;
  createdAt: string;
  isFavorite: boolean;
}

const initialBookmarks: Bookmark[] = [
  {
    id: "1",
    title: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    description: "The official Next.js documentation with guides and API references.",
    tags: ["nextjs", "react", "docs"],
    category: "Documentation",
    createdAt: "2025-03-01",
    isFavorite: true
  },
  {
    id: "2",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "Utility-first CSS framework for rapid UI development.",
    tags: ["css", "styling", "framework"],
    category: "Tools",
    createdAt: "2025-03-02",
    isFavorite: true
  },
  {
    id: "3",
    title: "Framer Motion",
    url: "https://www.framer.com/motion",
    description: "Production-ready motion library for React.",
    tags: ["animation", "react", "library"],
    category: "Libraries",
    createdAt: "2025-03-03",
    isFavorite: false
  },
  {
    id: "4",
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs",
    description: "Comprehensive TypeScript documentation and guides.",
    tags: ["typescript", "javascript", "docs"],
    category: "Documentation",
    createdAt: "2025-03-04",
    isFavorite: false
  },
  {
    id: "5",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Resources for developers, by developers.",
    tags: ["web", "reference", "docs"],
    category: "Documentation",
    createdAt: "2025-03-05",
    isFavorite: true
  },
  {
    id: "6",
    title: "GitHub",
    url: "https://github.com",
    description: "Where the world builds software.",
    tags: ["git", "code", "platform"],
    category: "Tools",
    createdAt: "2025-03-06",
    isFavorite: true
  },
  {
    id: "7",
    title: "Figma",
    url: "https://figma.com",
    description: "The collaborative interface design tool.",
    tags: ["design", "ui", "tool"],
    category: "Design",
    createdAt: "2025-03-07",
    isFavorite: false
  },
  {
    id: "8",
    title: "Vercel",
    url: "https://vercel.com",
    description: "Develop. Preview. Ship.",
    tags: ["deployment", "hosting", "platform"],
    category: "Tools",
    createdAt: "2025-03-08",
    isFavorite: false
  }
];

const categories = ["All", "Documentation", "Tools", "Libraries", "Design", "Resources"];

const tagColors: Record<string, string> = {
  nextjs: "bg-black text-white",
  react: "bg-blue-500/10 text-blue-500",
  docs: "bg-green-500/10 text-green-500",
  css: "bg-cyan-500/10 text-cyan-500",
  styling: "bg-pink-500/10 text-pink-500",
  framework: "bg-purple-500/10 text-purple-500",
  animation: "bg-orange-500/10 text-orange-500",
  library: "bg-yellow-500/10 text-yellow-500",
  typescript: "bg-blue-600/10 text-blue-600",
  javascript: "bg-yellow-400/10 text-yellow-600",
  web: "bg-indigo-500/10 text-indigo-500",
  reference: "bg-gray-500/10 text-gray-500",
  git: "bg-red-500/10 text-red-500",
  code: "bg-emerald-500/10 text-emerald-500",
  platform: "bg-violet-500/10 text-violet-500",
  design: "bg-rose-500/10 text-rose-500",
  ui: "bg-fuchsia-500/10 text-fuchsia-500",
  tool: "bg-teal-500/10 text-teal-500",
  deployment: "bg-sky-500/10 text-sky-500",
  hosting: "bg-amber-500/10 text-amber-500"
};

function BookmarkCard({ 
  bookmark, 
  viewMode,
  onToggleFavorite,
  onDelete
}: { 
  bookmark: Bookmark; 
  viewMode: "grid" | "list";
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
      >
        <button
          onClick={() => onToggleFavorite(bookmark.id)}
          className={`p-2 rounded-lg transition-colors ${
            bookmark.isFavorite ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"
          }`}
        >
          <Star className={`w-4 h-4 ${bookmark.isFavorite ? "fill-current" : ""}`} />
        </button>
        
        <div className="flex-1 min-w-0">
          <a 
            href={bookmark.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium hover:text-primary transition-colors flex items-center gap-2"
          >
            {bookmark.title}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <p className="text-sm text-muted-foreground truncate">{bookmark.description}</p>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          {bookmark.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`px-2 py-0.5 rounded-full text-xs ${tagColors[tag] || "bg-muted"}`}>
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Bookmark className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(bookmark.id)}
            className={`p-2 rounded-lg transition-colors ${
              bookmark.isFavorite ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"
            }`}
          >
            <Star className={`w-4 h-4 ${bookmark.isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <a 
        href={bookmark.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block mb-2"
      >
        <h3 className="font-semibold hover:text-primary transition-colors flex items-center gap-2">
          {bookmark.title}
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
      </a>
      
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bookmark.description}</p>
      
      <div className="flex flex-wrap gap-1.5">
        {bookmark.tags.map(tag => (
          <span key={tag} className={`px-2 py-0.5 rounded-full text-xs ${tagColors[tag] || "bg-muted"}`}>
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || bookmark.category === selectedCategory;
    const matchesFavorite = !showFavoritesOnly || bookmark.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorite;
  });
  
  const allTags = Array.from(new Set(bookmarks.flatMap(b => b.tags)));
  
  const handleToggleFavorite = (id: string) => {
    setBookmarks(prev => prev.map(b => 
      b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
    ));
  };
  
  const handleDelete = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Bookmark className="h-4 w-4" />
            <span className="text-sm font-medium">Curated Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Book<span className="text-gradient-animated">marks</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A curated collection of useful resources, tools, and references for developers and designers.
          </p>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <p className="text-2xl font-bold text-primary">{bookmarks.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <p className="text-2xl font-bold text-primary">{bookmarks.filter(b => b.isFavorite).length}</p>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <p className="text-2xl font-bold text-primary">{allTags.length}</p>
              <p className="text-sm text-muted-foreground">Tags</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <p className="text-2xl font-bold text-primary">{categories.length - 1}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Controls */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookmarks..."
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Star className={`w-4 h-4 mr-1 ${showFavoritesOnly ? "fill-current" : ""}`} />
                Favorites
              </Button>
              
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Categories */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Bookmarks */}
        <motion.div 
          layout
          className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-2"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                viewMode={viewMode}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredBookmarks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No bookmarks found.</p>
            <Button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setShowFavoritesOnly(false); }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
