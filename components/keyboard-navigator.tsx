"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Keyboard, 
  X, 
  Command, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Search,
  Home,
  User,
  Briefcase,
  Mail,
  Moon,
  Sun,
  Terminal,
  Gamepad2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Shortcut {
  key: string;
  label: string;
  action: () => void;
  icon?: React.ReactNode;
}

export function KeyboardNavigator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState<string | null>(null);

  const shortcuts: Shortcut[] = [
    {
      key: "?",
      label: "Show/Hide Help",
      action: () => setIsVisible(!isVisible),
      icon: <Keyboard className="w-4 h-4" />,
    },
    {
      key: "/",
      label: "Search",
      action: () => {
        document.querySelector('input[type="search"]')?.focus();
        showFeedback("Search activated");
      },
      icon: <Search className="w-4 h-4" />,
    },
    {
      key: "h",
      label: "Go Home",
      action: () => {
        window.location.href = "/";
        showFeedback("Going home...");
      },
      icon: <Home className="w-4 h-4" />,
    },
    {
      key: "a",
      label: "About",
      action: () => {
        window.location.href = "/about";
        showFeedback("Navigating to About");
      },
      icon: <User className="w-4 h-4" />,
    },
    {
      key: "p",
      label: "Projects",
      action: () => {
        window.location.href = "/projects";
        showFeedback("Navigating to Projects");
      },
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      key: "c",
      label: "Contact",
      action: () => {
        window.location.href = "/contact";
        showFeedback("Navigating to Contact");
      },
      icon: <Mail className="w-4 h-4" />,
    },
    {
      key: "t",
      label: "Toggle Theme",
      action: () => {
        document.documentElement.classList.toggle("dark");
        showFeedback("Theme toggled");
      },
      icon: <Moon className="w-4 h-4" />,
    },
    {
      key: "g",
      label: "Games",
      action: () => {
        window.location.href = "/games";
        showFeedback("Opening Games");
      },
      icon: <Gamepad2 className="w-4 h-4" />,
    },
    {
      key: "k",
      label: "Secret Terminal",
      action: () => {
        showFeedback("Terminal shortcut: Ctrl+Shift+K");
      },
      icon: <Terminal className="w-4 h-4" />,
    },
  ];

  const showFeedback = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const key = e.key.toLowerCase();

    // Toggle help with ?
    if (key === "?") {
      e.preventDefault();
      setIsVisible((prev) => !prev);
      return;
    }

    // Track pressed keys in practice mode
    if (isPracticeMode) {
      setPressedKeys((prev) => new Set(prev).add(key));
    }

    // Execute shortcuts
    const shortcut = shortcuts.find((s) => s.key === key);
    if (shortcut && !isVisible) {
      e.preventDefault();
      shortcut.action();
    }

    // Escape to close
    if (key === "escape") {
      setIsVisible(false);
      setIsPracticeMode(false);
    }
  }, [isVisible, isPracticeMode, shortcuts]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (isPracticeMode) {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.key.toLowerCase());
        return next;
      });
    }
  }, [isPracticeMode]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <>
      {/* Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
        title="Keyboard Shortcuts (?)"
      >
        <Keyboard className="w-5 h-5" />
      </motion.button>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Command className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                    <p className="text-sm text-muted-foreground">
                      Press any key to navigate faster
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                {isPracticeMode ? (
                  <div className="text-center py-8">
                    <p className="text-lg font-medium mb-8">
                      Practice Mode - Press the keys!
                    </p>
                    
                    <div className="flex justify-center gap-4">
                      {["h", "j", "k", "l"].map((key) => (
                        <motion.div
                          key={key}
                          animate={{
                            scale: pressedKeys.has(key) ? 0.9 : 1,
                            backgroundColor: pressedKeys.has(key)
                              ? "hsl(var(--primary))"
                              : "hsl(var(--muted))",
                            color: pressedKeys.has(key)
                              ? "hsl(var(--primary-foreground))"
                              : "inherit",
                          }}
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold border border-border"
                        >
                          {key.toUpperCase()}
                        </motion.div>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      className="mt-8"
                      onClick={() => setIsPracticeMode(false)}
                    >
                      Exit Practice Mode
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shortcuts.map((shortcut) => (
                        <motion.div
                          key={shortcut.key}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            shortcut.action();
                            setIsVisible(false);
                          }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {shortcut.icon && (
                              <div className="text-muted-foreground">
                                {shortcut.icon}
                              </div>
                            )}
                            <span className="font-medium">{shortcut.label}</span>
                          </div>
                          
                          <kbd className="px-3 py-1.5 rounded-lg bg-card border border-border font-mono text-sm">
                            {shortcut.key === " " ? "Space" : shortcut.key.toUpperCase()}
                          </kbd>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Navigation:</span>
                          <div className="flex gap-1">
                            <kbd className="px-2 py-1 rounded bg-muted text-xs">↑</kbd>
                            <kbd className="px-2 py-1 rounded bg-muted text-xs">↓</kbd>
                            <kbd className="px-2 py-1 rounded bg-muted text-xs">←</kbd>
                            <kbd className="px-2 py-1 rounded bg-muted text-xs">→</kbd>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPracticeMode(true)}
                        >
                          Practice Mode
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-muted/50 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Press <kbd className="px-2 py-0.5 rounded bg-card border">?</kbd> anytime to show this help
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default KeyboardNavigator;
