"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Grid3X3, List, Shuffle, Filter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { artGenerators } from "@/lib/art";
import { generateAllThumbnails } from "@/lib/art/thumbnails";
import { useFavorites } from "@/lib/art/favorites";

// Categories for filtering
const CATEGORIES: Record<string, string[]> = {
  "All": Object.keys(artGenerators),
  "Favorites": [], // Populated dynamically based on favorites
  "Animated": ["voronoi-organic", "wave-interference", "flow-field", "topographic-flow", "orbital-mechanics", "light-caverns", "fluid-smoke", "particle-swarm", "mandelbrot-explorer", "neural-dreams", "boid-flocking"],
  "Static": ["geometric-mandala", "recursive-trees", "strange-attractor", "dla", "reaction-diffusion", "cellular-automata", "particle-network", "perlin-terrain"],
  "Nature": ["recursive-trees", "flow-field", "voronoi-organic", "dla", "reaction-diffusion", "particle-swarm", "perlin-terrain", "boid-flocking"],
  "Physics": ["orbital-mechanics", "wave-interference", "fluid-smoke", "strange-attractor"],
  "Geometric": ["geometric-mandala", "recursive-trees", "cellular-automata", "topographic-flow"],
  "Fractal": ["mandelbrot-explorer", "perlin-terrain"],
  "AI/ML": ["neural-dreams"],
};

export default function ArtGalleryPage() {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);
  const { favorites, toggleFavorite, isFavorite, count: favoriteCount } = useFavorites();

  // Generate thumbnails on mount
  useEffect(() => {
    const generateThumbs = async () => {
      setIsGenerating(true);
      // Small delay to let UI render first
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const thumbs = generateAllThumbnails({ width: 400, height: 300, quality: 0.6 });
        setThumbnails(thumbs);
      } catch (err) {
        console.error("Failed to generate thumbnails:", err);
      } finally {
        setIsGenerating(false);
      }
    };
    
    generateThumbs();
  }, []);

  // Filter pieces based on category and search
  const filteredPieces = useMemo(() => {
    let keys: string[];
    
    if (activeCategory === "Favorites") {
      keys = favorites;
    } else {
      keys = CATEGORIES[activeCategory] || Object.keys(artGenerators);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      keys = keys.filter(key => {
        const generator = artGenerators[key];
        return (
          generator.name.toLowerCase().includes(query) ||
          generator.description.toLowerCase().includes(query)
        );
      });
    }
    
    return keys;
  }, [activeCategory, searchQuery, favorites]);

  // Randomize category selection
  const handleRandomize = () => {
    const randomKey = filteredPieces[Math.floor(Math.random() * filteredPieces.length)];
    if (randomKey) {
      window.location.href = `/art?piece=${randomKey}`;
    }
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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">{Object.keys(artGenerators).length} Algorithms</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Art Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the collection of generative art algorithms. Each piece is uniquely generated 
            through code, mathematics, and controlled randomness.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button variant="outline" size="sm" onClick={handleRandomize}>
                <Shuffle className="h-4 w-4 mr-1" />
                Random
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.keys(CATEGORIES).map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={category === "Favorites" ? "gap-1" : ""}
              >
                {category === "Favorites" && (
                  <Heart className="h-3 w-3" />
                )}
                {category}
                <span className="ml-1 text-xs opacity-60">
                  ({category === "Favorites" ? favoriteCount : CATEGORIES[category].length})
                </span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }
        >
          {filteredPieces.map((key, index) => {
            const generator = artGenerators[key];
            const thumbnail = thumbnails[key];
            const isFav = isFavorite(key);
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className={viewMode === "grid" 
                      ? "aspect-[4/3] bg-black relative overflow-hidden"
                      : "h-32 bg-black relative overflow-hidden"
                    }>
                      <Link href={`/art?piece=${key}`}>
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={generator.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center cursor-pointer">
                            <div className="animate-pulse w-8 h-8 rounded-full bg-primary/20" />
                          </div>
                        )}
                      </Link>
                      
                      {/* Favorite button - positioned absolutely */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(key);
                        }}
                        className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
                          isFav 
                            ? "bg-red-500 text-white" 
                            : "bg-black/50 text-white/70 hover:bg-black/70 hover:text-white"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                      </button>
                      
                      {/* Hover overlay */}
                      <Link href={`/art?piece=${key}`}>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Button variant="secondary" size="sm">
                            <Sparkles className="h-4 w-4 mr-1" />
                            Open
                          </Button>
                        </div>
                      </Link>
                    </div>
                    
                    {/* Info */}
                    <Link href={`/art?piece=${key}`}>
                      <div className="p-4 cursor-pointer">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {generator.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {generator.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {CATEGORIES["Animated"].includes(key) && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                              Animated
                            </span>
                          )}
                          {Object.entries(CATEGORIES)
                            .filter(([cat, keys]) => cat !== "All" && cat !== "Animated" && keys.includes(key))
                            .slice(0, 2)
                            .map(([cat]) => (
                              <span 
                                key={cat}
                                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                              >
                                {cat}
                              </span>
                            ))}
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty state */}
        {filteredPieces.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No algorithms match your search.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
            >
              Clear filters
            </Button>
          </motion.div>
        )}

        {/* Stats footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          <p>
            Showing {filteredPieces.length} of {Object.keys(artGenerators).length} algorithms
            {activeCategory !== "All" && ` in ${activeCategory}`}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
