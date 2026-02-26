"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Type,
  Code,
  Hash,
  Lock,
  Calendar,
  Clock,
  Globe,
  Copy,
  Check,
  RefreshCw,
  Download,
  Trash2,
  Save,
  Settings,
  Wand2,
  FileJson,
  Braces,
  Link,
  Image,
  QrCode,
  BarChart3,
  Calculator,
  Binary,
  Terminal,
  Sparkles,
  Search,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Shield,
  Eye,
  EyeOff,
  Shuffle,
  SortAsc,
  SortDesc,
  Filter,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  FileCode,
  Bug,
  Cpu,
  Wifi,
  Database,
  Layers,
  Box,
  GitBranch,
  Rocket,
  Target,
  Lightbulb,
  BookOpen,
  Star,
  Trophy,
  Medal,
  Award,
  Crown,
  Gem,
  Diamond,
  Heart,
  Flame,
  Thunder,
  Lightning,
  Bolt,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  Umbrella,
  Snowflake,
  Rainbow,
  Sunrise,
  Sunset,
  Star as StarIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// ==================== UTILITY FUNCTIONS ====================

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

const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["bg-red-500", "bg-red-400", "bg-yellow-400", "bg-yellow-300", "bg-green-400", "bg-green-500"];
  
  return {
    score: Math.min(score, 5),
    label: labels[Math.min(score, 5)],
    color: colors[Math.min(score, 5)],
  };
};

const formatJSON = (json: string): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  } catch {
    throw new Error("Invalid JSON");
  }
};

const minifyJSON = (json: string): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed);
  } catch {
    throw new Error("Invalid JSON");
  }
};

const escapeHTML = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const unescapeHTML = (str: string): string => {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

const base64Encode = (str: string): string => btoa(str);
const base64Decode = (str: string): string => atob(str);

const urlEncode = (str: string): string => encodeURIComponent(str);
const urlDecode = (str: string): string => decodeURIComponent(str);

const generateLoremIpsum = (paragraphs: number): string => {
  const words = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
    "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
    "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
    "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
  ];
  
  const result: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const paragraph: string[] = [];
    const sentenceCount = Math.floor(Math.random() * 3) + 3;
    for (let s = 0; s < sentenceCount; s++) {
      const wordCount = Math.floor(Math.random() * 10) + 10;
      const sentence: string[] = [];
      for (let w = 0; w < wordCount; w++) {
        sentence.push(words[Math.floor(Math.random() * words.length)]);
      }
      paragraph.push(sentence.join(" ") + ".");
    }
    result.push(paragraph.join(" "));
  }
  return result.join("\n\n");
};

// ==================== COMPONENTS ====================

