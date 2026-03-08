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
  Github,
  Twitter,
  Linkedin,
  Mail,
  ChevronDown,
  Layers,
  Keyboard,
  MousePointer,
  Film,
  Wrench,
  Palette as PaletteIcon,
  Brush
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedVisitorCounter } from "@/components/enhanced-visitor-counter";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FeaturedProjects } from "@/components/featured-projects";
import { ScrollReveal, Counter, SpotlightCard } from "@/components/scroll-animations";
import { Badge } from "@/components/ui/badge";
import { SkillsVisualization } from "@/components/skills-visualization";
import { ContactForm } from "@/components/contact-form";

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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            {/* Visitor Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <EnhancedVisitorCounter />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
            >
              Hi, I&apos;m{" "}
              <span className="text-gradient-animated">Nemo</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            >
              Creative Developer & Designer crafting digital experiences with{" "}
              <span className="text-primary font-semibold">code</span> and{" "}
              <span className="text-primary font-semibold">creativity</span>.
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              I build things that live on the internet. From websites to web applications,
              I love creating digital experiences that make a difference.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/projects">
                <Button size="lg" className="group">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/hire">
                <Button size="lg" variant="outline" className="group">
                  Hire Me
                  <Sparkles className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                </Button>
              </Link>
              
              <Link href="/new-features">
                <Button size="lg" variant="ghost" className="group">
                  <Zap className="mr-2 h-4 w-4 group-hover:text-yellow-500 transition-colors" />
                  New Features
                </Button>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              {[
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Mail, href: "mailto:hello@nemo.dev", label: "Email" },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </motion.div>

            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
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
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

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
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Just Added</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              New{" "}
              <span className="text-gradient-animated">Interactive Features</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the latest additions to my portfolio, from 3D cards to typing games.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <SpotlightCard className="h-full">
                <Link href="/code-cinema" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Film className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Code Cinema</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Watch code come to life with typewriter animations and syntax highlighting.
                  </p>
                  <Badge variant="outline">Watch →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <SpotlightCard className="h-full">
                <Link href="/color-studio" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <PaletteIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Color Studio</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Generate beautiful color palettes with harmony algorithms and export options.
                  </p>
                  <Badge variant="outline">Create →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <SpotlightCard className="h-full">
                <Link href="/art-studio" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Brush className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Generative Art</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Create algorithmic artwork with interactive controls and animations.
                  </p>
                  <Badge variant="outline">Generate →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <SpotlightCard className="h-full">
                <Link href="/dev-tools" className="block p-6 rounded-2xl bg-card border border-border h-full hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Dev Tools</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Essential utilities: UUID, password generator, JSON formatter, and more.
                  </p>
                  <Badge variant="outline">Use →</Badge>
                </Link>
              </SpotlightCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

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

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Skills Visualization */}
      <SkillsVisualization />

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
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">Get In Touch</span>
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
                  {/* Background decoration */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                  </div>

                  <div className="relative space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Contact Information</h3>
                      <p className="text-muted-foreground">
                        Feel free to reach out through any of these channels.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { icon: Mail, label: "Email", value: "hello@nemo.dev", href: "mailto:hello@nemo.dev" },
                        { icon: Twitter, label: "Twitter", value: "@nemo_dev", href: "https://twitter.com" },
                        { icon: Linkedin, label: "LinkedIn", value: "Nemo Developer", href: "https://linkedin.com" },
                        { icon: Github, label: "GitHub", value: "@nemo", href: "https://github.com" },
                      ].map((item, i) => (
                        <motion.a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 rounded-xl bg-card/50 hover:bg-card transition-colors group"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 + i * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className="font-medium">{item.value}</p>
                          </div>
                        </motion.a>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-4">
                        Usually respond within 24 hours
                      </p>
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
            {/* Background Pattern */}
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
                  Hire Me
                  <Sparkles className="ml-2 h-4 w-4 group-hover:animate-pulse" />
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
    </>
  );
}
