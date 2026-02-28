---
name: backup-restore
description: "Automated backup and restore operations for workspace data protection. Use when: (1) Creating backups before major changes, (2) Migrating to a new machine, (3) Recovering from data loss, (4) Setting up automated backup schedules."
---

# Backup & Restore

Automated backup and restore operations for the workspace. Protects against data loss and enables easy migration.

## Philosophy

Backups should be:
- **Automatic** — Set it and forget it
- **Incremental** — Only changed files, not full copies every time
- **Tested** — A backup you can't restore is worthless
- **Rotated** — Old backups age out automatically
- **Portable** — Easy to move between machines

## Quick Commands

```bash
# Create a backup now
skills/backup-restore/scripts/backup-now.sh

# List available backups
skills/backup-restore/scripts/backup-list.sh

# Restore from a backup
skills/backup-restore/scripts/backup-restore.sh 2026-02-24_16-56-00

# Check backup status (size, age, health)
skills/backup-restore/scripts/backup-status.sh
```

## What Gets Backed Up

**Included:**
- All source code (projects/, app/, components/, lib/)
- Configuration files (.json, .ts, .js configs)
- Documentation (*.md files)
- Skills (skills/)
- Memory files (memory/)
- Identity files (SOUL.md, USER.md, etc.)

**Excluded:**
- node_modules/ (reinstallable)
- .git/ directories (use git push for code history)
- Build artifacts (dist/, .next/, build/)
- Logs (logs/, *.log)
- Cache directories (.cache/)

## Backup Structure

```
backups/
├── 2026-02-24_16-56-00/          # Timestamped backup
│   ├── manifest.json              # What was backed up, when, by whom
│   ├── files.tar.gz              # Compressed file archive
│   └── git-remotes.txt           # List of git remotes for restoration
├── 2026-02-24_12-30-15/
│   └── ...
└── latest -> 2026-02-24_16-56-00  # Symlink to most recent
```

## Manifest Format

Each backup includes a `manifest.json`:

```json
{
  "timestamp": "2026-02-24T16:56:00+08:00",
  "hostname": "iv-yefu9j2by88lu7j8nb9b",
  "version": "1.0.0",
  "stats": {
    "files": 142,
    "size_bytes": 1524000,
    "size_human": "1.5 MB"
  },
  "exclusions": ["node_modules", ".git", "dist"],
  "git_remotes": {
    "origin": "https://github.com/user/repo.git"
  }
}
```

## Rotation Policy

By default, backups are kept:
- All backups from last 7 days
- One backup per week for 4 weeks
- One backup per month thereafter

Run `backup-now.sh --prune` to apply rotation and free space.

## Restoration Process

1. List available backups: `backup-list.sh`
2. Preview what will be restored: `backup-restore.sh --dry-run <backup>`
3. Perform restore: `backup-restore.sh <backup>`
4. Verify: `backup-status.sh`

## Automation

Add to crontab for automatic daily backups:

```cron
# Daily backup at 3 AM
0 3 * * * cd /root/.openclaw/workspace && skills/backup-restore/scripts/backup-now.sh --quiet

# Weekly prune on Sundays
0 4 * * 0 cd /root/.openclaw/workspace && skills/backup-restore/scripts/backup-now.sh --prune --quiet
```

Or use the OpenClaw cron system:

```bash
openclaw cron add --name "daily-backup" \
  --schedule "0 3 * * *" \
  --command "skills/backup-restore/scripts/backup-now.sh --quiet"
```

## Disaster Recovery

If the entire workspace is lost:

1. Clone any git repository to get the skill scripts
2. Run `backup-restore.sh` with a backup path or URL
3. Restore git remotes and push to re-establish remote backup

## Version History

- 1.0.0 — Initial skill with backup/restore/list/status commands
