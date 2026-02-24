"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Code2, 
  Wand2, 
  Copy, 
  Check, 
  AlertCircle,
  Lightbulb,
  Zap,
  Shield,
  Gauge,
  Bug,
  MessageSquare,
  Send,
  RefreshCw,
  Download,
  Share2,
  History,
  ChevronDown,
  ChevronUp,
  Trash2,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface ReviewResult {
  id: string;
  summary: string;
  score: number;
  categories: {
    readability: number;
    performance: number;
    security: number;
    maintainability: number;
    bestPractices: number;
  };
  issues: Array<{
    type: "error" | "warning" | "suggestion" | "praise";
    line?: number;
    message: string;
    suggestion?: string;
    code?: string;
  }>;
  improvements: string[];
  refactoredCode?: string;
  timestamp: number;
}

interface ReviewHistory {
  id: string;
  code: string;
  language: string;
  result: ReviewResult;
  timestamp: number;
}

const languages = [
  { value: "javascript", label: "JavaScript", icon: "⚡" },
  { value: "typescript", label: "TypeScript", icon: "🔷" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "rust", label: "Rust", icon: "🦀" },
  { value: "go", label: "Go", icon: "🐹" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "cpp", label: "C++", icon: "⚙️" },
  { value: "css", label: "CSS", icon: "🎨" },
  { value: "sql", label: "SQL", icon: "🗄️" },
];

const sampleCode: Record<string, string> = {
  javascript: `// Sample code to review
function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price * items[i].qty;
  }
  return total;
}

// Usage
const cart = [
  { price: 10, qty: 2 },
  { price: 5, qty: 5 }
];
console.log(calculateTotal(cart));`,
  typescript: `// Sample TypeScript code
interface User {
  id: number;
  name: string;
  email: string;
}

class UserManager {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  findUser(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}`,
  python: `# Sample Python code
def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

# Usage
print(fibonacci(10))`,
  rust: `// Sample Rust code
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    let sum: i32 = numbers.iter()
        .filter(|&&x| x % 2 == 0)
        .sum();
    
    println!("Sum of even numbers: {}", sum);
}`,
  css: `/* Sample CSS */
.card {
  background: white;
  border: 1px solid #ddd;
  padding: 20px;
  margin: 10px;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}`,
};

// Simulated AI review logic
function generateReview(code: string, language: string): ReviewResult {
  const issues: ReviewResult["issues"] = [];
  const improvements: string[] = [];
  
  // Basic pattern analysis
  if (code.includes("var ")) {
    issues.push({
      type: "warning",
      message: "Using 'var' is outdated. Prefer 'const' or 'let'.",
      suggestion: "Replace 'var' with 'const' for values that don't change, 'let' otherwise.",
    });
  }
  
  if (code.includes("console.log")) {
    issues.push({
      type: "suggestion",
      message: "Console statements found in code.",
      suggestion: "Remove console.log statements before deploying to production.",
    });
  }
  
  if (code.includes("any") && language === "typescript") {
    issues.push({
      type: "warning",
      message: "Using 'any' type defeats TypeScript's purpose.",
      suggestion: "Define proper interfaces or use 'unknown' with type guards.",
    });
  }
  
  if (!code.includes("try") && code.includes("JSON.parse")) {
    issues.push({
      type: "error",
      message: "JSON.parse without error handling.",
      suggestion: "Wrap JSON.parse in try-catch to handle malformed JSON.",
    });
  }
  
  if (code.length > 500 && !code.includes("// ") && !code.includes("/*")) {
    issues.push({
      type: "suggestion",
      message: "Large code block without comments.",
      suggestion: "Add comments to explain complex logic.",
    });
  }
  
  // Positive feedback
  if (code.includes("const ") || code.includes("let ")) {
    issues.push({
      type: "praise",
      message: "Good use of modern variable declarations!",
    });
  }
  
  if (code.includes("async") && code.includes("await")) {
    issues.push({
      type: "praise",
      message: "Proper async/await usage for asynchronous operations.",
    });
  }
  
  // Generate improvements
  if (!code.includes("Type") && language === "typescript") {
    improvements.push("Consider adding explicit return types to functions");
  }
  
  if (!code.includes("export")) {
    improvements.push("Add module exports for better code reusability");
  }
  
  improvements.push("Consider adding unit tests for this code");
  improvements.push("Add JSDoc comments for better documentation");
  
  // Calculate scores
  const errorCount = issues.filter(i => i.type === "error").length;
  const warningCount = issues.filter(i => i.type === "warning").length;
  const praiseCount = issues.filter(i => i.type === "praise").length;
  
  const baseScore = Math.max(0, 100 - errorCount * 15 - warningCount * 5 + praiseCount * 3);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    summary: generateSummary(code, issues),
    score: Math.min(100, Math.max(0, baseScore)),
    categories: {
      readability: Math.min(100, 70 + praiseCount * 5),
      performance: Math.min(100, 75 - errorCount * 10),
      security: Math.min(100, 80 - errorCount * 15),
      maintainability: Math.min(100, 70 + praiseCount * 3),
      bestPractices: Math.min(100, 75 - warningCount * 3),
    },
    issues,
    improvements,
    timestamp: Date.now(),
  };
}

