"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  MessageSquare, 
  Heart, 
  Share2, 
  Clock,
  Calendar,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

// This would typically come from a CMS or MDX files
const posts = [
  {
    slug: "building-modern-portfolio",
    title: "Building a Modern Portfolio with Next.js 14",
    excerpt: "A deep dive into creating a performant, accessible, and beautiful portfolio website using the latest web technologies.",
    content: `
# Building a Modern Portfolio with Next.js 14

Creating a portfolio that stands out in today's crowded digital landscape requires more than just good design—it demands performance, accessibility, and a seamless user experience. In this article, I'll walk you through how I built my portfolio using Next.js 14 and the lessons learned along the way.

## Why Next.js 14?

Next.js has evolved significantly over the years, and version 14 brings some game-changing features:

- **Server Components**: Reduced client-side JavaScript for faster initial loads
- **Improved Image Optimization**: Automatic WebP conversion and responsive images
- **Streaming**: Progressive rendering for better perceived performance
- **Turbopack**: Lightning-fast development builds

## Architecture Decisions

### App Router vs Pages Router

I chose the App Router for its superior performance characteristics and modern React patterns. The ability to colocate data fetching with components using Server Components was a major win.

\`\`\`tsx
// Server Component - zero client JS
async function ProjectList() {
  const projects = await getProjects();
  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
\`\`\`

### Styling with Tailwind CSS

Tailwind's utility-first approach allowed for rapid iteration while maintaining consistency. Combined with CSS variables for theming, it provides a powerful styling solution.

## Performance Optimizations

1. **Image Optimization**: Using Next.js Image component with priority loading for above-the-fold content
2. **Font Optimization**: Leveraging next/font for zero-layout-shift font loading
3. **Code Splitting**: Automatic route-based splitting with dynamic imports for heavy components
4. **Caching**: Strategic use of React.cache and Next.js data cache

## Accessibility First

Building an accessible portfolio isn't optional—it's essential. Key considerations:

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Reduced motion support

## The Result

The final portfolio achieves:
- 100/100 Lighthouse scores across all categories
- Sub-second First Contentful Paint
- Perfect accessibility audit
- Smooth 60fps animations

## Lessons Learned

1. **Start with performance in mind**: It's harder to optimize later
2. **Test on real devices**: Emulators don't tell the whole story
3. **Content is king**: Even the best tech can't save poor content
4. **Iterate based on feedback**: Real user testing revealed issues I missed

## Conclusion

Building a modern portfolio is an ongoing journey. The web platform keeps evolving, and staying current with best practices ensures your site remains fast, accessible, and delightful to use.

What's your approach to building portfolios? I'd love to hear your thoughts and experiences.
    `,
    date: "2025-02-15",
    readTime: "8 min read",
    tags: ["Next.js", "React", "TypeScript"],
    featured: true,
    views: 1250,
    likes: 89,
    author: {
      name: "Nemo",
      avatar: "N",
      bio: "Creative Developer & Designer"
    }
  },
  {
    slug: "typescript-tips",
    title: "Advanced TypeScript Patterns for React Developers",
    excerpt: "Level up your TypeScript skills with these advanced patterns and best practices for building type-safe React applications.",
    content: `
# Advanced TypeScript Patterns for React Developers

TypeScript has become the standard for building robust React applications. Beyond basic types, there are powerful patterns that can dramatically improve your code quality and developer experience.

## Discriminated Unions for Component Props

When building complex components with multiple variants, discriminated unions provide excellent type safety:

\`\`\`tsx
type ButtonProps = 
  | { variant: 'primary'; color: 'blue' | 'red' | 'green' }
  | { variant: 'secondary'; outline: boolean }
  | { variant: 'ghost'; size: 'sm' | 'md' | 'lg' };

// TypeScript ensures you can't mix incompatible props
\`\`\`

## The Power of Mapped Types

Mapped types allow you to create new types by transforming properties of existing types:

\`\`\`tsx
type APIResponse<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? Array<APIResponse<U>>
    : T[K] extends object
    ? APIResponse<T[K]>
    : T[K];
} & {
  id: string;
  createdAt: string;
};
\`\`\`

## Type-Safe Event Handlers

Instead of using generic Event types, be specific:

\`\`\`tsx
// ❌ Too generic
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {}

// ✅ Specific to your needs
const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const email = e.target.value;
  // email is typed as string
};
\`\`\`

## Generic Components with Constraints

Build flexible, reusable components with proper constraints:

\`\`\`tsx
interface SelectProps<T extends string | number> {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

function Select<T extends string | number>({
  options,
  value,
  onChange
}: SelectProps<T>) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as T)}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
\`\`\`

## Utility Types You Should Know

- \`Partial<T>\`: Makes all properties optional
- \`Required<T>\`: Makes all properties required
- \`Pick<T, K>\`: Selects a subset of properties
- \`Omit<T, K>\`: Removes a subset of properties
- \`Record<K, T>\`: Creates an object type with specific keys
- \`ReturnType<T>\`: Extracts return type of a function

## Type Guards and Narrowing

Proper type narrowing prevents runtime errors:

\`\`\`tsx
function processValue(value: string | number | string[]) {
  if (Array.isArray(value)) {
    // TypeScript knows value is string[]
    return value.join(', ');
  }
  
  if (typeof value === 'string') {
    // TypeScript knows value is string
    return value.toUpperCase();
  }
  
  // TypeScript knows value is number
  return value.toFixed(2);
}
\`\`\`

## Conclusion

Mastering these TypeScript patterns takes time, but the investment pays off in fewer bugs, better IDE support, and more confident refactoring. Start incorporating one pattern at a time, and soon they'll become second nature.
    `,
    date: "2025-02-10",
    readTime: "12 min read",
    tags: ["TypeScript", "React"],
    featured: false,
    views: 980,
    likes: 124,
    author: {
      name: "Nemo",
      avatar: "N",
      bio: "Creative Developer & Designer"
    }
  },
  {
    slug: "animation-framer-motion",
    title: "Creating Smooth Animations with Framer Motion",
    excerpt: "Learn how to add delightful micro-interactions and page transitions to your React applications using Framer Motion.",
    content: `
# Creating Smooth Animations with Framer Motion

Animation can transform a good user interface into a great one. Framer Motion makes it incredibly easy to add polished animations to React applications.

## Getting Started

Install Framer Motion:
\`\`\`bash
npm install framer-motion
\`\`\`

## Basic Animations

The simplest animation is just a matter of wrapping your component:

\`\`\`tsx
import { motion } from 'framer-motion';

function FadeIn() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Hello, World!
    </motion.div>
  );
}
\`\`\`

## Gesture Animations

Framer Motion makes interactive animations effortless:

\`\`\`tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.5)' }}
>
  Click me!
</motion.button>
\`\`\`

## AnimatePresence for Exit Animations

Handle elements entering and leaving the DOM:

\`\`\`tsx
import { AnimatePresence, motion } from 'framer-motion';

function Modal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <ModalContent onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\`\`\`

## Layout Animations

Automatic layout animations are one of Framer Motion's killer features:

\`\`\`tsx
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <motion.li
          key={item.id}
          layout
          layoutId={item.id}
          transition={{ type: 'spring', stiffness: 350 }}
        >
          {item.text}
        </motion.li>
      ))}
    </ul>
  );
}
\`\`\`

## Scroll-Triggered Animations

Animate elements as they enter the viewport:

\`\`\`tsx
function ScrollReveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
\`\`\`

## Staggered Animations

Create beautiful staggered effects:

\`\`\`tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function StaggeredList() {
  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {items.map(item => (
        <motion.li key={item.id} variants={item}>
          {item.text}
        </motion.li>
      ))}
    </motion.ul>
  );
}
\`\`\`

## Performance Tips

1. Use \`will-change\` sparingly
2. Prefer transform and opacity animations
3. Use \`layout\` prop judiciously
4. Consider \`useReducedMotion\` for accessibility

## Conclusion

Framer Motion removes the complexity from React animations while providing powerful features for advanced use cases. Start simple and gradually explore more complex patterns as needed.
    `,
    date: "2025-02-05",
    readTime: "10 min read",
    tags: ["Animation", "Framer Motion", "React"],
    featured: false,
    views: 875,
    likes: 67,
    author: {
      name: "Nemo",
      avatar: "N",
      bio: "Creative Developer & Designer"
    }
  },
  {
    slug: "tailwind-best-practices",
    title: "Tailwind CSS Best Practices in 2025",
    excerpt: "Tips and tricks for writing maintainable, scalable CSS with Tailwind. From custom configurations to component extraction.",
    content: `
# Tailwind CSS Best Practices in 2025

Tailwind CSS has revolutionized how we style web applications. After years of use, here are the practices that have stood the test of time.

## Configuration First

Start with a solid tailwind.config.js:

\`\`\`js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      }
    }
  }
}
\`\`\`

## Component Extraction

Don't repeat utility classes. Extract components:

\`\`\`tsx
// ❌ Don't repeat
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  Click me
</button>

// ✅ Extract to component
function Button({ children, ...props }) {
  return (
    <button 
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      {...props}
    >
      {children}
    </button>
  );
}
\`\`\`

## Use @apply Sparingly

\`@apply\` is useful but can be overused:

\`\`\`css
/* ✅ Good: Complex patterns */
.btn-gradient {
  @apply px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500;
}

/* ❌ Bad: Simple utilities */
.text-large {
  @apply text-lg font-bold;
}
\`\`\`

## Responsive Design

Mobile-first approach with clear breakpoints:

\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Content */}
</div>
\`\`\`

## Dark Mode

Implement dark mode with CSS variables:

\`\`\`css
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
}

.dark {
  --bg-primary: #000000;
  --text-primary: #ffffff;
}
\`\`\`

## Custom Utilities

Add project-specific utilities:

\`\`\`js
// tailwind.config.js
plugins: [
  function({ addUtilities }) {
    addUtilities({
      '.text-shadow': {
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
      },
      '.text-shadow-lg': {
        textShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }
    })
  }
]
\`\`\`

## Performance

1. Purge unused styles in production
2. Use JIT mode for faster builds
3. Minimize custom CSS
4. Leverage built-in optimizations

## Conclusion

Tailwind CSS, when used correctly, enables rapid development without sacrificing maintainability. The key is finding the right balance between utility classes and component abstraction.
    `,
    date: "2025-01-28",
    readTime: "6 min read",
    tags: ["CSS", "Tailwind"],
    featured: false,
    views: 720,
    likes: 45,
    author: {
      name: "Nemo",
      avatar: "N",
      bio: "Creative Developer & Designer"
    }
  },
  {
    slug: "react-server-components",
    title: "Understanding React Server Components",
    excerpt: "An in-depth look at React Server Components, how they work, and when to use them in your applications.",
    content: `
# Understanding React Server Components

React Server Components (RSC) represent a paradigm shift in how we build React applications. Let's demystify this powerful feature.

## What Are Server Components?

Server Components are React components that render exclusively on the server. They:

- Never ship JavaScript to the client
- Can access server-side resources directly
- Reduce bundle size significantly
- Enable better initial page load

## Server vs Client Components

\`\`\`tsx
// Server Component (default in App Router)
async function ProductList() {
  const products = await db.products.findMany();
  
  return (
    <div>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

// Client Component
'use client';

function AddToCartButton({ productId }) {
  const [isAdding, setIsAdding] = useState(false);
  
  return (
    <button onClick={() => addToCart(productId)}>
      Add to Cart
    </button>
  );
}
\`\`\`

## When to Use Each

### Use Server Components for:
- Data fetching
- Accessing backend resources
- Keeping large dependencies server-side
- SEO-critical content

### Use Client Components for:
- Interactivity and event handlers
- Browser APIs
- State management
- Animation libraries

## Composition Patterns

Server and Client Components can be composed:

\`\`\`tsx
// Server Component
async function ProductPage({ id }) {
  const product = await getProduct(id);
  
  return (
    <div>
      <ProductInfo product={product} /> {/* Server */}
      <AddToCartButton productId={id} /> {/* Client */}
    </div>
  );
}
\`\`\`

## Data Fetching

Server Components simplify data fetching:

\`\`\`tsx
async function Dashboard() {
  // Parallel data fetching
  const [user, posts, analytics] = await Promise.all([
    getUser(),
    getPosts(),
    getAnalytics()
  ]);
  
  return (
    <div>
      <UserCard user={user} />
      <PostList posts={posts} />
      <Analytics data={analytics} />
    </div>
  );
}
\`\`\`

## Streaming

Server Components enable progressive rendering:

\`\`\`tsx
import { Suspense } from 'react';

function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Loading />}>\n        <SlowComponent />
      </Suspense>
    </div>
  );
}
\`\`\`

## Best Practices

1. Start with Server Components
2. Move to Client only when needed
3. Keep data fetching close to usage
4. Use proper loading states

## Common Pitfalls

- Trying to use hooks in Server Components
- Passing functions from Server to Client
- Over-fetching data
- Not handling loading states

## Conclusion

React Server Components offer significant performance benefits when used correctly. Understanding when and how to use them is key to building modern React applications.
    `,
    date: "2025-01-20",
    readTime: "15 min read",
    tags: ["React", "Next.js", "Performance"],
    featured: false,
    views: 1100,
    likes: 156,
    author: {
      name: "Nemo",
      avatar: "N",
      bio: "Creative Developer & Designer"
    }
  }
];

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatContent(content: string) {
  // Simple markdown-like formatting
  return content
    .split('\n')
    .map((line, i) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-3xl font-bold mt-12 mb-6">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold mt-10 mb-4">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold mt-8 mb-3">{line.slice(4)}</h3>;
      }
      
      // Code blocks
      if (line.startsWith('```')) {
        return null; // Handled separately
      }
      
      // Lists
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-6 text-muted-foreground">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\. /)) {
        return <li key={i} className="ml-6 text-muted-foreground">{line.replace(/^\d+\. /, '')}</li>;
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <div key={i} className="h-4" />;
      }
      
      // Regular paragraphs
      return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
    });
}

function extractCodeBlocks(content: string) {
  const blocks: Array<{ language: string; code: string }> = [];
  const lines = content.split('\n');
  let currentBlock: { language: string; code: string[] } | null = null;
  
  lines.forEach(line => {
    if (line.startsWith('```')) {
      if (currentBlock) {
        blocks.push({
          language: currentBlock.language,
          code: currentBlock.code.join('\n')
        });
        currentBlock = null;
      } else {
        currentBlock = {
          language: line.slice(3).trim() || 'text',
          code: []
        };
      }
    } else if (currentBlock) {
      currentBlock.code.push(line);
    }
  });
  
  return blocks;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`}>
                <Badge variant="secondary">{tag}</Badge>
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {post.views} views
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border mb-12">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              {post.author.avatar}
            </div>
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.bio}</p>
            </div>
          </div>

          <Separator className="mb-12" />

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {formatContent(post.content)}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-border"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="gap-2">
                  <Heart className="w-4 h-4" />
                  {post.likes} likes
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comments
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Link2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/20 text-center"
          >
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Enjoyed this article?</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to get notified when I publish new content. No spam, just quality articles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
              />
              <Button>Subscribe</Button>
            </div>
          </motion.div>
        </motion.article>
      </div>
    </div>
  );
}
