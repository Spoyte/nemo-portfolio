"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Send, 
  Trash2, 
  Copy, 
  HelpCircle,
  Sparkles,
  Code2,
  Coffee,
  Heart,
  Rocket,
  Gamepad2,
  Music,
  Moon,
  Sun,
  Github,
  Twitter,
  Mail,
  ExternalLink,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Command {
  input: string;
  output: string;
  type?: "success" | "error" | "info" | "fun";
  timestamp: Date;
}

const commands: Record<string, (args: string[]) => { output: string; type: Command["type"] }> = {
  help: () => ({
    output: `
Available commands:
  • help              - Show this help message
  • about             - Learn about me
  • skills            - View my technical skills
  • projects          - See my projects
  • contact           - Get in touch
  • clear             - Clear the terminal
  • date              - Show current date and time
  • weather           - Check the weather (simulated)
  • joke              - Get a random programming joke
  • quote             - Get an inspirational quote
  • matrix            - Enter the Matrix mode
  • party             - Start a party
  • coffee            - Brew virtual coffee
  • music             - Show music recommendations
  • social            - View social links
  • resume            - Download resume info
  • easteregg         - Find hidden surprises
  
Shortcuts:
  • Press Tab for autocomplete
  • Press Up/Down for command history
  • Type 'exit' to close terminal
    `,
    type: "info",
  }),
  
  about: () => ({
    output: `
┌─────────────────────────────────────┐
│  Nemo - Creative Developer          │
├─────────────────────────────────────┤
│                                     │
│  Hi! I'm a passionate developer     │
│  who loves creating beautiful,      │
│  functional web experiences.        │
│                                     │
│  Location: Shanghai, China          │
│  Experience: 7+ years               │
│  Focus: Frontend & Full Stack       │
│                                     │
│  Fun fact: I can solve a Rubik's    │
│  cube in under 2 minutes!           │
│                                     │
└─────────────────────────────────────┘
    `,
    type: "info",
  }),
  
  skills: () => ({
    output: `
Technical Skills:

Frontend:
  ⚛️  React / Next.js / TypeScript
  🎨  Tailwind CSS / Framer Motion
  📱  Responsive Design / PWA

Backend:
  🟢  Node.js / Express
  🐘  PostgreSQL / Redis
  ◈   GraphQL / REST APIs

DevOps:
  🐳  Docker / Kubernetes
  ☁️  AWS / Vercel / CI/CD
  📦  Git / GitHub Actions

Design:
  🎨  Figma / UI/UX
  ✨  Design Systems
  🎯  Prototyping
    `,
    type: "success",
  }),
  
  projects: () => ({
    output: `
Featured Projects:

1. 🚀 E-Commerce Platform
   Modern shopping experience with AI recommendations
   Tech: Next.js, PostgreSQL, Stripe

2. 📊 Analytics Dashboard  
   Real-time data visualization platform
   Tech: React, D3.js, WebSocket

3. 💬 Social Media App
   Community platform with real-time features
   Tech: React Native, Firebase, GraphQL

4. 🎨 Design System
   Comprehensive component library
   Tech: TypeScript, Storybook, Rollup

Type 'projects --all' to see more...
    `,
    type: "info",
  }),
  
  contact: () => ({
    output: `
Let's Connect!

📧  Email:    hello@nemo.dev
🐙  GitHub:   github.com/nemodev
🐦  Twitter:  twitter.com/nemodev
💼  LinkedIn: linkedin.com/in/nemodev

Feel free to reach out for:
  • Project collaborations
  • Freelance opportunities  
  • Just to say hi! 👋

Response time: Usually within 24 hours
    `,
    type: "success",
  }),
  
  date: () => ({
    output: new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    type: "info",
  }),
  
  weather: () => {
    const conditions = ["☀️ Sunny", "🌤️ Partly Cloudy", "☁️ Cloudy", "🌧️ Rainy", "⛈️ Stormy"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 15) + 20;
    return {
      output: `
Current Weather (Shanghai):

${condition} ${temp}°C
Humidity: ${Math.floor(Math.random() * 40) + 40}%
Wind: ${Math.floor(Math.random() * 20) + 5} km/h

Perfect weather for coding! ☕
      `,
      type: "info",
    };
  },
  
  joke: () => {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "Why did the developer go broke? Because he used up all his cache! 💸",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
      "Why do Java developers wear glasses? Because they don't C#! 👓",
      "What's a programmer's favorite place? The Foo Bar! 🍺",
      "Why was the function sad? It didn't get any calls! 📞",
      "What do you call a programmer from Finland? Nerdic! 🇫🇮",
    ];
    return {
      output: jokes[Math.floor(Math.random() * jokes.length)],
      type: "fun",
    };
  },
  
  quote: () => {
    const quotes = [
      { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
      { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { text: "Any fool can write code that a computer can understand.", author: "Martin Fowler" },
      { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
      { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return {
      output: `"${quote.text}"\n\n— ${quote.author}`,
      type: "info",
    };
  },
  
  coffee: () => ({
    output: `
☕ Brewing your virtual coffee...

    )  (
   (   ) )
    ) ( (
  _______)_
 |         |
 |  COFFEE |
 |_________|

Your coffee is ready! Enjoy coding! ⚡
    `,
    type: "fun",
  }),
  
  music: () => ({
    output: `
🎵 Currently Listening To:

Lo-Fi Study Beats
Chillhop Music

Playlist:
  1. 🎹 Midnight Jazz - Nymano
  2. 🎸 City Nights - j'san
  3. 🎺 Lazy Sunday - Saib
  4. 🎻 Rainy Day - L'Indécis
  5. 🎤 Coffee Shop - Aso

Perfect for focused coding sessions! 🎧
    `,
    type: "fun",
  }),
  
  social: () => ({
    output: `
Connect with me:

🐙  GitHub:   github.com/nemodev
🐦  Twitter:  twitter.com/nemodev
💼  LinkedIn: linkedin.com/in/nemodev
📧  Email:    hello@nemo.dev

Let's build something amazing together! 🚀
    `,
    type: "success",
  }),
  
  resume: () => ({
    output: `
📄 Resume Summary:

Experience:
  • Senior Frontend Developer (2022-Present)
  • Full Stack Developer (2020-2022)
  • Frontend Developer (2018-2020)

Education:
  • B.S. Computer Science (2018)

Key Skills:
  • React, Next.js, TypeScript
  • Node.js, PostgreSQL, GraphQL
  • AWS, Docker, CI/CD

Download full resume at: /resume.pdf
    `,
    type: "info",
  }),
  
  easteregg: () => ({
    output: `
🥚 Easter Eggs Found:

✅ Konami Code (↑↑↓↓←→←→BA)
✅ Secret Terminal (you're here!)
✅ Matrix Mode (type 'matrix')
✅ Party Mode (type 'party')

Still hidden:
  ? Secret page
  ? Hidden achievements
  ? Special animations

Keep exploring! 🔍
    `,
    type: "fun",
  }),
  
  matrix: () => {
    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).matrix) {
      ((window as unknown as Record<string, () => void>).matrix)();
    }
    return {
      output: "🕶️ Entering the Matrix... Look around!",
      type: "fun",
    };
  },
  
  party: () => {
    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).party) {
      ((window as unknown as Record<string, () => void>).party)();
    }
    return {
      output: "🎉 Party mode activated! Enjoy the confetti!",
      type: "fun",
    };
  },
  
  clear: () => ({
    output: "__CLEAR__",
    type: "info",
  }),
  
  exit: () => ({
    output: "__EXIT__",
    type: "info",
  }),
};

