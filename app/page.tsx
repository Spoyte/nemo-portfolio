"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles, Code2, Palette, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisitorCounter } from "@/components/visitor-counter";
import { TestimonialsSection } from "@/components/testimonials-section";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { EasterEgg } from "@/components/easter-egg";
import { ParticleBackground } from "@/components/particle-background";
import { TypewriterText } from "@/components/typewriter-text";
import { AnimatedStats } from "@/components/animated-stats";
import { ProjectCaseStudies } from "@/components/project-case-studies";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

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
  return (
    <>
      <EasterEgg />
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8"
          >
            <motion.div variants={itemVariants}>
              <VisitorCounter />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              Hi, I'm{" "}
              <span className="text-gradient">Nemo</span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto h-16"
            >
              <TypewriterText
                texts={[
                  "Creative Developer",
                  "UI/UX Designer",
                  "Problem Solver",
                  "Open Source Enthusiast",
                ]}
                className="text-gradient font-semibold"
              />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              I craft digital experiences that blend beautiful design with powerful functionality.
              Building things that live on the internet is my passion.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/projects">
                <Button size="lg" className="group">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Get in Touch
                </Button>
              </Link>
              <Button size="lg" variant="ghost" className="group">
                <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Resume
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Sparkles className="h-4 w-4" />
              <span>Available for freelance work</span>
            </motion.div>
          </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What I Do</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combining technical expertise with creative thinking to deliver exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all text-center group"
              >
                <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-20 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of my recent work. Each project presented unique challenges and opportunities for innovation.
            </p>
          </motion.div>

          <ProjectCaseStudies />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/projects">
              <Button size="lg" variant="outline" className="group">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Technologies I use to bring ideas to life.
            </p>
          </motion.div>

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
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all text-center group"
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="py-20 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Site Analytics</h2>
            <p className="text-muted-foreground">
              Real-time insights into this portfolio's performance.
            </p>
          </motion.div>
          <AnalyticsDashboard />
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 md:p-16 text-center"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's Build Something Amazing
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Have a project in mind? I'd love to hear about it. Let's discuss how
              we can work together to bring your vision to life.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="group">
                Start a Conversation
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
