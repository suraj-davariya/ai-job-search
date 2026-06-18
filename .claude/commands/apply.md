---
description: Produce a tailored, compiled, verified CV + cover letter for a job posting (URL or pasted text).
argument-hint: "<url|pasted job text> [--review=full|quick|none]"
allowed-tools:
  - Read
  - Edit
  - Write
  - Bash
  - Glob
  - Grep
  - WebFetch
  - WebSearch
  - Task
---

# /apply — Job Application Pipeline

> **Spec:** `docs/requirements/functional-requirements-application.md` (REQ-2001–2062)
> **Rules:** `docs/requirements/business-rules-and-validation.md` (§2 page budget, §3 cover letter, §4 writing quality, §5 verification, §6 dedup, §9 status enum)
> **Flow:** `docs/requirements/user-flows.md` (§3)

You are running the CareerForge application pipeline: take a job posting and
produce a tailored CV and cover letter, compiled to PDF and verified. This is a
prompt-as-code command (ARCH-0001) operating on the file-as-DB profile
(ARCH-0004).

**Pipeline:** Steps 0 → 1 → 2 → 3 → 4 → 5 → 6. The reviewer critique (Step 3) and
revision (Step 4) run when `--review=full` (default) or `--review=quick`, and are
skipped when `--review=none`.

---

## Hard Invariants (apply at every step)

1. **No fabrication (ARCH-0007).** Every claim in the CV and cover letter must be
   verifiable against the candidate profile. Never invent skills, experience,
   achievements, dates, or company facts.
2. **Read-before-write.** Read the profile and template files before drafting;
   read a `.tex` file before editing it.
3. **Writing style always applies (business-rules §4).** No em-dashes, clichés,
   buzzwords-without-backing, or apologetic language; first person, active voice.
4. **Human-in-the-loop (ARCH-0006).** Stop at the approval gate (Step 1) before
   drafting. Flag stretch claims for the user (REQ-2023).
5. **Token efficiency (REQ-2024).** Keep files and draft text in working memory;
   do not re-read files already in context from an earlier step.

**Profile + template files this command consumes:**

| File | Used in |
|------|---------|
| `.claude/skills/job-application-assistant/01-candidate-profile.md` | Steps 1, 2 (source of all claims) |
| `.claude/skills/job-application-assistant/02-behavioral-profile.md` | Step 1 (behavioral fit), Step 2 (cover-letter voice) |
| `.claude/skills/job-application-assistant/03-writing-style.md` | Step 2 (always) |
| `.claude/skills/job-application-assistant/04-job-evaluation.md` | Step 1 (scoring framework) |
| `.claude/skills/job-application-assistant/05-cv-templates.md` | Step 2/5 (CV LaTeX guide + cutting) |
| `.claude/skills/job-application-assistant/06-cover-letter-templates.md` | Step 2/5 (cover-letter LaTeX guide) |
| `.claude/skills/job-application-assistant/08-legitimacy.md` | Step 1 (posting legitimacy gate) |
| `locale-packs/<code>.json` | Steps 0–2 (target-market conventions; default `locale-packs/default.json`) |
| `trust-safety/scam-patterns.json` | Step 1 (red-flag catalog) |

---

## Step 0 — Input Parsing (REQ-2001, REQ-2002)

Accept the posting as **either** a URL **or** pasted text — these are
equal-priority inputs; paste is a first-class choice, never a fallback.

- **URL:** fetch with WebFetch and parse the content.
- **Text:** use directly.

Extract metadata: **company name, role title, department** (if mentioned),
**location**, and **language of the posting**. Both input modes produce identical
downstream behavior.

**Language rule (REQ-2002, REQ-7001):** the cover letter is written in the **posting's
language** (e.g. a Danish posting → Danish cover letter). The **CV language follows the
active locale pack / user preference** (default: the posting language, falling back to
English) — it is no longer hardcoded to English.

**Resolve the locale pack (REQ-7009):** from the employer country / job location (or a
user preference), load `locale-packs/<code>.json` for the target market; fall back to
`locale-packs/default.json` if none matches (ARCH-0005). It drives CV page size, page
count, photo norm, personal fields, date format, and legal clauses in Steps 1–2.

---

## Step 1 — Fit Evaluation (REQ-2010–2013)

Read `01`, `02`, and `04` (and `03`, `05`, `06` now while you're here, to avoid
re-reads later — REQ-2024). Score the role using the five-dimension framework in
`04-job-evaluation.md`:

