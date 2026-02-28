"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Code2, 
  Copy, 
  Check,
  Settings,
  Maximize2,
  Minimize2,
  Terminal,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface CodeDemo {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  preview: React.ReactNode;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
}

// Animated Counter Demo
function CounterDemo() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="p-8 flex flex-col items-center gap-6">
      <motion.div 
        className="text-6xl font-bold text-primary"
        animate={{ scale: isAnimating ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {count}
      </motion.div>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => { setCount(c => c - 1); setIsAnimating(true); setTimeout(() => setIsAnimating(false), 300); }}
        >
          -
        </Button>
        <Button
          onClick={() => { setCount(c => c + 1); setIsAnimating(true); setTimeout(() => setIsAnimating(false), 300); }}
        >
          +
        </Button>
        <Button
          variant="ghost"
          onClick={() => setCount(0)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Animated Card Demo
function CardDemo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="p-8 flex items-center justify-center">
      <motion.div
        className="w-64 p-6 rounded-2xl bg-gradient-to-br from-primary to-orange-500 text-white cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          scale: isHovered ? 1.05 : 1,
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
        }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          animate={{ y: isHovered ? -10 : 0 }}
          className="text-4xl mb-4"
        >
          🎨
        </motion.div>
        <h3 className="text-xl font-bold mb-2">Interactive Card</h3>
        <p className="text-white/80 text-sm">Hover to see the 3D effect in action!</p>
      </motion.div>
    </div>
  );
}

// Loading States Demo
function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = () => {
    setLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return p + 10;
      });
    }, 200);
  };

  return (
    <div className="p-8 flex flex-col items-center gap-6">
      <div className="flex gap-4">
        {/* Spinner */}
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Pulse */}
        <motion.div
          className="w-12 h-12 rounded-full bg-primary"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-primary"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-xs">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">{progress}%</p>
      </div>

      <Button onClick={startLoading} disabled={loading}>
        {loading ? "Loading..." : "Start Loading"}
      </Button>
    </div>
  );
}

