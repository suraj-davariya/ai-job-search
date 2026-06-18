# Requirements → Architecture Traceability Matrix

> **Purpose:** Maps every functional and non-functional requirement to the architecture elements that satisfy it.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Software Architect

---

## Functional Requirements Traceability

### Onboarding (REQ-0xxx)

| Requirement | Architecture Element | Component | Notes |
|-------------|---------------------|-----------|-------|
| REQ-0001 Path Selection | ARCH-0010 Profile Manager | Document Scanner | Detects folder state |
| REQ-0002 Path A Scanning | ARCH-0010 Profile Manager | Document Scanner, Cross-Ref Checker, Merge Engine | Full pipeline |
| REQ-0003–0007 Document Extraction | ARCH-0010 Profile Manager | Document Scanner | Per-format parsing |
| REQ-0008 Cross-Reference | ARCH-0010 Profile Manager | Cross-Reference Checker | Multi-source validation |
| REQ-0009 Additive/Conflicting | ARCH-0010 Profile Manager | Merge Engine | Change classification |
| REQ-0013 Path B Import | ARCH-0010 Profile Manager | CV Importer | Single-document flow |
| REQ-0014 Path C Interview | ARCH-0010 Profile Manager | Interview Engine | 9-section questionnaire |
| REQ-0015 Search Config | ARCH-0010 Profile Manager | Interview Engine | Search queries generation |
| REQ-0016 File Generation | ARCH-0010 Profile Manager | Merge Engine | Convergent output |
| REQ-0050–0055 Expansion | ARCH-0010 Profile Manager | Competency Expander | Additive-only enrichment |
| REQ-0080–0085 Reset | ARCH-0010 Profile Manager | Profile Resetter | Scope-based clearing |

### Job Search (REQ-1xxx)

| Requirement | Architecture Element | Component | Notes |
|-------------|---------------------|-----------|-------|
| REQ-1001 Invocation | ARCH-0020 Search Engine | Query Executor | Focus/broad modes |
| REQ-1002 State Loading | ARCH-0020 Search Engine | State Manager | Reads seen_jobs + tracker |
| REQ-1003 Multi-Portal | ARCH-0020 Search Engine | Query Executor + Portal Adapters | Web search + CLI tools |
| REQ-1004 Result Parsing | ARCH-0020 Search Engine | Result Parser | Structured extraction |
| REQ-1005 Quick Fit | ARCH-0020 Search Engine | Quick Fit Assessor | 3-level classification |
| REQ-1006 Deduplication | ARCH-0020 Search Engine | Deduplication Engine | URL/title key matching |
| REQ-1007 Presentation | ARCH-0020 Search Engine | Results Presenter | Sorted table with details |
| REQ-1010 Geographic Filter | ARCH-0020 Search Engine | Query Executor | Location tier matching |
| REQ-1013 Deterministic Listing | ARCH-0020 Search Engine | Portal Adapter `list()` | Token-free pre-filter; ADR-0004, NFR-0021 |
| REQ-1015 Liveness Verification | ARCH-0020 Search Engine | Liveness Checker | Re-verify stored postings; ARCH-0005, REQ-8004 |

### Application Pipeline (REQ-2xxx)

| Requirement | Architecture Element | Component | Notes |
|-------------|---------------------|-----------|-------|
| REQ-2001 Input Parsing | ARCH-0030 Application Pipeline | Input Parser | URL/text handling |
| REQ-2010 5-Dimension Scoring | ARCH-0030 Application Pipeline | Evaluation Engine | Weighted scoring |
| REQ-2011 Salary Integration | ARCH-0050 Salary Benchmarking | Fuzzy Matcher | Optional lookup |
| REQ-2013 Approval Gate | ARCH-0030 Application Pipeline | — | Human-in-the-loop |
| REQ-2020 CV Generation | ARCH-0030 Application Pipeline | CV Generator | moderncv/banking LaTeX |
| REQ-2021 CL Generation | ARCH-0030 Application Pipeline | Cover Letter Generator | Custom class LaTeX |
| REQ-2022 Writing Style | ARCH-0030 Application Pipeline | — | Style guide enforcement |
| REQ-2023 No Fabrication | ARCH-0007 (principle) | All generation | Hard constraint |
| REQ-2030–2033 Reviewer | ARCH-0030 Application Pipeline | Reviewer Dispatcher | ADR-0002 |
| REQ-2040–2042 Revision | ARCH-0030 Application Pipeline | Revision Engine | Part A + Part B |
| REQ-2050–2054 Compilation | ARCH-0030 Application Pipeline | Compilation Verifier | ADR-0003 |
| REQ-2060–2062 Presentation | ARCH-0030 Application Pipeline | Final Verifier | Checklist + summary |
| REQ-2063 ATS Exports | ARCH-0030 Application Pipeline | Export Generator (TXT/DOCX) | Alongside the PDF; ADR-0003 |
| REQ-2064 ATS Parse Self-Check | ARCH-0030 Application Pipeline | Parse Verifier | PDF text-recovery assertion |
| REQ-2065 Fabrication Audit | ARCH-0007 (principle) | Final Verifier | Claim→source ledger |
| REQ-2066 Provenance Surfacing | ARCH-0030 + ARCH-0060 Dashboard | Provenance Panel | File-as-DB, read-only |

