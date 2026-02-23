"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  X, 
  Minimize2, 
  Maximize2, 
  Send,
  Sparkles,
  Code2,
  Cpu,
  Globe,
  Zap,
  Heart,
  Star,
  Trophy,
  Gamepad2,
  Music,
  Palette,
  Coffee,
  Moon,
  Sun,
  HelpCircle,
  Command
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommandResponse {
  type: "text" | "ascii" | "list" | "error" | "success" | "code";
  content: string | string[];
  delay?: number;
}

interface Command {
  name: string;
  description: string;
  aliases?: string[];
  execute: (args: string[]) => CommandResponse | CommandResponse[];
}

const ASCII_ART = `
    _   __                     
   / | / /___ _   ___  ________
  /  |/ / __ \\ | / / |/_/ ___/
 / /|  / /_/ / |/ />  < (__  ) 
/_/ |_/\\____/|___/_/|_/____/  
`;

const COMMANDS: Command[] = [
  {
    name: "help",
    description: "Show available commands",
    aliases: ["h", "?"],
    execute: () => ({
      type: "list",
      content: [
        "Available Commands:",
        "",
        "  about      - Learn about me",
        "  skills     - View my technical skills",
        "  projects   - List my projects",
        "  contact    - Get contact information",
        "  social     - Social media links",
        "  easter     - Find hidden easter eggs",
        "  theme      - Toggle dark/light mode",
        "  music      - Current music status",
        "  coffee     - Coffee counter",
        "  clear      - Clear terminal",
        "  matrix     - Enter the matrix",
        "  quote      - Random inspirational quote",
        "  joke       - Random programming joke",
        "  game       - Play a mini game",
        "  hack       - Simulate hacking (visual only)",
        "  time       - Current time",
        "  weather    - Weather info",
        "  whoami     - Current user info",
        "  neofetch   - System information",
        "  exit       - Close terminal",
        "",
        "Use ↑/↓ arrows for command history",
      ],
    }),
  },
  {
    name: "about",
    description: "Learn about me",
    execute: () => ({
      type: "text",
      content: `Hi! I'm Nemo, a creative developer passionate about building beautiful, 
functional web experiences. I specialize in React, TypeScript, and modern web technologies.

When I'm not coding, you'll find me exploring new coffee shops, reading sci-fi novels, 
or contributing to open source projects.`,
    }),
  },
  {
    name: "skills",
    description: "View technical skills",
    execute: () => ({
      type: "code",
      content: `Frontend:     React, Next.js, TypeScript, Tailwind CSS, Framer Motion
Backend:      Node.js, Python, PostgreSQL, MongoDB, GraphQL
DevOps:       Docker, AWS, Vercel, GitHub Actions, Kubernetes
Tools:        Git, Figma, VS Code, Vim, Linux
Currently:    Learning Rust and Three.js`,
    }),
  },
  {
    name: "projects",
    description: "List projects",
    execute: () => ({
      type: "list",
      content: [
        "Featured Projects:",
        "",
        "  🚀 Portfolio Website    - This very site you're exploring",
        "  📊 Analytics Dashboard  - Real-time data visualization",
        "  🤖 AI Chat Bot         - Conversational AI assistant",
        "  🎮 Game Engine         - Browser-based game framework",
        "  📝 Markdown Editor     - Collaborative writing tool",
        "",
        "Type 'project <name>' for more details",
      ],
    }),
  },
  {
    name: "contact",
    description: "Get contact info",
    execute: () => ({
      type: "code",
      content: `Email:    hello@nemo.dev
GitHub:   github.com/nemodev
Twitter:  @nemodev
LinkedIn: linkedin.com/in/nemodev

Feel free to reach out! I'm always open to interesting conversations.`,
    }),
  },
  {
    name: "social",
    description: "Social media links",
    execute: () => ({
      type: "list",
      content: [
        "Connect with me:",
        "",
        "  GitHub:   github.com/nemodev",
        "  Twitter:  twitter.com/nemodev",
        "  LinkedIn: linkedin.com/in/nemodev",
        "  Dev.to:   dev.to/nemodev",
        "",
        "  Blog:     nemo.dev/blog",
        "  Newsletter: Subscribe at /newsletter",
      ],
    }),
  },
  {
    name: "theme",
    description: "Toggle theme",
    execute: () => {
      if (typeof document !== "undefined") {
        const isDark = document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark");
        return {
          type: "success",
          content: `Switched to ${isDark ? "light" : "dark"} mode 🎨`,
        };
      }
      return { type: "error", content: "Cannot toggle theme" };
    },
  },
  {
    name: "matrix",
    description: "Enter the matrix",
    execute: () => ({
      type: "ascii",
      content: `
Wake up, Neo...
The Matrix has you...
Follow the white rabbit.

🐇 Knock, knock, Neo.
      `,
    }),
  },
  {
    name: "quote",
    description: "Random quote",
    execute: () => {
      const quotes = [
        '"The only way to do great work is to love what you do." - Steve Jobs',
        '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
        '"First, solve the problem. Then, write the code." - John Johnson',
        '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
        '"Simplicity is the soul of efficiency." - Austin Freeman',
        '"Make it work, make it right, make it fast." - Kent Beck',
        '"The best error message is the one that never shows up." - Thomas Fuchs',
      ];
      return {
        type: "text",
        content: quotes[Math.floor(Math.random() * quotes.length)],
      };
    },
  },
  {
    name: "joke",
    description: "Programming joke",
    execute: () => {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        "Why did the developer go broke? Because he used up all his cache! 💸",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
        "Why do Java developers wear glasses? Because they don't C#! 👓",
        "What's a programmer's favorite hangout place? Foo Bar! 🍺",
        "Why was the function sad? It didn't get any calls! 📞",
        "I would tell you a UDP joke, but you might not get it. 📡",
      ];
      return {
        type: "text",
        content: jokes[Math.floor(Math.random() * jokes.length)],
      };
    },
  },
  {
    name: "time",
    description: "Current time",
    execute: () => ({
      type: "text",
      content: `Current time: ${new Date().toLocaleString()}
Unix timestamp: ${Math.floor(Date.now() / 1000)}`,
    }),
  },
  {
    name: "weather",
    description: "Weather info",
    execute: () => ({
      type: "text",
      content: `Weather in San Francisco:

  🌤️  Partly Cloudy
  🌡️  18°C (64°F)
  💨  Wind: 12 km/h NW
  💧  Humidity: 65%

Perfect coding weather! ☕`,
    }),
  },
  {
    name: "whoami",
    description: "User info",
    execute: () => ({
      type: "code",
      content: `User:     visitor
Role:     curious_explorer
Level:    ${Math.floor(Math.random() * 50) + 1}
XP:       ${Math.floor(Math.random() * 10000)}
Status:   exploring_terminal
Joined:   ${new Date().toLocaleDateString()}`,
    }),
  },
  {
    name: "neofetch",
    description: "System info",
    execute: () => ({
      type: "code",
      content: `${ASCII_ART}
OS:       NemoOS 1.0.0
Kernel:   next.js-14
Shell:    react-18
DE:       Tailwind CSS
WM:       Framer Motion
Theme:    Stone-Dark [GTK2/3]
Icons:    Lucide [GTK2/3]
Terminal: interactive-terminal
CPU:      Brain 8-core @ 3.2GHz
Memory:   Creativity 16GB / Focus 8GB`,
    }),
  },
  {
    name: "coffee",
    description: "Coffee counter",
    execute: () => {
      const coffees = Math.floor(Math.random() * 100) + 50;
      return {
        type: "text",
        content: `☕ Coffee counter: ${coffees} cups consumed while coding

Caffeine level: ${"█".repeat(Math.min(coffees / 10, 10))}${"░".repeat(Math.max(10 - coffees / 10, 0))}

Status: ${coffees > 80 ? "CAFFEINATED ☕☕☕" : "Moderately awake"}`,
      };
    },
  },
  {
    name: "music",
    description: "Music status",
    execute: () => ({
      type: "text",
      content: `🎵 Currently Playing:

   Midnight City - M83
   
   [████████░░░░░░░░░░] 45%
   
   2:14 / 4:03

Next up: Daft Punk - Digital Love`,
    }),
  },
  {
    name: "hack",
    description: "Simulate hacking",
    execute: () => ({
      type: "code",
      content: `Initializing hack sequence...
[████] 100% Ready

> Bypassing firewall... ✓
> Decrypting passwords... ✓
> Accessing mainframe... ✓
> Downloading secrets... ✓

ACCESS GRANTED!

Just kidding! This is just a simulation. 
Please hack responsibly. 🎩`,
    }),
  },
  {
    name: "game",
    description: "Mini game",
    execute: () => ({
      type: "text",
      content: `🎮 Mini Game: Number Guessing

I'm thinking of a number between 1 and 100.
Can you guess it?

(Hint: This is a demo. The answer is 42. 
The answer to everything is always 42.) 🌌`,
    }),
  },
  {
    name: "easter",
    description: "Easter eggs hint",
    execute: () => ({
      type: "list",
      content: [
        "🥚 Easter Egg Hints:",
        "",
        "  1. Try the Konami code (↑↑↓↓←→←→BA)",
        "  2. Look for hidden terminal commands",
        "  3. Check the secret page",
        "  4. Some buttons have surprises...",
        "  5. The matrix command reveals something",
        "",
        "  Find them all to unlock achievements!",
      ],
    }),
  },
  {
    name: "clear",
    description: "Clear terminal",
    execute: () => ({ type: "text", content: "__CLEAR__" }),
  },
  {
    name: "exit",
    description: "Close terminal",
    execute: () => ({ type: "text", content: "__EXIT__" }),
  },
];

