# Work Breakdown Structure

> **Purpose:** Breaks down each milestone into epics, features, and tasks with effort estimates.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Technical Program Manager

---

## Sizing Legend

| Size | Description | Estimated Effort |
|------|-------------|-----------------|
| XS | Trivial (copy/paste, config) | < 1 hour |
| S | Small (single file, straightforward) | 1–3 hours |
| M | Medium (multi-file, some design) | 3–8 hours |
| L | Large (complex logic, multiple components) | 1–2 days |
| XL | Extra large (major subsystem) | 2–4 days |

---

## MVP — Profile + Single Application

### Epic 1: Repository Scaffolding

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-001 | Create directory structure (docs, cv, cover_letters, documents, tools, upskill) | XS | — |
| T-002 | Create .gitignore with all exclusion rules | S | T-001 |
| T-003 | Create SETUP.md with prerequisites and install instructions | S | T-001 |
| T-004 | Create README.md with project overview | S | T-001 |
| T-005 | Create LICENSE (MIT) | XS | T-001 |
| T-006 | Create documents/README.md with folder structure guide | S | T-001 |
| T-007 | Create .gitkeep files in all empty directories | XS | T-001 |
| T-008 | Create job_search_tracker.csv with header row | XS | T-001 |
| T-009 | Create settings file with permissions | XS | T-001 |

### Epic 2: LaTeX Templates

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-010 | Create CV template (main_example.tex) with moderncv/banking | M | T-001 |
| T-011 | Create cover letter class (cover.cls) with Lato/Raleway | M | T-001 |
| T-012 | Bundle Lato and Raleway fonts in OpenFonts/fonts/ | S | T-011 |
| T-013 | Verify CV compiles with lualatex | S | T-010 |
| T-014 | Verify cover letter compiles with xelatex | S | T-011, T-012 |

### Epic 3: Profile System (Skill Files)

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-020 | Create SKILL.md (orchestration + activation rules) | M | T-001 |
| T-021 | Create 01-candidate-profile.md (template with placeholders) | M | T-020 |
| T-022 | Create 02-behavioral-profile.md (template) | M | T-020 |
| T-023 | Create 03-writing-style.md (full framework rules) | L | T-020 |
| T-024 | Create 04-job-evaluation.md (scoring framework) | L | T-020 |
| T-025 | Create 05-cv-templates.md (LaTeX guide + tailoring rules) | L | T-010, T-020 |
| T-026 | Create 06-cover-letter-templates.md (LaTeX guide + rules) | L | T-011, T-020 |
| T-027 | Create 07-interview-prep.md (STAR framework + questions) | M | T-020 |

### Epic 4: Onboarding Command

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-030 | Create /setup command file with path selection logic | L | T-021–T-027 |
| T-031 | Implement Path A (document scanning) in command file | XL | T-030 |
| T-032 | Implement Path B (CV import) in command file | L | T-030 |
| T-033 | Implement Path C (interactive interview) in command file | L | T-030 |
| T-034 | Implement cross-reference validation logic | M | T-031 |
| T-035 | Implement merge engine (additive/conflicting classification) | L | T-031 |
| T-036 | Create CLAUDE.md template with placeholder tokens | M | T-021 |

### Epic 5: Basic Apply Command

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-040 | Create /apply command file (steps 0–2 only, no reviewer) | XL | T-023–T-026, T-036 |
| T-041 | Implement fit evaluation (5-dimension scoring) | L | T-024 |
| T-042 | Implement CV generation from profile data | L | T-025 |
| T-043 | Implement cover letter generation from profile data | L | T-026 |
| T-044 | Implement compile-and-inspect loop (CV) | M | T-042 |
| T-045 | Implement compile-and-inspect loop (cover letter) | M | T-043 |
| T-046 | Implement basic verification checklist | M | T-044, T-045 |

---

## v1.0 — Full Pipeline + Search

### Epic 6: Reviewer Agent

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-050 | Define reviewer agent prompt (company research + critique) | L | T-040 |
| T-051 | Implement Part A structured edit format | M | T-050 |
| T-052 | Implement Part B narrative suggestion format | M | T-050 |
| T-053 | Implement revision engine (apply Part A + Part B) | L | T-051, T-052 |
| T-054 | Implement company claim verification | M | T-053 |
| T-055 | Update /apply to include reviewer step | M | T-053, T-054 |

