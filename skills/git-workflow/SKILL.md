---
name: git-workflow
description: "Automated git workflows for workspace hygiene — commit, sync, and maintain clean repos. Use when: (1) There are uncommitted changes that need organizing, (2) You need to commit with meaningful messages, (3) You want to sync local changes to remote, (4) Checking repo status across multiple projects."
---

# Git Workflow Skill

Automated git operations for maintaining a clean, organized workspace.

## Quick Actions

### Check Status

```bash
git status
git diff --stat
git log --oneline -5
```

### Smart Commit

Stage and commit with auto-generated message based on changes:

```bash
# Stage all changes including untracked
git add -A

# Commit with descriptive message
git commit -m "<type>: <description>"
```

Commit message types:
- `feat:` — New feature or capability
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code restructuring
- `chore:` — Maintenance tasks
- `wip:` — Work in progress

### Sync to Remote

```bash
git push origin main
```

If branch is behind:
```bash
git pull --rebase origin main
git push origin main
```

## Scripts

### Auto-commit helper

Use `scripts/auto-commit.sh` to intelligently commit based on file patterns:

```bash
./scripts/auto-commit.sh
```

This will:
1. Check for changes
2. Categorize files by type
3. Generate appropriate commit message
4. Commit and optionally push

## Multi-Repo Operations

Check status across all git repos in a directory:

```bash
for dir in */; do
  if [ -d "$dir/.git" ]; then
    echo "=== $dir ==="
    (cd "$dir" && git status --short)
  fi
done
```
