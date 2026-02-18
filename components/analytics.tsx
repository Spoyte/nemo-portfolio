"use client";

import { useEffect, useState } from "react";

export function Analytics() {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Simulate visitor count with localStorage
    const stored = localStorage.getItem("visitorCount");
    const count = stored ? parseInt(stored, 10) : Math.floor(Math.random() * 10000) + 5000;
    
    if (!stored) {
      localStorage.setItem("visitorCount", count.toString());
    }
    
    setVisitorCount(count);

    // Update footer visitor count
    const footerCount = document.getElementById("visitor-count");
    if (footerCount) {
      footerCount.textContent = `${count.toLocaleString()} visitors`;
    }
  }, []);

  return null;
}
