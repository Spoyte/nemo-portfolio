"use client";

import { motion } from "framer-motion";
import { 
  Monitor, 
  Keyboard, 
  Mouse, 
  Headphones, 
  Coffee,
  Smartphone,
  Wifi,
  Zap,
  Code2,
  Terminal,
  Figma,
  Github,
  Chrome,
  Slack,
  Music,
  Camera,
  Gamepad2,
  Watch,
  Backpack,
  Glasses
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/tilt-card";

const categories = [
  {
    id: "desk",
    name: "Desk Setup",
    icon: Monitor,
    items: [
      {
        name: "MacBook Pro 16\"",
        description: "M3 Max, 36GB RAM - My primary development machine",
        icon: Monitor,
        tags: ["Primary", "Development"],
      },
      {
        name: "LG UltraFine 5K",
        description: "27\" 5K Display for crisp code and design work",
        icon: Monitor,
        tags: ["Display"],
      },
      {
        name: "Keychron Q1 Pro",
        description: "Custom mechanical keyboard with Gateron Brown switches",
        icon: Keyboard,
        tags: ["Input"],
      },
      {
        name: "Logitech MX Master 3S",
        description: "Ergonomic mouse with gesture controls",
        icon: Mouse,
        tags: ["Input"],
      },
      {
        name: "CalDigit TS4",
        description: "Thunderbolt 4 Dock for all my peripherals",
        icon: Zap,
        tags: ["Connectivity"],
      },
    ],
  },
  {
    id: "audio",
    name: "Audio",
    icon: Headphones,
    items: [
      {
        name: "Sony WH-1000XM5",
        description: "Noise-canceling headphones for deep focus",
        icon: Headphones,
        tags: ["Headphones", "Focus"],
      },
      {
        name: "AirPods Pro 2",
        description: "For calls and quick listening sessions",
        icon: Headphones,
        tags: ["Earbuds", "Calls"],
      },
      {
        name: "Elgato Wave:3",
        description: "USB microphone for clear voice calls",
        icon: MicIcon,
        tags: ["Microphone"],
      },
    ],
  },
  {
    id: "software",
    name: "Software",
    icon: Code2,
    items: [
      {
        name: "Cursor",
        description: "AI-powered code editor - my daily driver",
        icon: Code2,
        tags: ["Editor", "AI"],
      },
      {
        name: "Warp",
        description: "Modern Rust-based terminal with AI features",
        icon: Terminal,
        tags: ["Terminal"],
      },
      {
        name: "Figma",
        description: "Design and prototyping tool",
        icon: Figma,
        tags: ["Design"],
      },
      {
        name: "Raycast",
        description: "Spotlight replacement with extensions",
        icon: Zap,
        tags: ["Productivity"],
      },
      {
        name: "Arc Browser",
        description: "The browser that organizes my internet",
        icon: Chrome,
        tags: ["Browser"],
      },
    ],
  },
  {
    id: "mobile",
    name: "Mobile & Wearables",
    icon: Smartphone,
    items: [
      {
        name: "iPhone 15 Pro",
        description: "Daily driver for communication and quick tasks",
        icon: Smartphone,
        tags: ["Phone"],
      },
      {
        name: "Apple Watch Ultra 2",
        description: "Fitness tracking and notifications",
        icon: Watch,
        tags: ["Wearable"],
      },
      {
        name: "Kindle Paperwhite",
        description: "For reading technical books and fiction",
        icon: BookIcon,
        tags: ["Reading"],
      },
    ],
  },
  {
    id: "other",
    name: "Other Gear",
    icon: Backpack,
    items: [
      {
        name: "Peak Design Everyday Backpack",
        description: "Perfect for carrying tech to coffee shops",
        icon: Backpack,
        tags: ["Bag"],
      },
      {
        name: "Fujifilm X100V",
        description: "For capturing moments and creative photography",
        icon: Camera,
        tags: ["Camera"],
      },
      {
        name: "Blue Light Glasses",
        description: "Protecting my eyes during long coding sessions",
        icon: Glasses,
        tags: ["Health"],
      },
      {
        name: "Hydro Flask",
        description: "Staying hydrated is crucial for focus",
        icon: Coffee,
        tags: ["Health"],
      },
    ],
  },
];

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

export default function UsesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">My Setup</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">/uses</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The tools, gear, and software I use daily to build things and stay productive.
            Inspired by <a href="https://uses.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">uses.tech</a>.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((category, categoryIndex) => (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * categoryIndex }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * itemIndex + 0.1 * categoryIndex }}
                  >
                    <TiltCard tiltAmount={5}>
                      <Card className="h-full hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-muted">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold mb-1">{item.name}</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {item.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Last updated: February 2026 • Some links may be affiliate links
          </p>
        </motion.div>
      </div>
    </div>
  );
}
