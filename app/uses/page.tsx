"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Laptop,
  Monitor,
  Smartphone,
  Headphones,
  Coffee,
  Code2,
  Terminal,
  FileText,
  Palette,
  Globe,
  Zap,
  Star,
  ExternalLink,
  Check,
  Heart,
  Sparkles,
  Wrench,
  Box,
  Keyboard,
  MousePointer,
  Camera,
  Wifi,
  Battery,
  Sun,
  Moon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tool {
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  link?: string;
  favorite?: boolean;
}

const tools: Tool[] = [
  // Hardware
  { name: "MacBook Pro 16\"", description: "M3 Max, 36GB RAM - Primary development machine", icon: Laptop, category: "hardware", favorite: true },
  { name: "LG UltraFine 5K", description: "27\" External display for extended workspace", icon: Monitor, category: "hardware" },
  { name: "Keychron Q1 Pro", description: "Mechanical keyboard with Gateron Brown switches", icon: Keyboard, category: "hardware", favorite: true },
  { name: "Logitech MX Master 3S", description: "Wireless mouse with gesture controls", icon: MousePointer, category: "hardware" },
  { name: "Sony WH-1000XM5", description: "Noise-canceling headphones for focus time", icon: Headphones, category: "hardware", favorite: true },
  { name: "iPhone 15 Pro", description: "Daily driver for testing and communication", icon: Smartphone, category: "hardware" },
  
  // Development
  { name: "VS Code", description: "Primary code editor with extensive extensions", icon: Code2, category: "development", favorite: true, link: "https://code.visualstudio.com" },
  { name: "Warp Terminal", description: "Modern Rust-based terminal with AI features", icon: Terminal, category: "development", favorite: true, link: "https://warp.dev" },
  { name: "Cursor", description: "AI-powered code editor for complex tasks", icon: Sparkles, category: "development", link: "https://cursor.sh" },
  { name: "GitHub Copilot", description: "AI pair programmer for code suggestions", icon: Zap, category: "development", favorite: true },
  { name: "Docker Desktop", description: "Container management for local development", icon: Box, category: "development", link: "https://docker.com" },
  
  // Design
  { name: "Figma", description: "Collaborative interface design tool", icon: Palette, category: "design", favorite: true, link: "https://figma.com" },
  { name: "Linear", description: "Issue tracking and project management", icon: Check, category: "design", link: "https://linear.app" },
  { name: "Excalidraw", description: "Hand-drawn style diagrams and wireframes", icon: FileText, category: "design", link: "https://excalidraw.com" },
  
  // Productivity
  { name: "Raycast", description: "Spotlight replacement with extensions", icon: Zap, category: "productivity", favorite: true, link: "https://raycast.com" },
  { name: "Notion", description: "All-in-one workspace for notes and docs", icon: FileText, category: "productivity", favorite: true, link: "https://notion.so" },
  { name: "Arc Browser", description: "Chromium-based browser with unique UX", icon: Globe, category: "productivity", favorite: true, link: "https://arc.net" },
  { name: "Obsidian", description: "Markdown knowledge base for second brain", icon: FileText, category: "productivity", link: "https://obsidian.md" },
  
  // Utilities
  { name: "Alfred", description: "Workflow automation and quick launcher", icon: Zap, category: "utilities", link: "https://alfredapp.com" },
  { name: "CleanShot X", description: "Advanced screenshot and screen recording", icon: Camera, category: "utilities", favorite: true },
  { name: "Bartender", description: "Menu bar icon management", icon: Wrench, category: "utilities" },
  { name: "1Password", description: "Password manager and secure vault", icon: Box, category: "utilities", favorite: true, link: "https://1password.com" },
];

const categories = [
  { id: "all", name: "All Tools", icon: Wrench },
  { id: "hardware", name: "Hardware", icon: Laptop },
  { id: "development", name: "Development", icon: Code2 },
  { id: "design", name: "Design", icon: Palette },
  { id: "productivity", name: "Productivity", icon: Zap },
  { id: "utilities", name: "Utilities", icon: Box },
];

const stats = [
  { label: "Years Experience", value: "7+", icon: Star },
  { label: "Daily Coffee", value: "3 cups", icon: Coffee },
  { label: "Lines of Code", value: "1M+", icon: Code2 },
  { label: "Side Projects", value: "50+", icon: Sparkles },
];

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
    >
      {tool.favorite && (
        <div className="absolute top-4 right-4">
          <Heart className="h-4 w-4 text-primary fill-primary" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
          
          {tool.link && (
            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline"
            >
              Learn more
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function UsesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTools = activeCategory === "all" 
    ? tools 
    : tools.filter((t) => t.category === activeCategory);

  const favoriteTools = tools.filter((t) => t.favorite);

  if (!mounted) return null;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Wrench className="w-4 h-4" />
            <span className="text-sm font-medium">My Setup</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tools I <span className="text-gradient-animated">Use</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A curated collection of hardware, software, and services that power my daily workflow.
            Inspired by <a href="https://uses.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">uses.tech</a>.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 text-center">
              <stat.icon className="h-6 w-6 mx-auto mb-3 text-primary" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Favorites Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <h2 className="text-2xl font-bold">Daily Favorites</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </motion.div>

        {/* All Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Complete Arsenal</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Workspace Photo Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/10 via-purple-500/10 to-orange-500/10 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              </div>
              <div className="text-center relative z-10">
                <Laptop className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">My Workspace</h3>
                <p className="text-muted-foreground max-w-md">
                  A clean, minimal setup focused on productivity and comfort. 
                  Dual monitors, mechanical keyboard, and plenty of natural light.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-12"
003e
          Last updated: March 2026 • Some links may be affiliate links
        </motion.p>
      </div>
    </div>
  );
}
