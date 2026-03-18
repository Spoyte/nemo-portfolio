"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Copy,
  Check,
  RefreshCw,
  Hash,
  Key,
  QrCode,
  Palette,
  Type,
  Image,
  Code,
  Clock,
  Globe,
  Binary,
  Fingerprint,
  Sparkles,
  Wand2,
  Download,
  Trash2,
  Save,
  FileJson,
  Braces,
  AlignLeft,
  Minimize2,
  Maximize2,
  Search,
  Replace,
  Regex,
  CaseSensitive,
  CaseInsensitive,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  Wifi,
  Battery,
  Cpu,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Mic,
  Camera,
  Video,
  Phone,
  Mail,
  MessageCircle,
  Bell,
  Heart,
  Star,
  ThumbsUp,
  Share2,
  Bookmark,
  Flag,
  MapPin,
  Navigation,
  Compass,
  Crosshair,
  Target,
  Zap,
  Activity,
  TrendingUp,
  BarChart2,
  PieChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Radar,
  Gauge,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun as SunIcon,
  Moon as MoonIcon,
  Sunrise,
  Sunset,
  Umbrella,
  Snowflake,
  Flame,
  ThermometerSun,
  ThermometerSnowflake,
  Eye as EyeIcon,
  Glasses,
  Scan,
  ScanLine,
  ScanFace,
  Fingerprint as FingerprintIcon,
  BadgeCheck,
  Verified,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Diamond,
  Coins,
  Banknote,
  CreditCard,
  Wallet,
  PiggyBank,
  Receipt,
  FileText,
  FileCode,
  FileJson as FileJsonIcon,
  FileType,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FilePieChart,
  FileBarChart,
  FileLineChart,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderGit,
  FolderGit2,
  FolderKanban,
  FolderTree,
  FolderSearch,
  FolderLock,
  FolderHeart,
  FolderX,
  FolderSync,
  FolderCog,
  FolderClock,
  FolderKey,
  FolderInput,
  FolderOutput,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Utility Functions
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generatePassword = (length: number, options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }) => {
  const chars = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  let validChars = "";
  if (options.uppercase) validChars += chars.uppercase;
  if (options.lowercase) validChars += chars.lowercase;
  if (options.numbers) validChars += chars.numbers;
  if (options.symbols) validChars += chars.symbols;

  if (!validChars) return "";

  let password = "";
  for (let i = 0; i < length; i++) {
    password += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }
  return password;
};

const formatJSON = (json: string) => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return null;
  }
};

const minifyJSON = (json: string) => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed);
  } catch {
    return null;
  }
};

const base64Encode = (str: string) => btoa(str);
const base64Decode = (str: string) => {
  try {
    return atob(str);
  } catch {
    return null;
  }
};

const urlEncode = (str: string) => encodeURIComponent(str);
const urlDecode = (str: string) => decodeURIComponent(str);

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
    const numSentences = Math.floor(Math.random() * 3) + 3;
    for (let s = 0; s < numSentences; s++) {
      const numWords = Math.floor(Math.random() * 10) + 10;
      const sentence = [];
      for (let w = 0; w < numWords; w++) {
        sentence.push(words[Math.floor(Math.random() * words.length)]);
      }
      sentences.push(sentence.join(" ") + ".");
    }
    result.push(sentences.join(" "));
  }
  return result.join("\n\n");
};

// Components
function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const newUuids = Array.from({ length: count }, generateUUID);
    setUuids(newUuids);
  };

  const copyToClipboard = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          className="w-24"
        />
        <Button onClick={generate}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate
        </Button>
      </div>

      <ScrollArea className="h-[300px] border rounded-lg p-4">
        <div className="space-y-2">
          {uuids.map((uuid, index) => (
            <motion.div
              key={uuid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-muted rounded-lg group hover:bg-muted/80"
            >
              <code className="text-sm font-mono">{uuid}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(uuid, index)}
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

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

  const generate = () => {
    const newPassword = generatePassword(length, options);
    setPassword(newPassword);
  };

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    generate();
  }, [length, options]);

  const strength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Input
              value={password}
              readOnly
              className="font-mono text-lg pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button onClick={generate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Strength</span>
            <span className={strength >= 3 ? "text-green-500" : "text-yellow-500"}>
              {strengthLabels[strength]}
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : "bg-muted"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Length: {length}</label>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(options).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm capitalize">{key}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const format = () => {
    const formatted = formatJSON(input);
    if (formatted) {
      setOutput(formatted);
      setError(null);
    } else {
      setError("Invalid JSON");
    }
  };

  const minify = () => {
    const minified = minifyJSON(input);
    if (minified) {
      setOutput(minified);
      setError(null);
    } else {
      setError("Invalid JSON");
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Input</label>
            <Button variant="ghost" size="sm" onClick={() => setInput("")}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Output</label>
            <Button variant="ghost" size="sm" onClick={copyOutput} disabled={!output}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex gap-2">
        <Button onClick={format}>
          <AlignLeft className="w-4 h-4 mr-2" />
          Format
        </Button>
        <Button onClick={minify} variant="outline">
          <Minimize2 className="w-4 h-4 mr-2" />
          Minify
        </Button>
      </div>
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const process = () => {
    if (mode === "encode") {
      setOutput(base64Encode(input));
    } else {
      const decoded = base64Decode(input);
      setOutput(decoded || "Invalid Base64");
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={mode === "encode" ? "default" : "outline"}
          onClick={() => setMode("encode")}
        >
          <Lock className="w-4 h-4 mr-2" />
          Encode
        </Button>
        <Button
          variant={mode === "decode" ? "default" : "outline"}
          onClick={() => setMode("decode")}
        >
          <Unlock className="w-4 h-4 mr-2" />
          Decode
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Input</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
          className="min-h-[100px]"
        />
      </div>

      <Button onClick={process}>
        <Wand2 className="w-4 h-4 mr-2" />
        {mode === "encode" ? "Encode" : "Decode"}
      </Button>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Output</label>
            <Button variant="ghost" size="sm" onClick={copyOutput}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Textarea value={output} readOnly className="min-h-[100px] font-mono" />
        </div>
      )}
    </div>
  );
}

