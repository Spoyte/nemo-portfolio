"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Lightbulb,
  Code2,
  Zap,
  Copy,
  CheckCheck,
  RefreshCw,
  GitCompare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";
import { toast } from "sonner";

interface CodeExample {
  id: string;
  title: string;
  category: string;
  description: string;
  before: string;
  after: string;
  improvements: string[];
  explanation: string;
}

const codeExamples: CodeExample[] = [
  {
    id: "1",
    title: "Nested Conditionals",
    category: "Readability",
    description: "Flattening deeply nested if statements for better readability",
    before: `function getUserRole(user) {
  if (user) {
    if (user.isActive) {
      if (user.subscription) {
        if (user.subscription.type === 'premium') {
          return 'premium-user';
        } else {
          return 'basic-user';
        }
      } else {
        return 'no-subscription';
      }
    } else {
      return 'inactive-user';
    }
  } else {
    return 'anonymous';
  }
}`,
    after: `function getUserRole(user) {
  if (!user) return 'anonymous';
  if (!user.isActive) return 'inactive-user';
  if (!user.subscription) return 'no-subscription';
  
  return user.subscription.type === 'premium' 
    ? 'premium-user' 
    : 'basic-user';
}`,
    improvements: [
      "Early returns reduce nesting",
      "Easier to follow logic flow",
      "Less cognitive load",
      "Better testability"
    ],
    explanation: "Using guard clauses with early returns eliminates the pyramid of doom and makes each condition independent and clear."
  },
  {
    id: "2",
    title: "Magic Numbers",
    category: "Maintainability",
    description: "Replacing magic numbers with named constants",
    before: `function calculatePrice(quantity) {
  if (quantity > 100) {
    return quantity * 0.85 * 1.20;
  } else if (quantity > 50) {
    return quantity * 0.90 * 1.20;
  } else {
    return quantity * 1.00 * 1.20;
  }
}

// What do these numbers mean?`,
    after: `const PRICING = {
  BULK_THRESHOLD: 100,
  MEDIUM_THRESHOLD: 50,
  BULK_DISCOUNT: 0.85,
  MEDIUM_DISCOUNT: 0.90,
  NO_DISCOUNT: 1.00,
  TAX_RATE: 1.20,
} as const;

function calculatePrice(quantity: number) {
  const discount = quantity > PRICING.BULK_THRESHOLD ? PRICING.BULK_DISCOUNT
    : quantity > PRICING.MEDIUM_THRESHOLD ? PRICING.MEDIUM_DISCOUNT
    : PRICING.NO_DISCOUNT;
    
  return quantity * discount * PRICING.TAX_RATE;
}`,
    improvements: [
      "Self-documenting code",
      "Easy to update values",
      "Business logic is clear",
      "Type safety with const assertion"
    ],
    explanation: "Named constants make the code self-documenting and allow business rules to be updated in one place."
  },
  {
    id: "3",
    title: "Callback Hell",
    category: "Async Patterns",
    description: "Converting nested callbacks to async/await",
    before: `function getUserData(userId, callback) {
  getUser(userId, (err, user) => {
    if (err) return callback(err);
    
    getOrders(user.id, (err, orders) => {
      if (err) return callback(err);
      
      getPreferences(user.id, (err, prefs) => {
        if (err) return callback(err);
        
        callback(null, { user, orders, prefs });
      });
    });
  });
}`,
    after: `async function getUserData(userId: string) {
  try {
    const user = await getUser(userId);
    const [orders, prefs] = await Promise.all([
      getOrders(user.id),
      getPreferences(user.id)
    ]);
    
    return { user, orders, prefs };
  } catch (error) {
    throw new UserDataError('Failed to fetch user data', { cause: error });
  }
}`,
    improvements: [
      "Flat, readable structure",
      "Parallel execution with Promise.all",
      "Proper error handling",
      "Easier to extend"
    ],
    explanation: "Async/await provides synchronous-looking code that's easier to read and maintain, with better error handling."
  },
  {
    id: "4",
    title: "String Concatenation",
    category: "Modern Syntax",
    description: "Using template literals for cleaner string building",
    before: `function createEmail(user, order) {
  var greeting = "Hello " + user.firstName + " " + user.lastName + ",\n\n";
  var body = "Thank you for your order #" + order.id + ".\n";
  body += "Total: $" + order.total.toFixed(2) + "\n\n";
  var closing = "Best regards,\nThe Team";
  
  return greeting + body + closing;
}`,
    after: `function createEmail(user: User, order: Order) {
  const { firstName, lastName } = user;
  const { id, total } = order;
  
  return \`Hello \${firstName} \${lastName},

Thank you for your order #\${id}.
Total: $\${total.toFixed(2)}

Best regards,
The Team\`;
}`,
    improvements: [
      "Multi-line strings",
      "Embedded expressions",
      "Cleaner interpolation",
      "No more + operators"
    ],
    explanation: "Template literals provide a cleaner way to create multi-line strings with embedded expressions."
  },
  {
    id: "5",
    title: "Array Transformations",
    category: "Functional Style",
    description: "Using modern array methods instead of loops",
    before: `function getActiveUsernames(users) {
  var usernames = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].isActive) {
      var username = users[i].username.toLowerCase();
      usernames.push(username);
    }
  }
  return usernames;
}`,
    after: `const getActiveUsernames = (users: User[]) =>
  users
    .filter(user => user.isActive)
    .map(user => user.username.toLowerCase());`,
    improvements: [
      "Declarative over imperative",
      "Method chaining",
      "No mutable variables",
      "Single responsibility per step"
    ],
    explanation: "Functional array methods make the transformation steps explicit and composable."
  },
  {
    id: "6",
    title: "Prop Drilling",
    category: "React Patterns",
    description: "Using context to avoid passing props through many layers",
    before: `// Grandparent
function App() {
  const [theme, setTheme] = useState('light');
  return <Layout theme={theme} setTheme={setTheme} />;
}

// Parent (just passing through!)
function Layout({ theme, setTheme }) {
  return <Header theme={theme} setTheme={setTheme} />;
}

// Child (actually uses the props)
function Header({ theme, setTheme }) {
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle {theme}
    </button>
  );
}`,
    after: `const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Toggle {theme}
    </button>
  );
}`,
    improvements: [
      "No intermediate prop passing",
      "Components are decoupled",
      "Easier to refactor",
      "Scales better"
    ],
    explanation: "Context allows data to be accessed by any component in the tree without prop drilling through intermediate components."
  }
];

