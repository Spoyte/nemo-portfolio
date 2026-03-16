"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  GitBranch, 
  GitCommit, 
  GitMerge,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";

interface GitLevel {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  commands: string[];
  scenario: string;
  task: string;
  hint: string;
  validation: (commands: string[]) => boolean;
}

const gitLevels: GitLevel[] = [
  {
    id: "1",
    title: "First Commit",
    description: "Learn the basics of staging and committing",
    difficulty: "beginner",
    commands: [],
    scenario: "You've just created a new project and want to make your first commit.",
    task: "Stage all files and create a commit with message 'Initial commit'",
    hint: "Use git add . to stage, then git commit -m 'message'",
    validation: (cmds) => {
      const hasAdd = cmds.some(c => c.includes('git add'));
      const hasCommit = cmds.some(c => c.includes('git commit') && c.includes('Initial commit'));
      return hasAdd && hasCommit;
    }
  },
  {
    id: "2",
    title: "Branching Out",
    description: "Create and switch to a new branch",
    difficulty: "beginner",
    commands: [],
    scenario: "You need to work on a new feature without affecting the main branch.",
    task: "Create a new branch called 'feature' and switch to it",
    hint: "Use git checkout -b branch-name or git switch -c branch-name",
    validation: (cmds) => {
      return cmds.some(c => 
        (c.includes('git checkout -b feature') || c.includes('git switch -c feature'))
      );
    }
  },
  {
    id: "3",
    title: "Merge Conflict",
    description: "Merge a feature branch into main",
    difficulty: "intermediate",
    commands: [],
    scenario: "Your feature is ready. Now merge it back to main.",
    task: "Switch to main and merge the 'feature' branch",
    hint: "First checkout main, then use git merge feature",
    validation: (cmds) => {
      const hasCheckout = cmds.some(c => c.includes('git checkout main') || c.includes('git switch main'));
      const hasMerge = cmds.some(c => c.includes('git merge feature'));
      return hasCheckout && hasMerge;
    }
  },
  {
    id: "4",
    title: "Oops, Wrong Commit",
    description: "Undo the last commit while keeping changes",
    difficulty: "intermediate",
    commands: [],
    scenario: "You just committed but realized you forgot to add a file.",
    task: "Undo the last commit but keep the changes staged",
    hint: "Use git reset --soft HEAD~1",
    validation: (cmds) => {
      return cmds.some(c => c.includes('git reset --soft HEAD~1'));
    }
  },
  {
    id: "5",
    title: "Stash It",
    description: "Save changes for later",
    difficulty: "advanced",
    commands: [],
    scenario: "You have uncommitted changes but need to switch branches urgently.",
    task: "Stash your changes with message 'WIP' and switch to main",
    hint: "Use git stash push -m 'WIP' then git checkout main",
    validation: (cmds) => {
      const hasStash = cmds.some(c => c.includes('git stash'));
      const hasCheckout = cmds.some(c => c.includes('git checkout') || c.includes('git switch'));
      return hasStash && hasCheckout;
    }
  }
];

export function GitMasteryGame() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [score, setScore] = useState(0);

  const level = gitLevels[currentLevel];

  const executeCommand = () => {
    if (!currentInput.trim()) return;

    const newHistory = [...commandHistory, currentInput];
    setCommandHistory(newHistory);
    setCurrentInput("");

    // Check if level is complete
    if (level.validation(newHistory)) {
      setFeedback({ type: "success", message: "Level Complete! 🎉" });
      if (!completed.includes(level.id)) {
        setCompleted([...completed, level.id]);
        setScore(s => s + (level.difficulty === 'beginner' ? 100 : level.difficulty === 'intermediate' ? 200 : 300));
      }
    }
  };

  const resetLevel = () => {
    setCommandHistory([]);
    setCurrentInput("");
    setFeedback(null);
    setShowHint(false);
  };

  const nextLevel = () => {
    if (currentLevel < gitLevels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      resetLevel();
    }
  };

  const prevLevel = () => {
    if (currentLevel > 0) {
      setCurrentLevel(currentLevel - 1);
      resetLevel();
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return '';
    }
  };

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <GitBranch className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Learning</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Git{" "}
            <span className="text-gradient-animated">Mastery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Master Git through interactive challenges. Practice commands in a safe environment and level up your version control skills.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Level Selection */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Levels
            </h3>
            <div className="space-y-3">
              {gitLevels.map((l, idx) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setCurrentLevel(idx);
                    resetLevel();
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    currentLevel === idx
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{l.title}</span>
                    {completed.includes(l.id) && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(l.difficulty)}`}>
                      {l.difficulty}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>

            {/* Score */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="font-medium">Total Score</span>
                </div>
                <span className="text-2xl font-bold text-primary">{score}</span>
              </div>
              <div className="mt-3 text-center text-sm text-muted-foreground">
                {completed.length} of {gitLevels.length} completed
              </div>
            </div>
          </Card>

          {/* Game Area */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm">
            {/* Level Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevLevel}
                  disabled={currentLevel === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className="font-semibold">{level.title}</h3>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextLevel}
                  disabled={currentLevel === gitLevels.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant="outline" className={getDifficultyColor(level.difficulty)}>
                {level.difficulty}
              </Badge>
            </div>

            {/* Scenario */}
            <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <GitCommit className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Scenario</h4>
                  <p className="text-sm text-muted-foreground mb-3">{level.scenario}</p>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Task: {level.task}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Terminal</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Hint
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetLevel}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Command History */}
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto mb-4">
                <div className="text-green-400 mb-2">➜  git-mastery git:({level.id === '1' ? 'main' : 'feature'}) ✗</div>
                {commandHistory.map((cmd, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="text-green-400">➜  {cmd}</div>
                    <div className="text-slate-400">
                      {cmd.startsWith('git commit') && '[main ' + Math.random().toString(36).substr(2, 7) + '] ' + level.task.toLowerCase().includes('commit') && '1 file changed, 1 insertion(+)'}
                      {cmd.startsWith('git add') && ''}
                      {cmd.startsWith('git checkout') && 'Switched to branch \'' + (cmd.includes('feature') ? 'feature' : 'main') + '\''}
                      {cmd.startsWith('git merge') && 'Merge made by the \'ort\' strategy.'}
                      {cmd.startsWith('git stash') && 'Saved working directory and index state'}
                      {cmd.startsWith('git reset') && 'Unstaged changes after reset'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-mono">➜</span>
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') executeCommand();
                  }}
                  placeholder="Type git command..."
                  className="flex-1 bg-transparent border-none outline-none font-mono text-sm"
                  disabled={completed.includes(level.id)}
                />
                <Button 
                  size="sm" 
                  onClick={executeCommand}
                  disabled={completed.includes(level.id)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <Card className="p-4 bg-yellow-500/5 border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-sm">Hint</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{level.hint}</p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    feedback.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <>
                      <Trophy className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="font-medium">{feedback.message}</p>
                        <p className="text-sm text-muted-foreground">
                          +{level.difficulty === 'beginner' ? 100 : level.difficulty === 'intermediate' ? 200 : 300} points
                        </p>
                      </div>
                      {currentLevel < gitLevels.length - 1 && (
                        <Button onClick={nextLevel} size="sm">
                          Next Level
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <p className="font-medium">{feedback.message}</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </section>
  );
}
