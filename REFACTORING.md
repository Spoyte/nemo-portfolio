# Art Generator Interface Refactoring

## Overview

Refactored the core types and generator interfaces to be cleaner, more consistent, and more "Rams-like" (less but better, thorough, consistent).

## Changes Made

### 1. New Core Types (`core-refactored.ts`)

- **Unified `ArtGenerator` interface**: Single, consistent way to define generators
- **Clean parameter definitions**: `Record<string, ParamConfig>` instead of mixed patterns
- **Separated metadata**: `meta` object contains category, complexity, tags, created date
- **Utility functions**: HSL/RGB conversion, math helpers, canvas utilities all in one place
- **Type safety**: `ParamDefaults<T>` helper for deriving parameter types

### 2. Refactored Generators

#### `strange-attractor-refactored.ts`
- Converted from `config:` pattern to standard `params:`
- Separated physics simulation from rendering
- Added proper `meta` with category, complexity, tags
- Clean imports from `core-refactored.ts`

### 3. Migration Analysis

Analyzed 10 files using non-standard patterns:
- `audio-reactive-waves.ts`
- `boids-flocking.ts`
- `cantor-set.ts`
- `chromatic-aberration.ts`
- `flowing-silk.ts`
- `kohonen-map.ts`
- `n-body-gravity.ts`
- `stippled-portraits.ts`
- `strange-attractor.ts`
- `textile-weave.ts`

All use `config:` instead of `params:` and lack proper `meta` objects.

## Dieter Rams Principles Applied

1. **Innovative**: New type system enables better IDE support and validation
2. **Useful**: Consistent interface makes generators easier to create and maintain
3. **Aesthetic**: Clean separation of concerns, readable structure
4. **Understandable**: One way to do things, clear naming
5. **Unobtrusive**: Backward compatibility exports for gradual migration
6. **Honest**: Types reflect actual usage patterns
7. **Long-lasting**: Solid foundation for future generators
8. **Thorough**: Complete type coverage, utility functions included
9. **Environmentally friendly**: No runtime overhead, compile-time only
10. **Less design**: Removed redundant patterns, unified to single approach

## Migration Guide

For each file to migrate:

1. **Update imports**:
   ```typescript
   // Before
   import { ArtGenerator } from "./core";
   
   // After
   import { ArtGenerator, ParamConfig, ArtParams, hslToRgb } from "./core-refactored";
   ```

2. **Convert config to params**:
   ```typescript
   // Before
   config: {
     iterations: { type: "range", default: 6, min: 3, max: 8 }
   }
   
   // After
   const PARAMS: Record<string, ParamConfig> = {
     iterations: { type: "range", default: 6, min: 3, max: 8 }
   };
   ```

3. **Rename render to generate**:
   ```typescript
   // Before
   render: (ctx, params, time) => { ... }
   
   // After
   const generate = (ctx: CanvasRenderingContext2D, params: ArtParams, time?: number) => { ... }
   ```

4. **Add meta object**:
   ```typescript
   meta: {
     category: "mathematical",
     complexity: "complex",
     tags: ["animated", "colorful", "chaotic"],
     created: "2026-03-19",
   }
   ```

## Files Created

- `lib/art/core-refactored.ts` — New unified core types
- `lib/art/strange-attractor-refactored.ts` — Example refactored generator
- `scripts/migrate-generators.ts` — Migration analysis tool
- `REFACTORING.md` — This document

## Next Steps

1. Review and test `strange-attractor-refactored.ts`
2. Migrate remaining 9 files following the pattern
3. Once all migrated, replace `core.ts` with `core-refactored.ts`
4. Remove `-refactored` suffixes
5. Update all imports in `index.ts`
