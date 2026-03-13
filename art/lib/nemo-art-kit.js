/**
 * Nemo Art Kit — Shared utilities for generative art pieces
 * Extracts common patterns to keep individual pieces clean and focused
 */

const NemoArt = {
    // Canvas setup with automatic high-DPI scaling
    createCanvas(width = 800, height = 600, parent = document.body) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Handle high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
        
        parent.appendChild(canvas);
        
        return { canvas, ctx, width, height, dpr };
    },
    
    // Wrap existing canvas with high-DPI support
    wrapCanvas(canvasId, width, height) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        
        const dpr = window.devicePixelRatio || 1;
        if (!canvas.style.width) {
            canvas.width = (width || canvas.width) * dpr;
            canvas.height = (height || canvas.height) * dpr;
            canvas.style.width = `${width || canvas.width / dpr}px`;
            canvas.style.height = `${height || canvas.height / dpr}px`;
            ctx.scale(dpr, dpr);
        }
        
        return { 
            canvas, 
            ctx, 
            width: width || canvas.width / dpr, 
            height: height || canvas.height / dpr,
            dpr 
        };
    },
    
    // Animation loop with delta time and pause support
    createLoop(renderFn, options = {}) {
        let running = true;
        let lastTime = performance.now();
        let frameCount = 0;
        
        const loop = (currentTime) => {
            if (!running) return;
            
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            frameCount++;
            
            renderFn({
                time: currentTime,
                deltaTime,
                frameCount,
                elapsed: currentTime - (loop.startTime || (loop.startTime = currentTime))
            });
            
            requestAnimationFrame(loop);
        };
        
        return {
            start: () => { running = true; requestAnimationFrame(loop); },
            stop: () => { running = false; },
            toggle: () => { running ? loop.stop() : loop.start(); },
            get isRunning() { return running; },
            get frameCount() { return frameCount; }
        };
    },
    
    // Color palettes as HSL objects with manipulation methods
    Palette: {
        // Ethereal purples and blues
        ethereal: [
            { h: 260, s: 70, l: 60 },
            { h: 280, s: 80, l: 65 },
            { h: 200, s: 75, l: 55 },
            { h: 320, s: 60, l: 70 },
            { h: 45, s: 90, l: 65 }
        ],
        
        // Warm sunset tones
        sunset: [
            { h: 20, s: 90, l: 60 },
            { h: 35, s: 85, l: 65 },
            { h: 10, s: 80, l: 55 },
            { h: 300, s: 60, l: 50 },
            { h: 50, s: 95, l: 70 }
        ],
        
        // Cool ocean depths
        ocean: [
            { h: 190, s: 80, l: 50 },
            { h: 210, s: 75, l: 45 },
            { h: 170, s: 70, l: 55 },
            { h: 230, s: 60, l: 40 },
            { h: 180, s: 85, l: 60 }
        ],
        
        // Monochrome with accent
        mono: [
            { h: 0, s: 0, l: 90 },
            { h: 0, s: 0, l: 70 },
            { h: 0, s: 0, l: 50 },
            { h: 0, s: 0, l: 30 },
            { h: 45, s: 100, l: 60 }
        ],
        
        // Get random color from palette
        random(palette) {
            return palette[Math.floor(Math.random() * palette.length)];
        },
        
        // Convert HSL object to CSS string
        toCSS(hsl, alpha = 1) {
            return alpha === 1 
                ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
                : `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;
        },
        
        // Shift hue by degrees
        shift(hsl, degrees) {
            return { ...hsl, h: (hsl.h + degrees) % 360 };
        },
        
        // Lighten by percentage
        lighten(hsl, percent) {
            return { ...hsl, l: Math.min(100, hsl.l + percent) };
        },
        
        // Darken by percentage  
        darken(hsl, percent) {
            return { ...hsl, l: Math.max(0, hsl.l - percent) };
        }
    },
    
    // Seeded random number generator (deterministic)
    Random(seed = Math.random()) {
        let s = seed;
        return {
            // 0-1
            next() {
                s = (s * 9301 + 49297) % 233280;
                return s / 233280;
            },
            // Range [min, max)
            range(min, max) {
                return min + this.next() * (max - min);
            },
            // Integer range [min, max]
            int(min, max) {
                return Math.floor(this.range(min, max + 1));
            },
            // Random item from array
            pick(array) {
                return array[Math.floor(this.next() * array.length)];
            },
            // Boolean with probability
            bool(probability = 0.5) {
                return this.next() < probability;
            },
            // Get current seed state (for saving)
            get seed() { return s; },
            // Reset to new seed
            reset(newSeed) { s = newSeed; }
        };
    },
    
    // Simple noise functions
    Noise: {
        // Simplex-like 2D noise
        simple2D(x, y, scale = 0.01) {
            return Math.sin(x * scale) * Math.cos(y * scale) + 
                   Math.sin((x + y) * scale * 0.5) * 0.5 +
                   Math.sin(x * scale * 2 + y * scale) * 0.25;
        },
        
        // Multi-octave fractal noise
        fractal(x, y, scale = 0.01, octaves = 4, persistence = 0.5) {
            let total = 0;
            let amplitude = 1;
            let frequency = scale;
            let maxValue = 0;
            
            for (let i = 0; i < octaves; i++) {
                total += this.simple2D(x * frequency, y * frequency, 1) * amplitude;
                maxValue += amplitude;
                amplitude *= persistence;
                frequency *= 2;
            }
            
            return total / maxValue;
        }
    },
    
    // UI Controls builder
    UI: {
        // Create control panel
        createPanel(options = {}) {
            const panel = document.createElement('div');
            panel.className = 'nemo-controls';
            Object.assign(panel.style, {
                position: options.position || 'fixed',
                bottom: options.bottom || '30px',
                left: options.left || '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: options.gap || '12px',
                zIndex: '10',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: '90vw'
            }, options.style || {});
            
            document.body.appendChild(panel);
            return panel;
        },
        
        // Create button
        button(label, onClick, options = {}) {
            const btn = document.createElement('button');
            btn.textContent = label;
            Object.assign(btn.style, {
                background: options.bg || 'rgba(20, 20, 35, 0.9)',
                border: `1px solid ${options.border || 'rgba(100, 80, 200, 0.4)}'`,
                color: options.color || '#a0a0c0',
                padding: options.padding || '10px 20px',
                borderRadius: options.radius || '6px',
                cursor: 'pointer',
                fontSize: options.fontSize || '12px',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
                fontFamily: "'SF Mono', Monaco, monospace"
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.background = options.hoverBg || 'rgba(40, 40, 60, 0.9)';
                btn.style.transform = 'translateY(-1px)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = options.bg || 'rgba(20, 20, 35, 0.9)';
                btn.style.transform = 'translateY(0)';
            });
            
            btn.addEventListener('click', onClick);
            return btn;
        },
        
        // Create info overlay
        info(text, options = {}) {
            const el = document.createElement('div');
            el.textContent = text;
            el.className = 'nemo-info';
            Object.assign(el.style, {
                position: 'fixed',
                top: options.top || '20px',
                left: options.left || '20px',
                color: options.color || 'rgba(160, 160, 192, 0.6)',
                fontSize: options.fontSize || '11px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontFamily: "'SF Mono', Monaco, monospace",
                pointerEvents: 'none'
            });
            document.body.appendChild(el);
            return el;
        }
    },
    
    // Export utilities
    Export: {
        // Save canvas as PNG
        png(canvas, filename = 'nemo-art.png') {
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        },
        
        // Copy to clipboard (modern browsers)
        async copy(canvas) {
            try {
                const blob = await new Promise(resolve => 
                    canvas.toBlob(resolve, 'image/png')
                );
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                return true;
            } catch (err) {
                console.error('Copy failed:', err);
                return false;
            }
        }
    },
    
    // Math utilities
    Math: {
        // Linear interpolation
        lerp(a, b, t) {
            return a + (b - a) * t;
        },
        
        // Clamp value to range
        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        },
        
        // Map value from one range to another
        map(value, inMin, inMax, outMin, outMax) {
            return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
        },
        
        // Distance between two points
        dist(x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        },
        
        // Angle between two points
        angle(x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        }
    },
    
    // Common CSS for art pieces
    get baseStyles() {
        return `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                background: #0a0a0f;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                font-family: 'SF Mono', Monaco, monospace;
                overflow: hidden;
            }
            canvas {
                box-shadow: 0 0 60px rgba(100, 80, 200, 0.15);
                border-radius: 4px;
            }
        `;
    }
};

// Export for module systems or attach to window
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NemoArt;
} else {
    window.NemoArt = NemoArt;
}
