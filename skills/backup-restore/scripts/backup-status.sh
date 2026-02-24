#!/bin/bash
#
# backup-status.sh — Check backup health and statistics
#
# Usage: backup-status.sh
#

set -e

WORKSPACE_ROOT="/root/.openclaw/workspace"
BACKUP_DIR="$WORKSPACE_ROOT/backups"

echo "Backup Status"
echo "============="
echo ""

if [[ ! -d "$BACKUP_DIR" ]]; then
    echo "❌ No backups directory found at $BACKUP_DIR"
    echo ""
    echo "Run backup-now.sh to create your first backup."
    exit 1
fi

# Count backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -maxdepth 1 -type d -name "20*" | wc -l)

if [[ $BACKUP_COUNT -eq 0 ]]; then
    echo "❌ No backups found."
    echo ""
    echo "Run backup-now.sh to create your first backup."
    exit 1
fi

echo "✅ Backups directory exists"
echo "📦 Total backups: $BACKUP_COUNT"
echo ""

# Latest backup info
if [[ -L "$BACKUP_DIR/latest" ]]; then
    LATEST=$(readlink "$BACKUP_DIR/latest")
    LATEST_PATH="$BACKUP_DIR/$LATEST"
    
    echo "Latest Backup: $LATEST"
    echo "-------------"
    
    if [[ -f "$LATEST_PATH/manifest.json" ]]; then
        TIMESTAMP=$(grep '"timestamp"' "$LATEST_PATH/manifest.json" | cut -d'"' -f4 | head -1)
        SIZE=$(grep '"size_human"' "$LATEST_PATH/manifest.json" | cut -d'"' -f4 | head -1)
        FILES=$(grep '"files"' "$LATEST_PATH/manifest.json" | grep -o '[0-9]*' | head -1)
        
        echo "  Created: $TIMESTAMP"
        echo "  Size:    $SIZE"
        echo "  Files:   $FILES"
        
        # Calculate age
        BACKUP_EPOCH=$(date -d "$TIMESTAMP" +%s 2>/dev/null || echo "0")
        NOW_EPOCH=$(date +%s)
        AGE_HOURS=$(( (NOW_EPOCH - BACKUP_EPOCH) / 3600 ))
        AGE_DAYS=$(( AGE_HOURS / 24 ))
        
        if [[ $AGE_DAYS -eq 0 ]]; then
            echo "  Age:     ${AGE_HOURS}h ago (fresh ✅)"
        elif [[ $AGE_DAYS -eq 1 ]]; then
            echo "  Age:     1 day ago (recent ✅)"
        elif [[ $AGE_DAYS -lt 7 ]]; then
            echo "  Age:     $AGE_DAYS days ago (acceptable ⚠️)"
        else
            echo "  Age:     $AGE_DAYS days ago (stale ❌)"
        fi
    else
        echo "  ⚠️  No manifest found"
    fi
else
    echo "⚠️  No 'latest' symlink found"
fi

echo ""

# Disk usage
echo "Storage Usage"
echo "-------------"
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
echo "  Total: $TOTAL_SIZE"

# Available space
AVAILABLE=$(df -h "$BACKUP_DIR" 2>/dev/null | tail -1 | awk '{print $4}')
if [[ -n "$AVAILABLE" ]]; then
    echo "  Free:  $AVAILABLE"
fi

echo ""

# Git remote status
echo "Git Remotes (from latest backup)"
echo "--------------------------------"
if [[ -f "$LATEST_PATH/git-remotes.txt" ]]; then
    cat "$LATEST_PATH/git-remotes.txt" | while read line; do
        echo "  📁 $line"
    done
else
    echo "  No git remotes recorded"
fi

echo ""
echo "Quick Actions"
echo "-------------"
echo "  backup-now.sh        Create new backup"
echo "  backup-list.sh       List all backups"
echo "  backup-restore.sh    Restore from backup"
