"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X, Command, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Search, Home, Briefcase, BookOpen, Mail, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface Shortcut {
  key: string;
  label: string;
  action: () => void;
  icon?: React.ElementType;
}

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const shortcuts: Shortcut[] = [
    {
      key: "?",
      label: "Show keyboard shortcuts",
      action: () => setIsOpen(true),
    },
    {
      key: "g h",
      label: "Go to Home",
      action: () => router.push("/"),
      icon: Home,
    },
    {
      key: "g a",
      label: "Go to About",
      action: () => router.push("/about"),
      icon: User,
    },
    {
      key: "g p",
      label: "Go to Projects",
      action: () => router.push("/projects"),
      icon: Briefcase,
    },
    {
      key: "g b",
      label: "Go to Blog",
      action: () => router.push("/blog"),
      icon: BookOpen,
    },
    {
      key: "g n",
      label: "Go to Now",
      action: () => router.push("/now"),
      icon: Zap,
    },
    {
      key: "g c",
      label: "Go to Contact",
      action: () => router.push("/contact"),
      icon: Mail,
    },
    {
      key: "k",
      label: "Open Command Palette",
      action: () => {
        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
        });
        document.dispatchEvent(event);
      },
      icon: Command,
    },
    {
      key: "/",
      label: "Focus search",
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      },
      icon: Search,
    },
    {
      key: "esc",
      label: "Close modal / Go back",
      action: () => setIsOpen(false),
      icon: X,
    },
    {
      key: "t",
      label: "Toggle theme",
      action: () => {
        const themeToggle = document.querySelector('[data-theme-toggle]') as HTMLButtonElement;
        themeToggle?.click();
      },
    },
    {
      key: "↑ ↓",
      label: "Navigate items",
      action: () => {},
      icon: ArrowUp,
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Show shortcuts modal
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      // Close modal
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      // Navigation shortcuts
      if (e.key === "g") {
        const handleNextKey = (nextEvent: KeyboardEvent) => {
          switch (nextEvent.key) {
            case "h":
              nextEvent.preventDefault();
              router.push("/");
              break;
            case "a":
              nextEvent.preventDefault();
              router.push("/about");
              break;
            case "p":
              nextEvent.preventDefault();
              router.push("/projects");
              break;
            case "b":
              nextEvent.preventDefault();
              router.push("/blog");
              break;
            case "n":
              nextEvent.preventDefault();
              router.push("/now");
              break;
            case "c":
              nextEvent.preventDefault();
              router.push("/contact");
              break;
          }
          document.removeEventListener("keydown", handleNextKey);
        };
        document.addEventListener("keydown", handleNextKey, { once: true });
        return;
      }

      // Toggle theme
      if (e.key === "t" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const themeToggle = document.querySelector('[data-theme-toggle]') as HTMLButtonElement;
        themeToggle?.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="w-5 h-5" />
      </motion.button>

      {/* Shortcuts Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-6">
              Press these keys anywhere on the site to quickly navigate and perform actions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {shortcut.icon && <shortcut.icon className="w-4 h-4 text-muted-foreground" />}
                    <span className="text-sm">{shortcut.label}</span>
                  </div>
                  <kbd className="px-2 py-1 text-xs font-mono bg-background border rounded">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-center">
                <span className="font-semibold">Pro tip:</span> Press{" "}
                <kbd className="px-1 py-0.5 text-xs font-mono bg-background border rounded">
                  Cmd
                </kbd>{" "}
                +{" "}
                <kbd className="px-1 py-0.5 text-xs font-mono bg-background border rounded">
                  K
                </kbd>{" "}
                to open the command palette for even more actions.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
