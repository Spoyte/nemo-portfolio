---
name: env-diff
description: "Compare environment files across deployment stages. Use when: (1) auditing configuration consistency, (2) onboarding new environments, (3) pre-deployment validation, (4) finding missing env vars."
---

# env-diff

Compare `.env` files across different deployment stages (dev, staging, prod, etc.) to identify inconsistencies, missing variables, and type mismatches.

## Quick Actions

```bash
# Compare all .env.* files in current directory
env-diff

# Compare in specific directory
env-diff /path/to/project

# Compare specific files
env-diff --files .env.dev .env.prod

# Output as JSON for scripting
env-diff --json

# CI/CD validation (exits with error if issues found)
env-diff --check
```

## What It Detects

### Missing Variables
Flags variables present in one environment but missing in others:
```
⚠️  MISSING VARIABLES

  prod:
    • DEBUG
    • FEATURE_NEW_DASHBOARD
```

### Type Mismatches
Identifies when the same variable has different types across environments:
```
⚠️  TYPE MISMATCHES

  CACHE_TTL:
    dev: number
    prod: string
```

### Value Differences
Shows expected differences across environments (secrets are masked):
```
📊 VALUE DIFFERENCES

  DATABASE_URL:
    dev: postgres://localhost/devdb
    prod: postgres://prod.db.host.com/proddb
```

## Type Detection

Automatically detects common patterns:

| Pattern | Detected Type | Example |
|---------|--------------|---------|
| `true`/`false` | boolean | `DEBUG=true` |
| Numbers | number | `PORT=3000` |
| URLs | url | `API_URL=https://api.example.com` |
| Database URLs | database | `DATABASE_URL=postgres://...` |
| API keys/secrets | secret | `API_KEY=sk-...` |
| Port numbers | port | `PORT=8080` |
| Everything else | string | `APP_NAME=MyApp` |

## Use Cases

### 1. Pre-Deployment Check
Before deploying to production, verify all required variables are set:
```bash
cd projects/my-app
env-diff --check || echo "Fix missing variables before deploying!"
```

### 2. Onboarding New Environment
Creating a new staging environment? Compare against production:
```bash
env-diff --files .env.prod .env.staging
```

### 3. CI/CD Integration
Add to your pipeline to catch configuration drift:
```yaml
- name: Check environment consistency
  run: env-diff --check
```

### 4. Documentation
Generate a report of all environment variables:
```bash
env-diff --json > env-documentation.json
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success, no issues found |
| 1 | Issues found (missing vars or type mismatches) |
| 2 | Error (file not found, invalid args) |

## Conventions

- Assumes `.env.{environment}` naming (e.g., `.env.dev`, `.env.prod`)
- Comments and empty lines are ignored
- Values are compared as strings
- Secrets are masked in output (first 4 chars only)
- Case-sensitive key matching

## Related

- **health-monitor** — General workspace health checks
- **backup-restore** — Backup .env files before making changes
