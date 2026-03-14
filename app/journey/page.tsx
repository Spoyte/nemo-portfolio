"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Award,
  Rocket,
  Star,
  Calendar,
  MapPin,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Code2,
  Palette,
  Zap,
  Globe,
  Heart,
  Trophy,
  Target,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineEvent {
  id: string;
  year: string;
  month: string;
  title: string;
  organization: string;
  description: string;
  type: "work" | "education" | "achievement" | "project";
  icon: React.ElementType;
  location?: string;
  tags?: string[];
  link?: string;
  highlights?: string[];
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    year: "2024",
    month: "Present",
    title: "Senior Frontend Developer",
    organization: "TechCorp Inc.",
    description: "Leading frontend architecture decisions, mentoring junior developers, and driving technical excellence across multiple product teams.",
    type: "work",
    icon: Briefcase,
    location: "San Francisco, CA",
    tags: ["React", "TypeScript", "Next.js", "Leadership"],
    highlights: [
      "Reduced bundle size by 40% through code splitting",
      "Mentored 5 junior developers",
      "Led migration to Next.js 14",
    ],
  },
  {
    id: "2",
    year: "2024",
    month: "March",
    title: "Open Source Contributor",
    organization: "Various Projects",
    description: "Started contributing to open source projects, focusing on React ecosystem tools and developer experience improvements.",
    type: "achievement",
    icon: Heart,
    tags: ["Open Source", "Community"],
    highlights: [
      "100+ contributions on GitHub",
      "Created 3 popular npm packages",
      "Speaker at React Conf",
    ],
  },
  {
    id: "3",
    year: "2022",
    month: "June",
    title: "Full Stack Developer",
    organization: "StartupXYZ",
    description: "Built scalable web applications from scratch, implemented CI/CD pipelines, and established engineering best practices.",
    type: "work",
    icon: Rocket,
    location: "Remote",
    tags: ["Node.js", "PostgreSQL", "AWS", "Docker"],
    highlights: [
      "Built product from 0 to 10k users",
      "Implemented microservices architecture",
      "99.9% uptime achievement",
    ],
  },
  {
    id: "4",
    year: "2021",
    month: "December",
    title: "Best Web Application Award",
    organization: "Tech Awards 2021",
    description: "Recognized for creating an innovative healthcare management system with exceptional UX.",
    type: "achievement",
    icon: Trophy,
    tags: ["Award", "Healthcare", "UX Design"],
  },
  {
    id: "5",
    year: "2020",
    month: "January",
    title: "Frontend Developer",
    organization: "Digital Agency",
    description: "Developed responsive websites and web applications for diverse clients across various industries including e-commerce and fintech.",
    type: "work",
    icon: Code2,
    location: "New York, NY",
    tags: ["JavaScript", "CSS", "WordPress", "Shopify"],
    highlights: [
      "Delivered 20+ client projects",
      "5-star client satisfaction rating",
    ],
  },
  {
    id: "6",
    year: "2019",
    month: "May",
    title: "B.S. Computer Science",
    organization: "University of Technology",
    description: "Graduated with honors, specialized in Human-Computer Interaction and Web Technologies. Capstone project on accessibility in web apps.",
    type: "education",
    icon: GraduationCap,
    location: "Boston, MA",
    tags: ["HCI", "Web Technologies", "Dean's List"],
    highlights: [
      "GPA: 3.8/4.0",
      "Dean's List all semesters",
      "Best Capstone Project Award",
    ],
  },
  {
    id: "7",
    year: "2018",
    month: "Summer",
    title: "Software Engineering Intern",
    organization: "BigTech Co.",
    description: "First internship experience working on internal tools and learning industry best practices.",
    type: "work",
    icon: Briefcase,
    location: "Seattle, WA",
    tags: ["Java", "Spring Boot", "Agile"],
  },
  {
    id: "8",
    year: "2017",
    month: "January",
    title: "First Line of Code",
    organization: "Self-Taught",
    description: "Started learning programming with HTML, CSS, and JavaScript. Built my first website - a personal blog about tech discoveries.",
    type: "project",
    icon: Sparkles,
    tags: ["HTML", "CSS", "JavaScript"],
    highlights: [
      "Built first website in 2 weeks",
      "Learned from online resources",
      "Discovered passion for web dev",
    ],
  },
];

