---
name: skill-scaffold
description: "Scaffold new OpenClaw skills with proper structure, CLI integration, and documentation. Use when: (1) Creating a new reusable skill, (2) Standardizing skill structure across workspace."
---

# Skill Scaffold

Rapid scaffolding for OpenClaw skills. Creates consistent structure: SKILL.md documentation, executable scripts, and shell integration.

## Quick Commands

```bash
# Unified skill manager (recommended)
skill new <kebab-name> "Descriptive Name"
skill list              # List all skills
skill show <name>       # Show skill details
skill edit <name>       # Open skill in editor
skill delete <name>     # Remove a skill

# Legacy individual commands (still work)
skill-new <name> "Description"
skill-list
skill-delete <name>
```

## Unified Interface: `skill`

The `skill` command provides a cohesive interface for managing skills:

| Command | Purpose | Example |
|---------|---------|---------|
| `skill new` | Create a new skill | `skill new web-screenshot "Screenshot Tool"` |
| `skill list` | List all skills | `skill list -q` (names only) |
| `skill show` | Display skill details | `skill show memory-log` |
| `skill edit` | Open skill in $EDITOR | `skill edit git-workflow` |
| `skill delete` | Remove a skill | `skill delete -y temp-skill` |

## What It Creates

For `skill new web-screenshot "Web Screenshot Utility"`:

```
skills/
└── web-screenshot/
    ├── SKILL.md          # Documentation and usage
    ├── web-screenshot    # Main executable script
    └── install.sh        # Shell integration setup
```

## Skill Discovery

`skill list` scans all skill directories and extracts:
- Skill name (from directory)
- Description (from SKILL.md frontmatter)

Output modes:
- **Default**: Pretty table
- **`-q`**: Names only (for scripts)
- **`-j`**: JSON array (for automation)

## Skill Removal

`skill delete` safely removes skills with guardrails:
- **Confirmation required** (unless `-y` flag)
- **Uncommitted change warnings** — Alerts if skill has git changes
- **Trash/archive pattern** — Moves to `.trash/` instead of deleting
- **Recoverable** — Easy restore from `.trash/name-TIMESTAMP/`

## Skill Structure Convention

### SKILL.md

Frontmatter + documentation sections:
- Quick Commands (the main interface)
- What It Does (purpose and outputs)
- Configuration (environment variables, etc.)
- Design Principles (why it works this way)

### Executable Script

- Self-documenting with `--help`
- Consistent error handling
- Exit codes for scripting
- stdin/stdout friendly

### Install Script

- Adds to shell PATH via `.bashrc` / `.zshrc`
- Idempotent (safe to run multiple times)
- Creates symlinks or exports

## Design Principles

1. **Unified interface** — One command for all skill operations
2. **Self-documenting** — `--help` explains everything
3. **Scripting-friendly** — Exit codes, quiet mode, JSON output
4. **Consistent interface** — Same patterns across all skills
5. **Low friction** — Scaffold in 30 seconds, not 10 minutes
6. **Safe deletion** — Trash pattern prevents accidental data loss

## Post-Scaffold Steps

1. **Edit SKILL.md** — Fill in description and usage
2. **Implement the script** — Core functionality
3. **Test the install** — Run `install.sh` and verify
4. **Use it** — The best test is real usage
5. **Commit** — `git add . && git commit -m "feat: add {name} skill"`

---

*Scaffold saves ~15 minutes of boilerplate per skill.*
