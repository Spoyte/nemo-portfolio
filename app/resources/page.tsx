"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Palette,
  BookOpen,
  Wrench,
  ExternalLink,
  Star,
  Search,
  Layers,
  Terminal,
  Database,
  Cloud,
  Container,
  Server,
  Lock,
  Globe,
  Figma,
  PenTool,
  Image,
  FileText,
  GraduationCap,
  Lightbulb,
  Zap,
  Target,
  Type,
  Sparkles,
  CheckCircle2,
  GitBranch,
  Box,
  Brain,
  Bookmark,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/scroll-animations";

interface Resource {
  name: string;
  description: string;
  url: string;
  icon: React.ElementType;
  category: string;
  tags: string[];
  featured?: boolean;
}

const resources: Resource[] = [
  // Development Tools
  {
    name: "VS Code",
    description: "My primary code editor with extensive extensions for productivity",
    url: "https://code.visualstudio.com",
    icon: Code2,
    category: "dev-tools",
    tags: ["editor", "microsoft", "free"],
    featured: true,
  },
  {
    name: "Cursor",
    description: "AI-powered code editor for complex coding tasks",
    url: "https://cursor.sh",
    icon: Sparkles,
    category: "dev-tools",
    tags: ["ai", "editor", "productivity"],
    featured: true,
  },
  {
    name: "Warp Terminal",
    description: "Modern Rust-based terminal with AI features",
    url: "https://warp.dev",
    icon: Terminal,
    category: "dev-tools",
    tags: ["terminal", "cli", "productivity"],
    featured: true,
  },
  {
    name: "GitHub",
    description: "Version control and collaboration platform",
    url: "https://github.com",
    icon: Github,
    category: "dev-tools",
    tags: ["git", "collaboration", "free"],
    featured: true,
  },
  {
    name: "Docker",
    description: "Container platform for consistent development environments",
    url: "https://docker.com",
    icon: Container,
    category: "dev-tools",
    tags: ["containers", "devops", "virtualization"],
  },
  {
    name: "Postman",
    description: "API development and testing tool",
    url: "https://postman.com",
    icon: Server,
    category: "dev-tools",
    tags: ["api", "testing", "http"],
  },
  {
    name: "TablePlus",
    description: "Modern database management tool",
    url: "https://tableplus.com",
    icon: Database,
    category: "dev-tools",
    tags: ["database", "sql", "gui"],
  },
  {
    name: "Insomnia",
    description: "API client for REST and GraphQL",
    url: "https://insomnia.rest",
    icon: Cloud,
    category: "dev-tools",
    tags: ["api", "graphql", "testing"],
  },

  // VS Code Extensions
  {
    name: "ESLint",
    description: "Linting utility for JavaScript and TypeScript",
    url: "https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint",
    icon: CheckCircle2,
    category: "vscode",
    tags: ["linting", "javascript", "typescript"],
    featured: true,
  },
  {
    name: "Prettier",
    description: "Opinionated code formatter",
    url: "https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode",
    icon: Sparkles,
    category: "vscode",
    tags: ["formatting", "javascript", "typescript"],
    featured: true,
  },
  {
    name: "GitLens",
    description: "Supercharge Git within VS Code",
    url: "https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens",
    icon: GitBranch,
    category: "vscode",
    tags: ["git", "version-control"],
    featured: true,
  },
  {
    name: "Tailwind CSS IntelliSense",
    description: "Intelligent Tailwind CSS tooling",
    url: "https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss",
    icon: Palette,
    category: "vscode",
    tags: ["css", "tailwind", "autocomplete"],
    featured: true,
  },
  {
    name: "Error Lens",
    description: "Highlight errors and warnings inline",
    url: "https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens",
    icon: Zap,
    category: "vscode",
    tags: ["productivity", "debugging"],
  },
  {
    name: "Thunder Client",
    description: "REST API client for VS Code",
    url: "https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client",
    icon: Zap,
    category: "vscode",
    tags: ["api", "testing", "http"],
  },
  {
    name: "Import Cost",
    description: "Display import sizes in the editor",
    url: "https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost",
    icon: Box,
    category: "vscode",
    tags: ["performance", "bundle-size"],
  },
  {
    name: "GitHub Copilot",
    description: "AI pair programmer",
    url: "https://github.com/features/copilot",
    icon: Brain,
    category: "vscode",
    tags: ["ai", "autocomplete", "productivity"],
    featured: true,
  },

  // Learning Resources
  {
    name: "MDN Web Docs",
    description: "Comprehensive web development documentation",
    url: "https://developer.mozilla.org",
    icon: BookOpen,
    category: "learning",
    tags: ["documentation", "reference", "free"],
    featured: true,
  },
  {
    name: "freeCodeCamp",
    description: "Free coding curriculum and certifications",
    url: "https://freecodecamp.org",
    icon: GraduationCap,
    category: "learning",
    tags: ["courses", "free", "certifications"],
    featured: true,
  },
  {
    name: "Frontend Masters",
    description: "In-depth frontend engineering courses",
    url: "https://frontendmasters.com",
    icon: Star,
    category: "learning",
    tags: ["courses", "advanced", "subscription"],
  },
  {
    name: "Egghead.io",
    description: "Short, focused web development lessons",
    url: "https://egghead.io",
    icon: Lightbulb,
    category: "learning",
    tags: ["courses", "short-form", "subscription"],
  },
  {
    name: "CSS-Tricks",
    description: "Daily articles about CSS and web design",
    url: "https://css-tricks.com",
    icon: Palette,
    category: "learning",
    tags: ["css", "articles", "free"],
    featured: true,
  },
  {
    name: "Smashing Magazine",
    description: "Professional web design and development articles",
    url: "https://smashingmagazine.com",
    icon: BookOpen,
    category: "learning",
    tags: ["design", "development", "articles"],
  },
  {
    name: "JavaScript.info",
    description: "The Modern JavaScript Tutorial",
    url: "https://javascript.info",
    icon: FileText,
    category: "learning",
    tags: ["javascript", "tutorial", "free"],
    featured: true,
  },
  {
    name: "Web.dev",
    description: "Google's resource for web developers",
    url: "https://web.dev",
    icon: Globe,
    category: "learning",
    tags: ["performance", "best-practices", "free"],
    featured: true,
  },

  // Design Resources
  {
    name: "Figma",
    description: "Collaborative interface design tool",
    url: "https://figma.com",
    icon: Figma,
    category: "design",
    tags: ["ui", "ux", "collaboration"],
    featured: true,
  },
  {
    name: "Dribbble",
    description: "Design inspiration and portfolio platform",
    url: "https://dribbble.com",
    icon: Palette,
    category: "design",
    tags: ["inspiration", "portfolio", "community"],
  },
  {
    name: "Behance",
    description: "Creative work showcase platform",
    url: "https://behance.net",
    icon: Layout,
    category: "design",
    tags: ["portfolio", "inspiration", "community"],
  },
  {
    name: "Unsplash",
    description: "Free high-quality stock photos",
    url: "https://unsplash.com",
    icon: Image,
    category: "design",
    tags: ["photos", "free", "stock"],
    featured: true,
  },
  {
    name: "Coolors",
    description: "Color palette generator",
    url: "https://coolors.co",
    icon: Palette,
    category: "design",
    tags: ["colors", "generator", "free"],
  },
  {
    name: "Google Fonts",
    description: "Free web font library",
    url: "https://fonts.google.com",
    icon: Type,
    category: "design",
    tags: ["fonts", "typography", "free"],
    featured: true,
  },
  {
    name: "Font Awesome",
    description: "Icon library and toolkit",
    url: "https://fontawesome.com",
    icon: Star,
    category: "design",
    tags: ["icons", "library", "free"],
  },
  {
    name: "Heroicons",
    description: "Beautiful hand-crafted SVG icons",
    url: "https://heroicons.com",
    icon: Sparkles,
    category: "design",
    tags: ["icons", "svg", "free"],
    featured: true,
  },

  // Productivity
  {
    name: "Notion",
    description: "All-in-one workspace for notes and docs",
    url: "https://notion.so",
    icon: FileText,
    category: "productivity",
    tags: ["notes", "docs", "collaboration"],
    featured: true,
  },
  {
    name: "Raycast",
    description: "Spotlight replacement with extensions",
    url: "https://raycast.com",
    icon: Zap,
    category: "productivity",
    tags: ["launcher", "mac", "productivity"],
    featured: true,
  },
  {
    name: "Arc Browser",
    description: "Chromium-based browser with unique UX",
    url: "https://arc.net",
    icon: Globe,
    category: "productivity",
    tags: ["browser", "mac", "productivity"],
    featured: true,
  },
  {
    name: "Obsidian",
    description: "Markdown knowledge base",
    url: "https://obsidian.md",
    icon: Brain,
    category: "productivity",
    tags: ["notes", "knowledge-base", "markdown"],
  },
  {
    name: "Linear",
    description: "Issue tracking and project management",
    url: "https://linear.app",
    icon: Target,
    category: "productivity",
    tags: ["project-management", "issues", "agile"],
  },
  {
    name: "Excalidraw",
    description: "Hand-drawn style diagrams",
    url: "https://excalidraw.com",
    icon: PenTool,
    category: "productivity",
    tags: ["diagrams", "whiteboard", "free"],
  },
  {
    name: "1Password",
    description: "Password manager and secure vault",
    url: "https://1password.com",
    icon: Lock,
    category: "productivity",
    tags: ["security", "passwords", "vault"],
    featured: true,
  },
];

