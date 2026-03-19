"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  Copy,
  Share2,
  Heart,
  Download,
  Shuffle,
  Wand2,
  Code2,
  Terminal,
  Coffee,
  Zap,
  Bug,
  GitBranch,
  Database,
  Cloud,
  Palette,
  Layout,
  Smartphone,
  Globe,
  Lock,
  Cpu,
  Wifi,
  Server,
  Monitor,
  Keyboard,
  MousePointer,
  FileCode,
  Braces,
  Quote,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  Ampersand,
  Asterisk,
  Parentheses,
  Brackets,
  CurlyBraces,
  ChevronRight,
  ChevronLeft,
  Slash,
  Minus,
  Plus,
  Equal,
  Question,
  Exclamation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import confetti from "canvas-confetti";

interface PoemLine {
  text: string;
  style: "normal" | "emphasis" | "code" | "comment";
  indent?: number;
}

interface CodePoem {
  title: string;
  lines: PoemLine[];
  language: string;
  theme: string;
  mood: string;
}

const themes = [
  { name: "Midnight", bg: "from-slate-900 to-slate-800", text: "text-blue-100", accent: "text-cyan-400" },
  { name: "Sunset", bg: "from-orange-900 to-rose-900", text: "text-orange-100", accent: "text-yellow-400" },
  { name: "Forest", bg: "from-emerald-900 to-green-900", text: "text-green-100", accent: "text-lime-400" },
  { name: "Ocean", bg: "from-blue-900 to-cyan-900", text: "text-blue-100", accent: "text-cyan-400" },
  { name: "Berry", bg: "from-purple-900 to-pink-900", text: "text-purple-100", accent: "text-pink-400" },
];

const moods = ["contemplative", "energetic", "melancholic", "hopeful", "playful", "focused"];

const codeSymbols = ["{ }", "[ ]", "( )", "< >", ";", ":", "=", "=>", "&&", "||", "!", "?", "//", "/*", "*/"];

const poemTemplates = [
  {
    title: "The Infinite Loop",
    generate: () => [
      { text: "while (true) {", style: "code" as const },
      { text: "  dream();", style: "normal" as const, indent: 1 },
      { text: "  create();", style: "emphasis" as const, indent: 1 },
      { text: "  if (tired) break;", style: "code" as const, indent: 1 },
      { text: "  // but never really", style: "comment" as const, indent: 1 },
      { text: "}", style: "code" as const },
    ],
  },
  {
    title: "Git Commit",
    generate: () => [
      { text: "git add .", style: "code" as const },
      { text: "git commit -m \"hope\"", style: "emphasis" as const },
      { text: "git push origin main", style: "code" as const },
      { text: "// life: deployed", style: "comment" as const },
    ],
  },
  {
    title: "The Promise",
    generate: () => [
      { text: "new Promise((resolve) => {", style: "code" as const },
      { text: "  setTimeout(() => {", style: "normal" as const, indent: 1 },
      { text: "    resolve('tomorrow');", style: "emphasis" as const, indent: 2 },
      { text: "  }, patience);", style: "normal" as const, indent: 1 },
      { text: "}).then(begin);", style: "code" as const },
    ],
  },
  {
    title: "Console.log(life)",
    generate: () => [
      { text: "try {", style: "code" as const },
      { text: "  liveFully();", style: "emphasis" as const, indent: 1 },
      { text: "} catch (regret) {", style: "code" as const },
      { text: "  learn(regret);", style: "normal" as const, indent: 1 },
      { text: "  continue;", style: "emphasis" as const, indent: 1 },
      { text: "}", style: "code" as const },
    ],
  },
  {
    title: "Array of Dreams",
    generate: () => [
      { text: "const dreams = [", style: "code" as const },
      { text: "  'build',", style: "normal" as const, indent: 1 },
      { text: "  'create',", style: "emphasis" as const, indent: 1 },
      { text: "  'inspire',", style: "normal" as const, indent: 1 },
      { text: "  '...rest',", style: "comment" as const, indent: 1 },
      { text: "];", style: "code" as const },
      { text: "dreams.map(d => d.toReality());", style: "emphasis" as const },
    ],
  },
  {
    title: "The Recursive Self",
    generate: () => [
      { text: "function grow(self) {", style: "code" as const },
      { text: "  if (self.complete) return;", style: "normal" as const, indent: 1 },
      { text: "  self.learn();", style: "emphasis" as const, indent: 1 },
      { text: "  self.evolve();", style: "emphasis" as const, indent: 1 },
      { text: "  return grow(self); // forever", style: "comment" as const, indent: 1 },
      { text: "}", style: "code" as const },
    ],
  },
  {
    title: "Async/Await",
    generate: () => [
      { text: "async function life() {", style: "code" as const },
      { text: "  await patience;", style: "normal" as const, indent: 1 },
      { text: "  await effort;", style: "emphasis" as const, indent: 1 },
      { text: "  return success;", style: "normal" as const, indent: 1 },
      { text: "  // eventually", style: "comment" as const, indent: 1 },
      { text: "}", style: "code" as const },
    ],
  },
  {
    title: "The Debugger",
    generate: () => [
      { text: "debugger; // pause", style: "code" as const },
      { text: "// look around", style: "comment" as const },
      { text: "// breathe", style: "comment" as const },
      { text: "// continue", style: "comment" as const },
      { text: "play();", style: "emphasis" as const },
    ],
  },
  {
    title: "CSS of Life",
    generate: () => [
      { text: ".life {", style: "code" as const },
      { text: "  display: flex;", style: "normal" as const, indent: 1 },
      { text: "  flex-direction: column;", style: "normal" as const, indent: 1 },
      { text: "  align-items: center;", style: "emphasis" as const, indent: 1 },
      { text: "  justify-content: joy;", style: "emphasis" as const, indent: 1 },
      { text: "}", style: "code" as const },
    ],
  },
  {
    title: "Hello World",
    generate: () => [
      { text: "const world = document.querySelector('.world');", style: "code" as const },
      { text: "world.innerHTML = 'Hello';", style: "normal" as const },
      { text: "world.style.color = 'hope';", style: "emphasis" as const },
      { text: "// nice to meet you", style: "comment" as const },
    ],
  },
];

