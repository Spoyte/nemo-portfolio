"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap,
  Code2,
  Palette,
  Briefcase,
  Mail,
  Clock,
  MapPin,
  Coffee,
  Music,
  Heart,
  X,
  Minimize2,
  Maximize2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickReplies = [
  { icon: Briefcase, label: "Projects", query: "Tell me about your projects" },
  { icon: Code2, label: "Skills", query: "What technologies do you use?" },
  { icon: Mail, label: "Contact", query: "How can I contact you?" },
  { icon: Clock, label: "Availability", query: "Are you available for work?" },
];

const knowledgeBase = {
  greeting: [
    "Hey there! 👋 I'm Nemo's AI assistant. How can I help you today?",
    "Hello! Welcome to my portfolio. What would you like to know?",
    "Hi! I'm here to answer questions about Nemo's work and experience.",
  ],
  projects: [
    "Nemo has worked on various projects including e-commerce platforms, AI analytics dashboards, and social media applications. Check out the Projects page for detailed case studies!",
    "Some notable projects include a design system with 200+ components, a real-time chat application, and a portfolio CMS. Each project showcases different skills and technologies.",
  ],
  skills: [
    "Nemo specializes in React, TypeScript, Next.js, and Node.js. They're also experienced with PostgreSQL, GraphQL, Docker, and various cloud platforms.",
    "The tech stack includes modern frontend frameworks (React, Vue), backend technologies (Node, Python), databases (PostgreSQL, MongoDB), and DevOps tools (Docker, AWS, Vercel).",
  ],
  contact: [
    "You can reach Nemo via email at hello@nemo.dev or through the contact form on this site. They're also active on Twitter, LinkedIn, and GitHub!",
    "The best way to get in touch is through the contact page or by emailing hello@nemo.dev. Response time is usually within 24 hours.",
  ],
  availability: [
    "Nemo is currently available for freelance work and open to new opportunities! Feel free to reach out to discuss your project.",
    "Yes, Nemo is taking on new projects! Whether it's a full application, website redesign, or consultation, they'd love to hear about it.",
  ],
  about: [
    "Nemo is a creative developer based in San Francisco with 7+ years of experience. They love combining code with design to create unique digital experiences.",
    "A passionate developer who started coding in 2017. Nemo believes in clean code, thoughtful design, and user-centered development.",
  ],
  fun: [
    "Fun fact: This portfolio has hidden easter eggs and a secret terminal! Can you find them? 🕵️",
    "Did you know? There's a Konami code easter egg somewhere on this site. Try the classic ↑↑↓↓←→←→BA!",
    "Nemo loves coffee, jazz music, and indie games. The 'Now' page shows what they're currently up to!",
  ],
  default: [
    "That's an interesting question! I'd recommend checking out the relevant page on this portfolio for more detailed information.",
    "Great question! Feel free to explore the site or use the contact form to get in touch with Nemo directly.",
    "I'm not sure about that specific question, but Nemo would be happy to chat! Try reaching out through the contact page.",
  ],
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.match(/hi|hello|hey|greetings/)) {
    return randomResponse(knowledgeBase.greeting);
  }
  if (lower.match(/project|work|portfolio|case study/)) {
    return randomResponse(knowledgeBase.projects);
  }
  if (lower.match(/skill|tech|stack|technology|language|framework/)) {
    return randomResponse(knowledgeBase.skills);
  }
  if (lower.match(/contact|email|reach|message/)) {
    return randomResponse(knowledgeBase.contact);
  }
  if (lower.match(/available|hire|freelance|job|opportunity/)) {
    return randomResponse(knowledgeBase.availability);
  }
  if (lower.match(/about|who|background|experience/)) {
    return randomResponse(knowledgeBase.about);
  }
  if (lower.match(/fun|joke|easter|secret|game/)) {
    return randomResponse(knowledgeBase.fun);
  }
  
  return randomResponse(knowledgeBase.default);
}

function randomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Add AI response
    const aiMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: getResponse(content),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const startChat = () => {
    setHasStarted(true);
    const greeting: Message = {
      id: generateId(),
      role: "assistant",
      content: randomResponse(knowledgeBase.greeting),
      timestamp: new Date(),
    };
    setMessages([greeting]);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-card border rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with AI
        </span>
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
      className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-card border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 bg-primary">
              <AvatarFallback>
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Nemo AI</h4>
            <p className="text-xs text-muted-foreground">Online • Ready to help</p>
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
          {!hasStarted ? (
            /* Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-4"
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">Meet Nemo AI</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Your personal guide to this portfolio. Ask about projects, skills, or just say hi!
              </p>
              <Button onClick={startChat} className="gap-2">
                <Zap className="w-4 h-4" />
                Start Conversation
              </Button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar className={`w-8 h-8 shrink-0 ${
                        message.role === "assistant" ? "bg-primary" : "bg-muted"
                      }`}>
                        <AvatarFallback>
                          {message.role === "assistant" ? (
                            <Bot className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        message.role === "assistant"
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      }`}>
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
                      <Avatar className="w-8 h-8 bg-primary">
                        <AvatarFallback>
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Replies */}
              {messages.length < 3 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => {
                      const Icon = reply.icon;
                      return (
                        <Button
                          key={reply.label}
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => sendMessage(reply.query)}
                        >
                          <Icon className="w-3 h-3" />
                          {reply.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </motion.div>
  );
}
