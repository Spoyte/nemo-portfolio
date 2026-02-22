"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProjectCaseStudyProps {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  challenges: string[];
  solutions: string[];
  technologies: string[];
  outcomes: string[];
  demoUrl: string;
  repoUrl: string;
  timeline: string;
  role: string;
  team?: string;
}

const CASE_STUDIES: ProjectCaseStudyProps[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory and payment processing.",
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
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Stripe", "AWS"],
    outcomes: [
      "Increased conversion rate by 35%",
      "Reduced cart abandonment by 28%",
      "Achieved sub-2-second page load times",
      "Processed $2M+ in transactions within 6 months",
    ],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    timeline: "4 months",
    role: "Lead Full-Stack Developer",
    team: "4 developers, 1 designer",
  },
  {
    id: "ai-dashboard",
    title: "AI Analytics Dashboard",
    description: "Real-time data visualization with AI-powered insights and predictive analytics.",
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
    technologies: ["React", "Python", "TensorFlow", "D3.js", "Kafka", "PostgreSQL"],
    outcomes: [
      "Reduced decision-making time by 60%",
      "Identified $500K+ in cost savings opportunities",
      "Achieved 94% prediction accuracy",
      "Onboarded 50+ enterprise clients",
    ],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    timeline: "6 months",
    role: "Tech Lead & ML Engineer",
    team: "6 developers, 2 data scientists",
  },
  {
    id: "social-app",
    title: "Social Media App",
    description: "A modern social platform with real-time messaging, stories, and content recommendations.",
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
    technologies: ["React Native", "Firebase", "Redux", "Node.js", "TensorFlow Lite"],
    outcomes: [
      "100K+ downloads in first 3 months",
      "4.8 star rating on App Store",
      "45% daily active user rate",
      "2M+ messages sent daily",
    ],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    timeline: "5 months",
    role: "Mobile Lead Developer",
    team: "3 developers, 1 designer",
  },
];

export function ProjectCaseStudies() {
  return (
    <div className="space-y-20">
      {CASE_STUDIES.map((study, index) => (
        <CaseStudyCard key={study.id} study={study} index={index} />
      ))}
    </div>
  );
}

function CaseStudyCard({ study, index }: { study: ProjectCaseStudyProps; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Section */}
          <div className={`relative aspect-video lg:aspect-auto bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center ${
            index % 2 === 1 ? "lg:order-2" : ""
          }`}>
            <div className="text-center">
              <span className="text-8xl font-bold text-gradient">{study.title[0]}</span>
              <div className="mt-4 flex gap-2 justify-center">
                <Badge variant="secondary">{study.timeline}</Badge>
                <Badge variant="secondary">{study.role}</Badge>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={`p-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
            <div className="flex flex-wrap gap-2 mb-4">
              {study.technologies.map((tech) => (
                <Badge key={tech} variant="outline">{tech}</Badge>
              ))}
            </div>

            <Link href={`/projects/${study.id}`}>
              <h3 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                {study.title}
              </h3>
            </Link>

            <p className="text-muted-foreground mb-6">{study.description}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {study.outcomes.slice(0, 2).map((outcome, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">{outcome}</p>
                </div>
              ))}
            </div>

            {/* Expandable Details */}
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? "auto" : 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-6 border-t border-border">
                <div>
                  <h4 className="font-semibold mb-3">Challenges</h4>
                  <ul className="space-y-2">
                    {study.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Solutions</h4>
                  <ul className="space-y-2">
                    {study.solutions.map((solution, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">→</span>
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Key Outcomes</h4>
                  <ul className="space-y-2">
                    {study.outcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-green-500 mt-1">✓</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-medium text-primary hover:underline"
              >
                {isExpanded ? "Show Less" : "Read Case Study"}
              </button>
              <a
                href={study.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
              <a
                href={study.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
                Source Code
              </a>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
