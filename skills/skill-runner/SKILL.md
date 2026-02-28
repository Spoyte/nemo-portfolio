---
name: skill-runner
description: "Unified skill runner — discover and execute all workspace skills from one command. Use when: (1) You forgot a skill's name, (2) You want to explore available capabilities, (3) You need consistent CLI across all tools."
---

# Skill Runner

A unified command-line interface for all workspace skills. Instead of remembering each skill's individual command, use `nemo` to discover and run everything.

## Quick Start

```bash
# List all available skills
nemo list

# Run a skill (works with aliases too)
nemo health --check
nemo health-monitor --check  # same thing

# Get info about a skill
nemo info art-scaffold

# Read skill documentation
nemo docs git-workflow
```

## Why This Exists

**The problem:** Each skill has its own CLI pattern:
- `health --check` for health monitor
- `skill-create` for scaffolding
- `mem-log` for memory logging

**The solution:** One command to rule them all. `nemo` discovers skills automatically and provides consistent interface:
- `nemo list` — See everything available
- `nemo <skill>` — Run any skill
- `nemo info <skill>` — Understand what it does
- `nemo docs <skill>` — Read the full docs

## Skill Discovery

The runner automatically finds skills in `/skills/<name>/` with `SKILL.md` files. It also detects:
- **Executables** (⚡): Skills with runnable commands
- **Scripts** (📜): Skills with helper scripts in `scripts/`
- **Aliases**: Symlinks in `bin/` that point to skills (e.g., `health` → `health-monitor`)

## Adding the Runner to PATH

The `nemo` command is in `bin/nemo`. If your PATH includes `workspace/bin/`, it's available everywhere.

## Creating Skills That Work With Nemo

Follow the standard skill structure:

```
skills/
└── my-skill/
    ├── SKILL.md          # Required: documentation + frontmatter
    └── my-skill          # Optional: main executable
```

Frontmatter in SKILL.md:
```yaml
---
name: my-skill
description: "What this skill does. Use when: (1) situation 1, (2) situation 2."
---
```

## Design Philosophy

**Discoverability over memorability:** You shouldn't need to remember command names. List, find, run.

**Consistency across tools:** Same patterns for help, arguments, and output.

**Zero configuration:** Skills are discovered from the filesystem. No registry to maintain.

## The Name

"Nemo" — Latin for "nobody" or "no one" — because this tool is just the messenger. The skills do the real work.
