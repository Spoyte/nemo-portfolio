"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag, 
  ExternalLink, 
  Github,
  ChevronRight,
  Lightbulb,
  Wrench,
  Rocket,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Users,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  client: string;
  duration: string;
  role: string;
  team: string;
  year: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    change: string;
  }[];
  process: {
    phase: string;
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
  technologies: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  gallery: string[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    subtitle: "Modern shopping experience with real-time inventory",
    description: "A complete redesign and rebuild of an e-commerce platform serving over 1M monthly active users. The project focused on performance, accessibility, and conversion optimization.",
    thumbnail: "/api/placeholder/800/600",
    client: "RetailCorp Inc.",
    duration: "6 months",
    role: "Lead Frontend Developer",
    team: "8 people",
    year: "2024",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Redis"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    challenge: "The existing platform was built on legacy technology, resulting in slow load times (8+ seconds), poor mobile experience, and declining conversion rates. The client needed a modern solution that could handle high traffic during sales events.",
    solution: "We rebuilt the platform from the ground up using Next.js with server-side rendering for SEO and performance. Implemented a microservices architecture with Redis caching, real-time inventory updates via WebSockets, and a progressive web app for mobile users.",
    results: [
      { metric: "Page Load Time", value: "1.2s", change: "-85%" },
      { metric: "Conversion Rate", value: "4.8%", change: "+120%" },
      { metric: "Mobile Revenue", value: "$2.4M", change: "+200%" },
      { metric: "Core Web Vitals", value: "98/100", change: "Pass" },
    ],
    process: [
      { phase: "01", title: "Discovery", description: "User research, competitor analysis, and technical architecture planning", icon: Lightbulb },
      { phase: "02", title: "Design", description: "UI/UX design system, prototyping, and user testing", icon: Wrench },
      { phase: "03", title: "Development", description: "Agile sprints, code reviews, and continuous integration", icon: Rocket },
      { phase: "04", title: "Launch", description: "Performance optimization, monitoring setup, and gradual rollout", icon: CheckCircle2 },
    ],
    technologies: ["Next.js 14", "TypeScript", "Tailwind CSS", "PostgreSQL", "Redis", "Prisma", "Stripe", "AWS"],
    testimonial: {
      quote: "The new platform exceeded our expectations. Not only is it significantly faster, but our customers love the new mobile experience. Sales have never been better.",
      author: "Sarah Chen",
      role: "CTO",
      company: "RetailCorp Inc.",
    },
    gallery: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
  },
  {
    id: "fintech-dashboard",
    title: "FinTech Dashboard",
    subtitle: "Real-time financial analytics platform",
    description: "A comprehensive financial dashboard providing real-time analytics, portfolio management, and predictive insights for institutional investors.",
    thumbnail: "/api/placeholder/800/600",
    client: "InvestPro Financial",
    duration: "8 months",
    role: "Full Stack Developer",
    team: "12 people",
    year: "2023",
    tags: ["React", "D3.js", "Node.js", "GraphQL"],
    liveUrl: "https://example.com",
    challenge: "Financial institutions needed a unified platform to visualize complex data from multiple sources. The existing tools were fragmented, slow, and difficult to use. Security and real-time updates were critical requirements.",
    solution: "Built a real-time dashboard with WebSocket connections for live market data. Implemented complex D3.js visualizations for portfolio analysis, risk assessment charts, and predictive modeling. Added role-based access control and audit logging for compliance.",
    results: [
      { metric: "Data Processing", value: "10ms", change: "-95%" },
      { metric: "User Adoption", value: "94%", change: "+60%" },
      { metric: "Report Time", value: "2min", change: "-90%" },
      { metric: "Client Retention", value: "98%", change: "+25%" },
    ],
    process: [
      { phase: "01", title: "Research", description: "Stakeholder interviews, data source analysis, compliance requirements", icon: Lightbulb },
      { phase: "02", title: "Architecture", description: "System design, database schema, API specifications", icon: Wrench },
      { phase: "03", title: "Build", description: "Frontend components, backend services, integration testing", icon: Rocket },
      { phase: "04", title: "Deploy", description: "Security audit, load testing, production deployment", icon: CheckCircle2 },
    ],
    technologies: ["React", "D3.js", "Node.js", "GraphQL", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
    testimonial: {
      quote: "This dashboard has transformed how our analysts work. What used to take hours now takes minutes. The real-time capabilities give us a competitive edge.",
      author: "Michael Roberts",
      role: "Head of Analytics",
      company: "InvestPro Financial",
    },
    gallery: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
  },
  {
    id: "healthcare-app",
    title: "Healthcare App",
    subtitle: "Patient management and telemedicine platform",
    description: "A HIPAA-compliant healthcare platform enabling remote consultations, patient management, and electronic health records for a network of 500+ clinics.",
    thumbnail: "/api/placeholder/800/600",
    client: "MediCare Network",
    duration: "10 months",
    role: "Technical Lead",
    team: "15 people",
    year: "2023",
    tags: ["React Native", "Node.js", "MongoDB", "WebRTC"],
    liveUrl: "https://example.com",
    challenge: "Healthcare providers needed a secure, reliable platform for telemedicine during the pandemic. The solution had to be HIPAA compliant, support video consultations, and integrate with existing EHR systems.",
    solution: "Developed a cross-platform mobile app with React Native and a robust backend with Node.js. Implemented end-to-end encryption, WebRTC for video calls, and seamless EHR integration. Added offline support for rural areas with poor connectivity.",
    results: [
      { metric: "Consultations", value: "50K+", change: "Monthly" },
      { metric: "Patient Satisfaction", value: "4.8/5", change: "+40%" },
      { metric: "Wait Time", value: "5min", change: "-80%" },
      { metric: "Provider Efficiency", value: "+45%", change: "Improvement" },
    ],
    process: [
      { phase: "01", title: "Compliance", description: "HIPAA requirements, security audit, data flow analysis", icon: Lightbulb },
      { phase: "02", title: "Design", description: "UX for patients and providers, accessibility testing", icon: Wrench },
      { phase: "03", title: "Develop", description: "Mobile app, backend API, video infrastructure", icon: Rocket },
      { phase: "04", title: "Validate", description: "Security testing, clinical trials, FDA documentation", icon: CheckCircle2 },
    ],
    technologies: ["React Native", "Node.js", "MongoDB", "WebRTC", "AWS", "Twilio", "SendGrid", "HIPAA"],
    testimonial: {
      quote: "This platform has been a game-changer for our network. We've been able to serve patients in remote areas who previously had no access to specialists.",
      author: "Dr. Emily Watson",
      role: "Medical Director",
      company: "MediCare Network",
    },
    gallery: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
  },
];

function CaseStudyCard({ study, onClick, index }: { study: CaseStudy; onClick: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-primary/20">{study.title[0]}</div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2">
              {study.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span>{study.year}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{study.duration}</span>
          </div>
          
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {study.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {study.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{study.client}</span>
            <Button variant="ghost" size="sm" className="group/btn">
              View Case Study
              <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CaseStudyDetail({ study, onBack }: { study: CaseStudy; onBack: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
    >
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* Header */}
      <motion.div
        style={{ opacity: headerOpacity, scale: headerScale }}
        className="relative h-[60vh] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-orange-500/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[20rem] font-bold text-primary/5">{study.title[0]}</div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Button variant="secondary" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {study.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{study.title}</h1>
            <p className="text-xl text-muted-foreground">{study.subtitle}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="p-4 rounded-xl bg-card border">
            <p className="text-sm text-muted-foreground mb-1">Client</p>
            <p className="font-semibold">{study.client}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border">
            <p className="text-sm text-muted-foreground mb-1">Duration</p>
            <p className="font-semibold">{study.duration}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border">
            <p className="text-sm text-muted-foreground mb-1">Role</p>
            <p className="font-semibold">{study.role}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border">
            <p className="text-sm text-muted-foreground mb-1">Team</p>
            <p className="font-semibold">{study.team}</p>
          </div>
        </div>
        
        {/* Challenge & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-red-500">The Challenge</h3>
            </div>
            <p className="text-muted-foreground">{study.challenge}</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-green-500">The Solution</h3>
            </div>
            <p className="text-muted-foreground">{study.solution}</p>
          </div>
        </div>
        
        {/* Results */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Results
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {study.results.map((result, index) => (
              <motion.div
                key={result.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border text-center"
              >
                <p className="text-sm text-muted-foreground mb-2">{result.metric}</p>
                <p className="text-3xl font-bold text-primary mb-1">{result.value}</p>
                <Badge variant="outline" className="text-green-500">{result.change}</Badge>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Process */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Process</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {study.process.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-2xl font-bold text-muted-foreground">{step.phase}</span>
                  </div>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Technologies */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Technologies Used</h3>
          <div className="flex flex-wrap gap-2">
            {study.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Testimonial */}
        
        {study.testimonial && (
          <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border">
            <blockquote className="text-xl italic mb-6">
              "{study.testimonial.quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">{study.testimonial.author[0]}</span>
              </div>
              <div>
                <p className="font-semibold">{study.testimonial.author}</p>
                <p className="text-sm text-muted-foreground">
                  {study.testimonial.role}, {study.testimonial.company}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Links */}
        <div className="flex flex-wrap gap-4">
          {study.liveUrl && (
            <Button asChild>
              <a href={study.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Site
              </a>
            </Button>
          )}
          
          {study.githubUrl && (
            <Button variant="outline" asChild>
              <a href={study.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CasesPage() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Selected Work</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Case{" "}
            <span className="text-gradient-animated">Studies</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep dives into my most impactful projects. Explore the challenges, 
            solutions, and results that drove success.
          </p>
        </motion.div>
        
        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <CaseStudyCard
              key={study.id}
              study={study}
              onClick={() => setSelectedStudy(study)}
              index={index}
            />
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Want to see more of my work?
          </p>
          <Link href="/projects">
            <Button variant="outline">
              View All Projects
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Detail View */}
      <AnimatePresence>
        {selectedStudy && (
          <CaseStudyDetail
            study={selectedStudy}
            onBack={() => setSelectedStudy(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
