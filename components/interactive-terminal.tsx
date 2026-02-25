"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Minimize, Maximize, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Command {
  input: string;
  output: string[];
  isError?: boolean;
}

const COMMANDS: Record<string, (args: string[]) => string[]> = {
  help: () => [
    "Available commands:",
    "  help         - Show this help message",
    "  about        - Learn about Nemo",
    "  skills       - List technical skills",
    "  projects     - View featured projects",
    "  contact      - Get contact information",
    "  clear        - Clear the terminal",
    "  matrix       - Toggle matrix rain effect",
    "  joke         - Tell a developer joke",
    "  quote        - Show an inspirational quote",
    "  date         - Show current date and time",
    "  weather      - Show weather (simulated)",
    "  whoami       - Who are you?",
    "  ls           - List directory contents",
    "  pwd          - Print working directory",
    "  echo [text]  - Echo text back",
    "  goto [page]  - Navigate to page (home, about, projects, contact)",
    "",
    "Pro tip: Try the Konami code (↑↑↓↓←→←→BA) on any page!",
  ],
  about: () => [
    "╔══════════════════════════════════════════╗",
    "║              ABOUT NEMO                  ║",
    "╚══════════════════════════════════════════╝",
    "",
    "Hi! I'm Nemo, a creative developer and designer.",
    "",
    "I craft digital experiences that blend beautiful",
    "design with powerful functionality. Building things",
    "that live on the internet is my passion.",
    "",
    "Location: Asia/Shanghai",
    "Role: Creative Developer & Designer",
    "Status: Available for freelance work",
    "",
    "Type 'skills' to see what I can do!",
  ],
  skills: () => [
    "╔══════════════════════════════════════════╗",
    "║           TECHNICAL SKILLS               ║",
    "╚══════════════════════════════════════════╝",
    "",
    "Frontend:",
    "  ⚛️  React / Next.js / TypeScript",
    "  🎨 Tailwind CSS / Framer Motion",
    "  📱 Responsive Design / PWA",
    "",
    "Backend:",
    "  🟢 Node.js / Express / GraphQL",
    "  🐘 PostgreSQL / MongoDB / Redis",
    "  🐳 Docker / AWS / Vercel",
    "",
    "Tools & Others:",
    "  🎨 Figma / Adobe Creative Suite",
    "  📦 Git / GitHub / CI/CD",
    "  🧪 Jest / Cypress / Testing",
    "",
  ],
  projects: () => [
    "╔══════════════════════════════════════════╗",
    "║           FEATURED PROJECTS              ║",
    "╚══════════════════════════════════════════╝",
    "",
    "1. 🎨 Generative Art Gallery",
    "   25+ algorithmic art pieces",
    "   /art-gallery",
    "",
    "2. 🤖 AI Project Generator",
    "   AI-powered project idea creator",
    "   /playground",
    "",
    "3. 🎮 Interactive Playground",
    "   3D visualizations and experiments",
    "   /playground",
    "",
    "4. 📝 Code Poetry",
    "   Where code meets art",
    "   /code-poetry",
    "",
    "Type 'goto projects' to see all projects!",
  ],
  contact: () => [
    "╔══════════════════════════════════════════╗",
    "║           CONTACT INFORMATION            ║",
    "╚══════════════════════════════════════════╝",
    "",
    "📧 Email: hello@nemo.dev",
    "🐙 GitHub: github.com/nemodev",
    "💼 LinkedIn: linkedin.com/in/nemodev",
    "🐦 Twitter: @nemodev",
    "",
    "Or visit /contact for a fancy form!",
    "",
    "I'm always open to interesting conversations",
    "and collaborations. Let's build something!",
  ],
  date: () => {
    const now = new Date();
    return [
      `Current date: ${now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`,
      `Current time: ${now.toLocaleTimeString('en-US')}`,
      `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
    ];
  },
  whoami: () => [
    "visitor",
    "",
    "You're a curious explorer visiting Nemo's portfolio.",
    "Thanks for stopping by! 🦑",
  ],
  ls: () => [
    "about.md    contact.md    projects/",
    "skills.json    README.md    resume.pdf",
    "secret/    jokes.txt    quotes.json",
  ],
  pwd: () => ["/home/nemo/portfolio"],
  echo: (args) => [args.join(" ") || ""],
  joke: () => {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "Why did the developer go broke? Because he used up all his cache! 💸",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
      "Why do Java developers wear glasses? Because they don't C#! 👓",
      "What's a programmer's favorite hangout place? Foo Bar! 🍺",
      "Why was the function sad? It didn't get any calls! 📞",
      "What do you call a programmer from Finland? Nerdic! 🇫🇮",
    ];
    return [jokes[Math.floor(Math.random() * jokes.length)]];
  },
  quote: () => {
    const quotes = [
      '"The only way to do great work is to love what you do." - Steve Jobs',
      '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
      '"First, solve the problem. Then, write the code." - John Johnson',
      '"Make it work, make it right, make it fast." - Kent Beck',
      '"Simplicity is the soul of efficiency." - Austin Freeman',
    ];
    return [quotes[Math.floor(Math.random() * quotes.length)]];
  },
  weather: () => [
    "🌤️  Current Weather (Simulated)",
    "",
    "Location: Shanghai, China",
    "Condition: Partly cloudy",
    "Temperature: 22°C (72°F)",
    "Humidity: 65%",
    "Wind: 12 km/h NE",
    "",
    "Perfect weather for coding! ☕",
  ],
  matrix: () => [
    "🌧️  Matrix rain effect toggled!",
    "Look at the background...",
    "",
    "Type 'matrix' again to toggle off.",
  ],
  goto: (args) => {
    const pages: Record<string, string> = {
      home: "/",
      about: "/about",
      projects: "/projects",
      contact: "/contact",
      blog: "/blog",
      skills: "/skills",
      playground: "/playground",
      secret: "/secret",
    };
    const page = args[0]?.toLowerCase();
    if (pages[page]) {
      setTimeout(() => {
        window.location.href = pages[page];
      }, 500);
      return [`Navigating to ${page}...`];
    }
    return [
      "Usage: goto [page]",
      "Available pages: home, about, projects, contact, blog, skills, playground, secret",
    ];
  },
  clear: () => [],
};

export function InteractiveTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [commands, setCommands] = useState<Command[]>([
    {
      input: "",
      output: [
        "╔══════════════════════════════════════════╗",
        "║     WELCOME TO NEMO'S TERMINAL v1.0      ║",
        "╚══════════════════════════════════════════╝",
        "",
        "Type 'help' to see available commands.",
        "",
      ],
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [matrixMode, setMatrixMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const executeCommand = useCallback((input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const [cmd, ...args] = trimmed.toLowerCase().split(" ");
    
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (cmd === "clear") {
      setCommands([]);
      return;
    }

    if (cmd === "matrix") {
      setMatrixMode((prev) => !prev);
    }

    const handler = COMMANDS[cmd];
    const output = handler ? handler(args) : [`Command not found: ${cmd}. Type 'help' for available commands.`];

    setCommands((prev) => [
      ...prev,
      { input: trimmed, output, isError: !handler },
    ]);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const cmd = currentInput.toLowerCase();
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(cmd));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && e.ctrlKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        title="Open Terminal (Ctrl+`)"
      >
        <Terminal className="h-5 w-5" />
      </motion.button>
    );
  }

  return (
    <>
      {/* Matrix Rain Effect */}
      <AnimatePresence>
        {matrixMode && <MatrixRain onClose={() => setMatrixMode(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{
          opacity: isMinimized ? 0 : 1,
          y: isMinimized ? 20 : 0,
          scale: isMinimized ? 0.95 : 1,
          height: isMinimized ? 0 : "auto",
        }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50 w-[600px] max-w-[calc(100vw-2rem)]"
      >
        <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white/90">nemo@portfolio:~</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="h-[350px] overflow-y-auto p-4 font-mono text-sm"
          >
            {commands.map((cmd, i) => (
              <div key={i} className="mb-2">
                {cmd.input && (
                  <div className="flex items-center gap-2 text-green-400">
                    <span>➜</span>
                    <span className="text-blue-400">~</span>
                    <span>{cmd.input}</span>
                  </div>
                )}
                {cmd.output.map((line, j) => (
                  <div
                    key={j}
                    className={`${
                      cmd.isError ? "text-red-400" : "text-white/80"
                    } whitespace-pre-wrap`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ))}

            {/* Input Line */}
            <div className="flex items-center gap-2 text-green-400">
              <span>➜</span>
              <span className="text-blue-400">~</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white/90"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Minimized indicator */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full bg-black/90 border border-white/10 text-white/90 font-mono text-sm flex items-center gap-2 hover:bg-black/80 transition-colors"
          >
            <Terminal className="h-4 w-4 text-green-400" />
            <span>Terminal</span>
            <Maximize className="h-3 w-3" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function MatrixRain({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40"
      onClick={onClose}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 bg-black"
      />
      <div className="absolute bottom-4 left-4 text-green-400 font-mono text-sm">
        Click anywhere to exit Matrix mode
      </div>
    </motion.div>
  );
}
