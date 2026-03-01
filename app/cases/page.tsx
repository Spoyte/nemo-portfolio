"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  ChevronRight,
  Lightbulb,
  Wrench,
  Rocket,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Layers,
  Database,
  Globe,
  Shield,
  Zap,
  ArrowUpRight,
  Star,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal, SpotlightCard } from "@/components/scroll-animations";
import Link from "next/link";

// Case study data
const CASE_STUDIES = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    subtitle: "Full-stack solution for modern retail",
    client: "RetailTech Inc.",
    duration: "6 months",
    team: "5 developers",
    role: "Lead Full-Stack Developer",
    year: "2024",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
    ],
    overview: "Built a scalable e-commerce platform handling 100K+ daily transactions. The platform features real-time inventory, AI-powered recommendations, and a seamless checkout experience.",
    challenge: "The client needed to migrate from a legacy monolithic system to a modern microservices architecture while maintaining 99.99% uptime during the transition.",
    solution: "We implemented a gradual strangler fig pattern, migrating services one at a time. Used feature flags for safe rollouts and comprehensive monitoring to catch issues early.",
    results: [
      { metric: "40%", label: "Faster checkout", icon: Zap },
      { metric: "99.99%", label: "Uptime achieved", icon: Shield },
      { metric: "2M+", label: "Monthly users", icon: Users },
      { metric: "$50M", label: "Annual revenue", icon: BarChart3 }
    ],
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Redis", "AWS", "Stripe"],
    features: [
      "Real-time inventory management",
      "AI-powered product recommendations",
      "Multi-currency support",
      "Advanced analytics dashboard",
      "Mobile-first responsive design"
    ],
    architecture: [
      { layer: "Frontend", tech: "Next.js 14, Tailwind CSS, Framer Motion", desc: "Server-side rendering for SEO and performance" },
      { layer: "API Gateway", tech: "AWS API Gateway, Lambda", desc: "Serverless API with auto-scaling" },
      { layer: "Services", tech: "Node.js microservices", desc: "Domain-driven design with event sourcing" },
      { layer: "Data", tech: "PostgreSQL, Redis, Elasticsearch", desc: "Multi-tier caching strategy" }
    ],
    lessons: [
      "Event sourcing provides excellent audit trails but increases complexity",
 "Database migration strategies are crucial for zero-downtime deployments",
      "Load testing early revealed bottlenecks we wouldn't have caught otherwise"
    ],
    testimonial: {
      quote: "The team's technical expertise and attention to detail transformed our e-commerce experience. Sales increased by 35% within the first quarter.",
      author: "Sarah Chen",
      role: "CTO, RetailTech Inc."
    },
    links: {
      demo: "#",
      github: "#",
      case: "#"
    }
  },
  {
    id: "ai-dashboard",
    title: "AI Analytics Dashboard",
    subtitle: "Real-time data visualization platform",
    client: "DataFlow Systems",
    duration: "4 months",
    team: "3 developers",
    role: "Frontend Lead",
    year: "2023",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop"
    ],
    overview: "Created an AI-powered analytics dashboard that processes millions of data points in real-time, providing actionable insights through interactive visualizations.",
    challenge: "Visualizing massive datasets (10M+ records) in real-time without compromising browser performance.",
    solution: "Implemented Web Workers for data processing, virtualized lists for rendering, and used canvas-based charts for complex visualizations.",
    results: [
      { metric: "10M+", label: "Records processed", icon: Database },
      { metric: "60fps", label: "Rendering performance", icon: Zap },
      { metric: "3x", label: "Faster insights", icon: Clock },
      { metric: "95%", label: "User satisfaction", icon: Star }
    ],
    technologies: ["React", "D3.js", "WebGL", "Python", "TensorFlow", "WebSocket"],
    features: [
      "Real-time data streaming",
      "Interactive data exploration",
      "Custom report builder",
      "AI anomaly detection",
      "Collaborative annotations"
    ],
    architecture: [
      { layer: "Visualization", tech: "D3.js, WebGL, Canvas", desc: "High-performance rendering" },
      { layer: "State", tech: "Zustand, React Query", desc: "Efficient state management" },
      { layer: "Processing", tech: "Web Workers", desc: "Background data processing" },
      { layer: "ML", tech: "TensorFlow.js", desc: "Client-side predictions" }
    ],
    lessons: [
      "Web Workers are essential for processing large datasets without blocking UI",
      "Virtualization is critical when rendering thousands of DOM nodes",
      "Progressive loading improves perceived performance significantly"
    ],
    testimonial: {
      quote: "The dashboard's performance is incredible. We can now analyze data in real-time that used to take hours to process.",
      author: "Michael Torres",
      role: "VP of Engineering, DataFlow"
    },
    links: {
      demo: "#",
      github: "#",
      case: "#"
    }
  },
  {
    id: "social-platform",
    title: "Social Media Platform",
    subtitle: "Community-driven content platform",
    client: "ConnectSocial",
    duration: "8 months",
    team: "8 developers",
    role: "Full-Stack Developer",
    year: "2023",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=400&fit=crop"
    ],
    overview: "Built a social platform with real-time messaging, stories, live streaming, and content recommendations serving 500K+ active users.",
    challenge: "Building real-time features at scale while maintaining low latency across global regions.",
    solution: "Used WebRTC for video, Socket.io for real-time messaging, and a CDN for content delivery. Implemented smart caching strategies.",
    results: [
      { metric: "500K+", label: "Active users", icon: Users },
      { metric: "50ms", label: "Message latency", icon: Zap },
      { metric: "10M", label: "Messages daily", icon: Globe },
      { metric: "4.8★", label: "App store rating", icon: Star }
    ],
    technologies: ["React Native", "Node.js", "Socket.io", "Redis", "AWS", "WebRTC"],
    features: [
      "Real-time messaging",
      "Stories and live streaming",
      "Content recommendation engine",
      "End-to-end encryption",
      "Cross-platform mobile apps"
    ],
    architecture: [
      { layer: "Mobile", tech: "React Native, Expo", desc: "Cross-platform development" },
      { layer: "Real-time", tech: "Socket.io, Redis Pub/Sub", desc: "Event-driven architecture" },
      { layer: "Media", tech: "WebRTC, AWS S3", desc: "Video streaming and storage" },
      { layer: "ML", tech: "Python, scikit-learn", desc: "Recommendation engine" }
    ],
    lessons: [
      "Real-time systems require careful handling of connection state",
      "Media processing is resource-intensive; offload to edge servers",
      "Content moderation at scale requires automated ML solutions"
    ],
    testimonial: {
      quote: "The platform exceeded our expectations. The real-time features feel instant and the app handles our growing user base effortlessly.",
      author: "Emily Watson",
      role: "Product Manager, ConnectSocial"
    },
    links: {
      demo: "#",
      github: "#",
      case: "#"
    }
  }
];

