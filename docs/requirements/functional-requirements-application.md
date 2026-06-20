# Functional Requirements — Application Pipeline

> **Purpose:** Specifies the requirements for CareerForge's drafter-reviewer application workflow, including fit evaluation, CV/cover letter generation, reviewer critique, PDF compilation, and verification.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## Overview

The application pipeline is a multi-step, two-agent workflow that takes a job posting and produces a tailored, verified CV and cover letter. It is the core value-producing workflow of CareerForge.

Related documents:
- [Personas & Actors](personas-and-actors.md) — Drafter and Reviewer agent roles
- [Business Rules](business-rules-and-validation.md) — Scoring, page limits, content cutting
- [User Flows](user-flows.md) — Step-by-step journey diagram

---

## Step 0: Input Parsing

### REQ-2001: URL and Text Input (equal-priority modes)
**Priority:** Must
**Description:** The system shall accept job postings via two equal-priority input modes: a URL (which the system fetches) or pasted text (which the system uses directly). Neither is a fallback for the other — both are first-class inputs per DEC-011.
**Acceptance Criteria:**
- URL input: fetched via web request; parsed for content
- Text input: used directly without requiring a prior failed URL fetch
- Both modes produce the same downstream evaluation, drafting, and verification behavior
- Extracted metadata: company name, role title, department (if mentioned), location, language of posting
- User documentation describes paste as a valid first-choice input, not framed as a workaround

### REQ-2002: Language Detection
**Priority:** Must
**Description:** The system shall detect the language of the job posting and use it to determine the cover letter language.
**Acceptance Criteria:**
- Posting language determines cover letter language (e.g., Danish posting → Danish cover letter)
- CV is always in English regardless of posting language

---

## Step 1: Fit Evaluation

### REQ-2010: Five-Dimension Scoring
**Priority:** Must
**Description:** The system shall evaluate the job against the user's profile using the five-dimension framework.
**Acceptance Criteria:**
- Dimensions scored: Technical Skills (0–100), Experience Match (0–100), Behavioral/Culture Fit (0–100), Location & Logistics (Pass/Fail), Career Alignment & Motivation (0–100)
- Each dimension uses the calibrated criteria from the evaluation framework
- Scoring weights: Technical 30%, Experience 25%, Behavioral 15%, Career 30%
- Location is pass/fail, not weighted

### REQ-2011: Salary Benchmark Integration
**Priority:** Could
**Description:** If salary data is configured, the system shall look up the target company and include salary benchmarks in the evaluation.
**Acceptance Criteria:**
- Runs salary lookup tool with company name (and city if available)
- Presents salary index relative to baseline
- If tool is not configured or returns no results, step is silently skipped

### REQ-2012: Evaluation Presentation
**Priority:** Must
**Description:** The evaluation shall be presented as a structured table with an overall verdict and recommendation.
**Acceptance Criteria:**
- Table shows all dimension scores with brief notes
- Overall score is a weighted average
- Verdict thresholds: Strong Fit (75+), Good Fit (60–74), Moderate Fit (45–59), Weak Fit (30–44), Poor Fit (<30)
- Includes: key strengths, gaps to address, recommendation, company research checklist
- Pre-application call guidance: suggest calling only when substantive questions exist

### REQ-2013: User Approval Gate
**Priority:** Must
**Description:** After presenting the evaluation, the system shall ask the user whether to proceed with drafting.
**Acceptance Criteria:**
- If user says no, workflow stops here
- If user says yes, proceeds to CV and cover letter drafting
- If experience match score is below 50, system warns that extensive reframing would be needed

---

## Step 2: CV and Cover Letter Drafting

### REQ-2020: CV Generation
**Priority:** Must
**Description:** The drafter shall generate a tailored CV in LaTeX format using the moderncv/banking template.
**Acceptance Criteria:**
- Output file: `cv/main_<company>.tex`
- Always in English
- Profile statement tailored to the specific role
- Experience bullets reframed to match job requirements
- Uses most recent existing CV as structural reference
- Follows section ordering guidelines for the role type
- Target: exactly 2 pages when compiled

