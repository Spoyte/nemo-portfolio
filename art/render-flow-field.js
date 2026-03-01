const { createCanvas } = require('canvas');
const fs = require('fs');

// Simple Perlin Noise implementation
class PerlinNoise {
    constructor(seed = Math.random()) {
        this.perm = new Uint8Array(512);
        this.p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) this.p[i] = i;
        
        // Seeded shuffle
        let s = seed * 2147483647;
        for (let i = 255; i > 0; i--) {
            s = (s * 16807) % 2147483647;
            const n = s % (i + 1);
            [this.p[i], this.p[n]] = [this.p[n], this.p[i]];
        }
        for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255];
    }
    
    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(t, a, b) { return a + t * (b - a); }
    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    
    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = this.fade(x);
        const v = this.fade(y);
        const A = this.perm[X] + Y, B = this.perm[X + 1] + Y;
        return this.lerp(v, 
            this.lerp(u, this.grad(this.perm[A], x, y), this.grad(this.perm[B], x - 1, y)),
            this.lerp(u, this.grad(this.perm[A + 1], x, y - 1), this.grad(this.perm[B + 1], x - 1, y - 1))
        );
    }
}

// Configuration
const size = 1200;
const config = {
    scale: 0.003,
    step: 2,
    numParticles: 2000,
    maxSteps: 200,
    lineWidth: 0.6,
    opacity: 0.06
};

// Color palettes
const palettes = [
    // Aurora - greens and purples
    [
        { h: 140, s: 80, l: 60 },
        { h: 160, s: 90, l: 50 },
        { h: 280, s: 70, l: 55 },
        { h: 320, s: 60, l: 50 }
    ],
    // Sunset - oranges and pinks
    [
        { h: 20, s: 90, l: 60 },
        { h: 340, s: 80, l: 55 },
        { h: 10, s: 85, l: 65 },
        { h: 30, s: 75, l: 50 }
    ],
    // Ocean - blues and teals
    [
        { h: 200, s: 80, l: 50 },
        { h: 180, s: 70, l: 55 },
        { h: 220, s: 75, l: 45 },
        { h: 190, s: 85, l: 60 }
    ],
    // Ember - reds and oranges
    [
        { h: 10, s: 90, l: 55 },
        { h: 30, s: 85, l: 50 },
        { h: 0, s: 80, l: 45 },
        { h: 45, s: 70, l: 55 }
    ]
];

function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function draw() {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const noise = new PerlinNoise(42); // Fixed seed for reproducibility
    
    // Dark background
    ctx.fillStyle = '#080810';
    ctx.fillRect(0, 0, size, size);
    
    // Radial gradient background
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size);
    gradient.addColorStop(0, '#0a0a18');
    gradient.addColorStop(1, '#050508');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Select palette
    const palette = palettes[0]; // Aurora palette
    
    function getFlowAngle(x, y) {
        const n = noise.noise(x * config.scale, y * config.scale);
        return n * Math.PI * 4;
    }
    
    function lerpColor(c1, c2, t) {
        return {
            h: c1.h + (c2.h - c1.h) * t,
            s: c1.s + (c2.s - c1.s) * t,
            l: c1.l + (c2.l - c1.l) * t
        };
    }
    
    // Create particles
    const particles = [];
    for (let i = 0; i < config.numParticles; i++) {
        particles.push({
            x: Math.random() * size,
            y: Math.random() * size,
            color: palette[Math.floor(Math.random() * palette.length)],
            life: 50 + Math.random() * (config.maxSteps - 50)
        });
    }
    
    // Draw flow lines
    particles.forEach((p, idx) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        
        let x = p.x;
        let y = p.y;
        let steps = 0;
        
        while (steps < p.life && x >= 0 && x < size && y >= 0 && y < size) {
            const angle = getFlowAngle(x, y);
            x += Math.cos(angle) * config.step;
            y += Math.sin(angle) * config.step;
            ctx.lineTo(x, y);
            steps++;
        }
        
        // Color variation
        const colorPos = (p.x / size + p.y / size + idx / config.numParticles) / 3;
        const c1 = palette[Math.floor(colorPos * palette.length) % palette.length];
        const c2 = palette[(Math.floor(colorPos * palette.length) + 1) % palette.length];
        const finalColor = lerpColor(c1, c2, (colorPos * palette.length) % 1);
        
        const [r, g, b] = hslToRgb(finalColor.h, finalColor.s, finalColor.l);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${config.opacity})`;
        ctx.lineWidth = config.lineWidth + Math.random() * 0.4;
        ctx.stroke();
    });
    
    // Add seed points
    particles.slice(0, 300).forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1 + Math.random() * 2, 0, Math.PI * 2);
        const [r, g, b] = hslToRgb(p.color.h, p.color.s, Math.min(100, p.color.l + 20));
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
        ctx.fill();
    });
    
    // Save
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('/root/.openclaw/workspace/art/flow-field-traces.png', buffer);
    console.log('Saved: flow-field-traces.png');
}

draw();
