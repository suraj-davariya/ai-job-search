# CareerForge Requirements Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the design at `docs/superpowers/specs/2026-06-06-careerforge-requirements-update-design.md` to the CareerForge `/docs` tree — covering internal consistency (Section A), realizing the four unwritten differentiators (Section B), fixing pre-existing impl-guide drift (Section C), introducing architecture distinctions from the reference codebase audit (Section D), correcting data-model path drift (Section E), closing workflow REQ gaps (Section F), and reframing competitive positioning (Section G).

**Architecture:** Documentation-only changes against the existing `/docs` markdown tree. No code. Each section gets one commit; ordering follows the spec's §9 dependency sequence (DECs → ARCH principles → NFRs → new REQs → reworded REQs → data sections → business rules → personas → glossary → cross-cutting → impl-guide → product-overview → traceability → indexes).

**Tech Stack:** Markdown only. `git` for commits. `grep` / `wc` / `Read` for verification.

---

## Pre-flight

**Working directory:** `/Users/suuraj/Workspace/ai-job-search`

**Spec reference:** `docs/superpowers/specs/2026-06-06-careerforge-requirements-update-design.md` — the canonical content source for every task below. When a task says "apply the body from spec §X.Y", read the spec section and use its exact prose.

**Verification anchor:** The 41 acceptance criteria in spec §7 are the gating checks for the final task.

---

## Task 0: Initialize git repository

**Files:**
- Create: `.git/` (via `git init`)
- Modify: none

- [ ] **Step 1: Verify no git repo exists**

Run: `git rev-parse --git-dir 2>&1`
Expected: `fatal: not a git repository (or any of the parent directories): .git`

- [ ] **Step 2: Initialize repository**

Run: `git init && git branch -M main`
Expected: `Initialized empty Git repository in /Users/suuraj/Workspace/ai-job-search/.git/`

- [ ] **Step 3: Stage and commit the existing state as a baseline**

Run:
```bash
git add CLAUDE.md .gitignore docs/
git commit -m "chore: initial baseline before requirements update"
```
Expected: Commit succeeds with the existing docs tree (no `.reference/` since `.gitignore` excludes it).

- [ ] **Step 4: Verify clean state**

Run: `git status`
Expected: `nothing to commit, working tree clean`

---

## Task 1: Add DEC entries + update ASM-002 + update OQ-003

**Files:**
- Modify: `docs/requirements/assumptions-decisions-questions.md`

**Spec sections covered:** A.1, A.2, A.8, B.1 (DEC-009 only), B.2 (DEC-010 only), B.3 (DEC-011 only), B.4 (DEC-012 only), D.1 (DEC-013), D.3 (DEC-015), D.4 (DEC-014), F.2 (DEC-016), F.3 (DEC-017), G.1 (DEC-018).

- [ ] **Step 1: Read the current state of ASM-002 and OQ-003**

Run: `grep -A 4 "^### ASM-002\|^### OQ-003" docs/requirements/assumptions-decisions-questions.md`
Expected: Shows current ASM-002 ("No GUI is required for v1.") and OQ-003 (Status: Deferred).

- [ ] **Step 2: Rewrite ASM-002**

Use `Edit` on `docs/requirements/assumptions-decisions-questions.md`:

`old_string`:
```
### ASM-002: CLI Proficiency
**Assumption:** The target user is comfortable with command-line interfaces, text editors, and version control. No GUI is required for v1.
**Impact:** All interactions happen via CLI commands. A web or desktop GUI would be a separate product.
```

`new_string`:
```
### ASM-002: CLI Proficiency
**Assumption:** The target user is comfortable with command-line interfaces, text editors, and version control. No general-purpose GUI is required for v1. A scoped tracking dashboard (REQ-5000–REQ-5008) is the single, deliberate GUI exception — it runs only on `127.0.0.1`, covers tracker review only, and is opt-in. Broader GUIs (cloud-hosted web app, mobile, multi-user) remain out of scope per OQ-003.
**Impact:** All primary interactions happen via CLI commands. The dashboard's network surface is constrained by NFR-0017. A web or desktop GUI beyond the local tracking dashboard would be a separate product.
```

- [ ] **Step 3: Rewrite OQ-003**

Use `Edit`:

`old_string`:
```
### OQ-003: GUI Layer
**Status:** Deferred
**Question:** Should a web-based or desktop GUI be provided as an alternative to the CLI?
**Context:** The target user is CLI-comfortable, but a GUI could broaden the audience. However, it would be a significant development effort and a different product.
**Recommendation:** Keep CLI-first for v1. A GUI could be built as a separate frontend that consumes the same profile files.
```

`new_string`:
```
### OQ-003: GUI Layer
**Status:** Partially Resolved
**Question:** Should a web-based or desktop GUI be provided as an alternative to the CLI?
**Context:** The target user is CLI-comfortable, but a focused GUI for application tracking is a deliberate differentiator vs. the reference product (see DEC-008). Broader GUI scope (general-purpose web app, mobile, multi-user, cloud-hosted) would be a significant development effort and a different product.
**Resolution:**
- **Tracking dashboard — accepted.** Ships in v1 as a localhost-only web UI over the tracker CSV. See REQ-5000–REQ-5008, ADR-0005, and DEC-008.
- **General-purpose / multi-user / cloud-hosted GUI — still deferred.** Any further GUI surface beyond the tracking dashboard is a separate decision.
```

- [ ] **Step 4: Append all new DEC entries**

