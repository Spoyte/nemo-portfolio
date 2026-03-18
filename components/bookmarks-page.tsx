"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ExternalLink,
  Heart,
  Search,
  Tag,
  Filter,
  Bookmark,
  Clock,
  Star,
  ArrowUpRight,
  Grid3X3,
  List,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  category: string;
  dateAdded: string;
  isFavorite: boolean;
}

const bookmarks: BookmarkItem[] = [
  // Development
  {
    id: "1",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "The bible of web development. Comprehensive documentation for HTML, CSS, and JavaScript.",
    tags: ["documentation", "reference", "web"],
    category: "development",
    dateAdded: "2024-01-15",
    isFavorite: true,
  },
  {
    id: "2",
    title: "React Documentation",
    url: "https://react.dev",
    description: "Official React docs with interactive examples and best practices.",
    tags: ["react", "javascript", "frontend"],
    category: "development",
    dateAdded: "2024-01-20",
    isFavorite: true,
  },
  {
    id: "3",
    title: "Next.js",
    url: "https://nextjs.org",
    description: "The React Framework for the Web. My go-to for production applications.",
    tags: ["nextjs", "react", "framework"],
    category: "development",
    dateAdded: "2024-02-01",
    isFavorite: false,
  },
  {
    id: "4",
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs",
    description: "Everything you need to know about TypeScript, from basics to advanced patterns.",
    tags: ["typescript", "javascript", "types"],
    category: "development",
    dateAdded: "2024-02-10",
    isFavorite: true,
  },
  {
    id: "5",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "Utility-first CSS framework that changed how I style applications.",
    tags: ["css", "styling", "framework"],
    category: "development",
    dateAdded: "2024-02-15",
    isFavorite: false,
  },
  // Design
  {
    id: "6",
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "Design inspiration and community. Where I go when I need creative ideas.",
    tags: ["design", "inspiration", "ui"],
    category: "design",
    dateAdded: "2024-01-25",
    isFavorite: true,
  },
  {
    id: "7",
    title: "Figma",
    url: "https://figma.com",
    description: "Collaborative interface design tool. Essential for my design workflow.",
    tags: ["design", "tools", "ui"],
    category: "design",
    dateAdded: "2024-01-30",
    isFavorite: false,
  },
  {
    id: "8",
    title: "Unsplash",
    url: "https://unsplash.com",
    description: "Beautiful free photos for any project. My source for hero images.",
    tags: ["images", "photos", "free"],
    category: "design",
    dateAdded: "2024-02-05",
    isFavorite: false,
  },
  // Learning
  {
    id: "9",
    title: "CSS-Tricks",
    url: "https://css-tricks.com",
    description: "Daily articles about CSS, HTML, JavaScript, and all things web design.",
    tags: ["css", "tutorial", "blog"],
    category: "learning",
    dateAdded: "2024-01-18",
    isFavorite: true,
  },
  {
    id: "10",
    title: "Smashing Magazine",
    url: "https://smashingmagazine.com",
    description: "For professional web designers and developers. High-quality articles.",
    tags: ["web", "design", "development"],
    category: "learning",
    dateAdded: "2024-02-08",
    isFavorite: false,
  },
  {
    id: "11",
    title: "JavaScript Weekly",
    url: "https://javascriptweekly.com",
    description: "A free, once-weekly email roundup of JavaScript news and articles.",
    tags: ["javascript", "newsletter", "news"],
    category: "learning",
    dateAdded: "2024-02-12",
    isFavorite: false,
  },
  // Tools
  {
    id: "12",
    title: "Vercel",
    url: "https://vercel.com",
    description: "Deployment platform for frontend developers. Fast, easy, and reliable.",
    tags: ["deployment", "hosting", "tools"],
    category: "tools",
    dateAdded: "2024-01-22",
    isFavorite: true,
  },
  {
    id: "13",
    title: "GitHub",
    url: "https://github.com",
    description: "Where the world builds software. Home to all my projects.",
    tags: ["git", "version-control", "collaboration"],
    category: "tools",
    dateAdded: "2024-01-10",
    isFavorite: true,
  },
  {
    id: "14",
    title: "CodePen",
    url: "https://codepen.io",
    description: "Social development environment for front-end designers and developers.",
    tags: ["code", "playground", "sharing"],
    category: "tools",
    dateAdded: "2024-02-18",
    isFavorite: false,
  },
  // Reading
  {
    id: "15",
    title: "Hacker News",
    url: "https://news.ycombinator.com",
    description: "Tech news aggregator. Where I stay updated on industry trends.",
    tags: ["news", "tech", "community"],
    category: "reading",
    dateAdded: "2024-01-12",
    isFavorite: true,
  },
  {
    id: "16",
    title: "Dev.to",
    url: "https://dev.to",
    description: "A constructive and inclusive social network for software developers.",
    tags: ["community", "blog", "learning"],
    category: "reading",
    dateAdded: "2024-02-20",
    isFavorite: false,
  },
];

const categories = [
  { id: "all", label: "All", count: bookmarks.length },
  { id: "development", label: "Development", count: bookmarks.filter(b => b.category === "development").length },
  { id: "design", label: "Design", count: bookmarks.filter(b => b.category === "design").length },
  { id: "learning", label: "Learning", count: bookmarks.filter(b => b.category === "learning").length },
  { id: "tools", label: "Tools", count: bookmarks.filter(b => b.category === "tools").length },
  { id: "reading", label: "Reading", count: bookmarks.filter(b => b.category === "reading").length },
];

const allTags = Array.from(new Set(bookmarks.flatMap(b => b.tags)));

export function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>(
    bookmarks.filter(b => b.isFavorite).map(b => b.id)
  );

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || bookmark.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => bookmark.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
    toast.success(favorites.includes(id) ? "Removed from favorites" : "Added to favorites");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Bookmark className="h-4 w-4" />
            <span className="text-sm font-medium">Curated Resources</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bookmarks</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of tools, resources, and articles I find valuable.
            Carefully curated for developers and designers.
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
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => toggleTag(tag)}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            {categories.map(cat => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
                <span className="ml-2 text-xs text-muted-foreground">({cat.count})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode + selectedTags.join()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredBookmarks.map((bookmark, index) => (
                    <motion.div
                      key={bookmark.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`group h-full hover:border-primary/50 transition-all ${
                          viewMode === "list" ? "flex flex-row items-center" : ""
                        }`}
                      >
                        <CardHeader className={viewMode === "list" ? "flex-1 p-4" : ""}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-lg font-bold text-primary">
                                {bookmark.title[0]}
                              </div>
                              <div>
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                  {bookmark.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(bookmark.dateAdded).toLocaleDateString()}
                                </CardDescription>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                              onClick={() => toggleFavorite(bookmark.id)}
                            >
                              <Heart
                                className={`h-4 w-4 transition-colors ${
                                  favorites.includes(bookmark.id)
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </CardHeader>
                        {viewMode !== "list" && (
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground text-sm mb-4">
                              {bookmark.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {bookmark.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs capitalize">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              variant="outline"
                              className="w-full group/btn"
                              asChild
                            >
                              <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Visit Website
                                <ArrowUpRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                              </a>
                            </Button>
                          </CardContent>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {filteredBookmarks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No bookmarks found matching your criteria.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTags([]);
                      setSelectedCategory("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Bookmarks", value: bookmarks.length },
            { label: "Categories", value: categories.length - 1 },
            { label: "Tags", value: allTags.length },
            { label: "Favorites", value: favorites.length },
          ].map((stat, index) => (
            <Card key={stat.label}>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
