export type Category = 'nature' | 'physics' | 'mathematics' | 'geometry' | 'interactive';
export type Status = 'implemented' | 'planned' | 'archived';

export interface Artwork {
  id: string;
  title: string;
  category: Category;
  description: string;
  tags: string[];
  status: Status;
  createdAt?: string;
  complexity: 1 | 2 | 3 | 4 | 5;
  thumbnail?: string;
}

// Ground truth: actually implemented pieces
export const artworks: Artwork[] = [
  // Nature (6)
  {
    id: 'aurora-borealis',
    title: 'Aurora Borealis',
    category: 'nature',
    description: 'Flowing particle simulation mimicking the northern lights',
    tags: ['particles', 'flow', 'atmospheric', 'glow'],
    status: 'implemented',
    createdAt: '2026-02-24',
    complexity: 3,
  },
  {
    id: 'bioluminescent-plankton',
    title: 'Bioluminescent Plankton',
    category: 'nature',
    description: 'Reactive particle system simulating glowing ocean organisms',
    tags: ['particles', 'reactive', 'glow', 'ocean'],
    status: 'implemented',
    createdAt: '2026-02-24',
    complexity: 3,
  },
  {
    id: 'constraint-garden',
    title: 'Constraint Garden',
    category: 'nature',
    description: 'Wave Function Collapse for coherent tile patterns',
    tags: ['wfc', 'constraint-solving', 'patterns', 'procedural'],
    status: 'implemented',
    createdAt: '2026-03-15',
    complexity: 4,
  },
  {
    id: 'lenia',
    title: 'Lenia',
    category: 'nature',
    description: 'Continuous cellular automata with smooth life-like behaviors',
    tags: ['cellular-automata', 'continuous', 'emergent'],
    status: 'implemented',
    createdAt: '2026-02-25',
    complexity: 4,
  },
  {
    id: 'physarum-network',
    title: 'Physarum Network',
    category: 'nature',
    description: 'Slime mold simulation creating organic network patterns',
    tags: ['agent-based', 'networks', 'emergent', 'optimization'],
    status: 'implemented',
    createdAt: '2026-02-25',
    complexity: 4,
  },
  {
    id: 'turing-patterns',
    title: 'Turing Patterns',
    category: 'nature',
    description: 'Reaction-diffusion system generating organic textures',
    tags: ['reaction-diffusion', 'patterns', 'mathematical-biology'],
    status: 'implemented',
    createdAt: '2026-02-24',
    complexity: 3,
  },

  // Physics (2)
  {
    id: 'flow-field',
    title: 'Flow Field',
    category: 'physics',
    description: 'Perlin noise vector field with particle traces',
    tags: ['particles', 'noise', 'vectors', 'trails'],
    status: 'implemented',
    createdAt: '2026-02-24',
    complexity: 2,
  },
  {
    id: 'moire-pattern',
    title: 'Moire Pattern',
    category: 'physics',
    description: 'Interference patterns from overlapping geometric grids',
    tags: ['interference', 'optical', 'geometric', 'interactive'],
    status: 'implemented',
    createdAt: '2026-02-25',
    complexity: 2,
  },

  // Mathematics (2)
  {
    id: 'light-caverns',
    title: 'Light Caverns',
    category: 'mathematics',
    description: 'Recursive subdivision creating luminous cave-like structures',
    tags: ['recursive', 'subdivision', 'lighting', 'procedural'],
    status: 'implemented',
    createdAt: '2026-02-26',
    complexity: 3,
  },
  {
    id: 'multi-scale-turing',
    title: 'Multi-Scale Turing',
    category: 'mathematics',
    description: 'Layered reaction-diffusion at multiple scales',
    tags: ['reaction-diffusion', 'multi-scale', 'patterns', 'complex'],
    status: 'implemented',
    createdAt: '2026-02-26',
    complexity: 4,
  },

  // Geometry (1)
  {
    id: 'breathing-mandala',
    title: 'Breathing Mandala',
    category: 'geometry',
    description: 'Geometric patterns with rhythmic expansion and contraction',
    tags: ['mandala', 'symmetry', 'rhythm', 'geometric'],
    status: 'implemented',
    createdAt: '2026-02-24',
    complexity: 2,
  },

  // Interactive (1)
  {
    id: 'polyrhythm-sequencer',
    title: 'Polyrhythm Sequencer',
    category: 'interactive',
    description: 'Visual and audible polyrhythm pattern generator',
    tags: ['audio', 'interactive', 'rhythm', 'music'],
    status: 'implemented',
    createdAt: '2026-02-25',
    complexity: 3,
  },
];

// Planned pieces (not yet implemented)
export const plannedArtworks: Artwork[] = [
  {
    id: 'morphing-core',
    title: 'Morphing Core',
    category: 'geometry',
    description: 'WebGL SDF raymarching with morphing shapes',
    tags: ['webgl', 'sdf', 'raymarching', '3d', 'shaders'],
    status: 'planned',
    complexity: 5,
  },
  {
    id: 'strange-attractors',
    title: 'Strange Attractors',
    category: 'mathematics',
    description: 'Chaotic attractors: Lorenz, Rossler, Aizawa, Thomas',
    tags: ['chaos', 'attractors', 'mathematics', '3d'],
    status: 'planned',
    complexity: 3,
  },
  {
    id: 'flocking-boids',
    title: 'Flocking Boids',
    category: 'nature',
    description: 'Reynolds boids algorithm with predator avoidance',
    tags: ['agents', 'flocking', 'emergent', 'craig-reynolds'],
    status: 'planned',
    complexity: 3,
  },
  {
    id: 'l-systems',
    title: 'L-Systems',
    category: 'nature',
    description: 'Lindenmayer systems for plant growth simulation',
    tags: ['grammar', 'recursive', 'plants', 'fractals'],
    status: 'planned',
    complexity: 3,
  },
];

// Actually implemented pieces (ground truth)
export const implementedArtworks: Artwork[] = [
  // ... artworks array above contains all implemented pieces
];

// Stats computed from ground truth
export const portfolioStats = {
  totalImplemented: artworks.filter(a => a.status === 'implemented').length,
  totalPlanned: plannedArtworks.length,
  byCategory: {
    nature: artworks.filter(a => a.category === 'nature').length,
    physics: artworks.filter(a => a.category === 'physics').length,
    mathematics: artworks.filter(a => a.category === 'mathematics').length,
    geometry: artworks.filter(a => a.category === 'geometry').length,
    interactive: artworks.filter(a => a.category === 'interactive').length,
  },
  byComplexity: {
    1: artworks.filter(a => a.complexity === 1).length,
    2: artworks.filter(a => a.complexity === 2).length,
    3: artworks.filter(a => a.complexity === 3).length,
    4: artworks.filter(a => a.complexity === 4).length,
    5: artworks.filter(a => a.complexity === 5).length,
  },
};

// Helper functions
export const getArtworkById = (id: string): Artwork | undefined =>
  artworks.find(a => a.id === id);

export const getArtworksByCategory = (category: Category): Artwork[] =>
  artworks.filter(a => a.category === category);

export const getArtworksByTag = (tag: string): Artwork[] =>
  artworks.filter(a => a.tags.includes(tag));

export const getImplementedIds = (): string[] =>
  artworks.filter(a => a.status === 'implemented').map(a => a.id);
