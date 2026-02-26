"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  Zap,
  Gamepad2,
  Code2,
  Terminal,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TypingSpeedChallenge } from "@/components/typing-speed-challenge";
import { CodeChallengeArena } from "@/components/code-challenge-arena";
import { SecretEncoderTool } from "@/components/secret-encoder-tool";
import { DeveloperStatsDashboard } from "@/components/developer-stats-dashboard";
import { EnhancedAchievements } from "@/components/enhanced-achievements";
import { HolographicCard } from "@/components/holographic-effects";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TabType = "typing" | "coding" | "encoder" | "stats" | "achievements";

const tabs = [
  { id: "typing" as TabType, label: "Speed Typing", icon: Zap, color: "text-yellow-500" },
  { id: "coding" as TabType, label: "Code Arena", icon: Code2, color: "text-blue-500" },
  { id: "encoder" as TabType, label: "Secret Encoder", icon: Terminal, color: "text-green-500" },
  { id: "stats" as TabType, label: "Dev Stats", icon: Target, color: "text-purple-500" },
  { id: "achievements" as TabType, label: "Achievements", icon: Trophy, color: "text-amber-500" },
];

export default function InteractivePlaygroundPage() {
  const [activeTab, setActiveTab] = useState<TabType>("typing");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Gamepad2 className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Playground</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Developer Playground
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Challenge yourself with coding puzzles, test your typing speed, 
            encode secret messages, and track your developer journey.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <Icon className={cn("h-4 w-4", activeTab !== tab.id && tab.color)} />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "typing" && (
            <div className="space-y-6">
              <HolographicCard className="bg-card" intensity={0.3}>
                <Card className="border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-yellow-500/10">
                        <Zap className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <CardTitle>Typing Speed Challenge</CardTitle>
                        <CardDescription>
                          Test your typing speed and accuracy. Can you reach 80+ WPM?
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TypingSpeedChallenge />
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          )}

          {activeTab === "coding" && (
            <div className="space-y-6">
              <HolographicCard className="bg-card" intensity={0.3} rainbow>
                <Card className="border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-blue-500/10">
                        <Code2 className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle>Code Challenge Arena</CardTitle>
                        <CardDescription>
                          Solve coding challenges and level up your skills.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CodeChallengeArena />
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          )}

          {activeTab === "encoder" && (
            <div className="space-y-6">
              <HolographicCard className="bg-card" intensity={0.3}>
                <Card className="border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <Terminal className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <CardTitle>Secret Encoder</CardTitle>
                        <CardDescription>
                          Encode and decode messages in Morse code, binary, hex, and base64.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SecretEncoderTool />
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-6">
              <HolographicCard className="bg-card" intensity={0.3} rainbow>
                <Card className="border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-purple-500/10">
                        <Target className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <CardTitle>Developer Stats Dashboard</CardTitle>
                        <CardDescription>
                          Track your coding activity, skills, and achievements.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DeveloperStatsDashboard />
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-6">
              <HolographicCard className="bg-card" intensity={0.3} rainbow>
                <Card className="border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-amber-500/10">
                        <Trophy className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <CardTitle>Achievements</CardTitle>
                        <CardDescription>
                          Unlock achievements by exploring the portfolio and completing challenges.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <EnhancedAchievements />
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