### REQ-2021: Cover Letter Generation
**Priority:** Must
**Description:** The drafter shall generate a tailored cover letter in LaTeX using the custom cover letter class.
**Acceptance Criteria:**
- Output file: `cover_letters/cover_<company>_<role>.tex`
- Language matches the job posting language
- Opening paragraph specific to this role and company (not a template opener)
- Forward-looking framing: focuses on tasks the user can solve
- 3–5 bullet points for concrete skills/achievements
- Any mention of AI tooling references the specific tool by name per the rule in `business-rules-and-validation.md §4.4 Tool Naming` (default: **Claude Code**; configurable per profile per DEC-017)
- Target: exactly 1 page when compiled

### REQ-2022: Writing Style Compliance
**Priority:** Must
**Description:** All generated text shall comply with the writing style guide.
**Acceptance Criteria:**
- No em-dashes (use commas, periods, or restructure)
- No clichés or filler phrases
- No generic buzzwords without concrete backing
- No apologetic or overly humble language
- No unverified company claims
- First person, active voice
- Interview backtrack test passes for all claims

### REQ-2023: No Fabrication Rule
**Priority:** Must
**Description:** The system shall never fabricate skills, experience, or achievements in any generated document.
**Acceptance Criteria:**
- All claims verifiable against the candidate profile
- If a requirement is a genuine gap, it is acknowledged honestly or adjacent experience is framed
- Reframing is allowed within the interview backtrack test boundary
- Stretch claims are flagged to the user with "Keep, soften, or drop?" prompt

### REQ-2024: Token Efficiency
**Priority:** Should
**Description:** The drafter shall not re-read files already in its context from previous steps.
**Acceptance Criteria:**
- Files read in Step 1 are used directly in Step 2
- Draft texts are kept in working memory for inline passing to the reviewer

---

## Step 3: Reviewer Critique

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

### REQ-2031: Company Research
**Priority:** Must
**Description:** The reviewer shall research the target company using web search before critiquing.
**Acceptance Criteria:**
- Researches: company website/mission, department/team, recent news/initiatives, company culture and values
- Research informs critique but does not replace profile data as the source of claims

### REQ-2032: Structured Feedback Format
**Priority:** Must
**Description:** The reviewer shall return feedback in two parts: structured edits and narrative suggestions.
**Acceptance Criteria:**
- **Part A (Structured Edits):** JSON array of `{file, old_string, new_string, reason}` objects; `old_string` must be exact and unique within the file
- **Part B (Narrative Suggestions):** Prose grouped by category, with every category addressed (even if "no issues"):
  - Missed keywords/requirements
  - Company/department-specific angles
  - Action-oriented reframing
  - Tone and style issues (checked against both writing style guide AND behavioral profile)
- No fabrication suggestions
- Reviewer does not run a verification checklist

### REQ-2033: Behavioral Voice Check
**Priority:** Should
**Description:** The reviewer shall specifically check whether the cover letter's voice matches the candidate's natural register as described in the behavioral profile.
**Acceptance Criteria:**
- Flags mismatches (e.g., a "Collaborator" profile given a solo-hero tone; a "Persuader" profile given over-hedged phrasing)
- Tone issues are reported under the "Tone and style issues" category

### REQ-2034: Reviewer Opt-Out Flag
**Priority:** Should
**Description:** The `/apply` command (and all sub-commands per REQ-6003) shall accept a `--review` flag that controls whether the reviewer agent runs. This is the opt-out mechanism described in DEC-009.
**Acceptance Criteria:**
- `--review=full` (default): reviewer spawned, full critique including company research
- `--review=quick`: reviewer spawned, company research step (Part B) skipped
- `--review=none`: reviewer NOT spawned; drafter output proceeds directly to PDF compilation
- The flag is optional; omitting it is equivalent to `--review=full`
- All three modes pass the same verification checklist (REQ-2050–2053)
- Token cost estimate is displayed before spawning: `~X tokens (full)`, `~Y tokens (quick)`, `~Z tokens (none)`
- The flag setting is recorded in the application output folder's metadata

**Cross-references:** DEC-009, REQ-2030, REQ-6003

