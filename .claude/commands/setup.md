---
description: Build or update your candidate profile via document scan, CV import, or interactive interview.
argument-hint: "[--section <name>]"
allowed-tools:
  - Read
  - Edit
  - Write
  - Glob
  - Grep
  - Bash
---

# /setup — Candidate Profile Onboarding

> **Spec:** `docs/requirements/functional-requirements-onboarding.md` (REQ-0001–0017)
> **Data model:** `docs/requirements/data-requirements.md` (§1–§9, §13, §17)
> **Merge rules:** `docs/requirements/business-rules-and-validation.md` (§7)
> **Flow:** `docs/requirements/user-flows.md` (§1)

You are running the CareerForge onboarding workflow. Your job is to populate the
user's profile files — replacing every `[UPPER_SNAKE_CASE]` placeholder token
with their real data — through one of three convergent paths.

This is a **prompt-as-code** command (ARCH-0001): there is no compiled program
and no `settings/profile.json`. The profile lives in Markdown files (file-as-DB,
ARCH-0004). You read those files, gather the user's data, and write it back.

---

## Hard Invariants (apply to every step, every write)

1. **Read-before-write (REQ-0002).** Always read a target file's current
   contents before proposing changes to it. Existing file state is the
   idempotency baseline — anything already present is not proposed again.
2. **Idempotency (business-rules §7.3).** Re-running `/setup` with the same
   inputs produces no new changes. Never re-propose content already present in a
   file in any form.
3. **No fabrication (ARCH-0007).** Never invent a token value. If you don't have
   data for a token, ask the user or leave the token in place — never guess a
   name, date, employer, skill, or achievement.
4. **No writes without confirmation (REQ-0009).** Present all proposed changes
   and obtain explicit user approval before writing any file.
5. **Human-in-the-loop (ARCH-0006).** The user reviews and approves; you draft
   and execute. When in doubt, ask.

**Target files** (the convergence set — REQ-0016):

| File | Tokens populated |
|------|------------------|
| `.claude/skills/job-application-assistant/01-candidate-profile.md` | Identity, education, experience, projects, skills, publications, awards, references, `[AI_TOOL_NAME]` |
| `.claude/skills/job-application-assistant/02-behavioral-profile.md` | Overview, drives, behaviors, preferences, growth areas, posting keywords, management style, application usage |
| `.claude/skills/job-application-assistant/04-job-evaluation.md` | Strong/moderate/weak skills, strong/moderate/entry experience, career goals, energizing/draining tasks |
| `.claude/skills/job-application-assistant/05-cv-templates.md` | `[PROFILE_STATEMENT_*]` (one per applicable role type) |
| `.claude/skills/job-application-assistant/07-interview-prep.md` | `[STAR_*]` examples and `[STUB_*]` Path-A stubs |
| `CLAUDE.md` (user fork — from `CLAUDE.md.template`) | Union of the above + workflow sections |
| `.claude/skills/job-scraper/search-queries.md` | Search query + location-tier tokens |

**Never touched by `/setup`:** `03-writing-style.md` and
`06-cover-letter-templates.md` are static framework rules. (The `[AI_TOOL_NAME]`
mention in `03` is prose describing the override — not a fill target. The actual
override token lives in `01-candidate-profile.md`.)

---

## Step 0 — Argument Parsing & Path Selection (REQ-0001)

### 0a. Section update mode (`--section <name>`)

If invoked with `--section <name>`, **skip path selection** and run an
update-only flow for just that section.

Valid `--section` values (any other value → list these and stop):

```
identity  education  experience  skills  certifications  publications
awards  behavioral  search  salary  interview-prep  writing-style
```

For section mode:
1. Read the file(s) that own that section (see the target-files table; e.g.
   `search` → `search-queries.md`; `behavioral` → `02-behavioral-profile.md`;
   `interview-prep` → `07-interview-prep.md`; `skills` → `01` + `04`).
2. Ask only the questions needed to (re)fill that section's tokens.
3. Merge per Step 5 rules (additive/conflicting) and write only those files.
4. Present a short summary (Step 6, scoped to the section).

`--section search` is the canonical way to regenerate search queries without
redoing the whole profile (REQ-0015).

### 0b. Full onboarding — detect document folder state

If no `--section` argument, inspect `documents/` subfolders
(`cv/`, `linkedin/`, `diplomas/`, `references/`, `applications/`) with Glob.

- **Files present in ≥1 subfolder** → present the three paths with **Path A
  recommended**.
- **All subfolders empty** → present the three paths, framing Path A as a
  "populate the `documents/` folder first, then re-run" option.

