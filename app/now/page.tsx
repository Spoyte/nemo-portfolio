"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Code2, 
  BookOpen, 
  Music, 
  MapPin, 
  Coffee,
  Target,
  Lightbulb,
  Calendar,
  Clock
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-animations";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const CURRENT_PROJECTS = [
  {
    title: "AI-Powered Portfolio",
    description: "Building an intelligent portfolio with dynamic content generation",
    progress: 85,
    status: "In Progress",
    tech: ["Next.js", "OpenAI", "Tailwind"],
  },
  {
    title: "Open Source CLI Tool",
    description: "A developer productivity tool for automating workflows",
    progress: 60,
    status: "In Progress",
    tech: ["Rust", "TypeScript"],
  },
  {
    title: "Design System",
    description: "Comprehensive component library for enterprise applications",
    progress: 40,
    status: "Planning",
    tech: ["React", "Storybook", "Figma"],
  },
];

const LEARNING = [
  { subject: "Rust Programming", progress: 45 },
  { subject: "Machine Learning", progress: 30 },
  { subject: "System Design", progress: 60 },
];

const READING = [
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", progress: 75 },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", progress: 30 },
];

const CURRENTLY = {
  location: "Shanghai, China",
  weather: "Partly Cloudy, 22°C",
  listening: "Lo-fi Beats",
  coffee: "Cold Brew",
  focus: "Deep Work",
};

export default function NowPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Last updated: March 2026</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            What I&apos;m{" "}
            <span className="text-gradient-animated">Doing Now</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A snapshot of my current focus, projects, and interests. 
            Inspired by{" "}
            <a 
              href="https://nownownow.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Derek Sivers&apos; /now page
            </a>.
          </p>
        </ScrollReveal>

        {/* Status Card */}
        <ScrollReveal className="mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: MapPin, label: "Location", value: CURRENTLY.location },
                { icon: Music, label: "Listening", value: CURRENTLY.listening },
                { icon: Coffee, label: "Drinking", value: CURRENTLY.coffee },
                { icon: Target, label: "Focus", value: CURRENTLY.focus },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <item.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Current Projects */}
        <ScrollReveal className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Code2 className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">Current Projects</h2>
          </div>

          <div className="space-y-4">
            {CURRENT_PROJECTS.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-muted-foreground text-sm">{project.description}</p>
                  </div>
                  <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Learning & Reading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Learning */}
          <ScrollReveal>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Learning</h2>
              </div>

              <div className="space-y-4">
                {LEARNING.map((item) => (
                  <div key={item.subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.subject}</span>
                      <span className="text-muted-foreground">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Reading */}
          <ScrollReveal>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Reading</h2>
              </div>

              <div className="space-y-4">
                {READING.map((book) => (
                  <div key={book.title} className="border-l-2 border-primary/30 pl-4">
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                    <div className="mt-2">
                      <Progress value={book.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">{book.progress}% complete</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Goals */}
        <ScrollReveal>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">2026 Goals</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { goal: "Launch 3 side projects", done: true },
                { goal: "Contribute to 5 open source projects", done: false },
                { goal: "Write 12 technical blog posts", done: false },
                { goal: "Speak at 2 conferences", done: false },
                { goal: "Learn Rust proficiently", done: false },
                { goal: "Mentor junior developers", done: true },
              ].map((item) => (
                <div key={item.goal} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    item.done ? "bg-primary" : "border-2 border-muted-foreground/30"
                  }`}>
                    {item.done && <Sparkles className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className={item.done ? "line-through text-muted-foreground" : ""}>
                    {item.goal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Footer Note */}
        <ScrollReveal className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            This page is inspired by the{" "}
            <a 
              href="https://nownownow.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              /now page movement
            </a>
            . It represents my current focus and priorities.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
