"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bookmark, 
  Search, 
  ExternalLink, 
  Star, 
  Folder,
  Tag,
  Clock,
  Trash2,
  Plus,
  Filter,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  addedAt: string;
}

const categories = ["All", "Development", "Design", "Learning", "Tools", "Inspiration", "Reading"];

const initialBookmarks: BookmarkItem[] = [
  {
    id: "1",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "The bible of web development documentation.",
    category: "Development",
    tags: ["reference", "docs", "web"],
    isFavorite: true,
    addedAt: "2024-01-15"
  },
  {
    id: "2",
    title: "CSS-Tricks",
    url: "https://css-tricks.com",
    description: "Daily articles about CSS, HTML, JavaScript, and all things web design.",
    category: "Development",
    tags: ["css", "tutorial", "blog"],
    isFavorite: true,
    addedAt: "2024-01-20"
  },
  {
    id: "3",
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "Discover the world's top designers and creative professionals.",
    category: "Design",
    tags: ["inspiration", "ui", "portfolio"],
    isFavorite: false,
    addedAt: "2024-02-01"
  },
  {
    id: "4",
    title: "Awwwards",
    url: "https://www.awwwards.com",
    description: "Website awards - best web design trends and inspiration.",
    category: "Inspiration",
    tags: ["awards", "web-design", "trends"],
    isFavorite: true,
    addedAt: "2024-02-05"
  },
  {
    id: "5",
    title: "React Documentation",
    url: "https://react.dev",
    description: "The library for web and native user interfaces.",
    category: "Development",
    tags: ["react", "docs", "javascript"],
    isFavorite: true,
    addedAt: "2024-02-10"
  },
  {
    id: "6",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "Rapidly build modern websites without ever leaving your HTML.",
    category: "Development",
    tags: ["css", "framework", "styling"],
    isFavorite: true,
    addedAt: "2024-02-12"
  },
  {
    id: "7",
    title: "Figma",
    url: "https://www.figma.com",
    description: "The collaborative interface design tool.",
    category: "Tools",
    tags: ["design", "prototyping", "collaboration"],
    isFavorite: false,
    addedAt: "2024-02-15"
  },
  {
    id: "8",
    title: "GitHub",
    url: "https://github.com",
    description: "Where the world builds software.",
    category: "Tools",
    tags: ["git", "code", "collaboration"],
    isFavorite: true,
    addedAt: "2024-02-18"
  },
  {
    id: "9",
    title: "Smashing Magazine",
    url: "https://www.smashingmagazine.com",
    description: "For professional web designers and developers.",
    category: "Reading",
    tags: ["articles", "web-design", "development"],
    isFavorite: false,
    addedAt: "2024-02-20"
  },
  {
    id: "10",
    title: "Framer",
    url: "https://www.framer.com",
    description: "Design and ship your dream site with zero code.",
    category: "Tools",
    tags: ["no-code", "design", "website"],
    isFavorite: false,
    addedAt: "2024-02-22"
  },
  {
    id: "11",
    title: "freeCodeCamp",
    url: "https://www.freecodecamp.org",
    description: "Learn to code for free with interactive lessons.",
    category: "Learning",
    tags: ["education", "programming", "free"],
    isFavorite: true,
    addedAt: "2024-02-25"
  },
  {
    id: "12",
    title: "CodePen",
    url: "https://codepen.io",
    description: "The best place to build, test, and discover front-end code.",
    category: "Tools",
    tags: ["playground", "code", "community"],
    isFavorite: true,
    addedAt: "2024-03-01"
  }
];

const categoryColors: Record<string, string> = {
  "Development": "bg-blue-500/10 text-blue-500",
  "Design": "bg-purple-500/10 text-purple-500",
  "Learning": "bg-green-500/10 text-green-500",
  "Tools": "bg-orange-500/10 text-orange-500",
  "Inspiration": "bg-pink-500/10 text-pink-500",
  "Reading": "bg-yellow-500/10 text-yellow-500"
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(initialBookmarks);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags
  const allTags = Array.from(new Set(bookmarks.flatMap(b => b.tags)));

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === "All" || bookmark.category === activeCategory;
    const matchesFavorites = !showFavoritesOnly || bookmark.isFavorite;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => bookmark.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesFavorites && matchesTags;
  });

  const toggleFavorite = (id: string) => {
    setBookmarks(prev => prev.map(b => 
      b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
    ));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const stats = {
    total: bookmarks.length,
    favorites: bookmarks.filter(b => b.isFavorite).length,
    categories: new Set(bookmarks.map(b => b.category)).size,
    tags: allTags.length
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
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Bookmark className="h-4 w-4" />
            <span className="text-sm font-medium">Curated Collection</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My{" "}
            <span className="text-gradient-animated">Bookmarks</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A curated collection of resources, tools, and inspiration I find useful.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Bookmarks", value: stats.total, icon: Bookmark },
            { label: "Favorites", value: stats.favorites, icon: Heart },
            { label: "Categories", value: stats.categories, icon: Folder },
            { label: "Tags", value: stats.tags, icon: Tag },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="p-4 rounded-xl bg-card border border-border text-center"
            >
              <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {allTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 rounded-md text-xs transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Favorites Toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showFavoritesOnly
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <Heart className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
            Favorites Only
          </button>
        </motion.div>

        {/* Bookmarks Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredBookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
                className="group relative p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
                      <span className="text-lg">{bookmark.url.charAt(8).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {bookmark.title}
                      </h3>
                      <Badge className={`text-xs ${categoryColors[bookmark.category]}`}>
                        {bookmark.category}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(bookmark.id)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Star className={`h-4 w-4 ${bookmark.isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3">{bookmark.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {bookmark.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 text-xs bg-secondary rounded-full text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(bookmark.addedAt).toLocaleDateString()}
                  </div>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Visit
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
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
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No bookmarks found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
