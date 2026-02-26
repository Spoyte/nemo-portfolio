"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Code2,
  Globe,
  History,
  Trash2,
  Copy,
  Check,
  Play,
  Save,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: Date;
  status?: number;
  duration?: number;
}

interface SavedRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: string;
  body: string;
}

const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

const defaultHeaders = `{
  "Content-Type": "application/json"
}`;

export default function ApiPlaygroundPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.github.com/users/github");
  const [headers, setHeaders] = useState(defaultHeaders);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([
    {
      id: "1",
      name: "GitHub User",
      method: "GET",
      url: "https://api.github.com/users/github",
      headers: defaultHeaders,
      body: "",
    },
    {
      id: "2",
      name: "JSON Placeholder",
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      headers: defaultHeaders,
      body: "",
    },
    {
      id: "3",
      name: "Create Post",
      method: "POST",
      url: "https://jsonplaceholder.typicode.com/posts",
      headers: defaultHeaders,
      body: JSON.stringify({
        title: "foo",
        body: "bar",
        userId: 1,
      }, null, 2),
    },
  ]);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);

    const startTime = Date.now();

    try {
      const parsedHeaders = headers ? JSON.parse(headers) : {};
      
      const options: RequestInit = {
        method,
        headers: parsedHeaders,
      };

      if (["POST", "PUT", "PATCH"].includes(method) && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const duration = Date.now() - startTime;
      setResponseTime(duration);

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data,
      });

      // Add to history
      const historyItem: RequestHistory = {
        id: Math.random().toString(36).substr(2, 9),
        method,
        url,
        timestamp: new Date(),
        status: res.status,
        duration,
      };
      setHistory((prev) => [historyItem, ...prev].slice(0, 50));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      
      // Add to history even on error
      const historyItem: RequestHistory = {
        id: Math.random().toString(36).substr(2, 9),
        method,
        url,
        timestamp: new Date(),
      };
      setHistory((prev) => [historyItem, ...prev].slice(0, 50));
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveCurrentRequest = () => {
    if (!saveName.trim()) return;
    
    const newRequest: SavedRequest = {
      id: Math.random().toString(36).substr(2, 9),
      name: saveName,
      method,
      url,
      headers,
      body,
    };
    
    setSavedRequests((prev) => [...prev, newRequest]);
    setSaveName("");
    setSaveDialogOpen(false);
  };

  const loadRequest = (req: SavedRequest) => {
    setMethod(req.method);
    setUrl(req.url);
    setHeaders(req.headers);
    setBody(req.body);
  };

  const deleteSavedRequest = (id: string) => {
    setSavedRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const formatJson = (obj: any) => JSON.stringify(obj, null, 2);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500";
    if (status >= 300 && status < 400) return "bg-yellow-500";
    if (status >= 400) return "bg-red-500";
    return "bg-gray-500";
  };

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
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">API Playground</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">API Tester</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Test API endpoints, inspect responses, and debug your integrations. 
            A lightweight alternative to Postman.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Tabs defaultValue="saved" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="saved">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Saved
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="saved" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Saved Requests</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSaveDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                      <div className="divide-y">
                        {savedRequests.map((req) => (
                          <div
                            key={req.id}
                            className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer group"
                            onClick={() => loadRequest(req)}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Badge 
                                variant={
                                  req.method === "GET" ? "default" :
                                  req.method === "POST" ? "secondary" :
                                  req.method === "DELETE" ? "destructive" :
                                  "outline"
                                }
                                className="text-xs shrink-0"
                              >
                                {req.method}
                              </Badge>
                              <span className="text-sm truncate">{req.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSavedRequest(req.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {saveDialogOpen && (
                  <Card className="mt-4">
                    <CardContent className="p-4">
                      <Input
                        placeholder="Request name..."
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSaveDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={saveCurrentRequest}
                          disabled={!saveName.trim()}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Recent Requests</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setHistory([])}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                      <div className="divide-y">
                        {history.map((req) => (
                          <div
                            key={req.id}
                            className="p-3 hover:bg-muted/50 cursor-pointer"
                            onClick={() => {
                              setMethod(req.method);
                              setUrl(req.url);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={
                                  req.method === "GET" ? "default" :
                                  req.method === "POST" ? "secondary" :
                                  req.method === "DELETE" ? "destructive" :
                                  "outline"
                                }
                                className="text-xs"
                              >
                                {req.method}
                              </Badge>
                              {req.status && (
                                <Badge 
                                  className={`text-xs ${getStatusColor(req.status)} text-white`}
                                >
                                  {req.status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm truncate mt-1">{req.url}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{req.timestamp.toLocaleTimeString()}</span>
                              {req.duration && (
                                <>
                                  <span>•</span>
                                  <span>{req.duration}ms</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                        {history.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No requests yet
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Request Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* URL Bar */}
                <div className="flex gap-2">
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {httpMethods.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Enter URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  
                  <Button 
                    onClick={sendRequest} 
                    disabled={loading || !url}
                    className="gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Send
                      </>
                    )}
                  </Button>
                </div>

                {/* Request Body */}
                <Tabs defaultValue="headers" className="w-full">
                  <TabsList>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    {["POST", "PUT", "PATCH"].includes(method) && (
                      <TabsTrigger value="body">Body</TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="headers" className="mt-4">
                    <Textarea
                      placeholder="Enter headers as JSON..."
                      value={headers}
                      onChange={(e) => setHeaders(e.target.value)}
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </TabsContent>

                  {["POST", "PUT", "PATCH"].includes(method) && (
                    <TabsContent value="body" className="mt-4">
                      <Textarea
                        placeholder="Enter request body..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={6}
                        className="font-mono text-sm"
                      />
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>

            {/* Response Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Response
                  </CardTitle>
                  
                  {response && (
                    <div className="flex items-center gap-4">
                      {responseTime && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {responseTime}ms
                        </div>
                      )}
                      <Badge className={`${getStatusColor(response.status)} text-white`}>
                        {response.status} {response.statusText}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyResponse}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-2 text-red-500 py-4">
                    <XCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                ) : response ? (
                  <Tabs defaultValue="body" className="w-full">
                    <TabsList>
                      <TabsTrigger value="body">Body</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="body" className="mt-4">
                      <ScrollArea className="h-[400px]">
                        <pre className="font-mono text-sm bg-muted p-4 rounded-lg">
                          {formatJson(response.data)}
                        </pre>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="headers" className="mt-4">
                      <ScrollArea className="h-[400px]">
                        <pre className="font-mono text-sm bg-muted p-4 rounded-lg">
                          {formatJson(response.headers)}
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Send className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Send a request to see the response</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
