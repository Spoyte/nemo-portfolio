#!/usr/bin/env bash
#
# git-repos — Multi-repository git operations
# Usage: git-repos <command> [args...]
#
# Commands:
#   list              List all discovered repositories
#   status            Overview of all repos (default)
#   dirty             Only repos with uncommitted changes
#   commit "msg"      Commit changes in all dirty repos
#   push              Push all repos
#   pull              Pull latest everywhere

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
RESET='\033[0m'

log_info() { echo -e "${BLUE}ℹ${RESET} $1"; }
log_success() { echo -e "${GREEN}✓${RESET} $1"; }
log_warn() { echo -e "${YELLOW}⚠${RESET} $1"; }
log_error() { echo -e "${RED}✗${RESET} $1"; }

# Find all git repositories under a directory
find_repos() {
    local base_dir="${1:-$HOME}"
    find "$base_dir" -type d -name ".git" 2>/dev/null | while read -r gitdir; do
        dirname "$gitdir"
    done | sort -u
}

# Get repo status in compact format
repo_status() {
    local repo="$1"
    local branch
    branch=$(git -C "$repo" branch --show-current 2>/dev/null || echo "detached")
    
    local status_symbol="✓"
    local status_color="$GREEN"
    
    if ! git -C "$repo" diff --quiet 2>/dev/null || ! git -C "$repo" diff --cached --quiet 2>/dev/null; then
        status_symbol="✗"
        status_color="$YELLOW"
    fi
    
    local ahead_behind=""
    local ahead_count
    ahead_count=$(git -C "$repo" rev-list --count "@{u}..HEAD" 2>/dev/null || echo "0")
    local behind_count
    behind_count=$(git -C "$repo" rev-list --count "HEAD..@{u}" 2>/dev/null || echo "0")
    
    if [[ "$ahead_count" -gt 0 ]]; then
        ahead_behind="${CYAN}↑${ahead_count}${RESET}"
    fi
    if [[ "$behind_count" -gt 0 ]]; then
        ahead_behind="${ahead_behind}${RED}↓${behind_count}${RESET}"
    fi
    
    printf "%b %-40s %-20s %s\n" "$status_color$status_symbol$RESET" "$(basename "$repo")" "$branch" "$ahead_behind"
}

# Main command handler
command="${1:-status}"
shift || true

case "$command" in
    list)
        log_info "Discovering repositories..."
        find_repos "$HOME" | while read -r repo; do
            echo "  $repo"
        done
        ;;
        
    status)
        log_info "Repository status:"
        echo ""
        printf "${GRAY}%-2s %-40s %-20s %s${RESET}\n" "" "Repository" "Branch" "Sync"
        echo ""
        
        find_repos "$HOME" | while read -r repo; do
            repo_status "$repo"
        done
        ;;
        
    dirty)
        log_info "Repositories with changes:"
        echo ""
        
        local found=false
        find_repos "$HOME" | while read -r repo; do
            if ! git -C "$repo" diff --quiet 2>/dev/null || ! git -C "$repo" diff --cached --quiet 2>/dev/null; then
                repo_status "$repo"
                found=true
            fi
        done
        
        if [[ "$found" == false ]]; then
            log_success "All repositories are clean"
        fi
        ;;
        
    commit)
        message="${1:-"Update files"}"
        log_info "Committing in all dirty repos:"
        echo ""
        
        find_repos "$HOME" | while read -r repo; do
            if ! git -C "$repo" diff --quiet 2>/dev/null || ! git -C "$repo" diff --cached --quiet 2>/dev/null; then
                echo "  $(basename "$repo"): $message"
                git -C "$repo" add -A
                git -C "$repo" commit -m "$message" 2>/dev/null || true
            fi
        done
        
        log_success "Committed in all repositories"
        ;;
        
    push)
        log_info "Pushing all repositories:"
        echo ""
        
        find_repos "$HOME" | while read -r repo; do
            branch=$(git -C "$repo" branch --show-current 2>/dev/null || echo "")
            if [[ -n "$branch" ]]; then
                echo "  $(basename "$repo") → origin/$branch"
                git -C "$repo" push origin "$branch" 2>/dev/null || log_warn "  Failed to push $(basename "$repo")"
            fi
        done
        
        log_success "Pushed all repositories"
        ;;
        
    pull)
        log_info "Pulling latest in all repositories:"
        echo ""
        
        find_repos "$HOME" | while read -r repo; do
            echo "  $(basename "$repo")"
            git -C "$repo" pull 2>/dev/null || log_warn "  Failed to pull $(basename "$repo")"
        done
        
        log_success "Pulled all repositories"
        ;;
        
    help|--help|-h)
        echo "Usage: git-repos <command>"
        echo ""
        echo "Commands:"
        echo "  list       List all discovered repositories"
        echo "  status     Overview of all repos (default)"
        echo "  dirty      Only repos with uncommitted changes"
        echo "  commit     Commit changes in all dirty repos"
        echo "  push       Push all repos"
        echo "  pull       Pull latest everywhere"
        echo "  help       Show this help"
        echo ""
        echo "Examples:"
        echo "  git-repos status"
        echo "  git-repos dirty"
        echo "  git-repos commit \"Daily sync\""
        ;;
        
    *)
        log_error "Unknown command: $command"
        echo "Run 'git-repos help' for usage"
        exit 1
        ;;
esac
