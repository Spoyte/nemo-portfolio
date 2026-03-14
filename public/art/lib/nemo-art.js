/**
 * NEMO ART FRAMEWORK v1.0
 * 
 * Standardized patterns for generative art pieces:
 * - Consistent canvas sizing (600x600 default)
 * - Unified color palette system
 * - Standard UI controls pattern
 * - Export functionality
 * - Animation loop utilities
 */

// ============================================================================
// COLOR PALETTE SYSTEM
// ============================================================================

const PALETTES = {
  // Core palette - deep space with accent colors
  cosmos: {
    bg: '#05050a',
    surface: '#0f0f1a',
    border: '#1a1a2e',
    text: '#888',
    textMuted: '#666',
    accent: '#c084fc',
    accentGlow: '#c084fc40'
  },
  
  // Warm palette - fire, energy
  inferno: {
    bg: '#0a0505',
    surface: '#1a0f0f',
    border: '#2e1a1a',
    text: '#a88',
    textMuted: '#866',
    accent: '#ff6b35',
    accentGlow: '#ff6b3540'
  },
  
  // Cool palette - water, ice
  glacier: {
    bg: '#050a0a',
    surface: '#0f1a1a',
    border: '#1a2e2e',
    text: '#8aa',
    textMuted: '#688',
    accent: '#4ecdc4',
    accentGlow: '#4ecdc440'
  },
  
  // Nature palette - growth, organic
  organic: {
    bg: '#050a05',
    surface: '#0f1a0f',
    border: '#1a2e1a',
    text: '#8a8',
    textMuted: '#686',
    accent: '#7cb342',
    accentGlow: '#7cb34240'
  }
};

// Gradient presets for common visual effects
const GRADIENTS = {
  rainbow: ['#ff6b6b', '#f9ca24', '#6c5ce7', '#00d2d3', '#ff9ff3', '#54a0ff'],
  fire: ['#2d0a0a', '#6b1a1a', '#c0392b', '#e67e22', '#f1c40f', '#fff5e6'],
  ocean: ['#001f3f', '#003366', '#0074d9', '#39cccc', '#7fdbff', '#e0f7ff'],
  aurora: ['#0a0a1a', '#1a0a2e', '#2d1b4e', '#5b2c6f', '#8e44ad', '#a569bd'],
  monochrome: ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff']
};

// ============================================================================
// CANVAS UTILITIES
// ============================================================================

/**
 * Create a high-DPI canvas with proper scaling
 */
function createCanvas(width = 600, height = 600, parent = document.body) {
  const canvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  parent.appendChild(canvas);
  
  return { canvas, ctx, width, height, dpr };
}

/**
 * Clear canvas with optional fade effect
 */
function clearCanvas(ctx, width, height, fade = 0) {
  if (fade > 0) {
    ctx.fillStyle = `rgba(5, 5, 10, ${fade})`;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }
}

// ============================================================================
// ANIMATION LOOP
// ============================================================================

class AnimationLoop {
  constructor(renderFn, options = {}) {
    this.renderFn = renderFn;
    this.fps = options.fps || 60;
    this.running = false;
    this.frameId = null;
    this.lastTime = 0;
    this.frameCount = 0;
    this.startTime = performance.now();
  }
  
  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }
  
  stop() {
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
  
  loop() {
    if (!this.running) return;
    
    const now = performance.now();
    const elapsed = now - this.lastTime;
    const interval = 1000 / this.fps;
    
    if (elapsed >= interval) {
      this.lastTime = now - (elapsed % interval);
      this.frameCount++;
      
      const time = (now - this.startTime) / 1000;
      this.renderFn(time, this.frameCount);
    }
    
    this.frameId = requestAnimationFrame(() => this.loop());
  }
  
  toggle() {
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
    return this.running;
  }
}

// ============================================================================
// UI CONTROLS
// ============================================================================

/**
 * Create a standardized control panel
 */
function createControlPanel(options = {}) {
  const container = document.createElement('div');
  container.className = 'param-controls';
  
  const palette = PALETTES[options.palette || 'cosmos'];
  
  // Apply styles
  container.style.cssText = `
    margin-top: 16px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    color: ${palette.textMuted};
    font-size: 12px;
  `;
  
  return { container, palette };
}

/**
 * Create a slider control
 */
