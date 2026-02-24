#!/bin/bash
#
# backup-list.sh — List available backups with metadata
#
# Usage: backup-list.sh [options]
#   --json       Output as JSON
#   --compact    One line per backup
#

set -e

WORKSPACE_ROOT="/root/.openclay/workspace"
BACKUP_DIR="$WORKSPACE_ROOT/backups"

JSON=false
COMPACT=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --json) JSON=true; shift ;;
        --compact) COMPACT=true; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

if [[ ! -d "$BACKUP_DIR" ]]; then
    echo "No backups directory found."
    exit 1
fi

# Collect backup info
declare -a BACKUPS
for backup_path in "$BACKUP_DIR"/20*; do
    [[ -d "$backup_path" ]] || continue
    
    backup_name=$(basename "$backup_path")
    manifest="$backup_path/manifest.json"
    
    if [[ -f "$manifest" ]]; then
        timestamp=$(grep '"timestamp"' "$manifest" | cut -d'"' -f4 | head -1)
        size=$(grep '"size_human"' "$manifest" | cut -d'"' -f4 | head -1)
        files=$(grep '"files"' "$manifest" | grep -o '[0-9]*' | head -1)
    else
        timestamp="unknown"
        size="unknown"
        files="unknown"
    fi
    
    # Check if this is the latest
    is_latest=""
    if [[ -L "$BACKUP_DIR/latest" ]]; then
        latest_target=$(readlink "$BACKUP_DIR/latest")
        if [[ "$latest_target" == "$backup_name" ]]; then
            is_latest="*"
        fi
    fi
    
    BACKUPS+=("$backup_name|$timestamp|$size|$files|$is_latest")
done

# Sort by name (newest first)
IFS=$'\n' SORTED_BACKUPS=($(sort -r <<< "${BACKUPS[*]}"))
unset IFS

# Output
if [[ "$JSON" == "true" ]]; then
    echo "["
    first=true
    for backup in "${SORTED_BACKUPS[@]}"; do
        IFS='|' read -r name timestamp size files is_latest <<< "$backup"
        [[ "$first" == "true" ]] || echo ","
        first=false
        echo -n "  {\"name\": \"$name\", \"timestamp\": \"$timestamp\", \"size\": \"$size\", \"files\": $files, \"latest\": $([[ -n "$is_latest" ]] && echo "true" || echo "false")}"
    done
    echo ""
    echo "]"
elif [[ "$COMPACT" == "true" ]]; then
    for backup in "${SORTED_BACKUPS[@]}"; do
        IFS='|' read -r name timestamp size files is_latest <<< "$backup"
        echo "$is_latest $name | $size | $files files"
    done
else
    echo "Available Backups"
    echo "================="
    echo ""
    
    for backup in "${SORTED_BACKUPS[@]}"; do
        IFS='|' read -r name timestamp size files is_latest <<< "$backup"
        echo "📦 $name $is_latest"
        echo "   Time:  $timestamp"
        echo "   Size:  $size"
        echo "   Files: $files"
        echo ""
    done
    
    echo "* = latest backup"
fi