| Dimension | Weight |
|-----------|--------|
| Technical Skills Match | 30% |
| Experience Match | 25% |
| Behavioral/Culture Fit | 15% |
| Career Alignment | 30% |
| Location & Logistics | Pass/Fail (not weighted) |

Apply the **Location override**: if Location = FAIL, the verdict is **Poor Fit**
regardless of the weighted score.

**Salary (REQ-2011, optional):** invoke `python3 salary_lookup.py "<company>" --city "<city>"` (omit `--city` if no city is known).
If the tool or data is unavailable, note "Salary data not available" and proceed — never block on it.

**Posting legitimacy — separate gate (REQ-8001–8005, read `08-legitimacy.md`):** assess
whether the posting is genuine and safe to engage with, **independently** of the fit
score. Check it against `trust-safety/scam-patterns.json` (global signals + any `byRegion`
entries for the active locale pack), corroborate the employer/domain via web search, and
produce a standalone verdict — **Verified / Caution / Suspicious** — with cited evidence.
This is **not** folded into the 0–100 fit score (business-rules §10). Never auto-block
(ARCH-0006); never accuse without cited evidence, use Caution when unsure (ARCH-0007);
fail open with a neutral note if signals can't be gathered (ARCH-0005).

**Present the evaluation (REQ-2012)** using the output format in
`04-job-evaluation.md`: the dimension table with notes, weighted total, verdict
(Strong 75+ / Good 60–74 / Moderate 45–59 / Weak 30–44 / Poor <30), key
strengths, gaps, recommendation, and a short company-research checklist. Offer
pre-application call guidance only when substantive questions exist.

**Approval gate (REQ-2013):** ask whether to proceed with drafting.
- If **no** → stop here.
- If **yes** → continue.
- If **Experience Match < 50**, warn that extensive reframing would be needed
  before the user decides.
- If the **legitimacy verdict is Suspicious**, surface it prominently, recommend against
  proceeding, and require explicit user confirmation to continue (ARCH-0006).

---

## Step 2 — CV and Cover Letter Drafting (REQ-2020–2024)

Draft both documents from the profile data already in context. Obey the writing
quality rules (§4): no em-dashes, clichés, generic buzzwords, or apologetic
language; first person, active voice; pass the **interview backtrack test** for
every claim. Flag any stretch claim to the user: *"This is a stretch because X.
Keep, soften, or drop?"* (REQ-2023). Honor reframing boundaries (§4.3) — reorder
and emphasize, never claim experience the candidate lacks.

**Tool naming (§4.4, DEC-017):** if a document references AI/agentic coding
tooling, name the specific tool. Default **Claude Code**; use the
`[AI_TOOL_NAME]` override from `01-candidate-profile.md` if set. Never "an AI
assistant".

### CV (REQ-2020) — language + conventions per the active locale pack

1. Copy the base template: `cp cv/main_example.tex cv/main_<company>.tex`.
2. Tailor per `05-cv-templates.md`:
   - Profile statement: use the matching `[PROFILE_STATEMENT_*]` (filled by
     `/setup`); reference the role/company — not generic.
   - Reorder core competencies and `\skillset` rows to lead with the most
     posting-relevant items; lead each role with its most relevant bullet.
   - Apply the section-order variant for the role type (Technical / Domain /
     Consulting / Leadership).
   - Apply the **locale pack** (`05` Locale Adaptation): page size (A4/Letter),
     photo norm, included/discouraged personal fields, date format. Never fabricate a
     locale-required field — prompt the user if it's missing (ARCH-0007).
   - Use class macros (`\company`, `\education`, `\skillset`, `\divider`); **no
     `\vspace` inside `itemize`**.
3. Target the locale pack's `pageCountExpectation` (default **2 pages**) when compiled
   (enforced in Step 5).

### Cover letter (REQ-2021) — posting language

1. Copy the base template:
   `cp cover_letters/main_example.tex cover_letters/cover_<company>_<role>.tex`.
2. Tailor per `06-cover-letter-templates.md`:
   - Opening specific to this role and company (not a template opener).
   - Forward-looking framing: the tasks the candidate can solve, not a CV recap.
   - 3–5 bullets for concrete skills/achievements.
   - Salutation to the named contact, else "Dear Hiring Manager".
3. Target: exactly **1 page**, 250–300 words of body text (§3.1).

---

