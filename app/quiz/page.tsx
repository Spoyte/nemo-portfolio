"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Share2, 
  Download,
  Code2,
  Palette,
  Terminal,
  Brain,
  Zap,
  Coffee,
  Target,
  Users,
  Lightbulb,
  Rocket,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    archetype: string;
    icon: React.ReactNode;
  }[];
}

interface Archetype {
  id: string;
  name: string;
  title: string;
  description: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  famousExamples: string[];
  color: string;
  icon: React.ReactNode;
  techStack: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "It's Monday morning. How do you start your week?",
    options: [
      { text: "Write a script to automate my coffee brewing", archetype: "automation", icon: <Terminal className="w-4 h-4" /> },
      { text: "Sketch out new UI concepts in Figma", archetype: "creative", icon: <Palette className="w-4 h-4" /> },
      { text: "Review the latest research papers on AI", archetype: "researcher", icon: <Brain className="w-4 h-4" /> },
      { text: "Plan the sprint and organize team tasks", archetype: "architect", icon: <Target className="w-4 h-4" /> },
    ],
  },
  {
    id: 2,
    question: "You encounter a bug. What's your first instinct?",
    options: [
      { text: "Write comprehensive tests to prevent it happening again", archetype: "automation", icon: <Terminal className="w-4 h-4" /> },
      { text: "Check if the UI still looks good while fixing it", archetype: "creative", icon: <Palette className="w-4 h-4" /> },
      { text: "Dive deep into the root cause and document findings", archetype: "researcher", icon: <Brain className="w-4 h-4" /> },
      { text: "Consider how this impacts the overall system design", archetype: "architect", icon: <Target className="w-4 h-4" /> },
    ],
  },
  {
    id: 3,
    question: "Which side project excites you most?",
    options: [
      { text: "A CLI tool that saves developers hours of work", archetype: "automation", icon: <Terminal className="w-4 h-4" /> },
      { text: "An interactive art installation with generative graphics", archetype: "creative", icon: <Palette className="w-4 h-4" /> },
      { text: "Exploring a new programming language's compiler", archetype: "researcher", icon: <Brain className="w-4 h-4" /> },
      { text: "Designing a scalable microservices architecture", archetype: "architect", icon: <Target className="w-4 h-4" /> },
    ],
  },
  {
    id: 4,
    question: "Your ideal work environment is:",
    options: [
      { text: "Multiple monitors with terminal windows everywhere", archetype: "automation", icon: <Terminal className="w-4 h-4" /> },
      { text: "A bright studio with design books and inspiration boards", archetype: "creative", icon: <Palette className="w-4 h-4" /> },
      { text: "A quiet library with access to academic papers", archetype: "researcher", icon: <Brain className="w-4 h-4" /> },
      { text: "A whiteboard-filled room for system design sessions", archetype: "architect", icon: <Target className="w-4 h-4" /> },
    ],
  },
  {
    id: 5,
    question: "When learning something new, you prefer to:",
    options: [
      { text: "Build a practical tool that uses the technology", archetype: "automation", icon: <Terminal className="w-4 h-4" /> },
      { text: "Create a visually stunning demo project", archetype: "creative", icon: <Palette className="w-4 h-4" /> },
      { text: "Read the source code and documentation thoroughly", archetype: "researcher", icon: <Brain className="w-4 h-4" /> },
      { text: "Understand how it fits into larger system patterns", archetype: "architect", icon: <Target className="w-4 h-4" /> },
    ],
  },
  {
    id: 6,
    question: "Your code is most likely to be praised for:",
    options: [
      { text: "Its efficiency and clever optimizations", archetype: "automation", icon: <Terminal className="w-4 h-4" /> },
      { text: "Its beautiful animations and transitions", archetype: "creative", icon: <Palette className="w-4 h-4" /> },
      { text: "Its innovative approach to solving problems", archetype: "researcher", icon: <Brain className="w-4 h-4" /> },
      { text: "Its clean architecture and scalability", archetype: "architect", icon: <Target className="w-4 h-4" /> },
    ],
  },
  {
    id: 7,
    question: "At a tech conference, you're most likely to:",
    options: [
      { text: "Attend workshops on DevOps and tooling", archetype: "automation", icon: <Terminal className="w-4 h-4" /> },
      { text: "Explore the creative coding and design tracks", archetype: "creative", icon: <Palette className="w-4 h-4" /> },
      { text: "Listen to academic talks on cutting-edge research", archetype: "researcher", icon: <Brain className="w-4 h-4" /> },
      { text: "Network with engineering leaders about best practices", archetype: "architect", icon: <Target className="w-4 h-4" /> },
    ],
  },
  {
    id: 8,
    question: "Your superpower as a developer is:",
    options: [
      { text: "Automating repetitive tasks", archetype: "automation", icon: <Zap className="w-4 h-4" /> },
      { text: "Creating delightful user experiences", archetype: "creative", icon: <Lightbulb className="w-4 h-4" /> },
      { text: "Solving complex algorithmic challenges", archetype: "researcher", icon: <Brain className="w-4 h-4" /> },
      { text: "Designing systems that scale", archetype: "architect", icon: <Rocket className="w-4 h-4" /> },
    ],
  },
];

