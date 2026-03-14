"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Copy,
  Check,
  RefreshCw,
  Hash,
  Lock,
  Palette,
  Code,
  Type,
  Calculator,
  Clock,
  Calendar,
  FileJson,
  Image,
  Link,
  Trash2,
  Download,
  Sparkles,
  Zap,
  Shield,
  Terminal,
  Search,
  ChevronRight,
  Star,
  Clock3,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Utility Functions
const generatePassword = (length: number, options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }) => {
  const chars = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };
  let charset = "";
  if (options.uppercase) charset += chars.uppercase;
  if (options.lowercase) charset += chars.lowercase;
  if (options.numbers) charset += chars.numbers;
  if (options.symbols) charset += chars.symbols;
  
  if (!charset) return "";
  
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const generateLoremIpsum = (paragraphs: number) => {
  const words = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum"
  ];
  
  const result = [];
  for (let p = 0; p < paragraphs; p++) {
    const sentences = [];
    for (let s = 0; s < 5; s++) {
      const sentenceLength = Math.floor(Math.random() * 10) + 10;
      const sentenceWords = [];
      for (let w = 0; w < sentenceLength; w++) {
        sentenceWords.push(words[Math.floor(Math.random() * words.length)]);
      }
      sentences.push(sentenceWords.join(" ") + ".");
    }
    result.push(sentences.join(" "));
  }
  return result.join("\n\n");
};

