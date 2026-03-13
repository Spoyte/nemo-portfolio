"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  Zap,
  Star,
  Lock,
  Unlock,
  Gift,
  Sparkles,
  RotateCcw,
  ChevronRight,
  TrendingUp,
  Award,
  Medal,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Daily challenges
const dailyChallenges = [
  { id: "1", title: "Early Bird", description: "Visit the site before 9 AM", points: 50, icon: "🌅" },
  { id: "2", title: "Explorer", description: "Visit 5 different pages", points: 100, icon: "🗺️" },
  { id: "3", title: "Game Master", description: "Play any mini-game", points: 75, icon: "🎮" },
  { id: "4", title: "Speed Typer", description: "Type 40+ WPM in the typing race", points: 150, icon: "⌨️" },
  { id: "5", title: "Matrix Fan", description: "Spend 2 minutes in Matrix Rain", points: 100, icon: "🌧️" },
  { id: "6", title: "Sound Tester", description: "Play 5 sounds in the soundboard", points: 50, icon: "🔊" },
  { id: "7", title: "Idea Generator", description: "Generate 3 project ideas", points: 75, icon: "💡" },
  { id: "8", title: "Jokester", description: "Read 5 dev jokes", points: 50, icon: "😄" },
];

// Weekly challenges
const weeklyChallenges = [
  { id: "w1", title: "Weekly Warrior", description: "Complete all daily challenges for 3 days", points: 500, icon: "⚔️" },
  { id: "w2", title: "Speed Demon", description: "Achieve 80+ WPM in typing race", points: 400, icon: "⚡" },
  { id: "w3", title: "Completionist", description: "Visit every page on the site", points: 600, icon: "🏆" },
  { id: "w4", title: "Social Butterfly", description: "Share the site with a friend", points: 300, icon: "🦋" },
];

// Achievements
const achievements = [
  { id: "a1", title: "First Steps", description: "Complete your first challenge", points: 100, icon: "👣", unlocked: false },
  { id: "a2", title: "On Fire", description: "Complete 5 challenges in one day", points: 200, icon: "🔥", unlocked: false },
  { id: "a3", title: "Streak Master", description: "Maintain a 7-day streak", points: 500, icon: "📅", unlocked: false },
  { id: "a4", title: "Point Hoarder", description: "Earn 1000 total points", points: 300, icon: "💰", unlocked: false },
  { id: "a5", title: "Speed King", description: "Achieve 100+ WPM", points: 400, icon: "👑", unlocked: false },
  { id: "a6", title: "Explorer Supreme", description: "Visit every single page", points: 600, icon: "🌍", unlocked: false },
];

// Rewards
const rewards = [
  { id: "r1", title: "Bronze Badge", cost: 500, icon: Medal, color: "text-amber-600" },
  { id: "r2", title: "Silver Badge", cost: 1000, icon: Award, color: "text-gray-400" },
  { id: "r3", title: "Gold Badge", cost: 2000, icon: Trophy, color: "text-yellow-500" },
  { id: "r4", title: "Diamond Crown", cost: 5000, icon: Crown, color: "text-cyan-400" },
];

interface ChallengeState {
  completed: string[];
  points: number;
  streak: number;
  lastVisit: string | null;
  achievements: string[];
  rewards: string[];
}

