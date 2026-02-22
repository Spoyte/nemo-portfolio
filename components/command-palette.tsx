"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Command, Search, ArrowUpRight, Moon, Sun, Home, User, FolderOpen, BookOpen, Clock, Mail } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, setTheme } = useTheme();

  const commands: CommandItem[] = [
    { id: "home", label: "Go to Home", shortcut: "G H", icon: Home, href: "/" },
    { id: "about", label: "Go to About", shortcut: "G A", icon: User, href: "/about" },
    { id: "projects", label: "Go to Projects", shortcut: "G P", icon: FolderOpen, href: "/projects" },
    { id: "blog", label: "Go to Blog", shortcut: "G B", icon: BookOpen, href: "/blog" },
    { id: "now", label: "Go to Now", shortcut: "G N", icon: Clock, href: "/now" },
    { id: "contact", label: "Go to Contact", shortcut: "G C", icon: Mail, href: "/contact" },
    { id: "theme", label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`, shortcut: "⌘ J", icon: theme === "dark" ? Sun : Moon, action: () => setTheme(theme === "dark" ? "light" : "dark") },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Escape to close
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      // Navigation shortcuts
      if (e.key === "g" && !isOpen) {
        const checkNextKey = (nextKey: string, href: string) => {
          const handler = (e2: KeyboardEvent) => {
            if (e2.key === nextKey) {
              window.location.href = href;
            }
            window.removeEventListener("keydown", handler);
          };
          window.addEventListener("keydown", handler);
          setTimeout(() => window.removeEventListener("keydown", handler), 1000);
        };
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleSelect = useCallback((cmd: CommandItem) => {
    if (cmd.action) {
      cmd.action();
    } else if (cmd.href) {
      window.location.href = cmd.href;
    }
    setIsOpen(false);
    setSearch("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) handleSelect(cmd);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, handleSelect]);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Command className="h-4 w-4" />
        <span>Command Palette</span>
        <kbd className="px-2 py-0.5 rounded bg-muted text-xs">⌘K</kbd>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed left-1/2 top-1/4 -translate-x-1/2 z-50 w-full max-w-2xl mx-4"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent border-none outline-none text-lg"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 rounded bg-muted text-xs">ESC</kbd>
                </div>

                {/* Commands List */}
                <div className="max-h-[400px] overflow-y-auto py-2">
                  {filteredCommands.length === 0 ? (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      No commands found
                    </div>
                  ) : (
                    filteredCommands.map((cmd, index) => (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          index === selectedIndex ? "bg-primary/10" : "hover:bg-muted"
                        }`}
                      >
                        <cmd.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="flex-1">{cmd.label}</span>
                        {cmd.shortcut && (
                          <kbd className="px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
                            {cmd.shortcut}
                          </kbd>
                        )}
                        {cmd.href && (
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border bg-muted/50 text-xs text-muted-foreground flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-muted">↑↓</kbd>
                      to navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-muted">↵</kbd>
                      to select
                    </span>
                  </div>
                  <span>{filteredCommands.length} commands</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
