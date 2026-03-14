"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Lightbulb, 
  Code2, 
  Palette, 
  Rocket,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Bookmark,
  Share2,
  Zap,
  Target,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

interface Idea {
  id: string;
  title: string;
  description: string;
  category: "project" | "feature" | "design" | "algorithm";
  difficulty: "beginner" | "intermediate" | "advanced";
  tech: string[];
  inspiration: string;
  estimatedTime: string;
}

const ideaDatabase: Idea[] = [
  {
    id: "1",
    title: "AI-Powered Code Review Assistant",
    description: "Build a VS Code extension that uses AI to provide real-time code reviews, suggesting improvements and catching potential bugs before they become problems.",
    category: "project",
    difficulty: "advanced",
    tech: ["TypeScript", "OpenAI API", "VS Code API"],
    inspiration: "GitHub Copilot",
    estimatedTime: "2-3 weeks"
  },
  {
    id: "2",
    title: "Interactive Particle Text",
    description: "Create a text effect where letters are composed of thousands of particles that respond to mouse movement, creating a mesmerizing interactive experience.",
    category: "design",
    difficulty: "intermediate",
    tech: ["Canvas API", "JavaScript", "Physics"],
    inspiration: "Interactive art installations",
    estimatedTime: "3-5 days"
  },
  {
    id: "3",
    title: "Voice-Controlled Dashboard",
    description: "Build a dashboard that can be fully controlled by voice commands, allowing users to navigate, filter data, and generate reports hands-free.",
    category: "feature",
    difficulty: "intermediate",
    tech: ["Web Speech API", "React", "D3.js"],
    inspiration: "Smart home interfaces",
    estimatedTime: "1-2 weeks"
  },
  {
    id: "4",
    title: "Generative Music Visualizer",
    description: "Create a music visualizer that generates unique visual patterns based on audio frequency analysis, with customizable themes and export options.",
    category: "algorithm",
    difficulty: "advanced",
    tech: ["Web Audio API", "WebGL", "GLSL"],
    inspiration: "Winamp visualizations",
    estimatedTime: "2-3 weeks"
  },
  {
    id: "5",
    title: "Minimalist Pomodoro with Analytics",
    description: "A beautiful, distraction-free Pomodoro timer that tracks your productivity patterns and provides insights on your most productive hours.",
    category: "project",
    difficulty: "beginner",
    tech: ["React", "LocalStorage", "Recharts"],
    inspiration: "Forest app",
    estimatedTime: "1 week"
  },
  {
    id: "6",
    title: "3D Product Configurator",
    description: "Build an interactive 3D product configurator that allows users to customize colors, materials, and features in real-time with realistic rendering.",
    category: "feature",
    difficulty: "advanced",
    tech: ["Three.js", "React Three Fiber", "GLTF"],
    inspiration: "Nike By You",
    estimatedTime: "3-4 weeks"
  },
  {
    id: "7",
    title: "CSS Art Gallery",
    description: "Create a collection of pure CSS artwork - animals, landscapes, or abstract pieces - showcasing the power of CSS without any images.",
    category: "design",
    difficulty: "intermediate",
    tech: ["CSS", "SCSS", "Animations"],
    inspiration: "CSS Art challenges",
    estimatedTime: "1-2 weeks"
  },
  {
    id: "8",
    title: "Real-time Collaborative Whiteboard",
    description: "Build a whiteboard application where multiple users can draw, add sticky notes, and collaborate in real-time with cursor presence.",
    category: "project",
    difficulty: "advanced",
    tech: ["Socket.io", "Canvas", "Operational Transforms"],
    inspiration: "Figma, Miro",
    estimatedTime: "3-4 weeks"
  },
  {
    id: "9",
    title: "Animated SVG Icons",
    description: "Design a set of micro-animated SVG icons that bring life to UI interactions - loading states, success animations, and transitions.",
    category: "design",
    difficulty: "beginner",
    tech: ["SVG", "CSS Animations", "GSAP"],
    inspiration: "Lottie animations",
    estimatedTime: "5-7 days"
  },
  {
    id: "10",
    title: "Pathfinding Visualizer",
    description: "Create an interactive visualization of various pathfinding algorithms (A*, Dijkstra, BFS) with maze generation and step-by-step playback.",
    category: "algorithm",
    difficulty: "intermediate",
    tech: ["React", "Algorithms", "Canvas"],
    inspiration: "Clement Mihailescu's project",
    estimatedTime: "1-2 weeks"
  },
  {
    id: "11",
    title: "Dark Mode Toggle Animation",
    description: "Design a creative dark mode toggle with smooth morphing animations between sun and moon, with stars appearing in the background.",
    category: "feature",
    difficulty: "beginner",
    tech: ["CSS", "Framer Motion", "React"],
    inspiration: "iOS dark mode",
    estimatedTime: "2-3 days"
  },
  {
    id: "12",
    title: "Blockchain Explorer",
    description: "Build a simplified blockchain explorer that visualizes blocks, transactions, and wallet balances with a clean, modern interface.",
    category: "project",
    difficulty: "advanced",
    tech: ["Web3.js", "Ethers.js", "Node.js"],
    inspiration: "Etherscan",
    estimatedTime: "3-4 weeks"
  }
];

