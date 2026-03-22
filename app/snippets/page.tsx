"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Play,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  Settings,
  Download,
  Share2,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Code2,
  FileCode,
  Braces,
  Type,
  Hash,
  List,
  Grid,
  Search,
  Filter,
  Plus,
  Save,
  Folder,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  createdAt: string;
  isPublic: boolean;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

const defaultSnippets: CodeSnippet[] = [
  {
    id: "1",
    title: "Debounce Function",
    description: "A utility function to debounce function calls",
    language: "typescript",
    code: `function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Usage
const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);

debouncedSearch('hello');
debouncedSearch('hello world');`,
    tags: ["utility", "performance", "typescript"],
    createdAt: "2024-03-15",
    isPublic: true,
  },
  {
    id: "2",
    title: "Array Chunk",
    description: "Split an array into chunks of specified size",
    language: "javascript",
    code: `function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Usage
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const chunks = chunkArray(numbers, 3);
console.log(chunks);
// Output: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]`,
    tags: ["array", "utility", "javascript"],
    createdAt: "2024-03-14",
    isPublic: true,
  },
  {
    id: "3",
    title: "Deep Clone",
    description: "Create a deep copy of an object",
    language: "typescript",
    code: `function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

// Usage
const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
console.log(cloned);`,
    tags: ["object", "utility", "typescript"],
    createdAt: "2024-03-13",
    isPublic: true,
  },
  {
    id: "4",
    title: "CSS Grid Center",
    description: "Center elements with CSS Grid",
    language: "css",
    code: `.center-container {
  display: grid;
  place-items: center;
  min-height: 100vh;
}

/* Alternative with flexbox */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Center with absolute positioning */
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,
    tags: ["css", "layout", "center"],
    createdAt: "2024-03-12",
    isPublic: true,
  },
  {
    id: "5",
    title: "Fetch with Retry",
    description: "Fetch API with automatic retry logic",
    language: "typescript",
    code: `async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  delay: number = 1000
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      throw new Error(\`HTTP \${response.status}\`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}

// Usage
fetchWithRetry('https://api.example.com/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Failed:', err));`,
    tags: ["fetch", "async", "retry", "typescript"],
    createdAt: "2024-03-11",
    isPublic: true,
  },
];

const languages = [
  { id: "javascript", name: "JavaScript", icon: "JS", color: "bg-yellow-500/10 text-yellow-500" },
  { id: "typescript", name: "TypeScript", icon: "TS", color: "bg-blue-500/10 text-blue-500" },
  { id: "python", name: "Python", icon: "PY", color: "bg-green-500/10 text-green-500" },
  { id: "css", name: "CSS", icon: "CSS", color: "bg-cyan-500/10 text-cyan-500" },
  { id: "html", name: "HTML", icon: "HTML", color: "bg-orange-500/10 text-orange-500" },
  { id: "sql", name: "SQL", icon: "SQL", color: "bg-purple-500/10 text-purple-500" },
  { id: "bash", name: "Bash", icon: "SH", color: "bg-gray-500/10 text-gray-500" },
  { id: "rust", name: "Rust", icon: "RS", color: "bg-red-500/10 text-red-500" },
];

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(defaultSnippets);
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(defaultSnippets[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const handleCopy = async (snippet: CodeSnippet) => {
    await navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionResult(null);

    // Simulate code execution
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isSuccess = Math.random() > 0.2;
    setExecutionResult({
      success: isSuccess,
      output: isSuccess
        ? `> Executing ${selectedSnippet.title}...\n> Success!\n> Output:\n${selectedSnippet.code.split("\n").slice(0, 3).join("\n")}\n...`
        : `> Executing ${selectedSnippet.title}...\n> Error: SyntaxError: Unexpected token`,
      error: isSuccess ? undefined : "SyntaxError: Unexpected token",
      executionTime: Math.random() * 100 + 50,
    });

    setIsExecuting(false);
  };

  const handleDelete = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
    if (selectedSnippet.id === id) {
      setSelectedSnippet(snippets.find((s) => s.id !== id) || snippets[0]);
    }
    toast.success("Snippet deleted");
  };

  const getLanguageConfig = (languageId: string) => {
    return languages.find((l) => l.id === languageId) || languages[0];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold"
                >
                  Code{" "}
                  <span className="text-gradient-animated">Snippets</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground"
                >
                  {snippets.length} snippets • {languages.length} languages
                </motion.p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Snippet
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Snippet List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Language Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedLanguage === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(null)}
              >
                All
              </Button>
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  variant={selectedLanguage === lang.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang.id)}
                >
                  {lang.name}
                </Button>
              ))}
            </div>

            {/* Snippet List */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Snippets</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className={viewMode === "grid" ? "grid grid-cols-2 gap-2 p-4" : "space-y-1"}>
                    {filteredSnippets.map((snippet, index) => {
                      const langConfig = getLanguageConfig(snippet.language);
                      return (
                        <motion.button
                          key={snippet.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedSnippet(snippet)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            selectedSnippet.id === snippet.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted"
                          } ${viewMode === "grid" ? "" : "flex items-center gap-3"}`}
                        >
                          <div className={`${viewMode === "grid" ? "mb-2" : ""}`}>
                            <Badge className={langConfig.color}>
                              {langConfig.icon}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${selectedSnippet.id === snippet.id ? "text-primary" : ""}`}>
                              {snippet.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {snippet.description}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Code Editor */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedSnippet.title}</CardTitle>
                    <CardDescription>{selectedSnippet.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(selectedSnippet)}
                    >
                      {copiedId === selectedSnippet.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(selectedSnippet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getLanguageConfig(selectedSnippet.language).color}>
                    {getLanguageConfig(selectedSnippet.language).name}
                  </Badge>
                  {selectedSnippet.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <span className="text-xs text-muted-foreground ml-auto">
                    Created {selectedSnippet.createdAt}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Code Display */}
                <div className="relative">
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleExecute}
                      disabled={isExecuting}
                    >
                      {isExecuting ? (
                        <>
                          <Zap className="h-4 w-4 mr-2 animate-pulse" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 pt-12 text-sm font-mono bg-muted/50 rounded-lg overflow-x-auto max-h-[400px]">
                    <code>{selectedSnippet.code}</code>
                  </pre>
                </div>

                {/* Execution Result */}
                {executionResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      executionResult.success
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-red-500/10 border border-red-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {executionResult.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`font-medium ${executionResult.success ? "text-green-500" : "text-red-500"}`}>
                        {executionResult.success ? "Success" : "Error"}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {executionResult.executionTime.toFixed(0)}ms
                      </span>
                    </div>
                    <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                      {executionResult.output}
                    </pre>
                  </motion.div>
                )}

                {/* Tags */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSnippet.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
