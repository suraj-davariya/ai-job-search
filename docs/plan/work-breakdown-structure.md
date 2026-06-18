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

## v1.3 — Global Reach & Trust

### Epic 13: i18n Infrastructure (E-i18n-1)

Implements REQ-7001–7006, NFR-0020. Per ADR-0007: single pluggable `i18n/` tree, ICU message formatting, Weblate translation, parity/staleness CI.

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-120 | Externalize user-facing strings from commands/skills into a single `i18n/` tree (REQ-7001, REQ-7002) | XL | T-104 |
| T-121 | Define ICU message-format catalog schema + key namespacing (REQ-7003) | M | T-120 |
| T-122 | Implement message lookup/render helper with English fallback (REQ-7004, REQ-7005) | M | T-121 |
| T-123 | Wire Weblate config + round-trip (export/import) workflow (REQ-7006) | M | T-121 |
| T-124 | Add parity/staleness CI: completeness threshold + missing/orphan-key gate (NFR-0020) | M | T-122, T-123 |

### Epic 14: Locale Packs + Document Generation (E-i18n-2)

Implements REQ-7007–7009, NFR-0019. Pluggable locale packs; locale-aware CV/cover-letter generation.

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-125 | Define locale-pack interface (currency, date, salary, CV-vs-résumé conventions) (REQ-7007) | L | T-121 |
| T-126 | Implement locale-pack loader + per-region config resolution (REQ-7008) | M | T-125 |
| T-127 | Make LaTeX CV/cover-letter generation locale-aware (fontspec script selection, direction) (REQ-7009) | L | T-125, T-042, T-043 |
| T-128 | Add RTL / CJK / Indic script rendering support + compile verification (NFR-0019) | L | T-127 |

### Epic 15: Tier-1 Language Rollout (E-i18n-3)

Implements REQ-7010–7011, NFR-0019. Tier-1 of 12 languages; localized READMEs and docs-site; Tier-2 of 20 left as community packs.

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-129 | Seed Tier-1 (12 languages) catalogs to threshold via Weblate (REQ-7010) | XL | T-124, T-126 |
| T-130 | Scaffold Tier-2 (20 languages) locale packs as community stubs (REQ-7011) | M | T-126 |
| T-131 | Localize root + dashboard READMEs and docs-site language switcher (REQ-7010) | L | T-129 |
| T-132 | End-to-end Tier-1 workflow verification (RTL + CJK + Indic sample run) | M | T-128, T-129 |

### Epic 16: Posting-Legitimacy Gate (E-trust-1)

Implements REQ-8001–8005. Legitimacy gate + verdict, red-flags, ghost-job detection, locale-aware scam catalog.

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-133 | Implement posting-legitimacy gate + verdict surfaced in /search and /apply (REQ-8001) | L | T-072, T-040 |
| T-134 | Implement red-flag heuristics (REQ-8002) | M | T-133 |
| T-135 | Implement ghost-job detection signals (REQ-8003) | M | T-133 |
| T-136 | Build locale-aware scam catalog + matcher (REQ-8004) | L | T-133, T-126 |
| T-137 | Surface verdict + flags in tracker/dashboard (REQ-8005) | M | T-134, T-135, T-136 |

### Epic 17: ATS-Safe Exports (E-app-1)

Implements REQ-2063–2065. Plain-text and `.docx` exports alongside the LaTeX PDF; ATS parse self-check.

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-138 | Implement plain-text CV/cover-letter export (REQ-2063) | M | T-042, T-043 |
| T-139 | Implement `.docx` export alongside LaTeX PDF (REQ-2064) | L | T-138 |
| T-140 | Implement ATS parse self-check + report (REQ-2065) | M | T-139 |

### Epic 18: Fabrication-Audit / Provenance (E-app-2)

Implements REQ-2066. Provenance artifact surfaced to user and dashboard.

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-141 | Emit fabrication-audit/provenance artifact during /apply (claim → source mapping) (REQ-2066) | L | T-046, T-054 |
| T-142 | Surface provenance artifact to the user at end of /apply (REQ-2066) | S | T-141 |
| T-143 | Add provenance panel to the dashboard (REQ-2066) | M | T-141, T-118 |

### Epic 19: Deterministic Scan Tier + Resilience (E-search-1)

Implements REQ-1013, REQ-1015, NFR-0021–0022. Token-free scan tier, posting liveness, provider-limit resilience.

| ID | Task | Size | Dependencies |
|----|------|------|-------------|
| T-144 | Implement deterministic, token-free scan tier (REQ-1013, NFR-0021) | L | T-072 |
| T-145 | Implement posting-liveness re-check (REQ-1015) | M | T-073 |
| T-146 | Implement provider-limit resilience + graceful degradation (NFR-0022) | M | T-144 |

---

## Summary

| Milestone | Epics | Tasks | Estimated Total |
|-----------|-------|-------|----------------|
| MVP | 5 | 27 | ~12–15 days |
| v1.0 | 4 | 23 | ~13–16 days |
| v1.1 | 2 | 9 | ~5–7 days |
| v1.2 | 1 | 5 | ~3–4 days |
| v1.3 | 7 | 27 | ~16–20 days |
| **Total** | **19** | **91** | **~49–62 days** |

**Note:** v1.0 grew by Epic 9 (Tracking Dashboard, 9 tasks, ~5–6 days) to incorporate REQ-5000–REQ-5008. See ADR-0005 for the stack decision.

**Note:** v1.3 (Epics 13–19, 27 tasks) incorporates internationalization (REQ-7001–7011), trust & safety (REQ-8001–8005), ATS-safe exports + provenance (REQ-2063–2066), and the deterministic scan tier + resilience (REQ-1013, REQ-1015, NFR-0019–0022). See ADR-0007 for the i18n decision.