Always let the user pick **any** path regardless of folder state. Present:

> **Path A — Scan my documents** (recommended if you have CVs/LinkedIn exports in `documents/`)
> **Path B — Import a single CV** (paste text or point me at one file)
> **Path C — Interactive interview** (I ask, you answer — no documents needed)

Then branch to Step 1, 2, or 3. All paths reconverge at Step 4.

---

## Step 1 — Path A: Document Folder Scanning (REQ-0002–0012)

### A1. Read existing profile first

Read all target profile files (table above) before scanning. Their current
content is the idempotency baseline — anything already present is not proposed
again (REQ-0002).

### A2. Scan and extract per subfolder

Glob each subfolder and extract structured data. For PDFs, prefer local
extraction (the `pdf-local-extractor` skill) or the `Read` tool; extraction is
best-effort — **flag any file you cannot read** rather than guessing its content.

| Subfolder | Extract | Req | Formats |
|-----------|---------|-----|---------|
| `cv/` | Name, contact, education, experience, skills, publications, awards, profile/summary text. Handle multiple CVs (cross-reference for consistency). | REQ-0003 | PDF, `.tex` |
| `linkedin/` | About/summary, experience, education, skills/endorsements, certifications, volunteer work, publications, recommendations. If multiple exports, use the **most recently modified**. About text → behavioral inference; recommendations → reference context. | REQ-0004 | PDF |
| `diplomas/` | Official degree title + level, institution, graduation date, grade/distinction. Use to verify education entries from CV/LinkedIn. | REQ-0005 | PDF |
| `references/` | Referee name/title/organization, specific quotes (stored with attribution), competency language (→ behavioral). | REQ-0006 | PDF, TXT, MD |
| `applications/<company>_<role>/` | From `job_posting.md`, `cover_letter.tex`, `cv_draft.tex`, `outcome.md`: posting details, cover-letter patterns, CV profile statements, outcomes. Outcomes calibrate the evaluation framework. | REQ-0007 | MD, LaTeX |

### A3. Cross-reference validation (REQ-0008)

After extracting all documents, check for inconsistencies **across** sources:
- Date mismatches (e.g. role end date differs between CV and LinkedIn)
- Title mismatches
- Education mismatches (degree/field/institution)
- Employer-name variations

Present each as a **numbered item showing both values**, and have the user
resolve each before proceeding. If none found, state exactly:
**"No cross-reference issues found."**

### A4. Build change sets & classify (Merge Engine — REQ-0009, business-rules §7)

Compare extracted data against the existing file baseline. Classify every
proposed change:

- **Additive** (new content not present in any form): present as a **grouped
  checklist by target file**. User can approve all or skip individual items.
- **Conflicting** (disagrees with existing content): present **one at a time**
  with **keep / replace / manual** options. User resolves each.

**No file writes occur until the user confirms.** Already-present content is
never re-proposed (idempotency).

### A5. Inference & stubs (do not fabricate)

- **Behavioral inference (REQ-0010).** Items derived from inferred sources
  (LinkedIn about section, reference letters) are written **only** to the
  "Inferred Items" section of `02-behavioral-profile.md`, each labeled with the
  exact text:
  `*[Inferred from <source> — review before relying on this]*`
  Never overwrite existing scored assessments with inferred items. Inference is
  limited to behavioral traits, work preferences, and management style.
- **Writing-style patterns (REQ-0011).** Only if **≥2** cover letters exist:
  extract recurring patterns and add them as *observations* under a dedicated
  patterns section. Do **not** modify the rules in `03-writing-style.md`.
- **STAR stubs (REQ-0012, DEC-016).** For achievements found in documents but
  not covered by existing STAR examples, create **stubs** in
  `07-interview-prep.md` with: achievement title, source document, one-sentence
  description, applicable question types, and **empty S/T/A/R fields**. Do **not**
  draft Situation/Task/Action/Result from inference — those require the
  candidate's first-person memory. Track the stub count for the summary.

After resolving conflicts, ask brief follow-up questions for any required gaps
(see Step 4 list), then go to Step 4.

---

## Step 2 — Path B: Single CV Import (REQ-0013)

1. Accept **either** pasted CV text **or** a file reference the user provides.
2. Extract all structured information (same fields as REQ-0003 / the
   `01-candidate-profile.md` schema).
3. Identify gaps and ask **targeted** follow-up questions for what a CV usually
   omits: behavioral profile, career goals, deal-breakers, salary expectations,
   references.
