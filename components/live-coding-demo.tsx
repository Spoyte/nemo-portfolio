"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check,
  Code2,
  Eye,
  Sparkles,
  Download,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const demoProjects = [
  {
    id: "counter",
    name: "Animated Counter",
    description: "A smooth counter with spring animations",
    code: `import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

function AnimatedCounter({ target = 100 }) {
  const [count, setCount] = useState(0);
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (v) => Math.round(v));
  
  useEffect(() => {
    spring.set(target);
  }, [target, spring]);
  
  return (
    <motion.div className="text-6xl font-bold">
      {display}
    </motion.div>
  );
}`,
    preview: () => <AnimatedCounterDemo />,
  },
  {
    id: "card",
    name: "3D Flip Card",
    description: "Interactive card with 3D flip animation",
    code: `import { motion } from 'framer-motion';
import { useState } from 'react';

function FlipCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div className="perspective-1000">
      <motion.div
        className="w-48 h-64 relative cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center backface-hidden">
          <span className="text-white text-xl font-bold">Front</span>
        </div>
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <span className="text-white text-xl font-bold">Back</span>
        </div>
      </motion.div>
    </div>
  );
}`,
    preview: () => <FlipCardDemo />,
  },
  {
    id: "loader",
    name: "Morphing Loader",
    description: "Shape-morphing loading animation",
    code: `import { motion } from 'framer-motion';

function MorphingLoader() {
  return (
    <motion.div
      className="w-16 h-16 bg-primary rounded-full"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        borderRadius: ["50%", "25%", "50%"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}`,
    preview: () => <MorphingLoaderDemo />,
  },
];

function AnimatedCounterDemo() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCount(c => (c + 1) % 101);
    }, 50);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div 
        className="text-6xl font-bold text-primary"
        animate={{ scale: isRunning ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.1 }}
      >
        {count}
      </motion.div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant="outline" onClick={() => { setCount(0); setIsRunning(false); }}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function FlipCardDemo() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000">
      <motion.div
        className="w-48 h-64 relative cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-center text-white">
            <Sparkles className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xl font-bold">Front</span>
            <p className="text-sm opacity-80 mt-1">Click to flip</p>
          </div>
        </div>
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div className="text-center text-white">
            <Code2 className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xl font-bold">Back</span>
            <p className="text-sm opacity-80 mt-1">Cool, right?</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MorphingLoaderDemo() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-16 h-16 bg-primary"
        animate={isPlaying ? {
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          borderRadius: ["50%", "25%", "10%", "25%", "50%"],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}

export function LiveCodingDemo() {
  const [selectedProject, setSelectedProject] = useState(demoProjects[0]);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(selectedProject.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive Playground</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Live{" "}
            <span className="text-gradient-animated">Code Demos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive code examples with live previews. See the code, play with it, and copy it for your own projects.
          </p>
        </motion.div>

        {/* Project Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {demoProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedProject.id === project.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {project.name}
            </button>
          ))}
        </motion.div>

        {/* Code & Preview */}
        <motion.div
          key={selectedProject.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Code Panel */}
          <div className="rounded-2xl bg-[#1e1e1e] border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#333]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-400 ml-2">{selectedProject.id}.tsx</span>
              </div>
              <Button size="sm" variant="ghost" className="h-8 text-gray-400 hover:text-white" onClick={copyCode}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                <code>{selectedProject.code}</code>
              </pre>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <Badge variant="outline">Live</Badge>
            </div>
            <div className="p-8 min-h-[300px] flex items-center justify-center bg-gradient-to-br from-muted/50 to-transparent">
              <selectedProject.preview />
            </div>
            <div className="px-4 py-3 bg-muted border-t border-border">
              <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-4 mt-8"
        >
          <Button variant="outline" className="gap-2" onClick={copyCode}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
