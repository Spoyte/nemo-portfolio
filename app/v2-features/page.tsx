"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  Zap, 
  Palette,
  Music,
  Keyboard,
  MousePointer,
  Eye,
  Grid3X3,
  Timeline,
  Gem,
  Trophy,
  Wand2,
  Cpu
} from "lucide-react";
import { ParticleNetworkBackground } from "@/components/particle-network-background";
import { MatrixRainBackground } from "@/components/matrix-rain-background";
import { SkillConstellation } from "@/components/skill-constellation";
import { MorphingText } from "@/components/morphing-text";
import { ParallaxGallery } from "@/components/parallax-gallery";
import { SoundWaveVisualizer } from "@/components/sound-wave-visualizer";
import { InteractiveTimeline } from "@/components/interactive-timeline";
import { GlassmorphismGenerator } from "@/components/glassmorphism-generator";
import { HolographicCard } from "@/components/holographic-card";
import { ParticleBurstButton, ParticleTypeSelector } from "@/components/particle-burst-button";
import { GamificationPanel } from "@/components/gamification-panel";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animations";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FEATURES = [
  {
    icon: Grid3X3,
    title: "Particle Network",
    description: "Interactive particle system that responds to mouse movement with dynamic connections.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Cpu,
    title: "Matrix Rain",
    description: "Cyberpunk-inspired falling code animation with Japanese characters.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Layers,
    title: "Skill Constellation",
    description: "Floating skill nodes connected by dynamic lines, hover to interact.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Wand2,
    title: "Morphing Text",
    description: "Smooth text transitions with blur effects and gradient animations.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Eye,
    title: "Parallax Gallery",
    description: "Depth-based scrolling effects for immersive project showcases.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: Music,
    title: "Sound Visualizer",
    description: "Audio-reactive waveforms with real-time frequency analysis.",
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: Timeline,
    title: "Interactive Timeline",
    description: "Animated career timeline with scroll-triggered progress indicators.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Gem,
    title: "Glassmorphism Generator",
    description: "Interactive tool to create and customize glassmorphism effects.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "Holographic Cards",
    description: "3D cards with holographic shine effects and rarity-based styling.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Zap,
    title: "Particle Burst",
    description: "Clickable buttons with explosive particle effects in multiple styles.",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description: "Gamified progress tracking with unlockable achievements and rewards.",
    color: "from-yellow-400 to-yellow-600",
  },
];

const HOLOGRAPHIC_CARDS = [
  {
    title: "Project Alpha",
    description: "A revolutionary AI-powered platform that transforms how we interact with data.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop",
    rarity: "legendary" as const,
  },
  {
    title: "Project Beta",
    description: "Next-generation e-commerce solution with seamless checkout experience.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop",
    rarity: "epic" as const,
  },
  {
    title: "Project Gamma",
    description: "Social media dashboard with real-time analytics and insights.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop",
    rarity: "rare" as const,
  },
];

export default function V2FeaturesPage() {
  const [particleType, setParticleType] = useState<"sparkle" | "zap" | "flame" | "snow" | "leaf" | "star">("sparkle");
  const [activeBackground, setActiveBackground] = useState<"particles" | "matrix" | "none">("particles");

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      {/* Dynamic Background */}
      {activeBackground === "particles" && <ParticleNetworkBackground />}
      {activeBackground === "matrix" && <MatrixRainBackground />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <ScrollReveal className="text-center mb-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Portfolio v2.0</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Next-Level{" "}
            <span className="text-gradient-animated">Experience</span>
          </h1>

          <div className="text-2xl md:text-3xl text-muted-foreground mb-6 h-[1.5em]">
            Creative <MorphingText />
          </div>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore the latest interactive features, animations, and design innovations 
            that push the boundaries of web development.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge 
              variant={activeBackground === "particles" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setActiveBackground("particles")}
            >
              Particles
            </Badge>
            <Badge 
              variant={activeBackground === "matrix" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setActiveBackground("matrix")}
            >
              Matrix
            </Badge>
            <Badge 
              variant={activeBackground === "none" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setActiveBackground("none")}
            >
              None
            </Badge>
          </div>
        </ScrollReveal>

        {/* Features Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all group"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Interactive Tabs */}
        <Tabs defaultValue="skills" className="mb-24">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="glass">Glass</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="mt-8">
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Skill Constellation</h2>
                <p className="text-muted-foreground">
                  Interactive visualization of technical skills. Hover over nodes to explore.
                </p>
              </div>
              <SkillConstellation />
            </ScrollReveal>
          </TabsContent>

          <TabsContent value="timeline" className="mt-8">
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Journey Timeline</h2>
                <p className="text-muted-foreground">
                  Scroll through my professional journey with interactive animations.
                </p>
              </div>
              <InteractiveTimeline />
            </ScrollReveal>
          </TabsContent>

          <TabsContent value="gallery" className="mt-8">
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Parallax Project Gallery</h2>
                <p className="text-muted-foreground">
                  Projects showcased with depth-based parallax scrolling effects.
                </p>
              </div>
              <ParallaxGallery />
            </ScrollReveal>
          </TabsContent>

          <TabsContent value="audio" className="mt-8">
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Sound Wave Visualizer</h2>
                <p className="text-muted-foreground">
                  Real-time audio visualization with reactive waveforms.
                </p>
              </div>
              <SoundWaveVisualizer />
            </ScrollReveal>
          </TabsContent>

          <TabsContent value="glass" className="mt-8">
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Glassmorphism Generator</h2>
                <p className="text-muted-foreground">
                  Create and customize beautiful glassmorphism effects.
                </p>
              </div>
              <GlassmorphismGenerator />
            </ScrollReveal>
          </TabsContent>

          <TabsContent value="achievements" className="mt-8">
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Achievement System</h2>
                <p className="text-muted-foreground">
                  Gamified experience with unlockable achievements and progress tracking.
                </p>
              </div>
              <GamificationPanel />
            </ScrollReveal>
          </TabsContent>
        </Tabs>

        {/* Holographic Cards Section */}
        <ScrollReveal className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Gem className="h-4 w-4" />
              <span className="text-sm font-medium">Holographic Collection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured{" "}
              <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hover over these holographic cards to see the 3D tilt effect with dynamic shine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
            {HOLOGRAPHIC_CARDS.map((card, index) => (
              <ScrollReveal key={card.title} delay={index * 0.1}>
                <div className="flex justify-center">
                  <HolographicCard {...card} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Particle Burst Section */}
        <ScrollReveal className="mb-24">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Interactive Effects</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Particle{" "}
              <span className="text-gradient">Burst Buttons</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Click the buttons below to trigger explosive particle effects. Select different particle types!
            </p>

            <div className="flex justify-center mb-8">
              <ParticleTypeSelector value={particleType} onChange={setParticleType} />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <ParticleBurstButton particleType={particleType} size="lg">
                Click Me! ✨
              </ParticleBurstButton>
              <ParticleBurstButton particleType={particleType} variant="outline" size="lg">
                Burst Effect 🎉
              </ParticleBurstButton>
              <ParticleBurstButton particleType={particleType} variant="ghost" size="lg">
                Try This! 🚀
              </ParticleBurstButton>
            </div>
          </div>
        </ScrollReveal>

        {/* Tech Stack */}
        <ScrollReveal>
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Powered by Modern Tech</h2>
              <p className="text-muted-foreground">
                These features are built with cutting-edge technologies
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
                "Web Audio API",
                "WebGL",
                "CSS Houdini",
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
