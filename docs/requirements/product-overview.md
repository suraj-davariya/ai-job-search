# Product Overview — CareerForge

> **Purpose:** Defines the problem CareerForge solves, who it serves, and the boundaries of the product scope.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## Problem Statement

Job seekers face a compounding set of inefficiencies when applying for positions:

1. **Repetitive manual tailoring.** Each application requires adapting a CV and writing a cover letter from scratch, despite most content being reused with minor variations. A single thoughtful application takes 2–4 hours.
2. **Inconsistent quality.** Without external review, applications suffer from generic language, missed keywords, factual drift, and formatting problems that only surface in the final PDF.
3. **No systematic fit evaluation.** Most applicants decide whether to apply based on gut feel rather than structured assessment, leading to wasted effort on poor-fit roles and missed opportunities for strong-fit ones.
4. **Scattered career data.** Professional information lives across CVs, LinkedIn, diplomas, reference letters, and past applications with no single source of truth, leading to inconsistencies and forgotten accomplishments.
5. **Blind skill gaps.** Job seekers often cannot articulate the delta between their current competencies and their target roles, making upskilling reactive rather than strategic.

## Solution

CareerForge is an **AI-powered job application framework** that operates as a structured workflow layer on top of an AI coding assistant. It provides:

- **One-time profile setup** that creates a comprehensive, structured professional record from multiple source materials
- **Automated job search** across configurable job portals with fit-based ranking
- **A drafter-reviewer pipeline** that produces tailored, publication-quality CVs and cover letters with mandatory quality verification
- **Career development tools** that analyze skill gaps and generate prioritized learning plans
- **Interview preparation** grounded in the user's actual experience

The framework encodes career guidance best practices (structured evaluation criteria, forward-looking cover letter framing, relevance-weighted content selection) so that every application reflects expert-level strategy without requiring the user to be a career counselor.

## Target Users

### Primary User

**Technical professionals in active job search** — engineers, data scientists, researchers, consultants, and similar knowledge workers who:
- Have substantive professional experience (2+ years) worth tailoring
- Are comfortable with a CLI-based workflow and version control
- Value quality over speed in their applications
- Want systematic career management, not just one-off applications

### Secondary Users

- **Career changers** who need help reframing transferable skills for new domains
- **Academics transitioning to industry** who have rich experience but struggle with industry-format applications
- **Passive job seekers** who want to monitor the market and understand their positioning without actively applying

### Non-Users

CareerForge is **not designed for:**
- Entry-level applicants with minimal experience to tailor
- High-volume applicants who prioritize quantity over quality
- Users who need a visual GUI or web-based interface
- Users who want the AI to apply on their behalf without oversight

## Value Proposition

| Without CareerForge | With CareerForge |
|---------------------|------------------|
| 2–4 hours per tailored application | 15–30 minutes of review and approval per application |
| Generic cover letters that repeat CV content | Forward-looking cover letters that address the employer's needs |
| No systematic way to evaluate fit before investing effort | Structured 5-dimension fit evaluation before any drafting begins |
| Formatting issues discovered after submission | Mandatory PDF compilation and visual verification before presentation |
| Skills scattered across multiple documents | Single source of truth populated from all career materials |
| Reactive upskilling ("I got rejected, maybe I should learn X") | Proactive skill gap analysis with prioritized learning plans |
| Interview prep starts from scratch each time | STAR examples pre-built from actual experience and mapped to question types |

## Core Workflow

```
/setup              /search              /apply <posting>
  │                    │                      │
  ▼                    ▼                      ▼
Build profile      Search portals        Evaluate fit
from documents     for matching          Score & recommend
  │                positions               │
  ▼                    │                      ▼
Profile files      Present matches       Draft CV + Cover Letter
ready              with fit ratings      (LaTeX, tailored)
                       │                      │
                       ▼                      ▼
                   Pick a match          Reviewer agent critiques
                   → /apply              → Revise → Compile
                                              │
                                              ▼
                                         Verify PDFs
                                         → Present final output
```

Supporting workflows:
- `/expand` — Enrich profile from documents and online presence
- `/upskill` — Analyze skill gaps and generate learning plans
- `/reset` — Clear profile data for fresh start

## Scope

