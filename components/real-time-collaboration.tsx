"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MousePointer2, 
  Users, 
  MessageSquare, 
  Send,
  Smile,
  MoreHorizontal,
  Crown,
  Sparkles,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface LiveCursor {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
  message?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  name: string;
  message: string;
  timestamp: Date;
}

const mockCursors: LiveCursor[] = [
  { id: "1", x: 20, y: 30, name: "Alex", color: "#dc2626", message: "Love this design!" },
  { id: "2", x: 60, y: 45, name: "Sarah", color: "#2563eb" },
  { id: "3", x: 40, y: 70, name: "Mike", color: "#16a34a" },
];

const colors = ["#dc2626", "#2563eb", "#16a34a", "#9333ea", "#ea580c", "#0891b2"];

export function RealTimeCollaboration() {
  const [cursors, setCursors] = useState<LiveCursor[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(1);
  const [myCursor, setMyCursor] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate other visitors
  useEffect(() => {
    // Add mock cursors
    setCursors(mockCursors);
    setVisitorCount(mockCursors.length + 1);

    // Animate cursors
    const interval = setInterval(() => {
      setCursors(prev => prev.map(cursor => ({
        ...cursor,
        x: Math.max(5, Math.min(95, cursor.x + (Math.random() - 0.5) * 10)),
        y: Math.max(5, Math.min(95, cursor.y + (Math.random() - 0.5) * 10)),
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMyCursor({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: "me",
      name: "You",
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate reply
    setTimeout(() => {
      const replies = [
        "Great portfolio!",
        "Love the animations",
        "How did you build this?",
        "The 3D skills globe is amazing!",
        "Inspiring work!",
      ];
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: "other",
        name: mockCursors[Math.floor(Math.random() * mockCursors.length)].name,
        message: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Live Cursors Overlay */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {cursors.map((cursor) => (
          <motion.div
            key={cursor.id}
            className="absolute"
            animate={{
              left: `${cursor.x}%`,
              top: `${cursor.y}%`,
            }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={cursor.color}
                className="drop-shadow-md"
              >
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z" />
              </svg>
              
              <div
                className="absolute left-4 top-4 px-2 py-1 rounded-md text-white text-xs whitespace-nowrap"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.name}
              </div>

              {cursor.message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute left-4 top-10 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg text-sm max-w-[200px]"
                >
                  {cursor.message}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visitor Counter */}
      <motion.div
        className="fixed top-24 right-6 z-40"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
      >
        <Card className="shadow-lg">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium">{visitorCount} visitors</p>
              <p className="text-xs text-muted-foreground">Viewing now</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chat Widget */}
      <motion.div
        className="fixed bottom-24 left-6 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <AnimatePresence>
          {isChatOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="w-80 shadow-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <CardTitle className="text-base">Live Chat</CardTitle>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsChatOpen(false)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Messages */}
                  <div className="h-48 overflow-y-auto space-y-3 pr-2">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground text-sm py-8">
                        No messages yet. Say hello!
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.userId === "me" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                              msg.userId === "me"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-xs opacity-70 mb-1">{msg.name}</p>
                            <p>{msg.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button size="icon" onClick={sendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              <Button
                size="lg"
                className="rounded-full w-14 h-14 shadow-lg relative"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageSquare className="w-6 h-6" />
                {messages.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {messages.length}
                  </span>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
