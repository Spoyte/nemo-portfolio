"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Copy, 
  Check,
  Download,
  Share2,
  Palette,
  Type,
  Settings2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Code poetry examples
const CODE_POEMS = [
  {
    id: "1",
    title: "The Loop",
    code: `while (alive) {
  breathe();
  create();
  learn();
  
  if (tired) {
    rest();
    continue;
  }
  
  if (inspired) {
    build();
    share();
  }
}`,
    language: "javascript",
    theme: "sunset",
    description: "A meditation on the cycle of creation",
  },
  {
    id: "2",
    title: "Promise",
    code: `const future = new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      dreams: realized,
      growth: exponential,
      peace: found
    });
  }, time + patience);
});`,
    language: "javascript",
    theme: "ocean",
    description: "Trusting the process",
  },
  {
    id: "3",
    title: "Recursion",
    code: `function life(experience) {
  if (experience >= wisdom) {
    return peace;
  }
  
  return life(
    experience + lesson()
  );
}`,
    language: "javascript",
    theme: "forest",
    description: "Learning through repetition",
  },
  {
    id: "4",
    title: "Async",
    code: `async function tomorrow() {
  await sleep();
  
  const sun = await dawn();
  const coffee = await brew();
  
  return possibilities;
}`,
    language: "javascript",
    theme: "sunrise",
    description: "The beauty of anticipation",
  },
  {
    id: "5",
    title: "Merge",
    code: `const us = {
  ...me,
  ...you,
  conflict: resolved,
  love: Infinity
};`,
    language: "javascript",
    theme: "rose",
    description: "Two becoming one",
  },
];

const THEMES = {
  sunset: {
    bg: "from-orange-500 via-red-500 to-purple-600",
    text: "text-white",
    keyword: "text-yellow-200",
    string: "text-green-200",
    function: "text-cyan-200",
    comment: "text-white/50",
  },
  ocean: {
    bg: "from-blue-600 via-cyan-500 to-teal-400",
    text: "text-white",
    keyword: "text-cyan-100",
    string: "text-yellow-200",
    function: "text-pink-200",
    comment: "text-white/50",
  },
  forest: {
    bg: "from-green-700 via-emerald-600 to-teal-500",
    text: "text-white",
    keyword: "text-green-100",
    string: "text-yellow-200",
    function: "text-cyan-200",
    comment: "text-white/50",
  },
  sunrise: {
    bg: "from-pink-500 via-orange-400 to-yellow-400",
    text: "text-white",
    keyword: "text-yellow-100",
    string: "text-green-100",
    function: "text-blue-100",
    comment: "text-white/50",
  },
  rose: {
    bg: "from-rose-600 via-pink-500 to-purple-500",
    text: "text-white",
    keyword: "text-pink-100",
    string: "text-yellow-200",
    function: "text-cyan-200",
    comment: "text-white/50",
  },
  midnight: {
    bg: "from-slate-900 via-purple-900 to-slate-900",
    text: "text-white",
    keyword: "text-purple-300",
    string: "text-green-300",
    function: "text-cyan-300",
    comment: "text-white/40",
  },
};

// Simple syntax highlighting
function highlightCode(code: string, theme: keyof typeof THEMES) {
  const t = THEMES[theme];
  
  return code
    .replace(/\b(function|const|let|var|if|return|while|async|await|new|class|import|export|from|for|of|in)\b/g, 
      `<span class="${t.keyword}">$1</span>`)
    .replace(/(['"`].*?['"`])/g, `<span class="${t.string}">$1</span>`)
    .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, `<span class="${t.function}">$1</span>`)
    .replace(/(\/\/.*$)/gm, `<span class="${t.comment}">$1</span>`)
    .replace(/\n/g, '<br/>')
    .replace(/ /g, '&nbsp;');
}

// Typewriter effect component
function TypewriterCode({ 
  code, 
  theme, 
  isPlaying, 
  speed = 50,
  onComplete 
}: { 
  code: string; 
  theme: keyof typeof THEMES;
  isPlaying: boolean;
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = THEMES[theme];

  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(prev => prev + code[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, code, isPlaying, speed, onComplete]);

  useEffect(() => {
    if (!isPlaying) {
      setDisplayedCode(code);
      setCurrentIndex(code.length);
    }
  }, [code, isPlaying]);

  const highlighted = highlightCode(displayedCode, theme);

  return (
    <pre 
      className="font-mono text-lg leading-relaxed overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

export function CodePoetry() {
  const [selectedPoem, setSelectedPoem] = useState(CODE_POEMS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [copied, setCopied] = useState(false);
  const [customTheme, setCustomTheme] = useState<keyof typeof THEMES>("sunset");

  const handlePlay = () => {
    setIsPlaying(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsCompleted(false);
    // Force re-render by changing key
    setSelectedPoem({ ...selectedPoem });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(selectedPoem.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTheme = THEMES[customTheme];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Code Poetry
          </h2>
          <p className="text-muted-foreground">
            Where code becomes art. Watch as algorithms tell human stories.
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={customTheme} onValueChange={(v) => setCustomTheme(v as any)}>
            <SelectTrigger className="w-[140px]">
              <Palette className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(THEMES).map(theme => (
                <SelectItem key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Display */}
      <Card className="overflow-hidden">
        <div className={`bg-gradient-to-br ${currentTheme.bg} p-8 min-h-[400px] flex flex-col`}>
          {/* Poem Display */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              key={selectedPoem.id + (isPlaying ? '-playing' : '-static')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${currentTheme.text} max-w-2xl w-full`}
            >
              <TypewriterCode
                code={selectedPoem.code}
                theme={customTheme}
                isPlaying={isPlaying}
                speed={speed}
                onComplete={() => {
                  setIsPlaying(false);
                  setIsCompleted(true);
                }}
              />
            </motion.div>
          </div>

          {/* Title overlay */}
          <div className="mt-8 text-center">
            <motion.h3 
              key={selectedPoem.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white mb-2"
            >
              {selectedPoem.title}
            </motion.h3>
            <motion.p 
              key={selectedPoem.description}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70"
            >
              {selectedPoem.description}
            </motion.p>
          </div>
        </div>

        {/* Controls */}
        <CardContent className="p-4 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={isPlaying ? handlePause : handlePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2 ml-4">
                <Type className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[speed]}
                  onValueChange={([v]) => setSpeed(100 - v)}
                  min={10}
                  max={90}
                  step={10}
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground w-12">
                  {speed < 30 ? 'Fast' : speed > 70 ? 'Slow' : 'Normal'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Poem Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CODE_POEMS.map((poem, index) => (
          <motion.div
            key={poem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                selectedPoem.id === poem.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedPoem(poem);
                setIsPlaying(false);
                setIsCompleted(false);
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{poem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {poem.description}
                </p>
                <pre className="text-xs font-mono bg-muted p-2 rounded overflow-hidden text-muted-foreground">
                  <code>{poem.code.slice(0, 60)}...</code>
                </pre>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* About Code Poetry */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">What is Code Poetry?</h3>
              <p className="text-sm text-muted-foreground">
                Code poetry is the art of writing code that is both syntactically valid and 
                poetically expressive. Like traditional poetry, it uses structure, rhythm, 
                and metaphor to evoke emotion and meaning. Each poem here is valid JavaScript 
                that tells a story about the human experience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
