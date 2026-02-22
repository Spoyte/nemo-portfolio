"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag, Search, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

// This would typically come from a CMS or MDX files
const posts = [
  {
    slug: "building-modern-portfolio",
    title: "Building a Modern Portfolio with Next.js 14",
    excerpt: "A deep dive into creating a performant, accessible, and beautiful portfolio website using the latest web technologies.",
    date: "2025-02-15",
    readTime: "8 min read",
    tags: ["Next.js", "React", "TypeScript"],
    featured: true,
    views: 1250,
  },
  {
    slug: "typescript-tips",
    title: "Advanced TypeScript Patterns for React Developers",
    excerpt: "Level up your TypeScript skills with these advanced patterns and best practices for building type-safe React applications.",
    date: "2025-02-10",
    readTime: "12 min read",
    tags: ["TypeScript", "React"],
    featured: false,
    views: 980,
  },
  {
    slug: "animation-framer-motion",
    title: "Creating Smooth Animations with Framer Motion",
    excerpt: "Learn how to add delightful micro-interactions and page transitions to your React applications using Framer Motion.",
    date: "2025-02-05",
    readTime: "10 min read",
    tags: ["Animation", "Framer Motion", "React"],
    featured: false,
    views: 875,
  },
  {
    slug: "tailwind-best-practices",
    title: "Tailwind CSS Best Practices in 2025",
    excerpt: "Tips and tricks for writing maintainable, scalable CSS with Tailwind. From custom configurations to component extraction.",
    date: "2025-01-28",
    readTime: "6 min read",
    tags: ["CSS", "Tailwind"],
    featured: false,
    views: 720,
  },
  {
    slug: "react-server-components",
    title: "Understanding React Server Components",
    excerpt: "An in-depth look at React Server Components, how they work, and when to use them in your applications.",
    date: "2025-01-20",
    readTime: "15 min read",
    tags: ["React", "Next.js", "Performance"],
    featured: false,
    views: 1100,
  },
];

const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

// Calculate reading time from content (simulated)
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  const featuredPost = filteredPosts.find((p) => p.featured);
  const otherPosts = filteredPosts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Thoughts & Insights</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts on web development, design, and everything in between.
            Explore articles with enhanced reading experience.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            All Posts
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Button>
          ))}
        </motion.div>

        {/* Featured Post */}
        {featuredPost && !searchQuery && !selectedTag && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Link href={`/blog/${featuredPost.slug}`}>
              <Card className="group overflow-hidden hover:border-primary/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center relative overflow-hidden">
                    <motion.span 
                      className="text-8xl font-bold text-gradient"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      B
                    </motion.span>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        {featuredPost.views} views
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {featuredPost.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Post Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {otherPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="group h-full hover:border-primary/50 transition-colors overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center relative overflow-hidden">
                      <motion.span 
                        className="text-5xl font-bold text-gradient"
                        whileHover={{ scale: 1.15, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {post.title[0]}
                      </motion.span>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground mb-4">No posts found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => { setSearchQuery(""); setSelectedTag(null); }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Subscribe to get notified when I publish new articles. No spam, just quality content.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input placeholder="Enter your email" type="email" />
                <Button>
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
