"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Clock, 
  Zap,
  RotateCcw,
  Keyboard,
  BarChart3,
  Sparkles,
  Flame,
  Medal,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Word lists by difficulty
const wordLists = {
  easy: [
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
    "her", "was", "one", "our", "out", "day", "get", "has", "him", "his",
    "how", "its", "may", "new", "now", "old", "see", "two", "who", "boy"
  ],
  medium: [
    "about", "would", "there", "think", "which", "their", "other", "these",
    "after", "first", "never", "could", "where", "being", "every", "great",
    "might", "shall", "still", "those", "while", "house", "world", "below",
    "asked", "going", "large", "until", "along", "shall"
  ],
  hard: [
    "algorithm", "javascript", "developer", "interface", "framework",
    "component", "functionality", "asynchronous", "synchronization",
    "implementation", "optimization", "architecture", "deployment",
    "repository", "dependency", "configuration", "performance",
    "accessibility", "responsive", "typescript"
  ],
  code: [
    "const", "function", "return", "import", "export", "default",
    "interface", "type", "class", "extends", "implements", "async",
    "await", "promise", "try", "catch", "finally", "throw",
    "typeof", "instanceof", "void", "null", "undefined", "boolean"
  ]
};

interface GameStats {
  wpm: number;
  accuracy: number;
  wordsTyped: number;
  streak: number;
  maxStreak: number;
}

