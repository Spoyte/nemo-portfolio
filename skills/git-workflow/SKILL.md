---
name: git-workflow
description: "Automated git operations for workspace hygiene and multi-repo management. Use when: (1) committing changes with consistent style, (2) syncing across multiple repositories, (3) checking repo status at a glance."
---

# git-workflow

Automated git operations with consistent commit style and multi-repository management.

## Quick Actions

```bash
# Single-repo operations
git-commit                    # Interactive commit with type selection
git-commit "Fixed the bug"    # Quick commit with message
git-commit -t feat -p "Add feature"  # Type + auto-push

# Multi-repo operations
git-repos status              # Overview of all repos
git-repos dirty               # Only repos with changes
git-repos commit "Daily sync" # Commit everywhere
git-repos push                # Push all repos
git-repos pull                # Pull latest everywhere
git-repos list                # List all discovered repos
```

## Conventions

- **Commit types:** feat, fix, docs, refactor, chore, wip
- **Auto-staging:** `git-commit` adds all changes automatically
- **Discovery:** `git-repos` finds all repos under `$HOME`
- **Safety:** No destructive operations without explicit flags

## Commit Types

| Type | Use For |
|------|---------|
| feat | New features, capabilities |
| fix | Bug fixes |
| docs | Documentation changes |
| refactor | Code restructuring |
| chore | Maintenance, cleanup |
| wip | Work in progress |

## Examples

**Daily workflow:**
```bash
git-repos dirty          # See what needs attention
git-commit "Fix auth"    # Commit current repo
git-repos push           # Push everything
```

**Batch operations:**
```bash
git-repos commit "Update deps"  # Commit in all dirty repos
git-repos push                  # Push all
```
