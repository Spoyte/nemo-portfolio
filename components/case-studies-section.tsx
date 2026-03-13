"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  ExternalLink, 
  Github, 
  Calendar,
  Users,
  Target,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  duration: string;
  role: string;
  team: string;
  image: string;
  color: string;
  overview: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  technologies: string[];
  highlights: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

const caseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "E-Commerce Platform Redesign",
    client: "TechRetail Inc.",
    duration: "3 months",
    role: "Lead Frontend Developer",
    team: "5 developers",
    image: "🛍️",
    color: "from-purple-500 to-pink-500",
    overview: "Complete redesign of a legacy e-commerce platform serving 2M+ monthly users, focusing on performance and conversion optimization.",
    challenge: "The existing platform had a 4.2s load time, 68% bounce rate, and outdated UI that was hurting conversions. The monolithic architecture made iterative improvements difficult.",
    solution: "Migrated to a modern Next.js architecture with incremental static regeneration, implemented advanced caching strategies, and redesigned the UX with a mobile-first approach.",
    results: [
      { metric: "Load Time", value: "0.8s", improvement: "-81%" },
      { metric: "Conversion Rate", value: "4.2%", improvement: "+140%" },
      { metric: "Bounce Rate", value: "32%", improvement: "-53%" },
      { metric: "Revenue", value: "$2.4M", improvement: "+85%" },
    ],
    technologies: ["Next.js", "TypeScript", "Redis", "PostgreSQL", "AWS"],
    highlights: [
      "Implemented real-time inventory updates",
      "Built custom analytics dashboard",
      "Integrated 15+ payment providers",
      "Achieved 99.9% uptime",
    ],
    testimonial: {
      quote: "The transformation exceeded our expectations. Our customers love the new experience, and the business results speak for themselves.",
      author: "Sarah Chen",
      role: "CTO, TechRetail Inc.",
    },
  },
  {
    id: "2",
    title: "AI-Powered Dashboard",
    client: "DataFlow Analytics",
    duration: "4 months",
    role: "Full Stack Developer",
    team: "8 developers",
    image: "📊",
    color: "from-blue-500 to-cyan-500",
    overview: "Built an intelligent analytics dashboard with AI-driven insights, real-time data visualization, and predictive modeling capabilities.",
    challenge: "Users struggled to extract meaningful insights from massive datasets. Manual analysis was time-consuming and error-prone.",
    solution: "Developed an AI assistant that automatically analyzes data patterns, generates insights, and creates visualizations. Implemented WebSocket connections for real-time updates.",
    results: [
      { metric: "Analysis Time", value: "2min", improvement: "-95%" },
      { metric: "User Adoption", value: "94%", improvement: "+67%" },
      { metric: "Data Processing", value: "10TB/day", improvement: "+400%" },
      { metric: "Accuracy", value: "99.2%", improvement: "+23%" },
    ],
    technologies: ["React", "Python", "TensorFlow", "D3.js", "GraphQL"],
    highlights: [
      "Natural language query interface",
      "Automated report generation",
      "Custom ML model training",
      "Enterprise SSO integration",
    ],
    testimonial: {
      quote: "This dashboard has become indispensable for our decision-making. The AI insights have uncovered opportunities we never knew existed.",
      author: "Michael Torres",
      role: "VP of Product, DataFlow",
    },
  },
  {
    id: "3",
    title: "Mobile Banking App",
    client: "SecureBank",
    duration: "6 months",
    role: "Senior Frontend Engineer",
    team: "12 developers",
    image: "🏦",
    color: "from-green-500 to-emerald-500",
    overview: "Developed a next-generation mobile banking experience with biometric security, instant transfers, and intelligent financial insights.",
    challenge: "Legacy banking apps were slow, insecure, and provided poor user experience. Security concerns prevented feature adoption.",
    solution: "Built a React Native app with biometric authentication, end-to-end encryption, and a microservices backend. Implemented fraud detection ML models.",
    results: [
      { metric: "App Rating", value: "4.9★", improvement: "+63%" },
      { metric: "Daily Users", value: "500K", improvement: "+340%" },
      { metric: "Transactions", value: "2M/day", improvement: "+280%" },
      { metric: "Security Score", value: "A+", improvement: "+45%" },
    ],
    technologies: ["React Native", "Node.js", "MongoDB", "Redis", "AWS Lambda"],
    highlights: [
      "Biometric authentication",
      "Real-time fraud detection",
      "Instant peer-to-peer transfers",
      "Spending insights & budgeting",
    ],
    testimonial: {
      quote: "Our customers finally have a banking app they love to use. The security features give them peace of mind.",
      author: "Jennifer Walsh",
      role: "Head of Digital, SecureBank",
    },
  },
];

function CaseStudyCard({ study, onClick }: { study: CaseStudy; onClick: () => void }) {
  return (
    <motion.div
      layoutId={`card-${study.id}`}
      onClick={onClick}
      className="group cursor-pointer"
      whileHover={{ y: -8 }}
    >
      <div className={`relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all overflow-hidden`}>
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${study.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
        
        {/* Icon */}
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${study.color} flex items-center justify-center text-3xl mb-4`}>
          {study.image}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {study.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{study.client}</p>
        
        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {study.duration}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            {study.team}
          </div>
        </div>

        {/* Arrow */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-5 h-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}

function CaseStudyModal({ study, onClose }: { study: CaseStudy; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        layoutId={`card-${study.id}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-card rounded-3xl border shadow-2xl overflow-hidden my-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className={`relative p-8 bg-gradient-to-br ${study.color}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl backdrop-blur-sm">
              {study.image}
            </div>
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-1">{study.title}</h2>
              <p className="text-white/80">{study.client}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <Badge variant="secondary" className="gap-1">
              <Calendar className="w-3 h-3" />
              {study.duration}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Target className="w-3 h-3" />
              {study.role}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Users className="w-3 h-3" />
              {study.team}
            </Badge>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Project Overview
            </h3>
            <p className="text-muted-foreground">{study.overview}</p>
          </div>

          {/* Challenge & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <h4 className="font-semibold text-destructive mb-2">The Challenge</h4>
              <p className="text-sm text-muted-foreground">{study.challenge}</p>
            </div>
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <h4 className="font-semibold text-green-600 mb-2">The Solution</h4>
              <p className="text-sm text-muted-foreground">{study.solution}</p>
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {study.results.map((result) => (
                <div key={result.metric} className="p-4 rounded-xl bg-muted text-center">
                  <p className="text-2xl font-bold text-primary">{result.value}</p>
                  <p className="text-xs text-muted-foreground mb-1">{result.metric}</p>
                  <Badge variant="outline" className="text-green-500 border-green-500/30">
                    {result.improvement}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {study.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {study.technologies.map((tech) => (
                <Badge key={tech} variant="outline">{tech}</Badge>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          {study.testimonial && (
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-lg italic mb-4">&ldquo;{study.testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">{study.testimonial.author[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{study.testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{study.testimonial.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button className="flex-1 gap-2">
              <ExternalLink className="w-4 h-4" />
              View Live Project
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Github className="w-4 h-4" />
              View Code
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CaseStudiesSection() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Deep Dives</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Project{" "}
            <span className="text-gradient-animated">Case Studies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Detailed breakdowns of real projects, including challenges faced, solutions implemented, and results achieved.
          </p>
        </motion.div>

        {/* Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((study) => (
            <CaseStudyCard
              key={study.id}
              study={study}
              onClick={() => setSelectedStudy(study)}
            />
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedStudy && (
            <CaseStudyModal
              study={selectedStudy}
              onClose={() => setSelectedStudy(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
