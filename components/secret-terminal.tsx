"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  X, 
  Minimize2, 
  Maximize2, 
  Command,
  Sparkles,
  Zap,
  Ghost,
  Code,
  Heart,
  Star,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface Command {
  name: string;
  description: string;
  action: () => string | void;
}

export function SecretTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ type: "input" | "output"; content: string }[]>([
    { type: "output", content: "🎉 Welcome to Secret Terminal Mode!" },
    { type: "output", content: "Type 'help' to see available commands." },
    { type: "output", content: "" },
  ]);
  const [konamiProgress, setKonamiProgress] = useState(0);

  const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

  const commands: Record<string, Command> = {
    help: {
      name: "help",
      description: "Show available commands",
      action: () => {
        return `Available commands:
  ${Object.values(commands).map(cmd => `${cmd.name.padEnd(12)} - ${cmd.description}`).join("\n  ")}`;
      },
    },
    clear: {
      name: "clear",
      description: "Clear terminal history",
      action: () => {
        setHistory([]);
        return null;
      },
    },
    whoami: {
      name: "whoami",
      description: "Display user information",
      action: () => {
        return `User: Nemo's Visitor
Role: Explorer
Status: Awesome
Location: The Internet`;
      },
    },
    date: {
      name: "date",
      description: "Show current date and time",
      action: () => {
        return new Date().toLocaleString();
      },
    },
    secret: {
      name: "secret",
      description: "Reveal a secret",
      action: () => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#dc2626", "#ea580c", "#fbbf24"],
        });
        return "🎉 You found the secret! Here's some confetti!";
      },
    },
    matrix: {
      name: "matrix",
      description: "Enter the Matrix",
      action: () => {
        triggerMatrixRain();
        return "🕶️ The Matrix has you...";
      },
    },
    party: {
      name: "party",
      description: "Start a party",
      action: () => {
        startPartyMode();
        return "🎉 Party mode activated!";
      },
    },
    quote: {
      name: "quote",
      description: "Get an inspirational quote",
      action: () => {
        const quotes = [
          "Code is like humor. When you have to explain it, it's bad. - Cory House",
          "First, solve the problem. Then, write the code. - John Johnson",
          "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
          "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
          "The only way to do great work is to love what you do. - Steve Jobs",
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
      },
    },
    ascii: {
      name: "ascii",
      description: "Display ASCII art",
      action: () => {
        return `
    ╭─────────────────╮
    │                 │
    │   🦑  NEMO  🦑   │
    │                 │
    ╰─────────────────╯
        `;
      },
    },
    exit: {
      name: "exit",
      description: "Close terminal",
      action: () => {
        setIsOpen(false);
        return null;
      },
    },
  };

  const triggerMatrixRain = () => {
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const drops: HTMLDivElement[] = [];
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
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
        drops.push(drop);
        
        let pos = -20;
        const fall = setInterval(() => {
          pos += 5;
          drop.style.top = pos + "px";
          if (pos > window.innerHeight) {
            clearInterval(fall);
            drop.remove();
          }
        }, 20);
      }, i * 50);
    }

    setTimeout(() => {
      drops.forEach(drop => drop.remove());
    }, 5000);
  };

  const startPartyMode = () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    let count = 0;
    const interval = setInterval(() => {
      confetti({
        particleCount: 30,
        spread: 360,
        origin: { y: 0.5 },
        colors: colors,
        disableForReducedMotion: true,
      });
      count++;
      if (count >= 10) clearInterval(interval);
    }, 200);
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    setHistory((prev) => [
      ...prev,
      { type: "input", content: `> ${cmd}` },
    ]);

    if (trimmedCmd === "") {
      return;
    }

    if (commands[trimmedCmd]) {
      const result = commands[trimmedCmd].action();
      if (result) {
        setHistory((prev) => [
          ...prev,
          { type: "output", content: result },
          { type: "output", content: "" },
        ]);
      }
    } else {
      setHistory((prev) => [
        ...prev,
        { type: "output", content: `Command not found: ${trimmedCmd}. Type 'help' for available commands.` },
        { type: "output", content: "" },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  // Listen for Konami code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen) return; // Don't listen when terminal is open

      const expectedKey = KONAMI_CODE[konamiProgress];
      
      if (e.key === expectedKey) {
        const newProgress = konamiProgress + 1;
        setKonamiProgress(newProgress);
        
        if (newProgress === KONAMI_CODE.length) {
          setIsOpen(true);
          setKonamiProgress(0);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#dc2626", "#ea580c", "#fbbf24", "#22c55e", "#3b82f6"],
          });
        }
      } else {
        setKonamiProgress(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiProgress, isOpen]);

  // Keyboard shortcut to open terminal (Ctrl/Cmd + Shift + T)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Konami Code Progress Indicator */}
      <AnimatePresence>
        {konamiProgress > 0 && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 z-50 glass px-4 py-3 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Command className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Secret Code</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {konamiProgress}/{KONAMI_CODE.length}
              </span>
            </div>
            <div className="flex gap-1">
              {KONAMI_CODE.map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < konamiProgress ? "bg-primary" : "bg-muted"
                  }`}
                  initial={i === konamiProgress - 1 ? { scale: 0 } : { scale: 1 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: isMinimized ? window.innerHeight - 100 : 0,
              height: isMinimized ? 60 : "auto"
            }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-4 right-4 z-50 w-[90vw] max-w-2xl"
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-orange-500/10 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsOpen(false)}
                      className="w-3 h-3 rounded-full bg-red-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="w-3 h-3 rounded-full bg-yellow-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="w-3 h-3 rounded-full bg-green-500"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Secret Terminal</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Terminal Content */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="bg-black/90"
                  >
                    <div className="h-80 overflow-y-auto p-4 font-mono text-sm">
                      {history.map((item, index) => (
                        <div
                          key={index}
                          className={`${
                            item.type === "input"
                              ? "text-green-400"
                              : "text-gray-300 whitespace-pre-wrap"
                          }`}
                        >
                          {item.content}
                        </div>
                      ))}
                      
                      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                        <span className="text-green-400">></span>
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                          placeholder="Type a command..."
                          autoFocus
                        />
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
