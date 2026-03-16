"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap,
  Code2,
  Trophy,
  Clock,
  Target,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Brain,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  category: string;
  initialCode: string;
  solution: string;
  hints: string[];
  testCases: { input: string; expected: string }[];
  timeLimit: number;
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Two Sum",
    description: "Given an array of integers and a target, return indices of two numbers that add up to target.",
    difficulty: "easy",
    category: "Arrays",
    initialCode: `function twoSum(nums, target) {
  // Your code here
  
}`,
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    hints: [
      "Consider using a hash map for O(n) time complexity",
      "For each number, check if its complement exists in the map",
      "Store each number's index as you iterate"
    ],
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" },
      { input: "[3,3], 6", expected: "[0,1]" }
    ],
    timeLimit: 300
  },
  {
    id: "2",
    title: "Valid Parentheses",
    description: "Given a string containing just the characters '()', '{}', '[]', determine if the input string is valid.",
    difficulty: "medium",
    category: "Stack",
    initialCode: `function isValid(s) {
  // Your code here
  
}`,
    solution: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    hints: [
      "Use a stack data structure",
      "Push opening brackets, pop and match closing brackets",
      "The string is valid if the stack is empty at the end"
    ],
    testCases: [
      { input: '"()"', expected: "true" },
      { input: '"()[]{}"', expected: "true" },
      { input: '"(]"', expected: "false" }
    ],
    timeLimit: 420
  },
  {
    id: "3",
    title: "Merge K Sorted Lists",
    description: "Merge k sorted linked lists and return it as one sorted list.",
    difficulty: "hard",
    category: "Linked List",
    initialCode: `function mergeKLists(lists) {
  // Your code here
  
}`,
    solution: `function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;
  
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = lists[i + 1] || null;
      merged.push(mergeTwoLists(l1, l2));
    }
    lists = merged;
  }
  return lists[0];
}

function mergeTwoLists(l1, l2) {
  const dummy = { val: 0, next: null };
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.val < l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  current.next = l1 || l2;
  return dummy.next;
}`,
    hints: [
      "Use a divide and conquer approach",
      "Merge lists two at a time",
      "Time complexity should be O(N log k)"
    ],
    testCases: [
      { input: "[[1,4,5],[1,3,4],[2,6]]", expected: "[1,1,2,3,4,4,5,6]" },
      { input: "[]", expected: "[]" },
      { input: "[[]]", expected: "[]" }
    ],
    timeLimit: 600
  }
];

export function CodingDojo() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [code, setCode] = useState(challenges[0].initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(challenges[0].timeLimit);
  const [showSolution, setShowSolution] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [results, setResults] = useState<{ passed: boolean; output: string }[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    setCode(challenge.initialCode);
    setTimeLeft(challenge.timeLimit);
    setShowSolution(false);
    setCurrentHint(0);
    setShowHints(false);
    setResults([]);
  }, [currentChallenge, challenge]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runCode = useCallback(() => {
    setIsRunning(true);
    const testResults = challenge.testCases.map(testCase => {
      try {
        // Safe evaluation for demo purposes
        const userFn = new Function('return ' + code)();
        let result;
        
        if (challenge.id === "1") {
          const match = testCase.input.match(/\[(.*?)\],\s*(\d+)/);
          if (match) {
            const nums = match[1].split(',').map(n => parseInt(n.trim()));
            const target = parseInt(match[2]);
            result = userFn(nums, target);
          }
        } else if (challenge.id === "2") {
          const input = testCase.input.replace(/"/g, '');
          result = userFn(input);
        }
        
        const passed = JSON.stringify(result) === testCase.expected;
        return { passed, output: JSON.stringify(result) };
      } catch (error) {
        return { passed: false, output: String(error) };
      }
    });
    
    setResults(testResults);
    
    const allPassed = testResults.every(r => r.passed);
    if (allPassed && !completed.includes(challenge.id)) {
      setScore(s => s + (challenge.difficulty === 'easy' ? 100 : challenge.difficulty === 'medium' ? 200 : 300));
      setStreak(s => s + 1);
      setCompleted(c => [...c, challenge.id]);
    }
    
    setIsRunning(false);
  }, [code, challenge, completed]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'hard': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'expert': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return '';
    }
  };

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Coding{" "}
            <span className="text-gradient-animated">Dojo</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sharpen your algorithm skills with timed challenges. Practice, learn, and level up your coding abilities.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge List */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Challenges
            </h3>
            <div className="space-y-3">
              {challenges.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setCurrentChallenge(idx)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    currentChallenge === idx
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{c.title}</span>
                    {completed.includes(c.id) && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(c.difficulty)}`}>
                      {c.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{c.category}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-primary/5">
                  <p className="text-2xl font-bold text-primary">{score}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-orange-500/5">
                  <p className="text-2xl font-bold text-orange-500">{streak}</p>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Code Editor */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className={timeLeft < 60 ? 'text-red-500' : ''}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="relative mb-4">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/50 rounded-l-lg border-r border-border flex flex-col items-center py-4 text-xs text-muted-foreground font-mono">
                {code.split('\n').map((_, i) => (
                  <span key={i} className="leading-6">{i + 1}</span>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-64 pl-14 pr-4 py-4 font-mono text-sm bg-muted/30 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                spellCheck={false}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="gap-2"
                >
                  {isRunning ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Code
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCode(challenge.initialCode)}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowHints(!showHints)}
                  className="gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Hints
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? 'Hide' : 'Show'} Solution
              </Button>
            </div>

            {/* Hints */}
            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <Card className="p-4 bg-yellow-500/5 border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-sm">Hint {currentHint + 1} of {challenge.hints.length}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.hints[currentHint]}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentHint(Math.max(0, currentHint - 1))}
                        disabled={currentHint === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentHint(Math.min(challenge.hints.length - 1, currentHint + 1))}
                        disabled={currentHint === challenge.hints.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Solution */}
            <AnimatePresence>
              {showSolution && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <Card className="p-4 bg-green-500/5 border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Solution</span>
                    </div>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
                      {challenge.solution}
                    </pre>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Test Results */}
            {results.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Test Results</h4>
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      result.passed
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <Zap className="h-4 w-4 text-green-500" />
                      ) : (
                        <Target className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">Test Case {idx + 1}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Output: {result.output}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Test Cases Info */}
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="font-medium text-sm mb-2">Test Cases</h4>
              <div className="space-y-2">
                {challenge.testCases.map((test, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <code className="text-xs bg-muted px-2 py-1 rounded">Input: {test.input}</code>
                    <span className="text-muted-foreground">Expected: {test.expected}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