### Career Development (REQ-3xxx)

| Requirement | Architecture Element | Component | Notes |
|-------------|---------------------|-----------|-------|
| REQ-3001 Dual-Mode | ARCH-0040 Career Development | — | Aggregate vs. targeted |
| REQ-3004 Hard Skill Diff | ARCH-0040 Career Development | Skill Differ | Frequency × weight |
| REQ-3005 LLM Synthesis | ARCH-0040 Career Development | LLM Synthesizer | Domain/soft/tooling gaps |
| REQ-3006 Gap Heatmap | ARCH-0040 Career Development | Gap Scorer | Priority levels |
| REQ-3007 Learning Plan | ARCH-0040 Career Development | Resource Finder | Web-searched resources |
| REQ-3008 Study Order | ARCH-0040 Career Development | Study Planner | Dependency-aware |
| REQ-3009 Report Persistence | ARCH-0040 Career Development | Report Generator | Markdown files |
| REQ-3050–3054 Interview | ARCH-0040 Career Development | Interview Coach | STAR, roleplay |

### Salary Benchmarking (REQ-4xxx)

| Requirement | Architecture Element | Component | Notes |
|-------------|---------------------|-----------|-------|
| REQ-4001 BYO Data | ARCH-0050 Salary Benchmarking | Data Loader | JSON schema |
| REQ-4002 Excel Import | ARCH-0050 Salary Benchmarking | Excel Importer | openpyxl |
| REQ-4003 Fuzzy Matching | ARCH-0050 Salary Benchmarking | Fuzzy Matcher | Nordic char handling |
| REQ-4004 Lookup Output | ARCH-0050 Salary Benchmarking | Formatter | Human + JSON |
| REQ-4006 Privacy | Security Architecture | .gitignore | Data exclusion |

### Tracking Dashboard (REQ-5xxx)

| Requirement | Architecture Element | Component | Notes |
|-------------|---------------------|-----------|-------|
| REQ-5000 Launch & Lifecycle | ARCH-0060 Tracking Dashboard | Hono Server, Port Discovery, Browser Opener | ADR-0005 |
| REQ-5001 List View | ARCH-0060 Tracking Dashboard | List Route, CSV Reader | Reads `job_search_tracker.csv` |
| REQ-5002 Filtering & Search | ARCH-0060 Tracking Dashboard | List Route + HTMX filter handlers | URL-reflected state |
| REQ-5003 Pipeline Summary | ARCH-0060 Tracking Dashboard | KPI Strip Component | Filter-aware buckets per business-rules §9.5 |
| REQ-5004 Inline Status Update | ARCH-0060 Tracking Dashboard | Row Patch Handler, Atomic CSV Writer | Transition-aware enum from business-rules §9.2 |
| REQ-5005 Row Detail Drawer | ARCH-0060 Tracking Dashboard | Drawer Route | Missing-file indicator per ARCH-0005 |
| REQ-5006 Append New Application | ARCH-0060 Tracking Dashboard | New-Row Route, Atomic CSV Writer | Required: date/company/role/status |
| REQ-5007 Read-Only Mode | ARCH-0060 Tracking Dashboard | Read-Only Guard | Disables mutate routes |
| REQ-5008 No Telemetry | ARCH-0060 Tracking Dashboard | Bundled Assets, Loopback Bind | Verified by ARCH-0005 + NFR-0017 |

### Framework Meta (REQ-6xxx)

| Requirement | Architecture Element | Component / Module | Notes |
|------------|---------------------|-------------------|-------|
| REQ-6001 Configurable Research Agent Model | ARCH-0009 Named Sub-Agent Definitions | `.claude/agents/<name>.md` frontmatter `model:` | DEC-015; fallback to Claude if CLI unavailable per NFR-0009 |
| REQ-6002 Workspace Permission Configuration | ARCH-0010 SKILL.md Frontmatter | `.claude/settings.local.json.template` | NFR-0018, DEC-014 |
| REQ-6003 Quick Sub-Commands | ARCH-0010 SKILL.md Frontmatter | `job-application-assistant` SKILL.md trigger routing | DEC-014 |

