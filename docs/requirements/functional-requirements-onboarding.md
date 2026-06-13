# Functional Requirements — Onboarding

> **Purpose:** Specifies the requirements for CareerForge's profile onboarding system, competency expansion, and profile reset capabilities.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## Overview

The onboarding system populates the user's seven profile files through one of three convergent paths. Once populated, the profile can be incrementally enriched via competency expansion or reset for a fresh start.

Related documents:
- [Personas & Actors](personas-and-actors.md) — Who uses these features
- [Data Requirements](data-requirements.md) — Profile file schemas
- [User Flows](user-flows.md) — Step-by-step journeys
- [Business Rules](business-rules-and-validation.md) — Validation and merge logic

---

## 1. Profile Setup (`/setup`)

### REQ-0001: Path Selection
**Priority:** Must
**Description:** On invocation, the system shall detect whether the user's document folder contains files and present three onboarding paths with appropriate recommendations.
**Acceptance Criteria:**
- If document folder has files in ≥1 subfolder, Path A is recommended
- If document folder is empty, Path A is presented as a "populate first" option
- User can choose any path regardless of folder state
- If `--section <name>` argument is provided, system skips path selection and jumps to that section for an update-only flow
- Valid `--section` enum values: `identity`, `education`, `experience`, `skills`, `certifications`, `publications`, `awards`, `behavioral`, `search`, `salary`, `interview-prep`, `writing-style` (any valid profile section key)

### REQ-0002: Path A — Document Folder Scanning
**Priority:** Must
**Description:** The system shall read all supported files from the structured document folder, extract professional information, cross-reference across sources, and merge into profile files.
**Acceptance Criteria:**
- Scans all subfolders: cv/, linkedin/, diplomas/, references/, applications/
- Extracts structured data per subfolder (see REQ-0003 through REQ-0007)
- Reads existing profile files before writing (read-before-write)
- Operation is idempotent: re-running with same inputs produces no duplicates
- Changes already present are not proposed again

### REQ-0003: Document Extraction — CV
**Priority:** Must
**Description:** The system shall extract from CV documents: name, contact details, education entries, work experience entries, technical skills, publications, awards, and profile/summary text.
**Acceptance Criteria:**
- Supports PDF and LaTeX (.tex) formats
- Handles multiple CV files (cross-references for consistency)
- Extracts all structured sections listed

### REQ-0004: Document Extraction — LinkedIn
**Priority:** Should
**Description:** The system shall extract from LinkedIn profile exports: about/summary, work experience, education, skills and endorsements, certifications, volunteer work, publications, and recommendations.
**Acceptance Criteria:**
- Supports PDF format
- If multiple exports exist, uses most recently modified
- About/summary text is used for behavioral profile inference
- Recommendations enrich reference context

### REQ-0005: Document Extraction — Diplomas
**Priority:** Should
**Description:** The system shall extract from diploma/transcript documents: official degree title and level, institution name, graduation date, and grade/distinction if visible.
**Acceptance Criteria:**
- Supports PDF format
- Data used to verify education entries from CV/LinkedIn

### REQ-0006: Document Extraction — References
**Priority:** Should
**Description:** The system shall extract from reference letters: referee name, title, and organization; specific quotes; and competency language used.
**Acceptance Criteria:**
- Supports PDF, TXT, and Markdown formats
- Competency language feeds behavioral profile
- Specific quotes are stored with referee attribution

### REQ-0007: Document Extraction — Past Applications
**Priority:** Could
**Description:** The system shall extract from past application subfolders: job posting details, cover letter structure and patterns, CV profile statements, and application outcomes.
**Acceptance Criteria:**
- Each subfolder follows `<company>_<role>/` naming convention
- Extracts from: job_posting.md, cover_letter.tex, cv_draft.tex, outcome.md
- Writing patterns require ≥2 applications to be recorded
- Outcome data calibrates the evaluation framework

### REQ-0008: Cross-Reference Validation
**Priority:** Must
**Description:** After extracting all documents, the system shall check for inconsistencies across sources and present them for user resolution before proceeding.
**Acceptance Criteria:**
- Checks: date mismatches, title mismatches, education mismatches, employer name variations
- Each inconsistency is presented as a numbered item with both values shown
- User resolves each before system proceeds
- If no inconsistencies found, system states "No cross-reference issues found"

