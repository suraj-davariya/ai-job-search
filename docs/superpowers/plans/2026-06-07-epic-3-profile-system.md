# Epic 3: Profile System (Skill Files) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `job-application-assistant` skill — a SKILL.md orchestrator plus seven companion profile files — that holds all candidate data and framework knowledge the `/setup`, `/apply`, and related workflows depend on.

**Architecture:** These are **Plane 1 (knowledge-only) Claude Code skill files** under `.claude/skills/job-application-assistant/` (ARCH-0008, DEC-013). The SKILL.md is the orchestrator/anchor (ARCH-0010, DEC-014): mandatory `name`/`description`/`allowed-tools` frontmatter, a body that lists trigger phrases, companion files, and sub-commands (REQ-6003). Two of the seven companions are **templates** with `[UPPER_SNAKE_CASE]` placeholder tokens that `/setup` later replaces (01 candidate-profile, 02 behavioral-profile); the other five are **static framework knowledge** (03 writing-style, 04 job-evaluation, 05 cv-templates, 06 cover-letter-templates, 07 interview-prep) whose framework sections survive `/reset`. No code, no build step — these are Markdown content files. "Tests" are structural `grep` checks asserting required sections, verbatim rules, and placeholder-token conventions are present.

**Tech Stack:** Markdown skill files. Bash + grep for structure verification. Git for commits. No test framework is introduced (consistent with "no global build step").

**Source-of-truth docs** (read before writing each file — the skill files are a *transformation* of this material into runtime-facing format, never invented content):
- `docs/requirements/data-requirements.md` §1–§7 — per-file schema (required attributes, lifecycle)
- `docs/requirements/business-rules-and-validation.md` §1–§5 — scoring, page budgets, writing-quality rules, verification checklist
- `docs/requirements/functional-requirements-framework-meta.md` REQ-6003 — sub-commands the SKILL.md must list
- `docs/requirements/functional-requirements-onboarding.md` REQ-0016 — files-generated convergence, placeholder replacement
- `docs/architecture/component-design.md` ARCH-0010 (Profile Manager), ARCH-0030 (Application Pipeline 6 steps)
- `docs/glossary.md` — canonical terms (SKILL.md Orchestrator, Allowed-Tools, Two-Plane Skill Architecture)
- Existing LaTeX assets to reference by exact path: `cv/cfcv.cls`, `cv/main_example.tex` (compiler: **lualatex**); `cover_letters/cfcl.cls`, `cover_letters/main_example.tex`, `cover_letters/OpenFonts/fonts/` (compiler: **xelatex**)

**Cross-cutting invariants every file must respect:**
- Placeholder tokens use `[UPPER_SNAKE_CASE]` form (data-requirements §1.6), e.g. `[YOUR_NAME]`, `[JOB_TITLE]`.
- No fabrication (ARCH-0007): template files carry tokens, not invented sample data.
- Default AI tool name is **Claude Code** unless the profile overrides it (business-rules §4.4 / DEC-017).
- File names are exactly `01-`…`07-` prefixed as in data-requirements §1–§7.

**Pre-flight (do once before Task 1):** Confirm the target dir exists and is empty except `.gitkeep`.
Run: `ls -a .claude/skills/job-application-assistant/`
Expected: `.` `..` `.gitkeep` only. (Created by T-001.)

---

### Task 1 (T-020): SKILL.md orchestrator

**Files:**
- Create: `.claude/skills/job-application-assistant/SKILL.md`
- Read first: `docs/architecture/component-design.md` (ARCH-0010, ARCH-0030), `docs/requirements/functional-requirements-framework-meta.md` (REQ-6003), `docs/glossary.md` ("SKILL.md Orchestrator", "Allowed-Tools")

- [ ] **Step 1: Structure check (expect FAIL — file absent)**

Run:
```bash
f=.claude/skills/job-application-assistant/SKILL.md
test -f "$f" && \
grep -q '^name: job-application-assistant' "$f" && \
grep -q '^description:' "$f" && \
grep -q '^allowed-tools:' "$f" && \
grep -q 'Evaluate this job posting' "$f" && \
grep -q 'Write a CV for' "$f" && \
grep -q 'Write a cover letter for' "$f" && \
grep -q 'Prepare for interview with' "$f" && \
grep -q '01-candidate-profile.md' "$f" && \
grep -q '07-interview-prep.md' "$f" && \
echo "PASS" || echo "FAIL"
```
Expected: `FAIL`

