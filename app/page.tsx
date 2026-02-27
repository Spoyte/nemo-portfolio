"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Download, 
  Sparkles, 
  Code2, 
  Palette, 
  Zap, 
  Trophy, 
  Terminal, 
  Heart,
  Gamepad2,
  Wand2,
  Layers,
  Lightbulb,
  Wind,
  Keyboard,
  FileTerminal,
  CreditCard,
  Brain,
  BarChart3,
  Music,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisitorCounter } from "@/components/visitor-counter";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { EasterEgg } from "@/components/easter-egg";
import { ParticleBackground } from "@/components/particle-background";
import { TypewriterText } from "@/components/typewriter-text";
import { AnimatedStats } from "@/components/animated-stats";
import { ProjectCaseStudies } from "@/components/project-case-studies";
import { TiltCard, MagneticButton, Floating, Spotlight } from "@/components/tilt-card";
import { TextScramble, GradientText } from "@/components/text-effects";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/page-transitions";
import { Confetti, AchievementNotification, useAchievements } from "@/components/confetti";
import { InteractiveTestimonials } from "@/components/interactive-testimonials";
import { GamificationSystem } from "@/components/gamification";
import { LiveVisitorMap } from "@/components/live-visitor-map";
import { QuoteOfTheDay } from "@/components/quote-of-the-day";
import { SkillsVisualization } from "@/components/skills-3d-visualization";
import { AIProjectGenerator } from "@/components/ai-project-generator";
import { useEffect, useState } from "react";
import { ScrollReveal, StaggerReveal, TextReveal, BlurReveal } from "@/components/scroll-reveal";
import { Card3D, FloatingCard3D } from "@/components/card-3d";
import { ParticleText } from "@/components/particle-text";

const features = [
  {
    icon: Code2,
    title: "Clean Code",
    description: "Writing maintainable, scalable code with best practices and modern patterns.",
  },
  {
    icon: Palette,
    title: "Thoughtful Design",
    description: "Creating beautiful interfaces that balance aesthetics with functionality.",
  },
  {
    icon: Zap,
    title: "Performance First",
    description: "Optimizing for speed and efficiency without compromising user experience.",
  },
];