## Step 3 — Reviewer Critique (REQ-2030–2034)

Parse `--review` (`full` is the default; `quick`; `none`) and display the
token-cost estimate line before spawning (REQ-2034):
`~X tokens (full), ~Y tokens (quick), ~Z tokens (none)`. Record the chosen mode
for the output metadata.

- **`--review=none`:** skip Steps 3–4 entirely; the drafts proceed directly to
  Step 5.
- **`--review=full` (default) or `--review=quick`:** spawn the **`reviewer`**
  agent (Task/Agent tool, `subagent_type: reviewer`) with a **fresh context**.

When spawning, pass **inline in the prompt** (not via file reads — REQ-2024,
REQ-2030):
- the CV draft text and its path (`cv/main_<company>.tex`),
- the cover letter draft text and its path (`cover_letters/cover_<company>_<role>.tex`),
- the parsed job posting (company, role, department, location, language, body),
- the **review mode** (`full` or `quick` — in `quick`, the reviewer skips company
  research and omits the company-angles category, per REQ-2030).

The reviewer reads only the 4 profile files it needs, researches the company
(full mode), checks voice against the behavioral profile (REQ-2033), and returns
**Part A** (JSON array of `{file, old_string, new_string, reason}` edits) and
**Part B** (narrative suggestions in four categories). The reviewer does not
compile, edit files, or run the verification checklist.

## Step 4 — Revision (REQ-2040–2042)

Apply the reviewer's feedback to the draft text already in your context (don't
re-read the `.tex` files unless an edit fails because text shifted).

**Part A — structured edits (REQ-2040):** apply each edit with its exact
`old_string` → `new_string`. **Skip any edit that would fabricate content**
(ARCH-0007). Re-read a file only if an edit fails to match.

**Part B — narrative revisions (REQ-2041):** address **every** category with
judgment:
- *Missed keywords* — add where they fit naturally, preferring experience bullets
  over abstract claims.
- *Company angles* — weave into the cover letter, but **only after independent
  verification** (below).
- *Action-oriented reframing* — rewrite passive/generic phrasing.
- *Tone/style* — fix per `03-writing-style.md` and the behavioral profile.

**Company claim verification (REQ-2042) — mandatory:** do not trust the
reviewer's research at face value. Independently verify **every** company-specific
claim via web search/fetch before including it. Unverifiable claims are rephrased
in general terms or omitted.

After revision, continue to Step 5.

---

## Step 5 — Compilation & Inspection (REQ-2050–2055)

This step is **mandatory** — never skip it.

### Compile
- **CV:** from the `cv/` directory, run `lualatex main_<company>.tex` (never
  pdflatex/xelatex — `fontawesome` needs LuaTeX).
- **Cover letter:** from the `cover_letters/` directory, run
  `xelatex cover_<company>_<role>.tex` (xelatex needs `fontspec`; **the working
  directory must be `cover_letters/`** or fonts resolve to wrong glyphs).

If a compile fails, read the log, fix the LaTeX, and recompile until clean.

### Inspect
- **CV (REQ-2051):** exactly 2 pages; no orphaned entry titles; no section
  heading isolated at a page top with 1–2 lines; no awkward whitespace gaps.
- **Cover letter (REQ-2052):** exactly 1 page; signature block visible (not cut
  off or pushed to page 2); bullet font matches body font.

### Iterative fix loop with layout-fix memory (REQ-2053, REQ-2055)

Cache file: `.agents/state/layout-fixes.json` (gitignored; schema = data-req §16).
At session start, prune entries older than 90 days with `applied_count = 0`.

For each layout issue, **before** deriving a fix with the model:
1. Compute `(template_id, issue_signature)` — e.g.
   `("cfcv.cls", "orphaned-cventry")`, `("cfcl.cls", "cover-letter-overflow")`,
   `("cfcl.cls", "font-mismatch-itemize")`.
2. Look it up in the cache. On a **hit**, apply the cached `fix_snippet` first,
   increment `applied_count`, update `last_used`, and recompile.
3. On a **miss** (or if the cached fix fails), derive the fix:
   - Orphaned entry → `\needspace{5\baselineskip}` before the entry.
   - Near-miss overflow (≈2.02 pages) → `\enlargethispage{2-3\baselineskip}`.
   - Genuine overflow → **relevance-weighted cutting** (§2.2/§2.3); never reduce
     margins or line spacing first.
   - Cover-letter bullet font mismatch → the fontspec wrapper pattern from `06`.
   Then record the new fix in the cache.

