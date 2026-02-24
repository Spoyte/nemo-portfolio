"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Copy, Sparkles, Code, Terminal, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CodePoem {
  title: string;
  lines: string[];
  language: string;
  theme: string;
}

const poemTemplates: CodePoem[] = [
  {
    title: "The Infinite Loop",
    language: "python",
    theme: "love",
    lines: [
      "while True:",
      "    heart.beat()",
      "    if you.love(me):",
      "        happiness += infinity",
      "    else:",
      "        wait_for_you()",
      "        # forever",
    ],
  },
  {
    title: "Memory Leak",
    language: "c",
    theme: "nostalgia",
    lines: [
      "void remember(you) {",
      "    memory_t* thoughts = malloc(sizeof(you));",
      "    if (!thoughts) return;",
      "    ",
      "    memcpy(thoughts, &you, sizeof(you));",
      "    // forgot to free()",
      "    // some memories stay forever",
      "}",
    ],
  },
  {
    title: "Promise.resolve()",
    language: "javascript",
    theme: "hope",
    lines: [
      "const tomorrow = new Promise((resolve) => {",
      "    setTimeout(() => {",
      "        resolve({",
      "            sun: 'bright',",
      "            coffee: 'hot',",
      "            bugs: 'fixed'",
      "        });",
      "    }, 86400000);",
      "});",
    ],
  },
  {
    title: "Recursion of Dreams",
    language: "haskell",
    theme: "dreams",
    lines: [
      "dreams :: [Thought] -> [Reality]",
      "dreams [] = []",
      "dreams (x:xs) = manifest x : dreams xs",
      "",
      "-- where every thought becomes",
      "-- a thread in reality's tapestry",
    ],
  },
  {
    title: "Null Safety",
    language: "rust",
    theme: "comfort",
    lines: [
      "let presence: Option<&You> = Some(&you);",
      "",
      "match presence {",
      "    Some(you) => {",
      "        world.make_sense();",
      "    }",
      "    None => {",
      "        // impossible",
      "        panic!(\"without you\");",
      "    }",
      "}",
    ],
  },
  {
    title: "Garbage Collection",
    language: "java",
    theme: "letting go",
    lines: [
      "List<Memory> past = new ArrayList<>();",
      "past.add(sorrow);",
      "past.add(regret);",
      "",
      "// the collector comes",
      "System.gc();",
      "// and only joy remains",
    ],
  },
  {
    title: "CSS of the Heart",
    language: "css",
    theme: "love",
    lines: [
      ".heart {",
      "    position: relative;",
      "    overflow: visible;",
      "    transition: all 0.3s ease;",
      "}",
      "",
      ".heart:hover {",
      "    transform: scale(1.5);",
      "    filter: brightness(1.2);",
      "}",
    ],
  },
  {
    title: "The Query",
    language: "sql",
    theme: "searching",
    lines: [
      "SELECT * FROM universe",
      "WHERE meaning IS NOT NULL",
      "  AND purpose = 'fulfilled'",
      "ORDER BY happiness DESC",
      "LIMIT 1;",
      "-- returns: you",
    ],
  },
  {
    title: "Docker of the Soul",
    language: "dockerfile",
    theme: "identity",
    lines: [
      "FROM scratch",
      "COPY . /soul",
      "RUN rm -rf /doubt",
      "    && rm -rf /fear",
      "    && install courage",
      "EXPOSE 8080",
      "CMD [\"live\", \"authentically\"]",
    ],
  },
  {
    title: "Git Blame",
    language: "bash",
    theme: "time",
    lines: [
      "#!/bin/bash",
      "git log --all --full-history",
      "    -- \"*memories*\" |",
      "    grep -E \"(joy|laughter|love)\" |",
      "    wc -l",
      "# output: countless",
    ],
  },
  {
    title: "The Monad",
    language: "scala",
    theme: "connection",
    lines: [
      "val us = for {",
      "  you <- Future(present)",
      "  me  <- Future(here)",
      "} yield you.flatMap(_ => me)",
      "",
      "// bound together",
      "// in this flatMap we call life",
    ],
  },
  {
    title: "Regex for Happiness",
    language: "regex",
    theme: "patterns",
    lines: [
      "^(?=.*coffee)",
      "  (?=.*code)",
      "  (?=.*creativity)",
      ".*$",
      "",
      "// matches: every good day",
    ],
  },
];

