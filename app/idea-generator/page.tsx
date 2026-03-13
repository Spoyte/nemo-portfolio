"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check,
  Code2,
  Palette,
  Database,
  Globe,
  Smartphone,
  Cpu,
  Brain,
  Rocket,
  Zap,
  Target,
  Bookmark,
  Share2,
  History,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Project idea templates
const ideaTemplates = {
  web: [
    { template: "A {adjective} dashboard for tracking {noun}", tags: ["Dashboard", "Data Viz"] },
    { template: "A collaborative {noun} platform with real-time {feature}", tags: ["Collaboration", "Real-time"] },
    { template: "An AI-powered {noun} generator with {feature}", tags: ["AI", "Generator"] },
    { template: "A {adjective} marketplace for {noun}", tags: ["Marketplace", "E-commerce"] },
    { template: "A social network for {noun} enthusiasts", tags: ["Social", "Community"] },
    { template: "A {adjective} portfolio builder for {noun}", tags: ["Portfolio", "Tool"] },
    { template: "An interactive learning platform for {noun}", tags: ["Education", "Interactive"] },
    { template: "A {adjective} analytics tool for {noun}", tags: ["Analytics", "Tool"] },
  ],
  mobile: [
    { template: "A {adjective} habit tracker for {noun}", tags: ["Productivity", "Health"] },
    { template: "A meditation app with {feature} and {feature}", tags: ["Wellness", "Audio"] },
    { template: "A {adjective} fitness companion for {noun}", tags: ["Fitness", "Tracking"] },
    { template: "A recipe finder with {feature} recommendations", tags: ["Food", "AI"] },
    { template: "A travel planner for {adjective} {noun}", tags: ["Travel", "Planning"] },
    { template: "A budget tracker with {feature} insights", tags: ["Finance", "Analytics"] },
  ],
  ai: [
    { template: "An AI that generates {adjective} {noun}", tags: ["AI", "Generator"] },
    { template: "A smart assistant for {noun} management", tags: ["AI", "Assistant"] },
    { template: "An automated {noun} classifier using ML", tags: ["ML", "Classification"] },
    { template: "A predictive {noun} analytics system", tags: ["AI", "Predictive"] },
    { template: "A chatbot that helps with {noun}", tags: ["AI", "Chatbot"] },
  ],
  game: [
    { template: "A {adjective} puzzle game about {noun}", tags: ["Game", "Puzzle"] },
    { template: "An idle clicker game featuring {noun}", tags: ["Game", "Idle"] },
    { template: "A multiplayer {noun} battle arena", tags: ["Game", "Multiplayer"] },
    { template: "A roguelike where you play as {adjective} {noun}", tags: ["Game", "Roguelike"] },
    { template: "A tower defense game with {feature}", tags: ["Game", "Strategy"] },
  ],
  tool: [
    { template: "A CLI tool for {adjective} {noun}", tags: ["CLI", "Developer Tool"] },
    { template: "A browser extension that {verb} {noun}", tags: ["Extension", "Browser"] },
    { template: "A VS Code plugin for {feature}", tags: ["VS Code", "Extension"] },
    { template: "An API service for {noun} {feature}", tags: ["API", "Service"] },
    { template: "A documentation generator for {noun}", tags: ["Documentation", "Tool"] },
  ],
};

const adjectives = [
  "minimalist", "colorful", "interactive", "automated", "smart", "intelligent",
  "collaborative", "personalized", "adaptive", "immersive", "intuitive", "elegant",
  "powerful", "lightweight", "robust", "scalable", "secure", "open-source",
  "community-driven", "AI-powered", "real-time", "decentralized", "serverless"
];

const nouns = [
  "productivity", "creativity", "learning", "fitness", "finance", "travel",
  "food", "music", "art", "code", "data", "content", "tasks", "habits",
  "projects", "teams", "customers", "inventory", "expenses", "time", "energy",
  "focus", "wellness", "knowledge", "memories", "experiences", "connections"
];

