# Architecture — Index

> **Purpose:** Index and reading order for all CareerForge architecture documents.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Software Architect

---

## Reading Order

Start with the overview for context, then the technology stack, then component design. ADRs document key decisions. The traceability matrix links back to requirements.

| # | Document | Description |
|---|----------|-------------|
| 1 | [Architecture Overview](architecture-overview.md) | System context, containers, high-level structure |
| 2 | [Technology Stack](technology-stack.md) | Languages, frameworks, tools, and rationale |
| 3 | [Component Design](component-design.md) | Major subsystems: profile, search, application, career |
| 4 | [Data Architecture](data-architecture.md) | File-based data model, schemas, relationships |
| 5 | [API Design](api-design.md) | Command interfaces and contracts |
| 6 | [State Management](state-management.md) | Mutable state, persistence, consistency |
| 7 | [Security Architecture](security-architecture.md) | Data protection, access control, privacy |
| 8 | [Cross-Cutting Concerns](cross-cutting-concerns.md) | Error handling, i18n, logging, extensibility |
| 9 | [Deployment & Infrastructure](deployment-infrastructure.md) | Distribution model, installation, updates |
| 10 | [ADR-0001: File-Based Data Storage](adr-0001-file-based-data.md) | Why files over databases |
| 11 | [ADR-0002: Drafter-Reviewer Pipeline](adr-0002-drafter-reviewer.md) | Why two agents |
| 12 | [ADR-0003: LaTeX for Document Generation](adr-0003-latex-generation.md) | Why LaTeX over alternatives |
| 13 | [ADR-0004: Pluggable Job Portal Adapters](adr-0004-pluggable-portals.md) | Why a plugin architecture |
| 14 | [ADR-0005: Tracking Dashboard Stack](adr-0005-tracking-dashboard-stack.md) | Bun + Hono + HTMX + Pico.css for the local tracking dashboard — **stack superseded by ADR-0006** |
| 15 | [ADR-0006: Dashboard Stack — Next.js over File-as-DB](adr-0006-dashboard-nextjs-file-as-db.md) | Why Next.js + React + shadcn + Tailwind + Nivo (file-as-DB, no Prisma/auth); supersedes ADR-0005's stack |
| 16 | [Traceability Matrix](traceability-matrix.md) | Requirements → Architecture mapping |

## Cross-References

- **Requirements (Phase 1):** [../requirements/00-index.md](../requirements/00-index.md) — What this architecture satisfies
- **Plan (Phase 3):** [../plan/00-index.md](../plan/00-index.md) — How this architecture is built
- **Glossary:** [../glossary.md](../glossary.md) — Domain terms

## ID Scheme

- `ARCH-0xxx` — Architecture elements
- `ADR-000x` — Architecture Decision Records
