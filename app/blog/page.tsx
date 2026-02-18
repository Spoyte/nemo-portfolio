"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  },
  {
    slug: "typescript-tips",
    title: "Advanced TypeScript Patterns for React Developers",
    excerpt: "Level up your TypeScript skills with these advanced patterns and best practices for building type-safe React applications.",
    date: "2025-02-10",
    readTime: "12 min read",
    tags: ["TypeScript", "React"],
    featured: false,
  },
  {
    slug: "animation-framer-motion",
    title: "Creating Smooth Animations with Framer Motion",
    excerpt: "Learn how to add delightful micro-interactions and page transitions to your React applications using Framer Motion.",
    date: "2025-02-05",
    readTime: "10 min read",
    tags: ["Animation", "Framer Motion", "React"],
    featured: false,
  },
  {
    slug: "tailwind-best-practices",
    title: "Tailwind CSS Best Practices in 2025",
    excerpt: "Tips and tricks for writing maintainable, scalable CSS with Tailwind. From custom configurations to component extraction.",
    date: "2025-01-28",
    readTime: "6 min read",
    tags: ["CSS", "Tailwind"],
    featured: false,
  },
  {
    slug: "react-server-components",
    title: "Understanding React Server Components",
    excerpt: "An in-depth look at React Server Components, how they work, and when to use them in your applications.",
    date: "2025-01-20",
    readTime: "15 min read",
    tags: ["React", "Next.js", "Performance"],
    featured: false,
  },
];

const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

export default function BlogPage() {
  const featuredPost = posts.find((p) => p.featured);
  const otherPosts = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts on web development, design, and everything in between.
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {allTags.map((tag) => (
            <Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                {tag}
              </Badge>
            </Link>
          ))}
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Link href={`/blog/${featuredPost.slug}`}>
              <Card className="group overflow-hidden hover:border-primary/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
                    <span className="text-6xl font-bold text-gradient">B</span>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge>Featured</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {featuredPost.date}
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
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {otherPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="group h-full hover:border-primary/50 transition-colors">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gradient">{post.title[0]}</span>
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
      </div>
    </div>
  );
}
