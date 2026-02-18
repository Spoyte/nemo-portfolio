import { notFound } from "next/navigation";
import { BlogPostClient } from "./blog-post-client";

const posts = [
  {
    slug: "building-modern-portfolio",
    title: "Building a Modern Portfolio with Next.js 14",
    excerpt: "A deep dive into creating a performant, accessible, and beautiful portfolio website using the latest web technologies.",
    content: `
## Introduction

Building a portfolio website is one of the most important projects for any developer. It's not just a showcase of your work—it's a reflection of your skills, attention to detail, and passion for your craft.

In this article, I'll walk you through how I built this portfolio using Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Why Next.js 14?

Next.js has evolved significantly over the years. With version 14, we get:

- **App Router**: A new file-system based router built on React Server Components
- **Server Components**: Render components on the server for better performance
- **Streaming**: Progressive rendering of UI components
- **Turbopack**: A Rust-based bundler that's incredibly fast

## The Tech Stack

### TypeScript

Type safety is non-negotiable for me. TypeScript catches errors at compile time and provides excellent IDE support with autocompletion and inline documentation.

### Tailwind CSS

Utility-first CSS has revolutionized how I style applications. Tailwind's JIT compiler and extensive customization options make it perfect for rapid development.

### Framer Motion

Animations can make or break a user experience. Framer Motion provides a declarative API for creating smooth, performant animations in React.

## Key Features

### Dark Mode

Implementing dark mode with Next.js and Tailwind is straightforward.

### Animations

Page transitions and micro-interactions add polish to the user experience.

## Performance Optimizations

1. **Image Optimization**: Using Next.js Image component for automatic optimization
2. **Code Splitting**: Leveraging dynamic imports for heavy components
3. **Font Optimization**: Using next/font for zero-layout-shift fonts
4. **Static Generation**: Pre-rendering pages at build time

## Conclusion

Building this portfolio was a rewarding experience. It pushed me to learn new technologies and refine my skills. The result is a fast, accessible, and beautiful website that I'm proud to share.

Feel free to explore the source code and use it as inspiration for your own portfolio!
    `,
    date: "2025-02-15",
    readTime: "8 min read",
    tags: ["Next.js", "React", "TypeScript"],
  },
  {
    slug: "typescript-tips",
    title: "Advanced TypeScript Patterns for React Developers",
    excerpt: "Level up your TypeScript skills with these advanced patterns and best practices.",
    content: "Content coming soon...",
    date: "2025-02-10",
    readTime: "12 min read",
    tags: ["TypeScript", "React"],
  },
  {
    slug: "animation-framer-motion",
    title: "Creating Smooth Animations with Framer Motion",
    excerpt: "Learn how to add delightful micro-interactions to your React applications.",
    content: "Content coming soon...",
    date: "2025-02-05",
    readTime: "10 min read",
    tags: ["Animation", "Framer Motion", "React"],
  },
  {
    slug: "tailwind-best-practices",
    title: "Tailwind CSS Best Practices in 2025",
    excerpt: "Tips and tricks for writing maintainable, scalable CSS with Tailwind.",
    content: "Content coming soon...",
    date: "2025-01-28",
    readTime: "6 min read",
    tags: ["CSS", "Tailwind"],
  },
  {
    slug: "react-server-components",
    title: "Understanding React Server Components",
    excerpt: "An in-depth look at React Server Components and when to use them.",
    content: "Content coming soon...",
    date: "2025-01-20",
    readTime: "15 min read",
    tags: ["React", "Next.js", "Performance"],
  },
];

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
