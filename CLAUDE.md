# CLAUDE.md — Project Memory & Agent Instructions

## Identity

This is **CareerForge** (working directory: `ai-job-search`) — an open-source,
AI-powered job application framework designed to work for job seekers anywhere
in the world, regardless of country, language, or local job market. It is
built with Claude Code.

The product is positioned against `MadsLorentzen/ai-job-search` (MIT) — a
mature, Denmark-focused predecessor with the same drafter-reviewer + LaTeX
architecture. CareerForge's wedge is **country-agnostic from the core, a
first-class tracking dashboard, and a cost-aware (opt-out) reviewer.** See
[`.reference/competitive-analysis/madslorentzen-ai-job-search.md`](./.reference/competitive-analysis/madslorentzen-ai-job-search.md)
for the full study.

## Prime Directive

**Build from the docs, not from external code.** The canonical source of
truth for what this product does, how it is architected, and how to build
it lives in `/docs`. Every implementation decision flows from those
documents. You never copy or reproduce code from other projects.

## Documentation Map

Read these in order when you need to understand the product:

1. **Requirements** → `docs/requirements/00-index.md`
   The complete functional and non-functional specification.
   Every requirement has a `REQ-####` or `NFR-####` ID.

2. **Architecture** → `docs/architecture/00-index.md`
   Technology stack, component design, data model, API contracts,
   security model. Every element has an `ARCH-####` ID and traces
   to the requirements it satisfies.

3. **Plan** → `docs/plan/00-index.md`
   Milestones, work breakdown, sequencing, and the task backlog.
   Each task references `REQ-` and `ARCH-` IDs.

4. **Development** → `docs/development/00-index.md`
   Coding standards, project structure, local setup, contribution
   workflow, and implementation guides per component.

5. **Testing** → `docs/testing/00-index.md`
   Test strategy, test plans, test case catalog (`TC-####` IDs
   tracing to `REQ-####`), CI gates, and QA checklists.

6. **Glossary** → `docs/glossary.md`
   Canonical terminology. Use these terms consistently.

## Private Research Reference

The `.reference/` folder (gitignored) contains competitive analysis and
pattern research gathered from studying existing products. This is
internal inspiration material.

**How to use `.reference/` when developing:**
- You may read `.reference/` to understand patterns, UX ideas, and
  architectural approaches that informed the product design.
- You must NEVER copy code, UI copy, brand elements, or proprietary
  implementation details from reference material.
- Any insight from `.reference/` that affects the product must already
  be captured in `/docs` as an original requirement or architecture
  decision. If it isn't, update `/docs` first, then implement from
  the doc — not from the reference.
- The flow is always: reference → insight → docs update → implementation.
  Never: reference → implementation.

## Core Design Principles

### 1. Country-Agnostic by Default
This product serves job seekers globally. Every feature must work
without assuming a specific country, language, job portal, or locale.

- **Job source providers are pluggable.** The system defines a generic
  provider interface. Each country/region/job-board is a separate
  provider module that implements this interface. Adding a new country
  means adding a new provider, not changing core logic.
- **No hardcoded locales.** Currency, date formats, salary ranges,
  language, and regulatory assumptions (e.g., CV vs résumé conventions,
  photo inclusion norms, GDPR) are configurable per-region, never
  baked into core code.
- **i18n-ready from day one.** All user-facing strings are
  externalized. Default language is English; the architecture supports
  adding translations without code changes.

### 2. AI-Native Workflow
Claude is not a bolt-on — it is the core engine for job evaluation,
CV/cover-letter generation, interview preparation, and career guidance.
Design every workflow assuming an AI agent is the primary operator,
with the human reviewing and approving outputs.

### 3. Privacy-First
Job search data is deeply personal. The product operates locally by
default. User profiles, application history, and generated documents
stay on the user's machine unless they explicitly choose otherwise.

### 4. Extensible & Open
The architecture supports community-contributed provider modules,
CV/cover-letter templates, evaluation criteria, and locale packs.
Design for extension: clear interfaces, plugin boundaries, and
documentation that makes contribution easy.

## Technology Stack

Canonical source: [`docs/architecture/technology-stack.md`](docs/architecture/technology-stack.md).
Summary (keep this in sync if the canonical doc changes):

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | Claude Code CLI | Prompt-as-code; workflow lives in Markdown, executed by the AI assistant. No compiled core. |
| Workflow definition | Markdown (`.claude/commands/*.md`, `.claude/skills/*/*.md`) | Human-readable, version-control friendly, modifiable without programming. |
| Document generation | LaTeX — `lualatex` for CV (moderncv banking), `xelatex` for cover letter (custom class + fontspec) | Two compilers required: `fontawesome5` needs `lualatex`; custom fonts need `xelatex`. See ADR-0003. |
| Typography | Lato + Raleway (bundled) | Cover letter fonts |
| Utility scripts | Python 3.10+ (stdlib + optional `openpyxl`) | Salary lookup, Excel→JSON conversion |
| Job portal adapters | TypeScript + Bun, per-adapter `package.json` | Per-portal CLI scrapers, pluggable per ADR-0004 |
| Data storage | Markdown / JSON / CSV — file-as-DB | ADR-0001. Small data, human-readable, git-tracked. |
| Version control | Git | Distribution, history, audit |

**Hard rules from architecture:**
- ARCH-0001 Prompt-as-code · ARCH-0002 Skill composition · ARCH-0003 Agent isolation (drafter/reviewer)
- ARCH-0004 File-as-DB · ARCH-0005 Graceful degradation · ARCH-0006 Human-in-the-loop · ARCH-0007 No fabrication

**No global build step. No monorepo tooling. Each component installs independently.**

## Agent Workflow — How to Pick Up a Task

1. Read the task description from the plan (`docs/plan/`).
2. Identify the `REQ-` and `ARCH-` IDs the task references.
3. Read the corresponding requirements and architecture docs.
4. Read the relevant implementation guide in `docs/development/`.
5. If helpful, check `.reference/patterns/` for design pattern context.
6. Implement from the docs. Write tests per `docs/testing/`.
7. Verify acceptance criteria from the requirement.
8. Update `docs/` if the implementation revealed a needed spec change.

## Commit Conventions

- Format: `type(scope): description` (Conventional Commits)
- Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`
- Keep commits atomic — one logical change per commit.
- Reference task/issue IDs in commit messages.

## File & Folder Hygiene

- Source code lives in `src/` (or as defined in `docs/development/`).
- Tests mirror source structure in `tests/` or colocated as `*.test.ts`.
- Generated outputs (CVs, cover letters) go in a gitignored `output/` dir.
- User profile/config goes in a gitignored `config/` or `.profile/` dir.
- Never commit API keys, personal data, or generated documents.

## What NOT to Do

- Do not copy code from external repositories.
- Do not hardcode country-specific logic in core modules.
- Do not add features not captured in `/docs/requirements/`.
  If a feature is needed, update the requirements first.
- Do not skip tests. Every `REQ-` should have a `TC-`.
- Do not commit `.reference/`, `output/`, or personal config.
