"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check, 
  Code2, 
  Terminal,
  Sparkles,
  Zap,
  Settings,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  Lightbulb,
  Wand2,
  Bug,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import confetti from "canvas-confetti";

// Sample code templates
const CODE_TEMPLATES = {
  react: `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Count: {count}
      </h1>
      <button
        onClick={() => setCount(c => c + 1)}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Increment
      </button>
    </div>
  );
}`,
  css: `.animated-card {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}`,
  html: `<div class="glass-card">
  <h2>Hello World! 🎉</h2>
  <p>This is a live preview of your HTML code.</p>
  <button onclick="alert('Clicked!')">
    Click Me
  </button>
</div>

<style>
  .glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }
  
  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }
</style>`,
  canvas: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 300;

let particles = [];

for (let i = 0; i < 50; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 5 + 2,
    color: \`hsl(\${Math.random() * 360}, 70%, 60%)\`
  });
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
  
  requestAnimationFrame(animate);
}

animate();`
};

// Code challenges
const CHALLENGES = [
  {
    id: 1,
    title: "Center a Div",
    description: "Create CSS to perfectly center a div both horizontally and vertically.",
    hint: "Use flexbox or grid with place-items/justify-content/align-items",
    difficulty: "Easy"
  },
  {
    id: 2,
    title: "Animated Button",
    description: "Create a button with a hover animation that scales and changes color.",
    hint: "Use transform: scale() and transition properties",
    difficulty: "Easy"
  },
  {
    id: 3,
    title: "Gradient Text",
    description: "Create text with a gradient background that clips to the text.",
    hint: "Use background-clip: text and -webkit-text-fill-color",
    difficulty: "Medium"
  }
];

export default function LiveCodePlayground() {
  const [code, setCode] = useState(CODE_TEMPLATES.react);
  const [language, setLanguage] = useState<keyof typeof CODE_TEMPLATES>("react");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-run on code change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      runCode();
    }, 1000);
    return () => clearTimeout(timer);
  }, [code, language]);

  const runCode = () => {
    setIsRunning(true);
    setConsoleLogs([]);

    let htmlContent = "";

    if (language === "react") {
      // For React, we'd need Babel - simplified version
      htmlContent = `
        <div id="root"></div>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script type="text/babel">
          ${code}
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(<Counter />);
        </script>
        <script src="https://cdn.tailwindcss.com"></script>
      `;
    } else if (language === "css") {
      htmlContent = `
        <style>${code}</style>
        <div class="animated-card">CSS Animation!</div>
        <script src="https://cdn.tailwindcss.com"></script>
      `;
    } else if (language === "html") {
      htmlContent = code;
    } else if (language === "canvas") {
      htmlContent = `
        <canvas id="canvas" style="border-radius: 8px;"></canvas>
        <script>${code}</script>
      `;
    }

    setOutput(htmlContent);
    setIsRunning(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    setCode(CODE_TEMPLATES[language]);
  };

  const loadTemplate = (lang: keyof typeof CODE_TEMPLATES) => {
    setLanguage(lang);
    setCode(CODE_TEMPLATES[lang]);
  };

  const loadChallenge = (challengeId: number) => {
    setActiveChallenge(challengeId);
    setLanguage("css");
    setCode(`/* Challenge: ${CHALLENGES.find(c => c.id === challengeId)?.title} */
/* Write your solution below */

`);
    setShowHint(false);
  };

  const celebrateSuccess = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#22c55e", "#f59e0b", "#ec4899"]
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Code2 className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Playground</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Live Code{" "}
            <span className="text-gradient-animated">Playground</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Write, run, and experiment with code in real-time. Perfect for learning,
            prototyping, and sharing ideas.
          </p>
        </motion.div>

        {/* Challenges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold">Coding Challenges</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CHALLENGES.map((challenge) => (
              <motion.button
                key={challenge.id}
                onClick={() => loadChallenge(challenge.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  activeChallenge === challenge.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{challenge.title}</span>
                  <Badge variant={challenge.difficulty === "Easy" ? "secondary" : "default"}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </motion.button>
            ))}
          </div>

          {activeChallenge && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 rounded-xl bg-muted"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Active: {CHALLENGES.find(c => c.id === activeChallenge)?.title}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setShowHint(!showHint)}>
                  <Lightbulb className="w-4 h-4 mr-1" />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
              </div>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-muted-foreground"
                >
                  💡 {CHALLENGES.find(c => c.id === activeChallenge)?.hint}
                </motion.p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Main Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`grid gap-6 ${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : "grid-cols-1 lg:grid-cols-2"}`}
        >
          {/* Code Editor */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={language}
                    onChange={(e) => loadTemplate(e.target.value as keyof typeof CODE_TEMPLATES)}
                    className="text-sm bg-background border rounded px-2 py-1"
                  >
                    <option value="react">React</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="canvas">Canvas</option>
                  </select>
                  <Button variant="ghost" size="icon" onClick={copyCode}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={resetCode}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[400px] p-4 font-mono text-sm bg-background resize-none focus:outline-none"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={runCode}
                    disabled={isRunning}
                    className="gap-1"
                  >
                    {isRunning ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        Run
                      </>
                    )}
                  </Button>
                  {activeChallenge && (
                    <Button size="sm" variant="outline" onClick={celebrateSuccess}>
                      <Check className="w-3 h-3 mr-1" />
                      Done
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-muted/30">
              <iframe
                ref={iframeRef}
                srcDoc={output}
                className="w-full h-[400px] bg-white"
                sandbox="allow-scripts"
                title="preview"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button variant="outline" onClick={() => loadTemplate("react")}>
            <Sparkles className="w-4 h-4 mr-2" />
            React Component
          </Button>
          <Button variant="outline" onClick={() => loadTemplate("css")}>
            <Wand2 className="w-4 h-4 mr-2" />
            CSS Animation
          </Button>
          <Button variant="outline" onClick={() => loadTemplate("canvas")}>
            <Zap className="w-4 h-4 mr-2" />
            Canvas Particles
          </Button>
          <Button variant="outline" onClick={() => loadTemplate("html")}>
            <Code2 className="w-4 h-4 mr-2" />
            HTML Template
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Zap, label: "Auto-run", desc: "Code runs automatically" },
            { icon: Bug, label: "Error Handling", desc: "Safe sandboxed execution" },
            { icon: Share2, label: "Shareable", desc: "Copy and share code" },
            { icon: Download, label: "Export", desc: "Download your work" },
          ].map((feature) => (
            <div key={feature.label} className="text-center p-4">
              <feature.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="font-medium text-sm">{feature.label}</p>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
