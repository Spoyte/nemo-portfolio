---
name: art-new
description: "Scaffold new generative art algorithms with proper structure, registry integration, and metadata. Use when: (1) Creating a new art piece for the portfolio, (2) Ensuring consistent structure across all algorithms."
---

# Art New

Rapid scaffolding for generative art algorithms. Creates consistent structure: generator function, metadata, thumbnail support, and registry integration.

## Quick Commands

```bash
# Create a new art algorithm
art-new <kebab-name> "Descriptive Name"

# Examples
art-new neural-flow "Neural Flow Fields"
art-new reaction-diffusion "Reaction Diffusion Patterns"
art-new magnetic-fluids "Magnetic Fluid Simulation"
```

## What It Creates

For `art-new neural-flow "Neural Flow Fields"`:

```
lib/art/
├── neural-flow.ts          # Main generator with full structure
└── neural-flow-thumb.ts    # Thumbnail variant (simplified)
```

Plus updates to:
- `unified-registry.ts` — Adds generator to registry
- `metadata.ts` — Adds artwork metadata
- `index.ts` — Auto-synced via `art-sync`

## Workflow

```bash
# 1. Create the art piece
art-new neural-flow "Neural Flow Fields" 5

# 2. Implement your algorithm (edit neural-flow.ts)
# 3. The registry is already updated, index.ts auto-synced

# 4. Test and commit
git add . && git commit -m "feat(art): add neural-flow"
```

## Generator Structure

Each new algorithm includes:

1. **Core Generator Function** — Full parameterization, animation loop, export support
2. **Thumbnail Variant** — Simplified version for gallery previews
3. **Metadata** — Title, description, category, tags, complexity rating
4. **Registry Entry** — Proper integration with the portfolio system

## Categories

- `mathematical` — Math-based patterns (fractals, curves, attractors)
- `natural` — Nature-inspired (plants, terrain, organic forms)
- `physics` — Physics simulations (fluids, particles, waves)
- `geometric` — Geometric patterns (tiling, symmetry, tessellation)
- `abstract` — Abstract compositions (metaballs, flow fields)
- `3d` — Three-dimensional renderings (raymarching, projections)
- `interactive` — User-interactive pieces

## Design Principles

1. **Consistent API** — All generators follow the same interface
2. **Self-contained** — No external dependencies beyond canvas
3. **Parameterizable** — All visual aspects controllable
4. **Export-ready** — PNG download built-in
5. **Animation support** — Optional time-based evolution
6. **Thumbnail-friendly** — Fast preview generation

## Post-Creation Steps

1. **Implement the algorithm** — Fill in the draw/generate function
2. **Test in browser** — Verify it renders correctly
3. **Adjust metadata** — Fine-tune description, tags, complexity
4. **Commit** — `git add . && git commit -m "feat(art): add {name}"`

## See Also

- `art-sync` — Regenerate index.ts from unified-registry.ts
- `art-analyze` — Analyze portfolio patterns and diversity

---
*Scaffold saves ~10 minutes of boilerplate per algorithm.*
