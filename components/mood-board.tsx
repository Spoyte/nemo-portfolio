"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Plus, 
  X, 
  Move,
  Maximize2,
  Minimize2,
  Trash2,
  Image as ImageIcon,
  Link,
  Quote,
  Code,
  Palette,
  Type,
  Grid3X3,
  Download,
  Share2,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MoodBoardItem {
  id: string;
  type: "image" | "quote" | "code" | "color" | "note" | "link";
  content: string;
  title?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  tags: string[];
  createdAt: Date;
}

// Sample inspiration items
const SAMPLE_ITEMS: MoodBoardItem[] = [
  {
    id: "1",
    type: "quote",
    content: "Design is not just what it looks like and feels like. Design is how it works.",
    title: "Steve Jobs",
    x: 50,
    y: 50,
    width: 300,
    height: 150,
    zIndex: 1,
    tags: ["design", "inspiration"],
    createdAt: new Date(),
  },
  {
    id: "2",
    type: "color",
    content: "#dc2626",
    title: "Primary Red",
    x: 400,
    y: 80,
    width: 150,
    height: 150,
    zIndex: 2,
    tags: ["color", "brand"],
    createdAt: new Date(),
  },
  {
    id: "3",
    type: "code",
    content: "const createMagic = () => {\n  return wonder + code;\n};",
    title: "Snippet",
    x: 600,
    y: 200,
    width: 280,
    height: 120,
    zIndex: 3,
    tags: ["code", "javascript"],
    createdAt: new Date(),
  },
  {
    id: "4",
    type: "note",
    content: "Idea: Create a component that visualizes data as a living organism",
    x: 100,
    y: 250,
    width: 250,
    height: 100,
    zIndex: 4,
    tags: ["idea", "concept"],
    createdAt: new Date(),
  },
  {
    id: "5",
    type: "color",
    content: "#0c0a09",
    title: "Dark Stone",
    x: 380,
    y: 280,
    width: 120,
    height: 120,
    zIndex: 5,
    tags: ["color", "dark"],
    createdAt: new Date(),
  },
  {
    id: "6",
    type: "link",
    content: "https://dribbble.com",
    title: "Dribbble - Design Inspiration",
    x: 550,
    y: 50,
    width: 200,
    height: 80,
    zIndex: 6,
    tags: ["resource", "design"],
    createdAt: new Date(),
  },
];

const ITEM_TYPES = {
  image: { icon: ImageIcon, label: "Image", color: "bg-blue-500" },
  quote: { icon: Quote, label: "Quote", color: "bg-amber-500" },
  code: { icon: Code, label: "Code", color: "bg-purple-500" },
  color: { icon: Palette, label: "Color", color: "bg-pink-500" },
  note: { icon: Type, label: "Note", color: "bg-green-500" },
  link: { icon: Link, label: "Link", color: "bg-cyan-500" },
};

function ColorSwatch({ color }: { color: string }) {
  return (
    <div 
      className="w-full h-full rounded-lg shadow-inner flex items-end justify-end p-3"
      style={{ backgroundColor: color }}
    >
      <span className="bg-black/50 text-white px-2 py-1 rounded text-sm font-mono">
        {color}
      </span>
    </div>
  );
}

