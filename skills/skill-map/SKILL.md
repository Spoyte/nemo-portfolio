---
name: skill-map
description: "Visualize the skill ecosystem — tree view, health check, dependency graph. Use when: (1) understanding skill relationships, (2) auditing skill health, (3) generating documentation diagrams."
---

# skill-map

Visualize the skill ecosystem — relationships, health, and structure.

## Quick Actions

```bash
skill-map              # Visual tree of all skills
skill-map --health     # Health check with status colors
skill-map --deps       # Show skill dependencies  
skill-map --graph      # DOT format for graphviz
```

## Categories

| Icon | Category | Skills |
|------|----------|--------|
| 🎨 | Creative | art-audit, art-ideate, art-new, art-sync, art-test, art-thumbnails |
| ⚙️ | Development | git-workflow, skill-scaffold, skill-registry, skill-runner, shell-translate |
| 🔧 | System | backup-restore, health-monitor, env-diff |
| 🧠 | Knowledge | memory-log, portfolio-insights |

## Health Check

Shows status for each skill:
- ✓ Healthy — SKILL.md and executable present
- ✗ Issues — missing docs, broken symlinks, no executable

## Dependencies

Skills form a self-referential ecosystem:
- skill-runner discovers all skills via SKILL.md
- skill-scaffold uses registry conventions
- health-monitor checks SKILL.md consistency
- backup-restore captures all skills
- git-workflow manages skill commits

## Graph Output

Generate visual diagrams with graphviz:

```bash
skill-map --graph | dot -Tpng -o skills.png
```
