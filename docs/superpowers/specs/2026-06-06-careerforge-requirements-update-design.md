# CareerForge — Requirements Suite Update Design

> **Author:** Brainstorming session, 2026-06-06 (extended 2026-06-07 with reference parity audit)
> **Status:** Awaiting user review before writing-plans handoff
> **Scope:** A (consistency) + B (differentiators) + C (impl-guide drift) + D (architecture distinctions from reference) + E (data path drift from reference) + F (workflow REQ gaps from reference) + G (positioning vs. reference)
> **Not in scope:** New product capabilities beyond what the reference already implements + our 5 differentiators; component-design audit; risk register; test catalog entries; the four Danish portal adapters' source code (we keep our pluggable interface but do not port their portals)

---

## 1. Context

Three prior rounds added the tracking dashboard (REQ-5000–5008, NFR-0014–0017, ADR-0005, business-rules §9, data schema migration, work-breakdown Epic 9, traceability rows, impl guide, test plan, user flow §8) and added a "Differentiation vs. Reference Product" section to `product-overview.md`. The rest of the requirements suite has not yet absorbed those additions.

Seven classes of work remain:

- **A. Internal consistency** — assumptions, open questions, personas, glossary, and one column list in `REQ-1009` now contradict the dashboard work.
- **B. Realize the four unwritten differentiators** — the bullets in `product-overview.md §Differentiation vs. Reference Product` are claims; only one (the dashboard) has matching REQs. The other three need to become real REQ/NFR entries, each with a `DEC-###` to record the decision.
- **C. Pre-existing impl-guide drift** — `implementation-guide-job-search.md §5` describes the tracker CSV with a different schema, a different filename (`settings/tracker.csv`), and a different status enum than the canonical `data-requirements.md §11` + `business-rules §9`. This predates the dashboard work; it should be cleaned up here because every impl-guide that references the tracker should agree.
- **D. Architecture distinctions surfaced by the reference codebase audit (2026-06-07)** — the reference uses *two* skill planes (Claude Code skills vs. CLI sub-agent skills), exposes `/scrape` and `/upskill` as skills-with-triggers rather than slash commands, defines named sub-agents in `.claude/agents/`, formalizes a `SKILL.md` orchestrator with frontmatter, declares `allowed-tools` per skill, uses `.claude/settings.local.json` for workspace permissions, and runs Gemini (a different LLM) for research synthesis. None of this is currently in our `/docs`. Without it, anyone implementing from our specs would land on the wrong architectural primitives.
- **E. Data model path drift from the reference codebase audit** — five concrete paths in our docs disagree with the reference: `seen_jobs.json` location, `salary_lookup.py` location, `search-queries.md` location, the `documents/applications/<company>_<role>/` subfolder schema, and the canonical `CLAUDE.md` candidate-profile template.
- **F. Workflow REQ gaps from the reference codebase audit** — four behavior details exist in the reference's `/setup`, `/apply`, and skill files but not in our REQs: the enumeration of `--section` partial-update modes; STAR candidate stubs as a load-bearing Path A behavior; the "**Claude Code** by name" writing rule; and the "quick sub-commands" pattern (per-step invocation of a skill workflow).
- **G. Competitive positioning gap** — `product-overview.md §Differentiation vs. Reference Product` lists our 5 deltas but never acknowledges the reference's 4 baseline differentiators (PDF verification loop, relevance-weighted cutting, drafter-reviewer separation, token-efficient reviewer dispatch). A reader could conclude our 5 are the *only* delivery rather than deltas *on top of* a parity baseline.

---

## 2. Goals

1. The requirements suite (REQ/NFR + ASM/DEC/OQ + personas + glossary + integrations) is internally consistent after the update.
2. Every claim in `product-overview.md §Differentiation vs. Reference Product` has a corresponding REQ/NFR.
3. The four new differentiator decisions are recorded as `DEC-009`…`DEC-012` so future readers can find the rationale.
4. The tracker schema has a single source of truth (`data-requirements.md §11` + `business-rules §9`); other docs link rather than duplicate.
5. CareerForge's `/docs` describe the same architectural primitives the reference codebase actually uses (two skill planes, named sub-agent definitions, `SKILL.md` orchestrator, `allowed-tools`, `settings.local.json`, multi-model option). A developer who builds from our `/docs` should land on the same shape, with our 5 differentiators on top.
6. Every file path and schema in our `/docs` matches the reference codebase by default. Where we deliberately diverge, the divergence is documented as a `DEC`.
7. The four reference-baseline differentiators (PDF verification loop, relevance-weighted cutting, drafter-reviewer separation, token-efficient reviewer dispatch) are explicitly named as table-stakes in `product-overview.md`. CareerForge's 5 deltas remain framed as additions, not the whole product.

## 3. Non-Goals

