"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bug,
  Search,
  Trophy,
  Target,
  Zap,
  Gift,
  Lock,
  Unlock,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Code2,
  Terminal,
  RefreshCw,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";
import confetti from "canvas-confetti";

interface BugBounty {
  id: string;
  title: string;
  description: string;
  hint: string;
  location: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Legendary";
  points: number;
  isFound: boolean;
  foundAt?: number;
  foundBy?: string;
}

const BUG_BOUNTIES: BugBounty[] = [
  {
    id: "1",
    title: "The Console Whisperer",
    description: "Sometimes the best secrets are hidden in plain sight. Have you checked the console?",
    hint: "Press F12 and look for a friendly message",
    location: "Browser Console",
    difficulty: "Easy",
    points: 50
  },
  {
    id: "2",
    title: "Konami Code Legacy",
    description: "The classic cheat code still works. Up, up, down, down...",
    hint: "↑ ↑ ↓ ↓ ← → ← → B A",
    location: "Any page",
    difficulty: "Easy",
    points: 100
  },
  {
    id: "3",
    title: "Hidden in the Source",
    description: "There's a comment in the HTML that shouldn't be there.",
    hint: "View page source and search for 'SECRET'",
    location: "HTML Source",
    difficulty: "Medium",
    points: 150
  },
  {
    id: "4",
    title: "The Invisible Link",
    description: "Somewhere on the home page, there's a link you can't see... unless you know where to look.",
    hint: "Try hovering over the corners of the hero section",
    location: "Home Page",
    difficulty: "Medium",
    points: 200
  },
  {
    id: "5",
    title: "404 Treasure",
    description: "Not all errors are bad. Visit a page that doesn't exist.",
    hint: "Try any random URL like /secret-squirrel",
    location: "404 Page",
    difficulty: "Medium",
    points: 150
  },
  {
    id: "6",
    title: "The Color Code",
    description: "A specific sequence of colors unlocks something special.",
    hint: "Click the theme toggle 5 times rapidly",
    location: "Navigation",
    difficulty: "Hard",
    points: 300
  },
  {
    id: "7",
    title: "Midnight Visitor",
    description: "Some features only appear when the stars align... or at a specific time.",
    hint: "Visit the site at exactly 11:11 PM",
    location: "Time-based",
    difficulty: "Hard",
    points: 400
  },
  {
    id: "8",
    title: "The Architect's Secret",
    description: "Only those who understand the building blocks can find this one.",
    hint: "Inspect the footer and look for data attributes",
    location: "Footer",
    difficulty: "Legendary",
    points: 1000
  }
];

export function BugBountyGame() {
  const [bugs, setBugs] = useState<BugBounty[]>(BUG_BOUNTIES.map(b => ({ ...b, isFound: false })));
  const [score, setScore] = useState(0);
  const [foundBugs, setFoundBugs] = useState<string[]>([]);

  const handleFindBug = useCallback((bugId: string) => {
    const bug = bugs.find(b => b.id === bugId);
    if (!bug || bug.isFound) return;

    setBugs(prev => prev.map(b => b.id === bugId ? { ...b, isFound: true, foundAt: Date.now(), foundBy: "You" } : b));
    setScore(s => s + bug.points);
    setFoundBugs(prev => [...prev, bugId]);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#dc2626", "#ea580c", "#fbbf24", "#84cc16"]
    });
  }, [bugs]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Hard": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Legendary": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const totalPoints = BUG_BOUNTIES.reduce((sum, b) => sum + b.points, 0);
  const progress = (score / totalPoints) * 100;

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-orange-500/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Bug className="h-4 w-4" />
            <span className="text-sm font-medium">Bug Bounty Hunt</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find the{" "}
            <span className="text-gradient-animated">Hidden Bugs</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I have hidden {BUG_BOUNTIES.length} bugs, easter eggs, and secrets throughout this site. 
            Can you find them all? Earn points and claim your bounty!
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mb-12 p-6 rounded-2xl bg-card border border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{score}</p>
                <p className="text-xs text-muted-foreground">Points Earned</p>
              </div>
              <div className="text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{foundBugs.length}/{BUG_BOUNTIES.length}</p>
                <p className="text-xs text-muted-foreground">Bugs Found</p>
              </div>
              <div className="text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
              <div className="text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">{totalPoints - score}</p>
                <p className="text-xs text-muted-foreground">Points Available</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {bugs.map((bug, index) => (
              <motion.div
                key={bug.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  bug.isFound 
                    ? "bg-green-500/5 border-green-500/30" 
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${bug.isFound ? "bg-green-500/10" : "bg-primary/10"}`}>
                    {bug.isFound ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Bug className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <Badge className={getDifficultyColor(bug.difficulty)}>
                    {bug.difficulty}
                  </Badge>
                </div>

                <h3 className={`font-semibold mb-2 ${bug.isFound ? "" : "blur-sm"}`}>
                  {bug.isFound ? bug.title : "Hidden Bug"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {bug.isFound ? bug.description : "Find this bug to reveal its details"}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Code2 className="h-4 w-4" />
                    {bug.location}
                  </div>
                  <span className="font-bold text-primary">+{bug.points} pts</span>
                </div>

                {!bug.isFound && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => handleFindBug(bug.id)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    I Found It!
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
