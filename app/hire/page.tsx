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
  Zap,
  Star,
  ChevronDown,
  Send,
  Check,
  Sparkles,
  MessageSquare,
  User,
  Building2,
  Wallet,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal, Counter } from "@/components/scroll-animations";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";

const SERVICES = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Full-stack web applications with modern technologies like Next.js, React, and Node.js.",
    features: [
      "Custom Web Apps",
      "API Development",
      "Database Design",
      "Cloud Deployment",
      "Performance Optimization",
    ],
    price: "From $5,000",
    popular: true,
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive interfaces that delight users and drive engagement.",
    features: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "Usability Testing",
    ],
    price: "From $3,000",
    popular: false,
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Rocket,
    title: "Consulting",
    description:
      "Strategic guidance to help your team build better products faster.",
    features: [
      "Code Review",
      "Architecture",
      "Performance",
      "Best Practices",
      "Team Training",
    ],
    price: "From $200/hr",
    popular: false,
    color: "from-orange-500 to-yellow-500",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We'll discuss your project goals, requirements, and timeline to ensure we're a good fit.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "Proposal",
    description:
      "I'll create a detailed proposal with scope, timeline, and pricing for your approval.",
    icon: FileText,
  },
  {
    step: "03",
    title: "Development",
    description:
      "Regular updates and check-ins as I bring your project to life with clean, maintainable code.",
    icon: Code2,
  },
  {
    step: "04",
    title: "Launch",
    description:
      "We'll deploy your project and I'll provide documentation and support for a smooth handoff.",
    icon: Rocket,
  },
];

const FAQS = [
  {
    question: "What is your typical project timeline?",
    answer:
      "Most projects take 4-12 weeks depending on complexity. I'll provide a detailed timeline during our proposal phase.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Absolutely! I work with clients worldwide and can accommodate different time zones for meetings.",
  },
  {
    question: "What technologies do you specialize in?",
    answer:
      "I specialize in React, Next.js, TypeScript, Node.js, and modern cloud platforms like Vercel and AWS.",
  },
  {
    question: "How do we communicate during the project?",
    answer:
      "I use a combination of async updates (Slack/email) and scheduled video calls to keep you informed.",
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer:
      "Yes! I offer monthly retainer packages for ongoing support, updates, and feature development.",
  },
  {
    question: "What is your payment structure?",
    answer:
      "I typically work with a 50% deposit upfront and 50% upon completion. For larger projects, we can arrange milestone-based payments.",
  },
];

const AVAILABILITY = {
  status: "available", // available, limited, busy
  message: "Available for new projects",
  nextAvailable: "Immediately",
  slots: [
    { month: "March", status: "limited", spots: 1 },
    { month: "April", status: "available", spots: 3 },
    { month: "May", status: "available", spots: 2 },
  ],
};

export default function EnhancedHirePage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({
        name: "",
        email: "",
        company: "",
        service: "",
        budget: "",
        timeline: "",
        message: "",
      });
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "limited":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
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
            I&apos;m currently accepting new projects. Whether you need a full-stack
            application, UI/UX design, or technical consulting, I&apos;d love to hear
            about your project.
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
              <motion.div
                key={service.title}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedService(service.title)}
                className={`relative overflow-hidden rounded-2xl border bg-card cursor-pointer transition-all ${
                  selectedService === service.title
                    ? "ring-2 ring-primary"
                    : "hover:border-primary/50"
                }`}
              >
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}
                  >
                    <service.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <p className="text-2xl font-bold">{service.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Availability Calendar */}
        <ScrollReveal className="mb-20">
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-4 h-4 rounded-full ${getStatusColor(
                      AVAILABILITY.status
                    )} animate-pulse`}
                  />
                  <div>
                    <h3 className="text-xl font-bold">{AVAILABILITY.message}</h3>
                    <p className="text-muted-foreground">
                      Next available: {AVAILABILITY.nextAvailable}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {AVAILABILITY.slots.map((slot) => (
                    <div
                      key={slot.month}
                      className="text-center p-4 rounded-xl bg-muted/50"
                    >
                      <p className="font-semibold">{slot.month}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(
                            slot.status
                          )}`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {slot.spots} spot{slot.spots > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Process */}
        <ScrollReveal className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How We&apos;ll Work Together
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A proven process that ensures your project succeeds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="p-6 rounded-2xl bg-card border border-border h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-bold text-muted-foreground/30">
                      {step.step}
                    </span>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <ScrollReveal className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Clients Say
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Don&apos;t just take my word for it — hear from the people I&apos;ve worked with
            </p>
          </div>

          <TestimonialsCarousel />
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
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        placeholder="John Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        placeholder="john@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formState.company}
                        onChange={(e) =>
                          setFormState({ ...formState, company: e.target.value })
                        }
                        placeholder="Acme Inc."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Service</label>
                    <select
                      value={formState.service}
                      onChange={(e) =>
                        setFormState({ ...formState, service: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="">Select a service...</option>
                      <option value="web">Web Development</option>
                      <option value="design">UI/UX Design</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Range</label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select
                        value={formState.budget}
                        onChange={(e) =>
                          setFormState({ ...formState, budget: e.target.value })
                        }
                        className="w-full h-10 px-3 pl-10 rounded-md border border-input bg-background"
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
                    <label className="block text-sm font-medium mb-2">Timeline</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select
                        value={formState.timeline}
                        onChange={(e) =>
                          setFormState({ ...formState, timeline: e.target.value })
                        }
                        className="w-full h-10 px-3 pl-10 rounded-md border border-input bg-background"
                      >
                        <option value="">Select timeline...</option>
                        <option value="asap">ASAP</option>
                        <option value="1-month">Within 1 month</option>
                        <option value="3-months">1-3 months</option>
                        <option value="6-months">3-6 months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Details *</label>
                  <Textarea
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
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
                        <Check className="w-5 h-5" />
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
                        <Send className="w-5 h-5" />
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
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Why Work With Me?
                  </h3>
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
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Quick Response</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    I typically respond to inquiries within 24 hours.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Available for meetings Mon-Fri</span>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Frequently Asked</h3>
                  <div className="space-y-2">
                    {FAQS.map((faq, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setOpenFaq(openFaq === index ? null : index)
                          }
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-sm">{faq.question}</span>
                          <motion.span
                            animate={{ rotate: openFaq === index ? 180 : 0 }}
                            className="text-muted-foreground"
                          >
                            <ChevronDown className="w-4 h-4" />
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
                              <p className="p-4 pt-0 text-sm text-muted-foreground">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
