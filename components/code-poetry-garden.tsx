"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  RefreshCw, 
  Download, 
  Share2, 
  Wind,
  Flower2,
  Waves,
  Moon,
  Sun,
  Cloud,
  Music,
  Heart,
  Star,
  Zap,
  Coffee,
  Code,
  Palette,
  Type,
  Feather,
  BookOpen,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PoemLine {
  text: string;
  type: "code" | "nature" | "emotion" | "tech";
  color: string;
}

interface Poem {
  title: string;
  lines: PoemLine[];
  theme: string;
  mood: string;
}

const themes = [
  { id: "morning", name: "Morning Coffee", icon: Coffee, color: "from-amber-500 to-orange-500" },
  { id: "debugging", name: "Late Night Debug", icon: Moon, color: "from-indigo-500 to-purple-500" },
  { id: "flow", name: "Flow State", icon: Waves, color: "from-cyan-500 to-blue-500" },
  { id: "creation", name: "Creation", icon: Sparkles, color: "from-pink-500 to-rose-500" },
  { id: "zen", name: "Digital Zen", icon: Flower2, color: "from-emerald-500 to-teal-500" },
  { id: "storm", name: "Brainstorm", icon: Zap, color: "from-yellow-500 to-red-500" },
];

const codeSnippets = [
  "const life = await meaning.find();",
  "while (dreaming) { create(); }",
  "if (coffee.empty) { refill(); }",
  "try { live(); } catch (fear) { breathe(); }",
  "return joy || createJoy();",
  "import { peace } from 'nature';",
  "export const soul = new Presence();",
  "async function dream() { return infinity; }",
  "const stars = [...sky].map(s => s.shine());",
  "console.log('Hello, beautiful world');",
  "git commit -m 'becoming'",
  "npm install happiness --save",
  "const heart = document.querySelector('soul');",
  "setInterval(() => breathe(), 4000);",
  "await sleep.until(morning);",
];

const natureLines = [
  "petals fall like closing brackets",
  "rivers flow through memory lanes",
  "mountains rise in recursive calls",
  "clouds drift across the screen of sky",
  "rain taps a gentle rhythm on the window",
  "sunlight filters through the canopy",
  "waves write poetry on the shore",
  "stars compile in the night sky",
  "wind whispers through the trees",
  "dew drops reflect the morning light",
  "roots dig deep into the earth",
  "birds sing in async harmony",
];

const emotionLines = [
  "hope floats like an unresolved promise",
  "joy bubbles up from within",
  "wonder opens new tabs in the mind",
  "peace settles like a semicolon",
  "curiosity drives the next iteration",
  "love connects across the network",
  "patience waits for the callback",
  "gratitude fills the heart buffer",
];

const techLines = [
  "pixels dance in the glow of creation",
  "algorithms hum their quiet songs",
  "servers dream in binary sleep",
  "data flows like water through pipes",
  "interfaces blur between self and code",
  "syntax highlights the path forward",
  "functions fold time into results",
  "variables hold moments in memory",
];

