#!/bin/bash
#
# mem-today — View today's memory log
# Usage: mem-today [-f|--follow]

set -e

WORKSPACE_DIR="/root/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE_DIR/memory"
TODAY=$(date +%Y-%m-%d)
MEMORY_FILE="$MEMORY_DIR/$TODAY.md"

if [ "$1" = "-f" ] || [ "$1" = "--follow" ]; then
    if [ -f "$MEMORY_FILE" ]; then
        tail -f "$MEMORY_FILE"
    else
        echo "No entries yet today. Waiting for new entries..."
        mkdir -p "$MEMORY_DIR"
        touch "$MEMORY_FILE"
        tail -f "$MEMORY_FILE"
    fi
else
    if [ -f "$MEMORY_FILE" ]; then
        cat "$MEMORY_FILE"
    else
        echo "No entries yet today."
        echo "Use: mem-log \"your thought\""
    fi
fi
