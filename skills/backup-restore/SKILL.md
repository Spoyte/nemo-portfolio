---
name: backup-restore
description: "Data protection & migration. Use when: (1) before major changes, (2) disaster recovery, (3) migration, (4) periodic safety backups."
---

# backup-restore

Automated backups with rotation and safe restoration.

## Quick Actions

```bash
backup-now              # Create backup now
backup-status           # Check backup health
backup-list             # List available backups
backup-restore <name>   # Restore from backup (with safety backup)
```

## Features

- **Timestamped backups** — Named with ISO timestamp
- **Automatic rotation** — Keeps 7 most recent backups
- **Manifest tracking** — JSON metadata for each backup
- **Compression** — tar.gz with smart exclusions
- **Safety restore** — Creates pre-restore backup automatically
- **Git remote preservation** — Saves remotes for restoration

## What's Included

- Source code (all tracked files)
- Configuration files
- Documentation
- Skills and scripts
- Memory files

## What's Excluded

- node_modules
- .git directory
- Build artifacts (.next, dist, build)
- Log files
- Temporary files
- Other backups

## Backup Structure

```
backups/
├── backup_2026-03-02_05-30-00/
│   ├── manifest.json       # Metadata
│   ├── files.tar.gz        # Compressed archive
│   └── git-remotes.txt     # For restoration
├── backup_2026-03-01_...
└── latest -> backup_...    # Symlink to newest
```

## Safety First

The restore command:
1. Shows what will be restored
2. Asks for confirmation
3. Creates a safety backup first
4. Then performs the restore
5. Shows git remotes from backup

## Exit Codes

- `0` — Success
- `1` — Error (no backups, restore failed)