function DraggableItem({ 
  item, 
  isSelected,
  onSelect, 
  onUpdate, 
  onDelete,
  containerRef 
}: { 
  item: MoodBoardItem; 
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<MoodBoardItem>) => void;
  onDelete: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isResizing) return;
    e.preventDefault();
    onSelect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - item.x,
      y: e.clientY - item.y,
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, container.width - item.width));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, container.height - item.height));
        onUpdate({ x: newX, y: newY });
      }
      if (isResizing) {
        const newWidth = Math.max(100, e.clientX - item.x);
        const newHeight = Math.max(80, e.clientY - item.y);
        onUpdate({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, item, onUpdate, containerRef]);

  const typeConfig = ITEM_TYPES[item.type];

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        zIndex: isSelected ? 100 : item.zIndex,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`absolute group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
    >
      <Card className={`w-full h-full overflow-hidden transition-shadow ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
      }`}>
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-2 bg-muted/50 border-b">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${typeConfig.color}`} />
              <span className="text-xs font-medium truncate">{typeConfig.label}</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-3 overflow-hidden">
            {item.type === "color" && <ColorSwatch color={item.content} />}
            
            {item.type === "quote" && (
              <div className="h-full flex flex-col justify-center">
                <p className="text-sm italic leading-relaxed">"{item.content}"</p>
                {item.title && <p className="text-xs text-muted-foreground mt-2">— {item.title}</p>}
              </div>
            )}

            {item.type === "code" && (
              <pre className="text-xs font-mono bg-muted p-2 rounded overflow-auto h-full">
                <code>{item.content}</code>
              </pre>
            )}

            {(item.type === "note" || item.type === "link") && (
              <div className="h-full">
                {item.title && <p className="font-medium text-sm mb-1">{item.title}</p>}
                <p className={`text-sm ${item.type === "link" ? 'text-blue-500 underline' : 'text-muted-foreground'}`}>
                  {item.content}
                </p>
              </div>
            )}

            {item.type === "image" && (
              <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1">
              {item.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </div>
      </Card>
    </motion.div>
  );
}

export function MoodBoard() {
  const [items, setItems] = useState<MoodBoardItem[]>(SAMPLE_ITEMS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    type: "note" as const,
    content: "",
    title: "",
    tags: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);

  const handleUpdateItem = (id: string, updates: Partial<MoodBoardItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleAddItem = () => {
    if (!newItem.content.trim()) return;

    const item: MoodBoardItem = {
      id: Date.now().toString(),
      type: newItem.type,
      content: newItem.content,
      title: newItem.title || undefined,
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      width: newItem.type === "color" ? 150 : 280,
      height: newItem.type === "color" ? 150 : newItem.type === "link" ? 80 : 120,
      zIndex: maxZIndex + 1,
      tags: newItem.tags.split(",").map(t => t.trim()).filter(Boolean),
      createdAt: new Date(),
    };

    setItems([...items, item]);
    setMaxZIndex(maxZIndex + 1);
    setNewItem({ type: "note", content: "", title: "", tags: "" });
    setShowAddDialog(false);
  };

  const handleSelectItem = (id: string) => {
    setSelectedId(id);
    setMaxZIndex(prev => prev + 1);
    handleUpdateItem(id, { zIndex: maxZIndex + 1 });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = !filterType || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const allTags = Array.from(new Set(items.flatMap(i => i.tags)));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Grid3X3 className="h-6 w-6 text-primary" />
            Mood Board
          </h2>
          <p className="text-muted-foreground">
            A visual space for inspiration. Drag to rearrange, resize to fit.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setItems(SAMPLE_ITEMS)}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inspiration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterType === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType(null)}
          >
            All
          </Button>
          {Object.entries(ITEM_TYPES).map(([key, type]) => (
            <Button
              key={key}
              variant={filterType === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(filterType === key ? null : key)}
              className="gap-1"
            >
              <type.icon className="h-3 w-3" />
              <span className="hidden sm:inline">{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="cursor-pointer hover:bg-primary/20"
              onClick={() => setSearchQuery(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Board */}
      <div 
        ref={containerRef}
        className="relative h-[600px] border rounded-xl bg-muted/30 overflow-hidden"
        onClick={() => setSelectedId(null)}
      >
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        <AnimatePresence>
          {filteredItems.map(item => (
            <DraggableItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onSelect={() => handleSelectItem(item.id)}
              onUpdate={(updates) => handleUpdateItem(item.id, updates)}
              onDelete={() => handleDeleteItem(item.id)}
              containerRef={containerRef}
            />
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No items match your search.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setSearchQuery(""); setFilterType(null); }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Inspiration</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Type Selection */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ITEM_TYPES).map(([key, type]) => (
                <Button
                  key={key}
                  variant={newItem.type === key ? "default" : "outline"}
                  className="flex-col h-auto py-3 gap-2"
                  onClick={() => setNewItem({ ...newItem, type: key as any })}
                >
                  <type.icon className="h-5 w-5" />
                  <span className="text-xs">{type.label}</span>
                </Button>
              ))}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title (optional)</label>
              <Input
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Give it a title..."
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              {newItem.type === "code" ? (
                <Textarea
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  placeholder="Paste your code..."
                  rows={5}
                  className="font-mono text-sm"
                />
              ) : newItem.type === "color" ? (
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newItem.content || "#dc2626"}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={newItem.content}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    placeholder="#dc2626"
                    className="flex-1"
                  />
                </div>
              ) : (
                <Textarea
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  placeholder={
                    newItem.type === "quote" ? "Enter a quote..." :
                    newItem.type === "link" ? "https://..." :
                    "Enter your note..."
                  }
                  rows={3}
                />
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input
                value={newItem.tags}
                onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                placeholder="design, inspiration, color..."
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleAddItem}
              disabled={!newItem.content.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Board
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
