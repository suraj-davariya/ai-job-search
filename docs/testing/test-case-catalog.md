# Testing — Test Case Catalog

> **Purpose:** Detailed catalog mapping every verification case (TC) to requirements (REQ) and execution methods.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** QA Lead

---

## Traceability Catalog

| Case ID | Feature Area | Description | Target Requirement | Method | Pass Condition |
|---|---|---|---|---|---|
| **TC-ONB-001** | Onboarding | Scan files with unsupported/unreadable extensions. | REQ-0002 | Integration | Files skipped; unreadable files flagged, none fabricated. |
| **TC-ONB-002** | Onboarding | Overlapping dates for same employer in scan. | REQ-0008 | Integration / LLM | Cross-reference flags numbered item with both values; prompts user. |
| **TC-ONB-003** | Onboarding | Folder scan replaces profile-file tokens. | REQ-0003 | Integration | `[UPPER_SNAKE_CASE]` tokens replaced in `01-candidate-profile.md`; none left for populated fields. |
| **TC-ONB-004** | Onboarding | Import single CV (text or file). | REQ-0013 | Integration | All structured sections extracted into profile tokens. |
| **TC-ONB-005** | Onboarding | Path B gap follow-ups. | REQ-0013 | Integration / LLM | Asks targeted follow-ups for behavioral/goals/deal-breakers/salary/refs. |
| **TC-ONB-006** | Onboarding | Merge gap answers to profile files. | REQ-0009 | Integration | Answers merged additively without overwriting unrelated content. |
| **TC-ONB-007** | Onboarding | 9-section interactive interview. | REQ-0014 | E2E | Sections walked in REQ-0014 order; tokens populated across files. |
| **TC-ONB-008** | Onboarding | Idempotent re-run after partial setup. | REQ-0002 | Integration | Re-run reads existing files; proposes no duplicate changes (§7.3). |
| **TC-ONB-009** | Onboarding | Optional sections skippable. | REQ-0014 | E2E | Skipped optional blocks removed/empty, not filled with invented data. |
| **TC-ONB-010** | Onboarding | Section-level re-run (`--section skills`). | REQ-0001 | E2E | Only skills tokens in `01`/`04` change; others untouched. |
| **TC-ONB-011** | Onboarding | Invalid `--section` value. | REQ-0001 | Integration | Assistant lists valid section values and stops without writing. |
| **TC-ONB-012** | Onboarding | Case-insensitive skill deduplication. | REQ-0009 | Integration | Union merge keeps one canonical form (idempotent, §7.1). |
| **TC-ONB-013** | Onboarding | Missing required Name. | REQ-0009 | Integration | Assistant asks user; token left in place; nothing fabricated (ARCH-0007). |
| **TC-ONB-014** | Onboarding | Inferred behavioral item labeling. | REQ-0010 | Integration / LLM | Item written to "Inferred Items" with exact label; scored assessments untouched. |
| **TC-ONB-015** | Onboarding | STAR stubs for uncovered achievements. | REQ-0012 | Integration / LLM | Stub created with empty S/T/A/R; no S/T/A/R fabricated. |
| **TC-ONB-016** | Onboarding | `--section search` regenerates queries. | REQ-0015 | E2E | `search-queries.md` regenerated; no other profile file changes. |
| **TC-ONB-017** | Onboarding | No write before user confirmation. | REQ-0009 | Integration | Additive checklist + conflicting one-at-a-time; no write until confirmed. |
| **TC-APP-001** | Application | Zero match score classification. | REQ-2002 | Unit | Compatibility outputs 0% / Low. |
| **TC-APP-002** | Application | Fuzzy matching salary benchmarking. | REQ-4003 | Unit / Integration | Fuzzy string matches excel titles. |
| **TC-APP-003** | Application | LaTeX special characters escaping. | REQ-2022 | Unit | Characters escaped to safe TeX syntax. |
| **TC-APP-004** | Application | Pre-compile schema validation. | REQ-2023 | Unit | Corrects unescaped tags. |
| **TC-APP-005** | Application | Standard LuaLaTeX compilation. | REQ-2050 | Integration | PDF file generated in target output. |
| **TC-APP-006** | Application | CV Page-Budget Truncation. | REQ-2052 | Integration / Loop | Truncates bullets to fit 2-page limit. |
| **TC-APP-007** | Application | Missing compilation binary path. | REQ-2054 | Integration | Halts execution, logs engine details. |
| **TC-APP-008** | Application | Reviewer Structured Edits Part A. | REQ-2030 | Integration | Replacements applied to tex sources. |
| **TC-APP-009** | Application | Structured Edit string missing. | REQ-2031 | Unit | Skip replacement, log warning details. |
| **TC-APP-010** | Application | Critique Loop execution limit. | REQ-2040 | Integration | Loops exit after max 2 iterations. |
| **TC-APP-011** | Application | Invalid URL parameter fetch. | REQ-1002 | E2E | Print fetch error, exit with code 1. |
| **TC-APP-012** | Application | Dry-run execution prints prompts. | REQ-2080 | E2E | No files written; displays token costs. |
| **TC-SEA-001** | Search | Headless fetch SPA content. | REQ-1004 | Integration | Raw HTML elements parsed to markdown. |
| **TC-SEA-002** | Search | Target page block exception. | REQ-1005 | Integration | Print user alert, exit cleanly. |
| **TC-SEA-003** | Search | seen_jobs hashing check. | REQ-1008 | Unit / Integration | Duplicate hash items hidden from list. |
| **TC-SEA-004** | Search | Search list updates unseen items. | REQ-1009 | E2E | Displays newly scraped jobs only. |
| **TC-SEA-005** | Search | Sorted fit level list outputs. | REQ-1010 | E2E | Output sorted by compatibility. |
| **TC-SEA-006** | Search | Style parameters matching. | REQ-2024 | Unit | Matches style keywords in scoring. |
| **TC-SEA-007** | Search | Tracker logging on apply. | REQ-1011 | Integration | Logged to tracker.csv with statuses. |
| **TC-SEA-008** | Search | Tracker row status updating. | REQ-1012 | Integration | Status updated without duplicate rows. |
| **TC-SEA-009** | Search | Init missing tracker file. | REQ-1011 | Unit | Creates new tracker file with headers. |
| **TC-CAR-001** | Career | Expand profile with GitHub skills. | REQ-0050 | Integration / LLM | Skills appended to `01-candidate-profile.md` with Markdown source annotation. |
| **TC-CAR-002** | Career | Skill source annotation check. | REQ-0052 | Unit | Skills include source attribute tags. |
| **TC-CAR-003** | Career | Expand keeps manual entries. | REQ-0054 | Unit | Manual records remain untouched. |
| **TC-CAR-004** | Career | Targeted upskill gap report. | REQ-3001 | E2E | Writes report.md to upskill folder. |
| **TC-CAR-005** | Career | Aggregate upskill tracker report. | REQ-3002 | E2E | Aggregates all tracker entries. |
| **TC-CAR-006** | Career | Search upskill tutorials. | REQ-3005 | Integration | Links reference valid resources. |
| **TC-CAR-007** | Career | Render skill gap heatmap. | REQ-3008 | Unit | Output report contains markdown chart. |
| **TC-CAR-008** | Career | Generate target STAR questions. | REQ-3050 | E2E | Displays exactly 5 scenario questions. |
| **TC-CAR-009** | Career | STAR Result validation checks. | REQ-3052 | Integration / LLM | Flags missing metric/quantifiable data. |
| **TC-CAR-010** | Career | Interview voice validator. | REQ-3053 | Unit | Warnings on plural pluralizing ("we"). |
| **TC-CAR-011** | Career | Complete interview prep scorecard. | REQ-3054 | E2E | Outputs performance summary card. |
