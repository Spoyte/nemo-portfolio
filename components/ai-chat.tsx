"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  X,
  MessageCircle,
  Loader2,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import confetti from "canvas-confetti";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "👋 Hi there! I'm Nemo's AI assistant. I can tell you about their skills, experience, projects, or help you get in touch. What would you like to know?",
    timestamp: new Date(),
  },
];

const KNOWLEDGE_BASE: Record<string, string> = {
  "skills": "Nemo is a full-stack developer with expertise in React, Next.js, TypeScript, Node.js, and modern web technologies. They also have strong UI/UX design skills and experience with cloud platforms like AWS.",
  "experience": "Nemo has over 7 years of experience in web development, working with startups and established companies. They've led teams, architected scalable solutions, and delivered 50+ projects.",
  "projects": "Nemo has worked on various projects including e-commerce platforms, SaaS applications, design systems, and mobile apps. Check out the Projects page for detailed case studies!",
  "contact": "You can reach Nemo through the contact form on this website, or email directly at hello@nemo.dev. They're currently available for freelance work and open to new opportunities!",
  "availability": "Nemo is currently available for new projects! They're accepting work for Q1 2025. Response time is usually within 24 hours.",
  "rate": "Nemo's rates vary depending on project scope and duration. The best way to get an accurate quote is to reach out through the contact form with your project details.",
  "location": "Nemo is based in San Francisco, CA, but works with clients worldwide. They're experienced with remote collaboration across different time zones.",
  "tech stack": "Nemo primarily works with React, Next.js, TypeScript, Tailwind CSS, Node.js, PostgreSQL, and various cloud services. They're always learning new technologies too!",
  "design": "Yes, Nemo does UI/UX design! They believe in creating beautiful, functional interfaces that provide great user experiences. Check out their design work in the portfolio.",
  "hello": "Hello! 👋 How can I help you learn more about Nemo today?",
  "hi": "Hi there! What would you like to know about Nemo?",
  "hey": "Hey! I'm here to answer questions about Nemo's work and experience. What can I help you with?",
  "help": "I can tell you about Nemo's skills, experience, projects, availability, rates, or how to contact them. What are you interested in?",
};

const SUGGESTIONS = [
  "What are your skills?",
  "Tell me about your experience",
  "Are you available for work?",
  "How can I contact you?",
  "What's your tech stack?",
];

function getResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  // Check for exact matches first
  for (const [key, response] of Object.entries(KNOWLEDGE_BASE)) {
    if (lowerInput.includes(key)) {
      return response;
    }
  }

  // Check for common variations
  if (lowerInput.includes("work") || lowerInput.includes("job") || lowerInput.includes("hire")) {
    return KNOWLEDGE_BASE["availability"];
  }
  if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("pricing")) {
    return KNOWLEDGE_BASE["rate"];
  }
  if (lowerInput.includes("email") || lowerInput.includes("reach") || lowerInput.includes("talk")) {
    return KNOWLEDGE_BASE["contact"];
  }
  if (lowerInput.includes("where") || lowerInput.includes("based")) {
    return KNOWLEDGE_BASE["location"];
  }
  if (lowerInput.includes("react") || lowerInput.includes("next") || lowerInput.includes("typescript")) {
    return KNOWLEDGE_BASE["tech stack"];
  }

  // Default responses
  const defaults = [
    "That's interesting! I'd recommend checking out the About page for more details, or you can contact Nemo directly through the contact form.",
    "Great question! Feel free to reach out through the contact form for a more detailed discussion about that.",
    "I'd love to help more with that! The best way to get specific information is to send a message through the contact page.",
  ];
  
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setShowSuggestions(false);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.9, x: 0.95 },
            colors: ["#dc2626", "#ea580c", "#f59e0b"],
          });
        }}
        className="fixed bottom-24 left-6 z-40 p-4 rounded-full bg-gradient-to-r from-primary to-orange-500 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="relative">
          <MessageCircle className="h-6 w-6" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background"
          />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            />

            {/* Chat Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-36 left-6 z-50 w-full max-w-sm"
            >
              <Card className="shadow-2xl border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-orange-500/10 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">AI Assistant</CardTitle>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs text-muted-foreground">Online</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Messages */}
                  <div className="h-80 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex gap-3 ${
                          message.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar className="w-8 h-8 shrink-0">
                          {message.role === "assistant" ? (
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          ) : (
                            <AvatarFallback className="bg-muted">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          )}
                        </Avatar>

                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                      >
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.6,
                                  delay: i * 0.1,
                                }}
                                className="w-2 h-2 rounded-full bg-muted-foreground"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && messages.length === 1 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-2"
                      >
                        <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
                        <div className="flex flex-wrap gap-2">
                          {SUGGESTIONS.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-left"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
