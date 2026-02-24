#!/bin/bash
#
# multi-repo — Bulk git operations across multiple repositories
# Usage: multi-repo <command> [options]
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Try to find workspace root: first check if we're in skills/, then fall back to script location
if [ -d "$SCRIPT_DIR/../../../memory" ]; then
    WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
elif [ -d "$SCRIPT_DIR/../../memory" ]; then
    WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
else
    WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
fi
PROJECTS_DIR="$WORKSPACE_ROOT/projects"
PORTFOLIO_DIR="$WORKSPACE_ROOT/nemo-portfolio"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_section() { echo -e "\n${CYAN}▶ $1${NC}"; }

# Find all git repositories under a directory
find_repos() {
    local dir="${1:-$WORKSPACE_ROOT}"
    find "$dir" -type d -name ".git" -exec dirname {} \; 2>/dev/null | sort
}

# Get short status for a repo (one line)
repo_status_line() {
    local repo="$1"
    local name=$(basename "$repo")
    local parent=$(basename "$(dirname "$repo")")
    local display_name="$parent/$name"
    
    if [ "$parent" = ".openclaw" ]; then
        display_name="$name"
    fi
    
    cd "$repo"
    
    local branch=$(git branch --show-current 2>/dev/null || echo "detached")
    local status=$(git status --porcelain 2>/dev/null)
    local ahead_behind=$(git rev-list --left-right --count HEAD...@{upstream} 2>/dev/null | tr '\n' ' ' || echo "0 0")
    local ahead=$(echo "$ahead_behind" | awk '{print $1}')
    local behind=$(echo "$ahead_behind" | awk '{print $2}')
    
    local state="${GREEN}clean${NC}"
    local details=""
    
    if [ -n "$status" ]; then
        local modified=$(echo "$status" | grep -c '^ M' 2>/dev/null | tr -d '\n')
        local staged=$(echo "$status" | grep -c '^M' 2>/dev/null | tr -d '\n')
        local untracked=$(echo "$status" | grep -c '^??' 2>/dev/null | tr -d '\n')
        
        # Default to 0 if empty
        modified=${modified:-0}
        staged=${staged:-0}
        untracked=${untracked:-0}
        
        state="${YELLOW}dirty${NC}"
        details=""
        [ -n "$modified" ] && [ "$modified" -gt 0 ] && details+="${modified}M "
        [ -n "$staged" ] && [ "$staged" -gt 0 ] && details+="${staged}S "
        [ -n "$untracked" ] && [ "$untracked" -gt 0 ] && details+="${untracked}U"
    fi
    
    local sync=""
    ahead=${ahead:-0}
    behind=${behind:-0}
    [ "$ahead" -gt 0 ] && sync+="${CYAN}↑$ahead${NC}"
    [ "$behind" -gt 0 ] && sync+="${CYAN}↓$behind${NC}"
    [ -z "$sync" ] && sync="${GRAY}synced${NC}"
    
    printf "%-35s %-12s %-10s %s %s\n" \
        "$display_name" \
        "$branch" \
        "$state" \
        "$sync" \
        "$details"
}

# Show detailed status for all repos
cmd_status() {
    log_section "Repository Status Overview"
    
    local repos=$(find_repos)
    local total=0
    local dirty=0
    local unsynced=0
    
    printf "${GRAY}%-35s %-12s %-10s %s %s${NC}\n" "REPOSITORY" "BRANCH" "STATE" "SYNC" "CHANGES"
    echo -e "${GRAY}$(printf '%.0s-' {1..80})${NC}"
    
    for repo in $repos; do
        repo_status_line "$repo"
        total=$((total + 1))
        
        cd "$repo"
        if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
            dirty=$((dirty + 1))
        fi
        local ab=$(git rev-list --left-right --count HEAD...@{upstream} 2>/dev/null | tr '\n' ' ' || echo "0 0")
        local a=$(echo "$ab" | awk '{print $1}')
        local b=$(echo "$ab" | awk '{print $2}')
        a=${a:-0}
        b=${b:-0}
        [ "$a" -gt 0 -o "$b" -gt 0 ] && unsynced=$((unsynced + 1))
    done
    
    echo -e "${GRAY}$(printf '%.0s-' {1..80})${NC}"
    log_info "Total: $total repos | Dirty: $dirty | Unsynced: $unsynced"
}

