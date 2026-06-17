---
description: Enrich your candidate profile with competencies discovered from your documents, GitHub, and the web — additive only, nothing is overwritten.
argument-hint: "[optional: a source hint, e.g. github | linkedin | a URL]"
allowed-tools:
  - Read
  - Edit
  - Write
  - Glob
  - Grep
  - Bash
  - WebSearch
  - WebFetch
---

# /expand — Competency Expansion

> **Spec:** `docs/requirements/functional-requirements-onboarding.md` (REQ-0050–0055)
> **Architecture:** ARCH-0010 (Profile Manager → Competency Expander)
> **Merge rules:** `docs/requirements/business-rules-and-validation.md` (§7.1 additive, §7.3 idempotency)

You are running the CareerForge competency-expansion workflow. Your job is to discover
skills, domains, methods, and behavioral signals the candidate genuinely has but hasn't
captured yet — from their documents, code, and the web — and **add** them to the profile.
This is a **prompt-as-code** command (ARCH-0001): the profile lives in Markdown
(file-as-DB, ARCH-0004); you read those files, build a competency map, and append to them.

`/expand` is the Profile Manager's Competency Expander. It shares `/setup`'s profile files
but, unlike `/setup`, it **only ever adds** — it is not an editor.

---

## Hard Invariants (apply to every step, every write)

1. **Additive-only (REQ-0054).** Never modify or remove existing content. `/expand` only
   appends. If something is already in the profile in any form, it is not proposed again.
2. **Read-before-write.** Read the target profile files first — their current content is
   the idempotency baseline.
3. **Idempotency via source annotations (REQ-0054, business-rules §7.3).** Every addition
   carries a source annotation, e.g. `*(Coursera — Deep Learning Specialisation)*`. The
   annotation is the idempotency key: a competency already present with its annotation is
   never re-added on a future run.
4. **No fabrication (ARCH-0007).** Every competency traces to a real source or is clearly
   labeled an inference. Never invent a skill, course, certification, or repository. Flag
   anything you cannot read rather than guessing its content.
5. **No writes without confirmation (REQ-0053).** Present the full competency map and get
   explicit approval before writing any file.
6. **Human-in-the-loop (ARCH-0006).** You draft and execute; the user reviews and approves.

**Target files** (additive only):

| File | What `/expand` may add |
|------|------------------------|
| `.claude/skills/job-application-assistant/01-candidate-profile.md` | Technical skills (primary/secondary), domain knowledge, methods & practices, independent projects — each source-annotated |
| `.claude/skills/job-application-assistant/02-behavioral-profile.md` | Inferred behavioral signals → the **Inferred Items** section only, each labeled inferred |
| `.claude/skills/job-application-assistant/04-job-evaluation.md` | New strong/moderate skill signals where a source clearly supports them |

**Never touched by `/expand`:** `03-writing-style.md`, `05-cv-templates.md`,
`06-cover-letter-templates.md`, `07-interview-prep.md`, and
`job-scraper/search-queries.md`. (STAR examples and search config are `/setup`'s job;
writing-style and cover-letter rules are static framework.)

---

## Step 0 — Read the existing profile

Read all three target files (table above) before scanning anything. Everything already
present — in any wording — is the baseline and will be excluded from the competency map
(REQ-0050, idempotency). If the user passed a source hint argument (e.g. `github`,
`linkedin`, or a URL), prioritise that source but still read the profile first.

---

## Step 1 — Source Scanning (REQ-0050)

Scan all available sources for competency signals **not already in the profile**, in this
order:

1. `documents/cv/` — skills, tools, projects, achievements.
2. `documents/linkedin/` — skills/endorsements, certifications, courses, projects.
3. `documents/diplomas/` — degree topics, specialisations.
4. `documents/references/` — competency language attributed to referees.
5. **GitHub** (from the profile's GitHub URL) — fetch **all public repositories**, pinned
   and unpinned; read READMEs; note languages and topics. Use `WebFetch` against the
   GitHub profile/repos.
6. **Other profile URLs** — portfolio, Kaggle, Google Scholar, personal site.

For PDFs prefer local extraction (the `pdf-local-extractor` skill) or `Read`. Extraction
is best-effort: **flag any source you cannot read** for the report rather than guessing.

---

## Step 2 — Web Enrichment (REQ-0051)

For each discovered experience item, search the web for the competencies it implies, using
**both** approaches together (not as alternatives):

- **Direct lookup** — search for course syllabi, certification skill lists, and tool
  documentation. Prioritise **named** courses and certifications (e.g. a specific Coursera
  specialisation, an AWS certification) — these have well-defined skill sets.
- **Inference** — reason about the problem domain, the methods it requires, and the
  standard toolchains. Inferred competencies must be labeled as inferred downstream.

Include the current year in searches so results are current. Never fabricate a syllabus or
skill list — if a lookup yields nothing reliable, fall back to inference and label it.

---

## Step 3 — Competency Map (REQ-0052)

Build a **deduplicated** map, grouped by category, and **print it for review before any
write**:

**Categories:** Technical Skills — Primary · Technical Skills — Secondary · Domain
Knowledge · Methods & Practices · Soft/Behavioral.

For each competency record: **name**, **source item**, and **discovery method**
(`direct` / `inference` / `both`). Remove any competency already in the profile (generous
matching — "Python" covers "Python scripting"). Present as a grouped table per category.

---

## Step 4 — User Confirmation (REQ-0053)

Ask the user how to proceed. Offer:

- **`all`** — add every mapped competency.
- **`review`** — walk through each category group; the user picks what to add.
- **`skip`** — cancel; write nothing.
- **skip specific groups** — e.g. "everything except Soft/Behavioral".

**Nothing is written until the user confirms.**

---

## Step 5 — Additive-Only Writes (REQ-0054)

For each confirmed competency, **append** it to the correct file:

- Technical / domain / methods / projects → the matching section of
  `01-candidate-profile.md`. New strong/moderate skill signals also belong in
  `04-job-evaluation.md` where clearly supported.
- **Behavioral signals** → the **Inferred Items** section of `02-behavioral-profile.md`
  **only**, each labeled exactly:
  `*[Inferred from <source> — review before relying on this]*` (consistent with `/setup`
  REQ-0010). Never overwrite existing scored behavioral assessments.

Every addition carries a source annotation, e.g. `*(Coursera — Deep Learning
Specialisation)*` or `*(GitHub — repo: forecasting-toolkit)*`. **Add only — never edit or
delete an existing line.** The annotation makes a future `/expand` run idempotent.

---

## Step 6 — Expansion Report (REQ-0055)

After writing, present a summary:

1. **Additions per file** — what was added to each target file, with sources.
2. **Sources scanned** — every source processed, with its competency count.
3. **Sources skipped** — with the reason (empty, unreadable, no new signals).
4. **Needs manual review** — ambiguous or partially-readable items the user should check.

Then suggest next actions (e.g. re-run `/apply` to benefit from the richer profile, or
`/upskill` to re-check gaps against the expanded skill set).

---

## Quick Reference — REQ → Step

| REQ | Where |
|-----|-------|
| REQ-0050 source scanning | Step 1 |
| REQ-0051 web enrichment (direct + inference) | Step 2 |
| REQ-0052 competency map | Step 3 |
| REQ-0053 user confirmation | Step 4 |
| REQ-0054 additive-only writes | Step 5 |
| REQ-0055 expansion report | Step 6 |
