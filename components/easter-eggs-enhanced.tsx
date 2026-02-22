"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { 
  Code2, 
  Terminal, 
  Coffee, 
  Music, 
  Heart,
  Sparkles,
  Ghost,
  Rocket,
  Zap,
  Gamepad2,
  X,
  Trophy,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Keyboard,
  MousePointerClick
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import confetti from "canvas-confetti";

// Konami Code Easter Egg
const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function KonamiEasterEgg() {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...keySequence, e.key].slice(-KONAMI_CODE.length);
      setKeySequence(newSequence);

      if (newSequence.join(",") === KONAMI_CODE.join(",")) {
        setIsActivated(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#dc2626", "#ea580c", "#fbbf24", "#22d3ee"]
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keySequence]);

  if (!isActivated) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-lg w-full"
        >
          <Card className="border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Konami Code Activated!
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsActivated(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-bold mb-2">You found a secret!</h3>
                <p className="text-muted-foreground">
                  The Konami Code has been activated. You are now a certified retro gaming master!
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Unlocked Rewards:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    "Retro Master" achievement
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Special confetti effects
                  </li>
                  <li className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-primary" />
                    Access to hidden games
                  </li>
                </ul>
              </div>

              <Button onClick={() => setIsActivated(false)} className="w-full">
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Secret Click Counter Easter Egg
export function SecretClicker() {
  const [clickCount, setClickCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const messages = [
    { threshold: 10, text: "Hey, that tickles!", emoji: "😄" },
    { threshold: 25, text: "You're persistent!", emoji: "🤔" },
    { threshold: 50, text: "Okay, you can stop now...", emoji: "😅" },
    { threshold: 100, text: "CENTURY! You're officially obsessed.", emoji: "🏆" },
  ];

  const currentMessage = messages.reverse().find(m => clickCount >= m.threshold);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <motion.button
        onClick={() => {
          setClickCount(c => c + 1);
          if (clickCount > 0 && clickCount % 10 === 0) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
      >
        <Sparkles className="h-4 w-4 text-primary" />
      </motion.button>

      <AnimatePresence>
        {showMessage && currentMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-10 right-0 bg-card border border-border rounded-lg p-3 shadow-lg whitespace-nowrap"
          >
            <div className="text-2xl mb-1">{currentMessage.emoji}</div>
            <div className="text-sm font-medium">{currentMessage.text}</div>
            <div className="text-xs text-muted-foreground">Clicks: {clickCount}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Matrix Rain Effect
export function MatrixRain() {
  const [isActive, setIsActive] = useState(false);
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const drops = document.querySelectorAll(".matrix-drop");
      drops.forEach((drop) => {
        if (Math.random() > 0.95) {
          drop.textContent = characters[Math.floor(Math.random() * characters.length)];
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsActive(true)}
        className="fixed top-20 right-4 z-30 opacity-0 hover:opacity-100 transition-opacity"
      >
        <Terminal className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-black/90" />
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: "100vh", 
            opacity: [0, 1, 1, 0],
          }}
          transition={{ 
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className="absolute text-green-500 font-mono text-sm matrix-drop"
          style={{ left: `${i * 2}%` }}
        >
          {characters[Math.floor(Math.random() * characters.length)]}
        </motion.div>
      ))}
      <Button 
        onClick={() => setIsActive(false)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto"
      >
        Exit Matrix
      </Button>
    </div>
  );
}

// Typing Effect Quote
export function TypewriterQuote() {
  const quotes = [
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Any fool can write code that a computer can understand.", author: "Martin Fowler" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  ];

  const [currentQuote, setCurrentQuote] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const quote = quotes[currentQuote].text;
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < quote.length) {
          setDisplayText(quote.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentQuote((currentQuote + 1) % quotes.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentQuote, quotes]);

  return (
    <div className="text-center py-8 px-4">
      <div className="text-lg md:text-xl font-mono text-muted-foreground">
        "{displayText}"<span className="animate-pulse">|</span>
      </div>
      <motion.div 
        key={currentQuote}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground mt-2"
      >
        — {quotes[currentQuote].author}
      </motion.div>
    </div>
  );
}

// Hidden Page Easter Egg Trigger
export function HiddenPageTrigger() {
  const [hoverCount, setHoverCount] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (revealed) return null;

  return (
    <div className="fixed bottom-20 right-4 z-30">
      <motion.div
        onHoverStart={() => {
          setHoverCount(c => {
            if (c >= 4) {
              setRevealed(true);
              confetti({ particleCount: 50 });
              return c;
            }
            return c + 1;
          });
        }}
        className="w-2 h-2 rounded-full bg-transparent hover:bg-primary/50 cursor-help"
        title="Hmm, what's this?"
      />
      <AnimatePresence>
        {hoverCount > 0 && hoverCount < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 right-0 text-xs text-muted-foreground whitespace-nowrap"
          >
            {hoverCount}/5...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
