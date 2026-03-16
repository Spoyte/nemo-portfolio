"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Play, 
  Square, 
  RotateCcw, 
  Settings,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Zap,
  BookOpen,
  Lightbulb,
  Code2,
  Bug,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  category: "algorithms" | "debugging" | "css" | "javascript" | "react";
  starterCode: string;
  solution: string;
  hints: string[];
  timeLimit?: number; // in seconds
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Reverse a String",
    description: "Write a function that reverses a string without using the built-in reverse() method.",
    difficulty: "beginner",
    category: "algorithms",
    starterCode: `function reverseString(str) {\n  // Your code here\n  \n}`,
    solution: `function reverseString(str) {\n  let reversed = '';\n  for (let i = str.length - 1; i >= 0; i--) {\n    reversed += str[i];\n  }\n  return reversed;\n  \n  // Alternative: return str.split('').reverse().join('');\n}`,
    hints: ["Think about iterating from the end", "You can use a for loop", "Consider using string concatenation"],
  },
  {
    id: "2",
    title: "CSS Centering",
    description: "Center a div both horizontally and vertically using 3 different methods.",
    difficulty: "beginner",
    category: "css",
    starterCode: `.container {\n  /* Method 1: Flexbox */\n  \n}\n\n.container {\n  /* Method 2: Grid */\n  \n}\n\n.container {\n  /* Method 3: Position absolute */\n  \n}`,
    solution: `.container {\n  /* Method 1: Flexbox */\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.container {\n  /* Method 2: Grid */\n  display: grid;\n  place-items: center;\n}\n\n.container {\n  /* Method 3: Position absolute */\n  position: relative;\n}\n\n.centered {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}`,
    hints: ["Flexbox uses justify-content and align-items", "Grid has a convenient place-items property", "Absolute positioning needs transform for true centering"],
  },
  {
    id: "3",
    title: "Debounce Function",
    description: "Implement a debounce function that limits how often a function can fire.",
    difficulty: "intermediate",
    category: "javascript",
    starterCode: `function debounce(func, wait) {\n  // Your code here\n  \n}\n\n// Usage:\n// const debouncedSearch = debounce(search, 300);`,
    solution: `function debounce(func, wait) {\n  let timeout;\n  \n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    \n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}`,
    hints: ["Use setTimeout and clearTimeout", "Return a new function", "Use closure to store the timeout ID"],
  },
  {
    id: "4",
    title: "Find the Bug",
    description: "This React component has a bug. Can you find and fix it?",
    difficulty: "intermediate",
    category: "debugging",
    starterCode: `function Counter() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    setInterval(() => {\n      setCount(count + 1);\n    }, 1000);\n  }, []);\n  \n  return <div>{count}</div>;\n}`,
    solution: `function Counter() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    const interval = setInterval(() => {\n      setCount(c => c + 1); // Use functional update\n    }, 1000);\n    \n    return () => clearInterval(interval); // Cleanup!\n  }, []);\n  \n  return <div>{count}</div>;\n}`,
    hints: ["The count doesn't update correctly", "Missing cleanup function", "Use functional state update"],
  },
  {
    id: "5",
    title: "Custom useFetch Hook",
    description: "Create a custom React hook for data fetching with loading and error states.",
    difficulty: "advanced",
    category: "react",
    starterCode: `function useFetch(url) {\n  // Your code here\n  \n}\n\n// Usage:\n// const { data, loading, error } = useFetch('/api/data');`,
    solution: `function useFetch(url) {\n  const [state, setState] = useState({\n    data: null,\n    loading: true,\n    error: null\n  });\n  \n  useEffect(() => {\n    let cancelled = false;\n    \n    fetch(url)\n      .then(res => res.json())\n      .then(data => {\n        if (!cancelled) {\n          setState({ data, loading: false, error: null });\n        }\n      })\n      .catch(error => {\n        if (!cancelled) {\n          setState({ data: null, loading: false, error });\n        }\n      });\n    \n    return () => { cancelled = true; };\n  }, [url]);\n  \n  return state;\n}`,
    hints: ["Use useState for multiple states", "Handle cleanup to prevent memory leaks", "Use useEffect with url dependency"],
  },
];

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-500 border-green-500/20",
  intermediate: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  advanced: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  expert: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