const typeColors = {
  work: "bg-blue-500",
  education: "bg-green-500",
  achievement: "bg-yellow-500",
  project: "bg-purple-500",
};

const typeLabels = {
  work: "Work",
  education: "Education",
  achievement: "Achievement",
  project: "Project",
};

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const Icon = event.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex items-start gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* Content */}
      <div className={`flex-1 ${isEven ? "md:text-right" : ""}`}>
        <Card className="group overflow-hidden hover:border-primary/50 transition-all">
          <CardContent className="p-6">
            <div className={`flex items-start gap-4 ${isEven ? "md:flex-row-reverse" : ""}`}>
              <div className={`flex-1 ${isEven ? "md:text-right" : ""}`}>
                {/* Date Badge */}
                <div className={`flex items-center gap-2 mb-3 ${isEven ? "md:justify-end" : ""}`}>
                  <Badge variant="outline" className="font-mono">
                    <Calendar className="h-3 w-3 mr-1" />
                    {event.month} {event.year}
                  </Badge>
                  <Badge className={typeColors[event.type]}>
                    {typeLabels[event.type]}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {event.organization}
                </p>

                <p className="text-muted-foreground mb-4">{event.description}</p>

                {event.location && (
                  <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-3 ${isEven ? "md:justify-end" : ""}`}>
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                )}

                {event.tags && (
                  <div className={`flex flex-wrap gap-2 mb-4 ${isEven ? "md:justify-end" : ""}`}>
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {event.highlights && (
                  <div className={`space-y-1 ${isEven ? "md:text-right" : ""}`}>
                    {event.highlights.map((highlight, i) => (
                      <div key={i} className={`flex items-center gap-2 text-sm text-muted-foreground ${isEven ? "md:flex-row-reverse" : ""}`}>
                        <Star className="h-3 w-3 text-primary" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                )}

                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline ${isEven ? "md:flex-row-reverse" : ""}`}
                  >
                    Learn more
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className={`hidden md:flex w-12 h-12 rounded-xl items-center justify-center flex-shrink-0 ${typeColors[event.type]} bg-opacity-20`}
                style={{ backgroundColor: `${typeColors[event.type].replace("bg-", "")}20` }}
              >
                <Icon className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Center Line */}
      <div className="hidden md:flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
        <div className="w-px flex-1 bg-border" />
      </div>

      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}

export default function JourneyPage() {
  const [filter, setFilter] = useState<"all" | TimelineEvent["type"]>("all");

  const filteredEvents = filter === "all" 
    ? timelineEvents 
    : timelineEvents.filter((e) => e.type === filter);

  const stats = [
    { label: "Years Experience", value: "7+", icon: Calendar },
    { label: "Companies", value: "4", icon: Briefcase },
    { label: "Projects", value: "50+", icon: Rocket },
    { label: "Awards", value: "5", icon: Trophy },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">My Journey</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Development <span className="text-gradient-animated">Timeline</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A visual journey through my career, from writing my first line of code to becoming a senior developer.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 text-center">
              <stat.icon className="h-6 w-6 mx-auto mb-3 text-primary" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {[
            { id: "all", label: "All", icon: Globe },
            { id: "work", label: "Work", icon: Briefcase },
            { id: "education", label: "Education", icon: GraduationCap },
            { id: "achievement", label: "Achievements", icon: Trophy },
            { id: "project", label: "Projects", icon: Rocket },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:border-primary/50"
              }`}
            >
              <f.icon className="h-4 w-4" />
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <TimelineCard event={event} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Let&apos;s Create Something Together</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Interested in working together? I&apos;m always open to discussing new projects and opportunities.
            </p>
            <Button size="lg">
              Get in Touch
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
