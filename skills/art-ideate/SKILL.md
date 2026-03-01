---
name: art-ideate
description: "Algorithm ideation engine — suggests what to create next based on portfolio gaps. Use when: (1) Looking for inspiration for next art piece, (2) Understanding portfolio coverage gaps, (3) Choosing what to build next."
---

# Art Ideate

Data-driven creativity. Analyzes the portfolio to find gaps and suggest the next algorithm to create.

## Quick Commands

```bash
art-ideate              # Top 5 ideas
art-ideate --all        # Show all gaps
art-ideate --category   # Category balance analysis
art-ideate --random     # Pick one (commitment mode)
art-ideate --json       # JSON output
```

## How It Works

1. **Scans the portfolio** — Reads unified-registry.ts to understand current coverage
2. **Analyzes gaps** — Compares against known algorithm categories and patterns
3. **Scores opportunities** — Ranks by: visual potential × technical interest × balance × feasibility
4. **Suggests next steps** — Provides ready-to-use `art-new` command

## Categories Tracked

| Category | Description | Target % |
|----------|-------------|----------|
| mathematical | Fractals, curves, attractors | 15-20% |
| natural | Plants, terrain, organic forms | 10-15% |
| physics | Simulations, particles, waves | 15-20% |
| geometric | Tiling, symmetry, tessellation | 15-20% |
| abstract | Flow fields, metaballs | 10-15% |
| 3d | Raymarching, projections | 5-10% |
| interactive | User-driven pieces | 5-10% |
| traditional | Classic art techniques | 5-10% |

## Sample Output

```
🎨 Portfolio: 76 algorithms analyzed

📊 Category Balance
  mathematical  ████████████████░░░  12  (16%)
  physics       █████████████████░░░  14  (18%)
  abstract      ███████████████░░░░░  12  (16%)
  ...

💡 Top 5 Ideas
1. Phyllotaxis Spiral (mathematical: needs variety)
   art-new phyllotaxis-spiral "Phyllotaxis Spiral"
   
2. Acoustic Wave Viz (physics: sound underrepresented)
   art-new acoustic-waves "Acoustic Wave Visualization"
   
3. Celtic Knots (geometric: cultural patterns)
   art-new celtic-knots "Celtic Knot Patterns"
```

## The Ideation Loop

```bash
# 1. Get suggestion
art-ideate --random

# 2. Create it
art-new phyllotaxis-spiral "Phyllotaxis Spiral"

# 3. Implement
# (edit the generated files)

# 4. Commit
git add . && git commit -m "feat(art): add phyllotaxis-spiral"
```

## Gap Analysis

The ideator tracks:

- **Category balance** — Which categories are underrepresented
- **Technique diversity** — Different rendering approaches
- **Visual variety** — Color palettes, motion types, complexity levels
- **Cultural coverage** — Art traditions from different cultures
- **Physical phenomena** — Natural and physical processes not yet covered

## Philosophy

> "Constraint breeds creativity. The ideator provides the constraint (what's missing), you provide the creativity (how to fill it)."

Data-driven creativity doesn't replace inspiration — it channels it. Instead of staring at a blank canvas wondering "what should I make?", you get "here's what's missing, now make your version of it."

## See Also

- `art-new` — Scaffold the suggested algorithm
- `art-audit` — Full portfolio health check
- `portfolio-insights` — Deep pattern analysis

---
*Ideas are cheap. Execution is everything.*
