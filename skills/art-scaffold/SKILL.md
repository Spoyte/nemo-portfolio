---
name: art-scaffold
description: "Scaffold new generative art pieces with boilerplate, types, and integration. Use when: (1) Creating a new art algorithm, (2) Need consistent structure across portfolio pieces."
---

# Art Scaffold

Rapid scaffolding for generative art pieces. Creates consistent structure: core algorithm, React component, standalone HTML, and gallery integration.

## Quick Commands

```bash
# Scaffold a new art piece
art-new <kebab-name> "Descriptive Name"

# Example:
art-new flowing-lines "Flowing Lines"
```

## What It Creates

For `art-new flowing-lines "Flowing Lines"`:

```
nemo-portfolio/my-app/
├── lib/art/flowing-lines.ts          # Core algorithm + types
├── components/flowing-lines.tsx      # React wrapper
├── public/art/flowing-lines.html     # Standalone version
└── lib/art/index.ts                  # Updated exports
```

## Art Structure Convention

### Core Algorithm (`lib/art/{name}.ts`)

```typescript
export interface FlowingLinesParams {
  speed: number;
  density: number;
  colorScheme: 'ocean' | 'sunset' | 'forest';
}

export const flowingLinesDefaultParams: FlowingLinesParams = {
  speed: 50,
  density: 50,
  colorScheme: 'ocean',
};

export function renderFlowingLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: FlowingLinesParams
): void {
  // Your algorithm here
}
```

### React Component (`components/{name}.tsx`)

- Wraps the canvas with proper sizing
- Handles animation loop with `requestAnimationFrame`
- Provides parameter controls UI
- Exports `getStaticParams()` for gallery integration

### Standalone HTML (`public/art/{name}.html`)

- Self-contained version for sharing/direct viewing
- Same algorithm, no React dependencies
- Full-screen canvas with minimal UI

## Integration Pattern

The scaffold automatically updates `lib/art/index.ts`:

```typescript
export { renderFlowingLines, flowingLinesDefaultParams } from './flowing-lines';
export type { FlowingLinesParams } from './flowing-lines';
```

Gallery page imports from the index and adds to `artGenerators` object.

## Design Principles

1. **Constraint breeds creativity** — Same 400x400 canvas, same patterns
2. **Pixels over primitives** — Use `createImageData` for performance
3. **Time as input** — All pieces animate via `time` parameter
4. **Parameters as UI** — Expose 2-4 sliders for interactivity
5. **Color schemes** — Provide 3-5 palettes, not infinite hues

## Post-Scaffold Steps

1. **Implement the algorithm** in `lib/art/{name}.ts`
2. **Wire up controls** in `components/{name}.tsx`
3. **Test standalone** by opening `public/art/{name}.html`
4. **Add to gallery** in `app/art/page.tsx`
5. **Commit** — `git add . && git commit -m "feat: add {name} generative art"`

---

*Scaffold saves ~10 minutes of boilerplate per piece.*
