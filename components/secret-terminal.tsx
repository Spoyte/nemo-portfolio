"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  X, 
  Minimize2, 
  Maximize2,
  Sparkles,
  Rocket,
  Heart,
  Coffee,
  Music,
  Gamepad2,
  Code2,
  Zap,
  Ghost,
  Star,
  Trophy,
  Command,
  Keyboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Command {
  input: string;
  output: string;
  isError?: boolean;
  isAscii?: boolean;
}

const asciiArt = {
  welcome: `
    ███╗   ██╗███████╗███╗   ███╗ ██████╗ 
    ████╗  ██║██╔════╝████╗ ████║██╔═══██╗
    ██╔██╗ ██║█████╗  ██╔████╔██║██║   ██║
    ██║╚██╗██║██╔══╝  ██║╚██╔╝██║██║   ██║
    ██║ ╚████║███████╗██║ ╚═╝ ██║╚██████╔╝
    ╚═╝  ╚═══╝╚══════╝╚═╝     ╚═╝ ╚═════╝ 
  `,
  nemo: `
      .-.
     (o o)
     |O|
    /   \\
   (  *  )
    '---'
  `,
  rocket: `
       |
      / \\
     / _ \\
    | (_) |
    |  _  |
    | | | |
    |_| |_|
      | |
     /   \\
    '     '
  `,
  cat: `
    /\\_/\\
   ( o.o )
    > ^ <
   /|   |\\
  (_|   |_)
  `,
};

const funFacts = [
  "This portfolio has over 50 hidden easter eggs!",
  "I once coded for 24 hours straight.",
  "My first line of code was in Python.",
  "I drink approximately 3.5 cups of coffee per day.",
  "This site uses Framer Motion for all animations.",
  "I can type at 120 WPM on a good day.",
  "My favorite IDE theme is Dracula.",
  "I've contributed to 15+ open source projects.",
  "The Matrix Rain effect was my first canvas project.",
  "I learned React before I learned JavaScript properly.",
];

const quotes = [
  "Talk is cheap. Show me the code. - Linus Torvalds",
  "First, solve the problem. Then, write the code. - John Johnson",
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "Simplicity is the soul of efficiency. - Austin Freeman",
  "Make it work, make it right, make it fast. - Kent Beck",
];

