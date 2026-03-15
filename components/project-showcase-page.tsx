"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  Github, 
  ArrowRight, 
  Sparkles,
  Code2,
  Palette,
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-animations";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  caseStudy: {
    challenge: string;
    solution: string;
    results: string[];
    technologies: string[];
    timeline: string;
    role: string;
  };
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
  featured: boolean;
}

const projects: Project[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory and AI recommendations.",
    longDescription: "Built a modern e-commerce platform from the ground up, featuring real-time inventory management, AI-powered product recommendations, and a seamless checkout experience. The platform handles thousands of concurrent users with sub-second response times.",
    thumbnail: "🛒",
    images: ["🛒", "💳", "📊"],
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Stripe"],
    demoUrl: "#",
    repoUrl: "#",
    caseStudy: {
      challenge: "The client needed a scalable e-commerce platform that could handle high traffic during sales events while providing personalized shopping experiences.",
      solution: "Implemented a microservices architecture with Next.js frontend, PostgreSQL for data persistence, Redis for caching, and machine learning models for recommendations.",
      results: [
        "50% increase in conversion rate",
        "99.9% uptime during peak traffic",
        "Sub-100ms page load times",
        "40% reduction in cart abandonment"
      ],
      technologies: ["Next.js 14", "TypeScript", "PostgreSQL", "Prisma", "Redis", "Stripe", "OpenAI API"],
      timeline: "3 months",
      role: "Full Stack Developer"
    },
    stats: { views: 12500, likes: 342, shares: 89 },
    featured: true
  },
  {
    id: "design-system",
    title: "Design System",
    description: "A comprehensive component library used across 20+ products.",
    longDescription: "Created a scalable design system from scratch, including 50+ reusable components, comprehensive documentation, and design tokens. Adopted by multiple teams across the organization.",
    thumbnail: "🎨",
    images: ["🎨", "📐", "🧩"],
    tags: ["React", "TypeScript", "Storybook", "Figma"],
    demoUrl: "#",
    repoUrl: "#",
    caseStudy: {
      challenge: "Multiple product teams were building inconsistent UIs, leading to poor user experience and duplicated effort.",
      solution: "Developed a unified design system with React components, design tokens, and comprehensive documentation using Storybook.",
      results: [
        "60% faster development time",
        "Consistent UX across products",
        "Adopted by 5 teams",
        "Reduced design debt by 80%"
      ],
      technologies: ["React", "TypeScript", "Storybook", "Tailwind CSS", "Figma", "Changesets"],
      timeline: "4 months",
      role: "Design System Lead"
    },
    stats: { views: 8900, likes: 567, shares: 234 },
    featured: true
  },
  {
    id: "ai-dashboard",
    title: "AI Analytics Dashboard",
    description: "Real-time data visualization platform with ML insights.",
    longDescription: "Built an analytics dashboard that processes millions of data points in real-time, providing actionable insights through machine learning models and intuitive visualizations.",
    thumbnail: "📊",
    images: ["📊", "🤖", "📈"],
    tags: ["React", "D3.js", "Python", "TensorFlow", "WebSocket"],
    demoUrl: "#",
    repoUrl: "#",
    caseStudy: {
      challenge: "Enterprise clients needed to make sense of massive datasets and get predictive insights for business decisions.",
      solution: "Created a real-time dashboard with D3.js visualizations, WebSocket connections for live data, and TensorFlow models for predictions.",
      results: [
        "Processing 1M+ events/day",
        "85% prediction accuracy",
        "Reduced report time by 90%",
        "Used by 500+ analysts"
      ],
      technologies: ["React", "D3.js", "Python", "FastAPI", "TensorFlow", "PostgreSQL", "WebSocket"],
      timeline: "5 months",
      role: "Frontend Lead"
    },
    stats: { views: 15200, likes: 423, shares: 156 },
    featured: false
  },
  {
    id: "social-app",
    title: "Social Platform",
    description: "A community platform with real-time features and content moderation.",
    longDescription: "Developed a social platform connecting professionals with real-time messaging, content sharing, and AI-powered content moderation.",
    thumbnail: "💬",
    images: ["💬", "👥", "🔒"],
    tags: ["React Native", "Node.js", "MongoDB", "Socket.io"],
    demoUrl: "#",
    repoUrl: "#",
    caseStudy: {
      challenge: "Building a safe, engaging social platform that scales to millions of users while maintaining content quality.",
      solution: "Implemented real-time features with Socket.io, AI moderation pipeline, and a React Native app for cross-platform support.",
      results: [
        "100K+ active users",
        "4.8 star app rating",
        "99.5% content safety score",
        "50% daily active rate"
      ],
      technologies: ["React Native", "Node.js", "MongoDB", "Socket.io", "TensorFlow.js", "AWS"],
      timeline: "6 months",
      role: "Full Stack Developer"
    },
    stats: { views: 22100, likes: 892, shares: 445 },
    featured: false
  }
];

