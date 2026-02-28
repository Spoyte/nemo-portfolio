"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Heart, 
  Share2, 
  Bookmark, 
  MessageCircle, 
  Sparkles,
  Eye,
  Clock,
  Calendar,
  ArrowLeft,
  Twitter,
  Linkedin,
  Link2,
  Check,
  Send
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import confetti from "canvas-confetti";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    initials: string;
  };
  publishedAt: Date;
  readTime: number;
  tags: string[];
  coverImage?: string;
  likes: number;
  views: number;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Interactive Portfolios with Next.js",
    excerpt: "A deep dive into creating engaging, animated portfolio websites using Next.js, Framer Motion, and Tailwind CSS.",
    content: `
# Building Interactive Portfolios with Next.js

Creating a portfolio that stands out requires more than just showcasing your work. It's about creating an experience that visitors remember.

## Why Next.js?

Next.js provides the perfect foundation for modern portfolios:
- **Server-side rendering** for SEO
- **Static generation** for performance
- **API routes** for dynamic features
- **Image optimization** out of the box

## Adding Animations with Framer Motion

Framer Motion makes it easy to add delightful animations:

\`\`\`tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Hello World
</motion.div>
\`\`\`

## Micro-interactions Matter

Small details make a big difference:
- Hover effects on buttons
- Loading states
- Scroll-triggered animations
- Page transitions

## Conclusion

Your portfolio is your digital home. Make it memorable! 🚀
    `,
    author: {
      name: "Nemo",
      initials: "N",
    },
    publishedAt: new Date("2024-12-15"),
    readTime: 5,
    tags: ["Next.js", "React", "Animation", "Portfolio"],
    likes: 128,
    views: 2340,
  },
  {
    id: "2",
    title: "The Art of Generative Design",
    excerpt: "Exploring the intersection of code and creativity through generative art algorithms and creative coding.",
    content: `
# The Art of Generative Design

Generative art represents the beautiful intersection of human creativity and algorithmic precision.

## What is Generative Art?

Generative art is created using autonomous systems, often algorithms, that can generate unique outputs.

## Tools of the Trade

- **Canvas API** - 2D graphics
- **WebGL/Three.js** - 3D graphics
- **p5.js** - Creative coding
- **GLSL** - Shader programming

## My Favorite Techniques

1. **Particle Systems** - Simulating natural phenomena
2. **Fractals** - Infinite complexity from simple rules
3. **Noise Functions** - Organic randomness
4. **Reaction-Diffusion** - Pattern formation

## Getting Started

Start simple. A single particle moving across the screen can be the beginning of something beautiful.
    `,
    author: {
      name: "Nemo",
      initials: "N",
    },
    publishedAt: new Date("2024-11-28"),
    readTime: 8,
    tags: ["Generative Art", "Creative Coding", "JavaScript", "Design"],
    likes: 256,
    views: 4120,
  },
  {
    id: "3",
    title: "TypeScript Tips for Better Code",
    excerpt: "Advanced TypeScript patterns and techniques that will level up your development workflow.",
    content: `
# TypeScript Tips for Better Code

TypeScript has become an essential tool in modern web development. Here are some advanced tips.

## Utility Types

\`\`\`typescript
// Partial - Make all properties optional
type PartialUser = Partial<User>;

// Pick - Select specific properties
type UserName = Pick<User, 'name' | 'email'>;

// Omit - Remove specific properties
type UserWithoutPassword = Omit<User, 'password'>;
\`\`\`

## Type Guards

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
\`\`\`

## Generic Constraints

\`\`\`typescript
function merge<T extends object, U extends object>(obj1: T, obj2: U) {
  return { ...obj1, ...obj2 };
}
\`\`\`

## Conclusion

TypeScript is an investment that pays dividends in code quality and developer experience.
    `,
    author: {
      name: "Nemo",
      initials: "N",
    },
    publishedAt: new Date("2024-10-10"),
    readTime: 6,
    tags: ["TypeScript", "JavaScript", "Programming", "Tips"],
    likes: 189,
    views: 3150,
  },
];

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(100, scrollProgress));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-orange-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/blog/${post.id}`}>
        <Card className="overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-orange-500/20 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/40 to-orange-500/40"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-primary/30" />
            </div>
            
            <div className="absolute top-4 left-4 flex gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="w-4 h-4" />
              <span>{post.publishedAt.toLocaleDateString()}</span>
              <span>•</span>
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {post.author.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{post.author.name}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function BlogPostDetail({ post, onBack }: { post: BlogPost; onBack: () => void }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [comment, setComment] = useState("");

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#dc2626", "#ea580c"],
      });
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out "${post.title}" by ${post.author.name}`;
    
    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(`${text} ${url}`);
        break;
    }
    setShowShare(false);
  };

  return (
    <>
      <ReadingProgress />
      
      <article className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          <div className="flex items-center justify-between mb-8 pb-8 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {post.author.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {post.publishedAt.toLocaleDateString()} • {post.readTime} min read
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={liked ? "text-red-500 border-red-200" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
                {post.likes + (liked ? 1 : 0)}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setBookmarked(!bookmarked)}
                className={bookmarked ? "text-primary border-primary/50" : ""}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
              </Button>

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShare(!showShare)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {showShare && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setShowShare(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 z-50 p-2 rounded-xl bg-popover border shadow-lg"
                      >
                        <div className="flex flex-col gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleShare("twitter")}>
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleShare("linkedin")}>
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleShare("copy")}>
                            <Link2 className="w-4 h-4 mr-2" />
                            Copy Link
                          </Button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="ml-6 list-disc">{line.slice(2)}</li>;
              }
              if (line.startsWith('```')) {
                return null;
              }
              if (line.match(/^\d+\./)) {
                return <li key={i} className="ml-6 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              return <p key={i} className="mb-4">{line}</p>;
            })}
          </div>

          <div className="border-t pt-8">
            <h3 className="text-xl font-bold mb-4">Leave a comment</h3>
            <div className="flex gap-4">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1"
              />
              <Button className="self-end">
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </motion.div>
      </article>
    </>
  );
}

export function EnhancedBlog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return <BlogPostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Blog
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Thoughts & Insights</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sharing my journey, learnings, and discoveries in web development and design.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <div key={post.id} onClick={() => setSelectedPost(post)}>
            <BlogCard post={post} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
