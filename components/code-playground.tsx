"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play, Copy, Check, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const codeSnippets = [
  {
    name: "Hello World",
    language: "typescript",
    code: `const greeting = "Hello, World!";
console.log(greeting);

// Output: Hello, World!`,
  },
  {
    name: "Fibonacci",
    language: "typescript",
    code: `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
// Output: 55`,
  },
  {
    name: "Array Map",
    language: "typescript",
    code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

console.log(doubled);
// Output: [2, 4, 6, 8, 10]`,
  },
];

const funFacts = [
  "💡 This portfolio is built with Next.js + Tailwind CSS",
  "🎨 The color scheme follows Swiss International Style principles",
  "⚡ Static export makes this site load blazingly fast",
  "🎮 Try the Konami code: ↑↑↓↓←→←→BA",
  "🐙 Nemo means 'nobody' in Latin - but I'm definitely somebody!",
  "🌙 Dark mode is implemented with CSS variables",
  "📱 Fully responsive design for all devices",
  "🎯 Performance optimized with lazy loading",
];

export function CodePlayground() {
  const [selectedSnippet, setSelectedSnippet] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);
  const [showFact, setShowFact] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    
    // Simulate typing effect
    const lines = codeSnippets[selectedSnippet].code.split("\n");
    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setOutput(prev => prev + lines[currentLine] + "\n");
        currentLine++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        
        // Show fun fact after execution
        setTimeout(() => {
          setShowFact(true);
          setTimeout(() => setShowFact(false), 5000);
        }, 500);
      }
    }, 100);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippets[selectedSnippet].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    setOutput("");
    setIsRunning(false);
  };

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % funFacts.length);
    }, 8000);
    return () => clearInterval(factInterval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Terminal Header */}
      <div className="bg-zinc-900 rounded-t-xl p-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <Terminal className="h-4 w-4 text-zinc-400 ml-2" />
          <span className="text-zinc-400 text-sm font-mono">nemo@portfolio:~$</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyCode}
            className="h-8 text-zinc-400 hover:text-white"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetCode}
            className="h-8 text-zinc-400 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Snippet Selector */}
      <div className="bg-zinc-950 border-x border-zinc-800 p-2 flex gap-2">
        {codeSnippets.map((snippet, index) => (
          <button
            key={snippet.name}
            onClick={() => {
              setSelectedSnippet(index);
              setOutput("");
            }}
            className={`px-3 py-1.5 rounded text-sm font-mono transition-colors ${
              selectedSnippet === index
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {snippet.name}
          </button>
        ))}
      </div>

      {/* Code Area */}
      <div className="bg-zinc-950 border-x border-zinc-800 p-4 font-mono text-sm min-h-[200px] relative">
        <pre className="text-zinc-300 whitespace-pre-wrap">
          <code>{output || codeSnippets[selectedSnippet].code}</code>
        </pre>
        
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 right-4"
          >
            <span className="text-green-400 animate-pulse">▋</span>
          </motion.div>
        )}
      </div>

      {/* Run Button */}
      <div className="bg-zinc-900 rounded-b-xl p-4 border border-zinc-800 flex items-center justify-between">
        <Button
          onClick={runCode}
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? "Running..." : "Run Code"}
        </Button>

        {/* Fun Fact */}
        <AnimatePresence mode="wait">
          {showFact && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-sm text-zinc-400"
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>{funFacts[currentFact]}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
