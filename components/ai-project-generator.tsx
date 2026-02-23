"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Lightbulb,
  Code2,
  Palette,
  Zap,
  Rocket,
  Brain,
  Layers,
  Save,
  Share2
} from "lucide-react";
import { toast } from "sonner";

interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  techStack: string[];
  features: string[];
  estimatedTime: string;
  likes: number;
}

const categories = [
  { id: "all", name: "All Ideas", icon: <Lightbulb className="w-4 h-4" /> },
  { id: "web", name: "Web App", icon: <Code2 className="w-4 h-4" /> },
  { id: "design", name: "UI/UX", icon: <Palette className="w-4 h-4" /> },
  { id: "tool", name: "Developer Tool", icon: <Wrench className="w-4 h-4" /> },
  { id: "ai", name: "AI/ML", icon: <Brain className="w-4 h-4" /> },
];

// Missing icon
function Wrench({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

const projectIdeas: ProjectIdea[] = [
  {
    id: "1",
    title: "AI-Powered Code Review Assistant",
    description: "A browser extension that uses AI to provide real-time code reviews, suggestions, and best practices as you write code.",
    category: "ai",
    difficulty: "advanced",
    techStack: ["TypeScript", "OpenAI API", "Chrome Extension", "React"],
    features: ["Real-time analysis", "Custom rules", "Team collaboration", "GitHub integration"],
    estimatedTime: "2-3 months",
    likes: 234,
  },
  {
    id: "2",
    title: "Collaborative Whiteboard",
    description: "A real-time collaborative whiteboard with drawing tools, sticky notes, and voice chat for remote teams.",
    category: "web",
    difficulty: "intermediate",
    techStack: ["Next.js", "Socket.io", "Canvas API", "WebRTC"],
    features: ["Real-time sync", "Voice chat", "Export to PDF", "Templates"],
    estimatedTime: "1-2 months",
    likes: 189,
  },
  {
    id: "3",
    title: "Design System Generator",
    description: "A tool that generates a complete design system from a single color palette, including tokens, components, and documentation.",
    category: "design",
    difficulty: "intermediate",
    techStack: ["React", "Color.js", "Tailwind", "MDX"],
    features: ["Color palette generation", "Component library", "Documentation", "Export to Figma"],
    estimatedTime: "3-4 weeks",
    likes: 156,
  },
  {
    id: "4",
    title: "Git Commit Message Helper",
    description: "A CLI tool that suggests semantic commit messages based on your code changes using AI.",
    category: "tool",
    difficulty: "beginner",
    techStack: ["Node.js", "Git Hooks", "OpenAI API", "CLI"],
    features: ["Auto-suggestions", "Custom templates", "Conventional commits", "Team settings"],
    estimatedTime: "1-2 weeks",
    likes: 312,
  },
  {
    id: "5",
    title: "Personal Finance Visualizer",
    description: "A beautiful dashboard for tracking expenses with AI-powered insights and budget recommendations.",
    category: "web",
    difficulty: "intermediate",
    techStack: ["Next.js", "D3.js", "Plaid API", "PostgreSQL"],
    features: ["Bank sync", "Spending insights", "Budget goals", "Recurring alerts"],
    estimatedTime: "1-2 months",
    likes: 278,
  },
  {
    id: "6",
    title: "Smart Todo App",
    description: "A todo app that uses AI to prioritize tasks, suggest deadlines, and break down complex tasks.",
    category: "ai",
    difficulty: "intermediate",
    techStack: ["React Native", "OpenAI API", "Node.js", "MongoDB"],
    features: ["AI prioritization", "Smart scheduling", "Habit tracking", "Progress analytics"],
    estimatedTime: "3-4 weeks",
    likes: 445,
  },
];

const difficultyColors = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-red-500",
};

export function AIProjectGenerator() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [ideas, setIdeas] = useState(projectIdeas);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);

  const filteredIdeas = selectedCategory === "all" 
    ? ideas 
    : ideas.filter(i => i.category === selectedCategory);

  const generateNewIdea = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const newIdea: ProjectIdea = {
        id: Date.now().toString(),
        title: "AI-Generated Project " + Math.floor(Math.random() * 1000),
        description: "A unique project idea generated just for you based on current tech trends.",
        category: ["web", "ai", "tool", "design"][Math.floor(Math.random() * 4)],
        difficulty: ["beginner", "intermediate", "advanced"][Math.floor(Math.random() * 3)] as any,
        techStack: ["React", "TypeScript", "AI API"],
        features: ["Auto-generated", "Customizable", "Scalable"],
        estimatedTime: "2-4 weeks",
        likes: 0,
      };
      
      setIdeas([newIdea, ...ideas]);
      setIsGenerating(false);
      toast.success("New project idea generated!");
    }, 2000);
  };

  const likeIdea = (id: string) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea
    ));
  };

  const saveIdea = (id: string) => {
    if (savedIdeas.includes(id)) {
      setSavedIdeas(savedIdeas.filter(i => i !== id));
      toast.success("Removed from saved ideas");
    } else {
      setSavedIdeas([...savedIdeas, id]);
      toast.success("Saved for later!");
    }
  };

  const copyIdea = (idea: ProjectIdea) => {
    const text = `${idea.title}\n\n${idea.description}\n\nTech Stack: ${idea.techStack.join(", ")}\n\nFeatures:\n${idea.features.map(f => `- ${f}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white">
              <Wand2 className="w-8 h-8" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">AI Project Idea Generator</h3>
              <p className="text-muted-foreground">
                Stuck on what to build? Let AI spark your creativity with personalized project ideas.
              </p>
            </div>

            <Button 
              size="lg" 
              onClick={generateNewIdea}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Idea
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
            className="gap-2"
          >
            {cat.icon}
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredIdeas.map((idea, index) => (
            <motion.div
              key={idea.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:border-primary/50 transition-colors group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="secondary" 
                          className={`${difficultyColors[idea.difficulty]} text-white`}
                        >
                          {idea.difficulty}
                        </Badge>
                        <Badge variant="outline">{idea.estimatedTime}</Badge>
                      </div>
                      <CardTitle className="text-lg">{idea.title}</CardTitle>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => saveIdea(idea.id)}
                      >
                        <Save className={`w-4 h-4 ${savedIdeas.includes(idea.id) ? 'fill-primary text-primary' : ''}`} />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => copyIdea(idea)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{idea.description}</p>

                  {/* Tech Stack */}
                  <div>
                    <p className="text-xs font-medium mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-1">
                      {idea.techStack.map(tech => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <p className="text-xs font-medium mb-2">Key Features</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {idea.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Zap className="w-3 h-3 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => likeIdea(idea.id)}
                      className="gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {idea.likes}
                    </Button>

                    <Button size="sm" className="gap-2">
                      <Rocket className="w-4 h-4" />
                      Start Building
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No ideas in this category yet.</p>
          <Button onClick={generateNewIdea} className="mt-4">
            Generate One Now
          </Button>
        </div>
      )}
    </div>
  );
}
