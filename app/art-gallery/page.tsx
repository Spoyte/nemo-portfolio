"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid3X3,
  List,
  Filter,
  Sparkles,
  Heart,
  BarChart3,
  X,
  ChevronDown,
  Palette,
  Shapes,
  Waves,
  TreePine,
  Box,
  Type,
  Atom,
  Brush,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { artGenerators, ArtCategory, ArtComplexity, ArtTag } from "@/lib/art";
import { useFavorites } from "@/lib/art/favorites";

// Category configuration with icons and descriptions
const CATEGORY_CONFIG: Record<
  ArtCategory,
  { icon: React.ElementType; label: string; description: string; color: string }
> = {
  mathematical: {
    icon: Atom,
    label: "Mathematical",
    description: "Pure mathematical beauty: fractals, curves, and geometric forms",
    color: "bg-purple-500/10 text-purple-500",
  },
  natural: {
    icon: TreePine,
    label: "Natural Systems",
    description: "Nature-inspired algorithms: trees, terrain, organic growth",
    color: "bg-green-500/10 text-green-500",
  },
  physics: {
    icon: Waves,
    label: "Physics",
    description: "Physical simulations: fluids, particles, waves, and forces",
    color: "bg-blue-500/10 text-blue-500",
  },
  geometric: {
    icon: Shapes,
    label: "Geometric",
    description: "Patterns and symmetry: mandalas, tessellations, Islamic patterns",
    color: "bg-orange-500/10 text-orange-500",
  },
  abstract: {
    icon: Palette,
    label: "Abstract",
    description: "Abstract expressions: fields, reaction-diffusion, noise art",
    color: "bg-pink-500/10 text-pink-500",
  },
  traditional: {
    icon: Brush,
    label: "Traditional",
    description: "Traditional media: cross-hatching, stained glass, weaving",
    color: "bg-amber-500/10 text-amber-500",
  },
  "3d": {
    icon: Box,
    label: "3D",
    description: "Three-dimensional: wireframes, raymarching, sculptures",
    color: "bg-cyan-500/10 text-cyan-500",
  },
  text: {
    icon: Type,
    label: "Typography",
    description: "Text-based art: ASCII, kinetic typography",
    color: "bg-indigo-500/10 text-indigo-500",
  },
  interactive: {
    icon: Layers,
    label: "Interactive",
    description: "Interactive experiences: audio-reactive, mouse-responsive",
    color: "bg-rose-500/10 text-rose-500",
  },
};

// Complexity badges
const COMPLEXITY_CONFIG: Record<
  ArtComplexity,
  { label: string; color: string }
> = {
  simple: { label: "Simple", color: "bg-green-500/20 text-green-600" },
  moderate: { label: "Moderate", color: "bg-yellow-500/20 text-yellow-600" },
  complex: { label: "Complex", color: "bg-orange-500/20 text-orange-600" },
  expert: { label: "Expert", color: "bg-red-500/20 text-red-600" },
};

// Tag configuration
const TAG_LABELS: Record<ArtTag, string> = {
  animated: "Animated",
  static: "Static",
  monochrome: "Monochrome",
  colorful: "Colorful",
  geometric: "Geometric",
  organic: "Organic",
  chaotic: "Chaotic",
  ordered: "Ordered",
  minimal: "Minimal",
  detailed: "Detailed",
  retro: "Retro",
  futuristic: "Futuristic",
  nature: "Nature",
  abstract: "Abstract",
};

// Get all generators with their metadata
function getOrganizedGenerators() {
  return Object.entries(artGenerators).map(([id, generator]) => ({
    id,
    ...generator,
    meta: generator.meta || {
      category: "abstract" as ArtCategory,
      complexity: "moderate" as ArtComplexity,
      tags: [] as ArtTag[],
      created: "2024-01-01",
    },
  }));
}

