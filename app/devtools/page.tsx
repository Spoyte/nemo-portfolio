"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Copy,
  Check,
  RefreshCw,
  Download,
  Hash,
  Type,
  Code2,
  Palette,
  Image,
  Calendar,
  Globe,
  QrCode,
  Link,
  FileJson,
  FileCode,
  Shield,
  Lock,
  Unlock,
  Binary,
  Braces,
  Quote,
  Minimize2,
  Maximize2,
  Trash2,
  Sparkles,
  Terminal,
  Cpu,
  Wifi,
  Database,
  Search,
  Regex,
  Table,
  Clock,
  Gauge,
  Zap,
  Play,
  Pause,
  StopCircle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Lightbulb,
  Settings,
  Save,
  FolderOpen,
  History,
  Star,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Plus,
  Minus,
  RotateCcw,
  Undo,
  Redo,
  Scissors,
  Clipboard,
  ClipboardCopy,
  ClipboardPaste,
  FilePlus,
  FileMinus,
  FileEdit,
  FileSearch,
  FileCheck,
  FileX,
  FileWarning,
  FileKey,
  FileLock,
  FileDigit,
  FileType,
  FileImage,
  FileCode2,
  FileJson2,
  FileTerminal,
  FileSpreadsheet,
  FilePieChart,
  FileBarChart,
  FileAudio,
  FileVideo,
  FileArchive,
  FileUp,
  FileDown,
  Files,
  Folder,
  FolderPlus,
  FolderMinus,
  FolderOpen2,
  FolderTree,
  FolderGit,
  FolderKanban,
  FolderClock,
  FolderHeart,
  FolderKey,
  FolderLock,
  FolderSearch,
  FolderCog,
  FolderSymlink,
  FolderX,
  FolderSync,
  FolderArchive,
  FolderGit2,
  FolderKanban2,
  FolderClock2,
  FolderHeart2,
  FolderKey2,
  FolderLock2,
  FolderSearch2,
  FolderCog2,
  FolderSymlink2,
  FolderX2,
  FolderSync2,
  FolderArchive2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tool Categories
const toolCategories = [
  { id: "converters", label: "Converters", icon: RefreshCw },
  { id: "generators", label: "Generators", icon: Sparkles },
  { id: "formatters", label: "Formatters", icon: Code2 },
  { id: "encoders", label: "Encoders", icon: Lock },
  { id: "validators", label: "Validators", icon: CheckCircle2 },
  { id: "calculators", label: "Calculators", icon: Calculator },
  { id: "utilities", label: "Utilities", icon: Wrench },
];

// Base64 Encoder/Decoder
function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (e) {
      setOutput("Error: Invalid input");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (input) handleConvert();
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={mode === "encode" ? "default" : "outline"}
          onClick={() => setMode("encode")}
          className="flex-1"
        >
          <Lock className="h-4 w-4 mr-2" />
          Encode
        </Button>
        <Button
          variant={mode === "decode" ? "default" : "outline"}
          onClick={() => setMode("decode")}
          className="flex-1"
        >
          <Unlock className="h-4 w-4 mr-2" />
          Decode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block">Input</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter base64 to decode..."}
            rows={8}
          />
        </div>
        <div>
          <Label className="mb-2 block">Output</Label>
          <div className="relative">
            <Textarea value={output} readOnly rows={8} className="bg-muted" />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// JSON Formatter
