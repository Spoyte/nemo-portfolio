"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Copy, 
  Check, 
  Trash2, 
  Globe, 
  Server,
  Code2,
  Play,
  Clock,
  AlertCircle,
  CheckCircle2,
  JsonIcon,
  Braces,
  RefreshCw,
  Save,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";
import { toast } from "sonner";

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: number;
  status?: number;
}

interface MockEndpoint {
  id: string;
  method: string;
  path: string;
  description: string;
  response: object;
  delay: number;
}

const mockEndpoints: MockEndpoint[] = [
  {
    id: "1",
    method: "GET",
    path: "/api/users",
    description: "Get all users",
    response: {
      users: [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", role: "user" },
        { id: 3, name: "Carol White", email: "carol@example.com", role: "user" }
      ],
      total: 3,
      page: 1
    },
    delay: 500
  },
  {
    id: "2",
    method: "GET",
    path: "/api/users/:id",
    description: "Get user by ID",
    response: {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "admin",
      createdAt: "2024-01-15T10:30:00Z",
      profile: {
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        bio: "Full-stack developer passionate about clean code"
      }
    },
    delay: 300
  },
  {
    id: "3",
    method: "POST",
    path: "/api/users",
    description: "Create a new user",
    response: {
      id: 4,
      name: "New User",
      email: "newuser@example.com",
      role: "user",
      createdAt: new Date().toISOString(),
      message: "User created successfully"
    },
    delay: 800
  },
  {
    id: "4",
    method: "GET",
    path: "/api/projects",
    description: "Get all projects",
    response: {
      projects: [
        { id: 1, name: "E-commerce Platform", status: "active", progress: 75 },
        { id: 2, name: "Mobile App", status: "in-progress", progress: 45 },
        { id: 3, name: "Analytics Dashboard", status: "completed", progress: 100 }
      ]
    },
    delay: 400
  },
  {
    id: "5",
    method: "GET",
    path: "/api/stats",
    description: "Get dashboard statistics",
    response: {
      visitors: { total: 15420, change: 12.5 },
      revenue: { total: 48200, change: 8.3 },
      orders: { total: 384, change: -2.1 },
      conversion: { rate: 3.24, change: 0.5 }
    },
    delay: 200
  }
];

