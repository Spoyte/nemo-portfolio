"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Code2, 
  Palette, 
  Rocket,
  CheckCircle2,
  ArrowRight,
  Mail,
  Calendar,
  Clock,
  Globe,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animations";

const SERVICES = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Full-stack web applications with modern technologies like Next.js, React, and Node.js.",
    features: ["Custom Web Apps", "API Development", "Database Design", "Cloud Deployment"],
    price: "From $5,000",
    popular: true,
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that delight users and drive engagement.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
    price: "From $3,000",
    popular: false,
  },
  {
    icon: Rocket,
    title: "Consulting",
    description: "Strategic guidance to help your team build better products faster.",
    features: ["Code Review", "Architecture", "Performance", "Best Practices"],
    price: "From $200/hr",
    popular: false,
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    description: "We'll discuss your project goals, requirements, and timeline to ensure we're a good fit.",
  },
  {
    step: "02",
    title: "Proposal",
    description: "I'll create a detailed proposal with scope, timeline, and pricing for your approval.",
  },
  {
    step: "03",
    title: "Development",
    description: "Regular updates and check-ins as I bring your project to life with clean, maintainable code.",
  },
  {
    step: "04",
    title: "Launch",
    description: "We'll deploy your project and I'll provide documentation and support for a smooth handoff.",
  },
];

const FAQS = [
  {
    question: "What is your typical project timeline?",
    answer: "Most projects take 4-12 weeks depending on complexity. I'll provide a detailed timeline during our proposal phase.",
  },
  {
    question: "Do you work with international clients?",
    answer: "Absolutely! I work with clients worldwide and can accommodate different time zones for meetings.",
  },
  {
    question: "What technologies do you specialize in?",
    answer: "I specialize in React, Next.js, TypeScript, Node.js, and modern cloud platforms like Vercel and AWS.",
  },
  {
    question: "How do we communicate during the project?",
    answer: "I use a combination of async updates (Slack/email) and scheduled video calls to keep you informed.",
  },
];

export default function HireMePage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: "", email: "", company: "", budget: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <ScrollReveal className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Briefcase className="h-4 w-4" />
            <span className="text-sm font-medium">Available for Projects</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Let&apos;s Build Something{" "}
            <span className="text-gradient-animated">Amazing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            I&apos;m currently accepting new projects. Whether you need a full-stack application, 
            UI/UX design, or technical consulting, I&apos;d love to hear about your project.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm">2-4 week availability</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Remote worldwide</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Fast turnaround</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Services */}
        <ScrollReveal className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Services</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Flexible engagement options tailored to your project needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <Card key={service.title} className={`relative overflow-hidden ${service.popular ? "ring-2 ring-primary" : ""}`}>
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    service.popular ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <p className="text-2xl font-bold">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        {/* Process */}
        <ScrollReveal className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We&apos;ll Work Together</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A proven process that ensures your project succeeds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="p-6 rounded-2xl bg-card border border-border h-full">
                  <span className="text-4xl font-bold text-muted-foreground/30">{step.step}</span>
                  <h3 className="text-lg font-semibold mt-2 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollReveal>
            <div>
              <h2 className="text-3xl font-bold mb-4">Start a Project</h2>
              <p className="text-muted-foreground mb-8">
                Tell me about your project and I&apos;ll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <Input
                      value={formState.company}
                      onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Range</label>
                    <select
                      value={formState.budget}
                      onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="">Select budget...</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k+">$50,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Details</label>
                  <Textarea
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell me about your project, goals, and timeline..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitted}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Message Sent!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Mail className="w-5 h-5" />
                        Send Message
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold mb-4">Why Work With Me?</h3>
                <ul className="space-y-3">
                  {[
                    "5+ years of experience",
                    "Clear communication",
                    "On-time delivery",
                    "Clean, maintainable code",
                    "Post-launch support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20">
                <h3 className="font-semibold mb-2">Quick Response</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  I typically respond to inquiries within 24 hours.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Available for meetings Mon-Fri</span>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h3 className="font-semibold mb-4">Frequently Asked</h3>
                <div className="space-y-2">
                  {FAQS.map((faq, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-sm">{faq.question}</span>
                        <motion.span
                          animate={{ rotate: openFaq === index ? 180 : 0 }}
                          className="text-muted-foreground"
                        >
                          ▼
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="p-4 pt-0 text-sm text-muted-foreground">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
