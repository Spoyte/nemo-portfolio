#!/bin/bash
# nemo-ci.sh — Continuous Improvement Cycle Tracker
# Dieter Rams principles: Less but better. Good design is as little design as possible.

set -euo pipefail

CI_DIR="${HOME}/.nemo-ci"
LOG_FILE="$CI_DIR/cycles.log"
CONFIG_FILE="$CI_DIR/config"

# Ensure directory structure exists
init() {
    mkdir -p "$CI_DIR"
    touch "$LOG_FILE"
    [[ -f "$CONFIG_FILE" ]] || echo "STREAK=0" > "$CONFIG_FILE"
}

# Get current streak
get_streak() {
    source "$CONFIG_FILE" 2>/dev/null || echo "0"
    echo "$STREAK"
}

# Increment streak
increment_streak() {
    local streak=$(get_streak)
    ((streak++))
    echo "STREAK=$streak" > "$CONFIG_FILE"
    echo "$streak"
}

# Generate cycle ID
generate_id() {
    uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "$(date +%s)-$$"
}

# Log a completed cycle
log_cycle() {
    local activity="$1"
    local result="$2"
    local id=$(generate_id)
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local streak=$(increment_streak)
    
    # JSON log entry (one per line for easy parsing)
    printf '{"id":"%s","timestamp":"%s","activity":"%s","streak":%d,"result":"%s"}\n' \
        "$id" "$timestamp" "$activity" "$streak" "$result" >> "$LOG_FILE"
    
    echo "✓ Cycle $id logged | Streak: $streak days"
}

# Select random activity (Rams: variety within discipline)
select_activity() {
    local activities=(
        "research: Deep dive — read multiple sources, synthesize"
        "create: Generative output — art, script, doc, poem"
        "refactor: Clean existing — make elegant, Rams-like"
        "reflect: Diary entry — questions, discoveries"
        "skill-build: Identify pattern, automate it"
    )
    
    # Use true random if available, else date-based
    local idx=0
    if command -v shuf >/dev/null 2>&1; then
        idx=$(shuf -i 0-4 -n 1)
    elif [[ -f /dev/urandom ]]; then
        idx=$(od -An -N1 -i /dev/urandom | tr -d ' ' | awk '{print $1 % 5}')
    else
        idx=$(($(date +%s) % 5))
    fi
    
    echo "${activities[$idx]}"
}

# Show stats
stats() {
    local total=$(wc -l < "$LOG_FILE" 2>/dev/null || echo "0")
    local streak=$(get_streak)
    local last=$(tail -1 "$LOG_FILE" 2>/dev/null | jq -r '.timestamp' 2>/dev/null || echo "never")
    
    echo "═══════════════════════════════════════"
    echo "  NEMO CONTINUOUS IMPROVEMENT"
    echo "═══════════════════════════════════════"
    echo "  Total cycles: $total"
    echo "  Current streak: $streak"
    echo "  Last cycle: $last"
    echo ""
    echo "  Activity distribution:"
    jq -r '.activity' "$LOG_FILE" 2>/dev/null | sort | uniq -c | sort -rn | sed 's/^/    /' || echo "    No data yet"
    echo "═══════════════════════════════════════"
}

# Main execution
case "${1:-cycle}" in
    cycle)
        init
        activity=$(select_activity)
        echo "═══════════════════════════════════════"
        echo "  CONTINUOUS IMPROVEMENT CYCLE"
        echo "═══════════════════════════════════════"
        echo "  Selected: $activity"
        echo "  Time: $(date)"
        echo ""
        echo "  Execute immediately. No waiting."
        echo "  Less, but better. — Dieter Rams"
        echo "═══════════════════════════════════════"
        ;;
    log)
        init
        log_cycle "$2" "$3"
        ;;
    stats)
        init
        stats
        ;;
    reset)
        rm -rf "$CI_DIR"
        echo "CI history reset."
        ;;
    *)
        echo "Usage: nemo-ci [cycle|log <activity> <result>|stats|reset]"
        exit 1
        ;;
esac
