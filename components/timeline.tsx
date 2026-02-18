"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Rocket, Star } from "lucide-react";

const timelineEvents = [
  {
    year: "2024",
    title: "Senior Frontend Engineer",
    company: "Tech Startup",
    description: "Leading frontend development for a SaaS platform serving 10k+ users.",
    icon: Rocket,
    type: "work",
  },
  {
    year: "2023",
    title: "Full Stack Developer",
    company: "Digital Agency",
    description: "Built web applications for Fortune 500 clients using React and Node.js.",
    icon: Briefcase,
    type: "work",
  },
  {
    year: "2022",
    title: "Open Source Contributor",
    company: "Various Projects",
    description: "Started contributing to open source projects and building personal projects.",
    icon: Star,
    type: "milestone",
  },
  {
    year: "2021",
    title: "Frontend Developer",
    company: "Startup Inc",
    description: "Joined a fast-paced startup and learned to ship features quickly.",
    icon: Briefcase,
    type: "work",
  },
  {
    year: "2020",
    title: "Computer Science Degree",
    company: "University",
    description: "Graduated with honors, specializing in web technologies.",
    icon: GraduationCap,
    type: "education",
  },
  {
    year: "2019",
    title: "First Code",
    company: "Self-Taught",
    description: "Wrote my first line of code and fell in love with programming.",
    icon: Star,
    type: "milestone",
  },
];

export function Timeline() {
  return (
    <div className="max-w-3xl mx-auto">
      {timelineEvents.map((event, index) => (
        <motion.div
          key={event.year}
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="relative pl-8 pb-12 last:pb-0"
        >
          {/* Line */}
          {index !== timelineEvents.length - 1 && (
            <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border" />
          )}

          {/* Dot */}
          <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-card border-2 border-primary flex items-center justify-center">
            <event.icon className="w-4 h-4 text-primary" />
          </div>

          {/* Content */}
          <div className="ml-6">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-2">
              {event.year}
            </span>
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{event.company}</p>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
