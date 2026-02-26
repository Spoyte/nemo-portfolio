"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle,
  Command,
  Cpu,
  Wifi,
  Battery,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "success" | "info";
  content: string;
  timestamp: Date;
  command?: string;
}

interface FileSystem {
  [path: string]: {
    type: "file" | "directory";
    content?: string;
    children?: string[];
    permissions: string;
    owner: string;
    size?: number;
    modified: Date;
  };
}

// Simulated file system
const initialFileSystem: FileSystem = {
  "/": {
    type: "directory",
    children: ["home", "projects", "about", "contact", "secret"],
    permissions: "drwxr-xr-x",
    owner: "root",
    modified: new Date("2024-01-01"),
  },
  "/home": {
    type: "directory",
    children: ["welcome.txt", "skills.json", "resume.pdf"],
    permissions: "drwxr-xr-x",
    owner: "nemo",
    modified: new Date("2024-02-15"),
  },
  "/home/welcome.txt": {
    type: "file",
    content: `Welcome to Nemo's Portfolio Terminal!

This is a fully functional terminal emulator.
Try these commands:
  - help: Show available commands
  - ls: List directory contents
  - cat: Display file contents
  - cd: Change directory
  - whoami: Display user info
  - projects: View my projects
  - skills: View my technical skills
  - contact: Get contact information
  - matrix: Enter the matrix
  - fortune: Get a random quote
  - cowsay: Make a cow say something

Have fun exploring!`,
    permissions: "-rw-r--r--",
    owner: "nemo",
    size: 412,
    modified: new Date("2024-02-15"),
  },
  "/home/skills.json": {
    type: "file",
    content: JSON.stringify({
      frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      backend: ["Node.js", "PostgreSQL", "GraphQL", "Redis"],
      devops: ["Docker", "AWS", "Vercel", "CI/CD"],
      design: ["Figma", "UI/UX", "Design Systems"],
    }, null, 2),
    permissions: "-rw-r--r--",
    owner: "nemo",
    size: 256,
    modified: new Date("2024-02-10"),
  },
  "/home/resume.pdf": {
    type: "file",
    content: "[Binary PDF content - Download available]",
    permissions: "-rw-r--r--",
    owner: "nemo",
    size: 1024576,
    modified: new Date("2024-02-20"),
  },
  "/projects": {
    type: "directory",
    children: ["portfolio", "saas-platform", "mobile-app", "cli-tool"],
    permissions: "drwxr-xr-x",
    owner: "nemo",
    modified: new Date("2024-02-01"),
  },
  "/projects/portfolio": {
    type: "directory",
    children: ["README.md", "package.json"],
    permissions: "drwxr-xr-x",
    owner: "nemo",
    modified: new Date("2024-02-20"),
  },
  "/projects/portfolio/README.md": {
    type: "file",
    content: `# Personal Portfolio

A modern, interactive portfolio built with Next.js 14, TypeScript, and Tailwind CSS.

## Features
- 🎨 Beautiful, responsive design
- ⚡ Lightning-fast performance
- 🎭 Rich animations with Framer Motion
- 🌙 Dark mode support
- 🎮 Interactive terminal (you are here!)

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui`,
    permissions: "-rw-r--r--",
    owner: "nemo",
    size: 312,
    modified: new Date("2024-02-20"),
  },
  "/projects/portfolio/package.json": {
    type: "file",
    content: JSON.stringify({
      name: "nemo-portfolio",
      version: "1.0.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      dependencies: {
        "next": "^14.0.0",
        "react": "^18.0.0",
        "typescript": "^5.0.0",
      },
    }, null, 2),
    permissions: "-rw-r--r--",
    owner: "nemo",
    size: 189,
    modified: new Date("2024-02-20"),
  },
  "/projects/saas-platform": {
    type: "directory",
    children: [],
    permissions: "drwxr-xr-x",
    owner: "nemo",
    modified: new Date("2024-01-15"),
  },
  "/projects/mobile-app": {
    type: "directory",
    children: [],
    permissions: "drwxr-xr-x",
    owner: "nemo",
    modified: new Date("2024-01-10"),
  },
  "/projects/cli-tool": {
    type: "directory",
    children: [],
    permissions: "drwxr-xr-x",
    owner: "nemo",
    modified: new Date("2024-01-05"),
  },
  "/about": {
    type: "directory",
    children: ["bio.txt", "experience.md"],
    permissions: "drwxr-xr-x",
    owner: "nemo",
    modified: new Date("2024-02-01"),
  },
  "/about/bio.txt": {
    type: "file",
    content: `Nemo - Creative Developer

Location: San Francisco, CA
Experience: 7+ years
Specialization: Full-stack web development

Passionate about creating beautiful, functional, and user-friendly
digital experiences. I love exploring new technologies and pushing
the boundaries of what's possible on the web.`,
    permissions: "-rw-r--r--",
    owner: "nemo",
    size: 245,
    modified: new Date("2024-02-01"),
  },
  "/about/experience.md": {
    type: "file",
    content: `# Work Experience

## Senior Full-Stack Developer (2024 - Present)
TechCorp Inc., San Francisco, CA
- Leading frontend development for enterprise applications
- Mentoring junior developers

## Full-Stack Developer (2021 - 2024)
StartupXYZ, Remote
- Built scalable web applications from scratch
- Implemented CI/CD pipelines

## Frontend Developer (2020 - 2021)
Digital Agency, New York, NY
- Developed responsive websites for diverse clients`,
    permissions: "-rw-r--r--",
    owner: "nemo",
    size: 456,
    modified: new Date("2024-02-01"),
  },
  "/contact": {
    type: "directory",
    children: ["info.txt"],
    permissions: "drwxr-xr-x",
    owner: "nemo",
    modified: new Date("2024-02-01"),
  },
  "/contact/info.txt": {
    type: "file",
    content: `Contact Information

Email: hello@nemo.dev
GitHub: github.com/nemodev
LinkedIn: linkedin.com/in/nemodev
Twitter: @nemodev

Available for freelance work and collaborations!`,
    permissions: "-rw-r--r--",
    owner: "nemo",
    size: 156,
    modified: new Date("2024-02-01"),
  },
  "/secret": {
    type: "directory",
    children: [".hidden_flag"],
    permissions: "drwxr-xr-x",
    owner: "root",
    modified: new Date("2024-01-01"),
  },
  "/secret/.hidden_flag": {
    type: "file",
    content: `🎉 CONGRATULATIONS! 🎉

You've found the secret flag!

Flag: NEMO{terminal_master_2024}

Achievement Unlocked: Terminal Explorer

You are one of the few who discovered this hidden message.
Share your discovery on Twitter and tag @nemodev!`,
    permissions: "-rw-------",
    owner: "root",
    size: 89,
    modified: new Date("2024-01-01"),
  },
};

