#!/usr/bin/env node
/**
 * Reaction-Diffusion (Gray-Scott Model)
 * 
 * Creates organic, nature-like patterns similar to:
 * - Animal coat patterns (zebra, leopard, giraffe)
 * - Coral growth
 * - Chemical reactions (Belousov-Zhabotinsky)
 * 
 * Based on Alan Turing's 1952 paper on morphogenesis.
 */

const fs = require('fs');
const path = require('path');

// Canvas size
const WIDTH = 800;
const HEIGHT = 800;

// Gray-Scott parameters
const F = 0.0545;  // Feed rate
const K = 0.062;   // Kill rate
const Du = 0.16;   // Diffusion rate for U
const Dv = 0.08;   // Diffusion rate for V
const dt = 1.0;    // Time step

// Initialize grids
let U = new Float32Array(WIDTH * HEIGHT);
let V = new Float32Array(WIDTH * HEIGHT);
let U_next = new Float32Array(WIDTH * HEIGHT);
let V_next = new Float32Array(WIDTH * HEIGHT);

// Initialize with uniform U and small V perturbations
for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
        const i = y * WIDTH + x;
        U[i] = 1.0;
        V[i] = 0.0;
    }
}

// Seed with random perturbations in center
const seedRadius = 20;
const cx = Math.floor(WIDTH / 2);
const cy = Math.floor(HEIGHT / 2);
for (let y = cy - seedRadius; y < cy + seedRadius; y++) {
    for (let x = cx - seedRadius; x < cx + seedRadius; x++) {
        if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
            const dx = x - cx;
            const dy = y - cy;
            if (dx * dx + dy * dy < seedRadius * seedRadius) {
                const i = y * WIDTH + x;
                U[i] = 0.5 + Math.random() * 0.1;
                V[i] = 0.25 + Math.random() * 0.1;
            }
        }
    }
}

// Helper to get value with wrap-around
function get(U, x, y) {
    x = (x + WIDTH) % WIDTH;
    y = (y + HEIGHT) % HEIGHT;
    return U[y * WIDTH + x];
}

// Laplacian using 9-point stencil for better stability
function laplacian(U, x, y) {
    const center = get(U, x, y);
    const sum = (
        0.05 * get(U, x - 1, y - 1) +
        0.2  * get(U, x,     y - 1) +
        0.05 * get(U, x + 1, y - 1) +
        0.2  * get(U, x - 1, y)     +
        0.2  * get(U, x + 1, y)     +
        0.05 * get(U, x - 1, y + 1) +
        0.2  * get(U, x,     y + 1) +
        0.05 * get(U, x + 1, y + 1)
    );
    return sum - center;
}

// Simulation steps
const STEPS = 8000;

console.log(`Running Gray-Scott reaction-diffusion simulation...`);
console.log(`Parameters: F=${F}, K=${K}, Du=${Du}, Dv=${Dv}`);
console.log(`Resolution: ${WIDTH}x${HEIGHT}, Steps: ${STEPS}`);

for (let step = 0; step < STEPS; step++) {
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const i = y * WIDTH + x;
            const u = U[i];
            const v = V[i];
            
            // Reaction term: U + 2V → 3V (V catalyzes its own production)
            const reaction = u * v * v;
            
            // Gray-Scott equations
            const dU = Du * laplacian(U, x, y) - reaction + F * (1 - u);
            const dV = Dv * laplacian(V, x, y) + reaction - (F + K) * v;
            
            U_next[i] = u + dt * dU;
            V_next[i] = v + dt * dV;
            
            // Clamp to valid range
            U_next[i] = Math.max(0, Math.min(1, U_next[i]));
            V_next[i] = Math.max(0, Math.min(1, V_next[i]));
        }
    }
    
    // Swap buffers
    [U, U_next] = [U_next, U];
    [V, V_next] = [V_next, V];
    
    if ((step + 1) % 1000 === 0) {
        console.log(`  Step ${step + 1}/${STEPS}`);
    }
}

// Color palette - ocean depths
function getColor(v) {
    const t = Math.max(0, Math.min(1, v));
    
    const colors = [
        { t: 0.0, r: 5,   g: 15,  b: 40 },
        { t: 0.2, r: 15,  g: 40,  b: 80 },
        { t: 0.4, r: 30,  g: 80,  b: 120 },
        { t: 0.55, r: 60, g: 140, b: 140 },
        { t: 0.7, r: 180, g: 160, b: 80 },
        { t: 0.85, r: 220, g: 120, b: 60 },
        { t: 1.0, r: 255, g: 80,  b: 60 },
    ];
    
    let lower = colors[0];
    let upper = colors[colors.length - 1];
    
    for (let i = 0; i < colors.length - 1; i++) {
        if (t >= colors[i].t && t <= colors[i + 1].t) {
            lower = colors[i];
            upper = colors[i + 1];
            break;
        }
    }
    
    const range = upper.t - lower.t;
    const localT = range > 0 ? (t - lower.t) / range : 0;
    
    const r = Math.round(lower.r + (upper.r - lower.r) * localT);
    const g = Math.round(lower.g + (upper.g - lower.g) * localT);
    const b = Math.round(lower.b + (upper.b - lower.b) * localT);
    
    return { r, g, b };
}

// Create PPM image
let ppm = `P6\n${WIDTH} ${HEIGHT}\n255\n`;

for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
        const i = y * WIDTH + x;
        const v = V[i];
        const color = getColor(v);
        ppm += String.fromCharCode(color.r, color.g, color.b);
    }
}

// Save PPM
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `reaction-diffusion-${timestamp}.ppm`;
const filepath = path.join(outputDir, filename);

fs.writeFileSync(filepath, ppm, 'binary');
console.log(`\nSaved: ${filepath}`);
console.log(`Pattern type: Coral growth (F=${F}, K=${K})`);
