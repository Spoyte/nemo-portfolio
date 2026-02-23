"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Timer, 
  Zap, 
  RotateCcw,
  Keyboard,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  "A journey of a thousand miles begins with a single step.",
  "Innovation distinguishes between a leader and a follower.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Java is to JavaScript what car is to Carpet.",
  "Any fool can write code that a computer can understand.",
  "Experience is the name everyone gives to their mistakes."
];

interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  time: number;
}

export function TypingSpeedTest() {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    time: 0
  });
  const [highScore, setHighScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("typing-high-score");
    if (saved) setHighScore(parseInt(saved));
    resetTest();
  }, []);

  const resetTest = () => {
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    setInput("");
    setIsActive(false);
    setIsFinished(false);
    setStartTime(null);
    setStats({
      wpm: 0,
      accuracy: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      time: 0
    });
    inputRef.current?.focus();
  };

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const words = input.length / 5; // standard: 5 chars = 1 word
    const wpm = Math.round(words / timeElapsed);
    
    let correct = 0;
    let incorrect = 0;
    
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }
    
    const accuracy = Math.round((correct / input.length) * 100) || 0;
    
    setStats({
      wpm: Math.min(wpm, 200), // Cap at reasonable max
      accuracy,
      correctChars: correct,
      incorrectChars: incorrect,
      totalChars: input.length,
      time: Math.round((Date.now() - startTime) / 1000)
    });

    if (wpm > highScore) {
      setHighScore(wpm);
      localStorage.setItem("typing-high-score", wpm.toString());
    }
  }, [input, text, startTime, highScore]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!isActive && value.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    setInput(value);

    if (value.length >= text.length) {
      setIsFinished(true);
      setIsActive(false);
      calculateStats();
    }
  };

  useEffect(() => {
    if (isActive && !isFinished) {
      const interval = setInterval(calculateStats, 100);
      return () => clearInterval(interval);
    }
  }, [isActive, isFinished, calculateStats]);

  const getCharClass = (index: number) => {
    if (index >= input.length) return "text-muted-foreground";
    if (input[index] === text[index]) return "text-green-500";
    return "text-red-500 bg-red-500/10";
  };

  const getWpmRating = (wpm: number) => {
    if (wpm >= 80) return { label: "Legendary", color: "text-purple-500" };
    if (wpm >= 60) return { label: "Pro", color: "text-blue-500" };
    if (wpm >= 40) return { label: "Advanced", color: "text-green-500" };
    if (wpm >= 20) return { label: "Intermediate", color: "text-yellow-500" };
    return { label: "Beginner", color: "text-muted-foreground" };
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Keyboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Typing Speed Test</CardTitle>
              <p className="text-sm text-muted-foreground">Test your typing speed and accuracy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">High Score</p>
              <p className="text-lg font-bold text-primary">{highScore} WPM</p>
            </div>
            <Button variant="outline" size="sm" onClick={resetTest}>
              <RotateCcw className="h-4 w-4 mr-2" />
              New Test
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Bar */}
        <AnimatePresence>
          {(isActive || isFinished) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-4 gap-4"
            >
              <div className="text-center p-3 rounded-lg bg-muted">
                <Zap className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                <p className="text-2xl font-bold">{stats.wpm}</p>
                <p className="text-xs text-muted-foreground">WPM</p>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-muted">
                <Target className="h-4 w-4 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">{stats.accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-muted">
                <Timer className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{stats.time}s</p>
                <p className="text-xs text-muted-foreground">Time</p>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-muted">
                <TrendingUp className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                <p className={`text-lg font-bold ${getWpmRating(stats.wpm).color}`}>
                  {getWpmRating(stats.wpm).label}
                </p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round((input.length / text.length) * 100)}%</span>
          </div>
          <Progress value={(input.length / text.length) * 100} className="h-2" />
        </div>

        {/* Text Display */}
        <div 
          className="p-6 rounded-xl bg-muted/50 font-mono text-lg leading-relaxed min-h-[120px]"
          onClick={() => inputRef.current?.focus()}
        >
          {text.split("").map((char, index) => (
            <span
              key={index}
              className={`${getCharClass(index)} ${
                index === input.length ? "border-b-2 border-primary animate-pulse" : ""
              }`}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          disabled={isFinished}
          className="w-full p-3 rounded-lg border bg-background text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={isActive ? "Keep typing..." : "Start typing to begin..."}
        />

        {/* Results */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20"
            >
              <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-2xl font-bold mb-2">Test Complete!</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {stats.wpm} WPM
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {stats.accuracy}% Accuracy
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {stats.wpm >= 60 
                  ? "🔥 Incredible speed! You're a typing master!" 
                  : stats.wpm >= 40 
                    ? "👏 Great job! Keep practicing to improve."
                    : "💪 Good effort! Practice makes perfect."}
              </p>
              <Button className="mt-4" onClick={resetTest}>
                <Sparkles className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