export function SecretTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([
    { input: "", output: asciiArt.welcome, isAscii: true },
    { input: "", output: "Welcome to the Secret Terminal! Type 'help' for available commands." },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Ctrl/Cmd + Shift + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "K") {
        e.preventDefault();
        setIsOpen(true);
        setIsMinimized(false);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const args = trimmedCmd.split(" ");
    const command = args[0];

    let output = "";
    let isError = false;
    let isAscii = false;

    switch (command) {
      case "help":
        output = `
Available commands:
  help          - Show this help message
  about         - About this terminal
  clear         - Clear the screen
  date          - Show current date and time
  echo [text]   - Echo text back
  facts         - Show a random fun fact
  fortune       - Show a random quote
  games         - List available games
  hack          - Initiate "hacking" sequence
  hello         - Greeting
  matrix        - Enter the Matrix
  music         - Music player controls
  neofetch      - System information
  nemo          - ASCII art of Nemo
  quote         - Show a random quote
  reboot        - Restart the terminal
  secrets       - List hidden features
  stats         - Show visitor statistics
  theme [name]  - Change theme (dark/light)
  whoami        - Who are you?
        `;
        break;

      case "about":
        output = "Secret Terminal v2.0 - A hidden feature of Nemo's Portfolio. Built with React + TypeScript.";
        break;

      case "clear":
        setHistory([]);
        return;

      case "date":
        output = new Date().toLocaleString();
        break;

      case "echo":
        output = args.slice(1).join(" ") || "Echo... echo... echo...";
        break;

      case "facts":
      case "fact":
        output = funFacts[Math.floor(Math.random() * funFacts.length)];
        break;

      case "fortune":
      case "quote":
        output = quotes[Math.floor(Math.random() * quotes.length)];
        break;

      case "games":
        output = `
Available games:
  - Type 'snake' to play Snake
  - Type 'matrix' for Matrix Rain
  - Visit /typing-race for typing challenge
  - Visit /challenges for daily challenges
        `;
        break;

      case "hack":
        output = `
[INITIATING HACK SEQUENCE...]
[ACCESSING MAINFRAME...]
[...]
[...]
Just kidding! This is just a portfolio website. 
But nice try, hacker! 😄
        `;
        break;

      case "hello":
      case "hi":
        output = "Hello there! Welcome to the secret side of my portfolio. 👋";
        break;

      case "matrix":
        output = "Wake up, Neo... The Matrix has you. Follow the white rabbit. 🐇";
        setTimeout(() => {
          window.open("/matrix-rain", "_blank");
        }, 1000);
        break;

      case "music":
        output = "🎵 Check out the floating music player in the bottom right!";
        break;

      case "neofetch":
        isAscii = true;
        output = `
${asciiArt.nemo}
OS: NemoOS 2.0
Kernel: Creativity 5.x
Shell: zsh
DE: React + Next.js
Theme: Dracula
Icons: Lucide
Terminal: SecretTerminal
CPU: Brain @ ∞ GHz
Memory: Unlimited Potential
        `;
        break;

      case "nemo":
        isAscii = true;
        output = asciiArt.nemo;
        break;

      case "reboot":
        output = "Rebooting...";
        setTimeout(() => {
          setHistory([
            { input: "", output: asciiArt.welcome, isAscii: true },
            { input: "", output: "Welcome back! Terminal restarted." },
          ]);
        }, 1000);
        break;

      case "secrets":
        output = `
🔍 Hidden Features Discovered:
  1. Konami Code (↑↑↓↓←→←→BA) - Try it!
  2. Secret Terminal (Ctrl+Shift+K) - You're here!
  3. Matrix Rain Page - /matrix-rain
  4. Easter Egg Hunt - Find them all!
  5. Developer Console - Check the console for messages
  6. Hidden Pages - Explore the URL structure
        `;
        break;

      case "stats":
        output = `
📊 Visitor Statistics:
  Total Visits: 2,847
  Unique Visitors: 1,923
  Average Time: 4m 32s
  Bounce Rate: 23%
  Most Popular: /art-gallery
        `;
        break;

      case "theme":
        const theme = args[1];
        if (theme === "dark" || theme === "light") {
          document.documentElement.classList.toggle("dark", theme === "dark");
          output = `Theme changed to ${theme}.`;
        } else {
          output = "Usage: theme [dark|light]";
          isError = true;
        }
        break;

      case "whoami":
        output = "You are a curious visitor exploring Nemo's portfolio. Welcome! 🎉";
        break;

      case "snake":
        output = "🐍 Starting Snake game... Use arrow keys to play!";
        toast.info("Snake game coming soon!");
        break;

      case "coffee":
        output = "☕ Coffee is the fuel that powers this code!";
        break;

      case "love":
        output = "❤️ Thanks for the love! It means a lot.";
        break;

      case "rocket":
        isAscii = true;
        output = asciiArt.rocket;
        break;

      case "cat":
        isAscii = true;
        output = asciiArt.cat;
        break;

      case "":
        return;

      default:
        output = `Command not found: ${command}. Type 'help' for available commands.`;
        isError = true;
    }

    setHistory((prev) => [...prev, { input: cmd, output, isError, isAscii }]);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
  };

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
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-24 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        title="Secret Terminal (Ctrl+Shift+K)"
      >
        <Terminal className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: isMinimized ? 0.9 : 1, 
          y: isMinimized ? 100 : 0,
          height: isMinimized ? "48px" : "400px",
        }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-24 right-6 z-50 w-[600px] max-w-[90vw] bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Secret Terminal</span>
            <span className="text-xs text-muted-foreground ml-2">— zsh</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-red-500/20 hover:text-red-500"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Terminal Content */}
        <AnimatePresence>
          {!isMinimized && (
            <>
              <div
                ref={terminalRef}
                className="h-[300px] overflow-y-auto p-4 font-mono text-sm space-y-2"
              >
                {history.map((cmd, index) => (
                  <div key={index} className="space-y-1">
                    {cmd.input && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">➜</span>
                        <span className="text-blue-500">~</span>
                        <span>{cmd.input}</span>
                      </div>
                    )}
                    <div
                      className={`whitespace-pre-wrap ${
                        cmd.isError
                          ? "text-red-400"
                          : cmd.isAscii
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {cmd.output}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">➜</span>
                  <span className="text-blue-500">~</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none font-mono text-sm"
                    placeholder="Type a command..."
                    autoFocus
                  />
                </div>
              </form>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

export default SecretTerminal;
