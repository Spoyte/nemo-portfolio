"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Code2,
  Palette,
  Zap,
  Globe,
  Database,
  Cpu,
  Layers,
  Terminal,
  GitBranch,
  Star,
  ExternalLink,
  Github,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HolographicCard, NeonButton } from "@/components/holographic-effects";
import Link from "next/link";

const projects = [
  {
    id: "saas-platform",
    title: "SaaS Platform",
    description: "A comprehensive project management tool for remote teams with real-time collaboration features.",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "WebSockets"],
    features: ["Real-time collaboration", "Kanban boards", "Time tracking", "Team analytics"],
    github: "https://github.com/nemodev/saas-platform",
    demo: "https://saas-demo.nemo.dev",
    status: "live",
  },
  {
    id: "ai-chat",
    title: "AI Chat Interface",
    description: "A beautiful chat interface for AI models with markdown support and code highlighting.",
    icon: Code2,
    color: "from-purple-500 to-pink-500",
    tech: ["React", "TypeScript", "OpenAI API", "Tailwind CSS"],
    features: ["Streaming responses", "Code blocks", "File uploads", "Conversation history"],
    github: "https://github.com/nemodev/ai-chat",
    demo: "https://ai-chat.nemo.dev",
    status: "live",
  },
  {
    id: "design-system",
    title: "Design System",
    description: "A comprehensive design system with 50+ components, tokens, and documentation.",
    icon: Palette,
    color: "from-orange-500 to-red-500",
    tech: ["React", "TypeScript", "Storybook", "Figma API"],
    features: ["50+ components", "Dark mode", "Accessibility", "Figma sync"],
    github: "https://github.com/nemodev/design-system",
    demo: "https://design-system.nemo.dev",
    status: "live",
  },
  {
    id: "cli-tool",
    title: "Dev CLI Tool",
    description: "A command-line utility for automating daily development tasks and workflows.",
    icon: Terminal,
    color: "from-green-500 to-emerald-500",
    tech: ["Rust", "Clap", "Tokio", "Serde"],
    features: ["Project scaffolding", "Git automation", "Deployment", "Task runner"],
    github: "https://github.com/nemodev/dev-cli",
    demo: null,
    status: "opensource",
  },
  {
    id: "browser-extension",
    title: "Tab Manager Pro",
    description: "A productivity browser extension for managing tabs and sessions efficiently.",
    icon: Layers,
    color: "from-yellow-500 to-amber-500",
    tech: ["TypeScript", "Plasmo", "Chrome API", "React"],
    features: ["Session management", "Tab grouping", "Search", "Cloud sync"],
    github: "https://github.com/nemodev/tab-manager",
    demo: "https://chrome.google.com/webstore",
    status: "live",
  },
  {
    id: "data-visualizer",
    title: "Data Visualizer",
    description: "Interactive data visualization dashboard with real-time updates and charts.",
    icon: Database,
    color: "from-indigo-500 to-violet-500",
    tech: ["D3.js", "React", "WebSocket", "Node.js"],
    features: ["Real-time charts", "Custom dashboards", "Data export", "Alerts"],
    github: "https://github.com/nemodev/data-viz",
    demo: "https://data-viz.nemo.dev",
    status: "beta",
  },
];

const stats = {
  totalProjects: 47,
  githubStars: 1289,
  npmDownloads: "50K+",
  contributions: 234,
};

export default function ProjectsShowcasePage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Featured Work</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Project Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of my best work. Each project represents a unique challenge 
            and an opportunity to learn something new.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Projects", value: stats.totalProjects, icon: Rocket },
            { label: "GitHub Stars", value: stats.githubStars, icon: Star },
            { label: "NPM Downloads", value: stats.npmDownloads, icon: Globe },
            { label: "Contributions", value: stats.contributions, icon: GitBranch },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <HolographicCard className="h-full" intensity={0.2}>
                <Card className="h-full border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${project.color}`}
                        >
                          <project.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge
                              variant={
                                project.status === "live"
                                  ? "default"
                                  : project.status === "beta"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{project.description}</p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Key Features:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {project.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <Github className="h-4 w-4" />
                          Code
                        </a>
                      </Button>
                      {project.demo && (
                        <Button size="sm" asChild>
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </HolographicCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Want to see more?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Check out my GitHub for more projects, experiments, and open source contributions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <NeonButton color="red">
                  <a
                    href="https://github.com/nemodev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    View GitHub
                  </a>
                </NeonButton>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    Let&apos;s Collaborate
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
