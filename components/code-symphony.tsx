"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Music, 
  Code2, 
  Sparkles,
  RefreshCw,
  Download,
  Settings2,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

// Musical scales
const SCALES = {
  pentatonic: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24],
  major: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24],
  minor: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 24],
  blues: [0, 3, 5, 6, 7, 10, 12, 15, 17, 18, 19, 22, 24],
  chromatic: Array.from({ length: 25 }, (_, i) => i),
};

// Base frequencies for notes (C4 = 261.63)
const BASE_FREQ = 261.63;

interface Note {
  freq: number;
  time: number;
  duration: number;
  amplitude: number;
  color: string;
  code: string;
}

interface CodePattern {
  name: string;
  code: string;
  pattern: number[];
  rhythm: number[];
  color: string;
}

const CODE_PATTERNS: CodePattern[] = [
  {
    name: "Fibonacci Loop",
    code: "for (let i = 0; i < n; i++) { sum += fib(i); }",
    pattern: [0, 1, 1, 2, 3, 5, 8, 5, 3, 2, 1, 1],
    rhythm: [0.25, 0.25, 0.5, 0.25, 0.25, 0.5, 1, 0.5, 0.25, 0.25, 0.5, 0.5],
    color: "#f59e0b",
  },
  {
    name: "Recursive Call",
    code: "function recurse(n) { return n <= 1 ? 1 : n * recurse(n-1); }",
    pattern: [0, 2, 4, 7, 4, 2, 0, -2, 0, 2, 4, 7],
    rhythm: [0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.5, 0.25, 0.25],
    color: "#8b5cf6",
  },
  {
    name: "Async Await",
    code: "async function fetch() { const data = await api.get(); return data; }",
    pattern: [4, 4, 7, 7, 9, 9, 7, 5, 5, 4, 4, 2],
    rhythm: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 1],
    color: "#06b6d4",
  },
  {
    name: "Map Reduce",
    code: "const sum = items.map(x => x * 2).reduce((a, b) => a + b, 0);",
    pattern: [7, 5, 4, 2, 0, 2, 4, 5, 7, 9, 7, 5],
    rhythm: [0.25, 0.25, 0.25, 0.25, 0.5, 0.25, 0.25, 0.25, 0.25, 0.5, 0.25, 0.25],
    color: "#ec4899",
  },
  {
    name: "Binary Search",
    code: "while (low <= high) { mid = (low + high) / 2; if (arr[mid] === target) return mid; }",
    pattern: [0, 12, 6, 9, 7, 8, 7, 6, 4, 2, 1, 0],
    rhythm: [0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.5, 0.5],
    color: "#10b981",
  },
];

