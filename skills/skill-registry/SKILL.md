---
name: skill-registry
description: "Skill discovery and management. Use when: (1) listing available skills, (2) reading skill documentation, (3) creating new skills from template."
---

# Skill Registry

Central index and management system for all workspace skills.

## Quick Actions

```bash
skills-list              # List all skills with descriptions
skill-info <name>        # Read full documentation for a skill
skill-create <name> "Description"  # Scaffold a new skill
```

## Commands

### skills-list

List all available skills in the workspace.

```bash
skills-list              # Full list with descriptions
skills-list -q           # Names only (for scripting)
skills-list -v           # Verbose with file paths
```

**Output format:**
```
art-ideate      Algorithm ideation engine
art-new         Scaffold new art algorithms
art-test        Validate generators
...
```

### skill-info

Read the SKILL.md documentation for a specific skill.

```bash
skill-info art-new       # Show art-new documentation
skill-info health        # Works with partial matches
```

**Features:**
- Fuzzy matching ("health" matches "health-monitor")
- Shows full SKILL.md with examples
- Exit code 1 if skill not found

### skill-create

Scaffold a new skill with proper structure.

```bash
skill-create my-skill "My Skill Description"
skill-create backup "Backup and restore operations"
```

**Creates:**
```
skills/
└── my-skill/
    ├── SKILL.md          # Documentation template
    └── my-skill          # Executable stub
```

**SKILL.md template includes:**
- Frontmatter (name, description)
- Quick Actions section
- Usage examples
- Conventions section

## Skill Structure

All skills follow this convention:

```
skills/
└── <skill-name>/
    ├── SKILL.md          # Required: Documentation + frontmatter
    ├── <skill-name>      # Required: Main executable
    └── scripts/          # Optional: Helper scripts
        └── *.sh
```

**SKILL.md frontmatter:**
```yaml
---
name: skill-name
description: "What this does. Use when: (1) situation 1, (2) situation 2."
---
```

## Conventions

- **Kebab-case names** — `my-skill`, not `mySkill` or `my_skill`
- **Self-documenting** — SKILL.md explains everything
- **Single responsibility** — Each skill does one thing well
- **Action-oriented** — Focus on what you can do
- **Discoverable** — Clear naming, obvious location

## Meta

This skill manages other skills. It's the foundation of the skill ecosystem.
