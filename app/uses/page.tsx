"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Mic,
  Smartphone,
  Coffee,
  Lightbulb,
  Wrench,
  Code2,
  Terminal,
  Sparkles,
  ExternalLink,
  Star,
  Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tool categories with items
const toolCategories = [
  {
    id: "hardware",
    name: "Hardware",
    icon: Monitor,
    items: [
      {
        name: "MacBook Pro 16\"",
        description: "M3 Max, 64GB RAM, 2TB SSD - My primary development machine",
        tags: ["Laptop", "Apple Silicon"],
        favorite: true,
        link: "https://www.apple.com/macbook-pro/"
      },
      {
        name: "LG UltraFine 5K",
        description: "27-inch 5K display for crystal clear code editing",
        tags: ["Monitor", "5K"],
        favorite: false
      },
      {
        name: "Keychron Q1 Pro",
        description: "Custom mechanical keyboard with Gateron Oil King switches",
        tags: ["Keyboard", "Mechanical"],
        favorite: true,
        link: "https://www.keychron.com/products/keychron-q1-pro"
      },
      {
        name: "Logitech MX Master 3S",
        description: "Ergonomic mouse with MagSpeed scrolling",
        tags: ["Mouse", "Ergonomic"],
        favorite: true
      },
      {
        name: "Sony WH-1000XM5",
        description: "Noise cancelling headphones for deep focus",
        tags: ["Audio", "ANC"],
        favorite: false
      },
      {
        name: "Shure MV7",
        description: "Professional microphone for calls and recordings",
        tags: ["Microphone", "USB/XLR"],
        favorite: false
      },
      {
        name: "Elgato Stream Deck",
        description: "15-key macro pad for workflow automation",
        tags: ["Productivity", "Macros"],
        favorite: true
      },
      {
        name: "Herman Miller Aeron",
        description: "Ergonomic chair for long coding sessions",
        tags: ["Chair", "Ergonomic"],
        favorite: true
      }
    ]
  },
  {
    id: "software",
    name: "Software",
    icon: Code2,
    items: [
      {
        name: "VS Code",
        description: "Primary code editor with extensive customization",
        tags: ["Editor", "Microsoft"],
        favorite: true,
        link: "https://code.visualstudio.com/"
      },
      {
        name: "Cursor",
        description: "AI-powered code editor for accelerated development",
        tags: ["Editor", "AI"],
        favorite: true,
        link: "https://cursor.sh/"
      },
      {
        name: "Warp Terminal",
        description: "Modern Rust-based terminal with AI features",
        tags: ["Terminal", "Rust"],
        favorite: true,
        link: "https://www.warp.dev/"
      },
      {
        name: "Fig",
        description: "Autocomplete for the terminal",
        tags: ["Terminal", "Productivity"],
        favorite: false
      },
      {
        name: "Raycast",
        description: "Spotlight replacement with powerful extensions",
        tags: ["Launcher", "Productivity"],
        favorite: true,
        link: "https://www.raycast.com/"
      },
      {
        name: "Arc Browser",
        description: "The browser that organizes my internet",
        tags: ["Browser", "The Browser Company"],
        favorite: true,
        link: "https://arc.net/"
      },
      {
        name: "Linear",
        description: "Issue tracking and project management",
        tags: ["Project Management", "Git"],
        favorite: true,
        link: "https://linear.app/"
      },
      {
        name: "Figma",
        description: "Design tool for UI/UX work",
        tags: ["Design", "Collaboration"],
        favorite: true,
        link: "https://www.figma.com/"
      }
    ]
  },
  {
    id: "dev",
    name: "Development",
    icon: Terminal,
    items: [
      {
        name: "Next.js",
        description: "React framework for production-grade applications",
        tags: ["Framework", "React"],
        favorite: true,
        link: "https://nextjs.org/"
      },
      {
        name: "TypeScript",
        description: "Type-safe JavaScript for better code quality",
        tags: ["Language", "Microsoft"],
        favorite: true,
        link: "https://www.typescriptlang.org/"
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework for rapid UI development",
        tags: ["CSS", "Framework"],
        favorite: true,
        link: "https://tailwindcss.com/"
      },
      {
        name: "Prisma",
        description: "Next-generation ORM for Node.js and TypeScript",
        tags: ["ORM", "Database"],
        favorite: true,
        link: "https://www.prisma.io/"
      },
      {
        name: "tRPC",
        description: "End-to-end typesafe APIs made easy",
        tags: ["API", "TypeScript"],
        favorite: true,
        link: "https://trpc.io/"
      },
      {
        name: "Framer Motion",
        description: "Production-ready motion library for React",
        tags: ["Animation", "React"],
        favorite: true,
        link: "https://www.framer.com/motion/"
      },
      {
        name: "Vercel",
        description: "Platform for frontend frameworks and static sites",
        tags: ["Hosting", "Deployment"],
        favorite: true,
        link: "https://vercel.com/"
      },
      {
        name: "Docker",
        description: "Containerization for consistent environments",
        tags: ["DevOps", "Containers"],
        favorite: false,
        link: "https://www.docker.com/"
      }
    ]
  },
  {
    id: "productivity",
    name: "Productivity",
    icon: Coffee,
    items: [
      {
        name: "Notion",
        description: "All-in-one workspace for notes and docs",
        tags: ["Notes", "Wiki"],
        favorite: true,
        link: "https://www.notion.so/"
      },
      {
        name: "Obsidian",
        description: "Knowledge base that works on local Markdown files",
        tags: ["Notes", "Markdown"],
        favorite: true,
        link: "https://obsidian.md/"
      },
      {
        name: "Todoist",
        description: "Task management that keeps me organized",
        tags: ["Tasks", "GTD"],
        favorite: true,
        link: "https://todoist.com/"
      },
      {
        name: "Cron",
        description: "The next-generation calendar for professionals",
        tags: ["Calendar", "Scheduling"],
        favorite: true,
        link: "https://cron.com/"
      },
      {
        name: "Spotify",
        description: "Music for focus and coding sessions",
        tags: ["Music", "Streaming"],
        favorite: false,
        link: "https://open.spotify.com/"
      },
      {
        name: "Brain.fm",
        description: "Music designed for the brain to focus",
        tags: ["Music", "Focus"],
        favorite: true,
        link: "https://www.brain.fm/"
      },
      {
        name: "Readwise",
        description: "Readwise Reader for article and PDF reading",
        tags: ["Reading", "Knowledge"],
        favorite: true,
        link: "https://readwise.io/"
      },
      {
        name: "Grammarly",
        description: "Writing assistant for clear communication",
        tags: ["Writing", "AI"],
        favorite: false,
        link: "https://www.grammarly.com/"
      }
    ]
  }
];

