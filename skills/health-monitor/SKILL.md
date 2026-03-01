---
name: health-monitor
description: "System & workspace health monitoring. Use when: (1) checking system status, (2) CI/CD gates, (3) identifying issues, (4) auto-fixing problems."
---

# health-monitor

Plugin-based health monitoring for system resources and workspace hygiene.

## Quick Actions

```bash
health              # Full report
health --check      # Quick status (issues only)
health --json       # JSON output
health --quiet      # Exit codes only
health --fix        # Auto-fix issues
health --system     # System resources only
health --workspace  # Workspace health only
```

## Exit Codes

- `0` — All healthy
- `1` — Critical issues
- `2` — Warnings only

## System Checks

| Check | Description | Thresholds |
|-------|-------------|------------|
| `system.disk` | Disk usage | Warn: 80%, Critical: 90% |
| `system.memory` | Memory usage | Warn: 85%, Critical: 95% |
| `system.load` | Load average | Warn: 4.0, Critical: 8.0 |

## Workspace Checks

| Check | Description | Auto-fixable |
|-------|-------------|--------------|
| `workspace.git` | Uncommitted changes | Yes |
| `workspace.repos` | Git status across repos | No |
| `workspace.memory` | Recent memory file activity | No |
| `workspace.backup` | Backup freshness | Yes |
| `workspace.skills` | SKILL.md consistency | No |
| `workspace.skill_gaps` | Scripts that could be skills | No |
| `workspace.trend` | Health trend analysis | No |

## Auto-fix Behavior

When `--fix` is passed:
- **Git**: Auto-commits safe files (memory/, skills/, *.md)
- **Backup**: Creates backup/ directory if missing
- **Memory**: Creates memory/ directory if missing

## Design Principles

1. **Fail fast** — Exit codes for scripting
2. **Quiet mode** — Machine-readable when needed
3. **Actionable** — Each issue suggests a fix
4. **Conservative** — Warnings don't block, critical does
