---
description: Clear your candidate data — profile, documents, or both — while preserving the framework. Destructive; requires typing RESET to confirm.
argument-hint: "[profile | documents | all]"
allowed-tools:
  - Read
  - Edit
  - Write
  - Glob
  - Grep
  - Bash
---

# /reset — Profile & Documents Reset

> **Spec:** `docs/requirements/functional-requirements-onboarding.md` (REQ-0080–0085)
> **Architecture:** ARCH-0010 (Profile Manager → Profile Resetter)

You are running the CareerForge reset workflow. Its job is to **remove the user's personal
data** so they can start over (a new career direction, handing the repo to someone else,
or clearing a test profile) — **without** destroying the framework that makes CareerForge
work. This is a **prompt-as-code** command (ARCH-0001) over file-as-DB Markdown (ARCH-0004).

`/reset` is the inverse of `/setup` and `/expand`: where they fill profile files, `/reset`
empties them back to their blank templates.

---

## Hard Invariants (apply to every step)

1. **Inventory before deletion (REQ-0081).** Never delete anything before showing the user
   exactly what will be cleared and what will be preserved.
2. **Explicit confirmation (REQ-0082).** The user must type exactly `RESET` (all caps).
   Any other input cancels and **nothing** is changed.
3. **Framework preservation (REQ-0083).** Reset removes candidate *values*, never the
   framework *structure*. The never-touch list below is absolute.
4. **Truthful reporting (ARCH-0007).** Report only what you actually changed. Never claim
   to have cleared a file that was already empty; list it as "already empty" instead.
5. **Cannot be undone.** Say so plainly before confirmation. There is no undo (the user's
   git history is their only recovery — mention it).
6. **Human-in-the-loop (ARCH-0006).** You inventory and execute; the user authorizes.

**Never touched by `/reset` (framework):**

| File | Why |
|------|-----|
| `03-writing-style.md` | Static framework rules |
| `04-job-evaluation.md` (framework) | Scoring framework structure (only candidate strong/weak *values* clear) |
| `05-cv-templates.md` (LaTeX structure) | Only `[PROFILE_STATEMENT_*]` values clear; class/structure preserved |
| `06-cover-letter-templates.md` | Static framework templates |
| `07-interview-prep.md` (framework) | STAR framework, tough questions, questions-to-ask, roleplay guidelines preserved; only STAR *examples* clear |
| `documents/README.md` | Folder guide |
| `cv/cfcv.cls`, `cover_letters/cfcl.cls`, fonts | LaTeX classes & assets |

---

## Step 0 — Scope Selection (REQ-0080)

Three scopes:

| Scope | Clears |
|-------|--------|
| `profile` | The skill profile files only (candidate data in `01`, `02`, `04` values, `05` profile statements, `07` STAR examples) and `search-queries.md` query/location values |
| `documents` | User files in `documents/` subfolders |
| `all` | Both of the above |

If no scope argument is given, **ask the user to choose**, describing what each affects.

---

## Step 1 — Pre-Reset Inventory (REQ-0081)

Before touching anything, build and show an inventory for the chosen scope:

- **Profile scope:** for each target file, state whether it **has candidate content** or
  is **already at template/empty state** (read each file to decide). Show the search-queries
  file too.
- **Documents scope:** `Glob` each subfolder (`cv/`, `linkedin/`, `diplomas/`,
  `references/`, `applications/`) and **list the files** found.
- **Always** print the **never-touch list** so the user sees what is preserved.
- If **all** target content for a scope is already empty, say so and **skip confirmation**
  for that scope (nothing to do).

---

## Step 2 — Explicit Confirmation (REQ-0082)

Warn clearly: **"This cannot be undone. Your git history is the only recovery."** Then ask
the user to type exactly `RESET`.

- Only the exact string `RESET` proceeds.
- Any other input → cancel and reply: **"Cancelled — nothing was changed."**

---

## Step 3 — Profile Reset Execution (REQ-0083)

For the `profile` (or `all`) scope, revert candidate **values** to the blank template while
preserving every framework comment, heading, and structural element:

- `01-candidate-profile.md`, `02-behavioral-profile.md` → restore the
  `[UPPER_SNAKE_CASE]` placeholder tokens / blank section headers; keep section structure
  and HTML comments.
- `04-job-evaluation.md` → clear the candidate's strong/moderate/weak skills, experience
  bands, career goals, and energizing/draining values; **keep** the scoring framework,
  weights, and verdict thresholds.
- `05-cv-templates.md` → clear `[PROFILE_STATEMENT_*]` values only; keep the LaTeX guide
  and structure.
- `07-interview-prep.md` → clear only the **Ready-Made STAR Examples** and **STAR
  Candidates (Stubs)** back to their `[STAR_*]` / `[STUB_*]` placeholders; **keep** the
  STAR framework, tough questions, questions-to-ask, phone/video tips, follow-up etiquette,
  and roleplay guidelines.
- `search-queries.md` → restore query and location-tier placeholder tokens.
- The user-fork `CLAUDE.md` profile values → revert to template if the user populated one.

Read each file before editing (read-before-write). Edit in place; never delete these files.

---

## Step 4 — Documents Reset Execution (REQ-0084)

For the `documents` (or `all`) scope:

- Delete user files in `documents/cv/`, `linkedin/`, `diplomas/`, `references/`, and
  `applications/` (the latter **recursively**, including per-application subfolders).
- **Preserve** the subfolder structure and `documents/README.md`. If a subfolder has a
  `.gitkeep`, keep it.
- Use `Bash` for deletion; list each path as you remove it.

---

## Step 5 — Post-Reset Guidance (REQ-0085)

Confirm the outcome:

1. **List each file/folder actually modified** vs. those that were **already empty**.
2. Suggest next steps based on scope:
   - `profile` → run `/setup` to rebuild your profile.
   - `documents` → add documents, then run `/setup` (Path A).
   - `all` → add documents or use the CV-import / interview path, then `/setup`.

---

## Quick Reference — REQ → Step

| REQ | Where |
|-----|-------|
| REQ-0080 scope selection | Step 0 |
| REQ-0081 pre-reset inventory | Step 1 |
| REQ-0082 explicit confirmation | Step 2 |
| REQ-0083 profile reset execution | Step 3 |
| REQ-0084 documents reset execution | Step 4 |
| REQ-0085 post-reset guidance | Step 5 |