const archetypes: Record<string, Archetype> = {
  automation: {
    id: "automation",
    name: "The Automation Alchemist",
    title: "Master of Efficiency",
    description: "You see repetitive tasks as puzzles waiting to be solved. Your bash scripts are legendary, and you've probably automated your morning routine. You believe that if you do something twice, it's time to write a script.",
    traits: ["Efficiency-obsessed", "CLI wizard", "Script enthusiast", "10x productivity"],
    strengths: ["Rapid prototyping", "DevOps mastery", "Tool building", "Process optimization"],
    weaknesses: ["May over-engineer simple tasks", "Spends more time automating than saving"],
    famousExamples: ["Brendan Eich", "Rob Pike", "Sindre Sorhus"],
    color: "from-green-500 to-emerald-600",
    icon: <Terminal className="w-12 h-12" />,
    techStack: ["Bash", "Python", "Docker", "GitHub Actions", "Terraform"],
  },
  creative: {
    id: "creative",
    name: "The Creative Coder",
    title: "Artist of the Terminal",
    description: "You blend technical skill with artistic vision. Code is your canvas, and you create experiences that make people say 'wow'. You believe beautiful code should create beautiful things.",
    traits: ["Design-focused", "Animation expert", "UX obsessed", "Visual thinker"],
    strengths: ["UI/UX design", "Animation", "Creative problem solving", "User empathy"],
    weaknesses: ["May prioritize aesthetics over performance", "Perfectionist tendencies"],
    famousExamples: ["John Maeda", "Casey Reas", "Joshua Davis"],
    color: "from-pink-500 to-rose-600",
    icon: <Palette className="w-12 h-12" />,
    techStack: ["Three.js", "WebGL", "Framer Motion", "GSAP", "Processing"],
  },
  researcher: {
    id: "researcher",
    name: "The Deep Diver",
    title: "Explorer of the Unknown",
    description: "You're driven by curiosity and a love for understanding how things work at a fundamental level. You read source code for fun and get excited about theoretical computer science.",
    traits: ["Curious", "Detail-oriented", "Academic mindset", "Innovation-focused"],
    strengths: ["Algorithm design", "Research", "Technical writing", "Mentoring"],
    weaknesses: ["Analysis paralysis", "May over-complicate solutions"],
    famousExamples: ["Donald Knuth", "Barbara Liskov", "Guido van Rossum"],
    color: "from-purple-500 to-violet-600",
    icon: <Brain className="w-12 h-12" />,
    techStack: ["Rust", "Haskell", "C++", "Python", "Julia"],
  },
  architect: {
    id: "architect",
    name: "The System Architect",
    title: "Builder of Digital Cities",
    description: "You see the big picture and design systems that stand the test of time. You're the person everyone turns to when they need to scale, and you love creating order from chaos.",
    traits: ["Strategic thinker", "Pattern master", "Leadership", "Visionary"],
    strengths: ["System design", "Technical leadership", "Mentoring", "Decision making"],
    weaknesses: ["May over-engineer early", "Analysis paralysis on architecture"],
    famousExamples: ["Martin Fowler", "Kent Beck", "Grady Booch"],
    color: "from-blue-500 to-indigo-600",
    icon: <Target className="w-12 h-12" />,
    techStack: ["Java", "Go", "Kubernetes", "AWS", "Microservices"],
  },
};

