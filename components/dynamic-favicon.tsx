"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const canvasSize = 32;

// Different favicon themes
const themes = {
  default: {
    bg: "#dc2626",
    text: "#ffffff",
    shape: "circle",
  },
  dark: {
    bg: "#1c1917",
    text: "#f87171",
    shape: "circle",
  },
  matrix: {
    bg: "#000000",
    text: "#00ff00",
    shape: "square",
  },
  ocean: {
    bg: "#0c4a6e",
    text: "#7dd3fc",
    shape: "circle",
  },
  sunset: {
    bg: "#7c2d12",
    text: "#fdba74",
    shape: "circle",
  },
};

export function DynamicFavicon() {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>("default");
  const [animationFrame, setAnimationFrame] = useState(0);

  const drawFavicon = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = themes[currentTheme];

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw background shape
    ctx.fillStyle = theme.bg;
    if (theme.shape === "circle") {
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(2, 2, canvasSize - 4, canvasSize - 4);
    }

    // Draw "N" letter with animation
    ctx.fillStyle = theme.text;
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Add subtle animation to the letter
    const offsetY = Math.sin(animationFrame * 0.1) * 1;
    ctx.fillText("N", canvasSize / 2, canvasSize / 2 + offsetY);

    // Update favicon
    const link = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
    if (link) {
      link.href = canvas.toDataURL();
    }
  }, [currentTheme, animationFrame]);

  // Animation loop
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setAnimationFrame(frame);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Redraw on changes
  useEffect(() => {
    drawFavicon();
  }, [drawFavicon]);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setCurrentTheme(isDark ? "dark" : "default");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Check initial state
    const isDark = document.documentElement.classList.contains("dark");
    setCurrentTheme(isDark ? "dark" : "default");

    return () => observer.disconnect();
  }, []);

  // Listen for page changes
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path.includes("matrix")) setCurrentTheme("matrix");
      else if (path.includes("ocean")) setCurrentTheme("ocean");
      else if (path.includes("sunset")) setCurrentTheme("sunset");
    };

    window.addEventListener("popstate", handleRouteChange);
    handleRouteChange();

    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  // Easter egg: Change favicon on Konami code
  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let index = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[index]) {
        index++;
        if (index === konamiCode.length) {
          setCurrentTheme("matrix");
          index = 0;
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null; // This component doesn't render anything visible
}

// Favicon theme switcher component
export function FaviconThemeSwitcher() {
  const [current, setCurrent] = useState<keyof typeof themes>("default");

  const setTheme = (theme: keyof typeof themes) => {
    setCurrent(theme);
    // Dispatch custom event for DynamicFavicon to pick up
    window.dispatchEvent(new CustomEvent("faviconThemeChange", { detail: theme }));
  };

  return (
    <div className="flex gap-2">
      {(Object.keys(themes) as Array<keyof typeof themes>).map((theme) => (
        <motion.button
          key={theme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme)}
          className={`w-8 h-8 rounded-lg border-2 transition-colors ${
            current === theme ? "border-primary" : "border-transparent"
          }`}
          style={{
            backgroundColor: themes[theme].bg,
          }}
          title={`${theme} theme`}
        >
          <span
            className="text-xs font-bold"
            style={{ color: themes[theme].text }}
          >
            N
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export default DynamicFavicon;
