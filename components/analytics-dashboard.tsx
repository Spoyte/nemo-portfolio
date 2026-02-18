"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Eye, MousePointer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgTime: string;
  bounceRate: string;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    avgTime: "0:00",
    bounceRate: "0%",
  });

  useEffect(() => {
    // Simulate analytics data
    setData({
      pageViews: 15420,
      uniqueVisitors: 8934,
      avgTime: "3:24",
      bounceRate: "42%",
    });
  }, []);

  const stats = [
    {
      title: "Page Views",
      value: data.pageViews.toLocaleString(),
      change: "+12.5%",
      icon: Eye,
    },
    {
      title: "Unique Visitors",
      value: data.uniqueVisitors.toLocaleString(),
      change: "+8.2%",
      icon: Users,
    },
    {
      title: "Avg. Time",
      value: data.avgTime,
      change: "+15.3%",
      icon: TrendingUp,
    },
    {
      title: "Bounce Rate",
      value: data.bounceRate,
      change: "-5.1%",
      icon: MousePointer,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
