# CareerForge Glossary

> **Purpose:** Defines domain terms used throughout the CareerForge documentation suite. Ensures consistent language across requirements, architecture, plan, and development documents.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst (seeded Phase 1; updated each phase)

---

## A

**Application Pipeline**
The end-to-end workflow that takes a job posting as input and produces a tailored CV, cover letter, fit evaluation, and interview preparation materials as output. Composed of the drafter agent, reviewer agent, and compilation verification stages.

**Application Tracker**
A CSV-based record of all job applications the user has initiated or completed through CareerForge. Tracks company, role, status, fit rating, and file references. Used for deduplication during job search and for aggregate skill gap analysis.

**Application Status Enum**
Canonical set of seven status values used in the application tracker: `Draft, Sent, Interview, Offer, Rejected, Withdrawn, Closed`. Allowed transitions and the "muted" set for de-emphasized rendering are defined in `business-rules-and-validation.md §9`.

**Atomic CSV Write**
The tracking dashboard's write contract: read → mutate target cells → write to tempfile → fsync → rename over original, with a `.bak` retained. Guarantees readers and the `/apply` appender never see a partial file (NFR-0016).

**Allowed-Tools**
The frontmatter field on every `SKILL.md` (per ARCH-0010) listing the tools that skill is permitted to invoke. The runtime rejects tool calls not in this list. Composes with workspace `.claude/settings.local.json` per NFR-0018.

## B

**Behavioral Profile**
A structured document describing the user's work style, personality traits, strengths, growth areas, and ideal work environment. Can be populated from formal assessments (PI, DISC, Myers-Briggs, StrengthsFinder) or synthesized from interview responses and reference letters.

**Business Rules Engine**
The set of scoring frameworks, validation constraints, and decision logic that governs how CareerForge evaluates job fit, cuts CV content, and verifies application quality.

## C

**Candidate Profile**
The comprehensive structured record of the user's identity, education, professional experience, technical skills, publications, awards, and references. The canonical source of truth for all application materials.

**Competency Expansion**
The process of discovering skills and knowledge implied by the user's documents and online presence that are not explicitly listed in their profile. Sources include course syllabi, GitHub repositories, reference letters, and portfolio sites.

**Compile-and-Inspect Loop**
A mandatory verification step where generated LaTeX documents are compiled to PDF and visually inspected for layout issues (orphaned entries, page overflow, font mismatches). The loop iterates until all layout checks pass.

**Content Cutting (Relevance-Weighted)**
An algorithm for reducing document length that scores each candidate line by (a) relevance to the target posting, (b) uniqueness within the document, and (c) narrative load (whether the cover letter depends on it). Lines with the lowest total score are cut first, regardless of section.

**Cross-Reference Check**
A validation step during onboarding that compares data across multiple source documents (CV, LinkedIn, diplomas) to identify and resolve inconsistencies in dates, titles, and education details.

## D

**Deal-Breaker**
A hard constraint on the user's job search (e.g., no relocation, minimum salary, specific work arrangement) that causes a job to be immediately disqualified regardless of other fit scores.

**Drafter Agent**
The primary AI agent responsible for evaluating job fit, generating tailored CVs and cover letters, and applying reviewer feedback. Operates within the application pipeline.

**Document Folder**
A structured directory where users place career source materials (CV, LinkedIn export, diplomas, reference letters, past applications) for automated profile population during onboarding.

## E

**Evaluation Framework**
The five-dimensional scoring system used to assess job fit: Technical Skills Match (30%), Experience Match (25%), Behavioral/Culture Fit (15%), Career Alignment (30%), and Location/Logistics (pass/fail).

## F

**Fit Assessment (Quick)**
A rapid, three-level classification (High/Medium/Low) of job-to-profile match used during job search results. Less detailed than the full evaluation framework.

**Fit Rating**
A numeric score (0–100) representing overall job-candidate match, computed as a weighted average of the evaluation framework dimensions.

**Forward-Looking Framing**
A writing principle for cover letters: focus on tasks the user can solve for the employer and the outcomes they will deliver, rather than repeating CV content about past duties.

## G

**Gap Heatmap**
A prioritized table of skill gaps between the user's profile and their tracked job postings (or a single target posting). Gaps are classified as Critical, High, Medium, or Low priority.

## I

**Idempotent Operation**
A property of CareerForge's onboarding and expansion commands: re-running them with the same inputs produces no duplicate content and does not overwrite existing data without explicit confirmation.

**Interview Backtrack Test**
A quality check for CV and cover letter claims: could the candidate comfortably explain this statement in an interview without having to say "well, what I actually meant was..."? If not, the claim is too aggressively reframed.

## J