// Color Palette Generator
function ColorPaletteGenerator() {
  const [colors, setColors] = useState<string[]>([
    "#dc2626",
    "#ea580c",
    "#d97706",
    "#65a30d",
    "#0891b2",
    "#2563eb",
    "#7c3aed",
    "#db2777",
  ]);
  const [harmony, setHarmony] = useState<"analogous" | "monochromatic" | "triadic" | "complementary" | "split">("analogous");

  const generatePalette = () => {
    const baseHue = Math.floor(Math.random() * 360);
    const newColors: string[] = [];
    
    switch (harmony) {
      case "analogous":
        for (let i = 0; i < 5; i++) {
          newColors.push(`hsl(${(baseHue + i * 30) % 360}, 70%, 50%)`);
        }
        break;
      case "monochromatic":
        for (let i = 0; i < 5; i++) {
          newColors.push(`hsl(${baseHue}, 70%, ${30 + i * 15}%)`);
        }
        break;
      case "triadic":
        for (let i = 0; i < 3; i++) {
          newColors.push(`hsl(${(baseHue + i * 120) % 360}, 70%, 50%)`);
        }
        break;
      case "complementary":
        newColors.push(`hsl(${baseHue}, 70%, 50%)`);
        newColors.push(`hsl(${(baseHue + 180) % 360}, 70%, 50%)`);
        break;
      case "split":
        newColors.push(`hsl(${baseHue}, 70%, 50%)`);
        newColors.push(`hsl(${(baseHue + 150) % 360}, 70%, 50%)`);
        newColors.push(`hsl(${(baseHue + 210) % 360}, 70%, 50%)`);
        break;
    }
    
    // Convert HSL to Hex
    const hslToHex = (hsl: string): string => {
      const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (!match) return "#000000";
      const h = parseInt(match[1]) / 360;
      const s = parseInt(match[2]) / 100;
      const l = parseInt(match[3]) / 100;
      
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };
    
    setColors(newColors.map(hslToHex));
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Color Palette Generator
        </CardTitle>
        <CardDescription>Generate beautiful color harmonies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={harmony} onValueChange={(v: any) => setHarmony(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select harmony type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="analogous">Analogous</SelectItem>
            <SelectItem value="monochromatic">Monochromatic</SelectItem>
            <SelectItem value="triadic">Triadic</SelectItem>
            <SelectItem value="complementary">Complementary</SelectItem>
            <SelectItem value="split">Split Complementary</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          {colors.map((color, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyColor(color)}
              className="flex-1 h-24 rounded-xl shadow-lg transition-shadow hover:shadow-xl relative group"
              style={{ backgroundColor: color }}
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 text-white font-mono text-sm rounded-xl transition-opacity">
                {color}
              </span>
            </motion.button>
          ))}
        </div>
        
        <Button onClick={generatePalette} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate New Palette
        </Button>
      </CardContent>
    </Card>
  );
}

// Password Generator
function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [strength, setStrength] = useState({ score: 0, label: "", color: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const newPassword = generatePassword(length, options);
    setPassword(newPassword);
    setStrength(calculatePasswordStrength(newPassword));
  }, [length, options]);

  const regenerate = () => {
    const newPassword = generatePassword(length, options);
    setPassword(newPassword);
    setStrength(calculatePasswordStrength(newPassword));
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Password Generator
        </CardTitle>
        <CardDescription>Generate secure passwords</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="pr-20 font-mono text-lg"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={copyPassword}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Strength</span>
            <span className={strength.color.replace("bg-", "text-")}>{strength.label}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(strength.score / 5) * 100}%` }}
              className={`h-full ${strength.color}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Length</span>
            <span>{length}</span>
          </div>
          <Slider
            value={[length]}
            onValueChange={([v]) => setLength(v)}
            min={8}
            max={64}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(options).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Switch
                id={key}
                checked={value}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, [key]: checked }))
                }
              />
              <Label htmlFor={key} className="capitalize">
                {key}
              </Label>
            </div>
          ))}
        </div>

        <Button onClick={regenerate} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate New
        </Button>
      </CardContent>
    </Card>
  );
}