const welcomeMessage = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🖥️  Welcome to Nemo's Interactive Terminal v2.0        ║
║                                                          ║
║   Type 'help' to see available commands                  ║
║   Press Tab for autocomplete                             ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`;

interface InteractiveTerminalProps {
  onClose?: () => void;
  className?: string;
}

export function InteractiveTerminal({ onClose, className = "" }: InteractiveTerminalProps) {
  const [commandHistory, setCommandHistory] = useState<Command[]>([
    { input: "", output: welcomeMessage, type: "info", timestamp: new Date() },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (input: string) => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    setInputHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const [cmd, ...args] = trimmed.split(" ");
    
    if (commands[cmd]) {
      const result = commands[cmd](args);
      
      if (result.output === "__CLEAR__") {
        setCommandHistory([{ input: "", output: welcomeMessage, type: "info", timestamp: new Date() }]);
      } else if (result.output === "__EXIT__") {
        onClose?.();
      } else {
        setCommandHistory((prev) => [
          ...prev,
          { input, output: result.output, type: result.type, timestamp: new Date() },
        ]);
      }
    } else {
      setCommandHistory((prev) => [
        ...prev,
        { 
          input, 
          output: `Command not found: ${cmd}\nType 'help' for available commands.`, 
          type: "error", 
          timestamp: new Date() 
        },
      ]);
    }

    setCurrentInput("");
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(currentInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < inputHistory.length) {
          setHistoryIndex(newIndex);
          setCurrentInput(inputHistory[inputHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(inputHistory[inputHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = Object.keys(commands).filter((cmd) => cmd.startsWith(currentInput.toLowerCase()));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
        setSuggestions([]);
      } else if (matches.length > 1) {
        setSuggestions(matches);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setCommandHistory([{ input: "", output: welcomeMessage, type: "info", timestamp: new Date() }]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTypeColor = (type?: Command["type"]) => {
    switch (type) {
      case "success": return "text-green-400";
      case "error": return "text-red-400";
      case "fun": return "text-purple-400";
      default: return "text-blue-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            />
            <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
          </div>
          <span className="ml-4 text-sm text-slate-400 font-mono">nemo@portfolio:~$ terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white"
            onClick={() => setCommandHistory([{ input: "", output: welcomeMessage, type: "info", timestamp: new Date() }])}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="h-[400px] overflow-y-auto p-4 font-mono text-sm bg-slate-900"
        onClick={() => inputRef.current?.focus()}
      >
        {commandHistory.map((cmd, index) => (
          <div key={index} className="mb-4">
            {cmd.input && (
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">~</span>
                <span>{cmd.input}</span>
              </div>
            )}
            <div className={`whitespace-pre-wrap ${getTypeColor(cmd.type)}`}>
              {cmd.output}
            </div>
          </div>
        ))}

        {/* Input Line */}
        <div className="flex items-center gap-2">
          <span className="text-green-400">➜</span>
          <span className="text-blue-400">~</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => {
              setCurrentInput(e.target.value);
              setSuggestions([]);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-slate-200 font-mono"
            placeholder="Type a command..."
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 p-2 bg-slate-800 rounded-lg border border-slate-700"
            >
              <div className="text-xs text-slate-500 mb-1">Suggestions:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setCurrentInput(suggestion);
                      setSuggestions([]);
                      inputRef.current?.focus();
                    }}
                    className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>Tab: autocomplete</span>
          <span>↑↓: history</span>
          <span>Ctrl+L: clear</span>
        </div>
        <span>{Object.keys(commands).length} commands available</span>
      </div>
    </motion.div>
  );
}

// Terminal toggle button for floating access
export function TerminalToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-slate-900 text-white shadow-lg border border-slate-700 hover:bg-slate-800 transition-colors"
      >
        <Terminal className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] z-50"
            >
              <InteractiveTerminal onClose={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
