"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Sparkles,
  Bot,
  User,
  Send,
  X,
  Minimize2,
  Maximize2,
  Settings,
  Zap,
  Code2,
  Lightbulb,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface VoiceWaveProps {
  isActive: boolean;
}

function VoiceWave({ isActive }: VoiceWaveProps) {
  return (
    <div className="flex items-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary rounded-full"
          animate={{
            height: isActive ? [8, 24, 8] : 8,
            opacity: isActive ? 1 : 0.3,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

const quickPrompts = [
  { icon: Code2, text: "Explain this code", color: "text-blue-500" },
  { icon: Lightbulb, text: "Give me ideas", color: "text-yellow-500" },
  { icon: Zap, text: "Optimize my code", color: "text-purple-500" },
  { icon: HelpCircle, text: "How do I...", color: "text-green-500" },
];

const sampleResponses: Record<string, string> = {
  "explain this code": "I'd be happy to explain! This appears to be a React component that uses the useState hook to manage local state. The component renders a counter with increment and decrement buttons. The state is initialized to 0 and updates when the buttons are clicked.",
  "give me ideas": "Here are some project ideas:\n\n1. **AI Code Reviewer** - Analyze code for best practices\n2. **Interactive Learning Platform** - Gamified coding tutorials\n3. **Developer Portfolio Generator** - AI-powered portfolio creation\n4. **Code Collaboration Tool** - Real-time pair programming\n5. **API Testing Dashboard** - Visual REST client",
  "optimize my code": "To optimize this code, consider:\n\n1. **Memoization** - Use useMemo for expensive calculations\n2. **Virtualization** - For long lists, use react-window\n3. **Code Splitting** - Lazy load heavy components\n4. **Debouncing** - For search inputs and resize handlers\n5. **State Colocation** - Keep state close to where it's used",
  "how do i": "I can help with that! Could you be more specific about what you're trying to achieve? For example:\n\n- How do I implement authentication?\n- How do I connect to a database?\n- How do I deploy my app?\n- How do I optimize performance?",
};

export function AICompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI coding companion. I can help explain code, suggest improvements, brainstorm ideas, or just chat about development. Try speaking or typing below!",
      timestamp: new Date(),
      suggestions: ["Explain this code", "Give me ideas", "Optimize my code"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = "That's an interesting question! Let me think about that...";
      
      for (const [key, value] of Object.entries(sampleResponses)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }

      // Add some context-aware responses
      if (lowerInput.includes("react")) {
        response = "React is a powerful library for building user interfaces! It uses a component-based architecture and virtual DOM for efficient updates. Would you like to know about hooks, patterns, or best practices?";
      } else if (lowerInput.includes("typescript")) {
        response = "TypeScript adds static typing to JavaScript, catching errors at compile time. It provides better IDE support, easier refactoring, and self-documenting code. Key features include interfaces, generics, and type inference.";
      } else if (lowerInput.includes("portfolio")) {
        response = "This portfolio showcases interactive elements, generative art, and modern web technologies. It uses Next.js, Tailwind CSS, Framer Motion, and custom canvas animations. The goal is to demonstrate both technical skills and creativity!";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        suggestions: ["Tell me more", "Show me an example", "How does it work?"],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // Auto-speak the response
      if (isSpeaking) {
        speak(response);
      }
    }, 1500);
  };

  const handleQuickPrompt = (text: string) => {
    setInput(text);
    setTimeout(() => handleSend(), 100);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Bot className="w-6 h-6" />
        </motion.div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: isMinimized ? "auto" : "600px",
        }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-96 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-orange-500/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-full bg-primary text-primary-foreground">
                <Bot className="w-4 h-4" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Companion</h3>
              <p className="text-xs text-muted-foreground">
                {isTyping ? "Thinking..." : "Ready to help"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full shrink-0 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`space-y-2 max-w-[80%] ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}>
                    <div
                      className={`p-3 rounded-2xl text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted rounded-tl-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleQuickPrompt(suggestion)}
                            className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="p-2 rounded-full bg-muted">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1 p-3 rounded-2xl bg-muted rounded-tl-sm">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-border">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.text}
                    onClick={() => handleQuickPrompt(prompt.text)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm whitespace-nowrap"
                  >
                    <prompt.icon className={`w-3.5 h-3.5 ${prompt.color}`} />
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`shrink-0 ${isListening ? "text-red-500" : ""}`}
                  onClick={toggleListening}
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type or speak your message..."
                    className="w-full px-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {isListening && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <VoiceWave isActive={true} />
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={isSpeaking ? "text-primary" : ""}
                  onClick={() => setIsSpeaking(!isSpeaking)}
                >
                  {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  size="icon"
                  className="shrink-0"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
