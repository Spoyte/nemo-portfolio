"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  Coffee, 
  Code2, 
  Music, 
  BookOpen, 
  Zap,
  MapPin,
  Clock,
  Target,
  Sparkles,
  Radio,
  Github,
  Terminal,
  Palette,
  Globe
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-animations";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const currentActivities = [
  {
    icon: Code2,
    title: "Building",
    description: "Working on a real-time collaborative code editor",
    status: "In Progress",
    progress: 65,
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Palette,
    title: "Designing",
    description: "Creating a new design system for a fintech startup",
    status: "Active",
    progress: 40,
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: BookOpen,
    title: "Learning",
    description: "Deep diving into WebAssembly and Rust",
    status: "Ongoing",
    progress: 25,
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Terminal,
    title: "Experimenting",
    description: "Building generative art algorithms with Canvas API",
    status: "Active",
    progress: 80,
    color: "from-orange-500 to-yellow-500"
  }
];

const currentStack = [
  { name: "Next.js 15", category: "Framework", color: "#000000" },
  { name: "TypeScript", category: "Language", color: "#3178C6" },
  { name: "Tailwind CSS", category: "Styling", color: "#06B6D4" },
  { name: "Framer Motion", category: "Animation", color: "#FF4D4D" },
  { name: "PostgreSQL", category: "Database", color: "#336791" },
  { name: "Redis", category: "Cache", color: "#DC382D" },
  { name: "Docker", category: "DevOps", color: "#2496ED" },
  { name: "Figma", category: "Design", color: "#F24E1E" }
];

const recentlyCompleted = [
  "Launched portfolio v2.0 with 20+ interactive features",
  "Published 3 technical articles on my blog",
  "Contributed to 2 open-source projects",
  "Completed AWS Solutions Architect certification"
];

const listeningTo = {
  title: "Midnight City",
  artist: "M83",
  album: "Hurry Up, We're Dreaming",
  isPlaying: true
};

const location = {
  city: "Shanghai",
  country: "China",
  timezone: "CST (UTC+8)",
  weather: "Clear, 18°C"
};

export default function NowPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-sm font-medium text-green-500">Currently Online</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            What I&apos;m{" "}
            <span className="text-gradient-animated">Doing Now</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A real-time snapshot of my current focus, projects, and interests. 
            Last updated: March 14, 2026.
          </p>
        </ScrollReveal>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <ScrollReveal delay={0.1}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">Location</span>
              </div>
              <p className="text-2xl font-bold mb-1">{location.city}</p>
              <p className="text-muted-foreground text-sm">{location.country}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{location.timezone}</span>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Music className="w-5 h-5 text-purple-500" />
                </div>
                <span className="font-medium">Now Playing</span>
              </div>
              <p className="text-2xl font-bold mb-1">{listeningTo.title}</p>
              <p className="text-muted-foreground text-sm">{listeningTo.artist}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-purple-500 rounded-full"
                        animate={{
                          height: [8, 16, 8],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">Playing now</span>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <span className="font-medium">Focus Mode</span>
              </div>
              <p className="text-2xl font-bold mb-1">Deep Work</p>
              <p className="text-muted-foreground text-sm">Building & Creating</p>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>High energy, creative flow</span>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Current Projects */}
        <ScrollReveal className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Current Projects</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {currentActivities.map((activity, index) => (
            <ScrollReveal key={activity.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl bg-card border border-border group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.color}`}>
                    <activity.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">{activity.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {activity.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{activity.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${activity.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full bg-gradient-to-r ${activity.color} rounded-full`}
                    />
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Tech Stack */}
        <ScrollReveal className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Current Stack</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {currentStack.map((tech, index) => (
            <ScrollReveal key={tech.name} delay={index * 0.05}>
              <motion.div
                whileHover={{ y: -3, scale: 1.05 }}
                className="p-4 rounded-xl bg-card border border-border text-center group cursor-pointer"
              >
                <div 
                  className="w-4 h-4 rounded-full mx-auto mb-3"
                  style={{ backgroundColor: tech.color }}
                />
                <p className="font-medium text-sm mb-1">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.category}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Recently Completed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScrollReveal>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Github className="w-5 h-5 text-green-500" />
                </div>
                <h2 className="text-xl font-bold">Recently Completed</h2>
              </div>
              <ul className="space-y-4">
                {recentlyCompleted.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Radio className="w-5 h-5 text-purple-500" />
                </div>
                <h2 className="text-xl font-bold">What&apos;s Next</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Launch a SaaS product for developers",
                  "Speak at a tech conference",
                  "Build an AI-powered creative tool",
                  "Start a YouTube channel for coding tutorials"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* Footer Note */}
        <ScrollReveal className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Inspired by <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nownownow.com</a>. 
            This page is a living document — it changes as my focus shifts.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
