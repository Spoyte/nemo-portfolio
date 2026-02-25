"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Timer, 
  RotateCcw, 
  Keyboard,
  Zap,
  Target,
  Sparkles,
  ChevronRight,
  Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Code snippets for typing test
const CODE_SNIPPETS = [
  {
    id: "1",
    language: "javascript",
    name: "Array Methods",
    difficulty: "easy",
    code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((a, b) => a + b, 0);
const evens = numbers.filter(n => n % 2 === 0);`,
  },
  {
    id: "2",
    language: "typescript",
    name: "Type Definition",
    difficulty: "medium",
    code: `interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

function createUser(data: Omit<User, 'id'>): User {
  return { ...data, id: crypto.randomUUID() };
}`,
  },
  {
    id: "3",
    language: "python",
    name: "List Comprehension",
    difficulty: "easy",
    code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = [n ** 2 for n in numbers]
evens = [n for n in numbers if n % 2 == 0]
print(f"Squares: {squares}")`,
  },
  {
    id: "4",
    language: "rust",
    name: "Pattern Matching",
    difficulty: "hard",
    code: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

fn process(msg: Message) {
    match msg {
        Message::Quit => println!("Goodbye!"),
        Message::Move { x, y } => println!("Move to ({}, {})", x, y),
        Message::Write(text) => println!("Text: {}", text),
    }
}`,
  },
  {
    id: "5",
    language: "css",
    name: "Flexbox Centering",
    difficulty: "easy",
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 1rem;
}`,
  },
  {
    id: "6",
    language: "go",
    name: "Goroutines",
    difficulty: "hard",
    code: `func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d processing job %d\\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}`,
  },
  {
    id: "7",
    language: "sql",
    name: "Complex Query",
    difficulty: "medium",
    code: `SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC;`,
  },
  {
    id: "8",
    language: "javascript",
    name: "Async/Await",
    difficulty: "medium",
    code: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}`,
  },
];

const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  medium: 1.5,
  hard: 2,
};

interface TypingStats {
  wpm: number;
  accuracy: number;
  time: number;
  charsTyped: number;
  errors: number;
}

function calculateWPM(charsTyped: number, timeInSeconds: number, accuracy: number): number {
  if (timeInSeconds === 0) return 0;
  const minutes = timeInSeconds / 60;
  const grossWPM = (charsTyped / 5) / minutes;
  return Math.round(grossWPM * (accuracy / 100));
}

function TypingArea({ 
  snippet, 
  onComplete, 
  onStatsUpdate 
}: { 
  snippet: typeof CODE_SNIPPETS[0];
  onComplete: (stats: TypingStats) => void;
  onStatsUpdate: (stats: TypingStats) => void;
}) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetText = snippet.code;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 1000;
        const accuracy = Math.max(0, 100 - (errors / targetText.length) * 100);
        const wpm = calculateWPM(input.length, timeElapsed, accuracy);
        
        onStatsUpdate({
          wpm,
          accuracy: Math.round(accuracy),
          time: timeElapsed,
          charsTyped: input.length,
          errors,
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [startTime, input, errors, targetText.length, onStatsUpdate]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Check for errors at current position
    if (value.length > input.length) {
      const newChar = value[value.length - 1];
      const expectedChar = targetText[value.length - 1];
      
      if (newChar !== expectedChar) {
        setErrors(e => e + 1);
      }
    }

    setInput(value);
    setCurrentIndex(value.length);

    if (value === targetText) {
      const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
      const accuracy = Math.max(0, 100 - (errors / targetText.length) * 100);
      const wpm = calculateWPM(value.length, timeElapsed, accuracy);
      
      onComplete({
        wpm,
        accuracy: Math.round(accuracy),
        time: timeElapsed,
        charsTyped: value.length,
        errors,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent default behavior for some keys to handle manually
    if (e.key === "Tab") {
      e.preventDefault();
      const newInput = input + "  ";
      setInput(newInput);
      setCurrentIndex(newInput.length);
    }
  };

  const renderCode = () => {
    return targetText.split("").map((char, index) => {
      let className = "transition-colors duration-75";
      
      if (index < input.length) {
        if (input[index] === char) {
          className += " text-green-400";
        } else {
          className += " text-red-400 bg-red-400/20";
        }
      } else if (index === input.length) {
        className += " bg-primary/50 text-white animate-pulse";
      } else {
        className += " text-white/40";
      }

      return (
        <span key={index} className={className}>
          {char === "\n" ? "\n" : char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Code display */}
      <pre className="font-mono text-lg leading-relaxed p-6 rounded-xl bg-slate-900/50 border border-white/10 min-h-[300px] whitespace-pre-wrap break-all">
        <code>{renderCode()}</code>
      </pre>

      {/* Hidden textarea for input capture */}
      <textarea
        ref={inputRef}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 w-full h-full opacity-0 cursor-default resize-none"
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
      />

      {/* Focus indicator */}
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-white/10">
          <Keyboard className="h-3 w-3 mr-1" />
          Click to focus
        </Badge>
      </div>
    </div>
  );
}

function ResultsCard({ 
  stats, 
  snippet, 
  onRestart 
}: { 
  stats: TypingStats; 
  snippet: typeof CODE_SNIPPETS[0];
  onRestart: () => void;
}) {
  const score = Math.round(
    (stats.wpm * (stats.accuracy / 100)) * 
    DIFFICULTY_MULTIPLIERS[snippet.difficulty as keyof typeof DIFFICULTY_MULTIPLIERS]
  );

  const getRank = () => {
    if (score >= 100) return { label: "Legendary", color: "text-yellow-400", icon: Crown };
    if (score >= 80) return { label: "Expert", color: "text-purple-400", icon: Trophy };
    if (score >= 60) return { label: "Advanced", color: "text-blue-400", icon: Target };
    if (score >= 40) return { label: "Intermediate", color: "text-green-400", icon: Zap };
    return { label: "Beginner", color: "text-gray-400", icon: Keyboard };
  };

  const rank = getRank();
  const RankIcon = rank.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-white/10">
        <CardHeader>
          <div className="mx-auto w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <RankIcon className={`h-10 w-10 ${rank.color}`} />
          </div>
          <CardTitle className="text-3xl">{rank.label}!</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-5xl font-bold text-gradient">{score}</div>
          <p className="text-muted-foreground">Total Score</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5">
              <div className="text-2xl font-bold">{stats.wpm}</div>
              <div className="text-xs text-muted-foreground">WPM</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <div className="text-2xl font-bold">{Math.round(stats.time)}s</div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
          </div>

          <Button onClick={onRestart} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TypingSpeedPage() {
  const [selectedSnippet, setSelectedSnippet] = useState(CODE_SNIPPETS[0]);
  const [gameState, setGameState] = useState<"menu" | "playing" | "finished">("menu");
  const [currentStats, setCurrentStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    time: 0,
    charsTyped: 0,
    errors: 0,
  });
  const [finalStats, setFinalStats] = useState<TypingStats | null>(null);

  const handleComplete = useCallback((stats: TypingStats) => {
    setFinalStats(stats);
    setGameState("finished");
  }, []);

  const handleStatsUpdate = useCallback((stats: TypingStats) => {
    setCurrentStats(stats);
  }, []);

  const handleRestart = () => {
    setGameState("playing");
    setFinalStats(null);
    setCurrentStats({
      wpm: 0,
      accuracy: 100,
      time: 0,
      charsTyped: 0,
      errors: 0,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Keyboard className="h-4 w-4" />
            <span className="text-sm font-medium">Code Typing Test</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Speed Type
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your typing speed with real code snippets. 
            How fast can you type without errors?
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {gameState === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-center mb-6">Choose a Challenge</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CODE_SNIPPETS.map((snippet, index) => (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="cursor-pointer hover:border-primary/50 transition-all group"
                      onClick={() => {
                        setSelectedSnippet(snippet);
                        setGameState("playing");
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {snippet.name}
                              </h3>
                              <Badge variant={
                                snippet.difficulty === "easy" ? "default" :
                                snippet.difficulty === "medium" ? "secondary" : "destructive"
                              }>
                                {snippet.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {snippet.language}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats bar */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{currentStats.wpm}</span>
                    <span className="text-sm text-muted-foreground">WPM</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold">{currentStats.accuracy}%</span>
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-blue-500" />
                    <span className="text-2xl font-bold">{Math.round(currentStats.time)}s</span>
                  </div>
                </div>

                <Button variant="ghost" size="sm" onClick={() => setGameState("menu")}>
                  Exit
                </Button>
              </div>

              {/* Language badge */}
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{selectedSnippet.language}</Badge>
                <Badge variant="outline">{selectedSnippet.name}</Badge>
              </div>

              {/* Typing area */}
              <TypingArea 
                snippet={selectedSnippet}
                onComplete={handleComplete}
                onStatsUpdate={handleStatsUpdate}
              />
            </motion.div>
          )}

          {gameState === "finished" && finalStats && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ResultsCard 
                stats={finalStats}
                snippet={selectedSnippet}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
