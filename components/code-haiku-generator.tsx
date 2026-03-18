import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Copy, Check, Sparkles, Code2, BookOpen, Terminal, Cpu, Network, Database, GitBranch, Layers } from 'lucide-react';

interface CodeHaiku {
  id: string;
  lines: [string, string, string];
  theme: string;
  concept: string;
  explanation: string;
}

const haikuDatabase: CodeHaiku[] = [
  {
    id: 'recursion',
    lines: ['Function calls itself', 'Mirrors within mirrors dance', 'Base case breaks the spell'],
    theme: 'Recursion',
    concept: 'recursion',
    explanation: 'A function that calls itself, requiring a base case to prevent infinite loops'
  },
  {
    id: 'binary-search',
    lines: ['Half the space is gone', 'Divide and conquer the noise', 'Target found in log'],
    theme: 'Binary Search',
    concept: 'algorithm',
    explanation: 'O(log n) search by repeatedly dividing the search interval in half'
  },
  {
    id: 'promise',
    lines: ['Future yet unknown', 'Then resolves the pending wait', 'Async flows like streams'],
    theme: 'Promises',
    concept: 'async',
    explanation: 'An object representing the eventual completion or failure of an asynchronous operation'
  },
  {
    id: 'closure',
    lines: ['Scope remembered well', 'Function holds its birth context', 'Secrets kept inside'],
    theme: 'Closures',
    concept: 'functional',
    explanation: 'A function that retains access to its lexical scope even when executed outside that scope'
  },
  {
    id: 'garbage-collection',
    lines: ['Memory swept clean', 'Unreachable objects fade', 'Space born from the void'],
    theme: 'Garbage Collection',
    concept: 'systems',
    explanation: 'Automatic memory management that frees memory occupied by objects no longer in use'
  },
  {
    id: 'hash-table',
    lines: ['Keys transform to doors', 'Buckets hold the scattered seeds', 'O of one arrives'],
    theme: 'Hash Tables',
    concept: 'data-structure',
    explanation: 'Data structure implementing an associative array using hash functions for O(1) access'
  },
  {
    id: 'git-commit',
    lines: ['Snapshot frozen now', 'History branches like a tree', 'Merge conflicts arise'],
    theme: 'Git Commits',
    concept: 'version-control',
    explanation: 'A snapshot of the repository at a specific point in time, forming the project history'
  },
  {
    id: 'neural-network',
    lines: ['Weights adjust and learn', 'Hidden layers dream patterns', 'Error backpropagates'],
    theme: 'Neural Networks',
    concept: 'ai',
    explanation: 'Computing systems inspired by biological neural networks, learning from training data'
  },
  {
    id: 'deadlock',
    lines: ['Circular they wait', 'Resources locked in embrace', 'Forever frozen'],
    theme: 'Deadlock',
    concept: 'concurrency',
    explanation: 'A state where two or more processes are unable to proceed because each waits for the other'
  },
  {
    id: 'cache',
    lines: ['Hot data stays near', 'Memory trades space for speed', 'Hits and misses count'],
    theme: 'Caching',
    concept: 'systems',
    explanation: 'Storing copies of data in faster, temporary storage to reduce access time'
  },
  {
    id: 'bubble-sort',
    lines: ['Neighbors swap their place', 'Bubbles rise through liquid code', 'N squared slowness reigns'],
    theme: 'Bubble Sort',
    concept: 'algorithm',
    explanation: 'Simple sorting algorithm that repeatedly steps through the list, swapping adjacent elements'
  },
  {
    id: 'pointer',
    lines: ['Address holds the key', 'Dereference to touch the void', 'Null waits silently'],
    theme: 'Pointers',
    concept: 'systems',
    explanation: 'A variable containing a memory address, enabling indirect data access and manipulation'
  },
  {
    id: 'regex',
    lines: ['Patterns match the text', 'Capture groups hold their secrets', 'Escape the special'],
    theme: 'Regular Expressions',
    concept: 'parsing',
    explanation: 'Sequences defining search patterns, used for string matching and manipulation'
  },
  {
    id: 'stack',
    lines: ['Last one in departs', 'Push and pop the ordered pile', 'Overflow awaits'],
    theme: 'Stack',
    concept: 'data-structure',
    explanation: 'LIFO (Last In, First Out) data structure supporting push and pop operations'
  },
  {
    id: 'queue',
    lines: ['First to join departs', 'Line moves forward patiently', 'FIFO rules all'],
    theme: 'Queue',
    concept: 'data-structure',
    explanation: 'FIFO (First In, First Out) data structure where elements are added at the rear and removed from the front'
  },
  {
    id: 'tree-traversal',
    lines: ['Root to leaf we walk', 'Pre and post and in between', 'Nodes yield their secrets'],
    theme: 'Tree Traversal',
    concept: 'algorithm',
    explanation: 'Systematic process of visiting each node in a tree data structure exactly once'
  },
  {
    id: 'lambda',
    lines: ['Anonymous function', 'Passed like data, executed', 'Closure in its heart'],
    theme: 'Lambda Functions',
    concept: 'functional',
    explanation: 'Anonymous functions that can be passed as arguments and used as values'
  },
  {
    id: 'api',
    lines: ['Interface exposed', 'Requests cross the network void', 'JSON flows both ways'],
    theme: 'APIs',
    concept: 'networking',
    explanation: 'Application Programming Interface - a contract defining how software components interact'
  },
  {
    id: 'mutex',
    lines: ['Lock before you touch', 'Mutual exclusion protects', 'Unlock when you leave'],
    theme: 'Mutex',
    concept: 'concurrency',
    explanation: 'Synchronization primitive that prevents simultaneous access to shared resources'
  },
  {
    id: 'docker',
    lines: ['Container holds the world', 'Ship the code with all its needs', 'Isolation reigns'],
    theme: 'Docker',
    concept: 'devops',
    explanation: 'Platform using OS-level virtualization to deliver software in packages called containers'
  }
];