// JSON Formatter
function JSONFormatter() {
  const [input, setInput] = useState('{"name": "Nemo", "role": "Developer", "skills": ["React", "TypeScript", "Node.js"]}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setOutput(formatJSON(input));
      setError("");
    } catch (e) {
      setError("Invalid JSON");
    }
  }, [input]);

  const handleMinify = () => {
    try {
      setInput(minifyJSON(input));
      toast.success("JSON minified");
    } catch {
      toast.error("Invalid JSON");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="h-5 w-5 text-primary" />
          JSON Formatter
        </CardTitle>
        <CardDescription>Format and validate JSON</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Input</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono text-sm h-[200px]"
              placeholder="Paste your JSON here..."
            />
          </div>
          <div className="space-y-2">
            <Label>Output</Label>
            <Textarea
              value={output}
              readOnly
              className={`font-mono text-sm h-[200px] ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleMinify} variant="outline" className="flex-1">
            <Minimize2 className="h-4 w-4 mr-2" />
            Minify
          </Button>
          <Button onClick={handleCopy} variant="outline" className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Base64 Encoder/Decoder
function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    try {
      if (mode === "encode") {
        setOutput(base64Encode(input));
      } else {
        setOutput(base64Decode(input));
      }
    } catch {
      setOutput("Invalid input");
    }
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Binary className="h-5 w-5 text-primary" />
          Base64 Encoder/Decoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => setMode("encode")}
            className="flex-1"
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => setMode("decode")}
            className="flex-1"
          >
            Decode
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Enter text to encode..." : "Enter base64 to decode..."}
          className="font-mono"
        />
        <div className="relative">
          <Textarea
            value={output}
            readOnly
            className="font-mono"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="absolute top-2 right-2"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Lorem Ipsum Generator
function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState("");

  useEffect(() => {
    setOutput(generateLoremIpsum(paragraphs));
  }, [paragraphs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5 text-primary" />
          Lorem Ipsum Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Paragraphs</span>
            <span>{paragraphs}</span>
          </div>
          <Slider
            value={[paragraphs]}
            onValueChange={([v]) => setParagraphs(v)}
            min={1}
            max={10}
          />
        </div>
        <div className="relative">
          <Textarea
            value={output}
            readOnly
            className="h-[200px] resize-none"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="absolute top-2 right-2"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// UUID Generator
function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => generateUUID());
    setUuids(newUuids);
  };

  const copyUUID = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    toast.success("UUID copied");
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          UUID Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Count</span>
            <span>{count}</span>
          </div>
          <Slider
            value={[count]}
            onValueChange={([v]) => setCount(v)}
            min={1}
            max={20}
          />
        </div>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {uuids.map((uuid, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted font-mono text-sm"
            >
              <span className="flex-1 truncate">{uuid}</span>
              <Button size="icon" variant="ghost" onClick={() => copyUUID(uuid)}>
                <Copy className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
        <Button onClick={generate} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate
        </Button>
      </CardContent>
    </Card>
  );
}

// CSS Unit Converter
function UnitConverter() {
  const [px, setPx] = useState(16);
  const [rem, setRem] = useState(1);
  const [base, setBase] = useState(16);

  useEffect(() => {
    setRem(px / base);
  }, [px, base]);

  useEffect(() => {
    setPx(rem * base);
  }, [rem, base]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          CSS Unit Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Base Font Size (px)</Label>
          <Input
            type="number"
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Pixels (px)</Label>
            <Input
              type="number"
              value={px}
              onChange={(e) => setPx(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>REM</Label>
            <Input
              type="number"
              step={0.1}
              value={rem.toFixed(3)}
              onChange={(e) => setRem(Number(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// HTML Entity Encoder
function HTMLEntityTool() {
  const [input, setInput] = useState("<div>Hello & Welcome</div>");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    if (mode === "encode") {
      setOutput(escapeHTML(input));
    } else {
      setOutput(unescapeHTML(input));
    }
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          HTML Entity Encoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => setMode("encode")}
            className="flex-1"
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => setMode("decode")}
            className="flex-1"
          >
            Decode
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono"
        />
        <div className="relative">
          <Textarea
            value={output}
            readOnly
            className="font-mono"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="absolute top-2 right-2"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// URL Encoder/Decoder
function URLTool() {
  const [input, setInput] = useState("https://example.com?search=hello world&page=1");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    try {
      if (mode === "encode") {
        setOutput(urlEncode(input));
      } else {
        setOutput(urlDecode(input));
      }
    } catch {
      setOutput("Invalid input");
    }
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5 text-primary" />
          URL Encoder/Decoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => setMode("encode")}
            className="flex-1"
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => setMode("decode")}
            className="flex-1"
          >
            Decode
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono"
        />
        <div className="relative">
          <Textarea
            value={output}
            readOnly
            className="font-mono"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="absolute top-2 right-2"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== MAIN PAGE ====================

export default function DevToolsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Wand2 className="h-4 w-4" />
            <span className="text-sm font-medium">Developer Utilities</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            DevTools Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of useful utilities for developers. Format, convert, generate, and more.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <Tabs defaultValue="generators" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
            <TabsTrigger value="generators">
              <Sparkles className="h-4 w-4 mr-2" />
              Generators
            </TabsTrigger>
            <TabsTrigger value="converters">
              <RefreshCw className="h-4 w-4 mr-2" />
              Converters
            </TabsTrigger>
            <TabsTrigger value="formatters">
              <Braces className="h-4 w-4 mr-2" />
              Formatters
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generators" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ColorPaletteGenerator />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <UUIDGenerator />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <LoremIpsumGenerator />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="converters" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Base64Tool />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <URLTool />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <UnitConverter />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="md:col-span-2 lg:col-span-3"
              >
                <HTMLEntityTool />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="formatters" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <JSONFormatter />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <PasswordGenerator />
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
