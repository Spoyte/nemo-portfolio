"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  GitCompare, 
  Copy, 
  Check,
  RefreshCw,
  Split,
  AlignLeft,
  AlignRight,
  FileCode,
  Settings,
  Download,
  Trash2,
  History,
  ChevronDown,
  Type,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface DiffLine {
  type: "unchanged" | "added" | "removed";
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

type DiffType = "chars" | "words" | "lines";

const SAMPLE_CODE_1 = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}`;

const SAMPLE_CODE_2 = `function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}`;

export function CodeCompareTool() {
  const [leftCode, setLeftCode] = useState(SAMPLE_CODE_1);
  const [rightCode, setRightCode] = useState(SAMPLE_CODE_2);
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [diffType, setDiffType] = useState<DiffType>("lines");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [syncScroll, setSyncScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; left: string; right: string; timestamp: number }>>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  const leftRef = useRef<HTMLTextAreaElement>(null);
  const rightRef = useRef<HTMLTextAreaElement>(null);

  // Simple diff algorithm
  const computeDiff = () => {
    let left = leftCode;
    let right = rightCode;
    
    if (!caseSensitive) {
      left = left.toLowerCase();
      right = right.toLowerCase();
    }
    
    if (ignoreWhitespace) {
      left = left.replace(/\s+/g, " ").trim();
      right = right.replace(/\s+/g, " ").trim();
    }
    
    const leftLines = leftCode.split("\n");
    const rightLines = rightCode.split("\n");
    const result: DiffLine[] = [];
    
    let i = 0, j = 0;
    let oldLineNum = 1, newLineNum = 1;
    
    while (i < leftLines.length || j < rightLines.length) {
      const leftLine = leftLines[i] || "";
      const rightLine = rightLines[j] || "";
      
      if (i >= leftLines.length) {
        result.push({
          type: "added",
          newLineNumber: newLineNum++,
          content: rightLine,
        });
        j++;
      } else if (j >= rightLines.length) {
        result.push({
          type: "removed",
          oldLineNumber: oldLineNum++,
          content: leftLine,
        });
        i++;
      } else if (leftLine === rightLine) {
        result.push({
          type: "unchanged",
          oldLineNumber: oldLineNum++,
          newLineNumber: newLineNum++,
          content: leftLine,
        });
        i++;
        j++;
      } else {
        // Simple LCS-like approach - check if lines appear later
        const rightIndexInLeft = leftLines.slice(i + 1).indexOf(rightLine);
        const leftIndexInRight = rightLines.slice(j + 1).indexOf(leftLine);
        
        if (rightIndexInLeft === -1 || (leftIndexInRight !== -1 && leftIndexInRight < rightIndexInLeft)) {
          result.push({
            type: "added",
            newLineNumber: newLineNum++,
            content: rightLine,
          });
          j++;
        } else {
          result.push({
            type: "removed",
            oldLineNumber: oldLineNum++,
            content: leftLine,
          });
          i++;
        }
      }
    }
    
    setDiff(result);
  };

  useEffect(() => {
    computeDiff();
  }, [leftCode, rightCode, ignoreWhitespace, caseSensitive]);

  const handleSyncScroll = (source: "left" | "right") => {
    if (!syncScroll) return;
    
    const sourceRef = source === "left" ? leftRef.current : rightRef.current;
    const targetRef = source === "left" ? rightRef.current : leftRef.current;
    
    if (sourceRef && targetRef) {
      targetRef.scrollTop = sourceRef.scrollTop;
    }
  };

  const copyDiff = () => {
    const diffText = diff.map(d => {
      const prefix = d.type === "added" ? "+" : d.type === "removed" ? "-" : " ";
      return `${prefix} ${d.content}`;
    }).join("\n");
    
    navigator.clipboard.writeText(diffText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveToHistory = () => {
    const newItem = {
      id: Date.now().toString(),
      left: leftCode,
      right: rightCode,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev.slice(0, 9)]);
  };

  const loadFromHistory = (item: typeof history[0]) => {
    setLeftCode(item.left);
    setRightCode(item.right);
  };

  const clearAll = () => {
    setLeftCode("");
    setRightCode("");
    setDiff([]);
  };

  const swapSides = () => {
    setLeftCode(rightCode);
    setRightCode(leftCode);
  };

  const stats = {
    added: diff.filter(d => d.type === "added").length,
    removed: diff.filter(d => d.type === "removed").length,
    unchanged: diff.filter(d => d.type === "unchanged").length,
  };

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <GitCompare className="h-4 w-4" />
            <span className="text-sm font-medium">Code Tools</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code <span className="text-gradient-animated">Compare</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare code side-by-side with syntax highlighting and diff visualization.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  +{stats.added}
                </Badge>
                <Badge variant="outline" className="gap-1 text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  -{stats.removed}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  {stats.unchanged}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={swapSides} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Swap
              </Button>
              
              <Button variant="outline" size="sm" onClick={saveToHistory} className="gap-2">
                <History className="w-4 h-4" />
                Save
              </Button>
              
              <Button variant="outline" size="sm" onClick={copyDiff} className="gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy Diff
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)} className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl bg-card border border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ignore Whitespace</span>
                    <Switch checked={ignoreWhitespace} onCheckedChange={setIgnoreWhitespace} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Case Sensitive</span>
                    <Switch checked={caseSensitive} onCheckedChange={setCaseSensitive} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Line Numbers</span>
                    <Switch checked={showLineNumbers} onCheckedChange={setShowLineNumbers} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sync Scroll</span>
                    <Switch checked={syncScroll} onCheckedChange={setSyncScroll} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <{/* Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Original</span>
                </div>
                <Badge variant="outline">{leftCode.split("\n").length} lines</Badge>
              </div>
              
              <Textarea
                ref={leftRef}
                value={leftCode}
                onChange={(e) => setLeftCode(e.target.value)}
                onScroll={() => handleSyncScroll("left")}
                placeholder="Paste original code here..."
                className="font-mono text-sm min-h-[300px] resize-none"
              />
            </motion.div>

            <{/* Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlignRight className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Modified</span>
                </div>
                <Badge variant="outline">{rightCode.split("\n").length} lines</Badge>
              </div>
              
              <Textarea
                ref={rightRef}
                value={rightCode}
                onChange={(e) => setRightCode(e.target.value)}
                onScroll={() => handleSyncScroll("right")}
                placeholder="Paste modified code here..."
                className="font-mono text-sm min-h-[300px] resize-none"
              />
            </motion.div>
          </div>

          <{/* Diff View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-card border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-primary" />
                <span className="font-medium">Diff View</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={diffType} onValueChange={(v) => setDiffType(v as DiffType)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lines">Lines</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                    <SelectItem value="chars">Chars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-auto max-h-[400px]">
              <table className="w-full">
                <tbody className="font-mono text-sm">
                  {diff.map((line, index) => (
                    <tr
                      key={index}
                      className={`${
                        line.type === "added"
                          ? "bg-green-500/10"
                          : line.type === "removed"
                          ? "bg-red-500/10"
                          : ""
                      }`}
                    >
                      {showLineNumbers && (
                        <>
                          <td className="px-4 py-1 text-right text-muted-foreground select-none w-12">
                            {line.oldLineNumber || ""}
                          </td>
                          <td className="px-4 py-1 text-right text-muted-foreground select-none w-12">
                            {line.newLineNumber || ""}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-1 w-8 select-none">
                        <span
                          className={`${
                            line.type === "added"
                              ? "text-green-500"
                              : line.type === "removed"
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                        </span>
                      </td>
                      <td className="px-4 py-1 whitespace-pre">{line.content || " "}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <{/* History */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-4 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Comparisons
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-all text-sm"
                  >
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
