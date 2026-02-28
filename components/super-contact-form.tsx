"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Mail, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  MapPin,
  Clock,
  AlertCircle,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const quickSubjects = [
  { value: "Project Inquiry", emoji: "🚀" },
  { value: "Freelance Opportunity", emoji: "💼" },
  { value: "Collaboration", emoji: "🤝" },
  { value: "Just Saying Hi", emoji: "👋" },
  { value: "Technical Question", emoji: "💡" },
];

export function SuperContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
        break;
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.length < 10) return "Message must be at least 10 characters";
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "message") {
      setCharCount(value.length);
    }

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name as keyof FormData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setFocusedField(null);
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleSubjectSelect = (subject: string) => {
    setFormData((prev) => ({ ...prev, subject }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      if (key !== "subject") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset after showing success
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setCharCount(0);
      setTouched({});
      setErrors({});
    }, 4000);
  };

  const getLocalTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Shanghai",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-2 space-y-6"
      >
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-orange-500 to-primary"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Let&apos;s Connect
            </CardTitle>
            <CardDescription>
              {getGreeting()}! I&apos;d love to hear from you. Whether you have a project in mind or just want to chat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Availability Status */}
            <motion.div 
              className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-medium">Available for work</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Local time: {getLocalTime()} (GMT+8)</span>
              </div>
            </motion.div>

            {/* Contact Details */}
            <div className="space-y-3">
              <motion.a
                href="mailto:hello@nemo.dev"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">hello@nemo.dev</p>
                </div>
              </motion.a>

              <motion.div
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">Shanghai, China 🇨🇳</p>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Find me on</p>
              <div className="flex gap-2">
                {[
                  { icon: Github, href: "https://github.com/nemodev", label: "GitHub" },
                  { icon: Twitter, href: "https://twitter.com/nemodev", label: "Twitter" },
                  { icon: Linkedin, href: "https://linkedin.com/in/nemodev", label: "LinkedIn" },
                ].map((social) => (
                  <motion.div key={social.label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="outline" size="icon" asChild className="rounded-xl">
                      <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                        <social.icon className="h-4 w-4" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </motion.div>
                <div>
                  <p className="font-medium">Quick Response</p>
                  <p className="text-sm text-muted-foreground">I typically respond within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-3"
      >
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-orange-500 to-primary"></div>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>
              Fill out the form below and I&apos;ll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6"
                    >
                      <motion.div
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <CheckCircle2 className="h-12 w-12 text-white" />
                      </motion.div>
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-bold mb-2"
                    >
                      Message Sent!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-muted-foreground"
                    >
                      Thanks for reaching out. I&apos;ll get back to you soon!
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-primary"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          Name *
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={() => handleFocus("name")}
                            placeholder="John Doe"
                            className={`transition-all ${
                              errors.name && touched.name
                                ? "border-red-500 focus:border-red-500"
                                : focusedField === "name"
                                ? "ring-2 ring-primary/20"
                                : ""
                            }`}
                          />
                          <AnimatePresence>
                            {errors.name && touched.name && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center gap-1"
                              >
                                <AlertCircle className="w-3 h-3" />
                                {errors.name}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          Email *
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={() => handleFocus("email")}
                            placeholder="john@example.com"
                            className={`transition-all ${
                              errors.email && touched.email
                                ? "border-red-500 focus:border-red-500"
                                : focusedField === "email"
                                ? "ring-2 ring-primary/20"
                                : ""
                            }`}
                          />
                          <AnimatePresence>
                            {errors.email && touched.email && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center gap-1"
                              >
                                <AlertCircle className="w-3 h-3" />
                                {errors.email}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <div className="flex flex-wrap gap-2">
                        {quickSubjects.map((subject) => (
                          <motion.button
                            key={subject.value}
                            type="button"
                            onClick={() => handleSubjectSelect(subject.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              formData.subject === subject.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                            }`}
                          >
                            <span className="mr-1">{subject.emoji}</span>
                            {subject.value}
                          </motion.button>
                        ))}
                      </div>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Or type your own subject..."
                        className="mt-2"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                        Message *
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onFocus={() => handleFocus("message")}
                          placeholder="Tell me about your project, ideas, or just say hi!"
                          required
                          rows={5}
                          className={`min-h-[120px] resize-none transition-all ${
                            errors.message && touched.message
                              ? "border-red-500 focus:border-red-500"
                              : focusedField === "message"
                              ? "ring-2 ring-primary/20"
                              : ""
                          }`}
                        />
                        <AnimatePresence>
                          {errors.message && touched.message && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center gap-1"
                            >
                              <AlertCircle className="w-3 h-3" />
                              {errors.message}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{charCount} characters</span>
                        <span>
                          {charCount > 0 && charCount < 10 && "Keep going! 💪"}
                          {charCount >= 10 && charCount < 50 && "Good start! 👍"}
                          {charCount >= 50 && charCount < 100 && "Getting detailed! 📝"}
                          {charCount >= 100 && "Excellent! 🌟"}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        type="submit"
                        className="w-full gap-2 h-12 text-base"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
