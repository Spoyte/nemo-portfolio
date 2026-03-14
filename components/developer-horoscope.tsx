"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Star,
  Moon,
  Sun,
  Code2,
  Coffee,
  Bug,
  Zap,
  RefreshCw,
  Copy,
  Share2,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

interface Horoscope {
  sign: string;
  symbol: string;
  prediction: string;
  luckyNumber: number;
  luckyColor: string;
  mood: string;
  codingAdvice: string;
  bugProbability: "Low" | "Medium" | "High";
  productivity: number;
  creativity: number;
  debugging: number;
}

const SIGNS = [
  { name: "Reactius", symbol: "⚛️", element: "Component" },
  { name: "Typescripter", symbol: "📘", element: "Type" },
  { name: "Gitarius", symbol: "🌿", element: "Branch" },
  { name: "Dockerus", symbol: "🐳", element: "Container" },
  { name: "Nodester", symbol: "🟢", element: "Runtime" },
  { name: "Pythonista", symbol: "🐍", element: "Script" },
  { name: "Rustacean", symbol: "🦀", element: "Memory" },
  { name: "Gopher", symbol: "🐹", element: "Concurrency" },
  { name: "Javarian", symbol: "☕", element: "Object" },
  { name: "Gopher", symbol: "🐹", element: "Channel" },
  { name: "Swiftie", symbol: "🦉", element: "Protocol" },
  { name: "Kubernetian", symbol: "☸️", element: "Orchestration" }
];

const PREDICTIONS = [
  "Today your code will compile on the first try. Cherish this moment.",
  "A mysterious bug will appear, but fear not - the solution lies in the documentation you swore you'd read.",
  "Your pull request will be approved without a single comment. Miracles do happen.",
  "Beware of off-by-one errors today. The universe is testing your attention to detail.",
  "A junior developer will ask you a question that makes you question everything you know.",
  "Your coffee will be perfectly brewed today. This is the sign you've been waiting for.",
  "You will discover a feature in your IDE that changes everything. The stars align for productivity.",
  "Today is not the day to refactor that legacy code. The cosmic energies advise patience.",
  "A random Stack Overflow answer from 2012 will solve your problem. Trust in the ancient wisdom.",
  "Your variable names will be so descriptive today that even your future self will thank you.",
  "The tests will pass, the build will succeed, and the deployment will be smooth. Ride this wave of fortune.",
  "Someone will suggest using a new framework today. Smile, nod, and remember that jQuery still powers the internet."
];

const CODING_ADVICE = [
  "Write tests before they write you",
  "Commit often, push carefully",
  "Read the error message twice",
  "Rubber duck debugging is not crazy, it's cosmic wisdom",
  "The best code is no code at all",
  "Comment your code like you're explaining it to a time traveler",
  "Sleep on it before shipping to production",
  "Console.log is a tool, not a lifestyle",
  "When in doubt, add more logging",
  "Refactor with courage, test with conviction"
];

const MOODS = ["Energetic", "Focused", "Creative", "Analytical", "Chill", "Determined", "Curious", "Zen"];

const COLORS = ["#dc2626", "#ea580c", "#fbbf24", "#84cc16", "#06b6d4", "#8b5cf6", "#ec4899", "#f43f5e"];

function generateHoroscope(seed: string): Horoscope {
  // Simple hash function for deterministic "random" based on seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const absHash = Math.abs(hash);
  const signIndex = absHash % SIGNS.length;
  const sign = SIGNS[signIndex];
  
  return {
    sign: sign.name,
    symbol: sign.symbol,
    prediction: PREDICTIONS[absHash % PREDICTIONS.length],
    luckyNumber: (absHash % 99) + 1,
    luckyColor: COLORS[absHash % COLORS.length],
    mood: MOODS[absHash % MOODS.length],
    codingAdvice: CODING_ADVICE[absHash % CODING_ADVICE.length],
    bugProbability: ["Low", "Medium", "High"][absHash % 3] as "Low" | "Medium" | "High",
    productivity: 60 + (absHash % 40),
    creativity: 50 + (absHash % 50),
    debugging: 40 + (absHash % 60)
  };
}

