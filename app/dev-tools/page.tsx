"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Copy,
  Check,
  RefreshCw,
  Hash,
  Type,
  Code,
  Calendar,
  Clock,
  Image,
  FileJson,
  Palette,
  Calculator,
  Ruler,
  Binary,
  Braces,
  Quote,
  Link,
  Search,
  Replace,
  Trash2,
  Download,
  Upload,
  Sparkles,
  Zap,
  Terminal,
  Shield,
  Key,
  Fingerprint,
  QrCode,
  BarChart3,
  Gauge,
  Layers,
  Grid3X3,
  List,
  Settings,
  Save,
  History,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ScrollReveal } from "@/components/scroll-animations";
import { toast } from "sonner";

// Utility Functions
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generatePassword = (length: number, includeUpper: boolean, includeNumbers: boolean, includeSymbols: boolean) => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let chars = lower;
  if (includeUpper) chars += upper;
  if (includeNumbers) chars += numbers;
  if (includeSymbols) chars += symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const base64Encode = (str: string) => btoa(str);
const base64Decode = (str: string) => {
  try {
    return atob(str);
  } catch {
    return "Invalid Base64";
  }
};

const urlEncode = (str: string) => encodeURIComponent(str);
const urlDecode = (str: string) => decodeURIComponent(str);

const jsonFormat = (str: string) => {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return "Invalid JSON";
  }
};

const jsonMinify = (str: string) => {
  try {
    return JSON.stringify(JSON.parse(str));
  } catch {
    return "Invalid JSON";
  }
};

const calculateHash = async (str: string, algorithm: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const loremIpsum = (paragraphs: number, wordsPerParagraph: number) => {
  const words = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum",
  ];

  const result = [];
  for (let p = 0; p < paragraphs; p++) {
    const paragraph = [];
    for (let w = 0; w < wordsPerParagraph; w++) {
      paragraph.push(words[Math.floor(Math.random() * words.length)]);
    }
    result.push(paragraph.join(" ") + ".");
  }
  return result.join("\n\n");
};

const convertCase = (str: string, type: string) => {
  switch (type) {
    case "upper":
      return str.toUpperCase();
    case "lower":
      return str.toLowerCase();
    case "title":
      return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    case "camel":
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(/\s+/g, "");
    case "snake":
      return str.toLowerCase().replace(/\s+/g, "_");
    case "kebab":
      return str.toLowerCase().replace(/\s+/g, "-");
    default:
      return str;
  }
};

