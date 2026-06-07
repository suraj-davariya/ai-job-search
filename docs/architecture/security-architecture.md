# Security Architecture

> **Purpose:** Documents how CareerForge protects personal data, manages access, and ensures privacy.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Software Architect

---

## Threat Model

CareerForge handles sensitive personal data: names, addresses, phone numbers, employment history, salary information, and career goals. The primary threats are:

| Threat | Mitigation |
|--------|-----------|
| Personal data committed to public repo | .gitignore excludes all personal data files |
| Salary data leakage | salary_data.json gitignored; may be proprietary |
| AI fabrication of credentials | No-fabrication rule enforced at every generation step |
| Company research inaccuracy | Independent verification required for all company claims |
| Unintended data sharing via AI platform | Data stays local; only standard AI platform API calls made |

---

## Data Classification

| Classification | Data | Protection |
|---------------|------|-----------|
| **Personal — Sensitive** | Name, address, phone, email, salary data | Gitignored; local only |
| **Personal — Professional** | CV content, cover letters, work history | Gitignored (generated files); profile files in private fork |
| **Personal — Tracking** | Application tracker, seen jobs, upskill reports | Gitignored |
| **Framework — Public** | Command definitions, skill rules, templates | Tracked in git; safe to share |
| **Framework — Configuration** | Settings, permissions | Tracked in git; no secrets |

---

## .gitignore Strategy

The .gitignore is the primary privacy mechanism. It is structured in sections:

```
# Personal application output
cv/main_*.tex           # Generated CVs (keep only example)
cover_letters/cover_*.tex

# Personal data files
salary_data.json
job_search_tracker.csv
job_scraper/seen_jobs.json

# Source documents (all personal)
documents/cv/**
documents/linkedin/**
documents/diplomas/**
documents/references/**
documents/applications/**

# Reports
upskill/*.md

# Compiled artifacts
*.pdf
*.aux, *.log, *.out

# AI platform user-specific
.claude/projects/
```

**Rule:** If a file contains ANY personal data, it MUST be gitignored. The `.gitignore` is the first file reviewed when adding new data stores.

---

## Access Control

### Permission Model
CareerForge uses the AI platform's permission system. The settings file controls which tools each skill can use:

| Permission | Granted To | Purpose |
|-----------|-----------|---------|
| File read/write | job-application-assistant skill | Profile and document management |
| Python execution | All skills | Salary tool invocation |
| Web requests (curl) | All skills | Job fetching, company research |
| Bun execution | Job scraper skills | Portal adapter invocation |
| Sub-agent spawning | Apply command | Reviewer agent creation |

### User Authority
- All generated content requires explicit user approval before finalization
- Reset requires exact `RESET` string confirmation
- Conflicting profile changes require per-item resolution
- No files are automatically submitted, published, or shared

---

## AI Platform Security

### Data Handling
- Profile data is sent to the AI platform's LLM during command execution (necessary for generation)
- The AI platform's own data handling policies apply
- No additional data exfiltration beyond what the platform requires

### No Fabrication as Security
The no-fabrication rule is both a quality and a security measure:
- Prevents the system from generating false credentials that could constitute fraud
- Every claim is traceable to the profile data
- The interview backtrack test serves as a human-verifiable check

---

## Permission Layers (NFR-0018, ARCH-0010)

Tool invocations in CareerForge are gated by two composing permission layers. A tool call succeeds only when **both** layers permit it:

| Layer | File | Scope | Governed by |
|-------|------|-------|-------------|
| Skill-level | `SKILL.md` frontmatter `allowed-tools:` | Per-skill whitelist | ARCH-0010, DEC-014 |
| Workspace-level | `.claude/settings.local.json` | Workspace-wide overrides | REQ-6002, DEC-014 |

**Composition rule:** A tool call by skill S is allowed iff:
1. The tool appears in S's `allowed-tools` list, AND
2. The workspace `settings.local.json` does not deny it.

**Workspace settings schema:**

```json
{
  "permissions": {
    "allow": [
      "Skill(job-application-assistant)",
      "Bash(bun run *)",
      "Read",
      "Edit",
      "WebFetch",
      "WebSearch"
    ],
    "deny": []
  }
}
```

**Shipping:** The framework ships `.claude/settings.local.json.template` with the minimum permissions needed by all bundled skills. User forks rename to `.claude/settings.local.json` (gitignored) and customize as needed.

**Plane 2 sub-agent skills:** The `Bash` call to invoke a Plane 2 CLI tool must appear in the calling skill's `allowed-tools`. Permissions inside the CLI process are governed by the CLI's own package configuration, not by `.claude/settings.local.json`.
