"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Code2,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Terminal,
  Send,
  Sparkles,
  Trophy,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";
import confetti from "canvas-confetti";

interface ChatMessage {
  id: string;
  role: "user" | "partner" | "system";
  content: string;
  timestamp: number;
  code?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  initialCode: string;
  hints: string[];
  solution: string;
  points: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Array Sum",
    description: "Write a function that returns the sum of all numbers in an array.",
    difficulty: "Easy",
    initialCode: `function sumArray(arr) {
  // Your code here
  
}`,
    hints: [
      "Try using the reduce method",
      "Or you could use a for loop to iterate through the array",
      "Don't forget to handle empty arrays!"
    ],
    solution: `function sumArray(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
    points: 100
  },
  {
    id: "2",
    title: "Palindrome Check",
    description: "Check if a string is a palindrome (reads the same forwards and backwards).",
    difficulty: "Easy",
    initialCode: `function isPalindrome(str) {
  // Your code here
  
}`,
    hints: [
      "Convert the string to lowercase first",
      "Remove non-alphanumeric characters",
      "Compare the string with its reverse"
    ],
    solution: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
    points: 150
  },
  {
    id: "3",
    title: "Debounce Function",
    description: "Implement a debounce function that limits how often a function can fire.",
    difficulty: "Medium",
    initialCode: `function debounce(func, wait) {
  // Your code here
  
}`,
    hints: [
      "Use setTimeout to delay execution",
      "Clear the timeout if the function is called again",
      "Use closures to maintain state"
    ],
    solution: `function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`,
    points: 250
  }
];

const PARTNER_MESSAGES = [
  "Hey! Ready to pair program? I'll guide you through this challenge.",
  "Great start! Let me know if you need a hint.",
  "Hmm, that's an interesting approach. Have you considered edge cases?",
  "Nice! You're getting closer. Want to try running the code?",
  "Excellent work! That solution is clean and efficient.",
  "Don't worry about mistakes, that's how we learn! Try again.",
  "I like your thinking! Let's optimize it a bit more.",
  "Perfect! You've got the logic down. Ready for the next challenge?"
];

export function PairProgrammingSimulator() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [code, setCode] = useState(CHALLENGES[0].initialCode);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: "0",
        role: "partner",
        content: PARTNER_MESSAGES[0],
        timestamp: Date.now()
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate partner response
    setTimeout(() => {
      const responseMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "partner",
        content: PARTNER_MESSAGES[Math.floor(Math.random() * PARTNER_MESSAGES.length)],
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, responseMsg]);
      setIsTyping(false);
    }, 1500);
  }, [inputMessage]);

  const handleRunCode = useCallback(() => {
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      const success = Math.random() > 0.3; // Simulate success/failure
      
      const systemMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "system",
        content: success ? "✅ All tests passed!" : "❌ Some tests failed. Check your logic.",
        timestamp: Date.now(),
        code: code
      };

      setMessages(prev => [...prev, systemMsg]);
      
      if (success) {
        setScore(s => s + currentChallenge.points);
        setCompleted(c => [...c, currentChallenge.id]);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      setIsRunning(false);
    }, 2000);
  }, [code, currentChallenge]);

  const handleShowHint = useCallback(() => {
    if (hintIndex < currentChallenge.hints.length) {
      const hintMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "partner",
        content: `💡 Hint: ${currentChallenge.hints[hintIndex]}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, hintMsg]);
      setHintIndex(i => i + 1);
      setScore(s => Math.max(0, s - 25)); // Penalty for using hints
    }
  }, [hintIndex, currentChallenge]);

  const handleNextChallenge = useCallback(() => {
    const nextIndex = CHALLENGES.findIndex(c => c.id === currentChallenge.id) + 1;
    if (nextIndex < CHALLENGES.length) {
      setCurrentChallenge(CHALLENGES[nextIndex]);
      setCode(CHALLENGES[nextIndex].initialCode);
      setHintIndex(0);
      setTimeElapsed(0);
      setMessages([
        {
          id: Date.now().toString(),
          role: "partner",
          content: `Great job on the last one! Let's tackle: ${CHALLENGES[nextIndex].title}`,
          timestamp: Date.now()
        }
      ]);
    }
  }, [currentChallenge]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Collaborative Coding</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pair Programming{" "}
            <span className="text-gradient-animated">Simulator</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the magic of pair programming. Work through coding challenges 
            with your AI partner, get hints, and level up your skills.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge Info */}
          <ScrollReveal direction="left" className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-card border border-border h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Challenge</h3>
                <Badge variant={currentChallenge.difficulty === "Easy" ? "default" : currentChallenge.difficulty === "Medium" ? "secondary" : "destructive"}>
                  {currentChallenge.difficulty}
                </Badge>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current</p>
                  <p className="font-medium">{currentChallenge.title}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentChallenge.description}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm">Score</span>
                  </div>
                  <span className="font-bold">{score}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Time</span>
                  </div>
                  <span className="font-bold">{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="font-bold">{completed.length}/{CHALLENGES.length}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleShowHint}
                  disabled={hintIndex >= currentChallenge.hints.length}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get Hint ({currentChallenge.hints.length - hintIndex} left)
                </Button>
                {completed.includes(currentChallenge.id) && (
                  <Button 
                    className="w-full"
                    onClick={handleNextChallenge}
                  >
                    Next Challenge
                    <Zap className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Code Editor */}
          <ScrollReveal className="lg:col-span-1">
            <div className="rounded-2xl bg-card border border-border overflow-hidden h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Editor</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setCode(currentChallenge.initialCode)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 p-4 bg-muted/50">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-transparent font-mono text-sm resize-none focus:outline-none"
                  spellCheck={false}
                />
              </div>
              <div className="p-4 border-t border-border">
                <Button 
                  className="w-full"
                  onClick={handleRunCode}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                      </motion.div>
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Chat */}
          <ScrollReveal direction="right" className="lg:col-span-1">
            <div className="rounded-2xl bg-card border border-border overflow-hidden h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Your Partner</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-br-md" 
                        : msg.role === "system"
                        ? "bg-muted text-foreground"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-secondary p-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask your partner..."
                    className="flex-1 px-4 py-2 rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