export function CodeSymphony() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [bpm, setBpm] = useState(120);
  const [scale, setScale] = useState<keyof typeof SCALES>("pentatonic");
  const [currentPattern, setCurrentPattern] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [generatedCode, setGeneratedCode] = useState("");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
  }, []);

  // Play a note
  const playNote = useCallback((freq: number, duration: number, amplitude: number) => {
    if (!audioContextRef.current || isMuted) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 4, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(amplitude * volume * 0.3, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);

    // Add harmonics for richer sound
    const harmonic = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    harmonic.type = "triangle";
    harmonic.frequency.setValueAtTime(freq * 2, ctx.currentTime);
    harmonicGain.gain.setValueAtTime(0, ctx.currentTime);
    harmonicGain.gain.linearRampToValueAtTime(amplitude * volume * 0.1, ctx.currentTime + 0.01);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 0.5);

    harmonic.connect(harmonicGain);
    harmonicGain.connect(ctx.destination);
    harmonic.start(ctx.currentTime);
    harmonic.stop(ctx.currentTime + duration);
  }, [isMuted, volume]);

  // Generate notes from code pattern
  const generateNotes = useCallback((pattern: CodePattern): Note[] => {
    const scaleNotes = SCALES[scale];
    const notes: Note[] = [];
    let currentTime = 0;

    pattern.pattern.forEach((noteIndex, i) => {
      const scaleIndex = Math.abs(noteIndex) % scaleNotes.length;
      const octave = Math.floor(Math.abs(noteIndex) / scaleNotes.length) + 4;
      const semitones = scaleNotes[scaleIndex] + (octave - 4) * 12;
      const freq = BASE_FREQ * Math.pow(2, semitones / 12);
      
      notes.push({
        freq,
        time: currentTime,
        duration: pattern.rhythm[i] * (60 / bpm),
        amplitude: 0.5 + Math.random() * 0.3,
        color: pattern.color,
        code: pattern.code.slice(i * 3, i * 3 + 10),
      });

      currentTime += pattern.rhythm[i] * (60 / bpm);
    });

    return notes;
  }, [scale, bpm]);

  // Animation loop
  const animate = useCallback(() => {
    if (!audioContextRef.current) return;

    const currentTime = audioContextRef.current.currentTime - startTimeRef.current;
    const pattern = CODE_PATTERNS[currentPattern];
    const patternDuration = pattern.rhythm.reduce((a, b) => a + b, 0) * (60 / bpm);
    
    const loopTime = currentTime % patternDuration;
    const currentNotes = generateNotes(pattern);
    
    const newActiveNotes = new Set<number>();
    currentNotes.forEach((note, index) => {
      if (loopTime >= note.time && loopTime < note.time + note.duration) {
        newActiveNotes.add(index);
        if (!activeNotes.has(index)) {
          playNote(note.freq, note.duration, note.amplitude);
        }
      }
    });
    
    setActiveNotes(newActiveNotes);
    setNotes(currentNotes);

    // Update generated code visualization
    const codeProgress = Math.floor((loopTime / patternDuration) * pattern.code.length);
    setGeneratedCode(pattern.code.slice(0, codeProgress) + "|");

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, currentPattern, bpm, scale, activeNotes, playNote, generateNotes]);

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      startTimeRef.current = audioContextRef.current?.currentTime || 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate, initAudio]);

  // Canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      notes.forEach((note, index) => {
        const x = (note.time / (notes[notes.length - 1]?.time || 1)) * width;
        const y = height - (note.freq / 1000) * height * 0.8;
        const isActive = activeNotes.has(index);

        ctx.beginPath();
        ctx.arc(x, y, isActive ? 8 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? note.color : `${note.color}40`;
        ctx.fill();

        if (isActive) {
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.strokeStyle = `${note.color}40`;
          ctx.stroke();
        }
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => window.removeEventListener("resize", resize);
  }, [notes, activeNotes]);

  const pattern = CODE_PATTERNS[currentPattern];

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Music className="h-4 w-4" />
            <span className="text-sm font-medium">Code Symphony</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Where Code Becomes{" "}
            <span className="text-gradient-animated">Music</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience algorithms as melodies. Each code pattern generates unique musical sequences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visualization Canvas */}
            <div className="relative aspect-video rounded-2xl bg-black/90 overflow-hidden border border-border">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              
              {/* Overlay Info */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                    {pattern.name}
                  </Badge>
                </div>
                
                {/* Active Notes Indicator */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1">
                    {notes.map((note, index) => (
                      <motion.div
                        key={index}
                        className="h-8 flex-1 rounded-sm"
                        animate={{
                          backgroundColor: activeNotes.has(index) ? note.color : "#333",
                          scaleY: activeNotes.has(index) ? 1 : 0.3,
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Code Display */}
            <div className="p-6 rounded-2xl bg-card border border-border font-mono text-sm">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Source Code</span>
              </div>
              <pre className="text-foreground overflow-x-auto">
                <code>{generatedCode || pattern.code}</code>
              </pre>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-card border border-border">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-12 w-12"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <div className="flex-1 min-w-[120px]">
                <label className="text-xs text-muted-foreground mb-1 block">Volume</label>
                <Slider
                  value={[volume * 100]}
                  onValueChange={([v]) => setVolume(v / 100)}
                  max={100}
                  step={1}
                />
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="text-xs text-muted-foreground mb-1 block">BPM</label>
                <Slider
                  value={[bpm]}
                  onValueChange={([v]) => setBpm(v)}
                  min={60}
                  max={200}
                  step={5}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPattern((prev) => (prev + 1) % CODE_PATTERNS.length)}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Pattern Selector */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Code Patterns
            </h3>
            
            <div className="space-y-2">
              {CODE_PATTERNS.map((p, index) => (
                <button
                  key={p.name}
                  onClick={() => setCurrentPattern(index)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    currentPattern === index
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.code.slice(0, 40)}...
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Scale Selector */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                Musical Scale
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(SCALES) as Array<keyof typeof SCALES>).map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                      scale === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <Wand2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Did you know?</p>
                  <p className="text-xs text-muted-foreground">
                    The Fibonacci sequence appears in music through the golden ratio. 
                    Many classical compositions follow these mathematical patterns!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
