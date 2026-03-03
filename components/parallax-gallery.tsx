"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const PROJECTS = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management and AI-powered recommendations.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    year: "2024",
  },
  {
    title: "AI Dashboard",
    description: "Analytics dashboard with machine learning insights and predictive modeling capabilities.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    tags: ["React", "Python", "TensorFlow", "D3.js"],
    year: "2024",
  },
  {
    title: "Social Media App",
    description: "Real-time social platform with video streaming and end-to-end encrypted messaging.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    tags: ["React Native", "Node.js", "Socket.io", "Redis"],
    year: "2023",
  },
  {
    title: "Design System",
    description: "Comprehensive component library with accessibility-first design principles.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    tags: ["React", "Storybook", "Tailwind", "Figma"],
    year: "2023",
  },
];

export function ParallaxGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className="space-y-32 py-20">
      {PROJECTS.map((project, index) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          [100 * (index % 2 === 0 ? 1 : -1), -100 * (index % 2 === 0 ? 1 : -1)]
        );

        return (
          <motion.div
            key={project.title}
            style={{ y }}
            className={`flex flex-col ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } gap-8 lg:gap-16 items-center`}
          >
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="absolute bottom-4 left-4 right-4"
                >
                  <span className="text-white/80 text-sm font-medium">{project.year}</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full lg:w-1/2 space-y-4"
            >
              <h3 className="text-3xl lg:text-4xl font-bold">{project.title}</h3>
              <p className="text-lg text-muted-foreground">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
