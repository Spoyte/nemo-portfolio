"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Copy,
  Check,
  Play,
  Code2,
  Globe,
  Lock,
  FileJson,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Save,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: number;
  status?: number;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
}

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;

const SAMPLE_ENDPOINTS = [
  { name: "JSONPlaceholder Posts", method: "GET", url: "https://jsonplaceholder.typicode.com/posts/1" },
  { name: "JSONPlaceholder Users", method: "GET", url: "https://jsonplaceholder.typicode.com/users" },
  { name: "Random User", method: "GET", url: "https://randomuser.me/api/" },
  { name: "IP Geolocation", method: "GET", url: "https://ipapi.co/json/" },
  { name: "HTTP Bin", method: "GET", url: "https://httpbin.org/get" },
];

export function ApiPlayground() {
  const [method, setMethod] = useState<typeof HTTP_METHODS[number]>("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [headers, setHeaders] = useState<Header[]>([
    { key: "Content-Type", value: "application/json", enabled: true },
    { key: "Accept", value: "application/json", enabled: true },
  ]);
  const [body, setBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [activeTab, setActiveTab] = useState("params");
  const [responseTab, setResponseTab] = useState("body");
  const [copied, setCopied] = useState(false);
  const [savedRequests, setSavedRequests] = useState<Array<{ id: string; name: string; method: string; url: string }>>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "", enabled: true }]);
  };

  const updateHeader = (index: number, field: keyof Header, value: string | boolean) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const sendRequest = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    const startTime = performance.now();
    
    try {
      const requestHeaders: Record<string, string> = {};
      headers.filter(h => h.enabled && h.key).forEach(h => {
        requestHeaders[h.key] = h.value;
      });

      const options: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (["POST", "PUT", "PATCH"].includes(method) && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const responseTime = Math.round(performance.now() - startTime);
      
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseBody = "";
      const contentType = res.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        const json = await res.json();
        responseBody = JSON.stringify(json, null, 2);
      } else {
        responseBody = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: responseTime,
      });

      // Add to history
      const newHistoryItem: RequestHistory = {
        id: Date.now().toString(),
        method,
        url,
        timestamp: Date.now(),
        status: res.status,
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (response?.body) {
      navigator.clipboard.writeText(response.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatJson = (str: string) => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  };

  const getStatusColor = (status: number) => {
    if (status < 200) return "text-blue-500";
    if (status < 300) return "text-green-500";
    if (status < 400) return "text-yellow-500";
    if (status < 500) return "text-orange-500";
    return "text-red-500";
  };

  const saveRequest = () => {
    if (!saveName.trim()) return;
    
    const newRequest = {
      id: Date.now().toString(),
      name: saveName,
      method,
      url,
    };
    
    setSavedRequests(prev => [...prev, newRequest]);
    setSaveName("");
    setShowSaveDialog(false);
  };

  const loadRequest = (req: typeof savedRequests[0]) => {
    setMethod(req.method as typeof HTTP_METHODS[number]);
    setUrl(req.url);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
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
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">API Explorer</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            API <span className="text-gradient-animated">Playground</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test APIs directly in the browser. Send requests, inspect responses, and save your favorites.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Sample Endpoints */}
            <div className="p-4 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 text-sm">Sample Endpoints</h3>
              <div className="space-y-2">
                {SAMPLE_ENDPOINTS.map((endpoint) => (
                  <button
                    key={endpoint.name}
                    onClick={() => {
                      setMethod(endpoint.method as typeof HTTP_METHODS[number]);
                      setUrl(endpoint.url);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-muted hover:bg-muted/80 transition-all text-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{endpoint.method}</Badge>
                      <span className="font-medium truncate">{endpoint.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{endpoint.url}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="p-4 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 text-sm flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Requests
              </h3>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No requests yet</p>
                  ) : (
                    history.map((req) => (
                      <button
                        key={req.id}
                        onClick={() => {
                          setMethod(req.method as typeof HTTP_METHODS[number]);
                          setUrl(req.url);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-muted transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${req.status && req.status < 400 ? "text-green-500" : "text-red-500"}`}
                          >
                            {req.method}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatTime(req.timestamp)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate mt-1">{req.url}</div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Saved Requests */}
            <div className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Saved Requests</h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setShowSaveDialog(true)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <AnimatePresence>
                {showSaveDialog && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 space-y-2"
                  >
                    <Input
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="Request name..."
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveRequest} className="flex-1">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-2">
                {savedRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No saved requests</p>
                ) : (
                  savedRequests.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => loadRequest(req)}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{req.method}</Badge>
                          <span className="text-sm font-medium">{req.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSavedRequests(prev => prev.filter(r => r.id !== req.id));
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Request Builder */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Select value={method} onValueChange={(v) => setMethod(v as typeof HTTP_METHODS[number])}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HTTP_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter request URL..."
                  className="flex-1 font-mono text-sm"
                />
                
                <Button 
                  onClick={sendRequest} 
                  disabled={loading || !url}
                  className="gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send</>
                  )}
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="params">Params</TabsTrigger>
                  <TabsTrigger value="headers">Headers ({headers.filter(h => h.enabled).length})</TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                </TabsList>

                <TabsContent value="params" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Query parameters are automatically parsed from the URL.
                  </p>
                </TabsContent>

                <TabsContent value="headers" className="space-y-4">
                  {headers.map((header, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) => updateHeader(index, "enabled", e.target.checked)}
                        className="rounded border-border"
                      />
                      <Input
                        value={header.key}
                        onChange={(e) => updateHeader(index, "key", e.target.value)}
                        placeholder="Key"
                        className="flex-1 font-mono text-sm"
                      />
                      <Input
                        value={header.value}
                        onChange={(e) => updateHeader(index, "value", e.target.value)}
                        placeholder="Value"
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHeader(index)}
                        className="text-destructive"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addHeader} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Header
                  </Button>
                </TabsContent>

                <TabsContent value="body">
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Request body (JSON)..."
                    className="font-mono text-sm min-h-[200px]"
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Response */}
            <AnimatePresence>
              {(response || error || loading) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Sending request...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center gap-3 text-destructive">
                      <AlertCircle className="w-5 h-5" />
                      <p>{error}</p>
                    </div>
                  ) : response ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-2 ${getStatusColor(response.status)}`}>
                            <span className="text-2xl font-bold">{response.status}</span>
                            <span className="text-sm">{response.statusText}</span>
                          </div>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="w-3 h-3" />
                            {response.time}ms
                          </Badge>
                        </div>
                        
                        <Button variant="outline" size="sm" onClick={copyResponse} className="gap-2">
                          {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                        </Button>
                      </div>

                      <Tabs value={responseTab} onValueChange={setResponseTab}>
                        <TabsList className="mb-4">
                          <TabsTrigger value="body">Body</TabsTrigger>
                          <TabsTrigger value="headers">Headers</TabsTrigger>
                        </TabsList>

                        <TabsContent value="body">
                          <pre className="p-4 rounded-xl bg-muted font-mono text-sm overflow-auto max-h-96">
                            <code>{response.body}</code>
                          </pre>
                        </TabsContent>

                        <TabsContent value="headers">
                          <div className="space-y-2">
                            {Object.entries(response.headers).map(([key, value]) => (
                              <div key={key} className="flex items-start gap-4 p-2 rounded-lg bg-muted">
                                <span className="font-mono text-sm text-primary min-w-[200px]">{key}</span>
                                <span className="font-mono text-sm text-muted-foreground">{value}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
