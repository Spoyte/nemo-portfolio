#!/bin/bash
#
# backup-now.sh — Create a timestamped backup of the workspace
#
# Usage: backup-now.sh [options]
#   --prune      Apply rotation policy after backup
#   --quiet      Suppress output (for cron)
#   --dry-run    Show what would be backed up without doing it
#

set -e

# Configuration
WORKSPACE_ROOT="/root/.openclaw/workspace"
BACKUP_DIR="$WORKSPACE_ROOT/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_NAME="$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# Parse arguments
PRUNE=false
QUIET=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --prune) PRUNE=true; shift ;;
        --quiet) QUIET=true; shift ;;
        --dry-run) DRY_RUN=true; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Logging function
log() {
    if [[ "$QUIET" == "false" ]]; then
        echo "[$(date '+%H:%M:%S')] $1"
    fi
}

# Create backup directory
if [[ "$DRY_RUN" == "false" ]]; then
    mkdir -p "$BACKUP_PATH"
fi

log "Starting backup: $BACKUP_NAME"

# Build exclusion list
EXCLUDES=(
    "node_modules"
    ".git"
    "dist"
    ".next"
    "build"
    "out"
    "*.log"
    "logs/*"
    ".cache"
    "__pycache__"
    ".pytest_cache"
    "*.pyc"
    "backups"  # Don't backup the backups
)

# Build tar exclude arguments
TAR_EXCLUDES=""
for exclude in "${EXCLUDES[@]}"; do
    TAR_EXCLUDES="$TAR_EXCLUDES --exclude=$exclude"
done

# Count files and calculate size
if [[ "$DRY_RUN" == "true" ]]; then
    log "DRY RUN - Would backup:"
    find "$WORKSPACE_ROOT" -type f \
        $(for e in "${EXCLUDES[@]}"; do echo "-not -path \"*/$e/*\""; done | tr '\n' ' ') \
        2>/dev/null | head -20
    log "... (and more files)"
    exit 0
fi

# Create the archive
log "Creating archive..."
cd "$WORKSPACE_ROOT"
tar czf "$BACKUP_PATH/files.tar.gz" $TAR_EXCLUDES . 2>/dev/null || true

# Get archive stats
FILE_COUNT=$(tar tzf "$BACKUP_PATH/files.tar.gz" 2>/dev/null | wc -l)
SIZE_BYTES=$(stat -f%z "$BACKUP_PATH/files.tar.gz" 2>/dev/null || stat -c%s "$BACKUP_PATH/files.tar.gz" 2>/dev/null || echo "0")
SIZE_HUMAN=$(numfmt --to=iec-i --suffix=B "$SIZE_BYTES" 2>/dev/null || echo "${SIZE_BYTES}B")

# Collect git remotes
declare -A GIT_REMOTES
cd "$WORKSPACE_ROOT"
for gitdir in $(find . -name ".git" -type d 2>/dev/null | head -10); do
    repo_path=$(dirname "$gitdir")
    remote_url=$(cd "$repo_path" && git remote get-url origin 2>/dev/null || echo "")
    if [[ -n "$remote_url" ]]; then
        GIT_REMOTES["$repo_path"]="$remote_url"
    fi
done

# Create manifest
cat > "$BACKUP_PATH/manifest.json" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "hostname": "$(hostname)",
  "version": "1.0.0",
  "stats": {
    "files": $FILE_COUNT,
    "size_bytes": $SIZE_BYTES,
    "size_human": "$SIZE_HUMAN"
  },
  "exclusions": [$(printf '"%s",' "${EXCLUDES[@]}" | sed 's/,$//')],
  "git_remotes": {
$(for key in "${!GIT_REMOTES[@]}"; do echo "    \"$key\": \"${GIT_REMOTES[$key]}\","; done | sed '$s/,$//')
  }
}
EOF

# Create git-remotes.txt for easy reference
for key in "${!GIT_REMOTES[@]}"; do
    echo "$key: ${GIT_REMOTES[$key]}"
done > "$BACKUP_PATH/git-remotes.txt"

# Update latest symlink
rm -f "$BACKUP_DIR/latest"
ln -s "$BACKUP_NAME" "$BACKUP_DIR/latest"

log "Backup complete: $BACKUP_NAME"
log "  Files: $FILE_COUNT"
log "  Size: $SIZE_HUMAN"

# Prune old backups if requested
if [[ "$PRUNE" == "true" ]]; then
    log "Pruning old backups..."
    
    # Keep last 7 days
    find "$BACKUP_DIR" -maxdepth 1 -type d -name "20*" -mtime +7 | while read -r old_backup; do
        # Keep weekly backups for 4 weeks
        backup_date=$(basename "$old_backup" | cut -d'_' -f1)
        day_of_week=$(date -d "$backup_date" +%u 2>/dev/null || echo "1")
        
        # If it's not a Sunday (day 7), and older than 7 days, remove it
        if [[ "$day_of_week" != "7" ]]; then
            rm -rf "$old_backup"
            log "  Removed: $(basename "$old_backup")"
        fi
    done
    
    # Keep only 4 weekly backups
    find "$BACKUP_DIR" -maxdepth 1 -type d -name "20*" -mtime +28 | while read -r old_backup; do
        rm -rf "$old_backup"
        log "  Removed: $(basename "$old_backup")"
    done
fi

log "Done."
