"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Command, 
  Sparkles,
  Home,
  User,
  Folder,
  Mail,
  Palette,
  Gamepad2,
  Terminal,
  Code2,
  BookOpen,
  Trophy,
  Settings,
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Voice commands configuration
interface VoiceCommand {
  id: string;
  phrases: string[];
  action: () => void;
  icon: React.ReactNode;
  description: string;
  category: "navigation" | "action" | "easter";
}

export function VoiceInterface() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);

  // Define voice commands
  const commands: VoiceCommand[] = [
    {
      id: "home",
      phrases: ["go home", "home page", "take me home", "main page"],
      action: () => navigateTo("/"),
      icon: <Home className="w-4 h-4" />,
      description: "Go to homepage",
      category: "navigation"
    },
    {
      id: "about",
      phrases: ["about", "who are you", "tell me about yourself", "about page"],
      action: () => navigateTo("/about"),
      icon: <User className="w-4 h-4" />,
      description: "View about page",
      category: "navigation"
    },
    {
      id: "projects",
      phrases: ["projects", "show projects", "my work", "portfolio"],
      action: () => navigateTo("/projects"),
      icon: <Folder className="w-4 h-4" />,
      description: "View projects",
      category: "navigation"
    },
    {
      id: "contact",
      phrases: ["contact", "get in touch", "email", "hire me"],
      action: () => navigateTo("/contact"),
      icon: <Mail className="w-4 h-4" />,
      description: "Contact page",
      category: "navigation"
    },
    {
      id: "art",
      phrases: ["art gallery", "show art", "creative coding", "generative art"],
      action: () => navigateTo("/art-gallery"),
      icon: <Palette className="w-4 h-4" />,
      description: "View art gallery",
      category: "navigation"
    },
    {
      id: "games",
      phrases: ["games", "play games", "mini games", "fun zone"],
      action: () => navigateTo("/games"),
      icon: <Gamepad2 className="w-4 h-4" />,
      description: "Play mini games",
      category: "navigation"
    },
    {
      id: "matrix",
      phrases: ["matrix", "matrix rain", "enter the matrix", "digital rain"],
      action: () => navigateTo("/matrix-rain"),
      icon: <Terminal className="w-4 h-4" />,
      description: "Enter the Matrix",
      category: "navigation"
    },
    {
      id: "blog",
      phrases: ["blog", "read blog", "articles", "writing"],
      action: () => navigateTo("/blog"),
      icon: <BookOpen className="w-4 h-4" />,
      description: "Read blog posts",
      category: "navigation"
    },
    {
      id: "achievements",
      phrases: ["achievements", "trophies", "badges", "my progress"],
      action: () => navigateTo("/achievements"),
      icon: <Trophy className="w-4 h-4" />,
      description: "View achievements",
      category: "navigation"
    },
    {
      id: "secret",
      phrases: ["open sesame", "secret mode", "developer mode", "admin access"],
      action: () => activateSecretMode(),
      icon: <Code2 className="w-4 h-4" />,
      description: "???",
      category: "easter"
    },
    {
      id: "help",
      phrases: ["help", "what can you do", "commands", "voice commands"],
      action: () => setShowHelp(true),
      icon: <Command className="w-4 h-4" />,
      description: "Show voice commands",
      category: "action"
    },
    {
      id: "scroll",
      phrases: ["scroll down", "go down", "next section"],
      action: () => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' }),
      icon: <ChevronRight className="w-4 h-4 rotate-90" />,
      description: "Scroll down",
      category: "action"
    },
    {
      id: "top",
      phrases: ["scroll up", "go up", "back to top", "top of page"],
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      icon: <ChevronRight className="w-4 h-4 -rotate-90" />,
      description: "Back to top",
      category: "action"
    },
  ];

  const navigateTo = (path: string) => {
    window.location.href = path;
    toast.success(`Navigating to ${path === "/" ? "home" : path.slice(1)}...`);
  };

  const activateSecretMode = () => {
    toast.success("🎉 Secret mode activated!", {
      description: "You've unlocked something special..."
    });
    // Trigger confetti or special effect
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('secret-mode-activated'));
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.toLowerCase().trim();
      setTranscript(transcript);

      if (event.results[current].isFinal) {
        processCommand(transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error("Microphone access denied");
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  // Process voice command
  const processCommand = useCallback((transcript: string) => {
    for (const command of commands) {
      for (const phrase of command.phrases) {
        if (transcript.includes(phrase)) {
          setLastCommand(command.id);
          command.action();
          
          // Visual feedback
          toast.success(`Command: "${phrase}"`, {
            icon: command.icon,
          });
          
          setTimeout(() => setLastCommand(null), 2000);
          return;
        }
      }
    }
    
    // No command matched
    if (transcript.length > 3) {
      toast.info(`I heard: "${transcript}"`, {
        description: "Try saying 'help' for available commands"
      });
    }
  }, [commands]);

  // Toggle listening
  const toggleListening = async () => {
    if (!isSupported) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      stopAudioVisualization();
    } else {
      try {
        await recognitionRef.current?.start();
        setIsListening(true);
        startAudioVisualization();
        toast.success("Voice control activated! Try saying 'help'");
      } catch {
        toast.error("Could not start voice recognition");
      }
    }
  };

  // Audio visualization
  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      
      updateLevel();
    } catch {
      // Microphone not available, continue without visualization
    }
  };

  const stopAudioVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevel(0);
  };

  useEffect(() => {
    return () => {
      stopAudioVisualization();
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Voice Control Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 right-6 z-50"
      >
        <motion.button
          onClick={toggleListening}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
            isListening
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          }`}
        >
          {/* Audio level rings */}
          {isListening && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  animate={{
                    scale: [1, 1.5 + audioLevel * 0.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 1 + i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </>
          )}
          
          {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </motion.button>

        {/* Status indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="glass-strong px-4 py-2 rounded-full flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-sm font-medium">Listening...{transcript && ` "${transcript}"`}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Voice Commands</h3>
                    <p className="text-sm text-muted-foreground">Say these phrases to navigate</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHelp(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {["navigation", "action", "easter"].map((category) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {commands
                        .filter((cmd) => cmd.category === category)
                        .map((command) => (
                          <motion.div
                            key={command.id}
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="text-muted-foreground">{command.icon}</div>
                            <div className="flex-1">
                              <p className="font-medium">{command.description}</p>
                              <p className="text-xs text-muted-foreground">
                                "{command.phrases[0]}"
                              </p>
                            </div>
                            {command.category === "easter" && (
                              <Badge variant="secondary" className="text-xs">Secret</Badge>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-sm">Pro Tip</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Try saying "open sesame" for a surprise! Voice commands work best in a quiet environment.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last command indicator */}
      <AnimatePresence>
        {lastCommand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-40 right-6 z-50"
          >
            <div className="glass-strong px-4 py-2 rounded-full flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Command executed!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
