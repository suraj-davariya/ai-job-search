# Epic 11 — `/upskill` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `/upskill` skill-gap workflow (REQ-3001–3011, ARCH-0040) and heal the
dashboard's broken "Run /upskill" link. Mirrors the `job-scraper` + `/search` shape: a
Plane-1 `career-development` skill holding the workflow, plus a thin `/upskill` command.

**Architecture:** Prompt-as-code (ARCH-0001). Plane-1 skill (ARCH-0008) under
`.claude/skills/career-development/`. No build step — verification is grep/trace checks.
Design: [`../specs/2026-06-17-epic-11-upskill-design.md`](../specs/2026-06-17-epic-11-upskill-design.md).

**Out of scope:** `/expand` (Epic 10), interview-prep roleplay (Epic 12), portal
adapters (Epic 12), any dashboard or demo-domain code change.

---

### Task 1: `career-development` Plane-1 skill

**Files:**
- Create: `.claude/skills/career-development/SKILL.md`
- Canonical: REQ-3001–3011, ARCH-0040, data-req §14

- [ ] **Step 1 — Frontmatter** (ARCH-0010 style): `name: career-development`;
  `description` ending with trigger keywords ("upskill", "skill gap", "what should I
  learn"); `allowed-tools: Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch`.
- [ ] **Step 2 — Body, one section per REQ:** mode/data-load (3001–3003), Pass 1 diff
  with the fit-weight formula (3004), Pass 2 synthesis tags (3005), heatmap columns
  (3006), learning plan with mandatory web search + no-fabrication (3007), study order
  (3008), report persistence filenames (3009), delta (3010), low-gap handling (3011).
- [ ] **Step 3 — Verify REQ coverage:** `grep -nE 'REQ-300[1-9]|REQ-3010|REQ-3011' .claude/skills/career-development/SKILL.md` → all 11 present.
- [ ] **Step 4 — Verify report filenames match data-req §14:** `grep -n 'report-' .claude/skills/career-development/SKILL.md` → both aggregate and targeted patterns present.
- [ ] **Step 5 — Verify no fabrication rule:** `grep -niE 'never fabricat|web search|ARCH-0007' SKILL.md` → present.
- [ ] **Step 6 — Commit** `feat(upskill): add career-development Plane-1 skill (Epic 11, T-090–T-096)`.

### Task 2: `/upskill` thin entry command

**Files:**
- Create: `.claude/commands/upskill.md`

- [ ] **Step 1** — Frontmatter: `description`, `argument-hint: "[job url | paste | (blank for aggregate)]"`, `allowed-tools` mirroring the skill.
- [ ] **Step 2** — Body: activate the `career-development` skill; document aggregate vs targeted modes (REQ-3001); note this is the command the dashboard console runs.
- [ ] **Step 3 — Verify** the command references the skill: `grep -n 'career-development' .claude/commands/upskill.md` → present.
- [ ] **Step 4 — Verify dashboard contract:** `grep -n 'upskill' dashboard/lib/run/allowlist.ts` still resolves to `/upskill` (no change needed; confirm only).
- [ ] **Step 5 — Commit** `feat(upskill): add /upskill entry command, heals dashboard link (Epic 11, T-090)`.

### Task 3: Reconcile requirements & data-req

**Files:**
- Modify: `docs/requirements/functional-requirements-career-development.md` (REQ-3001)
- Confirm (no change expected): `docs/requirements/data-requirements.md` §14

- [ ] **Step 1** — Rewrite REQ-3001's note: `/upskill` is a **command that activates the
  `career-development` Plane-1 skill** (mirrors `/search` → `job-scraper`), replacing the
  "not a standalone command" clause. Keep all acceptance criteria.
- [ ] **Step 2 — Verify:** `grep -n 'not a standalone command' docs/requirements/functional-requirements-career-development.md` → none.
- [ ] **Step 3 — Commit** `docs(upskill): reconcile REQ-3001 to command-activates-skill model (Epic 11)`.

### Task 4: README — promote `/upskill` to shipped

**Files:**
- Modify: `README.md`

- [ ] **Step 1** — Add a `### /upskill` section under "Commands in depth" (aggregate vs
  targeted, what you get, where reports land).
- [ ] **Step 2** — Remove the `/upskill` row from the "Planned commands" table; update the
  Roadmap v1.1 row to show `/upskill` shipped (and `/expand` still planned) — keep the
  status column honest.
- [ ] **Step 3 — Verify:** `grep -n '/upskill' README.md` shows it in the commands section, not the planned table.
- [ ] **Step 4 — Commit** `docs(readme): document /upskill, mark shipped in roadmap (Epic 11)`.

### Task 5: docs-site command page + nav

**Files:**
- Create: `docs-site/content/docs/commands/upskill.mdx`
- Modify: `docs-site/content/docs/commands/meta.json`

- [ ] **Step 1** — Write `upskill.mdx` in the mentor voice of `search.mdx`/`apply.mdx`:
  what a run looks like, aggregate vs targeted, the heatmap + learning plan + study order,
  where reports are saved, how the dashboard Upskill surface shows them. No
  self-congratulatory copy.
- [ ] **Step 2** — Add `"upskill"` to `meta.json` `pages` (after `apply`).
- [ ] **Step 3 — Verify build/parity:** run `vitest run` in `docs-site/` → green (parity
  test unaffected — no demo-domain change).
- [ ] **Step 4 — Commit** `docs(docs-site): add /upskill command page + nav (Epic 11)`.

---

## Self-Review

- **Spec coverage:** REQ-3001→T1/T2 modes · 3002/3003→T1 data load · 3004→T1 Pass1 ·
  3005→T1 Pass2 · 3006→T1 heatmap · 3007→T1 plan · 3008→T1 study order · 3009→T1
  persistence · 3010→T1 delta · 3011→T1 low-gap. REQ-3001 reconciled in T3.
- **Naming consistency:** skill `career-development`, command `/upskill`, report files
  `report-YYYY-MM-DD[-<co>-<role>].md` identical across T1/T3/T4/T5 and data-req §14.
- **Dashboard:** no code change; T2 Step 4 confirms the existing allowlist entry resolves.
- **No placeholders:** each task names exact files + a concrete verification.

## Out of scope

`/expand` (Epic 10), interview roleplay & portal adapters (Epic 12), dashboard/demo-domain
changes, CI gate (tracked separately as Phase C of this engagement).
