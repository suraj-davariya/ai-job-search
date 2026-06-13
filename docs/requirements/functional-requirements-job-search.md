# Functional Requirements — Job Search

> **Purpose:** Specifies the requirements for CareerForge's multi-portal job search engine, deduplication, and fit-based ranking.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## Overview

The job search engine queries multiple job portals using the user's configured search queries, deduplicates results against previously seen jobs and the application tracker, performs a quick fit assessment, and presents matches sorted by relevance.

Related documents:
- [Functional Requirements — Application](functional-requirements-application.md) — What happens when the user picks a match
- [Business Rules](business-rules-and-validation.md) — Fit scoring details
- [Data Requirements](data-requirements.md) — Seen jobs registry, tracker schema

---

### REQ-1001: Search Invocation
**Priority:** Must
**Description:** The user shall invoke the job search via a skill invocation of the `job-scraper` skill (Plane 1, ARCH-0008) that supports optional focus area and breadth arguments. The search core is country-agnostic — it queries whatever portals the user has configured, not a hardcoded list (see DEC-012, ADR-0004).
**Acceptance Criteria:**
- Default invocation runs top 3 priority query categories from the user's `search-queries.md` config
- Optional focus argument (e.g., "data science") prioritizes matching category queries
- "broad" argument runs all query categories
- System loads state (seen jobs, tracker, search queries) before searching
- No country-specific or portal-specific identifiers are hardcoded in the search core

### REQ-1002: State Loading
**Priority:** Must
**Description:** Before searching, the system shall load the seen jobs registry and application tracker to enable deduplication.
**Acceptance Criteria:**
- Reads seen_jobs.json (creates with empty `{"seen": {}}` if missing)
- Reads application tracker CSV to extract already-applied company+role pairs
- Reads search queries configuration for the query strategy

### REQ-1003: Multi-Portal Search
**Priority:** Must
**Description:** The system shall execute web search queries across configured job portals according to the user's search query configuration. Portals are user-configured — no portal is assumed or hardcoded in the core (DEC-012, NFR-0007).
**Acceptance Criteria:**
- Queries target portals defined in the user's `search-queries.md` (e.g., `site:indeed.com`, `site:linkedin.com/jobs` or any other portal the user configures)
- Geographic area from the user's configuration is applied
- Searches for postings from the last 14 days
- Multiple searches can run in parallel for efficiency
- The core search component contains no hardcoded `site:` references — all portal targeting comes from the user's config

### REQ-1004: Result Fetching and Parsing
**Priority:** Must
**Description:** For each promising search result, the system shall fetch the job posting page and extract structured data. When a URL cannot be fetched (gated portal, authentication wall), the user may paste the posting text directly — paste is a first-class input per DEC-011, not a fallback.
**Acceptance Criteria:**
- Extracted fields: job title, company, location, posting date (or "recent"), URL, key requirements (brief), application deadline (if listed)
- Skips URLs already in seen_jobs.json
- Skips company+role combos already in application tracker
- Uses titles and search snippets to pre-filter before fetching (token efficiency)
- If a URL fetch fails, the system prompts: "I couldn't fetch that posting. Paste it here and I'll use that." — no error, no abort
- Pasted postings are processed identically to fetched ones

### REQ-1005: Quick Fit Assessment
**Priority:** Must
**Description:** Each new job shall receive a rapid three-level fit classification against the user's profile.
**Acceptance Criteria:**
- **High match:** Role directly involves core skills
- **Medium match:** Role is adjacent to experience
- **Low match:** Role requires significant skills the user lacks
- This is NOT the full 5-dimension evaluation — it is a lightweight signal for sorting

### REQ-1006: Deduplication and State Update
**Priority:** Must
**Description:** All fetched jobs shall be added to the seen jobs registry to prevent re-presentation in future searches.
**Acceptance Criteria:**
- Each job stored with: title, company, URL, first_seen date, fit level, status (new/skipped/evaluated)
- Both new and skipped jobs are recorded
- Only jobs NOT already in the registry or tracker are presented to the user

### REQ-1007: Results Presentation
**Priority:** Must
**Description:** New jobs shall be presented in a table sorted by fit level (high first), with detailed highlights for high-match jobs.
**Acceptance Criteria:**
- Summary header: "Found X new positions (Y high, Z medium, W low match)"
- Table columns: #, Fit, Title, Company, Location, Deadline, URL
- For each high-match job: 2–3 bullet points explaining why it matches, key requirements to check, any red flags
- After presenting, system asks: "Want me to evaluate any of these in detail? Just give me the number(s)."

### REQ-1008: Detailed Evaluation Handoff
**Priority:** Must
**Description:** When the user selects a result number, the system shall invoke the full application pipeline (fit evaluation, then CV + cover letter if approved).
**Acceptance Criteria:**
- Passes the selected job's URL or posting content to the application workflow
- Full 5-dimension evaluation (not just quick fit) is performed
- User approval required before drafting begins

### REQ-1009: Tracker Update
**Priority:** Should
**Description:** When the user decides to apply to a job, a row shall be added to the application tracker.
**Acceptance Criteria:**
- Tracker columns: date, company, sector, role, role_type, channel, status, contact_person, fit_rating, notes, cv_file, cover_letter_file, source, last_updated
- Row is added after the user confirms intent to apply
- `last_updated` is set to the current ISO-8601 date whenever any tracker field is changed (including status transitions from the dashboard)

### REQ-1010: Geographic Filtering
**Priority:** Must
**Description:** Results outside the user's configured commute range shall be filtered out.
**Acceptance Criteria:**
- Respects location filter tiers defined during onboarding: ideal, acceptable, borderline, too far
- Jobs in "too far" zones are skipped
- Jobs in "borderline" zones may be flagged but not automatically skipped

### REQ-1011: Date Filtering
**Priority:** Must
**Description:** Only jobs posted within the last 14 days or with unexpired deadlines shall be included.
**Acceptance Criteria:**
- Jobs with expired deadlines are skipped
- Jobs with no determinable date are included but flagged as "date unknown"
- Closed postings are skipped

### REQ-1012: No Fabrication Rule
**Priority:** Must
**Description:** The system shall only present jobs found via actual web search results; it shall never fabricate job postings.
**Acceptance Criteria:**
- Every presented job links to a real URL
- If search returns no results, system reports this honestly
