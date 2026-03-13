"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Command, Sparkles, Zap, Code, Gamepad2, Music, Palette } from "lucide-react";

interface Command {
  id: string;
  command: string;
  output: string;
  type: "info" | "success" | "error" | "fun";
}

const COMMANDS: Record<string, { output: string; type: Command["type"] }> = {
  help: {
    output: `Available commands:
  • about       - Learn about Nemo
  • skills      - View technical skills
  • projects    - List recent projects
  • contact     - Get contact information
  • theme       - Toggle dark/light mode
  • easter      - Find hidden easter eggs
  • matrix      - Enter the Matrix
  • party       - Start a party
  • clear       - Clear terminal`,
    type: "info",
  },
  about: {
    output: `Nemo - Creative Developer & Designer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A passionate developer who loves creating
beautiful, interactive digital experiences.

Location: San Francisco, CA
Focus: React, TypeScript, Next.js
Passion: Generative Art & Creative Coding`,
    type: "info",
  },
  skills: {
    output: `Technical Skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend:  React, Next.js, TypeScript, Tailwind
Backend:   Node.js, PostgreSQL, GraphQL
DevOps:    Docker, AWS, Vercel
Creative:  Canvas API, WebGL, Framer Motion

Proficiency: ████████████████████ 95%`,
    type: "success",
  },
  projects: {
    output: `Recent Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. AI-Powered Portfolio (Next.js + AI)
2. Generative Art Gallery (Canvas API)
3. Interactive Dashboard (React + D3)
4. Mobile Banking App (React Native)
5. E-Commerce Platform (Next.js + Stripe)

Type 'open [number]' to learn more`,
    type: "info",
  },
  contact: {
    output: `Contact Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:    hello@nemo.dev
GitHub:   github.com/nemo
Twitter:  @nemo_dev
LinkedIn: linkedin.com/in/nemo

Available for freelance work!`,
    type: "success",
  },
  theme: {
    output: "Toggling theme... Try pressing 't' anywhere on the site!",
    type: "fun",
  },
  easter: {
    output: `🥚 Easter Egg Hunt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
There are hidden surprises throughout the site!

Hints:
• Try the Konami code (↑↑↓↓←→←→BA)
• Look for secret keyboard shortcuts
• Some elements have hidden interactions
• Visit at unusual hours
• Explore every page

Found: 0/10`,
    type: "fun",
  },
  matrix: {
    output: "Wake up, Neo... The Matrix has you.",
    type: "fun",
  },
  party: {
    output: "🎉 Party mode activated! Check the confetti!",
    type: "fun",
  },
  clear: {
    output: "",
    type: "info",
  },
  secret: {
    output: `🎮 Secret Commands Unlocked!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• rickroll  - Never gonna give you up
• hack      - Become a hacker
• coffee    - Coffee break
• sudo      - With great power...`,
    type: "fun",
  },
  rickroll: {
    output: "Never gonna give you up 🎵\nNever gonna let you down 🎵",
    type: "fun",
  },
  hack: {
    output: `Initializing hack sequence...
[██████░░░░░░░░░░] 37%
Access denied. Try harder next time.`,
    type: "error",
  },
  coffee: {
    output: "☕ Coffee break initiated. You deserve it!",
    type: "fun",
  },
  sudo: {
    output: "With great power comes great responsibility. 🕷️",
    type: "fun",
  },
};

export function MagicTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>([
    {
      id: "welcome",
      command: "",
      output: `Welcome to Nemo's Magic Terminal v2.0
Type 'help' to see available commands.`,
      type: "info",
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Toggle with Ctrl+Shift+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "K") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd === "clear") {
      setCommands([]);
      return;
    }

    const commandData = COMMANDS[trimmedCmd];
    const output = commandData?.output || `Command not found: ${cmd}\nType 'help' for available commands.`;
    const type = commandData?.type || "error";

    const newCommand: Command = {
      id: Math.random().toString(36).substr(2, 9),
      command: cmd,
      output,
      type,
    };

    setCommands((prev) => [...prev, newCommand]);
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // Dispatch event for easter egg tracking
    if (trimmedCmd === "easter") {
      window.dispatchEvent(new CustomEvent("secret-terminal-opened"));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < history.length) {
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex]);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Terminal className="w-5 h-5" />
      </motion.button>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:h-[400px] z-50 bg-card rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-3 text-sm font-medium">Magic Terminal</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-4">
                {commands.map((cmd) => (
                  <div key={cmd.id}>
                    {cmd.command && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-primary">$</span>
                        <span>{cmd.command}</span>
                      </div>
                    )}
                    <pre
                      className={`mt-1 whitespace-pre-wrap ${
                        cmd.type === "error"
                          ? "text-red-500"
                          : cmd.type === "success"
                          ? "text-green-500"
                          : cmd.type === "fun"
                          ? "text-purple-500"
                          : ""
                      }`}
                    >
                      {cmd.output}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="text-primary">$</span>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    autoFocus
                  />
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