export default function DeveloperArchetypeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    automation: 0,
    creative: 0,
    researcher: 0,
    architect: 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (archetype: string, optionIndex: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSelectedOption(optionIndex);
    
    setTimeout(() => {
      setScores((prev) => ({
        ...prev,
        [archetype]: prev[archetype] + 1,
      }));

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnimating(false);
      } else {
        setShowResult(true);
        setIsAnimating(false);
      }
    }, 600);
  };

  const getResult = (): Archetype => {
    const maxScore = Math.max(...Object.values(scores));
    const topArchetype = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
    return archetypes[topArchetype || "automation"];
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({
      automation: 0,
      creative: 0,
      researcher: 0,
      architect: 0,
    });
    setShowResult(false);
    setSelectedOption(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const result = showResult ? getResult() : null;

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
            <span className="text-sm font-medium">Interactive Quiz</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Which Developer Archetype
            <span className="text-gradient-animated block mt-2">Are You?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your coding personality through 8 carefully crafted questions.
            Share your results and see how you compare!
          </p>
        </motion.div>

        {!showResult ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-8">
                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Question */}
                  <h2 className="text-2xl md:text-3xl font-bold mb-8">
                    {questions[currentQuestion].question}
                  </h2>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(option.archetype, index)}
                        disabled={isAnimating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-6 rounded-xl border-2 text-left transition-all ${
                          selectedOption === index
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${
                            selectedOption === index
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}>
                            {option.icon}
                          </div>
                          <span className="text-lg font-medium">{option.text}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {result && (
                <Card className="overflow-hidden">
                  {/* Result Header */}
                  <div className={`p-8 bg-gradient-to-br ${result.color} text-white`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="p-6 rounded-2xl bg-white/20 backdrop-blur-sm"
                      >
                        {result.icon}
                      </motion.div>
                      <div className="text-center md:text-left">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <p className="text-white/80 text-sm font-medium mb-1">You are...</p>
                          <h2 className="text-3xl md:text-4xl font-bold mb-2">{result.name}</h2>
                          <p className="text-xl text-white/90">{result.title}</p>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-8 space-y-8">
                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {result.description}
                      </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      {Object.entries(scores).map(([key, score], index) => (
                        <div
                          key={key}
                          className={`p-4 rounded-xl text-center ${
                            key === result.id ? "bg-primary/10 border border-primary/30" : "bg-muted"
                          }`}
                        >
                          <p className="text-2xl font-bold">{Math.round((score / questions.length) * 100)}%</p>
                          <p className="text-xs text-muted-foreground capitalize">{key}</p>
                        </div>
                      ))}
                    </motion.div>

                    {/* Traits */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Your Traits
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.traits.map((trait) => (
                          <Badge key={trait} variant="secondary" className="text-sm py-1 px-3">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                          <Trophy className="w-4 h-4" />
                          Strengths
                        </h3>
                        <ul className="space-y-2">
                          {result.strengths.map((strength) => (
                            <li key={strength} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-orange-600">
                          <Coffee className="w-4 h-4" />
                          Watch Out For
                        </h3>
                        <ul className="space-y-2">
                          {result.weaknesses.map((weakness) => (
                            <li key={weakness} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Tech Stack */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-primary" />
                        Recommended Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.techStack.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-sm py-1 px-3">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>

                    {/* Famous Examples */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="p-4 rounded-xl bg-muted"
                    >
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Famous {result.name}s
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You're in good company with {result.famousExamples.join(", ")}.
                      </p>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                      <Button onClick={resetQuiz} variant="outline" className="flex-1">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retake Quiz
                      </Button>
                      <Button className="flex-1">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Result
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Fun Fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            💡 Fun fact: Most developers are a mix of archetypes. 
            The best engineers know when to channel each persona!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