# Show dirty repos only
cmd_dirty() {
    log_section "Dirty Repositories (need attention)"
    
    local repos=$(find_repos)
    local found=0
    
    for repo in $repos; do
        cd "$repo"
        if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
            found=$((found + 1))
            local name=$(basename "$repo")
            local parent=$(basename "$(dirname "$repo")")
            [ "$parent" = ".openclaw" ] && echo -e "\n${CYAN}$name${NC}" || echo -e "\n${CYAN}$parent/$name${NC}"
            git status --short
        fi
    done
    
    [ "$found" -eq 0 ] && log_success "All repositories are clean!"
}

# Bulk commit with message
cmd_commit() {
    local message="$1"
    
    if [ -z "$message" ]; then
        log_error "Commit message required"
        echo "Usage: multi-repo commit 'message'"
        exit 1
    fi
    
    log_section "Bulk Commit: '$message'"
    
    local repos=$(find_repos)
    local committed=0
    
    for repo in $repos; do
        cd "$repo"
        if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
            local name=$(basename "$repo")
            git add -A
            git commit -m "$message" --quiet 2>/dev/null || true
            log_success "$name: committed"
            committed=$((committed + 1))
        fi
    done
    
    [ "$committed" -eq 0 ] && log_warn "No changes to commit" || log_info "Committed to $committed repositories"
}

# Bulk push
cmd_push() {
    log_section "Bulk Push"
    
    local repos=$(find_repos)
    local pushed=0
    local failed=0
    
    for repo in $repos; do
        cd "$repo"
        local name=$(basename "$repo")
        
        # Check if we have unpushed commits
        local ahead=$(git rev-list --left-right --count HEAD...@{upstream} 2>/dev/null | awk '{print $1}')
        ahead=${ahead:-0}
        
        if [ "$ahead" -gt 0 ]; then
            if git push --quiet 2>/dev/null; then
                log_success "$name: pushed"
                pushed=$((pushed + 1))
            else
                log_error "$name: push failed"
                failed=$((failed + 1))
            fi
        fi
    done
    
    log_info "Pushed: $pushed | Failed: $failed"
}

# Bulk pull
cmd_pull() {
    log_section "Bulk Pull"
    
    local repos=$(find_repos)
    local pulled=0
    local failed=0
    
    for repo in $repos; do
        cd "$repo"
        local name=$(basename "$repo")
        
        if git pull --quiet 2>/dev/null; then
            log_success "$name: pulled"
            pulled=$((pulled + 1))
        else
            log_error "$name: pull failed (may have local changes)"
            failed=$((failed + 1))
        fi
    done
    
    log_info "Pulled: $pulled | Failed: $failed"
}

# Fetch all repos
cmd_fetch() {
    log_section "Bulk Fetch"
    
    local repos=$(find_repos)
    local fetched=0
    
    for repo in $repos; do
        cd "$repo"
        local name=$(basename "$repo")
        git fetch --all --quiet 2>/dev/null && log_success "$name: fetched" && fetched=$((fetched + 1))
    done
    
    log_info "Fetched $fetched repositories"
}

# Show help
cmd_help() {
    cat << 'EOF'
Multi-Repo: Bulk git operations across workspace repositories

Usage: multi-repo <command> [options]

Commands:
  status              Show status overview of all repos
  dirty               Show only repos with uncommitted changes
  commit "msg"        Commit all changes in all dirty repos
  push                Push all repos with unpushed commits
  pull                Pull latest changes in all repos
  fetch               Fetch updates from remotes
  list                List all discovered repositories
  help                Show this help message

Examples:
  multi-repo status           # Overview of all repos
  multi-repo dirty            # See what needs committing
  multi-repo commit "WIP"     # Commit everything with message "WIP"
  multi-repo push             # Push all unpushed commits

EOF
}

# List all repos
cmd_list() {
    log_section "Discovered Repositories"
    find_repos | while read repo; do
        local name=$(basename "$repo")
        local parent=$(basename "$(dirname "$repo")")
        [ "$parent" = ".openclaw" ] && echo "  $name" || echo "  $parent/$name"
    done
}

# Main
case "${1:-status}" in
    status)
        cmd_status
        ;;
    dirty)
        cmd_dirty
        ;;
    commit)
        cmd_commit "$2"
        ;;
    push)
        cmd_push
        ;;
    pull)
        cmd_pull
        ;;
    fetch)
        cmd_fetch
        ;;
    list)
        cmd_list
        ;;
    help|--help|-h)
        cmd_help
        ;;
    *)
        log_error "Unknown command: $1"
        cmd_help
        exit 1
        ;;
esac
