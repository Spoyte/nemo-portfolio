"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  GitCommit, 
  GitBranch, 
  Star, 
  Zap,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Sparkles,
  Rocket,
  Code2,
  Palette,
  Terminal,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "milestone" | "project" | "learning" | "achievement";
  icon: React.ElementType;
  color: string;
  details?: string[];
  stats?: { label: string; value: string }[];
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    date: "2026-03",
    title: "Portfolio V3 Launch",
    description: "Launched the third major version of my portfolio with immersive 3D experiences, AI art generation, and voice navigation.",
    type: "milestone",
    icon: Rocket,
    color: "from-purple-500 to-pink-500",
    details: [
      "Added Three.js 3D experiences",
      "Implemented AI-powered art generation",
      "Voice navigation with speech recognition",
      "Real-time shader editing studio",
    ],
    stats: [
      { label: "Components", value: "100+" },
      { label: "Pages", value: "50+" },
      { label: "Features", value: "200+" },
    ],
  },
  {
    id: "2",
    date: "2026-02",
    title: "Interactive Features Explosion",
    description: "Added dozens of interactive features including games, animations, and developer tools.",
    type: "project",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    details: [
      "Matrix Rain visualizer",
      "Typing Race game",
      "Code Evolution Theater",
      "Developer Focus Mode",
    ],
  },
  {
    id: "3",
    date: "2026-01",
    title: "Open Source Contributions",
    description: "Started contributing to open source projects and building in public.",
    type: "achievement",
    icon: Star,
    color: "from-green-500 to-emerald-500",
    details: [
      "First PR merged in major project",
      "Created useful dev tools",
      "Built community following",
    ],
  },
  {
    id: "4",
    date: "2025-12",
    title: "Full Stack Mastery",
    description: "Deepened expertise in full-stack development with Next.js, PostgreSQL, and cloud services.",
    type: "learning",
    icon: Layers,
    color: "from-blue-500 to-cyan-500",
    details: [
      "Advanced Next.js patterns",
      "Database design & optimization",
      "Serverless architecture",
      "Performance tuning",
    ],
  },
  {
    id: "5",
    date: "2025-10",
    title: "First Client Project",
    description: "Delivered first professional client project as a freelance developer.",
    type: "milestone",
    icon: Trophy,
    color: "from-red-500 to-pink-500",
    details: [
      "E-commerce platform",
      "Custom CMS integration",
      "Payment processing",
      "100% client satisfaction",
    ],
  },
  {
    id: "6",
    date: "2025-08",
    title: "Design System Creation",
    description: "Built a comprehensive design system with components, tokens, and documentation.",
    type: "project",
    icon: Palette,
    color: "from-violet-500 to-purple-500",
    details: [
      "50+ reusable components",
      "Design tokens architecture",
      "Storybook documentation",
      "Accessibility-first approach",
    ],
  },
  {
    id: "7",
    date: "2025-06",
    title: "TypeScript Deep Dive",
    description: "Mastered TypeScript and implemented strict typing across all projects.",
    type: "learning",
    icon: Code2,
    color: "from-cyan-500 to-blue-500",
    details: [
      "Advanced type patterns",
      "Generic programming",
      "Type-safe APIs",
      "Custom utility types",
    ],
  },
  {
    id: "8",
    date: "2025-04",
    title: "Portfolio V2",
    description: "Redesigned portfolio with modern animations and interactive elements.",
    type: "milestone",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    details: [
      "Framer Motion animations",
      "Dark mode support",
      "Responsive design",
      "Performance optimized",
    ],
  },
  {
    id: "9",
    date: "2025-02",
    title: "React Mastery",
    description: "Advanced React skills including hooks, patterns, and performance optimization.",
    type: "learning",
    icon: Terminal,
    color: "from-indigo-500 to-purple-500",
    details: [
      "Custom hooks library",
      "State management patterns",
      "Performance optimization",
      "Testing strategies",
    ],
  },
  {
    id: "10",
    date: "2025-01",
    title: "The Beginning",
    description: "Started my journey as a developer, learning HTML, CSS, and JavaScript.",
    type: "milestone",
    icon: GitCommit,
    color: "from-orange-500 to-amber-500",
    details: [
      "First HTML page",
      "CSS fundamentals",
      "JavaScript basics",
      "Built first projects",
    ],
  },
];

