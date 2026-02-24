#!/bin/bash
#
# backup-restore.sh — Restore workspace from a backup
#
# Usage: backup-restore.sh [options] <backup-name>
#   --dry-run    Show what would be restored without doing it
#   --force      Skip confirmation prompt
#   --target     Restore to different directory (default: workspace root)
#

set -e

WORKSPACE_ROOT="/root/.openclaw/workspace"
BACKUP_DIR="$WORKSPACE_ROOT/backups"

DRY_RUN=false
FORCE=false
TARGET="$WORKSPACE_ROOT"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run) DRY_RUN=true; shift ;;
        --force) FORCE=true; shift ;;
        --target) TARGET="$2"; shift 2 ;;
        --target=*) TARGET="${1#*=}"; shift ;;
        --help)
            echo "Usage: backup-restore.sh [options] <backup-name>"
            echo ""
            echo "Options:"
            echo "  --dry-run    Show what would be restored"
            echo "  --force      Skip confirmation"
            echo "  --target     Restore to different directory"
            echo ""
            echo "Examples:"
            echo "  backup-restore.sh 2026-02-24_16-56-00"
            echo "  backup-restore.sh --dry-run latest"
            echo "  backup-restore.sh --target /tmp/test-restore 2026-02-24_16-56-00"
            exit 0
            ;;
        -*)
            echo "Unknown option: $1"
            exit 1
            ;;
        *)
            BACKUP_NAME="$1"
            shift
            ;;
    esac
done

# Validate backup name
if [[ -z "$BACKUP_NAME" ]]; then
    echo "❌ Error: No backup specified"
    echo ""
    echo "Available backups:"
    "$(dirname "$0")/backup-list.sh" --compact
    exit 1
fi

# Resolve 'latest' symlink
if [[ "$BACKUP_NAME" == "latest" ]]; then
    if [[ -L "$BACKUP_DIR/latest" ]]; then
        BACKUP_NAME=$(readlink "$BACKUP_DIR/latest")
    else
        echo "❌ Error: No 'latest' backup found"
        exit 1
    fi
fi

BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# Validate backup exists
if [[ ! -d "$BACKUP_PATH" ]]; then
    echo "❌ Error: Backup '$BACKUP_NAME' not found"
    echo ""
    echo "Available backups:"
    "$(dirname "$0")/backup-list.sh" --compact
    exit 1
fi

# Check for archive
ARCHIVE="$BACKUP_PATH/files.tar.gz"
if [[ ! -f "$ARCHIVE" ]]; then
    echo "❌ Error: Archive not found in backup"
    exit 1
fi

# Show backup info
echo "Restore Backup"
echo "=============="
echo ""
echo "Backup:    $BACKUP_NAME"
echo "Archive:   $ARCHIVE"
echo "Target:    $TARGET"
echo ""

if [[ -f "$BACKUP_PATH/manifest.json" ]]; then
    TIMESTAMP=$(grep '"timestamp"' "$BACKUP_PATH/manifest.json" | cut -d'"' -f4 | head -1)
    SIZE=$(grep '"size_human"' "$BACKUP_PATH/manifest.json" | cut -d'"' -f4 | head -1)
    FILES=$(grep '"files"' "$BACKUP_PATH/manifest.json" | grep -o '[0-9]*' | head -1)
    
    echo "Created:   $TIMESTAMP"
    echo "Size:      $SIZE"
    echo "Files:     $FILES"
    echo ""
fi

# Dry run
if [[ "$DRY_RUN" == "true" ]]; then
    echo "DRY RUN - Would restore these files:"
    echo "------------------------------------"
    tar tzf "$ARCHIVE" | head -30
    echo "..."
    echo ""
    echo "Use without --dry-run to perform actual restore."
    exit 0
fi

# Confirmation
if [[ "$FORCE" == "false" ]]; then
    if [[ "$TARGET" == "$WORKSPACE_ROOT" ]]; then
        echo "⚠️  WARNING: This will OVERWRITE files in your workspace!"
        echo ""
    fi
    
    read -p "Proceed with restore? [y/N] " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Restore cancelled."
        exit 0
    fi
    echo ""
fi

# Create target directory if needed
mkdir -p "$TARGET"

# Perform restore
echo "Restoring files..."
cd "$TARGET"
tar xzf "$ARCHIVE" --overwrite

echo ""
echo "✅ Restore complete!"
echo ""

# Show git remotes if available
if [[ -f "$BACKUP_PATH/git-remotes.txt" ]]; then
    echo "Git remotes from backup:"
    cat "$BACKUP_PATH/git-remotes.txt" | while read line; do
        echo "  $line"
    done
    echo ""
    echo "You may need to re-add remotes with: git remote add origin <url>"
fi