const themeIcons: Record<string, React.ReactNode> = {
  'Recursion': <GitBranch className="w-5 h-5" />,
  'Binary Search': <SearchIcon />,
  'Promises': <Sparkles className="w-5 h-5" />,
  'Closures': <Layers className="w-5 h-5" />,
  'Garbage Collection': <Database className="w-5 h-5" />,
  'Hash Tables': <Database className="w-5 h-5" />,
  'Git Commits': <GitBranch className="w-5 h-5" />,
  'Neural Networks': <Network className="w-5 h-5" />,
  'Deadlock': <Terminal className="w-5 h-5" />,
  'Caching': <Database className="w-5 h-5" />,
  'Bubble Sort': <Code2 className="w-5 h-5" />,
  'Pointers': <Terminal className="w-5 h-5" />,
  'Regular Expressions': <Code2 className="w-5 h-5" />,
  'Stack': <Layers className="w-5 h-5" />,
  'Queue': <Layers className="w-5 h-5" />,
  'Tree Traversal': <GitBranch className="w-5 h-5" />,
  'Lambda Functions': <Code2 className="w-5 h-5" />,
  'APIs': <Network className="w-5 h-5" />,
  'Mutex': <Terminal className="w-5 h-5" />,
  'Docker': <Cpu className="w-5 h-5" />
};

function SearchIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

const conceptColors: Record<string, string> = {
  'algorithm': 'from-amber-500 to-orange-500',
  'data-structure': 'from-emerald-500 to-teal-500',
  'systems': 'from-blue-500 to-indigo-500',
  'functional': 'from-purple-500 to-pink-500',
  'async': 'from-cyan-500 to-blue-500',
  'ai': 'from-rose-500 to-pink-500',
  'concurrency': 'from-orange-500 to-red-500',
  'networking': 'from-green-500 to-emerald-500',
  'version-control': 'from-slate-500 to-gray-500',
  'parsing': 'from-violet-500 to-purple-500',
  'devops': 'from-sky-500 to-blue-500',
  'recursion': 'from-amber-500 to-yellow-500'
};

