"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Beaker, 
  Sparkles, 
  Zap, 
  Eye, 
  MousePointer2, 
  Palette,
  Code2,
  Music,
  Gamepad2,
  ArrowRight,
  ExternalLink,
  Clock,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Experiment {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isNew?: boolean;
  color: string;
}

const experiments: Experiment[] = [
  {
    id: "matrix-rain",
    title: "Matrix Rain",
    description: "Interactive Matrix-style digital rain with customizable colors and effects.",
    icon: Code2,
    href: "/matrix-rain",
    category: "Visual",
    difficulty: "Medium",
    isNew: true,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "typing-race",
    title: "Typing Race",
    description: "Test your typing speed and accuracy with real-time WPM tracking.",
    icon: Zap,
    href: "/typing-race",
    category: "Game",
    difficulty: "Easy",
    isNew: true,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "soundboard",
    title: "Dev Soundboard",
    description: "Classic developer sound effects, jokes, and programming wisdom.",
    icon: Music,
    href: "/soundboard",
    category: "Audio",
    difficulty: "Easy",
    isNew: true,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "color-studio",
    title: "Color Studio",
    description: "Generate harmonious color palettes with various color theory algorithms.",
    icon: Palette,
    href: "/color-studio",
    category: "Design",
    difficulty: "Medium",
    color: "from-purple-500 to-violet-500"
  },
  {
    id: "art-studio",
    title: "Art Studio",
    description: "Explore generative art pieces created with code and algorithms.",
    icon: Sparkles,
    href: "/art-studio",
    category: "Visual",
    difficulty: "Hard",
    color: "from-orange-500 to-amber-500"
  },
  {
    id: "challenges",
    title: "Daily Challenges",
    description: "Complete challenges, earn points, unlock achievements and rewards.",
    icon: Gamepad2,
    href: "/challenges",
    category: "Game",
    difficulty: "Medium",
    isNew: true,
    color: "from-yellow-500 to-amber-500"
  },
  {
    id: "animations",
    title: "Animation Playground",
    description: "Interactive animation demonstrations and micro-interaction examples.",
    icon: Eye,
    href: "/animations",
    category: "Visual",
    difficulty: "Medium",
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: "code-cinema",
    title: "Code Cinema",
    description: "Watch code come alive with animated code visualizations.",
    icon: MousePointer2,
    href: "/code-cinema",
    category: "Visual",
    difficulty: "Hard",
    color: "from-red-500 to-rose-500"
  }
];

const categories = ["All", "Visual", "Game", "Audio", "Design"];

export default function LabsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const filteredExperiments = activeCategory === "All" 
    ? experiments 
    : experiments.filter(e => e.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Custom Cursor Glow */}
      <motion.div
        className="fixed pointer-events-none z-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: mousePosition.x - 128,
          y: mousePosition.y - 128,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Beaker className="h-4 w-4" />
            <span className="text-sm font-medium">Experimental Zone</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Interactive{" "}
            <span className="text-gradient-animated">Labs</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A collection of interactive experiments, mini-games, and creative coding projects. 
            Click around, break things, have fun!
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Experiments Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredExperiments.map((experiment, index) => (
              <motion.div
                key={experiment.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredId(experiment.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link href={experiment.href}>
                  <div className="group relative h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                    {/* Background Gradient */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${experiment.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />
                    
                    {/* New Badge */}
                    {experiment.isNew && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          New
                        </Badge>
                      </div>
                    )}

                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${experiment.color} mb-4`}
                    >
                      <experiment.icon className="h-6 w-6 text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {experiment.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {experiment.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {experiment.category}
                        </Badge>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          experiment.difficulty === "Easy" ? "bg-green-500/10 text-green-500" :
                          experiment.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500" :
                          "bg-red-500/10 text-red-500"
                        }`}>
                          {experiment.difficulty}
                        </span>
                      </div>
                      <motion.div
                        animate={{ x: hoveredId === experiment.id ? 5 : 0 }}
                        className="text-primary"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>

                    {/* Hover Effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredId === experiment.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Experiments", value: experiments.length, icon: Beaker },
            { label: "Categories", value: categories.length - 1, icon: Palette },
            { label: "New This Week", value: experiments.filter(e => e.isNew).length, icon: Sparkles },
            { label: "Hours of Fun", value: "∞", icon: Clock },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border text-center"
            >
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 border border-border">
            <Star className="h-8 w-8 text-primary" />
            <div className="text-left">
              <p className="font-semibold">Have an idea for an experiment?</p>
              <p className="text-sm text-muted-foreground">I&apos;m always looking for new creative coding challenges!</p>
            </div>
            <Link href="/contact">
              <Button>
                Suggest Idea
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
