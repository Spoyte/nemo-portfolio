"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Sparkles,
  Grid3X3,
  List,
  Search,
  Filter,
  Heart,
  ExternalLink,
  Play,
  Pause,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  artGenerators,
  getAllGeneratorIds,
  ArtGenerator,
  // Unified config - single source of truth
  CATEGORY_CONFIG,
  COMPLEXITY_CONFIG,
  getCategoryConfig,
  getComplexityConfig,
  getComplexityOrder,
} from "@/lib/art";

// Artwork card component with live preview
function ArtworkCard({
  id,
  generator,
  isFavorite,
  onToggleFavorite,
  onClick,
  viewMode,
}: {
  id: string;
  generator: ArtGenerator;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
  viewMode: "grid" | "list";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  const category = generator.meta?.category || "abstract";
  const complexity = generator.meta?.complexity || "moderate";
  const tags = generator.meta?.tags || [];
  const catConfig = getCategoryConfig(category);
  const compConfig = getComplexityConfig(complexity);
  const isAnimated = tags.includes("animated");

  // Generate thumbnail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate default params
    const params: Record<string, number | string> = {};
    Object.entries(generator.params).forEach(([key, config]) => {
      params[key] = config.default;
    });

    // Static render for thumbnail
    generator.generate(ctx, params, 0);

    // Animation loop for animated pieces
    if (isAnimated) {
      let startTime = Date.now();
      const animate = () => {
        const time = (Date.now() - startTime) / 1000;
        generator.generate(ctx, params, time);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [generator, isAnimated]);

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.01 }}
        className="group"
      >
        <Card
          className="cursor-pointer overflow-hidden hover:border-primary/50 transition-all"
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <canvas
                  ref={canvasRef}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
                {isAnimated && (
                  <div className="absolute bottom-1 right-1">
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">
                      <Play className="w-2 h-2 mr-0.5" />
                      GIF
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {generator.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {generator.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={onToggleFavorite}
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      )}
                    />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", catConfig.bgColor, catConfig.color)}
                  >
                    {catConfig.label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs", compConfig.color)}>
                    {compConfig.label}
                  </Badge>
                  {tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card
        className="cursor-pointer overflow-hidden hover:border-primary/50 transition-all h-full flex flex-col"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />

          {/* Hover overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2"
              >
                <Button size="sm" variant="secondary">
                  <Maximize2 className="w-4 h-4 mr-1" />
                  View
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated badge */}
          {isAnimated && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                <Play className="w-3 h-3 mr-1" />
                Animated
              </Badge>
            </div>
          )}

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60"
            onClick={onToggleFavorite}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-white"
              )}
            />
          </Button>
        </div>

        {/* Info */}
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {generator.name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {generator.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className={cn("text-xs", catConfig.bgColor, catConfig.color)}
            >
              {catConfig.label}
            </Badge>
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs capitalize">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Detail modal component
function ArtworkDetail({
  id,
  generator,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: {
  id: string;
  generator: ArtGenerator;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<Record<string, number | string>>({});

  const category = generator.meta?.category || "abstract";
  const complexity = generator.meta?.complexity || "moderate";
  const tags = generator.meta?.tags || [];
  const catConfig = getCategoryConfig(category);
  const compConfig = getComplexityConfig(complexity);
  const isAnimated = tags.includes("animated");

  // Initialize params
  useEffect(() => {
    const defaultParams: Record<string, number | string> = {};
    Object.entries(generator.params).forEach(([key, config]) => {
      defaultParams[key] = config.default;
    });
    setParams(defaultParams);
  }, [generator]);

  // Render loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isAnimated && isPlaying) {
      let startTime = Date.now();
      const animate = () => {
        const time = (Date.now() - startTime) / 1000;
        generator.generate(ctx, params, time);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      generator.generate(ctx, params, 0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [generator, params, isPlaying, isAnimated, isOpen]);

  const handleParamChange = (key: string, value: number | string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleRandomize = () => {
    const newParams: Record<string, number | string> = {};
    Object.entries(generator.params).forEach(([key, config]) => {
      if (config.type === "range" && config.min !== undefined && config.max !== undefined) {
        const step = config.step || 1;
        const steps = Math.floor((config.max - config.min) / step);
        const randomStep = Math.floor(Math.random() * (steps + 1));
        newParams[key] = config.min + randomStep * step;
      } else if (config.type === "select" && config.options) {
        newParams[key] = config.options[Math.floor(Math.random() * config.options.length)];
      } else {
        newParams[key] = config.default;
      }
    });
    setParams(newParams);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-hidden p-0">
        <div className="grid lg:grid-cols-[1fr,400px] h-full max-h-[95vh]">
          {/* Canvas area */}
          <div className="relative bg-black flex items-center justify-center p-4 lg:p-8 min-h-[300px] lg:min-h-0">
            {/* Navigation */}
            {hasPrevious && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious();
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
            {hasNext && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}

            <canvas
              ref={canvasRef}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Sidebar */}
          <div className="p-6 overflow-y-auto border-l">
            <DialogHeader className="text-left">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-2xl">{generator.name}</DialogTitle>
                  <DialogDescription className="mt-2">
                    {generator.description}
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleFavorite}
                >
                  <Heart
                    className={cn(
                      "w-6 h-6 transition-colors",
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground"
                    )}
                  />
                </Button>
              </div>
            </DialogHeader>

            {/* Metadata */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className={cn(catConfig.bgColor, catConfig.color)}>
                {catConfig.label}
              </Badge>
              <Badge className={compConfig.color}>{compConfig.label}</Badge>
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                {isAnimated && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 mr-1" />
                    ) : (
                      <Play className="w-4 h-4 mr-1" />
                    )}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleRandomize}>
                  <Shuffle className="w-4 h-4 mr-1" />
                  Randomize
                </Button>
              </div>

              {/* Parameter controls */}
              {Object.entries(generator.params).length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-sm">Parameters</h4>
                  {Object.entries(generator.params).map(([key, config]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-muted-foreground">
                          {config.name}
                        </label>
                        <span className="text-sm font-mono">
                          {params[key] ?? config.default}
                        </span>
                      </div>
                      {config.type === "range" && (
                        <input
                          type="range"
                          min={config.min}
                          max={config.max}
                          step={config.step}
                          value={(params[key] as number) ?? config.default}
                          onChange={(e) =>
                            handleParamChange(key, parseFloat(e.target.value))
                          }
                          className="w-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/art/${id}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Full Page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Favorites hook
function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    const saved = localStorage.getItem("artwork-favorites");
    return new Set(saved ? JSON.parse(saved) : []);
  });

  useEffect(() => {
    localStorage.setItem("artwork-favorites", JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}

// Main gallery component
export default function GenerativeArtGallery() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "category" | "complexity">("name");
  const { favorites, toggleFavorite } = useFavorites();

  // Get all artworks
  const allArtworks = useMemo(() => {
    const ids = getAllGeneratorIds();
    return ids
      .map((id) => ({ id, generator: artGenerators[id] }))
      .filter((item): item is { id: string; generator: ArtGenerator } =>
        Boolean(item.generator)
      );
  }, []);

  // Filter and sort artworks
  const filteredArtworks = useMemo(() => {
    let result = allArtworks;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        ({ id, generator }) =>
          generator.name.toLowerCase().includes(query) ||
          generator.description.toLowerCase().includes(query) ||
          id.toLowerCase().includes(query) ||
          generator.meta?.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "favorites") {
        result = result.filter(({ id }) => favorites.has(id));
      } else {
        result = result.filter(
          ({ generator }) => generator.meta?.category === selectedCategory
        );
      }
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.generator.name.localeCompare(b.generator.name);
        case "category":
          return (a.generator.meta?.category || "").localeCompare(
            b.generator.meta?.category || ""
          );
        case "complexity":
          return (
            getComplexityOrder(a.generator.meta?.complexity || "moderate") -
            getComplexityOrder(b.generator.meta?.complexity || "moderate")
          );
        default:
          return 0;
      }
    });

    return result;
  }, [allArtworks, searchQuery, selectedCategory, sortBy, favorites]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allArtworks.length };
    allArtworks.forEach(({ generator }) => {
      const cat = generator.meta?.category || "abstract";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    counts.favorites = favorites.size;
    return counts;
  }, [allArtworks, favorites]);

  // Selected artwork index for navigation
  const selectedIndex = selectedArtwork
    ? filteredArtworks.findIndex(({ id }) => id === selectedArtwork)
    : -1;

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedArtwork(filteredArtworks[selectedIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (selectedIndex < filteredArtworks.length - 1) {
      setSelectedArtwork(filteredArtworks[selectedIndex + 1].id);
    }
  };

  const selectedArtworkData = selectedArtwork
    ? allArtworks.find(({ id }) => id === selectedArtwork)
    : null;

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
            <Palette className="h-4 w-4" />
            <span className="text-sm font-medium">
              {allArtworks.length} Algorithms
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Generative Art
            <span className="text-gradient-animated"> Gallery</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of {allArtworks.length} generative art algorithms exploring
            mathematics, nature, physics, and abstract beauty through code.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search and view toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artworks, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("category")}>
                    Category
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("complexity")}>
                    Complexity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All ({categoryCounts.all})
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                <Heart className="w-3 h-3 mr-1" />
                Favorites ({categoryCounts.favorites})
              </TabsTrigger>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) =>
                categoryCounts[key] ? (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className={cn(
                      "data-[state=active]:text-white",
                      config.activeBg && `data-[state=active]:${config.activeBg}`
                    )}
                  >
                    {config.label} ({categoryCounts[key] || 0})
                  </TabsTrigger>
                ) : null
              )}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredArtworks.length} of {allArtworks.length} artworks
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Gallery grid/list */}
        <motion.div
          layout
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map(({ id, generator }) => (
              <ArtworkCard
                key={id}
                id={id}
                generator={generator}
                isFavorite={favorites.has(id)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  toggleFavorite(id);
                }}
                onClick={() => setSelectedArtwork(id)}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredArtworks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No artworks found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>

      {/* Detail modal */}
      {selectedArtworkData && (
        <ArtworkDetail
          id={selectedArtwork}
          generator={selectedArtworkData.generator}
          isOpen={!!selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          isFavorite={favorites.has(selectedArtwork)}
          onToggleFavorite={() => toggleFavorite(selectedArtwork)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={selectedIndex > 0}
          hasNext={selectedIndex < filteredArtworks.length - 1}
        />
      )}
    </div>
  );
}
