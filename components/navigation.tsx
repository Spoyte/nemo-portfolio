"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPalette } from "@/components/command-palette-enhanced";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/timeline", label: "Timeline" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/cases", label: "Cases" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const moreNavItems = [
  { href: "/v2-features", label: "V2 Features" },
  { href: "/animations", label: "Animations" },
  { href: "/customize", label: "Customize" },
  { href: "/achievements", label: "Achievements" },
  { href: "/stats", label: "Stats" },
  { href: "/uses", label: "Uses" },
];

// Secret pages (not shown in nav)
const secretPages = [
  { href: "/code-cinema", label: "Code Cinema" },
  { href: "/trading-cards", label: "Trading Cards" },
  { href: "/secret-lab", label: "Secret Lab" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [konami, setKonami] = useState<string[]>([]);
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
        return newKonami;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              ))}
              
              {/* More Dropdown */}
              <div className="relative group">
                <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg">
                  More
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 py-2 rounded-xl bg-popover border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {moreNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <CommandPalette />
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
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
            className="fixed inset-x-0 top-[72px] z-40 md:hidden"
          >
            <div className="glass-strong mx-4 rounded-2xl p-4 shadow-xl">
              <nav className="flex flex-col gap-2">
                {[...navItems, ...moreNavItems].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary"
                      }`}
                    >
                      {item.label}
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
    </>
  );
}