export default function Home() {
  const { unlockAchievement, currentAchievement, showConfetti, clearAchievement, hasAchievement } = useAchievements();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Unlock explorer achievement if on home page for first time
    if (!hasAchievement("explorer")) {
      setTimeout(() => {
        unlockAchievement("explorer", "Curious Explorer", "Visited the portfolio homepage", <Trophy className="h-6 w-6" />);
      }, 2000);
    }
  }, [unlockAchievement, hasAchievement]);

  return (
    <>
      <EasterEgg />
      <ParticleBackground />
      <Confetti trigger={showConfetti} />
      {currentAchievement && (
        <AchievementNotification
          show={true}
          title={currentAchievement.title}
          description={currentAchievement.description}
          icon={currentAchievement.icon}
          onComplete={clearAchievement}
        />
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <StaggerContainer className="text-center space-y-8">
            <StaggerItem>
              <VisitorCounter />
            </StaggerItem>

            <StaggerItem>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Hi, I&apos;m{" "}
                <span className="text-gradient-animated">Nemo</span>
              </h1>
            </StaggerItem>

            <StaggerItem>
              <div className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto h-16">
                <TypewriterText
                  texts={[
                    "Creative Developer",
                    "UI/UX Designer",
                    "Problem Solver",
                    "Open Source Enthusiast",
                  ]}
                  className="text-gradient font-semibold"
                />
              </div>
            </StaggerItem>

            <StaggerItem>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                I craft digital experiences that blend beautiful design with powerful functionality.
                Building things that live on the internet is my passion.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticButton>
                  <Link href="/projects">
                    <Button size="lg" className="group">
                      View My Work
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Get in Touch
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Button size="lg" variant="ghost" className="group">
                    <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                    Resume
                  </Button>
                </MagneticButton>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Available for freelance work</span>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-foreground rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Animated Stats */}
      <AnimatedStats />

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What I Do</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combining technical expertise with creative thinking to deliver exceptional results.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.1}>
                <TiltCard tiltAmount={8}>
                  <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all text-center group h-full"
                  >
                    <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-20 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of my recent work. Each project presented unique challenges and opportunities for innovation.
            </p>
          </Reveal>

          <ProjectCaseStudies />

          <Reveal className="text-center mt-12">
            <Link href="/projects">
              <Button size="lg" variant="outline" className="group">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Technologies I use to bring ideas to life.
            </p>
          </Reveal>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: "React", color: "#61DAFB" },
              { name: "Next.js", color: "#000000" },
              { name: "TypeScript", color: "#3178C6" },
              { name: "Tailwind", color: "#06B6D4" },
              { name: "Node.js", color: "#339933" },
              { name: "PostgreSQL", color: "#336791" },
              { name: "GraphQL", color: "#E10098" },
              { name: "Redis", color: "#DC382D" },
              { name: "Docker", color: "#2496ED" },
              { name: "AWS", color: "#FF9900" },
              { name: "Figma", color: "#F24E1E" },
              { name: "Git", color: "#F05032" },
            ].map((tech, index) => (
              <Reveal key={tech.name} delay={index * 0.05}>
                <TiltCard tiltAmount={10} scale={1.05}>
                  <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all text-center group"
                  >
                    <div
                      className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: tech.color }}
                    >
                      {tech.name[0]}
                    </div>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {tech.name}
                    </span>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Dashboard + Gamification + Live Map */}
      <section className="py-20 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Site Analytics</h2>
            <p className="text-muted-foreground">
              Real-time insights into this portfolio&apos;s performance.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnalyticsDashboard />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <GamificationSystem />
              <LiveVisitorMap />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the playground for interactive demos, 3D visualizations, and AI-powered tools.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal delay={0}>
              <TiltCard tiltAmount={8}>
                <Link href="/playground">
                  <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all text-center group h-full cursor-pointer"
                  >
                    <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
                      <Layers className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">3D Skills Globe</h3>
                    <p className="text-muted-foreground">
                      Explore my technical skills in an interactive 3D visualization. Drag to rotate and click to learn more.
                    </p>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.1}>
              <TiltCard tiltAmount={8}>
                <Link href="/playground">
                  <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all text-center group h-full cursor-pointer"
                  >
                    <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
                      <Wand2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">AI Project Generator</h3>
                    <p className="text-muted-foreground">
                      Stuck on what to build? Let AI spark your creativity with personalized project ideas.
                    </p>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.2}>
              <TiltCard tiltAmount={8}>
                <Link href="/playground">
                  <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all text-center group h-full cursor-pointer"
                  >
                    <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
                      <Gamepad2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Achievement System</h3>
                    <p className="text-muted-foreground">
                      Unlock achievements as you explore. Gamified experience with XP, levels, and rewards.
                    </p>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          </div>

          <Reveal className="text-center mt-12">
            <Link href="/playground">
              <Button size="lg" className="group">
                Explore Playground
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Quote of the Day */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Daily Inspiration</h2>
            <p className="text-muted-foreground">
              A quote to inspire your day.
            </p>
          </Reveal>
          <QuoteOfTheDay />
        </div>
      </section>

      {/* Interactive Testimonials */}
      <InteractiveTestimonials />

      {/* New Features Showcase */}
      <section className="py-20 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest <span className="text-gradient-animated">Additions</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fresh features and interactive experiences added to the portfolio.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal delay={0}>
              <TiltCard tiltAmount={5}>
                <Link href="/new-features">
                  <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all group h-full cursor-pointer"
                  >
                    <div className="flex items-start gap-4"
                    >
                      <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform"
                      >
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1"
                      >
                        <h3 className="text-lg font-semibold mb-2">Holographic Business Card</h3>
                        <p className="text-sm text-muted-foreground">
                          An interactive 3D business card with holographic effects and flip animation.
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.1}>
              <TiltCard tiltAmount={5}>
                <Link href="/new-features">
                  <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all group h-full cursor-pointer"
                  >
                    <div className="flex items-start gap-4"
                    >
                      <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform"
                      >
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1"
                      >
                        <h3 className="text-lg font-semibold mb-2">Memory Match Game</h3>
                        <p className="text-sm text-muted-foreground">
                          Test your memory by matching tech stack pairs. Compete for the best time!
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.2}>
              <TiltCard tiltAmount={5}>
                <Link href="/new-features">
                  <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all group h-full cursor-pointer"
                  >
                    <div className="flex items-start gap-4"
                    >
                      <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform"
                      >
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1"
                      >
                        <h3 className="text-lg font-semibold mb-2">Productivity Dashboard</h3>
                        <p className="text-sm text-muted-foreground">
                          Track tasks, build streaks, and level up your developer productivity.
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.3}>
              <TiltCard tiltAmount={5}>
                <Link href="/new-features">
                  <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all group h-full cursor-pointer"
                  >
                    <div className="flex items-start gap-4"
                    >
                      <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform"
                      >
                        <Music className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1"
                      >
                        <h3 className="text-lg font-semibold mb-2">Code Rhythm Visualizer</h3>
                        <p className="text-sm text-muted-foreground">
                          Watch code come alive with this audio-reactive visualization.
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.4}>
              <TiltCard tiltAmount={5}>
                <Link href="/timeline">
                  <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all group h-full cursor-pointer"
                  >
                    <div className="flex items-start gap-4"
                    >
                      <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform"
                      >
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1"
                      >
                        <h3 className="text-lg font-semibold mb-2">Interactive Timeline</h3>
                        <p className="text-sm text-muted-foreground">
                          A visual journey through my career, education, and achievements.
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.5}>
              <TiltCard tiltAmount={5}>
                <Link href="/hire">
                  <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all group h-full cursor-pointer"
                  >
                    <div className="flex items-start gap-4"
                    >
                      <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform"
                      >
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1"
                      >
                        <h3 className="text-lg font-semibold mb-2">Hire Me Page</h3>
                        <p className="text-sm text-muted-foreground">
                          Services, pricing, and a contact form for potential collaborations.
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          </div>

          <Reveal className="text-center mt-10">
            <Link href="/new-features">
              <Button size="lg" variant="outline" className="group">
                Explore All New Features
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Spotlight className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 md:p-16 text-center"
            >
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Let&apos;s Build Something{" "}
                <TextScramble trigger="inView" duration={1}>Amazing</TextScramble>
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how
                we can work together to bring your vision to life.
              </p>
              <MagneticButton>
                <Link href="/contact">
                  <Button size="lg" variant="secondary" className="group">
                    Start a Conversation
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
            </Spotlight>
          </Reveal>
        </div>
      </section>
    </>
  );
}