function CodeBlock({ code, label, isActive }: { code: string; label: string; isActive?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl overflow-hidden border ${isActive ? 'border-primary' : ''}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
        <Badge variant={label === "Before" ? "destructive" : "default"}>
          {label}
        </Badge>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm bg-card">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

export default function CodeComparePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "diff">("split");

  const currentExample = codeExamples[currentIndex];

  const nextExample = () => {
    setCurrentIndex((prev) => (prev + 1) % codeExamples.length);
    setShowExplanation(false);
  };

  const prevExample = () => {
    setCurrentIndex((prev) => (prev - 1 + codeExamples.length) % codeExamples.length);
    setShowExplanation(false);
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <GitCompare className="h-4 w-4" />
            <span className="text-sm font-medium">Refactoring Examples</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Code{" "}
            <span className="text-gradient-animated">Compare</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-world refactoring examples showing how to transform messy code into clean, 
            maintainable solutions.
          </p>
        </ScrollReveal>

        {/* Navigation */}
        <ScrollReveal delay={0.1} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={prevExample}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {codeExamples.length}
              </span>
              
              <Button variant="outline" onClick={nextExample}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "split" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("split")}
              >
                Split View
              </Button>
              <Button
                variant={viewMode === "diff" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("diff")}
              >
                Diff View
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Example Info */}
        <ScrollReveal delay={0.2} className="mb-8">
          <motion.div
            key={currentExample.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-card border"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-2">{currentExample.category}</Badge>
                <h2 className="text-2xl font-bold">{currentExample.title}</h2>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showExplanation ? "Hide" : "Show"} Explanation
              </Button>
            </div>
            
            <p className="text-muted-foreground">{currentExample.description}</p>
            
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t"
                >
                  <p className="mb-4">{currentExample.explanation}</p>
                  
                  <h4 className="font-semibold mb-3">Key Improvements:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentExample.improvements.map((improvement, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </ScrollReveal>

        {/* Code Comparison */}
        <ScrollReveal delay={0.3}>
          {viewMode === "split" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CodeBlock code={currentExample.before} label="Before" />
              <CodeBlock code={currentExample.after} label="After" isActive />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border">
              <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
                <Badge variant="outline">Diff View</Badge>
                <span className="text-sm text-muted-foreground">
                  Lines changed: {currentExample.before.split('\n').length} → {currentExample.after.split('\n').length}
                </span>
              </div>
              <div className="p-4 bg-card">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-sm font-medium text-red-500 mb-2">− Before</p>
                    <pre className="text-sm overflow-x-auto"><code>{currentExample.before}</code></pre>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-sm font-medium text-green-500 mb-2">+ After</p>
                    <pre className="text-sm overflow-x-auto"><code>{currentExample.after}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal delay={0.4} className="mt-12">
          <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(codeExamples.map(e => e.category))).map((category) => (
              <button
                key={category}
                onClick={() => {
                  const index = codeExamples.findIndex(e => e.category === category);
                  setCurrentIndex(index);
                  setShowExplanation(false);
                }}
                className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Tips */}
        <ScrollReveal delay={0.5} className="mt-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Refactoring Tips</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Always have tests before refactoring</li>
                  <li>• Make small, incremental changes</li>
                  <li>• Focus on readability over cleverness</li>
                  <li>• Use automated tools when possible (ESLint, Prettier)</li>
                  <li>• Refactor for the reader, not the writer</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
