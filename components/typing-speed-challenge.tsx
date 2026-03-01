"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Timer, 
  Target, 
  Zap, 
  RotateCcw,
  Keyboard,
  Crown,
  Medal,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog",
  "To be or not to be that is the question",
  "All that glitters is not gold",
  "A journey of a thousand miles begins with a single step",
  "Innovation distinguishes between a leader and a follower",
  "Code is like humor when you have to explain it its bad",
  "First solve the problem then write the code",
  "Simplicity is the soul of efficiency",
  "Make it work make it right make it fast",
  "Any fool can write code that a computer can understand",
];

interface TypingStats {
  wpm: number;
  accuracy: number;
  time: number;
  characters: number;
}

export function TypingSpeedChallenge() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [currentText, setCurrentText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    time: 0,
    characters: 0,
  });
  const [highScore, setHighScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("typingHighScore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = useCallback(() => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setCurrentText(randomText);
    setUserInput("");
    setGameState("playing");
    setStartTime(Date.now());
    setStats({ wpm: 0, accuracy: 0, time: 0, characters: 0 });
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const charactersTyped = userInput.length;
    const wordsTyped = charactersTyped / 5;
    const wpm = Math.round(wordsTyped / timeElapsed) || 0;
    
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentText[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / charactersTyped) * 100) || 0;
    
    setStats({
      wpm,
      accuracy,
      time: Math.round((Date.now() - startTime) / 1000),
      characters: charactersTyped,
    });

    if (wpm > highScore) {
      setHighScore(wpm);
      localStorage.setItem("typingHighScore", wpm.toString());
    }
  }, [userInput, currentText, startTime, highScore]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    if (value === currentText) {
      calculateStats();
      setGameState("finished");
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
      const interval = setInterval(calculateStats, 100);
      return () => clearInterval(interval);
    }
  }, [gameState, calculateStats]);

  const renderText = () => {
    return currentText.split("").map((char, index) => {
      let className = "text-muted-foreground";
      
      if (index < userInput.length) {
        className = userInput[index] === char 
          ? "text-green-500" 
          : "text-red-500 bg-red-500/20";
      } else if (index === userInput.length) {
        className = "text-primary bg-primary/20 animate-pulse";
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const getRank = (wpm: number) => {
    if (wpm >= 100) return { icon: Crown, label: "Legend", color: "text-yellow-500" };
    if (wpm >= 80) return { icon: Trophy, label: "Expert", color: "text-purple-500" };
    if (wpm >= 60) return { icon: Medal, label: "Pro", color: "text-blue-500" };
    if (wpm >= 40) return { icon: Star, label: "Intermediate", color: "text-green-500" };
    return { icon: Target, label: "Beginner", color: "text-orange-500" };
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Keyboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Typing Speed Challenge</CardTitle>
              <p className="text-sm text-muted-foreground">
                Test your typing speed and accuracy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{highScore} WPM</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {gameState === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-6">⌨️</div>
            <h3 className="text-xl font-semibold mb-2">Ready to Type?</h3>
            <p className="text-muted-foreground mb-6">
              Type the text as fast and accurately as you can
            </p>
            <Button size="lg" onClick={startGame}>
              <Zap className="w-4 h-4 mr-2" />
              Start Challenge
            </Button>
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">WPM</span>
                </div>
                <p className="text-2xl font-bold">{stats.wpm}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                </div>
                <p className="text-2xl font-bold">{stats.accuracy}%</p>
              </div>
              <div className="p-4 rounded-xl bg-muted text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Timer className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Time</span>
                </div>
                <p className="text-2xl font-bold">{stats.time}s</p>
              </div>
            </div>

            {/* Progress */}
            <Progress 
              value={(userInput.length / currentText.length) * 100} 
              className="h-2"
            />

            {/* Text Display */}
            <div className="p-6 rounded-xl bg-muted/50 font-mono text-lg leading-relaxed">
              {renderText()}
            </div>

            {/* Hidden Input */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="absolute opacity-0"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />

            <p className="text-center text-sm text-muted-foreground">
              Click here and start typing
            </p>
          </motion.div>
        )}

        {gameState === "finished" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="inline-flex p-6 rounded-full bg-primary/10 mb-6">
              {(() => {
                const rank = getRank(stats.wpm);
                const Icon = rank.icon;
                return <Icon className={`w-12 h-12 ${rank.color}`} />;
              })()}
            </div>

            <h3 className="text-2xl font-bold mb-2">Challenge Complete!</h3>
            <p className="text-muted-foreground mb-6">
              You achieved {(() => {
                const rank = getRank(stats.wpm);
                return <span className={`font-semibold ${rank.color}`}>{rank.label}</span>;
              })()} rank
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-muted">
                <p className="text-3xl font-bold text-primary">{stats.wpm}</p>
                <p className="text-sm text-muted-foreground">WPM</p>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <p className="text-3xl font-bold text-green-500">{stats.accuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <p className="text-3xl font-bold text-orange-500">{stats.time}s</p>
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <p className="text-3xl font-bold text-purple-500">{stats.characters}</p>
                <p className="text-sm text-muted-foreground">Chars</p>
              </div>
            </div>

            <Button size="lg" onClick={startGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