const categoryIcons = {
  algorithms: Code2,
  debugging: Bug,
  css: Sparkles,
  javascript: Zap,
  react: BookOpen,
};

export function CodingChallenges() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [filter, setFilter] = useState<"all" | Challenge["category"]>("all");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Timer effect
  useEffect(() => {
    if (!isRunning || timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starterCode);
    setShowSolution(false);
    setShowHints(false);
    if (challenge.timeLimit) {
      setTimeLeft(challenge.timeLimit);
      setIsRunning(true);
    }
  };

  const markComplete = () => {
    if (selectedChallenge) {
      setCompleted((prev) => new Set([...prev, selectedChallenge.id]));
      setIsRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredChallenges = filter === "all" 
    ? challenges 
    : challenges.filter((c) => c.category === filter);

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-medium">Coding Challenges</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Test Your{" "}
            <span className="text-gradient-animated">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive coding challenges to sharpen your problem-solving abilities.
          </p>
        </motion.div>

        {!selectedChallenge ? (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Card className="p-6">
                <div className="flex flex-wrap items-center justify-center gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{completed.size}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{challenges.length}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-500">
                      {Math.round((completed.size / challenges.length) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Progress</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {(["all", "algorithms", "debugging", "css", "javascript", "react"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all capitalize",
                    filter === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Challenge Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChallenges.map((challenge, index) => {
                const Icon = categoryIcons[challenge.category];
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      onClick={() => startChallenge(challenge)}
                      className="p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            completed.has(challenge.id)
                              ? "bg-green-500 text-white"
                              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          )}
                        >
                          {completed.has(challenge.id) ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            difficultyColors[challenge.difficulty]
                          )}
                        >
                          {challenge.difficulty}
                        </Badge>
                      </div>

                      <h3 className="font-semibold mb-2">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {challenge.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground capitalize">
                          {challenge.category}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <!-- Challenge Editor -->
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="overflow-hidden"
003e
              {/* Editor Header */}
              <div className="flex items-center justify-between p-4 border-b bg-muted/50">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => setSelectedChallenge(null)}>
                    ← Back
                  </Button>
                  <div>
                    <h3 className="font-semibold">{selectedChallenge.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedChallenge.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {timeLeft !== null && (
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full",
                      timeLeft < 30 ? "bg-red-500/10 text-red-500" : "bg-muted"
                    )}>
                      <Clock className="w-4 h-4" />
                      <span className="font-mono">{formatTime(timeLeft)}</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHints(!showHints)}
                    className={showHints ? "bg-primary/10" : ""}
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Hints
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSolution(!showSolution)}
                  >
                    {showSolution ? "Hide" : "Show"} Solution
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Code Editor */}
                <div className="border-r">
                  <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b">
                    <span className="text-xs font-medium text-muted-foreground">Your Solution</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-96 p-4 font-mono text-sm bg-[#1e1e1e] text-[#d4d4d4] resize-none focus:outline-none"
                    spellCheck={false}
                  />
                </div>

                {/* Solution / Hints Panel */}
                <div className="bg-muted/30">
                  <AnimatePresence mode="wait">
                    {showSolution ? (
                      <motion.div
                        key="solution"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex items-center justify-between px-4 py-2 border-b bg-green-500/10">
                          <span className="text-xs font-medium text-green-600">Solution</span>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <pre className="p-4 font-mono text-sm overflow-auto h-96">
                          {selectedChallenge.solution}
                        </pre>
                      </motion.div>
                    ) : showHints ? (
                      <motion.div
                        key="hints"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4"
                      >
                        <h4 className="font-medium mb-4 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          Hints
                        </h4>
                        <ul className="space-y-3">
                          {selectedChallenge.hints.map((hint, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-sm text-muted-foreground">{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-96 text-center p-4"
                      >
                        <Code2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">
                          Write your solution in the editor.\nToggle hints or view the solution when you're stuck.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center gap-2">
                  {!completed.has(selectedChallenge.id) ? (
                    <Button onClick={markComplete} className="gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Complete
                    </Button>
                  ) : (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                  <Button variant="outline" onClick={() => setCode(selectedChallenge.starterCode)}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
                <Badge variant="outline" className={difficultyColors[selectedChallenge.difficulty]}>
                  {selectedChallenge.difficulty}
                </Badge>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}