const haikuStarters = [
  "Code flows like a stream",
  "Functions dance in the night",
  "Bugs hide in shadows",
  "Syntax glowing bright",
  "Algorithms singing",
  "Data structures bloom",
  "Variables breathe life",
  "Compilers humming soft",
  "Debuggers seeking truth",
];

const haikuMiddles = [
  "through loops of endless dreams",
  "in silicon gardens",
  "waiting to be found",
  "illuminating dark",
  "melodies of logic",
  "in digital spring",
  "in memory they dwell",
  "translating our thoughts",
  "line by line they search",
];

const haikuEndings = [
  "programs come alive.",
  "beauty in the code.",
  "patience is the key.",
  "errors teach us most.",
  "creation never ends.",
  "complexity unfolds.",
  "infinity awaits.",
  "machines understand.",
  "perfection emerges.",
];

export function CodePoetrySlam() {
  const [currentPoem, setCurrentPoem] = useState<CodePoem | null>(null);
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState<CodePoem[]>([]);
  const [showHaiku, setShowHaiku] = useState(false);
  const [currentHaiku, setCurrentHaiku] = useState<string[]>([]);
  const [typingEffect, setTypingEffect] = useState(true);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("code-poetry-favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("code-poetry-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const generatePoem = useCallback(() => {
    setIsGenerating(true);
    setShowHaiku(false);

    setTimeout(() => {
      const template = poemTemplates[Math.floor(Math.random() * poemTemplates.length)];
      const theme = themes[Math.floor(Math.random() * themes.length)];
      const mood = moods[Math.floor(Math.random() * moods.length)];

      const poem: CodePoem = {
        title: template.title,
        lines: template.generate(),
        language: "javascript",
        theme: theme.name,
        mood,
      };

      setCurrentPoem(poem);
      setCurrentTheme(theme);
      setIsGenerating(false);
    }, 800);
  }, []);

  const generateHaiku = useCallback(() => {
    setIsGenerating(true);
    setShowHaiku(true);

    setTimeout(() => {
      const haiku = [
        haikuStarters[Math.floor(Math.random() * haikuStarters.length)],
        haikuMiddles[Math.floor(Math.random() * haikuMiddles.length)],
        haikuEndings[Math.floor(Math.random() * haikuEndings.length)],
      ];

      setCurrentHaiku(haiku);
      setIsGenerating(false);
    }, 600);
  }, []);

  const addToFavorites = () => {
    if (currentPoem && !favorites.find((f) => f.title === currentPoem.title)) {
      setFavorites([currentPoem, ...favorites]);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#f472b6", "#a78bfa", "#22d3ee"],
      });
    }
  };

  const copyToClipboard = () => {
    const text = showHaiku
      ? currentHaiku.join("\n")
      : currentPoem?.lines.map((l) => l.text).join("\n");
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  // Generate initial poem
  useEffect(() => {
    if (!currentPoem && !showHaiku) {
      generatePoem();
    }
  }, [currentPoem, showHaiku, generatePoem]);

  return (
    <section className="py-24 border-y border-border/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-500 mb-6">
            <Quote className="h-4 w-4" />
            <span className="text-sm font-medium">Creative Coding</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code Poetry{" "}
            <span className="text-gradient-animated">Slam</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Where syntax meets soul. Generate poetic code snippets and haikus that capture 
            the beauty, frustration, and joy of programming.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Poetry Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentTheme.bg} p-8 min-h-[400px] flex flex-col`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Terminal className={`h-5 w-5 ${currentTheme.accent}`} />
                  <span className={`font-mono text-sm ${currentTheme.text}`}>
                    {showHaiku ? "haiku.txt" : `${currentPoem?.title.toLowerCase().replace(/\s+/g, "-")}.js`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {showHaiku ? (
                    <Badge variant="outline" className={`${currentTheme.text} border-current`}>
                      Haiku
                    </Badge>
                  ) : (
                    <>
                      <Badge variant="outline" className={`${currentTheme.text} border-current`}>
                        {currentPoem?.language}
                      </Badge>
                      <Badge variant="outline" className={`${currentTheme.text} border-current`}>
                        {currentPoem?.mood}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Code/Content Area */}
              <div className="flex-1 font-mono text-lg md:text-xl leading-relaxed">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-full"
                    >
                      <div className="flex items-center gap-2 text-white/60">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Composing...</span>
                      </div>
                    </motion.div>
                  ) : showHaiku ? (
                    <motion.div
                      key="haiku"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`${currentTheme.text} space-y-4`}
                    >
                      {currentHaiku.map((line, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.3 }}
                          className="italic"
                        >
                          {line}
                        </motion.p>
                      ))}
                    </motion.div>
                  ) : currentPoem ? (
                    <motion.div
                      key="poem"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-1"
                    >
                      {currentPoem.lines.map((line, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: typingEffect ? index * 0.15 : 0 }}
                          className={`${
                            line.style === "comment"
                              ? "text-green-400/70"
                              : line.style === "emphasis"
                              ? currentTheme.accent
                              : line.style === "code"
                              ? "text-purple-300"
                              : currentTheme.text
                          }`}
                          style={{ marginLeft: line.indent ? `${line.indent * 2}rem` : 0 }}
                        >
                          {line.text}
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Line Numbers */}
              <div className="absolute left-4 top-24 bottom-8 w-8 text-right text-white/20 font-mono text-sm select-none">
                {Array.from({ length: 15 }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className={`${currentTheme.text} hover:bg-white/10`}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  {!showHaiku && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addToFavorites}
                      className={`${currentTheme.text} hover:bg-white/10`}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  )}
                </div>
                <span className={`text-sm ${currentTheme.text} opacity-60`}>
                  {currentTheme.name} Theme
                </span>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Generate Buttons */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-primary" />
                  Generate New
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={generatePoem} className="w-full">
                    <Code2 className="h-4 w-4 mr-2" />
                    Code Poem
                  </Button>
                  <Button onClick={generateHaiku} variant="outline" className="w-full">
                    <Quote className="h-4 w-4 mr-2" />
                    Haiku
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTypingEffect(!typingEffect)}
                    className={typingEffect ? "text-primary" : ""}
                  >
                    {typingEffect ? "✓" : ""} Typing Effect
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Theme Selector */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  Theme
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => setCurrentTheme(theme)}
                      className={`h-10 rounded-lg bg-gradient-to-br ${theme.bg} border-2 transition-all ${
                        currentTheme.name === theme.name
                          ? "border-primary scale-110"
                          : "border-transparent hover:border-primary/50"
                      }`}
                      title={theme.name}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Favorites ({favorites.length})
                </h3>
                {favorites.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No favorites yet. Generate and save poems you love!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {favorites.map((poem, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentPoem(poem);
                          setShowHaiku(false);
                        }}
                        className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 transition-all text-sm"
                      >
                        <p className="font-medium truncate">{poem.title}</p>
                        <p className="text-xs text-muted-foreground">{poem.mood}</p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="p-4 rounded-xl bg-muted">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{poemTemplates.length}</p>
                  <p className="text-xs text-muted-foreground">Templates</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{themes.length}</p>
                  <p className="text-xs text-muted-foreground">Themes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{favorites.length}</p>
                  <p className="text-xs text-muted-foreground">Saved</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
