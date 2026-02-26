"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Target,
  Zap,
  Flame,
  Keyboard,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Sample texts for different difficulty levels
const texts = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump.",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz.",
  ],
  medium: [
    "In the world of software development, continuous learning is not just an option but a necessity. Technologies evolve rapidly, and staying current requires dedication and curiosity.",
    "The art of programming combines logical thinking with creative problem-solving. Every line of code is a decision that shapes the final product.",
    "Open source software has revolutionized how we build technology. Collaboration across borders has created tools that power the modern internet.",
  ],
  hard: [
    "TypeScript's type system enables developers to catch errors at compile time rather than runtime. The combination of static typing with JavaScript's flexibility creates a powerful development experience that scales from small projects to enterprise applications.",
    "React's virtual DOM and component-based architecture have transformed how we build user interfaces. Hooks introduced in version 16.8 brought state management and side effects to functional components, changing the paradigm of React development.",
    "The event loop in JavaScript is a fundamental concept that every developer must understand. It enables asynchronous programming through a single-threaded model, managing the call stack, callback queue, and microtask queue.",
  ],
  code: [
    "const fibonacci = (n: number): number => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);",
    "interface User { id: string; name: string; email: string; createdAt: Date; }",
    "export async function fetchData<T>(url: string): Promise<T> { const res = await fetch(url); return res.json(); }",
    "const [count, setCount] = useState<number>(0); useEffect(() => { document.title = `Count: ${count}`; }, [count]);",
  ],
};

type Difficulty = "easy" | "medium" | "hard" | "code";

interface Stats {
  wpm: number;
  accuracy: number;
  time: number;
  errors: number;
}

export function TypingSpeedChallenge() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<Stats[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);

  // Initialize text
  useEffect(() => {
    const randomText = texts[difficulty][Math.floor(Math.random() * texts[difficulty].length)];
    setText(randomText);
  }, [difficulty]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, startTime]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isActive && value.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    setInput(value);

    // Check if complete
    if (value === text) {
      finishGame(value);
    }
  };

  const finishGame = (finalInput: string) => {
    setIsActive(false);
    const timeInMinutes = elapsedTime / 60000;
    const words = text.split(" ").length;
    const wpm = Math.round(words / timeInMinutes);
    
    // Calculate accuracy
    let errors = 0;
    for (let i = 0; i < finalInput.length; i++) {
      if (finalInput[i] !== text[i]) errors++;
    }
    const accuracy = Math.round(((text.length - errors) / text.length) * 100);

    const newStats: Stats = {
      wpm,
      accuracy,
      time: elapsedTime,
      errors,
    };

    setStats(newStats);
    setHistory((prev) => [newStats, ...prev].slice(0, 10));
    
    if (wpm > bestWpm) {
      setBestWpm(wpm);
    }
    
    if (accuracy >= 95) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const resetGame = () => {
    const randomText = texts[difficulty][Math.floor(Math.random() * texts[difficulty].length)];
    setText(randomText);
    setInput("");
    setIsActive(false);
    setIsPaused(false);
    setStartTime(null);
    setElapsedTime(0);
    setStats(null);
  };

  const getCharacterClass = (index: number) => {
    if (index >= input.length) return "text-muted-foreground";
    if (input[index] === text[index]) return "text-green-500";
    return "text-red-500 bg-red-500/10";
  };

  const getCurrentWpm = () => {
    if (!isActive || !startTime) return 0;
    const timeInMinutes = elapsedTime / 60000;
    const wordsTyped = input.split(" ").length;
    return Math.round(wordsTyped / timeInMinutes) || 0;
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Current WPM</p>
              <p className="text-xl font-bold">{getCurrentWpm()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-xl font-bold">{formatTime(elapsedTime)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="text-xl font-bold">{streak} 🔥</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Trophy className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">Best WPM</p>
              <p className="text-xl font-bold">{bestWpm}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Selection */}
      <div className="flex flex-wrap gap-2">
        {(["easy", "medium", "hard", "code"] as Difficulty[]).map((d) => (
          <Button
            key={d}
            variant={difficulty === d ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setDifficulty(d);
              resetGame();
            }}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </Button>
        ))}
      </div>

      {/* Game Area */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-8">
          {/* Text Display */}
          <div className="mb-6">
            <p className="text-lg md:text-xl leading-relaxed font-mono">
              {text.split("").map((char, index) => (
                <span
                  key={index}
                  className={cn(
                    "transition-colors duration-100",
                    getCharacterClass(index),
                    index === input.length && "border-r-2 border-primary animate-pulse"
                  )}
                >
                  {char}
                </span>
              ))}
            </p>
          </div>

          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={handleInput}
            disabled={!!stats}
            placeholder={isActive ? "Keep typing..." : "Start typing to begin..."}
            className="w-full p-4 text-lg font-mono bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
            autoFocus
          />

          {/* Progress */}
          {isActive && (
            <div className="mt-4">
              <Progress value={(input.length / text.length) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {Math.round((input.length / text.length) * 100)}% complete
              </p>
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 p-6 bg-primary/5 rounded-lg text-center"
              >
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">{stats.wpm}</p>
                    <p className="text-sm text-muted-foreground">WPM</p>
                  </div>
                  <div>
                    <p className={cn(
                      "text-3xl font-bold",
                      stats.accuracy >= 95 ? "text-green-500" : "text-yellow-500"
                    )}>
                      {stats.accuracy}%
                    </p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.errors}</p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
                </div>

                {stats.wpm >= 80 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full mb-4"
                  >
                    <Star className="h-4 w-4" />
                    <span className="font-medium">Speed Demon Unlocked!</span>
                  </motion.div>
                )}

                <Button onClick={resetGame} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant={i === 0 ? "default" : "secondary"}>
                      #{history.length - i}
                    </Badge>
                    <span className="font-medium">{h.wpm} WPM</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{h.accuracy}% accuracy</span>
                    <span>{formatTime(h.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