export default function DevToolsPage() {
  const [activeTool, setActiveTool] = useState("uuid");
  const [copied, setCopied] = useState(false);

  // UUID Generator State
  const [uuidCount, setUuidCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  // Password Generator State
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);

  // Base64 State
  const [base64Input, setBase64Input] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [base64Mode, setBase64Mode] = useState<"encode" | "decode">("encode");

  // JSON State
  const [jsonInput, setJsonInput] = useState('{"name": "John", "age": 30}');
  const [jsonOutput, setJsonOutput] = useState("");

  // Hash State
  const [hashInput, setHashInput] = useState("");
  const [hashAlgorithm, setHashAlgorithm] = useState("SHA-256");
  const [hashOutput, setHashOutput] = useState("");

  // Lorem Ipsum State
  const [loremParagraphs, setLoremParagraphs] = useState(3);
  const [loremWords, setLoremWords] = useState(50);
  const [loremOutput, setLoremOutput] = useState("");

  // Case Converter State
  const [caseInput, setCaseInput] = useState("");
  const [caseOutput, setCaseOutput] = useState("");
  const [caseType, setCaseType] = useState("upper");

  // URL Encoder State
  const [urlInput, setUrlInput] = useState("");
  const [urlOutput, setUrlOutput] = useState("");
  const [urlMode, setUrlMode] = useState<"encode" | "decode">("encode");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const generateUUIDs = () => {
    const newUuids = Array.from({ length: uuidCount }, () => generateUUID());
    setUuids(newUuids);
  };

  const generateNewPassword = () => {
    const password = generatePassword(passwordLength, includeUpper, includeNumbers, includeSymbols);
    setGeneratedPassword(password);
    setPasswordHistory((prev) => [password, ...prev].slice(0, 10));
  };

  const processBase64 = () => {
    if (base64Mode === "encode") {
      setBase64Output(base64Encode(base64Input));
    } else {
      setBase64Output(base64Decode(base64Input));
    }
  };

  const processJson = () => {
    setJsonOutput(jsonFormat(jsonInput));
  };

  const processHash = async () => {
    const hash = await calculateHash(hashInput, hashAlgorithm);
    setHashOutput(hash);
  };

  const generateLorem = () => {
    setLoremOutput(loremIpsum(loremParagraphs, loremWords));
  };

  const processCase = () => {
    setCaseOutput(convertCase(caseInput, caseType));
  };

  const processUrl = () => {
    if (urlMode === "encode") {
      setUrlOutput(urlEncode(urlInput));
    } else {
      setUrlOutput(urlDecode(urlInput));
    }
  };

  const tools = [
    { id: "uuid", name: "UUID Generator", icon: Fingerprint, category: "Generators" },
    { id: "password", name: "Password Gen", icon: Key, category: "Generators" },
    { id: "lorem", name: "Lorem Ipsum", icon: Type, category: "Generators" },
    { id: "base64", name: "Base64", icon: Code, category: "Encoders" },
    { id: "url", name: "URL Encoder", icon: Link, category: "Encoders" },
    { id: "json", name: "JSON Formatter", icon: FileJson, category: "Formatters" },
    { id: "case", name: "Case Converter", icon: Type, category: "Text" },
    { id: "hash", name: "Hash Generator", icon: Shield, category: "Security" },
  ];

  const categories = [...new Set(tools.map((t) => t.category))];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Dev Tools</h1>
                <p className="text-muted-foreground text-sm">Handy utilities for developers</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tool Navigation */}
          <ScrollReveal delay={0.1} className="lg:col-span-1">
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {tools
                      .filter((t) => t.category === category)
                      .map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => setActiveTool(tool.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                            activeTool === tool.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <tool.icon className="w-5 h-5" />
                          <span className="font-medium">{tool.name}</span>
                          {activeTool === tool.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Tool Content */}
          <ScrollReveal delay={0.2} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 rounded-2xl bg-card border border-border"
003e
                {/* UUID Generator */}
                <{activeTool === "uuid" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">UUID Generator</h2>
                      <p className="text-muted-foreground">Generate random UUIDs (v4)</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Count: {uuidCount}</label>
                        <Slider
                          value={[uuidCount]}
                          onValueChange(([v]) => setUuidCount(v)}
                          min={1}
                          max={20}
                          step={1}
                        />
                      </div>
                      <Button onClick={generateUUIDs} className="mt-6">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate
                      </Button>
                    </div>

                    <{uuids.length > 0 && (
                      <div className="space-y-2">
                        {uuids.map((uuid, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted font-mono text-sm"
                          >
                            <span>{uuid}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(uuid)}>
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Password Generator */}
                <{activeTool === "password" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Password Generator</h2>
                      <p className="text-muted-foreground">Create secure random passwords</p>
                    </div>

                    <div className="p-6 rounded-xl bg-muted">
                      <div className="flex items-center justify-between mb-4">
                        <code className="text-2xl font-bold break-all">{generatedPassword || "Click Generate"}</code>
                        <{generatedPassword && (
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedPassword)}>
                            <Copy className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                      <Button onClick={generateNewPassword} className="w-full">
                        <Key className="w-4 h-4 mr-2" />
                        Generate Password
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Length: {passwordLength}</label>
                        <Slider
                          value={[passwordLength]}
                          onValueChange(([v]) => setPasswordLength(v)}
                          min={8}
                          max={64}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: "Uppercase", state: includeUpper, setState: setIncludeUpper },
                          { label: "Numbers", state: includeNumbers, setState: setIncludeNumbers },
                          { label: "Symbols", state: includeSymbols, setState: setIncludeSymbols },
                        ].map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => opt.setState(!opt.state)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              opt.state ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <{passwordHistory.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">History</h3>
                        <div className="space-y-2">
                          {passwordHistory.map((pwd, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 rounded-lg bg-muted font-mono text-sm"
                            >
                              <span className="truncate">{pwd}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(pwd)}>
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Base64 */}
                <{activeTool === "base64" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Base64 Encoder/Decoder</h2>
                      <p className="text-muted-foreground">Encode and decode Base64 strings</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={base64Mode === "encode" ? "default" : "outline"}
                        onClick={() => setBase64Mode("encode")}
                      >
                        Encode
                      </Button>
                      <Button
                        variant={base64Mode === "decode" ? "default" : "outline"}
                        onClick={() => setBase64Mode("decode")}
                      >
                        Decode
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Input</label>
                        <Textarea
                          value={base64Input}
                          onChange={(e) => setBase64Input(e.target.value)}
                          placeholder={base64Mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
                          rows={8}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Output</label>
                        <Textarea
                          value={base64Output}
                          readOnly
                          placeholder="Result will appear here..."
                          rows={8}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={processBase64}>
                        <Zap className="w-4 h-4 mr-2" />
                        {base64Mode === "encode" ? "Encode" : "Decode"}
                      </Button>
                      <{base64Output && (
                        <Button variant="outline" onClick={() => copyToClipboard(base64Output)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Result
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* JSON Formatter */}
                <{activeTool === "json" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">JSON Formatter</h2>
                      <p className="text-muted-foreground">Format and validate JSON</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Input JSON</label>
                        <Textarea
                          value={jsonInput}
                          onChange={(e) => setJsonInput(e.target.value)}
                          placeholder='{"key": "value"}'
                          rows={12}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Formatted Output</label>
                        <Textarea
                          value={jsonOutput}
                          readOnly
                          placeholder="Formatted JSON will appear here..."
                          rows={12}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={processJson}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Format
                      </Button>
                      <Button variant="outline" onClick={() => setJsonOutput(jsonMinify(jsonInput))}>
                        Minify
                      </Button>
                      <{jsonOutput && jsonOutput !== "Invalid JSON" && (
                        <Button variant="outline" onClick={() => copyToClipboard(jsonOutput)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Hash Generator */}
                <{activeTool === "hash" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Hash Generator</h2>
                      <p className="text-muted-foreground">Generate cryptographic hashes</p>
                    </div>

                    <div className="flex gap-2">
                      {["SHA-256", "SHA-512", "SHA-1"].map((algo) => (
                        <Button
                          key={algo}
                          variant={hashAlgorithm === algo ? "default" : "outline"}
                          size="sm"
                          onClick={() => setHashAlgorithm(algo)}
                        >
                          {algo}
                        </Button>
                      ))}
                    </div>

                    <Textarea
                      value={hashInput}
                      onChange={(e) => setHashInput(e.target.value)}
                      placeholder="Enter text to hash..."
                      rows={4}
                    />

                    <{hashOutput && (
                      <div className="p-4 rounded-xl bg-muted">
                        <p className="text-sm text-muted-foreground mb-2">{hashAlgorithm} Hash:</p>
                        <code className="text-sm font-mono break-all">{hashOutput}</code>
                      </div>
                    )}

                    <Button onClick={processHash}>
                      <Shield className="w-4 h-4 mr-2" />
                      Generate Hash
                    </Button>
                  </div>
                )}

                {/* Lorem Ipsum */}
                <{activeTool === "lorem" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Lorem Ipsum Generator</h2>
                      <p className="text-muted-foreground">Generate placeholder text</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Paragraphs: {loremParagraphs}</label>
                        <Slider
                          value={[loremParagraphs]}
                          onValueChange={([v]) => setLoremParagraphs(v)}
                          min={1}
                          max={10}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Words per paragraph: {loremWords}</label>
                        <Slider
                          value={[loremWords]}
                          onValueChange={([v]) => setLoremWords(v)}
                          min={10}
                          max={100}
                        />
                      </div>
                    </div>

                    <Button onClick={generateLorem}>
                      <Type className="w-4 h-4 mr-2" />
                      Generate Text
                    </Button>

                    <{loremOutput && (
                      <>
                        <Textarea value={loremOutput} readOnly rows={10} />
                        <Button variant="outline" onClick={() => copyToClipboard(loremOutput)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Text
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {/* Case Converter */}
                <{activeTool === "case" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Case Converter</h2>
                      <p className="text-muted-foreground">Convert text between different cases</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "upper", label: "UPPER CASE" },
                        { id: "lower", label: "lower case" },
                        { id: "title", label: "Title Case" },
                        { id: "camel", label: "camelCase" },
                        { id: "snake", label: "snake_case" },
                        { id: "kebab", label: "kebab-case" },
                      ].map((c) => (
                        <Button
                          key={c.id}
                          variant={caseType === c.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCaseType(c.id)}
                        >
                          {c.label}
                        </Button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Textarea
                        value={caseInput}
                        onChange={(e) => setCaseInput(e.target.value)}
                        placeholder="Enter text..."
                        rows={8}
                      />
                      <Textarea
                        value={caseOutput}
                        readOnly
                        placeholder="Converted text..."
                        rows={8}
                      />
                    </div>

                    <Button onClick={processCase}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Convert
                    </Button>
                  </div>
                )}

                {/* URL Encoder */}
                <{activeTool === "url" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">URL Encoder/Decoder</h2>
                      <p className="text-muted-foreground">Encode and decode URLs</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={urlMode === "encode" ? "default" : "outline"}
                        onClick={() => setUrlMode("encode")}
                      >
                        Encode
                      </Button>
                      <Button
                        variant={urlMode === "decode" ? "default" : "outline"}
                        onClick={() => setUrlMode("decode")}
                      >
                        Decode
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Textarea
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder={urlMode === "encode" ? "Enter URL to encode..." : "Enter URL to decode..."}
                        rows={6}
                      />
                      <Textarea
                        value={urlOutput}
                        readOnly
                        placeholder="Result..."
                        rows={6}
                      />
                    </div>

                    <Button onClick={processUrl}>
                      <Zap className="w-4 h-4 mr-2" />
                      {urlMode === "encode" ? "Encode" : "Decode"}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
