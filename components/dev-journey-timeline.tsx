"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Star,
  Zap,
  Globe,
  Heart,
  Sparkles,
  ChevronRight,
  Calendar
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-animations";

interface JourneyEvent {
  id: string;
  year: string;
  month: string;
  title: string;
  description: string;
  type: "milestone" | "project" | "learning" | "career" | "award";
  icon: React.ElementType;
  color: string;
  details: string[];
  stats?: { label: string; value: string }[];
}

const journeyEvents: JourneyEvent[] = [
  {
    id: "1",
    year: "2021",
    month: "Jan",
    title: "The Beginning",
    description: "Started my coding journey with HTML & CSS, building my first static websites.",
    type: "learning",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    details: [
      "Learned HTML5 semantic markup",
      "Mastered CSS3 and Flexbox",
      "Built 10+ practice projects",
      "Joined online coding communities"
    ],
    stats: [
      { label: "Projects", value: "12" },
      { label: "Hours", value: "500+" }
    ]
  },
  {
    id: "2",
    year: "2021",
    month: "Jun",
    title: "JavaScript Discovery",
    description: "Fell in love with JavaScript and started building interactive web applications.",
    type: "learning",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    details: [
      "ES6+ modern JavaScript",
      "DOM manipulation mastery",
      "Async programming concepts",
      "First interactive apps"
    ],
    stats: [
      { label: "Repos", value: "8" },
      { label: "Commits", value: "200+" }
    ]
  },
  {
    id: "3",
    year: "2022",
    month: "Mar",
    title: "React & Modern Stack",
    description: "Transitioned to React and modern frontend development with TypeScript.",
    type: "learning",
    icon: Rocket,
    color: "from-purple-500 to-pink-500",
    details: [
      "React hooks and patterns",
      "TypeScript adoption",
      "State management with Redux",
      "Component architecture"
    ],
    stats: [
      { label: "Components", value: "100+" },
      { label: "Apps", value: "5" }
    ]
  },
  {
    id: "4",
    year: "2022",
    month: "Sep",
    title: "First Freelance Client",
    description: "Landed my first paid project - a complete website redesign for a local business.",
    type: "career",
    icon: Briefcase,
    color: "from-green-500 to-emerald-500",
    details: [
      "Client communication skills",
      "Project management basics",
      "Delivered on time & budget",
      "5-star client review"
    ],
    stats: [
      { label: "Revenue", value: "$2K" },
      { label: "Rating", value: "5★" }
    ]
  },
  {
    id: "5",
    year: "2023",
    month: "Jan",
    title: "Full Stack Expansion",
    description: "Expanded into backend development with Node.js, databases, and APIs.",
    type: "learning",
    icon: Globe,
    color: "from-indigo-500 to-violet-500",
    details: [
      "Node.js & Express",
      "PostgreSQL & MongoDB",
      "RESTful API design",
      "Authentication & security"
    ],
    stats: [
      { label: "APIs", value: "15+" },
      { label: "Endpoints", value: "100+" }
    ]
  },
  {
    id: "6",
    year: "2023",
    month: "Jun",
    title: "Open Source Contributor",
    description: "Started contributing to open source projects and building a developer community presence.",
    type: "milestone",
    icon: Heart,
    color: "from-rose-500 to-red-500",
    details: [
      "First PR merged",
      "Documentation contributions",
      "Bug fixes and features",
      "Community engagement"
    ],
    stats: [
      { label: "PRs", value: "25+" },
      { label: "Stars", value: "100+" }
    ]
  },
  {
    id: "7",
    year: "2023",
    month: "Dec",
    title: "Hackathon Winner",
    description: "Won first place in a regional hackathon with an innovative AI-powered application.",
    type: "award",
    icon: Award,
    color: "from-amber-500 to-yellow-500",
    details: [
      "48-hour coding challenge",
      "Team leadership",
      "AI integration",
      "Pitch presentation"
    ],
    stats: [
      { label: "Prize", value: "$5K" },
      { label: "Team", value: "4" }
    ]
  },
  {
    id: "8",
    year: "2024",
    month: "Mar",
    title: "Senior Developer Role",
    description: "Promoted to Senior Frontend Developer, leading a team of 5 developers.",
    type: "career",
    icon: Star,
    color: "from-teal-500 to-cyan-500",
    details: [
      "Technical leadership",
      "Code review & mentoring",
      "Architecture decisions",
      "Cross-functional collaboration"
    ],
    stats: [
      { label: "Team Size", value: "5" },
      { label: "Projects", value: "8" }
    ]
  },
  {
    id: "9",
    year: "2024",
    month: "Sep",
    title: "Generative Art Journey",
    description: "Started exploring creative coding and generative art with Canvas and WebGL.",
    type: "learning",
    icon: Sparkles,
    color: "from-fuchsia-500 to-purple-500",
    details: [
      "Canvas API mastery",
      "WebGL & Shaders",
      "Mathematical art",
      "50+ art pieces created"
    ],
    stats: [
      { label: "Artworks", value: "50+" },
      { label: "Exhibits", value: "3" }
    ]
  },
  {
    id: "10",
    year: "2025",
    month: "Present",
    title: "Building the Future",
    description: "Continuing to push boundaries with AI integration, creative coding, and innovative web experiences.",
    type: "milestone",
    icon: Rocket,
    color: "from-primary to-orange-500",
    details: [
      "AI-powered applications",
      "Creative coding portfolio",
      "Mentoring developers",
      "Speaking at conferences"
    ],
    stats: [
      { label: "Experience", value: "4+ yrs" },
      { label: "Impact", value: "∞" }
    ]
  }
];

