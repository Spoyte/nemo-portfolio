import { notFound } from "next/navigation";
import { ProjectClient } from "./project-client";

const projects = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard.",
    longDescription: `
This e-commerce platform was built to handle high-traffic online stores with thousands of products.

## Key Features

- Real-time inventory management
- Stripe payment integration
- Admin dashboard with analytics
- Customer reviews and ratings
- Multi-currency support

## Technical Challenges

The biggest challenge was optimizing the database queries for the product catalog. With over 10,000 products, we implemented Redis caching and query optimization to ensure sub-100ms response times.

## Results

The platform now handles 10,000+ daily orders with 99.9% uptime.
    `,
    image: "/images/project-1.jpg",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Redis"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    date: "2024",
    role: "Lead Developer",
  },
  {
    id: "ai-dashboard",
    title: "AI Analytics Dashboard",
    description: "Real-time data visualization dashboard with AI-powered insights and predictive analytics.",
    longDescription: "Content coming soon...",
    image: "/images/project-2.jpg",
    tags: ["React", "Python", "TensorFlow", "D3.js"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    date: "2024",
    role: "Full Stack Developer",
  },
  {
    id: "social-app",
    title: "Social Media App",
    description: "A modern social platform with real-time messaging, stories, and content recommendations.",
    longDescription: "Content coming soon...",
    image: "/images/project-3.jpg",
    tags: ["React Native", "Firebase", "Redux", "Node.js"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    date: "2023",
    role: "Mobile Developer",
  },
  {
    id: "design-system",
    title: "Design System",
    description: "A comprehensive component library with accessibility-first design tokens and documentation.",
    longDescription: "Content coming soon...",
    image: "/images/project-4.jpg",
    tags: ["TypeScript", "Storybook", "Tailwind", "Rollup"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    date: "2023",
    role: "Design Systems Engineer",
  },
  {
    id: "task-manager",
    title: "Task Management App",
    description: "Collaborative project management tool with kanban boards, time tracking, and team features.",
    longDescription: "Content coming soon...",
    image: "/images/project-5.jpg",
    tags: ["Vue.js", "GraphQL", "Prisma", "AWS"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    date: "2023",
    role: "Full Stack Developer",
  },
  {
    id: "portfolio-cms",
    title: "Portfolio CMS",
    description: "Headless CMS built for creatives with media management and custom content types.",
    longDescription: "Content coming soon...",
    image: "/images/project-6.jpg",
    tags: ["Next.js", "Sanity", "Framer Motion", "Vercel"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    date: "2022",
    role: "Frontend Developer",
  },
];

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectClient project={project} />;
}