4. When data collection is complete, proceed to Step 4.

Read the existing profile files first (read-before-write) and apply the same
additive/conflicting merge classification from Step 1/A4 before writing.

---

## Step 3 — Path C: Interactive Interview (REQ-0014)

Walk the user through these **nine sections in this exact order**. Ask
conversationally — one topic at a time, follow up naturally — **not** as a rigid
form. Optional sections are skippable.

1. **Identity & Contact** — name, location, phone, email, LinkedIn, GitHub,
   languages, employment status, constraints.
2. **Education** — degrees (reverse chronological): degree, field, period,
   institution, key topics, thesis.
3. **Experience** — roles (reverse chronological): title, company, period,
   location, responsibilities/achievements.
4. **Technical Skills** — primary, secondary, domain, tools.
5. **Publications / Awards** *(optional)*.
6. **Behavioral Profile** *(optional)* — overview, strongest behaviors, work
   preferences, growth areas, management-style preferences.
7. **Career Goals** — direction, what excites you, energizing vs. draining tasks.
8. **References** *(optional)* — name, title, company, contact.
9. **Job Search Configuration** — handed to Step 4.

Synthesize answers into the structured token values. Read existing files first;
apply the merge classification before writing.

---

## Step 4 — Job Search Configuration (REQ-0015)

Run for all paths (and standalone via `--section search`). Collect:

- **Role titles** (3–8) the user wants to target.
- **Key skills** (3–5) to anchor queries.
- **Target companies** (optional).
- **Geographic scope** + **location filter tiers**: ideal / acceptable /
  borderline / too far.
- **Preferred job portals**.

Proactively **suggest adjacent role types** the user may not have considered,
based on their skill profile. Then generate prioritized search queries organized
by category:

- **Priority 1** — primary role direction (strongest match)
- **Priority 2** — domain expertise (vertical-specific)
- **Priority 3** — adjacent role pivots
- **Priority 4** — wider-net broad queries

Write these into `.claude/skills/job-scraper/search-queries.md`, replacing its
location and query tokens (`[YOUR_PRIMARY_JOB_TITLE]`, `[YOUR_KEY_SKILL]`,
`[YOUR_DOMAIN_KEYWORD_*]`, `[YOUR_CITY]`, `[YOUR_COUNTRY]`, `[YOUR_REGION]`,
`[LOCATION_TIER_*]`).

---

## Step 5 — File Generation Convergence (REQ-0016)

All three paths converge here. With the user's confirmed data:

1. Replace **every** `[UPPER_SNAKE_CASE]` token in the target files with the
   real value. Remove optional template blocks the user has no data for (e.g.
   the Publications / Awards / Independent Projects sections in
   `01-candidate-profile.md` carry "remove if not applicable" comments).
2. **Path A only:** skip skill files already populated by document extraction —
   don't overwrite confirmed content.
3. Populate the user-fork **`CLAUDE.md`** from `CLAUDE.md.template` (the union of
   profile data + workflow sections). If the user's `CLAUDE.md` is still the
   framework-development file (Role A), explain that their fork should swap in
   the populated Role B profile, and write it to `CLAUDE.md` (or, if they prefer
   to keep the dev file, to a clearly named profile file and tell them).
4. Honor `[AI_TOOL_NAME]` (DEC-017): leave it as the default (Claude Code)
   unless the user sets an override.
5. Respect repeat-block templates (education / experience / reference) — emit one
   block per real entry.

Present a **summary of every file written**.

---

## Step 6 — Completion Summary (REQ-0017)

After all files are generated:
1. **List every file** created or updated.
2. Suggest next actions: run a job search, then apply to a test posting with
   `/apply`.
3. If Path A left **STAR stubs**, state the **count** needing manual completion
   and point the user at `07-interview-prep.md`.

---

## Quick Reference — REQ → Step

| REQ | Where |
|-----|-------|
| REQ-0001 path selection / `--section` | Step 0 |
| REQ-0002–0007 extraction | Step 1 (A1–A2) |
| REQ-0008 cross-reference | Step 1 (A3) |
| REQ-0009 additive/conflicting | Step 1 (A4) |
| REQ-0010 behavioral inference | Step 1 (A5) |
| REQ-0011 writing-style patterns | Step 1 (A5) |
| REQ-0012 STAR stubs | Step 1 (A5) |
| REQ-0013 Path B | Step 2 |
| REQ-0014 Path C | Step 3 |
| REQ-0015 search config | Step 4 |
| REQ-0016 convergence | Step 5 |
| REQ-0017 completion summary | Step 6 |
