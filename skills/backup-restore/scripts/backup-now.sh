#!/bin/bash
#
# backup-now — Create timestamped backup with manifest
#
# Usage: backup-now [--dry-run]

set -euo pipefail

WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"
BACKUP_DIR="${BACKUP_DIR:-$WORKSPACE/backups}"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_NAME="backup_$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[backup]${NC} $1"
}

error() {
    echo -e "${RED}[error]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[success]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[warn]${NC} $1"
}

# Ensure backup directory exists
if [[ ! -d "$BACKUP_DIR" ]]; then
    if $DRY_RUN; then
        log "Would create backup directory: $BACKUP_DIR"
    else
        mkdir -p "$BACKUP_DIR"
        log "Created backup directory: $BACKUP_DIR"
    fi
fi

# Collect files to backup
log "Scanning workspace..."

# Build find command - exclude patterns
EXCLUDE_PATTERNS=(
    -name "node_modules" -prune -o
    -name ".git" -prune -o
    -name "__pycache__" -prune -o
    -name "*.log" -prune -o
    -name ".next" -prune -o
    -name "dist" -prune -o
    -name "build" -prune -o
    -name "*.tmp" -prune -o
    -name "*.temp" -prune -o
)

# Find all files (not directories) to backup
FILES=$(find "$WORKSPACE" -type f "${EXCLUDE_PATTERNS[@]}" -print 2>/dev/null | grep -v "^$WORKSPACE/backups" || true)
FILE_COUNT=$(echo "$FILES" | grep -c "^" || echo "0")
TOTAL_SIZE=$(echo "$FILES" | xargs -I {} stat -c %s {} 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo "0")

# Convert bytes to human readable
human_readable() {
    local bytes=$1
    if [[ $bytes -lt 1024 ]]; then
        echo "${bytes}B"
    elif [[ $bytes -lt 1048576 ]]; then
        echo "$(echo "scale=1; $bytes/1024" | bc)KB"
    elif [[ $bytes -lt 1073741824 ]]; then
        echo "$(echo "scale=1; $bytes/1048576" | bc)MB"
    else
        echo "$(echo "scale=1; $bytes/1073741824" | bc)GB"
    fi
}

log "Found $FILE_COUNT files ($(human_readable $TOTAL_SIZE))"

if $DRY_RUN; then
    log "Dry run - would create backup: $BACKUP_NAME"
    echo "$FILES" | head -20
    if [[ $FILE_COUNT -gt 20 ]]; then
        log "... and $((FILE_COUNT - 20)) more files"
    fi
    exit 0
fi

# Create backup directory
mkdir -p "$BACKUP_PATH"

# Save git remotes for restoration
if [[ -d "$WORKSPACE/.git" ]]; then
    git -C "$WORKSPACE" remote -v > "$BACKUP_PATH/git-remotes.txt" 2>/dev/null || true
fi

# Create tar.gz archive
log "Creating archive..."
ARCHIVE_FILE="$BACKUP_PATH/files.tar.gz"
echo "$FILES" | tar -czf "$ARCHIVE_FILE" -T - 2>/dev/null || {
    error "Failed to create archive"
    rm -rf "$BACKUP_PATH"
    exit 1
}

ARCHIVE_SIZE=$(stat -c %s "$ARCHIVE_FILE" 2>/dev/null || echo "0")

# Create manifest
cat > "$BACKUP_PATH/manifest.json" << EOF
{
  "name": "$BACKUP_NAME",
  "timestamp": "$TIMESTAMP",
  "created_at": "$(date -Iseconds)",
  "file_count": $FILE_COUNT,
  "total_size_bytes": $TOTAL_SIZE,
  "archive_size_bytes": $ARCHIVE_SIZE,
  "compression_ratio": "$(echo "scale=2; $TOTAL_SIZE / $ARCHIVE_SIZE" | bc 2>/dev/null || echo "N/A")",
  "workspace": "$WORKSPACE",
  "hostname": "$(hostname)",
  "user": "$(whoami)"
}
EOF

# Update 'latest' symlink
ln -sfn "$BACKUP_NAME" "$BACKUP_DIR/latest"

# Cleanup old backups (keep 7 daily, 4 weekly, monthly)
log "Rotating old backups..."

# Get list of backups sorted by date
BACKUPS=($(ls -1 "$BACKUP_DIR" | grep "^backup_" | sort -r))
BACKUP_COUNT=${#BACKUPS[@]}

if [[ $BACKUP_COUNT -gt 7 ]]; then
    # Keep first 7 (most recent daily)
    TO_DELETE=()
    
    # Simple rotation: keep 7 most recent
    for ((i=7; i<BACKUP_COUNT; i++)); do
        OLD_BACKUP="$BACKUP_DIR/${BACKUPS[$i]}"
        if [[ -d "$OLD_BACKUP" ]]; then
            rm -rf "$OLD_BACKUP"
            log "Removed old backup: ${BACKUPS[$i]}"
        fi
    done
fi

success "Backup complete: $BACKUP_NAME"
log "Files: $FILE_COUNT | Size: $(human_readable $TOTAL_SIZE) → $(human_readable $ARCHIVE_SIZE)"
log "Location: $BACKUP_PATH"
