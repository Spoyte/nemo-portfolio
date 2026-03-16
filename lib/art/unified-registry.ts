// Unified art registry - Single source of truth for all generators
// Combines: imports, metadata, and runtime loading into one type-safe system
//
// Benefits:
// - One place to add/modify generators
// - Automatic TypeScript type generation
// - No more scattered imports across files
// - Consistent naming conventions

import { ArtGenerator, ArtCategory, ArtComplexity, ArtTag, ParamConfig } from "./core";
import { ARTWORK_METADATA, ArtworkMetadata } from "./metadata";

// ============================================================================
// GENERATOR REGISTRY ENTRY
// ============================================================================

export interface GeneratorEntry {
  id: string;
  name: string;
  description: string;
  category: ArtCategory;
  loader: () => Promise<unknown>;
  renderFnName: string;
  importName: string; // CamelCase variable name for imports
}

// ============================================================================
// CENTRAL REGISTRY - All 70+ generators
// Add new generators here following the existing pattern
// ============================================================================

export const GENERATOR_REGISTRY: GeneratorEntry[] = [
  // === MATHEMATICAL (11) ===
  {
    id: "mandelbrot-explorer",
    name: "Mandelbrot Explorer",
    description: "Infinite complexity from simple iteration - explore the boundary of the Mandelbrot set",
    category: "mathematical",
    loader: () => import("./mandelbrot-explorer"),
    renderFnName: "renderMandelbrot",
    importName: "mandelbrotExplorer",
  },
  {
    id: "julia-set",
    name: "Julia Set Explorer",
    description: "Explore Julia sets - the Mandelbrot's complex sibling with orbit visualization",
    category: "mathematical",
    loader: () => import("./julia-set"),
    renderFnName: "renderJuliaSet",
    importName: "juliaSet",
  },
  {
    id: "strange-attractor",
    name: "Strange Attractor",
    description: "Chaos theory visualization - where deterministic rules create unpredictable beauty",
    category: "mathematical",
    loader: () => import("./strange-attractor"),
    renderFnName: "renderAttractor",
    importName: "strangeAttractor",
  },
  {
    id: "lissajous-curves",
    name: "Lissajous Curves",
    description: "Harmonic motion patterns from parametric equations with interference visualization",
    category: "mathematical",
    loader: () => import("./lissajous-curves"),
    renderFnName: "renderLissajousCurves",
    importName: "lissajousCurves",
  },
  {
    id: "spirograph",
    name: "Spirograph",
    description: "Mathematical epitrochoid and hypotrochoid curves creating intricate geometric patterns",
    category: "mathematical",
    loader: () => import("./spirograph"),
    renderFnName: "renderSpirograph",
    importName: "spirograph",
  },
  {
    id: "harmonograph",
    name: "Harmonograph",
    description: "Mechanical drawing machine simulation - pendulums creating harmonic patterns",
    category: "mathematical",
    loader: () => import("./harmonograph"),
    renderFnName: "renderHarmonograph",
    importName: "harmonograph",
  },
  {
    id: "space-filling-curves",
    name: "Space-Filling Curves",
    description: "Fractal curves that visit every point in a space - from Hilbert to Peano",
    category: "mathematical",
    loader: () => import("./space-filling-curves"),
    renderFnName: "renderSpaceFillingCurves",
    importName: "spaceFillingCurves",
  },
  {
    id: "fourier-synthesis",
    name: "Fourier Synthesis",
    description: "Visualize how complex waveforms build from simple sine waves through epicycles",
    category: "mathematical",
    loader: () => import("./fourier-synthesis"),
    renderFnName: "renderFourierSynthesis",
    importName: "fourierSynthesis",
  },
  {
    id: "barnsley-fern",
    name: "Barnsley Fern",
    description: "Iterated function system generating natural fern-like fractal structures",
    category: "mathematical",
    loader: () => import("./barnsley-fern"),
    renderFnName: "renderBarnsleyFern",
    importName: "barnsleyFern",
  },
  {
    id: "chaos-game",
    name: "Chaos Game",
    description: "Random iteration producing ordered fractal patterns",
    category: "mathematical",
    loader: () => import("./chaos-game"),
    renderFnName: "renderChaosGame",
    importName: "chaosGame",
  },
  {
    id: "sierpinski-triangle",
    name: "Sierpinski Triangle",
    description: "The iconic fractal triangle — infinite complexity from simple recursive subdivision",
    category: "mathematical",
    loader: () => import("./sierpinski-triangle"),
    renderFnName: "renderSierpinski",
    importName: "sierpinskiTriangle",
  },
  {
    id: "dragon-curve",
    name: "Dragon Curve",
    description: "Paper-folding fractal — the classic Heighway dragon with recursive right-angle turns",
    category: "mathematical",
    loader: () => import("./dragon-curve"),
    renderFnName: "renderDragonCurve",
    importName: "dragonCurve",
  },
  {
    id: "cantor-set",
    name: "Cantor Set",
    description: "The dust of paradox — infinite points with zero measure, created by endlessly removing middle thirds",
    category: "mathematical",
    loader: () => import("./cantor-set"),
    renderFnName: "renderCantorSet",
    importName: "cantorSet",
  },

  // === NATURAL (11) ===
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    description: "Atmospheric light phenomenon simulation with flowing ionized particles",
    category: "natural",
    loader: () => import("./aurora-borealis"),
    renderFnName: "renderAuroraBorealis",
    importName: "auroraBorealis",
  },
  {
    id: "recursive-trees",
    name: "Recursive Trees",
    description: "Fractal branching structures - nature's recursive algorithm",
    category: "natural",
    loader: () => import("./recursive-trees"),
    renderFnName: "renderTree",
    importName: "recursiveTrees",
  },
  {
    id: "lsystem-botany",
    name: "L-System Botany",
    description: "Formal grammar systems generating plant-like structures",
    category: "natural",
    loader: () => import("./lsystem-botany"),
    renderFnName: "renderLSystem",
    importName: "lsystemBotany",
  },
  {
    id: "lsystem-fractals",
    name: "L-System Fractals",
    description: "Mathematical recursion producing organic and geometric forms",
    category: "natural",
    loader: () => import("./lsystem-fractals"),
    renderFnName: "renderLsystemFractals",
    importName: "lsystemFractals",
  },
  {
    id: "perlin-terrain",
    name: "Perlin Terrain",
    description: "Procedural landscape generation using gradient noise",
    category: "natural",
    loader: () => import("./perlin-terrain"),
    renderFnName: "renderTerrain",
    importName: "perlinTerrain",
  },
  {
    id: "dla",
    name: "DLA",
    description: "Diffusion-limited aggregation - coral-like growth patterns",
    category: "natural",
    loader: () => import("./dla"),
    renderFnName: "renderDLA",
    importName: "dla",
  },
  {
    id: "slime-mold",
    name: "Slime Mold",
    description: "Physarum simulation - emergent network optimization from simple agents",
    category: "natural",
    loader: () => import("./slime-mold"),
    renderFnName: "renderSlimeMold",
    importName: "slimeMold",
  },
  {
    id: "bioluminescent-plankton",
    name: "Bioluminescent Plankton",
    description: "Marine organisms creating light through chemical reactions",
    category: "natural",
    loader: () => import("./bioluminescent-plankton"),
    renderFnName: "renderBioluminescentPlankton",
    importName: "bioluminescentPlankton",
  },

  // === PHYSICS (16) ===
  {
    id: "wave-interference",
    name: "Wave Interference",
    description: "Constructive and destructive interference patterns from multiple wave sources",
    category: "physics",
    loader: () => import("./wave-interference"),
    renderFnName: "renderWaves",
    importName: "waveInterference",
  },
  {
    id: "orbital-mechanics",
    name: "Orbital Mechanics",
    description: "Gravitational dance of celestial bodies - n-body simulation",
    category: "physics",
    loader: () => import("./orbital-mechanics"),
    renderFnName: "renderOrbitalMechanics",
    importName: "orbitalMechanics",
  },
  {
    id: "fluid-smoke",
    name: "Fluid Smoke",
    description: "Navier-Stokes fluid dynamics simulation - turbulent smoke and flow",
    category: "physics",
    loader: () => import("./fluid-smoke"),
    renderFnName: "renderFluid",
    importName: "fluidSmoke",
  },
  {
    id: "particle-swarm",
    name: "Particle Swarm",
    description: "Emergent collective behavior from simple particle interactions",
    category: "physics",
    loader: () => import("./particle-swarm"),
    renderFnName: "renderParticleSwarm",
    importName: "particleSwarm",
  },
  {
    id: "boid-flocking",
    name: "Boid Flocking",
    description: "Craig Reynolds' flocking algorithm - separation, alignment, cohesion",
    category: "physics",
    loader: () => import("./boid-flocking"),
    renderFnName: "renderBoids",
    importName: "boidFlocking",
  },
  {
    id: "chladni-figures",
    name: "Chladni Figures",
    description: "Resonance patterns on vibrating plates - sound made visible",
    category: "physics",
    loader: () => import("./chladni-figures"),
    renderFnName: "renderChladniFigures",
    importName: "chladniFigures",
  },
  {
    id: "cymatics",
    name: "Cymatics",
    description: "Wave phenomena visualized through particle displacement",
    category: "physics",
    loader: () => import("./cymatics"),
    renderFnName: "renderCymatics",
    importName: "cymatics",
  },
  {
    id: "prism-dispersion",
    name: "Prism Dispersion",
    description: "Light refraction and spectral decomposition through optical media",
    category: "physics",
    loader: () => import("./prism-dispersion"),
    renderFnName: "renderPrismDispersion",
    importName: "prismDispersion",
  },
  {
    id: "magnetic-field",
    name: "Magnetic Field",
    description: "Visualization of electromagnetic field lines and particle trajectories",
    category: "physics",
    loader: () => import("./magnetic-field"),
    renderFnName: "renderMagneticField",
    importName: "magneticField",
  },
  {
    id: "plasma-arc",
    name: "Plasma Arc",
    description: "Electrical discharge simulation with branching lightning patterns",
    category: "physics",
    loader: () => import("./plasma-arc"),
    renderFnName: "renderPlasmaArc",
    importName: "plasmaArc",
  },
  {
    id: "wave-tank",
    name: "Wave Tank",
    description: "Shallow water wave simulation with realistic fluid dynamics",
    category: "physics",
    loader: () => import("./wave-tank"),
    renderFnName: "renderWaveTank",
    importName: "waveTank",
  },
  {
    id: "solar-flare",
    name: "Solar Flare",
    description: "Stellar magnetic reconnection and plasma ejection visualization",
    category: "physics",
    loader: () => import("./solar-flare"),
    renderFnName: "renderSolarFlare",
    importName: "solarFlare",
  },
  {
    id: "double-pendulum",
    name: "Double Pendulum",
    description: "Chaotic dynamics from simple coupled oscillators",
    category: "physics",
    loader: () => import("./double-pendulum"),
    renderFnName: "renderDoublePendulum",
    importName: "doublePendulum",
  },
  {
    id: "n-body-gravity",
    name: "N-Body Gravity",
    description: "Gravitational interactions between multiple massive bodies",
    category: "physics",
    loader: () => import("./n-body-gravity"),
    renderFnName: "renderNBodyGravity",
    importName: "nBodyGravity",
  },

  // === GEOMETRIC (14) ===
  {
    id: "breathing-mandala",
    name: "Breathing Mandala",
    description: "Meditative mandala synchronized with a 4-second breath cycle — inhale as it expands, exhale as it contracts",
    category: "geometric",
    loader: () => import("./breathing-mandala"),
    renderFnName: "breathingMandala",
    importName: "breathingMandala",
  },
  {
    id: "geometric-mandala",
    name: "Geometric Mandala",
    description: "Sacred geometry patterns with radial symmetry",
    category: "geometric",
    loader: () => import("./geometric-mandala"),
    renderFnName: "renderMandala",
    importName: "geometricMandala",
  },
  {
    id: "kaleidoscope",
    name: "Kaleidoscope",
    description: "Mirror symmetry creating infinite pattern variations",
    category: "geometric",
    loader: () => import("./kaleidoscope-symmetry"),
    renderFnName: "renderKaleidoscope",
    importName: "kaleidoscope",
  },
  {
    id: "islamic-patterns",
    name: "Islamic Patterns",
    description: "Traditional geometric art from Islamic mathematical heritage",
    category: "geometric",
    loader: () => import("./islamic-patterns"),
    renderFnName: "renderIslamicPatterns",
    importName: "islamicPatterns",
  },
  {
    id: "voronoi-organic",
    name: "Voronoi Organic",
    description: "Natural tessellation patterns from nearest-neighbor regions",
    category: "geometric",
    loader: () => import("./voronoi-organic"),
    renderFnName: "renderVoronoi",
    importName: "voronoiOrganic",
  },
  {
    id: "voronoi-tessellation",
    name: "Voronoi Tessellation",
    description: "Organic Voronoi diagrams inspired by nature — cracked earth, foam bubbles, leaf veins, giraffe patterns",
    category: "geometric",
    loader: () => import("./voronoi-tessellation"),
    renderFnName: "renderVoronoiTessellation",
    importName: "voronoiTessellation",
  },
  {
    id: "string-art",
    name: "String Art",
    description: "Thread wound between pins creating mathematical curves",
    category: "geometric",
    loader: () => import("./string-art"),
    renderFnName: "renderStringArt",
    importName: "stringArt",
  },
  {
    id: "phyllotaxis",
    name: "Phyllotaxis",
    description: "Golden angle spiral patterns found in plant growth",
    category: "geometric",
    loader: () => import("./phyllotaxis"),
    renderFnName: "renderPhyllotaxis",
    importName: "phyllotaxis",
  },
  {
    id: "moire-pattern",
    name: "Moiré Pattern",
    description: "Interference patterns from overlapping grids",
    category: "geometric",
    loader: () => import("./moire-pattern"),
    renderFnName: "renderMoirePattern",
    importName: "moirePattern",
  },
  {
    id: "origami-tessellation",
    name: "Origami Tessellation",
    description: "Folded paper patterns creating 3D relief from 2D sheets",
    category: "geometric",
    loader: () => import("./origami-tessellation"),
    renderFnName: "renderOrigamiTessellation",
    importName: "origamiTessellation",
  },
  {
    id: "kaleidoscope-chamber",
    name: "Kaleidoscope Chamber",
    description: "Immersive mirrored room with infinite reflections",
    category: "geometric",
    loader: () => import("./kaleidoscope-chamber"),
    renderFnName: "renderKaleidoscopeChamber",
    importName: "kaleidoscopeChamber",
  },
  {
    id: "penrose-tiling",
    name: "Penrose Tiling",
    description: "Aperiodic tiling patterns with five-fold symmetry",
    category: "geometric",
    loader: () => import("./penrose-tiling"),
    renderFnName: "renderPenroseTiling",
    importName: "penroseTiling",
  },
  {
    id: "sacred-geometry",
    name: "Sacred Geometry",
    description: "Ancient symbolic patterns from mathematical ratios",
    category: "geometric",
    loader: () => import("./sacred-geometry"),
    renderFnName: "renderSacredGeometry",
    importName: "sacredGeometry",
  },

  // === ABSTRACT (14) ===
  {
    id: "impossible-geometry",
    name: "Impossible Geometry",
    description: "Escher-inspired illusions and paradoxical structures",
    category: "abstract",
    loader: () => import("./impossible-geometry"),
    renderFnName: "renderImpossibleGeometry",
    importName: "impossibleGeometry",
  },
  {
    id: "metaballs",
    name: "Metaballs",
    description: "Organic blob shapes from implicit surface functions",
    category: "abstract",
    loader: () => import("./metaballs"),
    renderFnName: "renderMetaballs",
    importName: "metaballs",
  },
  {
    id: "flow-field",
    name: "Flow Field",
    description: "Perlin noise vector fields guiding particle trails",
    category: "abstract",
    loader: () => import("./flow-field"),
    renderFnName: "renderFlowField",
    importName: "flowField",
  },
  {
    id: "gray-scott-diffusion",
    name: "Gray-Scott Diffusion",
    description: "True Gray-Scott reaction-diffusion simulation - coral growth, spots, stripes, and labyrinth patterns from chemical morphogenesis",
    category: "abstract",
    loader: () => import("./gray-scott-diffusion"),
    renderFnName: "renderGrayScottDiffusion",
    importName: "grayScottDiffusion",
  },
  {
    id: "cellular-automata",
    name: "Cellular Automata",
    description: "Discrete computational systems - Conway's Game of Life and beyond",
    category: "abstract",
    loader: () => import("./cellular-automata"),
    renderFnName: "renderCellularAutomata",
    importName: "cellularAutomata",
  },
  {
    id: "quantum-field",
    name: "Quantum Field",
    description: "Probability wave visualization and quantum fluctuations",
    category: "abstract",
    loader: () => import("./quantum-field"),
    renderFnName: "renderQuantumField",
    importName: "quantumField",
  },
  {
    id: "fractal-flame",
    name: "Fractal Flame",
    description: "Iterated function systems creating organic fractal imagery",
    category: "abstract",
    loader: () => import("./fractal-flame"),
    renderFnName: "renderFractalFlame",
    importName: "fractalFlame",
  },
  {
    id: "neural-dreams",
    name: "Neural Dreams",
    description: "Activation patterns from artificial neural networks",
    category: "abstract",
    loader: () => import("./neural-dreams"),
    renderFnName: "renderNeuralDreams",
    importName: "neuralDreams",
  },
  {
    id: "turing-patterns",
    name: "Turing Patterns",
    description: "Reaction-diffusion systems generating organic patterns",
    category: "abstract",
    loader: () => import("./turing-patterns"),
    renderFnName: "renderTuringPatterns",
    importName: "turingPatterns",
  },
  {
    id: "lenia",
    name: "Lenia",
    description: "Continuous cellular automata with smooth transitions",
    category: "abstract",
    loader: () => import("./lenia"),
    renderFnName: "renderLenia",
    importName: "lenia",
  },
  {
    id: "multi-scale-turing",
    name: "Multi-Scale Turing Patterns",
    description: "Nested reaction-diffusion patterns at multiple scales — the mathematics behind animal coat patterns",
    category: "abstract",
    loader: () => import("./multi-scale-turing"),
    renderFnName: "renderMultiScaleTuring",
    importName: "multiScaleTuring",
  },
  {
    id: "self-organizing-map",
    name: "Self-Organizing Map",
    description: "Neural network learning topology-preserving representations",
    category: "abstract",
    loader: () => import("./self-organizing-map"),
    renderFnName: "renderSelfOrganizingMap",
    importName: "selfOrganizingMap",
  },
  {
    id: "langtons-ant",
    name: "Langton's Ant",
    description: "Emergent highways from simple rules - a 2D Turing machine on a grid",
    category: "abstract",
    loader: () => import("./langtons-ant"),
    renderFnName: "renderLangtonsAnt",
    importName: "langtonsAnt",
  },

  // === TRADITIONAL (9) ===
  {
    id: "digital-weave",
    name: "Digital Weave",
    description: "Textile patterns from interlacing warp and weft threads",
    category: "traditional",
    loader: () => import("./digital-weave"),
    renderFnName: "renderDigitalWeave",
    importName: "digitalWeave",
  },
  {
    id: "stained-glass",
    name: "Stained Glass",
    description: "Lead came framing colored glass with light transmission",
    category: "traditional",
    loader: () => import("./stained-glass"),
    renderFnName: "renderStainedGlass",
    importName: "stainedGlass",
  },
  {
    id: "watercolor-dreams",
    name: "Watercolor Dreams",
    description: "Pigment diffusion and paper texture simulation",
    category: "traditional",
    loader: () => import("./watercolor-dreams"),
    renderFnName: "renderWatercolorDreams",
    importName: "watercolorDreams",
  },
  {
    id: "ascii-art",
    name: "ASCII Art",
    description: "Text-based imagery from character density patterns",
    category: "traditional",
    loader: () => import("./ascii-art"),
    renderFnName: "renderAsciiArt",
    importName: "asciiArt",
  },
  {
    id: "cross-hatching",
    name: "Cross-Hatching",
    description: "Classical drawing technique with intersecting parallel lines",
    category: "traditional",
    loader: () => import("./cross-hatching"),
    renderFnName: "renderCrossHatching",
    importName: "crossHatching",
  },
  {
    id: "weaving-loom",
    name: "Weaving Loom",
    description: "Simulated textile weaving with warp and weft threads creating intricate fabric patterns",
    category: "traditional",
    loader: () => import("./weaving-loom"),
    renderFnName: "renderWeavingLoom",
    importName: "weavingLoom",
  },
  {
    id: "ink-diffusion",
    name: "Ink Diffusion",
    description: "Ink drops spreading through water creating organic Rorschach-like patterns inspired by sumi-e painting",
    category: "traditional",
    loader: () => import("./ink-diffusion"),
    renderFnName: "renderInkDiffusion",
    importName: "inkDiffusion",
  },
  {
    id: "paper-marbling",
    name: "Paper Marbling",
    description: "Traditional Ebru art simulation - floating pigments creating organic swirling patterns on water, transferred to paper",
    category: "traditional",
    loader: () => import("./paper-marbling"),
    renderFnName: "renderPaperMarbling",
    importName: "paperMarbling",
  },
  {
    id: "stippled-portraits",
    name: "Stippled Portraits",
    description: "Procedural pointillism creating detailed portraits from thousands of tiny dots - traditional stippling art through density fields",
    category: "traditional",
    loader: () => import("./stippled-portraits"),
    renderFnName: "create",
    importName: "stippledPortraits",
  },

  // === TEXT (5) ===
  {
    id: "kinetic-typography",
    name: "Kinetic Typography",
    description: "Animated text with motion dynamics and rhythmic expression",
    category: "text",
    loader: () => import("./kinetic-typography"),
    renderFnName: "renderKineticTypography",
    importName: "kineticTypography",
  },
  {
    id: "poetry-rain",
    name: "Poetry Rain",
    description: "Matrix-style cascading text with lyrical, code, and symbolic content streams",
    category: "text",
    loader: () => import("./poetry-rain"),
    renderFnName: "renderPoetryRain",
    importName: "poetryRain",
  },

  // === 3D (9) ===
  {
    id: "light-caverns",
    name: "Light Caverns",
    description: "Raymarched volumetric lighting through cavernous spaces",
    category: "3d",
    loader: () => import("./light-caverns"),
    renderFnName: "renderLightCaverns",
    importName: "lightCaverns",
  },
  {
    id: "polyhedral-sculptures",
    name: "Polyhedral Sculptures",
    description: "Platonic and Archimedean solids in 3D projection",
    category: "3d",
    loader: () => import("./polyhedral-sculptures"),
    renderFnName: "renderPolyhedralSculptures",
    importName: "polyhedralSculptures",
  },
  {
    id: "crystal-lattice",
    name: "Crystal Lattice",
    description: "Atomic arrangements and crystalline structures in 3D",
    category: "3d",
    loader: () => import("./crystal-lattice"),
    renderFnName: "renderCrystalLattice",
    importName: "crystalLattice",
  },
  {
    id: "sdf-sculptor",
    name: "SDF Sculptor",
    description: "Raymarched 3D sculptures using signed distance fields — infinite mathematical forms rendered through sphere tracing",
    category: "3d",
    loader: () => import("./sdf-sculptor"),
    renderFnName: "renderSDFSculptor",
    importName: "sdfSculptor",
  },
  {
    id: "volumetric-mist",
    name: "Volumetric Mist",
    description: "Ray-marched atmospheric fog with dynamic volumetric lighting and participating media simulation",
    category: "3d",
    loader: () => import("./volumetric-mist"),
    renderFnName: "generateVolumetricMist",
    importName: "volumetricMist",
  },

  // === INTERACTIVE (10) ===
  {
    id: "floating-letters",
    name: "Floating Letters",
    description: "Interactive physics-based text — letters float and respond to mouse with magnetic forces, particle trails, and satisfying momentum",
    category: "interactive",
    loader: () => import("./floating-letters"),
    renderFnName: "generateKineticTypography",
    importName: "floatingLetters",
  },
  {
    id: "audio-reactive-waves",
    name: "Audio Reactive Waves",
    description: "Sound-reactive waveform visualization with frequency spectrum analysis and multiple visualization modes",
    category: "interactive",
    loader: () => import("./audio-reactive-waves"),
    renderFnName: "create",
    importName: "audioReactiveWaves",
  },
  {
    id: "particle-network",
    name: "Particle Network",
    description: "Connected nodes forming dynamic mesh structures",
    category: "interactive",
    loader: () => import("./particle-network"),
    renderFnName: "renderParticleNetwork",
    importName: "particleNetwork",
  },
  {
    id: "frequency-visualizer",
    name: "Frequency Visualizer",
    description: "Audio spectrum analysis and waveform visualization",
    category: "interactive",
    loader: () => import("./frequency-visualizer"),
    renderFnName: "renderFrequencyVisualizer",
    importName: "frequencyVisualizer",
  },
  {
    id: "topographic-flow",
    name: "Topographic Flow",
    description: "Contour line animation following terrain gradients",
    category: "interactive",
    loader: () => import("./topographic-flow"),
    renderFnName: "renderTopographicFlow",
    importName: "topographicFlow",
  },
  {
    id: "abelian-sandpile",
    name: "Abelian Sandpile",
    description: "Self-organized criticality in cellular automata",
    category: "interactive",
    loader: () => import("./abelian-sandpile"),
    renderFnName: "renderAbelianSandpile",
    importName: "abelianSandpile",
  },
  {
    id: "magnetic-poetry",
    name: "Magnetic Poetry",
    description: "Interactive physics-based word magnets - drag words to compose poetry with satisfying momentum",
    category: "interactive",
    loader: () => import("./magnetic-poetry"),
    renderFnName: "generate",
    importName: "magneticPoetry",
  },
  {
    id: "kinetic-sculpture",
    name: "Kinetic Sculpture",
    description: "Interactive 3D text sculpture — words float in space, responding to your touch, forming ephemeral poetry structures",
    category: "interactive",
    loader: () => import("./kinetic-sculpture"),
    renderFnName: "renderKineticSculpture",
    importName: "kineticSculpture",
  },

  // === TEXT (5) ===
  {
    id: "poetry-visualizer",
    name: "Poetry Visualizer",
    description: "Transform text into flowing visual poetry - words become particles that dance and flow through space",
    category: "text",
    loader: () => import("./poetry-visualizer"),
    renderFnName: "generate",
    importName: "poetryVisualizer",
  },
  {
    id: "code-garden",
    name: "Code Garden",
    description: "Organic growth of code syntax as digital flora — watch programming languages bloom into living gardens",
    category: "text",
    loader: () => import("./code-garden"),
    renderFnName: "renderCodeGarden",
    importName: "codeGarden",
  },
  {
    id: "calligraphy-brush",
    name: "Calligraphy Brush",
    description: "Procedural East Asian calligraphy simulation with ink physics, brush pressure, and flying white effects",
    category: "text",
    loader: () => import("./calligraphy-brush"),
    renderFnName: "generate",
    importName: "calligraphyBrush",
  },
];

