"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                N
              </div>
              <span className="font-semibold text-lg">Nemo</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Creative developer crafting digital experiences. Building the future, one line of code at a time.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Mail, href: "mailto:hello@nemo.dev", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/projects", label: "Projects" },
                { href: "/blog", label: "Blog" },
                { href: "/now", label: "Now" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>hello@nemo.dev</li>
              <li>San Francisco, CA</li>
              <li>Available for freelance</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {currentYear} Nemo. Made with<Heart className="w-4 h-4 text-primary fill-primary" />
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/analytics" className="hover:text-foreground transition-colors">
              Analytics
            </Link>
            <span>•</span>
            <span id="visitor-count">Loading visitors...</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
