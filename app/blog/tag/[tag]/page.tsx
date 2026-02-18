import Link from "next/link";
import { notFound } from "next/navigation";
import { TagPageClient } from "./tag-page-client";

const posts = [
  {
    slug: "building-modern-portfolio",
    title: "Building a Modern Portfolio with Next.js 14",
    excerpt: "A deep dive into creating a performant, accessible, and beautiful portfolio website using the latest web technologies.",
    date: "2025-02-15",
    readTime: "8 min read",
    tags: ["Next.js", "React", "TypeScript"],
  },
  {
    slug: "typescript-tips",
    title: "Advanced TypeScript Patterns for React Developers",
    excerpt: "Level up your TypeScript skills with these advanced patterns and best practices.",
    date: "2025-02-10",
    readTime: "12 min read",
    tags: ["TypeScript", "React"],
  },
  {
    slug: "animation-framer-motion",
    title: "Creating Smooth Animations with Framer Motion",
    excerpt: "Learn how to add delightful micro-interactions to your React applications.",
    date: "2025-02-05",
    readTime: "10 min read",
    tags: ["Animation", "Framer Motion", "React"],
  },
  {
    slug: "tailwind-best-practices",
    title: "Tailwind CSS Best Practices in 2025",
    excerpt: "Tips and tricks for writing maintainable, scalable CSS with Tailwind.",
    date: "2025-01-28",
    readTime: "6 min read",
    tags: ["CSS", "Tailwind"],
  },
  {
    slug: "react-server-components",
    title: "Understanding React Server Components",
    excerpt: "An in-depth look at React Server Components and when to use them.",
    date: "2025-01-20",
    readTime: "15 min read",
    tags: ["React", "Next.js", "Performance"],
  },
];

export async function generateStaticParams() {
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  return allTags.map((tag) => ({
    tag: tag.toLowerCase(),
  }));
}

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  const filteredPosts = posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase())
  );

  if (filteredPosts.length === 0) {
    notFound();
  }

  return <TagPageClient posts={filteredPosts} tag={decodedTag} />;
}
