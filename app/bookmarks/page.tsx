"use client";

import { motion } from "framer-motion";
import { 
  Bookmark, 
  Sparkles, 
  ExternalLink, 
  Search,
  Filter,
  Heart,
  Code2,
  Palette,
  BookOpen,
  Cpu,
  Globe,
  Zap,
  Layers,
  Terminal,
  PenTool,
  Music,
  Video,
  Newspaper,
  Lightbulb
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BookmarkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  favorite?: boolean;
}

const categories = [
  { id: "all", label: "All", icon: Layers },
  { id: "development", label: "Development", icon: Code2 },
  { id: "design", label: "Design", icon: Palette },
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "tools", label: "Tools", icon: Cpu },
  { id: "inspiration", label: "Inspiration", icon: Lightbulb },
  { id: "reading", label: "Reading", icon: Newspaper },
];

const bookmarksData: BookmarkItem[] = [
  // Development
  {
    id: "1",
    title: "Next.js Documentation",
    description: "The official Next.js documentation - my go-to resource for React framework best practices.",
    url: "https://nextjs.org/docs",
    category: "development",
    tags: ["React", "Framework", "Documentation"],
    favorite: true,
  },
  {
    id: "2",
    title: "TypeScript Handbook",
    description: "Comprehensive guide to TypeScript - essential reading for type-safe JavaScript development.",
    url: "https://www.typescriptlang.org/docs/",
    category: "development",
    tags: ["TypeScript", "JavaScript", "Documentation"],
  },
  {
    id: "3",
    title: "MDN Web Docs",
    description: "The bible of web development. Comprehensive documentation for HTML, CSS, and JavaScript.",
    url: "https://developer.mozilla.org",
    category: "development",
    tags: ["Reference", "Web", "Documentation"],
    favorite: true,
  },
  {
    id: "4",
    title: "React Patterns",
    description: "Common React design patterns and best practices for building scalable applications.",
    url: "https://reactpatterns.com",
    category: "development",
    tags: ["React", "Patterns", "Best Practices"],
  },
  {
    id: "5",
    title: "Node.js Best Practices",
    description: "The largest Node.js best practices list. Essential for backend development.",
    url: "https://github.com/goldbergyoni/nodebestpractices",
    category: "development",
    tags: ["Node.js", "Backend", "Best Practices"],
  },
  // Design
  {
    id: "6",
    title: "Dribbble",
    description: "Community of designers sharing their work. Endless inspiration for UI/UX projects.",
    url: "https://dribbble.com",
    category: "design",
    tags: ["UI/UX", "Inspiration", "Community"],
    favorite: true,
  },
  {
    id: "7",
    title: "Awwwards",
    description: "Recognizing the best in web design. Showcases cutting-edge websites and trends.",
    url: "https://www.awwwards.com",
    category: "design",
    tags: ["Web Design", "Awards", "Inspiration"],
  },
  {
    id: "8",
    title: "Figma Community",
    description: "Free design resources, templates, and plugins from the Figma community.",
    url: "https://www.figma.com/community",
    category: "design",
    tags: ["Figma", "Resources", "Templates"],
  },
  {
    id: "9",
    title: "Coolors",
    description: "Color palette generator. Create, save, and share perfect color combinations.",
    url: "https://coolors.co",
    category: "design",
    tags: ["Colors", "Tools", "Generator"],
  },
  {
    id: "10",
    title: "Google Fonts",
    description: "Library of free licensed font families. Essential for web typography.",
    url: "https://fonts.google.com",
    category: "design",
    tags: ["Typography", "Fonts", "Free"],
  },
  // Learning
  {
    id: "11",
    title: "freeCodeCamp",
    description: "Learn to code for free. Comprehensive curriculum covering full-stack development.",
    url: "https://www.freecodecamp.org",
    category: "learning",
    tags: ["Free", "Courses", "Programming"],
    favorite: true,
  },
  {
    id: "12",
    title: "Frontend Masters",
    description: "Expert-led video courses on frontend development. Worth every penny.",
    url: "https://frontendmasters.com",
    category: "learning",
    tags: ["Courses", "Video", "Advanced"],
  },
  {
    id: "13",
    title: "CSS-Tricks",
    description: "Daily articles about CSS, HTML, JavaScript, and all things web design.",
    url: "https://css-tricks.com",
    category: "learning",
    tags: ["CSS", "Tutorials", "Blog"],
  },
  {
    id: "14",
    title: "Smashing Magazine",
    description: "Articles for web designers and developers. High-quality, in-depth content.",
    url: "https://www.smashingmagazine.com",
    category: "learning",
    tags: ["Web Design", "Development", "Articles"],
  },
  // Tools
  {
    id: "15",
    title: "Vercel",
    description: "Platform for frontend developers. Deploy Next.js apps with zero configuration.",
    url: "https://vercel.com",
    category: "tools",
    tags: ["Deployment", "Hosting", "Next.js"],
    favorite: true,
  },
  {
    id: "16",
    title: "GitHub",
    description: "Where the world builds software. Essential for version control and collaboration.",
    url: "https://github.com",
    category: "tools",
    tags: ["Git", "Version Control", "Open Source"],
  },
  {
    id: "17",
    title: "Supabase",
    description: "Open source Firebase alternative. PostgreSQL database with real-time subscriptions.",
    url: "https://supabase.com",
    category: "tools",
    tags: ["Database", "Backend", "Open Source"],
  },
  {
    id: "18",
    title: "Tailwind CSS",
    description: "Utility-first CSS framework. Rapidly build modern websites without leaving HTML.",
    url: "https://tailwindcss.com",
    category: "tools",
    tags: ["CSS", "Framework", "Utility-first"],
    favorite: true,
  },
  {
    id: "19",
    title: "Framer Motion",
    description: "Production-ready motion library for React. Create beautiful animations with ease.",
    url: "https://www.framer.com/motion/",
    category: "tools",
    tags: ["Animation", "React", "Library"],
  },
  // Inspiration
  {
    id: "20",
    title: "CodePen",
    description: "Social development environment for front-end designers and developers.",
    url: "https://codepen.io",
    category: "inspiration",
    tags: ["Code", "Showcase", "Community"],
  },
  {
    id: "21",
    title: "SiteInspire",
    description: "Showcase of the finest web and interactive design. Minimal and curated.",
    url: "https://www.siteinspire.com",
    category: "inspiration",
    tags: ["Web Design", "Showcase", "Minimal"],
  },
  {
    id: "22",
    title: "Mobbin",
    description: "World's largest mobile app design reference library. Great for mobile inspiration.",
    url: "https://mobbin.com",
    category: "inspiration",
    tags: ["Mobile", "UI/UX", "Reference"],
  },
  // Reading
  {
    id: "23",
    title: "Hacker News",
    description: "Tech news aggregator. Stay updated with the latest in technology and startups.",
    url: "https://news.ycombinator.com",
    category: "reading",
    tags: ["News", "Tech", "Community"],
  },
  {
    id: "24",
    title: "Dev.to",
    description: "Community of software developers sharing articles and discussions.",
    url: "https://dev.to",
    category: "reading",
    tags: ["Community", "Articles", "Development"],
  },
  {
    id: "25",
    title: "CSS Weekly",
    description: "Weekly newsletter with the latest CSS news, tutorials, and resources.",
    url: "https://css-weekly.com",
    category: "reading",
    tags: ["Newsletter", "CSS", "Weekly"],
  },
];

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredBookmarks = bookmarksData.filter((bookmark) => {
    const matchesSearch = 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === "all" || bookmark.category === activeCategory;
    const matchesFavorites = !favoritesOnly || bookmark.favorite;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  });

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
            <Bookmark className="h-4 w-4" />
            <span className="text-sm font-medium">Curated Resources</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Bookmarks
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of tools, resources, and inspiration I use and recommend. 
            Curated over years of development.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* Favorites Toggle */}
          <div className="flex justify-center">
            <Button
              variant={favoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className="gap-2"
            >
              <Heart className={`h-4 w-4 ${favoritesOnly ? "fill-current" : ""}`} />
              {favoritesOnly ? "Showing Favorites" : "Show Favorites Only"}
            </Button>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8 text-sm text-muted-foreground"
        >
          Showing {filteredBookmarks.length} of {bookmarksData.length} bookmarks
        </motion.div>

        {/* Bookmarks Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBookmarks.map((bookmark, index) => (
            <motion.div
              key={bookmark.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Card className="h-full hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {bookmark.title}
                      </CardTitle>
                      {bookmark.favorite && (
                        <Heart className="h-4 w-4 text-primary fill-primary flex-shrink-0" />
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {bookmark.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bookmark.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      <Globe className="h-3 w-3 mr-1" />
                      <span className="truncate">{new URL(bookmark.url).hostname}</span>
                      <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredBookmarks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No bookmarks found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          <p>
            Have a suggestion?{" "}
            <a href="/contact" className="text-primary hover:underline">
              Let me know
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
