"use client";

import { motion } from "framer-motion";
import { Sparkles, Layers, Zap, Trophy, Gamepad2, Keyboard, Palette, Code2 } from "lucide-react";
import { SkillsVisualization } from "@/components/skills-3d-visualization";
import { AchievementSystem } from "@/components/achievement-system";
import { ProjectDemoMode } from "@/components/project-demo-mode";
import { AIProjectGenerator } from "@/components/ai-project-generator";
import { TypingSpeedTest } from "@/components/typing-speed-test";
import { ColorPaletteGenerator } from "@/components/color-palette-generator";
import { CodeSnippetsLibrary } from "@/components/code-snippets";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Gamepad2 className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Zone</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Playground
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore interactive demos, experiment with code, and discover new project ideas. 
            This is where creativity meets technology.
          </p>
        </motion.div>

        {/* 3D Skills Globe */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">3D Skills Visualization</h2>
            </div>
            <p className="text-muted-foreground">
              Drag to rotate the globe and explore my technical skills in an interactive 3D space.
            </p>
          </motion.div>

          <SkillsVisualization />
        </section>

        {/* Project Demos */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Interactive Demos</h2>
            </div>
            <p className="text-muted-foreground">
              Live component demos with source code. Toggle between preview and code view.
            </p>
          </motion.div>

          <ProjectDemoMode />
        </section>

        {/* AI Project Generator */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">AI Project Generator</h2>
            </div>
            <p className="text-muted-foreground">
              Need inspiration? Generate unique project ideas powered by AI.
            </p>
          </motion.div>

          <AIProjectGenerator />
        </section>

        {/* Achievement System */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Achievements</h2>
            </div>
            <p className="text-muted-foreground">
              Unlock achievements as you explore the portfolio. Can you collect them all?
            </p>
          </motion.div>

          <AchievementSystem />
        </section>

        {/* Typing Speed Test */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Keyboard className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Typing Speed Test</h2>
            </div>
            <p className="text-muted-foreground">
              Test your typing speed and accuracy. Challenge yourself to beat your high score!
            </p>
          </motion.div>

          <TypingSpeedTest />
        </section>

        {/* Color Palette Generator */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Color Palette Generator</h2>
            </div>
            <p className="text-muted-foreground">
              Generate beautiful color palettes for your projects. Export them in multiple formats.
            </p>
          </motion.div>

          <ColorPaletteGenerator />
        </section>

        {/* Code Snippets Library */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Code Snippets Library</h2>
            </div>
            <p className="text-muted-foreground">
              A collection of useful code snippets for React, TypeScript, and more. Copy and use in your projects.
            </p>
          </motion.div>

          <CodeSnippetsLibrary />
        </section>
      </div>
    </div>
  );
}
