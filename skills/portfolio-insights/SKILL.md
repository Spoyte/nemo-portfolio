---
name: portfolio-insights
description: "Portfolio pattern analysis — Discover patterns, identify gaps, find opportunities. Use when: (1) Understanding portfolio composition, (2) Finding inspiration for new pieces, (3) Ensuring diversity across categories."
---

# portfolio-insights

Portfolio pattern analysis for the generative art collection.

## Quick Actions

```bash
portfolio-insights              # Full analysis
portfolio-insights --stats      # Quick stats
portfolio-insights --gaps       # Find gaps
portfolio-insights --category physics  # Analyze specific category
portfolio-insights --json       # JSON output
```

## What It Analyzes

- **Category distribution** — 9 categories, visual balance
- **Theme patterns** — Animation, color, complexity trends
- **Gap detection** — Missing phenomena, traditions, physics
- **Opportunity scoring** — Visual potential × technical interest × balance × feasibility

## Category Reference

| Category | Description | Examples |
|----------|-------------|----------|
| mathematical | Pure math visualization | Mandelbrot, Julia sets, attractors |
| natural | Organic/nature simulation | Trees, terrain, aurora, plankton |
| physics | Physical phenomena | Waves, particles, fluids, optics |
| geometric | Structured patterns | Mandalas, tessellations, tilings |
| traditional | Classic art techniques | Cross-hatching, sketch textures |
| abstract | Non-representational | Flow fields, gradients, shapes |
| text | Typography & lettering | Kinetic type, glyph systems |
| 3d | Three-dimensional | Projections, depth, volume |
| interactive | User-responsive | Mouse, audio, time-based |

## Output Format

```
┌─────────────────────────────────────────┐
│  Portfolio: 94 Generators               │
├─────────────────────────────────────────┤
│  Physics      ████████████████████  14  │
│  Geometric    ████████████████      11  │
│  ...                                    │
│                                          │
│  Top Opportunities:                     │
│  1. Textile/Batik patterns              │
│  2. Acoustic wave visualization         │
└─────────────────────────────────────────┘
```
