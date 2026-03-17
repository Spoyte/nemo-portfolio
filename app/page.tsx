"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Palette, 
  Zap,
  Layers,
  Gamepad2,
  Trophy,
  Target,
  Briefcase,
  Rocket,
  Terminal,
  Coffee,
  BookOpen,
  Bookmark,
  Quote,
  FileCode,
  Beaker,
  BarChart3,
  Brain,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedVisitorCounter } from "@/components/enhanced-visitor-counter";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FeaturedProjects } from "@/components/featured-projects";
import { ScrollReveal, Counter, SpotlightCard } from "@/components/scroll-animations";
import { Badge } from "@/components/ui/badge";
import { SkillsVisualization } from "@/components/skills-visualization";
import { ContactForm } from "@/components/contact-form";
import { ProjectShowcase3D } from "@/components/project-showcase-3d";
import { LiveCodingDemo } from "@/components/live-coding-demo";
import { CaseStudiesSection } from "@/components/case-studies-section";
import { InteractiveResume } from "@/components/interactive-resume";
import { AchievementShowcase } from "@/components/achievement-showcase";
import { AchievementShowcaseEnhanced } from "@/components/achievement-showcase-enhanced";
import { DailyChallenges } from "@/components/daily-challenges";
import { IdeaGeneratorSection } from "@/components/idea-generator-section";
import { SoundboardSection } from "@/components/soundboard-section";
import { EnhancedHero } from "@/components/enhanced-hero";
import { QuoteWall } from "@/components/quote-wall";
import { AnimatedSkillsChart } from "@/components/animated-skills-chart";
import { MorphingBlobHero } from "@/components/morphing-blob-hero";
import { HolographicProjectCards } from "@/components/holographic-project-cards";
import { Keyboard, Volume2 } from "lucide-react";
import { CodeTimeCapsule } from "@/components/code-time-capsule";
import { DeveloperHoroscope } from "@/components/developer-horoscope";
import { PairProgrammingSimulator } from "@/components/pair-programming-simulator";
import { BugBountyGame } from "@/components/bug-bounty-game";
import { CodeEvolutionTheater } from "@/components/code-evolution-theater";
import { CreativeCodingPlayground } from "@/components/creative-coding-playground";
import { GamifiedPortfolio } from "@/components/gamified-portfolio";
import { AICompanion } from "@/components/ai-companion";
import { AIChatAssistant } from "@/components/ai-chat-assistant";
import { DeveloperFocusMode } from "@/components/developer-focus-mode";
import { ApiPlayground } from "@/components/api-playground";
import { DesignTokenStudio } from "@/components/design-token-studio";
import { CodeCompareTool } from "@/components/code-compare-tool";
import { CodeTypingCinema } from "@/components/code-typing-cinema";
import { GitCompare, Type, Palette, Terminal, Brain, Clock, Box, Mic, Atom, Eye } from "lucide-react";
import { Immersive3DHero } from "@/components/immersive-3d-hero";
import { AIArtGenerator } from "@/components/ai-art-generator";
import { VoiceInterface } from "@/components/voice-interface";
import { PhysicsPlayground } from "@/components/physics-playground";
import { ShaderStudio } from "@/components/shader-studio";
import { CodeSymphony } from "@/components/code-symphony";
import { NeuralNetworkVisualizer } from "@/components/neural-network-visualizer";
import { TimeTravelDebugger } from "@/components/time-travel-debugger";
import { CollaborativeCanvas } from "@/components/collaborative-canvas";
import { Music, Network, Bug, Users } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Clean Code",
    description: "Writing maintainable, scalable code with best practices and modern patterns.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Thoughtful Design",
    description: "Creating beautiful interfaces that balance aesthetics with functionality.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Performance First",
    description: "Optimizing for speed and efficiency without compromising user experience.",
    color: "from-orange-500 to-yellow-500",
  },
];

const techStack = [
  { name: "React", color: "#61DAFB", icon: "⚛️" },
  { name: "Next.js", color: "#000000", icon: "▲" },
  { name: "TypeScript", color: "#3178C6", icon: "📘" },
  { name: "Tailwind", color: "#06B6D4", icon: "🌊" },
  { name: "Node.js", color: "#339933", icon: "🟢" },
  { name: "PostgreSQL", color: "#336791", icon: "🐘" },
  { name: "GraphQL", color: "#E10098", icon: "◈" },
  { name: "Docker", color: "#2496ED", icon: "🐳" },
];

