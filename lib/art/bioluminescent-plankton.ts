import type { Artwork, ArtworkParams, ArtContext } from "./core";

export interface PlanktonParams extends ArtworkParams {
  populationSize: number;      // 50-300 organisms
  mutationRate: number;        // 0.01-0.3 chance of mutation
  selectionPressure: number;   // 0.1-1.0 how strongly fitness selects
  glowIntensity: number;       // 0.3-2.0 brightness multiplier
  speed: number;               // 0.1-2.0 movement speed
  trailPersistence: number;    // 0.01-0.3 how long trails last
  colorScheme: "deep-ocean" | "aurora" | "coral" | "midnight" | "toxic";
  enableEvolution: boolean;    // toggle genetic algorithm
  foodRegeneration: number;    // 1-10 food spawn rate
}

export const bioluminescentPlanktonDefaultParams: PlanktonParams = {
  populationSize: 150,
  mutationRate: 0.08,
  selectionPressure: 0.6,
  glowIntensity: 1.2,
  speed: 1.0,
  trailPersistence: 0.08,
  colorScheme: "deep-ocean",
  enableEvolution: true,
  foodRegeneration: 5,
};

// Color schemes for different ocean moods
const COLOR_SCHEMES: Record<string, { bg: string; hues: number[]; sat: number; light: number }> = {
  "deep-ocean": { bg: "#000510", hues: [180, 200, 220], sat: 80, light: 60 },
  "aurora": { bg: "#0a0a1a", hues: [120, 160, 280, 320], sat: 70, light: 65 },
  "coral": { bg: "#1a0a10", hues: [340, 20, 40, 60], sat: 75, light: 55 },
  "midnight": { bg: "#050508", hues: [240, 260, 280], sat: 60, light: 50 },
  "toxic": { bg: "#0a1a0a", hues: [80, 100, 120], sat: 90, light: 70 },
};

// Gene encoding for plankton traits
interface Genome {
  size: number;           // 2-8 radius
  hue: number;            // 0-360
  glow: number;           // 0.5-2.0
  speedFactor: number;    // 0.5-1.5
  sensorRange: number;    // 20-100
  wobbleFreq: number;     // 0.001-0.01
  wobbleAmp: number;      // 0.1-0.5
  trailDecay: number;     // 0.9-0.99
}

interface Plankton {
  x: number;
  y: number;
  vx: number;
  vy: number;
  genome: Genome;
  energy: number;
  age: number;
  fitness: number;
  trail: { x: number; y: number; age: number }[];
}

interface Food {
  x: number;
  y: number;
  energy: number;
  pulse: number;
}

// Create random genome
function randomGenome(): Genome {
  return {
    size: 2 + Math.random() * 6,
    hue: Math.random() * 360,
    glow: 0.5 + Math.random() * 1.5,
    speedFactor: 0.5 + Math.random(),
    sensorRange: 20 + Math.random() * 80,
    wobbleFreq: 0.001 + Math.random() * 0.009,
    wobbleAmp: 0.1 + Math.random() * 0.4,
    trailDecay: 0.9 + Math.random() * 0.09,
  };
}

// Mutate a genome
function mutateGenome(genome: Genome, mutationRate: number): Genome {
  const mutate = (val: number, min: number, max: number, scale: number = 0.1) => {
    if (Math.random() > mutationRate) return val;
    const delta = (Math.random() - 0.5) * scale * (max - min);
    return Math.max(min, Math.min(max, val + delta));
  };

  return {
    size: mutate(genome.size, 2, 8, 0.15),
    hue: (genome.hue + (Math.random() < mutationRate ? (Math.random() - 0.5) * 60 : 0) + 360) % 360,
    glow: mutate(genome.glow, 0.5, 2.0, 0.2),
    speedFactor: mutate(genome.speedFactor, 0.5, 1.5, 0.15),
    sensorRange: mutate(genome.sensorRange, 20, 100, 0.2),
    wobbleFreq: mutate(genome.wobbleFreq, 0.001, 0.01, 0.2),
    wobbleAmp: mutate(genome.wobbleAmp, 0.1, 0.5, 0.15),
    trailDecay: mutate(genome.trailDecay, 0.9, 0.99, 0.05),
  };
}