const typeColors = {
  milestone: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  project: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  learning: "bg-green-500/20 text-green-500 border-green-500/30",
  career: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  award: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
};

function JourneyCard({ event, index, isActive, onClick }: { 
  event: JourneyEvent; 
  index: number; 
  isActive: boolean;
  onClick: () => void;
}) {
  const isEven = index % 2 === 0;
  const Icon = event.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center gap-8 ${isEven ? "flex-row" : "flex-row-reverse"} mb-16`}
    >
      {/* Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-border via-primary/50 to-border -translate-x-1/2 hidden lg:block" />
      
      {/* Content Card */}
      <div className={`flex-1 ${isEven ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:text-left"}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={onClick}
          className={`relative p-6 rounded-2xl bg-card border border-border cursor-pointer transition-all duration-300 ${
            isActive ? "border-primary/50 shadow-lg shadow-primary/10" : "hover:border-primary/30"
          }`}
        >
          {/* Date Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${typeColors[event.type]}`}>
            <Calendar className="w-3 h-3" />
            {event.month} {event.year}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
          
          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4">{event.description}</p>

          {/* Expandable Details */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className={`pt-4 border-t border-border ${isEven ? "lg:text-right" : "lg:text-left"}`}>
                  <ul className={`space-y-2 mb-4 ${isEven ? "lg:items-end" : "lg:items-start"} flex flex-col`}>
                    {event.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        {!isEven && <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />}
                        <span>{detail}</span>
                        {isEven && <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 rotate-180" />}
                      </motion.li>
                    ))}
                  </ul>

                  {event.stats && (
                    <div className={`flex gap-4 ${isEven ? "lg:justify-end" : "lg:justify-start"}`}>
                      {event.stats.map((stat, i) => (
                        <div key={i} className="text-center">
                          <p className="text-2xl font-bold text-primary">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click Hint */}
          {!isActive && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-muted-foreground">Click to expand</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Center Icon */}
      <div className="relative z-10 hidden lg:flex">
        <motion.div
          whileHover={{ scale: 1.2, rotate: 10 }}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>
        
        {/* Pulse Effect */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${event.color}`}
        />
      </div>

      {/* Spacer for alternating layout */}
      <div className="flex-1 hidden lg:block" />
    </motion.div>
  );
}

export function DevJourneyTimeline() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-medium">My Journey</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            From <span className="text-gradient-animated">Curious</span> to{" "}
            <span className="text-gradient-animated">Creator</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every line of code tells a story. Here&apos;s my path from writing my first HTML tag to building complex applications.
          </p>
        </ScrollReveal>

        {/* Progress Line (Mobile) */}
        <div className="lg:hidden fixed left-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-muted rounded-full overflow-hidden z-50">
          <motion.div 
            className="w-full bg-primary rounded-full"
            style={{ height: lineHeight }}
          />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-muted rounded-full -translate-x-1/2 overflow-hidden">
            <motion.div 
              className="w-full bg-gradient-to-b from-primary to-orange-500 rounded-full"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Events */}
          <div className="space-y-8">
            {journeyEvents.map((event, index) => (
              <JourneyCard
                key={event.id}
                event={event}
                index={index}
                isActive={activeIndex === index}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <ScrollReveal className="mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Years Coding", value: "4+", icon: Calendar },
              { label: "Projects Built", value: "50+", icon: Rocket },
              { label: "Technologies", value: "25+", icon: Code2 },
              { label: "Coffee Consumed", value: "∞", icon: Sparkles },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-3 text-primary" />
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Want to be part of the next chapter?</p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Let&apos;s Create Together
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  );
}
