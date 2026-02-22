"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Rocket, 
  Code2, 
  Star,
  Calendar,
  MapPin,
  ExternalLink,
  Github,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineEvent {
  id: string;
  year: string;
  month?: string;
  title: string;
  organization: string;
  description: string;
  type: "work" | "education" | "project" | "milestone";
  icon?: React.ElementType;
  tags?: string[];
  links?: { label: string; url: string; icon?: React.ElementType }[];
  highlights?: string[];
}

const journeyEvents: TimelineEvent[] = [
  {
    id: "1",
    year: "2024",
    month: "Present",
    title: "Senior Frontend Engineer",
    organization: "TechCorp Inc.",
    description: "Leading frontend architecture decisions, mentoring team of 5 developers, and driving performance optimization initiatives.",
    type: "work",
    icon: Briefcase,
    tags: ["React", "Next.js", "TypeScript", "Leadership"],
    highlights: [
      "Reduced bundle size by 40% through code splitting",
      "Implemented design system used across 3 products",
      "Mentored 3 junior developers to promotion"
    ]
  },
  {
    id: "2",
    year: "2024",
    month: "March",
    title: "Open Source Contributor",
    organization: "Various Projects",
    description: "Started contributing to open source projects, focusing on React ecosystem tools and accessibility libraries.",
    type: "milestone",
    icon: Star,
    tags: ["Open Source", "Community"],
    links: [
      { label: "GitHub", url: "https://github.com", icon: Github }
    ],
    highlights: [
      "50+ merged PRs across 12 projects",
      "Created popular React hook library",
      "Speaker at ReactConf 2024"
    ]
  },
  {
    id: "3",
    year: "2022",
    month: "June",
    title: "Full Stack Developer",
    organization: "StartupXYZ",
    description: "Joined early-stage startup as employee #10. Built core product features and scaled infrastructure.",
    type: "work",
    icon: Rocket,
    tags: ["Node.js", "PostgreSQL", "AWS", "GraphQL"],
    highlights: [
      "Built MVP from scratch in 3 months",
      "Scaled to 100K users",
      "Implemented CI/CD pipeline"
    ]
  },
  {
    id: "4",
    year: "2021",
    month: "September",
    title: "AWS Certified Developer",
    organization: "Amazon Web Services",
    description: "Earned professional certification in cloud architecture and serverless technologies.",
    type: "milestone",
    icon: Award,
    tags: ["AWS", "Cloud", "Certification"]
  },
  {
    id: "5",
    year: "2020",
    month: "January",
    title: "Frontend Developer",
    organization: "Digital Agency",
    description: "Developed websites and applications for diverse clients across e-commerce, healthcare, and finance sectors.",
    type: "work",
    icon: Code2,
    tags: ["Vue.js", "WordPress", "Shopify", "Animation"],
    highlights: [
      "Delivered 20+ client projects",
      "99% client satisfaction rate",
      "Won agency's 'Rising Star' award"
    ]
  },
  {
    id: "6",
    year: "2019",
    month: "May",
    title: "Computer Science Degree",
    organization: "University of Technology",
    description: "Graduated with First Class Honors. Specialized in Human-Computer Interaction and Web Technologies.",
    type: "education",
    icon: GraduationCap,
    tags: ["HCI", "Algorithms", "Web Dev"],
    highlights: [
      "GPA: 3.9/4.0",
      "Best Capstone Project Award",
      "Published research paper on UX"
    ]
  },
  {
    id: "7",
    year: "2017",
    month: "August",
    title: "First Line of Code",
    organization: "Self-Taught",
    description: "Started learning HTML and CSS. Built my first website - a personal blog about tech discoveries.",
    type: "milestone",
    icon: Code2,
    tags: ["HTML", "CSS", "Beginnings"],
    highlights: [
      "Learned from freeCodeCamp and MDN",
      "Built 10+ practice projects",
      "Joined local dev community"
    ]
  }
];

const typeColors = {
  work: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  education: "bg-green-500/10 text-green-500 border-green-500/20",
  project: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  milestone: "bg-orange-500/10 text-orange-500 border-orange-500/20"
};

const typeIcons = {
  work: Briefcase,
  education: GraduationCap,
  project: Code2,
  milestone: Star
};

function TimelineNode({ event, index }: { event: TimelineEvent; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = event.icon || typeIcons[event.type];
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex items-start gap-8 mb-16 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Empty space for alternating layout */}
      <div className="hidden md:block md:w-1/2" />

      {/* Center node */}
      <div className="absolute left-4 md:left-1/2 flex items-center justify-center z-10 md:-translate-x-1/2">
        <motion.div
          whileHover={{ scale: 1.2 }}
          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${typeColors[event.type]}`}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
      </div>

      {/* Content card */}
      <Card 
        className={`ml-16 md:ml-0 md:w-1/2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
          isEven ? "md:pr-12" : "md:pl-12"
        } ${isExpanded ? "ring-2 ring-primary/20" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={typeColors[event.type]}>
                  {event.year}
                </Badge>
                {event.month && (
                  <span className="text-sm text-muted-foreground">{event.month}</span>
                )}
              </div>
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.organization}</p>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4">{event.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Expanded content */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
            className="overflow-hidden"
          >
            {event.highlights && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Highlights</h4>
                <ul className="space-y-1">
                  {event.highlights.map((highlight, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.links && (
              <div className="flex gap-2">
                {event.links.map((link) => (
                  <Button key={link.label} variant="outline" size="sm" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.icon && <link.icon className="h-4 w-4 mr-1" />}
                      {link.label}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative">
      {/* Progress line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-muted rounded-full md:-translate-x-1/2 overflow-hidden">
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-gradient-to-b from-primary via-orange-500 to-primary rounded-full"
        />
      </div>

      {/* Timeline events */}
      <div className="relative">
        {journeyEvents.map((event, index) => (
          <TimelineNode key={event.id} event={event} index={index} />
        ))}
      </div>

      {/* End marker */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="absolute left-4 md:left-1/2 bottom-0 -translate-x-1/2"
      >
        <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
      </motion.div>
    </div>
  );
}

export function JourneyStats() {
  const stats = [
    { label: "Years Experience", value: 7, suffix: "+" },
    { label: "Projects Completed", value: 50, suffix: "+" },
    { label: "Technologies", value: 30, suffix: "+" },
    { label: "Coffee Consumed", value: 1000, suffix: "+" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="p-6 rounded-xl border border-border bg-card text-center"
        >
          <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