- [ ] **Step 2: Write `SKILL.md`**

Required frontmatter (YAML):
- `name: job-application-assistant`
- `description:` one sentence naming what the skill does AND its trigger phrases, so Claude Code activates it on job-application intents (e.g. "Tailors CVs and cover letters, evaluates job fit, and prepares interviews. Activates on: applying to a job, evaluating a posting, writing a CV/cover letter, interview prep.")
- `allowed-tools:` list exactly: `Read, Edit, Write, Bash, Glob, Grep, WebSearch` (knowledge plane reads profile files, writes `.tex`, compiles via Bash, researches companies via WebSearch). Per ARCH-0010 / NFR-0018 the runtime rejects tools not listed; compose with `.claude/settings.local.json`.

Required body sections (in order):
1. **Purpose** — 1 paragraph: this skill is the knowledge anchor for the application workflow (ARCH-0010).
2. **Trigger phrases** — bullet list of natural-language phrases that activate the skill (apply to job, evaluate posting, tailor CV, write cover letter, prep interview).
3. **Companion files** — a table listing all seven files `01-candidate-profile.md` … `07-interview-prep.md` with a one-line "when to read" for each. Must name all seven filenames verbatim.
4. **Sub-commands (REQ-6003)** — table with exactly these four rows, each mapping the entry phrase to its pipeline step:
   - "Evaluate this job posting" → Step 1 (fit evaluation, read `04-job-evaluation.md`)
   - "Write a CV for [company]" → Step 2 (CV, read `05-cv-templates.md`)
   - "Write a cover letter for [company]" → Step 3 (cover letter, read `06-cover-letter-templates.md`)
   - "Prepare for interview with [company]" → Step 4 (read `07-interview-prep.md`)
   State that each sub-command runs with or without upstream steps; if upstream context is missing it prompts "I need <X> first; want me to run that step now?" (never silent failure / never fabricate). All sub-commands share `03-writing-style.md` rules, the no-fabrication rule (ARCH-0007), and the verification checklist.
5. **Contract** — bullets: read-before-write; respect `[UPPER_SNAKE_CASE]` tokens; default AI tool name "Claude Code" (DEC-017); never fabricate (ARCH-0007).

- [ ] **Step 3: Structure check (expect PASS)**

Run the Step-1 command. Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/job-application-assistant/SKILL.md
git commit -m "feat(profile): add job-application-assistant SKILL.md orchestrator (T-020, REQ-6003, ARCH-0010)"
```

---

### Task 2 (T-021): 01-candidate-profile.md (template)

**Files:**
- Create: `.claude/skills/job-application-assistant/01-candidate-profile.md`
- Read first: `docs/requirements/data-requirements.md` §1 and §1.6

- [ ] **Step 1: Structure check (expect FAIL)**

Run:
```bash
f=.claude/skills/job-application-assistant/01-candidate-profile.md
test -f "$f" && \
grep -q '\[YOUR_NAME\]' "$f" && \
grep -q '\[EMAIL\]' "$f" && \
grep -Eq '^## (Identity|Contact)' "$f" && \
grep -q '## Education' "$f" && \
grep -q '## Professional Experience' "$f" && \
grep -q '## Technical Skills' "$f" && \
grep -q '## References' "$f" && \
echo "PASS" || echo "FAIL"
```
Expected: `FAIL`

- [ ] **Step 2: Write `01-candidate-profile.md`**

A **template** populated by `/setup`; ship it with `[UPPER_SNAKE_CASE]` placeholder tokens, NOT sample data (ARCH-0007). Required sections and tokens drawn verbatim from data-requirements §1 table + §1.6:
- **Identity / Contact:** `[YOUR_NAME]`, `[LOCATION]` (address, city, country), `[PHONE]`, `[EMAIL]`, `[LINKEDIN_URL]`, `[GITHUB_URL]`, `[LANGUAGES]` (list of language + proficiency), `[EMPLOYMENT_STATUS]`, `[CONSTRAINTS]`.
- **Education** — repeatable block per data-requirements EducationEntry: `[DEGREE]`, `[FIELD]`, `[PERIOD]`, `[INSTITUTION]`, `[KEY_TOPICS]`, `[THESIS]` (optional). Reverse-chronological note.
- **Professional Experience** — repeatable per ExperienceEntry: `[JOB_TITLE]`, `[COMPANY]`, `[PERIOD]`, `[ROLE_LOCATION]`, `[RESPONSIBILITIES_ACHIEVEMENTS]` (bulleted). Reverse-chronological note.
- **Independent Projects** (optional): `[PROJECT_NAME]`, `[PROJECT_DESCRIPTION]`.
- **Technical Skills** — four labeled categories: Primary `[YOUR_PRIMARY_SKILLS]`, Secondary `[SECONDARY_SKILLS]`, Domain `[DOMAIN_SKILLS]`, Tools `[TOOLS]`.
- **Publications** (optional): `[PUBLICATION]`.
- **Awards** (optional): `[AWARD]`.
- **References** — list of `[REFERENCE_NAME]`, `[REFERENCE_TITLE]`, `[REFERENCE_COMPANY]`, `[REFERENCE_CONTACT]`.
- **AI Tool Override** (optional, DEC-017): `[AI_TOOL_NAME]` — note that if blank, "Claude Code" is the default.

Add a top-of-file HTML comment: `<!-- Template — /setup replaces [UPPER_SNAKE_CASE] tokens. Lifecycle: created by /setup, extended by /expand (additive), cleared by /reset. -->`

- [ ] **Step 3: Structure check (expect PASS).** Run Step-1 command. Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/job-application-assistant/01-candidate-profile.md
git commit -m "feat(profile): add 01-candidate-profile template (T-021, data-req §1)"
```

