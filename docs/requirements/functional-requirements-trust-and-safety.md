# Functional Requirements — Trust & Safety

> **Purpose:** Specifies the requirements for CareerForge's detection of and warning about illegitimate job postings — scams, ghost jobs, and exploitative terms — in a country-agnostic way.
>
> **Status:** Draft
> **Last updated:** 2026-06-18
> **Owner persona:** Business Analyst

---

## Overview

Job seekers anywhere in the world are exposed to postings that are not what they claim to be: outright scams that harvest money or personal data, "ghost jobs" that are never meant to be filled, and listings with exploitative or unverifiable terms. CareerForge already evaluates how well a posting *fits* the user; this document specifies a parallel, deliberately separate concern — whether the posting is *legitimate enough to engage with at all*.

The guiding stance is advisory, not custodial. The system surfaces a legitimacy assessment with cited reasons, but the human always decides whether to proceed (ARCH-0006, Human-in-the-Loop). It never invents an accusation it cannot evidence (ARCH-0007, No Fabrication), and when legitimacy signals are unavailable it fails open with a neutral note rather than crashing the pipeline (ARCH-0005, Graceful Degradation). Like the rest of the product, it makes no hardcoded country, portal, or locale assumptions.

A central design decision underpins this whole document: **legitimacy is a standalone gate, not a component of the 0–100 fit score.** A scam can be, on paper, an excellent fit. Folding legitimacy into the fit score would let such a posting score high and slip through. The two assessments are therefore kept orthogonal — one answers "should you trust this?", the other "is this right for you?".

Related documents:
- [Functional Requirements — Job Search](functional-requirements-job-search.md) — Quick fit assessment (REQ-1005) and date filtering / liveness (REQ-1011) that these requirements extend
- [Functional Requirements — Application](functional-requirements-application.md) — The drafter-reviewer pipeline whose entry this gate guards
- [Functional Requirements — Internationalization](functional-requirements-internationalization.md) — Proposed pluggable locale packs (REQ-7009) that carry regional scam knowledge
- [Business Rules](business-rules-and-validation.md) — Fit scoring (kept separate from legitimacy)
- [Glossary](../glossary.md) — Domain terms

---

## Step 0: Legitimacy Gate

### REQ-8001: Posting Legitimacy Assessment in /apply
**Priority:** Must
**Description:** Before any drafting begins, the application pipeline shall produce a **separate legitimacy verdict** for the posting — one of **Verified**, **Caution**, or **Suspicious** — with cited reasons. This verdict is a standalone gate, deliberately NOT folded into the five-dimension fit score (REQ-2010) or its 0–100 overall (REQ-2012). The separation is a locked decision: a posting that is an otherwise strong fit must not be able to score high enough to mask a legitimacy problem. The system warns; the user decides whether to proceed (ARCH-0006).
**Acceptance Criteria:**
- A legitimacy verdict is computed and presented **before** the user approval gate (REQ-2013) and before drafting starts
- The verdict is exactly one of: **Verified** (no material red flags found), **Caution** (one or more soft signals warrant a closer look), **Suspicious** (one or more strong signals indicate likely illegitimacy)
- Each verdict is accompanied by the specific cited reasons that produced it, drawn from the red-flags signal set (REQ-8002); no reason is asserted without evidence from the posting (ARCH-0007)
- The verdict is reported in its own section, visually and structurally distinct from the fit evaluation table — it is never merged into the overall fit number
- A **Suspicious** verdict does not auto-block: the user is warned plainly and asked whether to proceed anyway (ARCH-0006)
- If the posting cannot be assessed (e.g., signals unavailable, content too sparse), the system returns a neutral "legitimacy could not be assessed" note and continues, rather than aborting the pipeline (ARCH-0005)
- The verdict, its reasons, and the assessment outcome are recorded in the application output folder's metadata

### REQ-8002: Red-Flags Signal Set
**Priority:** Must
**Description:** The system shall assess postings against an enumerated set of red-flag signals. Signals are expressed as externalized data, not hardcoded logic, so they apply country-agnostically and can be extended without code changes.
**Acceptance Criteria:**
- The signal set covers at least the following detectable categories:
  - **Upfront fees or payments** — any request for money from the applicant (training fees, equipment deposits, "processing" charges)
  - **Personal-data / ID / banking harvesting** — requests for government ID numbers, bank or card details, or copies of identity documents before a legitimate offer stage
  - **Off-platform redirects** — pushing the conversation to untraceable channels (personal messaging apps, throwaway email) early in the process
  - **Too-good-to-be-true compensation** — pay or benefits implausibly high for the stated role and effort
  - **Vague or absent company identity** — no verifiable company name, address, registration, or web presence
  - **Pressure tactics** — artificial urgency, "act now," or coercion to skip normal hiring steps
  - **Unverifiable contact** — no legitimate corporate contact path; only anonymous or free-mail addresses
- Each signal is data (id, description, severity, locale scope), not branching code; adding or tuning a signal does not require changing the assessment engine
- Signal evaluation makes no assumption about country, currency, language, or portal — thresholds and examples are parameterized, not baked in
- Each fired signal carries the textual evidence from the posting that triggered it, for citation in REQ-8001 (ARCH-0007)
- Severity contributes to the verdict mapping (soft signals → Caution, strong signals → Suspicious), but no single signal silently auto-blocks the user

