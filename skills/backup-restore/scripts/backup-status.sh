#!/bin/bash
#
# backup-status — Check backup health and freshness
#
# Usage: backup-status [--json]

set -euo pipefail

WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"
BACKUP_DIR="${BACKUP_DIR:-$WORKSPACE/backups}"

JSON_OUTPUT=false
if [[ "${1:-}" == "--json" ]]; then
    JSON_OUTPUT=true
fi

# Colors (only for non-JSON)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Status indicators
CHECK="✓"
CROSS="✗"
WARN="⚠"

# Check if backup directory exists
if [[ ! -d "$BACKUP_DIR" ]]; then
    if $JSON_OUTPUT; then
        echo '{"status": "no_backups", "backups": [], "latest": null}'
    else
        echo -e "${CROSS} No backup directory found"
        echo "  Run: backup-now"
    fi
    exit 0
fi

# Find all backups
BACKUPS=($(ls -1 "$BACKUP_DIR" 2>/dev/null | grep "^backup_" | sort -r))
BACKUP_COUNT=${#BACKUPS[@]}

if [[ $BACKUP_COUNT -eq 0 ]]; then
    if $JSON_OUTPUT; then
        echo '{"status": "no_backups", "backups": [], "latest": null}'
    else
        echo -e "${CROSS} No backups found"
        echo "  Run: backup-now"
    fi
    exit 0
fi

# Get latest backup
LATEST="${BACKUPS[0]}"
LATEST_PATH="$BACKUP_DIR/$LATEST"

# Parse timestamp from backup name (backup_YYYY-MM-DD_HH-MM-SS)
LATEST_DATE=$(echo "$LATEST" | sed 's/backup_//; s/_/ /; s/-/:/3g; s/-/:/4g')
LATEST_TIMESTAMP=$(date -d "$LATEST_DATE" +%s 2>/dev/null || echo "0")
NOW=$(date +%s)
AGE_SECONDS=$((NOW - LATEST_TIMESTAMP))
AGE_DAYS=$((AGE_SECONDS / 86400))
AGE_HOURS=$((AGE_SECONDS / 3600))

# Determine status
if [[ $AGE_DAYS -eq 0 ]]; then
    if [[ $AGE_HOURS -lt 6 ]]; then
        STATUS="fresh"
        STATUS_EMOJI="$CHECK"
        STATUS_COLOR="$GREEN"
    else
        STATUS="recent"
        STATUS_EMOJI="$CHECK"
        STATUS_COLOR="$GREEN"
    fi
elif [[ $AGE_DAYS -lt 3 ]]; then
    STATUS="stale"
    STATUS_EMOJI="$WARN"
    STATUS_COLOR="$YELLOW"
else
    STATUS="old"
    STATUS_EMOJI="$CROSS"
    STATUS_COLOR="$RED"
fi

# Get manifest info if available
MANIFEST="$LATEST_PATH/manifest.json"
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
    if [[ $bytes -lt 1024 ]]; then
        echo "${bytes}B"
    elif [[ $bytes -lt 1048576 ]]; then
        echo "$(echo "scale=1; $bytes/1024" | bc 2>/dev/null || echo "0")KB"
    elif [[ $bytes -lt 1073741824 ]]; then
        echo "$(echo "scale=1; $bytes/1048576" | bc 2>/dev/null || echo "0")MB"
    else
        echo "$(echo "scale=1; $bytes/1073741824" | bc 2>/dev/null || echo "0")GB"
    fi
}

# Output
if $JSON_OUTPUT; then
    cat << EOF
{
  "status": "$STATUS",
  "backup_count": $BACKUP_COUNT,
  "latest": {
    "name": "$LATEST",
    "age_days": $AGE_DAYS,
    "age_hours": $AGE_HOURS,
    "file_count": ${FILE_COUNT:-0},
    "size": "$ARCHIVE_SIZE"
  },
  "backups": [
$(for b in "${BACKUPS[@]}"; do echo "    \"$b\""; done | paste -sd ',' -)
  ]
}
EOF
else
    echo -e "${STATUS_COLOR}${STATUS_EMOJI}${NC} Latest backup: $LATEST"
    
    if [[ $AGE_DAYS -eq 0 ]]; then
        echo "   Age: ${AGE_HOURS}h ago"
    else
        echo "   Age: ${AGE_DAYS}d ${AGE_HOURS}h ago"
    fi
    
    echo "   Files: $FILE_COUNT"
    echo "   Size: $(human_readable $ARCHIVE_SIZE)"
    echo ""
    echo "Total backups: $BACKUP_COUNT"
    
    if [[ $AGE_DAYS -gt 1 ]]; then
        echo ""
        echo -e "${YELLOW}⚠ Backup is stale. Consider running: backup-now${NC}"
    fi
fi