---

### Task 3 (T-022): 02-behavioral-profile.md (template)

**Files:**
- Create: `.claude/skills/job-application-assistant/02-behavioral-profile.md`
- Read first: `docs/requirements/data-requirements.md` §2; `docs/requirements/functional-requirements-onboarding.md` REQ-0010 (inferred-item labeling)

- [ ] **Step 1: Structure check (expect FAIL)**

Run:
```bash
f=.claude/skills/job-application-assistant/02-behavioral-profile.md
test -f "$f" && \
grep -q '## Overview' "$f" && \
grep -q '## Strongest Behaviors' "$f" && \
grep -q '## Work Preferences' "$f" && \
grep -q '## Growth Areas' "$f" && \
grep -q '## Posting Language Mapping' "$f" && \
grep -q 'Inferred from' "$f" && \
echo "PASS" || echo "FAIL"
```
Expected: `FAIL`

- [ ] **Step 2: Write `02-behavioral-profile.md`**

Template with `[UPPER_SNAKE_CASE]` tokens. Sections from data-requirements §2 table:
- **Overview** — `[BEHAVIORAL_OVERVIEW]` (1–2 sentence summary with profile type).
- **Core Behavioral Drives** (optional) — table `[DRIVE]` / `[LEVEL]` / `[MEANING]`.
- **Strongest Behaviors** — list of `[BEHAVIOR]` / `[BEHAVIOR_DESCRIPTION]`.
- **Work Preferences** — list of `[PREFERENCE]`.
- **Growth Areas** — list of `[GROWTH_AREA]` / `[POSITIVE_FRAMING]`.
- **Posting Language Mapping** — two lists: `[STRONG_FIT_KEYWORDS]`, `[POTENTIAL_FRICTION_KEYWORDS]`.
- **Management Style Preferences** — list of `[MGMT_PREFERENCE]`.
- **Application Usage** — guidance per document type (`[USAGE_CV]`, `[USAGE_COVER_LETTER]`).

Must include the verbatim inferred-item label convention from REQ-0010 so `/setup`/`/expand` can append inferred items without overwriting scored ones: `*[Inferred from <source> — review before relying on this]*`. Add a note: scored assessments are never overwritten by inference.

Top comment: `<!-- Template — /setup populates; /expand appends labeled inferred items; scored assessments never overwritten by inference (REQ-0010). -->`

