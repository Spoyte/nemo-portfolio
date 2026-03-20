"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Base skeleton with shimmer effect
function SkeletonBase({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-md bg-muted ${className}`}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{
          translateX: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
          repeatDelay: 0.5,
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        }}
      />
    </motion.div>
  );
}

// Card skeleton
export function CardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <SkeletonBase className="h-48 w-full" delay={delay} />
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <SkeletonBase className="h-6 w-3/4" delay={delay + 0.1} />
        <SkeletonBase className="h-4 w-full" delay={delay + 0.15} />
        <SkeletonBase className="h-4 w-2/3" delay={delay + 0.2} />
        <div className="flex gap-2 pt-2">
          <SkeletonBase className="h-6 w-16 rounded-full" delay={delay + 0.25} />
          <SkeletonBase className="h-6 w-16 rounded-full" delay={delay + 0.3} />
        </div>
      </CardContent>
    </Card>
  );
}

// Text skeleton
export function TextSkeleton({
  lines = 3,
  delay = 0,
}: {
  lines?: number;
  delay?: number;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
          delay={delay + i * 0.05}
        />
      ))}
    </div>
  );
}

// Avatar skeleton
export function AvatarSkeleton({ delay = 0 }: { delay?: number }) {
  return <SkeletonBase className="h-12 w-12 rounded-full" delay={delay} />;
}

// Project card skeleton
export function ProjectCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-border bg-card">
      <SkeletonBase className="aspect-video w-full" delay={delay} />
      <div className="p-6 space-y-4">
        <SkeletonBase className="h-6 w-3/4" delay={delay + 0.1} />
        <TextSkeleton lines={2} delay={delay + 0.15} />
        <div className="flex gap-2">
          <SkeletonBase className="h-8 w-20 rounded-full" delay={delay + 0.25} />
          <SkeletonBase className="h-8 w-20 rounded-full" delay={delay + 0.3} />
          <SkeletonBase className="h-8 w-20 rounded-full" delay={delay + 0.35} />
        </div>
      </div>
    </div>
  );
}

// Blog post skeleton
export function BlogPostSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="space-y-6">
      <SkeletonBase className="h-8 w-3/4" delay={delay} />
      <div className="flex gap-4">
        <SkeletonBase className="h-4 w-24" delay={delay + 0.1} />
        <SkeletonBase className="h-4 w-24" delay={delay + 0.15} />
        <SkeletonBase className="h-4 w-24" delay={delay + 0.2} />
      </div>
      <SkeletonBase className="h-64 w-full rounded-xl" delay={delay + 0.25} />
      <TextSkeleton lines={8} delay={delay + 0.3} />
    </div>
  );
}

// Stats skeleton
export function StatsSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl border border-border bg-card text-center space-y-2"
        >
          <SkeletonBase className="h-8 w-16 mx-auto" delay={delay + i * 0.1} />
          <SkeletonBase className="h-4 w-24 mx-auto" delay={delay + i * 0.1 + 0.05} />
        </div>
      ))}
    </div>
  );
}

// Timeline skeleton
export function TimelineSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <SkeletonBase className="h-4 w-4 rounded-full" delay={i * 0.1} />
            {i < items - 1 && (
              <SkeletonBase className="h-full w-px mt-2" delay={i * 0.1 + 0.05} />
            )}
          </div>
          <div className="flex-1 pb-8 space-y-3">
            <SkeletonBase className="h-5 w-48" delay={i * 0.1 + 0.1} />
            <SkeletonBase className="h-4 w-32" delay={i * 0.1 + 0.15} />
            <TextSkeleton lines={2} delay={i * 0.1 + 0.2} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Grid skeleton for any content
export function GridSkeleton({
  items = 6,
  columns = 3,
  delay = 0,
}: {
  items?: number;
  columns?: number;
  delay?: number;
}) {
  return (
    <div
      className={`grid gap-4 ${
        columns === 1
          ? "grid-cols-1"
          : columns === 2
          ? "grid-cols-1 md:grid-cols-2"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} delay={delay + i * 0.05} />
      ))}
    </div>
  );
}

// Page loading skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen py-24 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <SkeletonBase className="h-12 w-64 mx-auto" />
        <SkeletonBase className="h-6 w-96 mx-auto" delay={0.1} />
      </div>

      {/* Stats */}
      <StatsSkeleton delay={0.2} />

      {/* Content */}
      <GridSkeleton items={6} delay={0.4} />
    </div>
  );
}

// Now page skeleton
export function NowPageSkeleton() {
  return (
    <div className="min-h-screen py-24 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <SkeletonBase className="h-16 w-96 mx-auto" />
        <SkeletonBase className="h-6 w-2xl mx-auto" delay={0.1} />
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl border border-border bg-card">
            <SkeletonBase className="h-6 w-12 mx-auto" delay={i * 0.05} />
            <SkeletonBase className="h-4 w-16 mx-auto mt-2" delay={i * 0.05 + 0.02} />
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-border bg-card space-y-3"
            >
              <div className="flex gap-4">
                <SkeletonBase className="h-12 w-12 rounded-xl" delay={i * 0.1} />
                <div className="flex-1 space-y-2">
                  <SkeletonBase className="h-5 w-48" delay={i * 0.1 + 0.05} />
                  <SkeletonBase className="h-4 w-full" delay={i * 0.1 + 0.1} />
                  <SkeletonBase className="h-4 w-2/3" delay={i * 0.1 + 0.15} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <SkeletonBase className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonBase className="h-4 w-full" delay={i * 0.05} />
                <SkeletonBase className="h-2 w-full" delay={i * 0.05 + 0.02} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
