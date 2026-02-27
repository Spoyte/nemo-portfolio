---
name: skill-scaffold
description: "Scaffold new OpenClaw skills with proper structure, CLI integration, and documentation. Use when: (1) Creating a new reusable skill, (2) Standardizing skill structure across workspace."
---

# Skill Scaffold

Rapid scaffolding for OpenClaw skills. Creates consistent structure: SKILL.md documentation, executable scripts, and shell integration.

## Quick Commands

```bash
# Scaffold a new skill
skill-new <kebab-name> "Descriptive Name"

# Example:
skill-new web-screenshot "Web Screenshot Utility"
```

## What It Creates

For `skill-new web-screenshot "Web Screenshot Utility"`:

```
skills/
└── web-screenshot/
    ├── SKILL.md          # Documentation and usage
    ├── web-screenshot    # Main executable script
    └── install.sh        # Shell integration setup
```

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

1. **One command, one purpose** — Skills do one thing well
2. **Self-documenting** — `--help` explains everything
3. **Scripting-friendly** — Exit codes, quiet mode, JSON output
4. **Consistent interface** — Same patterns across all skills
5. **Low friction** — Scaffold in 30 seconds, not 10 minutes

## Post-Scaffold Steps

1. **Edit SKILL.md** — Fill in description and usage
2. **Implement the script** — Core functionality
3. **Test the install** — Run `install.sh` and verify
4. **Use it** — The best test is real usage
5. **Commit** — `git add . && git commit -m "feat: add {name} skill"`

---

*Scaffold saves ~15 minutes of boilerplate per skill.*
