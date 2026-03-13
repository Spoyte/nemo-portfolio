"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Zap,
  Bell,
  Gamepad2,
  Keyboard,
  MousePointer,
  Check,
  Copy,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

// Sound effects using Web Audio API
const createOscillator = (frequency: number, type: OscillatorType, duration: number) => {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const sounds = {
  success: () => createOscillator(880, "sine", 0.15),
  error: () => createOscillator(220, "sawtooth", 0.2),
  click: () => createOscillator(440, "sine", 0.05),
  hover: () => createOscillator(660, "sine", 0.03),
  notification: () => {
    createOscillator(523.25, "sine", 0.1);
    setTimeout(() => createOscillator(659.25, "sine", 0.1), 100);
    setTimeout(() => createOscillator(783.99, "sine", 0.2), 200);
  },
  achievement: () => {
    createOscillator(523.25, "sine", 0.1);
    setTimeout(() => createOscillator(659.25, "sine", 0.1), 100);
    setTimeout(() => createOscillator(783.99, "sine", 0.1), 200);
    setTimeout(() => createOscillator(1046.50, "sine", 0.3), 300);
  },
  type: () => createOscillator(800 + Math.random() * 200, "sine", 0.02),
  coin: () => {
    createOscillator(987.77, "sine", 0.1);
    setTimeout(() => createOscillator(1318.51, "sine", 0.2), 50);
  },
  powerup: () => {
    createOscillator(440, "sawtooth", 0.1);
    setTimeout(() => createOscillator(554.37, "sawtooth", 0.1), 100);
    setTimeout(() => createOscillator(659.25, "sawtooth", 0.1), 200);
    setTimeout(() => createOscillator(880, "sawtooth", 0.3), 300);
  }
};

// Developer jokes
const devJokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "Why do Java developers wear glasses? Because they don't C#!",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
  "Why was the function sad? It didn't get any calls back!",
  "What's a programmer's favorite hangout place? The Foo Bar!",
  "Why did the developer go broke? Because he used up all his cache!",
  "What's the object-oriented way to become wealthy? Inheritance!",
  "Why did the programmer quit his job? Because he didn't get arrays!",
  "A programmer's wife tells him: 'Run to the store and pick up a loaf of bread. If they have eggs, get a dozen.' The programmer comes home with 12 loaves of bread.",
  "Why do Python programmers prefer snakes? Because they don't have to worry about brackets!",
  "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
  "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings!",
  "How do you comfort a JavaScript bug? You console it!",
  "Why did the CSS developer go to therapy? Because he had too many issues with his parents!",
  "What's a pirate's favorite programming language? R!",
  "Why don't programmers like nature? It has too many bugs!",
  "What's a computer's favorite snack? Microchips!",
  "Why did the CSS file break up with the HTML file? Because it wanted more space!",
  "What do you call a programmer from Finland? Nerdic!"
];

// Programming quotes
const devQuotes = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" }
];

export default function SoundboardPage() {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [currentJoke, setCurrentJoke] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showJoke, setShowJoke] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  const playSound = (soundName: keyof typeof sounds) => {
    if (isMuted) return;
    sounds[soundName]();
    setLastPlayed(soundName);
  };

  const nextJoke = () => {
    setShowJoke(false);
    setTimeout(() => {
      setCurrentJoke((prev) => (prev + 1) % devJokes.length);
      setShowJoke(true);
      playSound("success");
    }, 200);
  };

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % devQuotes.length);
    playSound("notification");
  };

  const copyJoke = () => {
    navigator.clipboard.writeText(devJokes[currentJoke]);
    setCopied(true);
    playSound("coin");
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setShowJoke(true);
  }, []);

  const soundButtons = [
    { name: "success", label: "Success", icon: Check, color: "bg-green-500" },
    { name: "error", label: "Error", icon: VolumeX, color: "bg-red-500" },
    { name: "click", label: "Click", icon: MousePointer, color: "bg-blue-500" },
    { name: "hover", label: "Hover", icon: Zap, color: "bg-yellow-500" },
    { name: "notification", label: "Notification", icon: Bell, color: "bg-purple-500" },
    { name: "achievement", label: "Achievement", icon: Sparkles, color: "bg-pink-500" },
    { name: "type", label: "Type", icon: Keyboard, color: "bg-cyan-500" },
    { name: "coin", label: "Coin", icon: Music, color: "bg-amber-500" },
    { name: "powerup", label: "Power Up", icon: Gamepad2, color: "bg-indigo-500" },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive Audio</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Dev{" "}
            <span className="text-gradient-animated">Soundboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of classic developer sound effects, jokes, and wisdom.
          </p>
        </motion.div>

        {/* Volume Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div className="w-48">
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={(value) => {
                setVolume(value[0]);
                setIsMuted(false);
              }}
              min={0}
              max={100}
              step={1}
            />
          </div>
          <span className="text-sm text-muted-foreground w-12">{isMuted ? 0 : volume}%</span>
        </motion.div>

        {/* Soundboard Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12"
        >
          {soundButtons.map((sound, index) => {
            const Icon = sound.icon;
            return (
              <motion.button
                key={sound.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playSound(sound.name as keyof typeof sounds)}
                className={`p-6 rounded-2xl ${sound.color} text-white font-semibold transition-all relative overflow-hidden group`}
              >
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <Icon className="w-8 h-8" />
                  <span>{sound.label}</span>
                </div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {lastPlayed === sound.name && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Dev Jokes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Dev Joke #{currentJoke + 1}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyJoke}>
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button size="sm" onClick={nextJoke}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Next Joke
                </Button>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {showJoke && (
                <motion.p
                  key={currentJoke}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-lg text-center py-4"
                >
                  {devJokes[currentJoke]}
                </motion.p>
              )}
            </AnimatePresence>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              {currentJoke + 1} / {devJokes.length} jokes
            </p>
          </div>
        </motion.div>

        {/* Dev Quotes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold">Wisdom</h2>
              </div>
              <Button variant="outline" size="sm" onClick={nextQuote}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Next Quote
              </Button>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={currentQuote}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-4"
              >
                <p className="text-xl italic mb-4">"{devQuotes[currentQuote].text}"</p>
                <footer className="text-muted-foreground">
                  — {devQuotes[currentQuote].author}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              {currentQuote + 1} / {devQuotes.length} quotes
            </p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          🔊 All sounds are generated in real-time using the Web Audio API
        </motion.p>
      </div>
    </div>
  );
}
