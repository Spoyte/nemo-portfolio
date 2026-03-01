---
name: art-test
description: "Validate generative art generators — test imports, exports, and rendering. Use when: (1) Adding new generators, (2) Before releases, (3) CI/CD validation, (4) Debugging broken art pieces."
---

# art-test

Validate the entire generative art portfolio. Tests imports, exports, and basic rendering for all 70+ generators.

## Quick Start

```bash
art-test              # Test all generators
art-test --quick      # Import test only (fast)
art-test --render     # Include render test (slow)
art-test --failed     # Re-test only previously failed
art-test --json       # JSON output for CI/CD
```

## What It Tests

1. **Import Test** — Can the module be imported without errors?
2. **Export Test** — Does it export the required `generate` function?
3. **Render Test** — Can it render to a canvas without crashing?

## Output

```
🎨 Art Test: 74 generators

✅ Import  74/74  (100%)
✅ Export  74/74  (100%)
✅ Render  74/74  (100%)

All generators healthy!
```

## Exit Codes

- `0` — All tests passed
- `1` — Some tests failed
- `2` — Critical error (couldn't run tests)

## CI/CD Integration

```yaml
# .github/workflows/art-test.yml
- name: Test Generators
  run: art-test --json > test-results.json
```

## The Rams Test

1. **Innovative** — Headless canvas testing for generative art
2. **Useful** — Catches broken generators before users do
3. **Aesthetic** — Clean, color-coded output
4. **Understandable** — Clear pass/fail for each test
5. **Unobtrusive** — Fast by default, thorough when needed
6. **Honest** — Reports actual failures, no false positives
7. **Long-lasting** — Works with any generator following the pattern
8. **Thorough** — Tests import, export, and render
9. **Environmentally friendly** — Minimal dependencies
10. **Less design** — One command, clear results
