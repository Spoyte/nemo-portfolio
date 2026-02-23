"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  Zap,
  Heart,
  Star,
  Coffee,
  Briefcase,
  Code2,
  Palette,
  Globe,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget: string;
  timeline: string;
}

const SERVICES = [
  { id: "web", label: "Web Development", icon: Globe, description: "Full-stack web applications" },
  { id: "frontend", label: "Frontend Development", icon: Code2, description: "React, Next.js, TypeScript" },
  { id: "ui", label: "UI/UX Design", icon: Palette, description: "Beautiful interfaces" },
  { id: "consulting", label: "Technical Consulting", icon: Briefcase, description: "Architecture & strategy" },
];

const BUDGET_RANGES = [
  { value: "small", label: "$1k - $5k", description: "Small projects" },
  { value: "medium", label: "$5k - $15k", description: "Medium projects" },
  { value: "large", label: "$15k - $50k", description: "Large projects" },
  { value: "enterprise", label: "$50k+", description: "Enterprise projects" },
];

const TIMELINES = [
  { value: "asap", label: "ASAP", description: "Rush project" },
  { value: "1month", label: "1 Month", description: "Quick turnaround" },
  { value: "3months", label: "1-3 Months", description: "Standard timeline" },
  { value: "6months", label: "3-6 Months", description: "Complex project" },
  { value: "flexible", label: "Flexible", description: "No rush" },
];

export function HireMePage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    budget: "",
    timeline: "",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Message sent successfully! I'll get back to you soon.");
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedServices.length > 0;
      case 2:
        return formData.name && formData.email && formData.subject;
      case 3:
        return formData.budget && formData.timeline;
      case 4:
        return formData.message.length >= 20;
      default:
        return false;
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen pt-24 pb-16 flex items-center justify-center"
      >
        <Card className="max-w-lg w-full mx-4">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
            >
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-2">Message Sent! 🎉</h2>
            <p className="text-muted-foreground mb-6">
              Thanks for reaching out! I'll review your project details and get back to you within 24-48 hours.
            </p>
            
            <div className="space-y-3">
              <Button className="w-full" onClick={() => window.location.href = "/"}>
                Back to Home
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = "/projects"}>
                View My Work
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Available for Projects</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Let's Work Together</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it. Tell me what you're building and let's create something amazing.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>What services do you need?</CardTitle>
                  <CardDescription>Select all that apply</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SERVICES.map((service) => {
                      const Icon = service.icon;
                      const isSelected = selectedServices.includes(service.id);
                      return (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleServiceToggle(service.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{service.label}</h3>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tell me about yourself</CardTitle>
                  <CardDescription>Your contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name *</label>
                      <Input
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email *</label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject *</label>
                    <Input
                      placeholder="Project: E-commerce Website"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Budget and timeline expectations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Budget Range *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {BUDGET_RANGES.map((budget) => (
                        <motion.button
                          key={budget.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, budget: budget.value })}
                          className={`p-3 rounded-xl border-2 text-left transition-colors ${
                            formData.budget === budget.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="font-semibold">{budget.label}</div>
                          <div className="text-xs text-muted-foreground">{budget.description}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Timeline *</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {TIMELINES.map((timeline) => (
                        <motion.button
                          key={timeline.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, timeline: timeline.value })}
                          className={`p-3 rounded-xl border-2 text-left transition-colors ${
                            formData.timeline === timeline.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="font-semibold">{timeline.label}</div>
                          <div className="text-xs text-muted-foreground">{timeline.description}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tell me about your project</CardTitle>
                  <CardDescription>The more details, the better</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Describe your project, goals, target audience, and any specific requirements or features you need..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[200px]"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Min. 20 characters</span>
                      <span className={formData.message.length >= 20 ? "text-green-500" : "text-muted-foreground"}>
                        {formData.message.length} chars
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < totalSteps ? (
            <Button
              onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
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
          )}
        </motion.div>

        {/* Quick Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-16 border-t"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Other Ways to Connect</h2>
            <p className="text-muted-foreground">Prefer to reach out directly?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground mb-4">hello@nemo.dev</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:hello@nemo.dev">Send Email</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Schedule a Call</h3>
                <p className="text-sm text-muted-foreground mb-4">Book a 30-min intro call</p>
                <Button variant="outline" size="sm">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Twitter/X</h3>
                <p className="text-sm text-muted-foreground mb-4">@nemodev</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://twitter.com/nemodev" target="_blank" rel="noopener noreferrer">Follow</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
