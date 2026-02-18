"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

interface TagPageClientProps {
  posts: Post[];
  tag: string;
}

export function TagPageClient({ posts, tag }: TagPageClientProps) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground uppercase tracking-wider">Tag</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">{tag}</h1>
            <p className="text-muted-foreground">
              {posts.length} post{posts.length !== 1 ? "s" : ""} tagged with "{tag}"
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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

                      <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((t) => (
                          <Badge
                            key={t}
                            variant={t.toLowerCase() === tag.toLowerCase() ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
