"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Trophy, 
  Gamepad2, 
  Sparkles, 
  Rocket, 
  Ghost,
  Music,
  Keyboard,
  Code,
  Zap,
  Heart
} from "lucide-react";

// Konami code sequence
const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", 
  "ArrowDown", "ArrowDown", 
  "ArrowLeft", "ArrowRight", 
  "ArrowLeft", "ArrowRight", 
  "b", "a"
];

// Secret codes
const SECRET_CODES: Record<string, () => void> = {
  "matrix": () => triggerMatrixMode(),
  "party": () => triggerPartyMode(),
  "unicorn": () => triggerUnicornMode(),
  "developer": () => triggerDeveloperMode(),
};

let matrixInterval: NodeJS.Timeout | null = null;
let partyInterval: NodeJS.Timeout | null = null;

function triggerMatrixMode() {
  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
  
  const createDrop = () => {
    const drop = document.createElement("div");
    drop.textContent = chars[Math.floor(Math.random() * chars.length)];
    drop.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: -20px;
      color: #0f0;
      font-family: monospace;
      font-size: 14px;
      opacity: 0.8;
      pointer-events: none;
      z-index: 9999;
      text-shadow: 0 0 5px #0f0;
    `;
    document.body.appendChild(drop);
    
    let pos = -20;
    const fall = setInterval(() => {
      pos += 3;
      drop.style.top = pos + "px";
      if (pos > window.innerHeight) {
        clearInterval(fall);
        drop.remove();
      }
    }, 20);
  };

  showEasterEggNotification("Matrix Mode Activated! 🕶️", "The code is all around you...");
  
  matrixInterval = setInterval(createDrop, 50);
  
  setTimeout(() => {
    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
    }
  }, 5000);
}

function triggerPartyMode() {
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
  
  const shootConfetti = () => {
    confetti({
      particleCount: 30,
      spread: 360,
      origin: { y: 0.5 },
      colors: colors,
      disableForReducedMotion: true,
    });
  };

  showEasterEggNotification("Party Mode! 🎉", "Let's celebrate!");
  
  partyInterval = setInterval(shootConfetti, 200);
  
  setTimeout(() => {
    if (partyInterval) {
      clearInterval(partyInterval);
      partyInterval = null;
    }
  }, 3000);
}

function triggerUnicornMode() {
  const unicorn = document.createElement("div");
  unicorn.innerHTML = "🦄";
  unicorn.style.cssText = `
    position: fixed;
    font-size: 100px;
    left: -100px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(unicorn);

  showEasterEggNotification("Unicorn Mode! 🦄", "Magic is real!");

  let pos = -100;
  const gallop = setInterval(() => {
    pos += 15;
    unicorn.style.left = pos + "px";
    unicorn.style.transform = `translateY(-50%) rotate(${pos}deg)`;
    
    if (pos % 30 === 0) {
      const rainbow = document.createElement("div");
      rainbow.innerHTML = "🌈";
      rainbow.style.cssText = `
        position: fixed;
        font-size: 30px;
        left: ${pos - 50}px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 9998;
        pointer-events: none;
        opacity: 0.5;
      `;
      document.body.appendChild(rainbow);
      setTimeout(() => rainbow.remove(), 1000);
    }
    
    if (pos > window.innerWidth + 100) {
      clearInterval(gallop);
      unicorn.remove();
    }
  }, 16);
}

function triggerDeveloperMode() {
  showEasterEggNotification("Developer Mode! 👨‍💻", "Console is your friend!");
  
  console.log(
    "%c🎉 Congratulations! You found the developer easter egg!",
    "font-size: 20px; font-weight: bold; color: #dc2626;"
  );
  console.log(
    "%cTry typing one of these commands:",
    "font-size: 14px; color: #666;"
  );
  console.log(
    "%c• matrix() - Enter the Matrix",
    "font-size: 12px; color: #0f0;"
  );
  console.log(
    "%c• party() - Start a party",
    "font-size: 12px; color: #f0f;"
  );
  console.log(
    "%c• unicorn() - Summon a unicorn",
    "font-size: 12px; color: #f0f;"
  );

  (window as unknown as Record<string, unknown>).matrix = triggerMatrixMode;
  (window as unknown as Record<string, unknown>).party = triggerPartyMode;
  (window as unknown as Record<string, unknown>).unicorn = triggerUnicornMode;
}

function showEasterEggNotification(title: string, message: string) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #dc2626, #ea580c);
    color: white;
    padding: 16px 24px;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(220, 38, 38, 0.3);
    z-index: 10000;
    font-family: system-ui, sans-serif;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 24px;">🎉</span>
      <div>
        <div style="font-weight: 600; font-size: 16px;">${title}</div>
        <div style="font-size: 14px; opacity: 0.9;">${message}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in forwards";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

export function KonamiCodeEasterEgg() {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [typedCode, setTypedCode] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeySequence((prev) => {
        const newSequence = [...prev, e.key].slice(-10);
        
        if (newSequence.join(",") === KONAMI_CODE.join(",")) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#dc2626", "#ea580c", "#fbbf24", "#22c55e", "#3b82f6"],
          });
          
          showEasterEggNotification(
            "Konami Code Unlocked! 🎮",
            "You've discovered the secret! 30 lives... just kidding!"
          );
          
          setTimeout(() => {
            window.location.href = "/secret";
          }, 2000);
          
          return [];
        }
        
        return newSequence;
      });

      if (KONAMI_CODE.includes(e.key) || e.key.startsWith("Arrow")) {
        setShowProgress(true);
        setTimeout(() => setShowProgress(false), 3000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && typedCode.length > 0) {
        const code = typedCode.toLowerCase();
        if (code in SECRET_CODES) {
          SECRET_CODES[code]();
          setTypedCode("");
        }
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        setTypedCode((prev) => (prev + e.key).slice(-20));
      } else if (e.key === "Escape") {
        setTypedCode("");
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [typedCode]);

  const progress = Math.min(100, (keySequence.length / 10) * 100);

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
      
      <AnimatePresence>
        {showProgress && keySequence.length > 0 && keySequence.length < 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 z-50 glass px-4 py-3 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <Gamepad2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Konami Code</span>
              <span className="text-xs text-muted-foreground ml-auto">{keySequence.length}/10</span>
            </div>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="flex gap-1 mt-2">
              {KONAMI_CODE.slice(0, keySequence.length).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
              {Array.from({ length: 10 - keySequence.length }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-muted" />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden">
        Secret codes: matrix, party, unicorn, developer
      </div>
    </>
  );
}

interface AchievementUnlockProps { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  onComplete?: () => void;
}

export function AchievementUnlock({ 
  title, 
  description, 
  icon: Icon,
  onComplete 
}: AchievementUnlockProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className="fixed top-24 right-4 z-50 glass-strong px-6 py-4 rounded-2xl shadow-2xl border border-primary/20"
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500"
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Achievement Unlocked</p>
          <h4 className="font-bold text-lg">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
      />
    </motion.div>
  );
}