### REQ-0009: Additive vs. Conflicting Change Classification
**Priority:** Must
**Description:** The system shall classify all proposed profile changes as either additive (new content) or conflicting (disagrees with existing content) and present them separately.
**Acceptance Criteria:**
- Additive changes are presented as a grouped checklist by target file
- User can approve all additive changes or skip specific items
- Conflicting changes are presented one at a time with keep/replace/manual options
- No file writes occur until user confirms

### REQ-0010: Behavioral Profile Inference
**Priority:** Should
**Description:** When populating from inferred sources (LinkedIn about section, reference letters), behavioral additions shall be labeled as inferred.
**Acceptance Criteria:**
- Every inferred behavioral item includes label: *[Inferred from <source> — review before relying on this]*
- Items are added to appropriate sections without overwriting existing scored assessments
- Only appears in behavioral traits, work preferences, and management style sections

### REQ-0011: Writing Style Pattern Extraction
**Priority:** Could
**Description:** When past cover letter files are available, the system shall extract recurring writing patterns and add them as observations.
**Acceptance Criteria:**
- Requires ≥2 cover letters to identify genuine patterns
- Added under a dedicated patterns section, not as rules
- Does not modify existing writing style rules

### REQ-0012: STAR Example Stubs
**Priority:** Should
**Description:** When achievements are found in documents that are not covered by existing STAR examples, the system shall create stub entries for the user to complete. Stubs are load-bearing in Path A (DEC-016): they let the system be honest (no fabrication per ARCH-0007) while still capturing every achievement for the user to flesh out.
**Acceptance Criteria:**
- Stubs include: achievement title, source document, one-sentence description, applicable question types, and empty S/T/A/R fields
- Does NOT draft full STAR examples from inference (cannot fabricate Situation/Task/Action/Result without the candidate's first-person memory)
- User is notified of stubs needing completion

### REQ-0013: Path B — Single CV Import
**Priority:** Must
**Description:** The user shall be able to paste or reference a single CV document, from which the system extracts all available information and asks follow-up questions for gaps.
**Acceptance Criteria:**
- Accepts pasted text or file reference
- Extracts all structured information (same fields as REQ-0003)
- Identifies gaps and asks targeted follow-up questions (behavioral profile, career goals, deal-breakers, salary expectations, references)
- Proceeds to file generation after data collection is complete

### REQ-0014: Path C — Interactive Interview
**Priority:** Must
**Description:** The system shall walk the user through structured interview sections to collect profile information conversationally.
**Acceptance Criteria:**
- Nine sections in order: Identity, Education, Experience, Technical Skills, Publications/Awards (optional), Behavioral Profile (optional), Career Goals, References (optional), Job Search Configuration
- Questions are asked conversationally, not as a form
- User can skip optional sections
- Answers are synthesized into structured formats

### REQ-0015: Job Search Configuration
**Priority:** Must
**Description:** During onboarding (or via `--section search`), the system shall collect job search preferences and generate search queries.
**Acceptance Criteria:**
- Collects: role titles (3–8), key skills (3–5), target companies (optional), geographic scope with location filter tiers, preferred job portals
- System proactively suggests role types the user may not have considered based on their skill profile
- Generates prioritized search queries organized by category (Priority 1–4)
- Can be re-run independently without re-doing full profile setup

### REQ-0016: File Generation Convergence
**Priority:** Must
**Description:** All three onboarding paths shall converge on the same set of generated/updated files.
**Acceptance Criteria:**
- Files generated: CLAUDE.md (main profile), 7 skill files, CV template, search queries
- Path A skips skill files already populated by document extraction
- Placeholder tokens in all files are replaced with actual user data
- Summary of generated files is presented to the user

### REQ-0017: Completion Summary
**Priority:** Must
**Description:** After all files are generated, the system shall present a summary listing all files created and suggest next actions.
**Acceptance Criteria:**
- Lists every file created or updated
- Suggests running job search and applying to a test posting
- If Path A left STAR stubs, mentions count needing manual completion

---

## 2. Competency Expansion (`/expand`)

### REQ-0050: Source Scanning
**Priority:** Should
**Description:** The expand command shall scan all available sources for competency signals not already in the profile.
**Acceptance Criteria:**
- Scans in order: documents/cv, documents/linkedin, documents/diplomas, documents/references, GitHub profile, other URLs in profile (portfolio, Kaggle, Google Scholar)
- Reads existing profile files first to avoid duplicates
- For GitHub: fetches all public repositories (pinned and unpinned), reads READMEs, notes languages and topics

### REQ-0051: Web Enrichment
**Priority:** Should
**Description:** For each discovered experience item, the system shall search the web for associated competencies using both direct lookup and inference.
**Acceptance Criteria:**
- Direct lookup: searches for course syllabi, certification skills, tool documentation
- Inference: reasons about problem domain, required methods, standard toolchains
- Both approaches are applied together, not as alternatives
- Named courses and certifications are prioritized for web lookup

### REQ-0052: Competency Map
**Priority:** Should
**Description:** The system shall produce a deduplicated competency map grouped by category, with source tracing for each item.
**Acceptance Criteria:**
- Categories: Technical Skills — Primary, Technical Skills — Secondary, Domain Knowledge, Methods and Practices, Soft/Behavioral
- Each competency records: name, source item, discovery method (direct/inference/both)
- Items already in profile are removed
- Map is presented for user review before any writes

### REQ-0053: User Confirmation
**Priority:** Must
**Description:** The user shall confirm which competencies to add before any profile files are modified.
**Acceptance Criteria:**
- Options: "all" (add everything), "review" (walk through each group), "skip" (cancel), or specific groups to skip
- Nothing is written without confirmation

### REQ-0054: Additive-Only Writes
**Priority:** Must
**Description:** The expand command shall only add content to profile files; it shall never modify or remove existing content.
**Acceptance Criteria:**
- Each addition includes a source annotation (e.g., *(Coursera — Deep Learning Specialisation)*)
- Source annotations make future runs idempotent
- Behavioral signals are labeled as inferred

### REQ-0055: Expansion Report
**Priority:** Should
**Description:** After writing, the system shall present a summary of all additions, sources processed, sources skipped, and items needing manual review.
**Acceptance Criteria:**
- Report lists additions per file with sources
- Lists all sources scanned with competency counts
- Lists skipped sources with reasons
- Flags ambiguous or partially readable items

---

## 3. Profile Reset (`/reset`)

### REQ-0080: Scope Selection
**Priority:** Must
**Description:** The reset command shall support three scopes: `profile` (skill files only), `documents` (document folder contents), and `all` (both).
**Acceptance Criteria:**
- If no scope argument provided, system asks the user to choose
- Each scope is clearly described with what will be affected

### REQ-0081: Pre-Reset Inventory
**Priority:** Must
**Description:** Before any deletion, the system shall show exactly what will be cleared and what will be preserved.
**Acceptance Criteria:**
- For profile reset: shows each file and whether it has content or is already empty
- For documents reset: lists all files in each subfolder
- Explicitly lists files that are NOT touched (framework rules, README)
- If all target content is already empty, skips confirmation for that scope

### REQ-0082: Explicit Confirmation
**Priority:** Must
**Description:** The user must type exactly `RESET` (all caps) to confirm; any other input cancels the operation.
**Acceptance Criteria:**
- Prompt warns "This cannot be undone"
- Only exact string `RESET` proceeds; everything else cancels
- Cancel message confirms nothing was changed

### REQ-0083: Profile Reset Execution
**Priority:** Must
**Description:** Profile reset shall replace candidate-specific content with blank templates while preserving framework structure.
**Acceptance Criteria:**
- Candidate profile and behavioral profile: replaced with blank section headers
- CV templates: only profile statement templates cleared; LaTeX structure preserved
- Interview prep: only STAR examples cleared; framework, questions, and guidelines preserved
- Writing style guide, evaluation framework, and cover letter templates: NOT touched (framework rules)

### REQ-0084: Documents Reset Execution
**Priority:** Must
**Description:** Documents reset shall delete all user files from document subfolders while preserving folder structure and README.
**Acceptance Criteria:**
- Deletes files in: cv/, linkedin/, diplomas/, references/, applications/
- Preserves: folder structure, documents/README.md
- Applications subfolders are deleted recursively

### REQ-0085: Post-Reset Guidance
**Priority:** Must
**Description:** After reset, the system shall confirm what was cleared and suggest next steps based on what was reset.
**Acceptance Criteria:**
- Lists each file/folder actually modified vs. already empty
- Profile reset: suggests running `/setup`
- Documents reset: suggests adding documents and running `/setup`
- Both: suggests adding documents or using CV import/interview path, then `/setup`