// Tool card component
function ToolCard({ item, index }: { item: typeof toolCategories[0]["items"][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full group hover:border-primary/50 transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              {item.favorite && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </motion.div>
              )}
            </div>
            {item.link && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                asChild
              >
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Stats component
function UsesStats() {
  const stats = [
    { label: "Tools", value: "32+", icon: Wrench },
    { label: "Favorites", value: "18", icon: Heart },
    { label: "Categories", value: "4", icon: Lightbulb },
    { label: "Years Curated", value: "5+", icon: Sparkles }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          className="p-6 rounded-xl border bg-card text-center"
        >
          <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-3xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Setup visualization
function SetupVisualization() {
  return (
    <Card className="mb-12 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          My Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center overflow-hidden">
          {/* Desk representation */}
          <div className="relative w-full max-w-2xl mx-auto p-8">
            {/* Monitor */}
            <motion.div
              className="mx-auto w-64 h-40 bg-slate-800 rounded-lg border-4 border-slate-700 relative mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-2 bg-slate-950 rounded">
                <div className="p-2 space-y-1">
                  <div className="h-2 w-3/4 bg-primary/30 rounded" />
                  <div className="h-2 w-1/2 bg-primary/20 rounded" />
                  <div className="h-2 w-2/3 bg-primary/20 rounded" />
                </div>
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-slate-700 rounded-b" />
            </motion.div>
            
            {/* Stand */}
            <motion.div
              className="mx-auto w-16 h-8 bg-slate-700 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
            
            {/* Desk surface */}
            <motion.div
              className="h-4 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5 }}
            />
            
            {/* Keyboard */}
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-slate-700 rounded-lg border-b-4 border-slate-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="grid grid-cols-12 gap-0.5 p-2">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="h-1.5 bg-slate-600 rounded-sm" />
                ))}
              </div>
            </motion.div>
            
            {/* Mouse */}
            <motion.div
              className="absolute bottom-14 right-1/4 w-8 h-12 bg-slate-700 rounded-full border-b-4 border-slate-800"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            />
            
            {/* Coffee cup */}
            <motion.div
              className="absolute bottom-16 left-1/4 w-6 h-8 bg-white rounded-b-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-400/30 rounded-full"
                animate={{ 
                  y: [-2, -8, -2],
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.5, 1]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UsesPage() {
  const [activeTab, setActiveTab] = useState("hardware");

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
            <Wrench className="h-4 w-4" />
            <span className="text-sm font-medium">My Toolkit</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Uses</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A curated collection of hardware, software, and tools I use daily.
            These are the things that help me build, create, and stay productive.
          </p>
        </motion.div>
        
        {/* Stats */}
        <UsesStats />
        
        {/* Setup Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SetupVisualization />
        </motion.div>
        
        {/* Tools by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-8 flex-wrap h-auto gap-2">
              {toolCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {toolCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item, index) => (
                    <ToolCard key={item.name} item={item} index={index} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
        
        {/* Inspiration note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
            <CardContent className="p-8">
              <Lightbulb className="w-8 h-8 mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground max-w-xl mx-auto">
                Inspired by the <a 
                  href="https://uses.tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                
                
                  
                  uses.tech
                
                
                </a>{" "}
                community. This page is a living document - I update it as my workflow evolves.
                Last updated: March 2025.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
