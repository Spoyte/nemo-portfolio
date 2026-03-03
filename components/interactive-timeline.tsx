"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, GraduationCap, Award, Rocket } from "lucide-react";

const TIMELINE_EVENTS = [
  {
    year: "2024",
    title: "Senior Developer",
    company: "Tech Innovations Inc.",
    description: "Leading frontend development for enterprise applications",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
  },
  {
    year: "2023",
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    description: "Built scalable web applications serving millions of users",
    icon: Rocket,
    color: "from-purple-500 to-pink-500",
  },
  {
    year: "2022",
    title: "Frontend Developer",
    company: "Creative Agency",
    description: "Crafted beautiful user interfaces for global brands",
    icon: Award,
    color: "from-orange-500 to-yellow-500",
  },
  {
    year: "2021",
    title: "Junior Developer",
    company: "Startup Hub",
    description: "Started professional journey in web development",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
  },
  {
    year: "2020",
    title: "Computer Science Degree",
    company: "University",
    description: "Graduated with honors in Software Engineering",
    icon: GraduationCap,
    color: "from-red-500 to-rose-500",
  },
];

export function InteractiveTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative py-20">
      {/* Center Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden lg:block">
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-gradient-to-b from-primary to-orange-500"
        />
      </div>

      {/* Events */}
      <div className="space-y-16 lg:space-y-24">
        {TIMELINE_EVENTS.map((event, index) => {
          const Icon = event.icon;
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              {/* Content Card */}
              <div className={`w-full lg:w-5/12 ${isLeft ? "lg:text-right" : "lg:text-left"}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group"
                >
                  <span className="text-3xl font-bold text-gradient">{event.year}</span>
                  <h3 className="text-xl font-semibold mt-2">{event.title}</h3>
                  <p className="text-primary font-medium">{event.company}</p>
                  <p className="text-muted-foreground mt-2">{event.description}</p>
                </motion.div>
              </div>

              {/* Center Icon */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {/* Empty Space for Layout */}
              <div className="hidden lg:block lg:w-5/12" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