---

## Step 4: Revision

### REQ-2040: Part A Application
**Priority:** Must
**Description:** The drafter shall apply Part A structured edits directly using file editing, without re-reading draft files.
**Acceptance Criteria:**
- Each edit applied using the reviewer's exact `old_string` and `new_string`
- Edits that would fabricate content are skipped
- Edits are applied from the draft text already in context

### REQ-2041: Part B Application
**Priority:** Must
**Description:** The drafter shall address every Part B category with judgment-based revisions.
**Acceptance Criteria:**
- Missed keywords: added where they fit naturally, preferring experience bullets over abstract claims
- Company angles: woven into cover letter; every company claim independently verified via web search
- Action-oriented reframing: passive/generic phrasing rewritten
- Tone/style: fixes applied per writing style guide
- Files only re-read if an edit fails due to shifted text

### REQ-2042: Company Claim Verification
**Priority:** Must
**Description:** Every company-specific claim incorporated from reviewer suggestions shall be independently verified before inclusion.
**Acceptance Criteria:**
- Drafter does not trust reviewer research at face value
- Each claim verified via web search/fetch
- Unverifiable claims are rephrased in general terms or omitted

---

## Step 5: PDF Compilation and Inspection

### REQ-2050: Mandatory Compilation
**Priority:** Must
**Description:** Both documents shall be compiled to PDF and visually inspected before being presented to the user. This step shall never be skipped.
**Acceptance Criteria:**
- CV compiled with `lualatex` (not pdflatex)
- Cover letter compiled with `xelatex` (requires fontspec)
- If compilation fails, error is fixed and recompiled until clean

### REQ-2051: CV Layout Verification
**Priority:** Must
**Description:** The compiled CV PDF shall be verified for layout correctness.
**Acceptance Criteria:**
- Exactly 2 pages (not 1, not 3)
- No orphaned entry titles (job/education title at bottom of page with bullets on next page)
- No section headings isolated at top of page with only 1–2 lines below
- No awkward whitespace gaps

### REQ-2052: Cover Letter Layout Verification
**Priority:** Must
**Description:** The compiled cover letter PDF shall be verified for layout correctness.
**Acceptance Criteria:**
- Exactly 1 page
- Signature block visible, not cut off or pushed to a second page
- Bullet list font matches surrounding body text

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

### REQ-2054: Build Artifact Cleanup
**Priority:** Should
**Description:** After final clean compile, auxiliary files (.aux, .log, .out) shall be deleted, keeping .tex and .pdf.
**Acceptance Criteria:**
- Only .tex and .pdf files remain after cleanup

### REQ-2055: Layout-Fix Memory Cache
**Priority:** Should
**Description:** The system shall persist learned layout fixes in a structured cache at `.agents/state/layout-fixes.json` so that fixes derived during one application can be reused in subsequent applications using the same template. This is the layout-fix memory differentiator (DEC-010).
**Acceptance Criteria:**
- Cache file lives at `.agents/state/layout-fixes.json` (gitignored)
- Each cache entry has the shape: `{ "template_id": string, "issue_signature": string, "fix_snippet": string, "applied_count": integer, "last_used": ISO-8601 date }`
- `template_id` is the filename of the LaTeX template (e.g., `main.tex`, `cover.cls`)
- `issue_signature` is a normalized description of the issue type (e.g., `orphaned-cventry`, `cover-letter-overflow`, `font-mismatch-itemize`)
- The fix loop (REQ-2053) reads the cache before each LLM call; a cache hit skips the LLM call for that fix
- The cache is written atomically (tempfile + fsync + rename) per NFR-0016
- Entries older than 90 days with `applied_count = 0` are pruned at session start
- Cache size is capped at 200 entries; LRU eviction applies when cap is exceeded

**Cross-references:** DEC-010, REQ-2053, NFR-0016

---

## Step 6: Final Presentation