// Toggle Switch Demo
function ToggleDemo() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="p-8 flex flex-col items-center gap-6">
      <div 
        className="relative w-20 h-10 rounded-full cursor-pointer transition-colors"
        style={{ backgroundColor: isOn ? "#22c55e" : "#e5e7eb" }}
        onClick={() => setIsOn(!isOn)}
      >
        <motion.div
          className="absolute top-1 w-8 h-8 rounded-full bg-white shadow-md"
          animate={{ left: isOn ? "44px" : "4px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>

      <div className="flex gap-4">
        {["🌙", "💡", "🔔", "🔒"].map((emoji, i) => (
          <motion.button
            key={i}
            className="text-3xl p-2 rounded-xl bg-muted"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              backgroundColor: isOn ? "#dcfce7" : "#f3f4f6",
              scale: isOn ? 1.05 : 1
            }}
            onClick={() => setIsOn(!isOn)}
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      <p className="text-muted-foreground">State: {isOn ? "ON ✅" : "OFF ❌"}</p>
    </div>
  );
}

// Notification Toast Demo
function ToastDemo() {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);

  const addToast = (type: string) => {
    const id = Date.now();
    const messages: Record<string, string> = {
      success: "Operation completed successfully! ✅",
      error: "Something went wrong! ❌",
      info: "Here's some information ℹ️",
      warning: "Please be careful! ⚠️",
    };
    
    setToasts(prev => [...prev, { id, message: messages[type], type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <div className="p-8 flex flex-col items-center gap-6">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={() => addToast("success")} variant="outline" className="border-green-500 text-green-600">
          Success
        </Button>
        <Button onClick={() => addToast("error")} variant="outline" className="border-red-500 text-red-600">
          Error
        </Button>
        <Button onClick={() => addToast("info")} variant="outline" className="border-blue-500 text-blue-600">
          Info
        </Button>
        <Button onClick={() => addToast("warning")} variant="outline" className="border-yellow-500 text-yellow-600">
          Warning
        </Button>
      </div>

      <div className="relative w-full max-w-sm h-32">
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              className={`absolute left-0 right-0 p-4 rounded-xl shadow-lg ${
                toast.type === "success" ? "bg-green-500 text-white" :
                toast.type === "error" ? "bg-red-500 text-white" :
                toast.type === "warning" ? "bg-yellow-500 text-white" :
                "bg-blue-500 text-white"
              }`}
              style={{ top: index * 70 }}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const demos: CodeDemo[] = [
  {
    id: "counter",
    title: "Animated Counter",
    description: "A simple counter with smooth animations and state management",
    language: "tsx",
    difficulty: "beginner",
    tags: ["useState", "framer-motion", "events"],
    code: `function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div 
        className="text-6xl font-bold"
        animate={{ scale: [1, 1.2, 1] }}
        key={count}
      >
        {count}
      </motion.div>
      
      <div className="flex gap-2">
        <Button onClick={() => setCount(c => c - 1)}>-</Button>
        <Button onClick={() => setCount(c => c + 1)}>+</Button>
      </div>
    </div>
  );
}`,
    preview: <CounterDemo />,
  },
  {
    id: "card",
    title: "3D Hover Card",
    description: "Interactive card with 3D tilt effect on hover",
    language: "tsx",
    difficulty: "intermediate",
    tags: ["framer-motion", "3D", "hover"],
    code: `function HoverCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.05 : 1,
        rotateY: isHovered ? 5 : 0,
        rotateX: isHovered ? -5 : 0,
      }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ perspective: 1000 }}
      className="p-6 rounded-2xl bg-gradient-to-br 
                 from-primary to-orange-500"
    >
      <h3>Interactive Card</h3>
      <p>Hover to see 3D effect!</p>
    </motion.div>
  );
}`,
    preview: <CardDemo />,
  },
  {
    id: "loading",
    title: "Loading States",
    description: "Various loading animations and progress indicators",
    language: "tsx",
    difficulty: "beginner",
    tags: ["animation", "loading", "progress"],
    code: `function LoadingDemo() {
  return (
    <div className="flex gap-4">
      {/* Spinner */}
      <motion.div
        className="w-12 h-12 rounded-full 
                   border-4 border-primary/20 border-t-primary"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />

      {/* Pulse */}
      <motion.div
        className="w-12 h-12 rounded-full bg-primary"
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [1, 0.5, 1] 
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-primary"
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              delay: i * 0.1 
            }}
          />
        ))}
      </div>
    </div>
  );
}`,
    preview: <LoadingDemo />,
  },
  {
    id: "toggle",
    title: "Animated Toggle",
    description: "Smooth toggle switch with spring physics",
    language: "tsx",
    difficulty: "beginner",
    tags: ["toggle", "spring", "interaction"],
    code: `function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div 
      className="relative w-20 h-10 rounded-full 
                 cursor-pointer transition-colors"
      style={{ 
        backgroundColor: isOn ? "#22c55e" : "#e5e7eb" 
      }}
      onClick={() => setIsOn(!isOn)}
    >
      <motion.div
        className="absolute top-1 w-8 h-8 
                   rounded-full bg-white shadow-md"
        animate={{ left: isOn ? "44px" : "4px" }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }}
      />
    </div>
  );
}`,
    preview: <ToggleDemo />,
  },
  {
    id: "toast",
    title: "Toast Notifications",
    description: "Animated toast notifications with auto-dismiss",
    language: "tsx",
    difficulty: "intermediate",
    tags: ["notifications", "AnimatePresence", "stack"],
    code: `function ToastDemo() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    
    setTimeout(() => {
      setToasts(prev => 
        prev.filter(t => t.id !== id)
      );
    }, 3000);
  };

  return (
    <>
      <Button onClick={() => addToast("Hello!")}>
        Show Toast
      </Button>
      
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="p-4 rounded-xl bg-primary 
                       text-white shadow-lg"
            style={{ top: index * 70 }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}`,
    preview: <ToastDemo />,
  },
];

export default function CodePlayground() {
  const [selectedDemo, setSelectedDemo] = useState<CodeDemo>(demos[0]);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(selectedDemo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500/10 text-green-600";
      case "intermediate": return "bg-yellow-500/10 text-yellow-600";
      case "advanced": return "bg-red-500/10 text-red-600";
      default: return "bg-muted";
    }
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
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Code Playground</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore interactive React components with live previews. 
            Learn by experimenting with real code examples.
          </p>
        </motion.div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Components</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  {demos.map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => setSelectedDemo(demo)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        selectedDemo.id === demo.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{demo.title}</span>
                        <Badge 
                          variant={selectedDemo.id === demo.id ? "secondary" : "outline"}
                          className={`text-xs ${selectedDemo.id !== demo.id ? getDifficultyColor(demo.difficulty) : ""}`}
                        >
                          {demo.difficulty}
                        </Badge>
                      </div>
                      <p className={`text-xs ${selectedDemo.id === demo.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {demo.description}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Preview */}
            <Card className={`overflow-hidden transition-all ${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Live Preview
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t bg-muted/30 min-h-[200px]">
                  {selectedDemo.preview}
                </div>
              </CardContent>
            </Card>

            {/* Code */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    Source Code
                  </CardTitle>
                  <div className="flex gap-1">
                    {selectedDemo.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="gap-2"
                >
                  {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="p-4 bg-slate-950 text-slate-50 overflow-x-auto text-sm"
                >
                  <code>{selectedDemo.code}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Pro Tip</h3>
                    <p className="text-sm text-muted-foreground">
                      Try modifying the code in your own project! These components use 
                      Framer Motion for animations and Tailwind CSS for styling. 
                      They&apos;re fully responsive and accessible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
