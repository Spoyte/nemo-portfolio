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

### The App Router

The App Router is a paradigm shift in how we build React applications. It enables:

1. Nested layouts that persist across routes
2. Server Components by default
3. Simplified data fetching
4. Built-in SEO optimizations

## The Tech Stack

### TypeScript

Type safety is non-negotiable for me. TypeScript catches errors at compile time and provides excellent IDE support with autocompletion and inline documentation.

\`\`\`typescript
// Example of type-safe component props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, size = 'md', children, onClick }: ButtonProps) {
  // Component implementation
}
\`\`\`

### Tailwind CSS

Utility-first CSS has revolutionized how I style applications. Tailwind's JIT compiler and extensive customization options make it perfect for rapid development.

\`\`\`css
/* Instead of writing custom CSS */
.card {
  display: flex;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* You write utility classes */
// className="flex p-4 rounded-lg shadow-lg"
\`\`\`

### Framer Motion

Animations can make or break a user experience. Framer Motion provides a declarative API for creating smooth, performant animations in React.

## Key Features

### Dark Mode

Implementing dark mode with Next.js and Tailwind is straightforward.

\`\`\`tsx
// layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
\`\`\`

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
    excerpt: "Level up your TypeScript skills with these advanced patterns and best practices for building type-safe React applications.",
    content: `
## Introduction

TypeScript has become the standard for building scalable React applications. In this article, we'll explore advanced patterns that will take your TypeScript skills to the next level.

## Discriminated Unions

Discriminated unions are perfect for handling different states in your application.

\`\`\`typescript
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function Component() {
  const [state, setState] = useState<AsyncState<User>>({ status: 'idle' });
  
  // TypeScript knows exactly what properties are available
  if (state.status === 'success') {
    return <div>{state.data.name}</div>;
  }
}
\`\`\`

## Template Literal Types

Create powerful string types with template literals.

## Conclusion

Mastering these patterns will make you a more effective TypeScript developer.
    `,
    date: "2025-02-10",
    readTime: "12 min read",
    tags: ["TypeScript", "React"],
  },
  {
    slug: "animation-framer-motion",
    title: "Creating Smooth Animations with Framer Motion",
    excerpt: "Learn how to add delightful micro-interactions and page transitions to your React applications using Framer Motion.",
    content: `
## Introduction

Animation is an essential part of modern web design. Framer Motion makes it incredibly easy to add polished animations to your React apps.

## Basic Animations

Getting started with Framer Motion is simple.

\`\`\`tsx
import { motion } from 'framer-motion';

function App() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Hello World
    </motion.div>
  );
}
\`\`\`

## Gestures

Add interaction-based animations.

## Layout Animations

Animate layout changes automatically.

## Conclusion

Framer Motion is a powerful tool for creating delightful user experiences.
    `,
    date: "2025-02-05",
    readTime: "10 min read",
    tags: ["Animation", "Framer Motion", "React"],
  },
  {
    slug: "tailwind-best-practices",
    title: "Tailwind CSS Best Practices in 2025",
    excerpt: "Tips and tricks for writing maintainable, scalable CSS with Tailwind. From custom configurations to component extraction.",
    content: `
## Introduction

Tailwind CSS has revolutionized how we style web applications. Here are the best practices I've learned over years of using it.

## Configuration

Start with a solid tailwind.config.js.

## Component Extraction

Know when to extract components.

## Custom Utilities

Extend Tailwind with your own utilities.

## Conclusion

Following these practices will help you write better Tailwind CSS.
    `,
    date: "2025-01-28",
    readTime: "6 min read",
    tags: ["CSS", "Tailwind"],
  },
  {
    slug: "react-server-components",
    title: "Understanding React Server Components",
    excerpt: "An in-depth look at React Server Components, how they work, and when to use them in your applications.",
    content: `
## Introduction

React Server Components represent a fundamental shift in how we build React applications.

## What Are Server Components?

Server Components are React components that run exclusively on the server.

## Benefits

1. Zero bundle size
2. Direct backend access
3. Improved performance

## When to Use Them

Understanding the right use cases is crucial.

## Conclusion

Server Components are the future of React development.
    `,
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

  // Find related posts based on shared tags
  const relatedPosts = posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      ...p,
      relevance: p.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
