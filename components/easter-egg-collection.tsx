"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Terminal, 
  Trophy, 
  Gamepad2,
  Sparkles,
  Zap,
  Target,
  Lock,
  Unlock,
  Star,
  Crown,
  Rocket,
  Ghost,
  Music,
  Palette,
  Code2,
  Keyboard,
  MousePointer,
  Eye,
  Brain,
  Heart,
  Flame,
  Moon,
  Sun,
  Cloud,
  Rainbow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

// Easter egg definitions
interface EasterEgg {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  hint: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const EASTER_EGGS: EasterEgg[] = [
  {
    id: "konami",
    name: "Konami Code",
    description: "You know the classics! Entered the legendary Konami code.",
    icon: Gamepad2,
    unlocked: false,
    hint: "Try the classic gaming cheat code...",
    rarity: "common"
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Visited the site between 2 AM and 4 AM.",
    icon: Moon,
    unlocked: false,
    hint: "Some secrets only reveal themselves in the dead of night...",
    rarity: "rare"
  },
  {
    id: "speed-reader",
    name: "Speed Reader",
    description: "Scrolled through an entire page in under 3 seconds.",
    icon: Zap,
    unlocked: false,
    hint: "How fast can you scroll?",
    rarity: "common"
  },
  {
    id: "theme-explorer",
    name: "Theme Explorer",
    description: "Tried all available color themes.",
    icon: Palette,
    unlocked: false,
    hint: "There's more than one way to see the world...",
    rarity: "common"
  },
  {
    id: "terminal-master",
    name: "Terminal Master",
    description: "Used the secret terminal 5 times.",
    icon: Terminal,
    unlocked: false,
    hint: "The command line holds many secrets...",
    rarity: "rare"
  },
  {
    id: "music-lover",
    name: "Music Lover",
    description: "Played music on the site for over 10 minutes.",
    icon: Music,
    unlocked: false,
    hint: "Let the rhythm move you...",
    rarity: "rare"
  },
  {
    id: "code-ninja",
    name: "Code Ninja",
    description: "Spent 5 minutes in the code playground.",
    icon: Code2,
    unlocked: false,
    hint: "Try the playground and experiment...",
    rarity: "epic"
  },
  {
    id: "social-butterfly",
    name: "Social Butterfly",
    description: "Shared the site on social media.",
    icon: Heart,
    unlocked: false,
    hint: "Sharing is caring...",
    rarity: "epic"
  },
  {
    id: "completionist",
    name: "The Completionist",
    description: "Visited every single page on the site.",
    icon: Crown,
    unlocked: false,
    hint: "Leave no page unvisited...",
    rarity: "legendary"
  },
  {
    id: "rainbow-chaser",
    name: "Rainbow Chaser",
    description: "Found the hidden rainbow mode.",
    icon: Rainbow,
    unlocked: false,
    hint: "Type 'rainbow' anywhere on the site...",
    rarity: "legendary"
  }
];

const RARITY_COLORS = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500"
};

const RARITY_GRADIENTS = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-pink-600",
  legendary: "from-yellow-400 to-orange-500"
};

export function EasterEggCollection() {
  const [isOpen, setIsOpen] = useState(false);
  const [eggs, setEggs] = useState(EASTER_EGGS);
  const [typedKeys, setTypedKeys] = useState("");
  const [showHint, setShowHint] = useState<string | null>(null);

  // Check for rainbow mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newTyped = (typedKeys + e.key.toLowerCase()).slice(-7);
      setTypedKeys(newTyped);

      if (newTyped === "rainbow") {
        unlockEgg("rainbow-chaser");
        triggerRainbowMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typedKeys]);

  // Check for night owl
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 2 && hour <= 4) {
      unlockEgg("night-owl");
    }
  }, []);

  const unlockEgg = (id: string) => {
    setEggs(prev => {
      const egg = prev.find(e => e.id === id);
      if (egg && !egg.unlocked) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FFD700", "#FFA500", "#FF6347"]
        });
        return prev.map(e => e.id === id ? { ...e, unlocked: true } : e);
      }
      return prev;
    });
  };

  const triggerRainbowMode = () => {
    const style = document.createElement("style");
    style.id = "rainbow-mode";
    style.textContent = `
      * {
        animation: rainbow 3s linear infinite !important;
      }
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      document.getElementById("rainbow-mode")?.remove();
    }, 5000);
  };

  const unlockedCount = eggs.filter(e => e.unlocked).length;
  const progress = (unlockedCount / eggs.length) * 100;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Trophy className="w-6 h-6" />
        {unlockedCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
            {unlockedCount}
          </span>
        )}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] bg-background rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <CardHeader className="border-b shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Secret Collection</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {unlockedCount}/{eggs.length} discovered
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="mt-4">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {progress === 100 
                      ? "🎉 You've found all the secrets!" 
                      : `Keep exploring to find ${eggs.length - unlockedCount} more secrets...`}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {eggs.map((egg) => (
                    <motion.div
                      key={egg.id}
                      layout
                      onClick={() => egg.unlocked ? null : setShowHint(showHint === egg.id ? null : egg.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        egg.unlocked
                          ? `border-transparent bg-gradient-to-br ${RARITY_GRADIENTS[egg.rarity]} text-white`
                          : "border-dashed border-border bg-muted/50 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          egg.unlocked ? "bg-white/20" : "bg-background"
                        }`}
                        >
                          <egg.icon className={`w-5 h-5 ${
                            egg.unlocked ? "text-white" : "text-muted-foreground"
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              egg.unlocked ? "" : "text-muted-foreground"
                            }`}>
                              {egg.unlocked ? egg.name : "???"}
                            </span>
                            <Badge className={`${RARITY_COLORS[egg.rarity]} text-white text-[10px]`}>
                              {egg.rarity}
                            </Badge>
                          </div>

                          <p className={`text-sm mt-1 ${
                            egg.unlocked ? "text-white/80" : "text-muted-foreground"
                          }`}>
                            {egg.unlocked ? egg.description : "Locked"}
                          </p>

                          {showHint === egg.id && !egg.unlocked && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="text-xs text-muted-foreground mt-2 italic"
                            >
                              💡 {egg.hint}
                            </motion.p>
                          )}
                        </div>

                        <span>
                          {egg.unlocked ? <Unlock className="w-4 h-4 text-white/60" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