- No new product capabilities beyond the four differentiators already claimed in `product-overview.md` and the reference-parity items in Sections D–G.
- No `component-design.md` deep audit (the dashboard's `ARCH-0060` formal entry is still future work; Sections D adds new ARCH principles but does not audit the existing component sections line-by-line).
- No test-case catalog updates (the `TC-DBD-###` entries are still future work).
- No `risk-register.md` or `dependency-sequencing.md` edits.
- We do not port the reference's four Danish portal adapters (`jobbank`, `jobdanmark`, `jobindex`, `jobnet`) as first-party adapters. Our pluggable interface stays; specific portals are user/community work per `ADR-0004`.
- We do not adopt the reference's seven-file profile-skill structure as the *implementation* — we keep our docs flexible — but we DO formalize the orchestrator + `allowed-tools` pattern so the implementer has a clear target.

---

## 4. Approach

Hybrid:

- **A and C** are atomic inline edits — they reconcile inconsistencies and pre-existing drift. No new docs, no new IDs.
- **B** is each a real product decision and gets a `DEC-###` entry in `assumptions-decisions-questions.md` plus a REQ/NFR change in the relevant file.

Considered and rejected:

- *Atomic edits everywhere* — would silently drop the WHY of the four differentiators. Future readers would have to git-blame to find the rationale.
- *Full versioned supersession with "amended by" markers* — overkill for Draft-status documents with no production users.

---

## 5. Detailed Edits

### Section A — Internal consistency

#### A.1 `requirements/assumptions-decisions-questions.md` ASM-002 — rewrite

Current text: "No GUI is required for v1."

New text (proposed):
> No general-purpose GUI is required for v1. A scoped tracking dashboard (REQ-5000–REQ-5008) is the single, deliberate GUI exception — it runs only on `127.0.0.1`, covers tracker review only, and is opt-in. Broader GUIs (cloud-hosted web app, mobile, multi-user) remain out of scope per OQ-003.

Impact paragraph stays largely the same; add: "The dashboard's network surface is constrained by NFR-0017."

#### A.2 same file, OQ-003 GUI Layer — resolve partially

- **Status:** `Deferred` → `Partially Resolved`
- **Body:** Split into two parts:
  - "Tracking dashboard — accepted." Reference REQ-5xxx, ADR-0005, and new **DEC-008 Local Tracking Dashboard** (see A.8 below) which formalizes the decision retroactively.
  - "General-purpose GUI / multi-user / cloud-hosted — still deferred."
- **Recommendation line:** "Tracking dashboard ships in v1. Any further GUI surface is a separate decision."

#### A.8 `requirements/assumptions-decisions-questions.md` — add DEC-008 (retrospective)

**DEC-008 (new):** Local Tracking Dashboard

> CareerForge ships a localhost-only web dashboard over the application tracker CSV in v1 as a deliberate differentiator vs. the reference product. The dashboard is single-user, no-auth, runs only on `127.0.0.1`, and reads/writes the same CSV that `/apply` appends to. Wider GUI scope (cloud, multi-user, mobile, branded site) remains out per OQ-003. Decided in the previous brainstorming round when adding REQ-5xxx; recorded here for traceability.

> **Rationale:** The reference product tracks applications in CSV alone, leaving users to manage status in spreadsheets. A scoped GUI restricted to localhost and tracker concerns gets visual triage without acquiring a server, auth, or telemetry surface.

> **Trade-off:** Introduces Bun + Hono + HTMX + Pico.css as runtime deps for users who use the dashboard. Mitigated by Bun being already required for portal adapters (DEC-012 / ADR-0004) and by graceful degradation (NFR-0009): the dashboard is removable without affecting `/apply`.

#### A.3 `requirements/functional-requirements-job-search.md` REQ-1009 — add column

- Add `last_updated` to the tracker column enumeration.
- Add a one-line cross-reference: "Canonical schema: see `data-requirements.md §11`. Status enum: see `business-rules-and-validation.md §9`."

#### A.4 `requirements/personas-and-actors.md` Persona 1 — new key task

Add row to the "Key Tasks" table:

| Task | Trigger | Frequency |
|------|---------|-----------|
| Review pipeline / update application status / append manual applications | Via `/dashboard` | Weekly–daily during active search |

#### A.5 same file, Actor Interaction Matrix — new row

| Action | User | Drafter | Reviewer | Research |
|--------|------|---------|----------|----------|
| Use tracking dashboard | ✅ | — | — | — |

#### A.6 `glossary.md` — add 5 entries

Under the right letters:

- **Tracking Dashboard** — Local web UI (Bun + Hono + HTMX + Pico.css) over the application tracker CSV; runs on `127.0.0.1` only; allows status/notes edits + manual row append. See REQ-5xxx, ADR-0005.
- **Pipeline KPI** — Aggregate counts per application status plus average fit rating (30d) and interviews-per-application rate (90d); rendered in the dashboard summary strip (REQ-5003).
- **Atomic CSV Write** — The dashboard's write contract: read → mutate target cells → write to tempfile → fsync → rename over original, with a `.bak` retained. Guarantees readers and the `/apply` appender never see a partial file (NFR-0016).
- **Application Status Enum** — Canonical set of seven status values (`Draft, Sent, Interview, Offer, Rejected, Withdrawn, Closed`) with allowed transitions and a "muted" set for de-emphasized rendering. See `business-rules-and-validation.md §9`.
- **Read-Only Mode** — Dashboard launch flag (`--read-only`) that disables all mutating routes and renders all edit controls as disabled. Used for screenshots, demos, and accidental-write protection (REQ-5007).

#### A.7 `requirements/integrations-and-dependencies.md` §7 — broaden

- Rename section: "Bun-Based Local Tools (Portal Adapters + Tracking Dashboard)".
- Add a paragraph: "The tracking dashboard (REQ-5xxx) is the second consumer of the Bun runtime. It uses Bun's built-in HTTP server plus Hono and a vendored HTMX/Pico.css. The Bun version floor is the higher of the two consumers' requirements."
- Add to "Dependency Summary" table row for Bun: change "Optional" → "Optional (required only if portal adapters or dashboard are used)".

---

### Section B — Realize the four differentiators

Each differentiator yields one `DEC` plus targeted REQ/NFR updates.

#### B.1 Cost-aware reviewer — DEC-009 + REQ-2034 + REQ-2030 update

**DEC-009 (new):** Reviewer is opt-out at the application level

> The drafter-reviewer split (DEC-002) doubles per-application token cost, which is not always justified — quick drafts for low-stakes applications, follow-up applications to the same employer, or applications under time pressure all benefit from skipping the reviewer or running a lighter "quick" mode. The reviewer remains the default, but a per-application flag allows skipping it.

**REQ-2030 update:** add to acceptance: "Reviewer spawning is conditional on the application-level `--review` mode."

**REQ-2034 (new):** Reviewer Opt-Out — Priority Must

- The `/apply` command accepts `--review=full|quick|none` (default `full`).
- `full` — current behavior (reviewer with company research + Part A + Part B).
- `quick` — reviewer runs but skips company research; returns Part A only (machine-applicable edits).
- `none` — reviewer step is skipped entirely; the drafter still runs the final verification checklist.
- Before each application starts, the system prints an estimated token cost for the selected mode.
- The choice is recorded in the tracker row as part of `notes` or a new column (decided in plan).

**Persona update:** `personas-and-actors.md` Reviewer Agent — change "Spawned by the drafter agent during Step 3" → "Spawned conditionally during Step 3, per the application-level review mode (REQ-2034)."

#### B.2 Layout-fix memory — DEC-010 + REQ-2055 + REQ-2053 update + data §13

**DEC-010 (new):** Persist learned layout fixes per template

> The compile-and-inspect loop (REQ-2053) iterates with LLM-driven fixes for orphans, overflow, and font mismatches. The same fix patterns recur across applications using the same template, so the LLM spends tokens re-deriving them. Persisting `(template-id, issue-signature, fix-snippet)` triples turns later applications into a cache hit on the first attempt.

**REQ-2053 update:** add acceptance: "Before invoking the LLM-driven fix, attempt cached fixes from the layout-fix memory matching the current `(template, issue-signature)`."

**REQ-2055 (new):** Layout Fix Memory — Priority Should

- The system maintains a cache of successful layout fixes at `.agents/state/layout-fixes.json`.
- Cache entries: `{template_id, issue_signature, fix_snippet, applied_count, last_used}`.
- `issue_signature` is a normalized fingerprint of the layout problem (e.g., "orphaned entry title at section X" → stable hash).
- On a new compile failure: look up matching `(template_id, issue_signature)`; if present, attempt the cached `fix_snippet` first; on success, increment `applied_count` and update `last_used`; on failure, fall through to LLM-driven fix and record the new fix.
- Cache pruning: entries unused for 180 days are removed on next dashboard launch (or by a maintenance command).
- The cache is gitignored.

**Data update:** `data-requirements.md` add §13 Layout Fix Cache with the schema above.

#### B.3 Manual paste as first-class — DEC-011 + REQ-2001 + REQ-1004 + NFR-0009 update

**DEC-011 (new):** Manual paste is a first-class input, not a fallback

> Reference product framing treats URL-fetch as primary and paste as the failure recovery. In practice, paste is the right choice for any portal that gates access (LinkedIn, internal recruiter forwards, PDFs that the assistant can't fetch), and for any user who wants to feed an already-curated posting without a fetch round-trip. Paste deserves equal billing.

**REQ-2001 reword:** description currently: "URL (fetched automatically) or pasted text." → "Equal-priority input modes: a URL (which the system fetches) or pasted text (which the system uses directly). Neither is a fallback for the other."

**REQ-1004 reword:** stop framing portal-block as the trigger for paste; describe paste as an equally-valid entry point.

**NFR-0009 update:** acceptance for portal-block — remove "user prompted to paste text instead" framing as if it were graceful degradation. Replace with a cross-reference to REQ-2001 / REQ-1004 noting that paste is a first-class input.

**user-flows.md §3 update:** input node label from "Parse job posting (URL or pasted text)" → "Parse job posting (paste or URL — equal-priority)".

#### B.4 Country-agnostic core — DEC-012 + REQ-1003 reword + NFR-0007 strengthen

**DEC-012 (new):** Search core is country-agnostic; portals are plugins

> The reference product hardcoded Denmark-specific portals (Jobindex, Jobnet, Jobbank, Jobdanmark). CareerForge takes the opposite stance: the search core knows nothing about specific countries or portals; every portal is a plugin implementing a generic provider interface (per ADR-0004). No country-specific code, query construction, or locale assumptions live in the core.

**REQ-1003 reword:**
- Current: "Queries target configured job board sites (e.g., site:indeed.com, site:linkedin.com/jobs)"
- New: "Queries are executed against the configured set of portal-adapter plugins. The core search logic is provider-agnostic — no specific portal, country, or locale is referenced in the core. Specific portals (e.g., `site:indeed.com`, `site:linkedin.com/jobs`) are referenced only in user-configured search-queries files and in adapter implementations."

**NFR-0007 strengthen acceptance:** add "No country-specific or portal-specific identifiers exist in `requirements/functional-requirements-job-search.md`, `architecture/api-design.md`, or the core search component implementation. CI lint MAY enforce this by grepping for forbidden patterns."

---

### Section C — Pre-existing impl-guide drift fix

#### C.1 `development/implementation-guide-job-search.md` §5 — rewrite

Replace the entire §5 "Application Tracker Log (`tracker.csv`)" with a 5–8 line section:

> ### 5. Application Tracker Log
>
> The tracker is the canonical CSV record of every application. The schema, status enum, and file lifecycle are normative in:
>
> - **Schema:** `docs/requirements/data-requirements.md §11` — column list, types, mutability, migration
> - **Status enum + transitions:** `docs/requirements/business-rules-and-validation.md §9`
> - **Append/edit contract:** `docs/architecture/data-architecture.md §Consistency Rules` — `/apply` appends; dashboard edits `status`, `notes`, `last_updated` only
>
> This implementation guide intentionally does not duplicate the schema — see the canonical sources above.

Fix the filename references throughout this file: `settings/tracker.csv` → `job_search_tracker.csv` (the canonical name in data-requirements.md and architecture/data-architecture.md).

---

### Section D — Architecture distinctions from reference

The reference codebase uses architectural primitives our `/docs` don't currently name. These edits introduce them as first-class architecture principles, components, and DECs.

#### D.1 Two skill planes — new ARCH-0008 + DEC-013

**DEC-013 (new):** Two-Plane Skill Architecture

> Skills live on two distinct planes. Plane 1 — *Claude Code skills* — are Markdown knowledge files at `.claude/skills/<skill-name>/` that the AI assistant loads into context on trigger keywords. They orchestrate prompts and instructions; they do not run code outside the assistant. Plane 2 — *Sub-agent skills* — are Bun/TypeScript CLI tools at `.agents/skills/<skill-name>/cli/` that the assistant invokes as external commands. Each plane has different permission semantics, different lifecycle, and different testability.

> **Rationale:** The reference product collapses both under "skills" in casual language but treats them as separate filesystem trees with separate concerns. Naming them as distinct planes prevents future readers (or the implementer) from putting CLI tools in `.claude/skills/` or putting knowledge files in `.agents/skills/`.

**ARCH-0008 (new principle):** Two-Plane Skill Architecture — formalize the above as a principle in `architecture/architecture-overview.md`. Update `ARCH-0002 Skill Composition` to reference ARCH-0008.

**`architecture/component-design.md` update:** the existing Skill Layer section should split into "Skill Layer (Plane 1: Claude Code skills)" and "Skill Layer (Plane 2: Sub-agent CLI skills)". The dashboard (Plane 2) and portal adapters (Plane 2) are sibling subsystems on the same plane; profile management and job-application-assistant (Plane 1) are siblings on the other plane.

#### D.2 Commands vs. skills-with-triggers — corrections

The reference exposes only four entry points as `.claude/commands/*.md` files: `apply`, `setup`, `expand`, `reset`. The other two user-facing entries — `/scrape` and `/upskill` — are *skills* (`SKILL.md` files) activated by trigger keywords that include the slash-prefixed name.

- Update **`requirements/00-index.md` ID scheme note** and **`development/00-index.md`** to define the distinction: *Command* = explicit `.claude/commands/<name>.md` file invoked by typing `/<name>`. *Skill* = `.claude/skills/<name>/SKILL.md` orchestrator with `description` and trigger keywords; can be invoked by typing any trigger phrase including a slash-prefixed name.
- Update **`glossary.md`** with both terms.
- Reword every REQ that calls `/scrape` and `/upskill` "commands" to call them "skills" (or "skill invocations"). Affected: `functional-requirements-job-search.md §REQ-1001` (says "via a command" — soften to "via a skill invocation"); `functional-requirements-career-development.md §REQ-3001` similar.
- **No DEC needed** — this is a naming correction, not a product decision.

#### D.3 Named sub-agent definitions in `.claude/agents/` — new ARCH-0009 + REQ-6001 + DEC-015

The reference defines `gemini-research-expert` at `.claude/agents/gemini-research-expert.md` — a top-level agent definition with frontmatter (`name`, `description`, `model`). The body is the agent's system prompt. The agent invokes `gemini -p "prompt"` (a *different* LLM) for research.

**DEC-015 (new):** Multi-Model Architecture for Research

> CareerForge supports invoking different LLMs for different agent roles. The default drafter and reviewer use Claude. The research agent role MAY be configured to use a different model (e.g., Gemini via headless CLI) when cost, throughput, or breadth-of-context favors it. The configuration lives in the agent's definition file at `.claude/agents/<agent-name>.md` frontmatter (`model:` field).

> **Rationale:** Research synthesis (web scan + summary) is bulkier than drafter/reviewer work. The reference offloads it to Gemini for cost reasons. We adopt the same option without mandating it — the default remains Claude.

> **Trade-off:** Users without a configured Gemini CLI must either install it or accept the slightly higher Claude cost for research. NFR-0009 (graceful degradation) handles the missing-Gemini case.

**ARCH-0009 (new principle):** Named Sub-Agent Definitions — agents live at `.claude/agents/<name>.md` with frontmatter (`name`, `description`, `model`) and a system-prompt body. Add to `architecture-overview.md`.

**REQ-6001 (new):** Configurable Research Agent Model — Priority Should

- The research agent (Persona 4) shall be configurable via `.claude/agents/<research-agent-name>.md`.
- Frontmatter `model:` field accepts `sonnet`, `opus`, `haiku`, or `gemini` (extensible).
- `gemini` value triggers headless-CLI invocation pattern: `gemini -p "<prompt>"`.
- If the configured model's CLI is unavailable, the system falls back to Claude with a one-line warning printed to the user (NFR-0009 reference).
- Acceptance: re-running a research call with `model: gemini` invokes the Gemini CLI; with no `model:` line, defaults to the running Claude model.

**Persona 4 (Research Agent) update in `personas-and-actors.md`:** make it specific. Body change: "An optional agent..." → "An optional, configurable agent defined at `.claude/agents/<name>.md`. Default model is Claude; alternatives (e.g., Gemini via headless CLI) are configured per-agent in frontmatter (REQ-6001, DEC-015)."

**Glossary additions:** *Named Sub-Agent*, *Research Agent Model*.

#### D.4 SKILL.md orchestrator pattern — new ARCH-0010 + DEC-014

Every reference skill folder follows a convention: `SKILL.md` is the orchestrator with frontmatter (`name`, `description`, `allowed-tools`) and a body describing invocation triggers, steps, and references to companion files (numbered `01-foo.md`, `02-bar.md`, etc.). The skill loader reads SKILL.md first and uses the description + triggers to decide activation.

**DEC-014 (new):** SKILL.md as Canonical Skill-Orchestrator Format

> Every skill on either plane is anchored by a `SKILL.md` file with mandatory frontmatter (`name`, `description`, `allowed-tools`) and a body that names trigger phrases, lists companion files (if any), and describes the skill's contract. Companion files are numbered (`01-…`, `02-…`) to encode reading order. This is the same convention the reference uses; we adopt it intact so users can move skills between the two products with minimal friction.

**ARCH-0010 (new principle):** SKILL.md Frontmatter Orchestrator — add to `architecture-overview.md` with the frontmatter schema:

```yaml
---
name: <kebab-case-skill-name>
description: <one-line; first sentence is the trigger summary; trigger keywords listed at the end of the line>
allowed-tools: <comma-separated tool list — Read, Edit, Bash, WebFetch, etc.>
---
```

Add an `architecture/cross-cutting-concerns.md` subsection "Skill Frontmatter Schema" formalizing the fields.

#### D.5 `allowed-tools` permission model — new NFR-0018

The reference's `SKILL.md` files declare `allowed-tools:` in frontmatter, AND `.claude/settings.local.json` declares workspace-level permissions. The two layers compose: a skill can only use what BOTH allow.

**NFR-0018 (new):** Skill-Scoped Tool Permissions — Priority Must

> Every skill shall declare its required tools in `SKILL.md` frontmatter `allowed-tools:`. The runtime shall reject any tool invocation not listed. Workspace-level overrides live in `.claude/settings.local.json` (Plane 1) or per-adapter `package.json` permissions (Plane 2).

- **Acceptance:**
  - Each `SKILL.md` in the framework has a non-empty `allowed-tools:` list.
  - A skill attempting to use a tool not in its list is denied at the runtime layer with a clear error.
  - `settings.local.json` is the single workspace-wide permission file; its schema is documented in `architecture/security-architecture.md`.
  - The composition rule is: a tool call succeeds iff both the skill's `allowed-tools` and the workspace `settings.local.json` permit it.

**`architecture/security-architecture.md` update:** add a Permission Layers subsection documenting the two-layer composition.

#### D.6 `settings.local.json` workspace permissions — new REQ-6002

**REQ-6002 (new):** Workspace Permission Configuration — Priority Must

- The framework ships with a `.claude/settings.local.json` template that declares the minimum tool permissions needed by all bundled skills.
- The schema is `{"permissions": {"allow": ["Skill(<name>)", "Bash(<cmd>:*)", ...]}}` — same shape as the reference uses.
- Users fork-and-customize: their own `settings.local.json` can add or restrict permissions per workspace.
- The file is gitignored by default in the user's fork (their permission set is private); the template lives in the framework as `settings.local.json.template`.
- **Acceptance:** running the bundled skills against the template `settings.local.json.template` succeeds without permission prompts in a non-interactive run.

**`integrations-and-dependencies.md §1` strengthen:** the "Settings file controls which tools each skill can access" sentence becomes a paragraph naming the file, the schema reference, and the gitignore behavior.

#### D.7 Repo-scope CLAUDE.md role

The reference's repo-root `CLAUDE.md` is **the user's candidate profile + workflow rules + verification checklist** — it's both a permanent reference and a populated profile artifact. It's read by the assistant on every turn.

Our `CLAUDE.md` at the workspace root is currently a *project memory* file for working on CareerForge as a framework. The reference's CLAUDE.md is for a *user of* CareerForge — populated with their profile.

**No edit to OUR CLAUDE.md** — but add a clarifying note to `data-requirements.md` §1 (or new §1.5) explaining the two roles: framework-development CLAUDE.md (ours) vs. user-fork CLAUDE.md (theirs, populated by `/setup`). This is part of E.5 below.

---

### Section E — Data model path drift from reference

Five concrete path/schema corrections.

#### E.1 `seen_jobs.json` path correction

- **Current in our docs:** `settings/seen_jobs.json` (data-architecture.md, implementation-guide-job-search.md)
- **Correct (reference):** `job_scraper/seen_jobs.json`

Fix in: `architecture/data-architecture.md` (storage table + ER diagram), `development/implementation-guide-job-search.md`, any REQ that names the path.

#### E.2 `salary_lookup.py` location correction

- **Current:** vague — sometimes "tools/" implied
- **Correct (reference):** repo root (`salary_lookup.py`); only `convert_salary_excel.py` and `README_SALARY_TOOL.md` are in `tools/`

Fix in: `architecture/technology-stack.md` (Python Scripts subsection), `requirements/integrations-and-dependencies.md §6`, `development/implementation-guide-application.md` if it references the path.

#### E.3 `search-queries.md` location formalization

- **Current:** not formalized in `data-requirements.md`
- **Correct (reference):** `.claude/skills/job-scraper/search-queries.md` — generated by `/setup` and edited directly by users for partial reconfiguration.

Add to `data-requirements.md` as new **§14 Search Queries Configuration**:

> **File:** `.claude/skills/job-scraper/search-queries.md`
>
> Markdown file with priority-grouped search query templates. Generated by `/setup` (Step 3 §8); editable directly by users. Re-runnable via `/setup --section search`.
>
> **Sections (by priority):**
> | Priority | Use |
> |---|---|
> | 1 | Primary role direction — strongest match |
> | 2 | Domain expertise — vertical-specific queries |
> | 3 | Adjacent role pivots — broader career direction |
> | 4 | Wider-net broad queries |
>
> **Template tokens (auto-replaced by `/setup`):** `[YOUR_PRIMARY_JOB_TITLE]`, `[YOUR_KEY_SKILL]`, `[YOUR_CITY]`, `[YOUR_COUNTRY]`, `[YOUR_REGION]`, `[LOCATION_TIER_IDEAL]`, `[LOCATION_TIER_ACCEPTABLE]`, `[LOCATION_TIER_BORDERLINE]`, `[LOCATION_TIER_TOO_FAR]`.
>
> **Lifecycle:** Created by `/setup`; updated by `/setup --section search`; read by the job-scraper skill (Plane 1) and by the portal adapter skills (Plane 2) for query construction.

#### E.4 `documents/applications/<company>_<role>/` subfolder schema

Add to `data-requirements.md` as new **§15 Past Application Records** with the four-file schema:

> **Folder pattern:** `documents/applications/<company>_<role>/` (one folder per historical application)
>
> | File | Required? | Content |
> |---|---|---|
> | `job_posting.md` | Yes | Role title, company, required skills, experience level, sector, role type — extracted from the original posting |
> | `cover_letter.tex` | If sent | The cover letter that was sent (LaTeX). Used by `/setup` to extract patterns and by `/expand` if read. |
> | `cv_draft.tex` | If sent | The CV variant that was sent (LaTeX). Used by `/setup` for profile-statement extraction. |
> | `outcome.md` | Yes | Status (one of `hired / rejected / no_response / interview_only`), interview stages reached, notes |
>
> **Lifecycle:** Created manually or via `/apply` write-back (future enhancement). Read by `/setup` Path A (REQ-0007); used to calibrate evaluation framework (per Path A Step A5 inference rules).

#### E.5 `CLAUDE.md` candidate-profile template + dual-role clarification

Add to `data-requirements.md` new **§1.5 CLAUDE.md Roles**:

> **CLAUDE.md serves two distinct roles in this framework's ecosystem.**
>
> **Role A — Framework-development CLAUDE.md (in CareerForge's own repo):** Project memory for developers building CareerForge. Points at `/docs` and cross-references. Lives in the repo root at the CareerForge framework repo. This is what `CLAUDE.md` means in our own project memory and instructions.
>
> **Role B — User-fork CLAUDE.md (in a fork of CareerForge):** The user's candidate profile + workflow rules + verification checklist, populated by `/setup` from the framework's template. Read by the assistant on every turn during `/apply`, `/scrape`, etc.
>
> **The template** for Role B is shipped at `CLAUDE.md.template` in the framework repo and contains placeholder tokens that `/setup` replaces with the user's actual data.

Add to `data-requirements.md` new **§1.6 Candidate-Profile Template Schema** the canonical structure (matching the reference's CLAUDE.md):

> **Required sections (in order):** Identity (name, location, languages, employment status, LinkedIn headline) · Education · Professional Experience · Technical Skills (Primary / Secondary / Domain / Software) · Certifications · Publications · Awards · Behavioral Profile (traits, strengths, growth areas, ideal environment) · What Excites You · Target Sectors · Deal-breakers
>
> **Workflow sections (in order):** Role · Repo Structure · Workflow for New Job Applications · Verification Checklist (Factual accuracy / Targeting / Consistency / Quality / Compiled PDF verification)
>
> **Token-replacement placeholders** in the template use `[UPPER_SNAKE_CASE]` form (e.g., `[YOUR_NAME]`, `[DEGREE_LEVEL]`, `[FIELD]`, `[INSTITUTION]`, `[JOB_TITLE]`, `[COMPANY]`, `[YOUR_PRIMARY_SKILLS]`, `[DEALBREAKER_1]`). `/setup` replaces these from user input or document extraction.

---

### Section F — Workflow REQ gaps from reference

Four behavior details to lift into REQs.

#### F.1 `/setup --section <name>` partial-update enumeration

Update **`REQ-0001`** acceptance to enumerate the supported `--section` values, derived from reference behavior:

- `search` — re-runs only the job search configuration interview (Section 9 of Path C). Most commonly used.
- `skills` — re-runs only the Technical Skills section.
- `experience` — re-runs only the Professional Experience section.
- `behavioral` — re-runs only the Behavioral Profile section.
- `goals` — re-runs only the Career Goals & Preferences section.
- `references` — re-runs only the References section.

Add: "Unknown `--section` values surface a list of valid options and exit. No partial profile damage."

#### F.2 STAR candidate stubs — priority upgrade + DEC-016

Currently **REQ-0012** STAR Example Stubs is **Could** priority. Reference behavior shows this is a load-bearing Path A feature (REQ-0007 calls it out explicitly; the reference's `/setup` Path A Step A5 has detailed stub format with required fields).

**Change REQ-0012 priority:** Could → **Should**.

**DEC-016 (new):** STAR Stubs Are Load-Bearing in Path A

> Path A (documents-folder scanning) generates STAR candidate stubs from achievements discovered in CV / LinkedIn / reference letters but does NOT draft full STAR examples (cannot fabricate Situation/Task/Action/Result content without the candidate's first-person memory). Stubs become user homework after onboarding. This pattern lets Path A be both honest (no fabrication) and complete (no missed achievements).

> **Trade-off:** Users get more "to-do" items post-onboarding. Net result is a richer interview-prep file once the user fleshes out the stubs.

#### F.3 "Claude Code" by name writing rule — add to business rules + DEC-017

The reference's CLAUDE.md and `/apply` Step 2 both enforce: *"When mentioning agentic coding or AI tooling in CVs/cover letters, explicitly reference Claude Code by name."*

**DEC-017 (new):** Reference AI Tooling Explicitly by Name

> When generated CVs or cover letters reference the candidate's use of agentic coding or AI tooling, the name of the specific tool used (e.g., **Claude Code**, **Cursor**, **GitHub Copilot**) shall appear by name rather than as a generic "AI assistant" or "agentic tool". This is both a precision rule (clarifies what the candidate actually used) and a hiring-signal rule (interviewers can verify specifics).

> **Trade-off:** Users using a tool not configured in their profile must update their profile before generation — otherwise the system uses the default ("Claude Code").

**`business-rules-and-validation.md §4 Writing Quality Rules` update:** add a new subsection §4.4 "Tool Naming" with the rule above and the default = "Claude Code" (consistent with reference). The default name is configurable in `01-candidate-profile.md` (new field `ai_tooling_used:`).

**Update REQ-2021** acceptance: "Any mention of AI tooling references the specific tool by name (default: Claude Code; configurable per profile)."

#### F.4 Quick sub-commands within a skill — REQ-6003

The reference's `job-application-assistant` SKILL.md exposes "Quick Commands" — individual workflow steps invokable on their own:
- "Evaluate this job posting" → Step 1 only (fit evaluation)
- "Write a CV for [company]" → Step 2 only (CV generation, requires existing evaluation)
- "Write a cover letter for [company]" → Step 3 only
- "Prepare for interview with [company]" → Step 4 only (uses existing CV + cover letter context)

This is finer-grained invocation than `/apply` as a single command.

**REQ-6003 (new):** Quick Sub-Commands within `job-application-assistant` Skill — Priority Should

- The `job-application-assistant` skill (Plane 1) shall accept and route to individual workflow steps based on user phrasing.
- Each sub-command MUST be able to run with or without the upstream steps having completed in the same session — if upstream context is missing, the skill prompts the user for it.
- Sub-commands MUST share the same writing-style rules, no-fabrication rule, and verification checklist as the full `/apply` workflow.
- **Acceptance:**
  - The skill description in `SKILL.md` lists at least the four sub-commands from the reference plus their entry phrases.
  - Each sub-command produces the same artifact format (`cv/main_<company>.tex`, etc.) as the full workflow would.
  - Running a downstream sub-command without upstream context produces a clear "I need <X> first; want me to run that step now?" prompt.

---

### Section G — Competitive positioning vs. reference

#### G.1 `product-overview.md §Differentiation` reframe + DEC-018

Currently the section lists 5 deltas without naming the reference's 4 differentiators that we ALSO ship as table stakes.

**DEC-018 (new):** Parity Baseline Plus Differentiators

> CareerForge ships ALL of the reference product's four headline differentiators (PDF verification loop, relevance-weighted cutting, drafter-reviewer separation, token-efficient reviewer dispatch) as table-stakes — they are not optional and not subtractive. CareerForge's five named differentiators (country-agnostic core, first-class tracking dashboard, cost-aware reviewer, layout-fix memory, manual-paste as first-class) are deltas *on top of* the parity baseline, not the entire delivery.

> **Rationale:** The reference's differentiators are the reason users pick this category of tool over manual workflows. CareerForge cannot win on five deltas alone if it lacks the baseline.

**Edit `product-overview.md §Differentiation`:** prepend a "Parity Baseline (table stakes)" subsection naming the four reference differentiators with one-sentence acceptance for each, then the existing "Our Deltas" subsection with the five we already listed. Cross-reference: `.reference/competitive-analysis/madslorentzen-ai-job-search.md`.

**Edit `product-overview.md §Success Metrics`:** add a new metric:

> 7. **Parity confidence:** A reader of `/docs` can produce a feature-by-feature mapping where every reference differentiator maps to a CareerForge REQ + ACR pair. No reference differentiator is unaccounted for.

---

## 6. Cross-cutting changes

### 6.1 Traceability matrix (`architecture/traceability-matrix.md`)

Add rows in the appropriate sections:

- `REQ-2034 Reviewer Opt-Out` → `ARCH-0030 Application Pipeline / Reviewer Dispatcher` (ADR-0002 + DEC-009)
- `REQ-2055 Layout Fix Memory` → `ARCH-0030 Application Pipeline / Compilation Verifier` (ADR-0003 + DEC-010)
- `REQ-6001 Configurable Research Agent Model` → `ARCH-0009 Named Sub-Agent Definitions` (DEC-015)
- `REQ-6002 Workspace Permission Configuration` → `Security Architecture / Permission Layers` (NFR-0018)
- `REQ-6003 Quick Sub-Commands` → `ARCH-0010 SKILL.md Frontmatter Orchestrator` (DEC-014)
- `NFR-0018 Skill-Scoped Tool Permissions` → `ARCH-0010 SKILL.md` + `Security Architecture` (DEC-014)
- New ARCH principles `ARCH-0008` (Two-Plane Skill Architecture), `ARCH-0009` (Named Sub-Agent Definitions), `ARCH-0010` (SKILL.md Orchestrator) all added to the principles list at the top of the traceability matrix.
- DEC table at the bottom: list DEC-008 through DEC-018 each pointing at the requirements they enable.

### 6.2 Plan / work-breakdown follow-ups

Not edited in this round, but flagged for the next plan-update pass:

- Epic 6 (Reviewer Agent) gains a task: "Implement `--review={full,quick,none}` mode + token estimator print" (DEC-009 / REQ-2034)
- Epic 5 or a new epic gains: "Implement layout-fix cache load/store" (DEC-010 / REQ-2055)
- Epic 8 (Job Search) gains a task: "Refactor any country-specific examples out of core; add CI lint" (DEC-012)
- New **Epic 13: Sub-Agent & Skill Frontmatter Plumbing** gains tasks:
  - "Implement `SKILL.md` frontmatter loader with `allowed-tools` enforcement" (NFR-0018 / DEC-014)
  - "Implement `.claude/agents/<name>.md` loader with model: routing (default Claude; gemini headless fallback)" (REQ-6001 / DEC-015)
  - "Ship `settings.local.json.template` + document fork-and-customize" (REQ-6002)
  - "Implement quick sub-commands routing in `job-application-assistant`" (REQ-6003)
- Epic 4 (Onboarding) gains a task: "Implement `--section` enumeration with unknown-value error" (F.1)
- Epic 7 or Epic 4 gains: "Implement STAR stubs Path A generator (REQ-0012, now Should)" (F.2 / DEC-016)
- Epic 5 (Basic Apply) gains: "Implement tool-naming rule for AI tooling references" (F.3 / DEC-017)

---

## 7. Acceptance criteria for this update

The update is complete when:

**Section A (consistency)**
1. Running `grep -ri "No GUI is required" docs/` returns nothing.
2. OQ-003 status reads `Partially Resolved`.
3. `REQ-1009` mentions `last_updated`.
4. `personas-and-actors.md` has a key task and matrix row for `/dashboard`.
5. `glossary.md` defines all five A.6 terms.
6. `integrations-and-dependencies.md §7` mentions the dashboard.
7. `assumptions-decisions-questions.md` has `DEC-008` (dashboard retrospective).

**Section B (differentiators)**
8. `DEC-009`, `DEC-010`, `DEC-011`, `DEC-012` exist.
9. `REQ-2034` and `REQ-2055` exist with full acceptance criteria.
10. `REQ-2001`, `REQ-1004`, `REQ-1003`, `REQ-2030`, `REQ-2053`, `NFR-0007`, `NFR-0009` are reworded per Sections B.1–B.4.
11. `data-requirements.md` has §13 Layout Fix Cache.

**Section C (impl-guide drift)**
12. `implementation-guide-job-search.md §5` no longer duplicates the schema and uses `job_search_tracker.csv` consistently.
13. No remaining mention of `settings/tracker.csv` anywhere under `docs/`.

**Section D (architecture distinctions)**
14. `architecture-overview.md` lists `ARCH-0008` (Two-Plane Skill), `ARCH-0009` (Named Sub-Agent), `ARCH-0010` (SKILL.md Orchestrator) as principles.
15. `DEC-013`, `DEC-014`, `DEC-015` exist.
16. `REQ-6001` (Configurable Research Agent Model) exists with full acceptance.
17. `REQ-6002` (Workspace Permission Configuration) exists with full acceptance.
18. `NFR-0018` (Skill-Scoped Tool Permissions) exists with full acceptance.
19. `personas-and-actors.md` Persona 4 references `.claude/agents/` directory and `model:` frontmatter (REQ-6001).
20. `glossary.md` defines: *Two-Plane Skill Architecture*, *Named Sub-Agent*, *SKILL.md Orchestrator*, *Allowed-Tools*, *Workspace Settings*.
21. `architecture/cross-cutting-concerns.md` documents the SKILL.md frontmatter schema.
22. `architecture/security-architecture.md` documents the two-layer permission composition (skill `allowed-tools` ∩ workspace `settings.local.json`).
23. Every REQ that calls `/scrape` or `/upskill` a "command" is reworded to call it a "skill" or "skill invocation".
24. Running `grep -r "settings/seen_jobs" docs/` returns nothing.

**Section E (data path drift)**
25. `data-architecture.md` references `job_scraper/seen_jobs.json` (not `settings/seen_jobs.json`).
26. `technology-stack.md` and `integrations-and-dependencies.md` reference `salary_lookup.py` at repo root (not `tools/`).
27. `data-requirements.md` has §14 Search Queries Configuration.
28. `data-requirements.md` has §15 Past Application Records with the four-file schema.
29. `data-requirements.md` has §1.5 CLAUDE.md Roles (dual-role explanation) and §1.6 Candidate-Profile Template Schema.

**Section F (workflow REQ gaps)**
30. `REQ-0001` acceptance enumerates the six `--section` values.
31. `REQ-0012` priority is **Should** (was Could).
32. `DEC-016` (STAR stubs load-bearing) exists.
33. `DEC-017` (AI tooling by name) exists.
34. `business-rules-and-validation.md §4.4 Tool Naming` exists with the "Claude Code" default rule.
35. `REQ-2021` acceptance includes the tool-naming rule.
36. `REQ-6003` (Quick Sub-Commands) exists with full acceptance.

**Section G (positioning)**
37. `DEC-018` (Parity Baseline Plus Differentiators) exists.
38. `product-overview.md §Differentiation` has a "Parity Baseline (table stakes)" subsection naming the reference's four differentiators *before* listing our 5 deltas.
39. `product-overview.md §Success Metrics` has a 7th metric for parity confidence.

**Cross-cutting**
40. `traceability-matrix.md` has rows for all new REQs/NFRs/ARCH principles (per §6.1 of this spec).
41. The DEC table at the bottom of `traceability-matrix.md` lists `DEC-008` through `DEC-018`.

---

## 8. Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| New REQs (2034, 2055, 6001–6003) ripple into more docs than I expect (e.g., a hidden component design that already names "Compilation Verifier") | Acceptance criteria #40 forces a traceability check; the writing-plans phase will catch additional ripples and add tasks |
| `DEC-011` (manual paste as first-class) softens the framing of an existing principle | Keep the principle wording but reframe paste's status. The decision is positioning, not behavior — no /apply code changes implied |
| `DEC-012` may collide with existing examples in other docs I haven't audited | Acceptance criteria search forbidden patterns post-edit; flag any leftover in the writing-plans phase |
| `DEC-015` (multi-model Gemini) introduces a new optional dependency users may not expect | Graceful degradation via NFR-0009; default model stays Claude; Gemini is opt-in per agent file |
| `NFR-0018` (allowed-tools) implies a runtime enforcement that doesn't yet exist | The runtime is the AI assistant platform itself; the NFR documents an EXISTING capability that the reference relies on. Implementation is a config exercise, not a build. |
| `DEC-018` (parity baseline) commits CareerForge to delivering the reference's 4 differentiators in v1 | The existing REQs already cover all 4 (PDF verification: REQ-2050–2053; relevance-weighted cutting: business-rules §2.2; drafter-reviewer: REQ-2030–2042; token-efficient dispatch: REQ-2024, REQ-2031). DEC-018 just makes the dependency explicit. |
| ARCH-0060 referenced but never formally defined in component-design.md | Out of scope here; raised as an explicit follow-up |
| Reference repo file structure may change over time, drifting our docs out of sync | Treat the parity audit as point-in-time (2026-06-07 snapshot); future drift is the implementer's call to chase or ignore based on whether the reference still represents the target architecture |

---

## 9. Hand-off to writing-plans

After user review, the implementation plan should:

1. Order edits so cross-references resolve as files are written. Suggested order:
   1. All new `DEC-###` entries (DEC-008 through DEC-018) — they're referenced by REQs/NFRs/ARCH that follow
   2. New `ARCH-0008`, `ARCH-0009`, `ARCH-0010` principles in `architecture-overview.md`
   3. New `NFR-0018` in `non-functional-requirements.md`
   4. New REQs: `REQ-2034`, `REQ-2055`, `REQ-6001`, `REQ-6002`, `REQ-6003`
   5. Reworded existing REQs/NFRs/ASMs/OQs
   6. New `data-requirements.md` sections §1.5, §1.6, §13, §14, §15
   7. `business-rules-and-validation.md §4.4` (tool naming)
   8. Personas + glossary updates
   9. Architecture cross-cutting + security architecture
   10. Implementation guide drift fix
   11. Product-overview positioning + traceability matrix
2. Each section (A through G + cross-cutting) maps to one commit. Seven commits total + a final traceability commit.
3. After all edits, run the acceptance grep checks from §7 (items 1, 13, 24, 30, etc.).
4. The plan should NOT include any code changes — this is documentation only.
5. Where two sections touch the same file (e.g., A.7 and D.6 both edit `integrations-and-dependencies.md`), the plan should sequence so the section with the bigger change goes first and the smaller change rebases on it.

## 10. Open clarifications before writing-plans

These were not asked during brainstorming but the implementer may want to confirm before executing:

1. **DEC-015 default model.** The default research-agent model is currently *unconfigured* (falls through to whatever Claude is running). Should the default be explicit `model: sonnet` (cheaper) or `model: opus` (better synthesis)?
2. **NFR-0018 enforcement layer.** The reference's `allowed-tools` is enforced by Claude Code itself. Should our docs declare this is enforced by the runtime (any AI-assistant-platform that loads our `SKILL.md` files), or do we also need a build-time linter to catch misconfigurations?
3. **REQ-6003 quick sub-commands inheritance.** When a quick sub-command runs in isolation (no prior context in the session), should it print the full evaluation table before drafting (matching `/apply` Step 1), or skip straight to its scoped step and just ask for missing inputs?
4. **§E.5 CLAUDE.md template ship location.** The reference doesn't have a `.template` file — its `CLAUDE.md` IS the template with placeholders. Should we follow that convention or ship a separate `CLAUDE.md.template`?
5. **F.3 tool naming default.** "Claude Code" is the reference's default. CareerForge could keep that default (we're built on Claude Code too) or make it configurable from day one. Recommendation: keep "Claude Code" as the default; the configurable field handles the override case.
