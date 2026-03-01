#!/usr/bin/env bash
#
# git-workflow — Automated git operations
# Usage: git-commit [options] [message]
#        git-repos <command>
#
# Commands:
#   git-commit              Interactive commit helper
#   git-repos status        Overview of all repos
#   git-repos dirty         Only repos with changes
#   git-repos commit "msg"  Commit everywhere
#   git-repos push          Push all repos
#   git-repos pull          Pull latest everywhere
#   git-repos list          List all discovered repos
#
# Commit types:
#   feat:     New feature
#   fix:      Bug fix
#   docs:     Documentation
#   refactor: Restructuring
#   chore:    Maintenance
#   wip:      Work in progress

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
RESET='\033[0m'

# Script name detection
SCRIPT_NAME="$(basename "$0")"

# ============================================================================
# Helper Functions
# ============================================================================

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

# Check if directory is a git repo
is_git_repo() {
    git -C "$1" rev-parse --git-dir >/dev/null 2>&1
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

# ============================================================================
# git-commit: Interactive commit helper
# ============================================================================

git_commit() {
    local message=""
    local type=""
    local auto_push=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -t|--type)
                type="$2"
                shift 2
                ;;
            -p|--push)
                auto_push=true
                shift
                ;;
            -h|--help)
                echo "Usage: git-commit [options] [message]"
                echo ""
                echo "Options:"
                echo "  -t, --type <type>    Commit type (feat, fix, docs, refactor, chore, wip)"
                echo "  -p, --push           Push after commit"
                echo "  -h, --help           Show this help"
                echo ""
                echo "Examples:"
                echo "  git-commit \"Fixed the login bug\""
                echo "  git-commit -t feat -p \"Add new feature\""
                exit 0
                ;;
            -*)
                log_error "Unknown option: $1"
                exit 1
                ;;
            *)
                message="$1"
                shift
                ;;
        esac
    done
    
    # Check if we're in a git repo
    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    # Show current status
    log_info "Current status:"
    git status --short
    echo ""
    
    # Check if there are changes to commit
    if git diff --quiet && git diff --cached --quiet; then
        log_warn "No changes to commit"
        exit 0
    fi
    
    # Auto-add all changes
    git add -A
    log_success "Staged all changes"
    
    # Interactive type selection if not provided
    if [[ -z "$type" ]]; then
        echo "Select commit type:"
        echo "  1) feat:     New feature"
        echo "  2) fix:      Bug fix"
        echo "  3) docs:     Documentation"
        echo "  4) refactor: Code restructuring"
        echo "  5) chore:    Maintenance"
        echo "  6) wip:      Work in progress"
        echo ""
        read -rp "Enter number (1-6): " choice
        
        case "$choice" in
            1) type="feat" ;;
            2) type="fix" ;;
            3) type="docs" ;;
            4) type="refactor" ;;
            5) type="chore" ;;
            6) type="wip" ;;
            *) type="chore" ;;
        esac
    fi
    
    # Get commit message if not provided
    if [[ -z "$message" ]]; then
        read -rp "Commit message: " message
    fi
    
    if [[ -z "$message" ]]; then
        log_error "Commit message cannot be empty"
        exit 1
    fi
    
    # Commit
    local full_message="${type}: ${message}"
    git commit -m "$full_message"
    log_success "Committed: $full_message"
    
    # Push if requested
    if [[ "$auto_push" == true ]]; then
        local branch
        branch=$(git branch --show-current)
        git push origin "$branch"
        log_success "Pushed to origin/$branch"
    fi
}

# ============================================================================
# git-repos: Multi-repo operations
# ============================================================================

git_repos() {
    local command="${1:-status}"
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
            local message="${1:-"Update files"}"
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
                local branch
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
}

# ============================================================================
# Main
# ============================================================================

case "$SCRIPT_NAME" in
    git-commit|auto-commit.sh)
        git_commit "$@"
        ;;
    git-repos|multi-repo.sh)
        git_repos "$@"
        ;;
    *)
        echo "Usage: git-commit [options] [message]"
        echo "       git-repos <command>"
        exit 1
        ;;
esac