function JSONFormatter() {
  const [input, setInput] = useState('{"name": "John", "age": 30, "city": "New York"}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError("Invalid JSON");
      setOutput("");
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError("Invalid JSON");
    }
  };

  useEffect(() => {
    formatJSON();
  }, [input, indent]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Indent:</Label>
          <Select value={indent.toString()} onValueChange={(v) => setIndent(Number(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={minifyJSON}>
          <Minimize2 className="h-4 w-4 mr-2" />
          Minify
        </Button>
        <Button variant="outline" onClick={formatJSON}>
          <Maximize2 className="h-4 w-4 mr-2" />
          Prettify
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block">Input JSON</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            rows={12}
            className="font-mono text-sm"
          />
        </div>
        <div>
          <Label className="mb-2 block">Formatted Output</Label>
          <Textarea
            value={output}
            readOnly
            rows={12}
            className="font-mono text-sm bg-muted"
          />
        </div>
      </div>
    </div>
  );
}

// UUID Generator
function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<"standard" | "uppercase" | "nospace">("standard");

  const generateUUID = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      let uuid = crypto.randomUUID();
      if (format === "uppercase") uuid = uuid.toUpperCase();
      if (format === "nospace") uuid = uuid.replace(/-/g, "");
      newUuids.push(uuid);
    }
    setUuids(newUuids);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
  };

  useEffect(() => {
    generateUUID();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Count:</Label>
          <Slider
            value={[count]}
            onValueChange={([v]) => setCount(v)}
            min={1}
            max={20}
            step={1}
            className="w-32"
          />
          <span className="w-8 text-center">{count}</span>
        </div>
        <Select value={format} onValueChange={(v) => setFormat(v as typeof format)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="uppercase">UPPERCASE</SelectItem>
            <SelectItem value="nospace">No Dashes</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={generateUUID}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate
        </Button>
        <Button variant="outline" onClick={copyAll}>
          <Copy className="h-4 w-4 mr-2" />
          Copy All
        </Button>
      </div>

      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-muted font-mono text-sm"
          >
            <span className="text-muted-foreground w-6">{i + 1}.</span>
            <code className="flex-1">{uuid}</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(uuid)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Password Generator
function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === "") return;

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (includeUppercase) score++;
    if (includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;
    return score;
  };

  const strength = getStrength();
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500", "bg-emerald-500"];

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  return (
    <div className="space-y-6">
      {/* Password Display */}
      <div className="relative">
        <Input
          value={password}
          readOnly
          className="text-center text-2xl font-mono tracking-wider h-16"
        />
        <Button
          size="sm"
          variant="ghost"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={copyPassword}
        >
          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </Button>
      </div>

      {/* Strength Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Strength</span>
          <span className={strength >= 4 ? "text-green-500" : strength >= 2 ? "text-yellow-500" : "text-red-500"}>
            {strengthLabels[strength]}
          </span>
        </div>
        <div className="flex gap-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      {/* Length Slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Length</Label>
          <span className="font-mono">{length}</span>
        </div>
        <Slider
          value={[length]}
          onValueChange={([v]) => setLength(v)}
          min={8}
          max={64}
          step={1}
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <Label htmlFor="uppercase" className="cursor-pointer">Uppercase (A-Z)</Label>
          <Switch
            id="uppercase"
            checked={includeUppercase}
            onCheckedChange={setIncludeUppercase}
          />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <Label htmlFor="lowercase" className="cursor-pointer">Lowercase (a-z)</Label>
          <Switch
            id="lowercase"
            checked={includeLowercase}
            onCheckedChange={setIncludeLowercase}
          />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <Label htmlFor="numbers" className="cursor-pointer">Numbers (0-9)</Label>
          <Switch
            id="numbers"
            checked={includeNumbers}
            onCheckedChange={setIncludeNumbers}
          />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <Label htmlFor="symbols" className="cursor-pointer">Symbols (!@#$)</Label>
          <Switch
            id="symbols"
            checked={includeSymbols}
            onCheckedChange={setIncludeSymbols}
          />
        </div>
      </div>

      <Button onClick={generatePassword} className="w-full" size="lg">
        <RefreshCw className="h-5 w-5 mr-2" />
        Generate New Password
      </Button>
    </div>
  );
}

// Color Converter
function ColorConverter() {
  const [hex, setHex] = useState("#dc2626");
  const [rgb, setRgb] = useState({ r: 220, g: 38, b: 38 });
  const [hsl, setHsl] = useState({ h: 0, s: 83, l: 51 });
  const [copied, setCopied] = useState<string | null>(null);

  const hexToRgb = (h: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const handleHexChange = (value: string) => {
    setHex(value);
    const newRgb = hexToRgb(value);
    if (newRgb) {
      setRgb(newRgb);
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    }
  };

  const handleRgbChange = (key: keyof typeof rgb, value: number) => {
    const newRgb = { ...rgb, [key]: value };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyValue = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div
        className="h-32 rounded-xl shadow-inner"
        style={{ backgroundColor: hex }}
      />

      {/* HEX */}
      <div className="space-y-2">
        <Label>HEX</Label>
        <div className="flex gap-2">
          <Input
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="font-mono"
          />
          <Button
            variant="outline"
            onClick={() => copyValue("hex", hex)}
          >
            {copied === "hex" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* RGB */}
      <div className="space-y-2">
        <Label>RGB</Label>
        <div className="grid grid-cols-3 gap-2">
          {["r", "g", "b"].map((key) => (
            <div key={key}>
              <span className="text-xs text-muted-foreground uppercase">{key}</span>
              <Input
                type="number"
                value={rgb[key as keyof typeof rgb]}
                onChange={(e) => handleRgbChange(key as keyof typeof rgb, Number(e.target.value))}
                min={0}
                max={255}
              />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => copyValue("rgb", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
        >
          {copied === "rgb" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          Copy RGB
        </Button>
      </div>

      {/* HSL */}
      <div className="space-y-2">
        <Label>HSL</Label>
        <div className="p-3 rounded-lg bg-muted font-mono text-sm">
          hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => copyValue("hsl", `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
        >
          {copied === "hsl" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          Copy HSL
        </Button>
      </div>
    </div>
  );
}

// Timestamp Converter
function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(Date.now().toString());
  const [date, setDate] = useState(new Date());
  const [format, setFormat] = useState("iso");

  const formats = {
    iso: (d: Date) => d.toISOString(),
    utc: (d: Date) => d.toUTCString(),
    local: (d: Date) => d.toLocaleString(),
    date: (d: Date) => d.toDateString(),
    time: (d: Date) => d.toTimeString(),
  };

  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    const num = parseInt(value);
    if (!isNaN(num)) {
      setDate(new Date(num.toString().length === 10 ? num * 1000 : num));
    }
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setTimestamp(newDate.getTime().toString());
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block">Timestamp (ms)</Label>
          <Input
            value={timestamp}
            onChange={(e) => handleTimestampChange(e.target.value)}
            className="font-mono"
          />
        </div>
        <div>
          <Label className="mb-2 block">Unix (seconds)</Label>
          <Input
            value={Math.floor(Number(timestamp) / 1000)}
            readOnly
            className="font-mono bg-muted"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Format</Label>
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iso">ISO 8601</SelectItem>
            <SelectItem value="utc">UTC String</SelectItem>
            <SelectItem value="local">Local String</SelectItem>
            <SelectItem value="date">Date Only</SelectItem>
            <SelectItem value="time">Time Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 rounded-lg bg-muted">
        <Label className="mb-2 block">Result</Label>
        <code className="text-lg font-mono break-all">
          {formats[format as keyof typeof formats](date)}
        </code>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button variant="outline" onClick={() => handleTimestampChange(Date.now().toString())}>
          <Clock className="h-4 w-4 mr-2" />
          Now
        </Button>
        <Button variant="outline" onClick={() => handleDateChange(new Date(Date.now() + 86400000))}>
          <Calendar className="h-4 w-4 mr-2" />
          Tomorrow
        </Button>
        <Button variant="outline" onClick={() => handleDateChange(new Date(Date.now() - 86400000))}>
          <Calendar className="h-4 w-4 mr-2" />
          Yesterday
        </Button>
        <Button variant="outline" onClick={() => handleDateChange(new Date(Date.now() + 86400000 * 7))}>
          <Calendar className="h-4 w-4 mr-2" />
          Next Week
        </Button>
      </div>
    </div>
  );
}

// URL Encoder/Decoder
function URLEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleConvert = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e) {
      setOutput("Error: Invalid input");
    }
  };

  useEffect(() => {
    if (input) handleConvert();
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={mode === "encode" ? "default" : "outline"}
          onClick={() => setMode("encode")}
          className="flex-1"
        >
          <Lock className="h-4 w-4 mr-2" />
          Encode
        </Button>
        <Button
          variant={mode === "decode" ? "default" : "outline"}
          onClick={() => setMode("decode")}
          className="flex-1"
        >
          <Unlock className="h-4 w-4 mr-2" />
          Decode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block">Input</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter URL-encoded text..."}
            rows={8}
          />
        </div>
        <div>
          <Label className="mb-2 block">Output</Label>
          <Textarea value={output} readOnly rows={8} className="bg-muted" />
        </div>
      </div>
    </div>
  );
}

// Hash Generator
function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<"md5" | "sha1" | "sha256">("sha256");
  const [hash, setHash] = useState("");

  // Simple hash simulation (in production, use crypto.subtle)
  const generateHash = async (text: string, algo: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algo.toUpperCase(), data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  useEffect(() => {
    if (input) {
      generateHash(input, algorithm).then(setHash);
    }
  }, [input, algorithm]);

  return (
    <div className="space-y-4">
      <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as typeof algorithm)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sha256">SHA-256</SelectItem>
          <SelectItem value="sha1">SHA-1</SelectItem>
          <SelectItem value="md5">MD5</SelectItem>
        </SelectContent>
      </Select>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to hash..."
        rows={4}
      />

      {hash && (
        <div className="p-4 rounded-lg bg-muted">
          <div className="flex items-center justify-between mb-2">
            <Label>{algorithm.toUpperCase()} Hash</Label>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(hash)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <code className="text-sm font-mono break-all">{hash}</code>
        </div>
      )}
    </div>
  );
}

// Lorem Ipsum Generator
function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [sentences, setSentences] = useState(5);
  const [output, setOutput] = useState("");

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

  const generate = () => {
    const result = [];
    for (let p = 0; p < paragraphs; p++) {
      const paragraph = [];
      for (let s = 0; s < sentences; s++) {
        const sentenceLength = Math.floor(Math.random() * 10) + 5;
        const sentence = [];
        for (let w = 0; w < sentenceLength; w++) {
          sentence.push(words[Math.floor(Math.random() * words.length)]);
        }
        sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
        paragraph.push(sentence.join(" ") + ".");
      }
      result.push(paragraph.join(" "));
    }
    setOutput(result.join("\n\n"));
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label className="mb-2 block">Paragraphs: {paragraphs}</Label>
          <Slider
            value={[paragraphs]}
            onValueChange={([v]) => setParagraphs(v)}
            min={1}
            max={10}
            step={1}
          />
        </div>
        <div className="flex-1">
          <Label className="mb-2 block">Sentences: {sentences}</Label>
          <Slider
            value={[sentences]}
            onValueChange={([v]) => setSentences(v)}
            min={1}
            max={20}
            step={1}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={generate} className="flex-1">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate
        </Button>
        <Button variant="outline" onClick={() => navigator.clipboard.writeText(output)}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>

      <Textarea value={output} readOnly rows={12} className="bg-muted" />
    </div>
  );
}

// Calculator Icon Component
function Calculator({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="14" />
      <path d="M8 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

export default function DevToolsPage() {
  const [activeTab, setActiveTab] = useState("converters");

  const tools = {
    converters: [
      { id: "base64", label: "Base64", icon: Binary, component: Base64Tool },
      { id: "url", label: "URL Encode", icon: Link, component: URLEncoder },
      { id: "color", label: "Color Converter", icon: Palette, component: ColorConverter },
      { id: "timestamp", label: "Timestamp", icon: Clock, component: TimestampConverter },
    ],
    generators: [
      { id: "uuid", label: "UUID", icon: Hash, component: UUIDGenerator },
      { id: "password", label: "Password", icon: Lock, component: PasswordGenerator },
      { id: "lorem", label: "Lorem Ipsum", icon: Type, component: LoremIpsumGenerator },
    ],
    formatters: [
      { id: "json", label: "JSON Formatter", icon: FileJson, component: JSONFormatter },
    ],
    encoders: [
      { id: "hash", label: "Hash Generator", icon: Shield, component: HashGenerator },
    ],
    validators: [],
    calculators: [],
    utilities: [],
  };

  const ActiveComponent = tools[activeTab as keyof typeof tools]?.find(
    (t) => t.id === activeTab
  )?.component || Base64Tool;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Wrench className="h-4 w-4" />
            <span className="text-sm font-medium">Developer Utilities</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Dev<span className="text-gradient">Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of handy utilities for developers. Format, convert, generate, 
            and validate data with ease.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {toolCategories.map((category) => {
                    const Icon = category.icon;
                    const categoryTools = tools[category.id as keyof typeof tools] || [];
                    if (categoryTools.length === 0) return null;
                    
                    return (
                      <div key={category.id}>
                        <button
                          onClick={() => setActiveTab(categoryTools[0]?.id || category.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === category.id || categoryTools.some(t => t.id === activeTab)
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {category.label}
                        </button>
                      </div>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
                {Object.entries(tools).flatMap(([category, categoryTools]) =>
                  categoryTools.map((tool) => (
                    <TabsTrigger key={tool.id} value={tool.id} className="gap-2">
                      <tool.icon className="h-4 w-4" />
                      <span className="hidden md:inline">{tool.label}</span>
                    </TabsTrigger>
                  ))
                )}
              </TabsList>

              {Object.entries(tools).flatMap(([category, categoryTools]) =>
                categoryTools.map((tool) => (
                  <TabsContent key={tool.id} value={tool.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <tool.icon className="h-5 w-5" />
                          {tool.label}
                        </CardTitle>
                        <CardDescription>
                          {tool.id === "base64" && "Encode and decode Base64 strings"}
                          {tool.id === "url" && "Encode and decode URL parameters"}
                          {tool.id === "color" && "Convert between color formats"}
                          {tool.id === "timestamp" && "Convert between timestamps and dates"}
                          {tool.id === "uuid" && "Generate UUIDs/GUIDs"}
                          {tool.id === "password" && "Generate secure passwords"}
                          {tool.id === "lorem" && "Generate placeholder text"}
                          {tool.id === "json" && "Format and validate JSON"}
                          {tool.id === "hash" && "Generate cryptographic hashes"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <tool.component />
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
