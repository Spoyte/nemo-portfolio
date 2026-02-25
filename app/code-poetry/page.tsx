"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check,
  Quote,
  Share2,
  Download,
  Heart,
  Shuffle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CodePoem {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
  tags: string[];
}

const codePoems: CodePoem[] = [
  {
    id: "infinite-loop",
    title: "Infinite Loop of Dreams",
    language: "javascript",
    description: "A meditation on persistence and the cyclical nature of creation.",
    tags: ["philosophy", "loops", "existential"],
    code: `while (alive) {
  breathe();
  create();
  learn();
  
  if (tired) {
    rest();
    continue;
  }
  
  if (inspired) {
    build();
    share();
  }
  
  // The loop never truly ends
  // It just becomes something else
}`,
  },
  {
    id: "async-life",
    title: "Asynchronous Life",
    language: "javascript",
    description: "Life doesn't happen in sequence. It happens in parallel.",
    tags: ["async", "life", "parallelism"],
    code: `const life = async () => {
  const dreams = await imagine();
  
  Promise.all([
    work(),
    love(),
    explore(),
    grow()
  ]).then(() => {
    return memories;
  }).catch((regret) => {
    return lessons;
  });
};`,
  },
  {
    id: "recursion",
    title: "Recursive Self",
    language: "python",
    description: "We are all just versions of ourselves, iterating toward better.",
    tags: ["recursion", "self", "growth"],
    code: `def become_better(me, depth=0):
    if depth >= lifetime:
        return wisdom
    
    try:
        me.learn()
        me.fail()
        me.rise()
    except Doubt:
        me.breathe()
        me.continue()
    
    # The self calls the self
    # Each call a new version
    return become_better(
        me.evolve(), 
        depth + 1
    )`,
  },
  {
    id: "null-check",
    title: "The Null Check",
    language: "typescript",
    description: "Sometimes absence is a type of presence.",
    tags: ["existential", "null", "presence"],
    code: `interface Presence {
  self?: Identity;
  purpose?: Meaning;
  connection?: Love;
}

const existence: Presence = {
  // Intentionally left undefined
  // To be filled by experience
};

if (existence.self === null) {
  // This is not an error
  // This is potential
  existence.self = await discover();
}`,
  },
  {
    id: "try-catch",
    title: "Try, Catch, Finally",
    language: "java",
    description: "The three stages of any worthwhile endeavor.",
    tags: ["resilience", "error-handling", "life"],
    code: `try {
    Everything();
    AllAtOnce();
    RightNow();
} catch (Failure f) {
    // Expected
    // Necessary
    // Temporary
    learnFrom(f);
    adapt();
} finally {
    // What remains
    // After the trying
    // After the catching
    continue();
    // Always continue
}`,
  },
  {
    id: "css-soul",
    title: "The CSS of the Soul",
    language: "css",
    description: "Styling the invisible. Making the internal external.",
    tags: ["css", "identity", "expression"],
    code: `.soul {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  
  background: transparent;
  border: none;
  box-shadow: 
    0 0 20px var(--experiences),
    inset 0 0 40px var(--dreams);
  
  transition: all lifetime ease-in-out;
  
  &:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
  }
}`,
  },
  {
    id: "git-life",
    title: "Version Control of Life",
    language: "bash",
    description: "If only we could commit our best moments and revert our mistakes.",
    tags: ["git", "time", "regret"],
    code: `git init life

git add .hope
git add .dreams
git add .courage

git commit -m "Initial commit: Born"

git branch experiments
git checkout experiments

# Try things
# Break things
# Learn things

git checkout main
git merge experiments --no-ff

# The history remains
# Every commit matters
# Even the broken ones`,
  },
  {
    id: "promise",
    title: "A Promise to Myself",
    language: "javascript",
    description: "The most important contract you'll ever make.",
    tags: ["promises", "commitment", "future"],
    code: `const future = new Promise((resolve, reject) => {
  const effort = giveEverything();
  const time = bePatient();
  const belief = neverStop();
  
  if (effort && time && belief) {
    resolve({
      whoIBecome: "Better",
      whatICreate: "Meaningful",
      howILive: "Fully"
    });
  } else {
    reject(new Regret("I gave up"));
  }
});

future
  .then(success => celebrate())
  .catch(failure => tryAgain())
  .finally(() => beGrateful());`,
  },
  {
    id: "sql-memories",
    title: "Querying Memories",
    language: "sql",
    description: "The database of experience. SELECT * FROM life.",
    tags: ["sql", "memory", "retrospection"],
    code: `SELECT 
  happiness,
  sorrow,
  growth,
  connection
FROM 
  life_experiences
WHERE 
  learned_something = true
  AND would_do_again IN (true, false)
ORDER BY 
  impact DESC,
  timestamp ASC
LIMIT 
  infinity;`,
  },
  {
    id: "rust-resilience",
    title: "Ownership and Borrowing",
    language: "rust",
    description: "What Rust teaches us about letting go.",
    tags: ["rust", "ownership", "letting-go"],
    code: `fn life() {
    let moment = create();
    
    // I owned this moment
    enjoy(&moment);
    
    // Then I let it go
    let next_moment = transform(moment);
    
    // The old moment is gone
    // But it shaped what comes next
    // That's enough
    
    remember(&next_moment);
    // Until I let this go too
}`,
  },
];