- [ ] **Step 3: Structure check (expect PASS).** Run Step-1 command. Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/job-application-assistant/02-behavioral-profile.md
git commit -m "feat(profile): add 02-behavioral-profile template (T-022, data-req §2, REQ-0010)"
```

---

### Task 4 (T-023): 03-writing-style.md (static framework)

**Files:**
- Create: `.claude/skills/job-application-assistant/03-writing-style.md`
- Read first: `docs/requirements/data-requirements.md` §3; `docs/requirements/business-rules-and-validation.md` §4 (all subsections)

- [ ] **Step 1: Structure check (expect FAIL)**

Run:
```bash
f=.claude/skills/job-application-assistant/03-writing-style.md
test -f "$f" && \
grep -q '## Critical Rules' "$f" && \
grep -qi 'No em-dashes' "$f" && \
grep -qi 'Interview Backtrack Test' "$f" && \
grep -q 'Claude Code' "$f" && \
grep -q '## Cover Letter Structure' "$f" && \
grep -q '## Forward-Looking Framing' "$f" && \
echo "PASS" || echo "FAIL"
```
Expected: `FAIL`

- [ ] **Step 2: Write `03-writing-style.md`**

**Static framework — no placeholder tokens, no user data.** Carry these rules over from business-rules §4 + data-requirements §3. The following MUST appear verbatim in substance:
- **Critical Rules (Absolute Prohibitions)** — table from business-rules §4.1: No em-dashes (`--`); no clichés/filler ("I am passionate about", "hit the ground running", "leverage my skills"); no generic buzzwords without backing; no apologetic language; no unverified company claims; no fabricated skills/experience.
- **Tone Guidelines** — warm but direct, conversational professional.
- **Application Headline Formula** — subject-line construction pattern.
- **Scannable Structure Guidelines** — layout for quick reading.
- **Forward-Looking Framing Rules** — cover letter is NOT a CV repetition; address employer's needs.
- **Cover Letter Structure** — section-by-section: opening, body, motivation, company-specific, closing.
- **Bullet Point Style** — action verbs, specificity, variation.
- **Role-Type Language Variants** — technical / domain / consulting / leadership.
- **Multi-Language Rules** — language matching and localization.
- **Interview Backtrack Test** (business-rules §4.2) — verbatim test: *"Could the candidate comfortably explain this in an interview without having to say 'well, what I actually meant was…'?"* with Keep / Flag-it / Rewrite outcomes.
- **Reframing Boundaries** (business-rules §4.3) — Acceptable / Flag It / Never table.
- **Tool Naming Rule** (business-rules §4.4 / DEC-017) — specific tool name always; default **Claude Code**; profile may override; never "an AI assistant" / "AI coding tools".

Top comment: `<!-- Static framework — preserved through /reset; not modified by /setup. Path A may append observed patterns only if ≥2 cover letters exist (REQ-0011). -->`

- [ ] **Step 3: Structure check (expect PASS).** Run Step-1 command. Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/job-application-assistant/03-writing-style.md
git commit -m "feat(profile): add 03-writing-style framework (T-023, business-rules §4)"
```

---

### Task 5 (T-024): 04-job-evaluation.md (framework + user areas)

**Files:**
- Create: `.claude/skills/job-application-assistant/04-job-evaluation.md`
- Read first: `docs/requirements/data-requirements.md` §4; `docs/requirements/business-rules-and-validation.md` §1 (all subsections)

- [ ] **Step 1: Structure check (expect FAIL)**

Run:
```bash
f=.claude/skills/job-application-assistant/04-job-evaluation.md
test -f "$f" && \
grep -q '30%' "$f" && grep -q '25%' "$f" && grep -q '15%' "$f" && \
grep -qi 'Technical Skills Match' "$f" && \
grep -qi 'Career Alignment' "$f" && \
grep -q '75+' "$f" && \
grep -qi 'Strong Fit' "$f" && \
grep -qi 'Output Format' "$f" && \
echo "PASS" || echo "FAIL"
```
Expected: `FAIL`

- [ ] **Step 2: Write `04-job-evaluation.md`**