export default function DailyChallengesPage() {
  const [state, setState] = useState<ChallengeState>({
    completed: [],
    points: 0,
    streak: 0,
    lastVisit: null,
    achievements: [],
    rewards: [],
  });
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "achievements" | "rewards">("daily");
  const [showUnlock, setShowUnlock] = useState<string | null>(null);

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("challenge-state");
    if (saved) {
      setState(JSON.parse(saved));
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("challenge-state", JSON.stringify(state));
  }, [state]);

  // Check streak on mount
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastVisit) {
      const lastDate = new Date(state.lastVisit);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        // Streak broken
        setState(s => ({ ...s, streak: 0 }));
      }
    }
    
    if (state.lastVisit !== today) {
      setState(s => ({ ...s, lastVisit: today }));
    }
  }, []);

  const completeChallenge = (challengeId: string, points: number) => {
    if (state.completed.includes(challengeId)) return;
    
    setState(s => {
      const newCompleted = [...s.completed, challengeId];
      const newPoints = s.points + points;
      
      // Check for achievements
      const newAchievements = [...s.achievements];
      if (newCompleted.length === 1 && !newAchievements.includes("a1")) {
        newAchievements.push("a1");
        setShowUnlock("First Steps");
      }
      if (newCompleted.length >= 5 && !newAchievements.includes("a2")) {
        newAchievements.push("a2");
        setShowUnlock("On Fire");
      }
      if (newPoints >= 1000 && !newAchievements.includes("a4")) {
        newAchievements.push("a4");
        setShowUnlock("Point Hoarder");
      }
      
      return {
        ...s,
        completed: newCompleted,
        points: newPoints,
        streak: s.streak + (newCompleted.length === 1 ? 1 : 0),
        achievements: newAchievements,
      };
    });
  };

  const buyReward = (rewardId: string, cost: number) => {
    if (state.points < cost || state.rewards.includes(rewardId)) return;
    
    setState(s => ({
      ...s,
      points: s.points - cost,
      rewards: [...s.rewards, rewardId],
    }));
  };

  const resetProgress = () => {
    if (confirm("Are you sure you want to reset all progress?")) {
      setState({
        completed: [],
        points: 0,
        streak: 0,
        lastVisit: null,
        achievements: [],
        rewards: [],
      });
    }
  };

  const getRank = (points: number) => {
    if (points >= 5000) return { name: "Legend", color: "text-yellow-500", icon: Crown };
    if (points >= 2000) return { name: "Master", color: "text-purple-500", icon: Trophy };
    if (points >= 1000) return { name: "Expert", color: "text-blue-500", icon: Award };
    if (points >= 500) return { name: "Intermediate", color: "text-green-500", icon: Medal };
    return { name: "Beginner", color: "text-gray-500", icon: Target };
  };

  const rank = getRank(state.points);
  const RankIcon = rank.icon;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Daily Challenges</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Challenge{" "}
            <span className="text-gradient-animated">Hub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete daily challenges, earn points, unlock achievements, and climb the ranks!
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{state.points}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{state.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{state.completed.length}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rank.color.replace("text-", "bg-").replace("500", "500/10")}`}>
                <RankIcon className={`w-5 h-5 ${rank.color}`} />
              </div>
              <div>
                <div className={`text-lg font-bold ${rank.color}`}>{rank.name}</div>
                <div className="text-xs text-muted-foreground">Rank</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2 mb-8 flex-wrap"
        >
          {[
            { id: "daily", label: "Daily", icon: Calendar },
            { id: "weekly", label: "Weekly", icon: TrendingUp },
            { id: "achievements", label: "Achievements", icon: Trophy },
            { id: "rewards", label: "Rewards", icon: Gift },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === "daily" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyChallenges.map((challenge, index) => {
                const isCompleted = state.completed.includes(challenge.id);
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 rounded-2xl border transition-all ${
                      isCompleted 
                        ? "bg-green-500/5 border-green-500/20" 
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{challenge.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                            {challenge.title}
                          </h3>
                          <Badge variant={isCompleted ? "default" : "secondary"}>
                            +{challenge.points}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                        <Button
                          size="sm"
                          variant={isCompleted ? "outline" : "default"}
                          disabled={isCompleted}
                          onClick={() => completeChallenge(challenge.id, challenge.points)}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            "Complete"
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === "weekly" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{challenge.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">
                          +{challenge.points}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const isUnlocked = state.achievements.includes(achievement.id);
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 rounded-2xl border transition-all ${
                      isUnlocked 
                        ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30" 
                        : "bg-muted/50 border-transparent opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          {isUnlocked ? (
                            <Unlock className="w-4 h-4 text-green-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <Badge variant="outline">+{achievement.points} points</Badge>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === "rewards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward, index) => {
                const isOwned = state.rewards.includes(reward.id);
                const canAfford = state.points >= reward.cost;
                const Icon = reward.icon;
                
                return (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 rounded-2xl border transition-all ${
                      isOwned 
                        ? "bg-green-500/5 border-green-500/20" 
                        : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isOwned ? "bg-green-500/10" : "bg-muted"}`}>
                        <Icon className={`w-6 h-6 ${isOwned ? "text-green-500" : reward.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">{reward.title}</h3>
                          <Badge variant={isOwned ? "default" : "secondary"}>
                            {reward.cost} pts
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="mt-2"
                          disabled={!canAfford || isOwned}
                          onClick={() => buyReward(reward.id, reward.cost)}
                        >
                          {isOwned ? "Owned" : canAfford ? "Purchase" : "Not enough points"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Reset Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Button variant="ghost" size="sm" onClick={resetProgress}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Progress
          </Button>
        </motion.div>

        {/* Unlock Notification */}
        <AnimatePresence>
          {showUnlock && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="glass-strong px-6 py-4 rounded-2xl border border-yellow-500/30 shadow-2xl">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Achievement Unlocked!</p>
                    <p className="text-sm text-muted-foreground">{showUnlock}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
