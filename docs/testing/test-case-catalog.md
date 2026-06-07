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
| **TC-ONB-001** | Onboarding | Scan files with unsupported extensions. | REQ-0002 | Unit / Integration | Files skipped; execution completes. |
| **TC-ONB-002** | Onboarding | Process overlapping dates in scan. | REQ-0005 | Integration / LLM | Flags warnings; prompts user. |
| **TC-ONB-003** | Onboarding | Folder scan writes to profile file. | REQ-0001 | Integration | Creates correct keys in profile.json. |
| **TC-ONB-004** | Onboarding | Import single PDF resume. | REQ-0010 | Integration | Resume sections mapped to JSON. |
| **TC-ONB-005** | Onboarding | Gap analyzer follow-ups. | REQ-0012 | Integration / LLM | Prompts exactly 3–5 gap questions. |
| **TC-ONB-006** | Onboarding | Merge gap answers to profile. | REQ-0015 | Unit | Updates profile with user inputs. |
| **TC-ONB-007** | Onboarding | 9-section interactive interview. | REQ-0016 | E2E | Outputs complete profile structure. |
| **TC-ONB-008** | Onboarding | Interrupt interview preservation. | REQ-0017 | Integration | Answers stored in setup_temp.json. |
| **TC-ONB-009** | Onboarding | Resume interrupted interview. | REQ-0017 | E2E | Prompts resume from last section. |
| **TC-ONB-010** | Onboarding | Section-level re-run. | REQ-0020 | E2E | Only selected section changes. |
| **TC-ONB-011** | Onboarding | Invalid section name on run. | REQ-0020 | Unit | Prints error; halts with exit code 1. |
| **TC-ONB-012** | Onboarding | Case-insensitive skill deduplication. | REQ-0025 | Unit | Union merge filters duplicates. |
| **TC-ONB-013** | Onboarding | Missing required name validation. | REQ-0028 | Unit | Merge fails; triggers schema alert. |
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
| **TC-CAR-001** | Career | Expand profile with GitHub skills. | REQ-0050 | Integration / LLM | Skills appended to profile.json. |
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
