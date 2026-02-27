#!/bin/bash
#
# mem-yesterday — View yesterday's memory log

set -e

WORKSPACE_DIR="/root/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE_DIR/memory"
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d 2>/dev/null)
MEMORY_FILE="$MEMORY_DIR/$YESTERDAY.md"

if [ -f "$MEMORY_FILE" ]; then
    cat "$MEMORY_FILE"
else
    echo "No entries found for yesterday ($YESTERDAY)."
fi
