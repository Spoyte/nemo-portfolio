#!/usr/bin/env node
/**
 * Batch HTML Generator for Art Algorithms
 * 
 * Creates standalone HTML files for algorithms that exist in lib/art/
 * but are missing from public/art/.
 * 
 * Usage:
 *   node scripts/batch-html-generator.js              # Generate all missing
 *   node scripts/batch-html-generator.js --dry-run    # Preview what would be created
 *   node scripts/batch-html-generator.js <name>       # Generate specific algorithm
 */

const fs = require('fs');
const path = require('path');

const LIB_DIR = path.join(__dirname, '..', 'lib', 'art');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'art');

// Core utilities that should be embedded in each HTML file
const CORE_UTILS = `
// Seeded Random Number Generator
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  
  // Linear Congruential Generator
  random() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
  
  // Random between min and max
  range(min, max) {
    return min + this.random() * (max - min);
  }
  
  // Random integer
  rangeInt(min, max) {
    return Math.floor(this.range(min, max + 1));
  }
  
  // Random choice from array
  choice(arr) {
    return arr[Math.floor(this.random() * arr.length)];
  }
}

// Simplex Noise implementation for seeded noise
function createSeededNoise(seed) {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  
  // Initialize permutation table
  for (let i = 0; i < 256; i++) p[i] = i;
  
  // Shuffle with seed
  const rng = new SeededRandom(seed);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  
  const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                 [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                 [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
  
  function dot(g, x, y) {
    return g[0]*x + g[1]*y;
  }
  
  return function(x, y) {
    let n0, n1, n2;
    
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    
    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; }
    else { i1 = 0; j1 = 1; }
    
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;
    
    const ii = i & 255;
    const jj = j & 255;
    
    let gi0 = perm[ii + perm[jj]] % 12;
    let gi1 = perm[ii + i1 + perm[jj + j1]] % 12;
    let gi2 = perm[ii + 1 + perm[jj + 1]] % 12;
    
    let t0 = 0.5 - x0*x0 - y0*y0;
    if (t0 < 0) n0 = 0.0;
    else {
      t0 *= t0;
      n0 = t0 * t0 * dot(grad3[gi0], x0, y0);
    }
    
    let t1 = 0.5 - x1*x1 - y1*y1;
    if (t1 < 0) n1 = 0.0;
    else {
      t1 *= t1;
      n1 = t1 * t1 * dot(grad3[gi1], x1, y1);
    }
    
    let t2 = 0.5 - x2*x2 - y2*y2;
    if (t2 < 0) n2 = 0.0;
    else {
      t2 *= t2;
      n2 = t2 * t2 * dot(grad3[gi2], x2, y2);
    }
    
    return 70.0 * (n0 + n1 + n2);
  };
}

function generateSeed() {
  return Math.floor(Math.random() * 10000) + 1;
}

function fillCanvas(ctx, color, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}
`;

