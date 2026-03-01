---
name: art-thumbnails
description: "Generate gallery thumbnails for generative art. Use when: (1) Setting up gallery, (2) Adding new pieces, (3) Refreshing previews."
---

# art-thumbnails

Generate category-appropriate SVG thumbnails for the generative art portfolio.

## Quick Actions

```bash
art-thumbnails              # Generate all missing thumbnails
art-thumbnails flow-field   # Generate specific piece
art-thumbnails --regenerate # Force regenerate all
art-thumbnails --list       # Show thumbnail status
art-thumbnails --clean      # Remove all thumbnails
```

## Conventions

- Thumbnails are SVG format (scalable, small)
- Stored in `public/thumbnails/`
- Named `{kebab-case}.svg`
- Category determines visual style
- Generated deterministically (same input = same output)

## Category Styles

| Category | Visual Style |
|----------|--------------|
| mathematical | Spiral patterns, fractal structures |
| natural | Branching trees, organic growth |
| physics | Wave interference, particles |
| geometric | Mandala symmetry, radial patterns |
| traditional | Cross-hatching, sketch textures |
| abstract | Flowing gradients, organic shapes |
| text | Typography, letterforms |
| 3d | Isometric, depth cues |
| interactive | UI hints, control indicators |
