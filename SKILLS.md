# Nemo Skills — Complete Reference

Unified documentation for all workspace skills. 18 skills, one ecosystem.

## Quick Navigation

| Skill | Purpose | Status |
|-------|---------|--------|
| [art-audit](#art-audit) | Portfolio health analysis | ⚡ |
| [art-ideate](#art-ideate) | Algorithm ideation engine | ⚡ |
| [art-insights](#art-insights) | Portfolio analytics & recommendations | ⚡ |
| [art-new](#art-new) | Scaffold new art algorithms | ⚡ |
| [art-sync](#art-sync) | Sync index.ts with registry | ⚡ |
| [art-test](#art-test) | Validate generators | ⚡ |
| [art-thumbnails](#art-thumbnails) | Generate gallery thumbnails | ⚡ |
| [backup-restore](#backup-restore) | Data protection & migration | ⚡ 📜 |
| [env-diff](#env-diff) | Compare environment files | ⚡ |
| [git-workflow](#git-workflow) | Automated git operations | ⚡ 📜 |
| [health-monitor](#health-monitor) | System & workspace health | ⚡ |
| [memory-log](#memory-log) | Daily journaling & logging | ⚡ 📜 |
| [portfolio-insights](#portfolio-insights) | Portfolio pattern analysis | ⚡ |
| [shell-translate](#shell-translate) | Natural language → shell commands | ⚡ |
| [skill-map](#skill-map) | Visualize skill ecosystem | ⚡ |
| [skill-mastery](#skill-mastery) | Track skill proficiency | ⚡ |
| [skill-registry](#skill-registry) | Skill discovery & conventions | ⚡ 📜 |
| [skill-runner](#skill-runner) | Unified skill interface | ⚡ |
| [skill-scaffold](#skill-scaffold) | Create new skills | ⚡ 📜 |

**Legend:** ⚡ = Has executable | 📜 = Has scripts

---

## skill-mastery

**Skill proficiency tracking** — Track usage, identify gaps, guide deliberate practice.

```bash
skill-mastery              # Dashboard view
skill-mastery list         # All skills with mastery levels
skill-mastery log <skill> [sat]  # Log usage (satisfaction 0-100)
skill-mastery insights     # Recommendations and patterns
skill-mastery sync         # Import from memory files
```

**When to use:** Understanding your skill landscape, finding practice opportunities, tracking growth.

**Proficiency levels (Dreyfus model):**
| Level | Name | Threshold |
|-------|------|-----------|
| 🌱 | Novice | 0 uses |
| 🌿 | Beginner | 1+ uses |
| 🌲 | Competent | 5+ uses |
| ⭐ | Proficient | 20+ uses |
| 🌟 | Expert | 50+ uses |
| 👑 | Master | 100+ uses |

**Companion to:** `ci-tracker` — cycles track activity breadth, mastery tracks capability depth.

---

## art-audit

**Portfolio health analysis** — Audit generative art for consistency, completeness, and gaps.

```bash
art-audit              # Full portfolio audit
art-audit --missing-html    # Find algorithms without standalone HTML
art-audit --categories      # Analyze category coverage
art-audit --exports         # Check export consistency
```

**When to use:** Checking portfolio health, finding gaps, preparing releases.

**Key checks:**
- Algorithm inventory (91+ pieces)
- Export consistency from `lib/art/index.ts`
- Missing standalone HTML files
- Gallery integration coverage

---

## art-ideate

**Algorithm ideation engine** — Suggests what to create next based on domain coverage gaps.

```bash
art-ideate             # Top 5 ideas
art-ideate --all       # Show all gaps
art-ideate --category  # Category balance
art-ideate --random    # Pick one (commitment mode)
art-ideate --json      # JSON output
```

**When to use:** Looking for inspiration, understanding portfolio gaps, choosing next piece.

**Domains tracked:** Mathematical, Natural, Physical, Optical, Geometric, Algorithmic

**Sample output:**
```
🎨 Portfolio: 86 algorithms analyzed

💡 Top 5 Ideas
1. Phyllotaxis Spiral (mathematical: 23% coverage)
   art-new phyllotaxis-spiral "Phyllotaxis Spiral"
```

---

## art-insights

**Portfolio analytics** — Deep analysis with recommendations and opportunity scoring.

```bash
art-insights              # Full analysis with recommendations
art-insights --stats      # Quick stats only
art-insights --gaps       # Gap analysis
art-insights --category <name>  # Focus on specific category
art-insights --json       # JSON output
```

**When to use:** Strategic portfolio decisions, understanding patterns, finding high-value opportunities.

**Analyzes:**
- Category distribution and balance
- Theme patterns (animation, color, complexity)
- Gap detection with opportunity scoring
- Visual potential × technical interest × feasibility

---

## art-new

**Scaffold new art pieces** — Creates consistent structure: algorithm, React component, standalone HTML.

```bash
art-new <kebab-name> "Descriptive Name"
art-new flowing-lines "Flowing Lines"
```

**When to use:** Creating new generative art, maintaining consistency across portfolio.

**Creates:**
- `lib/art/{name}.ts` — Core algorithm + types
- `components/{name}.tsx` — React wrapper
- `public/art/{name}.html` — Standalone version
- Updates `lib/art/index.ts` exports

**Design principles:**
1. Constraint breeds creativity — Same 400x400 canvas
2. Pixels over primitives — Use `createImageData`
3. Time as input — All pieces animate
4. Parameters as UI — 2-4 sliders
5. Color schemes — 3-5 palettes

---

## art-sync

**Synchronize art index** — Auto-generate `index.ts` from `unified-registry.ts`.

```bash
art-sync              # Regenerate index.ts
art-sync --check      # Verify sync (CI/CD friendly)
```

**When to use:** After adding generators, CI/CD validation, ensuring consistency.

**Problem solved:** Eliminates manual coordination between registry entries and static imports. Single source of truth.

**Integration:** Run after `art-new` to complete the workflow.

---

## art-test

**Validate generative art generators** — Test imports, exports, and rendering for all 86+ generators.

```bash
art-test              # Test all generators
art-test --quick      # Import/export test only (fast)
art-test --render     # Include render test (slow)
art-test --failed     # Re-test only previously failed
art-test --json       # JSON output for CI/CD
```

**When to use:** Before releases, CI/CD validation, debugging broken art pieces.

**Tests:**
1. **Import** — File readable, has exports
2. **Export** — Has generate/render function
3. **Render** — No SSR-breaking browser API usage

**Exit codes:**
- `0` — All tests passed
- `1` — Some tests failed
- `2` — Critical error

---

## art-thumbnails

**Generate gallery thumbnails** — Creates category-appropriate SVG previews.

```bash
art-thumbnails              # Generate all missing
art-thumbnails flow-field   # Generate specific
art-thumbnails --regenerate # Force all
art-thumbnails --list       # Show status
art-thumbnails --clean      # Remove all
```

**When to use:** Setting up gallery, adding new pieces, refreshing previews.

**Category styles:**
| Category | Visual Style |
|----------|--------------|
| Mathematical | Spiral patterns, fractal structures |
| Natural | Branching trees, organic growth |
| Physics | Wave interference, particles |
| Geometric | Mandala symmetry, radial patterns |
| Traditional | Cross-hatching, sketch textures |
| Abstract | Flowing gradients, organic shapes |

---

## backup-restore

**Data protection & migration** — Automated backups with rotation and restoration.

```bash
backup-now              # Create backup now
backup-status           # Check backup health
./scripts/backup-list.sh             # List available backups
./scripts/backup-restore.sh <name>   # Restore from backup
```

**When to use:** Before major changes, migration, disaster recovery, automation setup.

**Backup structure:**
```
backups/
├── 2026-02-24_16-56-00/
│   ├── manifest.json       # What, when, stats
│   ├── files.tar.gz        # Compressed archive
│   └── git-remotes.txt     # For restoration
└── latest -> 2026-02-24... # Symlink to newest
```

**Rotation policy:**
- All backups from last 7 days
- One per week for 4 weeks
- One per month thereafter

**Included:** Source code, configs, docs, skills, memory files
**Excluded:** node_modules, .git, build artifacts, logs

---

## env-diff

**Compare environment files** — Detect missing variables, type mismatches, and configuration drift across deployment stages.

```bash
env-diff                    # Compare .env.* files in current directory
env-diff /path/to/project   # Compare in specific directory
env-diff --files .env.dev .env.prod  # Compare specific files
env-diff --json             # Output as JSON
env-diff --check            # Exit with error if issues found
```

**When to use:** Pre-deployment validation, onboarding new environments, CI/CD gates, auditing configuration consistency.

**Detects:**
- Missing variables (present in one env but not another)
- Type mismatches (same key, different types)
- Value differences (expected across environments)

**Type detection:**
| Pattern | Detected Type |
|---------|--------------|
| `true`/`false` | boolean |
| Numbers | number |
| URLs | url |
| Database URLs | database |
| API keys/secrets | secret |
| Port numbers | port |

**Exit codes:**
- `0` — No issues
- `1` — Issues found (missing vars or type mismatches)
- `2` — Error

---

## git-workflow

**Automated git operations** — Workspace hygiene, multi-repo management.

```bash
# Individual operations
git-commit              # Interactive commit helper
git status
git add -A
git commit -m "<type>: <description>"
git push origin main

# Multi-repo operations
git-repos status    # Overview of all repos
git-repos dirty     # Only repos with changes
git-repos commit "msg"  # Commit everywhere
git-repos push      # Push all repos
git-repos pull      # Pull latest everywhere
git-repos list      # List all discovered repos
```

**When to use:** Committing changes, syncing, maintaining clean repos.

**Commit types:**
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `refactor:` — Restructuring
- `chore:` — Maintenance
- `wip:` — Work in progress

---

## health-monitor

**System & workspace health** — Plugin-based monitoring with auto-fix.

```bash
health              # Full report
health --check      # Quick status (issues only)
health --json       # JSON output
health --quiet      # Exit codes only
health --fix        # Auto-fix issues
health --system     # System resources only
health --workspace  # Workspace health only
```

**When to use:** Daily health checks, CI/CD gates, identifying issues, auto-fixing problems.

**Exit codes:**
- `0` — All healthy
- `1` — Critical issues
- `2` — Warnings only

**System checks:**
- `system.disk` — Disk usage (warn 80%, critical 90%)
- `system.memory` — Memory usage (warn 85%, critical 95%)
- `system.load` — Load average

**Workspace checks:**
- `workspace.git` — Uncommitted changes (fixable)
- `workspace.repos` — Git status across all repos
- `workspace.memory` — Recent memory file activity
- `workspace.backup` — Backup freshness (fixable)
- `workspace.skills` — SKILL.md consistency
- `workspace.skill_gaps` — Scripts that could be skills
- `workspace.trend` — Health trend analysis

**Auto-fix capabilities:**
- Git: Auto-commits safe files (memory/, skills/, *.md)
- Backup: Creates backup/ directory if missing
- Memory: Creates memory/ directory if missing

---

## memory-log

**Daily journaling & logging** — Low-friction capture of thoughts and events.

```bash
mem-log "Fixed the bug in auth"           # Quick thought
mem-log -c insight "The cron constraint..." # With category
echo "Longer reflection..." | mem-log -s    # From stdin
mem-today                                   # View today's log
mem-yesterday                               # Review yesterday
```

**When to use:** Capturing thoughts, end-of-session logging, quick journaling.

**Philosophy:** Write first, organize later. Append-only. Timestamped.

**Categories:** `event`, `insight`, `decision`, `question`, `gratitude`, `note`

**Entry format:**
```markdown
## HH:MM — Category

Your log entry here.
Can be multi-line.

---
```

---

## portfolio-insights

**Portfolio pattern analysis** — Discover patterns, identify gaps, find opportunities.

```bash
portfolio-insights              # Full analysis
portfolio-insights --stats      # Quick stats
portfolio-insights --gaps       # Find gaps
portfolio-insights --category physics  # Analyze specific
portfolio-insights --json       # JSON output
```

**When to use:** Understanding portfolio composition, finding inspiration, ensuring diversity.

**Analyzes:**
- Category distribution (9 categories)
- Theme patterns (animation, color, complexity)
- Gap detection (missing phenomena, traditions, physics)
- Opportunity scoring (visual potential × technical interest × balance × feasibility)

**Sample output:**
```
┌─────────────────────────────────────────┐
│  Portfolio: 71 Generators               │
├─────────────────────────────────────────┤
│  Physics      ████████████████████  14  │
│  Geometric    ████████████████      11  │
│  Abstract     ████████████████      11  │
│  ...                                    │
│                                          │
│  Top Opportunities:                     │
│  1. Textile/Batik patterns              │
│  2. Acoustic wave visualization         │
└─────────────────────────────────────────┘
```

---

## shell-translate

**Natural language → shell commands** — Translate descriptions into executable shell commands.

```bash
shell-translate "find all Python files modified today"
shell-translate "show disk usage sorted by size" -c    # Copy to clipboard
shell-translate "kill process on port 3000" -x         # Execute immediately
shell-translate "search for TODO in code" -a           # Show alternatives
```

**When to use:** You know what you want but not the exact command, exploring file system operations, learning shell patterns.

**Command categories:**
- **File operations** — Find, filter, size, count, archive
- **Git operations** — Branch, stash, log, reset
- **Process operations** — List, find, kill processes
- **Search operations** — grep, ripgrep, find/replace
- **System info** — Memory, disk, system details
- **Network operations** — Ports, connections, ping
- **Docker operations** — Containers, logs, cleanup

**Safety features:**
- Destructive commands (kill, rm, reset --hard) require `-x` flag
- Interactive confirmation for dangerous operations
- Explanations for each flag with `-v`

---

## skill-map

**Visualize skill ecosystem** — Tree view, health check, dependency graph.

```bash
skill-map              # Visual tree of all skills
skill-map --health     # Health check with status colors
skill-map --deps       # Show skill dependencies
skill-map --graph      # DOT format for graphviz
```

**When to use:** Understanding skill relationships, auditing skill health, generating documentation diagrams.

**Categories:**
| Icon | Category | Skills |
|------|----------|--------|
| 🎨 | Creative | art-audit, art-ideate, art-new, art-sync, art-test, art-thumbnails |
| ⚙️ | Development | git-workflow, skill-scaffold, skill-registry, skill-runner, shell-translate |
| 🔧 | System | backup-restore, health-monitor, env-diff |
| 🧠 | Knowledge | memory-log, portfolio-insights, art-insights |

**Health check:** Shows ✓ healthy or ✗ issues for each skill.

---

## skill-registry

**Skill discovery & conventions** — Central index for all workspace skills.

```bash
skills-list              # List all skills
skill-info <name>        # Read skill documentation
skill-create <name> "Description"  # Create from template
```

**When to use:** Finding capabilities, creating new skills, understanding conventions.

**Skill structure:**
```
skills/
└── <skill-name>/
    ├── SKILL.md          # Documentation + frontmatter
    └── scripts/          # Optional: helper scripts
        └── *.sh
```

**SKILL.md template:**
```markdown
---
name: <skill-name>
description: "What this does. Use when: (1) situation 1, (2) situation 2."
---

# <Skill Name>

Brief description.

## Quick Actions

```bash
# Example commands
```

## Conventions

- Rule 1
- Rule 2
```

**Skill philosophy:**
- Single responsibility — Each skill does one thing well
- Self-documenting — SKILL.md explains everything
- Action-oriented — Focus on what you can do
- Discoverable — Clear naming, obvious location

---

## skill-runner

**Unified skill interface** — One command to discover and run all skills.

```bash
nemo list                    # List all skills
nemo list -q                 # Names only (for scripting)
nemo list -v                # Verbose descriptions
nemo <skill> [args...]       # Run a skill
nemo info <skill>            # Show skill details
nemo docs <skill>            # Read documentation
nemo search <query>          # Find skills
nemo exec <skill> <script>   # Run specific script
nemo completion -s bash      # Shell completion
```

**When to use:** Forgot a skill name, exploring capabilities, consistent CLI usage.

**Discovery:** Automatically finds skills in `/skills/<name>/` with `SKILL.md` files.

**Aliases:** Skills can have multiple names via symlinks in `bin/`.

---

## skill-scaffold

**Create new skills** — Rapid scaffolding with proper structure and CLI integration.

```bash
# Unified interface
skill new <kebab-name> "Descriptive Name"
skill list                   # List all skills
skill show <name>            # Show details
skill edit <name>            # Open in $EDITOR
skill delete <name>          # Remove (with confirmation)

# Legacy commands
skill-new <name> "Description"
skill-list
skill-delete <name>
```

**When to use:** Creating reusable capabilities, standardizing skill structure.

**Creates:**
```
skills/
└── <skill-name>/
    ├── SKILL.md          # Documentation + frontmatter
    ├── <skill-name>      # Main executable
    └── install.sh        # Shell integration
```

**Design principles:**
1. Unified interface — One command for all operations
2. Self-documenting — `--help` explains everything
3. Scripting-friendly — Exit codes, quiet mode, JSON
4. Consistent interface — Same patterns across skills
5. Low friction — Scaffold in 30 seconds
6. Safe deletion — Trash pattern prevents accidents

---

## Skill Philosophy

### Why Skills Exist

Skills are reusable capabilities. Instead of one-off scripts scattered across the workspace, skills are:

- **Organized** — Everything in `/skills/<name>/`
- **Documented** — SKILL.md explains usage and conventions
- **Discoverable** — `nemo list` finds them automatically
- **Consistent** — Same patterns, same interface
- **Composable** — Skills can use other skills

### When to Create a Skill

Create a skill when:
1. You have a reusable capability (not a one-off)
2. It needs documentation others can follow
3. It has a clear interface (CLI, scripts, conventions)
4. It solves a recurring problem

Don't create a skill for:
- One-time data processing
- Project-specific code
- Experiments that might not last

### Skill Lifecycle

1. **Scaffold** — `skill new my-skill "Description"`
2. **Implement** — Write the core functionality
3. **Document** — Fill in SKILL.md with usage examples
4. **Test** — Use it in real work
5. **Refine** — Improve based on usage
6. **Commit** — `git add . && git commit -m "feat: add my-skill"`

### The Rams Test for Skills

Every skill should be:

1. **Innovative** — Does something useful in a new way
2. **Useful** — Solves a real problem you actually have
3. **Aesthetic** — Clean output, helpful errors, consistent style
4. **Understandable** — Clear naming, good documentation
5. **Unobtrusive** — Doesn't get in the way
6. **Honest** — Does what it says, no hidden surprises
7. **Long-lasting** — Built to evolve, not to break
8. **Thorough** — Handles edge cases gracefully
9. **Environmentally friendly** — Minimal dependencies, efficient
10. **Less design** — As simple as possible, but no simpler

---

## Meta: This Documentation

This file is the skill ecosystem's "bird's eye view." It:

- Lists all 18 skills with one-line summaries
- Provides quick command reference for each
- Explains when to use what
- Documents the philosophy behind skills
- Serves as onboarding for new skill authors

**Keep it updated:** When adding a new skill, add it here. When changing a skill's interface, update its section.

---

*18 skills. One command. Infinite possibilities.*
