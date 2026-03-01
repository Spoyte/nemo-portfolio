#!/bin/bash
#
# backup-restore — Restore from backup with safety checks
#
# Usage: backup-restore <backup-name> [--dry-run]

set -euo pipefail

WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"
BACKUP_DIR="${BACKUP_DIR:-$WORKSPACE/backups}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[restore]${NC} $1"
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

# Parse arguments
BACKUP_NAME="${1:-}"
DRY_RUN=false

if [[ -z "$BACKUP_NAME" ]]; then
    error "Usage: backup-restore <backup-name> [--dry-run]"
    echo ""
    echo "Available backups:"
    ls -1 "$BACKUP_DIR" 2>/dev/null | grep "^backup_" | sort -r | head -10
    exit 1
fi

if [[ "${2:-}" == "--dry-run" ]]; then
    DRY_RUN=true
fi

# Resolve backup name
if [[ "$BACKUP_NAME" == "latest" ]]; then
    BACKUP_NAME=$(readlink "$BACKUP_DIR/latest" 2>/dev/null || echo "")
    if [[ -z "$BACKUP_NAME" ]]; then
        error "No 'latest' backup found"
        exit 1
    fi
fi

BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# Verify backup exists
if [[ ! -d "$BACKUP_PATH" ]]; then
    error "Backup not found: $BACKUP_NAME"
    echo ""
    echo "Available backups:"
    ls -1 "$BACKUP_DIR" 2>/dev/null | grep "^backup_" | sort -r | head -10
    exit 1
fi

ARCHIVE_FILE="$BACKUP_PATH/files.tar.gz"

if [[ ! -f "$ARCHIVE_FILE" ]]; then
    error "Backup archive not found: $ARCHIVE_FILE"
    exit 1
fi

# Show backup info
log "Backup: $BACKUP_NAME"
if [[ -f "$BACKUP_PATH/manifest.json" ]]; then
    cat "$BACKUP_PATH/manifest.json" | grep -E '"(file_count|total_size|created_at)"' || true
fi

# Safety check: create pre-restore backup
if ! $DRY_RUN; then
    warn "This will overwrite files in your workspace!"
    echo ""
    read -p "Continue? [y/N] " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Restore cancelled"
        exit 0
    fi
    
    # Create safety backup
    log "Creating safety backup first..."
    SAFETY_NAME="pre-restore-$(date +%s)"
    SAFETY_PATH="$BACKUP_DIR/$SAFETY_NAME"
    mkdir -p "$SAFETY_PATH"
    
    # Quick backup of current state (just git-tracked files if possible)
    if [[ -d "$WORKSPACE/.git" ]]; then
        git -C "$WORKSPACE" ls-files 2>/dev/null | tar -czf "$SAFETY_PATH/files.tar.gz" -C "$WORKSPACE" -T - 2>/dev/null || {
            warn "Could not create safety backup"
        }
    fi
    
    if [[ -f "$SAFETY_PATH/files.tar.gz" ]]; then
        log "Safety backup created: $SAFETY_NAME"
    fi
fi

# Perform restore
if $DRY_RUN; then
    log "Dry run - would restore from: $ARCHIVE_FILE"
    log "Contents preview:"
    tar -tzf "$ARCHIVE_FILE" | head -20
    log "... (use tar -tzf to see full list)"
else
    log "Restoring files..."
    
    # Extract to temp first, then move (safer)
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT
    
    tar -xzf "$ARCHIVE_FILE" -C "$TEMP_DIR"
    
    # Show what will be restored
    log "Files to restore:"
    find "$TEMP_DIR" -type f | head -20
    
    # Copy files back to workspace
    cp -r "$TEMP_DIR"/* "$WORKSPACE/" 2>/dev/null || true
    
    success "Restore complete!"
    
    # Restore git remotes if available
    if [[ -f "$BACKUP_PATH/git-remotes.txt" ]]; then
        log "Git remotes from backup:"
        cat "$BACKUP_PATH/git-remotes.txt"
    fi
fi
