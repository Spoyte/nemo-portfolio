"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Twitter,
  Linkedin,
  Link2,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import confetti from "canvas-confetti";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  initials: string;
  color: string;
  project: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    content: "Nemo delivered exceptional work on our platform redesign. The attention to detail and user experience improvements exceeded our expectations. Our conversion rate increased by 40% after the launch.",
    rating: 5,
    initials: "SC",
    color: "#dc2626",
    project: "E-commerce Platform",
    date: "2024-12",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "CTO",
    company: "StartupXYZ",
    content: "Working with Nemo was a game-changer for our startup. The technical architecture decisions and clean code practices have made our platform scalable and maintainable. Highly recommended!",
    rating: 5,
    initials: "MJ",
    color: "#0891b2",
    project: "SaaS Dashboard",
    date: "2024-10",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Design Director",
    company: "Creative Studio",
    content: "The collaboration was seamless. Nemo has a rare ability to translate complex design systems into pixel-perfect implementations. The animations and micro-interactions added that extra polish.",
    rating: 5,
    initials: "ER",
    color: "#7c3aed",
    project: "Design System",
    date: "2024-08",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Founder",
    company: "InnovateLab",
    content: "From concept to deployment, Nemo handled everything professionally. The project was delivered on time and the communication throughout was excellent. Will definitely work together again.",
    rating: 5,
    initials: "DK",
    color: "#059669",
    project: "Mobile App",
    date: "2024-06",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Marketing Lead",
    company: "GrowthCo",
    content: "Our website performance improved dramatically after Nemo's optimization work. Page load times dropped by 60% and our SEO rankings have never been better. Incredible technical expertise!",
    rating: 5,
    initials: "LT",
    color: "#ea580c",
    project: "Website Optimization",
    date: "2024-04",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const currentTestimonial = testimonials[currentIndex];

  // Auto-advance carousel
  // useEffect(() => {
  //   if (!isAutoPlaying) return;
  //   
  //   const interval = setInterval(() => {
  //     setDirection(1);
  //     setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  //   }, 6000);

  //   return () => clearInterval(interval);
  // }, [isAutoPlaying]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const handleLike = (id: string) => {
    if (!liked.includes(id)) {
      setLiked([...liked, id]);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#dc2626", "#ea580c"],
      });
    }
  };

  const handleBookmark = (id: string) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter((b) => b !== id));
    } else {
      setBookmarked([...bookmarked, id]);
    }
  };

  const handleShare = (platform: string) => {
    const text = `"${currentTestimonial.content}" - ${currentTestimonial.name}`;
    const url = window.location.href;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(`${text} ${url}`);
        break;
    }
    setShowShareMenu(false);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Testimonials</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What People{" "}
            <span className="text-gradient-animated">Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Feedback from clients and collaborators I&apos;ve had the pleasure of working with.
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <Card className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center md:items-start">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative"
                      >
                        <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                          <AvatarFallback 
                            style={{ backgroundColor: currentTestimonial.color }}
                            className="text-white text-2xl font-bold"
                          >
                            {currentTestimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full shadow-lg"
                        >
                          <Quote className="h-4 w-4" />
                        </motion.div>
                      </motion.div>

                      <div className="mt-4 text-center md:text-left">
                        <h3 className="font-bold text-lg">{currentTestimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentTestimonial.role}
                        </p>
                        <p className="text-sm text-primary">
                          {currentTestimonial.company}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1 mt-3">
                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                          >
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${currentTestimonial.color}20`,
                            color: currentTestimonial.color 
                          }}
                        >
                          {currentTestimonial.project}
                        </span>
                      </div>

                      <blockquote className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-6">
                        <span className="text-4xl text-primary/30">&ldquo;</span>
                        {currentTestimonial.content}
                        <span className="text-4xl text-primary/30">&rdquo;</span>
                      </blockquote>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLike(currentTestimonial.id)}
                          className={liked.includes(currentTestimonial.id) ? "text-red-500 border-red-200" : ""}
                        >
                          <ThumbsUp className={`h-4 w-4 mr-2 ${liked.includes(currentTestimonial.id) ? "fill-current" : ""}`} />
                          {liked.includes(currentTestimonial.id) ? "Liked" : "Like"}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookmark(currentTestimonial.id)}
                          className={bookmarked.includes(currentTestimonial.id) ? "text-primary border-primary/50" : ""}
                        >
                          <Bookmark className={`h-4 w-4 mr-2 ${bookmarked.includes(currentTestimonial.id) ? "fill-current" : ""}`} />
                          {bookmarked.includes(currentTestimonial.id) ? "Saved" : "Save"}
                        </Button>

                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowShareMenu(!showShareMenu)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>

                          <AnimatePresence>
                            {showShareMenu && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="fixed inset-0 z-40"
                                  onClick={() => setShowShareMenu(false)}
                                />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  className="absolute bottom-full left-0 mb-2 z-50 p-2 rounded-xl bg-popover border shadow-lg"
                                >
                                  <div className="flex flex-col gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleShare("twitter")}
                                      className="justify-start"
                                    >
                                      <Twitter className="h-4 w-4 mr-2" />
                                      Twitter
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleShare("linkedin")}
                                      className="justify-start"
                                    >
                                      <Linkedin className="h-4 w-4 mr-2" />
                                      LinkedIn
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleShare("copy")}
                                      className="justify-start"
                                    >
                                      <Link2 className="h-4 w-4 mr-2" />
                                      Copy Link
                                    </Button>
                                  </div>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full h-12 w-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full h-12 w-12"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
        >
          {[
            { label: "Happy Clients", value: "50+", icon: "😊" },
            { label: "Projects Completed", value: "100+", icon: "🚀" },
            { label: "5-Star Reviews", value: "47", icon: "⭐" },
            { label: "Years Experience", value: "7+", icon: "💼" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
