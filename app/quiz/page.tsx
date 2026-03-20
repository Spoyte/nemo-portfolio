"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Code2, 
  Trophy, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Target,
  Zap,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

const questions: Question[] = [
  {
    id: 1,
    question: "What does 'hoisting' mean in JavaScript?",
    options: [
      "Moving DOM elements up in the page",
      "Default behavior of moving declarations to the top",
      "Optimizing code for faster execution",
      "Lifting state in React components"
    ],
    correctAnswer: 1,
    explanation: "Hoisting is JavaScript's default behavior of moving all declarations to the top of the current scope.",
    category: "JavaScript",
    difficulty: "medium"
  },
  {
    id: 2,
    question: "Which CSS property creates a stacking context?",
    options: [
      "display: flex",
      "position: relative with z-index",
      "opacity: 0.99",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All these properties can create a new stacking context in CSS.",
    category: "CSS",
    difficulty: "hard"
  },
  {
    id: 3,
    question: "What is the time complexity of Array.prototype.sort()?",
    options: [
      "O(n)",
      "O(n log n)",
      "O(n²)",
      "O(log n)"
    ],
    correctAnswer: 1,
    explanation: "JavaScript's sort() uses Timsort or Quicksort, both O(n log n) on average.",
    category: "Algorithms",
    difficulty: "medium"
  },
  {
    id: 4,
    question: "What does 'use strict' do in JavaScript?",
    options: [
      "Enables strict type checking",
      "Prevents use of undeclared variables",
      "Optimizes code for production",
      "Enables ES6 features"
    ],
    correctAnswer: 1,
    explanation: "Strict mode eliminates some JavaScript silent errors by changing them to throw errors.",
    category: "JavaScript",
    difficulty: "easy"
  },
  {
    id: 5,
    question: "Which HTTP status code indicates a successful creation?",
    options: [
      "200 OK",
      "201 Created",
      "204 No Content",
      "202 Accepted"
    ],
    correctAnswer: 1,
    explanation: "201 Created indicates that the request has succeeded and has led to the creation of a resource.",
    category: "HTTP",
    difficulty: "easy"
  },
  {
    id: 6,
    question: "What is React's Virtual DOM?",
    options: [
      "A direct copy of the real DOM",
      "A lightweight JavaScript representation of the DOM",
      "A browser API for DOM manipulation",
      "A CSS-in-JS solution"
    ],
    correctAnswer: 1,
    explanation: "The Virtual DOM is a JavaScript object that represents the real DOM structure.",
    category: "React",
    difficulty: "easy"
  },
  {
    id: 7,
    question: "What is the output of: typeof null?",
    options: [
      "'null'",
      "'undefined'",
      "'object'",
      "'number'"
    ],
    correctAnswer: 2,
    explanation: "This is a known bug in JavaScript - typeof null returns 'object'.",
    category: "JavaScript",
    difficulty: "medium"
  },
  {
    id: 8,
    question: "Which Git command creates a new branch and switches to it?",
    options: [
      "git branch new-branch",
      "git checkout -b new-branch",
      "git switch new-branch",
      "Both B and C"
    ],
    correctAnswer: 3,
    explanation: "Both 'git checkout -b' and 'git switch -c' (or just 'git switch' in newer versions) create and switch branches.",
    category: "Git",
    difficulty: "easy"
  },
  {
    id: 9,
    question: "What is memoization?",
    options: [
      "A React hook for state management",
      "Caching function results to avoid recomputation",
      "A type of database indexing",
      "A CSS optimization technique"
    ],
    correctAnswer: 1,
    explanation: "Memoization is an optimization technique that stores expensive function calls and returns cached results.",
    category: "Programming",
    difficulty: "medium"
  },
  {
    id: 10,
    question: "What does CORS stand for?",
    options: [
      "Cross-Origin Resource Sharing",
      "Cross-Origin Request Security",
      "Client-Side Resource Sharing",
      "Cross-Origin Response Service"
    ],
    correctAnswer: 0,
    explanation: "CORS (Cross-Origin Resource Sharing) is a mechanism that allows restricted resources on a web page.",
    category: "HTTP",
    difficulty: "easy"
  }
];

const difficultyColors = {
  easy: "bg-green-500/10 text-green-500",
  medium: "bg-yellow-500/10 text-yellow-500",
  hard: "bg-red-500/10 text-red-500"
};

export default function DeveloperQuizPage() {
  const [gameState, setGameState] = useState<"intro" | "playing" | "finished">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; correct: boolean }[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("quizBestScore");
    if (saved) setBestScore(parseInt(saved));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing" && !showExplanation && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAnswer(-1); // Time's up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, showExplanation, currentQuestion]);

  const startQuiz = () => {
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeRemaining(30);
    setStreak(0);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore((prev) => prev + 10 + streak * 2);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
    
    setAnswers((prev) => [...prev, { questionId: questions[currentQuestion].id, correct: isCorrect }]);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeRemaining(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setGameState("finished");
    const finalScore = score + answers.filter(a => a.correct).length * 10;
    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem("quizBestScore", finalScore.toString());
    }
    
    if (answers.filter(a => a.correct).length >= 7) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#dc2626", "#ea580c", "#f59e0b", "#10b981", "#3b82f6"]
      });
    }
  };

  const getCategoryStats = () => {
    const stats: Record<string, { total: number; correct: number }> = {};
    answers.forEach((answer, idx) => {
      const category = questions[idx].category;
      if (!stats[category]) stats[category] = { total: 0, correct: 0 };
      stats[category].total++;
      if (answer.correct) stats[category].correct++;
    });
    return stats;
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">Test Your Knowledge</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Developer <span className="text-gradient-animated">Quiz</span>
          </h1>
          <p className="text-muted-foreground">
            Challenge yourself with {questions.length} coding questions
          </p>
        </motion.div>

        {/* Intro Screen */}
        {gameState === "intro" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                <Target className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Ready to Test Your Skills?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Answer {questions.length} questions covering JavaScript, CSS, React, Git, and more. 
                You have 30 seconds per question.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {["JavaScript", "CSS", "React", "Git", "HTTP", "Algorithms"].map((cat) => (
                  <Badge key={cat} variant="secondary">{cat}</Badge>
                ))}
              </div>
              
              {bestScore > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-primary/5">
                  <p className="text-sm text-muted-foreground">Your Best Score</p>
                  <p className="text-3xl font-bold text-primary">{bestScore}</p>
                </div>
              )}
              
              <Button size="lg" onClick={startQuiz} className="gap-2">
                <Zap className="h-4 w-4" />
                Start Quiz
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Playing Screen */}
        {gameState === "playing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Score: {score}</span>
                  {streak > 1 && (
                    <Badge className="bg-orange-500/10 text-orange-500">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {streak}x Streak!
                    </Badge>
                  )}
                </div>
              </div>
              <Progress value={((currentQuestion + 1) / questions.length) * 100} />
            </div>

            {/* Timer */}
            {!showExplanation && (
              <div className="flex items-center justify-center gap-2 mb-6">
                <Timer className={`h-5 w-5 ${timeRemaining <= 5 ? 'text-red-500' : 'text-muted-foreground'}`} />
                <span className={`text-lg font-mono font-bold ${timeRemaining <= 5 ? 'text-red-500' : ''}`}>
                  {timeRemaining}s
                </span>
              </div>
            )}

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">{questions[currentQuestion].category}</Badge>
                    <Badge className={difficultyColors[questions[currentQuestion].difficulty]}>
                      {questions[currentQuestion].difficulty}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-semibold mb-6">
                    {questions[currentQuestion].question}
                  </h3>

                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === questions[currentQuestion].correctAnswer;
                      const showCorrect = showExplanation && isCorrect;
                      const showWrong = showExplanation && isSelected && !isCorrect;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            showCorrect
                              ? "border-green-500 bg-green-500/10"
                              : showWrong
                              ? "border-red-500 bg-red-500/10"
                              : isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                            {showWrong && <XCircle className="h-5 w-5 text-red-500" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-4 rounded-xl bg-muted"
                      >
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium mb-1">Explanation</p>
                            <p className="text-sm text-muted-foreground">
                              {questions[currentQuestion].explanation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Next Button */}
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 flex justify-end"
                    >
                      <Button onClick={nextQuestion} className="gap-2">
                        {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Results Screen */}
        {gameState === "finished" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-muted-foreground mb-4">
                  You got {answers.filter(a => a.correct).length} out of {questions.length} correct
                </p>
                
                <div className="text-5xl font-bold text-gradient mb-2">
                  {score} pts
                </div>
                
                {score === bestScore && score > 0 && (
                  <Badge className="bg-primary/10 text-primary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New High Score!
                  </Badge>
                )}
              </div>

              {/* Category Breakdown */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Performance by Category</h3>
                <div className="space-y-3">
                  {Object.entries(getCategoryStats()).map(([category, stats]) => (
                    <div key={category} className="flex items-center gap-4">
                      <span className="w-24 text-sm">{category}</span>
                      <div className="flex-1">
                        <Progress value={(stats.correct / stats.total) * 100} />
                      </div>
                      <span className="text-sm font-medium">
                        {stats.correct}/{stats.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Answer Review */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Answer Review</h3>
                <div className="flex flex-wrap gap-2">
                  {answers.map((answer, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                        answer.correct
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={startQuiz} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
