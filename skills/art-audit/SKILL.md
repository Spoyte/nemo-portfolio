---
name: art-audit
description: "Audit and analyze the generative art portfolio. Use when: (1) Checking portfolio health and consistency, (2) Finding gaps in algorithm coverage, (3) Tracking metrics and growth, (4) Preparing releases or documentation."
---

# Art Audit

Analyze the generative art portfolio for consistency, completeness, and growth patterns.

## Quick Commands

```bash
# Run full portfolio audit
art-audit

# Check specific areas
art-audit --missing-html    # Find algorithms without standalone HTML
art-audit --categories      # Analyze category coverage
art-audit --exports         # Check export consistency
```

## What It Checks

### 1. Algorithm Inventory
- Total count of art algorithms
- Distribution across categories (Animated, Static, Nature, etc.)
- Missing standalone HTML files
- Missing generator wrappers

### 2. Export Consistency
- All algorithms exported from `lib/art/index.ts`
- Type exports present
- No orphaned files

### 3. Gallery Integration
- All algorithms in gallery categories
- Thumbnail generation coverage
- Favorites system compatibility

### 4. Code Quality
- Consistent parameter patterns
- Color scheme coverage
- Documentation presence

## Output Format

```
🎨 Portfolio Audit Report
========================

Algorithms: 24 total
├── Animated: 12
├── Static: 8
├── Nature: 8
├── Physics: 4
├── Geometric: 5
├── Fractal: 2
├── AI/ML: 1
└── Audio/Visual: 1

Missing Standalone HTML: 10
├── geometric-mandala
├── particle-network
├── recursive-trees
├── wave-interference
├── cellular-automata
├── strange-attractor
├── dla
├── lsystem-botany
├── mandelbrot-explorer
└── kaleidoscope-symmetry

Export Health: ✅ All algorithms exported
Gallery Coverage: ✅ All in categories
```

## Insights It Provides

- **Category balance** — Are we heavy on one type?
- **Missing pieces** — What gaps exist in the collection?
- **Growth rate** — How quickly is the portfolio expanding?
- **Maintenance needs** — What needs cleanup?

---

*Audit keeps the portfolio healthy as it scales.*
