"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor, 
  Laptop, 
  Smartphone, 
  Headphones, 
  Coffee,
  Code2,
  Terminal,
  Palette,
  Zap,
  ExternalLink,
  Star,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Tool {
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  link?: string;
  isFavorite?: boolean;
}

const tools: Tool[] = [
  // Hardware
  {
    name: "MacBook Pro 16\"",
    description: "M3 Max, 36GB RAM - My primary development machine. Handles everything I throw at it.",
    category: "Hardware",
    icon: Laptop,
    isFavorite: true
  },
  {
    name: "Keychron Q1 Pro",
    description: "Mechanical keyboard with Gateron G Pro switches. Custom keycaps for that perfect feel.",
    category: "Hardware",
    icon: Zap,
    isFavorite: true
  },
  {
    name: "Logitech MX Master 3S",
    description: "The best mouse for productivity. Infinite scroll wheel and ergonomic design.",
    category: "Hardware",
    icon: Monitor,
    isFavorite: true
  },
  {
    name: "Sony WH-1000XM5",
    description: "Noise-canceling headphones for deep focus sessions. Essential for coding.",
    category: "Hardware",
    icon: Headphones
  },
  {
    name: "iPhone 15 Pro",
    description: "For testing mobile apps and staying connected on the go.",
    category: "Hardware",
    icon: Smartphone
  },
  {
    name: "LG UltraFine 5K",
    description: "27\" 5K display. Perfect color accuracy for design work.",
    category: "Hardware",
    icon: Monitor
  },
  
  // Development
  {
    name: "VS Code",
    description: "My code editor of choice. Extensive plugin ecosystem and great TypeScript support.",
    category: "Development",
    icon: Code2,
    link: "https://code.visualstudio.com",
    isFavorite: true
  },
  {
    name: "Cursor",
    description: "AI-powered code editor. Game-changer for productivity with inline AI assistance.",
    category: "Development",
    icon: Zap,
    link: "https://cursor.sh",
    isFavorite: true
  },
  {
    name: "Warp",
    description: "Modern Rust-based terminal with AI command suggestions and collaborative features.",
    category: "Development",
    icon: Terminal,
    link: "https://warp.dev",
    isFavorite: true
  },
  {
    name: "GitHub Copilot",
    description: "AI pair programmer. Saves me hours every week with intelligent code suggestions.",
    category: "Development",
    icon: Code2,
    isFavorite: true
  },
  {
    name: "Docker Desktop",
    description: "Container management made easy. Essential for consistent development environments.",
    category: "Development",
    icon: Terminal
  },
  {
    name: "Postman",
    description: "API development and testing. My go-to tool for backend integration work.",
    category: "Development",
    icon: Zap,
    link: "https://www.postman.com"
  },
  
  // Design
  {
    name: "Figma",
    description: "Design and prototyping. The collaborative features are unmatched.",
    category: "Design",
    icon: Palette,
    link: "https://www.figma.com",
    isFavorite: true
  },
  {
    name: "Linear",
    description: "Issue tracking that doesn't suck. Beautiful, fast, and keyboard-friendly.",
    category: "Design",
    icon: Zap,
    link: "https://linear.app",
    isFavorite: true
  },
  {
    name: "Excalidraw",
    description: "Virtual whiteboard for sketching ideas. Hand-drawn style diagrams.",
    category: "Design",
    icon: Palette,
    link: "https://excalidraw.com"
  },
  {
    name: "Coolors",
    description: "Color palette generator. Quick way to explore color combinations.",
    category: "Design",
    icon: Palette,
    link: "https://coolors.co"
  },
  
  // Productivity
  {
    name: "Notion",
    description: "My second brain. Notes, docs, databases, and project planning all in one.",
    category: "Productivity",
    icon: Zap,
    link: "https://notion.so",
    isFavorite: true
  },
  {
    name: "Raycast",
    description: "Spotlight replacement on steroids. Extensions for everything.",
    category: "Productivity",
    icon: Zap,
    link: "https://raycast.com",
    isFavorite: true
  },
  {
    name: "Arc Browser",
    description: "The browser I never knew I needed. Spaces, profiles, and clean UI.",
    category: "Productivity",
    icon: Monitor,
    link: "https://arc.net",
    isFavorite: true
  },
  {
    name: "CleanShot X",
    description: "Screenshot and screen recording tool. Annotation features are top-notch.",
    category: "Productivity",
    icon: Monitor
  },
  {
    name: "Alfred",
    description: "Power-user launcher. Workflows, clipboard history, and system commands.",
    category: "Productivity",
    icon: Zap
  },
  
  // Communication
  {
    name: "Slack",
    description: "Team communication. Custom emojis and integrations keep it fun.",
    category: "Communication",
    icon: Zap,
    link: "https://slack.com"
  },
  {
    name: "Discord",
    description: "Community and voice chat. Great for developer communities.",
    category: "Communication",
    icon: Zap,
    link: "https://discord.com"
  },
  {
    name: "Zoom",
    description: "Video calls and screen sharing. The standard for remote meetings.",
    category: "Communication",
    icon: Monitor
  },
  
  // Services
  {
    name: "Vercel",
    description: "Deployment platform for frontend projects. Preview deployments are magic.",
    category: "Services",
    icon: Zap,
    link: "https://vercel.com",
    isFavorite: true
  },
  {
    name: "Supabase",
    description: "Open-source Firebase alternative. PostgreSQL with real-time subscriptions.",
    category: "Services",
    icon: Terminal,
    link: "https://supabase.com"
  },
  {
    name: "Cloudflare",
    description: "CDN, DNS, and edge computing. Fast and reliable infrastructure.",
    category: "Services",
    icon: Zap,
    link: "https://cloudflare.com"
  },
  {
    name: "GitHub",
    description: "Code hosting and collaboration. Actions for CI/CD.",
    category: "Services",
    icon: Code2,
    link: "https://github.com",
    isFavorite: true
  }
];

