"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Command, 
  Search, 
  Home, 
  User, 
  Briefcase, 
  Mail,
  FileText,
  Sparkles,
  Zap,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from "lucide-react";
import { toast } from "sonner";

interface VoiceCommand {
  phrase: string;
  action: string;
  icon: React.ReactNode;
  handler: () => void;
}

export function VoiceNavigation() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simulated voice commands (in a real app, this would use Web Speech API)
  const commands: VoiceCommand[] = [
    {
      phrase: "go home",
      action: "Navigate to Home",
      icon: <Home className="w-4 h-4" />,
      handler: () => {
        window.location.href = "/";
        speak("Navigating to home page");
      },
    },
    {
      phrase: "show projects",
      action: "View Projects",
      icon: <Briefcase className="w-4 h-4" />,
      handler: () => {
        window.location.href = "/projects/";
        speak("Showing projects");
      },
    },
    {
      phrase: "about me",
      action: "View About",
      icon: <User className="w-4 h-4" />,
      handler: () => {
        window.location.href = "/about/";
        speak("Opening about page");
      },
    },
    {
      phrase: "contact",
      action: "Open Contact",
      icon: <Mail className="w-4 h-4" />,
      handler: () => {
        window.location.href = "/contact/";
        speak("Opening contact page");
      },
    },
    {
      phrase: "read blog",
      action: "View Blog",
      icon: <FileText className="w-4 h-4" />,
      handler: () => {
        window.location.href = "/blog/";
        speak("Opening blog");
      },
    },
    {
      phrase: "dark mode",
      action: "Toggle Dark Mode",
      icon: <Moon className="w-4 h-4" />,
      handler: () => {
        document.documentElement.classList.toggle("dark");
        speak("Toggling dark mode");
      },
    },
    {
      phrase: "light mode",
      action: "Toggle Light Mode",
      icon: <Sun className="w-4 h-4" />,
      handler: () => {
        document.documentElement.classList.remove("dark");
        speak("Switching to light mode");
      },
    },
    {
      phrase: "what can you do",
      action: "Show Commands",
      icon: <Command className="w-4 h-4" />,
      handler: () => {
        setShowCommands(true);
        speak("Here are the available voice commands");
      },
    },
  ];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Simulate voice recognition
  useEffect(() => {
    if (!isListening) return;

    // In a real app, this would use the Web Speech API
    const timer = setTimeout(() => {
      // Simulate recognizing a command
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      setTranscript(randomCommand.phrase);
      
      setTimeout(() => {
        randomCommand.handler();
        setLastCommand(randomCommand.action);
        setIsListening(false);
        setTranscript("");
      }, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setTranscript("");
    } else {
      setIsListening(true);
      toast.info("Listening... Try saying a command!");
    }
  };

  return (
    <>
      {/* Floating Voice Button */}
      <motion.div
        className="fixed bottom-24 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <Button
          size="lg"
          className={`rounded-full w-14 h-14 shadow-lg ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-primary hover:bg-primary/90'
          }`}
          onClick={toggleListening}
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>

        {/* Listening Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-4 right-0"
            >
              <Card className="w-64">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
                    </div>
                    <span className="text-sm font-medium">Listening...</span>
                  </div>
                  
                  {transcript && (
                    <p className="text-sm text-muted-foreground mt-2">
                      "{transcript}"
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Voice Commands Modal */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCommands(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Command className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Voice Commands</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Say these phrases to navigate
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  {commands.map((cmd) => (
                    <div
                      key={cmd.phrase}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => {
                        cmd.handler();
                        setShowCommands(false);
                      }}
                    >
                      <div className="p-2 rounded-md bg-muted">{cmd.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium">"{cmd.phrase}"</p>
                        <p className="text-sm text-muted-foreground">{cmd.action}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last Command Toast */}
      <AnimatePresence>
        {lastCommand && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40"
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Zap className="w-3 h-3 inline mr-2" />
              {lastCommand}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
