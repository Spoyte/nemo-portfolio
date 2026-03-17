"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Music, 
  Code2, 
  Volume2, 
  VolumeX,
  Sparkles,
  Wand2,
  Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface Note {
  id: string;
  frequency: number;
  duration: number;
  type: OscillatorType;
  x: number;
  y: number;
  color: string;
  symbol: string;
}

interface CodeInstrument {
  id: string;
  name: string;
  symbol: string;
  color: string;
  baseFreq: number;
  type: OscillatorType;
  pattern: string[];
}

const instruments: CodeInstrument[] = [
  { id: "functions", name: "Functions", symbol: "ƒ", color: "#60a5fa", baseFreq: 261.63, type: "sine", pattern: ["function", "=>", "()", "return"] },
  { id: "variables", name: "Variables", symbol: "var", color: "#f472b6", baseFreq: 329.63, type: "triangle", pattern: ["const", "let", "var", "="] },
  { id: "loops", name: "Loops", symbol: "∞", color: "#a78bfa", baseFreq: 392.00, type: "sawtooth", pattern: ["for", "while", "map", "forEach"] },
  { id: "conditions", name: "Conditions", symbol: "if", color: "#fbbf24", baseFreq: 523.25, type: "square", pattern: ["if", "else", "?", ":"] },
  { id: "objects", name: "Objects", symbol: "{}", color: "#34d399", baseFreq: 440.00, type: "sine", pattern: ["{", "}", ":", "."] },
  { id: "arrays", name: "Arrays", symbol: "[]", color: "#fb923c", baseFreq: 493.88, type: "triangle", pattern: ["[", "]", "push", "filter"] },
];

const codeSnippets = [
  "const symphony = () => {",
  "  const notes = [];",
  "  for (let i = 0; i < 8; i++) {",
  "    if (i % 2 === 0) {",
  "      notes.push({ freq: 440 });",
  "    } else {",
  "      notes.push({ freq: 880 });",
  "    }",
  "  }",
  "  return notes.map(n => n.freq);",
  "};",
];