### REQ-2060: Verification Checklist
**Priority:** Must
**Description:** The drafter shall run the full verification checklist exactly once, at the end of the workflow.
**Acceptance Criteria:**
- Both files re-read once to verify final state on disk
- Checklist covers: factual accuracy (all claims match profile, dates correct, company claims verified), targeting (profile statement tailored, skills reframed, key requirements addressed), consistency (CV format correct, template used, tone consistent, no contradictions), quality (no LaTeX errors, no spelling/grammar errors, AI tool references correct, addressee correct)
- Each item reported as pass/fail

### REQ-2061: Key Tailoring Summary
**Priority:** Must
**Description:** The system shall summarize 3–5 key tailoring decisions made for this application.
**Acceptance Criteria:**
- What was emphasized and why
- Company-specific angles incorporated
- Most impactful reviewer suggestions
- Gaps acknowledged or reframed

### REQ-2062: File Listing
**Priority:** Must
**Description:** The system shall list all files created and invite user review.
**Acceptance Criteria:**
- Lists CV and cover letter file paths
- Tells user: "Both files are ready for your review"

## Step 7: ATS Exports & Provenance

### REQ-2063: ATS-Safe CV Exports
**Priority:** Should
**Description:** In addition to the polished LaTeX-compiled PDF (which remains the primary, human-facing output and is not replaced), the system shall produce ATS-safe export variants of the CV from the same content model: a **plain-text** (`.txt`) variant and a **`.docx`** variant. The PDF is for human reviewers; the TXT and DOCX exist so applicant-tracking-system parsers — which can choke on typeset PDFs and often prefer Word/plain text — recover the content reliably.
**Acceptance Criteria:**
- The polished LaTeX PDF is always produced (existing behavior preserved — REQ-2020, REQ-2050)
- A `.txt` export and a `.docx` export are generated from the same tailored content (single source of truth — no divergent re-authoring)
- ATS exports use a single-column, plain reading order: standard section headings, no text in images, no multi-column tables, no letter-spacing tricks
- The three artifacts are content-equivalent (same claims, same wording); only formatting differs
- ATS exports honor the active locale pack (REQ-7010) for section terms and included fields
- No fabrication: exports contain exactly the claims in the PDF (ARCH-0007)

### REQ-2064: ATS Parse Self-Check
**Priority:** Should
**Description:** The system shall verify that the generated CV is machine-parseable by extracting text back out of the compiled PDF and asserting that key fields are recoverable, warning the user if not.
**Acceptance Criteria:**
- Extracts text from the generated PDF and checks recoverability of: candidate name, contact details, section headers, and top skills/keywords targeted for the role
- If a field is not recoverable, the system warns the user and points to the `.txt`/`.docx` export as the ATS-safe fallback
- The check never blocks delivery — it informs (ARCH-0006); failure to run degrades gracefully (ARCH-0005)
- Result is reported as part of the final presentation

### REQ-2065: Fabrication Audit Artifact
**Priority:** Must
**Description:** The verification step shall emit a fabrication-audit artifact that maps every substantive CV claim to the profile file (and location) that backs it, and flags any claim not traceable to the profile for user attention rather than shipping it silently. This makes the existing no-fabrication guarantee (ARCH-0007, REQ-2023) demonstrable rather than implicit.
**Acceptance Criteria:**
- Produces a claim → backing-source ledger (each substantive CV/cover-letter claim linked to the profile file/section it derives from)
- Any claim without a profile-backed source is flagged to the user, not silently included
- Builds on the existing interview-backtrack test (REQ-2023) — a flagged claim is one that would fail it
- The audit never invents a source; if backing is uncertain, it says so honestly (ARCH-0007)
- The audit runs as part of the verification checklist (REQ-2060)

### REQ-2066: Provenance Surfacing
**Priority:** Should
**Description:** The system shall surface the fabrication audit to the user in the `/apply` output and as a per-application "Provenance" panel in the tracking dashboard, so the user can see, for every line of their CV, where it came from.
**Acceptance Criteria:**
- `/apply` presentation includes a readable summary of the fabrication audit (REQ-2065)
- The dashboard renders a per-application Provenance panel sourced from the audit artifact (file-as-DB; read-only)
- Flagged (unbacked) claims are visually distinct so the user can review them before submitting
- No personal data leaves the machine to render provenance (NFR-0017 local-first)