export function ProjectShowcasePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState("all");

  const filteredProjects = filter === "all" 
    ? projects 
    : filter === "featured" 
      ? projects.filter(p => p.featured)
      : projects.filter(p => p.tags.includes(filter));

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Featured Work</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Project{" "}
            <span className="text-gradient-animated">Showcase</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of my best work, featuring detailed case studies, 
            technical deep-dives, and measurable results.
          </p>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal delay={0.1} className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {["all", "featured", ...allTags.slice(0, 5)].map((tag) => (
              <Button
                key={tag}
                variant={filter === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(tag)}
                className="capitalize"
              >
                {tag}
              </Button>
            ))}
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 0.1}>
              <motion.div
                layoutId={project.id}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden hover:border-primary/50 transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center relative overflow-hidden">
                    <motion.span 
                      className="text-8xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {project.thumbnail}
                    </motion.span>
                    
                    {project.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary">
                          <Eye className="w-4 h-4 mr-1" />
                          View Case Study
                        </Button>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {project.stats.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {project.stats.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                layoutId={selectedProject.id}
                className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-card border rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-card/95 backdrop-blur">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{selectedProject.thumbnail}</span>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                      <div className="flex gap-2 mt-1">
                        {selectedProject.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedProject.demoUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {selectedProject.repoUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => setSelectedProject(null)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Tabs */}
                  <div className="flex gap-2 mb-6 border-b">
                    {["overview", "case-study", "tech-stack"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <p className="text-lg">{selectedProject.longDescription}</p>
                        
                        <div className="grid grid-cols-3 gap-4">
                          {selectedProject.images.map((img, idx) => (
                            <div 
                              key={idx}
                              className="aspect-video bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-xl flex items-center justify-center text-6xl"
                            >
                              {img}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <Eye className="w-5 h-5 mx-auto mb-2 text-primary" />
                              <p className="text-2xl font-bold">{selectedProject.stats.views.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">Views</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <Heart className="w-5 h-5 mx-auto mb-2 text-red-500" />
                              <p className="text-2xl font-bold">{selectedProject.stats.likes}</p>
                              <p className="text-xs text-muted-foreground">Likes</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <Share2 className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                              <p className="text-2xl font-bold">{selectedProject.stats.shares}</p>
                              <p className="text-xs text-muted-foreground">Shares</p>
                            </CardContent>
                          </Card>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "case-study" && (
                      <motion.div
                        key="case-study"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-semibold mb-2">The Challenge</h3>
                          <p className="text-muted-foreground">{selectedProject.caseStudy.challenge}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">The Solution</h3>
                          <p className="text-muted-foreground">{selectedProject.caseStudy.solution}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">Key Results</h3>
                          <ul className="space-y-2">
                            {selectedProject.caseStudy.results.map((result, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span>{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-muted-foreground">Timeline</p>
                              <p className="font-semibold">{selectedProject.caseStudy.timeline}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-muted-foreground">My Role</p>
                              <p className="font-semibold">{selectedProject.caseStudy.role}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "tech-stack" && (
                      <motion.div
                        key="tech-stack"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.caseStudy.technologies.map((tech) => (
                            <Badge key={tech} className="text-sm py-1 px-3">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                            <CardContent className="p-6">
                              <Code2 className="w-8 h-8 text-blue-500 mb-4" />
                              <h4 className="font-semibold mb-2">Frontend</h4>
                              <p className="text-sm text-muted-foreground">
                                Modern React with TypeScript, server-side rendering, and optimized performance.
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                            <CardContent className="p-6">
                              <Layers className="w-8 h-8 text-green-500 mb-4" />
                              <h4 className="font-semibold mb-2">Backend</h4>
                              <p className="text-sm text-muted-foreground">
                                Scalable APIs, database design, and microservices architecture.
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                            <CardContent className="p-6">
                              <Palette className="w-8 h-8 text-purple-500 mb-4" />
                              <h4 className="font-semibold mb-2">Design</h4>
                              <p className="text-sm text-muted-foreground">
                                User-centered design with accessibility and responsive principles.
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10">
                            <CardContent className="p-6">
                              <Zap className="w-8 h-8 text-orange-500 mb-4" />
                              <h4 className="font-semibold mb-2">DevOps</h4>
                              <p className="text-sm text-muted-foreground">
                                CI/CD pipelines, automated testing, and cloud infrastructure.
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