function createSlider(label, min, max, value, step = 1, onChange) {
  const wrapper = document.createElement('label');
  wrapper.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0f0f1a;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #1a1a2e;
  `;
  
  const span = document.createElement('span');
  span.textContent = label;
  
  const input = document.createElement('input');
  input.type = 'range';
  input.min = min;
  input.max = max;
  input.value = value;
  input.step = step;
  input.style.width = '80px';
  input.style.accentColor = '#c084fc';
  
  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = value;
  valueDisplay.style.minWidth = '30px';
  valueDisplay.style.color = '#888';
  
  input.addEventListener('input', (e) => {
    valueDisplay.textContent = e.target.value;
    onChange(parseFloat(e.target.value));
  });
  
  wrapper.appendChild(span);
  wrapper.appendChild(input);
  wrapper.appendChild(valueDisplay);
  
  return { wrapper, input, valueDisplay };
}

/**
 * Create a select dropdown
 */
function createSelect(label, options, value, onChange) {
  const wrapper = document.createElement('label');
  wrapper.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0f0f1a;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #1a1a2e;
  `;
  
  const span = document.createElement('span');
  span.textContent = label;
  
  const select = document.createElement('select');
  select.style.cssText = `
    background: #1a1a2a;
    color: #888;
    border: 1px solid #333;
    padding: 4px 8px;
    border-radius: 4px;
  `;
  
  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = typeof opt === 'object' ? opt.value : opt;
    option.textContent = typeof opt === 'object' ? opt.label : opt;
    if (option.value === value) option.selected = true;
    select.appendChild(option);
  });
  
  select.addEventListener('change', (e) => onChange(e.target.value));
  
  wrapper.appendChild(span);
  wrapper.appendChild(select);
  
  return { wrapper, select };
}

/**
 * Create action buttons
 */
function createButton(text, onClick, variant = 'default') {
  const button = document.createElement('button');
  button.textContent = text;
  
  const variants = {
    default: `
      background: #0f0f1a;
      color: #888;
      border: 1px solid #1a1a2e;
    `,
    primary: `
      background: #c084fc20;
      color: #c084fc;
      border: 1px solid #c084fc40;
    `,
    danger: `
      background: #ff6b6b20;
      color: #ff6b6b;
      border: 1px solid #ff6b6b40;
    `
  };
  
  button.style.cssText = variants[variant] + `
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
  `;
  
  button.addEventListener('mouseenter', () => {
    button.style.filter = 'brightness(1.2)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.filter = 'brightness(1)';
  });
  
  button.addEventListener('click', onClick);
  
  return button;
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Export canvas as PNG
 */
function exportCanvas(canvas, filename = 'art') {
  const link = document.createElement('a');
  link.download = `${filename}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Export canvas as JPG
 */
function exportCanvasJPG(canvas, filename = 'art', quality = 0.9) {
  const link = document.createElement('a');
  link.download = `${filename}-${Date.now()}.jpg`;
  link.href = canvas.toDataURL('image/jpeg', quality);
  link.click();
}

// ============================================================================
// MATH UTILITIES
// ============================================================================

const MATH = {
  // Linear interpolation
  lerp: (a, b, t) => a + (b - a) * t,
  
  // Clamp value between min and max
  clamp: (val, min, max) => Math.max(min, Math.min(max, val)),
  
  // Map value from one range to another
  map: (val, inMin, inMax, outMin, outMax) => 
    outMin + (outMax - outMin) * ((val - inMin) / (inMax - inMin)),
  
  // Random float between min and max
  random: (min = 0, max = 1) => Math.random() * (max - min) + min,
  
  // Random integer between min and max (inclusive)
  randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  
  // Distance between two points
  dist: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  
  // Angle between two points
  angle: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),
  
  // Degrees to radians
  rad: (deg) => deg * Math.PI / 180,
  
  // Radians to degrees
  deg: (rad) => rad * 180 / Math.PI,
  
  // Wrap angle to -PI to PI
  wrapAngle: (angle) => {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  }
};

// ============================================================================
// NOISE UTILITIES (Simplex-like)
// ============================================================================

class SimplexNoise {
  constructor(seed = Math.random()) {
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) this.p[i] = i;
    
    // Shuffle with seed
    let s = seed * 2147483647;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
    }
    
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255];
  }
  
  noise2D(x, y) {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    
    let n0, n1, n2;
    
    let s = (x + y) * F2;
    let i = Math.floor(x + s);
    let j = Math.floor(y + s);
    let t = (i + j) * G2;
    
    let X0 = i - t;
    let Y0 = j - t;
    let x0 = x - X0;
    let y0 = y - Y0;
    
    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; }
    else { i1 = 0; j1 = 1; }
    
    let x1 = x0 - i1 + G2;
    let y1 = y0 - j1 + G2;
    let x2 = x0 - 1 + 2 * G2;
    let y2 = y0 - 1 + 2 * G2;
    
    let ii = i & 255;
    let jj = j & 255;
    
    let gi0 = this.perm[ii + this.perm[jj]] % 12;
    let gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
    let gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
    
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0;
    else { t0 *= t0; n0 = t0 * t0 * this.dot2(gi0, x0, y0); }
    
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0;
    else { t1 *= t1; n1 = t1 * t1 * this.dot2(gi1, x1, y1); }
    
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0;
    else { t2 *= t2; n2 = t2 * t2 * this.dot2(gi2, x2, y2); }
    
    return 70 * (n0 + n1 + n2);
  }
  
  dot2(i, x, y) {
    const grad = [
      [1, 1], [-1, 1], [1, -1], [-1, -1],
      [1, 0], [-1, 0], [1, 0], [-1, 0],
      [0, 1], [0, -1], [0, 1], [0, -1]
    ];
    return grad[i][0] * x + grad[i][1] * y;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PALETTES, GRADIENTS, AnimationLoop, SimplexNoise, MATH, createCanvas, clearCanvas, createSlider, createSelect, createButton, exportCanvas };
}