export function DeveloperHoroscope() {
  const [mounted, setMounted] = useState(false);
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
    generateDailyHoroscope();
  }, []);

  const generateDailyHoroscope = useCallback(() => {
    const today = new Date().toDateString();
    const seed = `${today}-${Math.random()}`;
    setHoroscope(generateHoroscope(seed));
  }, []);

  const handleRefresh = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      generateDailyHoroscope();
      setIsGenerating(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#dc2626", "#ea580c", "#fbbf24", "#8b5cf6"]
      });
    }, 800);
  }, [generateDailyHoroscope]);

  const handleCopy = useCallback(() => {
    if (!horoscope) return;
    const text = `🌟 ${horoscope.sign} ${horoscope.symbol} Developer Horoscope\n\n"${horoscope.prediction}"\n\n💡 Advice: ${horoscope.codingAdvice}\n🎨 Lucky Color: ${horoscope.luckyColor}\n🔢 Lucky Number: ${horoscope.luckyNumber}\n😊 Mood: ${horoscope.mood}`;
    navigator.clipboard.writeText(text);
  }, [horoscope]);

  if (!mounted || !horoscope) return null;

  const getBugProbabilityColor = (prob: string) => {
    switch (prob) {
      case "Low": return "text-green-500 bg-green-500/10";
      case "Medium": return "text-yellow-500 bg-yellow-500/10";
      case "High": return "text-red-500 bg-red-500/10";
      default: return "text-muted-foreground";
    }
  };

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Daily Developer Horoscope</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Code is Written in the{" "}
            <span className="text-gradient-animated">Stars</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover what the cosmic repository has in store for you today. 
            Updated daily with celestial coding wisdom.
          </p>
        </motion.div>

        {/* Main Horoscope Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-2xl"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: horoscope.luckyColor }}
            />
            <div 
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-10"
              style={{ backgroundColor: horoscope.luckyColor }}
            />
          </div>

          <div className="relative p-8 md:p-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-3xl"
                >
                  {horoscope.symbol}
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold">{horoscope.sign}</h3>
                  <p className="text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isGenerating}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                  New Reading
                </Button>
              </div>
            </div>

            {/* Main Prediction */}
            <AnimatePresence mode="wait">
              <motion.div
                key={horoscope.prediction}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Today&apos;s Prediction</span>
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                  &ldquo;{horoscope.prediction}&rdquo;
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-muted text-center">
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: horoscope.luckyColor }}
                />
                <p className="text-xs text-muted-foreground mb-1">Lucky Color</p>
                <p className="font-medium text-sm">{horoscope.luckyColor}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted text-center">
                <p className="text-2xl font-bold text-primary mb-1">{horoscope.luckyNumber}</p>
                <p className="text-xs text-muted-foreground">Lucky Number</p>
              </div>
              <div className="p-4 rounded-xl bg-muted text-center">
                <p className="text-lg font-medium mb-1">{horoscope.mood}</p>
                <p className="text-xs text-muted-foreground">Mood</p>
              </div>
              <div className={`p-4 rounded-xl text-center ${getBugProbabilityColor(horoscope.bugProbability)}`}>
                <Bug className="h-5 w-5 mx-auto mb-1" />
                <p className="text-xs">Bug Risk: {horoscope.bugProbability}</p>
              </div>
            </div>

            {/* Coding Advice */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary mb-1">Cosmic Coding Advice</p>
                  <p className="text-muted-foreground">{horoscope.codingAdvice}</p>
                </div>
              </div>
            </div>

            {/* Detailed Stats Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showDetails ? "Hide" : "Show"} Detailed Stats
            </button>

            {/* Detailed Stats */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 space-y-4">
                    {[
                      { label: "Productivity", value: horoscope.productivity, icon: Zap, color: "bg-yellow-500" },
                      { label: "Creativity", value: horoscope.creativity, icon: Sparkles, color: "bg-purple-500" },
                      { label: "Debugging", value: horoscope.debugging, icon: Bug, color: "bg-red-500" }
                    ].map(stat => (
                      <div key={stat.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{stat.label}</span>
                          </div>
                          <span className="text-sm font-bold">{stat.value}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className={`h-full ${stat.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Remember: The stars suggest, but you commit. 🌟
        </motion.p>
      </div>
    </section>
  );
}