function generateSummary(code: string, issues: ReviewResult["issues"]): string {
  const errorCount = issues.filter(i => i.type === "error").length;
  const warningCount = issues.filter(i => i.type === "warning").length;
  
  if (errorCount === 0 && warningCount === 0) {
    return "Great job! Your code looks clean and follows best practices.";
  } else if (errorCount === 0) {
    return `Good code with ${warningCount} minor improvement${warningCount > 1 ? "s" : ""} suggested.`;
  } else {
    return `Found ${errorCount} critical issue${errorCount > 1 ? "s" : ""} and ${warningCount} warning${warningCount > 1 ? "s" : ""} to address.`;
  }
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-yellow-500";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

function getScoreBg(score: number): string {
  if (score >= 90) return "bg-green-500/10 border-green-500/30";
  if (score >= 70) return "bg-yellow-500/10 border-yellow-500/30";
  if (score >= 50) return "bg-orange-500/10 border-orange-500/30";
  return "bg-red-500/10 border-red-500/30";
}

export function AICodeReviewer() {
  const [code, setCode] = useState(sampleCode.javascript);
  const [language, setLanguage] = useState("javascript");
  const [isReviewing, setIsReviewing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [history, setHistory] = useState<ReviewHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [focusAreas, setFocusAreas] = useState<string[]>(["performance", "security"]);
  
  useEffect(() => {
    const saved = localStorage.getItem("codeReviewHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("codeReviewHistory", JSON.stringify(history));
  }, [history]);
  
  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to review");
      return;
    }
    
    setIsReviewing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const review = generateReview(code, language);
    setResult(review);
    
    // Add to history
    const historyItem: ReviewHistory = {
      id: review.id,
      code: code.slice(0, 500) + (code.length > 500 ? "..." : ""),
      language,
      result: review,
      timestamp: Date.now(),
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 20));
    
    setIsReviewing(false);
    
    // Celebration for good scores
    if (review.score >= 90) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      toast.success("Excellent code! 🎉");
    }
  }, [code, language]);
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("codeReviewHistory");
    toast.success("History cleared");
  };
  
  const loadSample = () => {
    setCode(sampleCode[language as keyof typeof sampleCode] || sampleCode.javascript);
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">AI Code Reviewer</CardTitle>
                <CardDescription>
                  Get instant AI-powered feedback on your code
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadSample}>
                <Code2 className="h-4 w-4 mr-2" />
                Load Sample
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
                <History className="h-4 w-4 mr-2" />
                History ({history.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Settings */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Label>Language:</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.icon} {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch 
                id="strict" 
                checked={strictMode}
                onCheckedChange={setStrictMode}
              />
              <Label htmlFor="strict">Strict Mode</Label>
            </div>
          </div>
          
          {/* Code Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Your Code</Label>
              <span className="text-xs text-muted-foreground">
                {code.length} characters
              </span>
            </div>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for review..."
              className="min-h-[300px] font-mono text-sm"
              spellCheck={false}
            />
          </div>
          
          {/* Review Button */}
          <Button 
            onClick={handleReview} 
            disabled={isReviewing || !code.trim()}
            className="w-full"
            size="lg"
          >
            {isReviewing ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Analyzing Code...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 mr-2" />
                Review My Code
              </>
            )}
          </Button>
          
          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Score Overview */}
                <div className={`p-6 rounded-xl border-2 ${getScoreBg(result.score)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Code Quality Score</h3>
                      <p className="text-sm text-muted-foreground">{result.summary}</p>
                    </div>
                    <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}
                    </div>
                  </div>
                  
                  {/* Category Scores */}
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(result.categories).map(([category, score]) => (
                      <div key={category} className="text-center">
                        <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                          {score}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Detailed Results */}
                <Tabs defaultValue="issues" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="issues">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Issues ({result.issues.length})
                    </TabsTrigger>
                    <TabsTrigger value="improvements">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Suggestions ({result.improvements.length})
                    </TabsTrigger>
                    <TabsTrigger value="details">
                      <Gauge className="h-4 w-4 mr-2" />
                      Details
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="issues" className="space-y-3">
                    {result.issues.map((issue, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          issue.type === "error" ? "bg-red-500/10 border-red-500/30" :
                          issue.type === "warning" ? "bg-yellow-500/10 border-yellow-500/30" :
                          issue.type === "praise" ? "bg-green-500/10 border-green-500/30" :
                          "bg-blue-500/10 border-blue-500/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Badge variant={
                            issue.type === "error" ? "destructive" :
                            issue.type === "warning" ? "default" :
                            issue.type === "praise" ? "secondary" :
                            "outline"
                          }>
                            {issue.type}
                          </Badge>
                          <div className="flex-1">
                            <p className="font-medium">{issue.message}</p>
                            {issue.suggestion && (
                              <p className="text-sm text-muted-foreground mt-1">
                                💡 {issue.suggestion}
                              </p>
                            )}
                            {issue.code && (
                              <pre className="mt-2 p-2 bg-background rounded text-xs font-mono overflow-x-auto">
                                {issue.code}
                              </pre>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="improvements" className="space-y-3">
                    {result.improvements.map((improvement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                      >
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <span>{improvement}</span>
                      </motion.div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{code.split("\n").length}</div>
                            <div className="text-sm text-muted-foreground">Lines of Code</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                              {result.issues.filter(i => i.type === "error").length}
                            </div>
                            <div className="text-sm text-muted-foreground">Critical Issues</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-muted">
                        <h4 className="font-semibold mb-2">Review Details</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Language: {languages.find(l => l.value === language)?.label}</p>
                          <p>Review ID: {result.id}</p>
                          <p>Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
                          <p>Strict Mode: {strictMode ? "Enabled" : "Disabled"}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleCopy(JSON.stringify(result, null, 2))}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Report
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    <Download className="h-4 w-4 mr-2" />
                    Save PDF
                  </Button>
                  <Button variant="outline" onClick={() => {
                    const url = `${window.location.origin}/playground?review=${result.id}`;
                    handleCopy(url);
                  }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Review History</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No reviews yet. Start by reviewing some code!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => {
                          setCode(item.code);
                          setLanguage(item.language);
                          setResult(item.result);
                          setShowHistory(false);
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {languages.find(l => l.value === item.language)?.label}
                            </span>
                            <Badge className={getScoreColor(item.result.score)}>
                              {item.result.score}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.code.slice(0, 60)}...
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