**Job Portal Adapter**
A pluggable CLI tool that searches a specific job board (e.g., Indeed, LinkedIn, Glassdoor) and returns structured results. Each adapter follows a standard interface pattern so new portals can be added without modifying core logic.

## L

**Learning Plan**
A structured study guide produced by skill gap analysis, containing prioritized skills to learn, curated resources (courses, documentation, books), study directions tailored to the user's existing knowledge, and time estimates.

## N

**Named Sub-Agent**
A research-style agent defined at `.claude/agents/<agent-name>.md` with frontmatter (`name`, `description`, optional `model`) and a Markdown body as the system prompt (ARCH-0009). The `model:` field enables multi-model routing — e.g., `model: gemini` invokes a headless Gemini CLI. See REQ-6001 and DEC-015.

## O

**Onboarding**
The initial profile setup process. Three convergent paths: (A) document folder scanning, (B) single CV import with follow-up questions, (C) interactive interview. All paths produce the same set of populated profile files.

## P

**Profile Files**
The set of seven structured documents that define the user's professional identity:
1. Candidate Profile (skills, experience, education)
2. Behavioral Profile (work style, strengths, preferences)
3. Writing Style Guide (tone, rules, conventions)
4. Job Evaluation Framework (scoring dimensions, career goals)
5. CV Templates (LaTeX structure, profile statements)
6. Cover Letter Templates (LaTeX structure, tailoring guidelines)
7. Interview Preparation (STAR examples, tough questions, roleplay)

**Pipeline KPI**
Aggregate counts per application status plus average fit rating (last 30 days) and interviews-per-application rate (last 90 days); rendered in the dashboard summary strip (REQ-5003).

**Profile Statement**
A 3–5 line elevator pitch at the top of a CV, tailored to the specific role being applied for. Multiple templates are maintained for different role types.

## R

**Read-Only Mode**
Dashboard launch flag (`--read-only`) that disables all mutating routes and renders all edit controls as disabled. Used for screenshots, demos, and accidental-write protection (REQ-5007).

**Relevance-Weighted Cutting**
See: Content Cutting (Relevance-Weighted).

**Reviewer Agent**
A second AI agent spawned with a fresh context during the application pipeline. Researches the target company, critiques the drafter's CV and cover letter, and returns structured edits plus narrative suggestions. Does not perform verification — that is the drafter's responsibility.

## S

**Salary Benchmark**
An optional data lookup that compares a target company's compensation against a baseline from user-provided salary data. Supports index-based and absolute salary formats from any source (union statistics, survey data, personal research).

**Search Queries**
A structured set of web search queries organized by priority category, used by the job search engine to find matching positions across configured job portals. Queries include role titles, key skills, domain keywords, and geographic filters.

**Seen Jobs Registry**
A JSON-based state file that tracks all job postings previously encountered during searches. Used for deduplication across runs so the same posting is never presented twice.

**SKILL.md Orchestrator**
The canonical skill-anchor file at the root of every skill folder. Has mandatory frontmatter (`name`, `description`, `allowed-tools`) and a body that names trigger phrases, lists companion files, and describes the skill's contract (ARCH-0010, DEC-014).

**STAR Format**
A structured answer framework for behavioral interview questions: **S**ituation (context), **T**ask (responsibility), **A**ction (what was done), **R**esult (outcome). CareerForge maintains ready-made STAR examples drawn from the user's actual experience.

## T

**Tracking Dashboard**
Local web UI (Bun + Hono + HTMX + Pico.css per ADR-0005) over the application tracker CSV. Runs on `127.0.0.1` only. Allows status/notes edits and manual row append. See REQ-5xxx and ADR-0005.

**Two-Plane Skill Architecture**
Skills are split into two filesystem trees with different roles: Plane 1 (Claude Code skills at `.claude/skills/<name>/`, knowledge-only) and Plane 2 (sub-agent CLI skills at `.agents/skills/<name>/cli/`, external binaries). A skill is either Plane 1 or Plane 2, never both. See ARCH-0008 and DEC-013.

**Traceability**
The practice of linking every requirement to the architecture elements that satisfy it, the plan tasks that build it, and the test cases that verify it. Uses the ID scheme: `REQ-####`, `NFR-####`, `ARCH-####`, `ADR-####`, `RISK-####`, `TC-####`.

## V

**Verification Checklist**
A structured pass/fail checklist run once at the end of the application pipeline, covering: factual accuracy, targeting quality, consistency between CV and cover letter, LaTeX quality, and compiled PDF layout.

## W

**Workspace Settings**
The `.claude/settings.local.json` file in a user's workspace that declares which tools each skill (and the AI assistant itself) is allowed to use. Combines with skill-level `allowed-tools` to gate tool invocations (NFR-0018). Shipped as `.claude/settings.local.json.template` in the framework; gitignored per REQ-6002.