const typeLabels = {
  milestone: { label: "Milestone", color: "bg-purple-500/20 text-purple-500" },
  project: { label: "Project", color: "bg-blue-500/20 text-blue-500" },
  learning: { label: "Learning", color: "bg-green-500/20 text-green-500" },
  achievement: { label: "Achievement", color: "bg-yellow-500/20 text-yellow-500" },
};

export function ProjectTimeMachine() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");

  const handleNext = () => {
    if (currentIndex < timelineEvents.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentEvent = timelineEvents[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Project Time Machine</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Journey Through{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Time
            </span>
          </h1>
          
          <p className="text-white/60 max-w-2xl mx-auto">
            Explore the evolution of my work, from the first line of code to the latest innovations.
            Each milestone represents growth, learning, and new possibilities.
          </p>
        </motion.div>

        {/* View Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            onClick={() => setViewMode("timeline")}
            className={viewMode === "timeline" ? "" : "border-white/20 text-white hover:bg-white/10"}
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "" : "border-white/20 text-white hover:bg-white/10"}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Grid
          </Button>
        </div>

        {/* Timeline View */}
        <AnimatePresence mode="wait">
          {viewMode === "timeline" ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-pink-500/50 to-cyan-500/50 hidden md:block" />

              {/* Events */}
              <div className="space-y-12">
                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-center gap-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedEvent(event)}
                        className="glass rounded-2xl p-6 cursor-pointer group hover:border-purple-500/50 transition-colors"
                      >
                        <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                          <Badge className={typeLabels[event.type].color}>
                            {typeLabels[event.type].label}
                          </Badge>
                          <span className="text-sm text-white/50">{event.date}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                          {event.title}
                        </h3>
                        
                        <p className="text-white/60 text-sm mb-4">{event.description}</p>
                        
                        <div className={`flex items-center gap-2 text-purple-400 text-sm ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Center Icon */}
                    <div className="hidden md:flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg shadow-purple-500/20 z-10`}
                      >
                        <event.icon className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedEvent(event)}
                  className="glass rounded-2xl p-6 cursor-pointer group hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center`}>
                      <event.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={typeLabels[event.type].color}>
                      {typeLabels[event.type].label}
                    </Badge>
                  </div>
                  
                  <span className="text-sm text-white/50 block mb-2">{event.date}</span>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-white/60 text-sm line-clamp-2">{event.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Detail Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="glass-strong rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedEvent.color} flex items-center justify-center`}>
                      <selectedEvent.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <Badge className={typeLabels[selectedEvent.type].color + " mb-2"}>
                        {typeLabels[selectedEvent.type].label}
                      </Badge>
                      <h2 className="text-2xl font-bold text-white">{selectedEvent.title}</h2>
                      <span className="text-white/50">{selectedEvent.date}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedEvent(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>

                <p className="text-white/80 mb-6">{selectedEvent.description}</p>

                {selectedEvent.details && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white/60 mb-3">Key Highlights</h3>
                    <ul className="space-y-2">
                      {selectedEvent.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEvent.stats && (
                  <div>
                    <h3 className="text-sm font-semibold text-white/60 mb-3">Stats</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedEvent.stats.map((stat, i) => (
                        <div key={i} className="text-center p-4 rounded-xl bg-white/5">
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className="text-xs text-white/50">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Events", value: timelineEvents.length.toString(), icon: Clock },
            { label: "Projects", value: timelineEvents.filter(e => e.type === "project").length.toString(), icon: Rocket },
            { label: "Milestones", value: timelineEvents.filter(e => e.type === "milestone").length.toString(), icon: Trophy },
            { label: "Learnings", value: timelineEvents.filter(e => e.type === "learning").length.toString(), icon: Star },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center">
              <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