Framework structure is static; the skill/experience areas and career goals are `[UPPER_SNAKE_CASE]` tokens populated by `/setup`. Content from business-rules §1 + data-requirements §4. MUST include verbatim:
- **Scoring Dimensions** table (business-rules §1.1): Technical Skills Match **30%**, Experience Match **25%**, Behavioral/Culture Fit **15%**, Career Alignment **30%** (each 0–100); Location & Logistics — Pass/Fail deal-breaker.
- **Score Interpretation** rubric table (business-rules §1.2) — the 80–100 / 60–79 / 40–59 / 0–39 rows per dimension.
- **Verdict Thresholds** (business-rules §1.3): **75+** Strong Fit (definitely apply); **60–74** Good Fit (apply, address gaps); **45–59** Moderate Fit (consider carefully); **30–44** Weak Fit (probably skip); **<30** Poor Fit (skip).
- **Motivation Evaluation** (business-rules §1.4) — energizing vs draining tasks (user tokens `[ENERGIZING_TASKS]`, `[DRAINING_TASKS]`), plus non-task factors.
- **Location Filter Rules** (business-rules §1.5) — PASS / PASS / FAIL / FLAG zone table.
- **Skill Match Areas** — three user-populated categories: `[STRONG_SKILLS]`, `[MODERATE_SKILLS]`, `[WEAK_SKILLS]`.
- **Experience Match Areas** — `[STRONG_EXPERIENCE]`, `[MODERATE_EXPERIENCE]`, `[ENTRY_EXPERIENCE]`.
- **Career Goals** — `[CAREER_GOALS]` list.
- **Salary Benchmark Integration** — note the `salary_lookup.py` invocation pattern (tool wired in Epic 7; reference only here).
- **Output Format** — a structured evaluation table template (Dimension | Score | Weight | Notes) ending in weighted total + verdict.
- **Pre-Application Call Guidance** — when/how to contact employers before applying.

Top comment: `<!-- Framework static (preserved through /reset). Skill/experience areas + career goals = tokens populated by /setup, cleared by /reset. -->`

- [ ] **Step 3: Structure check (expect PASS).** Run Step-1 command. Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/job-application-assistant/04-job-evaluation.md
git commit -m "feat(profile): add 04-job-evaluation framework (T-024, business-rules §1)"
```

---

### Task 6 (T-025): 05-cv-templates.md (LaTeX guide + tailoring)

**Files:**
- Create: `.claude/skills/job-application-assistant/05-cv-templates.md`
- Read first: `docs/requirements/data-requirements.md` §5; `docs/requirements/business-rules-and-validation.md` §2 (page budget + relevance-weighted cutting); existing `cv/cfcv.cls` and `cv/main_example.tex`

- [ ] **Step 1: Structure check (expect FAIL)**

Run:
```bash
f=.claude/skills/job-application-assistant/05-cv-templates.md
test -f "$f" && \
grep -q 'cfcv.cls' "$f" && \
grep -q 'lualatex' "$f" && \
grep -qi '2-page' "$f" && \
grep -qi 'Relevance-Weighted Cutting' "$f" && \
grep -qi 'compile' "$f" && \
echo "PASS" || echo "FAIL"
```
Expected: `FAIL`

- [ ] **Step 2: Write `05-cv-templates.md`**

Static framework with `/setup`-populated profile-statement templates. Content from data-requirements §5 + business-rules §2. Reference the REAL files by exact path — do not paste the whole class. MUST include:
- **Template Definition** — point at `cv/cfcv.cls` (the CareerForge CV class) and `cv/main_example.tex` as the working example; state the document is compiled with **lualatex** (ARCH-0003). Name the `\cvachievement{icon}{title}{date}{description}` and `\cfcvtag` commands from the class so the generator uses them correctly.
- **Color Override Rules** — the class defines `accent`=DodgerBlue; keep the blue scheme consistent.
- **Spacing Rules** — no inter-item `\vspace` inside itemize; "if in doubt, cut rather than squeeze."
- **Profile Statement Templates** — per-role-type elevator-pitch variants with tokens (`[PROFILE_STATEMENT_TECHNICAL]`, `[PROFILE_STATEMENT_DOMAIN]`, etc.), populated by `/setup`.
- **Section Tailoring Guidelines** — per-section customization guidance.
- **Employment Gap Handling.**
- **Page Budget** — the business-rules §2.1 section-budget table (profile 3–4 lines; core competencies 5 items; recent role 4–5 bullets; etc.); **hard 2-page limit, no exceptions.**
- **Relevance-Weighted Cutting** — the §2.2 algorithm: score each line on Relevance / Uniqueness / Narrative Load; cut lowest-total first regardless of section. Include §2.3 practical cutting order and §2.4 pitfalls (don't cut the line the cover letter depends on; prefer `\enlargethispage` for 2.02-page overflow).
- **Compile-and-Inspect Instructions** — mandatory step: `cd cv && lualatex main_<company>.tex`, inspect the PDF, verify exactly 2 pages, no orphaned titles.
- **Section Order Variants** — technical vs domain-specific ordering.

Top comment: `<!-- Framework static (preserved through /reset). Profile-statement templates = tokens populated by /setup. CV compiles with lualatex (ARCH-0003). -->`

- [ ] **Step 3: Structure check (expect PASS).** Run Step-1 command. Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/job-application-assistant/05-cv-templates.md
git commit -m "feat(profile): add 05-cv-templates guide (T-025, data-req §5, business-rules §2)"
```

