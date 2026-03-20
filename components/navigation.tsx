"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, Sparkles, ChevronDown, Compass, Gamepad2, Palette, Brain, Clock, BookOpen, Bookmark, BarChart3, Flower2, Zap, Keyboard, Archive, Quote } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPalette } from "@/components/command-palette-enhanced";

// Main navigation items
const mainNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

// Experience dropdown items
const experienceItems = [
  { href: "/now", label: "Now", description: "What I'm up to" },
  { href: "/timeline", label: "Timeline", description: "My journey" },
  { href: "/skills", label: "Skills", description: "What I know" },
  { href: "/testimonials", label: "Testimonials", description: "What others say" },
  { href: "/uses", label: "Uses", description: "My setup" },
];

// Creative features - V4
const creativeItems = [
  { href: "/meditation", label: "Meditation", icon: Brain, description: "Code meditation garden", badge: "V4", color: "text-purple-400" },
  { href: "/time-machine", label: "Time Machine", icon: Clock, description: "Portfolio evolution", badge: "V4", color: "text-blue-400" },
  { href: "/secret-garden", label: "Secret Garden", icon: Flower2, description: "Interactive nature", badge: "V4", color: "text-green-400" },
  { href: "/code-poetry", label: "Code Poetry", icon: Quote, description: "Code as art", badge: "V4", color: "text-pink-400" },
  { href: "/time-capsule", label: "Time Capsule", icon: Archive, description: "Messages to future", badge: "New", color: "text-amber-400" },
];

// Interactive features
const interactiveItems = [
  { href: "/typing-race", label: "Typing Race", icon: Keyboard, description: "Speed challenge", badge: "Game", color: "text-orange-400" },
  { href: "/games", label: "Mini Games", icon: Gamepad2, description: "Fun collection", badge: "Game", color: "text-red-400" },
  { href: "/immersive-3d", label: "3D World", icon: Compass, description: "Three.js experience", badge: "V3", color: "text-cyan-400" },
  { href: "/ai-art", label: "AI Art Gen", icon: Palette, description: "Generate art", badge: "V3", color: "text-violet-400" },
  { href: "/physics", label: "Physics", icon: Zap, description: "Matter.js playground", badge: "V3", color: "text-yellow-400" },
  { href: "/shader-studio", label: "Shader Studio", icon: Sparkles, description: "GLSL experiments", badge: "V3", color: "text-emerald-400" },
];

// Community & Resources
const communityItems = [
  { href: "/guestbook", label: "Guestbook", icon: BookOpen, description: "Leave a message", badge: "New", color: "text-indigo-400" },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark, description: "Curated resources", badge: "New", color: "text-teal-400" },
  { href: "/resources", label: "Resources", icon: BarChart3, description: "Dev tools & learning", badge: "New", color: "text-cyan-400" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, description: "Visitor insights", badge: "New", color: "text-rose-400" },
];

// Other pages
const otherItems = [
  { href: "/dashboard", label: "Dashboard", badge: "V4" },
  { href: "/labs", label: "Labs", badge: "New" },
  { href: "/cases", label: "Cases" },
  { href: "/achievements", label: "Achievements" },
  { href: "/stats", label: "Stats" },
  { href: "/v2-features", label: "V2 Features" },
  { href: "/v3-features", label: "V3 Features" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [konami, setKonami] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track Konami code progress
  useEffect(() => {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      setKonami((prev) => {
        const newKonami = [...prev, e.key].slice(-10);
        if (newKonami.join(",") === konamiCode.join(",")) {
          window.dispatchEvent(new CustomEvent("konami-code"));
          setShowHint(true);
          setTimeout(() => setShowHint(false), 3000);
        }
        return newKonami;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong py-3 shadow-sm" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                N
              </motion.div>
              <span className="font-semibold text-lg hidden sm:block">Nemo</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              ))}
              
              {/* Experience Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown("experience")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg flex items-center gap-1">
                  Experience
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === "experience" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === "experience" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 py-2 rounded-xl bg-popover border shadow-lg"
                    >
                      {experienceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm transition-colors hover:bg-muted"
                        >
                          <span className="font-medium">{item.label}</span>
                          <span className="block text-xs text-muted-foreground">{item.description}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Creative Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown("creative")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Creative
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === "creative" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === "creative" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 py-2 rounded-xl bg-popover border shadow-lg"
                    >
                      {creativeItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted"
                        >
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          <div className="flex-1">
                            <span className="font-medium">{item.label}</span>
                            <span className="block text-xs text-muted-foreground">{item.description}</span>
                          </div>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Play Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown("play")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg flex items-center gap-1">
                  <Gamepad2 className="w-3 h-3 mr-1" />
                  Play
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === "play" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === "play" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 py-2 rounded-xl bg-popover border shadow-lg"
                    >
                      {interactiveItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted"
                        >
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          <div className="flex-1">
                            <span className="font-medium">{item.label}</span>
                            <span className="block text-xs text-muted-foreground">{item.description}</span>
                          </div>
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                              item.badge === "Game" ? "bg-orange-500/10 text-orange-500" : "bg-primary/10 text-primary"
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Community Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown("community")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg flex items-center gap-1">
                  Community
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === "community" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === "community" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 py-2 rounded-xl bg-popover border shadow-lg"
                    >
                      {communityItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted"
                        >
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          <div className="flex-1">
                            <span className="font-medium">{item.label}</span>
                            <span className="block text-xs text-muted-foreground">{item.description}</span>
                          </div>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* More Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown("more")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg flex items-center gap-1">
                  More
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === "more" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === "more" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-48 py-2 rounded-xl bg-popover border shadow-lg"
                    >
                      {otherItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-muted"
                        >
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <CommandPalette />
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 lg:hidden"
          >
            <div className="glass-strong mx-4 rounded-2xl p-4 shadow-xl max-h-[80vh] overflow-y-auto">
              <nav className="flex flex-col gap-1">
                {/* Main Items */}
                {mainNavItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Section: Creative */}
                <div className="mt-4 mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Creative
                </div>
                {creativeItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 5) * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Section: Play */}
                <div className="mt-4 mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Play
                </div>
                {interactiveItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 10) * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                          item.badge === "Game" ? "bg-orange-500/10 text-orange-500" : "bg-primary/10 text-primary"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Section: Community */}
                <div className="mt-4 mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Community
                </div>
                {communityItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 15) * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Section: Experience */}
                <div className="mt-4 mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Experience
                </div>
                {experienceItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 18) * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Section: More */}
                <div className="mt-4 mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  More
                </div>
                {otherItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 23) * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami Code Progress */}
      <AnimatePresence>
        {konami.length > 0 && konami.length < 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50 glass px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            <span>{konami.length}/10</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami Success */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 z-50 glass-strong px-6 py-4 rounded-2xl border border-primary/20 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold text-primary">Konami Code Activated!</p>
                <p className="text-sm text-muted-foreground">Something magical happened...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
