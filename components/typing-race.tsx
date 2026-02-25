"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, Timer, Trophy, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const WORDS = [
  "algorithm", "function", "variable", "constant", "interface",
  "component", "framework", "library", "database", "frontend",
  "backend", "api", "server", "client", "browser",
  "typescript", "javascript", "react", "nextjs", "tailwind",
  "programming", "development", "software", "application", "website",
  "responsive", "animation", "component", "interface", "repository",
  "deployment", "production", "development", "testing", "debugging",
  "optimization", "performance", "security", "authentication", "authorization",
];

const QUOTES = [
  "The only way to do great work is to love what you do",
  "Code is like humor when you have to explain it its bad",
  "First solve the problem then write the code",
  "Make it work make it right make it fast",
  "Simplicity is the soul of efficiency",
  "Any fool can write code that a computer can understand",
  "Experience is the name everyone gives to their mistakes",
  "Knowledge is power",
  "Fix the cause not the symptom",
  "Make it simple but significant",
];

export function TypingRace() {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [highScore, setHighScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const generateText = useCallback(() => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15).join(" ");
  }, []);

  const startGame = () => {
    setText(generateText());
    setInput("");
    setIsActive(true);
    setIsFinished(false);
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setStartTime(Date.now());
    inputRef.current?.focus();
  };

  const resetGame = () => {
    setIsActive(false);
    setIsFinished(false);
    setText("");
    setInput("");
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
  };

  useEffect(() => {
    if (isActive && !isFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isFinished, timeLeft]);

  useEffect(() => {
    if (startTime && isActive) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
      const wordsTyped = input.trim().split(/\s+/).length;
      const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
      setWpm(currentWpm);

      // Calculate accuracy
      const correctChars = input.split("").filter((char, i) => char === text[i]).length;
      const currentAccuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;
      setAccuracy(currentAccuracy);

      // Check if finished
      if (input === text) {
        setIsFinished(true);
        setIsActive(false);
        setHighScore((prev) => Math.max(prev, currentWpm));
      }
    }
  }, [input, text, startTime, isActive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive || isFinished) return;
    setInput(e.target.value);
  };

  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = "text-muted-foreground";
      if (index < input.length) {
        className = input[index] === char ? "text-green-500" : "text-red-500 bg-red-500/10";
      } else if (index === input.length) {
        className = "text-primary bg-primary/20 animate-pulse";
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            Typing Race
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{highScore} WPM</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-1">
              <Timer className="h-4 w-4" />
              Time
            </div>
            <div className="text-2xl font-bold">{timeLeft}s</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-1">
              <Zap className="h-4 w-4" />
              WPM
            </div>
            <div className="text-2xl font-bold">{wpm}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="text-muted-foreground text-sm mb-1">Accuracy</div>
            <div className="text-2xl font-bold">{accuracy}%</div>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={(input.length / text.length) * 100} className="h-2" />

        {/* Text display */}
        <div
          className="p-6 rounded-xl bg-muted/50 font-mono text-lg leading-relaxed min-h-[120px]"
          onClick={() => inputRef.current?.focus()}
        >
          {text ? (
            renderText()
          ) : (
            <span className="text-muted-foreground">Click Start to begin typing... </span>
          )}
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          className="sr-only"
          disabled={!isActive || isFinished}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <AnimatePresence mode="wait">
            {!isActive && !isFinished ? (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Button onClick={startGame} size="lg" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Start Typing
                </Button>
              </motion.div>
            ) : isFinished ? (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="text-4xl">🎉</div>
                <h3 className="text-xl font-bold">Great Job!</h3>
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{wpm}</div>
                    <div className="text-sm text-muted-foreground">WPM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                </div>
                <Button onClick={startGame} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {isActive ? "Type the text above as fast and accurately as you can!" : "Test your typing speed"}
        </p>
      </CardContent>
    </Card>
  );
}
