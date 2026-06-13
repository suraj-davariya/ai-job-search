# Testing — Test Plan: Onboarding

> **Purpose:** Test cases, assertions, and boundary checks for the profile onboarding command (`/setup`).
>
> **Status:** Draft
> **Last updated:** 2026-06-07
> **Owner persona:** QA Lead

---

## 1. Feature Under Test: `/setup`

`/setup` is a prompt-as-code command (ARCH-0001): the assistant reads the user's
documents and/or interview answers and **replaces the `[UPPER_SNAKE_CASE]`
placeholder tokens** across the Markdown profile files (file-as-DB, ARCH-0004).
There is no `settings/profile.json` and no compiled binary. The target files are
the `job-application-assistant` skill files (`01-candidate-profile.md`,
`02-behavioral-profile.md`, `04-job-evaluation.md`, `05-cv-templates.md`,
`07-interview-prep.md`), the user-fork `CLAUDE.md` (from `CLAUDE.md.template`),
and `.claude/skills/job-scraper/search-queries.md`.

Because there is no process to crash or interrupt, "recovery" is expressed
through **idempotent re-runs** (read-before-write + no duplicate proposals), not
through temp-file state.

---

## 2. Test Cases

### Path A: Document Folder Scan (REQ-0002–0012)
- **TC-ONB-001**: Verify that unsupported files in a `documents/` subfolder
  (e.g. `.zip`) are skipped and any unreadable file is flagged to the user
  rather than silently dropped or fabricated (REQ-0002, ARCH-0007).
- **TC-ONB-002**: Verify that conflicting dates for the same employer across
  sources are surfaced by the cross-reference check as a numbered item showing
  both values, and the user is prompted to resolve before any write (REQ-0008).
- **TC-ONB-003**: Verify that a successful scan replaces the identity, education,
  experience, and skills tokens in `01-candidate-profile.md` (and the mirror in
  the user-fork `CLAUDE.md`) with the extracted values — no `[UPPER_SNAKE_CASE]`
  token for populated fields remains (REQ-0003, REQ-0016).
- **TC-ONB-014**: Verify that behavioral items derived from inferred sources
  (LinkedIn about, reference letters) are written only to the "Inferred Items"
  section of `02-behavioral-profile.md` with the exact label
  `*[Inferred from <source> — review before relying on this]*`, and never
  overwrite scored assessments (REQ-0010).
- **TC-ONB-015**: Verify that achievements not covered by an existing STAR
  example produce stubs in `07-interview-prep.md` with empty S/T/A/R fields, and
  that no Situation/Task/Action/Result is fabricated (REQ-0012, ARCH-0007).

### Path B: Single CV Import (REQ-0013)
- **TC-ONB-004**: Verify that importing a single CV (pasted text or a referenced
  file) extracts all structured sections (experience, skills, education) into
  the candidate profile tokens.
- **TC-ONB-005**: Verify that when gaps are detected, the assistant asks targeted
  follow-up questions for what a CV omits (behavioral profile, career goals,
  deal-breakers, salary expectations, references) before generating files.
- **TC-ONB-006**: Verify that the follow-up answers merge into the profile files
  via the additive/conflicting engine without overwriting unrelated content.

### Path C: Interactive Interview (REQ-0014)
- **TC-ONB-007**: Verify that the interview walks the nine sections in REQ-0014
  order and that completing it populates the corresponding tokens across the
  profile files (Identity → … → Job Search Configuration).
- **TC-ONB-008**: Verify that re-running `/setup` after a partially completed
  interview reads the existing profile files first and proposes no duplicate
  changes for already-populated sections (idempotency — REQ-0002, §7.3).
- **TC-ONB-009**: Verify that optional sections (Publications/Awards, Behavioral
  Profile, References) can be skipped and their template blocks are removed or
  left empty rather than filled with invented data.

### Section-Level Re-Runs (REQ-0001)
- **TC-ONB-010**: Verify that `/setup --section skills` updates only the skills
  tokens in `01-candidate-profile.md` and `04-job-evaluation.md`, leaving all
  other sections unchanged.
- **TC-ONB-011**: Verify that an invalid section name (e.g. `--section invalid`)
  causes the assistant to list the valid section values and stop without writing.
- **TC-ONB-016**: Verify that `/setup --section search` regenerates
  `search-queries.md` (Priority 1–4 queries + location tiers) without touching
  any other profile file.

### Additive Merge & Validation (REQ-0009, business-rules §7)
- **TC-ONB-012**: Verify that merging duplicate skill names (e.g. `git` and
  `Git`) performs case-insensitive deduplication, keeping a single canonical
  form (union merge — §7.1, idempotent).
- **TC-ONB-013**: Verify that a missing required field (e.g. candidate Name)
  causes the assistant to ask the user rather than invent a value, and that the
  corresponding token is left in place until provided (ARCH-0007).
- **TC-ONB-017**: Verify that no file is written until the user explicitly
  confirms the proposed changes — additive changes as a grouped checklist,
  conflicting changes one at a time with keep/replace/manual (REQ-0009).
