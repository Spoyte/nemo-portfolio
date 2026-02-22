"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Palette, 
  Database, 
  Cloud, 
  Wrench,
  Terminal,
  Star,
  Zap,
  Award,
  BookOpen,
  TrendingUp,
  Filter,
  Search,
  Sparkles,
  GitBranch,
  Layers,
  Cpu,
  Globe,
  Shield,
  Smartphone,
  Layout,
  Figma,
  TestTube,
  Workflow
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts";
import dynamic from "next/dynamic";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

// Enhanced skill data with relationships
const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    icon: Code2,
    color: "#61DAFB",
    skills: [
      { name: "React", level: 95, description: "Advanced hooks, patterns, and performance optimization", related: ["Next.js", "TypeScript", "Framer Motion"] },
      { name: "Next.js", level: 90, description: "App Router, SSR, SSG, and API routes", related: ["React", "TypeScript", "Vercel"] },
      { name: "TypeScript", level: 92, description: "Type-safe development and advanced patterns", related: ["React", "Next.js", "Node.js"] },
      { name: "Tailwind CSS", level: 95, description: "Utility-first styling and custom configurations", related: ["React", "Figma"] },
      { name: "Framer Motion", level: 85, description: "Complex animations and gestures", related: ["React", "Three.js"] },
      { name: "Three.js", level: 70, description: "3D web graphics and WebGL", related: ["React", "Framer Motion", "WebGL"] },
      { name: "WebGL", level: 65, description: "Low-level graphics programming", related: ["Three.js", "Canvas API"] },
      { name: "Canvas API", level: 75, description: "2D graphics and animations", related: ["WebGL", "Framer Motion"] },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: Database,
    color: "#339933",
    skills: [
      { name: "Node.js", level: 88, description: "Event-driven architecture and performance", related: ["Express", "GraphQL", "TypeScript"] },
      { name: "Express", level: 85, description: "Web framework for Node.js", related: ["Node.js", "REST API"] },
      { name: "PostgreSQL", level: 82, description: "Complex queries, indexing, and optimization", related: ["Prisma", "Redis"] },
      { name: "GraphQL", level: 80, description: "Schema design and resolver optimization", related: ["Node.js", "Apollo", "REST API"] },
      { name: "Redis", level: 75, description: "Caching strategies and data structures", related: ["PostgreSQL", "Node.js"] },
      { name: "Prisma", level: 85, description: "Type-safe database access", related: ["PostgreSQL", "TypeScript"] },
      { name: "REST API", level: 90, description: "API design and best practices", related: ["Express", "GraphQL", "Node.js"] },
      { name: "Apollo", level: 78, description: "GraphQL client and server", related: ["GraphQL", "React"] },
    ],
  },
  {
    id: "design",
    label: "Design",
    icon: Palette,
    color: "#F24E1E",
    skills: [
      { name: "Figma", level: 85, description: "UI/UX design and prototyping", related: ["Design Systems", "Tailwind CSS"] },
      { name: "Adobe XD", level: 75, description: "Wireframing and user flows", related: ["Figma", "Design Systems"] },
      { name: "Design Systems", level: 90, description: "Component libraries and documentation", related: ["Figma", "React", "Storybook"] },
      { name: "Storybook", level: 80, description: "Component documentation and testing", related: ["Design Systems", "React", "Jest"] },
      { name: "UI/UX", level: 88, description: "User interface and experience design", related: ["Figma", "Design Systems"] },
      { name: "Prototyping", level: 82, description: "Interactive mockups and animations", related: ["Figma", "Framer Motion"] },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    icon: Cloud,
    color: "#FF9900",
    skills: [
      { name: "Docker", level: 80, description: "Containerization and orchestration", related: ["Kubernetes", "AWS", "CI/CD"] },
      { name: "AWS", level: 78, description: "EC2, S3, Lambda, and CloudFront", related: ["Docker", "Vercel", "Terraform"] },
      { name: "Vercel", level: 95, description: "Edge functions and deployments", related: ["Next.js", "AWS"] },
      { name: "CI/CD", level: 82, description: "GitHub Actions and automated pipelines", related: ["Docker", "GitHub", "Testing"] },
      { name: "Kubernetes", level: 65, description: "Container orchestration", related: ["Docker", "AWS"] },
      { name: "Terraform", level: 70, description: "Infrastructure as code", related: ["AWS", "Docker"] },
      { name: "GitHub", level: 92, description: "Version control and collaboration", related: ["CI/CD", "Git"] },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Wrench,
    color: "#F05032",
    skills: [
      { name: "Git", level: 92, description: "Advanced workflows and conflict resolution", related: ["GitHub", "CI/CD"] },
      { name: "VS Code", level: 95, description: "Extensions and custom configurations", related: ["TypeScript", "ESLint"] },
      { name: "Jest", level: 85, description: "Unit and integration testing", related: ["Testing", "React", "Storybook"] },
      { name: "Testing", level: 82, description: "Test-driven development", related: ["Jest", "Cypress", "Playwright"] },
      { name: "Cypress", level: 78, description: "End-to-end testing", related: ["Testing", "Playwright"] },
      { name: "Playwright", level: 75, description: "Modern end-to-end testing", related: ["Testing", "Cypress"] },
      { name: "ESLint", level: 88, description: "Code quality and linting", related: ["VS Code", "TypeScript"] },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    color: "#8B5CF6",
    skills: [
      { name: "React Native", level: 75, description: "Cross-platform mobile development", related: ["React", "Expo"] },
      { name: "Expo", level: 72, description: "React Native toolchain", related: ["React Native", "Mobile"] },
      { name: "PWA", level: 85, description: "Progressive Web Apps", related: ["React", "Service Workers"] },
      { name: "Service Workers", level: 80, description: "Offline capabilities", related: ["PWA", "Web APIs"] },
      { name: "Mobile", level: 78, description: "Mobile-first design", related: ["React Native", "PWA", "Responsive"] },
      { name: "Responsive", level: 92, description: "Responsive web design", related: ["Tailwind CSS", "Mobile"] },
    ],
  },
];

const certifications = [
  {
    title: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    date: "2023",
    icon: Cloud,
    credential: "AWS-DEV-12345",
    color: "#FF9900",
  },
  {
    title: "Meta Frontend Developer",
    issuer: "Meta",
    date: "2022",
    icon: Code2,
    credential: "META-FE-67890",
    color: "#0668E1",
  },
  {
    title: "Google UX Design",
    issuer: "Google",
    date: "2021",
    icon: Palette,
    credential: "GOOGLE-UX-54321",
    color: "#4285F4",
  },
];

const learningGoals = [
  { name: "Rust", progress: 40, target: "Systems programming", category: "Backend" },
  { name: "Three.js", progress: 60, target: "3D web graphics", category: "Frontend" },
  { name: "AI/ML", progress: 25, target: "Machine learning", category: "Backend" },
  { name: "WebAssembly", progress: 35, target: "High-performance web", category: "Frontend" },
  { name: "Kubernetes", progress: 45, target: "Container orchestration", category: "DevOps" },
  { name: "Figma Advanced", progress: 70, target: "Design systems mastery", category: "Design" },
];

// Radar chart data
const radarData = [
  { subject: "Frontend", A: 92, fullMark: 100 },
  { subject: "Backend", A: 85, fullMark: 100 },
  { subject: "Design", A: 83, fullMark: 100 },
  { subject: "DevOps", A: 79, fullMark: 100 },
  { subject: "Tools", A: 88, fullMark: 100 },
  { subject: "Mobile", A: 76, fullMark: 100 },
];

// Skill Network Graph Component
function SkillNetworkGraph({ category }: { category: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height: Math.max(400, height) });
    }
  }, []);

  const selectedCategory = skillCategories.find(c => c.id === category);
  if (!selectedCategory) return null;

  // Build graph data
  const nodes = selectedCategory.skills.map((skill, i) => ({
    id: skill.name,
    name: skill.name,
    val: skill.level / 10,
    level: skill.level,
    color: selectedCategory.color,
    x: dimensions.width / 2 + Math.cos((i / selectedCategory.skills.length) * 2 * Math.PI) * 150,
    y: dimensions.height / 2 + Math.sin((i / selectedCategory.skills.length) * 2 * Math.PI) * 150,
  }));

  const links: { source: string; target: string; value: number }[] = [];
  selectedCategory.skills.forEach((skill) => {
    skill.related?.forEach((relatedName) => {
      if (selectedCategory.skills.some(s => s.name === relatedName)) {
        links.push({
          source: skill.name,
          target: relatedName,
          value: 1,
        });
      }
    });
  });

  return (
    <div ref={containerRef} className="w-full h-[400px] relative">
      <ForceGraph2D
        graphData={{ nodes, links }}
        width={dimensions.width}
        height={dimensions.height}
        nodeAutoColorBy="id"
        nodeColor={(node: any) => node.color}
        nodeLabel={(node: any) => `${node.name}: ${node.level}%`}
        linkColor={() => "rgba(148, 163, 184, 0.3)"}
        linkWidth={1}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Inter, sans-serif`;
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val * 2, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = "currentColor";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, node.x, node.y + node.val * 2 + fontSize);
        }}
        enableZoomInteraction={false}
        enablePanInteraction={false}
        cooldownTicks={100}
      />
    </div>
  );
}

// Skill Proficiency Heatmap
function SkillHeatmap() {
  const allSkills = skillCategories.flatMap(cat => 
    cat.skills.map(skill => ({ ...skill, category: cat.label, color: cat.color }))
  );

  const getColor = (level: number) => {
    if (level >= 90) return "bg-emerald-500";
    if (level >= 80) return "bg-emerald-400";
    if (level >= 70) return "bg-yellow-400";
    if (level >= 60) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
      {allSkills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.02 }}
          className="group relative"
        >
          <div 
            className={`aspect-square rounded-lg ${getColor(skill.level)} cursor-pointer transition-all hover:scale-110 hover:z-10`}
            style={{ opacity: skill.level / 100 }}
          />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
            <div className="font-semibold">{skill.name}</div>
            <div className="text-muted-foreground">{skill.category} • {skill.level}%</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Animated Skill Bar with Micro-interactions
function SkillBar({ skill, index, showDescription = true }: { skill: typeof skillCategories[0]["skills"][0]; index: number; showDescription?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.span 
            className="font-medium cursor-pointer"
            animate={{ color: isHovered ? "hsl(var(--primary))" : "inherit" }}
          >
            {skill.name}
          </motion.span>
          <AnimatePresence>
            {isHovered && showDescription && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
              >
                {skill.description}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.span 
          className="text-sm font-bold"
          animate={{ 
            scale: isHovered ? 1.2 : 1,
            color: isHovered ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
          }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.05, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, hsl(var(--primary)) 0%, ${skill.level >= 90 ? '#10b981' : skill.level >= 75 ? '#f59e0b' : '#ef4444'} 100%)`
          }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </motion.div>
        {isClicked && skill.related && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 mt-2 flex flex-wrap gap-1"
          >
            {skill.related.map((rel) => (
              <Badge key={rel} variant="secondary" className="text-xs">
                <GitBranch className="h-3 w-3 mr-1" />
                {rel}
              </Badge>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState("frontend");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "network" | "heatmap">("list");

  const filteredCategories = skillCategories.map(cat => ({
    ...cat,
    skills: cat.skills.filter(skill => 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.skills.length > 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Skills Visualization</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Skills & Expertise
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my technical capabilities through interactive visualizations. 
            Click on skills to see relationships, or switch views to discover more.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <Layers className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === "network" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("network")}
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Network
            </Button>
            <Button
              variant={viewMode === "heatmap" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("heatmap")}
            >
              <Layout className="h-4 w-4 mr-2" />
              Heatmap
            </Button>
          </div>
        </motion.div>

        {/* Skills Radar + Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Skill Distribution
                </CardTitle>
                <CardDescription>Radar chart showing proficiency across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Top Proficiencies
                </CardTitle>
                <CardDescription>Highest rated skills across all categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillCategories
                  .flatMap(cat => cat.skills.map(s => ({ ...s, category: cat.label })))
                  .sort((a, b) => b.level - a.level)
                  .slice(0, 6)
                  .map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="secondary" className="text-xs">{skill.category}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Skills Section */}
        {viewMode === "heatmap" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  Skill Proficiency Heatmap
                </CardTitle>
                <CardDescription>Visual representation of all skills by proficiency level</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillHeatmap />
                <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded" />
                    <span>90-100% (Expert)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-400 rounded" />
                    <span>80-89% (Advanced)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded" />
                    <span>70-79% (Intermediate)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-400 rounded" />
                    <span>60-69% (Learning)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : viewMode === "network" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-primary" />
                  Skill Relationship Network
                </CardTitle>
                <CardDescription>Interactive graph showing connections between related skills</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
                    {skillCategories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id} className="text-xs">
                        <category.icon className="h-3 w-3 mr-1 md:mr-2" />
                        <span className="hidden md:inline">{category.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {skillCategories.map((category) => (
                    <TabsContent key={category.id} value={category.id}>
                      <SkillNetworkGraph category={category.id} />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full mb-16">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full mb-8">
              {skillCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <category.icon className="h-4 w-4" style={{ color: category.color }} />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {filteredCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className="h-5 w-5" style={{ color: category.color }} />
                      {category.label} Skills
                      <Badge variant="secondary">{category.skills.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {category.skills.map((skill, index) => (
                      <SkillBar key={skill.name} skill={skill} index={index} />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Tech Stack Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Tech Stack</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: "React", color: "#61DAFB", icon: "⚛️" },
              { name: "Next.js", color: "#000000", icon: "▲" },
              { name: "TypeScript", color: "#3178C6", icon: "📘" },
              { name: "Tailwind", color: "#06B6D4", icon: "🌊" },
              { name: "Node.js", color: "#339933", icon: "🟢" },
              { name: "PostgreSQL", color: "#336791", icon: "🐘" },
              { name: "GraphQL", color: "#E10098", icon: "◈" },
              { name: "Redis", color: "#DC382D", icon: "🔴" },
              { name: "Docker", color: "#2496ED", icon: "🐳" },
              { name: "AWS", color: "#FF9900", icon: "☁️" },
              { name: "Figma", color: "#F24E1E", icon: "🎨" },
              { name: "Git", color: "#F05032", icon: "📦" },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5, rotateY: 10 }}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all text-center group cursor-pointer"
              >
                <motion.div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${tech.color}20` }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {tech.icon}
                </motion.div>
                <span className="font-medium group-hover:text-primary transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Currently Learning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningGoals.map((goal, index) => (
              <motion.div
                key={goal.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:border-primary/50 transition-colors group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground">{goal.target}</p>
                      </div>
                      <Badge variant="outline">{goal.category}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${goal.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full relative"
                        >
                          <motion.div
                            className="absolute inset-0 bg-white/30"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="hover:border-primary/50 transition-colors h-full group overflow-hidden relative">
                  <div 
                    className="absolute top-0 left-0 w-1 h-full transition-all group-hover:w-2"
                    style={{ backgroundColor: cert.color }}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: `${cert.color}20` }}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <cert.icon className="h-6 w-6" style={{ color: cert.color }} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{cert.title}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="secondary">{cert.date}</Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {cert.credential}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
