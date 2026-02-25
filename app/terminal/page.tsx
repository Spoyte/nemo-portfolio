"use client";

import { motion } from "framer-motion";
import { Terminal, Gamepad2, Keyboard, Palette, Sparkles } from "lucide-react";
import { SnakeGame } from "@/components/snake-game";
import { TypingRace } from "@/components/typing-race";
import { ColorHarmonyVisualizer } from "@/components/color-harmony";
import { InteractiveTerminal } from "@/components/interactive-terminal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TerminalPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Terminal</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Terminal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A fully functional web terminal with custom commands. 
            Type &apos;help&apos; to get started or try the Konami code (↑↑↓↓←→←→BA)!
          </p>
        </motion.div>

        {/* Terminal Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white/90">nemo@portfolio:~</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm text-white/80 space-y-2">
              <div className="text-green-400">➜ ~ help</div>
              <div className="space-y-1">
                <div>Available commands:</div>
                <div className="text-white/60 pl-4">  help - Show this help message</div>
                <div className="text-white/60 pl-4">  about - Learn about Nemo</div>
                <div className="text-white/60 pl-4">  skills - List technical skills</div>
                <div className="text-white/60 pl-4">  projects - View featured projects</div>
                <div className="text-white/60 pl-4">  contact - Get contact information</div>
                <div className="text-white/60 pl-4">  matrix - Toggle matrix rain effect</div>
                <div className="text-white/60 pl-4">  joke - Tell a developer joke</div>
                <div className="text-white/60 pl-4">  goto [page] - Navigate to page</div>
              </div>
              <div className="text-green-400 mt-4">➜ ~ <span className="animate-pulse">_</span></div>
            </div>
          </div>

          <div className="mt-6 text-center text-muted-foreground">
            <p>Press <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-sm">`</kbd> to open the terminal from anywhere!</p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Terminal Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "Interactive Commands",
                description: "Type commands to navigate, get info, or just have fun with built-in easter eggs.",
              },
              {
                icon: Gamepad2,
                title: "Matrix Rain",
                description: "Activate the iconic Matrix digital rain effect with a single command.",
              },
              {
                icon: Terminal,
                title: "Global Access",
                description: "Open the terminal from any page using Ctrl+` keyboard shortcut.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 rounded-xl border bg-card text-center"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