---

### Task 7 (T-026): 06-cover-letter-templates.md (LaTeX guide + tailoring)

**Files:**
- Create: `.claude/skills/job-application-assistant/06-cover-letter-templates.md`
- Read first: `docs/requirements/data-requirements.md` §6; `docs/requirements/business-rules-and-validation.md` §3; existing `cover_letters/cfcl.cls`, `cover_letters/main_example.tex`, `cover_letters/README.md`

- [ ] **Step 1: Structure check (expect FAIL)**

Run:
```bash
f=.claude/skills/job-application-assistant/06-cover-letter-templates.md
test -f "$f" && \
grep -q 'cfcl.cls' "$f" && \
grep -q 'xelatex' "$f" && \
grep -qi '1-page\|one page\|1 page' "$f" && \
grep -q '250' "$f" && grep -q '300' "$f" && \
grep -qi 'Finalization Checklist' "$f" && \
echo "PASS" || echo "FAIL"
```
Expected: `FAIL`

- [ ] **Step 2: Write `06-cover-letter-templates.md`**

Static framework. Content from data-requirements §6 + business-rules §3. Reference real files by exact path. MUST include:
- **Template Definition** — point at `cover_letters/cfcl.cls` and `cover_letters/main_example.tex`; fonts bundled at `cover_letters/OpenFonts/fonts/` (Lato, Raleway, FontAwesome 6 Free); compiled with **xelatex** (ARCH-0003).
- **Compile Instructions** — `cd cover_letters && xelatex main_<company>.tex` (path matters for font loading); known pitfall: the itemize/fontspec bullet-font pattern (bullet font must match body font).
- **Document Structure** — the LaTeX skeleton, referencing the class's key commands (pull the real command names from `cfcl.cls` / `main_example.tex`).
- **Key Commands Reference** — table of template-specific commands.
- **Tailoring Guidelines** — salutation (named person or "Dear Hiring Manager"), length, bullets, language matching.
- **Length Constraints** (business-rules §3.1) — **hard 1-page limit including signature**; body **250–300 words**, 300 is the ceiling, 350 overflows; 3 blocks (opening + bullets + closing), add a 4th only if others are short; when adding company-specific content, trim elsewhere.
- **Cutting Rules** (business-rules §3.2) — cut restating sentences first, then non-keyword bullets, then (last resort) keyword bullets; never reduce geometry/line spacing.
- **Finalization Checklist** — pre-submission quality checks (1 page, signature visible, bullet font matches body, addressed correctly).
- **Submission Guidelines** — file naming, format, anonymity.

Top comment: `<!-- Static framework — not modified by /setup or /reset. Cover letter compiles with xelatex (ARCH-0003). -->`

- [ ] **Step 3: Structure check (expect PASS).** Run Step-1 command. Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/job-application-assistant/06-cover-letter-templates.md
git commit -m "feat(profile): add 06-cover-letter-templates guide (T-026, data-req §6, business-rules §3)"
```

---

### Task 8 (T-027): 07-interview-prep.md (STAR framework + populated examples)

**Files:**
- Create: `.claude/skills/job-application-assistant/07-interview-prep.md`
- Read first: `docs/requirements/data-requirements.md` §7; `docs/requirements/functional-requirements-onboarding.md` REQ-0012 (STAR stubs)

- [ ] **Step 1: Structure check (expect FAIL)**

Run:
```bash
f=.claude/skills/job-application-assistant/07-interview-prep.md
test -f "$f" && \
grep -q '## STAR' "$f" && \
grep -qi 'Situation' "$f" && grep -qi 'Result' "$f" && \
grep -qi 'Tough Questions' "$f" && \
grep -qi 'Questions to Ask' "$f" && \
grep -q '\[STAR_' "$f" && \
echo "PASS" || echo "FAIL"
```
Expected: `FAIL`

- [ ] **Step 2: Write `07-interview-prep.md`**

Framework content is static; ready-made STAR examples are `/setup`-populated tokens. Content from data-requirements §7. MUST include:
- **STAR Format Definition** — Situation / Task / Action / Result structure with guidance.
- **Ready-Made STAR Examples** — repeatable token block per STARExample: `[STAR_TITLE]`, `[STAR_SKILL]`, `[STAR_SITUATION]`, `[STAR_TASK]`, `[STAR_ACTION]`, `[STAR_RESULT]`, `[STAR_QUESTION_TYPES]`. Note `/setup` fills 3–6 of these.
- **STAR Candidates (stubs)** — per STARStub from REQ-0012: `[STUB_TITLE]`, `[STUB_SOURCE]`, `[STUB_WHAT_HAPPENED]`, `[STUB_WHY_IT_MATTERS]`, empty S/T/A/R. Note: Path A creates stubs (never fabricates S/T/A/R from inference — ARCH-0007); user completes them.
- **Tough Questions** — common difficult questions with framing guidance.
- **Questions to Ask** — categorized: role, team, tech, culture.
- **Phone/Video Tips.**
- **Follow-Up Etiquette.**
- **Roleplay Guidelines** — how to run a practice session.

Top comment: `<!-- STAR examples populated by /setup, cleared by /reset; framework content preserved through reset. Stubs (REQ-0012) are user-completed; never fabricate S/T/A/R. -->`

- [ ] **Step 3: Structure check (expect PASS).** Run Step-1 command. Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/job-application-assistant/07-interview-prep.md
git commit -m "feat(profile): add 07-interview-prep framework (T-027, data-req §7, REQ-0012)"
```