### Internationalization & Localization (REQ-7xxx)

| Requirement | Architecture Element | Component | Notes |
|-------------|---------------------|-----------|-------|
| REQ-7001 Language-Agnostic Output | ADR-0007 i18n/l10n | Locale Resolver | Removes hardcoded "CV always English" |
| REQ-7002 Externalized Strings | ADR-0007 i18n/l10n | `i18n/ui/` resources | English = source of truth |
| REQ-7003 Resource Format (ICU/JSON) | ADR-0007 i18n/l10n | ICU MessageFormat | CLDR plurals |
| REQ-7004 Language Roadmap & Tiers | ADR-0007 i18n/l10n | `i18n/_meta/languages.json` | Tier-1 (12) + Tier-2 (20) |
| REQ-7005 Contribution Workflow | ADR-0007 i18n/l10n | Weblate + MTPE | Community-owned |
| REQ-7006 Parity / Staleness Gate | ADR-0007 i18n/l10n | Source-hash CI check | Custom (no off-the-shelf) |
| REQ-7007 README & Docs-Site Translation | ADR-0007 i18n/l10n | `i18n/readme/`, docs-site i18n | No root clutter |
| REQ-7008 Dashboard UI + RTL | ADR-0007 i18n/l10n + ARCH-0060 Dashboard | `next-intl` | NFR-0019 |
| REQ-7009 Locale Packs | ADR-0007 i18n/l10n | `locale-packs/` | Decoupled from language; ADR-0004 philosophy |
| REQ-7010 Locale-Aware Generation | ADR-0007 + ARCH-0030 Application Pipeline | CV/CL Generators | Consumes locale pack |
| REQ-7011 Generation-Quality Signal | ADR-0007 i18n/l10n | Language Registry flag | ARCH-0006 backstop |

### Trust & Safety (REQ-8xxx)

| Requirement | Architecture Element | Component | Notes |
|-------------|---------------------|-----------|-------|
| REQ-8001 Legitimacy Assessment | ARCH-0030 Application Pipeline | Legitimacy Gate | Separate verdict; business-rules §10 |
| REQ-8002 Red-Flags Signals | ARCH-0030 Application Pipeline | Red-Flag Evaluator | Externalized, country-agnostic |
| REQ-8003 Quick Legitimacy Flag | ARCH-0020 Search Engine | Quick Fit Assessor | Beside High/Med/Low |
| REQ-8004 Ghost-Job Detection | ARCH-0020 Search Engine | Liveness Checker | Ties REQ-1011, REQ-1015 |
| REQ-8005 Scam-Pattern Catalog | ADR-0007 Locale Packs | `locale-packs/` scam data | Locale-aware; community-extensible |

---

## Non-Functional Requirements Traceability

| Requirement | Architecture Element | ADR |
|-------------|---------------------|-----|
| NFR-0001 Portability | Deployment & Infrastructure | — |
| NFR-0004 Data Privacy | Security Architecture | — |
| NFR-0005 Idempotency | State Management | — |
| NFR-0006 Multi-Language | Cross-Cutting (i18n) | — |
| NFR-0007 Extensibility | Cross-Cutting (Extensibility) | ADR-0004 |
| NFR-0008 Document Quality | Component Design (Compilation Verifier) | ADR-0003 |
| NFR-0009 Graceful Degradation | Cross-Cutting (Error Handling) | — |
| NFR-0010 Token Efficiency | Cross-Cutting (Performance) | ADR-0002 |
| NFR-0011 VCS Friendliness | Data Architecture, Security Architecture | ADR-0001 |
| NFR-0014 Dashboard Performance | ARCH-0060 Tracking Dashboard (CSV Reader, Hono Server) | ADR-0005 |
| NFR-0015 Web Accessibility (WCAG 2.1 AA) | ARCH-0060 Tracking Dashboard (Pico.css, semantic HTML, axe-in-CI) | ADR-0005 |
| NFR-0016 Concurrent CSV Writes | ARCH-0060 Tracking Dashboard (Atomic Writer), Data Architecture §Consistency Rules | ADR-0001, ADR-0005 |
| NFR-0017 Local-Only Network Surface | ARCH-0060 Tracking Dashboard (Loopback Bind, Bundled Assets), Security Architecture | ADR-0005 |
| NFR-0018 Skill-Scoped Tool Permissions | Cross-Cutting (Permission Layers), Security Architecture | DEC-014; `.claude/settings.local.json` + SKILL.md `allowed-tools:` |
| NFR-0019 Bidi & Non-Latin Rendering | Cross-Cutting (i18n), Component (Compilation Verifier) | ADR-0007, ADR-0003 |
| NFR-0020 Translation Completeness | Cross-Cutting (i18n) | ADR-0007 |
| NFR-0021 Cost-Aware Search | ARCH-0020 Search Engine | ADR-0004 |
| NFR-0022 Provider-Limit Resilience | Cross-Cutting (Error Handling) | — |