// ============================================================================
// DERIVED CONSTANTS
// ============================================================================

export const TOTAL_GENERATORS = GENERATOR_REGISTRY.length;

export const GENERATOR_IDS = GENERATOR_REGISTRY.map((g) => g.id);

export const CATEGORIES = [...new Set(GENERATOR_REGISTRY.map((g) => g.category))];

// ============================================================================
// LOOKUP FUNCTIONS
// ============================================================================

export function getGeneratorEntry(id: string): GeneratorEntry | undefined {
  return GENERATOR_REGISTRY.find((g) => g.id === id);
}

export function getGeneratorIdsByCategory(category: ArtCategory): string[] {
  return GENERATOR_REGISTRY.filter((g) => g.category === category).map((g) => g.id);
}

export function getGeneratorsByCategory(category: ArtCategory): GeneratorEntry[] {
  return GENERATOR_REGISTRY.filter((g) => g.category === category);
}

export function getCategoryStats(): Record<string, number> {
  return GENERATOR_REGISTRY.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getGeneratorMetadata(id: string): ArtworkMetadata | undefined {
  return ARTWORK_METADATA[id];
}

// ============================================================================
// DYNAMIC LOADING
// ============================================================================

export interface LoadedGenerator {
  id: string;
  entry: GeneratorEntry;
  renderFn: (ctx: CanvasRenderingContext2D, params: Record<string, unknown>, time?: number) => void;
  defaultParams?: Record<string, unknown>;
}

export async function loadGenerator(id: string): Promise<LoadedGenerator | null> {
  const entry = getGeneratorEntry(id);
  if (!entry) return null;

  try {
    const module = (await entry.loader()) as Record<string, unknown>;
    const renderFn = module[entry.renderFnName] as (
      ctx: CanvasRenderingContext2D,
      params: Record<string, unknown>,
      time?: number
    ) => void;

    if (!renderFn) {
      console.error(`Render function ${entry.renderFnName} not found in ${id}`);
      return null;
    }

    // Try to find default params (common export patterns)
    const defaultParams =
      (module.defaultParams as Record<string, unknown>) ||
      (module[`${entry.importName}DefaultParams`] as Record<string, unknown>) ||
      (module[`${entry.id.replace(/-/g, "")}DefaultParams`] as Record<string, unknown>);

    return {
      id,
      entry,
      renderFn,
      defaultParams,
    };
  } catch (err) {
    console.error(`Failed to load generator ${id}:`, err);
    return null;
  }
}

// ============================================================================
// TYPE GENERATION HELPERS
// ============================================================================

export type GeneratorId = (typeof GENERATOR_REGISTRY)[number]["id"];

export function isValidGeneratorId(id: string): id is GeneratorId {
  return GENERATOR_IDS.includes(id);
}

// ============================================================================
// CODE GENERATION (single source of truth)
// ============================================================================

// Category display order for generated code
const CATEGORY_ORDER = [
  'mathematical', 'natural', 'physics', 'geometric',
  'abstract', 'traditional', 'text', '3d', 'interactive'
] as const;

/**
 * Get generators grouped by category in display order
 * Single source of truth for category ordering
 */
export function getGeneratorsGroupedByCategory(): Map<string, GeneratorEntry[]> {
  const groups = new Map<string, GeneratorEntry[]>();

  // Initialize in preferred order
  for (const cat of CATEGORY_ORDER) {
    groups.set(cat, []);
  }

  // Populate groups
  for (const entry of GENERATOR_REGISTRY) {
    const existing = groups.get(entry.category) || [];
    existing.push(entry);
    groups.set(entry.category, existing);
  }

  // Remove empty categories
  for (const [cat, items] of groups) {
    if (items.length === 0) {
      groups.delete(cat);
    }
  }

  return groups;
}

/**
 * Generate complete index.ts content
 * This is the single source of truth for index generation
 */
export function generateIndexContent(): string {
  const groups = getGeneratorsGroupedByCategory();

  const lines: string[] = [
    '// Auto-generated from unified-registry.ts',
    '// Do not edit manually - run: node scripts/generate-art-index.ts',
    '',
    'import { ArtGenerator } from "./core";',
    'import { ARTWORK_METADATA } from "./metadata";',
    'import {',
    '  GENERATOR_REGISTRY,',
    '  GeneratorId,',
    '  getGeneratorEntry,',
    '  getGeneratorIdsByCategory,',
    '  getCategoryStats,',
    '  loadGenerator,',
    '  validateRegistry,',
    '} from "./unified-registry";',
    '',
    '// Re-export core types',
    'export * from "./core";',
    'export * from "./metadata";',
    'export * from "./statistics";',
    '',
    '// Re-export registry system',
    'export {',
    '  GENERATOR_REGISTRY,',
    '  type GeneratorId,',
    '  type GeneratorEntry,',
    '  type LoadedGenerator,',
    '  getGeneratorEntry,',
    '  getGeneratorIdsByCategory,',
    '  getGeneratorsByCategory,',
    '  getCategoryStats,',
    '  getGeneratorMetadata,',
    '  loadGenerator,',
    '  validateRegistry,',
    '  isValidGeneratorId,',
    '  TOTAL_GENERATORS,',
    '  GENERATOR_IDS,',
    '  CATEGORIES,',
    '} from "./unified-registry";',
    '',
    '// ============================================================================',
    '// STATIC IMPORTS - Eagerly loaded generators',
    '// Auto-generated from unified-registry.ts',
    '// ============================================================================',
    '',
  ];

  // Generate imports grouped by category
  for (const [category, items] of groups) {
    lines.push(`// === ${category.toUpperCase()} (${items.length}) ===`);
    for (const entry of items) {
      lines.push(`import { ${entry.importName} } from "./${entry.id}";`);
    }
    lines.push('');
  }

  lines.push('// ============================================================================');
  lines.push('// GENERATORS MAP - Connects IDs to implementations');
  lines.push('// ============================================================================');
  lines.push('');
  lines.push('const rawGenerators: Record<string, ArtGenerator> = {');
  lines.push('');

  // Generate the map
  for (const [category, items] of groups) {
    lines.push(`  // === ${category.toUpperCase()} ===`);
    for (const entry of items) {
      lines.push(`  "${entry.id}": ${entry.importName},`);
    }
    lines.push('');
  }

  lines.push('};');
  lines.push('');
  lines.push('// Apply metadata to generators');
  lines.push('export const artGenerators: Record<string, ArtGenerator> = {};');
  lines.push('');
  lines.push('Object.entries(rawGenerators).forEach(([id, generator]) => {');
  lines.push('  artGenerators[id] = {');
  lines.push('    ...generator,');
  lines.push('    meta: ARTWORK_METADATA[id] || {');
  lines.push('      category: "abstract",');
  lines.push('      complexity: "moderate",');
  lines.push('      tags: [],');
  lines.push('      created: "2024-01-01",');
  lines.push('    },');
  lines.push('  };');
  lines.push('});');
  lines.push('');
  lines.push('// ============================================================================');
  lines.push('// CONVENIENCE EXPORTS');
  lines.push('// ============================================================================');
  lines.push('');
  lines.push('/** Get a generator by ID */');
  lines.push('export function getGenerator(id: string): ArtGenerator | undefined {');
  lines.push('  return artGenerators[id];');
  lines.push('}');
  lines.push('');
  lines.push('/** Get all generator IDs */');
  lines.push('export function getAllGeneratorIds(): string[] {');
  lines.push('  return Object.keys(artGenerators);');
  lines.push('}');
  lines.push('');
  lines.push('/** Check if a generator exists */');
  lines.push('export function hasGenerator(id: string): boolean {');
  lines.push('  return id in artGenerators;');
  lines.push('}');
  lines.push('');
  lines.push('// ============================================================================');
  lines.push('// VALIDATION (run at module init in development)');
  lines.push('// ============================================================================');
  lines.push('');
  lines.push('if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {');
  lines.push('  const validation = validateRegistry();');
  lines.push('  if (!validation.valid) {');
  lines.push('    console.warn("[art/index] Registry validation issues:", validation);');
  lines.push('  }');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  missingFromMetadata: string[];
  missingFromRegistry: string[];
  mismatchedCategories: { id: string; registry: string; metadata: string }[];
}

export function validateRegistry(): ValidationResult {
  const registryIds = new Set(GENERATOR_IDS);
  const metadataIds = new Set(Object.keys(ARTWORK_METADATA));

  const missingFromMetadata = GENERATOR_IDS.filter((id) => !metadataIds.has(id));
  const missingFromRegistry = Object.keys(ARTWORK_METADATA).filter((id) => !registryIds.has(id));

  const mismatchedCategories: { id: string; registry: string; metadata: string }[] = [];

  GENERATOR_REGISTRY.forEach((entry) => {
    const meta = ARTWORK_METADATA[entry.id];
    if (meta && meta.category !== entry.category) {
      mismatchedCategories.push({
        id: entry.id,
        registry: entry.category,
        metadata: meta.category,
      });
    }
  });

  return {
    valid: missingFromMetadata.length === 0 && missingFromRegistry.length === 0 && mismatchedCategories.length === 0,
    missingFromMetadata,
    missingFromRegistry,
    mismatchedCategories,
  };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example: Get all generators in a category
 * ```ts
 * const physicsIds = getGeneratorIdsByCategory('physics');
 * // ['wave-interference', 'orbital-mechanics', ...]
 * ```
 *
 * Example: Load a generator dynamically
 * ```ts
 * const generator = await loadGenerator('strange-attractor');
 * if (generator) {
 *   generator.renderFn(ctx, { scale: 1.5 }, time);
 * }
 * ```
 *
 * Example: Validate registry consistency
 * ```ts
 * const validation = validateRegistry();
 * if (!validation.valid) {
 *   console.error('Missing from metadata:', validation.missingFromMetadata);
 * }
 * ```
 */
