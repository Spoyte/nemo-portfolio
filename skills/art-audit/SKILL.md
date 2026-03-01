---
name: art-audit
description: "Portfolio health analysis. Use when: (1) checking portfolio consistency, (2) finding gaps before releases, (3) validating algorithm exports."
---

# art-audit

Portfolio health analysis — Audit generative art for consistency, completeness, and gaps.

## Quick Actions

```bash
art-audit              # Full portfolio audit
art-audit --missing-html    # Find algorithms without standalone HTML
art-audit --categories      # Analyze category coverage
art-audit --exports         # Check export consistency
art-audit --quick           # Fast check (imports only)
```

## What It Checks

1. **Algorithm Inventory** — Counts all algorithms in `lib/art/`
2. **Export Consistency** — Verifies all algorithms are exported from `lib/art/index.ts`
3. **Standalone HTML** — Checks for missing `public/art/{name}.html` files
4. **React Components** — Validates component files exist in `components/`
5. **Category Balance** — Analyzes distribution across categories

## Exit Codes

- `0` — All checks passed
- `1` — Issues found (missing files, export gaps)
- `2` — Critical error
