"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface StatItemProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

function AnimatedNumber({ value, suffix = "", prefix = "", label, duration = 2 }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="text-center">
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        className="text-4xl md:text-5xl font-bold text-gradient"
      >
        {prefix}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          {isInView && (
            <CountUp end={value} duration={duration} />
          )}
        </motion.span>
        {suffix}
      </motion.span>
      <p className="text-muted-foreground mt-2">{label}</p>
    </div>
  );
}

function CountUp({ end, duration }: { end: number; duration: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      <motion.span
        initial={{ opacity: 1 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration }}
      >
        {isInView && <Counter from={0} to={end} duration={duration} />}
      </motion.span>
    </motion.span>
  );
}

function Counter({ from, to, duration }: { from: number; to: number; duration: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true });

  return (
    <motion.span
      ref={nodeRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      <AnimatedCounter from={from} to={to} duration={duration} isInView={isInView} />
    </motion.span>
  );
}

function AnimatedCounter({
  from,
  to,
  duration,
  isInView,
}: {
  from: number;
  to: number;
  duration: number;
  isInView: boolean;
}) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(from + (to - from) * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration, isInView]);

  return <span>{count}</span>;
}

import { useState, useEffect } from "react";

const stats = [
  { value: 7, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Projects Completed" },
  { value: 30, suffix: "+", label: "Happy Clients" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
];

export function AnimatedStats() {
  return (
    <section className="py-20 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedNumber {...stat} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
