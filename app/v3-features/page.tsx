"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Palette, 
  Code2, 
  Music, 
  Trophy,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIChatAssistant } from "@/components/ai-chat-assistant";
import { QuestSystem } from "@/components/quest-system";
import { MusicPlayerEnhanced } from "@/components/music-player-enhanced";
import { CodingChallenges } from "@/components/coding-challenges";
import { ColorPaletteGenerator } from "@/components/color-palette-generator";

const newFeatures = [
  {
    icon: Sparkles,
    title: "AI Chat Assistant",
    description: "Get coding help, design ideas, and project suggestions from an AI companion.",
    component: "ai-chat",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Trophy,
    title: "Quest System",
    description: "Complete challenges, earn XP, and level up as you explore the portfolio.",
    component: "quests",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Music,
    title: "Music Player",
    description: "Curated playlists for coding with a beautiful visualizer and controls.",
    component: "music",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Code2,
    title: "Coding Challenges",
    description: "Interactive coding exercises to test and improve your skills.",
    component: "challenges",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Color Studio",
    description: "Generate, customize, and export beautiful color palettes.",
    component: "colors",
    color: "from-green-500 to-emerald-500",
  },
];

export default function V3FeaturesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Version 3.0</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              New{" "}
              <span className="text-gradient-animated">Features</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover the latest additions to my portfolio. Interactive experiences, 
              gamification, and creative tools.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#features">
                <Button size="lg" className="gap-2">
                  Explore Features
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Overview */}
      <section id="features" className="py-24 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What&apos;s{" "}
              <span className="text-gradient-animated">New</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Five major new features designed to make your visit more interactive and enjoyable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all hover:-translate-y-1 group">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Assistant */}
      <section id="ai-chat" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-500 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI Powered</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Chat with{" "}
              <span className="text-gradient-animated">AI Assistant</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get instant help with coding questions, design ideas, and project suggestions. 
              Look for the floating button in the bottom right corner!
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-3xl" />
            <div className="relative p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Code Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    Get React components, utility functions, and algorithm implementations.
                  </p>
                </Card>
                <Card className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4">
                    <Palette className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Design Ideas</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive UI/UX suggestions, color scheme ideas, and layout inspiration.
                  </p>
                </Card>
                <Card className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Quick Answers</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant responses to your tech and development questions.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quest System */}
      <QuestSystem />

      {/* Music Player */}
      <MusicPlayerEnhanced />

      {/* Coding Challenges */}
      <CodingChallenges />

      {/* Color Palette Generator */}
      <ColorPaletteGenerator />

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                More Features Coming Soon
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                I&apos;m constantly adding new interactive elements and experiences. 
                Check back regularly for updates!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/">
                  <Button size="lg">
                    Back to Home
                  </Button>
                </Link>
                <Link href="/changelog">
                  <Button variant="outline" size="lg">
                    View Changelog
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Floating AI Chat */}
      <AIChatAssistant />
    </div>
  );
}
