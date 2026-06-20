# Functional Requirements — Career Development

> **Purpose:** Specifies the requirements for CareerForge's skill gap analysis, learning plan generation, and interview preparation capabilities.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## Overview

Career development features help users understand their market positioning, close skill gaps systematically, and prepare for interviews with structured, experience-grounded answers.

Related documents:
- [Functional Requirements — Onboarding](functional-requirements-onboarding.md) — Profile data that feeds analysis
- [Data Requirements](data-requirements.md) — Upskill report schema, STAR format

---

## 1. Skill Gap Analysis (`/upskill`)

### REQ-3001: Dual-Mode Invocation
**Priority:** Must
**Description:** The upskill workflow shall support two modes: aggregate (all tracked jobs) and targeted (single posting). It is delivered as the `/upskill` command (`.claude/commands/upskill.md`), which activates the dedicated `career-development` Plane-1 skill (ARCH-0008, ARCH-0040) — mirroring how `/search` activates `job-scraper`. The skill also activates on the trigger keyword "upskill" directly. (Superseded note: earlier drafts modelled upskill as a non-command keyword inside `job-application-assistant`; the command form was chosen for consistency with `/search` and because the dashboard console invokes `/upskill` as a slash command.)
**Acceptance Criteria:**
- `upskill` with no argument → aggregate mode (analyzes all jobs in tracker)
- `upskill <URL>` → targeted mode (analyzes single fetched posting); if URL cannot be fetched, user may paste the posting text (DEC-011)
- Report filename reflects mode (aggregate: date-based; targeted: date + company + role slug)

### REQ-3002: Data Loading — Aggregate Mode
**Priority:** Must
**Description:** In aggregate mode, the system shall load the application tracker and candidate profile.
**Acceptance Criteria:**
- Reads application tracker CSV; extracts role, company, fit_rating for each row
- Reads candidate profile for current skills
- Checks for previous aggregate reports to enable delta comparison
- Fit rating (0–100) is used to weight gaps: lower-fit jobs contribute more to gap score

### REQ-3003: Data Loading — Targeted Mode
**Priority:** Must
**Description:** In targeted mode, the system shall fetch the posting and load the candidate profile.
**Acceptance Criteria:**
- Fetches job posting from URL
- Extracts: title, company, required skills, preferred skills, responsibilities, domain context
- Reads candidate profile; does NOT use tracker data

### REQ-3004: Pass 1 — Hard Skill Diff
**Priority:** Must
**Description:** The system shall extract required and preferred technical skills from job sources and diff against the user's profile.
**Acceptance Criteria:**
- Aggregate: builds skill frequency map with fit-weight scoring `sum((100 - fit_rating) / 100 × occurrence)`
- Targeted: lists required before preferred, equal weight, alphabetical within groups
- Skills already in the profile (any form) are removed from the gap list
- Generous matching: "Python" covers "Python scripting"

### REQ-3005: Pass 2 — LLM Synthesis
**Priority:** Must
**Description:** The system shall reason holistically about gaps that mechanical diffing would miss.
**Acceptance Criteria:**
- Considers: domain knowledge gaps, soft skill gaps, tooling/process gaps, credential/certification gaps
- Each synthesized gap tagged as `[domain]`, `[soft]`, `[tooling]`, or `[credential]`
- No duplication with Pass 1 results
- Credential gaps flagged if multiple postings list them as preferred

### REQ-3006: Gap Heatmap
**Priority:** Must
**Description:** Combined Pass 1 + Pass 2 results shall be presented as a prioritized heatmap table.
**Acceptance Criteria:**
- Priority levels: Critical, High, Medium, Low
- Table columns: Priority, Skill/Area, Type, Gap Source
- Aggregate: priority based on frequency and fit-weight scores
- Targeted: priority based on required (Critical/High) vs. preferred (Medium) vs. inferred (Medium/Low)
- Heatmap printed to terminal as intermediate output before learning plan