const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export default function ApiExplorerPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.example.com/users");
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<object | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [activeTab, setActiveTab] = useState<"params" | "headers" | "body">("headers");
  const [copied, setCopied] = useState(false);

  const handleSendRequest = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

    // Generate mock response based on URL
    let mockResponse: object;
    let status = 200;

    if (url.includes("users")) {
      if (method === "GET") {
        mockResponse = mockEndpoints[0].response;
      } else if (method === "POST") {
        mockResponse = mockEndpoints[2].response;
        status = 201;
      } else {
        mockResponse = { message: "Operation successful" };
      }
    } else if (url.includes("projects")) {
      mockResponse = mockEndpoints[3].response;
    } else if (url.includes("stats")) {
      mockResponse = mockEndpoints[4].response;
    } else {
      mockResponse = {
        message: "Mock API response",
        timestamp: new Date().toISOString(),
        endpoint: url,
        method: method
      };
    }

    const endTime = Date.now();
    setResponse(mockResponse);
    setResponseStatus(status);
    setResponseTime(endTime - startTime);

    // Add to history
    const newRequest: RequestHistory = {
      id: Date.now().toString(),
      method,
      url,
      timestamp: Date.now(),
      status
    };
    setHistory(prev => [newRequest, ...prev].slice(0, 10));

    setIsLoading(false);
    toast.success(`Request completed in ${endTime - startTime}ms`);
  };

  const formatJson = (obj: object) => JSON.stringify(obj, null, 2);

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(formatJson(response));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Response copied!");
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(body || "{}");
      setBody(JSON.stringify(parsed, null, 2));
      toast.success("JSON formatted");
    } catch {
      toast.error("Invalid JSON");
    }
  };

  const loadMockEndpoint = (endpoint: MockEndpoint) => {
    setMethod(endpoint.method);
    setUrl(`https://api.example.com${endpoint.path}`);
    toast.success(`Loaded ${endpoint.description}`);
  };

  const getStatusColor = (status: number) => {
    if (status < 300) return "text-green-500";
    if (status < 400) return "text-yellow-500";
    return "text-red-500";
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
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive API Client</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            API{" "}
            <span className="text-gradient-animated">Explorer</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test API endpoints, format JSON, and explore mock responses. 
            A playground for API development.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Request */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Builder */}
            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl bg-card border overflow-hidden">
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Request</span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* URL Bar */}
                  <div className="flex gap-2">
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="px-4 py-2 rounded-lg bg-muted border font-mono text-sm font-semibold"
                    >
                      {httpMethods.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://api.example.com/endpoint"
                      className="flex-1 font-mono text-sm"
                    />
                    
                    <Button 
                      onClick={handleSendRequest}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 border-b">
                    {["headers", "body"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                          activeTab === tab
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="pt-4">
                    {activeTab === "headers" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Request Headers</label>
                        <textarea
                          value={headers}
                          onChange={(e) => setHeaders(e.target.value)}
                          className="w-full h-32 p-4 rounded-lg bg-muted border font-mono text-sm resize-none"
                          placeholder='{"Content-Type": "application/json"}'
                        />
                      </div>
                    )}
                    
                    {activeTab === "body" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Request Body</label>
                          <Button variant="ghost" size="sm" onClick={handleFormatJson}>
                            <Braces className="w-4 h-4 mr-2" />
                            Format JSON
                          </Button>
                        </div>
                        <textarea
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          className="w-full h-32 p-4 rounded-lg bg-muted border font-mono text-sm resize-none"
                          placeholder='{"key": "value"}'
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Response Panel */}
            <ScrollReveal delay={0.2}>
              <div className="rounded-2xl bg-card border overflow-hidden">
                <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Response</span>
                    </div>
                    
                    {responseStatus && (
                      <>
                        <Badge variant={responseStatus < 300 ? "default" : "destructive"}>
                          {responseStatus}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {responseTime}ms
                        </span>
                      </>
                    )}
                  </div>
                  
                  {response && (
                    <Button variant="ghost" size="sm" onClick={handleCopyResponse}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
                
                <div className="p-6">
                  {response ? (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm font-mono">
                        {formatJson(response)}
                      </code>
                    </pre>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>Send a request to see the response</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Panel - Sidebar */}
          <div className="space-y-6">
            {/* Mock Endpoints */}
            <ScrollReveal delay={0.3}>
              <div className="rounded-2xl bg-card border overflow-hidden">
                <div className="p-4 border-b bg-muted/50">
                  <span className="font-semibold">Mock Endpoints</span>
                </div>
                
                <div className="p-4 space-y-2">
                  {mockEndpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => loadMockEndpoint(endpoint)}
                      className="w-full text-left p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            endpoint.method === "GET" ? "text-blue-500" :
                            endpoint.method === "POST" ? "text-green-500" :
                            endpoint.method === "PUT" ? "text-yellow-500" :
                            "text-red-500"
                          }`}
                        >
                          {endpoint.method}
                        </Badge>
                        <span className="text-xs font-mono opacity-60">{endpoint.path}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Request History */}
            <ScrollReveal delay={0.4}>
              <div className="rounded-2xl bg-card border overflow-hidden">
                <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                  <span className="font-semibold">History</span>
                  {history.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setHistory([])}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No requests yet
                    </p>
                  ) : (
                    history.map((req) => (
                      <button
                        key={req.id}
                        onClick={() => {
                          setMethod(req.method);
                          setUrl(req.url);
                        }}
                        className="w-full text-left p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-semibold ${
                            req.method === "GET" ? "text-blue-500" :
                            req.method === "POST" ? "text-green-500" :
                            req.method === "PUT" ? "text-yellow-500" :
                            "text-red-500"
                          }`}>
                            {req.method}
                          </span>
                          <span className="text-xs truncate flex-1">{req.url}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(req.timestamp).toLocaleTimeString()}
                          </span>
                          {req.status && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(req.status)}`}
                            >
                              {req.status}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* JSON Tools */}
            <ScrollReveal delay={0.5}>
              <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border p-6">
                <h3 className="font-semibold mb-4">JSON Tools</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handleFormatJson}>
                    <Braces className="w-4 h-4 mr-2" />
                    Format / Beautify
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      try {
                        const minified = JSON.stringify(JSON.parse(body || "{}"));
                        setBody(minified);
                        toast.success("JSON minified");
                      } catch {
                        toast.error("Invalid JSON");
                      }
                    }}
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    Minify
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
