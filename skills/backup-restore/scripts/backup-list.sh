#!/bin/bash
#
# backup-list — List available backups
#
# Usage: backup-list [--all]

set -euo pipefail

WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"
BACKUP_DIR="${BACKUP_DIR:-$WORKSPACE/backups}"

SHOW_ALL=false
if [[ "${1:-}" == "--all" ]]; then
    SHOW_ALL=true
fi

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [[ ! -d "$BACKUP_DIR" ]]; then
    echo "No backup directory found"
    exit 1
fi

BACKUPS=($(ls -1 "$BACKUP_DIR" 2>/dev/null | grep "^backup_" | sort -r))

if [[ ${#BACKUPS[@]} -eq 0 ]]; then
    echo "No backups found"
    exit 1
fi

echo -e "${BLUE}Available Backups:${NC}"
echo ""

for backup in "${BACKUPS[@]}"; do
    BACKUP_PATH="$BACKUP_DIR/$backup"
    MANIFEST="$BACKUP_PATH/manifest.json"
    
    # Parse date
    DATE_STR=$(echo "$backup" | sed 's/backup_//; s/_/ /; s/-/:/3g; s/-/:/4g')
    TIMESTAMP=$(date -d "$DATE_STR" +%s 2>/dev/null || echo "0")
    NOW=$(date +%s)
    AGE_DAYS=$(( (NOW - TIMESTAMP) / 86400 ))
    
    # Get info from manifest
    if [[ -f "$MANIFEST" ]]; then
        FILE_COUNT=$(grep -o '"file_count": [0-9]*' "$MANIFEST" | grep -o '[0-9]*' || echo "0")
        ARCHIVE_SIZE=$(grep -o '"archive_size_bytes": [0-9]*' "$MANIFEST" | grep -o '[0-9]*' || echo "0")
    else
        FILE_COUNT="?"
        ARCHIVE_SIZE="0"
    fi
    
    # Human readable size
    human_readable() {
        local bytes=$1
        if [[ $bytes -lt 1048576 ]]; then
            echo "$(echo "scale=1; $bytes/1024" | bc 2>/dev/null || echo "0")KB"
        elif [[ $bytes -lt 1073741824 ]]; then
            echo "$(echo "scale=1; $bytes/1048576" | bc 2>/dev/null || echo "0")MB"
        else
            echo "$(echo "scale=1; $bytes/1073741824" | bc 2>/dev/null || echo "0")GB"
        fi
    }
    
    # Show age indicator
    if [[ $AGE_DAYS -eq 0 ]]; then
        AGE_INDICATOR="${GREEN}today${NC}"
    elif [[ $AGE_DAYS -eq 1 ]]; then
        AGE_INDICATOR="${GREEN}1d${NC}"
    elif [[ $AGE_DAYS -lt 7 ]]; then
        AGE_INDICATOR="${YELLOW}${AGE_DAYS}d${NC}"
    else
        AGE_INDICATOR="${AGE_DAYS}d"
    fi
    
    # Mark latest
    if [[ "$backup" == "$(readlink "$BACKUP_DIR/latest" 2>/dev/null || echo "")" ]]; then
        MARKER="${GREEN}→${NC}"
    else
        MARKER=" "
    fi
    
    printf "%s %-25s %6s  %6s files  %6s\n" "$MARKER" "$backup" "$AGE_INDICATOR" "$FILE_COUNT" "$(human_readable $ARCHIVE_SIZE)"
done

echo ""
echo "To restore: backup-restore <backup-name>"