### Epic 7: Salary Benchmarking

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-060 | Implement salary_lookup.py (fuzzy matching, output) | L | T-001 |
| T-061 | Implement convert_salary_excel.py | L | T-060 |
| T-062 | Create tools/README_SALARY_TOOL.md | S | T-060 |
| T-063 | Integrate salary lookup into /apply evaluation | S | T-060, T-041 |

### Epic 8: Job Search

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-070 | Create job scraper SKILL.md | M | T-001 |
| T-071 | Create search-queries.md template | M | T-070 |
| T-072 | Create /search command file (or integrate into scraper skill) | L | T-070, T-071 |
| T-073 | Implement deduplication (seen_jobs.json) | M | T-072 |
| T-074 | Implement quick fit assessment | S | T-072 |
| T-075 | Implement results presentation | M | T-074 |
| T-076 | Implement tracker CSV update on apply | S | T-075 |

### Epic 9: Tracking Dashboard

Implements REQ-5000–REQ-5008. Per ADR-0005: Bun + Hono + server-rendered HTML + HTMX + Pico.css. Differentiator vs. reference product.

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-110 | Scaffold `.agents/skills/tracking-dashboard/` (SKILL.md, cli/, assets/, package.json) | S | T-001 |
| T-111 | Vendor HTMX and Pico.css into `assets/`; verify no CDN references | XS | T-110 |
| T-112 | Implement CSV reader (`csv/read.ts`) with `last_updated` default-from-`date` migration | M | T-008, T-110 |
| T-113 | Implement atomic CSV writer (`csv/write.ts`: tempfile + fsync + rename, plus `.bak` retention) | M | T-112 |
| T-114 | Implement Hono server: port discovery, `127.0.0.1` bind only, browser-open helper | M | T-110 |
| T-115 | Implement list view route (REQ-5001, REQ-5002, REQ-5003): table, sticky KPI strip, search + structured filters, URL-reflected filter state | L | T-112, T-114 |
| T-116 | Implement inline status/notes edit (REQ-5004): HTMX `hx-patch`, transition-aware status dropdown per business-rules §9, toast + error states | L | T-113, T-115 |
| T-117 | Implement row detail drawer (REQ-5005) and "+ New" form (REQ-5006); Esc-dismiss, file-missing indicator | M | T-115 |
| T-118 | Implement `--read-only` mode (REQ-5007), verify zero outbound network (REQ-5008/NFR-0017), wire WCAG axe audit into CI (NFR-0015), perf bench at 1k rows (NFR-0014) | M | T-116, T-117 |

---

## v1.1 — Career Development

### Epic 10: Competency Expansion

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-080 | Create /expand command file | L | T-030 |
| T-081 | Implement source scanning (docs, GitHub, URLs) | L | T-080 |
| T-082 | Implement web enrichment (direct + inference) | M | T-081 |
| T-083 | Implement competency map and deduplication | M | T-082 |
| T-084 | Implement additive-only writes with source annotations | M | T-083 |

### Epic 11: Skill Gap Analysis

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-090 | Create /upskill command (dual-mode) | L | T-076 |
| T-091 | Implement Pass 1 (hard skill diff) | M | T-090 |
| T-092 | Implement Pass 2 (LLM synthesis) | M | T-091 |
| T-093 | Implement gap heatmap generation | M | T-092 |
| T-094 | Implement learning plan with web search | L | T-093 |
| T-095 | Implement study order sequencing | M | T-094 |
| T-096 | Implement report persistence and delta | M | T-095 |

---

## v1.2 — Interview Prep + Polish

### Epic 12: Interview & Polish

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-100 | Populate interview prep with roleplay guidelines | M | T-027 |
| T-101 | Create /reset command file | M | T-030 |
| T-102 | Create portal adapter template (pattern example) | M | T-070 |
| T-103 | Create research agent definition | S | — |
| T-104 | End-to-end testing and polish | L | All |

---

## Summary

| Milestone | Epics | Tasks | Estimated Total |
|-----------|-------|-------|----------------|
| MVP | 5 | 27 | ~12–15 days |
| v1.0 | 4 | 23 | ~13–16 days |
| v1.1 | 2 | 9 | ~5–7 days |
| v1.2 | 1 | 5 | ~3–4 days |
| **Total** | **12** | **64** | **~33–42 days** |

**Note:** v1.0 grew by Epic 9 (Tracking Dashboard, 9 tasks, ~5–6 days) to incorporate REQ-5000–REQ-5008. See ADR-0005 for the stack decision.
