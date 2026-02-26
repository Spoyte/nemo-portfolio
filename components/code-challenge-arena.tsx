"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  Code2,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Trophy,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: { input: string; expected: string }[];
}

const challenges: Challenge[] = [
  {
    id: "reverse-string",
    title: "Reverse a String",
    description: "Write a function that reverses a string. For example, 'hello' should become 'olleh'.",
    difficulty: "easy",
    starterCode: `function reverseString(str) {
  // Your code here
  
}`,
    solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
    hints: [
      "Think about converting the string to an array",
      "Arrays have a built-in reverse method",
      "Don't forget to join the array back into a string",
    ],
    testCases: [
      { input: "hello", expected: "olleh" },
      { input: "world", expected: "dlrow" },
      { input: "JavaScript", expected: "tpircSavaJ" },
    ],
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    description: "Write a function that returns 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for multiples of both, and the number itself otherwise.",
    difficulty: "easy",
    starterCode: `function fizzBuzz(n) {
  // Your code here
  
}`,
    solution: `function fizzBuzz(n) {
  if (n % 3 === 0 && n % 5 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}`,
    hints: [
      "Check for multiples of both 3 and 5 first",
      "Use the modulo operator (%) to check for multiples",
      "Remember to convert the number to a string for the default case",
    ],
    testCases: [
      { input: "3", expected: "Fizz" },
      { input: "5", expected: "Buzz" },
      { input: "15", expected: "FizzBuzz" },
      { input: "7", expected: "7" },
    ],
  },
  {
    id: "palindrome",
    title: "Palindrome Checker",
    description: "Write a function that checks if a string is a palindrome (reads the same forwards and backwards).",
    difficulty: "medium",
    starterCode: `function isPalindrome(str) {
  // Your code here
  
}`,
    solution: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
    hints: [
      "Consider removing non-alphanumeric characters",
      "Convert to lowercase for case-insensitive comparison",
      "Compare the string with its reverse",
    ],
    testCases: [
      { input: "racecar", expected: "true" },
      { input: "hello", expected: "false" },
      { input: "A man a plan a canal Panama", expected: "true" },
    ],
  },
  {
    id: "two-sum",
    title: "Two Sum",
    description: "Given an array of numbers and a target, return the indices of two numbers that add up to the target.",
    difficulty: "medium",
    starterCode: `function twoSum(nums, target) {
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
      "Use a hash map to store visited numbers",
      "For each number, check if its complement exists",
      "The complement is target - current number",
    ],
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" },
      { input: "[3,3], 6", expected: "[0,1]" },
    ],
  },
];

export function CodeChallengeArena() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [code, setCode] = useState(challenges[0].starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showSolution, setShowSolution] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    setCode(challenge.starterCode);
    setOutput([]);
    setShowHints(false);
    setHintIndex(0);
    setShowSolution(false);
    setTimeElapsed(0);
    setIsActive(false);
  }, [currentChallenge, challenge]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const runCode = () => {
    setIsRunning(true);
    setIsActive(false);
    const results: string[] = [];

    try {
      // Create a safe-ish eval environment
      const fn = new Function(`return ${code}`)();

      challenge.testCases.forEach((testCase, index) => {
        try {
          let result;
          if (challenge.id === "two-sum") {
            const [numsStr, targetStr] = testCase.input.split("], ");
            const nums = JSON.parse(numsStr + "]");
            const target = parseInt(targetStr);
            result = fn(nums, target);
          } else if (challenge.id === "fizzbuzz") {
            result = fn(parseInt(testCase.input));
          } else {
            result = fn(testCase.input);
          }

          const resultStr = Array.isArray(result) ? JSON.stringify(result) : String(result);
          const passed = resultStr === testCase.expected;

          results.push(
            `${passed ? "✓" : "✗"} Test ${index + 1}: ${testCase.input} → ${resultStr} ${passed ? "✓" : `(expected: ${testCase.expected})`}`
          );
        } catch (err) {
          results.push(`✗ Test ${index + 1}: Error - ${err}`);
        }
      });

      const allPassed = results.every((r) => r.startsWith("✓"));
      if (allPassed) {
        setCompleted((prev) => new Set([...prev, challenge.id]));
        results.push("", "🎉 All tests passed! Great job!");
      }
    } catch (err) {
      results.push(`Error: ${err}`);
    }

    setOutput(results);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completed.size} / {challenges.length} completed
            </span>
          </div>
          <Progress value={(completed.size / challenges.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Challenge Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {challenges.map((c, index) => (
          <Button
            key={c.id}
            variant={currentChallenge === index ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentChallenge(index)}
            className="flex-shrink-0 gap-2"
          >
            {completed.has(c.id) && <Trophy className="h-3 w-3 text-yellow-500" />}
            {c.title}
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                c.difficulty === "easy" && "bg-green-500/10 text-green-500",
                c.difficulty === "medium" && "bg-yellow-500/10 text-yellow-500",
                c.difficulty === "hard" && "bg-red-500/10 text-red-500"
              )}
            >
              {c.difficulty}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Challenge Description */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                {challenge.title}
              </CardTitle>
              <CardDescription className="mt-2">{challenge.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatTime(timeElapsed)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Hints */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowHints(!showHints);
                if (!showHints) setIsActive(true);
              }}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              {showHints ? "Hide Hints" : "Show Hints"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSolution(!showSolution);
                if (!showSolution) setIsActive(true);
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showSolution ? "Hide Solution" : "Show Solution"}
            </Button>
          </div>

          <AnimatePresence>
            {showHints && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-muted rounded-lg p-4"
              >
                <p className="font-medium mb-2">Hints:</p>
                <ul className="space-y-1">
                  {challenge.hints.slice(0, hintIndex + 1).map((hint, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {i + 1}. {hint}
                    </li>
                  ))}
                </ul>
                {hintIndex < challenge.hints.length - 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHintIndex((i) => i + 1)}
                    className="mt-2"
                  >
                    Show Next Hint
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSolution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-500/5 border border-green-500/20 rounded-lg p-4"
              >
                <p className="font-medium mb-2 text-green-600">Solution:</p>
                <pre className="text-sm overflow-x-auto">{challenge.solution}</pre>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Code Editor */}
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (!isActive) setIsActive(true);
              }}
              className="w-full h-64 p-4 font-mono text-sm bg-slate-950 text-slate-50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              spellCheck={false}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
              onClick={() => {
                setCode(challenge.starterCode);
                setOutput([]);
                setTimeElapsed(0);
                setIsActive(false);
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Output */}
          <AnimatePresence>
            {output.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-950 rounded-lg p-4 font-mono text-sm"
              >
                <p className="text-muted-foreground mb-2">Output:</p>
                {output.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "py-0.5",
                      line.startsWith("✓") && "text-green-400",
                      line.startsWith("✗") && "text-red-400",
                      line.startsWith("🎉") && "text-yellow-400 font-bold"
                    )}
                  >
                    {line}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