Cache writes are atomic (tempfile + fsync + rename, NFR-0016); cap at 200
entries with LRU eviction. Loop until all checks pass.

### Cleanup (REQ-2054)
After the final clean compile, delete `.aux`, `.log`, `.out` — keep only `.tex`
and `.pdf`.

---

## Step 6 — Final Presentation (REQ-2060–2062, data-req §11)

**Record the application (data-req §11, business-rules §6.2, TC-SEA-009):** now that the PDFs exist, append **one new row** to `job_search_tracker.csv` (repo root). Never modify existing rows.

- If `job_search_tracker.csv` does not exist, create it first with the canonical 14-column header:
  `date,company,sector,role,role_type,channel,status,contact_person,fit_rating,notes,cv_file,cover_letter_file,source,last_updated`
- `status` = `Draft` (canonical enum, business-rules §9.1).
- `fit_rating` = the weighted total from Step 1.
- `cv_file` / `cover_letter_file` = the actual output paths confirmed after Step 5.
- `date` / `last_updated` = today's date.

Run the **full verification checklist exactly once** (business-rules §5). Re-read
both `.tex` files once to confirm their on-disk state. Report each item pass/fail:

- **Factual accuracy (§5.1):** claims match the profile; titles/dates/companies/
  locations/contact correct; company claims web-verified.
- **Targeting (§5.2):** profile statement tailored; skills/experience reframed;
  key requirements addressed; matching nice-to-haves highlighted.
- **Consistency (§5.3):** CV 2-page format; cover letter uses the template
  structure; consistent tone; no CV↔cover-letter contradictions.
- **Quality (§5.4):** no LaTeX errors; no spelling/grammar errors; AI tool named;
  correct addressee; cover letter fits one page.
- **Compiled PDF (§5.5):** CV lualatex/2 pages/no orphans; cover letter
  xelatex/1 page/signature visible/bullet font matches.

Then:
- **Tailoring summary (REQ-2061):** 3–5 key decisions — what was emphasized and
  why, company-specific angles, gaps acknowledged or reframed.
- **File listing (REQ-2062):** the CV (PDF) and cover letter paths, plus the ATS exports
  produced in Step 7 (`.txt`, `.docx`), then:
  *"Your documents are ready for your review."*

---

## Step 7 — ATS Exports & Parse Check (REQ-2063, REQ-2064)

The polished LaTeX **PDF stays the primary, human-facing output**. In addition, produce
the machine-parseable companions ATS systems prefer — from **one** source so all three
artifacts stay content-equivalent:

1. **ATS-safe Markdown** (write it from the same tailored content): `cv/main_<company>.ats.md`
   — a flat, parseable structure: standard headings (Summary, Experience, Education,
   Skills), plain text, no tables/columns/graphics, name + contact at the top. **Identical
   claims to the PDF — no fabrication** (ARCH-0007).
2. **Generate exports + verify the PDF:**
   ```bash
   node scripts/ats-export.mjs --md cv/main_<company>.ats.md --out cv/output \
     --pdf cv/output/main_<company>.pdf \
     --name "<Full Name>" --keywords "<top role keywords>"
   ```
   Produces `cv/output/main_<company>.txt` and `.docx`, and runs the ATS parse self-check
   on the PDF (name + section headers + keywords recoverable).
3. **Graceful degradation (ARCH-0005, REQ-2064):** the `.txt` always works; `.docx` needs
   `pandoc` and the parse check needs `pdftotext` (poppler). If a tool is absent the script
   notes it and continues — **never block delivery** on these.
4. Report the parse-check result; if a field isn't recoverable from the PDF, point the
   user to the `.txt`/`.docx` as the ATS-safe fallback.

---

## Quick Reference — REQ → Step

| REQ | Where |
|-----|-------|
| REQ-2001/2002 input + language | Step 0 |
| REQ-2010–2013 fit eval + gate | Step 1 |
| REQ-2020–2024 drafting | Step 2 |
| REQ-2030–2034 reviewer critique | Step 3 |
| REQ-2040–2042 revision + claim verify | Step 4 |
| REQ-2050–2055 compile + fix loop | Step 5 |
| data-req §11 tracker row | Step 6 |
| REQ-2060–2062 verify + summary | Step 6 |
| REQ-2063/2064 ATS exports + parse check | Step 7 |
