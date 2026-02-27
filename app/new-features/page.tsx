"use client";

import { motion } from "framer-motion";
import { HolographicBusinessCard } from "@/components/holographic-business-card";
import { MemoryMatchGame } from "@/components/memory-match-game";
import { DeveloperProductivityDashboard } from "@/components/developer-productivity";
import { CodeRhythmVisualizer } from "@/components/code-rhythm-visualizer";
import { Sparkles, Gamepad2, BarChart3, Music } from "lucide-react";

const sections = [
  {
    id: "business-card",
    title: "Holographic Business Card",
    description: "An interactive 3D business card with holographic effects. Hover to see the shine, click to flip.",
    icon: Sparkles,
    component: HolographicBusinessCard,
  },
  {
    id: "memory-game",
    title: "Tech Stack Memory Match",
    description: "Test your memory by matching tech stack pairs. How fast can you complete it?",
    icon: Gamepad2,
    component: MemoryMatchGame,
  },
  {
    id: "productivity",
    title: "Developer Productivity Dashboard",
    description: "Track your daily tasks, build streaks, and level up your productivity.",
    icon: BarChart3,
    component: DeveloperProductivityDashboard,
  },
  {
    id: "rhythm",
    title: "Code Rhythm Visualizer",
    description: "Watch code come alive with this audio-reactive visualization.",
    icon: Music,
    component: CodeRhythmVisualizer,
  },
];

export default function NewFeaturesPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            New <span className="text-gradient-animated">Features</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the latest additions to the portfolio. Interactive experiences, games, and productivity tools.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-24">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="scroll-mt-24"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{section.title}</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {section.description}
                </p>
              </div>

              <div className="bg-card/50 rounded-3xl border border-border/50 p-6 md:p-8">
                <section.component />
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
