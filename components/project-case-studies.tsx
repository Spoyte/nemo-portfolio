"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Github, 
  ArrowUpRight, 
  Clock, 
  Users, 
  Target, 
  Lightbulb, 
  CheckCircle2,
  TrendingUp,
  Layers,
  Calendar,
  ArrowRight,
  Play,
  Code,
  Eye
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
}

interface ProjectCaseStudyProps {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  challenges: string[];
  solutions: string[];
  technologies: { name: string; icon: string; color: string }[];
  outcomes: { metric: string; value: string; description: string }[];
  demoUrl: string;
  repoUrl: string;
  duration: string;
  role: string;
  team?: string;
  timeline: TimelineEvent[];
  problem: string;
  result: string;
  embedDemo?: boolean;
}

const CASE_STUDIES: ProjectCaseStudyProps[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory and payment processing.",
    problem: "Traditional e-commerce platforms struggled with flash sales, causing site crashes and overselling. The client needed a scalable solution that could handle traffic spikes while maintaining real-time inventory accuracy.",
    longDescription: `Built a comprehensive e-commerce platform from the ground up, serving over 10,000 daily active users. The platform handles everything from product discovery to checkout, with a focus on performance and user experience.

The system processes thousands of transactions daily with 99.9% uptime, featuring real-time inventory management that prevents overselling and automatic tax calculation for multiple jurisdictions.`,
    challenges: [
      "Handling high-traffic flash sales without downtime",
      "Real-time inventory synchronization across multiple warehouses",
      "Complex tax calculations for international orders",
      "Optimizing page load times for mobile users",
    ],
    solutions: [
      "Implemented Redis caching layer with cache warming strategies",
      "Built event-driven architecture using webhooks for inventory updates",
      "Integrated Stripe Tax API with fallback calculation engine",
      "Achieved 95+ Lighthouse score through code splitting and image optimization",
    ],
    technologies: [
      { name: "Next.js", icon: "▲", color: "#000000" },
      { name: "TypeScript", icon: "📘", color: "#3178C6" },
      { name: "PostgreSQL", icon: "🐘", color: "#336791" },
      { name: "Redis", icon: "🔴", color: "#DC382D" },
      { name: "Stripe", icon: "💳", color: "#635BFF" },
      { name: "AWS", icon: "☁️", color: "#FF9900" },
    ],
    outcomes: [
      { metric: "Conversion Rate", value: "+35%", description: "Increased conversion rate through optimized checkout flow" },
      { metric: "Cart Abandonment", value: "-28%", description: "Reduced abandonment with faster load times" },
      { metric: "Page Load", value: "<2s", description: "Achieved sub-2-second page load times" },
      { metric: "Revenue", value: "$2M+", description: "Processed in transactions within 6 months" },
    ],
    result: "The platform now handles 10,000+ daily active users with 99.9% uptime. Conversion rates increased by 35%, and the system processed over $2M in transactions within the first 6 months.",
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    duration: "4 months",
    timeline: [
      { date: "Month 1", title: "Discovery & Planning", description: "Requirements gathering, architecture design, and tech stack selection", status: "completed" },
      { date: "Month 2", title: "Core Development", description: "Built authentication, product catalog, and shopping cart", status: "completed" },
      { date: "Month 3", title: "Payment Integration", description: "Integrated Stripe payments, tax calculation, and order management", status: "completed" },
      { date: "Month 4", title: "Optimization & Launch", description: "Performance optimization, load testing, and production deployment", status: "completed" },
    ],
    role: "Lead Full-Stack Developer",
    team: "4 developers, 1 designer",
    embedDemo: true,
  },
  {
    id: "ai-dashboard",
    title: "AI Analytics Dashboard",
    description: "Real-time data visualization with AI-powered insights and predictive analytics.",
    problem: "Businesses struggled to make sense of vast amounts of data. Existing tools were either too complex for non-technical users or lacked predictive capabilities needed for proactive decision-making.",
    longDescription: `Developed an intelligent analytics platform that transforms raw data into actionable insights. The dashboard uses machine learning models to predict trends and anomalies, helping businesses make data-driven decisions.

The platform processes millions of data points in real-time, presenting complex information through intuitive visualizations that non-technical stakeholders can easily understand.`,
    challenges: [
      "Processing millions of data points in real-time",
      "Creating intuitive visualizations for complex data",
      "Training ML models with limited historical data",
      "Ensuring data security and compliance",
    ],
    solutions: [
      "Implemented data streaming with Apache Kafka",
      "Built custom D3.js components with interactive features",
      "Used transfer learning to bootstrap models with small datasets",
      "Achieved SOC 2 Type II compliance with end-to-end encryption",
    ],
    technologies: [
      { name: "React", icon: "⚛️", color: "#61DAFB" },
      { name: "Python", icon: "🐍", color: "#3776AB" },
      { name: "TensorFlow", icon: "🧠", color: "#FF6F00" },
      { name: "D3.js", icon: "📊", color: "#F9A03C" },
      { name: "Kafka", icon: "🌊", color: "#231F20" },
      { name: "PostgreSQL", icon: "🐘", color: "#336791" },
    ],
    outcomes: [
      { metric: "Decision Time", value: "-60%", description: "Reduced decision-making time with AI insights" },
      { metric: "Cost Savings", value: "$500K+", description: "Identified cost savings opportunities" },
      { metric: "Accuracy", value: "94%", description: "Prediction accuracy achieved" },
      { metric: "Clients", value: "50+", description: "Enterprise clients onboarded" },
    ],
    result: "The dashboard reduced decision-making time by 60% and identified over $500K in cost savings. The platform achieved 94% prediction accuracy and onboarded 50+ enterprise clients.",
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    duration: "6 months",
    timeline: [
      { date: "Month 1-2", title: "Data Infrastructure", description: "Set up Kafka streaming, data pipelines, and storage architecture", status: "completed" },
      { date: "Month 3-4", title: "ML Model Development", description: "Built and trained predictive models using TensorFlow", status: "completed" },
      { date: "Month 5", title: "Dashboard UI", description: "Created interactive visualizations with D3.js and React", status: "completed" },
      { date: "Month 6", title: "Security & Compliance", description: "Implemented SOC 2 compliance and security hardening", status: "completed" },
    ],
    role: "Tech Lead & ML Engineer",
    team: "6 developers, 2 data scientists",
    embedDemo: true,
  },
  {
    id: "social-app",
    title: "Social Media App",
    description: "A modern social platform with real-time messaging, stories, and content recommendations.",
    problem: "Existing social platforms felt impersonal and cluttered. Users wanted a more intimate, interest-based connection platform with better privacy controls and less algorithmic manipulation.",
    longDescription: `Created a mobile-first social platform that connects users through shared interests. The app features ephemeral stories, real-time messaging, and an AI-powered content recommendation engine.

With a focus on privacy and user control, the platform gives users granular control over their data while delivering a seamless, engaging experience that keeps users coming back.`,
    challenges: [
      "Building real-time messaging at scale",
      "Implementing ephemeral content with proper cleanup",
      "Creating an engaging recommendation algorithm",
      "Optimizing battery usage for background processes",
    ],
    solutions: [
      "Used Firebase Realtime Database with optimistic updates",
      "Built automated cleanup jobs with Firebase Functions",
      "Implemented collaborative filtering with content-based recommendations",
      "Optimized background sync to minimize battery drain",
    ],
    technologies: [
      { name: "React Native", icon: "📱", color: "#61DAFB" },
      { name: "Firebase", icon: "🔥", color: "#FFCA28" },
      { name: "Redux", icon: "🔄", color: "#764ABC" },
      { name: "Node.js", icon: "🟢", color: "#339933" },
      { name: "TensorFlow Lite", icon: "🧠", color: "#FF6F00" },
    ],
    outcomes: [
      { metric: "Downloads", value: "100K+", description: "Downloads in first 3 months" },
      { metric: "Rating", value: "4.8★", description: "Star rating on App Store" },
      { metric: "DAU Rate", value: "45%", description: "Daily active user rate" },
      { metric: "Messages", value: "2M+", description: "Messages sent daily" },
    ],
    result: "The app achieved 100K+ downloads in the first 3 months with a 4.8-star rating. Users send over 2M messages daily, with a 45% daily active user rate indicating strong engagement.",
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    duration: "5 months",
    timeline: [
      { date: "Month 1", title: "UI/UX Design", description: "Designed user flows, wireframes, and high-fidelity mockups", status: "completed" },
      { date: "Month 2", title: "Core Features", description: "Built authentication, user profiles, and content feeds", status: "completed" },
      { date: "Month 3", title: "Messaging & Stories", description: "Implemented real-time messaging and ephemeral stories", status: "completed" },
      { date: "Month 4-5", title: "AI Recommendations", description: "Built and integrated content recommendation engine", status: "completed" },
    ],
    role: "Mobile Lead Developer",
    team: "3 developers, 1 designer",
    embedDemo: false,
  },
];