const fortunes = [
  "The best way to predict the future is to create it.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "Java is to JavaScript what car is to Carpet.",
  "Knowledge is power.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "Fix the cause, not the symptom.",
  "Optimism is an occupational hazard of programming.",
];

export default function TerminalPage() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentPath, setCurrentPath] = useState("/home");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    addLine("info", `Welcome to Nemo's Portfolio Terminal v2.0.0`);
    addLine("info", `Type 'help' to see available commands.`);
    addLine("output", "");
    executeCommand("cat welcome.txt");
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on click
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current && !matrixMode) {
        inputRef.current.focus();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [matrixMode]);

  // Matrix rain effect
  useEffect(() => {
    if (!matrixMode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [matrixMode]);

  const addLine = (type: TerminalLine["type"], content: string, command?: string) => {
    setLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        content,
        timestamp: new Date(),
        command,
      },
    ]);
  };

  const getPrompt = () => {
    const user = currentPath.startsWith("/home") ? "nemo" : "root";
    const path = currentPath === "/home" ? "~" : currentPath;
    return `${user}@portfolio:${path}$`;
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    addLine("input", "", trimmedCmd);
    setHistory((prev) => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    const parts = trimmedCmd.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "help":
        addLine("success", `Available commands:
  help              Show this help message
  clear, cls        Clear the terminal
  ls, dir           List directory contents
  cd <path>         Change directory
  pwd               Print working directory
  cat <file>        Display file contents
  mkdir <name>      Create directory
  touch <file>      Create empty file
  rm <file>         Remove file
  whoami            Display current user
  date              Show current date/time
  echo <text>       Print text
  projects          List my projects
  skills            Show technical skills
  contact           Get contact info
  matrix            Enter the Matrix
  fortune           Get a random quote
  cowsay <text>     Make a cow say something
  neofetch          System information
  history           Show command history
  download <file>   Download a file
  exit              Close terminal`);
        break;

      case "clear":
      case "cls":
        setLines([]);
        break;

      case "ls":
      case "dir":
        const showHidden = args.includes("-a") || args.includes("-la");
        const longFormat = args.includes("-l") || args.includes("-la");
        const currentDir = fileSystem[currentPath];
        
        if (currentDir?.type === "directory" && currentDir.children) {
          const items = currentDir.children
            .filter((item) => showHidden || !item.startsWith("."))
            .map((item) => {
              const fullPath = `${currentPath}/${item}`;
              const file = fileSystem[fullPath];
              if (longFormat && file) {
                const size = file.size ? `${file.size}B` : "-";
                const date = file.modified.toLocaleDateString();
                return `${file.permissions} ${file.owner} ${size.padStart(10)} ${date} ${item}`;
              }
              return item;
            });
          
          if (items.length === 0) {
            addLine("output", "(empty directory)");
          } else {
            addLine("output", items.join(longFormat ? "\n" : "  "));
          }
        }
        break;

      case "cd":
        const targetPath = args[0] || "/home";
        let newPath: string;

        if (targetPath === "..") {
          const parts = currentPath.split("/").filter(Boolean);
          parts.pop();
          newPath = "/" + parts.join("/");
        } else if (targetPath.startsWith("/")) {
          newPath = targetPath;
        } else if (targetPath === "~") {
          newPath = "/home";
        } else {
          newPath = `${currentPath}/${targetPath}`;
        }

        // Normalize path
        newPath = newPath.replace(/\/+/g, "/") || "/";

        const targetDir = fileSystem[newPath];
        if (targetDir?.type === "directory") {
          setCurrentPath(newPath);
        } else {
          addLine("error", `cd: ${targetPath}: No such directory`);
        }
        break;

      case "pwd":
        addLine("output", currentPath);
        break;

      case "cat":
        if (args.length === 0) {
          addLine("error", "cat: missing file operand");
        } else {
          const filePath = args[0].startsWith("/") ? args[0] : `${currentPath}/${args[0]}`;
          const file = fileSystem[filePath];
          
          if (file?.type === "file") {
            addLine("output", file.content || "");
          } else if (file?.type === "directory") {
            addLine("error", `cat: ${args[0]}: Is a directory`);
          } else {
            addLine("error", `cat: ${args[0]}: No such file`);
          }
        }
        break;

      case "mkdir":
        if (args.length === 0) {
          addLine("error", "mkdir: missing operand");
        } else {
          const dirName = args[0];
          const newDirPath = `${currentPath}/${dirName}`;
          
          if (fileSystem[newDirPath]) {
            addLine("error", `mkdir: cannot create directory '${dirName}': File exists`);
          } else {
            setFileSystem((prev) => ({
              ...prev,
              [newDirPath]: {
                type: "directory",
                children: [],
                permissions: "drwxr-xr-x",
                owner: "nemo",
                modified: new Date(),
              },
              [currentPath]: {
                ...prev[currentPath],
                children: [...(prev[currentPath]?.children || []), dirName],
              } as any,
            }));
            addLine("success", `Directory '${dirName}' created`);
          }
        }
        break;

      case "touch":
        if (args.length === 0) {
          addLine("error", "touch: missing file operand");
        } else {
          const fileName = args[0];
          const newFilePath = `${currentPath}/${fileName}`;
          
          if (!fileSystem[newFilePath]) {
            setFileSystem((prev) => ({
              ...prev,
              [newFilePath]: {
                type: "file",
                content: "",
                permissions: "-rw-r--r--",
                owner: "nemo",
                size: 0,
                modified: new Date(),
              },
              [currentPath]: {
                ...prev[currentPath],
                children: [...(prev[currentPath]?.children || []), fileName],
              } as any,
            }));
          }
        }
        break;

      case "rm":
        if (args.length === 0) {
          addLine("error", "rm: missing operand");
        } else {
          const fileName = args[0];
          const filePath = `${currentPath}/${fileName}`;
          
          if (fileSystem[filePath]) {
            const newFs = { ...fileSystem };
            delete newFs[filePath];
            
            const parentDir = newFs[currentPath];
            if (parentDir?.type === "directory" && parentDir.children) {
              parentDir.children = parentDir.children.filter((c) => c !== fileName);
            }
            
            setFileSystem(newFs);
            addLine("success", `Removed '${fileName}'`);
          } else {
            addLine("error", `rm: cannot remove '${fileName}': No such file`);
          }
        }
        break;

      case "whoami":
        addLine("output", currentPath.startsWith("/home") ? "nemo" : "root");
        break;

      case "date":
        addLine("output", new Date().toString());
        break;

      case "echo":
        addLine("output", args.join(" "));
        break;

      case "projects":
        addLine("success", "My Projects:\n");
        addLine("output", `1. Portfolio Website
   Modern portfolio with terminal, 3D visualizations, and games
   Tech: Next.js, TypeScript, Tailwind CSS, Framer Motion

2. SaaS Platform
   Project management tool for remote teams
   Tech: React, Node.js, PostgreSQL, GraphQL

3. Mobile App
   Cross-platform productivity application
   Tech: React Native, TypeScript, Firebase

4. CLI Tool
   Developer productivity tool for automation
   Tech: Rust, Clap, Tokio`);
        break;

      case "skills":
        addLine("success", "Technical Skills:\n");
        addLine("output", `Frontend:  React, Next.js, TypeScript, Tailwind CSS, Framer Motion
Backend:   Node.js, PostgreSQL, GraphQL, Redis, Prisma
DevOps:    Docker, AWS, Vercel, CI/CD, Kubernetes
Design:    Figma, UI/UX, Design Systems, Storybook
Mobile:    React Native, Expo, PWA
Tools:     Git, VS Code, Jest, Cypress`);
        break;

      case "contact":
        addLine("success", "Contact Information:\n");
        addLine("output", `Email:    hello@nemo.dev
GitHub:   github.com/nemodev
LinkedIn: linkedin.com/in/nemodev
Twitter:  @nemodev

Available for freelance work!`);
        break;

      case "matrix":
        setMatrixMode(true);
        setTimeout(() => setMatrixMode(false), 10000);
        break;

      case "fortune":
        const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        addLine("output", `┌${"─".repeat(fortune.length + 2)}┐`);
        addLine("output", `│ ${fortune} │`);
        addLine("output", `└${"─".repeat(fortune.length + 2)}┘`);
        break;

      case "cowsay":
        const text = args.join(" ") || "Moo!";
        const bubbleWidth = Math.min(text.length + 2, 40);
        addLine("output", ` ${"_".repeat(bubbleWidth)} `);
        addLine("output", `< ${text.padEnd(bubbleWidth - 2)} >`);
        addLine("output", ` ${"-".repeat(bubbleWidth)} `);
        addLine("output", `        \\   ^__^`);
        addLine("output", `         \\  (oo)\\_______`);
        addLine("output", `            (__)\\       )\\/\\`);
        addLine("output", `                ||----w |`);
        addLine("output", `                ||     ||`);
        break;

      case "neofetch":
        addLine("output", `       _.-;;-._      nemo@portfolio
    '-..-'|   ||      ---------------
    '-..-'|_.-;;-._   OS: NemoOS 2.0.0
    '-..-'|   ||      Host: Portfolio Website
    '-..-'|_.-''      Kernel: Next.js 14
         '            Uptime: ${Math.floor(Math.random() * 100)} days
                      Packages: 42 (npm)
                      Shell: terminal.tsx
                      Resolution: Responsive
                      DE: Tailwind CSS
                      WM: Framer Motion
                      Theme: Dark/Light
                      Icons: Lucide
                      Terminal: Interactive
                      CPU: Brain 7.0GHz
                      Memory: Unlimited creativity`);
        break;

      case "history":
        history.forEach((h, i) => addLine("output", `${i + 1}  ${h}`));
        break;

      case "download":
        if (args.length === 0) {
          addLine("error", "download: missing file operand");
        } else {
          const fileName = args[0];
          const filePath = `${currentPath}/${fileName}`;
          const file = fileSystem[filePath];
          
          if (file?.type === "file") {
            const blob = new Blob([file.content || ""], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            addLine("success", `Downloaded ${fileName}`);
          } else {
            addLine("error", `download: ${fileName}: No such file`);
          }
        }
        break;

      case "exit":
        addLine("info", "Goodbye! Refresh the page to restart the terminal.");
        break;

      default:
        addLine("error", `${command}: command not found. Type 'help' for available commands.`);
    }
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
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple tab completion
      const currentDir = fileSystem[currentPath];
      if (currentDir?.type === "directory" && currentDir.children) {
        const matches = currentDir.children.filter((item) =>
          item.toLowerCase().startsWith(input.toLowerCase())
        );
        if (matches.length === 1) {
          setInput(matches[0]);
        }
      }
    }
  };

  const copyToClipboard = () => {
    const text = lines.map((l) => l.content).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearTerminal = () => setLines([]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Terminal</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terminal</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A fully functional terminal emulator. Explore the file system, run commands, and discover hidden secrets.
          </p>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`relative ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
        >
          <Card className={`overflow-hidden border-2 ${isFullscreen ? "h-screen rounded-none" : ""}`}>
            {/* Terminal Header */}
            <CardHeader className="bg-muted/50 border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm font-medium">nemo@portfolio: ~</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHelp(!showHelp)}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearTerminal}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Terminal Content */}
            <CardContent className="p-0">
              <div
                ref={terminalRef}
                className={`bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto ${
                  isFullscreen ? "h-[calc(100vh-140px)]" : "h-[500px]"
                }`}
              >
                {lines.map((line) => (
                  <div key={line.id} className="mb-1">
                    {line.type === "input" && (
                      <div className="flex items-center">
                        <span className="text-blue-400 mr-2">{getPrompt()}</span>
                        <span className="text-white">{line.command}</span>
                      </div>
                    )}
                    {line.type === "output" && (
                      <pre className="text-green-400 whitespace-pre-wrap">{line.content}</pre>
                    )}
                    {line.type === "error" && (
                      <pre className="text-red-400 whitespace-pre-wrap">{line.content}</pre>
                    )}
                    {line.type === "success" && (
                      <pre className="text-yellow-400 whitespace-pre-wrap">{line.content}</pre>
                    )}
                    {line.type === "info" && (
                      <pre className="text-cyan-400 whitespace-pre-wrap">{line.content}</pre>
                    )}
                  </div>
                ))}

                {/* Input Line */}
                <form onSubmit={handleSubmit} className="flex items-center mt-2">
                  <span className="text-blue-400 mr-2">{getPrompt()}</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-white outline-none font-mono"
                    autoComplete="off"
                    autoFocus
                    spellCheck={false}
                  />
                </form>
              </div>

              {/* Quick Commands */}
              <div className="border-t p-3 bg-muted/30">
                <div className="flex flex-wrap gap-2">
                  {["help", "ls", "projects", "skills", "contact", "matrix", "fortune", "neofetch"].map((cmd) => (
                    <Button
                      key={cmd}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInput(cmd);
                        inputRef.current?.focus();
                      }}
                    >
                      <Command className="h-3 w-3 mr-1" />
                      {cmd}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Panel */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Terminal Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Navigation</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><code className="bg-muted px-1 rounded">cd &lt;dir&gt;</code> - Change directory</li>
                        <li><code className="bg-muted px-1 rounded">ls</code> - List files</li>
                        <li><code className="bg-muted px-1 rounded">pwd</code> - Show current path</li>
                        <li><code className="bg-muted px-1 rounded">cd ~</code> - Go to home</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">File Operations</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><code className="bg-muted px-1 rounded">cat &lt;file&gt;</code> - View file</li>
                        <li><code className="bg-muted px-1 rounded">mkdir &lt;name&gt;</code> - Create folder</li>
                        <li><code className="bg-muted px-1 rounded">touch &lt;file&gt;</code> - Create file</li>
                        <li><code className="bg-muted px-1 rounded">rm &lt;file&gt;</code> - Delete file</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Fun Commands</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><code className="bg-muted px-1 rounded">matrix</code> - Enter the Matrix</li>
                        <li><code className="bg-muted px-1 rounded">cowsay</code> - Talking cow</li>
                        <li><code className="bg-muted px-1 rounded">fortune</code> - Random quote</li>
                        <li><code className="bg-muted px-1 rounded">neofetch</code> - System info</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Portfolio Commands</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><code className="bg-muted px-1 rounded">projects</code> - List projects</li>
                        <li><code className="bg-muted px-1 rounded">skills</code> - Show skills</li>
                        <li><code className="bg-muted px-1 rounded">contact</code> - Contact info</li>
                        <li><code className="bg-muted px-1 rounded">clear</code> - Clear screen</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Command className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Tab Completion</p>
                <p className="text-xs text-muted-foreground">Press Tab to autocomplete</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Command History</p>
                <p className="text-xs text-muted-foreground">Use ↑↓ to navigate history</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Hidden Secrets</p>
                <p className="text-xs text-muted-foreground">Explore to find easter eggs!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Matrix Effect Overlay */}
      <AnimatePresence>
        {matrixMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-green-500 font-mono">
              <p>Press any key to exit the Matrix...</p>
              <button
                onClick={() => setMatrixMode(false)}
                className="mt-4 px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
              >
                Exit Matrix
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
