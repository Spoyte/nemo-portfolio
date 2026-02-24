"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Gamepad2, 
  Palette, 
  Trophy, 
  Sparkles,
  Terminal,
  Music,
  Calculator,
  Dice5,
  Type,
  Clock,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AchievementSystemEnhanced } from "@/components/achievement-system-enhanced";
import { ColorPaletteGenerator } from "@/components/color-palette-generator-enhanced";
import { TypingSpeedTest } from "@/components/typing-speed-test";

// Simple Dice Roller Component
function DiceRoller() {
  const [dice, setDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const roll = () => {
    setIsRolling(true);
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDice(result);
      setHistory(prev => [result, ...prev].slice(0, 10));
      setIsRolling(false);
    }, 500);
  };

  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dice5 className="h-5 w-5 text-primary" />
          Dice Roller
        </CardTitle>
        <CardDescription>Roll the dice and test your luck</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <motion.div
          animate={isRolling ? { rotate: 360 } : {}}
          transition={{ duration: 0.5 }}
          className="text-8xl mb-6"
        >
          {diceFaces[dice - 1]}
        </motion.div>
        
        <Button onClick={roll} disabled={isRolling} className="mb-6">
          {isRolling ? "Rolling..." : "Roll Dice"}
        </Button>
        
        {history.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Last rolls:</p>
            <div className="flex justify-center gap-2">
              {history.map((h, i) => (
                <span key={i} className="text-2xl">{diceFaces[h - 1]}</span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Pomodoro Timer Component
function PomodoroTimer() {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setTime(mode === "work" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Pomodoro Timer
        </CardTitle>
        <CardDescription>Stay focused and productive</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={mode === "work" ? "default" : "outline"}
            size="sm"
            onClick={() => { setMode("work"); setTime(25 * 60); setIsActive(false); }}
          >
            Work (25m)
          </Button>
          <Button
            variant={mode === "break" ? "default" : "outline"}
            size="sm"
            onClick={() => { setMode("break"); setTime(5 * 60); setIsActive(false); }}
          >
            Break (5m)
          </Button>
        </div>
        
        <motion.div
          className="text-6xl font-mono font-bold mb-6"
          animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
        >
          {formatTime(time)}
        </motion.div>
        
        <div className="flex justify-center gap-2">
          <Button onClick={toggle}>
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Word Counter Component
function WordCounter() {
  const [text, setText] = useState("");
  const stats = {
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n\n+/).filter(Boolean).length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5 text-primary" />
          Word Counter
        </CardTitle>
        <CardDescription>Analyze your text in real-time</CardDescription>
      </CardHeader>
      <CardContent>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-32 p-3 rounded-lg border bg-background resize-none mb-4"
        />
        
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Characters", value: stats.chars },
            { label: "Words", value: stats.words },
            { label: "Sentences", value: stats.sentences },
            { label: "Paragraphs", value: stats.paragraphs },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function InteractiveLabPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Tools & Games</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Interactive Lab
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of interactive tools, games, and experiments. 
            Play around, test your skills, and have fun!
          </p>
        </motion.div>

        <Tabs defaultValue="games" className="space-y-8">
          <TabsList className="flex flex-wrap justify-center gap-2">
            <TabsTrigger value="games" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <Zap className="h-4 w-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DiceRoller />
              <TypingSpeedTest />
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PomodoroTimer />
              <WordCounter />
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementSystemEnhanced />
          </TabsContent>

          <TabsContent value="colors">
            <ColorPaletteGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