export default function Home() {
  return (
    <>
      {/* New Morphing Blob Hero */}
      <MorphingBlobHero />

      {/* Holographic Project Cards */}
      <HolographicProjectCards />

      {/* Enhanced Hero Section */}
      <EnhancedHero />

      {/* Features Section */}
      <section className="py-24 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">What I Do</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Skills &{" "}
              <span className="text-gradient-animated">Expertise</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combining technical expertise with creative thinking to deliver exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />
                
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Features Preview */}
      <section className="py-24 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Rocket className="h-4 w-4" />
              <span className="text-sm font-medium">Just Added</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              New{" "}
              <span className="text-gradient-animated">Interactive Features</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the latest additions to my portfolio, from 3D cards to mini games.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <SpotlightCard className="h-full">
                <Link href="/matrix-rain" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Terminal className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Matrix Rain</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Interactive Matrix-style digital rain with customizable colors and effects.
                  </p>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">New →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <SpotlightCard className="h-full">
                <Link href="/code-evolution" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Code Evolution</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Watch code evolve from simple to production-ready with step-by-step explanations.
                  </p>
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500">New →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <SpotlightCard className="h-full">
                <Link href="/creative-coding" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Creative Coding</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Experiment with generative art and live code editing playground.
                  </p>
                  <Badge variant="outline" className="bg-pink-500/10 text-pink-500">New →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <SpotlightCard className="h-full">
                <Link href="/now" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Now Page</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Real-time snapshot of what I'm working on, learning, and enjoying.
                  </p>
                  <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500">New →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* NEW V3 FEATURES - Major Additions */}
      <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-purple-950/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Version 3.0</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Next-Level{" "}
              <span className="text-gradient-animated">Experiences</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pushing the boundaries of what's possible on the web with immersive 3D, 
              AI-powered creativity, voice control, physics simulations, and real-time shaders.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollReveal delay={0.1}>
              <SpotlightCard className="h-full">
                <Link href="/immersive-3d" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-purple-500/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Box className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Immersive 3D</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Three.js-powered interactive 3D world with floating shapes, particles, and easter eggs.
                  </p>
                  <Badge variant="outline" className="bg-violet-500/10 text-violet-500">Three.js →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <SpotlightCard className="h-full">
                <Link href="/ai-art" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-pink-500/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI Art Generator</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Create unique generative art with AI-powered algorithms. Customize styles and parameters.
                  </p>
                  <Badge variant="outline" className="bg-pink-500/10 text-pink-500">AI Powered →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <SpotlightCard className="h-full">
                <Link href="/physics" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-indigo-500/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Atom className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Physics Playground</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Interactive physics simulation powered by Matter.js. Spawn shapes and watch them interact.
                  </p>
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500">Physics →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <SpotlightCard className="h-full">
                <Link href="/shader-studio" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-cyan-500/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Shader Studio</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Real-time WebGL fragment shader editor. Create stunning visual effects with GLSL.
                  </p>
                  <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500">WebGL →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <SpotlightCard className="h-full">
                <div className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-amber-500/50 transition-colors group cursor-pointer" onClick={() => {
                  const btn = document.querySelector('[data-voice-trigger]') as HTMLButtonElement;
                  btn?.click();
                }}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Voice Navigation</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Control the portfolio with your voice! Try saying "go home" or "show projects".
                  </p>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500">Voice AI →</Badge>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <SpotlightCard className="h-full">
                <Link href="/games" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-green-500/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Mini Games</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Play interactive games including typing race, bug bounty, and more fun challenges.
                  </p>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">Play Now →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3D Project Showcase */}
      <ProjectShowcase3D />

      {/* Live Coding Demo */}
      <LiveCodingDemo />

      {/* Case Studies */}
      <CaseStudiesSection />

      {/* Achievement Showcase */}
      <AchievementShowcase />
      
      {/* Enhanced Achievement Gallery */}
      <AchievementShowcaseEnhanced />
      
      {/* Daily Challenges */}
      <DailyChallenges />
      
      {/* Idea Generator */}
      <IdeaGeneratorSection />
      
      {/* Soundboard */}
      <SoundboardSection />

      {/* NEW FEATURES - Portfolio Enhancement */}
      
      {/* Developer Horoscope */}
      <DeveloperHoroscope />
      
      {/* Code Time Capsule */}
      <CodeTimeCapsule />
      
      {/* Pair Programming Simulator */}
      <PairProgrammingSimulator />
      
      {/* Bug Bounty Game */}
      <BugBountyGame />

      {/* NEW - Code Evolution Theater */}
      <CodeEvolutionTheater />

      {/* NEW - Creative Coding Playground */}
      <CreativeCodingPlayground />

      {/* NEW - Gamified Portfolio */}
      <GamifiedPortfolio />

      {/* Interactive Resume */}
      <InteractiveResume />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Stats Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              By the{" "}
              <span className="text-gradient-animated">Numbers</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 50, suffix: "+", label: "Projects Completed" },
              { value: 5, suffix: "+", label: "Years Experience" },
              { value: 100, suffix: "%", label: "Client Satisfaction" },
              { value: 24, suffix: "h", label: "Response Time" },
            ].map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-card border border-border">
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Tech{" "}
              <span className="text-gradient-animated">Stack</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Technologies I use to bring ideas to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all text-center group cursor-pointer"
              >
                <motion.div
                  className="text-3xl mb-2"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {tech.icon}
                </motion.div>
                <span className="text-xs font-medium group-hover:text-primary transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Wall */}
      <QuoteWall />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Skills Visualization */}
      <SkillsVisualization />

      {/* Animated Skills Chart */}
      <AnimatedSkillsChart />

      {/* Contact Section */}
      <section className="py-24 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Coffee className="h-4 w-4" />
              <span className="text-sm font-medium">Let&apos;s Chat</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Let&apos;s Work{" "}
              <span className="text-gradient-animated">Together</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have a project in mind? I&apos;d love to hear about it. Send me a message
              and let&apos;s create something amazing.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <ScrollReveal direction="left">
              <div className="space-y-8">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-orange-500/5 border border-border p-8">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                  </div>

                  <div className="relative space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Ready to start?</h3>
                      <p className="text-muted-foreground">
                        I&apos;m always excited to work on new projects. 
                        Let&apos;s discuss how I can help bring your ideas to life.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="text-sm font-medium">Available for new projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative rounded-3xl bg-card border border-border p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-orange-500 text-primary-foreground p-8 md:p-16 text-center"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            >
              Ready to Start Your{" "}
              <span className="text-white">Project?</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg"
            >
              Let&apos;s turn your ideas into reality. I&apos;m excited to hear about
              your next big thing.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/hire">
                <Button size="lg" variant="secondary" className="group">
                  <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  Hire Me
                </Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10 text-white">
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Companion - Floating Widget */}
      <AICompanion />
    </>
  );
}
