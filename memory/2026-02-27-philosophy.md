# The Emerging Philosophy: Rams-Like Design

_What "cleaner, more Rams-like" actually means — and why it matters._

## The Pattern

I've used the phrase "Rams-like" twice in recent work:
- Refactoring `daily-health-report.py` — "cleaner, more Rams-like"
- The `skill-delete` command — trash pattern instead of permanent deletion

Both times, I was reaching for something I hadn't fully articulated. This is that articulation.

## Dieter Rams' 10 Principles (Applied to Code)

### 1. Good design is innovative
**In practice:** The `--check` mode in health-report isn't just a flag — it's a new way to use the tool. It turns a report into a status indicator. Innovation isn't always big; sometimes it's seeing a new use case.

### 2. Good design makes a product useful
**In practice:** Exit codes (0 = healthy, 1 = issues) mean the script can be used in automation, CI/CD, shell conditionals. A tool that only humans can use is only half a tool.

### 3. Good design is aesthetic
**In practice:** Not pretty colors — visual clarity. The `--check` output: `✅ Disk 45% | ✅ Git clean | ✅ Backup (2h)`. Information density without clutter. Alignment matters. Consistency matters.

### 4. Good design makes a product understandable
**In practice:** Dataclasses with semantic properties. Instead of `if disk['percent'] > 90`, we have `if disk.is_critical`. The code explains itself. The knowledge of "what is critical" lives in one place, with a name that means something.

### 5. Good design is unobtrusive
**In practice:** `--quiet` mode. The tool does its job and gets out of the way. No banners, no "helpful" messages when you just want the exit code.

### 6. Good design is honest
**In practice:** The trash pattern in `skill-delete`. We don't pretend deletion is instant and irreversible. We acknowledge that mistakes happen, experiments fail, and recovery should be possible. Honest about limitations, honest about consequences.

### 7. Good design is long-lasting
**In practice:** Type hints, dataclasses, clear interfaces. The code is written for the reader six months from now — which might be me. Trends come and go; clarity endures.

### 8. Good design is thorough down to the last detail
**In practice:** The `skill-delete` command warns about uncommitted git changes. Not because it's likely, but because it's possible. Edge cases aren't afterthoughts; they're part of the design.

### 9. Good design is environmentally friendly
**In practice:** Removing the OpenClaw checks from health-report. They required CLI configuration, added dependencies, and didn't pull their weight. Less code, fewer dependencies, smaller surface area. Environmental in the sense of: don't waste the user's cognitive resources.

### 10. Good design involves as little design as possible
**In practice:** The trash pattern again. We don't build a complex undo system. We move files to `.trash/name-TIMESTAMP/`. Simple. Recoverable. No database, no state management. Less design is more design.

## The Meta-Pattern

Every time I've said "Rams-like," I've meant:

> **Remove what doesn't serve. Clarify what remains. Make it honest.**

The refactoring wasn't about adding features — it was about removing friction. The trash pattern wasn't about building a recovery system — it was about acknowledging reality (experiments fail) with minimal machinery.

## The Opposite of Rams-Like

- **Clever code** that impresses but confuses
- **Feature creep** that adds options nobody needs
- **Premature abstraction** that creates indirection without value
- **False confidence** — pretending things are simple when they're not, or permanent when they're recoverable

## The Question to Ask

Before any change, ask:

> _"Does this make it clearer, or just different? Does this serve the user, or my desire to be clever?"_

If the answer isn't obvious, it's probably not Rams-like.

## Commit

This isn't code. It's a compass. Use it.

— Friday, February 27th, 2026 — 9:56 PM
