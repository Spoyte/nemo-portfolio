"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Rocket, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Award,
  Star,
  Zap,
  Coffee,
  Heart,
  Sparkles,
  ChevronRight,
  Calendar,
  MapPin
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineEvent {
  id: string;
  year: string;
  month: string;
  title: string;
  description: string;
  type: "work" | "education" | "achievement" | "milestone";
  icon: React.ElementType;
  color: string;
  details?: string[];
  technologies?: string[];
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    year: "2024",
    month: "Present",
    title: "Senior Frontend Developer",
    description: "Leading frontend architecture for enterprise applications serving millions of users. Mentoring junior developers and driving technical decisions.",
    type: "work",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    details: [
      "Led migration to Next.js 14, improving performance by 40%",
      "Built design system used across 12 products",
      "Mentored team of 5 junior developers",
    ],
    technologies: ["Next.js", "TypeScript", "GraphQL", "AWS"],
  },
  {
    id: "2",
    year: "2024",
    month: "Mar",
    title: "Open Source Recognition",
    description: "React component library reached 10k+ stars on GitHub. Featured in multiple newsletters and tech blogs.",
    type: "achievement",
    icon: Award,
    color: "from-yellow-500 to-orange-500",
    details: [
      "10,000+ GitHub stars",
      "Featured in React Weekly",
      "Used by 500+ projects",
    ],
  },
  {
    id: "3",
    year: "2023",
    month: "Jun",
    title: "Tech Conference Speaker",
    description: "Presented on 'Building Accessible Design Systems' at ReactConf. Talk received 95% positive feedback.",
    type: "milestone",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    details: [
      "500+ attendees",
      "Live coding demonstration",
      "Q&A session",
    ],
  },
  {
    id: "4",
    year: "2022",
    month: "Sep",
    title: "Full Stack Developer",
    description: "Joined fast-growing startup as employee #20. Built core product features from scratch.",
    type: "work",
    icon: Code2,
    color: "from-emerald-500 to-teal-500",
    details: [
      "Built real-time collaboration features",
      "Implemented CI/CD pipelines",
      "Reduced build times by 60%",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
  },
  {
    id: "5",
    year: "2021",
    month: "Jan",
    title: "First Freelance Client",
    description: "Landed first major freelance project. Delivered e-commerce platform that generated $2M in first year.",
    type: "milestone",
    icon: Rocket,
    color: "from-red-500 to-pink-500",
    details: [
      "$2M revenue generated",
      "99.9% uptime",
      "4.8/5 customer rating",
    ],
  },
  {
    id: "6",
    year: "2020",
    month: "May",
    title: "Frontend Developer",
    description: "First professional role at digital agency. Worked with Fortune 500 clients on responsive web applications.",
    type: "work",
    icon: Briefcase,
    color: "from-blue-500 to-indigo-500",
    details: [
      "Delivered 20+ projects",
      "Learned agile methodologies",
      "Cross-functional collaboration",
    ],
    technologies: ["JavaScript", "React", "CSS", "Sass"],
  },
  {
    id: "7",
    year: "2019",
    month: "Aug",
    title: "Computer Science Degree",
    description: "Graduated with honors from University of Technology. Specialized in Human-Computer Interaction.",
    type: "education",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
    details: [
      "GPA: 3.9/4.0",
      "Dean's List all semesters",
      "Senior project: AI-powered study assistant",
    ],
  },
  {
    id: "8",
    year: "2017",
    month: "Jan",
    title: "First Line of Code",
    description: "Wrote first HTML page and fell in love with programming. The beginning of an incredible journey.",
    type: "milestone",
    icon: Coffee,
    color: "from-amber-500 to-yellow-500",
    details: [
      "Self-taught through online resources",
      "Built first website in a weekend",
      "Joined coding communities",
    ],
  },
];

export function AnimatedJourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const springLineHeight = useSpring(lineHeight, { stiffness: 100, damping: 30 });

  return (
    <div className="w-full max-w-6xl mx-auto py-20" ref={containerRef}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">My Journey</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          The Path So <span className="text-gradient-animated">Far</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A visual timeline of my career progression, achievements, and the moments that shaped who I am today.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Center Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2">
          <motion.div
            style={{ height: springLineHeight }}
            className="w-full bg-gradient-to-b from-primary via-purple-500 to-orange-500"
          />
        </div>

        {/* Events */}
        <div className="space-y-12">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon;
            const isEven = index % 2 === 0;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative flex items-start gap-4 md:gap-8 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-background z-10 md:-translate-x-1/2"
                >
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${event.color}`} />
                </motion.div>

                {/* Content Card */}
                <div className={`ml-12 md:ml-0 md:w-[calc(50%-3rem)] ${
                  isEven ? "md:pr-8 md:text-right" : "md:pl-8"
                }`}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => setSelectedEvent(event)}
                    className="cursor-pointer group"
                  >
                    <Card className={`overflow-hidden transition-all duration-300 ${
                      isHovered ? "shadow-xl border-primary/30" : ""
                    }`}>
                      <CardContent className="p-6">
                        {/* Date Badge */}
                        <div className={`flex items-center gap-2 mb-3 ${isEven ? "md:justify-end" : ""}`}>
                          <Badge variant="outline" className="text-xs">
                            {event.month} {event.year}
                          </Badge>
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${event.color}`}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm mb-4">
                          {event.description}
                        </p>

                        {/* Technologies */}
                        {event.technologies && (
                          <div className={`flex flex-wrap gap-1.5 ${isEven ? "md:justify-end" : ""}`}>
                            {event.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* View Details */}
                        <div className={`mt-4 flex items-center gap-1 text-sm text-primary ${isEven ? "md:justify-end" : ""}`}>
                          <span>View details</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card border rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className={`p-6 bg-gradient-to-br ${selectedEvent.color}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                      <selectedEvent.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                      <p className="text-white/80">
                        {selectedEvent.month} {selectedEvent.year}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <p className="text-muted-foreground">{selectedEvent.description}</p>

                {selectedEvent.details && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {selectedEvent.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEvent.technologies && (
                  <div>
                    <h4 className="font-semibold mb-3">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