export default function TypingRacePage() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [difficulty, setDifficulty] = useState<keyof typeof wordLists>("medium");
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [stats, setStats] = useState<GameStats>({
    wpm: 0,
    accuracy: 100,
    wordsTyped: 0,
    streak: 0,
    maxStreak: 0
  });
  const [history, setHistory] = useState<GameStats[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random words
  const generateWords = useCallback(() => {
    const list = wordLists[difficulty];
    const words = [];
    for (let i = 0; i < 50; i++) {
      words.push(list[Math.floor(Math.random() * list.length)]);
    }
    return words;
  }, [difficulty]);

  // Start game
  const startGame = () => {
    setGameState("playing");
    setCurrentWords(generateWords());
    setCurrentIndex(0);
    setInput("");
    setStartTime(Date.now());
    setTimeLeft(60);
    setStats({
      wpm: 0,
      accuracy: 100,
      wordsTyped: 0,
      streak: 0,
      maxStreak: 0
    });
    inputRef.current?.focus();
  };

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(t => t - 1);
        // Update WPM in real-time
        if (startTime) {
          const elapsed = (Date.now() - startTime) / 1000 / 60;
          const wpm = Math.round(stats.wordsTyped / elapsed) || 0;
          setStats(s => ({ ...s, wpm }));
        }
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, timeLeft, startTime, stats.wordsTyped]);

  // Handle input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.endsWith(" ")) {
      const typed = value.trim();
      const target = currentWords[currentIndex];
      
      if (typed === target) {
        // Correct word
        setStats(s => ({
          ...s,
          wordsTyped: s.wordsTyped + 1,
          streak: s.streak + 1,
          maxStreak: Math.max(s.maxStreak, s.streak + 1)
        }));
        setCurrentIndex(i => i + 1);
        setInput("");
        
        // Generate more words if running low
        if (currentIndex > currentWords.length - 10) {
          setCurrentWords(w => [...w, ...generateWords()]);
        }
      } else {
        // Wrong word - reset streak
        setStats(s => ({ ...s, streak: 0 }));
        setInput("");
      }
    } else {
      setInput(value);
    }
  };

  // End game
  const endGame = () => {
    setGameState("finished");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    const finalStats = { ...stats };
    setHistory(h => [...h.slice(-4), finalStats]);
  };

  // Calculate accuracy
  const calculateAccuracy = () => {
    if (currentIndex === 0) return 100;
    const totalChars = currentWords.slice(0, currentIndex).join("").length;
    const typedChars = stats.wordsTyped > 0 ? 
      currentWords.slice(0, stats.wordsTyped).join("").length : 0;
    return Math.round((typedChars / totalChars) * 100) || 100;
  };

  // Get rank based on WPM
  const getRank = (wpm: number) => {
    if (wpm >= 100) return { label: "Legend", color: "text-yellow-500", icon: Crown };
    if (wpm >= 80) return { label: "Expert", color: "text-purple-500", icon: Medal };
    if (wpm >= 60) return { label: "Pro", color: "text-blue-500", icon: Trophy };
    if (wpm >= 40) return { label: "Intermediate", color: "text-green-500", icon: Target };
    return { label: "Beginner", color: "text-gray-500", icon: Keyboard };
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Keyboard className="w-4 h-4" />
            <span className="text-sm font-medium">Typing Challenge</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Typing{" "}
            <span className="text-gradient-animated">Race</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your typing speed and accuracy. How fast can you go?
          </p>
        </motion.div>

        {/* Difficulty Selection */}
        {gameState === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-center gap-2 flex-wrap">
              {(Object.keys(wordLists) as Array<keyof typeof wordLists>).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    difficulty === diff
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Game Area */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {gameState === "idle" ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mb-6"
                >
                  <Keyboard className="w-16 h-16 mx-auto text-primary" />
                </motion.div>
                <p className="text-muted-foreground mb-6">
                  Type as many words as you can in 60 seconds
                </p>
                <Button size="lg" onClick={startGame}>
                  <Zap className="w-4 h-4 mr-2" />
                  Start Typing
                </Button>
              </div>
            ) : gameState === "playing" ? (
              <div>
                {/* Stats Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{stats.wpm}</div>
                      <div className="text-xs text-muted-foreground">WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{calculateAccuracy()}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    {stats.streak > 2 && (
                      <div className="flex items-center gap-1 text-orange-500">
                        <Flame className="w-5 h-5" />
                        <span className="font-bold">{stats.streak}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-2xl font-mono font-bold">{timeLeft}s</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress value={(timeLeft / 60) * 100} className="mb-6" />

                {/* Words Display */}
                <div className="mb-6 p-6 rounded-xl bg-muted/50 min-h-[120px] text-lg leading-relaxed">
                  {currentWords.slice(currentIndex, currentIndex + 20).map((word, i) => (
                    <span
                      key={currentIndex + i}
                      className={`inline-block mr-3 ${
                        i === 0 ? "text-primary font-bold underline" : "text-muted-foreground"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>

                {/* Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInput}
                  placeholder="Type here..."
                  className="w-full px-4 py-4 text-xl text-center rounded-xl border-2 border-primary/20 bg-background focus:border-primary focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
            ) : (
              /* Results */
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  {(() => {
                    const rank = getRank(stats.wpm);
                    const Icon = rank.icon;
                    return (
                      <div className="inline-flex flex-col items-center">
                        <Icon className={`w-20 h-20 ${rank.color}`} />
                        <Badge className="mt-2" variant="outline">
                          {rank.label}
                        </Badge>
                      </div>
                    );
                  })()}
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-muted">
                    <div className="text-3xl font-bold text-primary">{stats.wpm}</div>
                    <div className="text-sm text-muted-foreground">WPM</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted">
                    <div className="text-3xl font-bold">{calculateAccuracy()}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted">
                    <div className="text-3xl font-bold">{stats.wordsTyped}</div>
                    <div className="text-sm text-muted-foreground">Words</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted">
                    <div className="text-3xl font-bold">{stats.maxStreak}</div>
                    <div className="text-sm text-muted-foreground">Best Streak</div>
                  </div>
                </div>

                <Button onClick={startGame} size="lg">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <span className="text-sm text-muted-foreground">
                        Attempt {history.length - i}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">{h.wpm} WPM</span>
                        <span className="text-sm text-muted-foreground">
                          {h.wordsTyped} words
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            💡 Tip: Press space after each word to submit. Accuracy matters as much as speed!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