function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(generateLoremIpsum(paragraphs));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Paragraphs:</label>
          <Input
            type="number"
            min={1}
            max={20}
            value={paragraphs}
            onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
            className="w-20"
          />
        </div>
        <Button onClick={generate}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate
        </Button>
      </div>

      <div className="relative">
        <Textarea
          value={output}
          readOnly
          className="min-h-[300px]"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={copyToClipboard}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function ColorConverter() {
  const [hex, setHex] = useState("#dc2626");
  const [rgb, setRgb] = useState({ r: 220, g: 38, b: 38 });
  const [hsl, setHsl] = useState({ h: 0, s: 79, l: 50 });

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const handleHexChange = (value: string) => {
    setHex(value);
    const rgb = hexToRgb(value);
    if (rgb) {
      setRgb(rgb);
      setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
    }
  };

  const handleRgbChange = (key: keyof typeof rgb, value: number) => {
    const newRgb = { ...rgb, [key]: value };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  return (
    <div className="space-y-6">
      <div
        className="h-32 rounded-xl border-2 border-border"
        style={{ backgroundColor: hex }}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">HEX</label>
          <Input
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">RGB</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(rgb).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase">{key}</label>
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={value}
                  onChange={(e) => handleRgbChange(key as keyof typeof rgb, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">HSL</label>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">H</label>
              <Input value={hsl.h} readOnly className="bg-muted" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">S</label>
              <Input value={hsl.s + "%"} readOnly className="bg-muted" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">L</label>
              <Input value={hsl.l + "%"} readOnly className="bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function DevToolsPage() {
  const tools = [
    {
      id: "uuid",
      label: "UUID",
      icon: Fingerprint,
      component: UUIDGenerator,
      description: "Generate random UUIDs",
    },
    {
      id: "password",
      label: "Password",
      icon: Key,
      component: PasswordGenerator,
      description: "Generate secure passwords",
    },
    {
      id: "json",
      label: "JSON",
      icon: FileJson,
      component: JSONFormatter,
      description: "Format and minify JSON",
    },
    {
      id: "base64",
      label: "Base64",
      icon: Binary,
      component: Base64Tool,
      description: "Encode/decode Base64",
    },
    {
      id: "lorem",
      label: "Lorem Ipsum",
      icon: Type,
      component: LoremIpsumGenerator,
      description: "Generate placeholder text",
    },
    {
      id: "color",
      label: "Color",
      icon: Palette,
      component: ColorConverter,
      description: "Convert color formats",
    },
  ];

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
            <span className="text-sm font-medium">Developer Utilities</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dev<span className="text-gradient-animated">Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of handy utilities for developers. Format JSON, generate UUIDs,
            convert colors, and more.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="uuid" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
              {tools.map((tool) => (
                <TabsTrigger key={tool.id} value={tool.id} className="flex flex-col items-center gap-1 py-3">
                  <tool.icon className="w-5 h-5" />
                  <span className="text-xs hidden md:block">{tool.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {tools.map((tool) => {
              const Component = tool.component;
              return (
                <TabsContent key={tool.id} value={tool.id}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <tool.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{tool.label}</CardTitle>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Component />
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Keyboard Shortcuts</h3>
                  <p className="text-muted-foreground">
                    Press <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl+K</kbd> to open the command palette
                    from anywhere on the site.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Ctrl+K</Badge>
                  <Badge variant="secondary">⌘+K</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
