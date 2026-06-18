# Requirements — Index

> **Purpose:** Index and recommended reading order for all CareerForge requirements documents.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## Reading Order

Start with the product overview to understand scope and context, then review personas before diving into functional requirements. Business rules and data requirements provide the detail layer. Finish with non-functional requirements, integrations, and the assumptions log.

| # | Document | Description |
|---|----------|-------------|
| 1 | [Product Overview](product-overview.md) | Problem statement, target users, value proposition, scope boundaries |
| 2 | [Personas & Actors](personas-and-actors.md) | User persona, AI agent personas, interaction model |
| 3 | [Functional Requirements — Onboarding](functional-requirements-onboarding.md) | Profile setup (3 paths), competency expansion, profile reset |
| 4 | [Functional Requirements — Job Search](functional-requirements-job-search.md) | Multi-portal search, deduplication, fit assessment |
| 5 | [Functional Requirements — Application](functional-requirements-application.md) | Drafter-reviewer workflow, CV/cover letter generation, PDF verification |
| 6 | [Functional Requirements — Career Development](functional-requirements-career-development.md) | Skill gap analysis, learning plans, interview preparation |
| 7 | [Functional Requirements — Salary Benchmarking](functional-requirements-salary.md) | Salary data import, company lookup, integration with evaluation |
| 8 | [Functional Requirements — Tracking Dashboard](functional-requirements-tracking-dashboard.md) | Local web dashboard over the CSV tracker — list, filter, inline status update, pipeline summary |
| 9 | [Functional Requirements — Framework Meta](functional-requirements-framework-meta.md) | Cross-cutting framework requirements — configurable research model, workspace permissions, quick sub-commands |
| 10 | [Functional Requirements — Internationalization & Localization](functional-requirements-internationalization.md) | Translating user surfaces (canonical-English internals), single `i18n/` tree, language tiers, pluggable locale packs |
| 11 | [Functional Requirements — Trust & Safety](functional-requirements-trust-and-safety.md) | Posting legitimacy gate + verdict, red-flags signals, ghost-job detection, locale-aware scam catalog |
| 12 | [User Flows](user-flows.md) | End-to-end user journeys with Mermaid flowcharts |
| 13 | [Business Rules & Validation](business-rules-and-validation.md) | Scoring frameworks, page limits, content cutting, verification |
| 14 | [Data Requirements](data-requirements.md) | Conceptual data model, entities, relationships, constraints |
| 15 | [Non-Functional Requirements](non-functional-requirements.md) | Performance, accessibility, i18n, security, browser support |
| 16 | [Integrations & Dependencies](integrations-and-dependencies.md) | AI platform, LaTeX, web APIs, job portal adapters |
| 17 | [Assumptions, Decisions & Open Questions](assumptions-decisions-questions.md) | Inferred requirements, design choices, items for review |

## Cross-References

- **Glossary:** [../glossary.md](../glossary.md) — Defines all domain terms used in these documents.
- **Architecture (Phase 2):** [../architecture/00-index.md](../architecture/00-index.md) — How requirements are satisfied.
- **Plan (Phase 3):** [../plan/00-index.md](../plan/00-index.md) — How requirements are built.
- **Testing (Phase 4):** [../testing/00-index.md](../testing/00-index.md) — How requirements are verified.

## ID Scheme

All requirements in this suite use the following ID prefixes:
- `REQ-0xxx` — Functional requirements (onboarding)
- `REQ-1xxx` — Functional requirements (job search)
- `REQ-2xxx` — Functional requirements (application pipeline)
- `REQ-3xxx` — Functional requirements (career development)
- `REQ-4xxx` — Functional requirements (salary benchmarking)
- `REQ-5xxx` — Functional requirements (tracking dashboard)
- `REQ-6xxx` — Functional requirements (framework meta — agents, permissions, sub-commands)
- `REQ-7xxx` — Functional requirements (internationalization & localization)
- `REQ-8xxx` — Functional requirements (trust & safety — posting legitimacy)
- `NFR-0xxx` — Non-functional requirements

Each requirement includes: ID, description, priority (MoSCoW), and acceptance criteria.