export function CodeHaikuGenerator() {
  const [currentHaiku, setCurrentHaiku] = useState<CodeHaiku>(haikuDatabase[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('code-haiku-favorites');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  const saveFavorites = useCallback((favs: Set<string>) => {
    localStorage.setItem('code-haiku-favorites', JSON.stringify([...favs]));
    setFavorites(favs);
  }, []);

  const toggleFavorite = useCallback(() => {
    const newFavs = new Set(favorites);
    if (newFavs.has(currentHaiku.id)) {
      newFavs.delete(currentHaiku.id);
    } else {
      newFavs.add(currentHaiku.id);
    }
    saveFavorites(newFavs);
  }, [favorites, currentHaiku.id, saveFavorites]);

  const generateNew = useCallback(() => {
    setIsAnimating(true);
    setShowExplanation(false);
    setTimeout(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * haikuDatabase.length);
      } while (haikuDatabase[nextIndex].id === currentHaiku.id);
      setCurrentHaiku(haikuDatabase[nextIndex]);
      setIsAnimating(false);
    }, 300);
  }, [currentHaiku.id]);

  const copyToClipboard = useCallback(() => {
    const text = currentHaiku.lines.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentHaiku.lines]);

  const gradientClass = conceptColors[currentHaiku.concept] || 'from-slate-500 to-gray-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradientClass} shadow-lg`}>
              <Terminal className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              Code Haiku
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Computer science concepts, expressed in 5-7-5
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${gradientClass} rounded-3xl blur opacity-20`} />
          
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 md:p-12 shadow-2xl">
            {/* Theme Badge */}
            <div className="flex items-center justify-between mb-8">
              <motion.div
                key={currentHaiku.theme}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradientClass} bg-opacity-10 border border-slate-700`}
              >
                <span className="text-slate-300">{themeIcons[currentHaiku.theme]}</span>
                <span className="text-sm font-medium text-slate-200">{currentHaiku.theme}</span>
              </motion.div>

              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-all ${
                  favorites.has(currentHaiku.id)
                    ? 'text-rose-400 bg-rose-400/10'
                    : 'text-slate-500 hover:text-rose-400 hover:bg-rose-400/10'
                }`}
              >
                <svg className="w-6 h-6" fill={favorites.has(currentHaiku.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Haiku Lines */}
            <div className="text-center space-y-4 mb-8">
              <AnimatePresence mode="wait">
                {!isAnimating && (
                  <motion.div
                    key={currentHaiku.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {currentHaiku.lines.map((line, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className={`text-2xl md:text-3xl font-light tracking-wide ${
                          index === 1 ? 'text-slate-100' : 'text-slate-400'
                        }`}
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Syllable Count */}
            <div className="flex justify-center gap-8 mb-8">
              {[5, 7, 5].map((count, index) => (
                <div key={index} className="text-center">
                  <span className={`text-xs font-mono ${
                    index === 1 ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {count}
                  </span>
                  <div className={`h-1 w-8 rounded-full mt-1 mx-auto bg-gradient-to-r ${gradientClass} opacity-50`} />
                </div>
              ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-300">What it means</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {currentHaiku.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={generateNew}
                disabled={isAnimating}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-gradient-to-r ${gradientClass} text-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
              >
                <Shuffle className="w-5 h-5" />
                New Haiku
              </button>

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              >
                <BookOpen className="w-5 h-5" />
                {showExplanation ? 'Hide' : 'Explain'}
              </button>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex justify-center gap-8 text-sm text-slate-500"
        >
          <div className="text-center">
            <span className="block text-2xl font-bold text-slate-300">{haikuDatabase.length}</span>
            <span>Haikus</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-slate-300">{favorites.size}</span>
            <span>Favorites</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-slate-300">
              {new Set(haikuDatabase.map(h => h.concept)).size}
            </span>
            <span>Concepts</span>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-slate-600 text-sm"
        >
          Poetry for programmers • 5-7-5 syllables • CS concepts
        </motion.p>
      </div>
    </div>
  );
}
