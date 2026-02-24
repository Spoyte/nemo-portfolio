"use client";

import { motion } from "framer-motion";
import { ConstellationBackground } from "@/components/constellation-background";
import { KineticHero } from "@/components/kinetic-hero";
import { DynamicThemeGenerator } from "@/components/dynamic-theme-generator";
import { SoundVisualizer } from "@/components/sound-visualizer";
import { DynamicResumeBuilder } from "@/components/dynamic-resume-builder";
import { GitHubContributionArt } from "@/components/github-contribution-art";
import { Reveal } from "@/components/page-transitions";
import { TiltCard } from "@/components/tilt-card";
import { 
  Sparkles, 
  Palette, 
  Music, 
  FileText, 
  Github,
  ArrowRight,
  Wand2,
  Zap,
  Layers
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const experiments = [
  {
    id: "constellation",
    title: "Constellation Network",
    description: "Interactive particle system that responds to mouse movement. Particles connect to form a dynamic network.",
    icon: Sparkles,
    component: ConstellationBackground,
    fullPage: true,
  },
  {
    id: "kinetic",
    title: "Kinetic Typography",
    description: "3D text that reacts to cursor position with physics-based animations.",
    icon: Zap,
    component: KineticHero,
  },
  {
    id: "theme",
    title: "Dynamic Theme Generator",
    description: "AI-powered color palette generator with mood-based and custom hue options.",
    icon: Palette,
    component: DynamicThemeGenerator,
  },
  {
    id: "visualizer",
    title: "Sound Visualizer",
    description: "Audio-reactive visualization using Web Audio API. Enable microphone or use demo mode.",
    icon: Music,
    component: SoundVisualizer,
  },
  {
    id: "resume",
    title: "Dynamic Resume Builder",
    description: "Customize and export your resume with live preview. Toggle sections on/off.",
    icon: FileText,
    component: DynamicResumeBuilder,
  },
  {
    id: "github",
    title: "GitHub Contribution Art",
    description: "Generate pixel art patterns for your GitHub contribution graph.",
    icon: Github,
    component: GitHubContributionArt,
  },
];

export default function ExperimentsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Wand2 className="h-4 w-4" />
              <span className="text-sm font-medium">Interactive Experiments</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Playground of
              <span className="text-gradient-animated"> Possibilities</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of interactive experiments, creative coding projects, and unique web experiences.
              Each one explores different aspects of modern web development.
            </p>
          </Reveal>

          {/* Experiment Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {experiments.map((exp, index) => (
              <Reveal key={exp.id} delay={index * 0.1}>
                <TiltCard tiltAmount={4}>
                  <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <exp.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground">{exp.description}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <exp.component />
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center p-12 rounded-3xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/10"
            >
              <Layers className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Want to see more?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Check out the full playground for more interactive demos, 
                3D visualizations, and AI-powered tools.
              </p>
              <Link href="/playground">
                <Button size="lg" className="group">
                  Visit Playground
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
