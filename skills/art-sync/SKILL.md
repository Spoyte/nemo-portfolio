---
description: "Auto-generate index.ts from unified-registry.ts - single source of truth"
---

# art-sync

Synchronizes `lib/art/index.ts` with `unified-registry.ts` — eliminating manual coordination between registry entries and static imports.

## The Problem

The art system has two sources of truth:
1. `unified-registry.ts` — contains all generator metadata
2. `index.ts` — contains static imports and the `rawGenerators` map

When adding a new generator, both files need updating. This is error-prone and tedious.

## The Solution

`art-sync` reads the registry and regenerates `index.ts`:
- Static imports organized by category
- `rawGenerators` map with all entries
- Consistent formatting

## Usage

```bash
# Regenerate index.ts
art-sync

# Check if in sync (CI/CD friendly)
art-sync --check
```

## Integration with art-new

After `art-new` creates a generator, run `art-sync` to update `index.ts`:

```bash
art-new my-art "My Art" 5  # Create generator
art-sync                    # Sync index.ts
```

## Benefits

1. **Single source of truth** — Registry drives everything
2. **No manual sync** — Automation eliminates errors
3. **CI/CD ready** — `--check` flag for validation
4. **Always consistent** — Formatting is deterministic
