"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Minimize, Maximize, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "👋 Welcome to Nemo's terminal!\n\nI'm an AI assistant representing Nemo. Here are some commands you can try:\n\n• about - Learn about Nemo\n• skills - View technical skills\n• projects - See recent projects\n• contact - Get contact info\n• joke - Hear a programming joke\n• clear - Clear the terminal",
    timestamp: new Date(),
  },
];

const RESPONSES: Record<string, string> = {
  about: `Nemo is a creative developer with 7+ years of experience building digital products.

Specialties:
• Full-stack web development
• UI/UX design
• Performance optimization
• Technical architecture

Location: San Francisco, CA
Status: Available for freelance work`,
  skills: `Technical Skills:

Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion
Backend: Node.js, PostgreSQL, GraphQL, Redis
DevOps: Docker, AWS, Vercel, CI/CD
Design: Figma, Adobe XD, Design Systems`,
  projects: `Recent Projects:

1. E-Commerce Platform - Full-stack solution with Stripe
2. AI Analytics Dashboard - Real-time data visualization
3. Social Media App - React Native with Firebase
4. Design System - Component library with Storybook

Type 'project [name]' for more details.`,
  contact: `Contact Information:

📧 Email: hello@nemo.dev
📍 Location: San Francisco, CA
🌐 Website: nemo.dev

Social:
• GitHub: github.com/nemodev
• Twitter: twitter.com/nemodev
• LinkedIn: linkedin.com/in/nemodev`,
  joke: `Why do programmers prefer dark mode?

Because light attracts bugs! 🐛

(But seriously, this portfolio has both light and dark mode. Try the toggle!)`,
  "project ecommerce": `E-Commerce Platform:

A full-stack solution featuring:
• Real-time inventory management
• Stripe payment integration
• Admin dashboard with analytics
• Responsive design with Tailwind

Tech: Next.js, TypeScript, PostgreSQL, Stripe`,
  "project ai": `AI Analytics Dashboard:

Real-time data visualization with:
• AI-powered insights
• Predictive analytics
• Interactive D3.js charts
• Real-time data streaming

Tech: React, Python, TensorFlow, D3.js`,
};

export function TerminalWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Emit event when terminal is opened for easter egg tracking
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent("terminal-opened"));
    }
  }, [isOpen]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

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

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    const command = input.toLowerCase().trim();
    let response = "";

    if (command === "clear") {
      setMessages(INITIAL_MESSAGES);
      setIsTyping(false);
      return;
    }

    if (RESPONSES[command]) {
      response = RESPONSES[command];
    } else if (command.startsWith("project ")) {
      const projectName = command.replace("project ", "");
      if (projectName.includes("ecommerce") || projectName.includes("shop")) {
        response = RESPONSES["project ecommerce"];
      } else if (projectName.includes("ai") || projectName.includes("analytics")) {
        response = RESPONSES["project ai"];
      } else {
        response = `Project "${projectName}" not found. Try: ecommerce, ai, social, or design-system`;
      }
    } else {
      response = `Command not recognized: "${command}"\n\nTry: about, skills, projects, contact, joke, or clear`;
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        >
          <Terminal className="h-6 w-6" />
        </motion.button>
      )}

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "500px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  />
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
                  />
                  <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
                </div>
                <span className="ml-3 text-sm font-medium text-muted-foreground">
                  nemo@portfolio ~ terminal
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-secondary rounded transition-colors"
                >
                  {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-secondary rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="h-[380px] overflow-y-auto p-4 space-y-4 font-mono text-sm">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: i * 0.2,
                              }}
                              className="w-2 h-2 rounded-full bg-muted-foreground"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border bg-muted/50">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground self-center">$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a command..."
                      className="flex-1 bg-transparent border-none outline-none text-sm font-mono"
                    />
                    <Button
                      size="sm"
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="px-3"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
