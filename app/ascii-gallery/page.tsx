"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Play, 
  Pause, 
  Copy, 
  Check,
  Download,
  Shuffle,
  Sparkles,
  Monitor
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ASCII Art Collection
const ASCII_ARTS = [
  {
    id: "cat",
    name: "Curious Cat",
    category: "animals",
    frames: [
      `
    /\_____/\\
   /  o   o  \\
  ( ==  ^  == )
   )         (
  (           )
 ( (  )   (  ) )
(__(__)___(__)__)
      `,
      `
    /\_____/\\
   /  -   o  \\
  ( ==  ^  == )
   )         (
  (           )
 ( (  )   (  ) )
(__(__)___(__)__)
      `,
      `
    /\_____/\\
   /  o   -  \\
  ( ==  ^  == )
   )         (
  (           )
 ( (  )   (  ) )
(__(__)___(__)__)
      `,
    ],
    speed: 500,
  },
  {
    id: "coffee",
    name: "Morning Coffee",
    category: "objects",
    frames: [
      `
      )  (
     (   )
      )  (
    _______)_
 .-'---------|  
( C|/\/\/\/\/|
 '-./\/\/\/\/|
   '_________'
    '-------'
      `,
      `
      )  (
     (   )
      )  (
    _______)_
 .-'---------|  
( C|/\/\/\/\/|
 '-./\/\/\/\/|
   '_________'
    '-------'
       ~
      `,
      `
      )  (
     (   )
      )  (
    _______)_
 .-'---------|  
( C|/\/\/\/\/|
 '-./\/\/\/\/|
   '_________'
    '-------'
      ~ ~
      `,
    ],
    speed: 600,
  },
  {
    id: "computer",
    name: "Retro Computer",
    category: "tech",
    frames: [
      `
    +------------------+
    |  [][][][][][][]  |
    |  [][][][][][][]  |
    |  [][][][][][][]  |
    |                  |
    |    NEMO OS v1    |
    +------------------+
           |    |
      _____|____|_____
     |                |
     +----------------+
      `,
      `
    +------------------+
    |  [][][][][][][]  |
    |  [][][][][][][]  |
    |  [][][][][][][]  |
    |                  |
    |    NEMO OS v1    |
    +------------------+
           |    |
      _____|____|_____
     |                |
     +----------------+
      `,
    ],
    speed: 800,
  },
  {
    id: "rocket",
    name: "Space Rocket",
    category: "space",
    frames: [
      `
       |
      / \\
     / _ \\
    |.o '.|
    |'._.'|
    |     |
   /|  _  |\\
  (_| (_) |_)
    |     |
   /       \\
   \\_______/
      `,
      `
       |
      / \\
     / _ \\
    |.o '.|
    |'._.'|
    |     |
   /|  _  |\\
  (_| (_) |_)
    |     |
   /       \\
   \\_______/
      | |
      `,
      `
       |
      / \\
     / _ \\
    |.o '.|
    |'._.'|
    |     |
   /|  _  |\\
  (_| (_) |_)
    |     |
   /       \\
   \\_______/
     | | |
      `,
    ],
    speed: 400,
  },
  {
    id: "octopus",
    name: "Friendly Octopus",
    category: "animals",
    frames: [
      `
    .---.
   / o o \\
   |  <  |
   \\  -  /
    '---'
   /| | |\\
  (_| |_|_)
   /_   _\\
  /  | |  \\
      `,
      `
    .---.
   / o o \\
   |  <  |
   \\  -  /
    '---'
   /| | |\\
  (_| |_|_)
  /_     _\\
    |   |
      `,
    ],
    speed: 700,
  },
  {
    id: "sun",
    name: "Sunny Day",
    category: "nature",
    frames: [
      `
      \\   |   /
       \\  |  /
   -----     -----
    \    .-.    /
     \  (   )  /
      \  '-'  /
   -----     -----
       /  |  \\
      /   |   \\
      `,
      `
      |   |   |
      \\  |  /
   -----     -----
    \    .-.    /
     \  (   )  /
      \  '-'  /
   -----     -----
      /  |  \\
      |   |   |
      `,
    ],
    speed: 500,
  },
  {
    id: "mushroom",
    name: "Mushroom",
    category: "nature",
    frames: [
      `
        ____
      /      \\
     |  o  o  |
      \\  \/  /
       '----'
         ||
         ||
      ___||___
     /   ||   \\
    '----------'
      `,
      `
        ____
      /      \\
     |  -  o  |
      \\  \/  /
       '----'
         ||
         ||
      ___||___
     /   ||   \\
    '----------'
      `,
    ],
    speed: 600,
  },
  {
    id: "ghost",
    name: "Friendly Ghost",
    category: "fantasy",
    frames: [
      `
     .-"""""-.
   .'         '.
  /   O     O   \\
 |               |
 |               |
  \\  \\_____/  /
   \\         /
    |       |
    |       |
   /         \\
  '-----------'
      `,
      `
     .-"""""-.
   .'         '.
  /   O     O   \\
 |               |
 |               |
  \\  \\_____/  /
   \\         /
    |       |
    |       |
   /  ^   ^  \\
  '-----------'
      `,
    ],
    speed: 500,
  },
];