function CaseStudyCard({ study, onClick }: { study: typeof CASE_STUDIES[0]; onClick: () => void }) {
  return (
    <SpotlightCard>
      <motion.div
        whileHover={{ y: -8 }}
        onClick={onClick}
        className="cursor-pointer group"
      >
        <Card className="overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={study.thumbnail}
              alt={study.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="mb-2">{study.year}</Badge>
              <h3 className="text-xl font-bold text-white">{study.title}</h3>
              <p className="text-white/80 text-sm">{study.subtitle}</p>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {study.technologies.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {study.overview}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {study.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {study.team}
                </span>
              </div>
              
              <Button variant="ghost" size="sm" className="group/btn">
                View Case
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </SpotlightCard>
  );
}

function CaseStudyDetail({ study, onBack }: { study: typeof CASE_STUDIES[0]; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden">
        <img
          src={study.thumbnail}
          alt={study.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <Button variant="secondary" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge>{study.year}</Badge>
            <Badge variant="secondary">{study.client}</Badge>
            <span className="text-muted-foreground">{study.role}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{study.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">{study.subtitle}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {study.results.map((result, index) => (
          <motion.div
            key={result.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <result.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="text-3xl font-bold">{result.metric}</p>
                <p className="text-sm text-muted-foreground">{result.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="solution">Solution</TabsTrigger>
          <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    The Challenge
                  </h3>
                  <p className="text-muted-foreground">{study.challenge}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-blue-500" />
                    The Solution
                  </h3>
                  <p className="text-muted-foreground">{study.solution}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {study.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Project Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client</span>
                      <span className="font-medium">{study.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{study.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Team</span>
                      <span className="font-medium">{study.team}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role</span>
                      <span className="font-medium">{study.role}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {study.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5">
                <CardContent className="p-6">
                  <blockquote className="text-sm italic mb-4">
                    "{study.testimonial.quote}"
                  </blockquote>
                  <div>
                    <p className="font-medium">{study.testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{study.testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="solution">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Architecture Overview</h3>
              
              <div className="space-y-6">
                {study.architecture.map((layer, index) => (
                  <motion.div
                    key={layer.layer}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 rounded-xl bg-muted/50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{layer.layer}</h4>
                      <p className="text-sm font-medium text-primary mb-1">{layer.tech}</p>
                      <p className="text-sm text-muted-foreground">{layer.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Lessons Learned</h3>
                <ul className="space-y-3">
                  {study.lessons.map((lesson, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tech">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {study.technologies.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{tech}</h3>
                      <p className="text-sm text-muted-foreground">Core technology</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {study.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl overflow-hidden"
              >
                <img
                  src={image}
                  alt={`${study.title} screenshot ${index + 1}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA */}
      <div className="flex flex-wrap gap-4 justify-center pt-8">
        <Button size="lg" className="gap-2">
          <ExternalLink className="w-4 h-4" />
          View Live Demo
        </Button>
        
        <Button size="lg" variant="outline" className="gap-2">
          <Github className="w-4 h-4" />
          View Code
        </Button>
      </div>
    </motion.div>
  );
}

export default function CaseStudiesPage() {
  const [selectedStudy, setSelectedStudy] = useState<typeof CASE_STUDIES[0] | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {selectedStudy ? (
            <CaseStudyDetail
              key="detail"
              study={selectedStudy}
              onBack={() => setSelectedStudy(null)}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <ScrollReveal className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">Portfolio</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Case{" "}
                  <span className="text-gradient-animated">Studies</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Deep dives into my most impactful projects. Explore the challenges, 
                  solutions, and results from real-world development work.
                </p>
              </ScrollReveal>

              {/* Case Studies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CASE_STUDIES.map((study, index) => (
                  <ScrollReveal key={study.id} delay={index * 0.1}>
                    <CaseStudyCard
                      study={study}
                      onClick={() => setSelectedStudy(study)}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
