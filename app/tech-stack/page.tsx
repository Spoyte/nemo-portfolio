"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Layers, 
  Zap, 
  Globe, 
  Database, 
  Palette,
  Server,
  Cpu,
  Box,
  GitBranch,
  Terminal,
  Cloud,
  Sparkles,
  Info,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TechItem {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  experience: string;
  projects: number;
  proficiency: number;
  related: string[];
  features: string[];
}

const technologies: TechItem[] = [
  {
    id: "react",
    name: "React",
    category: "Frontend",
    icon: <Code2 className="w-6 h-6" />,
    color: "#61DAFB",
    description: "A JavaScript library for building user interfaces with component-based architecture.",
    experience: "5+ years",
    projects: 45,
    proficiency: 95,
    related: ["nextjs", "typescript", "tailwind"],
    features: ["Virtual DOM", "Hooks", "Context API", "Suspense"],
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Frontend",
    icon: <Layers className="w-6 h-6" />,
    color: "#000000",
    description: "The React Framework for the Web with server-side rendering and static site generation.",
    experience: "4+ years",
    projects: 32,
    proficiency: 92,
    related: ["react", "typescript", "vercel"],
    features: ["App Router", "Server Components", "Image Optimization", "API Routes"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Language",
    icon: <Terminal className="w-6 h-6" />,
    color: "#3178C6",
    description: "Typed JavaScript at any scale. Adds static type checking to JavaScript.",
    experience: "4+ years",
    projects: 50,
    proficiency: 90,
    related: ["react", "nextjs", "nodejs"],
    features: ["Type Safety", "IntelliSense", "Refactoring", "Generics"],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Styling",
    icon: <Palette className="w-6 h-6" />,
    color: "#06B6D4",
    description: "A utility-first CSS framework for rapidly building custom designs.",
    experience: "3+ years",
    projects: 40,
    proficiency: 95,
    related: ["react", "nextjs", "css"],
    features: ["Utility Classes", "Responsive Design", "Dark Mode", "Customization"],
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    icon: <Server className="w-6 h-6" />,
    color: "#339933",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine.",
    experience: "5+ years",
    projects: 35,
    proficiency: 88,
    related: ["typescript", "express", "mongodb"],
    features: ["Event Loop", "NPM Ecosystem", "Streams", "Clustering"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Database",
    icon: <Database className="w-6 h-6" />,
    color: "#336791",
    description: "The World's Most Advanced Open Source Relational Database.",
    experience: "4+ years",
    projects: 25,
    proficiency: 85,
    related: ["nodejs", "prisma", "sql"],
    features: ["ACID Compliance", "JSON Support", "Full-Text Search", "Extensions"],
  },
  {
    id: "graphql",
    name: "GraphQL",
    category: "API",
    icon: <GitBranch className="w-6 h-6" />,
    color: "#E10098",
    description: "A query language for APIs and a runtime for fulfilling those queries.",
    experience: "3+ years",
    projects: 18,
    proficiency: 82,
    related: ["react", "nodejs", "apollo"],
    features: ["Type System", "Single Endpoint", "Real-time", "Introspection"],
  },
  {
    id: "docker",
    name: "Docker",
    category: "DevOps",
    icon: <Box className="w-6 h-6" />,
    color: "#2496ED",
    description: "Empowering App Development for Developers with containerization.",
    experience: "3+ years",
    projects: 20,
    proficiency: 80,
    related: ["kubernetes", "cicd", "aws"],
    features: ["Containers", "Images", "Compose", "Swarm"],
  },
  {
    id: "aws",
    name: "AWS",
    category: "Cloud",
    icon: <Cloud className="w-6 h-6" />,
    color: "#FF9900",
    description: "Cloud computing services for building sophisticated applications.",
    experience: "3+ years",
    projects: 22,
    proficiency: 78,
    related: ["docker", "vercel", "terraform"],
    features: ["EC2", "S3", "Lambda", "RDS"],
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "Graphics",
    icon: <Box className="w-6 h-6" />,
    color: "#000000",
    description: "JavaScript 3D Library for creating immersive web experiences.",
    experience: "2+ years",
    projects: 12,
    proficiency: 75,
    related: ["react", "webgl", "gsap"],
    features: ["WebGL", "Scenes", "Materials", "Animations"],
  },
  {
    id: "framer",
    name: "Framer Motion",
    category: "Animation",
    icon: <Zap className="w-6 h-6" />,
    color: "#0055FF",
    description: "A production-ready motion library for React.",
    experience: "3+ years",
    projects: 30,
    proficiency: 90,
    related: ["react", "gsap", "css"],
    features: ["Gestures", "Variants", "AnimatePresence", "Layout"],
  },
  {
    id: "git",
    name: "Git",
    category: "Tools",
    icon: <GitBranch className="w-6 h-6" />,
    color: "#F05032",
    description: "Distributed version control system for tracking code changes.",
    experience: "6+ years",
    projects: 100,
    proficiency: 92,
    related: ["github", "gitlab", "cicd"],
    features: ["Branching", "Merging", "Rebasing", "History"],
  },
];

const categories = Array.from(new Set(technologies.map((t) => t.category)));

export default function TechStackVisualizer() {
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const filteredTechs = activeCategory
    ? technologies.filter((t) => t.category === activeCategory)
    : technologies;

  const relatedTechs = selectedTech
    ? technologies.filter((t) => selectedTech.related.includes(t.id))
    : [];

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
            <Cpu className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Explorer</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tech Stack{" "}
            <span className="text-gradient-animated">Visualizer</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my technology ecosystem. Click on any technology to see details,
            related tools, and proficiency levels.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Tech Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredTechs.map((tech, index) => (
              <motion.div
                key={tech.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedTech(tech)}
                onMouseEnter={() => setHoveredTech(tech.id)}
                onMouseLeave={() => setHoveredTech(null)}
                className="cursor-pointer"
              >
                <Card className={`h-full transition-all duration-300 ${
                  selectedTech?.id === tech.id
                    ? "ring-2 ring-primary"
                    : hoveredTech === tech.id
                    ? "border-primary/50"
                    : ""
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: `${tech.color}20`, color: tech.color }}
                      >
                        {tech.icon}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {tech.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{tech.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${tech.proficiency}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: tech.color }}
                        />
                      </div>
                      <span className="text-xs">{tech.proficiency}%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedTech && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-12"
            >
              <Card className="overflow-hidden">
                <div
                  className="p-6 text-white"
                  style={{ backgroundColor: selectedTech.color }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                        {selectedTech.icon}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">{selectedTech.name}</h2>
                        <p className="text-white/80">{selectedTech.category}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedTech(null)}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4 text-primary" />
                          About
                        </h3>
                        <p className="text-muted-foreground">{selectedTech.description}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Key Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTech.features.map((feature) => (
                            <Badge key={feature} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Related Technologies */}
                      {relatedTechs.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">Related Technologies</h3>
                          <div className="flex flex-wrap gap-2">
                            {relatedTechs.map((tech) => (
                              <button
                                key={tech.id}
                                onClick={() => setSelectedTech(tech)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                              >
                                <span style={{ color: tech.color }}>{tech.icon}</span>
                                <span className="text-sm">{tech.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="space-y-6">
                      <div className="p-4 rounded-xl bg-muted">
                        <p className="text-sm text-muted-foreground mb-1">Experience</p>
                        <p className="text-2xl font-bold">{selectedTech.experience}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-muted">
                        <p className="text-sm text-muted-foreground mb-1">Projects</p>
                        <p className="text-2xl font-bold">{selectedTech.projects}+</p>
                      </div>

                      <div className="p-4 rounded-xl bg-muted">
                        <p className="text-sm text-muted-foreground mb-1">Proficiency</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-background rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${selectedTech.proficiency}%`,
                                backgroundColor: selectedTech.color,
                              }}
                            />
                          </div>
                          <span className="font-bold">{selectedTech.proficiency}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Technologies", value: technologies.length, icon: Code2 },
            { label: "Categories", value: categories.length, icon: Layers },
            { label: "Total Projects", value: "500+", icon: Sparkles },
            { label: "Years Experience", value: "7+", icon: Cpu },
          ].map((stat, index) => (
            <Card key={stat.label}>
              <CardContent className="p-6 text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