const categories = ["All", "Hardware", "Development", "Design", "Productivity", "Communication", "Services"];

const categoryIcons: Record<string, React.ElementType> = {
  "All": Zap,
  "Hardware": Monitor,
  "Development": Code2,
  "Design": Palette,
  "Productivity": Coffee,
  "Communication": Smartphone,
  "Services": Terminal
};

export default function UsesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    const matchesFavorites = !showFavoritesOnly || tool.isFavorite;
    return matchesCategory && matchesFavorites;
  });

  const stats = {
    total: tools.length,
    favorites: tools.filter(t => t.isFavorite).length,
    categories: new Set(tools.map(t => t.category)).size
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Coffee className="h-4 w-4" />
            <span className="text-sm font-medium">My Setup</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tools I{" "}
            <span className="text-gradient-animated">Use</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A curated list of hardware, software, and services that power my workflow. 
            These are the tools I use daily to build, design, and create.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-12 max-w-lg mx-auto"
        >
          {[
            { label: "Tools", value: stats.total, icon: Zap },
            { label: "Favorites", value: stats.favorites, icon: Star },
            { label: "Categories", value: stats.categories, icon: Monitor },
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const Icon = categoryIcons[category];
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category}
                </button>
              );
            })}
          </div>

          {/* Favorites Toggle */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showFavoritesOnly
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Star className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
              Favorites Only
            </button>
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                  className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        {tool.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      
                      <Badge variant="outline" className="mb-2 text-xs">
                        {tool.category}
                      </Badge>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {tool.description}
                      </p>

                      {tool.link && (
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Learn more
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Zap className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </motion.div>
        )}

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 border border-border">
            <Check className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">
              Last updated: March 2026 • Inspired by{" "}
              <a 
                href="https://uses.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                uses.tech
              </a>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
