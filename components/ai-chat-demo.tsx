"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2,
  MessageSquare,
  Zap,
  Code2,
  Palette,
  Lightbulb,
  Wrench,
  HelpCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Suggestion {
  icon: React.ElementType;
  label: string;
  prompt: string;
}

const suggestions: Suggestion[] = [
  { icon: Code2, label: "Tech Stack", prompt: "What technologies do you use?" },
  { icon: Palette, label: "Design Process", prompt: "Tell me about your design approach" },
  { icon: Wrench, label: "Services", prompt: "What services do you offer?" },
  { icon: Lightbulb, label: "Project Ideas", prompt: "What kind of projects interest you?" },
];

const responses: Record<string, string> = {
  "what technologies do you use": "I specialize in modern web technologies including React, Next.js, TypeScript, and Tailwind CSS. For backend work, I use Node.js, PostgreSQL, and various cloud services. I also love experimenting with creative coding using Canvas, WebGL, and generative art!",
  
  "tell me about your design approach": "I believe in user-centered design that balances aesthetics with functionality. My process involves research, wireframing, prototyping, and iterative testing. I'm particularly interested in micro-interactions, smooth animations, and creating delightful user experiences.",
  
  "what services do you offer": "I offer full-stack web development, UI/UX design, technical consulting, and creative coding projects. Whether you need a sleek portfolio, a complex web application, or something uniquely artistic, I'm here to help bring your vision to life!",
  
  "what kind of projects interest you": "I'm drawn to projects that challenge me creatively and technically. Interactive experiences, data visualizations, generative art, and tools that make developers' lives easier are my sweet spots. I also love contributing to open source!",
  
  "default": "That's an interesting question! I'd love to discuss this further. Feel free to reach out through the contact form for a more detailed conversation about this topic."
};

function getResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  for (const [key, value] of Object.entries(responses)) {
    if (key !== "default" && lowerInput.includes(key)) {
      return value;
    }
  }
  
  return responses.default;
}

export function AIChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm Nemo's AI assistant. I can tell you about their skills, experience, and interests. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

    // Simulate AI thinking
    setTimeout(() => {
      const response = getResponse(userMessage.content);
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

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:bottom-24 md:right-6 md:w-[400px] md:h-[600px] z-50"
            >
              <Card className="h-full flex flex-col overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">AI Assistant</CardTitle>
                      <p className="text-xs text-muted-foreground">Powered by curiosity</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                
                <ScrollArea className="flex-1 p-4">
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
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
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
                        
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted rounded-bl-none"
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
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-muted p-3 rounded-2xl rounded-bl-none">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-muted-foreground/50"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t space-y-4">
                  {/* Suggestions */}
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.label}
                        onClick={() => handleSuggestion(suggestion.prompt)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <suggestion.icon className="w-3 h-3" />
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask me anything..."
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatDemo;
