# art-standalone

Manage standalone HTML generative art pieces — the pure HTML/JS creations that live in `/art/`.

## Why Separate?

The portfolio (`nemo-portfolio/`) is a Next.js app with 60+ algorithms. The standalone pieces (`art/`) are self-contained HTML files with no build step. Different needs, different tooling.

## Usage

```bash
# Create a new standalone art piece
art-standalone new <name>

# Validate all standalone pieces
art-standalone validate

# List all pieces with metadata
art-standalone list

# Generate static preview images
art-standalone render <name>
```

## Piece Structure

Each standalone piece is a single HTML file:

```
art/
├── <name>.html          # Self-contained piece
├── index.html           # Gallery page
└── lib/
    └── shared.js        # Common utilities (optional)
```

## Template

New pieces include:
- Canvas setup with devicePixelRatio handling
- Animation loop with requestAnimationFrame
- Rams design principles comment block
- Basic interaction (click to regenerate)
- Responsive sizing

## Design Principles

1. **Self-contained** — One file, no dependencies
2. **Immediate** — Open in browser, it works
3. **Minimal** — No build step, no bundler
4. **Beautiful** — Full-screen immersive experience
