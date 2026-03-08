"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Palette, 
  Database, 
  Cloud, 
  Smartphone, 
  Terminal,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { ScrollReveal } from "./scroll-animations";

interface Skill {
  name: string;
  level: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

const skills: Skill[] = [
  {
    name: "Frontend Development",
    level: 95,
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    description: "React, Next.js, TypeScript, Tailwind CSS",
  },
  {
    name: "UI/UX Design",
    level: 88,
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    description: "Figma, Design Systems, Prototyping",
  },
  {
    name: "Backend Development",
    level: 82,
    icon: Database,
    color: "from-green-500 to-emerald-500",
    description: "Node.js, PostgreSQL, GraphQL, Prisma",
  },
  {
    name: "Cloud & DevOps",
    level: 75,
    icon: Cloud,
    color: "from-orange-500 to-yellow-500",
    description: "AWS, Docker, Vercel, CI/CD",
  },
  {
    name: "Mobile Development",
    level: 70,
    icon: Smartphone,
    color: "from-pink-500 to-rose-500",
    description: "React Native, Expo, Mobile-first Design",
  },
  {
    name: "System Architecture",
    level: 78,
    icon: Terminal,
    color: "from-indigo-500 to-violet-500",
    description: "Microservices, APIs, Scalability",
  },
];

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = skill.icon;

  return (
    <ScrollReveal delay={index * 0.1} direction="left">
      <motion.div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-4 mb-3">
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-br ${skill.color} shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">{skill.name}</h3>
              <motion.span
                className="text-2xl font-bold text-gradient"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
              >
                {skill.level}%
              </motion.span>
            </div>
            <p className="text-sm text-muted-foreground">{skill.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${skill.color}`}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ 
              duration: 1.2, 
              delay: 0.2 + index * 0.1,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              delay: index * 0.2,
            }}
            style={{ left: 0 }}
          />

          {/* Glow effect on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className={`absolute inset-y-0 rounded-full bg-gradient-to-r ${skill.color} blur-md`}
                initial={{ opacity: 0, width: `${skill.level}%` }}
                animate={{ opacity: 0.5, width: `${skill.level}%` }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Level markers */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Beginner</span>
          <span>Intermediate</span>
          <span>Expert</span>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export function SkillsVisualization() {
  const [showAll, setShowAll] = useState(false);
  const displayedSkills = showAll ? skills : skills.slice(0, 4);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Skills & Expertise</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Technical{" "}
            <span className="text-gradient-animated">Proficiency</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Years of experience across the full stack, with a focus on creating
            exceptional user experiences.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {displayedSkills.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} index={index} />
            ))}

            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-4 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                {showAll ? "Show Less" : "View All Skills"}
              </span>
            </motion.button>
          </div>

          <ScrollReveal direction="right" className="relative">
            <div className="sticky top-24">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-orange-500/5 border border-border p-8">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-10 left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-bold mb-6">What I Bring</h3>
                  
                  <div className="space-y-4">
                    {[
                      { label: "Problem Solving", value: 95 },
                      { label: "Code Quality", value: 92 },
                      { label: "Communication", value: 88 },
                      { label: "Learning Speed", value: 90 },
                    ].map((item, i) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{item.label}</span>
                          <span className="text-muted-foreground">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.value}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-border">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Years Experience", value: "7+" },
                        { label: "Projects Completed", value: "50+" },
                        { label: "Happy Clients", value: "30+" },
                        { label: "Coffee Consumed", value: "∞" },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          className="text-center p-4 rounded-xl bg-card/50"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
