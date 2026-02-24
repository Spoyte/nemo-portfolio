"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2,
  Loader2,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What technologies do you specialize in?",
  "Tell me about your experience",
  "What projects have you worked on?",
  "Are you available for hire?",
  "What's your design philosophy?",
];

const AI_RESPONSES: Record<string, string> = {
  "technologies": "I specialize in modern web technologies including React, Next.js, TypeScript, and Tailwind CSS. I'm also experienced with Node.js, PostgreSQL, GraphQL, and various cloud platforms like AWS and Vercel. I love staying current with the latest tools and best practices!",
  "experience": "I have over 7 years of experience in web development, ranging from frontend-focused roles to full-stack positions. I've worked with startups, agencies, and enterprise companies, giving me a well-rounded perspective on building scalable applications.",
  "projects": "I've built everything from e-commerce platforms to SaaS applications, interactive data visualizations to AI-powered tools. Check out the Projects page for detailed case studies of my recent work!",
  "hire": "I'm currently open to freelance opportunities and full-time positions! I'm particularly interested in roles that involve creative problem-solving, modern tech stacks, and collaborative teams. Feel free to reach out through the contact form.",
  "design": "I believe in functional beauty — design should serve the user first, but that doesn't mean it can't be beautiful. I'm inspired by minimalism, thoughtful micro-interactions, and creating experiences that feel intuitive and delightful.",
  "default": "That's an interesting question! I'd love to discuss this further. Feel free to reach out through the contact form for a more detailed conversation, or explore my portfolio to learn more about my work.",
};

function generateResponse(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.includes("tech") || lower.includes("stack") || lower.includes("skill")) {
    return AI_RESPONSES.technologies;
  }
  if (lower.includes("experience") || lower.includes("background") || lower.includes("work")) {
    return AI_RESPONSES.experience;
  }
  if (lower.includes("project") || lower.includes("portfolio") || lower.includes("built")) {
    return AI_RESPONSES.projects;
  }
  if (lower.includes("hire") || lower.includes("job") || lower.includes("work with") || lower.includes("available")) {
    return AI_RESPONSES.hire;
  }
  if (lower.includes("design") || lower.includes("philosophy") || lower.includes("approach")) {
    return AI_RESPONSES.design;
  }
  
  return AI_RESPONSES.default;
}

export function AIChatEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm Nemo's AI assistant. I can answer questions about their work, experience, and availability. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hi there! I'm Nemo's AI assistant. I can answer questions about their work, experience, and availability. What would you like to know?",
        timestamp: new Date(),
      },
    ]);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      >
        <Bot className="h-6 w-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        height: isMinimized ? "auto" : "500px",
      }}
      className="fixed bottom-6 right-6 z-50 w-80 md:w-96"
    >
      <Card className="h-full flex flex-col shadow-2xl border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
            </div>
            <div>
              <CardTitle className="text-sm">Nemo AI</CardTitle>
              <p className="text-xs text-muted-foreground">Always online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 relative group ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] opacity-60">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: "2-digit", 
                              minute: "2-digit" 
                            })}
                          </span>
                          {message.role === "assistant" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => copyMessage(message.content, message.id)}
                            >
                              {copiedId === message.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-2xl rounded-bl-md p-3">
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-xs text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Suggested Questions */}
                {messages.length === 1 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.map((question) => (
                        <Button
                          key={question}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setInput(question);
                          }}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>

              <CardContent className="p-4 border-t shrink-0">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-[10px] text-muted-foreground">
                    AI-powered responses
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px]"
                    onClick={clearChat}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
