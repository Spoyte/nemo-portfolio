"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Zap, 
  Brain, 
  Code2, 
  Palette,
  Timer,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  Flame,
  Star,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface Challenge {
  id: string;
  type: "quiz" | "speed" | "memory" | "logic" | "creative";
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  timeLimit?: number;
  content: {
    question?: string;
    options?: string[];
    correctAnswer?: number;
    code?: string;
    task?: string;
  };
}

const challenges: Challenge[] = [
  {
    id: "1",
    type: "quiz",
    title: "CSS Selector Quiz",
    description: "Test your CSS knowledge with this quick selector challenge!",
    difficulty: "easy",
    points: 10,
    content: {
      question: "Which selector targets all \u003cp\u003e elements inside a \u003cdiv\u003e?",
      options: ["div p", "div > p", "div + p", "div ~ p"],
      correctAnswer: 0
    }
  },
  {
    id: "2",
    type: "quiz",
    title: "JavaScript Scope",
    description: "Understanding variable scope is crucial!",
    difficulty: "medium",
    points: 15,
    content: {
      question: "What does this code output?\n\nconst x = 1;\nfunction foo() {\n  console.log(x);\n  const x = 2;\n}\nfoo();",
      options: ["1", "2", "undefined", "ReferenceError"],
      correctAnswer: 3
    }
  },
  {
    id: "3",
    type: "logic",
    title: "Array Manipulation",
    description: "Can you solve this array puzzle?",
    difficulty: "medium",
    points: 20,
    content: {
      question: "What is the result of: [1, 2, 3].map(n =\u003e n * 2).filter(n =\u003e n \u003e 2)?",
      options: ["[2, 4, 6]", "[4, 6]", "[2, 4]", "[6]"],
      correctAnswer: 1
    }
  },
  {
    id: "4",
    type: "quiz",
    title: "React Hooks",
    description: "Test your React knowledge!",
    difficulty: "hard",
    points: 25,
    content: {
      question: "Which hook is used to perform side effects in functional components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correctAnswer: 1
    }
  },
  {
    id: "5",
    type: "creative",
    title: "Color Theory",
    description: "What color complements blue on the color wheel?",
    difficulty: "easy",
    points: 10,
    content: {
      question: "What is the complementary color of blue?",
      options: ["Green", "Red", "Orange", "Purple"],
      correctAnswer: 2
    }
  }
];

const difficultyColors = {
  easy: "text-green-500 bg-green-500/10 border-green-500/20",
  medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  hard: "text-red-500 bg-red-500/10 border-red-500/20"
};

const typeIcons = {
  quiz: Brain,
  speed: Timer,
  memory: Target,
  logic: Code2,
  creative: Palette
};

export function DailyChallenge() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set\u003cstring\u003e\u003e(new Set());
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(challenge.timeLimit || 30);
    setIsTimerActive(true);
  };

  const handleAnswer = (index: number) => {
    if (!currentChallenge || showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    setIsTimerActive(false);
    
    const correct = index === currentChallenge.content.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setStreak(s => s + 1);
      setTotalPoints(p => p + currentChallenge.points);
      setCompletedChallenges(prev => new Set(prev).add(currentChallenge.id));
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#dc2626", "#ea580c", "#fbbf24"]
      });
    } else {
      setStreak(0);
    }
  };

  const closeChallenge = () => {
    setCurrentChallenge(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsTimerActive(false);
  };

  const resetProgress = () => {
    setStreak(0);
    setTotalPoints(0);
    setCompletedChallenges(new Set());
  };

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft \u003e 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setShowResult(true);
      setIsCorrect(false);
      setIsTimerActive(false);
      setStreak(0);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerActive, timeLeft]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("daily-challenge-progress");
    if (saved) {
      const { streak, totalPoints, completed } = JSON.parse(saved);
      setStreak(streak);
      setTotalPoints(totalPoints);
      setCompletedChallenges(new Set(completed));
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem("daily-challenge-progress", JSON.stringify({
      streak,
      totalPoints,
      completed: Array.from(completedChallenges)
    }));
  }, [streak, totalPoints, completedChallenges]);

  if (currentChallenge) {
    const Icon = typeIcons[currentChallenge.type];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeChallenge}
        >
          <motion.div
            className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${difficultyColors[currentChallenge.difficulty]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">{currentChallenge.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[currentChallenge.difficulty]}`}>
                    {currentChallenge.difficulty}
                  </span>
                </div>
              </div>
              
              {isTimerActive && (
                <div className={`text-2xl font-bold ${timeLeft \u003c= 5 ? "text-red-500 animate-pulse" : ""}`}>
                  {timeLeft}s
                </div>
              )}
            </div>

            {/* Question */}
            <div className="mb-6">
              <p className="text-lg font-medium mb-2">{currentChallenge.content.question}</p>
              {currentChallenge.description && (
                <p className="text-sm text-muted-foreground">{currentChallenge.description}</p>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentChallenge.content.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentChallenge.content.correctAnswer;
                const showCorrectness = showResult && (isCorrectAnswer || isSelected);

                return (
                  <motion.button
                    key={index}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      showCorrectness
                        ? isCorrectAnswer
                          ? "border-green-500 bg-green-500/10"
                          : isSelected
                          ? "border-red-500 bg-red-500/10"
                          : "border-border bg-card"
                        : isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showCorrectness && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {showCorrectness && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Result */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl mb-4 ${
                    isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <>
                        <Trophy className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="font-bold text-green-500">Correct! +{currentChallenge.points} points</p>
                          <p className="text-sm text-muted-foreground">Streak: {streak} 🔥</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8 text-red-500" />
                        <div>
                          <p className="font-bold text-red-500">Not quite right</p>
                          <p className="text-sm text-muted-foreground">Streak reset. Try another challenge!</p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeChallenge} className="flex-1">
                Close
              </Button>
              {showResult && (
                <Button 
                  onClick={closeChallenge}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold">Daily Challenges</h3>
            <p className="text-sm text-muted-foreground">Test your skills & earn points</p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={resetProgress}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-xl bg-muted">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-bold">{streak}</span>
          </div>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>
        
        <div className="text-center p-3 rounded-xl bg-muted">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-bold">{totalPoints}</span>
          </div>
          <p className="text-xs text-muted-foreground">Points</p>
        </div>
        
        <div className="text-center p-3 rounded-xl bg-muted">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-green-500" />
            <span className="font-bold">{completedChallenges.size}/{challenges.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
      </div>

      {/* Challenge List */}
      <div className="space-y-3">
        {challenges.map((challenge) => {
          const Icon = typeIcons[challenge.type];
          const isCompleted = completedChallenges.has(challenge.id);

          return (
            <motion.button
              key={challenge.id}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startChallenge(challenge)}
              disabled={isCompleted}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                isCompleted
                  ? "border-green-500/30 bg-green-500/5 opacity-60"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${difficultyColors[challenge.difficulty]}`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{challenge.title}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${difficultyColors[challenge.difficulty]}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{challenge.description}</p>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-primary">+{challenge.points}</p>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Daily Progress</span>
          <span className="font-medium">{Math.round((completedChallenges.size / challenges.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedChallenges.size / challenges.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