// HTML template for standalone art pages
function generateHTML(name, displayName, description, category) {
  const categoryColors = {
    mathematical: '#00d4ff',
    natural: '#00ff88',
    physics: '#ff6b6b',
    geometric: '#ffd93d',
    abstract: '#c084fc',
    traditional: '#f4a261',
    '3d': '#6bcf7f',
    text: '#ff9f43',
    interactive: '#ff6b9d'
  };
  
  const accentColor = categoryColors[category] || '#888';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName} — Generative Art</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #05050a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
    }
    canvas {
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      border: 1px solid #1a1a2e;
    }
    .controls {
      margin-top: 20px;
      color: #888;
      font-size: 14px;
      text-align: center;
    }
    .param-controls {
      margin-top: 16px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      color: #666;
      font-size: 12px;
    }
    .param-controls label {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #0f0f1a;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #1a1a2e;
    }
    .param-controls input[type="range"] {
      width: 80px;
      accent-color: ${accentColor};
    }
    .param-controls select {
      background: #1a1a2a;
      color: #888;
      border: 1px solid #333;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .buttons {
      margin-top: 16px;
      display: flex;
      gap: 12px;
    }
    button {
      background: #0f0f1a;
      color: #888;
      border: 1px solid #1a1a2e;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    }
    button:hover {
      background: #1a1a2a;
      color: #aaa;
      border-color: ${accentColor};
    }
    .category-badge {
      display: inline-block;
      background: ${accentColor}20;
      color: ${accentColor};
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-left: 8px;
    }
  </style>
</head>
<body>
  <canvas id="art" width="600" height="600"></canvas>
  <div class="controls">
    ${displayName}
    <span class="category-badge">${category}</span>
    <br><small>${description}</small>
  </div>
  <div class="param-controls" id="params">
    <!-- Parameters will be injected here -->
  </div>
  <div class="buttons">
    <button onclick="regenerate()">Regenerate</button>
    <button onclick="download()">Download</button>
    <button onclick="toggleAnimation()">Pause/Play</button>
  </div>

  <script>
${CORE_UTILS}

// Algorithm-specific implementation
// NOTE: This is a template. The actual algorithm code should be copied from lib/art/${name}.ts
// and adapted to work in a standalone browser environment.

let animationId = null;
let isAnimating = true;
let time = 0;
let currentSeed = generateSeed();

// Default parameters - override these based on the algorithm
const defaultParams = {
  seed: currentSeed,
  // Add algorithm-specific parameters here
};

let params = { ...defaultParams };

function generate(ctx, p, t = 0) {
  const canvas = ctx.canvas;
  
  // TODO: Implement ${name} algorithm here
  // Reference: lib/art/${name}.ts
  
  fillCanvas(ctx, '#0a0a0a', canvas.width, canvas.height);
  
  // Placeholder: Draw a pattern indicating this needs implementation
  ctx.fillStyle = '#1a1a2e';
  ctx.font = '14px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('${displayName}', canvas.width/2, canvas.height/2 - 20);
  ctx.fillText('Template generated — needs implementation', canvas.width/2, canvas.height/2 + 10);
  ctx.font = '12px system-ui';
  ctx.fillStyle = '#333';
  ctx.fillText('Copy algorithm from lib/art/${name}.ts', canvas.width/2, canvas.height/2 + 35);
}

function render() {
  const canvas = document.getElementById('art');
  const ctx = canvas.getContext('2d');
  generate(ctx, params, time);
}

function animate() {
  if (!isAnimating) return;
  time += 16;
  render();
  animationId = requestAnimationFrame(animate);
}

function regenerate() {
  currentSeed = generateSeed();
  params.seed = currentSeed;
  time = 0;
  render();
}

function download() {
  const canvas = document.getElementById('art');
  const link = document.createElement('a');
  link.download = '${name}-' + Date.now() + '.png';
  link.href = canvas.toDataURL();
  link.click();
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  if (isAnimating) {
    animate();
  } else if (animationId) {
    cancelAnimationFrame(animationId);
  }
}

// Initialize
render();
animate();
  </script>
</body>
</html>
`;
}

// Parse TypeScript file to extract metadata
function parseAlgorithmFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract name from export const name = "..." or name: "..."
  const nameMatch = content.match(/name:\s*"([^"]+)"/) || 
                    content.match(/export\s+const\s+\w+:\s*ArtGenerator\s*=\s*{[^}]*name:\s*"([^"]+)"/s);
  
  // Extract description
  const descMatch = content.match(/description:\s*"([^"]+)"/);
  
  // Extract category
  const categoryMatch = content.match(/category:\s*"([^"]+)"/);
  
  // Extract params
  const paramsMatch = content.match(/params:\s*{([^}]+(?:{[^}]+}[^}]*)*)}/s);
  
  return {
    name: nameMatch ? nameMatch[1] : path.basename(filePath, '.ts'),
    description: descMatch ? descMatch[1] : 'Generative art algorithm',
    category: categoryMatch ? categoryMatch[1] : 'abstract',
    hasParams: !!paramsMatch,
    content: content
  };
}

// Get list of algorithms missing HTML files
function getMissingAlgorithms() {
  const tsFiles = fs.readdirSync(LIB_DIR)
    .filter(f => f.endsWith('.ts'))
    .filter(f => !['core.ts', 'metadata.ts', 'statistics.ts', 'unified-registry.ts', 'index.ts', 'config.ts', 'seeded-random.ts'].includes(f))
    .filter(f => !f.includes('-thumb'))  // Skip thumbnail files
    .filter(f => !f.includes('-generator'))  // Skip generator wrappers
    .map(f => ({
      file: f,
      name: f.replace('.ts', '')
    }));
  
  const htmlFiles = fs.existsSync(PUBLIC_DIR) 
    ? fs.readdirSync(PUBLIC_DIR).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''))
    : [];
  
  return tsFiles.filter(({ name }) => !htmlFiles.includes(name));
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const specificName = args.find(a => !a.startsWith('--'));
  
  if (specificName) {
    // Generate specific algorithm
    const filePath = path.join(LIB_DIR, `${specificName}.ts`);
    if (!fs.existsSync(filePath)) {
      console.error(`Algorithm not found: ${specificName}`);
      process.exit(1);
    }
    
    const meta = parseAlgorithmFile(filePath);
    const html = generateHTML(specificName, meta.name, meta.description, meta.category);
    
    if (dryRun) {
      console.log(`Would create: public/art/${specificName}.html`);
      console.log(`  Title: ${meta.name}`);
      console.log(`  Category: ${meta.category}`);
      console.log(`  Description: ${meta.description}`);
    } else {
      const outputPath = path.join(PUBLIC_DIR, `${specificName}.html`);
      fs.writeFileSync(outputPath, html);
      console.log(`✅ Created: ${outputPath}`);
    }
    return;
  }
  
  // Batch generate all missing
  const missing = getMissingAlgorithms();
  
  console.log(`Found ${missing.length} algorithms missing HTML files\n`);
  
  if (missing.length === 0) {
    console.log('✨ All algorithms have standalone HTML files!');
    return;
  }
  
  if (dryRun) {
    console.log('Dry run — would create:\n');
    missing.forEach(({ name, file }) => {
      const meta = parseAlgorithmFile(path.join(LIB_DIR, file));
      console.log(`  ${name}.html`);
      console.log(`    Title: ${meta.name}`);
      console.log(`    Category: ${meta.category}`);
      console.log('');
    });
    return;
  }
  
  // Generate all missing files
  let created = 0;
  let errors = 0;
  
  missing.forEach(({ name, file }) => {
    try {
      const meta = parseAlgorithmFile(path.join(LIB_DIR, file));
      const html = generateHTML(name, meta.name, meta.description, meta.category);
      const outputPath = path.join(PUBLIC_DIR, `${name}.html`);
      fs.writeFileSync(outputPath, html);
      console.log(`✅ ${name}.html (${meta.category})`);
      created++;
    } catch (err) {
      console.error(`❌ ${name}: ${err.message}`);
      errors++;
    }
  });
  
  console.log(`\n${created} files created, ${errors} errors`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review generated templates in public/art/`);
  console.log(`  2. Copy algorithm implementations from lib/art/*.ts`);
  console.log(`  3. Adapt TypeScript to vanilla JavaScript`);
  console.log(`  4. Test each generated file in browser`);
}

main();
