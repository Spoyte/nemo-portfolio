#!/usr/bin/env node
/**
 * Gallery Statistics Demo
 *
 * Run this to see portfolio analytics in the console.
 * Usage: node scripts/gallery-stats.js
 */

// Simple test of the statistics module
const metadata = {
  "fourier-synthesis": {
    category: "mathematical",
    complexity: "complex",
    tags: ["animated", "geometric", "ordered", "colorful", "detailed", "futuristic"],
    created: "2024-02-27",
  },
  "prism-dispersion": {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "geometric", "ordered", "colorful", "detailed"],
    created: "2024-02-26",
  },
  "wave-tank": {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "organic", "colorful", "detailed"],
    created: "2024-02-27",
  },
  "slime-mold": {
    category: "natural",
    complexity: "complex",
    tags: ["animated", "organic", "nature", "colorful", "detailed"],
    created: "2024-02-27",
  },
  "solar-flare": {
    category: "physics",
    complexity: "expert",
    tags: ["animated", "chaotic", "colorful", "detailed", "futuristic"],
    created: "2024-02-27",
  },
};

function formatStats() {
  const ids = Object.keys(metadata);
  const total = ids.length;

  // Category stats
  const categoryMap = new Map();
  ids.forEach((id) => {
    const cat = metadata[id].category;
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });

  // Complexity stats
  const complexityMap = new Map();
  ids.forEach((id) => {
    const comp = metadata[id].complexity;
    complexityMap.set(comp, (complexityMap.get(comp) || 0) + 1);
  });

  // Tag stats
  const tagMap = new Map();
  ids.forEach((id) => {
    metadata[id].tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  // Animated count
  let animated = 0;
  ids.forEach((id) => {
    if (metadata[id].tags.includes("animated")) animated++;
  });

  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║           GENERATIVE ART PORTFOLIO STATISTICS                ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log(`║  Total Pieces: ${total.toString().padEnd(47)} ║`);
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║  BY CATEGORY                                                 ║");

  categoryMap.forEach((count, cat) => {
    const pct = Math.round((count / total) * 100);
    const bar = "█".repeat(Math.round(pct / 5)).padEnd(20);
    console.log(`║  ${cat.padEnd(12)} ${count.toString().padStart(2)} (${pct.toString().padStart(2)}%) ${bar} ║`);
  });

  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║  BY COMPLEXITY                                               ║");

  complexityMap.forEach((count, comp) => {
    const pct = Math.round((count / total) * 100);
    const bar = "█".repeat(Math.round(pct / 5)).padEnd(20);
    console.log(`║  ${comp.padEnd(12)} ${count.toString().padStart(2)} (${pct.toString().padStart(2)}%) ${bar} ║`);
  });

  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║  ANIMATION                                                   ║");
  console.log(`║  Animated: ${animated.toString().padStart(2)}  Static: ${(total - animated).toString().padStart(2)}  (${Math.round((animated/total)*100)}% animated)       ║`);
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║  TOP TAGS                                                    ║");

  const sortedTags = Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  sortedTags.forEach(([tag, count]) => {
    const pct = Math.round((count / total) * 100);
    console.log(`║  #${tag.padEnd(15)} ${count.toString().padStart(2)} pieces (${pct}%)${"".padEnd(17)} ║`);
  });

  console.log("╚══════════════════════════════════════════════════════════════╝");
}

formatStats();