// Static ASCII art (non-animated)
const STATIC_ARTS = [
  {
    id: "banner",
    name: "Welcome Banner",
    category: "decorations",
    content: `
╔══════════════════════════════════════╗
║                                      ║
║   ██╗  ██╗███████╗██╗     ██╗      ║
║   ██║  ██║██╔════╝██║     ██║      ║
║   ███████║█████╗  ██║     ██║      ║
║   ██╔══██║██╔══╝  ██║     ██║      ║
║   ██║  ██║███████╗███████╗███████╗ ║
║   ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ║
║                                      ║
╚══════════════════════════════════════╝
    `,
  },
  {
    id: "divider",
    name: "Fancy Divider",
    category: "decorations",
    content: `
≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋
✧･ﾟ: *✧･ﾟ:* 　*✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*
≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋
    `,
  },
  {
    id: "keyboard",
    name: "Keyboard",
    category: "tech",
    content: `
┌─────────────────────────────────────┐
│ Esc │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │
├─────┴───┴───┴───┴───┴───┴───┴───┴───┤
│ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │
├─────┴───┴───┴───┴───┴───┴───┴───┴───┤
│ Caps │ A │ S │ D │ F │ G │ H │ J │ K │
├──────┴───┴───┴───┴───┴───┴───┴───┴──┤
│ Shift │ Z │ X │ C │ V │ B │ N │ M │
└───────┴───┴───┴───┴───┴───┴───┴─────┘
    `,
  },
];

function AnimatedASCII({ art }: { art: typeof ASCII_ARTS[0] }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % art.frames.length);
    }, art.speed);

    return () => clearInterval(interval);
  }, [isPlaying, art.frames.length, art.speed]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(art.frames[currentFrame]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{art.name}</CardTitle>
            <Badge variant="secondary" className="text-xs">{art.category}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <pre className="font-mono text-xs sm:text-sm leading-none text-center overflow-x-auto bg-slate-900 text-green-400 p-4 rounded-lg">
          <AnimatePresence mode="wait">
            <motion.code
              key={currentFrame}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {art.frames[currentFrame]}
            </motion.code>
          </AnimatePresence>
        </pre>
      </CardContent>
    </Card>
  );
}

function StaticASCII({ art }: { art: typeof STATIC_ARTS[0] }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(art.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{art.name}</CardTitle>
            <Badge variant="secondary" className="text-xs">{art.category}</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <pre className="font-mono text-xs sm:text-sm leading-none text-center overflow-x-auto bg-slate-900 text-blue-400 p-4 rounded-lg">
          <code>{art.content}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

export default function ASCIIGalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(ASCII_ARTS.map(a => a.category)))];

  const filteredAnimated = activeCategory === "all" 
    ? ASCII_ARTS 
    : ASCII_ARTS.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-medium">Text Art Gallery</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            ASCII Gallery
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of animated and static ASCII art. 
            Retro aesthetics meet modern web animations.
          </p>
        </motion.div>

        <Tabs defaultValue="animated" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="animated" className="gap-2">
              <Play className="h-4 w-4" />
              Animated
            </TabsTrigger>
            <TabsTrigger value="static" className="gap-2">
              <Monitor className="h-4 w-4" />
              Static
            </TabsTrigger>
          </TabsList>

          <TabsContent value="animated" className="mt-8">
            {/* Category filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Animated art grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimated.map((art, index) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedASCII art={art} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="static" className="mt-8">
            {/* Static art grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {STATIC_ARTS.map((art, index) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StaticASCII art={art} />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 border-white/10">
            <CardContent className="p-8">
              <Sparkles className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">About ASCII Art</h3>
              <p className="text-muted-foreground">
                ASCII art is a graphic design technique that uses computers for presentation 
                and consists of pictures pieced together from the 95 printable characters 
                defined by the ASCII Standard. It predates the internet and remains a 
                beloved form of digital expression.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
