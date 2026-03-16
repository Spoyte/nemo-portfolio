"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MousePointer2, 
  Keyboard, 
  Eye, 
  Activity,
  Zap,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Award,
  Flame,
  Brain,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";
import { Button } from "@/components/ui/button";

interface SkillMetrics {
  mouseAccuracy: number;
  typingSpeed: number;
  focusScore: number;
  reactionTime: number;
  consistency: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export function DeveloperSkillTree() {
  const [isTracking, setIsTracking] = useState(false);
  const [metrics, setMetrics] = useState<SkillMetrics>({
    mouseAccuracy: 0,
    typingSpeed: 0,
    focusScore: 0,
    reactionTime: 0,
    consistency: 0
  });
  const [mouseClicks, setMouseClicks] = useState(0);
  const [mouseTargets, setMouseTargets] = useState(0);
  const [keyStrokes, setKeyStrokes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [showTarget, setShowTarget] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [targetVisibleTime, setTargetVisibleTime] = useState<number | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "1", name: "First Click", description: "Click your first target", icon: <MousePointer2 className="h-4 w-4" />, unlocked: false, rarity: "common" },
    { id: "2", name: "Speed Demon", description: "Type 60+ WPM", icon: <Zap className="h-4 w-4" />, unlocked: false, rarity: "rare" },
    { id: "3", name: "Eagle Eye", description: "90%+ mouse accuracy", icon: <Eye className="h-4 w-4" />, unlocked: false, rarity: "rare" },
    { id: "4", name: "Focus Master", description: "Maintain focus for 60s", icon: <Brain className="h-4 w-4" />, unlocked: false, rarity: "epic" },
    { id: "5", name: "Lightning Reflexes", description: "Average reaction time < 200ms", icon: <Flame className="h-4 w-4" />, unlocked: false, rarity: "legendary" },
  ]);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Start tracking session
  const startTracking = () => {
    setIsTracking(true);
    setStartTime(Date.now());
    setMouseClicks(0);
    setMouseTargets(0);
    setKeyStrokes(0);
    setReactionTimes([]);
    setShowMiniGame(true);
    spawnTarget();
  };

  // Stop tracking session
  const stopTracking = () => {
    setIsTracking(false);
    setShowMiniGame(false);
    setShowTarget(false);
    
    // Calculate final metrics
    const accuracy = mouseTargets > 0 ? (mouseTargets / mouseClicks) * 100 : 0;
    const avgReaction = reactionTimes.length > 0 
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length 
      : 0;
    
    setMetrics({
      mouseAccuracy: Math.round(accuracy),
      typingSpeed: Math.round(keyStrokes / 5), // Rough WPM estimate
      focusScore: Math.min(100, Math.round((keyStrokes + mouseClicks) / 10)),
      reactionTime: Math.round(avgReaction),
      consistency: Math.round(Math.random() * 40 + 60) // Simulated
    });

    // Check achievements
    checkAchievements(accuracy, avgReaction);
  };

  const checkAchievements = (accuracy: number, avgReaction: number) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.unlocked) return ach;
      
      let unlocked = false;
      switch (ach.id) {
        case "1":
          unlocked = mouseClicks > 0;
          break;
        case "2":
          unlocked = keyStrokes / 5 >= 60;
          break;
        case "3":
          unlocked = accuracy >= 90;
          break;
        case "4":
          unlocked = startTime !== null && (Date.now() - startTime) > 60000;
          break;
        case "5":
          unlocked = avgReaction < 200 && avgReaction > 0;
          break;
      }
      return { ...ach, unlocked };
    }));
  };

  // Spawn a target for reaction test
  const spawnTarget = useCallback(() => {
    if (!showMiniGame) return;
    
    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
      if (!showMiniGame) return;
      
      setTargetPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20
      });
      setShowTarget(true);
      setTargetVisibleTime(Date.now());
    }, delay);
  }, [showMiniGame]);

  // Handle target click
  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMouseClicks(prev => prev + 1);
    setMouseTargets(prev => prev + 1);
    
    if (targetVisibleTime) {
      const reactionTime = Date.now() - targetVisibleTime;
      setReactionTimes(prev => [...prev, reactionTime]);
    }
    
    setShowTarget(false);
    spawnTarget();
  };

  // Handle missed click
  const handleMissedClick = () => {
    if (showTarget) {
      setMouseClicks(prev => prev + 1);
    }
  };

  // Handle keyboard input
  const handleKeyDown = () => {
    if (isTracking) {
      setKeyStrokes(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (isTracking) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isTracking]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return '';
    }
  };

  const getSkillLevel = (value: number) => {
    if (value >= 90) return { label: "Master", color: "text-yellow-500" };
    if (value >= 70) return { label: "Expert", color: "text-purple-500" };
    if (value >= 50) return { label: "Advanced", color: "text-blue-500" };
    if (value >= 30) return { label: "Intermediate", color: "text-green-500" };
    return { label: "Beginner", color: "text-slate-500" };
  };

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Developer{" "}
            <span className="text-gradient-animated">Skill Tree</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test your developer reflexes and skills. Track your mouse accuracy, typing speed, and reaction time.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill Metrics */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Your Stats
            </h3>
            
            <div className="space-y-4">
              {[
                { label: "Mouse Accuracy", value: metrics.mouseAccuracy, icon: MousePointer2 },
                { label: "Typing Speed", value: metrics.typingSpeed, suffix: " WPM", icon: Keyboard },
                { label: "Focus Score", value: metrics.focusScore, icon: Eye },
                { label: "Reaction Time", value: metrics.reactionTime, suffix: "ms", icon: Clock },
                { label: "Consistency", value: metrics.consistency, suffix: "%", icon: Target },
              ].map((stat) => {
                const level = getSkillLevel(stat.value);
                return (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {stat.value}{stat.suffix || ''}
                        </span>
                        <span className={`text-xs ${level.color}`}>
                          {level.label}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          stat.value >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          stat.value >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-pink-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              {!isTracking ? (
                <Button onClick={startTracking} className="w-full gap-2">
                  <Target className="h-4 w-4" />
                  Start Skill Test
                </Button>
              ) : (
                <Button onClick={stopTracking} variant="destructive" className="w-full gap-2">
                  <Clock className="h-4 w-4" />
                  Stop Test
                </Button>
              )}
            </div>
          </Card>

          {/* Mini Game Area */}
          <Card 
            ref={containerRef}
            className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm relative overflow-hidden min-h-[400px]"
            onClick={handleMissedClick}
          >
            {!showMiniGame ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Activity className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Test Your Skills?</h3>
                <p className="text-muted-foreground max-w-md">
                  Click "Start Skill Test" to begin. Click the targets as they appear, 
                  and type to test your keyboard speed. Your stats will be calculated in real-time.
                </p>
              </div>
            ) : (
              <>
                {/* Live Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="gap-1">
                      <MousePointer2 className="h-3 w-3" />
                      {mouseTargets}/{mouseClicks}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Keyboard className="h-3 w-3" />
                      {keyStrokes} chars
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {startTime ? Math.floor((Date.now() - startTime) / 1000) : 0}s
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Click the targets!
                  </div>
                </div>

                {/* Typing Area */}
                <div className="mb-4">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type here to test your speed..."
                    className="w-full px-4 py-2 bg-muted/50 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Game Area */}
                <div className="relative h-64 bg-muted/30 rounded-lg border border-border overflow-hidden">
                  <AnimatePresence>
                    {showTarget && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleTargetClick}
                        className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg cursor-pointer"
                        style={{
                          left: `${targetPosition.x}%`,
                          top: `${targetPosition.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <Target className="h-6 w-6 text-white" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                  
                  {!showTarget && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Wait for target...
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MousePointer2 className="h-4 w-4" />
                    Click targets quickly
                  </div>
                  <div className="flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    Type to measure speed
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Achievements */}
        <ScrollReveal className="mt-12">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border transition-all ${
                  achievement.unlocked
                    ? 'bg-card border-primary/50'
                    : 'bg-muted/30 border-border opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    {achievement.icon}
                  </div>
                  <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm mb-1">{achievement.name}</h4>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                
                {achievement.unlocked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 flex items-center gap-1 text-xs text-green-500"
                  >
                    <Award className="h-3 w-3" />
                    Unlocked!
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
