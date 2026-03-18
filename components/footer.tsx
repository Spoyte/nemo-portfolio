"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, Heart, Sparkles, ArrowUpRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { href: "/about", label: "About" },
      { href: "/projects", label: "Projects" },
      { href: "/blog", label: "Blog" },
      { href: "/now", label: "Now" },
      { href: "/timeline", label: "Timeline" },
    ],
    experience: [
      { href: "/dashboard", label: "Dashboard", badge: "New" },
      { href: "/meditation", label: "Meditation", badge: "New" },
      { href: "/secret-garden", label: "Secret Garden", badge: "New" },
      { href: "/time-machine", label: "Time Machine", badge: "New" },
      { href: "/games", label: "Mini Games" },
    ],
    creative: [
      { href: "/art", label: "Generative Art" },
      { href: "/ai-art", label: "AI Art Generator" },
      { href: "/shader-studio", label: "Shader Studio" },
      { href: "/physics", label: "Physics Playground" },
      { href: "/creative-coding", label: "Creative Coding" },
    ],
    connect: [
      { href: "/contact", label: "Contact" },
      { href: "/hire", label: "Hire Me" },
      { href: "/guestbook", label: "Guestbook" },
      { href: "/testimonials", label: "Testimonials" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@nemo.dev", label: "Email" },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Stay Updated</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Never Miss an <span className="text-gradient-animated">Update</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Subscribe to get notified about new projects, blog posts, and exclusive content. 
              No spam, just quality updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                N
              </motion.div>
              <span className="font-semibold text-lg">Nemo</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Creative developer crafting digital experiences. Building the future, one line of code at a time.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Explore</h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Experience</h4>
            <ul className="space-y-2.5">
              {footerLinks.experience.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    {"badge" in link && link.badge && (
                      <Badge variant="secondary" className="text-[10px] px-1 py-0">{link.badge}</Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creative */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Creative</h4>
            <ul className="space-y-2.5">
              {footerLinks.creative.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Connect</h4>
            <ul className="space-y-2.5">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © {currentYear} Nemo. Crafted with 
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-primary fill-primary mx-1" />
              </motion.span>
              and lots of coffee
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/analytics" className="hover:text-foreground transition-colors flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Analytics
              </Link>
              <Link href="/changelog" className="hover:text-foreground transition-colors">
                Changelog
              </Link>
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                v5.0.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Easter Egg Hint */}
      <div className="text-center pb-4">
        <p className="text-[10px] text-muted-foreground/50">
          Try the Konami code: ↑↑↓↓←→←→BA
        </p>
      </div>
    </footer>
  );
}
