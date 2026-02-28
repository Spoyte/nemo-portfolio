---
name: portfolio-insights
description: "Analyze generative art portfolio for patterns, gaps, and opportunities"
---

# Portfolio Insights

Analyze the Nemo generative art portfolio — discover patterns, identify gaps, find inspiration for new pieces.

## Quick Commands

```bash
# Full portfolio analysis
portfolio-insights

# Quick stats only
portfolio-insights --stats

# Find gaps (missing categories/themes)
portfolio-insights --gaps

# Analyze specific category
portfolio-insights --category physics

# Export JSON for further processing
portfolio-insights --json

# Show help
portfolio-insights --help
```

## What It Analyzes

### Category Distribution
- Mathematical, Natural, Physics, Geometric, Abstract, Traditional, Text, 3D, Interactive
- Identifies underrepresented categories

### Theme Patterns
- Animation vs static pieces
- Color palette trends
- Complexity distribution
- Tag frequency analysis

### Gap Detection
- Missing natural phenomena (volcanoes, glaciers, sand dunes)
- Underrepresented art traditions (batik, mosaic, calligraphy)
- Absent physics domains (acoustics, thermodynamics, relativity)
- Unexplored mathematical concepts (knot theory, topology, graph theory)

### Opportunity Scoring
Each gap gets a score based on:
- **Visual potential** (how compelling could it be?)
- **Technical interest** (novel algorithms?)
- **Collection balance** (fills a hole?)
- **Implementation feasibility** (doable in one cycle?)

## Outputs

### Terminal Report
```
┌─────────────────────────────────────────────────────┐
│  Portfolio Analysis: 71 Generators                  │
├─────────────────────────────────────────────────────┤
│  Category Distribution                              │
│  ─────────────────────────────────────────────      │
│  Physics      ████████████████████████████  14      │
│  Geometric    ████████████████████████      11      │
│  Abstract     ████████████████████████      11      │
│  Mathematical ████████████████              10      │
│  Natural      ████████████████████           8      │
│  Traditional  ████████████                   6      │
│  3D           ██████                         3      │
│  Interactive  ████████                       4      │
│  Text         ██                             1      │
│                                                      │
│  Top Opportunities                                  │
│  ─────────────────────────────────────────────      │
│  1. Textile/Batik patterns (Traditional gap)        │
│  2. Acoustic wave visualization (Physics gap)       │
│  3. Knot theory diagrams (Mathematical gap)         │
│  4. Mosaic tile generator (Traditional gap)         │
│  5. Sand dune formations (Natural gap)              │
└─────────────────────────────────────────────────────┘
```

## Design Principles

1. **Data-driven** — Parses actual registry files, not hardcoded lists
2. **Actionable** — Suggests specific next pieces, not vague directions
3. **Fast** — Runs in under a second
4. **Extensible** — Easy to add new analysis dimensions

## Integration

Used by continuous improvement cycles to:
- Decide what to create next
- Ensure portfolio diversity
- Avoid duplicate concepts

---

*Pattern recognition for creative work.*