---

### Task 9: Epic-wide verification

**Files:** none created — verification only.

- [ ] **Step 1: All eight files present and pass their structure checks**

Run:
```bash
d=.claude/skills/job-application-assistant
ls "$d"/SKILL.md "$d"/0{1,2,3,4,5,6,7}-*.md && echo "ALL 8 PRESENT"
```
Expected: lists SKILL.md + `01-`…`07-` (8 files), prints `ALL 8 PRESENT`.

- [ ] **Step 2: Placeholder-token convention holds (template files only)**

Templates (01, 02) and the populated sections of 04/05/07 must use `[UPPER_SNAKE_CASE]`. Confirm no lowercase-token leakage like `[your_name]`:
```bash
! grep -rEn '\[[a-z][a-z_]*\]' .claude/skills/job-application-assistant/ && echo "TOKENS OK"
```
Expected: `TOKENS OK` (no lowercase bracket tokens).

- [ ] **Step 3: No fabricated personal data in template files**

Spot-check 01/02 contain tokens, not invented names/emails:
```bash
grep -q '\[YOUR_NAME\]' .claude/skills/job-application-assistant/01-candidate-profile.md && \
! grep -qiE '@(gmail|outlook|yahoo)\.com' .claude/skills/job-application-assistant/01-candidate-profile.md && \
echo "NO FABRICATION"
```
Expected: `NO FABRICATION`

- [ ] **Step 4: Working tree clean, all committed**

```bash
git status --short
```
Expected: empty output (all eight files committed across Tasks 1–8).

---

## Self-Review (completed by plan author)

**1. Spec coverage** — data-requirements §1–§7 each map to Tasks 2–8; SKILL.md orchestrator (ARCH-0010, glossary) + sub-commands (REQ-6003) → Task 1; business-rules §1 → Task 5, §2 → Task 6, §3 → Task 7, §4 → Task 4; placeholder-token convention (data-req §1.6, REQ-0016) enforced in Task 9. WBS T-020…T-027 all covered (one task each). No gaps.

**2. Out of scope (correctly excluded)** — `CLAUDE.md.template` (Role B) is WBS T-036 / Epic 4, not Epic 3. `.claude/skills/job-scraper/search-queries.md` is Epic 8. The `/setup` command that *populates* these tokens is Epic 4. This plan ships the **empty-but-structured** skill files only.

**3. Placeholder scan** — All `[UPPER_SNAKE_CASE]` occurrences in this plan are intentional skill-file template tokens, not plan placeholders. No "TBD"/"implement later"/"add error handling" strings. Each write-step enumerates exact required sections + verbatim rules.

**4. Consistency** — Filenames `01-`…`07-` and `SKILL.md` match data-requirements §1–§7 and WBS exactly. Compilers consistent (CV=lualatex, CL=xelatex per ARCH-0003). Weights 30/25/15/30 consistent between data-req §4 and business-rules §1.1. Default tool name "Claude Code" consistent (Tasks 1, 4).
