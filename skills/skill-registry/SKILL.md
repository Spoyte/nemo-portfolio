---
name: skill-registry
description: "Discover and manage workspace skills. Use when: (1) You need to find what skills exist, (2) You want to understand what a skill does, (3) You're creating a new skill and need conventions, (4) You need to list available capabilities."
---

# Skill Registry

Central index for all workspace skills. Skills are reusable capabilities organized in `/skills/`.

## Available Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| [git-workflow](./git-workflow/SKILL.md) | Automated git operations | Committing, syncing, repo hygiene |
| [skill-registry](./skill-registry/SKILL.md) | Skill discovery & management | Finding capabilities, creating new skills |

## Skill Structure

Each skill lives in `/skills/<skill-name>/`:

```
skills/
└── <skill-name>/
    ├── SKILL.md          # Documentation, usage, conventions
    └── scripts/          # Optional: executable helpers
        └── *.sh
```

## Creating a New Skill

1. **Create directory**: `mkdir skills/<skill-name>`
2. **Write SKILL.md**: Include frontmatter + documentation
3. **Add scripts** (optional): Put helpers in `scripts/`
4. **Register it**: Add to the table above

### SKILL.md Template

```markdown
---
name: <skill-name>
description: "What this skill does. Use when: (1) situation 1, (2) situation 2."
---

# <Skill Name>

Brief description of what this skill provides.

## Quick Actions

### Common Task

```bash
# Example commands
```

## Conventions

- Rule 1
- Rule 2
```

## Discovering Skills

### List All Skills

```bash
ls -la /root/.openclaw/workspace/skills/
```

### Read a Skill

```bash
cat /root/.openclaw/workspace/skills/<skill-name>/SKILL.md
```

### Quick Skill Summary

```bash
# Extract names and descriptions
grep -A1 "^name:" /root/.openclaw/workspace/skills/*/SKILL.md 2>/dev/null | grep -v "^--$"
```

## Skill Philosophy

- **Single responsibility**: Each skill does one thing well
- **Self-documenting**: SKILL.md explains everything
- **Action-oriented**: Focus on what you can do, not just theory
- **Discoverable**: Clear naming, obvious location

---

*Last updated: 2026-02-24*
