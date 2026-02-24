"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]",
      className
    )}>
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
  href?: string;
  onClick?: () => void;
}

export function BentoCard({ 
  children, 
  className, 
  colSpan = 1, 
  rowSpan = 1,
  href,
  onClick 
}: BentoCardProps) {
  const Component = href ? motion.a : motion.div;
  
  return (
    <Component
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-6",
        "hover:border-primary/50 transition-colors cursor-pointer",
        "flex flex-col",
        colSpan === 2 && "md:col-span-2",
        colSpan === 3 && "md:col-span-3",
        colSpan === 4 && "md:col-span-4",
        rowSpan === 2 && "row-span-2",
        className
      )}
    >
      {children}
    </Component>
  );
}

interface BentoCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoCardTitle({ children, className }: BentoCardTitleProps) {
  return (
    <h3 className={cn("font-semibold text-lg mb-2", className)}>
      {children}
    </h3>
  );
}

interface BentoCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoCardDescription({ children, className }: BentoCardDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

// Pre-built Bento items for common use cases
interface StatBentoCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function StatBentoCard({ 
  label, 
  value, 
  trend, 
  trendUp = true,
  icon,
  className 
}: StatBentoCardProps) {
  return (
    <BentoCard className={className}>
      <div className="flex items-start justify-between h-full">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs mt-2",
              trendUp ? "text-green-500" : "text-red-500"
            )}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10">
            {icon}
          </div>
        )}
      </div>
    </BentoCard>
  );
}

// Usage example component
export function BentoShowcase() {
  return (
    <BentoGrid>
      <BentoCard colSpan={2} rowSpan={2} className="bg-gradient-to-br from-primary/10 to-orange-500/10">
        <BentoCardTitle>Featured Project</BentoCardTitle>
        <BentoCardDescription>
          Check out my latest work on building scalable web applications with modern technologies.
        </BentoCardDescription>
      </BentoCard>
      
      <StatBentoCard
        label="Total Projects"
        value="50+"
        trend="12% this month"
        trendUp={true}
      />
      
      <StatBentoCard
        label="GitHub Stars"
        value="1.2k"
        trend="8% this week"
        trendUp={true}
      />
      
      <BentoCard className="bg-primary text-primary-foreground">
        <BentoCardTitle className="text-primary-foreground">Get in Touch</BentoCardTitle>
        <BentoCardDescription className="text-primary-foreground/80">
          Let&apos;s collaborate on your next project
        </BentoCardDescription>
      </BentoCard>
      
      <BentoCard colSpan={2}>
        <BentoCardTitle>Latest Blog Post</BentoCardTitle>
        <BentoCardDescription>
          Exploring the future of web development with AI-powered tools and frameworks.
        </BentoCardDescription>
      </BentoCard>
    </BentoGrid>
  );
}