export function ProjectCaseStudies() {
  return (
    <div className="space-y-32">
      {CASE_STUDIES.map((study, index) => (
        <CaseStudyCard key={study.id} study={study} index={index} />
      ))}
    </div>
  );
}

function CaseStudyCard({ study, index }: { study: ProjectCaseStudyProps; index: number }) {
  const [activeTab, setActiveTab] = useState<"overview" | "demo" | "code">("overview");
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Section Label */}
      <motion.div 
        className={`absolute -top-8 ${isReversed ? 'right-0' : 'left-0'} text-sm font-mono text-muted-foreground`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Case Study {String(index + 1).padStart(2, '0')}
      </motion.div>

      <Card className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Visual Section */}
          <div className={`relative ${isReversed ? "lg:order-2" : ""}`}>
            {/* Demo/Preview Area */}
            <div className="aspect-video lg:aspect-auto lg:h-full bg-gradient-to-br from-primary/5 via-orange-500/5 to-purple-500/5 relative overflow-hidden">
              {activeTab === "demo" && study.embedDemo ? (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
                    <p className="text-muted-foreground">Interactive Demo</p>
                    <Button className="mt-4" size="sm" asChild>
                      <a href={study.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Live Demo
                      </a>
                    </Button>
                  </div>
                </div>
              ) : activeTab === "code" ? (
                <div className="absolute inset-0 bg-slate-950 p-6 font-mono text-sm overflow-auto">
                  <pre className="text-green-400">
                    <code>{`// Project Architecture
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── pages/
├── tests/
├── docs/
└── config/

// Key Technologies:
${study.technologies.map(t => `// - ${t.name}`).join('\n')}

// Get Started:
// git clone ${study.repoUrl}
// npm install
// npm run dev`}</code>
                  </pre>
                </div>
              ) : (
                <>
                  {/* Project Preview */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="text-center p-8"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.span 
                        className="text-9xl font-bold bg-gradient-to-br from-primary to-orange-500 bg-clip-text text-transparent block"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      >
                        {study.title[0]}
                      </motion.span>
                    </motion.div>
                  </div>
                  
                  {/* Floating Stats */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 flex-wrap">
                    {study.outcomes.slice(0, 2).map((outcome, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex-1 min-w-[140px] p-3 rounded-xl bg-background/80 backdrop-blur-sm border"
                      >
                        <p className="text-2xl font-bold text-primary">{outcome.value}</p>
                        <p className="text-xs text-muted-foreground">{outcome.metric}</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* View Toggle */}
            <div className="absolute top-4 right-4 flex gap-1 bg-background/90 backdrop-blur-sm rounded-lg p-1 border">
              <Button
                variant={activeTab === "overview" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("overview")}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "demo" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("demo")}
              >
                <Play className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "code" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("code")}
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className={`p-8 ${isReversed ? "lg:order-1" : ""}`}>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-mono">{study.duration}</Badge>
                  <Badge variant="outline">{study.role}</Badge>
                </div>
                <Link href={`/projects/${study.id}`}>
                  <h3 className="text-2xl font-bold hover:text-primary transition-colors">
                    {study.title}
                  </h3>
                </Link>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <a href={study.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={study.repoUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {study.technologies.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="group relative"
                >
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    <span className="mr-1">{tech.icon}</span>
                    {tech.name}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {/* Problem/Solution/Result */}
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-red-500" />
                  <span className="font-semibold text-red-600 dark:text-red-400">Problem</span>
                </div>
                <p className="text-sm text-muted-foreground">{study.problem}</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Solution</span>
                </div>
                <ul className="space-y-1">
                  {study.solutions.slice(0, 3).map((solution, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 mt-1 text-blue-500 shrink-0" />
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-green-600 dark:text-green-400">Result</span>
                </div>
                <p className="text-sm text-muted-foreground">{study.result}</p>
              </div>
            </div>

            {/* Timeline Preview */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Project Timeline</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {study.timeline.map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex-shrink-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        event.status === 'completed' ? 'bg-green-500' : 
                        event.status === 'in-progress' ? 'bg-yellow-500' : 'bg-muted'
                      }`} />
                      <div className="text-xs">
                        <p className="font-medium">{event.date}</p>
                        <p className="text-muted-foreground truncate max-w-[120px]">{event.title}</p>
                      </div>
                      {i < study.timeline.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground mx-1" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Export case studies data for use in other components
export { CASE_STUDIES };
