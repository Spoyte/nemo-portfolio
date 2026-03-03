"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Clock, 
  MapPin, 
  Calendar,
  Volume2,
  VolumeX,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "achievement";
  icon?: React.ReactNode;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications((prev) => [...prev, { ...notification, id }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Welcome notification on first visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setTimeout(() => {
        addNotification({
          title: "Welcome to my portfolio! 👋",
          message: "Explore my work and don't forget to try the Konami code!",
          type: "info",
          icon: <Sparkles className="w-4 h-4" />,
        });
        sessionStorage.setItem("hasVisited", "true");
      }, 2000);
    }
  }, [addNotification]);

  return (
    <>
      {/* Notification Container */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              layout
              className="pointer-events-auto"
            >
              <div
                className={`relative overflow-hidden rounded-xl border bg-card p-4 shadow-lg min-w-[300px] max-w-[400px] ${
                  notification.type === "achievement"
                    ? "border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
                    : notification.type === "success"
                    ? "border-green-500/50"
                    : notification.type === "warning"
                    ? "border-orange-500/50"
                    : "border-primary/50"
                }`}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
                
                <div className="relative flex items-start gap-3">
                  {notification.icon && (
                    <div className={`p-2 rounded-lg ${
                      notification.type === "achievement"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-primary/10 text-primary"
                    }`}>
                      {notification.icon}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary/50"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sound Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed bottom-20 right-4 z-50 p-3 rounded-full glass shadow-lg hover:shadow-xl transition-shadow"
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </motion.button>
    </>
  );
}

// Live Clock Widget
export function LiveClockWidget() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50 glass rounded-2xl p-4 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center">
            <motion.div
              className="absolute w-1 h-4 bg-primary rounded-full origin-bottom"
              style={{ bottom: "50%", left: "calc(50% - 2px)" }}
              animate={{ rotate: time.getSeconds() * 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
            <motion.div
              className="absolute w-0.5 h-3 bg-primary/70 rounded-full origin-bottom"
              style={{ bottom: "50%", left: "calc(50% - 1px)" }}
              animate={{ rotate: time.getMinutes() * 6 }}
            />
            <motion.div
              className="absolute w-0.5 h-2 bg-primary/50 rounded-full origin-bottom"
              style={{ bottom: "50%", left: "calc(50% - 1px)" }}
              animate={{ rotate: time.getHours() * 30 + time.getMinutes() * 0.5 }}
            />
          </div>
        </div>
        
        <div>
          <div className="text-2xl font-bold font-mono tracking-wider">
            {formatTime(time)}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(time)}
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span>San Francisco, CA (PST)</span>
      </div>
    </motion.div>
  );
}