export function CodePoetryGarden() {
  const [currentPoem, setCurrentPoem] = useState<Poem | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [favorites, setFavorites] = useState<Poem[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a poem based on theme
  const generatePoem = useCallback(() => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const poem: Poem = {
        title: `${selectedTheme.name} — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        theme: selectedTheme.id,
        mood: selectedTheme.name,
        lines: []
      };

      // Generate 6-8 lines
      const lineCount = 6 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < lineCount; i++) {
        const type = Math.random();
        let line: PoemLine;
        
        if (type < 0.3) {
          line = {
            text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
            type: "code",
            color: "text-blue-400"
          };
        } else if (type < 0.55) {
          line = {
            text: natureLines[Math.floor(Math.random() * natureLines.length)],
            type: "nature",
            color: "text-emerald-400"
          };
        } else if (type < 0.75) {
          line = {
            text: emotionLines[Math.floor(Math.random() * emotionLines.length)],
            type: "emotion",
            color: "text-rose-400"
          };
        } else {
          line = {
            text: techLines[Math.floor(Math.random() * techLines.length)],
            type: "tech",
            color: "text-purple-400"
          };
        }
        
        poem.lines.push(line);
      }

      setCurrentPoem(poem);
      setIsGenerating(false);
    }, 800);
  }, [selectedTheme]);

  // Particle animation
  useEffect(() => {
    if (!showParticles || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      char: string;
    }> = [];

    const chars = ['{', '}', ';', '/', '*', '=', '>', '<', '(', ')', '[', ']'];
    
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 14 + 10,
        opacity: Math.random() * 0.3 + 0.1,
        char: chars[Math.floor(Math.random() * chars.length)]
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = `rgba(100, 116, 139, ${p.opacity})`;
        ctx.fillText(p.char, p.x, p.y);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [showParticles]);

  // Generate initial poem
  useEffect(() => {
    generatePoem();
  }, [generatePoem]);

  const saveToFavorites = () => {
    if (currentPoem && !favorites.find(f => f.title === currentPoem.title)) {
      setFavorites([...favorites, currentPoem]);
    }
  };

  const downloadPoem = () => {
    if (!currentPoem) return;
    const text = `${currentPoem.title}\n\n${currentPoem.lines.map(l => l.text).join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poem-${Date.now()}.txt`;
    a.click();
  };

  const sharePoem = async () => {
    if (!currentPoem) return;
    const text = `${currentPoem.title}\n\n${currentPoem.lines.map(l => l.text).join('\n')}`;
    
    if (navigator.share) {
      await navigator.share({
        title: currentPoem.title,
        text: text,
      });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-rose-950/5 to-background relative overflow-hidden">
      {/* Background particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-50"
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/10 to-purple-500/10 text-rose-500 mb-6"
          >
            <Feather className="h-4 w-4" />
            <span className="text-sm font-medium">Code Poetry Garden</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Where{" "}
            <span className="text-gradient-animated">Code Meets Poetry</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate unique poems that blend programming syntax with natural imagery. 
            Each poem is a meditation on the beauty found in both worlds.
          </p>
        </motion.div>

        {/* Theme Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTheme.id === theme.id
                  ? `bg-gradient-to-r ${theme.color} text-white shadow-lg`
                  : "bg-card border border-border hover:border-primary/50"
              }`}
            >
              <theme.icon className="h-4 w-4" />
              {theme.name}
            </button>
          ))}
        </motion.div>

        {/* Poem Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative rounded-3xl bg-card/80 backdrop-blur-sm border border-border p-8 md:p-12 min-h-[400px] flex flex-col">
            {isGenerating ? (
              <div className="flex-1 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary"
                />
              </div>
            ) : currentPoem ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {currentPoem.mood}
                    </Badge>
                    <h3 className="text-lg font-medium text-muted-foreground">
                      {currentPoem.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={saveToFavorites}
                      className={favorites.find(f => f.title === currentPoem.title) ? "text-rose-500" : ""}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={downloadPoem}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={sharePoem}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <AnimatePresence mode="wait">
                    {currentPoem.lines.map((line, index) => (
                      <motion.div
                        key={`${currentPoem.title}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 group"
                      >
                        <span className="text-muted-foreground/50 text-sm font-mono w-8">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <p className={`text-lg md:text-xl font-light leading-relaxed ${line.color} transition-all group-hover:scale-105 origin-left cursor-default`}>
                          {line.text}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      {currentPoem.lines.filter(l => l.type === "code").length} code
                    </span>
                    <span className="flex items-center gap-1">
                      <Flower2 className="h-3 w-3" />
                      {currentPoem.lines.filter(l => l.type === "nature").length} nature
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {currentPoem.lines.filter(l => l.type === "emotion").length} heart
                    </span>
                  </div>
                  
                  <Button
                    onClick={generatePoem}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    Generate New
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </motion.div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Saved Poems ({favorites.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((poem, index) => (
                <motion.div
                  key={poem.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => setCurrentPoem(poem)}
                >
                  <p className="text-sm text-muted-foreground mb-2">{poem.title}</p>
                  <p className="text-sm line-clamp-2 text-muted-foreground/70">
                    {poem.lines[0]?.text}...
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {poem.lines.length} lines
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Quote className="h-6 w-6 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground italic">
            "Code is poetry written for machines to execute and humans to understand."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
