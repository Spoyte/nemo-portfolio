"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}

interface BlogPostClientProps {
  post: Post;
}

export function BlogPostClient({ post }: BlogPostClientProps) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </header>

          <Separator className="mb-12" />

          {/* Content */}
          <article className="prose prose-stone dark:prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('- ')) {
                return <li key={index} className="ml-4">{paragraph.replace('- ', '')}</li>;
              }
              if (paragraph.startsWith('```')) {
                return null;
              }
              if (paragraph.trim() === '') {
                return null;
              }
              return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
            })}
          </article>

          <Separator className="my-12" />

          {/* Footer */}
          <footer className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Thanks for reading! 🙏
            </p>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Share on Twitter
              </Button>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
