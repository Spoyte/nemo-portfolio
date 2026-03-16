"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Wand2,
  Code,
  Palette,
  Lightbulb,
  Zap,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const quickActions = [
  { icon: Code, label: "Generate Code", prompt: "Generate a React component for..." },
  { icon: Palette, label: "Design Ideas", prompt: "Give me design ideas for..." },
  { icon: Lightbulb, label: "Project Ideas", prompt: "Suggest project ideas about..." },
  { icon: Zap, label: "Quick Help", prompt: "Help me with..." },
];

const welcomeMessages = [
  "Hey there! I'm Nemo's AI assistant. I can help you with coding, design ideas, or just chat about tech!",
  "Welcome! Looking for code snippets, design inspiration, or project ideas? I'm here to help!",
  "Hi! I'm here to assist with your creative coding journey. What would you like to explore today?",
];

// Simulated AI responses based on keywords
const generateResponse = (input: string): { content: string; suggestions: string[] } => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes("react") || lowerInput.includes("component")) {
    return {
      content: "Here's a cool React pattern you might like:\n\n```tsx\n// Compound Component Pattern\nconst Card = ({ children }: { children: React.ReactNode }) => {\n  return <div className=\"rounded-lg border p-4\">{children}</div>;\n};\n\nCard.Header = ({ title }: { title: string }) => (\n  <h3 className=\"text-lg font-bold\">{title}</h3>\n);\n\nCard.Body = ({ children }: { children: React.ReactNode }) => (\n  <div className=\"mt-2\">{children}</div>\n);\n\n// Usage:\n// <Card>\n//   <Card.Header title=\"Hello\" />\n//   <Card.Body>Content here</Card.Body>\n// </Card>\n```",
      suggestions: ["Show me more patterns", "How about TypeScript?", "Explain hooks"],
    };
  }
  
  if (lowerInput.includes("design") || lowerInput.includes("ui") || lowerInput.includes("ux")) {
    return {
      content: "Design tip: Use the 60-30-10 rule for color schemes!\n\n- **60%** - Primary/Neutral color (backgrounds)\n- **30%** - Secondary color (cards, sections)\n- **10%** - Accent color (CTAs, highlights)\n\nAlso, remember:\n✓ Consistent spacing (use a 4px or 8px grid)\n✓ Limit typography to 2-3 font families\n✓ White space is your friend!",
      suggestions: ["Color palette tools", "Typography tips", "Show examples"],
    };
  }
  
  if (lowerInput.includes("project") || lowerInput.includes("idea")) {
    return {
      content: "Here are some unique project ideas:\n\n🎨 **Generative Art Gallery** - Create algorithmic art with canvas\n🎵 **Audio Visualizer** - Web Audio API + Canvas animations\n🌤️ **Weather Dashboard** - Beautiful data visualization\n📝 **Collaborative Whiteboard** - Real-time drawing with WebSockets\n🎮 **Browser-based Game** - Canvas or Three.js\n\nWant me to elaborate on any of these?",
      suggestions: ["Tell me about generative art", "How to start with Web Audio?", "More game ideas"],
    };
  }
  
  if (lowerInput.includes("animation") || lowerInput.includes("motion")) {
    return {
      content: "For smooth animations, I recommend:\n\n**Framer Motion** (React):\n```tsx\n<motion.div\n  initial={{ opacity: 0, y: 20 }}\n  animate={{ opacity: 1, y: 0 }}\n  transition={{ duration: 0.5, ease: \"easeOut\" }}\n  whileHover={{ scale: 1.05 }}\n  whileTap={{ scale: 0.95 }}\n/>\n```\n\n**GSAP** (Advanced):\n- Timeline control\n- ScrollTrigger for scroll-based animations\n- MorphSVG for shape morphing\n\n**CSS** (Simple):\n- Use `transform` and `opacity` for 60fps\n- `will-change` for heavy animations",
      suggestions: ["Show GSAP example", "CSS animation tips", "Performance optimization"],
    };
  }
  
  if (lowerInput.includes("portfolio") || lowerInput.includes("website")) {
    return {
      content: "Portfolio tips from Nemo's experience:\n\n📌 **Must-haves:**\n- Clear value proposition above the fold\n- Case studies with process, not just screenshots\n- About page with personality\n- Contact form that's easy to find\n\n🎨 **Stand out with:**\n- Micro-interactions\n- Dark mode toggle\n- Easter eggs (like this chat!)\n- Live code demos\n\n⚡ **Performance:**\n- Optimize images (WebP, lazy loading)\n- Use Next.js for SSG/SSR\n- Lighthouse score 90+",
      suggestions: ["Show me case study examples", "How to add dark mode?", "SEO tips"],
    };
  }
  
  return {
    content: "That's an interesting question! Here are some thoughts:\n\nI'd recommend starting with the fundamentals and building up. Break your problem into smaller pieces, and don't be afraid to experiment!\n\nIf you're working on something specific, feel free to share more details and I can give more targeted advice.\n\n💡 **Pro tip:** Check out Nemo's /labs page for interactive examples!",
    suggestions: ["Show me labs", "Learning resources", "Best practices"],
  };
};

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: randomWelcome,
          timestamp: new Date(),
          suggestions: ["Generate Code", "Design Ideas", "Project Ideas"],
        },
      ]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setHasStarted(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  }, [input, isTyping]);

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setMessages([
      {
        id: "welcome-new",
        role: "assistant",
        content: randomWelcome,
        timestamp: new Date(),
        suggestions: ["Generate Code", "Design Ideas", "Project Ideas"],
      },
    ]);
    setHasStarted(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl",
          "bg-gradient-to-br from-primary to-orange-500 text-white",
          "flex items-center justify-center",
          "hover:shadow-primary/50 transition-shadow",
          isOpen && "hidden"
        )}
      >
        <Sparkles className="w-6 h-6" />
        
        {/* Notification dot */}
        {!hasStarted && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)]"
          >
            <div className="h-full rounded-2xl bg-card border shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-orange-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {hasStarted && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={clearChat}
                      title="Clear chat"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}
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

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "flex-row-reverse"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          message.role === "assistant"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {message.role === "assistant" ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div className={cn("flex-1", message.role === "user" && "text-right")}>
                        <div
                          className={cn(
                            "inline-block rounded-2xl px-4 py-2 text-sm text-left",
                            message.role === "assistant"
                              ? "bg-muted"
                              : "bg-primary text-primary-foreground"
                          )}
                        >
                          <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                            {message.content.split("```").map((part, index) => {
                              if (index % 2 === 1) {
                                // Code block
                                const lines = part.split("\n");
                                const lang = lines[0];
                                const code = lines.slice(1).join("\n");
                                return (
                                  <div key={index} className="relative group my-2">
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 bg-background/50"
                                        onClick={() => copyToClipboard(code, `${message.id}-${index}`)}
                                      >
                                        {copiedId === `${message.id}-${index}` ? (
                                          <Check className="w-3 h-3" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </Button>
                                    </div>
                                    <pre className="bg-black/90 text-white p-3 rounded-lg overflow-x-auto text-xs">
                                      <code>{code}</code>
                                    </pre>
                                  </div>
                                );
                              }
                              // Regular text with markdown-like formatting
                              return (
                                <span key={index}>
                                  {part.split("\n").map((line, lineIndex) => {
                                    // Bold text
                                    if (line.startsWith("**") && line.endsWith("**")) {
                                      return <strong key={lineIndex}>{line.slice(2, -2)}</strong>;
                                    }
                                    // Bullet points
                                    if (line.startsWith("- ")) {
                                      return (
                                        <div key={lineIndex} className="flex items-start gap-2 my-1">
                                          <span className="text-primary mt-1">•</span>
                                          <span>{line.slice(2)}</span>
                                        </div>
                                      );
                                    }
                                    // Headers
                                    if (line.startsWith("# ")) {
                                      return <h1 key={lineIndex} className="text-lg font-bold my-2">{line.slice(2)}</h1>;
                                    }
                                    if (line.startsWith("## ")) {
                                      return <h2 key={lineIndex} className="text-base font-bold my-2">{line.slice(3)}</h2>;
                                    }
                                    // Emoji at start
                                    if (/^[🎨🎵🌤️📝🎮✓⚡📌🌟💡]/.test(line)) {
                                      return <div key={lineIndex} className="my-1">{line}</div>;
                                    }
                                    return line ? <div key={lineIndex}>{line}</div> : <br key={lineIndex} />;
                                  })}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.suggestions.map((suggestion) => (
                              <button
                                key={suggestion}
                                onClick={() => handleSuggestion(suggestion)}
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
                      <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-1">
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Actions (only show initially) */}
              {!hasStarted && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.prompt)}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-left text-sm"
                      >
                        <action.icon className="w-4 h-4 text-primary" />
                        <span className="truncate">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    size="icon"
                    className="shrink-0"
                  >
                    {isTyping ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  Powered by simulated AI • For demo purposes
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
