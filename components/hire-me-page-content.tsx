"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Sparkles, 
  Zap, 
  Rocket, 
  Crown,
  Clock,
  MessageSquare,
  Code2,
  Palette,
  Globe,
  ArrowRight,
  Star,
  Shield,
  Headphones,
  Calendar,
  FileCode,
  Smartphone,
  Laptop
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/scroll-animations";
import { ContactForm } from "@/components/contact-form";

const pricingTiers = [
  {
    name: "Starter",
    icon: Zap,
    description: "Perfect for small projects and quick fixes",
    price: 500,
    period: "per project",
    popular: false,
    features: [
      "Single page website",
      "Responsive design",
      "Basic SEO setup",
      "2 revision rounds",
      "1 week delivery",
      "Email support",
    ],
    deliverables: [
      { icon: FileCode, label: "Source code" },
      { icon: Globe, label: "Deployment" },
      { icon: MessageSquare, label: "Documentation" },
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Professional",
    icon: Rocket,
    description: "Ideal for growing businesses and startups",
    price: 2000,
    period: "per project",
    popular: true,
    features: [
      "Multi-page website (up to 5)",
      "Custom animations & interactions",
      "Advanced SEO optimization",
      "CMS integration",
      "Performance optimization",
      "5 revision rounds",
      "2-3 weeks delivery",
      "Priority support",
    ],
    deliverables: [
      { icon: FileCode, label: "Source code" },
      { icon: Globe, label: "Deployment" },
      { icon: Palette, label: "Design system" },
      { icon: MessageSquare, label: "Training session" },
    ],
    color: "from-primary to-orange-500",
  },
  {
    name: "Enterprise",
    icon: Crown,
    description: "Full-scale solutions for complex needs",
    price: 5000,
    period: "starting at",
    popular: false,
    features: [
      "Unlimited pages",
      "Custom web application",
      "Database design & API development",
      "Third-party integrations",
      "Advanced analytics setup",
      "Unlimited revisions",
      "Dedicated project manager",
      "4-8 weeks delivery",
      "6 months support",
    ],
    deliverables: [
      { icon: FileCode, label: "Full source code" },
      { icon: Globe, label: "Production deployment" },
      { icon: Shield, label: "Security audit" },
      { icon: Headphones, label: "24/7 priority support" },
      { icon: Calendar, label: "Maintenance plan" },
    ],
    color: "from-purple-500 to-pink-500",
  },
];

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technologies",
    technologies: ["React", "Next.js", "TypeScript", "Node.js"],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that delight users and drive conversions",
    technologies: ["Figma", "Framer", "Tailwind CSS"],
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Responsive designs that work flawlessly on every device",
    technologies: ["PWA", "React Native", "Responsive Design"],
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Lightning-fast load times and optimized user experiences",
    technologies: ["Core Web Vitals", "SEO", "Accessibility"],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description: "We discuss your goals, requirements, and vision for the project.",
    duration: "1-2 days",
  },
  {
    number: "02",
    title: "Design",
    description: "I create wireframes and high-fidelity mockups for your approval.",
    duration: "3-7 days",
  },
  {
    number: "03",
    title: "Development",
    description: "Building your project with clean, maintainable code.",
    duration: "1-4 weeks",
  },
  {
    number: "04",
    title: "Launch",
    description: "Testing, deployment, and handoff with documentation.",
    duration: "2-3 days",
  },
];

const testimonials = [
  {
    content: "Nemo delivered beyond our expectations. The attention to detail and communication throughout the project was exceptional.",
    author: "Sarah Chen",
    role: "CEO, TechStart Inc.",
    rating: 5,
  },
  {
    content: "Working with Nemo was a game-changer for our startup. Our new site increased conversions by 150%.",
    author: "Michael Ross",
    role: "Founder, GrowthLab",
    rating: 5,
  },
  {
    content: "Professional, creative, and incredibly skilled. I couldn't be happier with the results.",
    author: "Emily Watson",
    role: "Marketing Director, BrandCo",
    rating: 5,
  },
];

