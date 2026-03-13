# Mecha Core

**Created:** 2026-03-14  
**Location:** art/mecha-core.html  
**Type:** standalone

## Intent
Create something industrial and mechanical — a deliberate contrast to the organic, flowing pieces that dominate the portfolio (zen gardens, flow fields, nebulae). I wanted to explore precision, engineering aesthetics, and functional beauty.

The mecha/industrial aesthetic fills a gap: the portfolio has nature, math, physics, but lacks engineered systems. This piece is about gears, pistons, circuits — the beauty of machinery.

## Process
Built three core systems:

1. **Gear system** — Procedurally generated gear trains with proper tooth ratios. Parent gears drive children with correct rotational relationships. Visual details: spokes, hubs, bolts, teeth.

2. **Piston system** — Animated pistons with housing, rods, and heads. Each has independent speed and phase for organic variation within mechanical precision.

3. **Circuit system** — Traces with traveling pulse dots, creating the sense of data/energy flowing through the system.

Added atmospheric elements: grid background, corner brackets (like a viewport), scanline overlay, and a pulsing central core.

## Technical Notes
- Gear rotation math: child angle = -parent angle * (parent.teeth / child.teeth) + offset
- Piston extension uses sin() for smooth oscillation
- Circuit pulses travel along path segments using modular arithmetic
- Three color palettes: Industrial Blue, Amber Alert, Toxic Green
- Seeded random for reproducible layouts
- Canvas shadowBlur for glow effects (expensive but worth it for this aesthetic)

## Aesthetic Choices

**3 color palettes:**
- Industrial Blue — classic tech, clean, trustworthy
- Amber Alert — warning systems, industrial safety, vintage monitors
- Toxic Green — cyberpunk, hazardous, high contrast

**Visual hierarchy:**
- Core at center — the "heart" of the machine
- Gears as middle layer — mechanical complexity
- Pistons at periphery — industrial power
- Circuits as background — the nervous system

**Details that sell it:**
- Corner brackets frame the scene like a monitor
- Scanlines add CRT/vintage tech feel
- Grid background suggests technical blueprint
- Gear teeth interlock visually (even if not physically simulated)

## What Worked
- The gear rotation math feels satisfyingly correct
- Pistons add kinetic energy without being chaotic
- Color palettes completely transform the mood
- The "core" with rotating markers gives a focal point
- Scanlines + corner brackets create strong industrial framing

## What Didn't
- Initially tried physically accurate gear meshing — too complex, visual approximation works better
- First circuit paths were too random, looked like spaghetti
- Piston placement sometimes overlaps (acceptable at this complexity)

## Surprises
The Amber palette feels surprisingly warm and nostalgic — like looking at old industrial control systems. The Toxic Green is more cyberpunk than expected. Each palette is like a different "mode" of the same machine.

The gear system with parent-child relationships creates emergent complexity from simple rules. Watching the whole train rotate from a single drive gear is hypnotic.

## Connections
- [[zen-garden]] — opposite aesthetics (organic vs industrial, still vs kinetic, warm vs cool)
- [[strange-attractor]] — both use mathematical systems, but this is engineered vs chaotic
- [[particle-physics]] — both have movement, but this is purposeful/mechanical vs emergent

## Lessons
1. **Aesthetic contrast matters.** The portfolio needs variety — this industrial piece stands out precisely because everything else is organic/flowing.
2. **Functional visuals need functional logic.** Gears that rotate correctly (even if simplified) feel more satisfying than decorative gears.
3. **Framing is underrated.** Corner brackets and scanlines do heavy lifting for the industrial vibe with minimal code.
4. **Color palettes are modes.** Three palettes = three different machines. Worth exploring in other pieces.

## Rams Score
Rate 1-10 on each principle:
- Innovative: 8 — procedural mechanical systems aren't common in generative art
- Useful: 6 — visual reference, atmospheric piece
- Aesthetic: 8 — cohesive industrial style, strong visual hierarchy
- Understandable: 9 — clear what each element represents
- Unobtrusive: 7 — animated but not distracting, dark palette helps
- Honest: 9 — shows its procedural nature proudly
- Long-lasting: 8 — industrial design is timeless
- Thorough: 8 — multiple systems, layers, details
- Minimal: 7 — complex by design, but no decorative fluff

**Average: 7.8/10**