const categoryIcons = {
  project: Rocket,
  feature: Zap,
  design: Palette,
  algorithm: Brain
};

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-500 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-500 border-red-500/20"
};

export function IdeaGenerator() {
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIdea = useCallback(() => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let filteredIdeas = ideaDatabase;
      
      if (selectedCategory) {
        filteredIdeas = filteredIdeas.filter(i => i.category === selectedCategory);
      }
      
      if (selectedDifficulty) {
        filteredIdeas = filteredIdeas.filter(i => i.difficulty === selectedDifficulty);
      }
      
      const randomIdea = filteredIdeas[Math.floor(Math.random() * filteredIdeas.length)];
      setCurrentIdea(randomIdea || ideaDatabase[0]);
      setIsGenerating(false);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#dc2626', '#ea580c', '#fbbf24', '#22d3ee']
      });
    }, 800);
  }, [selectedCategory, selectedDifficulty]);

  const copyIdea = () => {
    if (currentIdea) {
      navigator.clipboard.writeText(`${currentIdea.title}\n\n${currentIdea.description}\n\nTech: ${currentIdea.tech.join(", ")}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const saveIdea = () => {
    if (currentIdea && !savedIdeas.find(i => i.id === currentIdea.id)) {
      setSavedIdeas([...savedIdeas, currentIdea]);
    }
  };

  const shareIdea = async () => {
    if (currentIdea && navigator.share) {
      try {
        await navigator.share({
          title: currentIdea.title,
          text: currentIdea.description,
          url: window.location.href
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  useEffect(() => {
    generateIdea();
  }, []);

  const CategoryIcon = currentIdea ? categoryIcons[currentIdea.category] : Lightbulb;

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-medium">Idea Generator</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stuck? Get a{" "}
            <span className="text-gradient-animated">Brilliant Idea</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate project ideas, features, and design concepts tailored to your skill level. 
            Never run out of things to build!
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-muted-foreground self-center mr-2">Category:</span>
            {["project", "feature", "design", "algorithm"].map((cat) => {
              const Icon = categoryIcons[cat as keyof typeof categoryIcons];
              return (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className="capitalize"
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {cat}
                </Button>
              );
            })}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-muted-foreground self-center mr-2">Difficulty:</span>
            {["beginner", "intermediate", "advanced"].map((diff) => (
              <Button
                key={diff}
                variant={selectedDifficulty === diff ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                className="capitalize"
              >
                {diff}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Idea Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {currentIdea && (
              <motion.div
                key={currentIdea.id}
                initial={{ opacity: 0, scale: 0.95, rotateX: -10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotateX: 10 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-8 relative overflow-hidden">
                  {/* Background Glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="p-4 rounded-2xl bg-gradient-to-br from-primary to-orange-500"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          <CategoryIcon className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="capitalize">
                              {currentIdea.category}
                            </Badge>
                            <span className={`px-2 py-0.5 text-xs rounded-full border ${difficultyColors[currentIdea.difficulty]}`}>
                              {currentIdea.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">Est. time: {currentIdea.estimatedTime}</p>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={isGenerating ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className={`w-6 h-6 ${isGenerating ? "text-primary" : "text-muted-foreground"}`} />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <motion.h3 
                      className="text-2xl font-bold mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {currentIdea.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-muted-foreground mb-6 text-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {currentIdea.description}
                    </motion.p>

                    {/* Tech Stack */}
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-sm font-medium mb-2">Technologies:</p>
                      <div className="flex flex-wrap gap-2">
                        {currentIdea.tech.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>

                    {/* Inspiration */}
                    <motion.div 
                      className="p-4 rounded-xl bg-muted mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Inspired by:</span> {currentIdea.inspiration}
                      </p>
                    </motion.div>

                    {/* Actions */}
                    <motion.div 
                      className="flex flex-wrap gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button onClick={generateIdea} className="flex-1">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                        Generate New Idea
                      </Button>
                      
                      <Button variant="outline" onClick={copyIdea}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={saveIdea}
                        disabled={savedIdeas.find(i => i.id === currentIdea.id) !== undefined}
                      >
                        <Bookmark className={`w-4 h-4 ${savedIdeas.find(i => i.id === currentIdea.id) ? "fill-primary" : ""}`} />
                      </Button>
                      
                      <Button variant="outline" onClick={shareIdea}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Saved Ideas */}
        {savedIdeas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary" />
              Saved Ideas ({savedIdeas.length})
            </h3>
            
            <div className="grid gap-4">
              <AnimatePresence>
                {savedIdeas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{idea.title}</p>
                        <p className="text-sm text-muted-foreground">{idea.tech.join(", ")}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSavedIdeas(savedIdeas.filter(i => i.id !== idea.id))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Missing import
import { X } from "lucide-react";