export function CodeSymphony() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [activeInstrument, setActiveInstrument] = useState<string | null>(null);
  const [bpm, setBpm] = useState(120);
  const [showParticles, setShowParticles] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playNote = useCallback((instrument: CodeInstrument, time: number) => {
    if (!audioContextRef.current || isMuted) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = instrument.type;
    oscillator.frequency.setValueAtTime(instrument.baseFreq, time);
    
    // Add some randomness to frequency for variety
    const detune = (Math.random() - 0.5) * 100;
    oscillator.detune.setValueAtTime(detune, time);

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(time);
    oscillator.stop(time + 0.5);

    // Create visual note
    const container = containerRef.current;
    if (container && showParticles) {
      const rect = container.getBoundingClientRect();
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height * 0.6 + rect.height * 0.2;
      
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        frequency: instrument.baseFreq,
        duration: 0.5,
        type: instrument.type,
        x,
        y,
        color: instrument.color,
        symbol: instrument.symbol,
      };
      
      setNotes(prev => [...prev.slice(-20), newNote]);
    }
  }, [volume, isMuted, showParticles]);

  const analyzeCode = useCallback((line: string) => {
    const detectedInstruments: CodeInstrument[] = [];
    
    instruments.forEach(inst => {
      inst.pattern.forEach(pattern => {
        if (line.includes(pattern)) {
          detectedInstruments.push(inst);
        }
      });
    });

    return detectedInstruments;
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    initAudio();
    const interval = (60 / bpm) * 1000;

    const playSequence = () => {
      const line = codeSnippets[currentLine];
      const detectedInstruments = analyzeCode(line);
      
      if (audioContextRef.current && detectedInstruments.length > 0) {
        const now = audioContextRef.current.currentTime;
        detectedInstruments.forEach((inst, i) => {
          playNote(inst, now + i * 0.1);
        });
      }

      setCurrentLine(prev => (prev + 1) % codeSnippets.length);
    };

    const timer = setInterval(playSequence, interval);
    return () => clearInterval(timer);
  }, [isPlaying, currentLine, bpm, analyzeCode, playNote, initAudio]);

  // Cleanup notes animation
  useEffect(() => {
    const cleanup = setInterval(() => {
      setNotes(prev => prev.filter(note => {
        const age = Date.now() - parseInt(note.id, 36);
        return age < 2000;
      }));
    }, 100);
    return () => clearInterval(cleanup);
  }, []);

  const handlePlay = () => {
    initAudio();
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentLine(0);
    setNotes([]);
  };

  const playInstrument = (instrument: CodeInstrument) => {
    initAudio();
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
    setActiveInstrument(instrument.id);
    playNote(instrument, audioContextRef.current!.currentTime);
    setTimeout(() => setActiveInstrument(null), 200);
  };

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-purple-950/5 to-background overflow-hidden">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 mb-6"
          >
            <Music className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Audio</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code{" "}
            <span className="text-gradient-animated">Symphony</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience code as music. Each syntax element plays a unique sound, 
            creating a symphony from programming patterns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div 
              ref={containerRef}
              className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 min-h-[400px] overflow-hidden"
            >
              {/* Background Effects */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
              </div>

              {/* Floating Notes */}
              <AnimatePresence>
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.5, 0.5],
                      y: -100,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute pointer-events-none"
                    style={{ left: note.x, top: note.y }}
                  >
                    <div 
                      className="text-2xl font-bold"
                      style={{ 
                        color: note.color,
                        textShadow: `0 0 20px ${note.color}`,
                      }}
                    >
                      {note.symbol}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Code Lines */}
              <div className="relative z-10 font-mono text-sm md:text-base space-y-2">
                {codeSnippets.map((line, index) => {
                  const isActive = index === currentLine;
                  const detectedInstruments = isActive ? analyzeCode(line) : [];
                  
                  return (
                    <motion.div
                      key={index}
                      animate={{
                        backgroundColor: isActive ? "rgba(139, 92, 246, 0.2)" : "transparent",
                        x: isActive ? 10 : 0,
                      }}
                      className="flex items-center gap-4 p-2 rounded-lg transition-colors"
                    >
                      <span className="text-slate-600 w-8 text-right select-none">
                        {index + 1}
                      </span>
                      <span className={`${isActive ? "text-purple-300" : "text-slate-400"}`}>
                        {line.split(/(\s+)/).map((part, i) => {
                          const instrument = instruments.find(inst => 
                            inst.pattern.some(p => part.includes(p))
                          );
                          return instrument ? (
                            <motion.span
                              key={i}
                              animate={isActive ? { 
                                color: [instrument.color, "#fff", instrument.color],
                              } : {}}
                              transition={{ duration: 0.5 }}
                              style={{ color: instrument.color }}
                              className="font-semibold"
                            >
                              {part}
                            </motion.span>
                          ) : (
                            <span key={i}>{part}</span>
                          );
                        })}
                      </span>
                      {detectedInstruments.map(inst => (
                        <motion.span
                          key={inst.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${inst.color}20`,
                            color: inst.color,
                          }}
                        >
                          ♪ {inst.name}
                        </motion.span>
                      ))}
                    </motion.div>
                  );
                })}
              </div>

              {/* Visualizer Bars */}
              <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-1 px-4 pb-4">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                    animate={{
                      height: isPlaying 
                        ? [20, Math.random() * 60 + 20, 20]
                        : 4,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
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
            {/* Playback Controls */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Playback
              </h3>
              
              <div className="flex items-center gap-2 mb-6">
                <Button
                  variant={isPlaying ? "default" : "outline"}
                  size="icon"
                  onClick={handlePlay}
                  className="h-12 w-12"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  className="h-12 w-12"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="h-12 w-12"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Tempo (BPM): {bpm}
                  </label>
                  <Slider
                    value={[bpm]}
                    onValueChange={([v]) => setBpm(v)}
                    min={60}
                    max={200}
                    step={10}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Volume: {Math.round(volume * 100)}%
                  </label>
                  <Slider
                    value={[volume * 100]}
                    onValueChange={([v]) => setVolume(v / 100)}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </div>

            {/* Instrument Palette */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Instruments
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {instruments.map((instrument) => (
                  <motion.button
                    key={instrument.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playInstrument(instrument)}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      activeInstrument === instrument.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-border hover:border-purple-500/50"
                    }`}
                  >
                    <div 
                      className="text-2xl mb-1"
                      style={{ color: instrument.color }}
                    >
                      {instrument.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {instrument.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60">
                      {instrument.baseFreq.toFixed(0)}Hz
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Click instruments to play manually</span>
              </p>
              <p className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-purple-500" />
                <span>Code elements trigger sounds automatically</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