### REQ-3007: Learning Plan Generation
**Priority:** Must
**Description:** For every Critical and High gap (and Medium if <5 total), the system shall produce a learning entry with web-searched resources.
**Acceptance Criteria:**
- Each entry: 2–3 resources (name, URL, one-line reason), study direction tailored to user's background, time estimate
- Resources found via actual web search (never fabricated); searches include current year
- Resource preferences: hands-on courses > lecture-only; official docs for tooling; books for domain knowledge
- Study direction addresses what to skip and where to start given existing knowledge
- Entries grouped by theme (e.g., Cloud & Infrastructure, MLOps, Domain Knowledge)

### REQ-3008: Study Order
**Priority:** Should
**Description:** The system shall suggest a numbered study order with dependency-aware sequencing.
**Acceptance Criteria:**
- Rules: dependencies first → Critical before High before Medium → quick wins early → domain knowledge last
- Table columns: #, Topic, Type, Estimated Time, Note (dependencies)
- Total estimated time shown at bottom

### REQ-3009: Report Persistence
**Priority:** Must
**Description:** The complete report shall be saved as a markdown file.
**Acceptance Criteria:**
- Aggregate: `upskill/report-YYYY-MM-DD.md`
- Targeted: `upskill/report-YYYY-MM-DD-<company-slug>-<role-slug>.md`
- Report includes: since-last-report diff (aggregate only), heatmap, learning plan, study order
- Always saved, even if user seems satisfied with terminal output

### REQ-3010: Delta Reporting
**Priority:** Should
**Description:** In aggregate mode, if a previous report exists, the system shall show gaps closed and new gaps since the last report.
**Acceptance Criteria:**
- Gaps closed: skills from previous heatmap now present in profile
- New gaps: skills in current heatmap not in previous report
- Section omitted if no previous report exists or in targeted mode

### REQ-3011: Low-Priority Gap Handling
**Priority:** Should
**Description:** Low-priority gaps shall appear in the heatmap but NOT receive learning plan entries unless the user requests it.
**Acceptance Criteria:**
- Low gaps listed in heatmap for completeness
- No study resources generated for Low gaps by default

---

## 2. Interview Preparation

### REQ-3050: STAR Example Framework
**Priority:** Must
**Description:** The system shall maintain a library of ready-made STAR examples drawn from the user's actual experience.
**Acceptance Criteria:**
- Each example: title, skill demonstrated, Situation, Task, Action, Result, applicable question types
- Minimum 3–4 examples covering different competencies (target 4–6)
- Populated during onboarding from actual experience, not fabricated
- Examples should be 1–2 minutes when spoken aloud

### REQ-3051: Tough Question Preparation
**Priority:** Must
**Description:** The system shall provide frameworks for common tough interview questions.
**Acceptance Criteria:**
- Covers at minimum: "Why did you leave?", "You don't have X", "Where in 5 years?", "Biggest weakness?", "Why this company?"
- "Why this company" must be customized per company — never generic
- User can prepare their own answers for each

### REQ-3052: Questions to Ask Interviewers
**Priority:** Should
**Description:** The system shall provide suggested questions for the user to ask interviewers, organized by category.
**Acceptance Criteria:**
- Categories: About the Role, About the Team, About Tech & Growth, About Culture
- 3–5 questions per category
- Culture questions specifically designed to prevent post-hire disappointment

### REQ-3053: Interview Roleplay
**Priority:** Should
**Description:** The system shall support interactive interview practice sessions.
**Acceptance Criteria:**
- User specifies role/company to simulate
- Progression: warm-up questions → role-specific technical → behavioral → curveball
- After each answer: brief feedback on what worked and what to sharpen
- Suggests which STAR example would work best for each question

### REQ-3054: Follow-Up Etiquette Guidance
**Priority:** Could
**Description:** The system shall provide guidance on post-application and post-interview follow-up.
**Acceptance Criteria:**
- Don't call to "stand out" — risks negative impression
- Respect employer timelines
- Brief follow-up acceptable after 2+ weeks with no timeline
- Thank-you notes: brief (2–3 sentences), appreciative
