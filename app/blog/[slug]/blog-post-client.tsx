"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag, 
  Share2, 
  Twitter, 
  Linkedin,
  Link2,
  ChevronRight,
  BookOpen,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

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
  relatedPosts: Post[];
}

// Table of Contents Component
function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>("");
  const headings = extractHeadings(content);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -80% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block fixed right-8 top-32 w-64">
      <div className="p-4 rounded-xl border bg-card/50 backdrop-blur-sm">
        <p className="text-sm font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Table of Contents
        </p>
        <nav className="space-y-1">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToSection(heading.id)}
              className={`block text-left text-sm w-full py-1 px-2 rounded transition-colors ${
                activeId === heading.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              style={{ paddingLeft: `${heading.level * 8}px` }}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// Extract headings from markdown content
function extractHeadings(content: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split('\n');
  
  lines.forEach((line) => {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      headings.push({ id, text, level });
    }
  });
  
  return headings;
}

// Code Block with Copy Button
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-t-lg border-b">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Link2 className={`h-4 w-4 mr-1 ${copied ? 'text-green-500' : ''}`} />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <pre className="p-4 bg-muted rounded-b-lg overflow-x-auto">
        <code className="text-sm font-mono">{code}</code>
      </pre>
    </div>
  );
}

// Reading Progress Bar
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
      style={{ scaleX }}
    />
  );
}

// Share Buttons
function ShareButtons({ title, url }: { title: string; url: string }) {
  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out this article: ${title}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={shareOnTwitter}>
        <Twitter className="h-4 w-4 mr-1" />
        Twitter
      </Button>
      <Button variant="outline" size="sm" onClick={shareOnLinkedIn}>
        <Linkedin className="h-4 w-4 mr-1" />
        LinkedIn
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink}>
        <Link2 className="h-4 w-4 mr-1" />
        Copy Link
      </Button>
    </div>
  );
}

// Related Posts
function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Related Posts
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="p-4 rounded-xl border hover:border-primary/50 transition-colors group">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                  <span className="mx-1">•</span>
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </div>
                <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Parse content and render with enhanced features
function RenderContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let codeBlock: string[] = [];
  let codeLanguage = "";
  let inCodeBlock = false;

  lines.forEach((line, index) => {
    // Code block handling
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock 
            key={`code-${index}`} 
            code={codeBlock.join('\n')} 
            language={codeLanguage || 'text'} 
          />
        );
        codeBlock = [];
        codeLanguage = "";
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = line.replace('```', '').trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlock.push(line);
      return;
    }

    // Heading handling with IDs for TOC
    if (line.startsWith('## ')) {
      const text = line.replace('## ', '');
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      elements.push(
        <h2 
          key={`h2-${index}`} 
          id={id}
          className="text-2xl font-bold mt-12 mb-4 scroll-mt-24"
        >
          {text}
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      const text = line.replace('### ', '');
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      elements.push(
        <h3 
          key={`h3-${index}`} 
          id={id}
          className="text-xl font-semibold mt-8 mb-3 scroll-mt-24"
        >
          {text}
        </h3>
      );
      return;
    }

    // List handling
    if (line.startsWith('- ')) {
      elements.push(
        <li key={`li-${index}`} className="ml-6 list-disc mb-2">
          {line.replace('- ', '')}
        </li>
      );
      return;
    }

    // Numbered list
    if (/^\d+\./.test(line)) {
      elements.push(
        <li key={`oli-${index}`} className="ml-6 list-decimal mb-2">
          {line.replace(/^\d+\.\s*/, '')}
        </li>
      );
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote 
          key={`quote-${index}`} 
          className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground"
        >
          {line.replace('> ', '')}
        </blockquote>
      );
      return;
    }

    // Empty line
    if (line.trim() === '') {
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${index}`} className="mb-4 leading-relaxed">
        {line}
      </p>
    );
  });

  return <>{elements}</>;
}

export function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <ReadingProgress />
      
      <div className="min-h-screen pt-24 pb-16">
        <TableOfContents content={post.content} />
        
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
              <motion.div 
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {post.title}
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {post.excerpt}
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`}>
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </motion.div>
            </header>

            <Separator className="mb-12" />

            {/* Content */}
            <article className="prose prose-stone dark:prose-invert max-w-none">
              <RenderContent content={post.content} />
            </article>

            <Separator className="my-12" />

            {/* Footer */}
            <footer className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-muted-foreground">
                    Thanks for reading! 🙏
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Found this helpful? Share it with others.
                  </p>
                </div>
                <ShareButtons title={post.title} url={articleUrl} />
              </div>

              {/* Author Card */}
              <motion.div 
                className="p-6 rounded-xl border bg-card/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-2xl font-bold text-white">
                    N
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Nemo</p>
                    <p className="text-sm text-muted-foreground">
                      Full-stack developer passionate about building great user experiences.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Link href="/about">
                        <Button variant="link" size="sm" className="h-auto p-0">
                          About Me
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button variant="link" size="sm" className="h-auto p-0">
                          Get in Touch
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Related Posts */}
              <RelatedPosts posts={relatedPosts} />
            </footer>
          </motion.div>
        </div>
      </div>
    </>
  );
}
