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

### auto-commit.sh

Intelligent commit helper that suggests commit messages based on changes.

```bash
./scripts/auto-commit.sh
```

### multi-repo.sh

Bulk git operations across all workspace repositories.

```bash
# Show status overview of all repos
./scripts/multi-repo.sh status

# See only repos with uncommitted changes
./scripts/multi-repo.sh dirty

# Commit all changes across all repos with one message
./scripts/multi-repo.sh commit "your message"

# Push all repos with unpushed commits
./scripts/multi-repo.sh push

# Pull latest changes everywhere
./scripts/multi-repo.sh pull

# List all discovered repositories
./scripts/multi-repo.sh list
```
