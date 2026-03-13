---
name: workspace-intel
description: "Workspace intelligence dashboard. Use when: (1) getting an overview of workspace state, (2) checking project git status, (3) discovering available skills, (4) understanding recent activity."
---

# Workspace Intel

Unified dashboard for workspace intelligence — projects, skills, git status, and activity in one view.

## Quick Actions

```bash
workspace-intel              # Full dashboard overview
workspace-intel --skills     # List all skills with descriptions
workspace-intel --projects   # Projects with git status
workspace-intel --git        # Git summary across all projects
```

## Commands

### Full Dashboard

```bash
workspace-intel
```

Shows:
- 📊 Workspace stats (skills, projects, memory entries)
- 🌿 Git status summary (clean, dirty, pushable)
- ⚡ Quick action commands

### Skills Overview

```bash
workspace-intel --skills
```

Lists all skills with descriptions extracted from SKILL.md frontmatter.

### Projects Status

```bash
workspace-intel --projects
```

Shows all projects with:
- Current git branch
- Clean/dirty status
- Commits ahead/behind upstream

### Git Summary

```bash
workspace-intel --git
```

Aggregated git statistics across all projects:
- Clean repositories
- Uncommitted changes
- Ready to push
- No git tracking

## Use Cases

**Starting the day:**
```bash
workspace-intel
```
Quick overview of what needs attention.

**Before committing:**
```bash
workspace-intel --projects
```
See which projects have uncommitted changes.

**Discovering capabilities:**
```bash
workspace-intel --skills
```
Browse available skills and their purposes.

## Design Principles

1. **At-a-glance** — Key info in seconds
2. **Action-oriented** — Shows what needs doing
3. **Discoverable** — Surfaces forgotten projects/skills
4. **Low noise** — Clean formatting, color-coded status
5. **Fast** — No network calls, local only

## Conventions

- Green ✓ = clean, up-to-date
- Red ✗ = uncommitted changes
- Yellow ↑ = commits ready to push
- Yellow ↓ = behind upstream
- Dim - = no git or no info
