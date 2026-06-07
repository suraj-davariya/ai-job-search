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