export default function ArtGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ArtCategory | "all">("all");
  const [selectedComplexity, setSelectedComplexity] = useState<ArtComplexity | "all">("all");
  const [selectedTags, setSelectedTags] = useState<ArtTag[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites, isFavorite } = useFavorites();

  const generators = useMemo(() => getOrganizedGenerators(), []);

  // Get unique tags from all generators
  const allTags = useMemo(() => {
    const tags = new Set<ArtTag>();
    generators.forEach((g) => g.meta?.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [generators]);

  // Filter generators based on all criteria
  const filteredGenerators = useMemo(() => {
    return generators.filter((generator) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          generator.name.toLowerCase().includes(query) ||
          generator.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && generator.meta?.category !== selectedCategory) {
        return false;
      }

      // Complexity filter
      if (selectedComplexity !== "all" && generator.meta?.complexity !== selectedComplexity) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((tag) =>
          generator.meta?.tags?.includes(tag)
        );
        if (!hasAllTags) return false;
      }

      // Favorites filter
      if (showFavoritesOnly && !isFavorite(generator.id)) {
        return false;
      }

      return true;
    });
  }, [
    generators,
    searchQuery,
    selectedCategory,
    selectedComplexity,
    selectedTags,
    showFavoritesOnly,
    isFavorite,
  ]);

  // Group by category for display
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, typeof generators> = {};
    filteredGenerators.forEach((g) => {
      const cat = g.meta?.category || "abstract";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(g);
    });
    return groups;
  }, [filteredGenerators]);

  // Toggle tag selection
  const toggleTag = (tag: ArtTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedComplexity("all");
    setSelectedTags([]);
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedComplexity !== "all" ||
    selectedTags.length > 0 ||
    showFavoritesOnly;

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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Algorithm Gallery</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Generative Art Collection
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore {generators.length} algorithmic art pieces. Each created with code,
            infinitely variable, mathematically beautiful.
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={showFavoritesOnly ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
                Favorites ({favorites.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-secondary" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none rounded-l-md"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-none rounded-r-md"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {/* Categories */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={selectedCategory === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory("all")}
                        >
                          All
                        </Button>
                        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                          <Button
                            key={key}
                            variant={selectedCategory === key ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(key as ArtCategory)}
                            className="gap-1"
                          >
                            <config.icon className="h-3 w-3" />
                            {config.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Complexity */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Complexity</label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={selectedComplexity === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedComplexity("all")}
                        >
                          All
                        </Button>
                        {Object.entries(COMPLEXITY_CONFIG).map(([key, config]) => (
                          <Button
                            key={key}
                            variant={selectedComplexity === key ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedComplexity(key as ArtComplexity)}
                          >
                            {config.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    {allTags.length > 0 && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {allTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                selectedTags.includes(tag)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              }`}
                            >
                              {TAG_LABELS[tag]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Clear all filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredGenerators.length} of {generators.length} artworks
            </span>
            {hasActiveFilters && (
              <span className="text-primary">Filters active</span>
            )}
          </div>
        </motion.div>

        {/* Gallery Content */}
        {filteredGenerators.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Palette className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No artworks found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </motion.div>
        ) : selectedCategory === "all" && !searchQuery ? (
          // Grouped by category view
          Object.entries(groupedByCategory).map(([category, items], groupIndex) => {
            const config = CATEGORY_CONFIG[category as ArtCategory];
            if (!config) return null;

            return (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + groupIndex * 0.05 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <config.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{config.label}</h2>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {items.length}
                  </Badge>
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                      : "space-y-2"
                  }
                >
                  {items.map((generator, index) => (
                    <ArtworkCard
                      key={generator.id}
                      generator={generator}
                      viewMode={viewMode}
                      index={index}
                    />
                  ))}
                </div>
              </motion.section>
            );
          })
        ) : (
          // Flat grid view for filtered results
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-2"
            }
          >
            {filteredGenerators.map((generator, index) => (
              <ArtworkCard
                key={generator.id}
                generator={generator}
                viewMode={viewMode}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{generators.length}</div>
              <div className="text-sm text-muted-foreground">Total Artworks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {Object.keys(CATEGORY_CONFIG).length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{favorites.length}</div>
              <div className="text-sm text-muted-foreground">Your Favorites</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {generators.filter((g) => g.meta?.tags?.includes("animated")).length}
              </div>
              <div className="text-sm text-muted-foreground">Animated</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Individual artwork card component
function ArtworkCard({
  generator,
  viewMode,
  index,
}: {
  generator: ReturnType<typeof getOrganizedGenerators>[0];
  viewMode: "grid" | "list";
  index: number;
}) {
  const { isFavorite } = useFavorites();
  const categoryConfig = CATEGORY_CONFIG[generator.meta?.category || "abstract"];
  const complexityConfig = COMPLEXITY_CONFIG[generator.meta?.complexity || "moderate"];

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
      >
        <Link href={`/art?piece=${generator.id}`}>
          <Card className="hover:bg-secondary/50 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2 rounded-lg ${categoryConfig.color}`}>
                <categoryConfig.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{generator.name}</h3>
                  {isFavorite(generator.id) && (
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {generator.description}
                </p>
              </div>
              <Badge variant="secondary" className={complexityConfig.color}>
                {complexityConfig.label}
              </Badge>
              <div className="flex gap-1">
                {generator.meta?.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-secondary rounded text-xs text-muted-foreground"
                  >
                    {TAG_LABELS[tag]}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link href={`/art?piece=${generator.id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group h-full">
          <CardContent className="p-0">
            {/* Preview Area */}
            <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-background relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <categoryConfig.icon className="h-16 w-16 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500" />
              </div>
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              {/* Favorite indicator */}
              {isFavorite(generator.id) && (
                <div className="absolute top-3 right-3">
                  <Heart className="h-5 w-5 text-red-500 fill-current" />
                </div>
              )}
              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className={`${categoryConfig.color} text-xs`}>
                  <categoryConfig.icon className="h-3 w-3 mr-1" />
                  {categoryConfig.label}
                </Badge>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                    {generator.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {generator.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <Badge variant="outline" className={`text-xs ${complexityConfig.color}`}>
                  <BarChart3 className="h-3 w-3 mr-1" />
                  {complexityConfig.label}
                </Badge>
                <div className="flex gap-1">
                  {generator.meta?.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded"
                    >
                      {TAG_LABELS[tag]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
