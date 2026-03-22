"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  BookOpen,
  Bookmark,
  Check,
  Clock,
  ExternalLink,
  Filter,
  Grid,
  Heart,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ReadingItem {
  id: string;
  title: string;
  author: string;
  url: string;
  category: string;
  tags: string[];
  status: "want-to-read" | "reading" | "completed" | "on-hold";
  progress: number;
  rating?: number;
  notes?: string;
  dateAdded: string;
  dateCompleted?: string;
  cover?: string;
}

const defaultReadings: ReadingItem[] = [
  {
    id: "1",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
    category: "Technical",
    tags: ["programming", "best-practices", "career"],
    status: "completed",
    progress: 100,
    rating: 5,
    dateAdded: "2024-01-15",
    dateCompleted: "2024-02-20",
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    url: "https://www.oreilly.com/library/view/clean-code/9780136083238/",
    category: "Technical",
    tags: ["programming", "clean-code", "software-design"],
    status: "reading",
    progress: 65,
    dateAdded: "2024-02-01",
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    url: "https://jamesclear.com/atomic-habits",
    category: "Personal Development",
    tags: ["habits", "productivity", "self-improvement"],
    status: "reading",
    progress: 30,
    dateAdded: "2024-03-01",
  },
  {
    id: "4",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    url: "https://dataintensive.net/",
    category: "Technical",
    tags: ["databases", "distributed-systems", "architecture"],
    status: "want-to-read",
    progress: 0,
    dateAdded: "2024-03-10",
  },
  {
    id: "5",
    title: "Deep Work",
    author: "Cal Newport",
    url: "https://www.calnewport.com/books/deep-work/",
    category: "Personal Development",
    tags: ["productivity", "focus", "work"],
    status: "completed",
    progress: 100,
    rating: 4,
    dateAdded: "2024-01-20",
    dateCompleted: "2024-02-15",
  },
  {
    id: "6",
    title: "System Design Interview",
    author: "Alex Xu",
    url: "https://www.systemdesigninterview.com/",
    category: "Technical",
    tags: ["system-design", "interview", "architecture"],
    status: "on-hold",
    progress: 45,
    dateAdded: "2024-02-10",
  },
];

const categories = ["All", "Technical", "Personal Development", "Fiction", "Science", "Philosophy"];

const statusConfig = {
  "want-to-read": { label: "Want to Read", color: "bg-blue-500/10 text-blue-500" },
  reading: { label: "Reading", color: "bg-yellow-500/10 text-yellow-500" },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-500" },
  "on-hold": { label: "On Hold", color: "bg-gray-500/10 text-gray-500" },
};

export default function ReadingListPage() {
  const [readings, setReadings] = useState<ReadingItem[]>(defaultReadings);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<ReadingItem | null>(null);

  const filteredReadings = readings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: readings.length,
    reading: readings.filter((r) => r.status === "reading").length,
    completed: readings.filter((r) => r.status === "completed").length,
    wantToRead: readings.filter((r) => r.status === "want-to-read").length,
    averageRating: readings.filter((r) => r.rating).length > 0
      ? readings.filter((r) => r.rating).reduce((acc, r) => acc + (r.rating || 0), 0) /
        readings.filter((r) => r.rating).length
      : 0,
  };

  const updateProgress = (id: string, newProgress: number) => {
    setReadings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, progress: newProgress };
          if (newProgress === 100 && item.status !== "completed") {
            updated.status = "completed";
            updated.dateCompleted = new Date().toISOString().split("T")[0];
            toast.success(`Completed "${item.title}"! 🎉`);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const toggleStatus = (id: string) => {
    const statuses: ReadingItem["status"][] = ["want-to-read", "reading", "completed", "on-hold"];
    setReadings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentIndex = statuses.indexOf(item.status);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold"
              >
                Reading{" "}
                <span className="text-gradient-animated">List</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground mt-2"
              >
                Track my reading journey and discover new books
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Stats
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-card border"
            >
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Books</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-card border"
            >
              <div className="text-2xl font-bold">{stats.reading}</div>
              <div className="text-sm text-muted-foreground">Currently Reading</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-card border"
            >
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-card border"
            >
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books, authors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="reading">Reading ({stats.reading})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
              <TabsTrigger value="want-to-read">Want to Read ({stats.wantToRead})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReadings.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="group h-full flex flex-col">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                                {item.title}
                              </CardTitle>
                              <CardDescription className="mt-1">{item.author}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={statusConfig[item.status].color}>
                              {statusConfig[item.status].label}
                            </Badge>
                            <Badge variant="outline">{item.category}</Badge>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{item.progress}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                              />
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Rating */}
                          {item.rating && (
                            <div className="flex items-center gap-1 mt-auto">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < item.rating!
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => toggleStatus(item.id)}
                            >
                              Update Status
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateProgress(item.id, Math.min(item.progress + 10, 100))}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    {filteredReadings.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.author}</p>
                        </div>
                        <Badge className={statusConfig[item.status].color}>
                          {statusConfig[item.status].label}
                        </Badge>
                        <div className="w-24">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{item.progress}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reading">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReadings
                  .filter((r) => r.status === "reading")
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.author}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span className="font-bold">{item.progress}%</span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateProgress(item.id, Math.min(item.progress + 10, 100))}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Update Progress
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReadings
                  .filter((r) => r.status === "completed")
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              <CardDescription>{item.author}</CardDescription>
                            </div>
                            <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {item.rating && (
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < item.rating!
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          {item.dateCompleted && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Completed on {item.dateCompleted}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="want-to-read">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReadings
                  .filter((r) => r.status === "want-to-read")
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.author}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={() => toggleStatus(item.id)}
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              Start Reading
                            </Button>
                            <Button variant="outline" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
