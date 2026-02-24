"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Sprout, 
  TreePine, 
  Flower2, 
  Leaf,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  Link2,
  Share2,
  Bookmark,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Growth stages for notes
const GROWTH_STAGES = {
  seed: { label: "Seed", icon: Sprout, color: "text-amber-500", bg: "bg-amber-500/10" },
  sprout: { label: "Sprout", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  growing: { label: "Growing", icon: TreePine, color: "text-green-500", bg: "bg-green-500/10" },
  evergreen: { label: "Evergreen", icon: Flower2, color: "text-purple-500", bg: "bg-purple-500/10" },
};

// Sample garden notes
const GARDEN_NOTES = [
  {
    id: "1",
    title: "React Server Components",
    content: "Exploring the paradigm shift in React architecture. RSCs blur the line between server and client...",
    stage: "evergreen" as const,
    tags: ["React", "Architecture"],
    createdAt: "2025-01-15",
    updatedAt: "2025-02-20",
    connections: ["2", "3"],
    backlinks: 12,
    growthDays: 45,
  },
  {
    id: "2",
    title: "Streaming SSR Patterns",
    content: "How to leverage streaming for better perceived performance. The key is progressive enhancement...",
    stage: "growing" as const,
    tags: ["Performance", "React"],
    createdAt: "2025-02-01",
    updatedAt: "2025-02-18",
    connections: ["1"],
    backlinks: 8,
    growthDays: 28,
  },
  {
    id: "3",
    title: "The Future of CSS",
    content: "Container queries, cascade layers, and :has() selector are changing how we write styles...",
    stage: "growing" as const,
    tags: ["CSS", "Web Platform"],
    createdAt: "2025-02-10",
    updatedAt: "2025-02-22",
    connections: ["1", "4"],
    backlinks: 15,
    growthDays: 15,
  },
  {
    id: "4",
    title: "Design Tokens Deep Dive",
    content: "Systematic approach to design variables. Colors, spacing, typography as code...",
    stage: "sprout" as const,
    tags: ["Design Systems", "CSS"],
    createdAt: "2025-02-20",
    updatedAt: "2025-02-22",
    connections: ["3"],
    backlinks: 3,
    growthDays: 5,
  },
  {
    id: "5",
    title: "TypeScript 5.5 Features",
    content: "New inference improvements and the satisfies operator. Type narrowing is getting smarter...",
    stage: "seed" as const,
    tags: ["TypeScript"],
    createdAt: "2025-02-24",
    updatedAt: "2025-02-24",
    connections: [],
    backlinks: 0,
    growthDays: 1,
  },
  {
    id: "6",
    title: "WebAssembly for Frontend",
    content: "When to reach for WASM in web apps. Performance boundaries and use cases...",
    stage: "sprout" as const,
    tags: ["WebAssembly", "Performance"],
    createdAt: "2025-02-15",
    updatedAt: "2025-02-21",
    connections: ["7"],
    backlinks: 5,
    growthDays: 10,
  },
  {
    id: "7",
    title: "Rust for Web Developers",
    content: "Learning systems programming through Rust. Memory safety without garbage collection...",
    stage: "growing" as const,
    tags: ["Rust", "Learning"],
    createdAt: "2025-01-20",
    updatedAt: "2025-02-19",
    connections: ["6"],
    backlinks: 9,
    growthDays: 38,
  },
  {
    id: "8",
    title: "AI-Assisted Development",
    content: "How LLMs are changing the way we code. Pair programming with AI...",
    stage: "evergreen" as const,
    tags: ["AI", "Productivity"],
    createdAt: "2024-12-01",
    updatedAt: "2025-02-23",
    connections: ["5"],
    backlinks: 24,
    growthDays: 89,
  },
];

// Graph visualization component
function NoteGraph({ notes, selectedNote, onSelectNote }: { 
  notes: typeof GARDEN_NOTES; 
  selectedNote: string | null;
  onSelectNote: (id: string) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  // Calculate node positions in a force-directed-like layout
  const nodes = notes.map((note, i) => {
    const angle = (i / notes.length) * 2 * Math.PI;
    const radius = 150;
    return {
      ...note,
      x: dimensions.width / 2 + Math.cos(angle) * radius,
      y: dimensions.height / 2 + Math.sin(angle) * radius,
    };
  });

  const connections: Array<{ from: typeof nodes[0]; to: typeof nodes[0] }> = [];
  nodes.forEach((node) => {
    node.connections.forEach((connId) => {
      const target = nodes.find((n) => n.id === connId);
      if (target) {
        connections.push({ from: node, to: target });
      }
    });
  });

  return (
    <svg
      ref={svgRef}
      className="w-full h-[400px]"
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
    >
      {/* Connection lines */}
      {connections.map((conn, i) => (
        <motion.line
          key={i}
          x1={conn.from.x}
          y1={conn.from.y}
          x2={conn.to.x}
          y2={conn.to.y}
          stroke="currentColor"
          strokeWidth="1"
          className="text-border"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 1, delay: i * 0.1 }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node) => {
        const stage = GROWTH_STAGES[node.stage];
        const isSelected = selectedNote === node.id;
        
        return (
          <motion.g
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: parseInt(node.id) * 0.05 }}
            className="cursor-pointer"
            onClick={() => onSelectNote(node.id)}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={isSelected ? 25 : 20}
              className={`${stage.bg.replace('/10', '/30')} transition-all duration-300`}
              stroke={isSelected ? "currentColor" : "none"}
              strokeWidth={isSelected ? 2 : 0}
            />
            <foreignObject x={node.x - 12} y={node.y - 12} width={24} height={24}>
              <div className={`flex items-center justify-center w-full h-full ${stage.color}`}>
                <stage.icon className="w-5 h-5" />
              </div>
            </foreignObject>
            <text
              x={node.x}
              y={node.y + 35}
              textAnchor="middle"
              className="text-xs fill-current"
              style={{ fontSize: '10px' }}
            >
              {node.title.slice(0, 15)}...
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

// Growth timeline component
function GrowthTimeline({ days }: { days: number }) {
  const milestones = [7, 30, 60, 90];
  const currentMilestone = milestones.findIndex(m => days < m) === -1 ? milestones.length : milestones.findIndex(m => days < m);
  
  return (
    <div className="flex items-center gap-1">
      {milestones.map((milestone, i) => (
        <div
          key={milestone}
          className={`h-1.5 w-6 rounded-full transition-colors ${
            i < currentMilestone ? 'bg-emerald-500' : 'bg-muted'
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-2">{days} days</span>
    </div>
  );
}

export function DigitalGarden() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "graph">("grid");

  const filteredNotes = GARDEN_NOTES.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = !selectedStage || note.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const selectedNoteData = GARDEN_NOTES.find(n => n.id === selectedNote);

  const allTags = Array.from(new Set(GARDEN_NOTES.flatMap(n => n.tags)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TreePine className="h-6 w-6 text-emerald-500" />
            Digital Garden
          </h2>
          <p className="text-muted-foreground">
            A collection of thoughts, notes, and ideas that grow over time.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Filter className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === "graph" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("graph")}
          >
            <GitBranch className="h-4 w-4 mr-1" />
            Graph
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedStage === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStage(null)}
          >
            All
          </Button>
          {Object.entries(GROWTH_STAGES).map(([key, stage]) => (
            <Button
              key={key}
              variant={selectedStage === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStage(key === selectedStage ? null : key)}
              className="gap-1"
            >
              <stage.icon className={`h-3 w-3 ${stage.color}`} />
              {stage.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(GROWTH_STAGES).map(([key, stage]) => {
          const count = GARDEN_NOTES.filter(n => n.stage === key).length;
          return (
            <Card key={key} className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedStage(key === selectedStage ? null : key)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stage.bg}`}>
                  <stage.icon className={`h-5 w-5 ${stage.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{stage.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === "graph" ? (
          <motion.div
            key="graph"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border rounded-xl p-6 bg-card"
          >
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Click on nodes to explore connections between ideas
            </p>
            <NoteGraph 
              notes={filteredNotes} 
              selectedNote={selectedNote}
              onSelectNote={setSelectedNote}
            />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredNotes.map((note, index) => {
              const stage = GROWTH_STAGES[note.stage];
              
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="group h-full hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
                    onClick={() => setSelectedNote(note.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg ${stage.bg}`}>
                          <stage.icon className={`h-5 w-5 ${stage.color}`} />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {note.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {note.content}
                        </p>
                      </div>

                      <GrowthTimeline days={note.growthDays} />

                      <div className="flex flex-wrap gap-1">
                        {note.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Link2 className="h-3 w-3" />
                            {note.connections.length}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="h-3 w-3" />
                            {note.backlinks}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {note.updatedAt}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note Detail Dialog */}
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedNoteData && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const stage = GROWTH_STAGES[selectedNoteData.stage];
                    return (
                      <div className={`p-2 rounded-lg ${stage.bg}`}>
                        <stage.icon className={`h-5 w-5 ${stage.color}`} />
                      </div>
                    );
                  })()}
                  <Badge variant="secondary">{selectedNoteData.stage}</Badge>
                </div>
                <DialogTitle className="text-2xl">{selectedNoteData.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created {selectedNoteData.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {selectedNoteData.updatedAt}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">{selectedNoteData.content}</p>
                  <p className="text-muted-foreground">
                    This note has been growing for {selectedNoteData.growthDays} days. 
                    As I learn more, this note will evolve from a {selectedNoteData.stage} into something more refined.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNoteData.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Connected Notes ({selectedNoteData.connections.length})
                  </h4>
                  {selectedNoteData.connections.length > 0 ? (
                    <div className="space-y-2">
                      {selectedNoteData.connections.map(connId => {
                        const connNote = GARDEN_NOTES.find(n => n.id === connId);
                        if (!connNote) return null;
                        return (
                          <Button
                            key={connId}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setSelectedNote(connId)}
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            {connNote.title}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No connections yet.</p>
                  )}
                </div>

                <GrowthTimeline days={selectedNoteData.growthDays} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-16">
          <Sprout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No notes found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => { setSearchQuery(""); setSelectedStage(null); }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
