"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Github, 
  GitCommit, 
  GitBranch, 
  Star, 
  Users,
  Activity,
  TrendingUp,
  Code2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simulated GitHub activity data
const generateActivityData = () => {
  const days = 30;
  const data = [];
  for (let i = 0; i < days; i++) {
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      count: Math.floor(Math.random() * 10),
    });
  }
  return data.reverse();
};

const recentCommits = [
  { message: "feat: add dark mode toggle", repo: "portfolio", time: "2 hours ago", sha: "abc123" },
  { message: "fix: resolve navigation bug", repo: "portfolio", time: "5 hours ago", sha: "def456" },
  { message: "docs: update README", repo: "react-hooks", time: "1 day ago", sha: "ghi789" },
  { message: "feat: implement auth flow", repo: "saas-dashboard", time: "2 days ago", sha: "jkl012" },
  { message: "chore: update dependencies", repo: "portfolio", time: "3 days ago", sha: "mno345" },
];

const languages = [
  { name: "TypeScript", percentage: 45, color: "#3178C6" },
  { name: "JavaScript", percentage: 25, color: "#F7DF1E" },
  { name: "CSS", percentage: 15, color: "#1572B6" },
  { name: "Python", percentage: 10, color: "#3776AB" },
  { name: "Other", percentage: 5, color: "#999999" },
];

export function GitHubActivity() {
  const [activityData] = useState(generateActivityData());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const maxCount = Math.max(...activityData.map(d => d.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Repositories", value: 42, icon: Code2 },
            { label: "Commits", value: "1.2k", icon: GitCommit },
            { label: "Stars", value: 156, icon: Star },
            { label: "Followers", value: 89, icon: Users },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 rounded-lg bg-muted"
            >
              <stat.icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Activity Graph */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            30-Day Activity
          </h4>
          <div className="flex gap-1 h-24 items-end">
            {activityData.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ height: 0 }}
                animate={{ height: `${(day.count / maxCount) * 100}%` }}
                transition={{ delay: index * 0.02 }}
                className="flex-1 rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors relative group"
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {day.count} commits on {day.date}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Language Distribution */}
        <div>
          <h4 className="text-sm font-medium mb-3">Language Distribution</h4>
          <div className="h-2 rounded-full overflow-hidden flex">
            {languages.map((lang) => (
              <div
                key={lang.name}
                style={{ 
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color
                }}
                className="h-full"
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-1 text-xs">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span>{lang.name} {lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Commits */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <GitCommit className="h-4 w-4" />
            Recent Commits
          </h4>
          <div className="space-y-2">
            {recentCommits.map((commit, index) => (
              <motion.div
                key={commit.sha}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <GitBranch className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{commit.message}</div>
                  <div className="text-xs text-muted-foreground">
                    {commit.repo} • {commit.time}
                  </div>
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  {commit.sha.slice(0, 6)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