---

## Step 1: Early Warning in Search

### REQ-8003: Quick Legitimacy Flag in /search Results
**Priority:** Should
**Description:** The job search results shall display a cheap, heuristic legitimacy flag alongside the existing High/Medium/Low quick-fit signal (REQ-1005), so that suspicious postings are visible before the user invests effort in `/apply`.
**Acceptance Criteria:**
- Each result row carries a lightweight legitimacy indicator (e.g., **OK** / **Caution**) computed from cheap heuristics over the title and search snippet — not the full assessment of REQ-8001
- The flag appears alongside the quick-fit signal in the results presentation (REQ-1007), not in place of it
- The heuristic is explicitly a pre-filter signal, not the authoritative verdict; the full gate (REQ-8001) still runs in `/apply`
- A Caution flag never removes a posting from the results — it annotates it, leaving the choice to the user (ARCH-0006)
- When snippet data is too thin to judge, the flag is omitted neutrally rather than defaulting to alarm (ARCH-0005, ARCH-0007)
- The heuristic uses the same externalized signal data (REQ-8002) where applicable; it introduces no country-specific or portal-specific hardcoding

### REQ-8004: Ghost-Job & Reposting Detection
**Priority:** Should
**Description:** The system shall detect postings that exhibit ghost-job characteristics — listings that have been open for an unusually long time, repeatedly reposted, or that never appear to close — and flag them. This extends job-posting liveness handling (REQ-1011 date filtering and the proposed liveness re-check).
**Acceptance Criteria:**
- Detects and flags: postings open far beyond a configurable age threshold, postings re-seen across multiple searches with refreshed dates but identical content, and postings with no closing date that persist indefinitely
- Reuses the seen-jobs registry and date signals already captured during search (REQ-1006, REQ-1011) rather than introducing a separate crawl
- A ghost-job flag is advisory: it surfaces as a Caution-level reason in the legitimacy assessment (REQ-8001) and as a quick flag in search (REQ-8003); it does not auto-skip the posting (ARCH-0006)
- Age and reposting thresholds are configurable, with no assumption about a specific market's hiring cadence (country-agnostic)
- If posting dates are indeterminate, the listing is flagged "liveness unknown" rather than assumed live or dead (ARCH-0005), consistent with REQ-1011

---

## Step 2: Extensible Knowledge

### REQ-8005: Scam-Pattern Catalog
**Priority:** Should
**Description:** Scam-pattern knowledge shall live in a community-extensible, **locale-aware** catalog of patterns, externalized as data so that communities can contribute regional scam knowledge. Scam patterns differ by region and market; the catalog therefore ties into the proposed pluggable locale packs (REQ-7009) rather than encoding patterns in core logic.
**Acceptance Criteria:**
- Scam patterns are stored as externalized data entries (pattern id, description, matching signals, locale scope, source/attribution), not as hardcoded rules
- The catalog is **locale-aware**: a pattern may apply globally or be scoped to one or more locales, and locale-scoped patterns are delivered via the pluggable locale packs defined in REQ-7009
- The core assessment engine (REQ-8001, REQ-8002) consumes catalog entries generically; adding a region's patterns requires shipping or installing a locale pack, not changing engine code
- Contributors can extend the catalog without modifying core code, consistent with the project's Extensible & Open principle
- When no locale pack is installed for the user's region, the engine falls back to the global pattern set and notes the reduced coverage neutrally (ARCH-0005)
- Catalog-derived accusations always cite the matched pattern and the posting evidence; an uncited pattern match is never surfaced as a definitive verdict (ARCH-0007)

---

## Cross-References

- **Quick fit assessment:** [REQ-1005](functional-requirements-job-search.md) — the High/Medium/Low signal the quick legitimacy flag (REQ-8003) sits beside
- **Date filtering / liveness:** [REQ-1011](functional-requirements-job-search.md) — the liveness foundation ghost-job detection (REQ-8004) extends
- **Application pipeline:** [Functional Requirements — Application](functional-requirements-application.md) — the fit evaluation (REQ-2010, REQ-2012) and approval gate (REQ-2013) the legitimacy gate (REQ-8001) precedes and stays separate from
- **Locale packs:** [REQ-7009](functional-requirements-internationalization.md) — the pluggable locale packs that carry the locale-aware scam-pattern catalog (REQ-8005)
- **Architecture invariants:** ARCH-0005 Graceful Degradation, ARCH-0006 Human-in-the-Loop, ARCH-0007 No Fabrication
- **Glossary:** [../glossary.md](../glossary.md) — domain terms, including the new terms introduced below

---

## New Glossary Terms Introduced

These terms are introduced by this document and should be added to the glossary separately:

- **Posting Legitimacy** — The assessment of whether a job posting is genuine and safe to engage with, kept deliberately separate from how well it fits the candidate.
- **Red Flag** — A detectable signal in a posting that suggests possible illegitimacy (e.g., upfront fees, data harvesting, off-platform redirects), expressed as externalized data.
- **Ghost Job** — A posting that is not genuinely intended to be filled, typically evidenced by being long-open, repeatedly reposted, or never closing.
- **Legitimacy Verdict** — The standalone gate outcome for a posting — Verified, Caution, or Suspicious — with cited reasons, produced independently of the fit score.