const features = [
  "machine learning", "blockchain", "AR/VR", "voice recognition", "gesture control",
  "facial recognition", "natural language processing", "computer vision",
  "recommendation engine", "real-time sync", "offline mode", "dark mode",
  "multiplayer", "gamification", "social sharing", "notifications", "search",
  "filtering", "sorting", "export", "import", "backup", "encryption"
];

const verbs = [
  "organizes", "analyzes", "generates", "transforms", "enhances", "simplifies",
  "automates", "optimizes", "visualizes", "tracks", "manages", "creates",
  "discovers", "recommends", "predicts", "summarizes", "translates", "converts"
];

const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];
const timeEstimates = ["Weekend", "1 Week", "2 Weeks", "1 Month", "3 Months"];

interface GeneratedIdea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  difficulty: string;
  timeEstimate: string;
  features: string[];
  techStack: string[];
  timestamp: number;
}

export default function IdeaGeneratorPage() {
  const [currentIdea, setCurrentIdea] = useState<GeneratedIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState<GeneratedIdea[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof ideaTemplates | "all">("all");

  // Load saved ideas from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("generated-ideas");
    if (saved) {
      setSavedIdeas(JSON.parse(saved));
    }
  }, []);

  // Save ideas to localStorage
  useEffect(() => {
    localStorage.setItem("generated-ideas", JSON.stringify(savedIdeas));
  }, [savedIdeas]);

  const generateIdea = () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const categories = selectedCategory === "all" 
        ? Object.keys(ideaTemplates) 
        : [selectedCategory];
      const category = categories[Math.floor(Math.random() * categories.length)] as keyof typeof ideaTemplates;
      const templates = ideaTemplates[category];
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      // Fill in the template
      let title = template.template
        .replace(/{adjective}/g, () => adjectives[Math.floor(Math.random() * adjectives.length)])
        .replace(/{noun}/g, () => nouns[Math.floor(Math.random() * nouns.length)])
        .replace(/{feature}/g, () => features[Math.floor(Math.random() * features.length)])
        .replace(/{verb}/g, () => verbs[Math.floor(Math.random() * verbs.length)]);

      // Capitalize first letter
      title = title.charAt(0).toUpperCase() + title.slice(1);

      // Generate description
      const descriptions = [
        `Build ${title.toLowerCase()}. This project will help users ${verbs[Math.floor(Math.random() * verbs.length)]} their ${nouns[Math.floor(Math.random() * nouns.length)]} more effectively.`,
        `Create ${title.toLowerCase()} that leverages ${features[Math.floor(Math.random() * features.length)]} to deliver a unique experience.`,
        `Develop ${title.toLowerCase()} with a focus on ${adjectives[Math.floor(Math.random() * adjectives.length)]} design and user experience.`,
        `Design ${title.toLowerCase()} that solves real problems for ${nouns[Math.floor(Math.random() * nouns.length)]} enthusiasts.`,
      ];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];

      // Generate tech stack based on category
      const techStacks: Record<string, string[]> = {
        web: ["React", "Next.js", "TypeScript", "Tailwind", "PostgreSQL"],
        mobile: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
        ai: ["Python", "TensorFlow", "PyTorch", "OpenAI API", "FastAPI"],
        game: ["Unity", "Godot", "Phaser", "Three.js", "WebGL"],
        tool: ["Node.js", "Rust", "Go", "CLI", "Docker"],
      };

      const idea: GeneratedIdea = {
        id: Date.now().toString(),
        title,
        description,
        tags: template.tags,
        category,
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        timeEstimate: timeEstimates[Math.floor(Math.random() * timeEstimates.length)],
        features: Array.from({ length: 3 }, () => features[Math.floor(Math.random() * features.length)]),
        techStack: techStacks[category].slice(0, 3 + Math.floor(Math.random() * 2)),
        timestamp: Date.now(),
      };

      setCurrentIdea(idea);
      setIsGenerating(false);
    }, 800);
  };

  const saveIdea = () => {
    if (currentIdea && !savedIdeas.find(i => i.id === currentIdea.id)) {
      setSavedIdeas([currentIdea, ...savedIdeas]);
    }
  };

  const deleteIdea = (id: string) => {
    setSavedIdeas(savedIdeas.filter(i => i.id !== id));
  };

  const copyIdea = () => {
    if (currentIdea) {
      navigator.clipboard.writeText(`${currentIdea.title}\n\n${currentIdea.description}\n\nTech Stack: ${currentIdea.techStack.join(", ")}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareIdea = () => {
    if (currentIdea && navigator.share) {
      navigator.share({
        title: currentIdea.title,
        text: currentIdea.description,
      });
    }
  };

  const categoryIcons: Record<string, React.ElementType> = {
    web: Globe,
    mobile: Smartphone,
    ai: Brain,
    game: Rocket,
    tool: Code2,
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm font-medium">Project Ideas</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Idea{" "}
            <span className="text-gradient-animated">Generator</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stuck on what to build? Generate unique project ideas tailored to your interests.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 flex-wrap mb-8"
        >
          {[
            { id: "all", label: "All", icon: Sparkles },
            { id: "web", label: "Web", icon: Globe },
            { id: "mobile", label: "Mobile", icon: Smartphone },
            { id: "ai", label: "AI/ML", icon: Brain },
            { id: "game", label: "Game", icon: Rocket },
            { id: "tool", label: "Tool", icon: Code2 },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Generator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              {!currentIdea ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="mb-6"
                  >
                    <Lightbulb className="w-20 h-20 mx-auto text-primary" />
                  </motion.div>
                  <p className="text-muted-foreground mb-6">
                    Click the button below to generate a unique project idea
                  </p>
                  <Button 
                    size="lg" 
                    onClick={generateIdea}
                    disabled={isGenerating}
                    className="relative"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Idea
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIdea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Idea Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {(() => {
                            const Icon = categoryIcons[currentIdea.category] || Code2;
                            return <Icon className="w-5 h-5 text-primary" />;
                          })()}
                          <Badge variant="outline">{currentIdea.category.toUpperCase()}</Badge>
                          <Badge 
                            variant="secondary"
                            className={`
                              ${currentIdea.difficulty === "Beginner" ? "bg-green-500/10 text-green-500" : ""}
                              ${currentIdea.difficulty === "Intermediate" ? "bg-blue-500/10 text-blue-500" : ""}
                              ${currentIdea.difficulty === "Advanced" ? "bg-orange-500/10 text-orange-500" : ""}
                              ${currentIdea.difficulty === "Expert" ? "bg-red-500/10 text-red-500" : ""}
                            `}
                          >
                            {currentIdea.difficulty}
                          </Badge>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold">{currentIdea.title}</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={copyIdea}>
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={shareIdea}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={saveIdea}
                          disabled={savedIdeas.find(i => i.id === currentIdea.id) !== undefined}
                        >
                          <Bookmark className={`w-4 h-4 ${savedIdeas.find(i => i.id === currentIdea.id) ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-lg mb-6">{currentIdea.description}</p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="text-xs text-muted-foreground mb-1">Time Estimate</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {currentIdea.timeEstimate}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="text-xs text-muted-foreground mb-1">Key Features</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          {currentIdea.features.length}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="text-xs text-muted-foreground mb-1">Tech Stack</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Code2 className="w-4 h-4" />
                          {currentIdea.techStack.length} items
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="text-xs text-muted-foreground mb-1">Tags</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {currentIdea.tags.length}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold mb-2">Key Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentIdea.features.map((feature, i) => (
                          <Badge key={i} variant="secondary">{feature}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold mb-2">Suggested Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentIdea.techStack.map((tech, i) => (
                          <Badge key={i} variant="outline" className="bg-primary/5">{tech}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {currentIdea.tags.map((tag, i) => (
                        <Badge key={i} className="bg-primary/10 text-primary">{tag}</Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center">
                      <Button 
                        size="lg" 
                        onClick={generateIdea}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Generate Another
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Saved Ideas */}
        {savedIdeas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Saved Ideas ({savedIdeas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {savedIdeas.map((idea) => (
                    <motion.div
                      key={idea.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted group"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{idea.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {idea.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{idea.category}</Badge>
                          <Badge variant="secondary" className="text-xs">{idea.difficulty}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteIdea(idea.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            💡 Tip: Save ideas you like and come back to them later. Your saved ideas are stored locally.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
