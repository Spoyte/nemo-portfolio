"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Command, 
  Search, 
  FileText, 
  Home, 
  User, 
  Briefcase, 
  Mail, 
  Settings,
  Moon,
  Sun,
  Github,
  Twitter,
  Linkedin,
  ExternalLink,
  Sparkles,
  Code2,
  Palette,
  Zap,
  BookOpen,
  Clock,
  Calendar,
  Star,
  Heart,
  Trophy,
  Gamepad2,
  Terminal,
  Keyboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "home",
      title: "Go to Home",
      description: "Navigate to homepage",
      icon: Home,
      shortcut: "⌘H",
      action: () => { router.push("/"); setIsOpen(false); },
      category: "Navigation",
    },
    {
      id: "about",
      title: "Go to About",
      description: "Learn more about me",
      icon: User,
      shortcut: "⌘A",
      action: () => { router.push("/about"); setIsOpen(false); },
      category: "Navigation",
    },
    {
      id: "projects",
      title: "Go to Projects",
      description: "View my work",
      icon: Briefcase,
      shortcut: "⌘P",
      action: () => { router.push("/projects"); setIsOpen(false); },
      category: "Navigation",
    },
    {
      id: "skills",
      title: "Go to Skills",
      description: "Explore my expertise",
      icon: Zap,
      action: () => { router.push("/skills"); setIsOpen(false); },
      category: "Navigation",
    },
    {
      id: "now",
      title: "Go to Now",
      description: "What I'm doing now",
      icon: Clock,
      action: () => { router.push("/now"); setIsOpen(false); },
      category: "Navigation",
    },
    {
      id: "timeline",
      title: "Go to Timeline",
      description: "My journey",
      icon: Calendar,
      action: () => { router.push("/timeline"); setIsOpen(false); },
      category: "Navigation",
    },
    {
      id: "blog",
      title: "Go to Blog",
      description: "Read my articles",
      icon: BookOpen,
      action: () => { router.push("/blog"); setIsOpen(false); },
      category: "Navigation",
    },
    {
      id: "contact",
      title: "Go to Contact",
      description: "Get in touch",
      icon: Mail,
      shortcut: "⌘C",
      action: () => { router.push("/contact"); setIsOpen(false); },
      category: "Navigation",
    },
    // Theme
    {
      id: "theme-light",
      title: "Switch to Light Theme",
      description: "Bright and clean",
      icon: Sun,
      action: () => { setTheme("light"); setIsOpen(false); },
      category: "Appearance",
    },
    {
      id: "theme-dark",
      title: "Switch to Dark Theme",
      description: "Easy on the eyes",
      icon: Moon,
      action: () => { setTheme("dark"); setIsOpen(false); },
      category: "Appearance",
    },
    {
      id: "theme-system",
      title: "Use System Theme",
      description: "Match your OS",
      icon: Settings,
      action: () => { setTheme("system"); setIsOpen(false); },
      category: "Appearance",
    },
    // Social
    {
      id: "github",
      title: "Open GitHub",
      description: "View my code",
      icon: Github,
      action: () => { window.open("https://github.com", "_blank"); setIsOpen(false); },
      category: "Social",
    },
    {
      id: "twitter",
      title: "Open Twitter",
      description: "Follow me",
      icon: Twitter,
      action: () => { window.open("https://twitter.com", "_blank"); setIsOpen(false); },
      category: "Social",
    },
    {
      id: "linkedin",
      title: "Open LinkedIn",
      description: "Connect professionally",
      icon: Linkedin,
      action: () => { window.open("https://linkedin.com", "_blank"); setIsOpen(false); },
      category: "Social",
    },
    // Easter Eggs
    {
      id: "matrix",
      title: "Enter the Matrix",
      description: "Secret mode activated",
      icon: Terminal,
      action: () => { 
        if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).matrix) {
          ((window as unknown as Record<string, () => void>).matrix)();
        }
        setIsOpen(false); 
      },
      category: "Secret",
    },
    {
      id: "party",
      title: "Party Mode",
      description: "Celebrate!",
      icon: Sparkles,
      action: () => { 
        if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).party) {
          ((window as unknown as Record<string, () => void>).party)();
        }
        setIsOpen(false); 
      },
      category: "Secret",
    },
    {
      id: "secret",
      title: "Secret Lab",
      description: "Shhh...",
      icon: Gamepad2,
      action: () => { router.push("/secret"); setIsOpen(false); },
      category: "Secret",
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const allCommands = Object.values(groupedCommands).flat();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Escape to close
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      // Navigation
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % allCommands.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + allCommands.length) % allCommands.length);
        }
        if (e.key === "Enter") {
          e.preventDefault();
          allCommands[selectedIndex]?.action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, allCommands, selectedIndex]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        className="hidden md:flex items-center gap-2 text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Search...</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-muted rounded">⌘K</kbd>
      </Button>

      {/* Mobile Trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Command Palette */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-2xl px-4"
            >
              <div className="overflow-hidden rounded-2xl bg-popover border shadow-2xl">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 text-xs bg-muted rounded">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {allCommands.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <Command className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No commands found</p>
                    </div>
                  ) : (
                    Object.entries(groupedCommands).map(([category, items]) => (
                      <div key={category} className="mb-4">
                        <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {category}
                        </p>
                        <div className="space-y-1">
                          {items.map((item, index) => {
                            const globalIndex = allCommands.findIndex((c) => c.id === item.id);
                            const isSelected = globalIndex === selectedIndex;

                            return (
                              <motion.button
                                key={item.id}
                                onClick={item.action}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                }`}
                                layout
                              >
                                <item.icon className="h-5 w-5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{item.title}</p>
                                  {item.description && (
                                    <p className={`text-sm truncate ${
                                      isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                                    }`}>
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                {item.shortcut && (
                                  <kbd className={`px-2 py-1 text-xs rounded ${
                                    isSelected ? "bg-primary-foreground/20" : "bg-muted"
                                  }`}>
                                    {item.shortcut}
                                  </kbd>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd>
                      <span>Select</span>
                    </span>
                  </div>
                  <span>{allCommands.length} commands</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
