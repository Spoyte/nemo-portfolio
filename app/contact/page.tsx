"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mail,
  User,
  MessageSquare,
  Sparkles,
  Check,
  Loader2,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  MapPin,
  Clock,
  Calendar,
  Zap,
  Coffee,
  Heart,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const socialLinks = [
  { name: "GitHub", icon: Github, url: "https://github.com", color: "#333" },
  { name: "Twitter", icon: Twitter, url: "https://twitter.com", color: "#1DA1F2" },
  { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com", color: "#0A66C2" },
  { name: "Instagram", icon: Instagram, url: "https://instagram.com", color: "#E4405F" },
];

const availability = {
  status: "available",
  responseTime: "24 hours",
  timezone: "PST (UTC-8)",
  nextAvailable: "Now",
};

const services = [
  { name: "Web Development", icon: Globe, description: "Full-stack applications" },
  { name: "UI/UX Design", icon: Sparkles, description: "Beautiful interfaces" },
  { name: "Consulting", icon: Coffee, description: "Technical guidance" },
  { name: "Code Review", icon: Check, description: "Quality assurance" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize EmailJS
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Using EmailJS for email sending
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }
      );

      setIsSubmitted(true);
      toast.success("Message sent successfully! I'll get back to you soon.");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Email error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Let&apos;s Work <span className="text-gradient-animated">Together</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or just want to chat? I&apos;d love to hear from you.
            Fill out the form below and I&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
003e
            {/* Availability Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                </div>
                <span className="font-medium">Available for work</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Response time: {availability.responseTime}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{availability.timezone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Next available: {availability.nextAvailable}</span>
                </div>
              </div>
            </Card>

            {/* Services */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Services</h3>
              <div className="grid grid-cols-2 gap-3">
                {services.map((service) => (
                  <div key={service.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                    <service.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-muted hover:bg-primary/10 transition-colors group"
                  >
                    <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
003e
            <Card className="p-8">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <div className="relative">
                      <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Project Inquiry"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="pl-10 min-h-[150px]"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "What is your typical project timeline?",
                a: "Most projects take 2-8 weeks depending on complexity. I provide detailed timelines during our initial consultation."
              },
              {
                q: "Do you work with international clients?",
                a: "Absolutely! I work with clients worldwide and can accommodate different time zones for meetings."
              },
              {
                q: "What technologies do you specialize in?",
                a: "React, Next.js, TypeScript, Node.js, and modern web technologies. I'm always learning new tools."
              },
              {
                q: "How do we get started?",
                a: "Simply fill out the contact form above with your project details, and I'll reach out within 24 hours."
              },
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