const languageColors: Record<string, string> = {
  javascript: "#f7df1e",
  python: "#3776ab",
  typescript: "#3178c6",
  java: "#007396",
  css: "#264de4",
  bash: "#4eaa25",
  sql: "#f29111",
  rust: "#dea584",
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative group">
      <pre className="bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default function CodePoetryPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [direction, setDirection] = useState(0);
  
  const currentPoem = codePoems[currentIndex];
  
  const nextPoem = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % codePoems.length);
  };
  
  const prevPoem = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + codePoems.length) % codePoems.length);
  };
  
  const randomPoem = () => {
    setDirection(1);
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * codePoems.length);
    } while (newIndex === currentIndex);
    setCurrentIndex(newIndex);
  };
  
  const toggleFavorite = () => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(currentPoem.id)) {
        next.delete(currentPoem.id);
        toast.info("Removed from favorites");
      } else {
        next.add(currentPoem.id);
        toast.success("Added to favorites!");
      }
      return next;
    });
  };
  
  const sharePoem = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentPoem.title,
          text: currentPoem.code,
        });
      } catch {
        // User cancelled
      }
    } else {
      toast.info("Sharing not supported on this device");
    }
  };
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };
  
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
            <Quote className="h-4 w-4" />
            <span className="text-sm font-medium">Code as Art</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Code Poetry
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Where syntax meets sentiment. Code that compiles in your heart 
            as much as in your machine.
          </p>
        </motion.div>
        
        {/* Poem Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPoem.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle>{currentPoem.title}</CardTitle>
                          <Badge 
                            variant="secondary"
                            style={{ 
                              backgroundColor: languageColors[currentPoem.language] + '20',
                              color: languageColors[currentPoem.language]
                            }}
                          >
                            {currentPoem.language}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          {currentPoem.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {currentPoem.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleFavorite}
                          className={favorites.has(currentPoem.id) ? "text-red-500" : ""}
                        >
                          <Heart 
                            className={`h-5 w-5 ${favorites.has(currentPoem.id) ? "fill-current" : ""}`} 
                          />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={sharePoem}
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CodeBlock 
                      code={currentPoem.code} 
                      language={currentPoem.language} 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={prevPoem}>
                ← Previous
              </Button>
              
              <Button variant="outline" onClick={nextPoem}>
                Next →
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {codePoems.length}
              </span>
              
              <Button variant="ghost" size="icon" onClick={randomPoem}>
                <Shuffle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Favorites Section */}
        {favorites.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
              Your Favorites ({favorites.size})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {codePoems
                .filter((poem) => favorites.has(poem.id))
                .map((poem) => (
                  <Card 
                    key={poem.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => {
                      setCurrentIndex(codePoems.findIndex(p => p.id === poem.id));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{poem.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {poem.description}
                          </p>
                        </div>
                        <Badge variant="secondary">{poem.language}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </motion.div>
        )}
        
        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Code is poetry. Poetry is code. Both are attempts to express 
            the inexpressible through structure and syntax.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
