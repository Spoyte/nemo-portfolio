# art-audit

Executable portfolio health analyzer for the generative art collection.

## Usage

```bash
# Full audit
art-audit

# Specific checks
art-audit --missing-html    # Algorithms without standalone HTML
art-audit --categories      # Category distribution
art-audit --exports         # Export consistency
```

## What It Does

1. **Counts algorithms** in `lib/art/`
2. **Analyzes categories** — Animated, Nature, Physics, Geometric, Fractal, AI/ML, Audio/Visual
3. **Finds missing HTMLs** — standalone files in `public/art/`
4. **Checks exports** — verifies all algorithms exported from `index.ts`

## Current Portfolio Health (2026-02-25)

- **Total Algorithms:** 26
- **Standalone HTMLs:** 17
- **Coverage:** 65%
- **Missing HTMLs:** 10 (cellular-automata, dla, geometric-mandala, kaleidoscope-symmetry, mandelbrot-explorer, mandelbrot, particle-network, perlin-terrain, recursive-trees, seeded-random)
- **Missing Exports:** 3 (kaleidoscope-symmetry, mandelbrot, seeded-random)

## Category Breakdown

| Category | Count |
|----------|-------|
| Animated | 7 |
| Nature | 5 |
| Physics | 4 |
| Geometric | 4 |
| Fractal | 2 |
| AI/ML | 1 |
| Audio/Visual | 1 |

## Notes

- `seeded-random.ts` is a utility, not an art piece — should probably be excluded
- `mandelbrot.ts` vs `mandelbrot-explorer.ts` — may be duplicate or variant
- Coverage at 65% means 10 algorithms need standalone HTMLs created
