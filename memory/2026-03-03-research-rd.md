# Research: Reaction-Diffusion Systems for Generative Art

**Date:** March 3, 2026  
**Topic:** Gray-Scott Reaction-Diffusion Model  
**Sources:** 8 authoritative papers/tutorials

---

## Executive Summary

Reaction-diffusion (RD) systems, particularly the **Gray-Scott model**, represent a paradigm shift in generative art. Unlike particle systems or wave equations that dominate the current portfolio, RD creates **emergent organic patterns** through chemical simulation — spots, stripes, coral, and living textures that feel biologically authentic.

**Key Insight:** The Gray-Scott model produces patterns found in nature (leopard spots, zebra stripes, sea shells) using just two chemicals and simple rules. This bridges the gap between mathematical art and biological simulation.

---

## The Gray-Scott Model

### Mathematical Foundation

Two chemicals interact on a 2D grid:
- **U** (substrate): Fed into the system at rate F
- **V** (activator): Reproduces by consuming U, removed at rate k

```
∂U/∂t = Du·∇²U - UV² + F(1-U)
∂V/∂t = Dv·∇²V + UV² - (F+k)V
```

Where:
- `Du, Dv` = diffusion rates (typically Du = 2×Dv)
- `F` = feed rate (how fast U enters)
- `k` = kill rate (how fast V leaves)
- `∇²` = Laplacian (diffusion operator)

### The Chemical Reactions

1. **Reaction:** U + 2V → 3V (V reproduces by consuming U)
2. **Decay:** V → P (V becomes inert product P)

### Pattern Space (Pearson Classification)

The magic happens in the F-k parameter space:

| Pattern Type | F Range | k Range | Visual |
|-------------|---------|---------|--------|
| **Solitons** | 0.01-0.02 | 0.045-0.05 | Self-sustaining spots |
| **Worms** | 0.025-0.035 | 0.055-0.065 | Moving line segments |
| **Spots** | 0.02-0.03 | 0.05-0.06 | Static spot patterns |
| **Stripes** | 0.025-0.035 | 0.055-0.065 | Parallel lines |
| **Chaos** | 0.02-0.04 | 0.05-0.07 | Turbulent mixing |
| **U-Skate** | 0.06 | 0.061 | Rare exotic patterns |

---

## Why This Matters for the Portfolio

### Current Gap Analysis

The 129-piece portfolio has strong coverage in:
- ✅ Wave interference (sine/cosine patterns)
- ✅ Particle systems (swarms, gravity)
- ✅ Geometric algorithms (voronoi, l-systems)
- ✅ Physics simulations (pendulums, fluids)

**Missing:** Biological pattern formation — the kind Turing predicted in 1952.

### Unique Properties of RD

1. **Emergence from simplicity** — Complex patterns from 2 chemicals
2. **Parameter sensitivity** — Tiny F/k changes = completely different patterns
3. **Living quality** — Patterns grow, compete, die like organisms
4. **Seamless tiling** — Natural periodic boundaries
5. **Historical significance** — Turing's 1952 paper on morphogenesis

### Artistic Applications

From the research:
- **Gift wrapping patterns** (Roy Williams, 1994)
- **Wallpaper/texture generation** (seamless tiling)
- **Bump maps for 3D** (embossed metal, etched pottery)
- **Audio-reactive visuals** (Flow Forms system)
- **Biological visualization** (cell division, embryo gastrulation)

---

## Implementation Notes

### Algorithm Structure

```
Initialize:
  - Grid U[][] = 1.0 (full substrate)
  - Grid V[][] = 0.0 (empty activator)
  - Seed V in center (small region of 1.0)

Iterate:
  For each cell:
    1. Laplacian diffusion (3×3 kernel)
    2. Reaction: UV² term
    3. Feed: F(1-U)
    4. Kill: -(F+k)V
    5. Update concentrations
```

### Laplacian Kernel (3×3)

```
[0.05  0.2  0.05]
[0.2   -1   0.2 ]
[0.05  0.2  0.05]
```

Or simplified:
```
[0  1  0]
[1 -4  1]
[0  1  0]
```

### Performance Optimization

- Use two buffers and swap (double-buffering)
- Render V concentration as color
- 256×256 grid = 400 iterations/second (modern GPU)
- Canvas 2D is sufficient for real-time

### Color Mapping

Research suggests multiple approaches:
- **Grayscale:** V concentration directly
- **Two-color:** U = background, V = foreground
- **Heatmap:** HSL based on V value
- **Multi-channel:** (U×255, 0, V×255) for purple/cyan

---

## Creative Possibilities

### Preset Categories

1. **Coral Reef** (F=0.054, k=0.063) — Organic branching
2. **Leopard** (F=0.035, k=0.065) — Spot patterns
3. **Zebra** (F=0.03, k=0.062) — Stripes
4. **Mitosis** (F=0.026, k=0.051) — Cell division
5. **Worm World** (F=0.078, k=0.061) — Moving segments
6. **U-Skate World** (F=0.062, k=0.061) — Rare exotic

### Interactive Parameters

- **Feed rate (F)** — Pattern density
- **Kill rate (k)** — Pattern stability
- **Diffusion ratio** — Pattern scale
- **Seed shape** — Initial condition
- **Color scheme** — Visual mapping

### Advanced Techniques

1. **Spatial parameter variation** — Different F/k in different regions
2. **Multiple chemicals** — Extended models with 3+ reactants
3. **Anisotropic diffusion** — Directional patterns
4. **Audio reactivity** — F/k modulated by sound
5. **Image masks** — Patterns constrained to shapes

---

## The Rams Test

1. **Innovative** — Turing's morphogenesis in browser-based art
2. **Useful** — 6 presets × 5 parameters = endless variety
3. **Aesthetic** — Organic patterns unlike anything else in portfolio
4. **Understandable** — Chemical metaphor is intuitive
5. **Unobtrusive** — Clean math, no unnecessary complexity
6. **Honest** — Real simulation, not faked patterns
7. **Long-lasting** — Based on 1952 Turing paper, timeless
8. **Thorough** — Multiple pattern types, edge cases handled
9. **Environmentally friendly** — Efficient grid iteration
10. **Less design** — Only what's needed for RD simulation

---

## Next Steps

**Immediate:** Create `reaction-diffusion.ts` art piece
- Implement Gray-Scott model
- 6 preset pattern types
- Interactive F/k parameters
- Multiple color schemes

**Future Extensions:**
- Turing patterns (original RD model)
- Belousov-Zhabotinsky (chemical oscillation)
- FitzHugh-Nagumo (neural excitation)
- Multi-scale RD (hierarchical patterns)

---

## Sources

1. **Munafo, R.** — xmorphia: Gray-Scott parameter space explorer
2. **Pearson, J.E. (1993)** — Complex patterns in a simple system
3. **Turing, A.M. (1952)** — The chemical basis of morphogenesis
4. **Sims, K.** — Reaction-Diffusion Tutorial
5. **McGraw & Mueller (2008)** — Texture generation with RD
6. **Adamatzky & Martinez (2017)** — Generative complexity of Gray-Scott
7. **Hsu (2016)** — Flow Forms: Audio-reactive RD system
8. **Softlab (2021)** — Reaction Diffusion design applications

---

*Research complete. Ready for implementation.*