interface TerminalLine {
  id: string;
  type: "input" | "output";
  content: string;
  outputType?: CommandResponse["type"];
}

export function InteractiveTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "welcome",
      type: "output",
      content: `Welcome to Nemo's Interactive Terminal v2.0
Type 'help' to see available commands or 'exit' to close.`,
      outputType: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const executeCommand = useCallback((cmdInput: string) => {
    const trimmed = cmdInput.trim();
    if (!trimmed) return;

    // Add to history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Add input line
    const inputLine: TerminalLine = {
      id: Date.now().toString(),
      type: "input",
      content: trimmed,
    };
    setLines((prev) => [...prev, inputLine]);

    // Parse command
    const [cmdName, ...args] = trimmed.split(" ");
    const command = COMMANDS.find(
      (c) =>
        c.name === cmdName.toLowerCase() ||
        c.aliases?.includes(cmdName.toLowerCase())
    );

    if (command) {
      const response = command.execute(args);
      const responses = Array.isArray(response) ? response : [response];

      responses.forEach((resp, index) => {
        setTimeout(() => {
          if (resp.content === "__CLEAR__") {
            setLines([]);
          } else if (resp.content === "__EXIT__") {
            setIsOpen(false);
          } else {
            const outputLine: TerminalLine = {
              id: `${Date.now()}-${index}`,
              type: "output",
              content: Array.isArray(resp.content) ? resp.content.join("\n") : resp.content,
              outputType: resp.type,
            };
            setLines((prev) => [...prev, outputLine]);
          }
        }, (resp.delay || 0) + index * 100);
      });
    } else {
      const errorLine: TerminalLine = {
        id: Date.now().toString(),
        type: "output",
        content: `Command not found: ${cmdName}. Type 'help' for available commands.`,
        outputType: "error",
      };
      setLines((prev) => [...prev, errorLine]);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
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
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.toLowerCase();
      const matches = COMMANDS.filter(
        (c) =>
          c.name.startsWith(partial) ||
          c.aliases?.some((a) => a.startsWith(partial))
      );
      if (matches.length === 1) {
        setInput(matches[0].name);
      } else if (matches.length > 1) {
        const suggestionLine: TerminalLine = {
          id: Date.now().toString(),
          type: "output",
          content: matches.map((m) => m.name).join("  "),
          outputType: "text",
        };
        setLines((prev) => [...prev, suggestionLine]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  // Keyboard shortcut to open terminal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center"
      >
        <Terminal className="h-6 w-6" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          height: isMinimized ? "48px" : "400px",
        }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-[600px] max-w-[calc(100vw-3rem)] bg-background border rounded-xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Terminal</span>
            <span className="text-xs text-muted-foreground">⌘J</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Terminal Content */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
              {lines.map((line) => (
                <div key={line.id}>
                  {line.type === "input" ? (
                    <div className="flex items-center gap-2">
                      <span className="text-primary">$</span>
                      <span>{line.content}</span>
                    </div>
                  ) : (
                    <div
                      className={`whitespace-pre-wrap ${
                        line.outputType === "error"
                          ? "text-destructive"
                          : line.outputType === "success"
                          ? "text-green-500"
                          : line.outputType === "code"
                          ? "text-muted-foreground"
                          : ""
                      }`}
                    >
                      {line.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="text-primary font-mono">$</span>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command..."
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 font-mono text-sm p-0"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    executeCommand(input);
                    setInput("");
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
