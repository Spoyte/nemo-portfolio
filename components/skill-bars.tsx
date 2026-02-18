"use client";

import { motion } from "framer-motion";

const skills = [
  { name: "React / Next.js", level: 95, category: "Frontend" },
  { name: "TypeScript", level: 90, category: "Languages" },
  { name: "Node.js", level: 85, category: "Backend" },
  { name: "Python", level: 80, category: "Languages" },
  { name: "PostgreSQL", level: 75, category: "Database" },
  { name: "Docker / K8s", level: 70, category: "DevOps" },
  { name: "AWS / Cloud", level: 75, category: "DevOps" },
  { name: "Figma / Design", level: 85, category: "Design" },
];

const categories = ["All", "Frontend", "Backend", "Languages", "Database", "DevOps", "Design"];

export function SkillBars() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills = activeCategory === "All" 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="space-y-6">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className="flex justify-between mb-2">
              <span className="font-medium">{skill.name}</span>
              <span className="text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tech Stack Icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <h3 className="text-center text-lg font-semibold mb-8">Tech Stack</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {[
            "React", "Next.js", "TS", "Node", "Python", "Go",
            "Rust", "SQL", "Docker", "AWS", "Git", "Figma"
          ].map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="aspect-square rounded-xl bg-card border border-border flex items-center justify-center text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-default"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Add the missing import
import { useState } from "react";
