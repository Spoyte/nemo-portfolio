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
nemo list -q              # Names only (for scripting)
nemo list -v              # Verbose with full descriptions

# Run a skill (works with aliases too)
nemo health --check
nemo health-monitor --check  # same thing

# Get info about a skill
nemo info art-scaffold

# Read skill documentation
nemo docs git-workflow

# Search for skills
nemo search backup        # Find skills related to backup
nemo search "git"         # Search descriptions too

# Execute specific scripts from a skill
nemo exec memory-log mem-today
nemo exec memory-log mem-yesterday

# Shell completion
nemo completion -s bash   # Generate bash completion
nemo completion -s zsh    # Generate zsh completion
nemo completion -s fish   # Generate fish completion
```

## Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `nemo list` | List all skills | `nemo list -q` |
| `nemo <skill>` | Run a skill directly | `nemo health --check` |
| `nemo info <skill>` | Show skill details | `nemo info art-scaffold` |
| `nemo docs <skill>` | Read full documentation | `nemo docs git-workflow` |
| `nemo search <query>` | Find skills by name/description | `nemo search backup` |
| `nemo exec <skill> <script>` | Run a specific script | `nemo exec memory-log mem-today` |
| `nemo completion` | Generate shell completion | `nemo completion -s zsh` |

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
- `nemo search <query>` — Find what you need
- `nemo exec <skill> <script>` — Run specific scripts

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
    ├── my-skill          # Optional: main executable
    └── scripts/          # Optional: helper scripts
        └── helper.sh
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

**Scripting-friendly:** Quiet mode (`-q`), predictable exit codes, composable with other tools.

## The Name

"Nemo" — Latin for "nobody" or "no one" — because this tool is just the messenger. The skills do the real work.
