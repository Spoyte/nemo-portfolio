"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Star, 
  ExternalLink, 
  Clock, 
  CheckCircle2,
  Circle,
  Bookmark,
  Lightbulb,
  Code2,
  Palette,
  Brain,
  Rocket,
  Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  status: "reading" | "completed" | "want-to-read";
  progress?: number;
  category: string;
  description: string;
  tags: string[];
  takeaway?: string;
}

const books: Book[] = [
  {
    id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    cover: "📘",
    rating: 5,
    status: "completed",
    progress: 100,
    category: "Programming",
    description: "A must-read for any developer. Changed how I think about code quality.",
    tags: ["Best Practices", "Refactoring", "Maintainability"],
    takeaway: "Code is read much more often than it's written. Clarity over cleverness.",
  },
  {
    id: "2",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    cover: "📗",
    rating: 5,
    status: "completed",
    progress: 100,
    category: "Programming",
    description: "Timeless wisdom for software craftsmen. Every tip is actionable.",
    tags: ["Career", "Mindset", "Tools"],
    takeaway: "Invest in your knowledge portfolio. Learn one new language every year.",
  },
  {
    id: "3",
    title: "Refactoring",
    author: "Martin Fowler",
    cover: "📙",
    rating: 5,
    status: "reading",
    progress: 65,
    category: "Programming",
    description: "The bible of code improvement. Essential for maintaining legacy code.",
    tags: ["Refactoring", "Code Quality", "Patterns"],
    takeaway: "Small changes, tested frequently. The refactoring cycle is your friend.",
  },
  {
    id: "4",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    cover: "📕",
    rating: 5,
    status: "reading",
    progress: 40,
    category: "System Design",
    description: "Deep dive into distributed systems. Heavy but incredibly valuable.",
    tags: ["Databases", "Distributed Systems", "Architecture"],
    takeaway: "Understand the trade-offs. There are no silver bullets in system design.",
  },
  {
    id: "5",
    title: "Atomic Design",
    author: "Brad Frost",
    cover: "📒",
    rating: 4,
    status: "completed",
    progress: 100,
    category: "Design",
    description: "A methodology for creating design systems. Practical and inspiring.",
    tags: ["Design Systems", "UI/UX", "Component Architecture"],
    takeaway: "Design systems are like chemistry. Atoms → Molecules → Organisms → Templates → Pages.",
  },
  {
    id: "6",
    title: "Deep Work",
    author: "Cal Newport",
    cover: "📓",
    rating: 5,
    status: "completed",
    progress: 100,
    category: "Productivity",
    description: "Rules for focused success in a distracted world. Game changer.",
    tags: ["Focus", "Productivity", "Career"],
    takeaway: "Protect your deep work time ruthlessly. It's your competitive advantage.",
  },
  {
    id: "7",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cover: "📔",
    rating: 4,
    status: "want-to-read",
    category: "Psychology",
    description: "Understanding how we think. Essential for making better decisions.",
    tags: ["Psychology", "Decision Making", "Behavioral Economics"],
  },
  {
    id: "8",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    cover: "📚",
    rating: 5,
    status: "completed",
    progress: 100,
    category: "Finance",
    description: "Money is more about behavior than math. Short, powerful lessons.",
    tags: ["Finance", "Behavior", "Wealth"],
    takeaway: "Wealth is what you don't see. Saving is the gap between your ego and your income.",
  },
  {
    id: "9",
    title: "Building Microservices",
    author: "Sam Newman",
    cover: "📖",
    rating: 4,
    status: "want-to-read",
    category: "System Design",
    description: "Practical guide to microservices architecture.",
    tags: ["Microservices", "Architecture", "DevOps"],
  },
  {
    id: "10",
    title: "The Manager's Path",
    author: "Camille Fournier",
    cover: "📘",
    rating: 4,
    status: "reading",
    progress: 30,
    category: "Career",
    description: "Guide for tech leaders. From mentor to CTO.",
    tags: ["Leadership", "Management", "Career Growth"],
    takeaway: "Management is a skill, not a promotion. It requires deliberate practice.",
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  Programming: Code2,
  "System Design": Rocket,
  Design: Palette,
  Productivity: Zap,
  Psychology: Brain,
  Finance: Bookmark,
  Career: Lightbulb,
};

export function ReadingList() {
  const readingNow = books.filter((b) => b.status === "reading");
  const completed = books.filter((b) => b.status === "completed");
  const wantToRead = books.filter((b) => b.status === "want-to-read");

  const stats = {
    total: books.length,
    completed: completed.length,
    reading: readingNow.length,
    toRead: wantToRead.length,
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Books", value: stats.total, icon: BookOpen },
          { label: "Completed", value: stats.completed, icon: CheckCircle2 },
          { label: "Reading Now", value: stats.reading, icon: Clock },
          { label: "Want to Read", value: stats.toRead, icon: Circle },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Currently Reading */}
      {readingNow.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Currently Reading
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readingNow.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="text-4xl">{book.cover}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold truncate">{book.title}</h4>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {book.progress}%
                          </Badge>
                        </div>
                        
                        <div className="mt-3">
                          <Progress value={book.progress} className="h-2" />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {book.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {book.takeaway && (
                          <p className="mt-3 text-sm text-muted-foreground italic">
                            "{book.takeaway}"
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Completed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completed.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="text-4xl">{book.cover}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold truncate">{book.title}</h4>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                        <div className="flex shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < book.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {book.description}
                      </p>

                      {book.takeaway && (
                        <div className="mt-3 p-2 rounded-lg bg-muted/50">
                          <p className="text-sm italic">
                            💡 {book.takeaway}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-1">
                        {book.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Want to Read */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-orange-500" />
          Want to Read
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wantToRead.map((book, index) => {
            const CategoryIcon = categoryIcons[book.category] || BookOpen;
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{book.cover}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{book.title}</h4>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                        
                        <div className="mt-2 flex items-center gap-1">
                          <CategoryIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{book.category}</span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {book.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-1.5 py-0.5 rounded bg-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Categories Summary */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Reading by Category</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(
            books.reduce((acc, book) => {
              acc[book.category] = (acc[book.category] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([category, count]) => {
            const CategoryIcon = categoryIcons[category] || BookOpen;
            return (
              <Badge
                key={category}
                variant="secondary"
                className="px-3 py-1.5 text-sm"
              >
                <CategoryIcon className="h-3 w-3 mr-1" />
                {category}
                <span className="ml-1 text-muted-foreground">({count})</span>
              </Badge>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default ReadingList;
