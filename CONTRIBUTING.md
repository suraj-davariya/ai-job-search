# Contributing to CareerForge

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Commits-Conventional-FE5196?logo=conventionalcommits&logoColor=white)](https://www.conventionalcommits.org)
[![Good First Issues](https://img.shields.io/badge/Good%20First%20Issues-welcome-blueviolet)](docs/plan/work-breakdown-structure.md)

Thank you for your interest in CareerForge. This document explains how to contribute — from small documentation fixes to new features like portal adapters, locale packs, or CV templates.

---

## Table of contents

1. [Before you start — the private-fork rule](#1-before-you-start--the-private-fork-rule)
2. [Ways to contribute](#2-ways-to-contribute)
3. [Development setup](#3-development-setup)
4. [Project structure](#4-project-structure)
5. [How to make a contribution](#5-how-to-make-a-contribution)
6. [Specific contribution types](#6-specific-contribution-types)
7. [Pull request checklist](#7-pull-request-checklist)
8. [Commit conventions](#8-commit-conventions)
9. [Design principles to uphold](#9-design-principles-to-uphold)
10. [Getting help](#10-getting-help)

---

## 1. Before you start — the private-fork rule

> ⚠️ **This is not optional.**

CareerForge stores your personal candidate profile (name, work history, skills, salary expectations) inside the same directory tree as the source code. The profile files are gitignored, but that only helps if your repository itself is private.

**Always fork to a private GitHub repository before running `/setup`.**

```bash
# 1. Fork on GitHub (set visibility → Private)
# 2. Clone your private fork
git clone git@github.com:<your-username>/ai-job-search.git
cd ai-job-search

# 3. Add the upstream public repo so you can pull improvements
git remote add upstream https://github.com/suraj-davariya/ai-job-search.git
git fetch upstream
```

When you want to contribute back, open a PR from a feature branch in your private fork to the upstream public `main`. GitHub supports this across visibility boundaries.

---

## 2. Ways to contribute

| Type | Examples | Skill needed |
|------|---------|-------------|
| **Bug fix** | Wrong status enum in a command, broken LaTeX macro | Markdown or LaTeX |
| **Documentation** | Clearer requirement wording, better examples | English |
| **CV / cover-letter template** | New LaTeX class, different visual style | LaTeX |
| **Locale pack** | Translated prompts, region-specific salary data, local CV conventions | Language + Markdown |
| **Job portal adapter** | Plane-2 TypeScript adapter for a specific job board | TypeScript + Bun |
| **New command or skill** | A new slash command, e.g. `/remind`, `/benchmark` | Markdown (prompt-as-code) |
| **Test cases** | New `TC-####` grep-based verification steps | Markdown |
| **Requirement / architecture** | Missing `REQ-` or `ARCH-` IDs, clarifications | Markdown |

---

## 3. Development setup

### Prerequisites

| Tool | Version | Why |
|------|---------|-----|
| Claude Code | Latest | Running and testing commands |
| Git | Any | Version control |
| LaTeX (MacTeX / TeX Live / MiKTeX) | Full install | Compiling CV and cover letter PDFs |
| Python | 3.10+ | Salary tooling (optional) |
| Bun or Node.js | 18+ | Portal adapters (optional, v1.2+) |

### Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
claude   # log in
```

### Clone and open

```bash
git clone git@github.com:<your-username>/ai-job-search.git
cd ai-job-search
claude   # opens CareerForge in Claude Code
```

### Verify LaTeX compilers

```bash
lualatex --version   # used for CV
xelatex --version    # used for cover letter
```

### Install extra CV packages (macOS / TeX Live)

```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

---

## 4. Project structure

```
.claude/commands/       Slash commands (/setup, /apply, /search, …)
.claude/skills/         AI knowledge files (profile templates + skill orchestration)
cv/                     LaTeX CV class and example template
cover_letters/          LaTeX cover letter class, example template, bundled fonts
docs/
  requirements/         REQ-#### functional + non-functional requirements
  architecture/         ARCH-#### decisions, ADRs, technology stack
  plan/                 Milestones, epics, task IDs (T-###)
  development/          Coding standards, contribution guides, implementation notes
  testing/              TC-#### test cases
tools/                  Python utilities (salary data conversion)
```

**The key constraint:** CareerForge is **prompt-as-code** (ARCH-0001). Commands are Markdown files, not compiled programs. "Tests" are `grep`-based requirement-traceability checks, not pytest suites. Keep this in mind when adding verification steps.

---

## 5. How to make a contribution

### Step 1 — Find or create an issue

Browse [`docs/plan/work-breakdown-structure.md`](docs/plan/work-breakdown-structure.md) for open tasks (`T-###`). For something new, open a GitHub issue first and discuss the scope.

### Step 2 — Read the docs for the area you're touching

Every task in the WBS references `REQ-` and `ARCH-` IDs. Read those before writing anything:

1. [`docs/requirements/00-index.md`](docs/requirements/00-index.md)
2. [`docs/architecture/00-index.md`](docs/architecture/00-index.md)
3. The relevant implementation guide in [`docs/development/`](docs/development/)

### Step 3 — Create a branch

```bash
git checkout -b feat/T-110-tracking-dashboard-scaffold
#              ^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#              type  task-id + short description
```

Branch types:

| Prefix | When to use |
|--------|------------|
| `feat/T-###-…` | New feature or command |
| `fix/T-###-…` | Bug fix |
| `docs/…` | Documentation only |
| `refactor/…` | Internal restructuring, no behaviour change |
| `locale/…` | New locale pack |
| `adapter/…` | New portal adapter |

### Step 4 — Implement from the docs

> **Never implement from external code.** If you found a pattern in another project, first write it up as a `REQ-` or `ARCH-` update, then implement from that document.

- Markdown/prompt changes require no build step.
- LaTeX changes: compile manually (`lualatex` / `xelatex`) and verify output.
- Python changes: run `python -m black --check tools/` before committing.
- TypeScript changes (portal adapters): run `bun lint && bun test` from the adapter directory.

### Step 5 — Add a verification step

Every change to a command or skill file needs at least one grep-based verification step. Example:

```bash
# Verify the new portal adapter is referenced in the skill file
grep -n 'my-portal-adapter' .claude/skills/job-scraper/SKILL.md
# Expected: present
```

Document it in the relevant `docs/testing/` file with a `TC-SEA-###` or similar ID.

### Step 6 — Commit

```bash
git add .claude/commands/search.md
git commit -m "feat(search): add /search entry command (Epic 8, T-072)"
```

See [Commit conventions](#8-commit-conventions) below.

### Step 7 — Open a PR

Push your branch to your private fork, then open a pull request against `upstream/main`:

```bash
git push origin feat/T-110-tracking-dashboard-scaffold
# Open PR on GitHub: your-fork → suraj-davariya/ai-job-search (main)
```

---

## 6. Specific contribution types

### Adding a locale pack

A locale pack adapts CareerForge to a specific country or region:

1. Translate the user-facing prompt text in `.claude/commands/` and `.claude/skills/`.
2. Add region-specific salary data to `tools/salary_data/` (if applicable).
3. Document local CV conventions (photo inclusion norm, date format, etc.) in a new `docs/locales/<region>.md`.
4. Add a `Location Filter Tier` example for the region to `search-queries.md`.
5. Open a PR with the label `locale`.

### Adding a portal adapter (Plane-2, v1.2+)

Portal adapters are optional TypeScript CLI scrapers for specific job boards. They do not change the Plane-1 web-search skill.

Structure:
```
.agents/skills/<portal-name>/cli/
  package.json
  src/index.ts      # implements the provider interface (ADR-0004)
  README.md         # portal-specific notes, rate limits, auth
```

1. Read [`docs/architecture/`](docs/architecture/) for ADR-0004 (pluggable adapter pattern).
2. Scaffold the directory above.
3. Implement the provider interface methods (`search_jobs`, `fetch_job_details`).
4. Write a `TC-SEA-###` test case that verifies the adapter returns the expected schema.
5. Document authentication requirements and rate limits in the adapter's `README.md`.

### Adding a CV or cover-letter template

1. Create `cv/templates/<template-name>/main_example.tex`.
2. Compile it: `lualatex main_example.tex` — it must produce a clean 2-page output.
3. Add a description and compilation notes to `cv/templates/<template-name>/README.md`.
4. Update [`docs/development/implementation-guide-application.md`](docs/development/implementation-guide-application.md) with the new template's profile-statement tokens.

---

## 7. Pull request checklist

Before marking a PR ready for review, confirm each item:

```
Docs first
☐ Any new behaviour has a REQ-#### or ARCH-#### ID (add it to the appropriate docs/ file if missing)
☐ Implementation follows from the docs, not from external code

Code quality
☐ No hardcoded portal names, country names, or locale strings in core command/skill files
☐ No fabrication: commands never invent data the user hasn't provided
☐ LaTeX changes compile cleanly (lualatex or xelatex, zero errors)
☐ Python changes pass `python -m black --check tools/`

Verification
☐ At least one grep-based verification step added or updated in docs/testing/
☐ Expected grep output documented (present / none)

Safety
☐ No PII or personal profile data in the diff
☐ No API keys, tokens, or secrets staged
☐ Generated PDFs not committed (check .gitignore)

PR description
☐ Lists the REQ-#### or ARCH-#### IDs addressed
☐ Describes what changed and why
☐ Includes terminal output or screenshots for LaTeX/command changes
```

### PR description template

```markdown
## Requirement(s) addressed
REQ-XXXX — [short description]

## What changed
[1–3 sentences explaining the change]

## Verification performed
- [ ] grep check: `grep -n '<term>' <file>` → [expected output]
- [ ] Compiled output: [screenshot or paste of terminal log]
- [ ] Manual run: `/command args` → [what you observed]
```

---

## 8. Commit conventions

Format: `type(scope): description`

| Type | When to use |
|------|------------|
| `feat` | New feature or command |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Test case additions or changes |
| `refactor` | Internal restructuring |
| `chore` | Housekeeping (deps, gitignore, etc.) |
| `ci` | CI/CD configuration |

Examples:
```
feat(search): add /search entry command (Epic 8, T-072)
fix(apply): tracker row uses Draft status, written at draft completion (T-076)
docs(job-search): reconcile dev guide to Plane-1 web-search model
locale(nl): add Dutch locale pack and NL-specific CV conventions
adapter(linkedin): add LinkedIn Plane-2 portal adapter (T-102)
```

Rules:
- Keep the first line under 72 characters.
- Reference the task ID (`T-###`) or requirement ID when applicable.
- One logical change per commit.

---

## 9. Design principles to uphold

These are non-negotiable. Every contribution must respect them.

| Principle | What it means for your PR |
|-----------|--------------------------|
| **Country-agnostic** | No portal name, `site:` URL, country, or locale hardcoded in any core file. Config-driven only. |
| **No fabrication** | Commands and skills must never invent data. If information is missing, they prompt the user. |
| **Privacy-first** | No network calls other than the user's explicitly configured job portals and job URLs. No telemetry, analytics, or external logging. |
| **Prompt-as-code** | New features are Markdown files, not compiled programs. The AI is the runtime. |
| **File-as-DB** | State lives in Markdown, JSON, or CSV. No databases, ORMs, or server processes for the core workflow. |
| **Human-in-the-loop** | Commands stop for user approval at critical gates. Automated pipelines are not auto-submitted. |

---

## 10. Getting help

- **Specification questions:** read [`docs/requirements/00-index.md`](docs/requirements/00-index.md) first.
- **Architecture questions:** read [`docs/architecture/00-index.md`](docs/architecture/00-index.md) and the relevant ADR.
- **Stuck on LaTeX:** see [`cover_letters/README.md`](cover_letters/README.md) for the font and compiler guide.
- **GitHub issues:** open an issue with the label `question` for anything not covered here.

---

*CareerForge is built with [Claude Code](https://claude.ai/code) — an AI coding assistant from Anthropic.*