const generateColorPalette = (baseHue: number) => {
  return Array.from({ length: 5 }, (_, i) => {
    const hue = (baseHue + i * 30) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  });
};

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Components
function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setPassword(generatePassword(length, options));
  }, [length, options]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={password}
          readOnly
          className="font-mono text-lg"
          type="text"
        />
        <Button onClick={copyToClipboard} variant="outline" size="icon">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button onClick={generate} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Length: {length}</label>
        <Slider
          value={[length]}
          onValueChange={([v]) => setLength(v)}
          min={8}
          max={64}
          step={1}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(options).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm capitalize">{key}</span>
            <Switch
              checked={value}
              onCheckedChange={(checked) =>
                setOptions((prev) => ({ ...prev, [key]: checked }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setOutput(generateLoremIpsum(paragraphs));
  }, [paragraphs]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium">Paragraphs: {paragraphs}</label>
          <Slider
            value={[paragraphs]}
            onValueChange={([v]) => setParagraphs(v)}
            min={1}
            max={10}
            step={1}
          />
        </div>
        <Button onClick={generate} variant="outline" size="icon" className="mt-5">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Textarea
        value={output}
        readOnly
        className="min-h-[200px] font-serif"
      />

      <Button onClick={copyToClipboard} className="w-full">
        {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
        Copy to Clipboard
      </Button>
    </div>
  );
}

function ColorPaletteGenerator() {
  const [hue, setHue] = useState(220);
  const [colors, setColors] = useState<string[]>([]);

  const generate = useCallback(() => {
    setColors(generateColorPalette(hue));
  }, [hue]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color}`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Base Hue: {hue}°</label>
        <Slider
          value={[hue]}
          onValueChange={([v]) => setHue(v)}
          min={0}
          max={360}
          step={1}
        />
      </div>

      <div className="flex gap-2 h-32 rounded-xl overflow-hidden">
        {colors.map((color, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyColor(color)}
            className="flex-1 flex items-end justify-center pb-2 text-white text-xs font-mono transition-all"
            style={{ backgroundColor: color }}
          >
            {color}
          </motion.button>
        ))}
      </div>

      <Button onClick={generate} variant="outline" className="w-full">
        <RefreshCw className="h-4 w-4 mr-2" />
        Generate New Palette
      </Button>
    </div>
  );
}

function TextConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"slug" | "base64" | "upper" | "lower" | "reverse">("slug");

  const convert = useCallback(() => {
    switch (mode) {
      case "slug":
        setOutput(slugify(input));
        break;
      case "base64":
        setOutput(btoa(input));
        break;
      case "upper":
        setOutput(input.toUpperCase());
        break;
      case "lower":
        setOutput(input.toLowerCase());
        break;
      case "reverse":
        setOutput(input.split("").reverse().join(""));
        break;
    }
  }, [input, mode]);

  useEffect(() => {
    convert();
  }, [convert]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied!");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["slug", "base64", "upper", "lower", "reverse"] as const).map((m) => (
          <Button
            key={m}
            variant={mode === m ? "default" : "outline"}
            size="sm"
            onClick={() => setMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </Button>
        ))}
      </div>

      <Textarea
        placeholder="Enter text to convert..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="flex gap-2">
        <Input value={output} readOnly className="font-mono" />
        <Button onClick={copyOutput} variant="outline" size="icon">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function WorldClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { name: "San Francisco", zone: "America/Los_Angeles", offset: -8 },
    { name: "New York", zone: "America/New_York", offset: -5 },
    { name: "London", zone: "Europe/London", offset: 0 },
    { name: "Paris", zone: "Europe/Paris", offset: 1 },
    { name: "Tokyo", zone: "Asia/Tokyo", offset: 9 },
    { name: "Sydney", zone: "Australia/Sydney", offset: 11 },
  ];

  const getTimeInZone = (offset: number) => {
    const utc = time.getTime() + time.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + 3600000 * offset);
    return cityTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cities.map((city) => (
        <Card key={city.name} className="p-4 text-center">
          <Globe className="h-5 w-5 mx-auto mb-2 text-primary" />
          <p className="text-xs text-muted-foreground">{city.name}</p>
          <p className="text-xl font-mono font-bold">{getTimeInZone(city.offset)}</p>
        </Card>
      ))}
    </div>
  );
}

function UnitConverter() {
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState("px");
  const [toUnit, setToUnit] = useState("rem");

  const conversions: Record<string, Record<string, number>> = {
    px: { rem: 0.0625, em: 0.0625, pt: 0.75, cm: 0.026458, in: 0.010416 },
    rem: { px: 16, em: 1, pt: 12, cm: 0.423333, in: 0.166667 },
    em: { px: 16, rem: 1, pt: 12, cm: 0.423333, in: 0.166667 },
    pt: { px: 1.333333, rem: 0.083333, em: 0.083333, cm: 0.035277, in: 0.013888 },
  };

  const result = fromUnit === toUnit ? value : value * (conversions[fromUnit]?.[toUnit] || 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          />
        </div>
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background"
        >
          {Object.keys(conversions).map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center">
        <ChevronRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input value={result.toFixed(4)} readOnly className="font-mono" />
        </div>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background"
        >
          {Object.keys(conversions).map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

const tools = [
  {
    id: "password",
    name: "Password Generator",
    description: "Generate secure, random passwords",
    icon: Lock,
    component: PasswordGenerator,
    category: "security",
  },
  {
    id: "lorem",
    name: "Lorem Ipsum",
    description: "Generate placeholder text",
    icon: Type,
    component: LoremIpsumGenerator,
    category: "content",
  },
  {
    id: "colors",
    name: "Color Palette",
    description: "Generate harmonious color schemes",
    icon: Palette,
    component: ColorPaletteGenerator,
    category: "design",
  },
  {
    id: "text",
    name: "Text Converter",
    description: "Convert text formats",
    icon: Code,
    component: TextConverter,
    category: "text",
  },
  {
    id: "clock",
    name: "World Clock",
    description: "Time across the globe",
    icon: Clock3,
    component: WorldClock,
    category: "utility",
  },
  {
    id: "converter",
    name: "Unit Converter",
    description: "CSS unit conversions",
    icon: Calculator,
    component: UnitConverter,
    category: "design",
  },
];

export default function DevToolsPage() {
  const [activeTool, setActiveTool] = useState(tools[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ActiveComponent = tools.find((t) => t.id === activeTool)?.component || tools[0].component;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Wrench className="w-4 h-4" />
            <span className="text-sm font-medium">Developer Utilities</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dev<span className="text-gradient-animated">Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of handy utilities for developers. Generate passwords, convert text, create color palettes, and more.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Tool List */}
          <div className="lg:col-span-1 space-y-2">
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                  activeTool === tool.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50"
                }`}
              >
                <tool.icon className="h-5 w-5" />
                <div className="flex-1">
                  <p className="font-medium">{tool.name}</p>
                  <p className={`text-xs ${activeTool === tool.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {tool.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </button>
            ))}
          </div>

          {/* Active Tool */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                {(() => {
                  const tool = tools.find((t) => t.id === activeTool);
                  if (!tool) return null;
                  const Icon = tool.icon;
                  return (
                    <>
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{tool.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardHeader>
            <CardContent>
              <ActiveComponent />
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Tools Available", value: tools.length, icon: Wrench },
            { label: "Categories", value: new Set(tools.map((t) => t.category)).size, icon: Hash },
            { label: "Time Saved", value: "∞", icon: Clock },
            { label: "Coffees Needed", value: "0", icon: Sparkles },
          ].map((stat) => (
            <Card key={stat.label} className="p-4 text-center">
              <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