// Crossover between two genomes
function crossoverGenome(parent1: Genome, parent2: Genome): Genome {
  const pick = <T>(a: T, b: T): T => Math.random() < 0.5 ? a : b;
  return {
    size: pick(parent1.size, parent2.size),
    hue: pick(parent1.hue, parent2.hue),
    glow: pick(parent1.glow, parent2.glow),
    speedFactor: pick(parent1.speedFactor, parent2.speedFactor),
    sensorRange: pick(parent1.sensorRange, parent2.sensorRange),
    wobbleFreq: pick(parent1.wobbleFreq, parent2.wobbleFreq),
    wobbleAmp: pick(parent1.wobbleAmp, parent2.wobbleAmp),
    trailDecay: pick(parent1.trailDecay, parent2.trailDecay),
  };
}

export function renderBioluminescentPlankton(
  ctx: CanvasRenderingContext2D,
  context: ArtContext,
  params: PlanktonParams
): void {
  const { width, height, time } = context;
  const colors = COLOR_SCHEMES[params.colorScheme];

  // Initialize persistent state
  if (!(context as any).planktonState) {
    (context as any).planktonState = {
      plankton: [] as Plankton[],
      food: [] as Food[],
      generation: 1,
      avgFitness: 0,
      genePool: [] as Genome[],
    };
  }
  const state = (context as any).planktonState;

  // Initialize population on first frame
  if (state.plankton.length === 0) {
    for (let i = 0; i < params.populationSize; i++) {
      state.plankton.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        genome: randomGenome(),
        energy: 50 + Math.random() * 50,
        age: 0,
        fitness: 0,
        trail: [],
      });
    }
  }

  // Clear with fade for trail effect
  ctx.fillStyle = colors.bg + Math.floor(params.trailPersistence * 255).toString(16).padStart(2, '0');
  ctx.fillRect(0, 0, width, height);

  // Spawn food
  if (Math.random() < params.foodRegeneration * 0.01) {
    state.food.push({
      x: Math.random() * width,
      y: Math.random() * height,
      energy: 20 + Math.random() * 30,
      pulse: Math.random() * Math.PI * 2,
    });
  }
  // Limit food
  if (state.food.length > 30) state.food.shift();

  // Update and render food
  state.food = state.food.filter((f: Food) => f.energy > 0);
  state.food.forEach((f: Food) => {
    f.pulse += 0.05;
    const pulseSize = 2 + Math.sin(f.pulse) * 1;
    const alpha = 0.3 + Math.sin(f.pulse) * 0.2;
    
    ctx.beginPath();
    ctx.arc(f.x, f.y, pulseSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 255, 200, ${alpha})`;
    ctx.fill();
  });

  // Process plankton
  const survivors: Plankton[] = [];
  let totalFitness = 0;

  state.plankton.forEach((p: Plankton) => {
    // Age and energy decay
    p.age += 1;
    p.energy -= 0.1;

    // Find nearest food
    let nearestFood: Food | null = null;
    let nearestDist = Infinity;
    state.food.forEach((f: Food) => {
      const dx = f.x - p.x;
      const dy = f.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < p.genome.sensorRange && dist < nearestDist) {
        nearestDist = dist;
        nearestFood = f;
      }
    });

    // Movement with wobble
    const wobble = Math.sin(time * p.genome.wobbleFreq + p.age * 0.01) * p.genome.wobbleAmp;
    
    if (nearestFood) {
      // Move toward food
      const dx = nearestFood.x - p.x;
      const dy = nearestFood.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      p.vx += (dx / dist) * 0.1 * params.speed;
      p.vy += (dy / dist) * 0.1 * params.speed;
      
      // Eat food
      if (dist < p.genome.size + 3) {
        p.energy += nearestFood.energy * 0.5;
        nearestFood.energy = 0;
      }
    } else {
      // Random wandering with wobble
      p.vx += (Math.random() - 0.5) * 0.1 + Math.cos(wobble) * 0.05;
      p.vy += (Math.random() - 0.5) * 0.1 + Math.sin(wobble) * 0.05;
    }

    // Apply speed factor from genome
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    const maxSpeed = 2 * p.genome.speedFactor * params.speed;
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed;
      p.vy = (p.vy / speed) * maxSpeed;
    }

    // Update position
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Add to trail
    p.trail.push({ x: p.x, y: p.y, age: 0 });
    if (p.trail.length > 20) p.trail.shift();
    p.trail.forEach((t) => { t.age += 1; });
    p.trail = p.trail.filter((t) => t.age < 20);

    // Calculate fitness (energy + age bonus)
    p.fitness = p.energy + p.age * 0.01;
    totalFitness += p.fitness;

    // Survival check
    if (p.energy > 0) {
      survivors.push(p);
    }

    // Render trail
    if (p.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(p.trail[0].x, p.trail[0].y);
      for (let i = 1; i < p.trail.length; i++) {
        ctx.lineTo(p.trail[i].x, p.trail[i].y);
      }
      const trailAlpha = (p.energy / 100) * 0.3 * params.glowIntensity;
      ctx.strokeStyle = `hsla(${p.genome.hue}, ${colors.sat}%, ${colors.light}%, ${trailAlpha})`;
      ctx.lineWidth = p.genome.size * 0.3;
      ctx.stroke();
    }

    // Render plankton body with glow
    const glowSize = p.genome.size * p.genome.glow * params.glowIntensity;
    const alpha = Math.min(1, p.energy / 50);

    // Outer glow
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize * 2);
    gradient.addColorStop(0, `hsla(${p.genome.hue}, ${colors.sat}%, ${colors.light + 20}%, ${alpha})`);
    gradient.addColorStop(0.5, `hsla(${p.genome.hue}, ${colors.sat}%, ${colors.light}%, ${alpha * 0.5})`);
    gradient.addColorStop(1, `hsla(${p.genome.hue}, ${colors.sat}%, ${colors.light}%, 0)`);
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, glowSize * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Core body
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.genome.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.genome.hue}, ${colors.sat}%, ${colors.light + 30}%, ${alpha})`;
    ctx.fill();

    // Inner highlight
    ctx.beginPath();
    ctx.arc(p.x - p.genome.size * 0.3, p.y - p.genome.size * 0.3, p.genome.size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.genome.hue}, ${colors.sat}%, 90%, ${alpha * 0.8})`;
    ctx.fill();
  });

  // Evolution step
  if (params.enableEvolution && survivors.length > 0) {
    state.avgFitness = totalFitness / state.plankton.length;

    // Need to repopulate?
    if (survivors.length < params.populationSize * 0.7) {
      state.generation += 1;
      
      // Sort by fitness and select parents
      survivors.sort((a: Plankton, b: Plankton) => b.fitness - a.fitness);
      const parentCount = Math.max(2, Math.floor(survivors.length * params.selectionPressure));
      const parents = survivors.slice(0, parentCount);

      // Create new generation
      const newPlankton: Plankton[] = [...survivors];
      
      while (newPlankton.length < params.populationSize) {
        // Tournament selection or random from parents
        const parent1 = parents[Math.floor(Math.random() * parents.length)];
        const parent2 = parents[Math.floor(Math.random() * parents.length)];
        
        // Crossover and mutation
        const childGenome = mutateGenome(
          crossoverGenome(parent1.genome, parent2.genome),
          params.mutationRate
        );

        newPlankton.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          genome: childGenome,
          energy: 50 + Math.random() * 50,
          age: 0,
          fitness: 0,
          trail: [],
        });
      }

      state.plankton = newPlankton;
    } else {
      state.plankton = survivors;
    }
  } else {
    state.plankton = survivors;
    
    // Repopulate if too few and evolution disabled
    while (state.plankton.length < params.populationSize) {
      state.plankton.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        genome: randomGenome(),
        energy: 50 + Math.random() * 50,
        age: 0,
        fitness: 0,
        trail: [],
      });
    }
  }

  // Render generation info
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "12px monospace";
  ctx.fillText(`Gen: ${state.generation} | Pop: ${state.plankton.length} | Avg Fit: ${state.avgFitness.toFixed(1)}`, 10, height - 10);
}

export const bioluminescentPlankton: Artwork = {
  id: "bioluminescent-plankton",
  name: "Bioluminescent Plankton",
  description: "Genetic algorithm simulation of evolving bioluminescent organisms. Plankton with varying traits compete for food, reproduce with mutation, and adapt over generations.",
  category: "nature",
  params: bioluminescentPlanktonDefaultParams,
  paramConfig: {
    populationSize: { min: 50, max: 300, step: 10, label: "Population" },
    mutationRate: { min: 0.01, max: 0.3, step: 0.01, label: "Mutation Rate" },
    selectionPressure: { min: 0.1, max: 1.0, step: 0.05, label: "Selection" },
    glowIntensity: { min: 0.3, max: 2.0, step: 0.1, label: "Glow" },
    speed: { min: 0.1, max: 2.0, step: 0.1, label: "Speed" },
    trailPersistence: { min: 0.01, max: 0.3, step: 0.01, label: "Trails" },
    colorScheme: {
      options: ["deep-ocean", "aurora", "coral", "midnight", "toxic"],
      label: "Theme",
    },
    enableEvolution: { type: "boolean", label: "Evolution" },
    foodRegeneration: { min: 1, max: 10, step: 1, label: "Food Rate" },
  },
  render: renderBioluminescentPlankton,
};
