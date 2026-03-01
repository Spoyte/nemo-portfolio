"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  Zap, 
  Palette,
  Music,
  Keyboard,
  MousePointer,
  Eye
} from "lucide-react";
import { Project3DCard } from "@/components/project-3d-card";
import { TypingSpeedChallenge } from "@/components/typing-speed-challenge";
import { ScrollReveal, StaggerContainer, StaggerItem, SpotlightCard } from "@/components/scroll-animations";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Layers,
    title: "3D Interactive Cards",
    description: "Tilt-responsive project cards with dynamic glare effects and smooth animations.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Keyboard,
    title: "Typing Challenge",
    description: "Test your typing speed with real-time WPM tracking and accuracy scoring.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Palette,
    title: "Theme Studio",
    description: "8 unique color themes including Midnight, Ocean, Forest, and Sunset.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Music,
    title: "Mini Music Player",
    description: "Floating music player with playlist, volume control, and visualizations.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: MousePointer,
    title: "Spotlight Effects",
    description: "Mouse-following spotlight that illuminates cards as you explore.",
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: Eye,
    title: "Scroll Animations",
    description: "Beautiful reveal animations triggered as you scroll through content.",
    color: "from-indigo-500 to-violet-500",
  },
];

const SAMPLE_PROJECTS = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory, AI recommendations, and seamless checkout experience.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    demoUrl: "#",
    repoUrl: "#",
    stars: 128,
    views: 3420,
    featured: true,
  },
  {
    title: "AI Dashboard",
    description: "Analytics dashboard with machine learning insights, data visualization, and predictive modeling.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    tags: ["React", "Python", "TensorFlow", "D3.js"],
    demoUrl: "#",
    repoUrl: "#",
    stars: 89,
    views: 2150,
  },
  {
    title: "Social Media App",
    description: "Real-time social platform with video streaming, stories, and end-to-end encrypted messaging.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
    tags: ["React Native", "Node.js", "Socket.io", "Redis"],
    demoUrl: "#",
    repoUrl: "#",
    stars: 256,
    views: 5890,
    featured: true,
  },
];

export default function NewFeaturesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">New Features</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Enhanced{" "}
            <span className="text-gradient-animated">Experience</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the latest interactive features, animations, and design improvements 
            that make this portfolio truly unique.
          </p>
        </ScrollReveal>

        {/* Features Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <SpotlightCard className="h-full">
                <div className="p-6 rounded-2xl bg-card border border-border h-full hover:border-primary/50 transition-colors group">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 3D Project Cards Section */}
        <ScrollReveal className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Layers className="h-4 w-4" />
              <span className="text-sm font-medium">3D Cards</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Interactive{" "}
              <span className="text-gradient">Project Showcase</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hover over these cards to see the 3D tilt effect with dynamic lighting. 
              Each card responds to your mouse movement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {SAMPLE_PROJECTS.map((project, index) => (
              <ScrollReveal key={project.title} delay={index * 0.1}>
                <Project3DCard {...project} />
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Typing Challenge Section */}
        <ScrollReveal className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Keyboard className="h-4 w-4" />
              <span className="text-sm font-medium">Interactive Game</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Typing Speed{" "}
              <span className="text-gradient">Challenge</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Test your typing skills! Type the displayed text as fast and accurately as possible. 
              Your high score is saved locally.
            </p>
          </div>

          <TypingSpeedChallenge />
        </ScrollReveal>

        {/* Spotlight Demo Section */}
        <ScrollReveal className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <MousePointer className="h-4 w-4" />
              <span className="text-sm font-medium">Spotlight Effect</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mouse-Following{" "}
              <span className="text-gradient">Spotlight</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Move your mouse over the cards below to see the spotlight effect in action. 
              It creates an engaging, interactive experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Real-time Collaboration",
                description: "Work together with your team in real-time. See changes instantly as they happen.",
                icon: Zap,
              },
              {
                title: "Smart Analytics",
                description: "Get insights into your data with AI-powered analytics and beautiful visualizations.",
                icon: Sparkles,
              },
            ].map((item) => (
              <SpotlightCard key={item.title} className="h-full">
                <div className="p-8 rounded-2xl bg-card border border-border h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </ScrollReveal>

        {/* Tech Stack */}
        <ScrollReveal>
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Built with Modern Tech</h2>
              <p className="text-muted-foreground">
                These features are powered by cutting-edge technologies
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Next.js 15",
                "React 19",
                "TypeScript",
                "Tailwind CSS",
                "Framer Motion",
                "shadcn/ui",
                "Canvas API",
                "Web Animations",
              ].map((tech) => (
                <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