const languageColors: Record<string, string> = {
  python: "#3776ab",
  javascript: "#f7df1e",
  typescript: "#3178c6",
  rust: "#dea584",
  go: "#00add8",
  java: "#007396",
  c: "#555555",
  cpp: "#f34b7d",
  haskell: "#5e5086",
  scala: "#c22d40",
  css: "#563d7c",
  sql: "#e38c00",
  dockerfile: "#2496ed",
  bash: "#89e051",
  regex: "#ff6b6b",
};

export function CodePoetryGenerator() {
  const [currentPoem, setCurrentPoem] = useState<CodePoem>(poemTemplates[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Cursor blink effect
  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  const typePoem = (poem: CodePoem) => {
    setIsTyping(true);
    setDisplayedLines([]);
    
    let lineIndex = 0;
    let charIndex = 0;
    const currentLine = poem.lines[lineIndex];
    
    const type = () => {
      if (lineIndex >= poem.lines.length) {
        setIsTyping(false);
        return;
      }

      const line = poem.lines[lineIndex];
      
      if (charIndex === 0) {
        setDisplayedLines((prev) => [...prev, ""]);
      }

      if (charIndex < line.length) {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          newLines[lineIndex] = line.slice(0, charIndex + 1);
          return newLines;
        });
        charIndex++;
        intervalRef.current = setTimeout(type, 30 + Math.random() * 50);
      } else {
        lineIndex++;
        charIndex = 0;
        intervalRef.current = setTimeout(type, 200);
      }
    };

    type();
  };

  const generateNewPoem = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    const randomPoem = poemTemplates[Math.floor(Math.random() * poemTemplates.length)];
    setCurrentPoem(randomPoem);
    typePoem(randomPoem);
  };

  const copyToClipboard = () => {
    const text = `// ${currentPoem.title}\n${currentPoem.lines.join("\n")}`;
    navigator.clipboard.writeText(text);
    toast.success("Poem copied to clipboard!");
  };

  // Start typing on mount
  useEffect(() => {
    typePoem(currentPoem);
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  const getThemeEmoji = (theme: string) => {
    const emojis: Record<string, string> = {
      love: "💝",
      nostalgia: "🌅",
      hope: "🌟",
      dreams: "🌙",
      comfort: "🤗",
      "letting go": "🍃",
      searching: "🔍",
      identity: "🎭",
      time: "⏰",
      connection: "🔗",
      patterns: "🧩",
    };
    return emojis[theme] || "✨";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: languageColors[currentPoem.language] || "#666" }}
          >
            {currentPoem.language[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold">{currentPoem.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{currentPoem.language}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {getThemeEmoji(currentPoem.theme)}
                <span className="capitalize">{currentPoem.theme}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            size="sm"
            onClick={generateNewPoem}
            disabled={isTyping}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isTyping ? "animate-spin" : ""}`} />
            New Poem
          </Button>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
        {/* Window Controls */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-xs text-slate-500 font-mono">
            {currentPoem.title.toLowerCase().replace(/\s+/g, "_")}.
            {currentPoem.language === "regex" ? "txt" : currentPoem.language}
          </span>
        </div>

        {/* Code Content */}
        <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
          <pre className="text-slate-300">
            {displayedLines.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-slate-600 w-8 select-none">{i + 1}</span>
                <span className={line.startsWith("//") || line.startsWith("#") || line.startsWith("--")
                  ? "text-slate-500 italic"
                  : line.startsWith("const") || line.startsWith("let") || line.startsWith("var") || line.startsWith("def") || line.startsWith("function")
                  ? "text-purple-400"
                  : line.includes("return") || line.includes("yield")
                  ? "text-pink-400"
                  : "text-slate-300"
                }>
                  {line || " "}
                </span>
              </div>
            ))}
            <span
              className={`inline-block w-2 h-5 bg-primary ml-1 ${cursorVisible ? "opacity-100" : "opacity-0"}`}
            />
          </pre>
        </div>

        {/* Glow Effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${languageColors[currentPoem.language] || "#666"}40, transparent 70%)`,
          }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          <span>{currentPoem.lines.length} lines</span>
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span>{poemTemplates.length} poems available</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>{Object.keys(languageColors).length} languages</span>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        {Array.from(new Set(poemTemplates.map((p) => p.language))).map((lang) => (
          <button
            key={lang}
            onClick={() => {
              const poems = poemTemplates.filter((p) => p.language === lang);
              const poem = poems[Math.floor(Math.random() * poems.length)];
              if (intervalRef.current) clearTimeout(intervalRef.current);
              setCurrentPoem(poem);
              typePoem(poem);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              currentPoem.language === lang
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}