---

## Architecture Principles Traceability (ARCH-0001..0010)

| Principle | Key Requirements | Notes |
|-----------|----------------|-------|
| ARCH-0001 Prompt-as-code | REQ-0001..REQ-3001 | Workflow lives in Markdown |
| ARCH-0002 Skill composition | REQ-6003 | Skills composable via trigger routing |
| ARCH-0003 Agent isolation | REQ-2030–2034 | Drafter/reviewer separation |
| ARCH-0004 File-as-DB | NFR-0004, NFR-0011, NFR-0016 | ADR-0001 |
| ARCH-0005 Graceful degradation | NFR-0009 | Optional features removable without breaking core |
| ARCH-0006 Human-in-the-loop | REQ-2034, REQ-2060 | Approval gates at evaluation + revision |
| ARCH-0007 No fabrication | REQ-0012, REQ-2060 | Enforced at generation + verification |
| ARCH-0008 Two-Plane Skill Architecture | NFR-0007, REQ-6001–6003 | DEC-013; `.claude/skills/` vs `.agents/skills/` |
| ARCH-0009 Named Sub-Agent Definitions | REQ-6001 | DEC-015; `.claude/agents/<name>.md` |
| ARCH-0010 SKILL.md Frontmatter Orchestrator | NFR-0018, REQ-6002, REQ-6003 | DEC-014; `allowed-tools:` field |

---

## Architecture Decision Records Traceability

| ADR | Key Requirements Addressed |
|-----|--------------------------|
| ADR-0001 File-Based Data | NFR-0001, NFR-0004, NFR-0011, NFR-0016 |
| ADR-0002 Drafter-Reviewer | REQ-2030–2042, NFR-0010 |
| ADR-0003 LaTeX Generation | REQ-2020–2021, REQ-2050–2054, NFR-0008 |
| ADR-0004 Pluggable Portals | REQ-1003, NFR-0007 |
| ADR-0005 Tracking Dashboard Stack | REQ-5000–5008, NFR-0014, NFR-0015, NFR-0016, NFR-0017 |
| ADR-0006 Dashboard Next.js (file-as-DB) | REQ-5000–5016, NFR-0014–0017 |
| ADR-0007 Internationalization & Localization | REQ-7001–7011, REQ-8005, NFR-0019, NFR-0020 |

---

## Design Decisions Traceability (DEC-009..019)

| DEC | Decision | Key Requirements / NFRs |
|-----|----------|------------------------|
| DEC-009 Reviewer opt-out | `--review=full\|quick\|none` flag | REQ-2034, REQ-2030 |
| DEC-010 Layout-fix memory | `.agents/state/layout-fixes.json` cache | REQ-2055, REQ-2053 |
| DEC-011 Paste as first-class | Equal-billing with URL fetch | REQ-2001, REQ-1004, NFR-0009 |
| DEC-012 Country-agnostic core | Portals as plugins | REQ-1001, REQ-1003, NFR-0007, ADR-0004 |
| DEC-013 Two-Plane Skill Architecture | `.claude/skills/` vs `.agents/skills/` | ARCH-0008, NFR-0018 |
| DEC-014 SKILL.md orchestrator format | `allowed-tools:` frontmatter canonical | ARCH-0010, NFR-0018, REQ-6002 |
| DEC-015 Multi-model architecture | `model:` field in `.claude/agents/*.md` | ARCH-0009, REQ-6001, NFR-0009 |
| DEC-016 STAR stubs load-bearing in Path A | Stub without fabricating STAR content | REQ-0012, ARCH-0007 |
| DEC-017 AI tooling named explicitly | Tool name in CV/cover letter by name | REQ-2021, business-rules §4.4 |
| DEC-018 Parity baseline + 5 deltas | Must ship 4 reference features + 5 CareerForge deltas | REQ-2030–2053, REQ-2034, REQ-2055, product-overview §Differentiation |
| DEC-019 Local tracking dashboard (retro) | Dashboard as localhost-only v1 differentiator | REQ-5000–5008, ADR-0005, NFR-0017 |
