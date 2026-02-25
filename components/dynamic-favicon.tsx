"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// SVG favicon data URLs for different states
const favicons = {
  default: {
    light: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🦑</text></svg>`,
    dark: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🦑</text></svg>`,
  },
  home: {
    light: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏠</text></svg>`,
    dark: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏠</text></svg>`,
  },
  about: {
    light: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">👤</text></svg>`,
    dark: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">👤</text></svg>`,
  },
  projects: {
    light: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💼</text></svg>`,
    dark: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💼</text></svg>`,
  },
  blog: {
    light: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📝</text></svg>`,
    dark: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📝</text></svg>`,
  },
  contact: {
    light: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✉️</text></svg>`,
    dark: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✉️</text></svg>`,
  },
  art: {
    light: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎨</text></svg>`,
    dark: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎨</text></svg>`,
  },
  // Time-based favicons
  morning: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌅</text></svg>`,
  afternoon: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">☀️</text></svg>`,
  evening: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌆</text></svg>`,
  night: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌙</text></svg>`,
};

export function DynamicFavicon() {
  const pathname = usePathname();
  const [favicon, setFavicon] = useState(favicons.default.light);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update favicon based on route
  useEffect(() => {
    if (!mounted) return;

    let newFavicon = favicons.default.light;

    // Route-based favicon
    if (pathname === "/") {
      newFavicon = favicons.home.light;
    } else if (pathname.includes("about")) {
      newFavicon = favicons.about.light;
    } else if (pathname.includes("project")) {
      newFavicon = favicons.projects.light;
    } else if (pathname.includes("blog")) {
      newFavicon = favicons.blog.light;
    } else if (pathname.includes("contact")) {
      newFavicon = favicons.contact.light;
    } else if (pathname.includes("art")) {
      newFavicon = favicons.art.light;
    }

    setFavicon(newFavicon);
    updateFavicon(newFavicon);
  }, [pathname, mounted]);

  // Time-based favicon updates
  useEffect(() => {
    if (!mounted) return;

    const updateTimeBasedFavicon = () => {
      const hour = new Date().getHours();
      let timeFavicon = favicons.morning;

      if (hour >= 5 && hour < 12) {
        timeFavicon = favicons.morning;
      } else if (hour >= 12 && hour < 17) {
        timeFavicon = favicons.afternoon;
      } else if (hour >= 17 && hour < 21) {
        timeFavicon = favicons.evening;
      } else {
        timeFavicon = favicons.night;
      }

      // Only update if on home page (as a subtle touch)
      if (pathname === "/") {
        updateFavicon(timeFavicon);
      }
    };

    updateTimeBasedFavicon();
    const interval = setInterval(updateTimeBasedFavicon, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [pathname, mounted]);

  const updateFavicon = (href: string) => {
    // Remove existing favicons
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach((f) => f.remove());

    // Add new favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = href;
    document.head.appendChild(link);

    // Also add apple touch icon
    const appleLink = document.createElement("link");
    appleLink.rel = "apple-touch-icon";
    appleLink.href = href;
    document.head.appendChild(appleLink);
  };

  // Handle visibility change (show notification badge when tab is hidden)
  useEffect(() => {
    if (!mounted) return;

    let notificationCount = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Simulate notification (in real app, this would be actual notifications)
        notificationCount++;
        if (notificationCount > 0) {
          const badgeFavicon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="80" cy="20" r="15" fill="red"/><text y=".9em" font-size="90">🦑</text></svg>`;
          updateFavicon(badgeFavicon);
        }
      } else {
        notificationCount = 0;
        // Reset to current route favicon
        const event = new Event("popstate");
        window.dispatchEvent(event);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [mounted]);

  return null; // This component doesn't render anything visible
}