### In Scope (v1)

| Area | Included |
|------|----------|
| Profile management | Multi-path onboarding, structured profile files, idempotent updates |
| Job search | Multi-portal search with pluggable adapters, deduplication, fit ranking |
| Application generation | Drafter-reviewer pipeline, LaTeX CV + cover letter, PDF verification |
| Quality assurance | Writing style enforcement, factual verification, relevance-weighted cutting |
| Career development | Competency expansion, skill gap analysis, learning plan generation |
| Interview preparation | STAR examples, tough questions, roleplay guidelines |
| Salary benchmarking | BYO salary data lookup, company matching, integration with evaluation |
| Application tracking | Append-only CSV tracker as source of truth, plus a local web dashboard for visual review and inline status updates (see REQ-5xxx) |

### Out of Scope

| Area | Rationale |
|------|-----------|
| Automated job application submission | Users must review and submit manually; CareerForge prepares materials |
| Cloud-hosted GUI or multi-user web app | The tracking dashboard runs strictly on `localhost`; no auth, no server deployment, no shared instances. Multi-tenant scenarios are not a goal. |
| ATS (Applicant Tracking System) optimization | Formatting is for human readers; ATS keyword gaming is not a goal |
| Networking/outreach automation | CareerForge handles documents, not relationship management |
| Proprietary salary data | Users bring their own data; no built-in salary database |
| Job portal account management | CareerForge searches public listings; it does not log in to portals |
| Multi-user collaboration | Single-user, single-profile design |

## Success Metrics

1. **Application quality:** Every CV compiles to exactly 2 pages; every cover letter compiles to exactly 1 page; zero fabricated claims
2. **Time savings:** Application preparation time under 30 minutes from job posting to final verified PDF
3. **Fit accuracy:** Users should agree with the system's fit assessment in ≥80% of evaluations
4. **Profile completeness:** All seven profile files fully populated after onboarding
5. **Reusability:** Profile setup is a one-time investment; subsequent applications require only review and approval
6. **Tracking visibility:** Users can review their full application pipeline (status counts, fit-filtered active list, generated CV/cover-letter links) in the dashboard in under 5 seconds from launch.
7. **Parity baseline:** All four reference-product headline differentiators (PDF verification, relevance-weighted cutting, drafter-reviewer separation, token-efficient dispatch) ship in v1 and pass their respective acceptance criteria — confirming CareerForge delivers the table-stakes baseline before differentiating.

## Differentiation vs. Reference Product

CareerForge is studied against [`MadsLorentzen/ai-job-search`](https://github.com/MadsLorentzen/ai-job-search) (MIT) — see `.reference/competitive-analysis/madslorentzen-ai-job-search.md`. The strategy is **parity baseline + 5 deltas** (DEC-018): CareerForge ships all four of the reference's headline differentiators as table stakes, then adds five of its own.

### Parity Baseline (table stakes — must ship)

These four features are the reason users choose this category of tool over manual workflows. CareerForge ships them all:

1. **PDF verification loop** (mandatory compile-and-inspect every application) — REQ-2050–2053
2. **Relevance-weighted CV cutting** (score-based, not section-based) — `business-rules-and-validation.md §2.2`
3. **Drafter-reviewer separation** (two agents, fresh contexts) — REQ-2030–2042
4. **Token-efficient reviewer dispatch** (inline drafts; verification once at end) — REQ-2024, REQ-2031

### CareerForge Deltas (intentional differentiators)

1. **Country-agnostic core.** Portal adapters are plugins implementing a generic provider interface (ARCH-0004 / ADR-0004, DEC-012). Locale concerns are configurable, not hardcoded.
2. **First-class tracking dashboard.** A local web UI over the same append-only CSV (REQ-5xxx, ADR-0005). The reference product has CSV only.
3. **Cost-aware reviewer.** Reviewer agent is opt-out per application via `--review=full|quick|none` (REQ-2034, DEC-009).
4. **Layout-fix memory.** Persist LaTeX layout-fix patterns per template to reduce token spend on iteration (REQ-2055, DEC-010).
5. **Manual-paste flow as first-class.** Equal-billing input alongside URL fetch — not a fallback (REQ-2001, DEC-011).
