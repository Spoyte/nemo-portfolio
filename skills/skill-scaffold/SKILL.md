---
name: skill-scaffold
description: "Unified skill management interface. Use when: (1) creating new skills, (2) listing skills, (3) viewing skill details, (4) editing or deleting skills."
---

# Skill Scaffold

Unified interface for skill management — create, list, show, edit, and delete skills.

## Quick Actions

```bash
skill list                    # List all skills
skill new my-skill "Description"   # Create new skill
skill show art-new            # Show skill details
skill edit health-monitor     # Open in $EDITOR
skill delete old-skill        # Remove (with confirmation)
```

## Commands

### skill list

List all available skills.

```bash
skill list              # Full list with descriptions
skill list -q           # Names only
skill list -v           # Verbose with paths
```

### skill new

Create a new skill from template.

```bash
skill new backup "Backup operations"
skill new git-sync "Git synchronization"
```

### skill show

Display skill documentation.

```bash
skill show art-new      # Show art-new docs
skill show health       # Partial match works
```

### skill edit

Open skill files in $EDITOR.

```bash
skill edit my-skill     # Opens SKILL.md
```

### skill delete

Remove a skill (with confirmation).

```bash
skill delete old-skill  # Confirm before removal
```

## Design Principles

1. **Unified interface** — One command for all operations
2. **Self-documenting** — `--help` explains everything
3. **Scripting-friendly** — Exit codes, quiet mode
4. **Safe deletion** — Confirmation required, moves to trash
5. **Low friction** — Scaffold in 30 seconds

## Conventions

- Kebab-case names: `my-skill`, not `mySkill`
- Self-contained in `skills/<name>/`
- SKILL.md required for documentation
- Executable at `skills/<name>/<name>`