Use `Edit` to append after the last existing DEC (find the end of `### DEC-008` section if it exists; if not, find end of `### DEC-008` placeholder location). Since DEC-008 is new, append after the existing last DEC (`### DEC-008` doesn't exist yet — the current last is `DEC-008` in some setups; verify with `grep "^### DEC-" docs/requirements/assumptions-decisions-questions.md` first).

Run: `grep "^### DEC-" docs/requirements/assumptions-decisions-questions.md`
Expected: Shows DEC-001 through DEC-008 (existing).

Wait — DEC-008 in the original file is "BYO Salary Data". Confirm by:

Run: `grep -A 2 "^### DEC-008" docs/requirements/assumptions-decisions-questions.md`
Expected: `### DEC-008: BYO Salary Data`

The new DECs from this spec start at DEC-009 to avoid colliding. Renumber the dashboard retrospective from DEC-008 (as named in the spec) to a new free slot — actually the spec named it DEC-008 because the spec author thought DEC-008 was free. Since the slot is taken, the dashboard retrospective DEC needs a new number: **DEC-013** for "Local Tracking Dashboard (retrospective)" — but the spec already uses DEC-013 for "Two-Plane Skill Architecture".

Resolution (deviation from spec, documented in Task 17 plan-deviation note): the dashboard retrospective DEC is **DEC-019** (new highest), and the spec's DEC-009 through DEC-018 keep their numbers. The spec's reference to "DEC-008 (retrospective)" should be implemented as DEC-019. The spec's body content for the retrospective is correct; only the number changes.

Use `Edit` to append after the last existing DEC entry (DEC-008 BYO Salary Data, end of "Trade-off: ..." paragraph):

`old_string` (the existing closing of DEC-008):
```
### DEC-008: BYO Salary Data
**Decision:** The salary benchmarking system works with user-provided data rather than a built-in salary database.
**Rationale:** Salary data varies by country, profession, union membership, and data source. Providing a built-in database would be either too narrow (one country) or too expensive to maintain. Users bring their best available data.
**Trade-off:** Additional setup step for users who want salary benchmarking. Optional by design.
```

`new_string`:
```
### DEC-008: BYO Salary Data
**Decision:** The salary benchmarking system works with user-provided data rather than a built-in salary database.
**Rationale:** Salary data varies by country, profession, union membership, and data source. Providing a built-in database would be either too narrow (one country) or too expensive to maintain. Users bring their best available data.
**Trade-off:** Additional setup step for users who want salary benchmarking. Optional by design.

### DEC-009: Reviewer is opt-out at the application level
**Decision:** The drafter-reviewer split (DEC-002) doubles per-application token cost, which is not always justified — quick drafts for low-stakes applications, follow-up applications to the same employer, or applications under time pressure all benefit from skipping the reviewer or running a lighter mode. The reviewer remains the default, but a per-application flag (`--review=full|quick|none`) allows skipping it.
**Rationale:** Cost-aware operation is a CareerForge differentiator vs. the reference product (per product-overview §Differentiation). Mandatory reviewer doubles tokens; the user should be able to choose.
**Trade-off:** Three modes increase configuration surface and require token estimates per mode. Mitigated by `full` remaining the default.

### DEC-010: Persist learned layout fixes per template
**Decision:** The compile-and-inspect loop (REQ-2053) iterates with LLM-driven fixes for orphans, overflow, and font mismatches. The same fix patterns recur across applications using the same template, so the LLM spends tokens re-deriving them. Persisting `(template-id, issue-signature, fix-snippet)` triples turns later applications into a cache hit on the first attempt.
**Rationale:** Layout-fix memory is a CareerForge differentiator vs. the reference product.
**Trade-off:** Requires a cache file (`.agents/state/layout-fixes.json`) and prune logic; cache may grow over time without prune discipline.

### DEC-011: Manual paste is a first-class input, not a fallback
**Decision:** Reference product framing treats URL-fetch as primary and paste as the failure recovery. In practice, paste is the right choice for any portal that gates access (LinkedIn, internal recruiter forwards, PDFs that the assistant can't fetch), and for any user who wants to feed an already-curated posting without a fetch round-trip. Paste deserves equal billing in REQ language.
**Rationale:** Making paste first-class matches user reality and avoids framing portal blocking as a CareerForge limitation.
**Trade-off:** None — the implementation already supports paste; this is a positioning change in REQ wording.

### DEC-012: Search core is country-agnostic; portals are plugins
**Decision:** The reference product hardcoded Denmark-specific portals (Jobindex, Jobnet, Jobbank, Jobdanmark). CareerForge takes the opposite stance: the search core knows nothing about specific countries or portals; every portal is a plugin implementing a generic provider interface (per ADR-0004). No country-specific code, query construction, or locale assumptions live in the core.
**Rationale:** Country-agnostic core is CareerForge's headline differentiator vs. the reference product.
**Trade-off:** Users get no first-party portal adapters out of the box — they must rely on web-search-via-skill or build their own adapters following the ADR-0004 pattern.

### DEC-013: Two-Plane Skill Architecture
**Decision:** Skills live on two distinct planes. Plane 1 — *Claude Code skills* — are Markdown knowledge files at `.claude/skills/<skill-name>/` that the AI assistant loads into context on trigger keywords. They orchestrate prompts and instructions; they do not run code outside the assistant. Plane 2 — *Sub-agent skills* — are Bun/TypeScript CLI tools at `.agents/skills/<skill-name>/cli/` that the assistant invokes as external commands. Each plane has different permission semantics, different lifecycle, and different testability.
**Rationale:** The reference product collapses both under "skills" in casual language but treats them as separate filesystem trees with separate concerns. Naming them as distinct planes prevents future readers (or the implementer) from putting CLI tools in `.claude/skills/` or putting knowledge files in `.agents/skills/`.
**Trade-off:** Slightly more vocabulary; pays off in implementation clarity.

### DEC-014: SKILL.md as Canonical Skill-Orchestrator Format
**Decision:** Every skill on either plane is anchored by a `SKILL.md` file with mandatory frontmatter (`name`, `description`, `allowed-tools`) and a body that names trigger phrases, lists companion files (if any), and describes the skill's contract. Companion files are numbered (`01-…`, `02-…`) to encode reading order. This is the same convention the reference uses; we adopt it intact so users can move skills between the two products with minimal friction.
**Rationale:** Adopting the reference convention reduces friction for users migrating skills and keeps a stable contract for skill-loading runtimes.
**Trade-off:** Existing skills written without this convention require migration.

### DEC-015: Multi-Model Architecture for Research
**Decision:** CareerForge supports invoking different LLMs for different agent roles. The default drafter and reviewer use Claude. The research agent role MAY be configured to use a different model (e.g., Gemini via headless CLI) when cost, throughput, or breadth-of-context favors it. The configuration lives in the agent's definition file at `.claude/agents/<agent-name>.md` frontmatter (`model:` field).
**Rationale:** Research synthesis is bulkier than drafter/reviewer work. The reference offloads it to Gemini for cost reasons. We adopt the same option without mandating it.
**Trade-off:** Users without a configured alternative LLM CLI fall back to Claude. NFR-0009 handles the missing-CLI case.

### DEC-016: STAR Stubs Are Load-Bearing in Path A
**Decision:** Path A (documents-folder scanning) generates STAR candidate stubs from achievements discovered in CV / LinkedIn / reference letters but does NOT draft full STAR examples (cannot fabricate Situation/Task/Action/Result content without the candidate's first-person memory). Stubs become user homework after onboarding. This pattern lets Path A be both honest (no fabrication) and complete (no missed achievements).
**Rationale:** Bridges the no-fabrication rule with the need for comprehensive interview prep.
**Trade-off:** Users get more "to-do" items post-onboarding. Net result is a richer interview-prep file once the user fleshes out the stubs.

### DEC-017: Reference AI Tooling Explicitly by Name
**Decision:** When generated CVs or cover letters reference the candidate's use of agentic coding or AI tooling, the name of the specific tool used (e.g., **Claude Code**, **Cursor**, **GitHub Copilot**) shall appear by name rather than as a generic "AI assistant" or "agentic tool". This is both a precision rule (clarifies what the candidate actually used) and a hiring-signal rule (interviewers can verify specifics).
**Rationale:** Generic AI mentions are increasingly unhelpful as hiring signal; named tools demonstrate concrete competence.
**Trade-off:** Users using a tool not configured in their profile must update their profile before generation — otherwise the system uses the default ("Claude Code").

### DEC-018: Parity Baseline Plus Differentiators
**Decision:** CareerForge ships ALL of the reference product's four headline differentiators (PDF verification loop, relevance-weighted cutting, drafter-reviewer separation, token-efficient reviewer dispatch) as table-stakes — they are not optional and not subtractive. CareerForge's five named differentiators (country-agnostic core, first-class tracking dashboard, cost-aware reviewer, layout-fix memory, manual-paste as first-class) are deltas *on top of* the parity baseline, not the entire delivery.
**Rationale:** The reference's differentiators are the reason users pick this category of tool over manual workflows. CareerForge cannot win on five deltas alone if it lacks the baseline.
**Trade-off:** Implementation must deliver 4 reference baseline features + 5 deltas = 9 total focus areas. None can be deprioritized.

### DEC-019: Local Tracking Dashboard (retrospective)
**Decision:** CareerForge ships a localhost-only web dashboard over the application tracker CSV in v1 as a deliberate differentiator vs. the reference product. The dashboard is single-user, no-auth, runs only on `127.0.0.1`, and reads/writes the same CSV that `/apply` appends to. Wider GUI scope (cloud, multi-user, mobile, branded site) remains out per OQ-003.
**Rationale:** The reference product tracks applications in CSV alone, leaving users to manage status in spreadsheets. A scoped GUI restricted to localhost and tracker concerns gets visual triage without acquiring a server, auth, or telemetry surface. Decided in the brainstorming round that introduced REQ-5xxx; recorded here for traceability.
**Trade-off:** Introduces Bun + Hono + HTMX + Pico.css as runtime deps for users who use the dashboard. Mitigated by Bun being already required for portal adapters (DEC-012 / ADR-0004) and by graceful degradation (NFR-0009): the dashboard is removable without affecting `/apply`.
```

- [ ] **Step 5: Verify all new DECs are present**

Run: `grep "^### DEC-" docs/requirements/assumptions-decisions-questions.md | wc -l`
Expected: `19` (DEC-001 through DEC-019).

Run: `grep "^### DEC-019" docs/requirements/assumptions-decisions-questions.md`
Expected: `### DEC-019: Local Tracking Dashboard (retrospective)`

- [ ] **Step 6: Verify ASM-002 and OQ-003 updates landed**

Run: `grep -A 1 "^### ASM-002" docs/requirements/assumptions-decisions-questions.md | tail -1`
Expected: line contains "No general-purpose GUI" and "REQ-5000–REQ-5008".

Run: `grep -A 1 "^### OQ-003" docs/requirements/assumptions-decisions-questions.md | head -3`
Expected: line contains "Status:** Partially Resolved".

- [ ] **Step 7: Commit**

Run:
```bash
git add docs/requirements/assumptions-decisions-questions.md
git commit -m "docs: add DEC-009..019, update ASM-002 + OQ-003 for dashboard and parity decisions"
```

---

## Task 2: Add ARCH-0008, 0009, 0010 principles

**Files:**
- Modify: `docs/architecture/architecture-overview.md`

**Spec sections covered:** D.1 (ARCH-0008), D.3 (ARCH-0009), D.4 (ARCH-0010).

- [ ] **Step 1: Locate the principles section**

Run: `grep -n "^### ARCH-0007" docs/architecture/architecture-overview.md`
Expected: shows the line number of the last existing principle.

- [ ] **Step 2: Append new principles after ARCH-0007**

Find the body of ARCH-0007 (No Fabrication) and append after its closing line. Use `Edit`:

`old_string`:
```
### ARCH-0007: No Fabrication
A hard architectural constraint: the system never generates claims not grounded in the user's profile data. This is enforced at every generation and verification step.

---

## Data Flow — Application Pipeline
```

`new_string`:
```
### ARCH-0007: No Fabrication
A hard architectural constraint: the system never generates claims not grounded in the user's profile data. This is enforced at every generation and verification step.

### ARCH-0008: Two-Plane Skill Architecture
Skills are split into two filesystem trees with different roles:
- **Plane 1 — Claude Code skills:** Markdown knowledge files at `.claude/skills/<name>/` loaded into the AI assistant's context on trigger keywords. They orchestrate prompts and instructions; they do not run code outside the assistant.
- **Plane 2 — Sub-agent skills:** Bun/TypeScript CLI tools at `.agents/skills/<name>/cli/` invoked as external commands. They have their own runtimes, dependencies, and lifecycles.

A skill is either Plane 1 or Plane 2, never both. The dashboard (REQ-5xxx) and portal adapters (ADR-0004) are Plane 2; profile management, job-application-assistant, job-scraper, and upskill are Plane 1. See DEC-013 for rationale.

### ARCH-0009: Named Sub-Agent Definitions
Top-level agents live as Markdown files at `.claude/agents/<agent-name>.md` with frontmatter declaring `name`, `description`, and optional `model`. The body is the agent's system prompt. The runtime loads these definitions when spawning the named agent. The `model:` field enables multi-model routing — e.g., a research agent can declare `model: gemini` to invoke a headless Gemini CLI rather than Claude. See DEC-015 for the multi-model rationale and REQ-6001 for the configurable-model contract.

### ARCH-0010: SKILL.md Frontmatter Orchestrator
Every skill on either plane is anchored by a `SKILL.md` file at the skill's root. The frontmatter is canonical:

```yaml
---
name: <kebab-case-skill-name>
description: <one-line summary; trigger keywords listed at the end of the line>
allowed-tools: <comma-separated tool list — Read, Edit, Bash, WebFetch, etc.>
---
```

The body names trigger phrases (for skills activated by keywords, including slash-prefixed names like `/scrape`), lists companion files (numbered `01-…`, `02-…` to encode reading order), and describes the skill's contract. Sub-agent skills on Plane 2 ALSO have a `cli/` subdirectory with `package.json` and TypeScript source. See DEC-014.

---

## Data Flow — Application Pipeline
```

- [ ] **Step 3: Verify the three new principles are present**

Run: `grep "^### ARCH-00" docs/architecture/architecture-overview.md`
Expected: ARCH-0001 through ARCH-0010 (10 entries).

- [ ] **Step 4: Commit**

Run:
```bash
git add docs/architecture/architecture-overview.md
git commit -m "docs: add ARCH-0008..0010 (two-plane skills, named sub-agents, SKILL.md orchestrator)"
```

---

## Task 3: Add NFR-0018 + reword NFR-0007 and NFR-0009

**Files:**
- Modify: `docs/requirements/non-functional-requirements.md`

**Spec sections covered:** D.5 (NFR-0018), B.3 (NFR-0009 reword), B.4 (NFR-0007 strengthen).

- [ ] **Step 1: Read current state of NFR-0007 and NFR-0009**

Run: `grep -A 6 "^## NFR-0007\|^## NFR-0009" docs/requirements/non-functional-requirements.md`
Expected: Shows current text of both.

- [ ] **Step 2: Strengthen NFR-0007 acceptance**

Use `Edit`:

`old_string`:
```
## NFR-0007: Extensibility — Job Portal Adapters
**Priority:** Should
**Description:** New job portal integrations shall be addable without modifying core framework code.
**Acceptance Criteria:**
- Each adapter is a self-contained CLI tool in its own directory
- Adapters follow a standard interface pattern (search query in, structured results out)
- Adding a new portal requires only: creating the adapter directory, installing dependencies, and adding search queries
- Core search logic is portal-agnostic
```

`new_string`:
```
## NFR-0007: Extensibility — Job Portal Adapters
**Priority:** Should
**Description:** New job portal integrations shall be addable without modifying core framework code. The search core is country-agnostic by construction (see DEC-012); no specific portal, country, or locale is referenced in the core layer.
**Acceptance Criteria:**
- Each adapter is a self-contained CLI tool in its own directory under `.agents/skills/` (Plane 2 per ARCH-0008)
- Adapters follow a standard interface pattern (search query in, structured results out)
- Adding a new portal requires only: creating the adapter directory, installing dependencies, and adding search queries
- Core search logic is portal-agnostic
- No country-specific or portal-specific identifiers exist in `requirements/functional-requirements-job-search.md`, `architecture/api-design.md`, or the core search component implementation
- CI lint MAY enforce the prior bullet by grepping for forbidden patterns (e.g., `site:indeed.com`, `site:jobindex.dk`) in core files
```

- [ ] **Step 3: Reword NFR-0009 acceptance**

Use `Edit`:

`old_string`:
```
## NFR-0009: Error Handling — Graceful Degradation
**Priority:** Should
**Description:** When optional features are unavailable, the system shall skip them gracefully rather than failing.
**Acceptance Criteria:**
- Missing salary data: salary step silently skipped
- Job portal URL cannot be fetched: user prompted to paste text instead
- GitHub profile not in profile: source skipped during /expand with note
- Previous upskill report missing: delta section omitted
- Empty document subfolders: reported as "(empty)", not treated as errors
```

`new_string`:
```
## NFR-0009: Error Handling — Graceful Degradation
**Priority:** Should
**Description:** When optional features are unavailable, the system shall skip them gracefully rather than failing.
**Acceptance Criteria:**
- Missing salary data: salary step silently skipped
- Job portal URL cannot be fetched: workflow uses the paste path (REQ-2001, REQ-1004) — paste is a first-class input per DEC-011, not a fallback
- Configured research-agent model CLI unavailable (e.g., `gemini` not installed): falls back to Claude with a one-line warning (REQ-6001)
- GitHub profile not in profile: source skipped during /expand with note
- Previous upskill report missing: delta section omitted
- Empty document subfolders: reported as "(empty)", not treated as errors
- Dashboard skill removed: `/apply` pipeline continues to function (ARCH-0005)
```

- [ ] **Step 4: Append NFR-0018 after NFR-0017**

Use `Edit`:

`old_string`:
```
- A full session inspected with `lsof`/Wireshark shows zero non-loopback sockets opened by the dashboard process
- No environment variable, config flag, or build switch can enable a network surface beyond loopback in v1
```

`new_string`:
```
- A full session inspected with `lsof`/Wireshark shows zero non-loopback sockets opened by the dashboard process
- No environment variable, config flag, or build switch can enable a network surface beyond loopback in v1

## NFR-0018: Skill-Scoped Tool Permissions
**Priority:** Must
**Description:** Every skill shall declare its required tools in `SKILL.md` frontmatter `allowed-tools:` (ARCH-0010). The runtime shall reject any tool invocation not listed. Workspace-level overrides live in `.claude/settings.local.json` (Plane 1) or per-adapter `package.json` permissions (Plane 2). A tool call succeeds iff both the skill's `allowed-tools` and the workspace permissions permit it.
**Acceptance Criteria:**
- Each `SKILL.md` in the framework has a non-empty `allowed-tools:` frontmatter field
- A skill attempting to use a tool not in its list is denied at the runtime layer with a clear error
- `.claude/settings.local.json` is the single workspace-wide permission file for Plane 1; its schema is documented in `architecture/security-architecture.md`
- The composition rule is enforced: a tool call succeeds iff both the skill's `allowed-tools` and the workspace `settings.local.json` permit it
- Plane 2 sub-agent skills declare permissions in their own `cli/package.json` (per ADR-0004); workspace permissions still gate the invocation
```

- [ ] **Step 5: Verify NFR-0018 is present and NFR-0007/0009 updated**

Run: `grep "^## NFR-00" docs/requirements/non-functional-requirements.md | wc -l`
Expected: `18`

Run: `grep -A 1 "^## NFR-0007" docs/requirements/non-functional-requirements.md | tail -1`
Expected: contains "country-agnostic by construction".

Run: `grep "^## NFR-0018" docs/requirements/non-functional-requirements.md`
Expected: `## NFR-0018: Skill-Scoped Tool Permissions`

- [ ] **Step 6: Commit**

Run:
```bash
git add docs/requirements/non-functional-requirements.md
git commit -m "docs: add NFR-0018, strengthen NFR-0007 (country-agnostic), reword NFR-0009 (paste first-class)"
```

---

## Task 4: New file `functional-requirements-framework-meta.md` (REQ-6001/6002/6003) + index update

**Files:**
- Create: `docs/requirements/functional-requirements-framework-meta.md`
- Modify: `docs/requirements/00-index.md`

**Spec sections covered:** D.3 (REQ-6001), D.6 (REQ-6002), F.4 (REQ-6003).

- [ ] **Step 1: Create the new requirements file**

Use `Write` to create `docs/requirements/functional-requirements-framework-meta.md` with this content:

```markdown
# Functional Requirements — Framework Meta

> **Purpose:** Cross-cutting framework-level requirements that don't fit in a single product-feature file. Covers configurable agent models (REQ-6001), workspace permission configuration (REQ-6002), and quick sub-commands within skills (REQ-6003).
>
> **Status:** Draft
> **Last updated:** 2026-06-07
> **Owner persona:** Software Architect

---

## Overview

These requirements describe framework-level concerns that touch the runtime architecture rather than a single user-facing workflow. Each ties to a corresponding ARCH principle and DEC entry.

Related documents:
- [Architecture Overview](../architecture/architecture-overview.md) — ARCH-0008, ARCH-0009, ARCH-0010
- [Assumptions, Decisions & Open Questions](assumptions-decisions-questions.md) — DEC-013, DEC-014, DEC-015

---

### REQ-6001: Configurable Research Agent Model
**Priority:** Should
**Description:** The research agent (Persona 4) shall be configurable via `.claude/agents/<research-agent-name>.md`. The frontmatter `model:` field selects which LLM runs the agent.
**Acceptance Criteria:**
- Frontmatter `model:` field accepts the values: `sonnet`, `opus`, `haiku`, `gemini` (extensible — additional values may be added without breaking the schema)
- `gemini` value triggers a headless-CLI invocation pattern: `gemini -p "<prompt>"`
- If the configured model's CLI is unavailable (binary missing, auth missing), the system falls back to Claude with a one-line warning printed to the user, per NFR-0009
- With no `model:` line, the agent defaults to the running Claude model (no explicit override)
- The agent's body (Markdown after the frontmatter) is the system prompt; the runtime substitutes it into the model invocation
- Re-running a research call with `model: gemini` invokes the Gemini CLI; with no `model:` line, defaults to the running Claude model

**Cross-references:** ARCH-0009, DEC-015

---

### REQ-6002: Workspace Permission Configuration
**Priority:** Must
**Description:** The framework ships with a `.claude/settings.local.json` template that declares the minimum tool permissions needed by all bundled skills. Users fork-and-customize.
**Acceptance Criteria:**
- The schema is `{"permissions": {"allow": ["Skill(<name>)", "Bash(<cmd>:*)", "Read", "Edit", ...]}}` — same shape as the reference product uses
- The template lives in the framework repo as `.claude/settings.local.json.template`
- User forks contain `.claude/settings.local.json` (gitignored) so the user's permission set stays private
- Running the bundled skills against the template `settings.local.json.template` succeeds without permission prompts in a non-interactive run
- The composition with skill-level `allowed-tools` is enforced per NFR-0018

**Cross-references:** NFR-0018, DEC-014

---

### REQ-6003: Quick Sub-Commands within `job-application-assistant` Skill
**Priority:** Should
**Description:** The `job-application-assistant` skill (Plane 1, ARCH-0008) shall accept and route to individual workflow steps based on user phrasing, providing finer-grained invocation than the full `/apply` command.
**Acceptance Criteria:**
- The skill description in `SKILL.md` lists at least these four sub-commands and their entry phrases:
  - "Evaluate this job posting" → Step 1 only (fit evaluation)
  - "Write a CV for [company]" → Step 2 only (CV generation)
  - "Write a cover letter for [company]" → Step 3 only (cover letter generation)
  - "Prepare for interview with [company]" → Step 4 only (interview prep)
- Each sub-command MUST be able to run with or without the upstream steps having completed in the same session — if upstream context is missing, the skill prompts the user for it
- Sub-commands MUST share the same writing-style rules (`03-writing-style.md`), no-fabrication rule (ARCH-0007), and verification checklist as the full `/apply` workflow
- Each sub-command produces the same artifact format (`cv/main_<company>.tex`, etc.) as the full workflow would
- Running a downstream sub-command without upstream context produces a clear "I need <X> first; want me to run that step now?" prompt — never silent failure or fabrication
- Sub-commands respect the configured review mode from REQ-2034 if relevant (e.g., Step 3 cover-letter generation can skip the reviewer per `--review=none`)

**Cross-references:** ARCH-0010, DEC-014

---

## Open Items

- Default agent model for the research role (Open Clarification §10.1 of the spec) — pending implementer decision
- Whether `gemini` should be a v1-shipped option or a v1.1 follow-up — pending product call
```

- [ ] **Step 2: Update requirements/00-index.md to add the new file**

Use `Edit` on `docs/requirements/00-index.md`:

`old_string`:
```
| 8 | [Functional Requirements — Tracking Dashboard](functional-requirements-tracking-dashboard.md) | Local web dashboard over the CSV tracker — list, filter, inline status update, pipeline summary |
| 9 | [User Flows](user-flows.md) | End-to-end user journeys with Mermaid flowcharts |
```

`new_string`:
```
| 8 | [Functional Requirements — Tracking Dashboard](functional-requirements-tracking-dashboard.md) | Local web dashboard over the CSV tracker — list, filter, inline status update, pipeline summary |
| 9 | [Functional Requirements — Framework Meta](functional-requirements-framework-meta.md) | Cross-cutting framework requirements — configurable research model, workspace permissions, quick sub-commands |
| 10 | [User Flows](user-flows.md) | End-to-end user journeys with Mermaid flowcharts |
```

Then continue shifting later rows (11..15) using the same `Edit` strategy. Use one `Edit` per row shift:

`old_string`:
```
| 10 | [Business Rules & Validation](business-rules-and-validation.md) | Scoring frameworks, page limits, content cutting, verification |
| 11 | [Data Requirements](data-requirements.md) | Conceptual data model, entities, relationships, constraints |
| 12 | [Non-Functional Requirements](non-functional-requirements.md) | Performance, accessibility, i18n, security, browser support |
| 13 | [Integrations & Dependencies](integrations-and-dependencies.md) | AI platform, LaTeX, web APIs, job portal adapters |
| 14 | [Assumptions, Decisions & Open Questions](assumptions-decisions-questions.md) | Inferred requirements, design choices, items for review |
```

`new_string`:
```
| 11 | [Business Rules & Validation](business-rules-and-validation.md) | Scoring frameworks, page limits, content cutting, verification |
| 12 | [Data Requirements](data-requirements.md) | Conceptual data model, entities, relationships, constraints |
| 13 | [Non-Functional Requirements](non-functional-requirements.md) | Performance, accessibility, i18n, security, browser support |
| 14 | [Integrations & Dependencies](integrations-and-dependencies.md) | AI platform, LaTeX, web APIs, job portal adapters |
| 15 | [Assumptions, Decisions & Open Questions](assumptions-decisions-questions.md) | Inferred requirements, design choices, items for review |
```

- [ ] **Step 3: Update ID scheme section in 00-index.md**

Use `Edit`:

`old_string`:
```
- `REQ-5xxx` — Functional requirements (tracking dashboard)
- `NFR-0xxx` — Non-functional requirements
```

`new_string`:
```
- `REQ-5xxx` — Functional requirements (tracking dashboard)
- `REQ-6xxx` — Functional requirements (framework meta — agents, permissions, sub-commands)
- `NFR-0xxx` — Non-functional requirements
```

- [ ] **Step 4: Verify the new file and index update**

Run: `ls docs/requirements/functional-requirements-framework-meta.md && grep "^### REQ-6" docs/requirements/functional-requirements-framework-meta.md`
Expected: file exists; REQ-6001, REQ-6002, REQ-6003 all listed.

Run: `grep "REQ-6xxx" docs/requirements/00-index.md`
Expected: line is present in the ID scheme section.

- [ ] **Step 5: Commit**

Run:
```bash
git add docs/requirements/functional-requirements-framework-meta.md docs/requirements/00-index.md
git commit -m "docs: add REQ-6001/6002/6003 + framework-meta requirements file + index"
```

---

## Task 5: Update `functional-requirements-application.md` (REQ-2034, REQ-2055, REQ-2001/2021/2030/2053 rewords)

**Files:**
- Modify: `docs/requirements/functional-requirements-application.md`

**Spec sections covered:** B.1 (REQ-2030 update + REQ-2034 new), B.2 (REQ-2053 update + REQ-2055 new), B.3 (REQ-2001 reword), F.3 (REQ-2021 update).

- [ ] **Step 1: Reword REQ-2001 (manual paste first-class)**

Use `Edit`:

`old_string`:
```
### REQ-2001: URL and Text Input
**Priority:** Must
**Description:** The system shall accept job postings as either a URL (fetched automatically) or pasted text.
**Acceptance Criteria:**
- URL input: fetched via web request; parsed for content
- Text input: used directly
- Extracted metadata: company name, role title, department (if mentioned), location, language of posting
```

`new_string`:
```
### REQ-2001: URL and Text Input (equal-priority modes)
**Priority:** Must
**Description:** The system shall accept job postings via two equal-priority input modes: a URL (which the system fetches) or pasted text (which the system uses directly). Neither is a fallback for the other — both are first-class inputs per DEC-011.
**Acceptance Criteria:**
- URL input: fetched via web request; parsed for content
- Text input: used directly without requiring a prior failed URL fetch
- Both modes produce the same downstream evaluation, drafting, and verification behavior
- Extracted metadata: company name, role title, department (if mentioned), location, language of posting
- User documentation describes paste as a valid first-choice input, not framed as a workaround
```

- [ ] **Step 2: Update REQ-2021 acceptance for AI tooling naming**

Use `Edit`:

`old_string`:
```
- Any mention of AI tooling references the AI assistant by name
- Target: exactly 1 page when compiled
```

`new_string`:
```
- Any mention of AI tooling references the specific tool by name per the rule in `business-rules-and-validation.md §4.4 Tool Naming` (default: **Claude Code**; configurable per profile per DEC-017)
- Target: exactly 1 page when compiled
```

- [ ] **Step 3: Update REQ-2030 acceptance for opt-out reviewer**

Use `Edit`:

`old_string`:
```
### REQ-2030: Reviewer Agent Spawning
**Priority:** Must
**Description:** The drafter shall spawn a separate reviewer agent with a fresh context to critique the drafts.
**Acceptance Criteria:**
- Reviewer receives drafts inline in the prompt (not via file reads)
- Reviewer reads only 4 profile files: candidate, behavioral, writing style, evaluation
- Reviewer does NOT read template files (LaTeX structure concerns are the drafter's domain)
```

`new_string`:
```
### REQ-2030: Reviewer Agent Spawning (conditional on review mode)
**Priority:** Must
**Description:** The drafter shall spawn a separate reviewer agent with a fresh context to critique the drafts, conditional on the application-level review mode selected by the user (see REQ-2034 and DEC-009).
**Acceptance Criteria:**
- Reviewer is spawned when `--review=full` (default) or `--review=quick`
- Reviewer is NOT spawned when `--review=none`
- When spawned, reviewer receives drafts inline in the prompt (not via file reads)
- When spawned, reviewer reads only 4 profile files: candidate, behavioral, writing style, evaluation
- Reviewer does NOT read template files (LaTeX structure concerns are the drafter's domain)
- In `--review=quick` mode, reviewer skips company research (Part B "Company/department-specific angles" is omitted)
```

- [ ] **Step 4: Update REQ-2053 acceptance to use layout-fix memory first**

Use `Edit`:

`old_string`:
```
### REQ-2053: Iterative Fix Loop
**Priority:** Must
**Description:** If layout problems are found, the system shall edit the LaTeX source and recompile until all checks pass.
**Acceptance Criteria:**
- Orphaned entries: fixed with `\needspace{5\baselineskip}` before the entry
- Near-miss overflow: fixed with `\enlargethispage{2-3\baselineskip}`
- Genuine overflow: content cut using relevance-weighted algorithm
- Cover letter font issues: fixed using the fontspec wrapper pattern
- Loop continues until all layout checks pass
```

`new_string`:
```
### REQ-2053: Iterative Fix Loop (with layout-fix memory)
**Priority:** Must
**Description:** If layout problems are found, the system shall edit the LaTeX source and recompile until all checks pass. Before invoking the LLM-driven fix, the system attempts cached fixes from the layout-fix memory (REQ-2055) matching the current `(template, issue-signature)`.
**Acceptance Criteria:**
- Before any LLM-driven fix, the system looks up `(template_id, issue_signature)` in the layout-fix memory; if a match is found, the cached `fix_snippet` is applied first
- Orphaned entries: fixed with `\needspace{5\baselineskip}` before the entry (cached when first derived)
- Near-miss overflow: fixed with `\enlargethispage{2-3\baselineskip}` (cached when first derived)
- Genuine overflow: content cut using relevance-weighted algorithm
- Cover letter font issues: fixed using the fontspec wrapper pattern (cached when first derived)
- On cached-fix success, `applied_count` is incremented and `last_used` updated
- On cached-fix failure, fall through to LLM-driven fix and record the new fix in the cache
- Loop continues until all layout checks pass
```

- [ ] **Step 5: Append REQ-2034 (Reviewer Opt-Out) after REQ-2033**

Use `Edit`:

`old_string`:
```
### REQ-2033: Behavioral Voice Check
**Priority:** Should
**Description:** The reviewer shall specifically check whether the cover letter's voice matches the candidate's natural register as described in the behavioral profile.
**Acceptance Criteria:**
- Flags mismatches (e.g., a "Collaborator" profile given a solo-hero tone; a "Persuader" profile given over-hedged phrasing)
- Tone issues are reported under the "Tone and style issues" category
```

`new_string`:
```
### REQ-2033: Behavioral Voice Check
**Priority:** Should
**Description:** The reviewer shall specifically check whether the cover letter's voice matches the candidate's natural register as described in the behavioral profile.
**Acceptance Criteria:**
- Flags mismatches (e.g., a "Collaborator" profile given a solo-hero tone; a "Persuader" profile given over-hedged phrasing)
- Tone issues are reported under the "Tone and style issues" category

### REQ-2034: Reviewer Opt-Out
**Priority:** Must
**Description:** The `/apply` command shall accept a `--review` flag with three modes: `full` (default), `quick`, and `none`. The mode controls whether the reviewer agent (REQ-2030) is spawned and what scope of review it performs.
**Acceptance Criteria:**
- `/apply --review=full <input>` — current behavior: reviewer with company research + Part A + Part B
- `/apply --review=quick <input>` — reviewer runs but skips company research; returns Part A only (machine-applicable edits)
- `/apply --review=none <input>` — reviewer step is skipped entirely; the drafter still runs the final verification checklist (REQ-2060)
- Default is `--review=full` if the flag is omitted
- Before each application starts, the system prints an estimated token cost for the selected mode
- The chosen review mode is recorded in the tracker `notes` column (or a dedicated column if added to the schema in a future revision)

**Cross-references:** DEC-009, ARCH-0006 (human-in-the-loop)
```

- [ ] **Step 6: Append REQ-2055 (Layout Fix Memory) after REQ-2054**

Use `Edit`:

`old_string`:
```
### REQ-2054: Build Artifact Cleanup
**Priority:** Should
**Description:** After final clean compile, auxiliary files (.aux, .log, .out) shall be deleted, keeping .tex and .pdf.
**Acceptance Criteria:**
- Only .tex and .pdf files remain after cleanup
```

`new_string`:
```
### REQ-2054: Build Artifact Cleanup
**Priority:** Should
**Description:** After final clean compile, auxiliary files (.aux, .log, .out) shall be deleted, keeping .tex and .pdf.
**Acceptance Criteria:**
- Only .tex and .pdf files remain after cleanup

### REQ-2055: Layout Fix Memory
**Priority:** Should
**Description:** The system shall maintain a cache of successful layout fixes at `.agents/state/layout-fixes.json`. The cache turns repeat layout problems into instant fixes rather than LLM-driven derivations.
**Acceptance Criteria:**
- Cache entries are records of the form `{template_id, issue_signature, fix_snippet, applied_count, last_used}`
- `issue_signature` is a normalized fingerprint of the layout problem (e.g., "orphaned entry title at section X" → stable hash), derived deterministically from the failing-PDF inspection output
- On a new compile failure: the system looks up matching `(template_id, issue_signature)`; if present, attempts the cached `fix_snippet` first; on success, increments `applied_count` and updates `last_used`; on failure, falls through to LLM-driven fix and records the new fix
- Cache pruning: entries unused for 180 days are removed on next cache write
- The cache file is gitignored (per `.gitignore` updates)
- A maintenance command (`/apply --prune-fixes` or equivalent) MAY be added to manually trigger pruning

**Cross-references:** DEC-010, REQ-2053
```

- [ ] **Step 7: Verify all updates**

Run: `grep "^### REQ-20" docs/requirements/functional-requirements-application.md | wc -l`
Expected: previous count + 2 (REQ-2034 and REQ-2055 added).

Run: `grep "^### REQ-2034\|^### REQ-2055" docs/requirements/functional-requirements-application.md`
Expected: both lines present.

Run: `grep -A 1 "^### REQ-2001" docs/requirements/functional-requirements-application.md | tail -1`
Expected: contains "equal-priority" or DEC-011.

- [ ] **Step 8: Commit**

Run:
```bash
git add docs/requirements/functional-requirements-application.md
git commit -m "docs: add REQ-2034 (reviewer opt-out) and REQ-2055 (layout-fix memory); update REQ-2001/2021/2030/2053"
```

---

## Task 6: Update `functional-requirements-job-search.md` (REQ-1001/1003/1004/1009)

**Files:**
- Modify: `docs/requirements/functional-requirements-job-search.md`

**Spec sections covered:** B.4 (REQ-1003 reword), B.3 (REQ-1004 reword), D.2 (REQ-1001 wording correction), A.3 (REQ-1009 add `last_updated`).

- [ ] **Step 1: Soften REQ-1001 wording from "command" to "skill invocation"**

Use `Edit`:

`old_string`:
```
### REQ-1001: Search Invocation
**Priority:** Must
**Description:** The user shall invoke the job search via a command that supports optional focus area and breadth arguments.
**Acceptance Criteria:**
- Default invocation runs top 3 priority query categories
- Optional focus argument (e.g., "data science") prioritizes matching category queries
- "broad" argument runs all query categories
- System loads state (seen jobs, tracker, search queries) before searching
```

`new_string`:
```
### REQ-1001: Search Invocation
**Priority:** Must
**Description:** The user shall invoke the job search via a skill invocation (the `job-scraper` skill on Plane 1 per ARCH-0008) that supports optional focus area and breadth arguments. Trigger phrases include `/scrape` (slash-prefixed name) as well as natural-language alternatives such as "find new jobs" or "any new positions?".
**Acceptance Criteria:**
- Default invocation runs top 3 priority query categories
- Optional focus argument (e.g., "data science") prioritizes matching category queries
- "broad" argument runs all query categories
- System loads state (seen jobs, tracker, search queries) before searching
- The skill is NOT a `.claude/commands/*.md` slash command — it lives at `.claude/skills/job-scraper/SKILL.md` and is activated by the trigger keywords listed in its frontmatter description (ARCH-0010)
```

- [ ] **Step 2: Reword REQ-1003 for country-agnostic core**

Use `Edit`:

`old_string`:
```
### REQ-1003: Multi-Portal Search
**Priority:** Must
**Description:** The system shall execute web search queries across configured job portals according to the user's search query configuration.
**Acceptance Criteria:**
- Queries target configured job board sites (e.g., site:indeed.com, site:linkedin.com/jobs)
- Geographic area from the user's configuration is applied
- Searches for postings from the last 14 days
- Multiple searches can run in parallel for efficiency
```

`new_string`:
```
### REQ-1003: Multi-Portal Search (provider-pluggable, country-agnostic)
**Priority:** Must
**Description:** Queries are executed against the configured set of portal-adapter plugins. The core search logic is provider-agnostic — no specific portal, country, or locale is referenced in the core (see DEC-012 and NFR-0007).
**Acceptance Criteria:**
- Specific portals (e.g., `site:indeed.com`, `site:linkedin.com/jobs`, `site:jobindex.dk`) are referenced ONLY in user-configured search-queries files (`.claude/skills/job-scraper/search-queries.md`) and in adapter implementations (`.agents/skills/<portal>/cli/`)
- Geographic area from the user's configuration is applied per the location filter tiers (ideal / acceptable / borderline / too far)
- Searches for postings from the last 14 days
- Multiple searches can run in parallel for efficiency
- Adding a new portal requires no core changes — only an adapter under `.agents/skills/` and search-queries entries

**Note on examples:** The examples `site:indeed.com` / `site:linkedin.com/jobs` are illustrative of user-configured query style only; they do not imply that those portals ship as first-party adapters.
```

- [ ] **Step 3: Reword REQ-1004 to remove paste-as-fallback framing**

Use `Edit`:

`old_string`:
```
### REQ-1004: Result Fetching and Parsing
**Priority:** Must
**Description:** For each promising search result, the system shall fetch the job posting page and extract structured data.
**Acceptance Criteria:**
- Extracted fields: job title, company, location, posting date (or "recent"), URL, key requirements (brief), application deadline (if listed)
- Skips URLs already in seen_jobs.json
- Skips company+role combos already in application tracker
- Uses titles and search snippets to pre-filter before fetching (token efficiency)
```

`new_string`:
```
### REQ-1004: Result Fetching and Parsing
**Priority:** Must
**Description:** For each promising search result, the system shall fetch the job posting page and extract structured data. If a URL cannot be fetched (portal blocking, transient network issue), the user can paste the posting body for the same downstream processing — paste is a first-class input per DEC-011 and REQ-2001, not a degradation path.
**Acceptance Criteria:**
- Extracted fields: job title, company, location, posting date (or "recent"), URL, key requirements (brief), application deadline (if listed)
- Skips URLs already in `job_scraper/seen_jobs.json`
- Skips company+role combos already in application tracker
- Uses titles and search snippets to pre-filter before fetching (token efficiency)
- When a URL fetch fails, the system surfaces a paste prompt as a first-class alternative (not framed as a fallback or degradation)
```

- [ ] **Step 4: Add `last_updated` to REQ-1009 tracker column list + add cross-reference**

Use `Edit`:

`old_string`:
```
### REQ-1009: Tracker Update
**Priority:** Should
**Description:** When the user decides to apply to a job, a row shall be added to the application tracker.
**Acceptance Criteria:**
- Tracker columns: date, company, sector, role, role_type, channel, status, contact_person, fit_rating, notes, cv_file, cover_letter_file, source
- Row is added after the user confirms intent to apply
```

`new_string`:
```
### REQ-1009: Tracker Update
**Priority:** Should
**Description:** When the user decides to apply to a job, a row shall be added to the application tracker.
**Acceptance Criteria:**
- Tracker columns: date, company, sector, role, role_type, channel, status, contact_person, fit_rating, notes, cv_file, cover_letter_file, source, last_updated
- Row is added after the user confirms intent to apply

**Cross-references:** Canonical schema is in `data-requirements.md §11` (column types, mutability, migration). Status enum and transitions are in `business-rules-and-validation.md §9`.
```

- [ ] **Step 5: Verify all four updates**

Run: `grep -A 2 "^### REQ-1001\|^### REQ-1003\|^### REQ-1004\|^### REQ-1009" docs/requirements/functional-requirements-job-search.md | head -30`
Expected: all four headings present, with the new content visible.

Run: `grep "last_updated" docs/requirements/functional-requirements-job-search.md`
Expected: at least one match in REQ-1009 column list.

- [ ] **Step 6: Commit**

Run:
```bash
git add docs/requirements/functional-requirements-job-search.md
git commit -m "docs: reword REQ-1001/1003/1004 (skill invocation, country-agnostic, paste first-class); add last_updated to REQ-1009"
```

---

## Task 7: Update onboarding + career-development files (REQ-0001, REQ-0012, REQ-3001)

**Files:**
- Modify: `docs/requirements/functional-requirements-onboarding.md`
- Modify: `docs/requirements/functional-requirements-career-development.md`

**Spec sections covered:** F.1 (REQ-0001 enumeration), F.2 (REQ-0012 priority upgrade), D.2 (REQ-3001 wording correction).

- [ ] **Step 1: Enumerate `--section` values in REQ-0001**

Use `Edit` on `docs/requirements/functional-requirements-onboarding.md`:

`old_string`:
```
### REQ-0001: Path Selection
**Priority:** Must
**Description:** On invocation, the system shall detect whether the user's document folder contains files and present three onboarding paths with appropriate recommendations.
**Acceptance Criteria:**
- If document folder has files in ≥1 subfolder, Path A is recommended
- If document folder is empty, Path A is presented as a "populate first" option
- User can choose any path regardless of folder state
- If `--section <name>` argument is provided, system skips path selection and jumps to that section for an update-only flow
```

`new_string`:
```
### REQ-0001: Path Selection
**Priority:** Must
**Description:** On invocation, the system shall detect whether the user's document folder contains files and present three onboarding paths with appropriate recommendations.
**Acceptance Criteria:**
- If document folder has files in ≥1 subfolder, Path A is recommended
- If document folder is empty, Path A is presented as a "populate first" option
- User can choose any path regardless of folder state
- If `--section <name>` argument is provided, system skips path selection and jumps to that section for an update-only flow. Supported `<name>` values:
  - `search` — re-runs only the job search configuration interview (Path C Section 9). Most commonly used.
  - `skills` — re-runs only the Technical Skills section
  - `experience` — re-runs only the Professional Experience section
  - `behavioral` — re-runs only the Behavioral Profile section
  - `goals` — re-runs only the Career Goals & Preferences section
  - `references` — re-runs only the References section
- Unknown `--section` values surface a list of valid options and exit. No partial profile damage.
```

- [ ] **Step 2: Upgrade REQ-0012 priority from Could to Should**

Use `Edit`:

`old_string`:
```
### REQ-0012: STAR Example Stubs
**Priority:** Could
```

`new_string`:
```
### REQ-0012: STAR Example Stubs
**Priority:** Should
```

Then update the body to reference DEC-016:

Use `Edit`:

`old_string`:
```
### REQ-0012: STAR Example Stubs
**Priority:** Should
**Description:** When achievements are found in documents that are not covered by existing STAR examples, the system shall create stub entries for the user to complete.
**Acceptance Criteria:**
- Stubs include: achievement title, source document, one-sentence description, applicable question types, and empty S/T/A/R fields
- Does NOT draft full STAR examples from inference
- User is notified of stubs needing completion
```

`new_string`:
```
### REQ-0012: STAR Example Stubs (load-bearing in Path A per DEC-016)
**Priority:** Should
**Description:** When achievements are found in documents that are not covered by existing STAR examples, the system shall create stub entries for the user to complete. This is a load-bearing Path A behavior: the no-fabrication rule (ARCH-0007) prevents the system from drafting full STAR examples from inference, but Path A surfaces the candidate achievements so the user knows what to flesh out (see DEC-016).
**Acceptance Criteria:**
- Stubs include: achievement title, source document, one-sentence description, applicable question types, and empty S/T/A/R fields
- Stubs are written under a dedicated section `## STAR Candidates (Complete Manually)` in `07-interview-prep.md`
- Does NOT draft full STAR examples from inference
- User is notified of stubs needing completion in the post-setup summary
- Path A produces at least one stub for every achievement that doesn't already have an existing STAR example
```

- [ ] **Step 3: Soften REQ-3001 wording (career-development)**

Use `Edit` on `docs/requirements/functional-requirements-career-development.md`:

`old_string`:
```
### REQ-3001: Dual-Mode Invocation
**Priority:** Must
**Description:** The upskill command shall support two modes: aggregate (all tracked jobs) and targeted (single posting).
**Acceptance Criteria:**
- `/upskill` with no argument → aggregate mode (analyzes all jobs in tracker)
- `/upskill <URL>` → targeted mode (analyzes single fetched posting)
- Report filename reflects mode (aggregate: date-based; targeted: date + company + role slug)
```

`new_string`:
```
### REQ-3001: Dual-Mode Invocation
**Priority:** Must
**Description:** The upskill skill (Plane 1 per ARCH-0008, lives at `.claude/skills/upskill/SKILL.md`; not a `.claude/commands/*.md` slash command) shall support two modes: aggregate (all tracked jobs) and targeted (single posting). Trigger phrases include `/upskill` (slash-prefixed name) as well as natural-language alternatives such as "skill gaps" or "what should I learn".
**Acceptance Criteria:**
- `/upskill` (or equivalent trigger phrase) with no URL argument → aggregate mode (analyzes all jobs in tracker)
- `/upskill <URL>` (or "analyze gaps for <URL>") → targeted mode (analyzes single fetched posting)
- Report filename reflects mode (aggregate: date-based; targeted: date + company + role slug)
```

- [ ] **Step 4: Verify updates**

Run: `grep -A 8 "^### REQ-0001" docs/requirements/functional-requirements-onboarding.md | grep -E "search|skills|experience|behavioral|goals|references"`
Expected: all six section names appear.

Run: `grep -A 1 "^### REQ-0012" docs/requirements/functional-requirements-onboarding.md | tail -1`
Expected: contains "Should" (not "Could").

Run: `grep -A 1 "^### REQ-3001" docs/requirements/functional-requirements-career-development.md | tail -1`
Expected: contains "upskill skill" or "ARCH-0008".

- [ ] **Step 5: Commit**

Run:
```bash
git add docs/requirements/functional-requirements-onboarding.md docs/requirements/functional-requirements-career-development.md
git commit -m "docs: enumerate --section values in REQ-0001; upgrade REQ-0012 to Should; soften REQ-3001 to skill invocation"
```

---

## Task 8: Extend `data-requirements.md` (§1.5, §1.6, §13, §14, §15)

**Files:**
- Modify: `docs/requirements/data-requirements.md`

**Spec sections covered:** D.7 + E.5 (§1.5, §1.6), B.2 (§13 Layout Fix Cache), E.3 (§14 Search Queries), E.4 (§15 Past Application Records).

- [ ] **Step 1: Locate the file's section structure**

Run: `grep -n "^## " docs/requirements/data-requirements.md`
Expected: list of top-level sections including §1, §11, §12.

- [ ] **Step 2: Insert §1.5 and §1.6 after §1**

Find where §1 ends (right before §2). Use `Edit` to insert:

`old_string` should be the last lines of §1 followed by the §2 heading. (The exact text depends on the current file — read it before this step.)

Run: `grep -B 1 "^## 2\." docs/requirements/data-requirements.md`
Expected: shows the last line of §1 + the §2 heading.

Then use `Edit` to insert the new §1.5 and §1.6 immediately before the `## 2.` line. The new content is:

```markdown

## 1.5 CLAUDE.md Roles

CLAUDE.md serves two distinct roles in this framework's ecosystem.

**Role A — Framework-development CLAUDE.md (in CareerForge's own repo).** Project memory for developers building CareerForge. Points at `/docs` and cross-references. Lives in the repo root at the CareerForge framework repo. This is what `CLAUDE.md` means in our own project memory and instructions.

**Role B — User-fork CLAUDE.md (in a fork of CareerForge).** The user's candidate profile + workflow rules + verification checklist, populated by `/setup` from the framework's template. Read by the assistant on every turn during `/apply`, `/scrape`, etc.

**The template** for Role B is shipped at `CLAUDE.md.template` in the framework repo and contains placeholder tokens that `/setup` replaces with the user's actual data.

## 1.6 Candidate-Profile Template Schema

Required sections (in order) in the Role B CLAUDE.md:

- **Identity** — name, location, languages, employment status, LinkedIn headline
- **Education** — degrees with field, institution, dates, thesis
- **Professional Experience** — roles with title, company, dates, location, responsibilities, achievements
- **Technical Skills** — Primary / Secondary / Domain / Software
- **Certifications**
- **Publications**
- **Awards**
- **Behavioral Profile** — traits, strengths, growth areas, ideal environment
- **What Excites You**
- **Target Sectors**
- **Deal-breakers**

Workflow sections (in order):

- **Role** — one-paragraph framing of what Claude does in this workspace
- **Repo Structure** — pointer at the bundled directories
- **Workflow for New Job Applications** — the 5-step pipeline
- **Verification Checklist** — Factual accuracy / Targeting / Consistency / Quality / Compiled PDF verification

Token-replacement placeholders in the template use `[UPPER_SNAKE_CASE]` form (e.g., `[YOUR_NAME]`, `[DEGREE_LEVEL]`, `[FIELD]`, `[INSTITUTION]`, `[JOB_TITLE]`, `[COMPANY]`, `[YOUR_PRIMARY_SKILLS]`, `[DEALBREAKER_1]`). `/setup` replaces these from user input or document extraction.

---

```

- [ ] **Step 3: Append §13 Layout Fix Cache after §12**

Find the end of §12 (Salary Data). Use `Edit`:

`old_string` should be the last 2-3 lines of §12 followed by either `---` or end-of-file or the next section.

Append after §12:

```markdown

## 13. Layout Fix Cache

**File:** `.agents/state/layout-fixes.json` (gitignored)

**Purpose:** Persists successful LaTeX layout fixes per template so repeat issues become cache hits rather than LLM-driven re-derivations (REQ-2055 / DEC-010).

**Schema:**

```json
{
  "fixes": [
    {
      "template_id": "moderncv-banking",
      "issue_signature": "orphaned-cventry-at-page-end:section=experience",
      "fix_snippet": "\\needspace{5\\baselineskip}",
      "applied_count": 12,
      "last_used": "2026-06-05T14:30:00Z",
      "first_recorded": "2026-04-22T09:15:00Z"
    }
  ]
}
```

**Lifecycle:** Created on first compile failure; appended to on each new fix derivation; pruned of entries with `last_used` older than 180 days on next cache write. Read at the start of every compile-fix iteration in REQ-2053.

**Privacy:** Contains no candidate data — only template IDs and fix patterns. The gitignore status is for hygiene, not privacy.

## 14. Search Queries Configuration

**File:** `.claude/skills/job-scraper/search-queries.md`

**Purpose:** Markdown file with priority-grouped search query templates. Generated by `/setup` (Step 3 §8); editable directly by users. Re-runnable via `/setup --section search`. Read by the `job-scraper` skill (Plane 1) and by portal-adapter skills (Plane 2) for query construction.

**Sections (by priority):**

| Priority | Use |
|---|---|
| 1 | Primary role direction — strongest match |
| 2 | Domain expertise — vertical-specific queries |
| 3 | Adjacent role pivots — broader career direction |
| 4 | Wider-net broad queries |

**Template tokens** (auto-replaced by `/setup`):

- `[YOUR_PRIMARY_JOB_TITLE]`
- `[YOUR_KEY_SKILL]`
- `[YOUR_DOMAIN_KEYWORD_1]` … `[YOUR_DOMAIN_KEYWORD_N]`
- `[YOUR_CITY]`, `[YOUR_COUNTRY]`, `[YOUR_REGION]`
- `[LOCATION_TIER_IDEAL]`, `[LOCATION_TIER_ACCEPTABLE]`, `[LOCATION_TIER_BORDERLINE]`, `[LOCATION_TIER_TOO_FAR]`

**Lifecycle:** Created by `/setup`; updated by `/setup --section search`; read by the job-scraper skill on every `/scrape` invocation.

## 15. Past Application Records

**Folder pattern:** `documents/applications/<company>_<role>/` — one folder per historical application.

| File | Required? | Content |
|---|---|---|
| `job_posting.md` | Yes | Role title, company, required skills, experience level, sector, role type — extracted from the original posting |
| `cover_letter.tex` | If sent | The cover letter that was sent (LaTeX). Used by `/setup` Path A to extract patterns (REQ-0011) and by `/expand` if read |
| `cv_draft.tex` | If sent | The CV variant that was sent (LaTeX). Used by `/setup` for profile-statement template extraction |
| `outcome.md` | Yes | Status (one of `hired / rejected / no_response / interview_only`), interview stages reached, notes |

**Lifecycle:** Created manually by the user or via `/apply` write-back (future enhancement). Read by `/setup` Path A (REQ-0007); used to calibrate evaluation framework per Path A Step A5 inference rules.
```

- [ ] **Step 4: Update §11 (Application Tracker) to add a `last_updated` row to the column table**

(This may have been done in an earlier round; verify first.)

Run: `grep "last_updated" docs/requirements/data-requirements.md | head -3`
Expected: at least one match. If zero matches, add it now using `Edit`:

`old_string`:
```
| source | URL | Source URL of posting |
```

`new_string`:
```
| source | URL | No | Source URL of posting |
| last_updated | Datetime (ISO 8601) | Yes (auto) | Timestamp of most recent dashboard edit; defaults to `date` for legacy/migrated rows |
```

(Verify the surrounding column-table headers include a "Mutable by dashboard?" column from an earlier round. If not, also update the table header and existing rows — the spec acceptance for this lives under Section A.3, already done in previous work.)

- [ ] **Step 5: Verify all five new sections present**

Run: `grep "^## 1\.5\|^## 1\.6\|^## 13\.\|^## 14\.\|^## 15\." docs/requirements/data-requirements.md`
Expected: all five lines present.

- [ ] **Step 6: Commit**

Run:
```bash
git add docs/requirements/data-requirements.md
git commit -m "docs: add data-requirements §1.5, §1.6, §13, §14, §15 (CLAUDE.md roles, candidate template, layout cache, search queries, past applications)"
```

---

## Task 9: Add §4.4 Tool Naming to business rules

**Files:**
- Modify: `docs/requirements/business-rules-and-validation.md`

**Spec sections covered:** F.3 (§4.4 Tool Naming).

- [ ] **Step 1: Locate §4 Writing Quality Rules**

Run: `grep -n "^## 4\.\|^### 4\." docs/requirements/business-rules-and-validation.md`
Expected: shows §4 main heading and its subsections (4.1, 4.2, 4.3).

- [ ] **Step 2: Append §4.4 after §4.3**

Use `Edit`:

`old_string`:
```
### 4.3 Reframing Boundaries

| Acceptable | Flag It | Never |
|-----------|---------|-------|
| Reordering experience to lead with relevance | Combining academic + industry into a single claim implying all industry | Claiming experience the user doesn't have |
| Using natural synonyms for the target domain | Using the posting's specific terminology when actual work was adjacent | Implying work in a domain they haven't touched |
| Emphasizing one aspect of a broad role | | |
```

`new_string`:
```
### 4.3 Reframing Boundaries

| Acceptable | Flag It | Never |
|-----------|---------|-------|
| Reordering experience to lead with relevance | Combining academic + industry into a single claim implying all industry | Claiming experience the user doesn't have |
| Using natural synonyms for the target domain | Using the posting's specific terminology when actual work was adjacent | Implying work in a domain they haven't touched |
| Emphasizing one aspect of a broad role | | |

### 4.4 Tool Naming

When generated CVs or cover letters reference the candidate's use of agentic coding or AI tooling, the name of the specific tool used shall appear by name rather than as a generic "AI assistant" or "agentic tool". This is both a precision rule (clarifies what the candidate actually used) and a hiring-signal rule (interviewers can verify specifics). See DEC-017.

**Default:** **Claude Code**.

**Configurable per profile.** Users may set an alternative in `01-candidate-profile.md` via a new field `ai_tooling_used:` — supported values include `Claude Code`, `Cursor`, `GitHub Copilot`, or other tool names. If the field is absent or empty, the default applies.

**Rule application:**

| Generated text | Acceptable | Unacceptable |
|---|---|---|
| "I used **Claude Code** to build…" | ✅ | — |
| "I used **Cursor** to refactor…" | ✅ (if `ai_tooling_used: Cursor` in profile) | — |
| "I used AI tools to…" | — | ❌ generic — replace with the named tool |
| "I used agentic coding to…" | — | ❌ generic — replace with the named tool |
| "I used an AI assistant to…" | — | ❌ generic — replace with the named tool |

**Verification:** REQ-2021 acceptance includes this rule. The verification checklist (REQ-2060) flags any unreplaced generic reference.
```

- [ ] **Step 3: Verify §4.4 present**

Run: `grep "^### 4\.4 Tool Naming" docs/requirements/business-rules-and-validation.md`
Expected: line is present.

- [ ] **Step 4: Commit**

Run:
```bash
git add docs/requirements/business-rules-and-validation.md
git commit -m "docs: add business-rules §4.4 Tool Naming (Claude Code default, configurable per profile)"
```

---

## Task 10: Update personas-and-actors.md (Persona 1, Matrix, Persona 4)

**Files:**
- Modify: `docs/requirements/personas-and-actors.md`

**Spec sections covered:** A.4 (Persona 1 key task), A.5 (Actor Matrix row), D.3 (Persona 4 multi-model).

- [ ] **Step 1: Add a row to Persona 1 Key Tasks**

Run: `grep -n "^| Task | Trigger | Frequency |" docs/requirements/personas-and-actors.md`
Expected: shows the key tasks table header line number.

Use `Edit` to insert a new row at the end of the table:

`old_string`:
```
| Reset profile | Starting fresh | Rare |
```

`new_string`:
```
| Reset profile | Starting fresh | Rare |
| Review pipeline / update application status / append manual applications | Via `/dashboard` | Weekly–daily during active search |
```

- [ ] **Step 2: Add a row to the Actor Interaction Matrix**

Use `Edit`:

`old_string`:
```
| Reset profile data | ✅ (explicit confirmation required) | ✅ (executes) | — | — |
```

`new_string`:
```
| Reset profile data | ✅ (explicit confirmation required) | ✅ (executes) | — | — |
| Use tracking dashboard | ✅ | — | — | — |
```

- [ ] **Step 3: Update Persona 4 (Research Agent) for multi-model**

Use `Edit`:

`old_string`:
```
## Persona 4: Research Agent

### Role
An optional agent that can be invoked for deeper research tasks requiring synthesis from multiple web sources.

### Capabilities
- Execute targeted research queries
- Synthesize findings from multiple sources
- Provide structured summaries with source attribution
- Cross-reference facts for reliability

### Constraints
- Used opportunistically, not as part of the core workflow
- Results must be independently verified before inclusion in application materials

### Interaction Model
- Invoked by the drafter or directly by the user
- Returns research findings as structured text
- No direct file-writing permissions
```

`new_string`:
```
## Persona 4: Research Agent

### Role
An optional, configurable agent that can be invoked for deeper research tasks requiring synthesis from multiple web sources. Defined at `.claude/agents/<name>.md` per ARCH-0009; the `model:` frontmatter field selects which LLM runs the agent (REQ-6001, DEC-015).

### Configuration
- Default model is Claude (no `model:` line, or `model: sonnet|opus|haiku`)
- Alternative model is Gemini via headless CLI (`model: gemini`); other LLM CLIs may be added by extending the runtime
- If the configured model's CLI is unavailable, falls back to Claude with a one-line warning (NFR-0009)

### Capabilities
- Execute targeted research queries
- Synthesize findings from multiple sources
- Provide structured summaries with source attribution
- Cross-reference facts for reliability

### Constraints
- Used opportunistically, not as part of the core workflow
- Results must be independently verified before inclusion in application materials
- No direct file-writing permissions

### Interaction Model
- Invoked by the drafter or directly by the user
- Returns research findings as structured text
```

- [ ] **Step 4: Verify all three updates**

Run: `grep "Review pipeline" docs/requirements/personas-and-actors.md`
Expected: line is present.

Run: `grep "Use tracking dashboard" docs/requirements/personas-and-actors.md`
Expected: line is present.

Run: `grep "ARCH-0009\|REQ-6001" docs/requirements/personas-and-actors.md`
Expected: at least one match in the Persona 4 section.

- [ ] **Step 5: Commit**

Run:
```bash
git add docs/requirements/personas-and-actors.md
git commit -m "docs: add dashboard task to Persona 1; add tracking-dashboard matrix row; update Persona 4 (configurable model)"
```

---

## Task 11: Add ~10 glossary terms

**Files:**
- Modify: `docs/glossary.md`

**Spec sections covered:** A.6 (5 dashboard terms), D.4 (Two-Plane Skill Architecture, Named Sub-Agent, SKILL.md Orchestrator, Allowed-Tools, Workspace Settings).

- [ ] **Step 1: Add A.6 entries (dashboard-related)**

Use `Edit` to add new terms under the appropriate letter sections.

Add to "A" section (after Application Tracker):

`old_string`:
```
**Application Tracker**
A CSV-based record of all job applications the user has initiated or completed through CareerForge. Tracks company, role, status, fit rating, and file references. Used for deduplication during job search and for aggregate skill gap analysis.
```

`new_string`:
```
**Application Tracker**
A CSV-based record of all job applications the user has initiated or completed through CareerForge. Tracks company, role, status, fit rating, and file references. Used for deduplication during job search and for aggregate skill gap analysis.

**Application Status Enum**
Canonical set of seven status values used in the application tracker: `Draft, Sent, Interview, Offer, Rejected, Withdrawn, Closed`. Allowed transitions and the "muted" set for de-emphasized rendering are defined in `business-rules-and-validation.md §9`.

**Atomic CSV Write**
The tracking dashboard's write contract: read → mutate target cells → write to tempfile → fsync → rename over original, with a `.bak` retained. Guarantees readers and the `/apply` appender never see a partial file (NFR-0016).

**Allowed-Tools**
The frontmatter field on every `SKILL.md` (per ARCH-0010) listing the tools that skill is permitted to invoke. The runtime rejects tool calls not in this list. Composes with workspace `.claude/settings.local.json` per NFR-0018.
```

- [ ] **Step 2: Add "Named Sub-Agent" entry under "N"**

Find a good place under the N section (or add a new N section if none exists). Use `Edit`:

`old_string`:
```
## O

**Onboarding**
```

`new_string`:
```
## N

**Named Sub-Agent**
A research-style agent defined at `.claude/agents/<agent-name>.md` with frontmatter (`name`, `description`, optional `model`) and a Markdown body as the system prompt (ARCH-0009). The `model:` field enables multi-model routing — e.g., `model: gemini` invokes a headless Gemini CLI. See REQ-6001 and DEC-015.

## O

**Onboarding**
```

- [ ] **Step 3: Add "Pipeline KPI" entry under "P"**

Use `Edit`:

`old_string`:
```
**Profile Statement**
A 3–5 line elevator pitch at the top of a CV, tailored to the specific role being applied for. Multiple templates are maintained for different role types.
```

`new_string`:
```
**Pipeline KPI**
Aggregate counts per application status plus average fit rating (last 30 days) and interviews-per-application rate (last 90 days); rendered in the dashboard summary strip (REQ-5003).

**Profile Statement**
A 3–5 line elevator pitch at the top of a CV, tailored to the specific role being applied for. Multiple templates are maintained for different role types.
```

- [ ] **Step 4: Add "Read-Only Mode" entry under "R"**

Use `Edit`:

`old_string`:
```
**Relevance-Weighted Cutting**
See: Content Cutting (Relevance-Weighted).
```

`new_string`:
```
**Read-Only Mode**
Dashboard launch flag (`--read-only`) that disables all mutating routes and renders all edit controls as disabled. Used for screenshots, demos, and accidental-write protection (REQ-5007).

**Relevance-Weighted Cutting**
See: Content Cutting (Relevance-Weighted).
```

- [ ] **Step 5: Add "SKILL.md Orchestrator", "Two-Plane Skill Architecture", "Tracking Dashboard", "Workspace Settings" entries**

Use `Edit` to add under "S":

`old_string`:
```
**STAR Format**
A structured answer framework for behavioral interview questions: **S**ituation (context), **T**ask (responsibility), **A**ction (what was done), **R**esult (outcome). CareerForge maintains ready-made STAR examples drawn from the user's actual experience.
```

`new_string`:
```
**SKILL.md Orchestrator**
The canonical skill-anchor file at the root of every skill folder. Has mandatory frontmatter (`name`, `description`, `allowed-tools`) and a body that names trigger phrases, lists companion files, and describes the skill's contract (ARCH-0010, DEC-014).

**STAR Format**
A structured answer framework for behavioral interview questions: **S**ituation (context), **T**ask (responsibility), **A**ction (what was done), **R**esult (outcome). CareerForge maintains ready-made STAR examples drawn from the user's actual experience.
```

Use `Edit` to add under "T":

`old_string`:
```
## T

**Traceability**
```

`new_string`:
```
## T

**Tracking Dashboard**
Local web UI (Bun + Hono + HTMX + Pico.css per ADR-0005) over the application tracker CSV. Runs on `127.0.0.1` only. Allows status/notes edits and manual row append. See REQ-5xxx and ADR-0005.

**Two-Plane Skill Architecture**
Skills are split into two filesystem trees with different roles: Plane 1 (Claude Code skills at `.claude/skills/<name>/`, knowledge-only) and Plane 2 (sub-agent CLI skills at `.agents/skills/<name>/cli/`, external binaries). A skill is either Plane 1 or Plane 2, never both. See ARCH-0008 and DEC-013.

**Traceability**
```

Use `Edit` to add under "W" (which may not exist — verify first):

Run: `grep "^## W" docs/glossary.md`
Expected: may show nothing.

If "W" section doesn't exist, add it before the file ends. Use `Edit`:

`old_string`:
```
**Verification Checklist**
A structured pass/fail checklist run once at the end of the application pipeline, covering: factual accuracy, targeting quality, consistency between CV and cover letter, LaTeX quality, and compiled PDF layout.
```

`new_string`:
```
**Verification Checklist**
A structured pass/fail checklist run once at the end of the application pipeline, covering: factual accuracy, targeting quality, consistency between CV and cover letter, LaTeX quality, and compiled PDF layout.

## W

**Workspace Settings**
The `.claude/settings.local.json` file in a user's workspace that declares which tools each skill (and the AI assistant itself) is allowed to use. Combines with skill-level `allowed-tools` to gate tool invocations (NFR-0018). Shipped as `.claude/settings.local.json.template` in the framework; gitignored per REQ-6002.
```

- [ ] **Step 6: Verify all 10 new terms present**

Run: `grep -c "^\*\*\(Application Status Enum\|Atomic CSV Write\|Allowed-Tools\|Named Sub-Agent\|Pipeline KPI\|Read-Only Mode\|SKILL\.md Orchestrator\|Tracking Dashboard\|Two-Plane Skill Architecture\|Workspace Settings\)\*\*" docs/glossary.md`
Expected: `10`

- [ ] **Step 7: Commit**

Run:
```bash
git add docs/glossary.md
git commit -m "docs: add 10 glossary terms (dashboard + architecture distinctions)"
```

---

## Task 12: Architecture — cross-cutting + security + data-architecture fixes

**Files:**
- Modify: `docs/architecture/cross-cutting-concerns.md`
- Modify: `docs/architecture/security-architecture.md`
- Modify: `docs/architecture/data-architecture.md`

**Spec sections covered:** D.4 (Skill Frontmatter Schema in cross-cutting), D.5 (Permission Layers in security), E.1 (seen_jobs path fix in data-architecture).

- [ ] **Step 1: Add Skill Frontmatter Schema section to cross-cutting-concerns.md**

Run: `grep -n "^## " docs/architecture/cross-cutting-concerns.md`
Expected: list of current sections.

Append a new section at the end. Use `Edit` — append after the last section. (The exact `old_string` is the last paragraph of the file; read it first.)

Append:

```markdown

## Skill Frontmatter Schema (ARCH-0010)

Every `SKILL.md` file across both skill planes (ARCH-0008) carries mandatory YAML frontmatter at the top of the file:

```yaml
---
name: <kebab-case-skill-name>
description: <one-line summary; first sentence describes the skill purpose; trigger keywords are listed at the end of the line, including slash-prefixed entries like `/scrape`>
allowed-tools: <comma-separated tool list — Read, Edit, Bash, WebFetch, etc.>
---
```

**Field semantics:**

- `name` — Must match the directory name (`.claude/skills/<name>/SKILL.md`). Used by the runtime for explicit invocation (e.g., `Skill(<name>)` in `settings.local.json` permissions).
- `description` — First sentence is the human summary. The end of the line lists trigger phrases the runtime matches against user input. Slash-prefixed names like `/scrape` are valid trigger phrases.
- `allowed-tools` — The exhaustive list of tools this skill may invoke. Per NFR-0018, the runtime denies any tool call outside this list. Tools include: `Read`, `Edit`, `Write`, `Glob`, `Grep`, `Bash`, `WebFetch`, `WebSearch`, `Agent`, `AskUserQuestion`, `Skill(<other-skill-name>)`, plus any other names exposed by the runtime.

**Plane 1 vs. Plane 2 differences:**

- Plane 1 skills (Claude Code, `.claude/skills/<name>/SKILL.md`) — frontmatter is the only declaration; companion files (numbered `01-…`, `02-…`) are referenced in the body but do not have their own frontmatter.
- Plane 2 skills (sub-agent CLI, `.agents/skills/<name>/SKILL.md`) — frontmatter still mandatory; the skill also has a `cli/` subdirectory with `package.json` (Bun) and TypeScript source. The frontmatter `allowed-tools` covers the SKILL-level tools (e.g., `Bash` to invoke the CLI); per-tool permissions inside the CLI process are governed by the CLI's own configuration.

**Frontmatter validation** (where applicable):

- Missing `name` or `description` → skill is not loadable
- Missing `allowed-tools` → skill defaults to an empty list (effectively unusable); the loader should error rather than silently allowing all
- Unknown tools in `allowed-tools` → ignored with a warning
```

- [ ] **Step 2: Add Permission Layers section to security-architecture.md**

Run: `grep -n "^## " docs/architecture/security-architecture.md`
Expected: list of current sections.

Append a new section at the end:

```markdown

## Permission Layers (NFR-0018)

CareerForge enforces tool permissions at two composing layers. A tool call succeeds **if and only if both layers permit it.**

### Layer 1 — Skill-scoped `allowed-tools` (ARCH-0010)

Every `SKILL.md` lists its required tools in frontmatter:

```yaml
allowed-tools: Read, Edit, WebFetch, AskUserQuestion
```

This is the skill's *upper bound* — the skill cannot exceed it. The runtime rejects any tool call from inside the skill that isn't in this list.

### Layer 2 — Workspace `.claude/settings.local.json` (REQ-6002)

A single workspace-level file declares which tools the AI assistant is permitted to use in this workspace:

```json
{
  "permissions": {
    "allow": [
      "Skill(job-application-assistant)",
      "Bash(python3:*)",
      "Bash(python:*)",
      "Bash(bun:*)",
      "Read",
      "Edit",
      "WebFetch"
    ]
  }
}
```

The workspace settings act as a *workspace-wide allow-list*. Per-command patterns like `Bash(python3:*)` allow execution of `python3` with any arguments but deny other Bash invocations.

### Composition rule

```
tool_call.allowed iff
    tool_call IN skill.frontmatter.allowed_tools
  AND tool_call MATCHES some pattern in settings.local.json.permissions.allow
```

A skill can have a permissive `allowed-tools` list but be restricted by the workspace settings, or vice versa. Both layers must agree.

### Plane 2 (sub-agent CLI) handling

For sub-agent skills (Plane 2 per ARCH-0008), the AI assistant invokes the CLI via `Bash` — so the assistant's invocation is gated by the two layers above. Inside the CLI process, further permission management (e.g., network access) is the CLI's own concern.

### Template + fork model

The framework ships `.claude/settings.local.json.template` with the minimum permissions needed by all bundled skills (REQ-6002 acceptance). User forks copy this to `.claude/settings.local.json` (gitignored) and customize.
```

- [ ] **Step 3: Fix seen_jobs.json path in data-architecture.md**

Run: `grep -n "settings/seen_jobs" docs/architecture/data-architecture.md`
Expected: at least one match (the drift to fix).

Use `Edit` with `replace_all`:

Look at the actual occurrences:
Run: `grep "settings/seen_jobs" docs/architecture/data-architecture.md`

For each occurrence, use `Edit` (without `replace_all` since the surrounding context may differ). Most likely paths:

`old_string`:
```
settings/seen_jobs.json
```

`new_string`:
```
job_scraper/seen_jobs.json
```

Apply with `replace_all: true` if all occurrences are identical.

- [ ] **Step 4: Verify path fix**

Run: `grep "settings/seen_jobs" docs/architecture/data-architecture.md`
Expected: zero matches.

Run: `grep "job_scraper/seen_jobs" docs/architecture/data-architecture.md`
Expected: at least one match.

- [ ] **Step 5: Commit**

Run:
```bash
git add docs/architecture/cross-cutting-concerns.md docs/architecture/security-architecture.md docs/architecture/data-architecture.md
git commit -m "docs: add SKILL.md frontmatter schema + Permission Layers; fix seen_jobs.json path"
```

---

## Task 13: Update integrations-and-dependencies.md + technology-stack.md

**Files:**
- Modify: `docs/requirements/integrations-and-dependencies.md`
- Modify: `docs/architecture/technology-stack.md`

**Spec sections covered:** A.7 (§7 dashboard mention), D.6 (§1 settings paragraph), E.2 (salary path).

- [ ] **Step 1: Fix salary_lookup.py path in technology-stack.md**

Run: `grep -n "tools/salary_lookup\|salary_lookup.py" docs/architecture/technology-stack.md`

Use `Edit` to ensure the reference is `salary_lookup.py` (repo root), not `tools/salary_lookup.py`:

`old_string`:
```
- `salary_lookup.py` — CLI tool for company salary lookup
- `tools/convert_salary_excel.py` — Excel-to-JSON converter
```

`new_string`:
```
- `salary_lookup.py` (at repo root) — CLI tool for company salary lookup
- `tools/convert_salary_excel.py` — Excel-to-JSON converter
- `tools/README_SALARY_TOOL.md` — Setup and data-format documentation
```

- [ ] **Step 2: Strengthen `integrations-and-dependencies.md §1` for settings file**

Use `Edit`:

`old_string`:
```
**Configuration:** Settings file controls which tools each skill can access. Example permissions: file operations, Python execution, web access, sub-agent spawning.
```

`new_string`:
```
**Configuration:** Workspace permissions live in `.claude/settings.local.json` (REQ-6002). The schema is `{"permissions": {"allow": ["Skill(<name>)", "Bash(<cmd>:*)", "Read", ...]}}`. The framework ships `.claude/settings.local.json.template` with the minimum permissions needed by all bundled skills; user forks copy to `.claude/settings.local.json` (gitignored) and customize. Per-skill upper bounds are declared in each `SKILL.md` frontmatter `allowed-tools:` field (ARCH-0010). A tool call succeeds iff both the workspace settings and the skill's `allowed-tools` permit it (NFR-0018; see `architecture/security-architecture.md §Permission Layers`).
```

- [ ] **Step 3: Update §6 (Python Runtime) for correct salary path**

Use `Edit`:

`old_string`:
```
**Components:**
- `salary_lookup.py` — Company salary lookup with fuzzy matching
- `tools/convert_salary_excel.py` — Excel-to-JSON conversion (requires openpyxl)
```

`new_string`:
```
**Components:**
- `salary_lookup.py` (at repo root) — Company salary lookup with fuzzy matching
- `tools/convert_salary_excel.py` — Excel-to-JSON conversion (requires openpyxl)
- `tools/README_SALARY_TOOL.md` — Setup and data-format documentation
```

- [ ] **Step 4: Verify §7 mentions the dashboard (or update if not)**

Run: `grep -A 3 "## 7\." docs/requirements/integrations-and-dependencies.md | head -10`

If the section doesn't mention the dashboard yet, use `Edit` to update the section title and add a paragraph. (If it was updated in an earlier round, skip.)

If the title currently reads "Job Portal CLI Adapters", use `Edit`:

`old_string`:
```
## 7. Job Portal CLI Adapters
```

`new_string`:
```
## 7. Bun-Based Local Tools (Portal Adapters + Tracking Dashboard)
```

Then add a paragraph after the existing portal-adapter content:

`old_string`:
```
**Note:** The initial implementation includes adapters for specific job markets. Users in other markets can build equivalent adapters following the same pattern.
```

`new_string`:
```
**Note:** The initial implementation includes adapters for specific job markets. Users in other markets can build equivalent adapters following the same pattern.

**Second consumer of Bun:** The tracking dashboard (REQ-5xxx) is the second consumer of the Bun runtime. It uses Bun's built-in HTTP server plus Hono, with vendored HTMX and Pico.css for the UI. The Bun version floor is the higher of the two consumers' requirements (currently Bun ≥ 1.1 for the dashboard per ADR-0005).
```

- [ ] **Step 5: Update the Dependency Summary table for Bun**

Use `Edit`:

`old_string`:
```
| Bun | Optional | Job portal CLI adapters | Web search used directly |
```

`new_string`:
```
| Bun | Optional (required if portal adapters or dashboard are used) | Job portal CLI adapters AND tracking dashboard (REQ-5xxx) | Web search used directly when adapters are absent; CSV-only tracker when dashboard is absent |
```

- [ ] **Step 6: Verify all updates**

Run: `grep "salary_lookup.py" docs/architecture/technology-stack.md | head -2`
Expected: at least one line containing "(at repo root)".

Run: `grep "tracking dashboard\|REQ-5xxx" docs/requirements/integrations-and-dependencies.md | wc -l`
Expected: at least 2 (one in §1, one in §7, plus Dependency Summary).

- [ ] **Step 7: Commit**

Run:
```bash
git add docs/architecture/technology-stack.md docs/requirements/integrations-and-dependencies.md
git commit -m "docs: fix salary_lookup.py path (repo root); strengthen settings file integration; broaden §7 to include dashboard"
```

---

## Task 14: Rewrite `implementation-guide-job-search.md §5`

**Files:**
- Modify: `docs/development/implementation-guide-job-search.md`

**Spec sections covered:** C.1 (entire §5 rewrite + filename references).

- [ ] **Step 1: Read the current §5**

Run: `grep -n "^## 5\." docs/development/implementation-guide-job-search.md`
Expected: shows line number.

Run: `sed -n '70,95p' docs/development/implementation-guide-job-search.md` (or use Read tool on the file)
Expected: shows current §5 content with `Date,Company,Title,URL,FitScore,Status,CV_Path,CL_Path` and statuses `Generated/Applied/Interviewing/Rejected/Offered`.

- [ ] **Step 2: Replace the §5 body**

Use `Edit`:

`old_string`:
```
## 5. Application Tracker Log (`tracker.csv`)

When a user initiates `/apply` for a job, the system appends a new record to `settings/tracker.csv`.

### CSV Columns
```csv
Date,Company,Title,URL,FitScore,Status,CV_Path,CL_Path
```

- **Date**: ISO-8601 formatted date (e.g., `2026-06-05`).
- **Status Options**: `Generated`, `Applied`, `Interviewing`, `Rejected`, `Offered`.
- **Paths**: Relative file paths to the compiled output PDFs.
- Developers can update tracking statuses using the `/apply --status "Applied" --url <URL>` CLI interface.
```

`new_string`:
```
## 5. Application Tracker Log

The tracker is the canonical CSV record of every application. The schema, status enum, and file lifecycle are normative in:

- **Schema:** `docs/requirements/data-requirements.md §11` — column list, types, mutability, migration
- **Status enum + transitions:** `docs/requirements/business-rules-and-validation.md §9`
- **Append/edit contract:** `docs/architecture/data-architecture.md §Consistency Rules` — `/apply` appends; the dashboard (REQ-5xxx) edits `status`, `notes`, `last_updated` only

This implementation guide intentionally does not duplicate the schema — see the canonical sources above. The canonical filename is `job_search_tracker.csv` at the repo root.
```

- [ ] **Step 3: Replace any remaining `settings/tracker.csv` references**

Run: `grep "settings/tracker.csv" docs/development/implementation-guide-job-search.md`

If any matches remain, use `Edit` with `replace_all: true`:

`old_string`: `settings/tracker.csv`
`new_string`: `job_search_tracker.csv`

- [ ] **Step 4: Verify**

Run: `grep -c "settings/tracker" docs/development/implementation-guide-job-search.md`
Expected: `0`

Run: `grep -c "job_search_tracker" docs/development/implementation-guide-job-search.md`
Expected: ≥ 1

Run: `grep "Generated\|Applied\|Interviewing\|Rejected\|Offered" docs/development/implementation-guide-job-search.md | wc -l`
Expected: `0` (no stale enum)

- [ ] **Step 5: Commit**

Run:
```bash
git add docs/development/implementation-guide-job-search.md
git commit -m "docs: rewrite implementation-guide-job-search §5 (point at canonical tracker schema; fix filename)"
```

---

## Task 15: Reframe `product-overview.md §Differentiation` + add success metric #7

**Files:**
- Modify: `docs/requirements/product-overview.md`

**Spec sections covered:** G.1 (Differentiation reframe + DEC-018 reference + success metric).

- [ ] **Step 1: Read the current Differentiation section**

Run: `grep -n "## Differentiation" docs/requirements/product-overview.md`
Expected: shows line number.

- [ ] **Step 2: Reframe with Parity Baseline subsection**

Use `Edit`:

`old_string`:
```
## Differentiation vs. Reference Product

CareerForge is studied against [`MadsLorentzen/ai-job-search`](https://github.com/MadsLorentzen/ai-job-search) (MIT) — see `.reference/competitive-analysis/madslorentzen-ai-job-search.md`. The intentional deltas are:

1. **Country-agnostic core.** Portal adapters are plugins implementing a generic provider interface (ARCH-0004 / ADR-0004). Locale concerns are configurable, not hardcoded.
2. **First-class tracking dashboard.** A local web UI over the same append-only CSV (REQ-5xxx). The reference product has CSV only.
3. **Cost-aware reviewer.** Reviewer agent is opt-out per application (or per-section), not mandatory.
4. **Layout-fix memory.** Persist LaTeX layout-fix patterns per template to reduce token spend on iteration.
5. **Manual-paste flow as first-class.** Documented fallback when portals block scrapers, not a footnote.
```

`new_string`:
```
## Differentiation vs. Reference Product

CareerForge is studied against [`MadsLorentzen/ai-job-search`](https://github.com/MadsLorentzen/ai-job-search) (MIT) — see `.reference/competitive-analysis/madslorentzen-ai-job-search.md`. CareerForge's positioning is **"parity baseline + 5 deltas"** per DEC-018 — not just deltas.

### Parity Baseline (table stakes)

CareerForge ships ALL four of the reference product's headline differentiators. These are NOT optional, NOT subtractive, and NOT marketing — they are the reason users pick this category of tool over manual workflows.

| # | Reference differentiator | CareerForge REQ coverage |
|---|--------------------------|--------------------------|
| 1 | **PDF verification loop** (compile-and-inspect every application) | REQ-2050, REQ-2051, REQ-2052, REQ-2053 |
| 2 | **Relevance-weighted CV cutting** (score-based, not section-based) | business-rules §2.2 ("Relevance-Weighted Cutting Algorithm") |
| 3 | **Drafter-reviewer separation** (two agents, fresh contexts) | REQ-2030, REQ-2031, REQ-2032, REQ-2040, REQ-2041, REQ-2042 |
| 4 | **Token-efficient reviewer dispatch** (inline drafts; verification runs once at end) | REQ-2024, REQ-2031 (inline drafts), DEC-006 (single verification) |

### Our Deltas (on top of the parity baseline)

CareerForge's five named differentiators are deltas ON TOP of the parity baseline.

1. **Country-agnostic core.** Portal adapters are plugins implementing a generic provider interface (ADR-0004 / DEC-012). Locale concerns are configurable, not hardcoded.
2. **First-class tracking dashboard.** A local web UI over the same append-only CSV (REQ-5000–REQ-5008, ADR-0005, DEC-019). The reference product has CSV only.
3. **Cost-aware reviewer.** Reviewer agent is opt-out per application via `--review=full|quick|none` (REQ-2034, DEC-009), not mandatory.
4. **Layout-fix memory.** Persist LaTeX layout-fix patterns per template (REQ-2055, DEC-010) to reduce token spend on iteration.
5. **Manual-paste flow as first-class.** Documented as equal-priority input alongside URL fetch (REQ-2001, REQ-1004, DEC-011), not a footnote or fallback.
```

- [ ] **Step 3: Add Success Metric #7**

Use `Edit`:

`old_string`:
```
6. **Tracking visibility:** Users can review their full application pipeline (status counts, fit-filtered active list, generated CV/cover-letter links) in the dashboard in under 5 seconds from launch.
```

`new_string`:
```
6. **Tracking visibility:** Users can review their full application pipeline (status counts, fit-filtered active list, generated CV/cover-letter links) in the dashboard in under 5 seconds from launch.
7. **Parity confidence:** A reader of `/docs` can produce a feature-by-feature mapping where every reference differentiator maps to a CareerForge REQ + ACR pair. No reference differentiator is unaccounted for. (See DEC-018 and the Parity Baseline table above.)
```

- [ ] **Step 4: Verify**

Run: `grep "Parity Baseline" docs/requirements/product-overview.md`
Expected: at least one match.

Run: `grep "REQ-2050, REQ-2051" docs/requirements/product-overview.md`
Expected: at least one match (the table row).

Run: `grep "^7\. \*\*Parity confidence" docs/requirements/product-overview.md`
Expected: line is present.

- [ ] **Step 5: Commit**

Run:
```bash
git add docs/requirements/product-overview.md
git commit -m "docs: reframe §Differentiation as parity baseline + 5 deltas (DEC-018); add success metric #7"
```

---

## Task 16: Update `traceability-matrix.md` (REQ-6xxx rows + DEC table)

**Files:**
- Modify: `docs/architecture/traceability-matrix.md`

**Spec sections covered:** §6.1 (Traceability matrix new rows).

- [ ] **Step 1: Add REQ-6xxx rows**

The traceability matrix has per-feature-area tables. Add a new "Framework Meta (REQ-6xxx)" table after the Tracking Dashboard table.

Run: `grep -n "### Tracking Dashboard" docs/architecture/traceability-matrix.md`
Expected: shows the line number of the dashboard section header.

Use `Edit` to append a new table after the Tracking Dashboard table:

`old_string`:
```
| REQ-5008 No Telemetry | ARCH-0060 Tracking Dashboard | Bundled Assets, Loopback Bind | Verified by ARCH-0005 + NFR-0017 |
```

`new_string`:
```
| REQ-5008 No Telemetry | ARCH-0060 Tracking Dashboard | Bundled Assets, Loopback Bind | Verified by ARCH-0005 + NFR-0017 |

### Framework Meta (REQ-6xxx)

| Requirement | Architecture Element | Component | Notes |
|-------------|---------------------|-----------|-------|
| REQ-6001 Configurable Research Agent Model | ARCH-0009 Named Sub-Agent Definitions | Agent Loader | DEC-015; multi-model fallback per NFR-0009 |
| REQ-6002 Workspace Permission Configuration | Security Architecture / Permission Layers | settings.local.json | NFR-0018; template + fork model |
| REQ-6003 Quick Sub-Commands | ARCH-0010 SKILL.md Frontmatter Orchestrator | job-application-assistant Skill | DEC-014; respects review mode (REQ-2034) |
```

- [ ] **Step 2: Add REQ-2034, REQ-2055 rows in Application Pipeline section**

Find the existing Application Pipeline table (REQ-2xxx). Use `Edit` to append rows:

`old_string`:
```
| REQ-2060–2062 Presentation | ARCH-0030 Application Pipeline | Final Verifier | Checklist + summary |
```

`new_string`:
```
| REQ-2060–2062 Presentation | ARCH-0030 Application Pipeline | Final Verifier | Checklist + summary |
| REQ-2034 Reviewer Opt-Out | ARCH-0030 Application Pipeline / Reviewer Dispatcher | Reviewer Dispatcher | ADR-0002 + DEC-009; `--review=full\|quick\|none` |
| REQ-2055 Layout Fix Memory | ARCH-0030 Application Pipeline / Compilation Verifier | Compilation Verifier | ADR-0003 + DEC-010; `.agents/state/layout-fixes.json` |
```

- [ ] **Step 3: Add NFR-0018 to NFR table**

Use `Edit`:

`old_string`:
```
| NFR-0017 Local-Only Network Surface | ARCH-0060 Tracking Dashboard (Loopback Bind, Bundled Assets), Security Architecture | ADR-0005 |
```

`new_string`:
```
| NFR-0017 Local-Only Network Surface | ARCH-0060 Tracking Dashboard (Loopback Bind, Bundled Assets), Security Architecture | ADR-0005 |
| NFR-0018 Skill-Scoped Tool Permissions | ARCH-0010 SKILL.md + Security Architecture / Permission Layers | DEC-014, REQ-6002 |
```

- [ ] **Step 4: Add new ARCH principles to the architecture principles list**

Add ARCH-0008, ARCH-0009, ARCH-0010 to the principles section if it exists, or to the architecture overview row in the matrix.

Run: `grep -n "ARCH-0007\|^## Architecture" docs/architecture/traceability-matrix.md`

Use `Edit` to add (likely as a separate "Architecture Principles" cross-reference section at the top):

`old_string`:
```
## Architecture Decision Records Traceability
```

`new_string`:
```
## Architecture Principles Traceability

| Principle | Defined In | Key Requirements / DECs It Supports |
|-----------|------------|--------------------------------------|
| ARCH-0001 Prompt-as-Code | architecture-overview.md | All REQ docs (workflow lives in Markdown) |
| ARCH-0002 Skill Composition | architecture-overview.md | DEC-013, ARCH-0008 |
| ARCH-0003 Agent Isolation | architecture-overview.md | REQ-2030, ADR-0002 |
| ARCH-0004 File-as-DB | architecture-overview.md | ADR-0001, NFR-0011 |
| ARCH-0005 Graceful Degradation | architecture-overview.md | NFR-0009 |
| ARCH-0006 Human-in-the-Loop | architecture-overview.md | REQ-2013 |
| ARCH-0007 No Fabrication | architecture-overview.md | REQ-2023, REQ-2042 |
| ARCH-0008 Two-Plane Skill Architecture | architecture-overview.md | DEC-013, NFR-0007 (extensibility) |
| ARCH-0009 Named Sub-Agent Definitions | architecture-overview.md | REQ-6001, DEC-015 |
| ARCH-0010 SKILL.md Frontmatter Orchestrator | architecture-overview.md | REQ-6003, NFR-0018, DEC-014 |

## Architecture Decision Records Traceability
```

- [ ] **Step 5: Add/extend the DEC table**

Append at the end of the file:

`old_string`:
```
| ADR-0005 Tracking Dashboard Stack | REQ-5000–5008, NFR-0014, NFR-0015, NFR-0016, NFR-0017 |
```

`new_string`:
```
| ADR-0005 Tracking Dashboard Stack | REQ-5000–5008, NFR-0014, NFR-0015, NFR-0016, NFR-0017 |

## Decisions (DEC) Traceability

| DEC | Decision | Enables / Supports |
|-----|----------|--------------------|
| DEC-001 | Three convergent onboarding paths | REQ-0001, REQ-0013, REQ-0014, REQ-0016 |
| DEC-002 | Drafter-reviewer agent architecture | REQ-2030, REQ-2031, REQ-2032, ADR-0002 |
| DEC-003 | Mandatory PDF verification | REQ-2050–2054, NFR-0008 |
| DEC-004 | Relevance-weighted cutting | business-rules §2.2 |
| DEC-005 | Token-efficient reviewer dispatch | REQ-2024, REQ-2031 |
| DEC-006 | Single verification pass | REQ-2060 |
| DEC-007 | Additive-only expansion | REQ-0054 |
| DEC-008 | BYO salary data | REQ-4001 |
| DEC-009 | Reviewer opt-out per application | REQ-2034, REQ-2030 |
| DEC-010 | Persist layout fixes per template | REQ-2055, REQ-2053 |
| DEC-011 | Manual paste is first-class | REQ-2001, REQ-1004 |
| DEC-012 | Country-agnostic search core | REQ-1003, NFR-0007 |
| DEC-013 | Two-plane skill architecture | ARCH-0008 |
| DEC-014 | SKILL.md canonical orchestrator | ARCH-0010, REQ-6003, NFR-0018 |
| DEC-015 | Multi-model for research | REQ-6001, ARCH-0009 |
| DEC-016 | STAR stubs load-bearing in Path A | REQ-0012 |
| DEC-017 | AI tooling by name | business-rules §4.4, REQ-2021 |
| DEC-018 | Parity baseline + differentiators | product-overview §Differentiation |
| DEC-019 | Local tracking dashboard (retrospective) | REQ-5000–5008, ADR-0005 |
```

- [ ] **Step 6: Verify all additions**

Run: `grep "^| REQ-6001\|^| REQ-6002\|^| REQ-6003" docs/architecture/traceability-matrix.md`
Expected: all three lines.

Run: `grep "^| REQ-2034\|^| REQ-2055" docs/architecture/traceability-matrix.md`
Expected: both lines.

Run: `grep "^| NFR-0018" docs/architecture/traceability-matrix.md`
Expected: line is present.

Run: `grep "^| DEC-01[3-9]\|^| DEC-018" docs/architecture/traceability-matrix.md`
Expected: 7 lines (DEC-013 through DEC-019).

Run: `grep "^| ARCH-0008\|^| ARCH-0009\|^| ARCH-0010" docs/architecture/traceability-matrix.md`
Expected: all three lines.

- [ ] **Step 7: Commit**

Run:
```bash
git add docs/architecture/traceability-matrix.md
git commit -m "docs: extend traceability matrix (REQ-2034/2055/6001/6002/6003, NFR-0018, ARCH-0008/0009/0010, DEC-013..019)"
```

---

## Task 17: Final verification — run all 41 acceptance criteria from spec §7

**Files:**
- No file edits — verification only.

**Spec sections covered:** All 41 acceptance criteria from spec §7.

- [ ] **Step 1: Run Section A grep checks**

Run:
```bash
echo "A1 — no 'No GUI is required':"
grep -ri "No GUI is required" docs/ | wc -l
# Expected: 0

echo "A2 — OQ-003 status Partially Resolved:"
grep -A 1 "^### OQ-003" docs/requirements/assumptions-decisions-questions.md | grep -c "Partially Resolved"
# Expected: 1

echo "A3 — REQ-1009 mentions last_updated:"
grep -A 4 "^### REQ-1009" docs/requirements/functional-requirements-job-search.md | grep -c "last_updated"
# Expected: ≥ 1

echo "A4 — Persona 1 has dashboard task:"
grep "Review pipeline" docs/requirements/personas-and-actors.md | wc -l
# Expected: 1

echo "A5 — Actor matrix has tracking dashboard row:"
grep "Use tracking dashboard" docs/requirements/personas-and-actors.md | wc -l
# Expected: 1

echo "A6 — glossary has 5 dashboard terms:"
grep -c "^\*\*\(Application Status Enum\|Atomic CSV Write\|Pipeline KPI\|Read-Only Mode\|Tracking Dashboard\)\*\*" docs/glossary.md
# Expected: 5

echo "A7 — integrations §7 mentions the dashboard:"
grep -A 10 "^## 7\." docs/requirements/integrations-and-dependencies.md | grep -c "dashboard"
# Expected: ≥ 1

echo "A8 — DEC-019 exists:"
grep -c "^### DEC-019" docs/requirements/assumptions-decisions-questions.md
# Expected: 1
```

- [ ] **Step 2: Run Section B grep checks**

Run:
```bash
echo "B1 — DEC-009..012 exist:"
grep -c "^### DEC-009\|^### DEC-010\|^### DEC-011\|^### DEC-012" docs/requirements/assumptions-decisions-questions.md
# Expected: 4

echo "B2 — REQ-2034 + REQ-2055 exist:"
grep -c "^### REQ-2034\|^### REQ-2055" docs/requirements/functional-requirements-application.md
# Expected: 2

echo "B3 — data-requirements §13 Layout Fix Cache exists:"
grep -c "^## 13\. Layout Fix Cache" docs/requirements/data-requirements.md
# Expected: 1
```

- [ ] **Step 3: Run Section C grep checks**

Run:
```bash
echo "C1 — settings/tracker.csv removed everywhere:"
grep -r "settings/tracker.csv" docs/ | wc -l
# Expected: 0

echo "C2 — impl-guide §5 doesn't duplicate the schema:"
grep "Date,Company,Title,URL,FitScore" docs/development/implementation-guide-job-search.md | wc -l
# Expected: 0

echo "C3 — impl-guide §5 references canonical sources:"
grep -A 5 "^## 5\. Application Tracker Log" docs/development/implementation-guide-job-search.md | grep -c "data-requirements.md §11"
# Expected: 1
```

- [ ] **Step 4: Run Section D grep checks**

Run:
```bash
echo "D1 — ARCH-0008/0009/0010 principles exist:"
grep -c "^### ARCH-0008\|^### ARCH-0009\|^### ARCH-0010" docs/architecture/architecture-overview.md
# Expected: 3

echo "D2 — DEC-013/014/015 exist:"
grep -c "^### DEC-013\|^### DEC-014\|^### DEC-015" docs/requirements/assumptions-decisions-questions.md
# Expected: 3

echo "D3 — REQ-6001 exists:"
grep -c "^### REQ-6001" docs/requirements/functional-requirements-framework-meta.md
# Expected: 1

echo "D4 — REQ-6002 exists:"
grep -c "^### REQ-6002" docs/requirements/functional-requirements-framework-meta.md
# Expected: 1

echo "D5 — NFR-0018 exists:"
grep -c "^## NFR-0018" docs/requirements/non-functional-requirements.md
# Expected: 1

echo "D6 — Persona 4 references ARCH-0009 / REQ-6001:"
grep -A 10 "^## Persona 4" docs/requirements/personas-and-actors.md | grep -c "ARCH-0009\|REQ-6001"
# Expected: ≥ 1

echo "D7 — glossary has 5 architecture terms:"
grep -c "^\*\*\(Allowed-Tools\|Named Sub-Agent\|SKILL\.md Orchestrator\|Two-Plane Skill Architecture\|Workspace Settings\)\*\*" docs/glossary.md
# Expected: 5

echo "D8 — cross-cutting-concerns has SKILL.md frontmatter schema:"
grep -c "Skill Frontmatter Schema" docs/architecture/cross-cutting-concerns.md
# Expected: 1

echo "D9 — security-architecture has Permission Layers:"
grep -c "Permission Layers" docs/architecture/security-architecture.md
# Expected: 1

echo "D10 — /scrape and /upskill described as skills not commands:"
grep -A 3 "^### REQ-1001" docs/requirements/functional-requirements-job-search.md | grep -c "skill invocation\|job-scraper skill"
# Expected: ≥ 1
grep -A 3 "^### REQ-3001" docs/requirements/functional-requirements-career-development.md | grep -c "upskill skill\|ARCH-0008"
# Expected: ≥ 1

echo "D11 — no remaining settings/seen_jobs references:"
grep -r "settings/seen_jobs" docs/ | wc -l
# Expected: 0
```

- [ ] **Step 5: Run Section E grep checks**

Run:
```bash
echo "E1 — job_scraper/seen_jobs.json path in data-architecture:"
grep -c "job_scraper/seen_jobs" docs/architecture/data-architecture.md
# Expected: ≥ 1

echo "E2 — salary_lookup.py at repo root noted:"
grep "salary_lookup.py.*repo root" docs/architecture/technology-stack.md docs/requirements/integrations-and-dependencies.md | wc -l
# Expected: ≥ 2

echo "E3 — data-requirements §14 Search Queries Configuration:"
grep -c "^## 14\. Search Queries Configuration" docs/requirements/data-requirements.md
# Expected: 1

echo "E4 — data-requirements §15 Past Application Records:"
grep -c "^## 15\. Past Application Records" docs/requirements/data-requirements.md
# Expected: 1

echo "E5 — data-requirements §1.5 + §1.6 exist:"
grep -c "^## 1\.5 CLAUDE.md Roles\|^## 1\.6 Candidate-Profile Template Schema" docs/requirements/data-requirements.md
# Expected: 2
```

- [ ] **Step 6: Run Section F grep checks**

Run:
```bash
echo "F1 — REQ-0001 enumerates --section values:"
grep -A 15 "^### REQ-0001" docs/requirements/functional-requirements-onboarding.md | grep -cE "^- +\`(search|skills|experience|behavioral|goals|references)\`"
# Expected: 6

echo "F2 — REQ-0012 priority is Should:"
grep -A 1 "^### REQ-0012" docs/requirements/functional-requirements-onboarding.md | grep "Priority"
# Expected: line contains "Should"

echo "F3 — DEC-016 exists:"
grep -c "^### DEC-016" docs/requirements/assumptions-decisions-questions.md
# Expected: 1

echo "F4 — DEC-017 exists:"
grep -c "^### DEC-017" docs/requirements/assumptions-decisions-questions.md
# Expected: 1

echo "F5 — business-rules §4.4 Tool Naming exists:"
grep -c "^### 4\.4 Tool Naming" docs/requirements/business-rules-and-validation.md
# Expected: 1

echo "F6 — REQ-2021 includes tool-naming rule:"
grep -A 10 "^### REQ-2021" docs/requirements/functional-requirements-application.md | grep -c "tool by name\|DEC-017\|§4\.4"
# Expected: ≥ 1

echo "F7 — REQ-6003 Quick Sub-Commands exists:"
grep -c "^### REQ-6003" docs/requirements/functional-requirements-framework-meta.md
# Expected: 1
```

- [ ] **Step 7: Run Section G grep checks**

Run:
```bash
echo "G1 — DEC-018 exists:"
grep -c "^### DEC-018" docs/requirements/assumptions-decisions-questions.md
# Expected: 1

echo "G2 — product-overview has Parity Baseline subsection:"
grep -c "### Parity Baseline" docs/requirements/product-overview.md
# Expected: 1

echo "G3 — product-overview Success Metric #7:"
grep -c "^7\. \*\*Parity confidence" docs/requirements/product-overview.md
# Expected: 1
```

- [ ] **Step 8: Run Cross-cutting grep checks**

Run:
```bash
echo "X1 — traceability matrix has REQ-6xxx rows:"
grep -c "^| REQ-6001\|^| REQ-6002\|^| REQ-6003" docs/architecture/traceability-matrix.md
# Expected: 3

echo "X2 — traceability matrix has DEC-008..019 in DEC table:"
grep -cE "^\| DEC-(00[89]|01[0-9])" docs/architecture/traceability-matrix.md
# Expected: ≥ 12 (DEC-008 through DEC-019)
```

- [ ] **Step 9: Commit verification log**

Run:
```bash
git add -A
git status
```
Expected: no staged changes (verification doesn't modify files). If anything was inadvertently modified during verification, do `git restore .` and re-verify.

If any grep check fails, identify the gap and fix it before declaring the plan complete. Then commit:

```bash
git commit --allow-empty -m "docs: complete requirements update — all 41 acceptance criteria verified"
```

- [ ] **Step 10: Final summary print**

Run:
```bash
echo "=== Files touched ==="
git log --name-only --format= --since="1 hour ago" | sort -u | grep -v '^$'

echo "=== Commit count ==="
git log --oneline --since="1 hour ago" | wc -l
```

Expected: ~12 distinct files touched + this plan's spec; commit count matches the 16 tasks above (plus Task 0 init).

---

## Notes for the implementer

1. **No code changes.** This entire plan is documentation. If a step appears to require code, it's wrong — surface it as a deviation.

2. **Plan-deviations are explicit.** The spec named the dashboard retrospective DEC as "DEC-008", but the existing file already has DEC-008 (BYO Salary Data). The plan renumbers the dashboard retrospective to DEC-019 (see Task 1 Step 4 commentary). This is the only renumbering deviation from the spec.

3. **Tasks 5 and 6 use REQ rewordings that depend on Task 1's DECs existing.** Follow the task order.

4. **Task 16 is intentionally last in the editing phase** — every prior task adds something the traceability matrix references. If you change task order, the matrix may need redoing.

5. **Task 17 verification is the gate.** If any of the 41 acceptance criteria fails after Tasks 1–16, fix the gap in-place and re-run.

6. **Each task is one commit by design.** If a step requires emergency rollback, the task boundary is the safe restore point. Use `git reset --soft HEAD~1` only with explicit user approval.

7. **The `superpowers:verification-before-completion` skill should be invoked before claiming this plan complete.** That skill enforces evidence-before-assertions and will run the grep checks one more time independently.