export function HireMePageContent() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Available for New Projects</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Let's Build Something{" "}
            <span className="text-gradient-animated">Amazing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            I'm currently accepting new projects. Whether you need a stunning website, 
            a complex web application, or creative development work, I'd love to hear about it.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Available now
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Response time: < 24h
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              100% Satisfaction guarantee
            </div>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <ScrollReveal className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">What I Can Help You With</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 0.1}>
                <Card className="group h-full hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {service.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Pricing Tiers */}
        <ScrollReveal className="mb-20" id="pricing">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the package that fits your needs. All prices are fixed - no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <ScrollReveal key={tier.name} delay={index * 0.1}>
                <motion.div
                  onHoverStart={() => setHoveredTier(tier.name)}
                  onHoverEnd={() => setHoveredTier(null)}
                  className="relative"
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card 
                    className={`h-full relative overflow-hidden transition-all duration-300 ${
                      tier.popular 
                        ? "border-primary shadow-lg shadow-primary/10" 
                        : "hover:border-primary/50"
                    } ${selectedTier === tier.name ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-0 hover:opacity-5 transition-opacity`} />
                    
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                        <tier.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div>
                        <span className="text-4xl font-bold">${tier.price.toLocaleString()}</span>
                        <span className="text-muted-foreground ml-2">{tier.period}</span>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium">What's included:</p>
                        <ul className="space-y-2">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-3">Deliverables:</p>
                        <div className="flex flex-wrap gap-2">
                          {tier.deliverables.map((item) => (
                            <div 
                              key={item.label} 
                              className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                            >
                              <item.icon className="w-3 h-3" />
                              {item.label}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        className="w-full group"
                        variant={tier.popular ? "default" : "outline"}
                        onClick={() => setSelectedTier(selectedTier === tier.name ? null : tier.name)}
                      >
                        {selectedTier === tier.name ? "Selected" : "Get Started"}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Process Section */}
        <ScrollReveal className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Work Together</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A streamlined process designed to deliver exceptional results on time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <ScrollReveal key={step.number} delay={index * 0.1}>
                <div className="relative">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="text-4xl font-bold text-primary/20 mb-4">{step.number}</div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.duration}
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <ScrollReveal className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Clients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">{testimonial.author[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Contact Section */}
        <ScrollReveal id="contact">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 bg-gradient-to-br from-primary to-orange-500 text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
                <p className="text-white/80 mb-8">
                  Fill out the form and I'll get back to you within 24 hours with a detailed proposal.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Fast Response</p>
                      <p className="text-sm text-white/70">Usually within a few hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">No Commitment</p>
                      <p className="text-sm text-white/70">Free initial consultation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Satisfaction Guaranteed</p>
                      <p className="text-sm text-white/70">Revisions until you're happy</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 lg:p-12">
                <ContactForm selectedPackage={selectedTier} />
              </div>
            </div>
          </Card>
        </ScrollReveal>

        {/* FAQ Section */}
        <ScrollReveal className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "What technologies do you work with?",
                a: "I specialize in React, Next.js, TypeScript, and Tailwind CSS. For backend work, I use Node.js, PostgreSQL, and various cloud services."
              },
              {
                q: "How do payments work?",
                a: "I typically require a 50% deposit to begin work, with the remaining 50% due upon completion. For larger projects, we can arrange milestone-based payments."
              },
              {
                q: "Can you work with my existing team?",
                a: "Absolutely! I'm experienced in collaborating with in-house teams, other agencies, and stakeholders at all levels."
              },
              {
                q: "Do you offer ongoing maintenance?",
                a: "Yes, I offer monthly maintenance packages that include updates, security patches, and minor changes."
              },
              {
                q: "What if I'm not satisfied with the work?",
                a: "Your satisfaction is my priority. I offer revision rounds as specified in each package, and we'll work together until you're happy with the result."
              },
              {
                q: "Can you help with design if I don't have one?",
                a: "Yes! I offer full design services including wireframes, mockups, and complete UI/UX design as part of my packages."
              },
            ].map((faq, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