const categories = [
  { id: "all", name: "All Resources", icon: Layers },
  { id: "dev-tools", name: "Dev Tools", icon: Wrench },
  { id: "vscode", name: "VS Code Extensions", icon: Code2 },
  { id: "learning", name: "Learning", icon: BookOpen },
  { id: "design", name: "Design", icon: Palette },
  { id: "productivity", name: "Productivity", icon: Zap },
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory;
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter((r) => r.featured);

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-sm font-medium">Curated Collection</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Developer <span className="text-gradient-animated">Resources</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A curated collection of tools, extensions, and resources I use daily for development, design, and productivity.
          </p>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal delay={0.1} className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal delay={0.2} className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
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
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Featured Section */}
        {activeCategory === "all" && !searchQuery && (
          <ScrollReveal delay={0.3} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-5 w-5 text-primary fill-primary" />
              <h2 className="text-2xl font-bold">Featured</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredResources.slice(0, 4).map((resource) => (
                <ResourceCard key={resource.name} resource={resource} />
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Resources Grid */}
        <ScrollReveal delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredResources.map((resource) => (
                <motion.div
                  key={resource.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ResourceCard resource={resource} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground mb-4">No resources found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Footer Note */}
        <ScrollReveal className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Last updated: March 2026 • Some links may be affiliate links
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = resource.icon;

  return (
    <motion.a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all h-full"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {resource.name}
            </h3>
            {resource.featured && <Star className="h-3 w-3 text-primary fill-primary" />}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>

          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </motion.a>
  );
}
